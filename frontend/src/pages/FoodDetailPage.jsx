import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, UtensilsCrossed, Sparkles, ArrowLeft, 
  Tag, Award, Compass 
} from 'lucide-react';
import { foodService } from '../services/api';
import PlaceCard from '../components/PlaceCard';

const FoodDetailPage = () => {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        setLoading(true);
        const res = await foodService.getById(id);
        setFood(res.data);
      } catch (err) {
        console.error('Failed to load food details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFood();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>Loading iconic dish info...</div>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2>Food Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 2rem 0' }}>This food item is not available.</p>
        <Link to="/famous-foods" className="btn btn-primary">Browse Famous Foods</Link>
      </div>
    );
  }

  const isVeg = food.diet_type === 'veg' || food.diet_type === 'vegan';

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* Top Breadcrumb */}
      <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', padding: '1rem 0' }}>
        <div className="container">
          <Link to={`/city/${food.city_slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to {food.city_name} Guide
          </Link>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '2.5rem' }}>
        
        {/* Food Profile Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
          gap: '2.5rem',
          alignItems: 'center',
          marginBottom: '4rem'
        }} className="food-hero-grid">
          
          {/* Image */}
          <div style={{
            height: '380px',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)',
            position: 'relative'
          }}>
            <img 
              src={food.image_url} 
              alt={food.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {food.is_must_try && (
              <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                <span className="badge badge-musttry" style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}>
                  ★ MUST-TRY DISH
                </span>
              </div>
            )}
          </div>

          {/* Info Details */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <span className={`badge ${isVeg ? 'badge-veg' : 'badge-nonveg'}`}>
                {isVeg ? 'Vegetarian 🌿' : 'Non-Vegetarian 🍗'}
              </span>
              <Link to={`/city/${food.city_slug}`} className="badge badge-city">
                <MapPin size={11} color="var(--primary)" /> {food.city_name}
              </Link>
            </div>

            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.75rem', lineHeight: 1.15 }}>
              {food.name}
            </h1>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(255, 179, 0, 0.12)',
              color: 'var(--accent-gold)',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.9rem',
              fontWeight: 800,
              marginBottom: '1.25rem'
            }}>
              Approx. Price: {food.price_range}
            </div>

            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {food.description}
            </p>

            {food.why_famous && (
              <div style={{
                background: 'var(--bg-surface)',
                borderLeft: '4px solid var(--primary)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1.5rem'
              }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Award size={16} color="var(--primary)" /> Why It Is Famous in {food.city_name}:
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {food.why_famous}
                </p>
              </div>
            )}

          </div>

        </div>

        {/* Recommended Places To Try Section */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '3rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              Where to Try the Best {food.name} in {food.city_name}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Hand-picked authentic eateries, street stalls, and heritage spots celebrated for this specific specialty.
            </p>
          </div>

          {food.recommended_places && food.recommended_places.length > 0 ? (
            <div className="cards-grid">
              {food.recommended_places.map(place => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          ) : (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '3rem',
              textAlign: 'center'
            }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Check out the full {food.city_name} guide for all active food spots.
              </p>
              <Link to={`/city/${food.city_slug}`} className="btn btn-primary">
                View {food.city_name} Food Guide
              </Link>
            </div>
          )}

        </div>

      </div>

      <style>{`
        @media (max-width: 840px) {
          .food-hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default FoodDetailPage;
