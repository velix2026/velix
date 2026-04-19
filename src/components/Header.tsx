'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

import { useFavorites } from '@/hooks/useFavorites';
import { useCart } from '@/hooks/useCart';
import SideDrawer from './SideDrawer';
import { toArabicNumber } from '@/lib/utils';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFavoritesDrawerOpen, setIsFavoritesDrawerOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const pathname = usePathname();

  const { favoritesCount } = useFavorites();
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    'name': 'VELIX',
    'url': 'https://velix-eg.store',
    'logo': 'https://velix-eg.store/images/logo.png',
    'image': 'https://velix-eg.store/images/og-image.png',
    'description': 'براند ملابس مصري بيقدم ستايل عصري للشباب. جودة عالية وتفاصيل مميزة مع دفع عند الاستلام.',
    'telephone': '+201500125133',
    'priceRange': '$$',
    'paymentAccepted': 'Cash on Delivery',
    'currenciesAccepted': 'EGP',
    'areaServed': 'EG',
    'address': {
      '@type': 'PostalAddress',
      'addressCountry': 'EG',
      'addressRegion': 'Qalyubia',
      'addressLocality': 'Shubra El-Kheima',
      'streetAddress': 'شبرا الخيمة، القليوبية',
      'postalCode': '13766'
    },
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '+201500125133',
      'contactType': 'customer service',
      'availableLanguage': ['Arabic', 'English'],
      'areaServed': 'EG'
    },
    'sameAs': [
      'https://instagram.com/velixstore.eg',
      'https://facebook.com/velixstore.eg',
      'https://tiktok.com/@velixstore.eg',
      'https://wa.me/201500125133'
    ],
    'openingHours': ['Mo-Sa 10:00-22:00']
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-rose-gold/20 py-2'
            : 'bg-transparent py-4'
        }`}
        role="banner"
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="VELIX - الرئيسية"
          >
            <div className="relative w-10 h-10 md:w-12 md:h-12 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/images/logo.png"
                alt="VELIX"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 40px, 48px"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { href: '/', label: 'الرئيسية' },
              { href: '/products', label: 'المنتجات' },
              { href: '/blog', label: 'المدونة' },
              { href: '/faq', label: 'أسئلة شائعة' },
              { href: '/about', label: 'عن البراند' },
              { href: '/contact', label: 'اتصل بنا' }
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-semibold transition-all duration-300 ${
                  isActive(link.href) 
                    ? 'text-rose-gold' 
                    : 'text-black/70 hover:text-rose-gold'
                }`}
              >
                {link.label}
                <span
                  className={`absolute left-0 -bottom-2 h-0.5 bg-linear-to-r from-rose-gold-light to-rose-gold transition-all duration-300 ${
                    isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                  aria-hidden="true"
                />
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-2">
            {/* Favorites */}
            <button
              onClick={() => setIsFavoritesDrawerOpen(true)}
              className="relative p-2 rounded-full transition-all duration-300 hover:bg-rose-gold/10 hover:scale-105 group"
              aria-label="المفضلة"
            >
              <svg
                className="w-5 h-5 text-black group-hover:text-rose-gold transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth={1.8}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-gold text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {toArabicNumber(favoritesCount)}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2 rounded-full transition-all duration-300 hover:bg-rose-gold/10 hover:scale-105 group"
              aria-label="سلة التسوق"
            >
              <svg
                className="w-5 h-5 text-black group-hover:text-rose-gold transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.3 2.3c-.6.6-.2 1.7.7 1.7H17" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-gold text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {toArabicNumber(cartCount)}
                </span>
              )}
            </button>

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/201500125133"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold text-white bg-linear-to-r from-rose-gold-light via-rose-gold to-copper transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-rose-gold/30"
              aria-label="واتساب"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.52 3.48A11.94 11.94 0 0012.05 0C5.5 0 .2 5.3.2 11.84c0 2.08.54 4.1 1.57 5.88L0 24l6.46-1.68a11.82 11.82 0 005.6 1.43h.01c6.55 0 11.85-5.3 11.85-11.84 0-3.16-1.23-6.12-3.4-8.43zM12.06 21.2h-.01a9.3 9.3 0 01-4.74-1.3l-.34-.2-3.83 1 1.02-3.73-.22-.38a9.23 9.23 0 01-1.42-4.92c0-5.12 4.18-9.3 9.32-9.3 2.49 0 4.82.97 6.58 2.74a9.22 9.22 0 012.73 6.57c0 5.13-4.18 9.32-9.29 9.32z"/>
              </svg>
              <span>واتساب</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-rose-gold/10 text-black transition-colors"
              aria-label={isMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="md:hidden mt-4 mx-4 bg-white/95 backdrop-blur-xl border border-rose-gold/20 rounded-2xl shadow-lg p-4 animate-slideDown">
            <nav className="flex flex-col gap-3">
              {[
                { href: '/', label: 'الرئيسية' },
                { href: '/products', label: 'المنتجات' },
                { href: '/blog', label: 'المدونة' },
                { href: '/faq', label: 'أسئلة شائعة' },
                { href: '/about', label: 'عن البراند' },
                { href: '/contact', label: 'اتصل بنا' }
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-semibold text-black hover:text-rose-gold py-2 transition-all"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="https://wa.me/201500125133"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white text-center py-2 rounded-full text-sm mt-2 font-bold"
              >
                واتساب
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Drawers */}
      <SideDrawer
        isOpen={isFavoritesDrawerOpen}
        onClose={() => setIsFavoritesDrawerOpen(false)}
        type="favorites"
      />
      <SideDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        type="cart"
      />

      {/* Floating WhatsApp Bubble */}
      <a
        href="https://wa.me/201500125133"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-linear-to-r from-rose-gold-light via-rose-gold to-copper flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 hover:shadow-rose-gold/30"
        aria-label="تواصل عبر واتساب"
      >
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.52 3.48A11.94 11.94 0 0012.05 0C5.5 0 .2 5.3.2 11.84c0 2.08.54 4.1 1.57 5.88L0 24l6.46-1.68a11.82 11.82 0 005.6 1.43h.01c6.55 0 11.85-5.3 11.85-11.84 0-3.16-1.23-6.12-3.4-8.43zM12.06 21.2h-.01a9.3 9.3 0 01-4.74-1.3l-.34-.2-3.83 1 1.02-3.73-.22-.38a9.23 9.23 0 01-1.42-4.92c0-5.12 4.18-9.3 9.32-9.3 2.49 0 4.82.97 6.58 2.74a9.22 9.22 0 012.73 6.57c0 5.13-4.18 9.32-9.29 9.32z"/>
        </svg>
      </a>
    </>
  );
}