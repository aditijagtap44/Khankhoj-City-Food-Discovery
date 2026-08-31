import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await register(formData);
      navigate('/');
    } catch (err) {
      console.error('Registration error', err);
      const data = err.response?.data;
      if (data) {
        if (data.username) setError(`Username: ${data.username[0]}`);
        else if (data.email) setError(`Email: ${data.email[0]}`);
        else if (data.password) setError(`Password: ${data.password[0]}`);
        else setError('Registration failed. Please check your details.');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      background: 'radial-gradient(circle at 50% 30%, rgba(255, 94, 54, 0.1) 0%, transparent 70%)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.35rem' }}>Join KhanKhoj</h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Start discovering and bookmarking authentic tastes across India.
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
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                required
                className="form-control"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="e.g. Rahul Verma"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Username</label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                required
                className="form-control"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="e.g. rahul_foodie"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                className="form-control"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="name@example.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password (min 6 characters)</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                minLength={6}
                className="form-control"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="Create password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                minLength={6}
                className="form-control"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="Confirm password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', marginTop: '1rem' }}
          >
            <UserPlus size={18} />
            <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
          </button>

        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Log In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default SignupPage;
