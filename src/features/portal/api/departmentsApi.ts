/**
 * Portal API - Departments endpoints
 */
import { fetcher } from '@/shared/services/apiClient';
import type { ApiResponse } from '@/shared/types/api';

export interface Department {
  id: string;
  departmentName: string;
  employeeCount?: number;
}

export interface DepartmentFormData {
  departmentName: string;
}

/**
 * Get all departments
 */
export const getDepartments = async (): Promise<ApiResponse<Department[]>> => {
  return fetcher<Department[]>('/departments');
};

/**
 * Get department by ID
 */
export const getDepartment = async (id: string): Promise<ApiResponse<Department>> => {
  return fetcher<Department>(`/departments/${id}`);
};

/**
 * Create new department
 */
export const createDepartment = async (data: DepartmentFormData): Promise<ApiResponse<string>> => {
  return fetcher<string>('/departments', 'POST', data);
};

/**
 * Update department
 */
export const updateDepartment = async (id: string, data: DepartmentFormData): Promise<ApiResponse<void>> => {
  return fetcher<void>(`/departments/${id}`, 'PUT', data);
};

/**
 * Delete department
 */
export const deleteDepartment = async (id: string): Promise<ApiResponse<void>> => {
  return fetcher<void>(`/departments/${id}`, 'DELETE');
};
