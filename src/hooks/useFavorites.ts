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
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
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
          setFavoriteIds(new Set(favs.map((p: Product) => p.id)));
        } else {
          setFavorites([]);
          setFavoritesCount(0);
          setFavoriteIds(new Set());
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
        setFavorites([]);
        setFavoritesCount(0);
        setFavoriteIds(new Set());
      }
    }, 0);
  }, []);

  const addToFavorites = useCallback((product: Product) => {
    setFavorites(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (!exists) {
        const newFavorites = [...prev, product];
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        setFavoritesCount(newFavorites.length);
        setFavoriteIds(new Set(newFavorites.map(p => p.id)));
        
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('favoritesUpdated'));
        }, 0);
        
        trackFavoriteEvent('add_to_favorites', {
          productId: product.id,
          productName: product.name,
          favoritesCount: newFavorites.length
        });
        
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('showToast', {
            detail: {
              message: `❤️ تم إضافة "${product.name}" إلى المفضلة`,
              type: 'success'
            }
          }));
        }, 0);
        
        return newFavorites;
      } else {
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('showToast', {
            detail: {
              message: `⚠️ "${product.name}" موجود بالفعل في المفضلة`,
              type: 'info'
            }
          }));
        }, 0);
        
        return prev;
      }
    });
  }, []);

  const removeFromFavorites = useCallback((productId: number, productName?: string) => {
    setFavorites(prev => {
      const removedItem = prev.find(p => p.id === productId);
      const newFavorites = prev.filter(p => p.id !== productId);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setFavoritesCount(newFavorites.length);
      setFavoriteIds(new Set(newFavorites.map(p => p.id)));
      
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('favoritesUpdated'));
      }, 0);
      
      trackFavoriteEvent('remove_from_favorites', {
        productId,
        productName: productName || removedItem?.name,
        favoritesCount: newFavorites.length
      });
      
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('showToast', {
          detail: {
            message: `🗑️ تم إزالة "${productName || removedItem?.name || 'المنتج'}" من المفضلة`,
            type: 'info'
          }
        }));
      }, 0);
      
      return newFavorites;
    });
  }, []);
  
  const isFavorite = useCallback((productId: number) => {
    return favoriteIds.has(productId);
  }, [favoriteIds]);
  
  const toggleFavorite = useCallback((product: Product) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id, product.name);
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
    favoriteIds,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  };
}