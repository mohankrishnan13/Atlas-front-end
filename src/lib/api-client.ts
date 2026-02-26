// API client for making authenticated requests to the ATLAS backend

const API_URL = process.env.NEXT_PUBLIC_ATLAS_BACKEND_URL || "http://localhost:8000";

export interface ApiError extends Error {
  status?: number;
  details?: string;
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

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: "Request failed" }));
        const apiError = new Error(error.detail || `Request failed with status ${response.status}`) as ApiError;
        apiError.status = response.status;
        apiError.details = JSON.stringify(error);
        throw apiError;
      }

      // Handle empty responses (204 No Content)
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error");
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.makeRequest<{
      access_token: string;
      token_type: string;
      role: string;
      full_name: string;
    }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(data: {
    email: string;
    full_name: string;
    password: string;
    role?: string;
  }) {
    return this.makeRequest<{
      message: string;
      email: string;
      role: string;
    }>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async forgotPassword(email: string) {
    return this.makeRequest<{ message: string }>("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async getProfile() {
    return this.makeRequest<{
      id: number;
      email: string;
      full_name: string;
      role: string;
      is_active: boolean;
      last_login: string | null;
      created_at: string;
    }>("/api/auth/me");
  }

  // Dashboard endpoints
  async getOverview() {
    return this.makeRequest("/api/v1/dashboard/overview");
  }

  async getApiMonitoring() {
    return this.makeRequest("/api/v1/dashboard/api-monitoring");
  }

  async getNetworkTraffic() {
    return this.makeRequest("/api/v1/dashboard/network-traffic");
  }

  async getEndpointSecurity() {
    return this.makeRequest("/api/v1/dashboard/endpoint-security");
  }

  async getDbMonitoring() {
    return this.makeRequest("/api/v1/dashboard/db-monitoring");
  }

  async getIncidents() {
    return this.makeRequest("/api/v1/dashboard/incidents");
  }

  // Settings endpoints
  async getSettings() {
    return this.makeRequest("/api/v1/settings");
  }

  async updateSettings(settings: Record<string, any>) {
    return this.makeRequest("/api/v1/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  }

  // Incidents endpoints
  async getIncidentDetails(incidentId: string) {
    return this.makeRequest(`/api/v1/incidents/${incidentId}`);
  }

  async createIncident(data: Record<string, any>) {
    return this.makeRequest("/api/v1/incidents", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

// Export singleton instance
export const apiClient = new AtlasApiClient();
