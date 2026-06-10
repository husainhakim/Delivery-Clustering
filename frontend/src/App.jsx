import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ZonesPage from './pages/ZonesPage';
import RoutesPage from './pages/RoutesPage';
import ClusterAnalysisPage from './pages/ClusterAnalysisPage';
import VisualizationPage from './pages/VisualizationPage';
import ReportsPage from './pages/ReportsPage';
import DSAExplanationPage from './pages/DSAExplanationPage';
import GoogleSuccessPage from './pages/GoogleSuccessPage';
import NotFoundPage from './pages/NotFoundPage';
import CustomCursor from './components/ui/CustomCursor';

function App() {
  return (
    <BrowserRouter>
      <CustomCursor />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f1629',
            color: '#f1f5f9',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: '10px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#0f1629' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#0f1629' },
          },
        }}
      />
      <Routes>
        {/* Public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Google OAuth success redirect (public — no auth guard) */}
        <Route path="/auth/google/success" element={<GoogleSuccessPage />} />

        {/* Protected routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard"     element={<DashboardPage />} />
          <Route path="/zones"         element={<ZonesPage />} />
          <Route path="/routes"        element={<RoutesPage />} />
          <Route path="/clusters"      element={<ClusterAnalysisPage />} />
          <Route path="/visualization" element={<VisualizationPage />} />
          <Route path="/reports"       element={<ReportsPage />} />
          <Route path="/dsa"           element={<DSAExplanationPage />} />
        </Route>

        {/* Default redirect for / */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* 404 Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
