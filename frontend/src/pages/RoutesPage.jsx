import React, { useState } from 'react';
import { useRoutes } from '../hooks/useRoutes';
import { useZones } from '../hooks/useZones';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Plus, Trash2, ArrowRight, X, Route as RouteIcon } from 'lucide-react';

const AddRouteModal = ({ zones, onClose, onCreate }) => {
  const [form, setForm] = useState({ sourceZone: '', destinationZone: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await onCreate(form);
    setLoading(false);
    if (success) onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ color: '#f1f5f9', fontWeight: 700, margin: 0 }}>Connect Two Zones</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {[
            { label: 'Source Zone', key: 'sourceZone' },
            { label: 'Destination Zone', key: 'destinationZone' },
          ].map(({ label, key }) => (
            <div key={key} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>{label}</label>
              <select
                className="input-dark"
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                required
                style={{ cursor: 'pointer' }}
              >
                <option value="">Select a zone...</option>
                {zones.map((z) => (
                  <option key={z._id} value={z._id} style={{ background: '#0f1629' }}>
                    {z.name} ({z.zoneCode}) — {z.city}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Connecting...' : 'Connect Zones'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const RoutesPage = () => {
  const { routes, loading, createRoute, removeRoute } = useRoutes();
  const { zones } = useZones();
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  return (
    <div className="page-enter">
      {showModal && (
        <AddRouteModal zones={zones} onClose={() => setShowModal(false)} onCreate={createRoute} />
      )}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content" style={{ maxWidth: '380px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: '#f1f5f9', marginTop: 0 }}>Remove Route?</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              This will disconnect{' '}
              <strong style={{ color: '#f1f5f9' }}>{deleteConfirm.sourceZone?.name}</strong>
              {' → '}
              <strong style={{ color: '#f1f5f9' }}>{deleteConfirm.destinationZone?.name}</strong>.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button className="btn-secondary" onClick={() => setDeleteConfirm(null)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button className="btn-danger" onClick={() => { removeRoute(deleteConfirm._id); setDeleteConfirm(null); }} style={{ flex: 1, justifyContent: 'center' }}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex-header">
        <div>
          <h2 style={{ color: '#f1f5f9', fontWeight: 800, margin: 0 }}>Delivery Routes</h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '4px 0 0' }}>
            {routes?.length || 0} routes connecting {zones?.length || 0} zones
          </p>
        </div>
        <button className="btn-primary" id="add-route-btn" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Connect Zones
        </button>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', display: 'flex', justifyContent: 'center' }}>
            <LoadingSpinner text="Loading routes..." />
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table-dark">
            <thead>
              <tr>
                <th>#</th>
                <th>Source Zone</th>
                <th></th>
                <th>Destination Zone</th>
                <th>Connected On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {(!routes || routes.length === 0) ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '60px', color: '#475569' }}>
                    <RouteIcon size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
                    No routes added yet. Connect zones to build clusters.
                  </td>
                </tr>
              ) : (
                routes.map((route, i) => (
                  <tr key={route._id}>
                    <td style={{ color: '#475569' }}>{i + 1}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{route.sourceZone?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{route.sourceZone?.zoneCode}</div>
                    </td>
                    <td>
                      <ArrowRight size={16} color="#6366f1" />
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{route.destinationZone?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{route.destinationZone?.zoneCode}</div>
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.8rem' }}>
                      {new Date(route.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <button className="btn-danger" onClick={() => setDeleteConfirm(route)} style={{ padding: '6px 12px' }}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutesPage;
