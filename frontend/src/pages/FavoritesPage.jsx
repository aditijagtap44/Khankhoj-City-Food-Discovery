import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Compass, ArrowRight } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import PlaceCard from '../components/PlaceCard';

const FavoritesPage = () => {
  const { favoritesList, loading } = useFavorites();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div style={{
          maxWidth: '500px',
          margin: '0 auto',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '3rem 2rem',
        }}>
          <Heart size={44} color="#EF4444" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.6rem' }}>Login to View Favorites</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
            Save your must-visit street food spots, iconic bakeries, and city culinary gems to access them anytime.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Link to="/login" className="btn btn-primary">Login Now</Link>
            <Link to="/signup" className="btn btn-secondary">Create Account</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ maxWidth: '650px', marginBottom: '2.5rem' }}>
          <div className="section-tag" style={{ color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.1)' }}>
            <Heart size={14} fill="#EF4444" /> Your Saved Spots
          </div>
          <h1 className="section-title">My Favorite Food Places</h1>
          <p className="section-subtitle">
            All your bookmarked heritage restaurants, local street carts, and hidden food gems in one place.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
            Loading your favorites...
          </div>
        ) : favoritesList.length > 0 ? (
          <div className="cards-grid">
            {favoritesList.map(place => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '4rem 2rem',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            <Heart size={40} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>No Saved Places Yet</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.92rem' }}>
              Click the heart icon on any food place card while browsing city guides to save it here for your future visits!
            </p>
            <Link to="/explore" className="btn btn-primary">
              <Compass size={16} />
              <span>Explore Food Places</span>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default FavoritesPage;
