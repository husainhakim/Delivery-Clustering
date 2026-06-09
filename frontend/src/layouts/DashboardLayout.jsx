import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/ui/Sidebar';
import TopBar from '../components/ui/TopBar';

const DashboardLayout = () => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0e1a' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' }}>
        <TopBar />
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
