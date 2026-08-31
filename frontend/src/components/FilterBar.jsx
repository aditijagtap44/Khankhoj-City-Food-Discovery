import React, { useState } from 'react';
import { Filter, Sparkles, Utensils, IndianRupee, Star, X, Search, RotateCcw, ChevronDown } from 'lucide-react';

const FilterBar = ({ 
  selectedCategory = '', 
  onSelectCategory, 
  selectedDiet = '', 
  onSelectDiet, 
  selectedPrice = '', 
  onSelectPrice, 
  selectedRating = '',
  onSelectRating,
  hiddenGemOnly = false, 
  onToggleHiddenGem,
  sortBy = '',
  onSelectSort,
  searchKeyword = '',
  onSearchKeywordChange,
  onResetFilters,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const categories = [
    { id: '', label: 'All Categories' },
    { id: 'street_food', label: '🍲 Street Food' },
    { id: 'traditional_eatery', label: '🍛 Traditional Eatery' },
    { id: 'heritage_spot', label: '🏛️ Heritage Spot' },
    { id: 'sweet_shop', label: '🍬 Sweets & Snacks' },
    { id: 'cafe', label: '☕ Cafe & Bakery' },
  ];

  const diets = [
    { id: '', label: 'All Diets' },
    { id: 'pure_veg', label: 'Pure Veg 🌿' },
    { id: 'non_veg_served', label: 'Non-Veg 🍗' },
  ];

  const prices = [
    { id: '', label: 'All Budgets' },
    { id: 'budget', label: '₹ Under 150' },
    { id: 'moderate', label: '₹₹ 150 - 400' },
    { id: 'premium', label: '₹₹₹ 400+' },
  ];

  const ratings = [
    { id: '', label: 'Any Rating' },
    { id: '4.0', label: '4.0+ ★' },
    { id: '4.5', label: '4.5+ ★ Elite' },
  ];

  // Count active filters
  let activeFilterCount = 0;
  if (selectedCategory) activeFilterCount++;
  if (selectedDiet) activeFilterCount++;
  if (selectedPrice) activeFilterCount++;
  if (selectedRating) activeFilterCount++;
  if (hiddenGemOnly) activeFilterCount++;
  if (searchKeyword) activeFilterCount++;

  const handleReset = () => {
    if (onResetFilters) {
      onResetFilters();
    } else {
      if (onSelectCategory) onSelectCategory('');
      if (onSelectDiet) onSelectDiet('');
      if (onSelectPrice) onSelectPrice('');
      if (onSelectRating) onSelectRating('');
      if (onToggleHiddenGem) onToggleHiddenGem(false);
      if (onSearchKeywordChange) onSearchKeywordChange('');
      if (onSelectSort) onSelectSort('');
    }
  };

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.25rem 1.5rem',
      marginBottom: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      boxShadow: 'var(--shadow-sm)'
    }}>
      
      {/* Top Filter Controls: Search & Main Filters */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.85rem',
      }}>
        
        {/* Diet Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '0.2rem' }}>
            DIET:
          </span>
          {diets.map(d => (
            <button
              key={d.id}
              onClick={() => onSelectDiet && onSelectDiet(d.id)}
              style={{
                background: selectedDiet === d.id ? 'var(--primary)' : 'var(--bg-card)',
                color: selectedDiet === d.id ? '#FFFFFF' : 'var(--text-primary)',
                border: selectedDiet === d.id ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                padding: '0.35rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Price Pills */}
        {onSelectPrice && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '0.2rem' }}>
              PRICE:
            </span>
            {prices.map(p => (
              <button
                key={p.id}
                onClick={() => onSelectPrice(p.id)}
                style={{
                  background: selectedPrice === p.id ? 'var(--primary)' : 'var(--bg-card)',
                  color: selectedPrice === p.id ? '#FFFFFF' : 'var(--text-primary)',
                  border: selectedPrice === p.id ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.32rem 0.75rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}

        {/* Right actions: Hidden Gems, Sort & Reset */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginLeft: 'auto' }}>
          
          {/* Hidden Gem Toggle */}
          {onToggleHiddenGem && (
            <button
              onClick={() => onToggleHiddenGem(!hiddenGemOnly)}
              style={{
                background: hiddenGemOnly ? 'linear-gradient(135deg, #A855F7, #7E22CE)' : 'var(--bg-card)',
                color: hiddenGemOnly ? '#FFFFFF' : '#C084FC',
                border: hiddenGemOnly ? 'none' : '1px solid rgba(168, 85, 247, 0.4)',
                borderRadius: 'var(--radius-full)',
                padding: '0.38rem 0.95rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                cursor: 'pointer',
                boxShadow: hiddenGemOnly ? '0 0 16px rgba(168, 85, 247, 0.4)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <Sparkles size={14} />
              <span>Hidden Gems</span>
            </button>
          )}

          {/* Sort dropdown */}
          {onSelectSort && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <select
                value={sortBy}
                onChange={(e) => onSelectSort(e.target.value)}
                style={{
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.38rem 0.75rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="">Featured Sort</option>
                <option value="rating">Highest Rated ★</option>
                <option value="newest">Recently Added</option>
              </select>
            </div>
          )}

          {/* Clear Filters Button */}
          {activeFilterCount > 0 && (
            <button
              onClick={handleReset}
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                color: '#EF4444',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-full)',
                padding: '0.35rem 0.75rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              title="Reset all active filters"
            >
              <RotateCcw size={13} />
              <span>Reset ({activeFilterCount})</span>
            </button>
          )}

        </div>

      </div>

      {/* Category Scroll Bar */}
      {onSelectCategory && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.25rem',
        }}>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => onSelectCategory(c.id)}
              style={{
                background: selectedCategory === c.id ? 'var(--primary-glow)' : 'transparent',
                color: selectedCategory === c.id ? 'var(--primary)' : 'var(--text-secondary)',
                border: selectedCategory === c.id ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                padding: '0.35rem 0.9rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

    </div>
  );
};

export default FilterBar;
