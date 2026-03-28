// hooks/useCart.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { Product } from '@/lib/products';

export interface CartItem extends Product {
  cartItemId: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

const getEffectivePrice = (item: CartItem | Product): number => {
  if (item.oldPrice && item.oldPrice > item.price) {
    return item.price;
  }
  return item.price;
};

const getSavingsForCartItem = (item: CartItem): number => {
  if (item.oldPrice && item.oldPrice > item.price) {
    return (item.oldPrice - item.price) * item.quantity;
  }
  return 0;
};

const trackCartEvent = (eventName: string, data: any) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, {
      ...data,
      event_category: 'cart',
      event_label: data.productName || 'cart_interaction'
    });
  }
  
  try {
    const cartEvents = JSON.parse(localStorage.getItem('cart_events') || '[]');
    cartEvents.push({ event: eventName, data, timestamp: new Date().toISOString() });
    localStorage.setItem('cart_events', JSON.stringify(cartEvents.slice(-50)));
  } catch (error) {
    console.error('Error tracking cart event:', error);
  }
};

const generateCartItemId = (productId: number, size?: string, color?: string): string => {
  return `${productId}-${size || 'nosize'}-${color || 'nocolor'}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
};

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const isMountedRef = useRef(true);

  const updateCartSchema = (cartItems: CartItem[]) => {
    if (typeof document === 'undefined') return;
    
    const existingScript = document.getElementById('cart-schema');
    if (existingScript) existingScript.remove();
    
    if (cartItems.length === 0) return;
    
    const cartSchema = {
      '@context': 'https://schema.org',
      '@type': 'Order',
      'potentialAction': {
        '@type': 'CheckoutAction',
        'target': `${window.location.origin}/checkout`
      },
      'acceptedOffer': cartItems.map(item => ({
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Product',
          'name': `${item.name}${item.selectedSize ? ` - مقاس ${item.selectedSize}` : ''}${item.selectedColor ? ` - لون ${item.selectedColor}` : ''}`,
          'sku': `VELIX-${item.id}`,
          'price': getEffectivePrice(item),
          'priceCurrency': 'EGP',
        },
        'quantity': item.quantity
      }))
    };
    
    const script = document.createElement('script');
    script.id = 'cart-schema';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(cartSchema);
    document.head.appendChild(script);
  };

  const loadCart = useCallback(() => {
    requestAnimationFrame(() => {
      if (!isMountedRef.current) return;
      
      try {
        const saved = localStorage.getItem('cart');
        if (saved) {
          const cartItems = JSON.parse(saved);
          const totalQuantity = cartItems.reduce((sum: number, item: CartItem) => {
            return sum + (item.quantity || 1);
          }, 0);
          setCartCount(totalQuantity);
          
          const total = cartItems.reduce((sum: number, item: CartItem) => {
            const price = getEffectivePrice(item);
            return sum + (price * (item.quantity || 1));
          }, 0);
          setCartTotal(total);
          
          const cartWithQuantity = cartItems.map((item: CartItem) => ({ 
            ...item, 
            quantity: item.quantity || 1 
          }));
          setCart(cartWithQuantity);
          
          updateCartSchema(cartWithQuantity);
        } else {
          setCart([]);
          setCartCount(0);
          setCartTotal(0);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        setCart([]);
        setCartCount(0);
        setCartTotal(0);
      }
    });
  }, []);

  const updateCartQuantity = useCallback((cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart => {
      const updatedCart = prevCart.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
      );
      
      const totalQuantity = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
      const total = updatedCart.reduce((sum, item) => {
        const price = getEffectivePrice(item);
        return sum + (price * item.quantity);
      }, 0);
      
      setCartCount(totalQuantity);
      setCartTotal(total);
      
      const toSave = updatedCart.map(({ quantity, ...rest }) => ({ ...rest, quantity }));
      localStorage.setItem('cart', JSON.stringify(toSave));
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      trackCartEvent('update_quantity', {
        cartItemId,
        quantity: newQuantity,
        cartTotal: total,
        cartCount: totalQuantity
      });
      
      updateCartSchema(updatedCart);
      
      return updatedCart;
    });
  }, []);

  const removeFromCart = useCallback((cartItemId: string, productName?: string) => {
    setCart(prevCart => {
      const removedItem = prevCart.find(item => item.cartItemId === cartItemId);
      const newCart = prevCart.filter(item => item.cartItemId !== cartItemId);
      const totalQuantity = newCart.reduce((sum, item) => sum + item.quantity, 0);
      const total = newCart.reduce((sum, item) => {
        const price = getEffectivePrice(item);
        return sum + (price * item.quantity);
      }, 0);
      
      setCartCount(totalQuantity);
      setCartTotal(total);
      
      const toSave = newCart.map(({ quantity, ...rest }) => ({ ...rest, quantity }));
      localStorage.setItem('cart', JSON.stringify(toSave));
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      trackCartEvent('remove_from_cart', {
        cartItemId,
        productName: productName || removedItem?.name,
        cartTotal: total,
        cartCount: totalQuantity
      });
      
      updateCartSchema(newCart);
      
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('showToast', {
          detail: {
            message: `🗑️ تم إزالة "${productName || removedItem?.name || 'المنتج'}" من السلة`,
            type: 'info'
          }
        }));
      }, 0);
      
      return newCart;
    });
  }, []);

  const addToCart = useCallback((product: Product, selectedSize?: string, selectedColor?: string, quantity: number = 1) => {
    setCart(prevCart => {
      const newCartItem: CartItem = {
        ...product,
        cartItemId: generateCartItemId(product.id, selectedSize, selectedColor),
        quantity: quantity,
        selectedSize,
        selectedColor
      };
      
      const newCart = [...prevCart, newCartItem];
      
      const totalQuantity = newCart.reduce((sum, item) => sum + item.quantity, 0);
      const total = newCart.reduce((sum, item) => {
        const price = getEffectivePrice(item);
        return sum + (price * item.quantity);
      }, 0);
      
      setCartCount(totalQuantity);
      setCartTotal(total);
      
      const toSave = newCart.map(({ quantity, ...rest }) => ({ ...rest, quantity }));
      localStorage.setItem('cart', JSON.stringify(toSave));
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      trackCartEvent('add_to_cart', {
        productId: product.id,
        productName: product.name,
        selectedSize,
        selectedColor,
        quantity,
        cartTotal: total,
        cartCount: totalQuantity
      });
      
      updateCartSchema(newCart);
      
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('showToast', {
          detail: {
            message: `✅ تم إضافة ${quantity} × "${product.name}"${selectedSize ? ` (مقاس ${selectedSize})` : ''}${selectedColor ? ` (لون ${selectedColor})` : ''} إلى السلة`,
            type: 'success'
          }
        }));
      }, 0);
      
      return newCart;
    });
  }, []);
  
  const clearCart = useCallback(() => {
    setCart([]);
    setCartCount(0);
    setCartTotal(0);
    localStorage.removeItem('cart');
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    trackCartEvent('cart_cleared', {
      timestamp: new Date().toISOString()
    });
    
    const existingScript = document.getElementById('cart-schema');
    if (existingScript) existingScript.remove();
  }, []);
  
  const isInCart = useCallback((productId: number) => {
    return cart.some(item => item.id === productId);
  }, [cart]);
  
  const uniqueItemsCount = cart.length;
  const totalSavings = cart.reduce((sum, item) => sum + getSavingsForCartItem(item), 0);

  useEffect(() => {
    isMountedRef.current = true;
    loadCart();
    
    const handleCartUpdate = () => {
      loadCart();
    };
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart') {
        loadCart();
      }
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      isMountedRef.current = false;
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadCart]);

  return {
    cart,
    cartCount,
    cartTotal,
    uniqueItemsCount,
    totalSavings,
    updateCartQuantity,
    removeFromCart,
    addToCart,
    clearCart,
    isInCart,
  };
}