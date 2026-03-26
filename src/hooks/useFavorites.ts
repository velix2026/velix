import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/lib/products';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [favoritesCount, setFavoritesCount] = useState(0);

  const loadFavorites = useCallback(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      const favs = JSON.parse(saved);
      setFavorites(favs);
      setFavoritesCount(favs.length);
    } else {
      setFavorites([]);
      setFavoritesCount(0);
    }
  }, []);

  const removeFromFavorites = useCallback((productId: number) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(p => p.id !== productId);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setFavoritesCount(newFavorites.length);
      window.dispatchEvent(new CustomEvent('favoritesUpdated'));
      return newFavorites;
    });
  }, []);

  useEffect(() => {
    loadFavorites();
    
    const handleFavoritesUpdate = () => {
      loadFavorites();
    };
    
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
    };
  }, [loadFavorites]);

  return {
    favorites,
    favoritesCount,
    removeFromFavorites,
  };
}