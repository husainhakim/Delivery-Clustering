import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/ui/Sidebar';
import TopBar from '../components/ui/TopBar';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="layout-container">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className={`mobile-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
      
      <div className="main-content">
        <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="main-scroll-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
