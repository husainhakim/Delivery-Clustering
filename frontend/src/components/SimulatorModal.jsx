import React, { useState } from 'react';
import { useRoutes } from '../hooks/useRoutes';
import { X, CloudLightning } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function SimulatorModal({ isOpen, onClose, onSimulated }) {
  const { routes, loading } = useRoutes();
  const [selectedRoute, setSelectedRoute] = useState('');
  const [reason, setReason] = useState('Weather disruption');
  const [simulating, setSimulating] = useState(false);

  if (!isOpen) return null;

  // Filter out already disrupted routes
  const activeRoutes = routes.filter(r => r.status !== 'disrupted');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoute) return toast.error('Please select a route to disrupt');

    setSimulating(true);
    try {
      await api.post(`/zones/split`, { routeId: selectedRoute, reason });
      toast.success('Disruption simulated. Clusters split.');
      if (onSimulated) onSimulated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to simulate split');
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ color: '#f1f5f9', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CloudLightning className="text-yellow-400" />
            Weather Disruption Simulator
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
              Target Route to Disrupt
            </label>
            <select
              className="input-dark"
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
              required
              disabled={loading}
              style={{ cursor: 'pointer' }}
            >
              <option value="">Select a route...</option>
              {activeRoutes.map((r) => (
                <option key={r._id} value={r._id} style={{ background: '#0f1629' }}>
                  {r.sourceZone?.name} → {r.destinationZone?.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
              Reason / Event
            </label>
            <input
              type="text"
              className="input-dark"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
            <button type="submit" className="btn-primary bg-red-600 hover:bg-red-700" style={{ flex: 1, justifyContent: 'center', background: '#dc2626' }} disabled={simulating}>
              {simulating ? 'Simulating...' : 'Trigger Split'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
