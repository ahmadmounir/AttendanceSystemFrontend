/**
 * Portal API - Employees endpoints
 */
import { fetcher } from '@/shared/services/apiClient';
import type { ApiResponse } from '@/shared/types/api';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  hireDate: string;
  startDate: string;
  endDate: string | null;
  shiftId: string;
  departmentId: string;
  jobId: string;
  countryId: string;
  isSystemActive: boolean;
}

export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  endDate: string | null;
  shiftId: string;
  departmentId: string;
  jobId: string;
  countryId: string;
  isSystemActive: boolean;
  password: string;
  roleId: string;
}

/**
 * Get all employees
 */
export const getEmployees = async (): Promise<ApiResponse<Employee[]>> => {
  return fetcher<Employee[]>('/employees');
};

/**
 * Create new employee
 */
export const createEmployee = async (data: EmployeeFormData): Promise<ApiResponse<string>> => {
  return fetcher<string>('/employees', 'POST', data);
};

/**
 * Update employee
 */
export const updateEmployee = async (id: string, data: EmployeeFormData): Promise<ApiResponse<string>> => {
  return fetcher<string>(`/employees/${id}`, 'PUT', data);
};

/**
 * Delete employee
 */
export const deleteEmployee = async (id: string): Promise<ApiResponse<void>> => {
  return fetcher<void>(`/employees/${id}`, 'DELETE');
};
