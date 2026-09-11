import { API_BASE_URL } from '@/constants/api';

export interface BackendUser {
  id: string;
  _id?: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  avatar?: string;
  role: 'customer' | 'provider' | 'administrator';
  isPhoneVerified?: boolean;
  providerProfile?: {
    profession?: string;
    specializations?: string[];
    description?: string;
    experienceYears?: number;
    isProvider?: boolean;
    isVerified?: boolean;
    verificationStatus?: string;
    rating?: number;
    reviewCount?: number;
  };
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: BackendUser;
}

export interface RegisterPayload {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const AuthService = {
  /**
   * Log in user with email and password
   */
  async login(payload: LoginPayload): Promise<{ success: boolean; token?: string; user?: BackendUser; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: payload.email.trim(),
          password: payload.password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || 'Login failed. Please check your credentials.',
        };
      }

      return {
        success: true,
        token: data.token,
        user: data.user,
        message: data.message || 'Login successful',
      };
    } catch (error: any) {
      console.error('AuthService.login error:', error);
      return {
        success: false,
        message: error.message || 'Unable to connect to server. Please ensure the backend is running.',
      };
    }
  },

  /**
   * Register a new user
   */
  async register(payload: RegisterPayload): Promise<{ success: boolean; user?: BackendUser; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: payload.fullName.trim(),
          phoneNumber: payload.phoneNumber.trim(),
          email: payload.email.trim(),
          password: payload.password,
          confirmPassword: payload.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || 'Registration failed. Please check your inputs.',
        };
      }

      return {
        success: true,
        user: data.user,
        message: data.message || 'Account created successfully',
      };
    } catch (error: any) {
      console.error('AuthService.register error:', error);
      return {
        success: false,
        message: error.message || 'Unable to connect to server. Please ensure the backend is running.',
      };
    }
  },

  /**
   * Get current authenticated user profile
   */
  async getMe(token: string): Promise<{ success: boolean; user?: BackendUser; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || 'Failed to fetch user profile',
        };
      }

      return {
        success: true,
        user: data.user,
      };
    } catch (error: any) {
      console.error('AuthService.getMe error:', error);
      return {
        success: false,
        message: error.message || 'Unable to fetch user profile',
      };
    }
  },

  /**
   * Update personal profile info (fullName, phoneNumber, avatar)
   */
  async updateProfile(
    token: string,
    payload: { fullName?: string; phoneNumber?: string; avatar?: string }
  ): Promise<{ success: boolean; user?: BackendUser; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
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
          message: data.message || 'Failed to update personal profile',
        };
      }

      return {
        success: true,
        user: data.user,
        message: data.message || 'Profile updated successfully',
      };
    } catch (error: any) {
      console.error('AuthService.updateProfile error:', error);
      return {
        success: false,
        message: error.message || 'Unable to connect to server',
      };
    }
  },
};
