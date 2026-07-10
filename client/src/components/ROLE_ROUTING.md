# Role-Based Routing Documentation

This document describes the role-based routing system implemented in BookMyVenue frontend.

## Overview

Role-based routing ensures that users can only access pages and features appropriate for their role. The system supports three roles:

- **User** - Regular users who can browse and book venues
- **Vendor** - Venue partners who can manage venues and bookings
- **Admin** - Administrators who can manage users, vendors, and venues

## Available Roles

```javascript
// From constatnts/roles.js
export const USER_ROLES = {
  USER: "user",
  VENDOR: "vendor",
  ADMIN: "admin",
};
```

## Components and Hooks

### 1. RoleBasedRoute Component

Protects routes and ensures user has required role before accessing them.

**Location:** `src/components/RoleBasedRoute.jsx`

**Usage:**

```javascript
import RoleBasedRoute from "@/components/RoleBasedRoute";
import { USER_ROLES } from "@/constatnts/roles";

// Single role
<Route 
  path="/vendor/dashboard" 
  element={
    <RoleBasedRoute requiredRole={USER_ROLES.VENDOR}>
      <VendorDashboard />
    </RoleBasedRoute>
  }
/>

// Multiple roles (any of the roles can access)
<Route 
  path="/admin/dashboard" 
  element={
    <RoleBasedRoute requiredRole={[USER_ROLES.ADMIN, USER_ROLES.USER]}>
      <Dashboard />
    </RoleBasedRoute>
  }
/>
```

**Props:**

- `children` (React.ReactNode) - Component to render if authorized
- `requiredRole` (string | string[]) - Single role or array of allowed roles
- `fallback` (React.ReactNode, optional) - Component to show if unauthorized

**Behavior:**

- Shows loader while checking authentication
- Redirects to login if not authenticated
- Redirects to home/appropriate page if role doesn't match
- Renders optional fallback component if provided

### 2. useRoleCheck Hook

Custom hook to check user role and permissions within components.

**Location:** `src/hooks/useRoleCheck.js`

**Usage:**

```javascript
import { useRoleCheck } from "@/hooks/useRoleCheck";

function MyComponent() {
  const { 
    isVendor, 
    hasRole, 
    hasPermission 
  } = useRoleCheck();

  if (isVendor()) {
    return <VendorContent />;
  }

  return <UserContent />;
}
```

**Available Methods:**

- `hasRole(role)` - Check if user has specific role
- `hasAnyRole(roles)` - Check if user has any of the roles
- `hasAllRoles(roles)` - Check if user has all roles
- `hasPermission(permission)` - Check if user has specific permission
- `isUser()` - Shortcut to check if user is regular user
- `isVendor()` - Shortcut to check if user is vendor
- `isAdmin()` - Shortcut to check if user is admin

**Returns:**

```javascript
{
  user,                    // Current user object
  isAuthenticated,         // Is user logged in
  hasRole,                 // Function
  hasAnyRole,              // Function
  hasAllRoles,             // Function
  hasPermission,           // Function
  isUser,                  // Function
  isVendor,                // Function
  isAdmin                  // Function
}
```

### 3. Role Utility Functions

Helper functions for role-related operations.

**Location:** `src/utils/roleUtils.js`

**Available Functions:**

```javascript
import { 
  userHasRole,
  userHasAnyRole,
  isUser,
  isVendor,
  isAdmin,
  getRoleDisplayName,
  getHomeRouteByRole,
  isProtectedRoute,
  canAccessRoute
} from "@/utils/roleUtils";

// Check role
userHasRole(user, USER_ROLES.VENDOR); // true/false
userHasAnyRole(user, [USER_ROLES.VENDOR, USER_ROLES.ADMIN]); // true/false

// Shortcut checks
isVendor(user); // true/false
isAdmin(user); // true/false

// Get display name
getRoleDisplayName(USER_ROLES.VENDOR); // "Venue Partner"

// Navigation
getHomeRouteByRole(user, ROUTES); // "/vendor/dashboard"

// Route access
isProtectedRoute("/vendor/dashboard", ROUTES); // true
canAccessRoute("/vendor/dashboard", user.role, ROUTES); // true/false
```

## Routes by Role

### Public Routes (Accessible to all)

- `/` - Home
- `/login` - Login
- `/signup` - Sign up
- `/register` - Register
- `/verify-otp` - OTP Verification
- `/forgot-password` - Forgot password
- `/reset-password` - Reset password

### User Routes (USER role only)

- `/user/venues` - Browse venues
- `/user/venue/:id` - Venue details
- `/user/profile` - User profile

### Vendor Routes (VENDOR role only)

- `/vendor/dashboard` - Dashboard
- `/vendor/venues` - Venue list
- `/vendor/bookings` - Booking list
- `/vendor/add-venue` - Add new venue
- `/vendor/profile` - Vendor profile
- `/vendor/settings` - Settings

### Admin Routes (ADMIN role only)

- `/admin/dashboard` - Dashboard
- `/admin/users` - User management
- `/admin/vendors` - Vendor management
- `/admin/venues` - Venue management
- `/admin/bookings` - Booking management
- `/admin/payments` - Payment management
- `/admin/settings` - Settings

## Implementation Example

### App.jsx Setup

```javascript
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "@/constatnts/routes";
import { USER_ROLES } from "@/constatnts/roles";
import RoleBasedRoute from "@/components/RoleBasedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.PUBLIC.HOME} element={<Home />} />
        <Route path={ROUTES.PUBLIC.LOGIN} element={<Login />} />

        {/* User Routes */}
        <Route
          path={ROUTES.USER.BROWSE_VENUES}
          element={
            <RoleBasedRoute requiredRole={USER_ROLES.USER}>
              <BrowseVenues />
            </RoleBasedRoute>
          }
        />

        {/* Vendor Routes */}
        <Route
          path={ROUTES.VENDOR.DASHBOARD}
          element={
            <RoleBasedRoute requiredRole={USER_ROLES.VENDOR}>
              <VendorDashboard />
            </RoleBasedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path={ROUTES.ADMIN.DASHBOARD}
          element={
            <RoleBasedRoute requiredRole={USER_ROLES.ADMIN}>
              <AdminDashboard />
            </RoleBasedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
```

### Component Usage

```javascript
import { useRoleCheck } from "@/hooks/useRoleCheck";
import { getRoleDisplayName } from "@/utils/roleUtils";

function UserProfile() {
  const { user, isVendor, hasPermission } = useRoleCheck();

  if (!user) return null;

  return (
    <div>
      <h1>{getRoleDisplayName(user.role)}</h1>
      
      {isVendor() && hasPermission("venue_create") && (
        <button>Add Venue</button>
      )}
    </div>
  );
}
```

## Conditional UI Rendering

```javascript
import { useRoleCheck } from "@/hooks/useRoleCheck";

function Dashboard() {
  const { isVendor, isAdmin, isUser } = useRoleCheck();

  return (
    <div>
      {isVendor() && <VendorDashboard />}
      {isAdmin() && <AdminDashboard />}
      {isUser() && <UserDashboard />}
    </div>
  );
}
```

## Permission System

The system supports role-based permissions. Permissions are defined in `roles.js`:

```javascript
export const ROLE_PERMISSIONS = {
  [USER_ROLES.USER]: ["user_read", "venue_read", "booking_create"],
  [USER_ROLES.VENDOR]: ["vendor_read", "venue_create", "venue_update", "booking_read"],
  [USER_ROLES.ADMIN]: ["admin_read", "user_manage", "vendor_manage", "venue_manage"],
};
```

Check permissions using:

```javascript
const { hasPermission } = useRoleCheck();

if (hasPermission("venue_create")) {
  // Show venue creation button
}
```

## Authentication Flow

1. User logs in with credentials
2. Backend returns user object with role
3. Role is stored in Redux auth state
4. RoleBasedRoute checks user role on protected routes
5. If role doesn't match, user is redirected appropriately
6. useRoleCheck hook allows components to conditionally render

## Error Handling

The system handles various scenarios:

- **Not Authenticated**: Redirects to login page
- **Wrong Role**: Redirects to home page or user's role-specific dashboard
- **No User Data**: Redirects to home page
- **Loading**: Shows spinner while checking authentication

## Best Practices

1. **Always wrap protected routes** with RoleBasedRoute
2. **Use useRoleCheck hook** for conditional UI rendering
3. **Use role utility functions** for role-related logic outside components
4. **Update backend routes** with role-based middleware
5. **Keep roles consistent** between frontend and backend
6. **Test all role combinations** to ensure proper access control
7. **Handle permission changes** gracefully (e.g., when user role is updated)

## Future Enhancements

- [ ] Add granular permission system
- [ ] Implement permission-based route guards
- [ ] Add role transition middleware
- [ ] Implement role-based API request interception
- [ ] Add audit logging for role-based access
- [ ] Implement time-based role restrictions
- [ ] Add role delegation system
