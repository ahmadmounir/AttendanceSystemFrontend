import { useEffect, useState } from "react";
import { useProfile } from "@/shared/stores/profileStore";
import { isAdminRole } from "@/shared/utils/roles";

export function useIsAdmin() {
  const profile = useProfile();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(!profile);

  useEffect(() => {
    if (profile) {
      setIsAdmin(isAdminRole(profile.role));
      setIsLoading(false);
    } else {
      // Profile not loaded yet, wait for useProfileHydration to handle it
      setIsAdmin(null);
      setIsLoading(true);
    }
  }, [profile]);

  return { isAdmin, isLoading, profile };
}