import api from './api';

export const getRoutes = async () => {
  const { data } = await api.get('/routes');
  return data;
};

export const addRoute = async (routeData) => {
  const { data } = await api.post('/routes', routeData);
  return data;
};

export const deleteRoute = async (id) => {
  const { data } = await api.delete(`/routes/${id}`);
  return data;
};
