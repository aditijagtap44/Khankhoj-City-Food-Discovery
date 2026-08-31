import React, { useState, useEffect } from 'react';
import { Compass, Search, MapPin } from 'lucide-react';
import CityCard from '../components/CityCard';
import { cityService } from '../services/api';

const ExploreCitiesPage = () => {
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const res = await cityService.getAll();
        setCities(res.data);
      } catch (err) {
        console.error('Failed to load cities', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
    window.scrollTo(0, 0);
  }, []);

  const filteredCities = cities.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.state.toLowerCase().includes(search.toLowerCase()) ||
    (c.tagline && c.tagline.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ maxWidth: '700px', marginBottom: '2.5rem' }}>
          <div className="section-tag">
            <Compass size={14} /> City Food Atlas
          </div>
          <h1 className="section-title">Explore Cities Through Their Food</h1>
          <p className="section-subtitle">
            Every city in India has its own unique spice profile, street culture, and historic eateries. Pick a destination to begin your culinary journey.
          </p>
        </div>

        {/* Filter Input */}
        <div style={{
          maxWidth: '450px',
          marginBottom: '2.5rem',
          position: 'relative'
        }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by city or state (e.g. Pune, Delhi, Maharashtra)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '2.75rem', borderRadius: 'var(--radius-full)' }}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
            Loading cities...
          </div>
        ) : (
          <div className="cards-grid">
            {filteredCities.map(city => (
              <CityCard key={city.id} city={city} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ExploreCitiesPage;
