'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // تحميل عدد المفضلات والسلة من localStorage
    const savedFavorites = localStorage.getItem('favorites');
    const savedCart = localStorage.getItem('cart');
    
    if (savedFavorites) {
      setFavoritesCount(JSON.parse(savedFavorites).length);
    }
    if (savedCart) {
      setCartCount(JSON.parse(savedCart).length);
    }

    // استقبال تحديثات المفضلة والسلة من ProductCard
    const handleFavoritesUpdate = (event: CustomEvent) => {
      setFavoritesCount(event.detail);
    };
    
    const handleCartUpdate = (event: CustomEvent) => {
      setCartCount(event.detail);
    };
    
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate as EventListener);
    window.addEventListener('cartUpdated', handleCartUpdate as EventListener);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate as EventListener);
      window.removeEventListener('cartUpdated', handleCartUpdate as EventListener);
    };
  }, []);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleFavoritesClick = () => {
    alert(`لديك ${favoritesCount} منتجات في المفضلة`);
  };

  const handleCartClick = () => {
    alert(`لديك ${cartCount} منتجات في السلة`);
  };

  return (
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
  );
}