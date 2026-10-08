// src/services/authService.js
import api from './api';

const isProd = import.meta.env.PROD;

const authService = {
  register: async (userData) => {
    try {
      if (!isProd) console.log('Registering user:', userData.email);
      const response = await api.post('/auth/register', userData);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: error.message || 'Network error during registration',
      };
    }
  },

  login: async (credentials) => {
    try {
      if (!isProd) console.log('Logging in with:', credentials.email);
      const response = await api.post('/auth/login', credentials);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: error.message || 'Network error during login',
      };
    }
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token, password) => {
    const response = await api.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  },

  // ⭐ Used by AuthContext on every page load
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
    // Note: we deliberately do NOT catch here, so AuthContext can
    // inspect error.response.status (401 vs 403 vs network error).
  },

  // Kept for compatibility — same endpoint as getMe
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  checkAdmin: async () => {
    const response = await api.get('/auth/check-admin');
    return response.data;
  },

  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return response.data;
    } catch (error) {
      // Clear local storage regardless of server response
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error.response?.data || {
        success: false,
        message: error.message || 'Network error',
      };
    }
  },
};

export default authService;