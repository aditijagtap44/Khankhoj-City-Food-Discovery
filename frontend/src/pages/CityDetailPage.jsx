import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, UtensilsCrossed, Sparkles, Map as MapIcon, 
  ArrowLeft, Star, Heart, Clock, Award, Compass 
} from 'lucide-react';
import { cityService } from '../services/api';
import FoodCard from '../components/FoodCard';
import PlaceCard from '../components/PlaceCard';
import FilterBar from '../components/FilterBar';
import MapView from '../components/MapView';

const CityDetailPage = () => {
  const { slug } = useParams();
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all_places'); // 'all_places', 'famous_foods', 'hidden_gems', 'map'

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDiet, setSelectedDiet] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [hiddenGemOnly, setHiddenGemOnly] = useState(false);
  const [sortBy, setSortBy] = useState('');

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedDiet('');
    setSelectedPrice('');
    setSelectedRating('');
    setHiddenGemOnly(false);
    setSortBy('');
  };

  useEffect(() => {
    const fetchCity = async () => {
      try {
        setLoading(true);
        const res = await cityService.getBySlug(slug);
        setCity(res.data);
      } catch (err) {
        console.error('Failed to load city details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCity();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>Loading {slug} culinary guide...</div>
      </div>
    );
  }

  if (!city) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2>City Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 2rem 0' }}>The requested city food guide is not available.</p>
        <Link to="/explore" className="btn btn-primary">Browse All Cities</Link>
      </div>
    );
  }

  // Filter places
  let filteredPlaces = city.places || [];
  if (hiddenGemOnly || activeTab === 'hidden_gems') {
    filteredPlaces = filteredPlaces.filter(p => p.is_hidden_gem);
  }
  if (selectedCategory) {
    filteredPlaces = filteredPlaces.filter(p => p.category === selectedCategory);
  }
  if (selectedDiet) {
    filteredPlaces = filteredPlaces.filter(p => p.diet_type === selectedDiet);
  }
  if (selectedPrice) {
    filteredPlaces = filteredPlaces.filter(p => p.price_tier === selectedPrice);
  }
  if (selectedRating) {
    filteredPlaces = filteredPlaces.filter(p => (p.average_rating || 0) >= parseFloat(selectedRating));
  }
  if (sortBy === 'rating') {
    filteredPlaces = [...filteredPlaces].sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
  } else if (sortBy === 'newest') {
    filteredPlaces = [...filteredPlaces].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  const mustTryFoods = (city.foods || []).filter(f => f.is_must_try);

  return (
    <div>
      {/* City Hero Banner */}
      <section style={{
        position: 'relative',
        minHeight: '440px',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '3.5rem 0',
        backgroundImage: `linear-gradient(180deg, rgba(11, 14, 20, 0.4) 0%, rgba(11, 14, 20, 0.95) 100%), url(${city.image_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
          
          <Link to="/explore" style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.4rem', 
            color: '#CBD5E1', 
            fontSize: '0.85rem', 
            fontWeight: 600, 
            marginBottom: '1rem' 
          }}>
            <ArrowLeft size={16} /> Back to all cities
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
            <span className="badge badge-city">
              <MapPin size={12} color="var(--primary)" /> {city.state}
            </span>
            <span className="badge" style={{ background: 'rgba(255, 94, 54, 0.2)', color: 'var(--primary)', border: '1px solid var(--border-primary)' }}>
              {city.places?.length || 0} Food Places Listed
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            {city.name} Food Guide
          </h1>

          <p style={{ fontSize: '1.15rem', color: '#E2E8F0', maxWidth: '750px', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            {city.tagline || city.description}
          </p>

          {/* Must Try Ticker / Fast Pill highlights */}
          {mustTryFoods.length > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem',
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(12px)',
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              maxWidth: 'fit-content'
            }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Award size={15} /> MUST-TRY IN {city.name.toUpperCase()}:
              </span>
              {mustTryFoods.map(f => (
                <Link
                  key={f.id}
                  to={`/food/${f.id}`}
                  style={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#FFF',
                  }}
                >
                  {f.name}
                </Link>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Main Content Area */}
      <section className="section" style={{ paddingTop: '2.5rem' }}>
        <div className="container">
          
          {/* Navigation Tabs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '1rem',
            marginBottom: '2rem',
            overflowX: 'auto',
          }}>
            {[
              { id: 'all_places', label: 'All Food Places', count: city.places?.length || 0, icon: UtensilsCrossed },
              { id: 'famous_foods', label: 'Famous Foods & Dishes', count: city.foods?.length || 0, icon: Award },
              { id: 'hidden_gems', label: 'Hidden Gems', count: city.places?.filter(p => p.is_hidden_gem).length || 0, icon: Sparkles },
              { id: 'map', label: 'City Food Map', count: null, icon: MapIcon },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? 'var(--primary)' : 'var(--bg-card)',
                  color: activeTab === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
                  border: activeTab === tab.id ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.6rem 1.25rem',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: activeTab === tab.id ? 'var(--shadow-primary)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span style={{
                    background: activeTab === tab.id ? 'rgba(255, 255, 255, 0.25)' : 'var(--bg-surface)',
                    padding: '0.1rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem'
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* TAB 1: ALL FOOD PLACES & HIDDEN GEMS */}
          {(activeTab === 'all_places' || activeTab === 'hidden_gems') && (
            <div>
              {/* Filters */}
              <FilterBar
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                selectedDiet={selectedDiet}
                onSelectDiet={setSelectedDiet}
                selectedPrice={selectedPrice}
                onSelectPrice={setSelectedPrice}
                selectedRating={selectedRating}
                onSelectRating={setSelectedRating}
                hiddenGemOnly={hiddenGemOnly || activeTab === 'hidden_gems'}
                onToggleHiddenGem={setHiddenGemOnly}
                sortBy={sortBy}
                onSelectSort={setSortBy}
                onResetFilters={handleResetFilters}
              />

              {filteredPlaces.length > 0 ? (
                <div className="cards-grid">
                  {filteredPlaces.map(place => (
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
                }}>
                  <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                    No food spots match your current filter settings in {city.name}.
                  </p>
                  <button 
                    onClick={() => {
                      setSelectedCategory('');
                      setSelectedDiet('');
                      setSelectedPrice('');
                      setHiddenGemOnly(false);
                      setSortBy('');
                    }}
                    className="btn btn-secondary"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FAMOUS FOODS */}
          {activeTab === 'famous_foods' && (
            <div>
              <div style={{ marginBottom: '1.75rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                  Authentic & Famous Dishes of {city.name}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  Click on any food item to discover its history, spice secrets, and the best places in the city to eat it.
                </p>
              </div>

              <div className="cards-grid">
                {(city.foods || []).map(food => (
                  <FoodCard key={food.id} food={food} />
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: INTERACTIVE CITY FOOD MAP */}
          {activeTab === 'map' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                  {city.name} Culinary Map
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  Explore food places geographically. Click any pin to view details and open turn-by-turn directions.
                </p>
              </div>

              <MapView 
                places={city.places || []} 
                center={[city.latitude || 18.5204, city.longitude || 73.8567]} 
                height="550px"
              />
            </div>
          )}

        </div>
      </section>
    </div>
  );
};

export default CityDetailPage;
