import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "@/shared/services/apiClient";
import { useProfile } from "@/shared/stores/profileStore";
import { isAdminRole } from "@/shared/utils/roles";

export const ProtectedRoute = () => {
  const location = useLocation();
  const profile = useProfile();

  if (!isAuthenticated()) {
    // Redirect to the login page, but save the current location they tried to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is admin trying to access non-portal routes, redirect to portal
  if (
    profile &&
    isAdminRole(profile.role) &&
    !location.pathname.startsWith("/portal")
  ) {
    return <Navigate to="/portal" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
