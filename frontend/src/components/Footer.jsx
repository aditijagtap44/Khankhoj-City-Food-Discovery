import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Heart, MapPin, Sparkles, Send, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ 
      background: 'var(--bg-surface)', 
      borderTop: '1px solid var(--border-subtle)',
      padding: '4.5rem 0 2rem 0',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3.5rem'
        }}>
          
          {/* Brand Col */}
          <div style={{ maxWidth: '320px' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.1rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #FF5E36 0%, #FF2A00 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}>
                <UtensilsCrossed size={20} />
              </div>
              <span style={{ 
                fontFamily: 'var(--font-heading)', 
                fontSize: '1.4rem', 
                fontWeight: 800, 
                letterSpacing: '-0.03em',
                background: 'linear-gradient(90deg, #FF5E36, #FFA000)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                KhanKhoj
              </span>
            </Link>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Discover every city's real taste. Helping food lovers, travelers, and locals find legendary heritage eateries and hidden culinary gems across India.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#social" 
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--primary)';
                    e.currentTarget.style.borderColor = 'var(--primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick City Food Guides */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
              City Food Guides
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                { name: 'Pune Food Guide', slug: 'pune' },
                { name: 'Mumbai Street Food', slug: 'mumbai' },
                { name: 'Old Delhi Flavors', slug: 'delhi' },
                { name: 'Bangalore Dosas & Kaapi', slug: 'bangalore' },
                { name: 'Hyderabad Biryani Trail', slug: 'hyderabad' },
                { name: 'Chennai Tiffin Guide', slug: 'chennai' },
                { name: 'Kolkata Kathi & Mishti', slug: 'kolkata' },
              ].map((c) => (
                <Link 
                  key={c.slug} 
                  to={`/city/${c.slug}`}
                  style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Food Specialties */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
              Food Categories
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <Link to="/famous-foods" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Iconic Must-Try Dishes</Link>
              <Link to="/hidden-gems" style={{ fontSize: '0.88rem', color: 'var(--gem)' }}>Secret Alleys & Hidden Gems</Link>
              <Link to="/search?diet=veg" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Pure Vegetarian Havens</Link>
              <Link to="/search?category=street_food" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Legendary Street Carts</Link>
              <Link to="/search?category=dessert" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Traditional Sweets & Desserts</Link>
              <Link to="/add-place" style={{ fontSize: '0.88rem', color: 'var(--primary)', fontWeight: 600 }}>+ Submit a Local Food Place</Link>
            </div>
          </div>

          {/* Newsletter / Foodie Mission */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
              Join the Taste Club
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Get weekly secret food gems and city culinary guides delivered directly to your inbox.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to Khankhoj Taste Club!'); }} style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="email" 
                required 
                placeholder="Enter your email" 
                style={{
                  flex: 1,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.6rem 1rem',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ width: '40px', height: '40px', padding: 0, borderRadius: '50%', flexShrink: 0 }}
              >
                <Send size={15} />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.75rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.82rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} KhanKhoj. Discover Every City's Real Taste. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <a href="#privacy" style={{ color: 'inherit' }}>Privacy Policy</a>
            <a href="#terms" style={{ color: 'inherit' }}>Terms of Service</a>
            <a href="#contact" style={{ color: 'inherit' }}>Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
