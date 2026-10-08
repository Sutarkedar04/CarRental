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
      const data = await authService.getMe(); // GET /api/auth/me
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        // Server responded 200 but said "no user" — clear stale session
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      const status = error?.response?.status ?? error?.status;

      // Only log out on explicit auth failures.
      // Suspended account (403) or invalid/expired token (401).
      if (status === 401 || status === 403) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
      } else {
        // Network error / timeout / CORS hiccup — keep the cached user.
        // The token is still in localStorage and will be retried on the
        // next API call. Don't kick the user out just because the backend
        // was briefly unreachable.
        console.warn('Session check failed (non-auth):', error?.message);
      }
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