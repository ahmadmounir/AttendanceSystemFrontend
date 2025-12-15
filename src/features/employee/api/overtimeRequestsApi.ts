/**
 * Employee API - Overtime Requests endpoints
 */
import { fetcher } from '@/shared/services/apiClient';
import type { ApiResponse } from '@/shared/types/api';

export interface EmployeeOvertimeRequest {
  id: string;
  employeeId: string;
  requestDate: string;
  hours: number;
  reason: string;
  status: string; // "Pending" | "Approved" | "Rejected"
}

export interface CreateOvertimeRequestData {
  requestDate: string;
  hours: number;
  reason: string;
}

/**
 * Get my overtime requests
 */
export const getMyOvertimeRequests = async (employeeId: string): Promise<ApiResponse<EmployeeOvertimeRequest[]>> => {
  return fetcher<EmployeeOvertimeRequest[]>(`/overtimerequests/my/${employeeId}`);
};

/**
 * Create new overtime request
 */
export const createOvertimeRequest = async (employeeId: string, data: CreateOvertimeRequestData): Promise<ApiResponse<string>> => {
  return fetcher<string>(`/overtimerequests/${employeeId}`, 'POST', data);
};

/**
 * Cancel overtime request
 */
export const cancelOvertimeRequest = async (requestId: string): Promise<ApiResponse<void>> => {
  return fetcher<void>(`/overtimerequests/${requestId}`, 'DELETE');
};
