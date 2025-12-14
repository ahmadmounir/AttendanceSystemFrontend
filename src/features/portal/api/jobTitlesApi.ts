/**
 * Portal API - Job Titles endpoints
 */
import { fetcher } from '@/shared/services/apiClient';
import type { ApiResponse } from '@/shared/types/api';

export interface JobTitle {
  id: string;
  titleName: string;
  minSalary: number;
  maxSalary: number;
}

export interface JobTitleFormData {
  titleName: string;
  minSalary: number;
  maxSalary: number;
}

/**
 * Get all job titles
 */
export const getJobTitles = async (): Promise<ApiResponse<JobTitle[]>> => {
  return fetcher<JobTitle[]>('/jobtitles');
};

/**
 * Get job title by ID
 */
export const getJobTitle = async (id: string): Promise<ApiResponse<JobTitle>> => {
  return fetcher<JobTitle>(`/jobtitles/${id}`);
};

/**
 * Create new job title
 */
export const createJobTitle = async (data: JobTitleFormData): Promise<ApiResponse<string>> => {
  return fetcher<string>('/jobtitles', 'POST', data);
};

/**
 * Update job title
 */
export const updateJobTitle = async (id: string, data: JobTitleFormData): Promise<ApiResponse<JobTitle>> => {
  return fetcher<JobTitle>(`/jobtitles/${id}`, 'PUT', data);
};

/**
 * Delete job title
 */
export const deleteJobTitle = async (id: string): Promise<ApiResponse<void>> => {
  return fetcher<void>(`/jobtitles/${id}`, 'DELETE');
};
