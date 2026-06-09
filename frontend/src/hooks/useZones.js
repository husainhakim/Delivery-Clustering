import { useState, useEffect, useCallback } from 'react';
import { getZones, addZone, deleteZone } from '../services/zoneService';
import toast from 'react-hot-toast';

export const useZones = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchZones = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getZones();
      setZones(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch zones');
    } finally {
      setLoading(false);
    }
  }, []);

  const createZone = useCallback(async (zoneData) => {
    try {
      await addZone(zoneData);
      toast.success('Zone added successfully!');
      await fetchZones();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add zone');
      return false;
    }
  }, [fetchZones]);

  const removeZone = useCallback(async (id) => {
    try {
      await deleteZone(id);
      toast.success('Zone deleted successfully!');
      await fetchZones();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete zone');
    }
  }, [fetchZones]);

  useEffect(() => { fetchZones(); }, [fetchZones]);

  return { zones, loading, fetchZones, createZone, removeZone };
};
