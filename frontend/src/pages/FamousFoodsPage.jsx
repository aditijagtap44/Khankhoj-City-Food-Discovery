import React, { useState, useEffect } from 'react';
import { UtensilsCrossed, Filter, MapPin, Search } from 'lucide-react';
import FoodCard from '../components/FoodCard';
import { foodService, cityService } from '../services/api';

const FamousFoodsPage = () => {
  const [foods, setFoods] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDiet, setSelectedDiet] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [citiesRes, foodsRes] = await Promise.all([
          cityService.getAll(),
          foodService.getAll()
        ]);
        setCities(citiesRes.data);
        setFoods(foodsRes.data);
      } catch (err) {
        console.error('Failed to load foods', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
    window.scrollTo(0, 0);
  }, []);

  const filteredFoods = foods.filter(f => {
    if (selectedCity && f.city_slug !== selectedCity) return false;
    if (selectedDiet && f.diet_type !== selectedDiet) return false;
    if (selectedCategory && f.category !== selectedCategory) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase()) && !f.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ maxWidth: '700px', marginBottom: '2.5rem' }}>
          <div className="section-tag">
            <UtensilsCrossed size={14} /> Iconic Dishes
          </div>
          <h1 className="section-title">Famous Foods of Every City</h1>
          <p className="section-subtitle">
            From fiery Misal Pav in Pune and crispy Benne Dosa in Bangalore to fragrant Biryani in Hyderabad, discover the true food legends.
          </p>
        </div>

        {/* Filter Bar */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          marginBottom: '2.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center'
        }}>
          
          {/* Search */}
          <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search dish (e.g. Biryani, Misal, Paratha)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.4rem', fontSize: '0.88rem' }}
            />
          </div>

          {/* City Filter */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="form-control"
            style={{ width: 'auto', minWidth: '160px', fontSize: '0.88rem' }}
          >
            <option value="">All Cities</option>
            {cities.map(c => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>

          {/* Diet Filter */}
          <select
            value={selectedDiet}
            onChange={(e) => setSelectedDiet(e.target.value)}
            className="form-control"
            style={{ width: 'auto', minWidth: '160px', fontSize: '0.88rem' }}
          >
            <option value="">All Diets</option>
            <option value="veg">Vegetarian 🌿</option>
            <option value="non_veg">Non-Vegetarian 🍗</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-control"
            style={{ width: 'auto', minWidth: '160px', fontSize: '0.88rem' }}
          >
            <option value="">All Categories</option>
            <option value="street_food">Street Food</option>
            <option value="breakfast">Breakfast & Snacks</option>
            <option value="traditional_food">Traditional Food</option>
            <option value="dessert">Dessert & Sweets</option>
            <option value="main_course">Main Course</option>
            <option value="beverage">Beverages</option>
          </select>

        </div>

        {/* Food Cards Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
            Loading dishes...
          </div>
        ) : filteredFoods.length > 0 ? (
          <div className="cards-grid">
            {filteredFoods.map(food => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <p style={{ color: 'var(--text-secondary)' }}>No dishes found matching your filter selection.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default FamousFoodsPage;
