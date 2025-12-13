import { useProfileStore } from '@/shared/stores/profileStore';
import type { 
  Profile, 
} from '@/shared/types/api';

/**
 * Store user profile in Zustand store
 */
export const storeProfile = (profile: Profile): void => {
  useProfileStore.getState().setProfile(profile);
};

/**
 * Note: This project does not have a separate profile API endpoint.
 * Profile data is retrieved from the login response and stored in Zustand.
 * Use the profile from the store via useProfile() hook.
 */