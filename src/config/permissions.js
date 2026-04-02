/**
 * Role-based permissions configuration
 * Defines what actions each role can perform on different modules
 */

export const ROLES = {
  ADMIN: 'Admin',
  TEACHER: 'Teacher',
  PARENT: 'Parent',
};

export const ACTIONS = {
  VIEW: 'view',
  CREATE: 'create',
  EDIT: 'edit',
  DELETE: 'delete',
  EXPORT: 'export',
  MANAGE: 'manage', // Full access
};

export const MODULES = {
  STUDENTS: 'students',
  FAMILIES: 'families',
  CLASSES: 'classes',
  SUBJECTS: 'subjects',
  TEACHERS: 'teachers',
  ATTENDANCE: 'attendance',
  EXAMS: 'exams',
  FEES: 'fees',
  INVENTORY: 'inventory',
  NOTIFICATIONS: 'notifications',
  TIMETABLE: 'timetable',
  TEACHER_ATTENDANCE: 'teacher_attendance',
  PROGRESS_REPORTS: 'progress_reports',
};

/**
 * Default permissions for each role
 * Admin has full access to everything
 * Teacher has limited access
 * Parent has view-only access to their children's data
 */
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: {
    // Admin has full access to all modules
    [MODULES.STUDENTS]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE, ACTIONS.EXPORT],
    [MODULES.FAMILIES]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE],
    [MODULES.CLASSES]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE],
    [MODULES.SUBJECTS]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE],
    [MODULES.TEACHERS]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE],
    [MODULES.ATTENDANCE]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.EXPORT],
    [MODULES.EXAMS]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE],
    [MODULES.FEES]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE, ACTIONS.EXPORT],
    [MODULES.INVENTORY]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE],
    [MODULES.NOTIFICATIONS]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.DELETE],
    [MODULES.TIMETABLE]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT],
    [MODULES.TEACHER_ATTENDANCE]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.EXPORT],
    [MODULES.PROGRESS_REPORTS]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT, ACTIONS.EXPORT],
  },

  [ROLES.TEACHER]: {
    // Teacher has limited access
    [MODULES.STUDENTS]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT],
    [MODULES.FAMILIES]: [], // No access
    [MODULES.CLASSES]: [ACTIONS.VIEW],
    [MODULES.SUBJECTS]: [ACTIONS.VIEW],
    [MODULES.TEACHERS]: [], // No access
    [MODULES.ATTENDANCE]: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.EDIT],
    [MODULES.EXAMS]: [ACTIONS.VIEW, ACTIONS.EDIT], // Can view and enter marks
    [MODULES.FEES]: [], // No access
    [MODULES.INVENTORY]: [], // No access
    [MODULES.NOTIFICATIONS]: [ACTIONS.VIEW],
    [MODULES.TIMETABLE]: [ACTIONS.VIEW],
    [MODULES.TEACHER_ATTENDANCE]: [], // No access
    [MODULES.PROGRESS_REPORTS]: [ACTIONS.VIEW, ACTIONS.CREATE],
  },

  [ROLES.PARENT]: {
    // Parent has view-only access to their children's data
    [MODULES.STUDENTS]: [ACTIONS.VIEW], // Only their children
    [MODULES.FAMILIES]: [ACTIONS.VIEW], // Only their family
    [MODULES.CLASSES]: [ACTIONS.VIEW],
    [MODULES.SUBJECTS]: [ACTIONS.VIEW],
    [MODULES.TEACHERS]: [ACTIONS.VIEW],
    [MODULES.ATTENDANCE]: [ACTIONS.VIEW], // Only their children
    [MODULES.EXAMS]: [ACTIONS.VIEW], // Only their children
    [MODULES.FEES]: [ACTIONS.VIEW], // Only their family
    [MODULES.INVENTORY]: [],
    [MODULES.NOTIFICATIONS]: [ACTIONS.VIEW],
    [MODULES.TIMETABLE]: [ACTIONS.VIEW],
    [MODULES.TEACHER_ATTENDANCE]: [],
    [MODULES.PROGRESS_REPORTS]: [ACTIONS.VIEW], // Only their children
  },
};

/**
 * Check if a role has permission for a specific action on a module
 * @param {string} role - User role
 * @param {string} module - Module name
 * @param {string} action - Action to check
 * @returns {boolean}
 */
export function hasPermission(role, module, action) {
  if (role === ROLES.ADMIN) return true; // Admin has full access

  const rolePermissions = ROLE_PERMISSIONS[role];
  if (!rolePermissions) return false;

  const modulePermissions = rolePermissions[module];
  if (!modulePermissions) return false;

  return modulePermissions.includes(action);
}

/**
 * Get all permissions for a role
 * @param {string} role - User role
 * @returns {object}
 */
export function getRolePermissions(role) {
  return ROLE_PERMISSIONS[role] || {};
}

/**
 * Check if user has any of the specified roles
 * @param {string} userRole - User's role
 * @param {string[]} allowedRoles - Array of allowed roles
 * @returns {boolean}
 */
export function hasRole(userRole, allowedRoles) {
  if (!userRole || !allowedRoles) return false;
  return allowedRoles.includes(userRole);
}

export default {
  ROLES,
  ACTIONS,
  MODULES,
  ROLE_PERMISSIONS,
  hasPermission,
  getRolePermissions,
  hasRole,
};
