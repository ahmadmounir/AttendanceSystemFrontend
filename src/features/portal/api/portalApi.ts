/**
 * Portal API - Admin portal endpoints
 */
import { fetcher } from '@/shared/services/apiClient';
import type { ApiResponse } from '@/shared/types/api';

export interface DashboardStats {
  pendingOvertimeRequests: number;
  pendingLeaveRequests: number;
  totalDepartments: number;
  totalEmployees: number;
}

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (): Promise<ApiResponse<DashboardStats>> => {
  return fetcher<DashboardStats>('/dashboard');
};
