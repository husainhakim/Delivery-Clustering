import React, { useEffect, useState } from 'react';
import { getReports } from '../services/clusterService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Download, Award, Minimize2, Network, AlertCircle } from 'lucide-react';
import { getClusterColor } from '../utils/clusterColors';
import { exportToCSV, flattenClustersForCSV } from '../utils/csvExport';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const ReportsPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getReports();
        setReport(data.data);
      } catch {
        toast.error('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleExport = () => {
    if (!report?.allClusters) return;
    const rows = flattenClustersForCSV(report.allClusters);
    exportToCSV(rows, 'cluster_report.csv');
    toast.success('CSV exported!');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px' }}>
        <LoadingSpinner size="lg" text="Loading reports..." />
      </div>
    );
  }

  const barData = (report?.clusterSizeDistribution || []).map((item, i) => ({
    ...item,
    fill: getClusterColor(i, item.isIsolated).bg,
  }));

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="flex-header">
        <div>
          <h2 style={{ color: '#f1f5f9', fontWeight: 800, margin: 0 }}>Reports</h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '4px 0 0' }}>Cluster analytics and export</p>
        </div>
        <button className="btn-primary" id="export-csv-btn" onClick={handleExport}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Summary cards */}
      <div className="dashboard-stats-grid">
        {[
          { label: 'Total Clusters', value: report?.totalClusters, icon: Network, color: '#6366f1' },
          { label: 'Isolated Zones', value: report?.isolatedZones, icon: AlertCircle, color: '#ef4444' },
          { label: 'Largest Cluster', value: report?.largestCluster?.size + ' zones', icon: Award, color: '#10b981' },
          { label: 'Smallest Cluster', value: report?.smallestCluster?.size + ' zones', icon: Minimize2, color: '#f59e0b' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: `${color}20`, padding: '10px', borderRadius: '10px', flexShrink: 0 }}>
              <Icon size={22} color={color} />
            </div>
            <div>
              <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>{value ?? '—'}</p>
              <p style={{ fontSize: '0.72rem', color: '#64748b', margin: 0 }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts + Table */}
      <div className="dashboard-charts-grid">
        {/* Cluster size bar chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ color: '#f1f5f9', fontWeight: 700, margin: '0 0 20px', fontSize: '1rem' }}>
            Cluster Size Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} angle={-30} textAnchor="end" interval={0} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ background: '#0f1629', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '10px', color: '#f1f5f9', fontSize: '0.8rem' }} />
              <Bar dataKey="size" radius={[6, 6, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Highlights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { title: '🏆 Largest Cluster', cluster: report?.largestCluster, colorIdx: 0 },
            { title: '🔹 Smallest Cluster', cluster: report?.smallestCluster, colorIdx: 2 },
          ].map(({ title, cluster, colorIdx }) => {
            if (!cluster) return null;
            const color = getClusterColor(colorIdx, cluster.isIsolated);
            return (
              <div key={title} className="glass-card" style={{ padding: '20px', borderColor: color.border }}>
                <p style={{ fontWeight: 700, color: '#94a3b8', fontSize: '0.8rem', margin: '0 0 10px' }}>{title}</p>
                <p style={{ fontWeight: 800, color: color.text, fontSize: '1.1rem', margin: '0 0 8px' }}>
                  Cluster {cluster.clusterId} — {cluster.size} zones
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {cluster.zones?.map((z) => (
                    <span key={z._id} style={{
                      background: color.light, color: color.text,
                      border: `1px solid ${color.border}`, padding: '2px 8px',
                      borderRadius: '20px', fontSize: '0.7rem', fontWeight: 600,
                    }}>
                      {z.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full cluster table */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
          <h3 style={{ color: '#f1f5f9', fontWeight: 700, margin: 0, fontSize: '1rem' }}>All Clusters</h3>
        </div>
        <div className="table-responsive">
          <table className="table-dark">
          <thead>
            <tr>
              <th>Cluster</th>
              <th>Type</th>
              <th>Zones</th>
              <th>Zone Names</th>
            </tr>
          </thead>
          <tbody>
            {(report?.allClusters || []).map((cluster, i) => {
              const color = getClusterColor(i, cluster.isIsolated);
              return (
                <tr key={cluster.clusterId}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color.bg }} />
                      <span style={{ color: '#f1f5f9', fontWeight: 600 }}>
                        {cluster.isIsolated ? 'Isolated' : `Cluster ${cluster.clusterId}`}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={cluster.isIsolated ? 'badge badge-isolated' : 'badge badge-connected'}>
                      {cluster.isIsolated ? 'Isolated' : 'Connected'}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: color.text }}>{cluster.size}</td>
                  <td style={{ maxWidth: '400px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {cluster.zones.map((z) => (
                        <span key={z._id} style={{
                          background: color.light, color: color.text, border: `1px solid ${color.border}`,
                          padding: '2px 7px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600,
                        }}>
                          {z.name}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
