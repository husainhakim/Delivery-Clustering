import { useState, useCallback } from 'react';
import { generateClusters, getClusters } from '../services/clusterService';
import toast from 'react-hot-toast';

export const useClusters = () => {
  const [clusters, setClusters] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const fetchClusters = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getClusters();
      setClusters(data.clusters || []);
      setStats(data.stats || null);
      setGenerated(true);
    } catch (err) {
      toast.error('Failed to fetch clusters');
    } finally {
      setLoading(false);
    }
  }, []);

  const runGenerate = useCallback(async () => {
    setLoading(true);
    try {
      const data = await generateClusters();
      setClusters(data.clusters || []);
      setStats(data.stats || null);
      setGenerated(true);
      toast.success(`Clusters generated! Found ${data.stats?.total || 0} clusters.`);
      return data;
    } catch (err) {
      toast.error('Cluster generation failed');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { clusters, stats, loading, generated, fetchClusters, runGenerate };
};
