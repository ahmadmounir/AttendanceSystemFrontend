// API client with common utilities and response handling
import type { ApiResponse, User } from '@/models/api';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Helper function to handle API responses according to server patterns
 * Server response structure:
 * - success: boolean (always present)
 * - statusCode: number (always present)
 * - message: string (on failure)
 * - data: object (on success)
 * - paging: object (if there is paging and in success)
 */
export const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  const data = await response.json();
  
  // Server always sends success flag
  const success = data.success || false;
  
  // Always include statusCode from response or data
  const statusCode = data.statusCode || response.status;
  
  // Handle 401 unauthorized by redirecting to login
  if (statusCode === 401) {
    // Clear token if exists
    localStorage.removeItem('engage-ui-token');
    localStorage.removeItem('engage-ui-user');
    
    // If not already on login page, redirect
    if (!window.location.pathname.includes('/auth/login')) {
      window.location.href = '/auth/login';
    }
  }
  
  return {
    success,
    statusCode,
    message: data.message || null,
    data: data.data,
    paging: data.paging
  };
};

/**
 * Make an API request with proper error handling
 */
export const fetcher = async <T>(
  endpoint: string, 
  method: string = 'GET', 
  body?: unknown
): Promise<ApiResponse<T>> => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add auth token if available
    const token = localStorage.getItem('engage-ui-token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    return handleResponse<T>(response);
  } catch (error) {
    console.error(`API error (${endpoint}):`, error);
    return {
      success: false,
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
};

/**
 * Helper function to get the stored auth token
 */
export const getToken = (): string | null => {
  return localStorage.getItem('engage-ui-token');
};

/**
   * Get current authenticated user from localStorage
   */
export const getCurrentUser = (): Omit<User, 'accessToken'> | null => {
  const userJson = localStorage.getItem('engage-ui-user');
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson) as Omit<User, 'accessToken'>;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Helper function to check if the user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
   * Check if status code is 401 (Unauthorized)
   */
export const isUnauthorized = (statusCode: number | undefined): boolean => {
  return statusCode === 401;
};