import React from 'react';

const StatCard = ({ title, value, icon: Icon, gradient, delay = 0, subtitle }) => {
  return (
    <div
      className="glass-card p-6 animate-fadeInUp"
      style={{
        animationDelay: `${delay}ms`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow blob */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: gradient,
          opacity: 0.1,
          filter: 'blur(30px)',
        }}
      />

      <div className="flex items-start justify-between relative">
        <div>
          <p style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            {title}
          </p>
          <p style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f1f5f9', lineHeight: 1 }}>
            {value ?? '—'}
          </p>
          {subtitle && (
            <p style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '6px' }}>{subtitle}</p>
          )}
        </div>
        <div
          style={{
            background: gradient,
            padding: '12px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {Icon && <Icon size={22} color="white" />}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
