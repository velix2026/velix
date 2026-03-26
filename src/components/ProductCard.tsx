'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/products';
import OrderModal from './OrderModal';

// Helper functions for localStorage
const getStorage = (key: string) => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
};

const setStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [currentImage, setCurrentImage] = useState(product.mainImage);
  const [imgError, setImgError] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  
  const allImages = [product.mainImage, ...product.subImages];
  const imageSrc = imgError ? '/images/placeholder.jpg' : currentImage;

  // حساب التقييم
  const rating = product.rating || 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  // استخدام useRef لمنع التحديثات المتكررة أثناء العرض
  const isUpdatingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // تحميل حالة المنتج من localStorage (مع تأخير)
  const loadState = () => {
    if (isUpdatingRef.current) return;
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      const favorites = getStorage('favorites');
      const cart = getStorage('cart');
      setIsFavorited(favorites.some((item: Product) => item.id === product.id));
      setIsInCart(cart.some((item: Product) => item.id === product.id));
    }, 10);
  };

  useEffect(() => {
    loadState();

    // استقبال التحديثات من الأحداث
    const handleUpdate = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        const favorites = getStorage('favorites');
        const cart = getStorage('cart');
        setIsFavorited(favorites.some((item: Product) => item.id === product.id));
        setIsInCart(cart.some((item: Product) => item.id === product.id));
      }, 20);
    };
    
    window.addEventListener('favoritesUpdated', handleUpdate);
    window.addEventListener('cartUpdated', handleUpdate);

    return () => {
      window.removeEventListener('favoritesUpdated', handleUpdate);
      window.removeEventListener('cartUpdated', handleUpdate);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [product.id]);

  // Toast auto-hide
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const updateCounts = () => {
    const favorites = getStorage('favorites');
    const cart = getStorage('cart');
    window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: favorites.length }));
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart.length }));
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    isUpdatingRef.current = true;
    
    const favorites = getStorage('favorites');
    if (isFavorited) {
      const newFavorites = favorites.filter((item: Product) => item.id !== product.id);
      setStorage('favorites', newFavorites);
      setIsFavorited(false);
      setToastMessage('تم إزالة من المفضلة ❤️');
    } else {
      favorites.push(product);
      setStorage('favorites', favorites);
      setIsFavorited(true);
      setToastMessage('تم إضافة إلى المفضلة ❤️');
    }
    setShowToast(true);
    updateCounts();
    window.dispatchEvent(new CustomEvent('favoritesUpdated'));
    
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 100);
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    isUpdatingRef.current = true;
    
    const cart = getStorage('cart');
    if (isInCart) {
      const newCart = cart.filter((item: Product) => item.id !== product.id);
      setStorage('cart', newCart);
      setIsInCart(false);
      setToastMessage('تم إزالة من السلة 🛒');
    } else {
      cart.push({ ...product, quantity: 1 });
      setStorage('cart', cart);
      setIsInCart(true);
      setToastMessage('تم إضافة إلى السلة 🛒');
    }
    setShowToast(true);
    updateCounts();
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 100);
  };

  const handleOrderSubmit = (orderData: any) => {
    console.log('Order submitted:', orderData);
  };

  // إضافة للمشاهدة مؤخراً
  useEffect(() => {
    const recent = getStorage('recentlyViewed');
    const updated = [product, ...recent.filter((p: Product) => p.id !== product.id)].slice(0, 10);
    setStorage('recentlyViewed', updated);
  }, [product]);

  return (
    <>
      <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden relative">
        {/* الجزء العلوي (الصورة والأزرار) */}
        <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
          <Link href={`/products/${product.id}`} className="relative block h-full w-full">
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition duration-700"
              onError={() => setImgError(true)}
            />
          </Link>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none">
            {product.isNew && (
              <span className="bg-black text-white text-[10px] md:text-xs px-2 py-0.5 md:py-1 rounded-full font-medium">
                جديد
              </span>
            )}
            {product.discount && product.discount > 0 && (
              <span className="bg-red-500 text-white text-[10px] md:text-xs px-2 py-0.5 md:py-1 rounded-full font-medium">
                -{product.discount}%
              </span>
            )}
            {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
              <span className="bg-orange-500 text-white text-[10px] md:text-xs px-2 py-0.5 md:py-1 rounded-full font-medium animate-pulse">
                باقي {product.stock} فقط 🔥
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-gray-500 text-white text-[10px] md:text-xs px-2 py-0.5 md:py-1 rounded-full font-medium">
                نفذت الكمية
              </span>
            )}
          </div>
          
          {/* أزرار المفضلة والسلة */}
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <button
              onClick={handleFavoriteClick}
              className={`p-1.5 md:p-2 rounded-full shadow-md transition-all duration-300 ${
                isFavorited 
                  ? 'bg-red-500 text-white hover:bg-red-600 scale-110' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 hover:scale-110'
              }`}
              aria-label={isFavorited ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
            >
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            
            <button
              onClick={handleCartClick}
              className={`p-1.5 md:p-2 rounded-full shadow-md transition-all duration-300 ${
                isInCart 
                  ? 'bg-green-600 text-white hover:bg-green-700 scale-110' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 hover:scale-110'
              }`}
              aria-label={isInCart ? 'إزالة من السلة' : 'إضافة إلى السلة'}
            >
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
          </div>
          
          {/* نقاط التنقل بين الصور */}
          {allImages.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 bg-black/50 px-1.5 py-0.5 rounded-full">
              {allImages.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImage(img);
                    setImgError(false);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition ${
                    currentImage === img ? 'bg-white scale-125' : 'bg-white/50'
                  }`}
                  aria-label={`الصورة ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* معلومات المنتج - الجزء السفلي */}
        <div className="p-2 md:p-3">
          <Link href={`/products/${product.id}`} className="block">
            {/* التقييم */}
            {rating > 0 && (
              <div className="flex items-center gap-0.5 mb-1">
                <div className="flex items-center text-yellow-400 text-[8px] md:text-[10px]">
                  {[...Array(fullStars)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                  {hasHalfStar && <span>½</span>}
                  {[...Array(emptyStars)].map((_, i) => (
                    <span key={i} className="text-gray-300">★</span>
                  ))}
                </div>
                <span className="text-gray-400 text-[8px]">({rating})</span>
              </div>
            )}
            
            <h3 className="text-[10px] md:text-xs font-bold mb-0.5 line-clamp-1 hover:text-gray-600 transition">
              {product.name}
            </h3>
            <p className="text-gray-400 text-[8px] md:text-[10px] mb-0.5">{product.category}</p>
            
            {/* السعر مع الخصم */}
            <div className="flex items-center gap-1 mb-0.5">
              <span className="text-xs md:text-sm font-bold text-black">{product.price} جنيه</span>
              {product.oldPrice && (
                <span className="text-[8px] text-gray-400 line-through">{product.oldPrice} جنيه</span>
              )}
            </div>
            
            {/* شحن مجاني */}
            {product.price > 500 && (
              <p className="text-green-600 text-[8px] mb-0.5 font-medium">
                شحن مجاني
              </p>
            )}
          </Link>
          
          {/* زر اطلب الآن */}
          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="block text-center bg-black text-white text-[9px] md:text-[10px] py-1 rounded-full hover:bg-gray-800 transition hover:scale-105 active:scale-95 mt-1 w-full"
          >
            اطلب الآن
          </button>
        </div>
      </div>
      
      {/* Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        product={{
          id: product.id,
          name: product.name,
          price: product.price,
          mainImage: product.mainImage,
          selectedSize: undefined,
          selectedColor: undefined,
          quantity: 1,
        }}
        onSubmit={handleOrderSubmit}
      />
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-3 py-1.5 rounded-full text-xs z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {toastMessage}
        </div>
      )}
    </>
  );
}