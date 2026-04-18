import { useState, useEffect, useCallback, useRef } from 'react';
import { Product } from '@/lib/products';
import { getColorByCode } from '@/lib/colors';

export interface CartVariation {
  variationId: string;
  size?: string;
  color?: string;
  quantity: number;
}

export interface CartItem extends Product {
  cartItemId: string;
  quantity: number;
  variations: CartVariation[];
}

// دالة حساب الكمية المتاحة من stockItems
const getAvailableStock = (product: Product, selectedSize?: string, selectedColor?: string): number => {
  if (product.stockItems && Array.isArray(product.stockItems)) {
    if (selectedSize && selectedColor) {
      const stockItem = product.stockItems.find(
        (item: any) => item.size === selectedSize && item.colorCode === selectedColor
      );
      return stockItem?.quantity || 0;
    }
    return product.stockItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
  }
  return product.stock || 0;
};

const getColorName = (colorCode: string): string => {
  const color = getColorByCode(colorCode);
  return color.name || colorCode;
};

// دالة حساب السعر بعد خصم الكمية
const getDiscountedPricePerItem = (item: CartItem, quantityForDiscount: number): number => {
  if (!item.quantityDiscount?.enabled) return item.price;
  const { tiers } = item.quantityDiscount;
  let applicableTier = null;
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (quantityForDiscount >= tiers[i].minQuantity) {
      applicableTier = tiers[i];
      break;
    }
  }
  if (!applicableTier) return item.price;
  return item.price - applicableTier.discountPerItem;
};

const getItemTotalPrice = (item: CartItem): number => {
  const totalQuantity = item.variations.reduce((sum, v) => sum + v.quantity, 0);
  const effectivePrice = getDiscountedPricePerItem(item, totalQuantity);
  return effectivePrice * totalQuantity;
};

const getVariationTotalPrice = (item: CartItem, variation: CartVariation): number => {
  const totalQuantity = item.variations.reduce((sum, v) => sum + v.quantity, 0);
  const effectivePrice = getDiscountedPricePerItem(item, totalQuantity);
  return effectivePrice * variation.quantity;
};

// ✅ تغيير: استقبال slug بدل id
const generateCartItemId = (productSlug: string): string => {
  return `${productSlug}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
};

const generateVariationId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
};

const trackCartEvent = (eventName: string, data: any) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, { ...data, event_category: 'cart' });
  }
  try {
    const cartEvents = JSON.parse(localStorage.getItem('cart_events') || '[]');
    cartEvents.push({ event: eventName, data, timestamp: new Date().toISOString() });
    localStorage.setItem('cart_events', JSON.stringify(cartEvents.slice(-50)));
  } catch (error) {
    console.error('Error tracking cart event:', error);
  }
};

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const isMountedRef = useRef(true);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateCartSchema = (cartItems: CartItem[]) => {
    if (typeof document === 'undefined') return;
    const existingScript = document.getElementById('cart-schema');
    if (existingScript) existingScript.remove();
    if (cartItems.length === 0) return;

    const cartSchema = {
      '@context': 'https://schema.org',
      '@type': 'Cart',
      'name': 'سلة VELIX',
      'totalItems': cartItems.reduce((acc, item) => acc + item.quantity, 0),
      'totalPrice': {
        '@type': 'PriceSpecification',
        'price': cartItems.reduce((acc, item) => acc + getItemTotalPrice(item), 0).toFixed(2),
        'priceCurrency': 'EGP'
      },
      'containsPlacement': cartItems.map(item => ({
        '@type': 'Placement',
        'quantity': item.quantity,
        'hasProduct': {
          '@type': 'Product',
          'name': `${item.name}${item.variations.length > 1 ? ` (${item.variations.length} مقاس/لون)` : ''}`,
          'sku': `VELIX-${item.slug}`,
          'offers': { '@type': 'Offer', 'price': item.price, 'priceCurrency': 'EGP' }
        }
      }))
    };
    const script = document.createElement('script');
    script.id = 'cart-schema';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(cartSchema);
    document.head.appendChild(script);
  };

  const calculateCartStats = useCallback((cartItems: CartItem[]) => {
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const total = cartItems.reduce((sum, item) => sum + getItemTotalPrice(item), 0);
    return { totalQuantity, total };
  }, []);

  const saveCart = useCallback((cartItems: CartItem[]) => {
    const toSave = cartItems.map(({ variations, quantity, ...rest }) => ({ ...rest, variations, quantity }));
    localStorage.setItem('cart', JSON.stringify(toSave));
    const { totalQuantity, total } = calculateCartStats(cartItems);
    setCartCount(totalQuantity);
    setCartTotal(total);
    updateCartSchema(cartItems);
    setTimeout(() => window.dispatchEvent(new CustomEvent('cartUpdated')), 0);
  }, [calculateCartStats]);

  const loadCart = useCallback(() => {
    if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
    updateTimeoutRef.current = setTimeout(() => {
      if (!isMountedRef.current) return;
      try {
        const saved = localStorage.getItem('cart');
        if (saved) {
          const cartItems = JSON.parse(saved);
          const itemsWithDefaults = cartItems.map((item: any) => ({
            ...item,
            variations: item.variations || (item.selectedSize || item.selectedColor ? [{
              variationId: generateVariationId(),
              size: item.selectedSize,
              color: item.selectedColor,
              quantity: item.quantity || 1
            }] : [{ variationId: generateVariationId(), quantity: item.quantity || 1 }]),
            quantity: item.variations?.reduce((sum: number, v: any) => sum + v.quantity, 0) || item.quantity || 1
          }));
          setCart(itemsWithDefaults);
          const { totalQuantity, total } = calculateCartStats(itemsWithDefaults);
          setCartCount(totalQuantity);
          setCartTotal(total);
          updateCartSchema(itemsWithDefaults);
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
    }, 0);
  }, [calculateCartStats]);

  // ✅ addToCart - استخدام slug
  const addToCart = useCallback((product: Product, selectedSize?: string, selectedColor?: string, quantity: number = 1) => {
    const availableStock = getAvailableStock(product, selectedSize, selectedColor);
    if (availableStock === 0) {
      setTimeout(() => window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message: `⚠️ المنتج ده (مقاس ${selectedSize || 'غير محدد'}، لون ${getColorName(selectedColor || 'غير محدد')}) خلص من عندنا`, type: 'warning' }
      })), 0);
      return;
    }
    if (quantity > availableStock) {
      setTimeout(() => window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message: `⚠️ معندناش غير ${availableStock} قطعة من المنتج ده`, type: 'warning' }
      })), 0);
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.slug === product.slug);
      
      if (existingItem) {
        const existingVariation = existingItem.variations.find(v => v.size === selectedSize && v.color === selectedColor);
        
        if (existingVariation) {
          const newQuantity = existingVariation.quantity + quantity;
          if (newQuantity > availableStock) {
            setTimeout(() => window.dispatchEvent(new CustomEvent('showToast', {
              detail: { message: `⚠️ معندناش غير ${availableStock} قطعة من المنتج ده`, type: 'warning' }
            })), 0);
            return prevCart;
          }
          const newVariations = existingItem.variations.map(v =>
            v.variationId === existingVariation.variationId ? { ...v, quantity: newQuantity } : v
          );
          const newTotalQuantity = newVariations.reduce((sum, v) => sum + v.quantity, 0);
          const updatedItem = { ...existingItem, variations: newVariations, quantity: newTotalQuantity };
          const newCart = prevCart.map(item => item.slug === product.slug ? updatedItem : item);
          saveCart(newCart);
          
          setTimeout(() => window.dispatchEvent(new CustomEvent('showToast', {
            detail: { message: `✅ اتضاف ${quantity} × "${product.name}"${selectedSize ? ` (مقاس ${selectedSize})` : ''}${selectedColor ? ` (لون ${getColorName(selectedColor)})` : ''} للسلة`, type: 'success' }
          })), 0);
          return newCart;
        } else {
          const newVariations = [...existingItem.variations, {
            variationId: generateVariationId(),
            size: selectedSize,
            color: selectedColor,
            quantity
          }];
          const newTotalQuantity = newVariations.reduce((sum, v) => sum + v.quantity, 0);
          const updatedItem = { ...existingItem, variations: newVariations, quantity: newTotalQuantity };
          const newCart = prevCart.map(item => item.slug === product.slug ? updatedItem : item);
          saveCart(newCart);
          
          setTimeout(() => window.dispatchEvent(new CustomEvent('showToast', {
            detail: { message: `✅ اتضاف ${quantity} × "${product.name}"${selectedSize ? ` (مقاس ${selectedSize})` : ''}${selectedColor ? ` (لون ${getColorName(selectedColor)})` : ''} للسلة`, type: 'success' }
          })), 0);
          return newCart;
        }
      } else {
        const newItem: CartItem = {
          ...product,
          cartItemId: generateCartItemId(product.slug),
          quantity: quantity,
          variations: [{
            variationId: generateVariationId(),
            size: selectedSize,
            color: selectedColor,
            quantity
          }]
        };
        const newCart = [...prevCart, newItem];
        saveCart(newCart);
        
        setTimeout(() => window.dispatchEvent(new CustomEvent('showToast', {
          detail: { message: `✅ اتضاف ${quantity} × "${product.name}"${selectedSize ? ` (مقاس ${selectedSize})` : ''}${selectedColor ? ` (لون ${getColorName(selectedColor)})` : ''} للسلة`, type: 'success' }
        })), 0);
        return newCart;
      }
    });
  }, [saveCart]);

  // ✅ updateVariationQuantity - استخدام slug
  const updateVariationQuantity = useCallback((productSlug: string, variationId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart => {
      const item = prevCart.find(i => i.slug === productSlug);
      if (!item) return prevCart;
      
      const variation = item.variations.find(v => v.variationId === variationId);
      if (!variation) return prevCart;
      
      const availableStock = getAvailableStock(item, variation.size, variation.color);
      if (newQuantity > availableStock) {
        setTimeout(() => window.dispatchEvent(new CustomEvent('showToast', {
          detail: { message: `⚠️ معندناش غير ${availableStock} قطعة من المنتج ده`, type: 'warning' }
        })), 0);
        return prevCart;
      }
      
      const newVariations = item.variations.map(v => v.variationId === variationId ? { ...v, quantity: newQuantity } : v);
      const newTotalQuantity = newVariations.reduce((sum, v) => sum + v.quantity, 0);
      const updatedItem = { ...item, variations: newVariations, quantity: newTotalQuantity };
      const newCart = prevCart.map(i => i.slug === productSlug ? updatedItem : i);
      saveCart(newCart);
      return newCart;
    });
  }, [saveCart]);

  // ✅ removeVariation - استخدام slug
  const removeVariation = useCallback((productSlug: string, variationId: string, productName?: string, variationDesc?: string) => {
    setCart(prevCart => {
      const item = prevCart.find(i => i.slug === productSlug);
      if (!item) return prevCart;
      
      const newVariations = item.variations.filter(v => v.variationId !== variationId);
      let newCart;
      if (newVariations.length === 0) {
        newCart = prevCart.filter(i => i.slug !== productSlug);
      } else {
        const newTotalQuantity = newVariations.reduce((sum, v) => sum + v.quantity, 0);
        const updatedItem = { ...item, variations: newVariations, quantity: newTotalQuantity };
        newCart = prevCart.map(i => i.slug === productSlug ? updatedItem : i);
      }
      saveCart(newCart);
      
      setTimeout(() => window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message: `🗑️ اتشال "${productName || item.name}${variationDesc ? ` (${variationDesc})` : ''}" من السلة`, type: 'info' }
      })), 0);
      return newCart;
    });
  }, [saveCart]);

  // ✅ removeFromCartByProductId - استخدام slug (تغيير اسم الدالة اختياري)
  const removeFromCartByProductSlug = useCallback((productSlug: string, productName?: string) => {
    setCart(prevCart => {
      const item = prevCart.find(i => i.slug === productSlug);
      if (!item) return prevCart;
      const newCart = prevCart.filter(i => i.slug !== productSlug);
      saveCart(newCart);
      setTimeout(() => window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message: `🗑️ اتشال "${productName || item.name}" من السلة`, type: 'info' }
      })), 0);
      return newCart;
    });
  }, [saveCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    setCartCount(0);
    setCartTotal(0);
    localStorage.removeItem('cart');
    setTimeout(() => window.dispatchEvent(new CustomEvent('cartUpdated')), 0);
    const existingScript = document.getElementById('cart-schema');
    if (existingScript) existingScript.remove();
  }, []);

  // ✅ isInCart - استخدام slug
  const isInCart = useCallback((productSlug: string) => {
    return cart.some(item => item.slug === productSlug);
  }, [cart]);

  useEffect(() => {
    isMountedRef.current = true;
    loadCart();
    const handleCartUpdate = () => loadCart();
    const handleStorageChange = (e: StorageEvent) => { if (e.key === 'cart') loadCart(); };
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      isMountedRef.current = false;
      if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadCart]);

  return {
    cart,
    cartCount,
    cartTotal,
    addToCart,
    updateVariationQuantity,
    removeVariation,
    removeFromCartByProductSlug,
    clearCart,
    isInCart,
  };
}