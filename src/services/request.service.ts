import { API_BASE_URL } from '@/constants/api';
import { ServiceRequest } from '@/data/mockData';

export interface CreateRequestPayload {
  service?: string;
  serviceCategory: string;
  serviceName: string;
  problemDescription: string;
  photos: string[];
  location: string;
  date?: string;
  time?: string;
  isFlexible?: boolean;
  selectedProvider?: string;
  providerId?: string;
  estimatedCost?: number;
}

export interface BackendServiceRequestDoc {
  _id: string;
  customer?: {
    _id?: string;
    fullName?: string;
    phoneNumber?: string;
    email?: string;
  };
  service?: {
    _id?: string;
    name?: string;
    profession?: string;
    category?: string;
    image?: string;
  };
  serviceName?: string;
  serviceCategory?: string;
  description: string;
  location: {
    address: string;
    coordinates?: [number, number];
  };
  preferredDate?: string;
  preferredTime?: string;
  photos?: string[];
  selectedProvider?: {
    _id?: string;
    fullName?: string;
    phoneNumber?: string;
    email?: string;
    avatar?: string;
    providerProfile?: {
      profession?: string;
      specializations?: string[];
      rating?: number;
      reviewCount?: number;
    };
  };
  status: string;
  estimatedCost?: number;
  isFlexible?: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Maps a MongoDB ServiceRequest document into the unified ServiceRequest interface used by the app.
 */
export const mapBackendRequestToFrontend = (doc: BackendServiceRequestDoc): ServiceRequest => {
  const statusMap: Record<string, ServiceRequest['status']> = {
    pending: 'Sent',
    provider_selected: 'Sent',
    accepted: 'Accepted',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    rejected: 'Cancelled',
  };

  const statusIndexMap: Record<string, number> = {
    pending: 0,
    provider_selected: 0,
    accepted: 1,
    in_progress: 2,
    completed: 3,
    cancelled: 0,
    rejected: 0,
  };

  const frontStatus = statusMap[doc.status] || 'Sent';
  const frontIndex = statusIndexMap[doc.status] ?? 0;

  return {
    id: doc._id,
    serviceCategory: doc.serviceCategory || doc.service?.category || doc.service?.name || 'General',
    serviceName: doc.serviceName || (doc.service?.name ? `${doc.service.name} Diagnostic & Repair` : 'Service Request'),
    problemDescription: doc.description || '',
    photos: doc.photos || [],
    location: doc.location?.address || 'Location provided',
    date: doc.preferredDate ? new Date(doc.preferredDate).toLocaleDateString() : 'Flexible',
    time: doc.preferredTime || 'Flexible',
    isFlexible: Boolean(doc.isFlexible),
    professionalId: doc.selectedProvider?._id || '',
    professionalName: doc.selectedProvider?.fullName || 'Assigned Professional',
    professionalAvatar: doc.selectedProvider?.avatar || '',
    professionalProfession: doc.selectedProvider?.providerProfile?.profession || doc.service?.profession || '',
    status: frontStatus,
    statusIndex: frontIndex,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'Just now',
    estimatedCost: doc.estimatedCost || 0,
  };
};

export const RequestService = {
  /**
   * Create a new service request in MongoDB.
   * POST /api/requests
   */
  async createRequest(
    token: string,
    payload: CreateRequestPayload
  ): Promise<{ success: boolean; message: string; data?: BackendServiceRequestDoc }> {
    try {
      const response = await fetch(`${API_BASE_URL}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          service: payload.service || payload.serviceCategory,
          serviceCategory: payload.serviceCategory,
          serviceName: payload.serviceName,
          description: payload.problemDescription,
          location: payload.location,
          preferredDate: payload.date ? new Date().toISOString() : undefined,
          preferredTime: payload.time,
          photos: payload.photos,
          selectedProvider: payload.selectedProvider || payload.providerId,
          providerId: payload.providerId || payload.selectedProvider,
          estimatedCost: payload.estimatedCost,
          isFlexible: payload.isFlexible,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || `Request creation failed (${response.status})`,
        };
      }

      return {
        success: true,
        message: data.message || 'Service request created successfully',
        data: data.data,
      };
    } catch (error: any) {
      console.error('RequestService.createRequest error:', error);
      return {
        success: false,
        message: error.message || 'Network error while submitting service request',
      };
    }
  },

  /**
   * Get all service requests created by the authenticated customer.
   * GET /api/requests
   */
  async getMyRequests(
    token: string
  ): Promise<{ success: boolean; message: string; data?: BackendServiceRequestDoc[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/requests`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to fetch customer requests',
        };
      }

      return {
        success: true,
        message: 'Requests fetched successfully',
        data: data.data || [],
      };
    } catch (error: any) {
      console.error('RequestService.getMyRequests error:', error);
      return {
        success: false,
        message: error.message || 'Network error while fetching requests',
      };
    }
  },

  /**
   * Cancel an existing service request.
   * PUT /api/requests/:id/cancel
   */
  async cancelRequest(
    token: string,
    requestId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/requests/${requestId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to cancel request',
        };
      }

      return {
        success: true,
        message: data.message || 'Request cancelled successfully',
      };
    } catch (error: any) {
      console.error('RequestService.cancelRequest error:', error);
      return {
        success: false,
        message: error.message || 'Network error while cancelling request',
      };
    }
  },

  /**
   * Fetch incoming service requests assigned to the authenticated provider.
   * GET /api/provider/requests
   */
  async getProviderRequests(
    token: string
  ): Promise<{ success: boolean; message: string; data?: BackendServiceRequestDoc[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/provider/requests`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to fetch provider requests',
        };
      }

      return {
        success: true,
        message: 'Provider requests fetched successfully',
        data: data.data || [],
      };
    } catch (error: any) {
      console.error('RequestService.getProviderRequests error:', error);
      return {
        success: false,
        message: error.message || 'Network error while fetching provider requests',
      };
    }
  },

  /**
   * Provider accepts an assigned service request.
   * PUT /api/provider/requests/:id/accept
   */
  async acceptRequest(
    token: string,
    requestId: string
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const response = await fetch(`${API_BASE_URL}/provider/requests/${requestId}/accept`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to accept request',
        };
      }

      return {
        success: true,
        message: data.message || 'Service request accepted',
        data: data.data,
      };
    } catch (error: any) {
      console.error('RequestService.acceptRequest error:', error);
      return {
        success: false,
        message: error.message || 'Network error while accepting request',
      };
    }
  },

  /**
   * Provider declines an assigned service request.
   * PUT /api/provider/requests/:id/reject
   */
  async rejectRequest(
    token: string,
    requestId: string
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const response = await fetch(`${API_BASE_URL}/provider/requests/${requestId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to decline request',
        };
      }

      return {
        success: true,
        message: data.message || 'Service request declined',
        data: data.data,
      };
    } catch (error: any) {
      console.error('RequestService.rejectRequest error:', error);
      return {
        success: false,
        message: error.message || 'Network error while declining request',
      };
    }
  },

  /**
   * Fetch active and past jobs for the authenticated user.
   * GET /api/jobs
   */
  async getJobs(
    token: string
  ): Promise<{ success: boolean; message: string; data?: any[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to fetch jobs',
        };
      }

      return {
        success: true,
        message: 'Jobs fetched successfully',
        data: data.data || [],
      };
    } catch (error: any) {
      console.error('RequestService.getJobs error:', error);
      return {
        success: false,
        message: error.message || 'Network error while fetching jobs',
      };
    }
  },

  /**
   * Provider starts work on a job.
   * PUT /api/jobs/:id/start
   */
  async startJob(
    token: string,
    jobId: string
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/start`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to start job',
        };
      }

      return {
        success: true,
        message: data.message || 'Job started successfully',
        data: data.data,
      };
    } catch (error: any) {
      console.error('RequestService.startJob error:', error);
      return {
        success: false,
        message: error.message || 'Network error while starting job',
      };
    }
  },

  /**
   * Provider marks a job as completed.
   * PUT /api/jobs/:id/complete
   */
  async completeJob(
    token: string,
    jobId: string
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to complete job',
        };
      }

      return {
        success: true,
        message: data.message || 'Job completed successfully',
        data: data.data,
      };
    } catch (error: any) {
      console.error('RequestService.completeJob error:', error);
      return {
        success: false,
        message: error.message || 'Network error while completing job',
      };
    }
  },
};
