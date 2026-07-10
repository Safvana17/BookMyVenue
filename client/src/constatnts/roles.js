export const USER_ROLES = {
  USER: "user",
  VENDOR: "vendor",
  ADMIN: "admin",
};

export const ROLE_PERMISSIONS = {
  [USER_ROLES.USER]: ["user_read", "venue_read", "booking_create"],
  [USER_ROLES.VENDOR]: ["vendor_read", "venue_create", "venue_update", "booking_read"],
  [USER_ROLES.ADMIN]: ["admin_read", "user_manage", "vendor_manage", "venue_manage"],
};
