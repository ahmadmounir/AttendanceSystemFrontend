/**
 * Authentication service for login, registration, and session management
 */
import { fetcher } from './api-client';
import type { 
  ApiResponse, 
  LoginCredentials, 
  RegisterCredentials, 
  User,
  ResetPasswordBeginRequest,
  ResetPasswordVerifyRequest,
  ResetPasswordCommitRequest
} from '@/models/api';


export async function login(credentials: LoginCredentials): Promise<ApiResponse<User>> {
  const result = await fetcher<User>('/auth/login', 'POST', {
    username: credentials.username,
    password: credentials.password
  });

  if (result.success && result.data && result.data.accessToken) {
    // Store token and user in localStorage
    localStorage.setItem('engage-ui-token', result.data.accessToken);
    localStorage.setItem(
      'engage-ui-user',
      JSON.stringify({
        tenantId: result.data.tenantId,
        tenantName: result.data.tenantName,
        username: result.data.username,
        email: result.data.email,
        name: result.data.name,
        role: result.data.role,
      })
    );
    
  }

  return result;
}
  
export async function register(credentials: RegisterCredentials): Promise<ApiResponse<User>> {
  const registerData: RegisterCredentials = {
    username: credentials.username,
    email: credentials.email,
    timezoneId: credentials.timezoneId,
    password: credentials.password,
    firstName: credentials.firstName,
    lastName: credentials.lastName,
    phone: credentials.phone || ''
  };

  return fetcher<User>('/auth/signup', 'POST', registerData);
}
  
export async function resetPassword(email: string): Promise<ApiResponse<void>> {
  return fetcher<void>('/auth/reset-password', 'POST', { email });
}

// Reset password flow - Begin the reset process
export async function resetPasswordBegin(email: string): Promise<ApiResponse<void>> {
  const data: ResetPasswordBeginRequest = { address: email };
  return fetcher<void>('/auth/reset-password/begin', 'POST', data);
}

// Reset password flow - Verify the code
export async function resetPasswordVerify(email: string, code: string): Promise<ApiResponse<{ token: string }>> {
  const data: ResetPasswordVerifyRequest = { 
    address: email,
    code: code 
  };
  return fetcher<{ token: string }>('/auth/reset-password/verify', 'POST', data);
}

// Reset password flow - Commit the new password
export async function resetPasswordCommit(token: string, newPassword: string): Promise<ApiResponse<void>> {
  const data: ResetPasswordCommitRequest = { 
    token: token,
    newPassword: newPassword 
  };
  return fetcher<void>('/auth/reset-password/commit', 'POST', data);
}

export function logout(): void {
  localStorage.removeItem('engage-ui-token');
  localStorage.removeItem('engage-ui-user');
}