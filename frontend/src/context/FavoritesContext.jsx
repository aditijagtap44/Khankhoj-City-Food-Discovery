import React, { createContext, useContext, useState, useEffect } from 'react';
import { placeService } from '../services/api';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [favoritesList, setFavoritesList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = async () => {
    if (!isAuthenticated) {
      setFavoriteIds(new Set());
      setFavoritesList([]);
      return;
    }
    try {
      setLoading(true);
      const res = await placeService.getFavorites();
      const ids = new Set(res.data.map(item => item.food_place.id));
      setFavoriteIds(ids);
      setFavoritesList(res.data.map(item => item.food_place));
    } catch (err) {
      console.error('Failed to fetch favorites', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [isAuthenticated]);

  const toggleFavorite = async (place) => {
    if (!isAuthenticated) {
      return { success: false, requireAuth: true };
    }

    try {
      const res = await placeService.toggleFavorite(place.id);
      const isFav = res.data.is_favorited;

      setFavoriteIds(prev => {
        const next = new Set(prev);
        if (isFav) next.add(place.id);
        else next.delete(place.id);
        return next;
      });

      if (isFav) {
        setFavoritesList(prev => [place, ...prev.filter(p => p.id !== place.id)]);
      } else {
        setFavoritesList(prev => prev.filter(p => p.id !== place.id));
      }

      return { success: true, isFavorited: isFav };
    } catch (err) {
      console.error('Failed to toggle favorite', err);
      return { success: false, error: err };
    }
  };

  const isFavorited = (placeId) => favoriteIds.has(placeId);

  return (
    <FavoritesContext.Provider value={{ favoriteIds, favoritesList, isFavorited, toggleFavorite, loading, refreshFavorites: fetchFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
