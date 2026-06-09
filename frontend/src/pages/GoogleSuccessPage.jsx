import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

/**
 * This page handles the redirect from Google OAuth.
 * The backend redirects here with ?token=JWT&name=...&email=...
 * We store the token and send the user to the dashboard.
 */
const GoogleSuccessPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    const name = params.get('name');
    const email = params.get('email');
    const avatar = params.get('avatar');

    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('admin', JSON.stringify({ email, name, avatar, role: 'admin', provider: 'google' }));
      toast.success(`Welcome, ${name || 'Admin'}! 🎉`);
      navigate('/dashboard', { replace: true });
    } else {
      toast.error('Google login failed. Please try again.');
      navigate('/login', { replace: true });
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0e1a' }}>
      <LoadingSpinner size="lg" text="Signing you in with Google..." />
    </div>
  );
};

export default GoogleSuccessPage;
