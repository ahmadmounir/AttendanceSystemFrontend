/**
 * Portal API - Leave Requests endpoints
 */
import { fetcher } from '@/shared/services/apiClient';
import type { ApiResponse } from '@/shared/types/api';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveTypeId: string;
  typeName: string;
  startDate: string;
  endDate: string;
  status: string; // "Pending" | "Approved" | "Rejected"
  reason: string;
}

export interface ReviewLeaveRequest {
  status: string; // "Approved" | "Rejected"
}

/**
 * Get all leave requests
 */
export const getLeaveRequests = async (): Promise<ApiResponse<LeaveRequest[]>> => {
  return fetcher<LeaveRequest[]>('/leaverequests');
};

/**
 * Get single leave request by ID
 */
export const getLeaveRequest = async (id: string): Promise<ApiResponse<LeaveRequest>> => {
  return fetcher<LeaveRequest>(`/leaverequests/${id}`);
};

/**
 * Review leave request (approve or reject)
 */
export const reviewLeaveRequest = async (id: string, data: ReviewLeaveRequest): Promise<ApiResponse<void>> => {
  return fetcher<void>(`/leaverequests/${id}/review`, 'PUT', data);
};
