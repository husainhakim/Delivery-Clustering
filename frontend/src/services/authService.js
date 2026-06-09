import api from './api';

export const sendOtp = async (email) => {
  const { data } = await api.post('/auth/send-otp', { email });
  return data;
};

export const verifyOtp = async (email, otp) => {
  const { data } = await api.post('/auth/verify-otp', { email, otp });
  return data;
};

export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};
