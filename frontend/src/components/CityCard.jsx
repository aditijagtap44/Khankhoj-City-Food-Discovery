import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, UtensilsCrossed, ArrowRight } from 'lucide-react';

const CityCard = ({ city }) => {
  return (
    <Link 
      to={`/city/${city.slug}`}
      className="card city-card"
      style={{
        textDecoration: 'none',
        height: '360px',
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {/* Background Image */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${city.image_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        className="city-bg-image"
      />

      {/* Gradient Overlay */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(11, 14, 20, 0.4) 40%, rgba(11, 14, 20, 0.95) 100%)',
          zIndex: 1,
        }}
      />

      {/* Top State Badge */}
      <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', zIndex: 2 }}>
        <span className="badge badge-city">
          <MapPin size={12} color="var(--primary)" /> {city.state}
        </span>
      </div>

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        marginTop: 'auto',
        padding: '1.5rem',
      }}>
        <h3 style={{ 
          fontSize: '1.75rem', 
          fontWeight: 800, 
          color: '#FFFFFF',
          marginBottom: '0.35rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span>{city.name}</span>
          <div className="city-arrow-icon" style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            transition: 'transform 0.25s ease'
          }}>
            <ArrowRight size={18} />
          </div>
        </h3>

        <p style={{ 
          fontSize: '0.86rem', 
          color: '#CBD5E1', 
          marginBottom: '0.9rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: 1.45
        }}>
          {city.tagline || city.description}
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.78rem',
          fontWeight: 700,
          color: '#FFA000',
          paddingTop: '0.75rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <UtensilsCrossed size={14} /> {city.foods_count || '5+'} Famous Foods
          </span>
          <span>•</span>
          <span>{city.places_count || '8+'} Food Spots</span>
        </div>
      </div>

      <style>{`
        .city-card:hover .city-bg-image {
          transform: scale(1.08);
        }
        .city-card:hover .city-arrow-icon {
          transform: translateX(4px);
        }
      `}</style>
    </Link>
  );
};

export default CityCard;
