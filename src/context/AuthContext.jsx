import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));

      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }

    setLoading(false);
  }, []);

  const login = async (identifier, password) => {
    try {
      const response = await axios.post('http://localhost:8000/api/auth/login', {
        identifier, // Can be email or phone number
        password,
      });

      if (response.data.success) {
        const { user: userData, token: userToken } = response.data.data;

        // Store in localStorage
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userData));

        // Update state
        setToken(userToken);
        setUser(userData);

        // Set default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;

        return { success: true, user: userData };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.',
      };
    }
  };

  const getDefaultRoute = (role) => {
    switch (role) {
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
      const response = await axios.post('http://localhost:8000/api/auth/register', userData);

      if (response.data.success) {
        const { user: newUser, token: userToken } = response.data.data;

        // Store in localStorage
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(newUser));

        // Update state
        setToken(userToken);
        setUser(newUser);

        // Set default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;

        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.',
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

    // Remove authorization header
    delete axios.defaults.headers.common['Authorization'];
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
