import { Outlet } from "react-router-dom";
import { useIsAdmin } from "@/shared/hooks/useAdmin";
import { AccessDenied } from "@/shared/components/ui";
import { Loader } from "@/shared/components/ui";

export function AdminProtectedRoute() {
  const { isAdmin, isLoading } = useIsAdmin();

  if (isLoading) {
    return <Loader text="Loading" variant="container" />;
  }

  return isAdmin ? <Outlet /> : <AccessDenied />;
}
