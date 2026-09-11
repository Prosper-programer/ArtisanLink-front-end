import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  POPULAR_SERVICES,
  PROFESSIONALS,
  INITIAL_REQUESTS,
  INITIAL_CHATS,
  ServiceCategory,
  Professional,
  ServiceRequest,
  ChatThread,
  MessageItem,
} from '@/data/mockData';
import { AuthService, LoginPayload, RegisterPayload, BackendUser } from '@/services/auth.service';
import { ProviderService, BecomeProviderPayload, UpdateProviderPayload, ProviderProfileResponse } from '@/services/provider.service';
import { RequestService, mapBackendRequestToFrontend } from '@/services/request.service';
import { Storage, AUTH_TOKEN_KEY } from '@/services/storage';

export type AppPhase = 'SPLASH' | 'LANGUAGE' | 'ONBOARDING' | 'APP';
export type AppLanguage = 'en' | 'fr';
export type AuthStatus = 'guest' | 'authenticated';
export type UserRole = 'customer' | 'provider';

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  isProvider: boolean;
  role?: string;
  providerProfile?: ProviderProfileResponse;
}

export interface PendingRequestDraft {
  serviceId?: string;
  serviceName?: string;
  problemDescription?: string;
  photos?: string[];
  location?: string;
  date?: string;
  time?: string;
  isFlexible?: boolean;
  professionalId?: string;
}

interface AppContextType {
  // App Phase Flow
  appPhase: AppPhase;
  setAppPhase: (phase: AppPhase) => void;
  isAppReady: boolean;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;

  // Authentication & Unified Profile
  authStatus: AuthStatus;
  token: string | null;
  user: UserProfile;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  toggleActiveRole: () => void;
  login: (credentials?: LoginPayload) => Promise<{ success: boolean; message: string }>;
  register: (data: RegisterPayload) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  updatePersonalProfile: (payload: { fullName?: string; phoneNumber?: string; avatar?: string }) => Promise<{ success: boolean; message: string }>;
  activateProvider: (proData?: Partial<Professional>) => void;
  becomeProvider: (data: BecomeProviderPayload) => Promise<{ success: boolean; message: string }>;
  updateProvider: (data: UpdateProviderPayload) => Promise<{ success: boolean; message: string }>;

  // Pending Request State Preservation across Auth
  pendingRequestDraft: PendingRequestDraft | null;
  setPendingRequestDraft: (draft: PendingRequestDraft | null) => void;

  // Service Catalog
  services: ServiceCategory[];
  selectedService: ServiceCategory | null;
  serviceDetailsVisible: boolean;
  openServiceDetails: (service: ServiceCategory) => void;
  closeServiceDetails: () => void;

  // Professionals
  professionals: Professional[];
  selectedProfessional: Professional | null;
  professionalProfileVisible: boolean;
  openProfessionalProfile: (pro: Professional) => void;
  closeProfessionalProfile: () => void;

  // 6-Step Service Request Flow
  createRequestVisible: boolean;
  preselectedService?: ServiceCategory;
  preselectedPro?: Professional;
  openCreateRequest: (service?: ServiceCategory, pro?: Professional) => void;
  closeCreateRequest: () => void;

  // Auth Prompt Modal
  authModalVisible: boolean;
  authInitialMode: 'signin' | 'signup';
  openAuthModal: (afterAuthCallback?: () => void, initialMode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;

  // Request Submitted Success
  requestSubmittedVisible: boolean;
  submittedRequest: ServiceRequest | null;
  openRequestSubmitted: (req: ServiceRequest) => void;
  closeRequestSubmitted: () => void;

  // Service Requests & Details
  serviceRequests: ServiceRequest[];
  selectedRequest: ServiceRequest | null;
  requestDetailsVisible: boolean;
  openRequestDetails: (req: ServiceRequest) => void;
  closeRequestDetails: () => void;
  submitServiceRequest: (data: {
    serviceCategory: string;
    serviceName: string;
    problemDescription: string;
    photos: string[];
    location: string;
    date: string;
    time: string;
    isFlexible: boolean;
    professional: Professional;
    estimatedCost: number;
  }) => Promise<ServiceRequest>;
  advanceRequestStatus: (id: string) => void;
  cancelServiceRequest: (id: string) => void;
  fetchCustomerRequests: (authToken?: string) => Promise<void>;

  // Provider Activation Modal
  providerActivationVisible: boolean;
  openProviderActivation: () => void;
  closeProviderActivation: () => void;

  // Messaging / Chats
  chats: ChatThread[];
  activeChatId: string | null;
  chatModalVisible: boolean;
  openChat: (chatId: string) => void;
  closeChat: () => void;
  sendMessage: (chatId: string, text: string, attachment?: string) => void;
  startChatWithPro: (pro: Professional) => void;

  // Search & Global Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (cat: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Initial Flow: SPLASH -> LANGUAGE -> ONBOARDING -> APP
  const [appPhase, setAppPhase] = useState<AppPhase>('SPLASH');
  const [isAppReady, setIsAppReady] = useState<boolean>(false);
  const [language, setLanguage] = useState<AppLanguage>('en');

  // 2. Auth & Unified User Profile (User can be both Customer + Provider)
  const [authStatus, setAuthStatus] = useState<AuthStatus>('guest');
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile>({
    name: 'Guest User',
    email: '',
    phone: '',
    avatar: '',
    isProvider: false,
  });
  const [activeRole, setActiveRole] = useState<UserRole>('customer');

  // Restore authenticated session and preload core assets on app mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Preload essential vector icons font to prevent icon flicker/layout shifts
        const { Ionicons } = await import('@expo/vector-icons');
        const Font = await import('expo-font');
        await Font.loadAsync(Ionicons.font).catch(() => {});

        const savedToken = await Storage.getItem(AUTH_TOKEN_KEY);
        if (savedToken) {
          const res = await AuthService.getMe(savedToken);
          if (res.success && res.user) {
            setToken(savedToken);
            setAuthStatus('authenticated');
            setUser({
              id: res.user.id || res.user._id,
              name: res.user.fullName,
              email: res.user.email,
              phone: res.user.phoneNumber,
              avatar: res.user.avatar || '',
              isProvider: res.user.providerProfile?.isProvider || false,
              role: res.user.role,
              providerProfile: res.user.providerProfile as any,
            });
            fetchCustomerRequests(savedToken);
          } else {
            await Storage.removeItem(AUTH_TOKEN_KEY);
          }
        }
      } catch (e) {
        console.warn('App initialization warning:', e);
      } finally {
        setIsAppReady(true);
      }
    };
    initializeApp();
  }, []);

  // 3. Pending request form preservation across Auth
  const [pendingRequestDraft, setPendingRequestDraft] = useState<PendingRequestDraft | null>(null);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);

  // 4. Services & Professionals
  const [services] = useState<ServiceCategory[]>(POPULAR_SERVICES);
  const [professionals, setProfessionals] = useState<Professional[]>(PROFESSIONALS);
  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null);
  const [serviceDetailsVisible, setServiceDetailsVisible] = useState<boolean>(false);

  // 5. Professional Profile Modal
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [professionalProfileVisible, setProfessionalProfileVisible] = useState<boolean>(false);

  // 6. 6-Step Create Request Flow
  const [createRequestVisible, setCreateRequestVisible] = useState<boolean>(false);
  const [preselectedService, setPreselectedService] = useState<ServiceCategory | undefined>(undefined);
  const [preselectedPro, setPreselectedPro] = useState<Professional | undefined>(undefined);

  // 7. Auth Modal
  const [authModalVisible, setAuthModalVisible] = useState<boolean>(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signin');

  // 8. Request Submitted Success Modal
  const [requestSubmittedVisible, setRequestSubmittedVisible] = useState<boolean>(false);
  const [submittedRequest, setSubmittedRequest] = useState<ServiceRequest | null>(null);

  // 9. Service Requests & Tracking
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(INITIAL_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [requestDetailsVisible, setRequestDetailsVisible] = useState<boolean>(false);

  // 10. Provider Activation Wizard
  const [providerActivationVisible, setProviderActivationVisible] = useState<boolean>(false);

  // 11. Chats & Messaging
  const [chats, setChats] = useState<ChatThread[]>(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatModalVisible, setChatModalVisible] = useState<boolean>(false);

  // 12. Search & Category Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Role switching
  const toggleActiveRole = () => {
    setActiveRole((prev) => (prev === 'customer' ? 'provider' : 'customer'));
  };

  const login = async (credentials?: LoginPayload): Promise<{ success: boolean; message: string }> => {
    if (!credentials) {
      // Mock fallback
      setAuthStatus('authenticated');
      setAuthModalVisible(false);
      if (pendingCallback) {
        const cb = pendingCallback;
        setPendingCallback(null);
        cb();
      }
      return { success: true, message: 'Logged in' };
    }

    const res = await AuthService.login(credentials);
    if (res.success && res.token && res.user) {
      await Storage.setItem(AUTH_TOKEN_KEY, res.token);
      setToken(res.token);
      setAuthStatus('authenticated');
      setUser({
        id: res.user.id || res.user._id,
        name: res.user.fullName,
        email: res.user.email,
        phone: res.user.phoneNumber,
        avatar: res.user.avatar || '',
        isProvider: res.user.providerProfile?.isProvider || false,
        role: res.user.role,
        providerProfile: res.user.providerProfile as any,
      });
      setAuthModalVisible(false);
      fetchCustomerRequests(res.token);
      if (pendingCallback) {
        const cb = pendingCallback;
        setPendingCallback(null);
        cb();
      }
      return { success: true, message: res.message };
    }

    return { success: false, message: res.message };
  };

  const register = async (data: RegisterPayload): Promise<{ success: boolean; message: string }> => {
    const res = await AuthService.register(data);
    if (res.success) {
      // Auto-login after successful registration
      return await login({ email: data.email, password: data.password });
    }
    return { success: false, message: res.message };
  };

  const logout = async () => {
    await Storage.removeItem(AUTH_TOKEN_KEY);
    setToken(null);
    setAuthStatus('guest');
    setActiveRole('customer');
    setUser({
      name: 'Guest User',
      email: '',
      phone: '',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
      isProvider: false,
    });
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const updatePersonalProfile = async (payload: {
    fullName?: string;
    phoneNumber?: string;
    avatar?: string;
  }): Promise<{ success: boolean; message: string }> => {
    // Optimistic local update
    setUser((prev) => ({
      ...prev,
      ...(payload.fullName ? { name: payload.fullName } : {}),
      ...(payload.phoneNumber ? { phone: payload.phoneNumber } : {}),
      ...(payload.avatar !== undefined ? { avatar: payload.avatar } : {}),
    }));

    if (!token) {
      return { success: true, message: 'Profile updated locally.' };
    }

    const res = await AuthService.updateProfile(token, payload);
    if (res.success && res.user) {
      setUser((prev) => ({
        ...prev,
        name: res.user!.fullName,
        phone: res.user!.phoneNumber,
        avatar: res.user!.avatar || prev.avatar,
      }));
      return { success: true, message: res.message };
    }

    return { success: false, message: res.message };
  };

  const becomeProvider = async (data: BecomeProviderPayload): Promise<{ success: boolean; message: string }> => {
    if (!token) {
      return { success: false, message: 'You must be logged in to become a provider.' };
    }

    const res = await ProviderService.becomeProvider(token, data);
    if (res.success && res.providerProfile) {
      setUser((prev) => ({
        ...prev,
        isProvider: true,
        providerProfile: res.providerProfile,
      }));
      return { success: true, message: res.message };
    }

    return { success: false, message: res.message };
  };

  const updateProvider = async (data: UpdateProviderPayload): Promise<{ success: boolean; message: string }> => {
    if (!token) {
      // Mock fallback if offline or unauthenticated testing
      setUser((prev) => ({
        ...prev,
        providerProfile: prev.providerProfile
          ? {
              ...prev.providerProfile,
              ...data,
              profession: data.profession || prev.providerProfile.profession,
              specializations: data.specializations || prev.providerProfile.specializations,
              location: data.location !== undefined ? data.location : prev.providerProfile.location,
              description: data.description !== undefined ? data.description : prev.providerProfile.description,
              coverImage: data.coverImage !== undefined ? data.coverImage : prev.providerProfile.coverImage,
            }
          : undefined,
      }));
      return { success: true, message: 'Profile updated locally.' };
    }

    const res = await ProviderService.updateProviderProfile(token, data);
    if (res.success && res.providerProfile) {
      setUser((prev) => ({
        ...prev,
        providerProfile: res.providerProfile,
      }));
      return { success: true, message: res.message };
    }

    return { success: false, message: res.message };
  };

  const activateProvider = (proData?: Partial<Professional>) => {
    setUser((prev) => ({ ...prev, isProvider: true }));
    setActiveRole('provider');
    setProviderActivationVisible(false);
  };

  const openServiceDetails = (service: ServiceCategory) => {
    setSelectedService(service);
    setServiceDetailsVisible(true);
  };

  const closeServiceDetails = () => {
    setServiceDetailsVisible(false);
    setSelectedService(null);
  };

  const openProfessionalProfile = (pro: Professional) => {
    setSelectedProfessional(pro);
    setProfessionalProfileVisible(true);
  };

  const closeProfessionalProfile = () => {
    setProfessionalProfileVisible(false);
    setSelectedProfessional(null);
  };

  const openCreateRequest = (service?: ServiceCategory, pro?: Professional) => {
    setPreselectedService(service || (selectedService || POPULAR_SERVICES[0]));
    setPreselectedPro(pro || (selectedProfessional || PROFESSIONALS[0]));
    setCreateRequestVisible(true);
  };

  const closeCreateRequest = () => {
    setCreateRequestVisible(false);
    setPreselectedService(undefined);
    setPreselectedPro(undefined);
  };

  const openAuthModal = (afterAuthCallback?: () => void, initialMode: 'signin' | 'signup' = 'signin') => {
    if (afterAuthCallback) {
      setPendingCallback(() => afterAuthCallback);
    }
    setAuthInitialMode(initialMode);
    setAuthModalVisible(true);
  };

  const closeAuthModal = () => {
    setAuthModalVisible(false);
    setPendingCallback(null);
  };

  const openRequestSubmitted = (req: ServiceRequest) => {
    setSubmittedRequest(req);
    setRequestSubmittedVisible(true);
  };

  const closeRequestSubmitted = () => {
    setRequestSubmittedVisible(false);
    setSubmittedRequest(null);
  };

  const openRequestDetails = (req: ServiceRequest) => {
    setSelectedRequest(req);
    setRequestDetailsVisible(true);
  };

  const closeRequestDetails = () => {
    setRequestDetailsVisible(false);
    setSelectedRequest(null);
  };

  const fetchCustomerRequests = async (authToken?: string) => {
    const activeToken = authToken || token;
    if (!activeToken) return;
    try {
      const res = await RequestService.getMyRequests(activeToken);
      if (res.success && res.data && res.data.length > 0) {
        const mapped = res.data.map(mapBackendRequestToFrontend);
        setServiceRequests((prev) => {
          // Keep local optimistic requests that haven't been resolved yet
          const backendIds = new Set(mapped.map((m) => m.id));
          const localOnly = prev.filter((p) => p.id.startsWith('REQ-') && !backendIds.has(p.id));
          return [...mapped, ...localOnly];
        });
      }
    } catch (e) {
      console.warn('Failed to fetch requests from backend:', e);
    }
  };

  const submitServiceRequest = async (data: {
    serviceCategory: string;
    serviceName: string;
    problemDescription: string;
    photos: string[];
    location: string;
    date: string;
    time: string;
    isFlexible: boolean;
    professional: Professional;
    estimatedCost: number;
  }): Promise<ServiceRequest> => {
    // Generate an optimistic local request
    const localReq: ServiceRequest = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceCategory: data.serviceCategory,
      serviceName: data.serviceName,
      problemDescription: data.problemDescription,
      photos: data.photos,
      location: data.location,
      date: data.date,
      time: data.time,
      isFlexible: data.isFlexible,
      professionalId: data.professional.id,
      professionalName: data.professional.name,
      professionalAvatar: data.professional.avatar,
      professionalProfession: data.professional.profession,
      status: 'Sent',
      statusIndex: 0,
      createdAt: 'Just now',
      estimatedCost: data.estimatedCost,
    };

    if (!token) {
      setServiceRequests((prev) => [localReq, ...prev]);
      setPendingRequestDraft(null);
      return localReq;
    }

    try {
      const res = await RequestService.createRequest(token, {
        serviceCategory: data.serviceCategory,
        serviceName: data.serviceName,
        problemDescription: data.problemDescription,
        photos: data.photos,
        location: data.location,
        date: data.date,
        time: data.time,
        isFlexible: data.isFlexible,
        selectedProvider: data.professional.id,
        providerId: data.professional.id,
        estimatedCost: data.estimatedCost,
      });

      if (res.success && res.data) {
        const mapped = mapBackendRequestToFrontend(res.data);
        const finalReq: ServiceRequest = {
          ...mapped,
          date: data.date || mapped.date,
          time: data.time || mapped.time,
          estimatedCost: data.estimatedCost || mapped.estimatedCost,
          professionalName: data.professional.name || mapped.professionalName,
          professionalAvatar: data.professional.avatar || mapped.professionalAvatar,
          professionalProfession: data.professional.profession || mapped.professionalProfession,
        };

        setServiceRequests((prev) => [finalReq, ...prev.filter((r) => r.id !== finalReq.id)]);
        setPendingRequestDraft(null);
        return finalReq;
      }
    } catch (e) {
      console.warn('Backend request submission warning, using optimistic fallback:', e);
    }

    setServiceRequests((prev) => [localReq, ...prev]);
    setPendingRequestDraft(null);
    return localReq;
  };

  const advanceRequestStatus = (id: string) => {
    setServiceRequests((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextIndex = Math.min(r.statusIndex + 1, 3);
          const statuses: ServiceRequest['status'][] = ['Sent', 'Accepted', 'In Progress', 'Completed'];
          return {
            ...r,
            statusIndex: nextIndex,
            status: statuses[nextIndex],
          };
        }
        return r;
      })
    );
  };

  const cancelServiceRequest = (id: string) => {
    setServiceRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Cancelled' as const } : r))
    );
    if (token && !id.startsWith('REQ-')) {
      RequestService.cancelRequest(token, id).catch((e) =>
        console.warn('Backend cancel request error:', e)
      );
    }
  };

  const openProviderActivation = () => {
    setProviderActivationVisible(true);
  };

  const closeProviderActivation = () => {
    setProviderActivationVisible(false);
  };

  const openChat = (chatId: string) => {
    setActiveChatId(chatId);
    setChatModalVisible(true);
  };

  const closeChat = () => {
    setChatModalVisible(false);
    setActiveChatId(null);
  };

  const startChatWithPro = (pro: Professional) => {
    const existing = chats.find((c) => c.professionalId === pro.id);
    if (existing) {
      openChat(existing.id);
      return;
    }

    const newChatId = `chat-${Date.now()}`;
    const newChat: ChatThread = {
      id: newChatId,
      professionalId: pro.id,
      professionalName: pro.name,
      professionalAvatar: pro.avatar,
      professionalProfession: pro.profession,
      lastMessage: `Hello ${pro.name}, I would like to inquire about your services.`,
      lastMessageTime: 'Just now',
      unreadCount: 0,
      online: true,
      messages: [
        {
          id: `m-${Date.now()}`,
          senderId: 'user',
          senderName: 'You',
          text: `Hello ${pro.name}, I would like to inquire about your services.`,
          timestamp: 'Just now',
          isMe: true,
        },
      ],
    };

    setChats((prev) => [newChat, ...prev]);
    openChat(newChatId);
  };

  const sendMessage = (chatId: string, text: string, attachment?: string) => {
    const newMsg: MessageItem = {
      id: `m-${Date.now()}`,
      senderId: 'user',
      senderName: 'You',
      text,
      timestamp: 'Just now',
      isMe: true,
      attachment,
    };

    setChats((prev) =>
      prev.map((c) => {
        if (c.id === chatId) {
          return {
            ...c,
            lastMessage: text || 'Photo attached',
            lastMessageTime: 'Just now',
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    // Automated pro reply
    setTimeout(() => {
      const autoReplyText = "Thank you for reaching out! I've received your message and will review it promptly.";
      const replyMsg: MessageItem = {
        id: `m-${Date.now() + 1}`,
        senderId: 'pro',
        senderName: 'Pro',
        text: autoReplyText,
        timestamp: 'Just now',
        isMe: false,
      };

      setChats((prev) =>
        prev.map((c) => {
          if (c.id === chatId) {
            return {
              ...c,
              lastMessage: autoReplyText,
              lastMessageTime: 'Just now',
              messages: [...c.messages, replyMsg],
            };
          }
          return c;
        })
      );
    }, 1200);
  };

  return (
    <AppContext.Provider
      value={{
        appPhase,
        setAppPhase,
        isAppReady,
        language,
        setLanguage,
        authStatus,
        token,
        user,
        activeRole,
        setActiveRole,
        toggleActiveRole,
        login,
        register,
        logout,
        updateUserProfile,
        updatePersonalProfile,
        activateProvider,
        becomeProvider,
        updateProvider,
        pendingRequestDraft,
        setPendingRequestDraft,
        services,
        selectedService,
        serviceDetailsVisible,
        openServiceDetails,
        closeServiceDetails,
        professionals,
        selectedProfessional,
        professionalProfileVisible,
        openProfessionalProfile,
        closeProfessionalProfile,
        createRequestVisible,
        preselectedService,
        preselectedPro,
        openCreateRequest,
        closeCreateRequest,
        authModalVisible,
        authInitialMode,
        openAuthModal,
        closeAuthModal,
        requestSubmittedVisible,
        submittedRequest,
        openRequestSubmitted,
        closeRequestSubmitted,
        serviceRequests,
        selectedRequest,
        requestDetailsVisible,
        openRequestDetails,
        closeRequestDetails,
        submitServiceRequest,
        advanceRequestStatus,
        cancelServiceRequest,
        fetchCustomerRequests,
        providerActivationVisible,
        openProviderActivation,
        closeProviderActivation,
        chats,
        activeChatId,
        chatModalVisible,
        openChat,
        closeChat,
        sendMessage,
        startChatWithPro,
        searchQuery,
        setSearchQuery,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
