import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';

const pageTitles = {
  '/dashboard':     { title: 'Dashboard',          subtitle: 'System overview and cluster stats' },
  '/zones':         { title: 'Zone Management',    subtitle: 'Add, search, and manage delivery zones' },
  '/routes':        { title: 'Route Management',   subtitle: 'Connect zones with delivery routes' },
  '/clusters':      { title: 'Cluster Analysis',   subtitle: 'Run Union-Find and view connected clusters' },
  '/visualization': { title: 'DSA Visualization',  subtitle: 'Interactive Union-Find graph animation' },
  '/reports':       { title: 'Reports',            subtitle: 'Analytics and CSV export' },
  '/dsa':           { title: 'DSA Explanation',    subtitle: 'Union-Find algorithm deep dive' },
};

const TopBar = () => {
  const { pathname } = useLocation();
  const page = pageTitles[pathname] || { title: 'SmartZone', subtitle: '' };

  return (
    <header
      style={{
        height: '70px',
        background: 'rgba(10, 14, 26, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      <div>
        <h1 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
          {page.title}
        </h1>
        <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>{page.subtitle}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '8px',
            padding: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Bell size={18} color="#6366f1" />
        </div>
        <div
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '8px',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.875rem',
            color: 'white',
          }}
        >
          A
        </div>
      </div>
    </header>
  );
};

export default TopBar;
