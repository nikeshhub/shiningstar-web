import React from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * Component wrapper that conditionally renders children based on user roles
 * @param {string|string[]} allowedRoles - Role(s) that can see this component
 * @param {string} module - Optional module name for permission checking
 * @param {string} action - Optional action name for permission checking
 * @param {React.ReactNode} children - Content to render if authorized
 * @param {React.ReactNode} fallback - Optional content to render if not authorized
 */
export function RoleBasedAccess({
  allowedRoles,
  module,
  action,
  children,
  fallback = null
}) {
  const { user, hasRole, hasPermission } = useAuth();

  if (!user) {
    return fallback;
  }

  // Check role-based access
  if (allowedRoles) {
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!rolesArray.includes(user.role)) {
      return fallback;
    }
  }

  // Check permission-based access
  if (module && action) {
    if (!hasPermission(module, action)) {
      return fallback;
    }
  }

  return <>{children}</>;
}

/**
 * Hook for checking if user has specific role(s)
 */
export function useHasRole(...roles) {
  const { hasRole } = useAuth();
  return hasRole(...roles);
}

/**
 * Hook for checking if user has permission for a module action
 */
export function useHasPermission(module, action) {
  const { hasPermission } = useAuth();
  return hasPermission(module, action);
}

/**
 * Hook to get current user role
 */
export function useUserRole() {
  const { user } = useAuth();
  return user?.role || null;
}

/**
 * Higher-order component for role-based rendering
 */
export function withRoleAccess(Component, allowedRoles) {
  return function RoleProtectedComponent(props) {
    return (
      <RoleBasedAccess allowedRoles={allowedRoles}>
        <Component {...props} />
      </RoleBasedAccess>
    );
  };
}

export default RoleBasedAccess;
