import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Route,
  Network,
  GitBranch,
  BarChart2,
  BookOpen,
  LogOut,
  Zap,
  User,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { to: '/dashboard',      label: 'Dashboard',        icon: LayoutDashboard },
  { to: '/zones',          label: 'Zone Management',  icon: MapPin          },
  { to: '/routes',         label: 'Route Management', icon: Route           },
  { to: '/clusters',       label: 'Cluster Analysis', icon: Network         },
  { to: '/visualization',  label: 'DSA Visualization',icon: GitBranch       },
  { to: '/reports',        label: 'Reports',          icon: BarChart2       },
  { to: '/dsa',            label: 'DSA Explanation',  icon: BookOpen        },
];

const Sidebar = () => {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      style={{
        width: '260px',
        minHeight: '100vh',
        background: 'rgba(9, 14, 26, 0.95)',
        borderRight: '1px solid rgba(99, 102, 241, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        padding: '0',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 40,
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '12px',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Zap size={20} color="white" />
          </div>
          <div>
            <p style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f1f5f9', margin: 0 }}>SmartZone</p>
            <p style={{ fontSize: '0.7rem', color: '#6366f1', margin: 0, fontWeight: 500 }}>DSU Clustering</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        <p style={{ fontSize: '0.65rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 8px', marginBottom: '8px', marginTop: '8px' }}>
          Main Menu
        </p>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            style={{ marginBottom: '4px', display: 'flex' }}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(99,102,241,0.1)' }}>
        <div style={{
          background: 'rgba(99,102,241,0.08)',
          borderRadius: '10px',
          padding: '10px 12px',
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          {admin?.avatar ? (
            <img 
              src={admin.avatar} 
              alt="Profile" 
              style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid rgba(99,102,241,0.5)' }} 
            />
          ) : (
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(99,102,241,0.15)',
              border: '2px solid rgba(99,102,241,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={16} color="#818cf8" />
            </div>
          )}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <p style={{ fontSize: '0.7rem', color: '#64748b', margin: 0 }}>Logged in as</p>
            <p style={{ fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {admin?.name || admin?.email || 'admin@delivery.com'}
            </p>
          </div>
        </div>
        <button onClick={handleLogout} className="btn-danger" style={{ width: '100%', justifyContent: 'center' }}>
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
