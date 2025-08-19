import React, { createContext, useContext, useState } from 'react';
import api from '../api/axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return { username: decoded.sub, role: decoded.role, token };
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    setLoading(true); setError(null);
    try {
      const form = new URLSearchParams();
      form.append('username', username);
      form.append('password', password);

      const { data } = await api.post('/auth/login', form);

      localStorage.setItem('access_token', data.access_token);
      const decoded = jwtDecode(data.access_token);
      const info = { username: decoded.sub, role: decoded.role, token: data.access_token };
      setUser(info);
      return info;
    } catch (e) {
      setError(e?.response?.data?.detail || 'Login failed');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true); setError(null);
    try {
      const { data } = await api.post('/auth/register', payload);
      localStorage.setItem('access_token', data.access_token);
      const decoded = jwtDecode(data.access_token);
      const info = { username: decoded.sub, role: decoded.role, token: data.access_token };
      setUser(info);
      return info;
    } catch (e) {
      setError(e?.response?.data?.detail || 'Register failed');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      // ✅ Remove from local storage
      localStorage.removeItem('access_token');
      
      // ✅ Clear default Authorization header in axios
      delete api.defaults.headers.common['Authorization'];
      
      // ✅ Reset user state
      setUser(null);

      // ✅ (Optional) Clear all storage if you want a full wipe
      // localStorage.clear();
      // sessionStorage.clear();

      // ✅ Redirect to login page
      window.location.href = "/login";
    } catch (e) {
      console.error("Error during logout", e);
    }
  };


  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
