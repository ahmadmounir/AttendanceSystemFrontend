/**
 * Portal API - Notifications endpoints
 */
import { fetcher } from '@/shared/services/apiClient';
import type { ApiResponse } from '@/shared/types/api';

export interface SendNotificationData {
  title: string;
  description: string;
}

/**
 * Send notification to employee
 */
export const sendNotification = async (
  employeeId: string,
  data: SendNotificationData
): Promise<ApiResponse<void>> => {
  return fetcher<void>(`/notifications/${employeeId}`, 'POST', data);
};
