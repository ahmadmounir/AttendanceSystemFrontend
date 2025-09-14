/**
 * Common API types used throughout the application
 */

// API response format from server
export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode?: number;
  message: string | null;
  data?: T;
  paging?: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

// User information from API
export interface User {
  tenantId: string | null;
  tenantName: string | null;
  username: string;
  email: string;
  name: string;
  role: string | null;
  accessToken?: string;
}

// Login request
export interface LoginCredentials {
  username: string;
  password: string;
}

// Registration request
export interface RegisterCredentials {
  username: string
  password: string
  firstName: string
  lastName: string
  email: string
  timezoneId: string
  phone?: string
}

// Reset password requests
export interface ResetPasswordBeginRequest {
  address: string;
}

export interface ResetPasswordVerifyRequest {
  address: string;
  code: string;
}

export interface ResetPasswordCommitRequest {
  token: string;
  newPassword: string;
}

// Router-related types
export interface LocationState {
  from?: {
    pathname: string;
  };
  successMessage?: string;
  errorMessage?: string;
}