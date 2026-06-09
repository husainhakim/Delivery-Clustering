import { useState, useCallback } from 'react';
import { login as loginService } from '../services/authService';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));
  const [admin, setAdmin] = useState(() => {
    try { return JSON.parse(localStorage.getItem('admin')); }
    catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginService(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('admin', JSON.stringify(data.admin));
      setIsAuthenticated(true);
      setAdmin(data.admin);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setIsAuthenticated(false);
    setAdmin(null);
  }, []);

  return { isAuthenticated, admin, loading, error, login, logout };
};
