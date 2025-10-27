/**
 * Centralized API Client
 * Provides configured HTTP client with base URL, headers, and error handling
 */

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

class APIClient {
  private config: ApiConfig;
  private authToken: string | null = null;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  /**
   * Set authentication token for subsequent requests
   */
  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  /**
   * Get current auth token
   */
  getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Build headers for request
   */
  private getHeaders(customHeaders?: Record<string, string>): HeadersInit {
    const headers: Record<string, string> = {
      ...this.config.headers,
      ...customHeaders,
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const error: ApiError = {
        message: response.statusText || 'Request failed',
        status: response.status,
      };

      try {
        const errorData = await response.json();
        error.message = errorData.message || error.message;
        error.code = errorData.code;
      } catch {
        // If response is not JSON, use status text
      }

      throw error;
    }

    const data = await response.json();
    return {
      data,
      status: response.status,
    };
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): never {
    if (error.status === 401) {
      // Token expired or invalid - could trigger logout here
      console.warn('[API Client] Unauthorized - token may be invalid');
    }

    if (error.status === 403) {
      console.warn('[API Client] Forbidden - insufficient permissions');
    }

    if (error.status >= 500) {
      console.error('[API Client] Server error:', error);
    }

    throw error;
  }

  /**
   * GET request
   */
  async get<T = any>(
    endpoint: string,
    params?: Record<string, string>,
    customHeaders?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    try {
      const url = new URL(`${this.config.baseURL}${endpoint}`);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getHeaders(customHeaders),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * POST request
   */
  async post<T = any>(
    endpoint: string,
    body?: any,
    customHeaders?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(`${this.config.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(customHeaders),
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * PUT request
   */
  async put<T = any>(
    endpoint: string,
    body?: any,
    customHeaders?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(`${this.config.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(customHeaders),
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    endpoint: string,
    body?: any,
    customHeaders?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(`${this.config.baseURL}${endpoint}`, {
        method: 'PATCH',
        headers: this.getHeaders(customHeaders),
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * DELETE request
   */
  async delete<T = any>(
    endpoint: string,
    customHeaders?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(`${this.config.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(customHeaders),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Upload file (multipart/form-data)
   */
  async upload<T = any>(
    endpoint: string,
    formData: FormData,
    customHeaders?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    try {
      const headers = this.getHeaders(customHeaders);
      // Remove Content-Type to let browser set it with boundary
      delete (headers as any)['Content-Type'];

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout * 2); // Double timeout for uploads

      const response = await fetch(`${this.config.baseURL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }
}

// Create and export configured API client instance
const apiClient = new APIClient({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default apiClient;
