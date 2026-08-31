import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Lock, User, UtensilsCrossed, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error', err);
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (userDemo, passDemo) => {
    setUsername(userDemo);
    setPassword(passDemo);
    try {
      setLoading(true);
      setError('');
      await login(userDemo, passDemo);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Demo login failed. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      background: 'radial-gradient(circle at 50% 30%, rgba(255, 94, 54, 0.1) 0%, transparent 70%)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '460px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-bright)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem 2rem',
        boxShadow: 'var(--shadow-lg)'
      }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #FF5E36 0%, #FF2A00 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            margin: '0 auto 1rem auto',
            boxShadow: '0 4px 15px rgba(255, 94, 54, 0.4)'
          }}>
            <UtensilsCrossed size={24} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.35rem' }}>Welcome Back</h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Log in to save favorite spots and share food reviews.
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#EF4444',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            marginBottom: '1.5rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label className="form-label">Username</label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                required
                className="form-control"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                className="form-control"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', marginTop: '1rem' }}
          >
            <LogIn size={18} />
            <span>{loading ? 'Logging In...' : 'Log In'}</span>
          </button>

        </form>

        {/* Demo Fast Login Buttons */}
        <div style={{
          marginTop: '1.75rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border-subtle)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
            Quick Demo Login
          </div>
          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('foodie_rohit', 'foodie123')}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '0.5rem 0.65rem', fontSize: '0.8rem' }}
            >
              Foodie User 🍽️
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin', 'admin123')}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '0.5rem 0.65rem', fontSize: '0.8rem' }}
            >
              Admin ⚡
            </button>
          </div>
        </div>

        {/* Sign up link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Don't have an account yet?{' '}
          <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
