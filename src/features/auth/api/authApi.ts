/**
 * Authentication service for login, registration, and session management
 */
import { fetcher } from '@/shared/services/apiClient';
import { useProfileStore } from '@/shared/stores/profileStore';
import type { 
  ApiResponse, 
  LoginCredentials,
  LoginResponse,
  Profile,
} from '@/shared/types/api';


export async function login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
  const result = await fetcher<LoginResponse>('/auth/login', 'POST', {
    username: credentials.username,
    password: credentials.password
  });

  if (result.success && result.data) {
    // Store the access token
    localStorage.setItem('attendance-system-token', result.data.accessToken);
    
    // Store profile from login response
    const profile: Profile = {
      username: result.data.username,
      name: result.data.name,
      role: result.data.role,
      expiresAt: result.data.expiresAt,
    };
    useProfileStore.getState().setProfile(profile);
  }

  return result;
}

export function logout(): void {
  localStorage.removeItem('attendance-system-token');
  
  // Clear profile from Zustand store
  useProfileStore.getState().clearProfile();
}