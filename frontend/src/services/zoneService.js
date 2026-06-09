import api from './api';

export const getZones = async () => {
  const { data } = await api.get('/zones');
  return data;
};

export const addZone = async (zoneData) => {
  const { data } = await api.post('/zones', zoneData);
  return data;
};

export const deleteZone = async (id) => {
  const { data } = await api.delete(`/zones/${id}`);
  return data;
};
