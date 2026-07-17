// src/services/authService.js
import api from './api';

const authService = {
  // Register user
  register: async (userData) => {
    try {
      console.log('Registering user:', userData);
      const response = await api.post('/auth/register', userData);
      console.log('Registration response:', response.data);
      
      // Store token if provided
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error.response?.data || { 
        success: false, 
        message: error.message || 'Network error during registration' 
      };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      console.log('Logging in with:', credentials.email);
      const response = await api.post('/auth/login', credentials);
      console.log('Login response:', response.data);
      
      // Store token and user if provided
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('User stored with role:', response.data.user.role);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data || { 
        success: false, 
        message: error.message || 'Network error during login' 
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

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/me');
      console.log('Profile response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error.response?.data || { 
        success: false, 
        message: error.message || 'Network error' 
      };
    }
  },

  // Check if user is admin
  checkAdmin: async () => {
    try {
      const response = await api.get('/auth/check-admin');
      return response.data;
    } catch (error) {
      console.error('Check admin error:', error);
      throw error.response?.data || { 
        success: false, 
        message: error.message || 'Network error' 
      };
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      // Clear storage even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error.response?.data || { 
        success: false, 
        message: error.message || 'Network error' 
      };
    }
  },
};

export default authService;
