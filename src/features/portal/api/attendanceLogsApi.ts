/**
 * Portal API - Attendance Logs endpoints
 */
import { fetcher } from '@/shared/services/apiClient';
import type { ApiResponse } from '@/shared/types/api';

export interface AttendanceLog {
  id: string;
  employeeId: string;
  employeeFullName: string;
  clockInTime: string;
  clockOutTime: string | null;
  totalHours: number;
}

export interface AttendanceLogDetail {
  id: string;
  employeeId: string;
  clockInTime: string;
  clockOutTime: string | null;
  totalHours: number;
}

export interface AttendEmployeeRequest {
  id: string; // employeeId
}

/**
 * Get all attendance logs
 */
export const getAttendanceLogs = async (): Promise<ApiResponse<AttendanceLog[]>> => {
  return fetcher<AttendanceLog[]>('/attendancelogs');
};

/**
 * Get single attendance log by ID
 */
export const getAttendanceLog = async (id: string): Promise<ApiResponse<AttendanceLogDetail>> => {
  return fetcher<AttendanceLogDetail>(`/attendancelogs/${id}`);
};

/**
 * Create attendance log (mark employee as attended)
 */
export const createAttendanceLog = async (data: AttendEmployeeRequest): Promise<ApiResponse<string>> => {
  return fetcher<string>('/attendancelogs', 'POST', data);
};

/**
 * Update attendance log (mark employee as left/clock out)
 */
export const updateAttendanceLog = async (id: string): Promise<ApiResponse<string>> => {
  return fetcher<string>(`/attendancelogs/${id}`, 'PUT');
};
