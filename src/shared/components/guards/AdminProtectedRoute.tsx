import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useIsAdmin } from "@/shared/hooks/useAdmin";
import { Loader } from "@/shared/components/ui";

export function AdminProtectedRoute() {
  const { isAdmin, isLoading } = useIsAdmin();
  const location = useLocation();

  if (isLoading) {
    return <Loader text="Loading" variant="container" />;
  }

  // If not admin, redirect to employee profile
  if (!isAdmin) {
    return <Navigate to="/profile" replace />;
  }

  // If admin tries to access non-portal pages, redirect to portal dashboard
  if (!location.pathname.startsWith("/portal")) {
    return <Navigate to="/portal/dashboard" replace />;
  }

  return <Outlet />;
}
