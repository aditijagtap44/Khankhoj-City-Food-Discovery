import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEMES = [
  {
    id: 'dark',
    name: 'Midnight Spice',
    subtitle: 'Classic Dark & Saffron',
    icon: '🌙',
    primary: '#FF5E36',
    bg: '#0B0E14',
  },
  {
    id: 'light',
    name: 'Golden Chai',
    subtitle: 'Warm Cream & Terracotta',
    icon: '☀️',
    primary: '#E65100',
    bg: '#FDFBF7',
  },
  {
    id: 'royal',
    name: 'Royal Emerald',
    subtitle: 'Imperial Forest & Gold',
    icon: '👑',
    primary: '#10B981',
    bg: '#071611',
  },
  {
    id: 'cyberpunk',
    name: 'Cyber Foodie',
    subtitle: 'Neon Glow & Electric Vibe',
    icon: '⚡',
    primary: '#EC4899',
    bg: '#0B0B1E',
  },
];

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('khankhoj_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('khankhoj_theme', theme);
  }, [theme]);

  const selectTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const toggleTheme = () => {
    // Quick toggle between dark and light, or cycle
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const currentThemeMeta = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <ThemeContext.Provider value={{ theme, selectTheme, toggleTheme, currentThemeMeta, availableThemes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
