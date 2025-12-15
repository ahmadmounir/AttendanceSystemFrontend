/**
 * Employee API - Leave Requests endpoints
 */
import { fetcher } from '@/shared/services/apiClient';
import type { ApiResponse } from '@/shared/types/api';

export interface LeaveType {
  id: string;
  typeName: string;
  isPaid: boolean;
}

export interface EmployeeLeaveRequest {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string; // "Pending" | "Approved" | "Rejected"
}

export interface CreateLeaveRequestData {
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
}

/**
 * Get leave types for selection
 */
export const getLeaveTypes = async (): Promise<ApiResponse<LeaveType[]>> => {
  return fetcher<LeaveType[]>('/leavetypes');
};

/**
 * Get my leave requests
 */
export const getMyLeaveRequests = async (employeeId: string): Promise<ApiResponse<EmployeeLeaveRequest[]>> => {
  return fetcher<EmployeeLeaveRequest[]>(`/leaverequests/me/${employeeId}`);
};

/**
 * Create new leave request
 */
export const createLeaveRequest = async (employeeId: string, data: CreateLeaveRequestData): Promise<ApiResponse<string>> => {
  return fetcher<string>(`/leaverequests/${employeeId}`, 'POST', data);
};

/**
 * Cancel leave request
 */
export const cancelLeaveRequest = async (requestId: string): Promise<ApiResponse<void>> => {
  return fetcher<void>(`/leaverequests/${requestId}`, 'DELETE');
};
