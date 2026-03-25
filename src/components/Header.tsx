'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import SideDrawer from './SideDrawer';
import { Product } from '@/lib/products';

interface CartItem extends Product {
  quantity: number;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [isFavoritesDrawerOpen, setIsFavoritesDrawerOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const pathname = usePathname();

  // تحديث القوائم من localStorage
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

  const loadCart = useCallback(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      const cartItems = JSON.parse(saved);
      // حساب إجمالي الكميات
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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    loadFavorites();
    loadCart();

    const handleFavoritesUpdate = () => {
      loadFavorites();
    };
    
    const handleCartUpdate = () => {
      loadCart();
    };
    
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [loadFavorites, loadCart]);

  const isActive = (path: string) => {
    return pathname === path;
  };

  // وظائف المفضلة
  const removeFromFavorites = useCallback((productId: number) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(p => p.id !== productId);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setFavoritesCount(newFavorites.length);
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('favoritesUpdated'));
      }, 0);
      return newFavorites;
    });
  }, []);

  // وظائف السلة
  const updateCartQuantity = useCallback((productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart => {
      const updatedCart = prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      
      // حساب إجمالي الكميات
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

  const handleFavoritesClick = () => {
    loadFavorites();
    setIsFavoritesDrawerOpen(true);
  };

  const handleCartClick = () => {
    loadCart();
    setIsCartDrawerOpen(true);
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100' 
            : 'bg-white/80 backdrop-blur-sm border-b border-gray-200/50'
        }`}
        itemScope
        itemType="https://schema.org/WPHeader"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo with SEO */}
            <Link href="/" className="flex items-center shrink-0" aria-label="VELIX - الصفحة الرئيسية">
              <div className="relative w-10 h-10 md:w-12 md:h-12">
                <Image
                  src="/logo.png"
                  alt="VELIX براند ملابس مصري"
                  title="VELIX - براند ملابس مصري عصري"
                  fill
                  sizes="(max-width: 768px) 40px, 48px"
                  className="object-contain"
                  priority
                />
              </div>
              <span className="sr-only">VELIX - براند ملابس مصري</span>
            </Link>

            {/* Desktop Navigation with SEO */}
            <nav className="hidden md:flex items-center gap-8" aria-label="القائمة الرئيسية" itemScope itemType="https://schema.org/SiteNavigationElement">
              <Link 
                href="/" 
                className={`font-bold text-sm transition-all duration-300 ${
                  isActive('/') 
                    ? 'text-black border-b-2 border-black' 
                    : 'text-gray-700 hover:text-black hover:border-b-2 hover:border-gray-400'
                } pb-1`}
                aria-current={isActive('/') ? 'page' : undefined}
              >
                الرئيسية
              </Link>
              <Link 
                href="/products" 
                className={`font-bold text-sm transition-all duration-300 ${
                  isActive('/products') 
                    ? 'text-black border-b-2 border-black' 
                    : 'text-gray-700 hover:text-black hover:border-b-2 hover:border-gray-400'
                } pb-1`}
                aria-current={isActive('/products') ? 'page' : undefined}
              >
                المنتجات
              </Link>
              <Link 
                href="/about" 
                className={`font-bold text-sm transition-all duration-300 ${
                  isActive('/about') 
                    ? 'text-black border-b-2 border-black' 
                    : 'text-gray-700 hover:text-black hover:border-b-2 hover:border-gray-400'
                } pb-1`}
                aria-current={isActive('/about') ? 'page' : undefined}
              >
                عن البراند
              </Link>
              <a 
                href="https://wa.me/201500125133" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white px-5 py-1.5 rounded-full text-xs font-bold hover:bg-gray-800 transition-all duration-300 hover:scale-105"
                aria-label="تواصل معنا عبر واتساب"
              >
                تواصل معنا
              </a>
            </nav>

            {/* Icons Section */}
            <div className="flex items-center gap-3">
              <button 
                onClick={handleFavoritesClick}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-all duration-300 group"
                aria-label="المفضلة"
                aria-live="polite"
              >
                <svg className="w-5 h-5 text-gray-700 group-hover:text-black transition" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {favoritesCount}
                  </span>
                )}
              </button>

              <button 
                onClick={handleCartClick}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-all duration-300 group"
                aria-label="سلة التسوق"
                aria-live="polite"
              >
                <svg className="w-5 h-5 text-gray-700 group-hover:text-black transition" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
                aria-label={isMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
                aria-expanded={isMenuOpen}
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation with SEO */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100 bg-white">
              <nav className="flex flex-col gap-3" aria-label="القائمة الرئيسية (موبايل)">
                <Link 
                  href="/" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`font-bold py-1 text-sm transition ${
                    isActive('/') ? 'text-black' : 'text-gray-600 hover:text-black'
                  }`}
                  aria-current={isActive('/') ? 'page' : undefined}
                >
                  الرئيسية
                </Link>
                <Link 
                  href="/products" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`font-bold py-1 text-sm transition ${
                    isActive('/products') ? 'text-black' : 'text-gray-600 hover:text-black'
                  }`}
                  aria-current={isActive('/products') ? 'page' : undefined}
                >
                  المنتجات
                </Link>
                <Link 
                  href="/about" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`font-bold py-1 text-sm transition ${
                    isActive('/about') ? 'text-black' : 'text-gray-600 hover:text-black'
                  }`}
                  aria-current={isActive('/about') ? 'page' : undefined}
                >
                  عن البراند
                </Link>
                <a 
                  href="https://wa.me/201500125133" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black text-white px-5 py-1.5 rounded-full text-xs font-bold text-center hover:bg-gray-800 transition w-fit"
                  aria-label="تواصل معنا عبر واتساب"
                >
                  تواصل معنا
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>
      
      {/* نافذة المفضلة */}
      <SideDrawer
        isOpen={isFavoritesDrawerOpen}
        onClose={() => setIsFavoritesDrawerOpen(false)}
        type="favorites"
        items={favorites}
        onRemove={removeFromFavorites}
        onAddToCart={addToCart}
      />
      
      {/* نافذة السلة */}
      <SideDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        type="cart"
        items={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateCartQuantity}
      />
    </>
  );
}