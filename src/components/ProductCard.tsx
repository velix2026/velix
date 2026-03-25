'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [currentImage, setCurrentImage] = useState(product.mainImage);
  const [imgError, setImgError] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  
  const whatsappMessage = `أنا عايز أطلب ${product.name} - سعر ${product.price} جنيه`;
  const whatsappLink = `https://wa.me/201500125133?text=${encodeURIComponent(whatsappMessage)}`;

  const allImages = [product.mainImage, ...product.subImages];
  const imageSrc = imgError ? '/images/placeholder.jpg' : currentImage;

  // تحميل حالة المنتج من localStorage
  const loadState = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setIsFavorited(favorites.some((item: Product) => item.id === product.id));
    setIsInCart(cart.some((item: Product) => item.id === product.id));
  };

  useEffect(() => {
    loadState();

    // استقبال التحديثات من الأحداث
    const handleUpdate = () => {
      loadState();
    };
    
    window.addEventListener('favoritesUpdated', handleUpdate);
    window.addEventListener('cartUpdated', handleUpdate);

    return () => {
      window.removeEventListener('favoritesUpdated', handleUpdate);
      window.removeEventListener('cartUpdated', handleUpdate);
    };
  }, [product.id]);

  // تحديث العداد في الهيدر
  const updateCounts = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: favorites.length }));
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart.length }));
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (isFavorited) {
      const newFavorites = favorites.filter((item: Product) => item.id !== product.id);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setIsFavorited(false);
    } else {
      favorites.push(product);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorited(true);
    }
    updateCounts();
    window.dispatchEvent(new CustomEvent('favoritesUpdated'));
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (isInCart) {
      const newCart = cart.filter((item: Product) => item.id !== product.id);
      localStorage.setItem('cart', JSON.stringify(newCart));
      setIsInCart(false);
    } else {
      cart.push(product);
      localStorage.setItem('cart', JSON.stringify(cart));
      setIsInCart(true);
    }
    updateCounts();
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  // باقي الكود كما هو (return مع الأزرار)...
  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden">
      {/* صورة المنتج */}
      <div className="relative aspect-square w-full bg-gray-100">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition duration-500"
          onError={() => setImgError(true)}
        />
        
        {/* أزرار المفضلة والسلة */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-full shadow-md transition-all duration-300 ${
              isFavorited 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
            aria-label={isFavorited ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
          >
            <svg className="w-4 h-4" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          
          <button
            onClick={handleCartClick}
            className={`p-2 rounded-full shadow-md transition-all duration-300 ${
              isInCart 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
            aria-label={isInCart ? 'إزالة من السلة' : 'إضافة إلى السلة'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        </div>
        
        {/* نقاط التنقل بين الصور */}
        {allImages.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 bg-black/50 px-2 py-1 rounded-full">
            {allImages.slice(0, 4).map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentImage(img);
                  setImgError(false);
                }}
                className={`w-2 h-2 rounded-full transition ${
                  currentImage === img ? 'bg-white scale-125' : 'bg-white/50'
                }`}
                aria-label={`الصورة ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* معلومات المنتج */}
      <div className="p-3 md:p-4">
        <h3 className="text-sm md:text-base font-bold mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-gray-500 text-xs md:text-sm mb-2">{product.category}</p>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg md:text-xl font-bold text-black">{product.price} جنيه</span>
        </div>
        <p className="text-gray-600 text-xs md:text-sm mb-3 line-clamp-2 hidden md:block">{product.description}</p>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center bg-black text-white text-sm py-2 rounded-full hover:bg-gray-800 transition"
        >
          اطلب الآن
        </a>
      </div>
    </div>
  );
}