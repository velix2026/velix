'use client';

import { useState, useEffect, useRef, useCallback, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/products';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { toArabicNumber, formatPrice, formatDiscount, formatStock } from '@/lib/utils';
import { getColorByCode } from '@/lib/colors';

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

// دالة حساب الكمية المتاحة من stockItems
const getAvailableStock = (product: Product, size?: string, color?: string): number => {
  if (product.stockItems && Array.isArray(product.stockItems)) {
    if (size && color) {
      const stockItem = product.stockItems.find(
        (item: any) => item.size === size && item.colorCode === color
      );
      return stockItem?.quantity || 0;
    }
    return product.stockItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
  }
  return product.stock || 0;
};

// ✅ استخدام الألوان من lib/colors
const getColorName = (colorCode: string): string => {
  const color = getColorByCode(colorCode);
  return color.name || colorCode;
};

const ProductCard = memo(function ProductCard({ product, priority = false }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [selections, setSelections] = useState<CartItemSelection[]>([
    { size: '', color: '', quantity: 1, id: Date.now().toString() }
  ]);

  const { addToCart, removeFromCartByProductSlug, isInCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const allImages = [product.mainImage, ...product.subImages];
  const currentImage = allImages[currentImageIndex];
  const imageSrc = imgError ? '/images/placeholder.jpg' : currentImage;

  const isInCartState = isInCart(product.slug);
  const isFavoritedState = isFavorite(product.slug);

  const hasSizes = product.sizes && product.sizes.length > 0;
  const hasColors = product.colors && product.colors.length > 0;

  const totalStock = getAvailableStock(product);
  const isLowStock = totalStock <= 5 && totalStock > 0;
  const isOutOfStock = totalStock === 0;

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

  const isRecentlyAdded = useCallback(() => {
    if (!product.createdAt) return false;
    const createdDate = new Date(product.createdAt);
    const now = new Date();
    const diffDays = (now.getTime() - createdDate.getTime()) / (1000 * 3600 * 24);
    return diffDays < 3;
  }, [product.createdAt]);

  const isBestSeller = product.salesCount !== undefined && product.salesCount > 10;

  const discountPercent = product.oldPrice && product.oldPrice > product.price 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  // 🎨 بادجات نحاسية فخمة
  const showNewBadge = isRecentlyAdded() && !isOutOfStock;
  const showBestSellerBadge = isBestSeller && !isOutOfStock;
  const showDiscountBadge = discountPercent > 0 && !isOutOfStock;
  const showLowStockBadge = isLowStock && !isOutOfStock;

  const getQuantityDiscountPrice = (quantity: number) => {
    if (!product.quantityDiscount?.enabled) return product.price * quantity;
    
    const { tiers } = product.quantityDiscount;
    let applicableTier = null;
    for (let i = tiers.length - 1; i >= 0; i--) {
      if (quantity >= tiers[i].minQuantity) {
        applicableTier = tiers[i];
        break;
      }
    }
    
    if (!applicableTier) return product.price * quantity;
    const discountedPrice = product.price - applicableTier.discountPerItem;
    return quantity * discountedPrice;
  };

  const getApplicableTier = (quantity: number) => {
    if (!product.quantityDiscount?.enabled) return null;
    const { tiers } = product.quantityDiscount;
    for (let i = tiers.length - 1; i >= 0; i--) {
      if (quantity >= tiers[i].minQuantity) {
        return tiers[i];
      }
    }
    return null;
  };

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

  const handleFavoriteClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (e.nativeEvent) {
      e.nativeEvent.stopImmediatePropagation();
    }
    
    setTimeout(() => {
      toggleFavorite(product);
    }, 0);
  }, [product, toggleFavorite]);

  const handleCartClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (e.nativeEvent) {
      e.nativeEvent.stopImmediatePropagation();
    }
    
    setTimeout(() => {
      if (isInCartState) {
        removeFromCartByProductSlug(product.slug, product.name);
      } else {
        if (hasSizes || hasColors) {
          setShowSelectionModal(true);
        } else {
          addToCart(product);
        }
      }
    }, 0);
    }, [product, isInCartState, addToCart, removeFromCartByProductSlug, hasSizes, hasColors]);

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

  const applyToAll = (field: 'size' | 'color', value: string) => {
    setSelections(prev => prev.map(sel => ({ ...sel, [field]: value })));
  };

  const setAllQuantities = (quantity: number) => {
    setSelections(prev => prev.map(sel => ({ ...sel, quantity })));
  };

  const mergeIdenticalSelections = (selectionsList: CartItemSelection[]) => {
    const merged = new Map<string, CartItemSelection>();
    
    for (const sel of selectionsList) {
      const key = `${sel.size}|${sel.color}`;
      if (merged.has(key)) {
        const existing = merged.get(key)!;
        existing.quantity += sel.quantity;
      } else {
        merged.set(key, { ...sel, id: sel.id });
      }
    }
    
    return Array.from(merged.values());
  };

  const confirmSelections = () => {
    if (hasValidSelections()) {
      const mergedSelections = mergeIdenticalSelections(selections);
      
      for (const selection of mergedSelections) {
        const availableStock = getAvailableStock(product, selection.size, selection.color);
        if (selection.quantity > availableStock) {
          window.dispatchEvent(new CustomEvent('showToast', {
            detail: {
              message: `⚠️ العدد المطلوب (${toArabicNumber(selection.quantity)}) للقطعة (مقاس ${selection.size || 'غير محدد'}، لون ${getColorName(selection.color)}) أكتر من المتاح (${toArabicNumber(availableStock)})`,
              type: 'warning'
            }
          }));
          return;
        }
      }
      
      for (const selection of mergedSelections) {
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
    setSelections([{ size: '', color: '', quantity: 1, id: Date.now().toString() }]);
  };

  const isLightColor = (hex: string): boolean => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  };

  const totalItems = selections.reduce((sum, s) => sum + s.quantity, 0);
  const totalPrice = totalItems * product.price;
  const applicableTier = getApplicableTier(totalItems);
  const hasDiscount = applicableTier !== null;

  return (
    <>
      <article className="group bg-white rounded-xl shadow-md hover:shadow-rose-gold/20 transition-all duration-300 overflow-hidden relative h-full flex flex-col border border-rose-gold/10 hover:border-rose-gold/30">
        <div 
          className="relative aspect-square w-full bg-rose-gold/5 overflow-hidden cursor-pointer flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Link 
            href={`/products/${product.slug}`} 
            className="relative block h-full w-full focus:outline-none focus:ring-2 focus:ring-rose-gold/20 focus:ring-offset-2"
            aria-label={`عرض تفاصيل ${product.name}`}
          >
            <Image
              src={imageSrc}
              alt={`${product.name} - صورة ${currentImageIndex + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-contain p-2 group-hover:scale-105 transition duration-700"
              onError={() => setImgError(true)}
              priority={priority}
              fetchPriority={priority ? "high" : "auto"}
              loading={priority ? 'eager' : 'lazy'}
            />
          </Link>

          {allImages.length > 1 && !showSelectionModal && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-rose-gold/10 rounded-full p-1.5 shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
                aria-label="الصورة السابقة"
              >
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-rose-gold/10 rounded-full p-1.5 shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
                aria-label="الصورة التالية"
              >
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* 🎨 بادجات نحاسية فخمة */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none z-10">
            {showNewBadge && (
              <span className="bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold text-[10px] md:text-xs px-2 py-0.5 md:py-1 rounded-full shadow-md flex items-center gap-1">
                <span className="text-[11px]">🆕</span> جديد
              </span>
            )}
            {showBestSellerBadge && (
              <span className="bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold text-[10px] md:text-xs px-2 py-0.5 md:py-1 rounded-full shadow-md flex items-center gap-1">
                <span className="text-[11px]">⭐</span> الأكثر مبيعاً
              </span>
            )}
            {showDiscountBadge && (
              <span className="bg-linear-to-r from-rose-gold-dark via-red-600 to-rose-gold-dark text-white font-bold text-[10px] md:text-xs px-2 py-0.5 md:py-1 rounded-full shadow-md flex items-center gap-1">
                <span className="text-[11px]">🏷️</span> {formatDiscount(discountPercent)}
              </span>
            )}
            {showLowStockBadge && (
              <span className="bg-linear-to-r from-amber-600 via-orange-600 to-amber-700 text-white font-bold text-[10px] md:text-xs px-2 py-0.5 md:py-1 rounded-full shadow-md animate-pulse flex items-center gap-1">
                <span className="text-[11px]">⏳</span> {formatStock(totalStock)}
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-linear-to-r from-gray-600 to-gray-500 text-white font-bold text-[10px] md:text-xs px-2 py-0.5 md:py-1 rounded-full shadow-md flex items-center gap-1">
                <span className="text-[11px]">🚫</span> خلص من عندنا
              </span>
            )}
          </div>

          <div className="absolute top-2 right-2 flex flex-col gap-2 z-20">
            <button
              onClick={handleFavoriteClick}
              onTouchStart={handleFavoriteClick}
              className={`p-1.5 md:p-2 rounded-full shadow-md transition-all duration-300 backdrop-blur-sm ${
                isFavoritedState 
                  ? 'bg-rose-gold text-white hover:bg-copper scale-110' 
                  : 'bg-white/90 text-black hover:bg-rose-gold/20 hover:text-rose-gold hover:scale-110'
              }`}
              aria-label={isFavoritedState ? `شيل ${product.name} من المفضلة` : `ضيف ${product.name} للمفضلة`}
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
                  ? 'bg-rose-gold text-white hover:bg-copper scale-110' 
                  : 'bg-white/90 text-black hover:bg-rose-gold/20 hover:text-rose-gold hover:scale-110'
              }`}
              aria-label={isInCartState ? `شيل ${product.name} من السلة` : `ضيف ${product.name} للسلة`}
              disabled={isOutOfStock}
            >
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
          </div>

          {allImages.length > 1 && !showSelectionModal && (
            <>
              <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded-full text-white font-bold text-[8px] z-10">
                {currentImageIndex + 1} / {allImages.length}
              </div>
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
                        ? 'bg-rose-gold w-3' 
                        : 'bg-white/50 hover:bg-rose-gold/50'
                    }`}
                    aria-label={`انتقال للصورة ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-3 md:p-4 flex-1 flex flex-col">
          <Link href={`/products/${product.slug}`} className="block flex-1">
            {rating > 0 && (
              <div className="flex items-center gap-0.5 mb-1.5">
                <div className="flex items-center text-rose-gold text-[10px] md:text-xs">
                  {[...Array(fullStars)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                  {hasHalfStar && <span>½</span>}
                  {[...Array(emptyStars)].map((_, i) => (
                    <span key={i} className="text-rose-gold/30">★</span>
                  ))}
                </div>
                <span className="text-black/50 font-bold text-[9px] md:text-[10px] mr-1">
                  ({toArabicNumber(product.salesCount || rating)})
                </span>
              </div>
            )}

            <h3 className="text-xs md:text-sm font-bold text-black mb-1 line-clamp-2 hover:text-rose-gold transition">
              {product.name}
            </h3>
            <p className="text-black/50 font-bold text-[10px] md:text-xs mb-2">{product.category}</p>

            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-sm md:text-base font-bold text-rose-gold">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-[10px] md:text-xs text-black/40 line-through font-bold">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>

            {product.price > 500 && (
              <p className="text-rose-gold font-bold text-[9px] md:text-[10px]">
                🚚 شحن مجاني
              </p>
            )}
          </Link>

          <Link
            href={`/products/${product.slug}`}
            className={`block text-center text-white font-bold text-[10px] md:text-xs py-2 rounded-full transition-all mt-2 ${
              isOutOfStock 
                ? 'bg-black/40 cursor-not-allowed' 
                : 'bg-linear-to-r from-rose-gold-light via-rose-gold to-copper hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-rose-gold/30'
            }`}
            aria-label={`عرض تفاصيل ${product.name}`}
          >
            {isOutOfStock ? 'خلص من عندنا' : 'اطلع على المنتج'}
          </Link>
        </div>
      </article>

      {/* Selection Modal - نحاسي فخم */}
      {showSelectionModal && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-60 flex items-center justify-center p-4 transition-all duration-300"
          onClick={cancelSelection}
        >
          <div 
            className="bg-white rounded-2xl w-[calc(100%-2rem)] sm:w-[95%] md:w-[90%] lg:w-[85%] xl:w-[80%] max-w-5xl max-h-[85vh] overflow-y-auto shadow-2xl animate-scale-in mx-auto border border-rose-gold/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white p-4 border-b border-rose-gold/20 z-10">
              <h3 className="text-xl font-bold text-black text-center">إضافة للسلة</h3>
              <p className="text-xs font-bold text-black/60 text-center mt-1">
                اختار المقاسات والألوان - تقدر تضيف أكتر من قطعة مرة واحدة
              </p>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex gap-3 pb-3 border-b border-rose-gold/20">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-rose-gold/5 shrink-0 flex items-center justify-center">
                  <Image src={product.mainImage} alt={product.name} fill className="object-contain p-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-black line-clamp-2">{product.name}</h4>
                  <p className="text-sm font-bold text-rose-gold mt-1">{formatPrice(product.price)}</p>
                </div>
              </div>

              {(hasSizes || hasColors) && selections.length > 1 && (
                <div className="bg-rose-gold/5 rounded-xl p-3 border border-rose-gold/10">
                  <p className="text-xs font-bold text-black mb-2">إجراءات سريعة:</p>
                  <div className="flex flex-wrap gap-2">
                    {hasSizes && (
                      <select 
                        onChange={(e) => applyToAll('size', e.target.value)}
                        className="text-xs px-2 py-1 border border-rose-gold/20 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-rose-gold"
                        defaultValue=""
                      >
                        <option value="" disabled>تطبيق مقاس على الكل</option>
                        {product.sizes?.map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    )}
                    {hasColors && (
                      <select 
                        onChange={(e) => applyToAll('color', e.target.value)}
                        className="text-xs px-2 py-1 border border-rose-gold/20 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-rose-gold"
                        defaultValue=""
                      >
                        <option value="" disabled>تطبيق لون على الكل</option>
                        {product.colors?.map(color => (
                          <option key={color} value={color}>{getColorName(color)}</option>
                        ))}
                      </select>
                    )}
                    <button
                      onClick={() => setAllQuantities(1)}
                      className="text-xs px-2 py-1 border border-rose-gold/20 rounded-lg bg-white text-black hover:bg-rose-gold/10 transition"
                    >
                      ضبط الكل على 1
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4 max-h-[40vh] overflow-y-auto p-1">
                {selections.map((selection, index) => (
                  <div key={selection.id} className="bg-rose-gold/5 rounded-xl p-3 relative border border-rose-gold/10">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-black/70">القطعة {toArabicNumber(index + 1)}</span>
                      {selections.length > 1 && (
                        <button
                          onClick={() => removeSelection(selection.id)}
                          className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          إزالة
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {hasSizes && (
                        <div>
                          <p className="text-xs font-bold text-black mb-1.5">المقاس <span className="text-rose-gold">*</span></p>
                          <div className="flex flex-wrap gap-2">
                            {product.sizes?.map((size) => (
                              <button
                                key={size}
                                onClick={() => updateSelection(selection.id, 'size', size)}
                                className={`min-w-10 px-3 py-1 text-sm font-bold rounded-lg transition-all ${
                                  selection.size === size
                                    ? 'bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white shadow-md'
                                    : 'bg-white text-black hover:bg-rose-gold/10 border border-rose-gold/20'
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {hasColors && (
                        <div>
                          <p className="text-xs font-bold text-black mb-1.5">اللون <span className="text-rose-gold">*</span></p>
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
                                      ? 'ring-rose-gold scale-110' 
                                      : 'ring-rose-gold/20 hover:ring-rose-gold/40'
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
                    </div>

                    <div className="mt-3">
                      <p className="text-xs font-bold text-black mb-1.5">الكمية</p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const newQuantity = Math.max(1, selection.quantity - 1);
                            updateSelection(selection.id, 'quantity', newQuantity);
                          }}
                          className="w-7 h-7 rounded-full bg-white border border-rose-gold/20 text-black font-bold hover:bg-rose-gold/10 transition flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-bold text-sm text-black">{toArabicNumber(selection.quantity)}</span>
                        <button
                          onClick={() => {
                            const availableStock = getAvailableStock(product, selection.size, selection.color);
                            const newQuantity = selection.quantity + 1;
                            if (newQuantity <= availableStock) {
                              updateSelection(selection.id, 'quantity', newQuantity);
                            } else {
                              window.dispatchEvent(new CustomEvent('showToast', {
                                detail: {
                                  message: `⚠️ معندناش غير ${toArabicNumber(availableStock)} قطعة من المنتج ده`,
                                  type: 'warning'
                                }
                              }));
                            }
                          }}
                          className="w-7 h-7 rounded-full bg-white border border-rose-gold/20 text-black font-bold hover:bg-rose-gold/10 transition flex items-center justify-center"
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
                className="w-full py-2 rounded-xl border-2 border-dashed border-rose-gold/30 text-rose-gold text-sm font-bold hover:border-rose-gold/50 hover:text-copper transition-all"
              >
                + إضافة قطعة أخرى
              </button>

              <div className="bg-rose-gold/5 rounded-xl p-3 border border-rose-gold/10">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-black/70">إجمالي القطع:</span>
                  <span className="text-sm font-bold text-black">{toArabicNumber(totalItems)} قطعة</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm font-bold text-black/70">الإجمالي:</span>
                  <span className="text-lg font-bold text-rose-gold">{formatPrice(getQuantityDiscountPrice(totalItems))}</span>
                </div>
                {hasDiscount && (
                  <div className="mt-2 text-xs text-rose-gold font-bold text-center">
                    🎉 خصم الكمية: وفرت {formatPrice(totalItems * product.price - getQuantityDiscountPrice(totalItems))}
                  </div>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-white p-4 border-t border-rose-gold/20 flex gap-3 rounded-b-2xl">
              <button
                onClick={confirmSelections}
                disabled={!hasValidSelections()}
                className={`flex-1 py-2.5 rounded-xl font-bold transition-all ${
                  hasValidSelections()
                    ? 'bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white hover:scale-[1.02] shadow-md hover:shadow-rose-gold/30'
                    : 'bg-rose-gold/10 text-rose-gold/40 cursor-not-allowed'
                }`}
              >
                أضف ({toArabicNumber(totalItems)}) للسلة
              </button>

              <button
                onClick={cancelSelection}
                className="flex-1 py-2.5 rounded-xl bg-linear-to-r from-gray-500 via-gray-600 to-gray-700 text-white font-bold hover:scale-[1.02] transition-all shadow-md"
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