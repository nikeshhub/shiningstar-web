import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLogin, useRegister } from '../hooks';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  useEffect(() => {
    // Check if user is already logged in
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const login = async (identifier, password) => {
    try {
      const data = await loginMutation.mutateAsync({ identifier, password });
      const { user: userData, token: userToken } = data;

      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(userToken);
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Login failed. Please try again.',
      };
    }
  };

  const getDefaultRoute = (role) => {
    switch (role) {
      case 'SuperAdmin':
        return '/superadmin';
      case 'Parent':
        return '/parent';
      case 'Teacher':
        return '/dashboard';
      case 'Admin':
        return '/dashboard';
      default:
        return '/dashboard';
    }
  };

  const register = async (userData) => {
    try {
      const data = await registerMutation.mutateAsync(userData);
      return { success: true, user: data.user };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Registration failed. Please try again.',
      };
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Clear state
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const hasPermission = (module, action) => {
    if (!user) return false;
    if (user.role === 'Admin') return true;

    const permissions = user.permissions || [];
    const modulePermission = permissions.find((p) => p.module === module);

    return modulePermission && modulePermission.actions.includes(action);
  };

  const hasRole = (...roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    hasPermission,
    hasRole,
    getDefaultRoute,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
