import React, { useEffect, useState } from 'react';
import StatCard from '../components/ui/StatCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { MapPin, Route, Network, AlertCircle, TrendingUp, CloudLightning } from 'lucide-react';
import { getZones } from '../services/zoneService';
import { getRoutes } from '../services/routeService';
import { getClusters } from '../services/clusterService';
import { useAuth } from '../hooks/useAuth';
import MapComponent from '../components/MapComponent';
import OperationsPanel from '../components/OperationsPanel';
import SimulatorModal from '../components/SimulatorModal';

const DashboardPage = () => {
  const { admin } = useAuth();
  const [stats, setStats] = useState({ zones: 0, routes: 0, clusters: 0, isolated: 0 });
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  const load = async () => {
    try {
      const [zonesRes, routesRes, clusterRes] = await Promise.all([
        getZones(), getRoutes(), getClusters(),
      ]);
      const cls = clusterRes.clusters || [];
      const iso = cls.filter(c => c.isIsolated).length;
      setStats({
        zones: zonesRes.count || 0,
        routes: routesRes.count || 0,
        clusters: cls.length,
        isolated: iso,
      });
      setClusters(cls);
    } catch {
      // silently handle on fresh load
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px' }}>
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="page-enter">
      {/* Welcome banner */}
      <div
        className="glass-card"
        style={{
          padding: '24px 32px',
          marginBottom: '28px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
          border: '1px solid rgba(99,102,241,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h2 style={{ color: '#f1f5f9', fontWeight: 800, fontSize: '1.3rem', margin: 0 }}>
            Welcome back, {admin?.name || 'Admin'}! 👋
          </h2>
          <p style={{ color: '#94a3b8', margin: '4px 0 0', fontSize: '0.875rem' }}>
            Smart Delivery Zone Clustering · Live Dashboard
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            className="btn-primary bg-yellow-600 hover:bg-yellow-700 text-white" 
            style={{ background: '#ca8a04' }}
            onClick={() => setIsSimulatorOpen(true)}
          >
            <CloudLightning size={16} /> Simulate Disruption
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} color="#6366f1" />
            <span style={{ color: '#6366f1', fontSize: '0.875rem', fontWeight: 600 }}>System Active</span>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="dashboard-stats-grid mb-6">
        <StatCard title="Total Zones" value={stats.zones} icon={MapPin}
          gradient="linear-gradient(135deg, #6366f1, #8b5cf6)" delay={0}
          subtitle="Delivery regions" />
        <StatCard title="Total Routes" value={stats.routes} icon={Route}
          gradient="linear-gradient(135deg, #10b981, #059669)" delay={100}
          subtitle="Zone connections" />
        <StatCard title="Total Clusters" value={stats.clusters} icon={Network}
          gradient="linear-gradient(135deg, #f59e0b, #d97706)" delay={200}
          subtitle="Connected groups" />
        <StatCard title="Isolated Zones" value={stats.isolated} icon={AlertCircle}
          gradient="linear-gradient(135deg, #ef4444, #dc2626)" delay={300}
          subtitle="No connections" />
      </div>

      {/* Map & Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <MapComponent clusters={clusters} />
        </div>
        <div className="lg:col-span-1">
          <OperationsPanel />
        </div>
      </div>

      <SimulatorModal 
        isOpen={isSimulatorOpen} 
        onClose={() => setIsSimulatorOpen(false)} 
        onSimulated={() => {
          setLoading(true);
          load();
        }}
      />
    </div>
  );
};

export default DashboardPage;
