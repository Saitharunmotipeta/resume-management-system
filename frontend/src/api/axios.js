// src/api/axios.js
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  withCredentials: false,
});

// Request interceptor → attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token'); // ✅ match AuthContext
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

// Response interceptor → handle unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalid/expired → clear storage and reload
      localStorage.removeItem('access_token');
      window.location.href = '/login'; // redirect to login page
    }
    return Promise.reject(error);
  }
);

export default api;
