import React, { useEffect, useState } from 'react';
import StatCard from '../components/ui/StatCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { MapPin, Route, Network, AlertCircle, TrendingUp } from 'lucide-react';
import { getZones } from '../services/zoneService';
import { getRoutes } from '../services/routeService';
import { getClusters } from '../services/clusterService';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import { getClusterColor } from '../utils/clusterColors';
import { useAuth } from '../hooks/useAuth';

const DashboardPage = () => {
  const { admin } = useAuth();
  const [stats, setStats] = useState({ zones: 0, routes: 0, clusters: 0, isolated: 0 });
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    load();
  }, []);

  // Pie chart data
  const pieData = clusters.slice(0, 8).map((c, i) => ({
    name: c.isIsolated ? `Isolated: ${c.zones[0]?.name}` : `Cluster ${c.clusterId}`,
    value: c.size,
    color: getClusterColor(i, c.isIsolated).bg,
  }));

  // Bar chart data
  const barData = [
    { name: 'Connected', value: stats.clusters - stats.isolated, fill: '#6366f1' },
    { name: 'Isolated', value: stats.isolated, fill: '#ef4444' },
  ];

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
            Smart Delivery Zone Clustering · Union-Find DSU Demo
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={20} color="#6366f1" />
          <span style={{ color: '#6366f1', fontSize: '0.875rem', fontWeight: 600 }}>System Active</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="dashboard-stats-grid">
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

      {/* Charts */}
      <div className="dashboard-charts-grid">
        {/* Pie Chart */}
        <div className="glass-card animate-fadeInUp delay-400" style={{ padding: '24px' }}>
          <h3 style={{ color: '#f1f5f9', fontWeight: 700, marginTop: 0, marginBottom: '20px', fontSize: '1rem' }}>
            Cluster Size Distribution
          </h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${value}`} labelLine={false}>
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} stroke="rgba(0,0,0,0.3)" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#0f1629', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '10px', color: '#f1f5f9' }}
                  formatter={(val, name) => [val + ' zones', name]}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#475569' }}>
              <Network size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
              <p>Generate clusters to see distribution</p>
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="glass-card animate-fadeInUp delay-400" style={{ padding: '24px' }}>
          <h3 style={{ color: '#f1f5f9', fontWeight: 700, marginTop: 0, marginBottom: '20px', fontSize: '1rem' }}>
            Connected vs Isolated Zones
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{ background: '#0f1629', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '10px', color: '#f1f5f9' }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
