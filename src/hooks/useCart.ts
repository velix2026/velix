import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/lib/products';

interface CartItem extends Product {
  quantity: number;
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);

  const loadCart = useCallback(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      const cartItems = JSON.parse(saved);
      const totalQuantity = cartItems.reduce((sum: number, item: Product & { quantity?: number }) => {
        return sum + (item.quantity || 1);
      }, 0);
      setCartCount(totalQuantity);
      
      const cartWithQuantity = cartItems.map((item: Product & { quantity?: number }) => ({ 
        ...item, 
        quantity: item.quantity || 1 
      }));
      setCart(cartWithQuantity);
    } else {
      setCart([]);
      setCartCount(0);
    }
  }, []);

  const updateCartQuantity = useCallback((productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart => {
      const updatedCart = prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      
      const totalQuantity = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalQuantity);
      
      const toSave = updatedCart.map(({ quantity, ...rest }) => ({ ...rest, quantity }));
      localStorage.setItem('cart', JSON.stringify(toSave));
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      return updatedCart;
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.id !== productId);
      const totalQuantity = newCart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalQuantity);
      
      const toSave = newCart.map(({ quantity, ...rest }) => ({ ...rest, quantity }));
      localStorage.setItem('cart', JSON.stringify(toSave));
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      return newCart;
    });
  }, []);

  const addToCart = useCallback((product: Product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (!existing) {
        const newCart = [...prevCart, { ...product, quantity: 1 }];
        const totalQuantity = newCart.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalQuantity);
        
        const toSave = newCart.map(({ quantity, ...rest }) => ({ ...rest, quantity }));
        localStorage.setItem('cart', JSON.stringify(toSave));
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        alert('تم إضافة المنتج إلى السلة');
        return newCart;
      } else {
        alert('المنتج موجود بالفعل في السلة');
        return prevCart;
      }
    });
  }, []);

  useEffect(() => {
    loadCart();
    
    const handleCartUpdate = () => {
      loadCart();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [loadCart]);

  return {
    cart,
    cartCount,
    updateCartQuantity,
    removeFromCart,
    addToCart,
  };
}