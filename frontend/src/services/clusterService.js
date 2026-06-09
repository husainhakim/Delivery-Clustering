import api from './api';

export const generateClusters = async () => {
  const { data } = await api.post('/clusters/generate');
  return data;
};

export const getClusters = async () => {
  const { data } = await api.get('/clusters');
  return data;
};

export const getReports = async () => {
  const { data } = await api.get('/reports');
  return data;
};
