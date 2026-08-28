import React, { createContext, useContext, useState, ReactNode } from 'react';
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

export type AppPhase = 'SPLASH' | 'LANGUAGE' | 'ONBOARDING' | 'APP';
export type AppLanguage = 'en' | 'fr';
export type AuthStatus = 'guest' | 'authenticated';
export type UserRole = 'customer' | 'provider';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  isProvider: boolean;
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
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;

  // Authentication & Unified Profile
  authStatus: AuthStatus;
  user: UserProfile;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  toggleActiveRole: () => void;
  login: () => void;
  logout: () => void;
  activateProvider: (proData?: Partial<Professional>) => void;

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
  openAuthModal: (afterAuthCallback?: () => void) => void;
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
  }) => ServiceRequest;
  advanceRequestStatus: (id: string) => void;
  cancelServiceRequest: (id: string) => void;

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
  const [language, setLanguage] = useState<AppLanguage>('en');

  // 2. Auth & Unified User Profile (User can be both Customer + Provider)
  const [authStatus, setAuthStatus] = useState<AuthStatus>('guest');
  const [user, setUser] = useState<UserProfile>({
    name: 'Jean Dupont',
    email: 'jean.dupont@artisanlink.com',
    phone: '+1 (555) 234-8901',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    isProvider: false,
  });
  const [activeRole, setActiveRole] = useState<UserRole>('customer');

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

  const login = () => {
    setAuthStatus('authenticated');
    setAuthModalVisible(false);
    if (pendingCallback) {
      const cb = pendingCallback;
      setPendingCallback(null);
      cb();
    }
  };

  const logout = () => {
    setAuthStatus('guest');
    setActiveRole('customer');
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

  const openAuthModal = (afterAuthCallback?: () => void) => {
    if (afterAuthCallback) {
      setPendingCallback(() => afterAuthCallback);
    }
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

  const submitServiceRequest = (data: {
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
  }): ServiceRequest => {
    const newReq: ServiceRequest = {
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

    setServiceRequests((prev) => [newReq, ...prev]);
    setPendingRequestDraft(null);
    return newReq;
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
        language,
        setLanguage,
        authStatus,
        user,
        activeRole,
        setActiveRole,
        toggleActiveRole,
        login,
        logout,
        activateProvider,
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
