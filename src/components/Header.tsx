'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100' 
          : 'bg-white/80 backdrop-blur-sm border-b border-gray-200/50'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <div className="relative w-10 h-10 md:w-12 md:h-12">
              <Image
                src="/logo.png"
                alt="VELIX"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className={`font-bold text-sm transition-all duration-300 ${
                isActive('/') 
                  ? 'text-black border-b-2 border-black' 
                  : 'text-gray-700 hover:text-black hover:border-b-2 hover:border-gray-400'
              } pb-1`}
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
            >
              عن البراند
            </Link>
            <a 
              href="https://wa.me/201500125133" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white px-5 py-1.5 rounded-full text-xs font-bold hover:bg-gray-800 transition-all duration-300 hover:scale-105"
            >
              تواصل معنا
            </a>
          </nav>

          {/* Icons Section */}
          <div className="flex items-center gap-2">
            {/* Favorites Icon */}
            <button className="relative p-1.5 hover:bg-gray-100 rounded-full transition-all duration-300">
              <svg className="w-4 h-4 text-gray-700 hover:text-black transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </button>

            {/* Cart Icon */}
            <button className="relative p-1.5 hover:bg-gray-100 rounded-full transition-all duration-300">
              <svg className="w-4 h-4 text-gray-700 hover:text-black transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1.5 hover:bg-gray-100 rounded-full transition-all duration-300"
              aria-label="القائمة"
            >
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 bg-white">
            <nav className="flex flex-col gap-3">
              <Link 
                href="/" 
                onClick={() => setIsMenuOpen(false)}
                className={`font-bold py-1 text-sm transition ${
                  isActive('/') ? 'text-black' : 'text-gray-600 hover:text-black'
                }`}
              >
                الرئيسية
              </Link>
              <Link 
                href="/products" 
                onClick={() => setIsMenuOpen(false)}
                className={`font-bold py-1 text-sm transition ${
                  isActive('/products') ? 'text-black' : 'text-gray-600 hover:text-black'
                }`}
              >
                المنتجات
              </Link>
              <Link 
                href="/about" 
                onClick={() => setIsMenuOpen(false)}
                className={`font-bold py-1 text-sm transition ${
                  isActive('/about') ? 'text-black' : 'text-gray-600 hover:text-black'
                }`}
              >
                عن البراند
              </Link>
              <a 
                href="https://wa.me/201500125133" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white px-5 py-1.5 rounded-full text-xs font-bold text-center hover:bg-gray-800 transition w-fit"
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