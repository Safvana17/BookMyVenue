import { USER_ROLES } from "@/constatnts/roles";

/**
 * Check if a user has a specific role
 * @param {Object} user - User object from auth state
 * @param {string} role - Role to check
 * @returns {boolean} True if user has the role
 */
export const userHasRole = (user, role) => {
  return user?.role === role;
};

/**
 * Check if a user has any of the specified roles
 * @param {Object} user - User object from auth state
 * @param {string[]} roles - Array of roles to check
 * @returns {boolean} True if user has any of the roles
 */
export const userHasAnyRole = (user, roles) => {
  return roles.includes(user?.role);
};

/**
 * Check if a user is a regular user
 * @param {Object} user - User object from auth state
 * @returns {boolean} True if user is a regular user
 */
export const isUser = (user) => {
  return userHasRole(user, USER_ROLES.USER);
};

/**
 * Check if a user is a vendor
 * @param {Object} user - User object from auth state
 * @returns {boolean} True if user is a vendor
 */
export const isVendor = (user) => {
  return userHasRole(user, USER_ROLES.VENDOR);
};

/**
 * Check if a user is an admin
 * @param {Object} user - User object from auth state
 * @returns {boolean} True if user is an admin
 */
export const isAdmin = (user) => {
  return userHasRole(user, USER_ROLES.ADMIN);
};

/**
 * Get the role display name
 * @param {string} role - Role to get display name for
 * @returns {string} Display name for the role
 */
export const getRoleDisplayName = (role) => {
  const roleNames = {
    [USER_ROLES.USER]: "User",
    [USER_ROLES.VENDOR]: "Venue Partner",
    [USER_ROLES.ADMIN]: "Administrator",
  };
  return roleNames[role] || role;
};

/**
 * Get the home route based on user role
 * @param {Object} user - User object from auth state
 * @param {Object} routes - Routes object
 * @returns {string} Home route for the user's role
 */
export const getHomeRouteByRole = (user, routes) => {
  if (isVendor(user)) {
    return routes.VENDOR.DASHBOARD;
  }
  if (isAdmin(user)) {
    return routes.ADMIN.DASHBOARD;
  }
  return routes.PUBLIC.HOME;
};

/**
 * Check if a route requires authentication
 * @param {string} pathname - Current pathname
 * @param {Object} routes - Routes object
 * @returns {boolean} True if route requires authentication
 */
export const isProtectedRoute = (pathname, routes) => {
  const publicRoutes = Object.values(routes.PUBLIC || {});
  return !publicRoutes.includes(pathname);
};

/**
 * Check if a route is accessible for a specific role
 * @param {string} pathname - Current pathname
 * @param {string} role - User role
 * @param {Object} routes - Routes object
 * @returns {boolean} True if role can access the route
 */
export const canAccessRoute = (pathname, role, routes) => {
  // Extract route type from pathname (user, vendor, admin)
  const routeType = pathname.split("/")[1];

  if (routeType === "user") {
    return role === USER_ROLES.USER;
  }
  if (routeType === "vendor") {
    return role === USER_ROLES.VENDOR;
  }
  if (routeType === "admin") {
    return role === USER_ROLES.ADMIN;
  }

  return true; // Public routes are accessible to all
};
