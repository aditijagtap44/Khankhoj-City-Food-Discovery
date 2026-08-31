import React, { useState } from 'react';
import { Sparkles, X, ArrowRight, Compass, IndianRupee, Flame } from 'lucide-react';
import { searchService } from '../services/api';
import PlaceCard from './PlaceCard';

const AISuggestionModal = ({ isOpen, onClose, defaultCity = '' }) => {
  const [city, setCity] = useState(defaultCity || 'pune');
  const [diet, setDiet] = useState('');
  const [budget, setBudget] = useState('');
  const [craving, setCraving] = useState('');
  const [hiddenGemOnly, setHiddenGemOnly] = useState(false);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  if (!isOpen) return null;

  const handleRecommend = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await searchService.getAIRecommendations({
        city,
        diet,
        budget,
        craving,
        hidden_gem: hiddenGemOnly,
      });
      setResults(res.data);
    } catch (err) {
      console.error('Failed AI recommendation', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      zIndex: 2100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
    }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-bright)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '840px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: 'var(--shadow-lg)',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(255, 94, 54, 0.1) 100%)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #A855F7 0%, #7E22CE 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              boxShadow: '0 0 15px rgba(168, 85, 247, 0.5)'
            }}>
              <Sparkles size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>AI Food Matcher & Recommender</h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                Tell us your craving & vibe, and our taste algorithm will pick the perfect authentic spot.
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Query Builder */}
        <form onSubmit={handleRecommend} style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1rem',
          }}>
            {/* City */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.82rem' }}>Target City</label>
              <select 
                className="form-control" 
                value={city} 
                onChange={(e) => setCity(e.target.value)}
              >
                <option value="pune">Pune</option>
                <option value="mumbai">Mumbai</option>
                <option value="delhi">Delhi</option>
                <option value="bangalore">Bangalore</option>
                <option value="hyderabad">Hyderabad</option>
                <option value="chennai">Chennai</option>
                <option value="kolkata">Kolkata</option>
              </select>
            </div>

            {/* Diet */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.82rem' }}>Diet Preference</label>
              <select 
                className="form-control" 
                value={diet} 
                onChange={(e) => setDiet(e.target.value)}
              >
                <option value="">Any Diet</option>
                <option value="pure_veg">Pure Vegetarian 🌿</option>
                <option value="non_veg_served">Non-Vegetarian 🍗</option>
              </select>
            </div>

            {/* Budget */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.82rem' }}>Budget Range</label>
              <select 
                className="form-control" 
                value={budget} 
                onChange={(e) => setBudget(e.target.value)}
              >
                <option value="">Any Budget</option>
                <option value="budget">Under ₹150 (Budget Friendly)</option>
                <option value="moderate">₹150 - ₹400 (Moderate)</option>
                <option value="premium">₹400+ (Premium)</option>
              </select>
            </div>
          </div>

          {/* Craving Input */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ fontSize: '0.82rem' }}>What specific craving or vibe do you have?</label>
            <input 
              type="text" 
              className="form-control"
              placeholder="e.g. spicy breakfast, crispy dosa, juicy biryani, vintage tea cafe, midnight misal..."
              value={craving}
              onChange={(e) => setCraving(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <input 
                type="checkbox" 
                checked={hiddenGemOnly} 
                onChange={(e) => setHiddenGemOnly(e.target.checked)} 
              />
              <span>Focus only on undiscovered <strong style={{ color: '#C084FC' }}>Hidden Gems</strong></span>
            </label>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.6rem 1.4rem' }}>
              <Sparkles size={16} />
              <span>{loading ? 'Finding Best Spots...' : 'Find Matches'}</span>
            </button>
          </div>
        </form>

        {/* Results Area */}
        {results && (
          <div style={{ padding: '1.5rem' }}>
            <div style={{
              background: 'var(--bg-surface)',
              borderLeft: '4px solid #A855F7',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              color: 'var(--text-primary)',
            }}>
              ✨ {results.suggestion_tip} ({results.recommendations.length} places matched)
            </div>

            {results.recommendations.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
                {results.recommendations.map(p => (
                  <PlaceCard key={p.id} place={p} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No direct matches found for this specific combination. Try broadening your craving keywords or budget!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AISuggestionModal;
