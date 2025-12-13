/**
 * Centralized role management utility
 * 
 * To change role keys in the future, ONLY update the ROLE_KEYS object below.
 * All role-related logic throughout the app uses these utilities.
 */

// ==================== ROLE KEYS (Server Values) ====================
// Change these values when server role keys change
export const ROLE_KEYS = {
  ADMIN: 'admin',
  MEMBER: 'member',
} as const;

// ==================== TYPES ====================
export type UserRole = typeof ROLE_KEYS[keyof typeof ROLE_KEYS];

// Union types for specific use cases
export type InvitableRole = typeof ROLE_KEYS.ADMIN | typeof ROLE_KEYS.MEMBER;
export type AdminRole = typeof ROLE_KEYS.ADMIN;

// ==================== ROLE CHECKS ====================

/**
 * Check if a role is an admin role
 */
export const isAdminRole = (role: string | undefined | null): boolean => {
  if (!role) return false;
  const lowerRole = role.toLowerCase();
  return lowerRole === ROLE_KEYS.ADMIN.toLowerCase();
};

/**
 * Check if a role is member
 */
export const isMemberRole = (role: string | undefined | null): boolean => {
  if (!role) return false;
  return role.toLowerCase() === ROLE_KEYS.MEMBER.toLowerCase();
};

/**
 * Check if current user role can manage a target member role
 * In this system: Only admins can manage members
 */
export const canManageRole = (currentRole: string | undefined | null, targetRole: string | undefined | null): boolean => {
  if (!currentRole || !targetRole) return false;
  
  // Only admins can manage anyone
  if (!isAdminRole(currentRole)) return false;
  
  // Admins can manage all members
  return isMemberRole(targetRole);
};

// ==================== ROLE DISPLAY MAPPING ====================

/**
 * Get display label for a role
 */
export const getRoleLabel = (role: string | undefined | null): string => {
  if (!role) return 'Member';
  
  const lowerRole = role.toLowerCase();
  
  if (lowerRole === ROLE_KEYS.ADMIN.toLowerCase()) {
    return 'Admin';
  }
  return 'Member';
};

/**
 * Get badge variant for a role (used in UI components)
 */
export const getRoleBadgeVariant = (role: string | undefined | null): 'default' | 'secondary' | 'outline' => {
  if (!role) return 'outline';
  
  const lowerRole = role.toLowerCase();
  
  if (lowerRole === ROLE_KEYS.ADMIN.toLowerCase()) {
    return 'default';
  }
  return 'outline';
};

// ==================== ROLE ARRAYS ====================

/**
 * Get all invitable roles (for dropdowns, forms, etc.)
 * Returns array of { value, label } for use with Select components
 */
export const getInvitableRoles = () => [
  { value: ROLE_KEYS.MEMBER, label: 'Member' },
  { value: ROLE_KEYS.ADMIN, label: 'Admin' },
] as const;

/**
 * Get all admin roles as array
 */
export const getAdminRoles = (): readonly string[] => [
  ROLE_KEYS.ADMIN,
] as const;
