import { useState, useCallback } from 'react';
import { sendOtp as sendOtpService, verifyOtp as verifyOtpService } from '../services/authService';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));
  const [admin, setAdmin] = useState(() => {
    try { return JSON.parse(localStorage.getItem('admin')); }
    catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendOtp = useCallback(async (email) => {
    setLoading(true);
    setError(null);
    try {
      await sendOtpService(email);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to send OTP';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyOtp = useCallback(async (email, otp) => {
    setLoading(true);
    setError(null);
    try {
      const data = await verifyOtpService(email, otp);
      localStorage.setItem('token', data.token);
      localStorage.setItem('admin', JSON.stringify(data.admin));
      setIsAuthenticated(true);
      setAdmin(data.admin);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid OTP';
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

  return { isAuthenticated, admin, loading, error, sendOtp, verifyOtp, logout };
};
