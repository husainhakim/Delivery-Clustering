import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% 50%, rgba(239,68,68,0.1) 0%, transparent 60%), #0a0e1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(239,68,68,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.03) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        pointerEvents: 'none',
      }} />

      <div className="glass-card-strong animate-fadeInUp" style={{ padding: '50px', textAlign: 'center', maxWidth: '440px', width: '100%' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(239,68,68,0.1)',
          borderRadius: '50%',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 0 30px rgba(239,68,68,0.2)',
        }}>
          <AlertCircle size={48} color="#ef4444" />
        </div>
        
        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#f1f5f9', margin: '0 0 8px 0', letterSpacing: '2px' }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#94a3b8', margin: '0 0 24px 0' }}>
          Page Not Found
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '32px' }}>
          The page you are looking for doesn't exist or has been moved to another coordinate in the delivery grid.
        </p>

        <button 
          onClick={() => navigate('/dashboard')}
          className="btn-primary" 
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <ArrowLeft size={18} /> Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
