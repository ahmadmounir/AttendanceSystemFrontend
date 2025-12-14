/**
 * Profile hydration hook
 * 
 * Note: This project does not have a separate profile API endpoint.
 * Profile data is retrieved from the login response only.
 * This hook handles redirecting to login if no token exists and
 * restores profile from localStorage on page reload.
 */
import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProfile, useProfileStore } from '@/shared/stores/profileStore';

/**
 * Hook to check authentication status on app mount
 * - Redirects to login if no token exists
 * - Restores profile from localStorage if token exists
 * - Profile is populated during login, not fetched separately
 */
export function useProfileHydration() {
  const profile = useProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const hasHydrated = useRef(false);
  const { setProfile } = useProfileStore();

  useEffect(() => {
    // Skip auth check on login page
    if (location.pathname === '/login') {
      return;
    }

    // Only run once
    if (hasHydrated.current) {
      return;
    }

    const token = localStorage.getItem('attendance-system-token');
    
    // If no token, redirect to login
    if (!token) {
      navigate('/login', { replace: true });
      hasHydrated.current = true;
      return;
    }
    
    // If token exists but no profile in memory, try to restore from localStorage
    if (!profile) {
      const storedProfile = localStorage.getItem('attendance-system-profile');
      
      if (storedProfile) {
        try {
          const parsedProfile = JSON.parse(storedProfile);
          setProfile(parsedProfile);
          hasHydrated.current = true;
        } catch {
          // Invalid profile data, clear everything and redirect
          localStorage.removeItem('attendance-system-token');
          localStorage.removeItem('attendance-system-profile');
          navigate('/login', { replace: true });
          hasHydrated.current = true;
        }
      } else {
        // No stored profile, clear token and redirect
        localStorage.removeItem('attendance-system-token');
        navigate('/login', { replace: true });
        hasHydrated.current = true;
      }
    } else {
      hasHydrated.current = true;
    }
  }, [navigate, profile, location.pathname, setProfile]);

  return { profile };
}
