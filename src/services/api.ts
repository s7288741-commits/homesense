// ============================================================================
// HomeSense — Base API Client
// ============================================================================
// Configures the HTTP client for real API calls.
// Currently unused (mock mode), but ready for when backend is live.
//
// TO SWITCH FROM MOCK TO REAL API:
// 1. Set NEXT_PUBLIC_USE_MOCK_DATA=false in .env.local
// 2. Set NEXT_PUBLIC_API_BASE_URL=http://your-backend.com/api/v1
// 3. Update individual service files to use apiClient instead of mock imports
// ============================================================================

import { APP_CONFIG } from '@/config/app.config';

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = APP_CONFIG.api.baseUrl;
    this.timeout = APP_CONFIG.api.timeout;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: unknown,
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          // Add auth token here when ready:
          // 'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint);
  }

  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, body);
  }

  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, body);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint);
  }
}

// Singleton instance
export const apiClient = new ApiClient();
