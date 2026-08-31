import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Compass, MapPin, Sparkles, Heart, PlusCircle, User, 
  Sun, Moon, Menu, X, Search, UtensilsCrossed, LogOut, ChevronDown, Palette, Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';
import { cityService } from '../services/api';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { favoritesList } = useFavorites();
  const { theme, selectTheme, currentThemeMeta, availableThemes } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [cities, setCities] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await cityService.getAll(true);
        setCities(res.data);
      } catch (err) {
        console.error('Failed to load cities for navbar', err);
      }
    };
    fetchCities();
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCityDropdownOpen(false);
    setThemeDropdownOpen(false);
    setUserDropdownOpen(false);
    setShowSearchModal(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchModal(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav className="navbar-glass">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '76px' }}>
          
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #FF5E36 0%, #FF2A00 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(255, 94, 54, 0.4)',
              color: '#FFFFFF'
            }}>
              <UtensilsCrossed size={22} />
            </div>
            <div>
              <span style={{ 
                fontFamily: 'var(--font-heading)', 
                fontSize: '1.45rem', 
                fontWeight: 800, 
                letterSpacing: '-0.03em',
                background: 'linear-gradient(90deg, #FF5E36, #FFA000)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'block',
                lineHeight: 1.1
              }}>
                KhanKhoj
              </span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.04em' }}>
                DISCOVER REAL TASTE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div style={{ display: 'none', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
            <Link to="/explore" style={{ 
              fontWeight: 600, 
              fontSize: '0.92rem', 
              color: location.pathname === '/explore' ? 'var(--primary)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <Compass size={17} /> Explore Cities
            </Link>

            <Link to="/famous-foods" style={{ 
              fontWeight: 600, 
              fontSize: '0.92rem', 
              color: location.pathname === '/famous-foods' ? 'var(--primary)' : 'var(--text-secondary)',
            }}>
              Famous Foods
            </Link>

            <Link to="/hidden-gems" style={{ 
              fontWeight: 600, 
              fontSize: '0.92rem', 
              color: location.pathname === '/hidden-gems' ? 'var(--gem)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <Sparkles size={17} color="#A855F7" /> Hidden Gems
            </Link>

            {/* City Selector Dropdown */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.45rem 0.95rem',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer'
                }}
              >
                <MapPin size={15} color="var(--primary)" />
                <span>Select City</span>
                <ChevronDown size={14} />
              </button>

              {cityDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '115%',
                  left: 0,
                  width: '200px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-bright)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '0.5rem',
                  zIndex: 1100
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', padding: '0.4rem 0.6rem', textTransform: 'uppercase' }}>
                    Popular Cities
                  </div>
                  {cities.map(c => (
                    <Link
                      key={c.id}
                      to={`/city/${c.slug}`}
                      onClick={() => setCityDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0.65rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <span>{c.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.places_count} spots</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Items */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            
            {/* Search Trigger */}
            <button 
              onClick={() => setShowSearchModal(true)}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                padding: '0.5rem 0.9rem',
                color: 'var(--text-secondary)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
              }}
            >
              <Search size={16} color="var(--primary)" />
              <span className="search-btn-text">Search foods, places...</span>
            </button>

            {/* Theme Selector Dropdown */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="btn-icon"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                title={`Current Theme: ${currentThemeMeta?.name || 'Theme'}`}
              >
                <Palette size={18} color="var(--primary)" />
                <span style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: currentThemeMeta?.primary || 'var(--primary)',
                  border: '1px solid var(--bg-card)'
                }} />
              </button>

              {themeDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '115%',
                  right: 0,
                  width: '230px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-bright)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '0.6rem',
                  zIndex: 1150
                }}>
                  <div style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    padding: '0.35rem 0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Select Theme
                  </div>
                  {availableThemes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        selectTheme(t.id);
                        setThemeDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.55rem 0.65rem',
                        borderRadius: 'var(--radius-sm)',
                        background: theme === t.id ? 'var(--bg-surface)' : 'transparent',
                        border: theme === t.id ? '1px solid var(--border-primary)' : '1px solid transparent',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        marginBottom: '0.2rem',
                        transition: 'all 0.15s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span style={{ fontSize: '1.1rem' }}>{t.icon}</span>
                        <div>
                          <div style={{ fontSize: '0.86rem', fontWeight: 700, lineHeight: 1.2 }}>{t.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t.subtitle}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: t.primary,
                          display: 'inline-block'
                        }} />
                        {theme === t.id && <Check size={14} color="var(--primary)" />}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Favorites Icon */}
            <Link 
              to="/favorites"
              className="btn-icon"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                color: favoritesList.length > 0 ? '#EF4444' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
              title="Saved Favorites"
            >
              <Heart size={18} fill={favoritesList.length > 0 ? '#EF4444' : 'none'} />
              {favoritesList.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: 'var(--primary)',
                  color: '#FFF',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {favoritesList.length}
                </span>
              )}
            </Link>

            {/* Add Food Place Button */}
            <Link to="/add-place" className="btn btn-primary add-place-btn" style={{ padding: '0.5rem 1.15rem', fontSize: '0.85rem' }}>
              <PlusCircle size={16} />
              <span>Add Place</span>
            </Link>

            {/* User Auth Profile / Login */}
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.4rem 0.8rem',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.85rem'
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    color: '#FFF',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700
                  }}>
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span style={{ maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.first_name || user?.username}
                  </span>
                  <ChevronDown size={14} />
                </button>

                {userDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '115%',
                    right: 0,
                    width: '190px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-bright)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '0.5rem',
                    zIndex: 1100
                  }}>
                    <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.35rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{user?.first_name} {user?.last_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{user?.username}</div>
                    </div>
                    <Link to="/profile" style={{ display: 'block', padding: '0.45rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      My Profile
                    </Link>
                    <Link to="/favorites" style={{ display: 'block', padding: '0.45rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      Saved Places ({favoritesList.length})
                    </Link>
                    <button
                      onClick={logout}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '0.45rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                        color: '#EF4444',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        marginTop: '0.35rem',
                        borderTop: '1px solid var(--border-subtle)'
                      }}
                    >
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}>
                <User size={15} />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile Menu Hamburger */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-hamburger"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                padding: '0.5rem',
                borderRadius: 'var(--radius-sm)',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div style={{
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-bright)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <Link to="/explore" style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Compass size={18} color="var(--primary)" /> Explore Cities
            </Link>
            <Link to="/famous-foods" style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UtensilsCrossed size={18} color="var(--primary)" /> Famous Foods
            </Link>
            <Link to="/hidden-gems" style={{ fontWeight: 600, color: 'var(--gem)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} /> Hidden Gems
            </Link>
            <Link to="/add-place" style={{ fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PlusCircle size={18} /> Add a Food Place
            </Link>
          </div>
        )}
      </nav>

      {/* Global Search Modal Overlay */}
      {showSearchModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 2000,
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '5rem'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-bright)',
            borderRadius: 'var(--radius-lg)',
            width: '90%',
            maxWidth: '650px',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
            height: 'fit-content'
          }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', padding: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <Search size={22} color="var(--primary)" style={{ marginRight: '0.75rem' }} />
              <input
                type="text"
                autoFocus
                placeholder="Search Misal Pav Pune, Butter Chicken Delhi, Cafe..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '1.15rem',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit'
                }}
              />
              <button 
                type="button" 
                onClick={() => setShowSearchModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </form>
            <div style={{ padding: '1rem 1.25rem', background: 'var(--bg-surface)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Trending Searches
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['Misal Pav Pune', 'Vada Pav Mumbai', 'Chole Bhature Delhi', 'CTR Benne Dosa', 'Hyderabadi Biryani', 'Kathi Roll Kolkata'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      navigate(`/search?q=${encodeURIComponent(term)}`);
                      setShowSearchModal(false);
                    }}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.35rem 0.8rem',
                      fontSize: '0.82rem',
                      color: 'var(--text-primary)',
                      cursor: 'pointer'
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
        }
        @media (max-width: 900px) {
          .mobile-hamburger {
            display: flex !important;
          }
          .search-btn-text {
            display: none;
          }
          .add-place-btn span {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
