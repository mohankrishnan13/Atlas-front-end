import type { OverviewData, ApiMonitoringData, NetworkTrafficData, EndpointSecurityData, DbMonitoringData, Incident, HeaderData, UserProfile, AccountActivity, ScheduledReport, RecentDownload, TeamUser } from './types';

// The API client now makes requests to the Next.js API routes (proxies)
// instead of directly to the backend. The proxy routes will then forward the
// request to the backend defined in the NEXT_PUBLIC_ATLAS_BACKEND_URL env var.
// This avoids CORS issues in the browser.
const API_URL = ""; 

export class ApiError extends Error {
  status?: number;
  details?: any;

  constructor(message: string, status?: number, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export class AtlasApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("atlas_token");
    }
    return null;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401 && typeof window !== "undefined") {
        console.warn("Session expired or invalid. Redirecting to login.");
        localStorage.removeItem('atlas_token');
        localStorage.removeItem('atlas_user');
        window.location.href = '/login';
        // Throw an error to prevent further processing
        throw new ApiError("Session expired. Please log in again.", 401);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Request failed with status " + response.status, error: "Request failed" }));
        throw new ApiError(
          errorData.error || errorData.detail || `Request failed`,
          response.status,
          errorData
        );
      }

      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        console.error("Network or fetch error:", error);
        throw new ApiError("Network error or backend is unavailable. Please check if the backend server is running.", 503, { detail: (error as Error).message });
    }
  }

  // Dashboard endpoints
  async getOverview(env: string) {
    return this.makeRequest<OverviewData>(`/api/overview?env=${env}`);
  }

  async getApiMonitoring(env: string) {
    return this.makeRequest<ApiMonitoringData>(`/api/api-monitoring?env=${env}`);
  }

  async getNetworkTraffic(env: string) {
    return this.makeRequest<NetworkTrafficData>(`/api/network-traffic?env=${env}`);
  }

  async getEndpointSecurity(env: string) {
    return this.makeRequest<EndpointSecurityData>(`/api/endpoint-security?env=${env}`);
  }

  async getDbMonitoring(env: string) {
    return this.makeRequest<DbMonitoringData>(`/api/db-monitoring?env=${env}`);
  }

  async getIncidents(env: string) {
    return this.makeRequest<Incident[]>(`/api/incidents?env=${env}`);
  }
  
  async getHeaderData(env: string) {
    return this.makeRequest<HeaderData>(`/api/header-data?env=${env}`);
  }

  // Incident Actions
  async remediateIncident(incidentId: string, action: string) {
    return this.makeRequest(`/api/incidents/remediate`, {
      method: 'POST',
      body: JSON.stringify({ incidentId, action }),
    });
  }

  async quarantineDevice(workstationId: string) {
    return this.makeRequest(`/api/endpoint-security/quarantine`, {
        method: 'POST',
        body: JSON.stringify({ workstationId }),
    });
  }

  // Profile Page
  async getProfile() {
    return this.makeRequest<UserProfile>("/api/profile/me");
  }

  async updateProfile(data: Partial<UserProfile>) {
    return this.makeRequest<UserProfile>('/api/profile/me', {
        method: 'PUT',
        body: JSON.stringify(data),
    });
  }

  async updatePassword(data: { current_password: string, new_password: string }) {
    return this.makeRequest('/api/profile/password', {
        method: 'PUT',
        body: JSON.stringify(data),
    });
  }

  async getProfileActivity() {
      return this.makeRequest<AccountActivity[]>('/api/profile/activity');
  }

  // Settings Page
  async getUsers() {
      return this.makeRequest<TeamUser[]>('/api/users');
  }

  async createUser(data: { name: string, email: string, role: string }) {
      return this.makeRequest<TeamUser>('/api/users', {
          method: 'POST',
          body: JSON.stringify(data),
      });
  }

  async deleteUser(userId: number) {
      return this.makeRequest(`/api/users/${userId}`, {
          method: 'DELETE',
      });
  }

  // Reports Page
  async getScheduledReports() {
      return this.makeRequest<ScheduledReport[]>('/api/reports/scheduled');
  }

  async getRecentDownloads() {
      return this.makeRequest<RecentDownload[]>('/api/reports/downloads');
  }
}

export const apiClient = new AtlasApiClient();
