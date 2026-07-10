import { useSelector } from "react-redux";
import { USER_ROLES, ROLE_PERMISSIONS } from "@/constatnts/roles";

/**
 * Custom hook to check user role and permissions
 * @returns {Object} Object with role checking methods
 */
export const useRoleCheck = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const hasRole = (requiredRole) => {
    if (!isAuthenticated || !user) return false;
    return user.role === requiredRole;
  };

  const hasAnyRole = (requiredRoles) => {
    if (!isAuthenticated || !user) return false;
    return requiredRoles.includes(user.role);
  };

  const hasAllRoles = (requiredRoles) => {
    if (!isAuthenticated || !user) return false;
    return requiredRoles.every((role) => user.role === role);
  };

  const hasPermission = (permission) => {
    if (!isAuthenticated || !user) return false;
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    return userPermissions.includes(permission);
  };

  const isUser = () => hasRole(USER_ROLES.USER);
  const isVendor = () => hasRole(USER_ROLES.VENDOR);
  const isAdmin = () => hasRole(USER_ROLES.ADMIN);

  return {
    user,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    hasPermission,
    isUser,
    isVendor,
    isAdmin,
  };
};
