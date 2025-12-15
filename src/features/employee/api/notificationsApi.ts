/**
 * Employee API - Notifications endpoints
 */
import { fetcher } from '@/shared/services/apiClient';
import type { ApiResponse } from '@/shared/types/api';

export interface Notification {
  id: string;
  title: string;
  descr: string;
  employeeId: string;
  markedAsRead: boolean;
  createdAt: string;
}

export interface MarkAsReadData {
  markedAsRead: number; // 0 = unread, 1 = read
}

/**
 * Get all notifications
 */
export const getNotifications = async (): Promise<ApiResponse<Notification[]>> => {
  return fetcher<Notification[]>('/notifications');
};

/**
 * Mark notification as read/unread
 */
export const markNotificationAsRead = async (
  notificationId: string,
  markedAsRead: boolean
): Promise<ApiResponse<void>> => {
  return fetcher<void>(`/notifications/${notificationId}`, 'PUT', {
    markedAsRead: markedAsRead ? 1 : 0
  });
};
