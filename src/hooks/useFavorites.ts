import { useState, useEffect, useCallback, useRef } from 'react';
import { Product } from '@/lib/products';

const trackFavoriteEvent = (eventName: string, data: any) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, {
      ...data,
      event_category: 'favorites',
    });
  }
};

// ✅ دالة حساب إجمالي الكمية من stockItems
const getTotalStock = (product: Product): number => {
  if (product.stockItems && Array.isArray(product.stockItems)) {
    return product.stockItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
  }
  return product.stock || 0;
};

export function useFavorites() {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [favoriteSlugs, setFavoriteSlugs] = useState<Set<string>>(new Set());
  const isMountedRef = useRef(true);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadFavorites = useCallback(() => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    updateTimeoutRef.current = setTimeout(() => {
      if (!isMountedRef.current) return;
      
      try {
        const saved = localStorage.getItem('favorites');
        if (saved) {
          const favs = JSON.parse(saved);
          setFavorites(favs);
          setFavoritesCount(favs.length);
          setFavoriteSlugs(new Set(favs.map((p: Product) => p.slug)));
        } else {
          setFavorites([]);
          setFavoritesCount(0);
          setFavoriteSlugs(new Set());
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
        setFavorites([]);
        setFavoritesCount(0);
        setFavoriteSlugs(new Set());
      }
    }, 0);
  }, []);

  const addToFavorites = useCallback((product: Product) => {
    setFavorites(prev => {
      const exists = prev.some(p => p.slug === product.slug);
      if (!exists) {
        const newFavorites = [...prev, product];
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        setFavoritesCount(newFavorites.length);
        setFavoriteSlugs(new Set(newFavorites.map(p => p.slug)));
        
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('favoritesUpdated'));
        }, 0);
        
        trackFavoriteEvent('add_to_favorites', {
          productSlug: product.slug,
          productName: product.name,
          favoritesCount: newFavorites.length
        });
        
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('showToast', {
            detail: {
              message: `❤️ اتضاف "${product.name}" للمفضلة`,
              type: 'success'
            }
          }));
        }, 0);
        
        return newFavorites;
      } else {
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('showToast', {
            detail: {
              message: `ℹ️ "${product.name}" موجود في المفضلة بالفعل`,
              type: 'info'
            }
          }));
        }, 0);
        
        return prev;
      }
    });
  }, []);

  const removeFromFavorites = useCallback((productSlug: string, productName?: string) => {
    setFavorites(prev => {
      const removedItem = prev.find(p => p.slug === productSlug);
      const newFavorites = prev.filter(p => p.slug !== productSlug);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setFavoritesCount(newFavorites.length);
      setFavoriteSlugs(new Set(newFavorites.map(p => p.slug)));
      
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('favoritesUpdated'));
      }, 0);
      
      trackFavoriteEvent('remove_from_favorites', {
        productSlug,
        productName: productName || removedItem?.name,
        favoritesCount: newFavorites.length
      });
      
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('showToast', {
          detail: {
            message: `🗑️ اتشال "${productName || removedItem?.name || 'المنتج'}" من المفضلة`,
            type: 'info'
          }
        }));
      }, 0);
      
      return newFavorites;
    });
  }, []);
  
  const isFavorite = useCallback((productSlug: string) => {
    return favoriteSlugs.has(productSlug);
  }, [favoriteSlugs]);
  
  const toggleFavorite = useCallback((product: Product) => {
    if (isFavorite(product.slug)) {
      removeFromFavorites(product.slug, product.name);
    } else {
      addToFavorites(product);
    }
  }, [isFavorite, addToFavorites, removeFromFavorites]);

  useEffect(() => {
    isMountedRef.current = true;
    loadFavorites();
    
    const handleFavoritesUpdate = () => {
      loadFavorites();
    };
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'favorites') {
        loadFavorites();
      }
    };
    
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      isMountedRef.current = false;
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadFavorites]);

  return {
    favorites,
    favoritesCount,
    favoriteSlugs,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  };
}