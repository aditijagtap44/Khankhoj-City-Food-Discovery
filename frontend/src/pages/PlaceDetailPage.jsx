import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, MapPin, Clock, Phone, Heart, Sparkles, Navigation, 
  ArrowLeft, Utensils, MessageSquarePlus, Share2, Check, Award, ThumbsUp 
} from 'lucide-react';
import { placeService } from '../services/api';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import MapView from '../components/MapView';
import ReviewModal from '../components/ReviewModal';

const PlaceDetailPage = () => {
  const { id } = useParams();
  const { isFavorited, toggleFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [helpfulVotes, setHelpfulVotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('khankhoj_helpful_votes') || '{}');
    } catch {
      return {};
    }
  });

  const toggleHelpful = (reviewId) => {
    setHelpfulVotes((prev) => {
      const updated = { ...prev, [reviewId]: !prev[reviewId] };
      localStorage.setItem('khankhoj_helpful_votes', JSON.stringify(updated));
      return updated;
    });
  };

  const fetchPlace = async () => {
    try {
      setLoading(true);
      const res = await placeService.getById(id);
      setPlace(res.data);
    } catch (err) {
      console.error('Failed to load place detail', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlace();
    window.scrollTo(0, 0);
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>Loading food place details...</div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2>Food Place Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 2rem 0' }}>This place may have been removed or does not exist.</p>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  }

  const favorited = isFavorited(place.id);
  const isVeg = place.diet_type === 'pure_veg';

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* Top Header Bar */}
      <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', padding: '1rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to={`/city/${place.city_slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to {place.city_name} Guide
          </Link>
          
          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button
              onClick={handleShare}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.9rem', fontSize: '0.82rem' }}
            >
              {copiedLink ? <Check size={14} color="var(--veg)" /> : <Share2 size={14} />}
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={() => toggleFavorite(place)}
              className="btn btn-secondary"
              style={{ 
                padding: '0.4rem 0.9rem', 
                fontSize: '0.82rem',
                color: favorited ? '#EF4444' : 'var(--text-primary)',
                borderColor: favorited ? '#EF4444' : 'var(--border-subtle)'
              }}
            >
              <Heart size={14} fill={favorited ? '#EF4444' : 'none'} />
              <span>{favorited ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Visual Section */}
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
          gap: '2rem',
          alignItems: 'flex-start'
        }} className="place-hero-grid">
          
          {/* Main Photo Gallery */}
          <div>
            <div style={{
              height: '380px',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1px solid var(--border-subtle)',
              position: 'relative'
            }}>
              <img
                src={place.image_url}
                alt={place.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {place.is_hidden_gem && (
                <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                  <span className="badge badge-gem" style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}>
                    <Sparkles size={14} /> HIDDEN GEM
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Place Summary Card */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className={`badge ${isVeg ? 'badge-veg' : 'badge-nonveg'}`}>
                {isVeg ? 'Pure Vegetarian 🌿' : 'Non-Veg Served 🍗'}
              </span>
              <span className="badge badge-city" style={{ fontSize: '0.75rem' }}>
                {place.city_name}
              </span>
            </div>

            <h1 style={{ fontSize: '2.1rem', fontWeight: 900, marginBottom: '0.4rem', lineHeight: 1.2 }}>
              {place.name}
            </h1>

            <div style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: 'var(--primary)',
              marginBottom: '1rem'
            }}>
              ★ Specialty: {place.specialty}
            </div>

            {/* Rating pill & price */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              padding: '0.9rem 0',
              borderTop: '1px solid var(--border-subtle)',
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: 'var(--veg)',
                  padding: '0.3rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}>
                  <Star size={16} fill="var(--veg)" />
                  <span>{place.average_rating || '4.5'}</span>
                </div>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  ({place.reviews?.length || 0} reviews)
                </span>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>PRICE FOR TWO</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{place.price_range}</div>
              </div>
            </div>

            {/* Timings & Address */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} color="var(--primary)" />
                <span><strong>Hours:</strong> {place.opening_hours}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{place.address}</span>
              </div>
            </div>

            {/* Directions Action */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ flex: 1, padding: '0.75rem' }}
              >
                <Navigation size={17} />
                <span>Get Directions</span>
              </a>

              <button
                onClick={() => setShowReviewModal(true)}
                className="btn btn-secondary"
                style={{ padding: '0.75rem 1.25rem' }}
              >
                <MessageSquarePlus size={17} />
                <span>Review</span>
              </button>
            </div>

          </div>

        </div>

        {/* Why Special / Heritage Note (if hidden gem) */}
        {place.why_special && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(255, 94, 54, 0.08) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem 1.75rem',
            margin: '2.5rem 0'
          }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#C084FC', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} /> Why Foodies Love This Hidden Gem:
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
              {place.why_special}
            </p>
          </div>
        )}

        {/* Description */}
        <div style={{ margin: '2.5rem 0' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            About {place.name}
          </h3>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '850px' }}>
            {place.description}
          </p>
        </div>

        {/* Location & Map */}
        <div style={{ margin: '3rem 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
              Location & Map
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {place.area}, {place.city_name}
            </span>
          </div>
          
          <MapView
            places={[place]}
            center={[place.latitude || 18.5204, place.longitude || 73.8567]}
            zoom={15}
            height="360px"
          />
        </div>

        {/* Reviews Section */}
        <div style={{ margin: '3.5rem 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                Taste Reviews ({place.reviews?.length || 0})
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Real feedback and top dish suggestions from verified food lovers.
              </p>
            </div>

            <button
              onClick={() => setShowReviewModal(true)}
              className="btn btn-primary"
              style={{ padding: '0.55rem 1.25rem', fontSize: '0.88rem' }}
            >
              <MessageSquarePlus size={16} />
              <span>Write a Review</span>
            </button>
          </div>

          {/* Rating Summary Breakdown Card */}
          {place.reviews && place.reviews.length > 0 && (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem 1.75rem',
              marginBottom: '1.5rem',
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: '2rem',
              alignItems: 'center'
            }}>
              {/* Overall Score Box */}
              <div style={{ textAlign: 'center', minWidth: '120px' }}>
                <div style={{ fontSize: '3.2rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>
                  {place.average_rating || '4.5'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.2rem', margin: '0.4rem 0' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      color="#FFB300"
                      fill={i < Math.round(place.average_rating || 4.5) ? '#FFB300' : 'none'}
                    />
                  ))}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Based on {place.reviews.length} {place.reviews.length === 1 ? 'review' : 'reviews'}
                </div>
              </div>

              {/* Star Distribution Bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = place.reviews.filter((r) => r.rating === stars).length;
                  const pct = Math.round((count / place.reviews.length) * 100);
                  return (
                    <div key={stars} className="rating-bar-container">
                      <span style={{ width: '30px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                        {stars} ★
                      </span>
                      <div className="rating-bar-track">
                        <div className="rating-bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <span style={{ width: '35px', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {place.reviews && place.reviews.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {place.reviews.map((rev) => {
                // Parse optional tags if present (separated by •)
                const parts = rev.comment ? rev.comment.split('\n\n') : [''];
                const hasTags = parts.length > 1 && parts[0].includes('•');
                const tagList = hasTags ? parts[0].split('•').map(t => t.trim()) : [];
                const actualComment = hasTags ? parts.slice(1).join('\n\n') : rev.comment;

                const isHelpfulActive = helpfulVotes[rev.id];
                const countVotes = (rev.id % 5) + (isHelpfulActive ? 1 : 0);

                return (
                  <div
                    key={rev.id}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem 1.5rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'var(--primary)',
                          color: '#FFF',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.9rem'
                        }}>
                          {rev.username?.[0]?.toUpperCase() || 'F'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{rev.user_first_name || rev.username}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {new Date(rev.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={15}
                            color="#FFB300"
                            fill={i < rev.rating ? '#FFB300' : 'none'}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Tags List if present */}
                    {tagList.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.65rem' }}>
                        {tagList.map((tag, idx) => (
                          <span
                            key={idx}
                            style={{
                              background: 'var(--bg-surface)',
                              border: '1px solid var(--border-subtle)',
                              color: 'var(--primary)',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              padding: '0.2rem 0.55rem',
                              borderRadius: 'var(--radius-full)'
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {rev.must_try_dish && (
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        background: 'rgba(255, 179, 0, 0.12)',
                        color: 'var(--accent-gold)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        padding: '0.25rem 0.65rem',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: '0.65rem'
                      }}>
                        <Award size={13} /> Recommended Dish: {rev.must_try_dish}
                      </div>
                    )}

                    <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.55, marginBottom: '0.85rem' }}>
                      "{actualComment}"
                    </p>

                    {/* Helpful Vote Button */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.65rem' }}>
                      <button
                        onClick={() => toggleHelpful(rev.id)}
                        style={{
                          background: isHelpfulActive ? 'var(--primary-glow)' : 'transparent',
                          color: isHelpfulActive ? 'var(--primary)' : 'var(--text-secondary)',
                          border: isHelpfulActive ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-full)',
                          padding: '0.25rem 0.75rem',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        <ThumbsUp size={13} />
                        <span>Helpful ({countVotes})</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '3rem 2rem',
              textAlign: 'center'
            }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                No reviews yet. Be the first food lover to share your experience at {place.name}!
              </p>
              <button
                onClick={() => setShowReviewModal(true)}
                className="btn btn-secondary"
              >
                Share First Review
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Review Submission Modal */}
      <ReviewModal
        placeId={place.id}
        placeName={place.name}
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onReviewAdded={(newRev) => {
          setPlace(prev => ({
            ...prev,
            reviews: [newRev, ...(prev.reviews || [])]
          }));
        }}
      />

      <style>{`
        @media (max-width: 840px) {
          .place-hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PlaceDetailPage;
