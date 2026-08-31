import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Tag, ArrowRight } from 'lucide-react';

const FoodCard = ({ food }) => {
  const isVeg = food.diet_type === 'veg' || food.diet_type === 'vegan';

  return (
    <div className="card food-card">
      {/* Image Wrap */}
      <div style={{ position: 'relative', height: '210px', overflow: 'hidden' }}>
        <img 
          src={food.image_url} 
          alt={food.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
          className="food-img"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Top Badges */}
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
          <span className={`badge ${isVeg ? 'badge-veg' : 'badge-nonveg'}`}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: isVeg ? 'var(--veg)' : 'var(--nonveg)' 
            }} />
            {isVeg ? 'Vegetarian' : 'Non-Veg'}
          </span>

          {food.is_must_try && (
            <span className="badge badge-musttry">
              ★ MUST TRY
            </span>
          )}
        </div>

        {/* City Tag Bottom Pill */}
        {food.city_name && (
          <div style={{
            position: 'absolute',
            bottom: '0.75rem',
            left: '0.85rem',
            zIndex: 2,
          }}>
            <Link 
              to={`/city/${food.city_slug}`} 
              onClick={(e) => e.stopPropagation()}
              className="badge badge-city"
              style={{ fontSize: '0.72rem', backdropFilter: 'blur(10px)' }}
            >
              <MapPin size={11} color="var(--primary)" /> {food.city_name}
            </Link>
          </div>
        )}
      </div>

      {/* Details */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
            <Link to={`/food/${food.id}`} style={{ color: 'inherit' }}>
              {food.name}
            </Link>
          </h3>
          <span style={{ 
            fontSize: '0.85rem', 
            fontWeight: 700, 
            color: 'var(--accent-gold)', 
            background: 'rgba(255, 179, 0, 0.12)',
            padding: '0.2rem 0.55rem',
            borderRadius: 'var(--radius-sm)',
            whiteSpace: 'nowrap',
            marginLeft: '0.5rem'
          }}>
            {food.price_range}
          </span>
        </div>

        <p style={{ 
          fontSize: '0.85rem', 
          color: 'var(--text-secondary)', 
          marginBottom: '0.85rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: 1.45
        }}>
          {food.description}
        </p>

        {food.why_famous && (
          <div style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            background: 'var(--bg-surface)',
            padding: '0.55rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            borderLeft: '3px solid var(--primary)',
            marginBottom: '1rem',
            lineHeight: 1.4
          }}>
            <strong style={{ color: 'var(--text-primary)' }}>Why Famous:</strong> {food.why_famous}
          </div>
        )}

        <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
          <Link 
            to={`/food/${food.id}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.86rem',
              fontWeight: 600,
              color: 'var(--primary)'
            }}
          >
            <span>Where to eat in {food.city_name || 'City'}</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      <style>{`
        .food-card:hover .food-img {
          transform: scale(1.06);
        }
      `}</style>
    </div>
  );
};

export default FoodCard;
