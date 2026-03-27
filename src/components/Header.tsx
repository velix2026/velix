'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

import { useFavorites } from '@/hooks/useFavorites';
import { useCart } from '@/hooks/useCart';
import SideDrawer from './SideDrawer';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFavoritesDrawerOpen, setIsFavoritesDrawerOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const pathname = usePathname();

  const { favorites, favoritesCount, removeFromFavorites } = useFavorites();
  const { cart, cartCount, updateCartQuantity, removeFromCart, addToCart } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  // بيانات منظمة لـ Google
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: 'VELIX',
    url: 'https://velixstore.vercel.app',
    logo: 'https://velixstore.vercel.app/logo.png',
    sameAs: [
      'https://instagram.com/velix.2026',
      'https://facebook.com/velix2026',
      'https://tiktok.com/@velix2026'
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'EG'
    }
  };

  return (
    <>
      {/* SEO: JSON-LD للبراند */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />

      {/* ================== HEADER ================== */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/70 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] border-b border-gray-200/40 py-2'
            : 'bg-transparent py-4'
        }`}
        role="banner"
        aria-label="الرأس الرئيسي لموقع VELIX"
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo with SEO */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="VELIX - الصفحة الرئيسية"
            title="VELIX براند ملابس مصري"
          >
            <div className="relative w-10 h-10 md:w-12 md:h-12 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="VELIX - براند ملابس مصري عصري"
                title="VELIX براند ملابس مصري"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="sr-only">VELIX - براند ملابس مصري</span>
          </Link>

          {/* Desktop Navigation with semantic HTML */}
          <nav
            className="hidden md:flex items-center gap-10"
            aria-label="القائمة الرئيسية"
            role="navigation"
          >
            {[
              { href: '/', label: 'الرئيسية', title: 'الصفحة الرئيسية لبراند VELIX' },
              { href: '/products', label: 'المنتجات', title: 'جميع منتجات VELIX - ملابس مصرية' },
              { href: '/about', label: 'عن البراند', title: 'قصة VELIX - براند ملابس مصري' }
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-semibold transition-all duration-300 ${
                  isActive(link.href) ? 'text-black' : 'text-gray-600 hover:text-black'
                }`}
                aria-current={isActive(link.href) ? 'page' : undefined}
                title={link.title}
              >
                {link.label}
                <span
                  className={`absolute left-0 -bottom-2 h-0.5 bg-black transition-all duration-300 ${
                    isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                  aria-hidden="true"
                />
              </Link>
            ))}
          </nav>

          {/* Icons Section with semantic buttons */}
          <div className="flex items-center gap-2">
            {/* Favorites */}
            <button
              onClick={() => setIsFavoritesDrawerOpen(true)}
              className="relative p-2 rounded-full transition-all duration-300 hover:bg-black/5 hover:scale-105"
              aria-label={`المفضلة${favoritesCount > 0 ? ` - لديك ${favoritesCount} منتجات` : ''}`}
              aria-live="polite"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeWidth={1.8}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full animate-pulse">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2 rounded-full transition-all duration-300 hover:bg-black/5 hover:scale-105"
              aria-label={`سلة التسوق${cartCount > 0 ? ` - لديك ${cartCount} منتجات` : ''}`}
              aria-live="polite"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.3 2.3c-.6.6-.2 1.7.7 1.7H17" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/201500125133"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1 px-4 py-2 rounded-full text-xs font-semibold text-white 
              bg-linear-to-r from-emerald-500 via-green-500 to-lime-400
              transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_25px_rgba(16,185,129,0.4)] group"
              aria-label="تواصل معنا عبر واتساب - خدمة العملاء"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.52 3.48A11.94 11.94 0 0012.05 0C5.5 0 .2 5.3.2 11.84c0 2.08.54 4.1 1.57 5.88L0 24l6.46-1.68a11.82 11.82 0 005.6 1.43h.01c6.55 0 11.85-5.3 11.85-11.84 0-3.16-1.23-6.12-3.4-8.43zM12.06 21.2h-.01a9.3 9.3 0 01-4.74-1.3l-.34-.2-3.83 1 1.02-3.73-.22-.38a9.23 9.23 0 01-1.42-4.92c0-5.12 4.18-9.3 9.32-9.3 2.49 0 4.82.97 6.58 2.74a9.22 9.22 0 012.73 6.57c0 5.13-4.18 9.32-9.29 9.32zm5.2-6.94c-.28-.14-1.66-.82-1.92-.91-.26-.1-.45-.14-.64.14-.19.28-.73.91-.9 1.1-.16.19-.33.21-.61.07-.28-.14-1.17-.43-2.23-1.36-.83-.74-1.38-1.65-1.54-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.5.14-.17.19-.28.28-.47.1-.19.05-.36-.02-.5-.07-.14-.64-1.54-.88-2.12-.23-.56-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.28-1 1-.97 2.43.03 1.43 1.04 2.8 1.19 3 .14.19 2.05 3.12 5.02 4.38.7.3 1.24.48 1.66.62.7.22 1.33.19 1.83.11.56-.08 1.66-.68 1.9-1.33.23-.65.23-1.2.16-1.33-.07-.12-.26-.19-.54-.33z"/>
              </svg>
              <span className="relative z-10">واتساب</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-black/5"
              aria-label={isMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              aria-expanded={isMenuOpen}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {isMenuOpen ? (
                  <path strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 mx-4 bg-white/95 backdrop-blur-xl border rounded-2xl shadow-lg p-4 animate-slideDown">
            <nav className="flex flex-col gap-3" aria-label="القائمة الرئيسية للجوال">
              {[
                { href: '/', label: 'الرئيسية' },
                { href: '/products', label: 'المنتجات' },
                { href: '/about', label: 'عن البراند' }
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-semibold text-gray-700 hover:text-black py-2 transition-all"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="https://wa.me/201500125133"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-linear-to-r from-emerald-500 via-green-500 to-lime-400 text-white text-center py-2 rounded-full text-sm mt-2"
                aria-label="تواصل معنا عبر واتساب"
              >
                واتساب
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* DRAWERS */}
      <SideDrawer
        isOpen={isFavoritesDrawerOpen}
        onClose={() => setIsFavoritesDrawerOpen(false)}
        type="favorites"
        items={favorites}
        onRemove={removeFromFavorites}
        onAddToCart={addToCart}
      />

      <SideDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        type="cart"
        items={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateCartQuantity}
      />

      {/* FLOATING WHATSAPP BUBBLE */}
      <a
        href="https://wa.me/201500125133"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-6 z-50 w-12 h-12 rounded-full bg-linear-to-r from-emerald-500 via-green-500 to-lime-400 flex items-center justify-center shadow-lg animate-bounce hover:scale-110 transition-all"
        aria-label="تواصل معنا عبر واتساب - خدمة العملاء 24 ساعة"
      >
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.52 3.48A11.94 11.94 0 0012.05 0C5.5 0 .2 5.3.2 11.84c0 2.08.54 4.1 1.57 5.88L0 24l6.46-1.68a11.82 11.82 0 005.6 1.43h.01c6.55 0 11.85-5.3 11.85-11.84 0-3.16-1.23-6.12-3.4-8.43zM12.06 21.2h-.01a9.3 9.3 0 01-4.74-1.3l-.34-.2-3.83 1 1.02-3.73-.22-.38a9.23 9.23 0 01-1.42-4.92c0-5.12 4.18-9.3 9.32-9.3 2.49 0 4.82.97 6.58 2.74a9.22 9.22 0 012.73 6.57c0 5.13-4.18 9.32-9.29 9.32zm5.2-6.94c-.28-.14-1.66-.82-1.92-.91-.26-.1-.45-.14-.64.14-.19.28-.73.91-.9 1.1-.16.19-.33.21-.61.07-.28-.14-1.17-.43-2.23-1.36-.83-.74-1.38-1.65-1.54-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.5.14-.17.19-.28.28-.47.1-.19.05-.36-.02-.5-.07-.14-.64-1.54-.88-2.12-.23-.56-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.28-1 1-.97 2.43.03 1.43 1.04 2.8 1.19 3 .14.19 2.05 3.12 5.02 4.38.7.3 1.24.48 1.66.62.7.22 1.33.19 1.83.11.56-.08 1.66-.68 1.9-1.33.23-.65.23-1.2.16-1.33-.07-.12-.26-.19-.54-.33z"/>
        </svg>
      </a>
    </>
  );
}