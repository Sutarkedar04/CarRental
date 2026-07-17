// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

const getStoredUser = () => {
  const storedUser = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  if (!storedUser || !token) return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(true); // ✅ start true — we're about to verify

  const isDealer = useMemo(() => user?.role === 'dealer', [user]);
  const isVerifiedDealer = useMemo(() =>
    user?.role === 'dealer' && user?.dealerStatus === 'verified', [user]);
  const isAdmin = useMemo(() =>
    user?.role === 'admin' || user?.role === 'super_admin', [user]);
  const isSuperAdmin = useMemo(() => user?.role === 'super_admin', [user]);

  // ✅ On app load, re-check the session against the server.
  // Catches: suspended accounts, deleted accounts, expired/invalidated tokens,
  // and role changes made by an admin while the user was already logged in.
  useEffect(() => {
    const verifySession = async () => {
      const cachedUser = getStoredUser();
      if (!cachedUser) {
        setLoading(false);
        return;
      }

      try {
        const data = await authService.getMe(); // hits GET /api/auth/me
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          // server says no — clear stale session
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (error) {
        // 401/403 (invalid token OR suspended, depending on your middleware) → log out locally
        console.warn('Session check failed:', error?.message);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      if (data.success && data.user) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      if (data.success && data.user) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: data.message || 'Registration failed' };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Registration failed'
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.warn('Logout request failed:', error);
    }
    localStorage.removeItem('user'); // ✅ also clear on logout
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    isAdmin,
    isSuperAdmin,
    isDealer,
    isVerifiedDealer,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};