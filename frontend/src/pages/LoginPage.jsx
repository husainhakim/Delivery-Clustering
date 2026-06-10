import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Zap, Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// Google "G" SVG icon
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1); // 1 = Enter Email, 2 = Enter OTP, 3 = Enter Password
  const { sendOtp, verifyOtp, loginWithPassword, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get('error');
    if (error === 'unauthorized') {
      toast.error('Unauthorized! Your Google email is not whitelisted as an admin.', { duration: 5000 });
      // Clean up URL so it doesn't keep showing on refresh
      navigate('/login', { replace: true });
    } else if (error === 'oauth_failed') {
      toast.error('Google login failed. Please try again.');
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    const result = await sendOtp(email);
    if (result.success) {
      toast.success('OTP sent to your email!');
      setStep(2);
    } else {
      toast.error(result.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return;

    const result = await verifyOtp(email, otp);
    if (result.success) {
      toast.success('Login successful!');
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Invalid OTP');
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    const result = await loginWithPassword(email, password);
    if (result.success) {
      toast.success('Login successful!');
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Invalid password');
    }
  };

  const handleGoogleLogin = () => {
    // Redirect browser to backend Google OAuth initiation
    const IS_DEV = import.meta.env.MODE === 'development';
    const apiUrl = IS_DEV ? 'http://localhost:4000/api' : 'https://delivery-clustering.onrender.com/api';
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 30% 20%, rgba(99,102,241,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(139,92,246,0.1) 0%, transparent 60%), #0a0e1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      {/* Background grid */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        pointerEvents: 'none',
      }} />

      <div className="animate-fadeInUp" style={{ width: '100%', maxWidth: '440px', position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '20px',
            padding: '16px',
            marginBottom: '20px',
            boxShadow: '0 0 40px rgba(99,102,241,0.4)',
          }}>
            <Zap size={32} color="white" />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>
            SmartZone DSU
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '0.875rem' }}>
            Smart Delivery Zone Clustering System
          </p>
        </div>

        {/* Card */}
        <div className="glass-card-strong" style={{ padding: '40px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px', marginTop: 0 }}>
            Admin Login
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '28px' }}>
            Sign in to access the dashboard
          </p>

          {/* ── Google Sign-In ── */}
          <button
            type="button"
            id="google-signin-btn"
            onClick={handleGoogleLogin}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '10px',
              padding: '12px 20px',
              color: '#f1f5f9',
              fontSize: '0.875rem',
              fontWeight: 600,
              fontFamily: 'Inter, sans-serif',
              cursor: 'pointer',
              marginBottom: '20px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
            }}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ color: '#475569', fontSize: '0.75rem', fontWeight: 500 }}>or sign in with email</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* ── Email OTP Form ── */}
          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="animate-fadeIn">
              {/* Email */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6366f1' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-dark"
                    style={{ paddingLeft: '38px' }}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px' }} disabled={loading || !email}>
                {loading ? 'Sending...' : (
                  <>
                    Send OTP to Email <ArrowRight size={16} />
                  </>
                )}
              </button>

              <button 
                type="button" 
                onClick={() => setStep(3)} 
                className="btn-secondary" 
                style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: '12px' }} 
              >
                Sign in with Password instead
              </button>
            </form>
          ) : step === 2 ? (
            <form onSubmit={handleVerifyOtp} className="animate-fadeIn">
              {/* Read-only Email */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type="email"
                    value={email}
                    className="input-dark"
                    style={{ paddingLeft: '38px', opacity: 0.7, cursor: 'not-allowed' }}
                    disabled
                  />
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6366f1', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* OTP Input */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                  One-Time Password (OTP)
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#10b981' }} />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="input-dark"
                    style={{ paddingLeft: '38px', letterSpacing: '4px', fontSize: '1.1rem', fontWeight: 600 }}
                    placeholder="123456"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', background: 'linear-gradient(135deg, #10b981, #059669)' }} disabled={loading || otp.length !== 6}>
                {loading ? 'Verifying...' : (
                  <>
                    Verify & Login <CheckCircle size={16} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordLogin} className="animate-fadeIn">
              {/* Editable Email */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6366f1' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-dark"
                    style={{ paddingLeft: '38px' }}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                  Admin Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#10b981' }} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-dark"
                    style={{ paddingLeft: '38px' }}
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', background: 'linear-gradient(135deg, #10b981, #059669)' }} disabled={loading || !password}>
                {loading ? 'Verifying...' : (
                  <>
                    Sign In <CheckCircle size={16} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', color: '#475569', fontSize: '0.75rem', marginTop: '24px' }}>
          ITM Skills University · DSA-3 Project · B.Tech CSE 2023-27
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
