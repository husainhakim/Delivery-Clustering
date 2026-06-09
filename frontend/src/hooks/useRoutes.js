import { useState, useEffect, useCallback } from 'react';
import { getRoutes, addRoute, deleteRoute } from '../services/routeService';
import toast from 'react-hot-toast';

export const useRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRoutes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRoutes();
      setRoutes(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch routes');
    } finally {
      setLoading(false);
    }
  }, []);

  const createRoute = useCallback(async (routeData) => {
    try {
      await addRoute(routeData);
      toast.success('Route connected successfully!');
      await fetchRoutes();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add route');
      return false;
    }
  }, [fetchRoutes]);

  const removeRoute = useCallback(async (id) => {
    try {
      await deleteRoute(id);
      toast.success('Route removed successfully!');
      await fetchRoutes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove route');
    }
  }, [fetchRoutes]);

  useEffect(() => { fetchRoutes(); }, [fetchRoutes]);

  return { routes, loading, fetchRoutes, createRoute, removeRoute };
};
