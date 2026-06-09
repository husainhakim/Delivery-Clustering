import React, { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { getZones } from '../services/zoneService';
import { getRoutes } from '../services/routeService';
import { generateClusters } from '../services/clusterService';
import { getClusterColor } from '../utils/clusterColors';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Zap, RefreshCw, Info } from 'lucide-react';
import toast from 'react-hot-toast';

// Custom node component
const ZoneNode = ({ data }) => {
  return (
    <div
      style={{
        background: data.color?.light || 'rgba(99,102,241,0.1)',
        border: `2px solid ${data.color?.bg || '#6366f1'}`,
        borderRadius: '12px',
        padding: '10px 16px',
        minWidth: '120px',
        textAlign: 'center',
        boxShadow: data.isIsolated
          ? `0 0 16px ${data.color?.bg}88, 0 0 30px ${data.color?.bg}44`
          : `0 0 10px ${data.color?.bg}44`,
        transition: 'all 0.4s ease',
      }}
    >
      <div style={{ fontWeight: 700, fontSize: '0.78rem', color: data.color?.text || '#a5b4fc' }}>
        {data.label}
      </div>
      <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '2px' }}>
        {data.zoneCode}
      </div>
      {data.clusterId && (
        <div style={{
          marginTop: '6px',
          fontSize: '0.6rem',
          background: `${data.color?.bg}33`,
          color: data.color?.text,
          borderRadius: '10px',
          padding: '2px 6px',
          fontWeight: 600,
        }}>
          {data.isIsolated ? 'ISOLATED' : `Cluster ${data.clusterId}`}
        </div>
      )}
    </div>
  );
};

const nodeTypes = { zoneNode: ZoneNode };

// Layout nodes in a circular arrangement
const layoutNodes = (zones) => {
  const n = zones.length;
  const radius = Math.max(200, n * 25);
  return zones.map((zone, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    return {
      id: zone._id,
      type: 'zoneNode',
      position: {
        x: 400 + radius * Math.cos(angle),
        y: 350 + radius * Math.sin(angle),
      },
      data: {
        label: zone.name,
        zoneCode: zone.zoneCode,
        city: zone.city,
        color: { bg: '#334155', light: 'rgba(51,65,85,0.3)', text: '#94a3b8', border: 'rgba(51,65,85,0.5)' },
        clusterId: null,
        isIsolated: false,
      },
    };
  });
};

const buildEdges = (routes) =>
  routes.map((route) => ({
    id: route._id,
    source: route.sourceZone._id || route.sourceZone,
    target: route.destinationZone._id || route.destinationZone,
    type: 'smoothstep',
    style: { stroke: 'rgba(99,102,241,0.5)', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
    animated: false,
  }));

const VisualizationPage = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [zonesData, setZonesData] = useState([]);
  const [routesData, setRoutesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [clustered, setClustered] = useState(false);
  const [clusterLegend, setClusterLegend] = useState([]);

  // Load zones and routes
  useEffect(() => {
    const load = async () => {
      try {
        const [zRes, rRes] = await Promise.all([getZones(), getRoutes()]);
        const zones = zRes.data || [];
        const routes = rRes.data || [];
        setZonesData(zones);
        setRoutesData(routes);
        setNodes(layoutNodes(zones));
        setEdges(buildEdges(routes));
      } catch {
        toast.error('Failed to load graph data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Reset to unclustered view
  const handleReset = () => {
    setNodes(layoutNodes(zonesData));
    setEdges(buildEdges(routesData));
    setClustered(false);
    setClusterLegend([]);
  };

  // Run Union-Find and animate coloring
  const handleRunUnionFind = async () => {
    if (running) return;
    setRunning(true);
    setClustered(false);

    try {
      // Reset to grey first
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          data: {
            ...n.data,
            color: { bg: '#334155', light: 'rgba(51,65,85,0.3)', text: '#94a3b8', border: 'rgba(51,65,85,0.5)' },
            clusterId: null,
            isIsolated: false,
          },
        }))
      );
      setEdges((eds) =>
        eds.map((e) => ({ ...e, animated: false, style: { stroke: 'rgba(99,102,241,0.4)', strokeWidth: 2 } }))
      );

      await new Promise((r) => setTimeout(r, 600));
      toast('🔄 Running Union-Find...', { icon: '⚙️' });

      // Fetch cluster data from backend (real DSU)
      const clusterData = await generateClusters();
      const clusters = clusterData.clusters || [];

      // Build zone→cluster map
      const zoneClusterMap = {};
      clusters.forEach((cluster, idx) => {
        cluster.zones.forEach((zone) => {
          zoneClusterMap[zone._id] = { cluster, idx };
        });
      });

      // Animate cluster coloring zone by zone with delay
      for (let ci = 0; ci < clusters.length; ci++) {
        const cluster = clusters[ci];
        const color = getClusterColor(ci, cluster.isIsolated);

        for (let zi = 0; zi < cluster.zones.length; zi++) {
          const zoneId = cluster.zones[zi]._id;
          await new Promise((r) => setTimeout(r, 180));

          setNodes((nds) =>
            nds.map((n) => {
              if (n.id !== zoneId) return n;
              return {
                ...n,
                data: {
                  ...n.data,
                  color,
                  clusterId: cluster.clusterId,
                  isIsolated: cluster.isIsolated,
                },
              };
            })
          );
        }
      }

      // Animate edges with cluster colors
      setEdges((eds) =>
        eds.map((e) => {
          const srcCluster = zoneClusterMap[e.source];
          const color = srcCluster ? getClusterColor(srcCluster.idx, srcCluster.cluster.isIsolated).bg : '#6366f1';
          return {
            ...e,
            animated: true,
            style: { stroke: color, strokeWidth: 2.5 },
            markerEnd: { type: MarkerType.ArrowClosed, color },
          };
        })
      );

      // Build legend
      const legend = clusters.map((c, i) => ({
        label: c.isIsolated ? `Isolated: ${c.zones[0]?.name}` : `Cluster ${c.clusterId} (${c.size} zones)`,
        color: getClusterColor(i, c.isIsolated),
        isIsolated: c.isIsolated,
      }));
      setClusterLegend(legend);
      setClustered(true);
      toast.success(`✅ Union-Find complete! ${clusters.length} clusters found.`);
    } catch (err) {
      toast.error('Failed to run Union-Find');
    } finally {
      setRunning(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '120px' }}>
        <LoadingSpinner size="lg" text="Loading graph..." />
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 134px)' }}>
      {/* Controls bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexShrink: 0 }}>
        <div>
          <h2 style={{ color: '#f1f5f9', fontWeight: 800, margin: 0 }}>DSA Visualization</h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '4px 0 0' }}>
            Interactive Union-Find graph · {zonesData.length} nodes · {routesData.length} edges
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {clustered && (
            <button className="btn-secondary" onClick={handleReset}>
              <RefreshCw size={16} /> Reset
            </button>
          )}
          <button
            className="btn-primary"
            id="run-union-find-btn"
            onClick={handleRunUnionFind}
            disabled={running}
            style={{ padding: '12px 24px' }}
          >
            <Zap size={18} />
            {running ? 'Animating...' : 'Run Union Find'}
          </button>
        </div>
      </div>

      {/* Info banner */}
      {!clustered && (
        <div className="glass-card" style={{ padding: '12px 20px', marginBottom: '16px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '10px', borderColor: 'rgba(99,102,241,0.3)' }}>
          <Info size={16} color="#6366f1" />
          <p style={{ margin: 0, fontSize: '0.825rem', color: '#94a3b8' }}>
            Nodes start <strong style={{ color: '#64748b' }}>grey (unclustered)</strong>. Click <strong style={{ color: '#6366f1' }}>Run Union Find</strong> to animate the DSU algorithm and watch zones merge into color-coded clusters.
          </p>
        </div>
      )}

      {/* Graph + Legend layout */}
      <div style={{ display: 'flex', gap: '16px', flex: 1, minHeight: 0 }}>
        {/* React Flow Canvas */}
        <div style={{ flex: 1, borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(99,102,241,0.2)' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            minZoom={0.3}
            maxZoom={2}
            attributionPosition="bottom-right"
          >
            <Background color="rgba(99,102,241,0.06)" gap={30} size={1} />
            <Controls
              style={{ background: 'rgba(15,22,41,0.9)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '8px' }}
            />
            <MiniMap
              nodeColor={(n) => n.data?.color?.bg || '#334155'}
              style={{ background: 'rgba(15,22,41,0.9)', border: '1px solid rgba(99,102,241,0.2)' }}
            />
          </ReactFlow>
        </div>

        {/* Legend panel */}
        {clusterLegend.length > 0 && (
          <div
            className="glass-card"
            style={{ width: '220px', padding: '20px', overflowY: 'auto', flexShrink: 0 }}
          >
            <h4 style={{ color: '#f1f5f9', fontWeight: 700, margin: '0 0 16px', fontSize: '0.875rem' }}>
              Cluster Legend
            </h4>
            {clusterLegend.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div style={{
                  width: '14px', height: '14px', borderRadius: '50%',
                  background: item.color.bg,
                  flexShrink: 0,
                  boxShadow: `0 0 8px ${item.color.bg}88`,
                }} />
                <span style={{ fontSize: '0.75rem', color: item.color.text, lineHeight: 1.3 }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualizationPage;
