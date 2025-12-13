import { fetcher } from '@/shared/services/apiClient';
import type { ApiResponse, Industry } from '@/shared/types/api';

/**
 * Get list of available industries
 */
export async function getIndustries(): Promise<ApiResponse<Industry[]>> {
    return await fetcher<Industry[]>('/lists/industries', 'GET');
}

// Get available colors for teams
export const getColors = async (): Promise<ApiResponse<string[]>> => {
  return fetcher<string[]>('/lists/colors', 'GET');
};