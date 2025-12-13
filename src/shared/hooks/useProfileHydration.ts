/**
 * Profile hydration hook
 * 
 * Note: This project does not have a separate profile API endpoint.
 * Profile data is retrieved from the login response only.
 * This hook handles redirecting to login if no token exists.
 */
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProfile } from '@/shared/stores/profileStore';

/**
 * Hook to check authentication status on app mount
 * - Redirects to login if no token exists
 * - Profile is populated during login, not fetched separately
 */
export function useProfileHydration() {
  const profile = useProfile();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Skip auth check on login page
    if (location.pathname === '/login') {
      return;
    }

    const token = localStorage.getItem('attendance-system-token');
    
    // If no token, redirect to login
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    
    // If token exists but no profile, user needs to login again
    // (profile is only set during login in this system)
    if (!profile) {
      localStorage.removeItem('attendance-system-token');
      navigate('/login', { replace: true });
    }
  }, [navigate, profile, location.pathname]);

  return { profile };
}
