import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, MapPin, Sparkles, Image, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cityService, placeService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AddPlacePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    address: '',
    area: '',
    specialty: '',
    description: '',
    category: 'street_food',
    diet_type: 'pure_veg',
    price_range: '₹120 for two',
    price_tier: 'budget',
    image_url: '',
    latitude: 18.5204,
    longitude: 73.8567,
    opening_hours: '8:00 AM - 10:00 PM',
    phone: '',
    is_hidden_gem: false,
    why_special: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await cityService.getAll();
        setCities(res.data);
        if (res.data.length > 0) {
          setFormData(prev => ({ ...prev, city: res.data[0].id }));
        }
      } catch (err) {
        console.error('Failed to load cities for form', err);
      }
    };
    fetchCities();
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCitySelect = (e) => {
    const cityId = parseInt(e.target.value);
    const selected = cities.find(c => c.id === cityId);
    setFormData(prev => ({
      ...prev,
      city: cityId,
      latitude: selected?.latitude || 18.5204,
      longitude: selected?.longitude || 73.8567,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Default image if not supplied
    let submissionData = { ...formData };
    if (!submissionData.image_url.trim()) {
      submissionData.image_url = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80';
    }

    try {
      setLoading(true);
      setError('');
      await placeService.submitPlace(submissionData);
      setSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Failed to submit place', err);
      setError(err.response?.data?.detail || 'Failed to submit place. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div style={{
          maxWidth: '560px',
          margin: '0 auto',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-bright)',
          borderRadius: 'var(--radius-lg)',
          padding: '3.5rem 2rem',
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: 'var(--veg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto'
          }}>
            <Check size={32} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.6rem' }}>Food Spot Added Successfully!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Thank you for contributing to the Khankhoj food discovery community. Your recommended food place is now live!
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button onClick={() => { setSuccess(false); setFormData(prev => ({ ...prev, name: '', address: '', specialty: '', description: '', why_special: '' })); }} className="btn btn-secondary">
              Add Another Place
            </button>
            <Link to="/explore" className="btn btn-primary">
              Explore City Guides
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.25rem' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="section-tag">
            <PlusCircle size={14} /> Community Recommendation
          </div>
          <h1 className="section-title">Suggest a Food Place or Hidden Gem</h1>
          <p className="section-subtitle">
            Help travelers and food lovers discover small local stalls, secret street alleys, and authentic traditional food spots.
          </p>
        </div>

        {!isAuthenticated && (
          <div style={{
            background: 'rgba(255, 179, 0, 0.12)',
            border: '1px solid rgba(255, 179, 0, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--accent-gold)' }}>
              <AlertCircle size={20} />
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Please log in to submit a food place.</span>
            </div>
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.82rem' }}>
              Login Now
            </Link>
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#EF4444',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        {/* Submission Form */}
        <form onSubmit={handleSubmit} style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem 2rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            
            {/* Place Name */}
            <div className="form-group">
              <label className="form-label">Food Place / Stall Name *</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Kata Kirr, JJ Garden Vada Pav, Ashok Vada Pav..."
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* City */}
            <div className="form-group">
              <label className="form-label">City *</label>
              <select
                required
                className="form-control"
                name="city"
                value={formData.city}
                onChange={handleCitySelect}
              >
                {cities.map(c => (
                  <option key={c.id} value={c.id}>{c.name}, {c.state}</option>
                ))}
              </select>
            </div>

            {/* Locality / Area */}
            <div className="form-group">
              <label className="form-label">Locality / Area Name *</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Karve Nagar, FC Road, Chandni Chowk..."
                name="area"
                value={formData.area}
                onChange={handleChange}
              />
            </div>

            {/* Specialty Dish */}
            <div className="form-group">
              <label className="form-label">Specialty Dishes (What should people order?) *</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Spicy Kat Misal, Bun Maska Chai, Butter Pav Bhaji..."
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">Place Type / Category</label>
              <select
                className="form-control"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="street_food">Street Food Stall / Cart</option>
                <option value="traditional_eatery">Traditional Eatery / Wada</option>
                <option value="heritage_spot">Heritage Iconic Spot</option>
                <option value="sweet_shop">Sweet & Snack Shop</option>
                <option value="cafe">Cafe & Bakery</option>
                <option value="family_restaurant">Family Restaurant</option>
              </select>
            </div>

            {/* Diet Type */}
            <div className="form-group">
              <label className="form-label">Diet Type</label>
              <select
                className="form-control"
                name="diet_type"
                value={formData.diet_type}
                onChange={handleChange}
              >
                <option value="pure_veg">Pure Vegetarian 🌿</option>
                <option value="non_veg_served">Non-Vegetarian & Veg 🍗</option>
                <option value="veg_friendly">Vegetarian Friendly</option>
              </select>
            </div>

            {/* Price Tier & Range */}
            <div className="form-group">
              <label className="form-label">Approx Price For Two</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. ₹120 for two"
                name="price_range"
                value={formData.price_range}
                onChange={handleChange}
              />
            </div>

            {/* Opening Hours */}
            <div className="form-group">
              <label className="form-label">Opening Hours</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 7:30 AM - 10:00 PM"
                name="opening_hours"
                value={formData.opening_hours}
                onChange={handleChange}
              />
            </div>

          </div>

          {/* Full Address */}
          <div className="form-group">
            <label className="form-label">Full Address / Landmark *</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. Opposite Kalmadi High School, Dr Ketkar Road, Erandwane..."
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description & Taste Experience *</label>
            <textarea
              required
              className="form-control"
              rows={3}
              placeholder="Describe the flavor, history, seating arrangement, spice levels, and why this spot is worth visiting..."
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Image URL */}
          <div className="form-group">
            <label className="form-label">Photo URL (Optional)</label>
            <input
              type="url"
              className="form-control"
              placeholder="https://images.unsplash.com/..."
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
            />
          </div>

          {/* Hidden Gem Checkbox & Why Special */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            margin: '1.5rem 0'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem' }}>
              <input
                type="checkbox"
                name="is_hidden_gem"
                checked={formData.is_hidden_gem}
                onChange={handleChange}
              />
              <span style={{ color: '#C084FC', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sparkles size={16} /> Mark as a Secret / Underrated Hidden Gem
              </span>
            </label>

            {formData.is_hidden_gem && (
              <div style={{ marginTop: '1rem' }}>
                <label className="form-label" style={{ fontSize: '0.85rem' }}>Why is this a hidden gem? (Secret backstory, family recipe, obscure location)</label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="Explain why only true locals know this place..."
                  name="why_special"
                  value={formData.why_special}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isAuthenticated}
              className="btn btn-primary"
              style={{ padding: '0.75rem 2rem' }}
            >
              <PlusCircle size={18} />
              <span>{loading ? 'Submitting Place...' : 'Submit Food Place'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default AddPlacePage;
