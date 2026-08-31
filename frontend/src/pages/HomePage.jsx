import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Sparkles, UtensilsCrossed, Compass, 
  ArrowRight, ShieldCheck, HeartHandshake, Eye, Award, CheckCircle2 
} from 'lucide-react';
import CityCard from '../components/CityCard';
import FoodCard from '../components/FoodCard';
import PlaceCard from '../components/PlaceCard';
import AISuggestionModal from '../components/AISuggestionModal';
import { cityService, foodService, placeService } from '../services/api';

const HomePage = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [mustTryFoods, setMustTryFoods] = useState([]);
  const [hiddenGems, setHiddenGems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCitySlug, setSelectedCitySlug] = useState('');
  const [showAIModal, setShowAIModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [citiesRes, foodsRes, gemsRes] = await Promise.all([
          cityService.getAll(true),
          foodService.getAll({ must_try: 'true' }),
          placeService.getAll({ hidden_gem: 'true' })
        ]);
        setCities(citiesRes.data);
        setMustTryFoods(foodsRes.data.slice(0, 6));
        setHiddenGems(gemsRes.data.slice(0, 6));
      } catch (err) {
        console.error('Failed to load home page data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    let url = '/search?';
    if (searchQuery.trim()) url += `q=${encodeURIComponent(searchQuery.trim())}&`;
    if (selectedCitySlug) url += `city=${encodeURIComponent(selectedCitySlug)}`;
    navigate(url);
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        background: 'radial-gradient(circle at 50% 20%, rgba(255, 94, 54, 0.15) 0%, rgba(11, 14, 20, 0.98) 70%)',
        overflow: 'hidden',
        padding: '4rem 0 5rem 0',
      }}>
        
        {/* Background glow effects */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(255, 94, 54, 0.25) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          
          {/* Tagline Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 94, 54, 0.12)',
            border: '1px solid var(--border-primary)',
            padding: '0.45rem 1.1rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.86rem',
            fontWeight: 700,
            color: 'var(--primary)',
            marginBottom: '1.5rem',
            boxShadow: '0 0 20px rgba(255, 94, 54, 0.2)'
          }}>
            <Sparkles size={16} />
            <span>Discover Every City's Real Taste</span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1.12,
            maxWidth: '900px',
            margin: '0 auto 1.25rem auto',
          }}>
            Find Famous Foods, Local Dishes &amp;{' '}
            <span style={{
              background: 'linear-gradient(90deg, #FF5E36, #FFA000, #FF5E36)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Hidden Gems
            </span>
          </h1>

          {/* Subheading */}
          <p style={{
            fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            margin: '0 auto 2.5rem auto',
            lineHeight: 1.55
          }}>
            New to a city or exploring on a weekend? Uncover legendary street carts, generational family recipes, and authentic local spots missed by commercial food apps.
          </p>

          {/* Hero Search Box */}
          <div style={{
            maxWidth: '780px',
            margin: '0 auto 2rem auto',
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border-bright)',
            padding: '0.65rem',
            borderRadius: 'var(--radius-full)',
            boxShadow: 'var(--shadow-lg)',
          }}>
            <form onSubmit={handleHeroSearch} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              
              {/* City selector dropdown inside search */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.6rem 1rem',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-subtle)',
              }}>
                <MapPin size={18} color="var(--primary)" />
                <select
                  value={selectedCitySlug}
                  onChange={(e) => setSelectedCitySlug(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="" style={{ background: '#19202E' }}>All Cities</option>
                  {cities.map(c => (
                    <option key={c.id} value={c.slug} style={{ background: '#19202E' }}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Main Text Input */}
              <div style={{ flex: 1, minWidth: '220px', display: 'flex', alignItems: 'center', padding: '0 0.75rem' }}>
                <Search size={20} color="var(--text-muted)" style={{ marginRight: '0.6rem' }} />
                <input
                  type="text"
                  placeholder="Search 'Misal Pav', 'Dosa', 'Biryani', 'Chaat'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 1.8rem', borderRadius: 'var(--radius-full)' }}>
                <span>Explore Taste</span>
                <ArrowRight size={17} />
              </button>
            </form>
          </div>

          {/* Quick Action Badges & AI Trigger */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Try asking:</span>
            {['Best Misal in Pune', 'Vada Pav in Mumbai', 'Old Delhi Parathas', 'Bengaluru Butter Dosa'].map((item) => (
              <button
                key={item}
                onClick={() => navigate(`/search?q=${encodeURIComponent(item)}`)}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
              >
                {item}
              </button>
            ))}

            <button
              onClick={() => setShowAIModal(true)}
              style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(255, 94, 54, 0.25))',
                border: '1px solid rgba(168, 85, 247, 0.5)',
                color: '#C084FC',
                borderRadius: 'var(--radius-full)',
                padding: '0.35rem 0.95rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer'
              }}
            >
              <Sparkles size={14} />
              <span>AI Taste Matcher</span>
            </button>
          </div>

        </div>
      </section>

      {/* Featured Cities Section */}
      <section className="section">
        <div className="container">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-tag">
                <Compass size={14} /> City-Wise Exploration
              </div>
              <h2 className="section-title">Explore Iconic Food Cities</h2>
              <p className="section-subtitle">
                Select your city to browse its authentic local dishes, top eateries, street carts, and hidden food lanes.
              </p>
            </div>
            <Link to="/explore" className="btn btn-secondary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.88rem' }}>
              <span>View All 7 Cities</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="cards-grid">
            {cities.map(city => (
              <CityCard key={city.id} city={city} />
            ))}
          </div>
        </div>
      </section>

      {/* Must-Try Famous Foods Section */}
      <section className="section" style={{ background: 'var(--bg-surface)' }}>
        <div className="container">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-tag">
                <UtensilsCrossed size={14} /> Legendary Flavors
              </div>
              <h2 className="section-title">Must-Try Iconic Dishes</h2>
              <p className="section-subtitle">
                Dishes you cannot leave a city without trying at least once in your life.
              </p>
            </div>
            <Link to="/famous-foods" className="btn btn-secondary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.88rem' }}>
              <span>Explore All Foods</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="cards-grid">
            {mustTryFoods.map(food => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        </div>
      </section>

      {/* Hidden Gems Section */}
      <section className="section">
        <div className="container">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-tag" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#C084FC', borderColor: 'rgba(168, 85, 247, 0.4)' }}>
                <Sparkles size={14} /> Secret Food Spots
              </div>
              <h2 className="section-title">Underrated Hidden Food Gems</h2>
              <p className="section-subtitle">
                Small street corners, 60-year-old family establishments, and secret alley carts known only to hardcore locals.
              </p>
            </div>
            <Link to="/hidden-gems" className="btn btn-secondary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.88rem' }}>
              <span>View All Gems</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="cards-grid">
            {hiddenGems.map(place => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section" style={{ background: 'var(--bg-surface)' }}>
        <div className="container">
          <div className="section-header center">
            <div className="section-tag">
              <CheckCircle2 size={14} /> Easy Discovery
            </div>
            <h2 className="section-title">How KhanKhoj Works</h2>
            <p className="section-subtitle">
              Your step-by-step companion to never eat mediocre food in a new city ever again.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2rem',
            marginTop: '2.5rem'
          }}>
            {[
              {
                step: '01',
                title: 'Choose a City',
                desc: 'Select where you are moving, traveling, or looking for your next meal (Pune, Mumbai, Delhi & more).',
                icon: MapPin,
                color: '#FF5E36'
              },
              {
                step: '02',
                title: 'Explore Authentic Dishes',
                desc: 'See the city\'s crown jewel foods, historical background, spice profiles, and must-try lists.',
                icon: UtensilsCrossed,
                color: '#FFA000'
              },
              {
                step: '03',
                title: 'Find Hidden Food Spots',
                desc: 'Discover generational alley eateries, small street food carts, and authentic local spots on interactive maps.',
                icon: Sparkles,
                color: '#A855F7'
              },
              {
                step: '04',
                title: 'Taste & Share Review',
                desc: 'Save your favorites to your personal taste profile and leave ratings to guide fellow foodies.',
                icon: HeartHandshake,
                color: '#10B981'
              },
            ].map((item) => (
              <div 
                key={item.step}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem 1.75rem',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.25s'
                }}
              >
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  fontFamily: 'var(--font-heading)',
                  color: 'rgba(255, 255, 255, 0.06)',
                  position: 'absolute',
                  top: '1rem',
                  right: '1.25rem',
                  lineHeight: 1
                }}>
                  {item.step}
                </div>

                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: `${item.color}18`,
                  border: `1px solid ${item.color}40`,
                  color: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}>
                  <item.icon size={24} />
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.6rem' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Add Food Place CTA */}
      <section className="section">
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 94, 54, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
            border: '1px solid var(--border-bright)',
            borderRadius: 'var(--radius-lg)',
            padding: '4rem 2rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '1rem' }}>
              Know a Small Local Shop Serving Incredible Food?
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto 2rem auto' }}>
              Khankhoj exists to support and celebrate small vendors, hidden stalls, and traditional heritage food crafters. Suggest your favorite spot today!
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/add-place" className="btn btn-primary" style={{ padding: '0.85rem 2.2rem', fontSize: '1rem' }}>
                <span>Suggest a Food Spot</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Recommendation Modal */}
      <AISuggestionModal 
        isOpen={showAIModal} 
        onClose={() => setShowAIModal(false)} 
      />
    </div>
  );
};

export default HomePage;
