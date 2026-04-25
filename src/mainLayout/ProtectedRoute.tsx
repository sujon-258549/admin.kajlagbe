import { Navigate, useLocation, matchPath } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { useCurrentToken } from "../redux/features/auth/authSlice";
import React from "react";
import { usePermission } from "../utils/sidebar";
import { routePermissions } from "../router/routePermissions";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAppSelector(useCurrentToken);
  const location = useLocation();
  const { hasPermission, isSuperAdmin, isLoading } = usePermission();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('hasPermission', hasPermission)

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // 1. Super Admin Bypass
  if (isSuperAdmin) {
    return <>{children}</>;
  }

  // 2. Check for explicit route-level permissions
  const matchedRoute = Object.keys(routePermissions).find((path) =>
    matchPath({ path, end: true }, location.pathname),
  );

  if (matchedRoute) {
    const { module, action } = routePermissions[matchedRoute];
    if (hasPermission(module, action)) {
      return <>{children}</>;
    } else {
      // If unauthorized, redirect to dashboard or profile
      return <Navigate to="/" replace />;
    }
  }

  // 3. Special cases for common authenticated routes not in mapping (if any)
  const commonRoutes = ["/forgot-password", "/reset-password"];
  if (commonRoutes.includes(location.pathname)) {
    return <>{children}</>;
  }

  // Default: Allow if no specific permission is required, or redirect if strict
  return <>{children}</>;
};

export default ProtectedRoute;
