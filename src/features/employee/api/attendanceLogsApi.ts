/**
 * Employee API - Attendance Logs endpoints
 */
import { fetcher } from '@/shared/services/apiClient';
import type { ApiResponse } from '@/shared/types/api';

export interface MyAttendanceLog {
  id: string;
  employeeId: string;
  employeeFullName: string;
  clockInTime: string;
  clockOutTime: string | null;
  totalHours: number | null;
}

/**
 * Get my attendance logs
 */
export const getMyAttendanceLogs = async (): Promise<ApiResponse<MyAttendanceLog[]>> => {
  return fetcher<MyAttendanceLog[]>('/attendancelogs/my');
};
