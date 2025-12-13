/**
 * Common API types used throughout the application
 */

import type { UserRole, InvitableRole } from '@/shared/utils/roles';

// Re-export role types for convenience
export type { UserRole, InvitableRole };

// API response format from server
export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode?: number;
  message: string | null;
  data?: T;
  paging?: {
    pageIndex: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
  };
}

// Profile information (from login response)
export interface Profile {
  username: string;
  name: string;
  role: UserRole; // 'admin' or 'member'
  expiresAt: string;
}

// Login response
export interface LoginResponse {
  accessToken: string;
  username: string;
  name: string;
  role: UserRole;
  expiresAt: string;
}

// Country information
export interface Country {
  id: string;
  name: string;
  code: string;
  prefix: string;
}

// Login credentials
export interface LoginCredentials {
  username: string;
  password: string;
}