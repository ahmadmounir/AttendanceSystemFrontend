/**
 * Portal API - Shifts endpoints
 */
import { fetcher } from '@/shared/services/apiClient';
import type { ApiResponse } from '@/shared/types/api';

export interface Shift {
  id: string;
  shiftName: string;
  startTime: string;
  endTime: string;
  gracePeriodMinutes: number;
}

/**
 * Get all shifts
 */
export const getShifts = async (): Promise<ApiResponse<Shift[]>> => {
  return fetcher<Shift[]>('/shifts');
};
