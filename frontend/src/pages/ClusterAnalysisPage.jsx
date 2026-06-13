import React, { useEffect } from 'react';
import { useClusters } from '../hooks/useClusters';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Network, Zap, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { getClusterColor } from '../utils/clusterColors';

const ClusterCard = ({ cluster, index }) => {
  const color = getClusterColor(index, cluster.isIsolated);
  return (
    <div
      className="glass-card animate-fadeInUp"
      style={{
        padding: '20px',
        animationDelay: `${index * 80}ms`,
        borderColor: color.border,
        borderWidth: '1px',
        borderStyle: 'solid',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background accent */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '80px', height: '80px',
        background: color.bg,
        opacity: 0.06,
        borderRadius: '0 0 0 80px',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: color.bg }} />
            <span style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.95rem' }}>
              {cluster.isIsolated ? 'Isolated Zone' : `Cluster ${cluster.clusterId}`}
            </span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.78rem', margin: '4px 0 0' }}>
            {cluster.size} {cluster.size === 1 ? 'zone' : 'zones'}
          </p>
        </div>
        <span
          className={cluster.isIsolated ? 'badge badge-isolated' : 'badge badge-connected'}
          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          {cluster.isIsolated ? <AlertCircle size={12} /> : <CheckCircle size={12} />}
          {cluster.isIsolated ? 'Isolated' : 'Connected'}
        </span>
      </div>

      {/* Zone tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {cluster.zones.map((zone) => (
          <span
            key={zone._id}
            style={{
              background: color.light,
              color: color.text,
              border: `1px solid ${color.border}`,
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            {zone.name}
          </span>
        ))}
      </div>
    </div>
  );
};

const ClusterAnalysisPage = () => {
  const { clusters, stats, loading, generated, fetchClusters, runGenerate } = useClusters();

  useEffect(() => {
    if (!generated) fetchClusters();
  }, []);

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="flex-header">
        <div>
          <h2 style={{ color: '#f1f5f9', fontWeight: 800, margin: 0 }}>Cluster Analysis</h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '4px 0 0' }}>
            Union-Find algorithm groups connected delivery zones
          </p>
        </div>
        <button
          className="btn-primary"
          id="generate-clusters-btn"
          onClick={runGenerate}
          disabled={loading}
          style={{ padding: '12px 24px' }}
        >
          <Zap size={18} />
          {loading ? 'Running DSU...' : 'Generate Clusters'}
        </button>
      </div>

      {/* Stats row */}
      {stats && (
        <div className="dashboard-stats-grid">
          {[
            { label: 'Total Clusters', value: stats.total, icon: Network, color: '#6366f1' },
            { label: 'Isolated Zones', value: stats.isolated, icon: AlertCircle, color: '#ef4444' },
            { label: 'Connected Clusters', value: stats.connected, icon: CheckCircle, color: '#10b981' },
            { label: 'Total Zones', value: stats.totalZones, icon: Users, color: '#f59e0b' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: `${color}20`, padding: '8px', borderRadius: '8px' }}>
                <Icon size={20} color={color} />
              </div>
              <div>
                <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>{value}</p>
                <p style={{ fontSize: '0.73rem', color: '#64748b', margin: 0 }}>{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Clusters */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
          <LoadingSpinner size="lg" text="Running Union-Find algorithm..." />
        </div>
      ) : clusters.length === 0 ? (
        <div
          className="glass-card"
          style={{ padding: '80px', textAlign: 'center' }}
        >
          <Network size={60} style={{ color: '#334155', margin: '0 auto 16px', display: 'block' }} />
          <h3 style={{ color: '#64748b', fontWeight: 600 }}>No clusters yet</h3>
          <p style={{ color: '#475569', fontSize: '0.875rem' }}>
            Click <strong>Generate Clusters</strong> to run Union-Find on your zones and routes
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {clusters.map((cluster, i) => (
            <ClusterCard key={cluster.clusterId} cluster={cluster} index={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClusterAnalysisPage;
