import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { ROUTES } from "@/constatnts/routes";
import { USER_ROLES } from "@/constatnts/roles";

/**
 * RoleBasedRoute Component
 * Protects routes and ensures user has required role
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Children to render if authorized
 * @param {string|string[]} props.requiredRole - Single role or array of allowed roles
 * @param {React.ReactNode} props.fallback - Component to render if unauthorized (optional)
 * @returns {React.ReactNode} Protected route or redirect
 * 
 * Usage:
 * <RoleBasedRoute requiredRole={USER_ROLES.VENDOR}>
 *   <VendorDashboard />
 * </RoleBasedRoute>
 * 
 * or multiple roles:
 * <RoleBasedRoute requiredRole={[USER_ROLES.VENDOR, USER_ROLES.ADMIN]}>
 *   <Dashboard />
 * </RoleBasedRoute>
 */
const RoleBasedRoute = ({ children, requiredRole, fallback }) => {
  const { user, loading, isAuthenticated } = useSelector((state) => state.auth);

  // Show loader while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-600"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to Login
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.PUBLIC.LOGIN} replace />;
  }

  // If authenticated but user data is missing
  if (!user) {
    return <Navigate to={ROUTES.PUBLIC.HOME} replace />;
  }

  // Normalize requiredRole to array for easier comparison
  const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

  // Check if user has one of the required roles
  const hasRequiredRole = requiredRoles.includes(user.role);

  if (!hasRequiredRole) {
    // Render fallback component if provided
    if (fallback) {
      return fallback;
    }

    // Otherwise, redirect to home or appropriate page based on user role
    const redirectPath =
      user.role === USER_ROLES.VENDOR
        ? ROUTES.VENDOR.DASHBOARD
        : user.role === USER_ROLES.ADMIN
          ? ROUTES.ADMIN.DASHBOARD || ROUTES.PUBLIC.HOME
          : ROUTES.PUBLIC.HOME;

    return <Navigate to={redirectPath} replace />;
  }

  // Allow access to the protected page
  return children;
};

export default RoleBasedRoute;
