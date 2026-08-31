import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Calendar, Heart, MessageSquare, PlusCircle, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import PlaceCard from '../components/PlaceCard';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { favoritesList } = useFavorites();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        
        {/* User Card Header */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem 2rem',
          marginBottom: '3rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{
              width: '74px',
              height: '74px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FF5E36, #FF2A00)',
              color: '#FFF',
              fontSize: '2rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(255, 94, 54, 0.4)'
            }}>
              {user.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
                  {user.first_name || user.username} {user.last_name || ''}
                </h1>
                <span className="badge badge-city" style={{ fontSize: '0.75rem' }}>
                  Food Explorer
                </span>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                <span>@{user.username}</span>
                <span>•</span>
                <span>{user.email || 'No email provided'}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/add-place" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.88rem' }}>
              <PlusCircle size={16} />
              <span>Suggest Place</span>
            </Link>
            <button
              onClick={logout}
              className="btn btn-secondary"
              style={{ padding: '0.6rem 1.25rem', fontSize: '0.88rem', color: '#EF4444' }}
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Saved Places List */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Heart size={20} color="#EF4444" fill="#EF4444" /> Saved Favorite Spots ({favoritesList.length})
            </h2>
          </div>

          {favoritesList.length > 0 ? (
            <div className="cards-grid">
              {favoritesList.map(place => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          ) : (
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '3rem',
              textAlign: 'center'
            }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                You haven't saved any food spots yet.
              </p>
              <Link to="/explore" className="btn btn-primary">
                Explore Cities & Foods
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
