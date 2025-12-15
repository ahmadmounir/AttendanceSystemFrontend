/**
 * Portal API - Overtime Requests endpoints
 */
import { fetcher } from '@/shared/services/apiClient';
import type { ApiResponse } from '@/shared/types/api';

export interface OvertimeRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  requestDate: string;
  hours: number;
  reason: string;
  status: string; // "Pending" | "Approved" | "Rejected"
}

export interface ReviewOvertimeRequest {
  status: string; // "Approved" | "Rejected"
}

/**
 * Get all overtime requests
 */
export const getOvertimeRequests = async (): Promise<ApiResponse<OvertimeRequest[]>> => {
  return fetcher<OvertimeRequest[]>('/overtimerequests');
};

/**
 * Get single overtime request by ID
 */
export const getOvertimeRequest = async (id: string): Promise<ApiResponse<OvertimeRequest>> => {
  return fetcher<OvertimeRequest>(`/overtimerequests/${id}`);
};

/**
 * Review overtime request (approve or reject)
 */
export const reviewOvertimeRequest = async (id: string, data: ReviewOvertimeRequest): Promise<ApiResponse<void>> => {
  return fetcher<void>(`/overtimerequests/${id}/approval`, 'PUT', data);
};
