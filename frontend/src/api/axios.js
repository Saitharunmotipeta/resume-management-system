// src/api/axios.js
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  withCredentials: false, // ✅ using JWT in headers, not cookies
});

// Request interceptor → attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token'); // ✅ same storage as AuthContext
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

// Response interceptor → handle unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalid/expired → clear storage and redirect
      localStorage.removeItem('access_token');

      // Prevent infinite redirect loop
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Log errors in development for easier debugging
    if (import.meta.env.MODE === 'development') {
      console.error("API error:", error.response || error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
