import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, UtensilsCrossed, Sparkles, Filter, ArrowRight } from 'lucide-react';
import { searchService, placeService } from '../services/api';
import CityCard from '../components/CityCard';
import FoodCard from '../components/FoodCard';
import PlaceCard from '../components/PlaceCard';
import FilterBar from '../components/FilterBar';

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const cityParam = searchParams.get('city') || '';
  const dietParam = searchParams.get('diet') || '';
  const categoryParam = searchParams.get('category') || '';

  const [inputQuery, setInputQuery] = useState(query);
  const [searchResults, setSearchResults] = useState({ cities: [], foods: [], places: [] });
  const [loading, setLoading] = useState(true);

  // Additional dynamic filters on places
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedDiet, setSelectedDiet] = useState(dietParam);
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
    setInputQuery(query);
    const performSearch = async () => {
      try {
        setLoading(true);
        if (query.trim()) {
          const res = await searchService.globalSearch(query.trim());
          setSearchResults(res.data);
        } else {
          // If no global query, search via places endpoint with params
          const placesRes = await placeService.getAll({
            city: cityParam,
            diet: dietParam,
            category: categoryParam,
          });
          setSearchResults({ cities: [], foods: [], places: placesRes.data });
        }
      } catch (err) {
        console.error('Failed to perform search', err);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
    window.scrollTo(0, 0);
  }, [query, cityParam, dietParam, categoryParam]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      setSearchParams({ q: inputQuery.trim() });
    }
  };

  // Filter place results
  let filteredPlaces = searchResults.places || [];
  if (hiddenGemOnly) {
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
  }

  const totalResults = (searchResults.cities?.length || 0) + (searchResults.foods?.length || 0) + filteredPlaces.length;

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        
        {/* Search Bar Top */}
        <div style={{ maxWidth: '800px', margin: '0 auto 3rem auto' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.65rem' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={20} color="var(--primary)" style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search food name, city, specialty, or place..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '2.8rem', fontSize: '1rem', borderRadius: 'var(--radius-full)' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)', padding: '0 1.75rem' }}>
              Search
            </button>
          </form>

          {query && (
            <div style={{ marginTop: '0.9rem', fontSize: '0.92rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
              Found <strong>{totalResults}</strong> result{totalResults === 1 ? '' : 's'} for "<strong style={{ color: 'var(--primary)' }}>{query}</strong>"
            </div>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
            Searching authentic dishes and places across cities...
          </div>
        ) : (
          <div>
            
            {/* MATCHING CITIES SECTION */}
            {searchResults.cities && searchResults.cities.length > 0 && (
              <div style={{ marginBottom: '3.5rem' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={18} color="var(--primary)" /> Matching Cities ({searchResults.cities.length})
                </h3>
                <div className="cards-grid">
                  {searchResults.cities.map(c => (
                    <CityCard key={c.id} city={c} />
                  ))}
                </div>
              </div>
            )}

            {/* MATCHING FOOD DISHES SECTION */}
            {searchResults.foods && searchResults.foods.length > 0 && (
              <div style={{ marginBottom: '3.5rem' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UtensilsCrossed size={18} color="var(--primary)" /> Famous Dishes ({searchResults.foods.length})
                </h3>
                <div className="cards-grid">
                  {searchResults.foods.map(f => (
                    <FoodCard key={f.id} food={f} />
                  ))}
                </div>
              </div>
            )}

            {/* FOOD PLACES & EATERIES SECTION */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                  Recommended Food Places ({filteredPlaces.length})
                </h3>
              </div>

              {/* Filters for Place results */}
              <FilterBar
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                selectedDiet={selectedDiet}
                onSelectDiet={setSelectedDiet}
                selectedPrice={selectedPrice}
                onSelectPrice={setSelectedPrice}
                selectedRating={selectedRating}
                onSelectRating={setSelectedRating}
                hiddenGemOnly={hiddenGemOnly}
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
                  padding: '3.5rem 2rem',
                  textAlign: 'center',
                }}>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    No food spots match your search and filter criteria.
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
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default SearchResultsPage;
