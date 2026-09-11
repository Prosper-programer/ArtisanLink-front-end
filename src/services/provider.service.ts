import { API_BASE_URL } from '@/constants/api';

export interface BecomeProviderPayload {
  profession: string;
  specializations: string[];
  description: string;
  experienceYears: number;
  location?: string;
  coverImage?: string;
}

export interface UpdateProviderPayload {
  profession?: string;
  specializations?: string[];
  description?: string;
  experienceYears?: number;
  location?: string;
  coverImage?: string;
}

export interface ProviderProfileResponse {
  profession: string;
  specializations: string[];
  description: string;
  experienceYears: number;
  location?: string;
  coverImage?: string;
  isProvider: boolean;
  isVerified: boolean;
  verificationStatus: 'none' | 'pending' | 'approved' | 'rejected';
  verificationReason?: string;
  rating?: number;
  reviewCount?: number;
}

export interface ProfessionTaxonomyItem {
  profession: string;
  specializations: string[];
}

export const ProviderService = {
  /**
   * Apply to become a service provider.
   * POST /api/providers/become
   */
  async becomeProvider(
    token: string,
    payload: BecomeProviderPayload
  ): Promise<{ success: boolean; message: string; providerProfile?: ProviderProfileResponse }> {
    try {
      const response = await fetch(`${API_BASE_URL}/providers/become`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          profession: payload.profession.trim(),
          specializations: payload.specializations,
          description: payload.description.trim(),
          experienceYears: Number(payload.experienceYears),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || 'Failed to submit provider application.',
        };
      }

      return {
        success: true,
        message: data.message || 'Provider profile created successfully.',
        providerProfile: data.providerProfile,
      };
    } catch (error: any) {
      console.error('ProviderService.becomeProvider error:', error);
      return {
        success: false,
        message: error.message || 'Unable to connect to server. Please check your connection.',
      };
    }
  },

  /**
   * Get current provider's profile.
   * GET /api/providers/me
   */
  async getProviderProfile(
    token: string
  ): Promise<{ success: boolean; provider?: any; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/providers/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || 'Failed to fetch provider profile.',
        };
      }

      return {
        success: true,
        provider: data.provider,
      };
    } catch (error: any) {
      console.error('ProviderService.getProviderProfile error:', error);
      return {
        success: false,
        message: error.message || 'Unable to fetch provider profile.',
      };
    }
  },

  /**
   * Update current provider's profile.
   * PUT /api/providers/me
   */
  async updateProviderProfile(
    token: string,
    payload: UpdateProviderPayload
  ): Promise<{ success: boolean; message: string; providerProfile?: ProviderProfileResponse }> {
    try {
      const response = await fetch(`${API_BASE_URL}/providers/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || 'Failed to update provider profile.',
        };
      }

      return {
        success: true,
        message: data.message || 'Provider profile updated successfully.',
        providerProfile: data.providerProfile,
      };
    } catch (error: any) {
      console.error('ProviderService.updateProviderProfile error:', error);
      return {
        success: false,
        message: error.message || 'Unable to connect to server.',
      };
    }
  },

  /**
   * Fetch service providers from backend.
   * GET /api/providers
   */
  async getProviders(params?: {
    profession?: string;
    search?: string;
  }): Promise<{ success: boolean; data: any[]; message?: string }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.profession && params.profession !== 'all') {
        queryParams.append('profession', params.profession);
      }
      if (params?.search && params.search.trim()) {
        queryParams.append('search', params.search.trim());
      }

      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/providers${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          data: [],
          message: data.message || 'Failed to fetch providers',
        };
      }

      return {
        success: true,
        data: data.data || [],
      };
    } catch (error: any) {
      console.error('ProviderService.getProviders error:', error);
      return {
        success: false,
        data: [],
        message: error.message || 'Network error fetching providers',
      };
    }
  },

  /**
   * Fetch single service provider by ID from backend.
   * GET /api/providers/:id
   */
  async getProviderById(
    id: string
  ): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/providers/${id}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || 'Failed to fetch provider details',
        };
      }

      return {
        success: true,
        data: data.data,
      };
    } catch (error: any) {
      console.error('ProviderService.getProviderById error:', error);
      return {
        success: false,
        message: error.message || 'Network error fetching provider details',
      };
    }
  },

  /**
   * Fetch available professions and their allowed specializations.
   * GET /api/professions
   */
  async getProfessions(): Promise<{ success: boolean; data: ProfessionTaxonomyItem[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/professions`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          data: [],
        };
      }

      return {
        success: true,
        data: data.data || [],
      };
    } catch (error) {
      console.error('ProviderService.getProfessions error:', error);
      // Fallback to static list matching backend config
      return {
        success: true,
        data: [
          {
            profession: 'Plumber',
            specializations: ['Pipe Installation', 'Pipe Repair', 'Drainage Repair', 'Leak Detection'],
          },
          {
            profession: 'Electrician',
            specializations: ['House Wiring', 'Electrical Installation', 'Electrical Repair', 'Lighting Installation'],
          },
          {
            profession: 'Carpenter',
            specializations: ['Furniture Making', 'Door Installation', 'Cabinet Making', 'Furniture Repair'],
          },
          {
            profession: 'Painter',
            specializations: ['Interior Painting', 'Exterior Painting', 'Wall Finishing'],
          },
        ],
      };
    }
  },
};

/**
 * Maps a backend User document with providerProfile to the frontend Professional interface
 */
export function mapBackendProviderToProfessional(backendUser: any): any {
  const profile = backendUser.providerProfile || {};
  const profession = profile.profession || 'Artisan';
  const specializations: string[] = Array.isArray(profile.specializations)
    ? profile.specializations
    : [];

  const firstSpec = specializations.length > 0 ? specializations.join(', ') : 'Professional Services';
  const category = profession.toLowerCase();

  return {
    id: backendUser._id || backendUser.id,
    name: backendUser.fullName || 'Artisan',
    verified: profile.isVerified || profile.verificationStatus === 'approved',
    profession: profession,
    specialization: firstSpec,
    category: category,
    avatar:
      backendUser.avatar ||
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    coverImage: profile.coverImage || '',
    rating: profile.rating && profile.rating > 0 ? Number(profile.rating.toFixed(1)) : 4.8,
    reviewCount: profile.reviewCount !== undefined ? profile.reviewCount : 12,
    distance: 'Nearby',
    hourlyRate: 50,
    experienceYears: profile.experienceYears || 5,
    completedJobs: 24,
    availability: 'Available Today',
    phone: backendUser.phoneNumber || '',
    location: profile.location || 'Local Area',
    about: profile.description || `${profession} specialist with experience in quality craft and timely service.`,
    skills: specializations.length > 0 ? specializations : [profession],
    portfolio: [],
    services: specializations.map((spec: string, idx: number) => ({
      id: `srv-${idx + 1}`,
      name: spec,
      description: `Expert ${spec.toLowerCase()} service tailored to your requirements.`,
      price: 50 + idx * 15,
      duration: '1-2 hours',
    })),
    reviews: [],
  };
}

