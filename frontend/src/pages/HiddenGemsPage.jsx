import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, Search } from 'lucide-react';
import PlaceCard from '../components/PlaceCard';
import { placeService, cityService } from '../services/api';

const HiddenGemsPage = () => {
  const [places, setPlaces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [citiesRes, placesRes] = await Promise.all([
          cityService.getAll(),
          placeService.getAll({ hidden_gem: 'true' })
        ]);
        setCities(citiesRes.data);
        setPlaces(placesRes.data);
      } catch (err) {
        console.error('Failed to load hidden gems', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, []);

  const filteredPlaces = places.filter(p => {
    if (selectedCity && p.city_slug !== selectedCity) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.specialty.toLowerCase().includes(search.toLowerCase()) && !p.area.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        
        {/* Special Gem Header with Purple Glow */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(255, 94, 54, 0.1) 100%)',
          border: '1px solid rgba(168, 85, 247, 0.35)',
          borderRadius: 'var(--radius-lg)',
          padding: '3rem 2.5rem',
          marginBottom: '3rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div className="section-tag" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#C084FC', borderColor: 'rgba(168, 85, 247, 0.5)' }}>
            <Sparkles size={14} /> Secret & Underrated Spots
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            Hidden Food Gems of India
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '720px', lineHeight: 1.6 }}>
            These are the small street carts, 70-year-old alley bakeries, and tucked-away family eateries that rarely appear on standard commercial review apps, yet serve the most unbelievable food.
          </p>
        </div>

        {/* Filter controls */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          marginBottom: '2.5rem'
        }}>
          {/* Search */}
          <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search hidden gem name, specialty, or area..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.4rem', fontSize: '0.88rem' }}
            />
          </div>

          {/* City */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="form-control"
            style={{ width: 'auto', minWidth: '180px', fontSize: '0.88rem' }}
          >
            <option value="">All Cities</option>
            {cities.map(c => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
            Uncovering secret food gems...
          </div>
        ) : filteredPlaces.length > 0 ? (
          <div className="cards-grid">
            {filteredPlaces.map(place => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <p style={{ color: 'var(--text-secondary)' }}>No hidden gems found for this selection.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default HiddenGemsPage;
