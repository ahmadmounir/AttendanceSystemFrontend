import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '@/services/api-client';

export const AuthProtectedRoute = () => {
  
  // If user is authenticated, redirect to home page
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the auth pages
  return <Outlet />;
};

export default AuthProtectedRoute;