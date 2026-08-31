import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Sparkles, Heart, Clock, Navigation } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';

const PlaceCard = ({ place }) => {
  const { isFavorited, toggleFavorite } = useFavorites();
  const favorited = isFavorited(place.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(place);
  };

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'street_food': return 'Street Food Stall';
      case 'traditional_eatery': return 'Traditional Eatery';
      case 'heritage_spot': return 'Heritage Iconic';
      case 'sweet_shop': return 'Sweet & Snacks';
      case 'cafe': return 'Cafe';
      default: return 'Restaurant';
    }
  };

  return (
    <div className="card place-card">
      {/* Image Banner */}
      <div style={{ position: 'relative', height: '210px', overflow: 'hidden' }}>
        <img 
          src={place.image_url} 
          alt={place.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
          className="place-img"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Top Floating Badges */}
        <div style={{
          position: 'absolute',
          top: '0.85rem',
          left: '0.85rem',
          right: '0.85rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 2,
        }}>
          {place.is_hidden_gem ? (
            <span className="badge badge-gem">
              <Sparkles size={12} /> Hidden Gem
            </span>
          ) : (
            <span className="badge badge-city" style={{ fontSize: '0.72rem' }}>
              {getCategoryLabel(place.category)}
            </span>
          )}

          {/* Favorite Heart Button */}
          <button
            onClick={handleFavoriteClick}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: favorited ? '#EF4444' : '#FFFFFF',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            title={favorited ? 'Remove from favorites' : 'Save to favorites'}
          >
            <Heart size={16} fill={favorited ? '#EF4444' : 'none'} />
          </button>
        </div>

        {/* Bottom Locality Badge */}
        <div style={{
          position: 'absolute',
          bottom: '0.75rem',
          left: '0.85rem',
          zIndex: 2,
        }}>
          <span className="badge badge-city" style={{ fontSize: '0.72rem', backdropFilter: 'blur(8px)' }}>
            <MapPin size={11} color="var(--primary)" /> {place.area}, {place.city_name}
          </span>
        </div>
      </div>

      {/* Place Details */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
          <h3 style={{ fontSize: '1.22rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25 }}>
            <Link to={`/place/${place.id}`} style={{ color: 'inherit' }}>
              {place.name}
            </Link>
          </h3>
          
          {/* Rating Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: 'var(--veg)',
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.82rem',
            fontWeight: 800,
            marginLeft: '0.5rem',
            whiteSpace: 'nowrap'
          }}>
            <Star size={13} fill="var(--veg)" />
            <span>{place.average_rating || '4.5'}</span>
          </div>
        </div>

        {/* Specialty */}
        <div style={{ fontSize: '0.86rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
          ★ {place.specialty}
        </div>

        <p style={{ 
          fontSize: '0.84rem', 
          color: 'var(--text-secondary)', 
          marginBottom: '0.9rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: 1.45
        }}>
          {place.description}
        </p>

        {/* Extra info footer */}
        <div style={{ 
          marginTop: 'auto', 
          paddingTop: '0.75rem', 
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
            {place.price_range}
          </span>

          <Link 
            to={`/place/${place.id}`} 
            style={{ 
              fontWeight: 700, 
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            View Spot →
          </Link>
        </div>
      </div>

      <style>{`
        .place-card:hover .place-img {
          transform: scale(1.06);
        }
      `}</style>
    </div>
  );
};

export default PlaceCard;
