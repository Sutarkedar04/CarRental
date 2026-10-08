// src/services/api.js
import axios from 'axios';

const isProd = import.meta.env.PROD;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ── Request interceptor ─────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    if (!isProd) {
      console.log(`API → ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => {
    if (!isProd) {
      console.log(`API ← ${response.status} ${response.config?.url}`);
    }
    return response;
  },
  (error) => {
    if (!isProd) {
      console.error('API error:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url,
      });
    }
    return Promise.reject(error);
  }
);

export default api;