import React, { useState } from 'react';
import { useZones } from '../hooks/useZones';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Plus, Trash2, Search, MapPin, X } from 'lucide-react';

const AddZoneModal = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({ name: '', city: '', zoneCode: '' });
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
          <h3 style={{ color: '#f1f5f9', fontWeight: 700, margin: 0 }}>Add New Zone</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {[
            { label: 'Zone Name', key: 'name', placeholder: 'e.g. Mumbai North' },
            { label: 'City', key: 'city', placeholder: 'e.g. Mumbai' },
            { label: 'Zone Code', key: 'zoneCode', placeholder: 'e.g. ZN001' },
          ].map(({ label, key, placeholder }) => (
            <div key={key} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>{label}</label>
              <input
                className="input-dark"
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                required
              />
            </div>
          ))}
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Adding...' : 'Add Zone'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ZonesPage = () => {
  const { zones, loading, createZone, removeZone } = useZones();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filtered = zones.filter(
    (z) =>
      z.name.toLowerCase().includes(search.toLowerCase()) ||
      z.city.toLowerCase().includes(search.toLowerCase()) ||
      z.zoneCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-enter">
      {showModal && <AddZoneModal onClose={() => setShowModal(false)} onCreate={createZone} />}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content" style={{ maxWidth: '380px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: '#f1f5f9', marginTop: 0 }}>Delete Zone?</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              This will also remove all routes connected to <strong style={{ color: '#f1f5f9' }}>{deleteConfirm.name}</strong>.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button className="btn-secondary" onClick={() => setDeleteConfirm(null)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button className="btn-danger" onClick={() => { removeZone(deleteConfirm._id); setDeleteConfirm(null); }} style={{ flex: 1, justifyContent: 'center' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex-header">
        <div>
          <h2 style={{ color: '#f1f5f9', fontWeight: 800, margin: 0 }}>Delivery Zones</h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '4px 0 0' }}>
            {zones.length} zones registered
          </p>
        </div>
        <button className="btn-primary" id="add-zone-btn" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Add Zone
        </button>
      </div>

      {/* Search */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '20px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6366f1' }} />
          <input
            className="input-dark"
            style={{ paddingLeft: '38px' }}
            placeholder="Search by name, city or zone code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', display: 'flex', justifyContent: 'center' }}>
            <LoadingSpinner text="Loading zones..." />
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table-dark">
            <thead>
              <tr>
                <th>#</th>
                <th>Zone Name</th>
                <th>City</th>
                <th>Zone Code</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '60px', color: '#475569' }}>
                    <MapPin size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
                    {search ? 'No zones match your search' : 'No zones added yet'}
                  </td>
                </tr>
              ) : (
                filtered.map((zone, i) => (
                  <tr key={zone._id}>
                    <td style={{ color: '#475569' }}>{i + 1}</td>
                    <td style={{ color: '#f1f5f9', fontWeight: 600 }}>{zone.name}</td>
                    <td>{zone.city}</td>
                    <td>
                      <span style={{
                        background: 'rgba(99,102,241,0.15)',
                        color: '#a5b4fc',
                        padding: '2px 10px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        fontFamily: 'monospace',
                      }}>
                        {zone.zoneCode}
                      </span>
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.8rem' }}>
                      {new Date(zone.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <button className="btn-danger" id={`delete-zone-${zone._id}`} onClick={() => setDeleteConfirm(zone)} style={{ padding: '6px 12px' }}>
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

export default ZonesPage;
