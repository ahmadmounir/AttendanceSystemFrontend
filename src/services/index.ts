/**
 * Services index file - central export point for all API services
 */
import {login, logout, register, resetPassword} from './auth-service';
import { isAuthenticated, getToken, fetcher, handleResponse } from './api-client';

// Re-export services
export { login, logout, register, resetPassword, isAuthenticated, getToken, fetcher, handleResponse };

// Export all types from models/api
export type * from '@/models/api';