// components/ProductCard.tsx
'use client';

import { useState, useEffect, useRef, useCallback, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/products';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

interface CartItemSelection {
  size: string;
  color: string;
  quantity: number;
  id: string;
}

const ProductCard = memo(function ProductCard({ product, priority = false }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'cart' | 'favorite' | null>(null);
  const [selections, setSelections] = useState<CartItemSelection[]>([
    { size: '', color: '', quantity: 1, id: Date.now().toString() }
  ]);
  
  // ✅ استخدام الدالة الجديدة removeFromCartByProductId
  const { addToCart, removeFromCartByProductId, isInCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const allImages = [product.mainImage, ...product.subImages];
  const currentImage = allImages[currentImageIndex];
  const imageSrc = imgError ? '/images/placeholder.jpg' : currentImage;

  const isInCartState = isInCart(product.id);
  const isFavoritedState = isFavorite(product.id);

  const hasSizes = product.sizes && product.sizes.length > 0;
  const hasColors = product.colors && product.colors.length > 0;
  
  const hasValidSelections = () => {
    for (const selection of selections) {
      if (hasSizes && !selection.size) return false;
      if (hasColors && !selection.color) return false;
      if (selection.quantity < 1) return false;
    }
    return selections.length > 0;
  };

  const rating = product.rating || 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, []);

  useEffect(() => {
    if (allImages.length > 1 && !showSelectionModal) {
      autoPlayRef.current = setInterval(() => {
        if (mountedRef.current) {
          setCurrentImageIndex(prev => (prev + 1) % allImages.length);
        }
      }, 4000);
      
      return () => {
        if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      };
    }
  }, [allImages.length, showSelectionModal]);

  const nextImage = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev + 1) % allImages.length);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = setInterval(() => {
        if (mountedRef.current) {
          setCurrentImageIndex(prev => (prev + 1) % allImages.length);
        }
      }, 4000);
    }
  }, [allImages.length]);

  const prevImage = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev - 1 + allImages.length) % allImages.length);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = setInterval(() => {
        if (mountedRef.current) {
          setCurrentImageIndex(prev => (prev + 1) % allImages.length);
        }
      }, 4000);
    }
  }, [allImages.length]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    setTouchStart(e.touches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (touchStart === null) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    if (Math.abs(diff) > 50 && !showSelectionModal) {
      if (diff > 0) {
        setCurrentImageIndex(prev => (prev + 1) % allImages.length);
      } else {
        setCurrentImageIndex(prev => (prev - 1 + allImages.length) % allImages.length);
      }
      
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = setInterval(() => {
          if (mountedRef.current) {
            setCurrentImageIndex(prev => (prev + 1) % allImages.length);
          }
        }, 4000);
      }
    }
    
    setTouchStart(null);
  }, [touchStart, allImages.length, showSelectionModal]);

  // ✅ دالة المفضلة
  const handleFavoriteClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
    e.nativeEvent?.stopImmediatePropagation();
    
    if (hasSizes || hasColors) {
      setPendingAction('favorite');
      setShowSelectionModal(true);
    } else {
      toggleFavorite(product);
    }
  }, [product, toggleFavorite, hasSizes, hasColors]);

  // ✅ دالة السلة - باستخدام removeFromCartByProductId
  const handleCartClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
    e.nativeEvent?.stopImmediatePropagation();
    
    if (isInCartState) {
      // ✅ استخدام الدالة الجديدة للإزالة
      removeFromCartByProductId(product.id, product.name);
    } else {
      if (hasSizes || hasColors) {
        setPendingAction('cart');
        setShowSelectionModal(true);
      } else {
        addToCart(product);
      }
    }
  }, [product, isInCartState, addToCart, removeFromCartByProductId, hasSizes, hasColors]);

  const addSelection = () => {
    setSelections(prev => [
      ...prev,
      { size: '', color: '', quantity: 1, id: Date.now().toString() + Math.random() }
    ]);
  };

  const removeSelection = (id: string) => {
    if (selections.length > 1) {
      setSelections(prev => prev.filter(s => s.id !== id));
    }
  };

  const updateSelection = (id: string, field: keyof CartItemSelection, value: string | number) => {
    setSelections(prev => prev.map(sel => 
      sel.id === id ? { ...sel, [field]: value } : sel
    ));
  };

  const confirmSelections = () => {
    if (hasValidSelections()) {
      for (const selection of selections) {
        for (let i = 0; i < selection.quantity; i++) {
          addToCart(product, selection.size || undefined, selection.color || undefined, 1);
        }
      }
      setShowSelectionModal(false);
      setSelections([{ size: '', color: '', quantity: 1, id: Date.now().toString() }]);
    }
  };

  const cancelSelection = () => {
    setShowSelectionModal(false);
    setPendingAction(null);
    setSelections([{ size: '', color: '', quantity: 1, id: Date.now().toString() }]);
  };

  const isLowStock = product.stock !== undefined && product.stock <= 5 && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  const isLightColor = (hex: string): boolean => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  };

  const getColorName = (colorCode: string): string => {
    const colorMap: Record<string, string> = {
      '#000000': 'أسود',
      '#FFFFFF': 'أبيض',
      '#808080': 'رمادي',
      '#FF0000': 'أحمر',
      '#0000FF': 'أزرق',
      '#008000': 'أخضر',
      '#FFFF00': 'أصفر',
      '#FFC0CB': 'وردي',
      '#A52A2A': 'بني',
      '#800080': 'بنفسجي',
      '#FFA500': 'برتقالي',
      '#00FFFF': 'سماوي',
      '#FF69B4': 'زهري',
      '#C0C0C0': 'فضي',
      '#FFD700': 'ذهبي',
    };
    return colorMap[colorCode.toUpperCase()] || colorCode;
  };

  const totalItems = selections.reduce((sum, s) => sum + s.quantity, 0);
  const totalPrice = totalItems * product.price;

  return (
    <>
      <article className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden relative h-full flex flex-col">
        <div 
          className="relative aspect-square w-full bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden cursor-pointer"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Link 
            href={`/products/${product.id}`} 
            className="relative block h-full w-full focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            aria-label={`عرض تفاصيل ${product.name}`}
          >
            <Image
              src={imageSrc}
              alt={`${product.name} - صورة ${currentImageIndex + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition duration-700"
              onError={() => setImgError(true)}
              priority={priority}
              loading={priority ? 'eager' : 'lazy'}
            />
          </Link>
          
          {allImages.length > 1 && !showSelectionModal && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
                aria-label="الصورة السابقة"
              >
                <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
                aria-label="الصورة التالية"
              >
                <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          
          <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none z-10">
            {product.isNew && (
              <span className="bg-black text-white font-bold text-[10px] md:text-xs px-2 py-0.5 md:py-1 rounded-full shadow-sm">
                جديد
              </span>
            )}
            {product.discount && product.discount > 0 && (
              <span className="bg-linear-to-r from-red-500 to-red-600 text-white font-bold text-[10px] md:text-xs px-2 py-0.5 md:py-1 rounded-full shadow-sm">
                -{product.discount}%
              </span>
            )}
            {isLowStock && !isOutOfStock && (
              <span className="bg-orange-500 text-white font-bold text-[10px] md:text-xs px-2 py-0.5 md:py-1 rounded-full animate-pulse shadow-sm">
                باقي {product.stock} فقط 🔥
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-gray-500 text-white font-bold text-[10px] md:text-xs px-2 py-0.5 md:py-1 rounded-full shadow-sm">
                نفذت الكمية
              </span>
            )}
          </div>
          
          <div className="absolute top-2 right-2 flex flex-col gap-2 z-20">
            <button
              onClick={handleFavoriteClick}
              onTouchStart={handleFavoriteClick}
              className={`p-1.5 md:p-2 rounded-full shadow-md transition-all duration-300 backdrop-blur-sm ${
                isFavoritedState 
                  ? 'bg-red-500 text-white hover:bg-red-600 scale-110' 
                  : 'bg-white/90 text-gray-600 hover:bg-white hover:scale-110'
              }`}
              aria-label={isFavoritedState ? `إزالة ${product.name} من المفضلة` : `إضافة ${product.name} إلى المفضلة`}
            >
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill={isFavoritedState ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            
            <button
              onClick={handleCartClick}
              onTouchStart={handleCartClick}
              className={`p-1.5 md:p-2 rounded-full shadow-md transition-all duration-300 backdrop-blur-sm ${
                isInCartState 
                  ? 'bg-green-600 text-white hover:bg-green-700 scale-110' 
                  : 'bg-white/90 text-gray-600 hover:bg-white hover:scale-110'
              }`}
              aria-label={isInCartState ? `إزالة ${product.name} من السلة` : `إضافة ${product.name} إلى السلة`}
              disabled={isOutOfStock}
            >
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
          </div>
          
          {allImages.length > 1 && !showSelectionModal && (
            <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded-full text-white font-bold text-[8px] z-10">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          )}
          
          {allImages.length > 1 && !showSelectionModal && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full z-10">
              {allImages.slice(0, 5).map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                    if (autoPlayRef.current) {
                      clearInterval(autoPlayRef.current);
                      autoPlayRef.current = setInterval(() => {
                        if (mountedRef.current) {
                          setCurrentImageIndex(prev => (prev + 1) % allImages.length);
                        }
                      }, 4000);
                    }
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    currentImageIndex === idx 
                      ? 'bg-white w-3' 
                      : 'bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`انتقال إلى الصورة ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="p-3 md:p-4 flex-1 flex flex-col">
          <Link href={`/products/${product.id}`} className="block flex-1">
            {rating > 0 && (
              <div className="flex items-center gap-0.5 mb-1.5">
                <div className="flex items-center text-yellow-400 text-[10px] md:text-xs">
                  {[...Array(fullStars)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                  {hasHalfStar && <span>½</span>}
                  {[...Array(emptyStars)].map((_, i) => (
                    <span key={i} className="text-gray-300">★</span>
                  ))}
                </div>
                <span className="text-gray-400 font-bold text-[9px] md:text-[10px] mr-1">
                  ({product.salesCount || rating})
                </span>
              </div>
            )}
            
            <h3 className="text-xs md:text-sm font-bold text-black mb-1 line-clamp-2 hover:text-gray-600 transition">
              {product.name}
            </h3>
            <p className="text-gray-400 font-bold text-[10px] md:text-xs mb-2">{product.category}</p>
            
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-sm md:text-base font-bold text-black">
                {product.price} جنيه
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-[10px] md:text-xs text-gray-400 line-through font-bold">
                  {product.oldPrice} جنيه
                </span>
              )}
            </div>
            
            {product.price > 500 && (
              <p className="text-green-600 font-bold text-[9px] md:text-[10px]">
                🚚 شحن مجاني
              </p>
            )}
          </Link>
          
          <Link
            href={`/products/${product.id}`}
            className={`block text-center text-white font-bold text-[10px] md:text-xs py-2 rounded-full transition-all mt-2 ${
              isOutOfStock 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-linear-to-r from-sky-400 via-blue-500 to-indigo-500 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg'
            }`}
            aria-label={`عرض تفاصيل ${product.name}`}
          >
            {isOutOfStock ? 'نفذت الكمية' : 'اطلع على المنتج'}
          </Link>
        </div>
      </article>

      {showSelectionModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100 flex items-center justify-center p-4 transition-all duration-300"
          onClick={cancelSelection}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full max-h-[85vh] overflow-hidden shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white p-4 border-b border-gray-100 z-10">
              <h3 className="text-xl font-bold text-black text-center">إضافة إلى السلة</h3>
              <p className="text-xs text-gray-500 font-bold text-center mt-1">
                اختر المقاسات والألوان المطلوبة
              </p>
            </div>
            
            <div className="overflow-y-auto p-4 space-y-4 max-h-[calc(85vh-180px)]">
              <div className="flex gap-3 pb-3 border-b border-gray-100">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <Image src={product.mainImage} alt={product.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-black line-clamp-2">{product.name}</h4>
                  <p className="text-sm font-bold text-black mt-1">{product.price} جنيه</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {selections.map((selection, index) => (
                  <div key={selection.id} className="bg-gray-50 rounded-xl p-3 relative">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-gray-500">القطعة {index + 1}</span>
                      {selections.length > 1 && (
                        <button
                          onClick={() => removeSelection(selection.id)}
                          className="text-red-400 hover:text-red-600 text-xs font-bold flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          إزالة
                        </button>
                      )}
                    </div>
                    
                    {hasSizes && (
                      <div className="mb-3">
                        <p className="text-xs font-bold text-gray-700 mb-1.5">المقاس <span className="text-red-500">*</span></p>
                        <div className="flex flex-wrap gap-2">
                          {product.sizes?.map((size) => (
                            <button
                              key={size}
                              onClick={() => updateSelection(selection.id, 'size', size)}
                              className={`min-w-10 px-3 py-1 text-sm font-bold rounded-lg transition-all ${
                                selection.size === size
                                  ? 'bg-black text-white shadow-md'
                                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {hasColors && (
                      <div className="mb-3">
                        <p className="text-xs font-bold text-gray-700 mb-1.5">اللون <span className="text-red-500">*</span></p>
                        <div className="flex flex-wrap gap-2">
                          {product.colors?.map((color) => {
                            const isSelected = selection.color === color;
                            const isLight = isLightColor(color);
                            return (
                              <button
                                key={color}
                                onClick={() => updateSelection(selection.id, 'color', color)}
                                className={`relative w-8 h-8 rounded-full transition-all duration-200 ring-2 ring-offset-1 ${
                                  isSelected 
                                    ? 'ring-black scale-110' 
                                    : 'ring-gray-200 hover:ring-gray-400'
                                }`}
                                style={{ backgroundColor: color }}
                                title={getColorName(color)}
                              >
                                {isSelected && (
                                  <svg 
                                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 ${isLight ? 'text-black' : 'text-white'}`}
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-xs font-bold text-gray-700 mb-1.5">الكمية</p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateSelection(selection.id, 'quantity', Math.max(1, selection.quantity - 1))}
                          className="w-7 h-7 rounded-full bg-white border border-gray-200 text-gray-600 font-bold hover:bg-gray-100 transition flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-bold text-sm text-black">{selection.quantity}</span>
                        <button
                          onClick={() => updateSelection(selection.id, 'quantity', selection.quantity + 1)}
                          className="w-7 h-7 rounded-full bg-white border border-gray-200 text-gray-600 font-bold hover:bg-gray-100 transition flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={addSelection}
                className="w-full py-2 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 text-sm font-bold hover:border-gray-400 hover:text-gray-700 transition-all"
              >
                + إضافة قطعة أخرى
              </button>
              
              <div className="bg-gray-100 rounded-xl p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-600">إجمالي القطع:</span>
                  <span className="text-sm font-bold text-black">{totalItems} قطعة</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm font-bold text-gray-600">الإجمالي:</span>
                  <span className="text-lg font-bold text-black">{totalPrice} جنيه</span>
                </div>
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-white p-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={confirmSelections}
                disabled={!hasValidSelections()}
                className={`flex-1 py-2.5 rounded-xl font-bold transition-all ${
                  hasValidSelections()
                    ? 'bg-linear-to-r from-emerald-500 via-green-500 to-lime-400 text-white hover:scale-[1.02] shadow-md'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                إضافة ({totalItems}) إلى السلة
              </button>
              
              <button
                onClick={cancelSelection}
                className="flex-1 py-2.5 rounded-xl bg-linear-to-r from-red-500 via-rose-500 to-pink-500 text-white font-bold hover:scale-[1.02] transition-all shadow-md"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default ProductCard;