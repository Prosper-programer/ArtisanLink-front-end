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
