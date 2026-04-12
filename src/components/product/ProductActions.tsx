'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { toArabicNumber, formatPrice } from '@/lib/utils';

interface ProductActionsProps {
  product: any;
  onOrder: (data: { size: string; color: string; quantity: number }) => void;
}

const allColors = [
  { name: 'أسود', value: '#000000', code: 'black' },
  { name: 'أبيض', value: '#FFFFFF', code: 'white', border: true },
  { name: 'رمادي', value: '#808080', code: 'gray' },
  { name: 'أزرق', value: '#3B82F6', code: 'blue' },
  { name: 'أحمر', value: '#EF4444', code: 'red' },
  { name: 'أخضر', value: '#22C55E', code: 'green' },
  { name: 'بيج', value: '#F5F5DC', code: 'beige', border: true },
];

// ✅ دالة حساب السعر بعد خصم الكمية
const getQuantityDiscountPrice = (product: any, quantity: number) => {
  if (!product.quantityDiscount?.enabled) return product.price * quantity;
  
  const { minQuantity, discountPerItem } = product.quantityDiscount;
  
  if (quantity < minQuantity) return product.price * quantity;
  
  const normalCount = minQuantity - 1;
  const discountedCount = quantity - normalCount;
  const discountedPrice = product.price - discountPerItem;
  
  return (normalCount * product.price) + (discountedCount * discountedPrice);
};

// ✅ دالة حساب إجمالي الكمية من stockItems
const getTotalStock = (product: any, selectedSize: string, selectedColor: string): number => {
  if (product.stockItems && Array.isArray(product.stockItems)) {
    const stockItem = product.stockItems.find(
      (item: any) => item.size === selectedSize && item.colorCode === selectedColor
    );
    return stockItem?.quantity || 0;
  }
  return product.stock || 0;
};

export default function ProductActions({ product, onOrder }: ProductActionsProps) {
  const [selection, setSelection] = useState({
    size: '',
    color: '',
    quantity: 1,
  });
  
  const { addToCart, removeFromCartByProductId, isInCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const sizes: string[] = product.sizes || [];
  const colors: string[] = product.colors || [];
  
  // ✅ حساب الكمية المتاحة بناءً على المقاس واللون المختارين
  const availableStock = getTotalStock(product, selection.size, selection.color);
  
  const isInCartState = isInCart(product.id);
  const isFavoritedState = isFavorite(product.id);
  
  const quantityDiscountPrice = getQuantityDiscountPrice(product, selection.quantity);
  const originalPrice = product.price * selection.quantity;
  const savings = originalPrice - quantityDiscountPrice;

  useEffect(() => {
    setSelection(prev => ({
      ...prev,
      size: sizes[0] || '',
      color: colors[0] || '',
    }));
  }, [sizes, colors]);

  // ✅ إعادة تعيين الكمية عند تغيير المقاس أو اللون
  useEffect(() => {
    setSelection(prev => ({ ...prev, quantity: 1 }));
  }, [selection.size, selection.color]);

  const updateSelection = (key: string, value: any) => {
    setSelection(prev => ({ ...prev, [key]: value }));
  };

  const validateSelection = () => {
    if (sizes.length > 0 && !selection.size) {
      alert('الرجاء اختيار المقاس');
      return false;
    }
    if (colors.length > 0 && !selection.color) {
      alert('الرجاء اختيار اللون');
      return false;
    }
    return true;
  };

  const handleOrder = () => {
    if (!validateSelection()) return;
    onOrder(selection);
  };

  const handleAddToCart = () => {
    if (!validateSelection()) return;
    
    if (selection.quantity > availableStock) {
      alert(`⚠️ الكمية المطلوبة (${selection.quantity}) تتجاوز المتاح (${availableStock})`);
      return;
    }
    
    setTimeout(() => {
      addToCart(product, selection.size || undefined, selection.color || undefined, selection.quantity);
    }, 0);
  };

  const handleRemoveFromCart = () => {
    setTimeout(() => {
      removeFromCartByProductId(product.id, product.name);
    }, 0);
  };

  const handleToggleFavorite = () => {
    setTimeout(() => {
      toggleFavorite(product);
    }, 0);
  };

  const getColorDetails = (colorCode: string) => {
    return allColors.find(c => c.code === colorCode) || { name: colorCode, value: colorCode, code: colorCode };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mt-6"
    >
      {/* المقاسات */}
      {sizes.length > 0 && (
        <div className="mb-6">
          <label className="flex text-sm font-bold text-black mb-3 items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
            اختر المقاس:
          </label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => updateSelection('size', size)}
                className={`px-4 py-2 rounded-full border-2 transition-all duration-200 font-bold ${
                  selection.size === size
                    ? 'bg-black text-white border-black shadow-lg scale-105'
                    : 'bg-white text-black border-black/20 hover:border-black hover:scale-105'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* الألوان */}
      {colors.length > 0 && (
        <div className="mb-6">
          <label className="flex text-sm font-bold text-black mb-3 items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            اختر اللون:
          </label>
          <div className="flex flex-wrap gap-3">
            {colors.map((colorCode) => {
              const color = getColorDetails(colorCode);
              const isSelected = selection.color === colorCode;
              return (
                <button
                  key={colorCode}
                  onClick={() => updateSelection('color', colorCode)}
                  className={`relative w-10 h-10 rounded-full transition-all duration-200 ${
                    isSelected ? 'ring-2 ring-offset-2 ring-black scale-110 shadow-lg' : 'hover:scale-110'
                  }`}
                  style={{
                    backgroundColor: color.value,
                    border: color.border ? '1px solid #000000' : 'none',
                  }}
                  title={color.name}
                >
                  {isSelected && (
                    <svg 
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white drop-shadow-md"
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

      {/* الكمية */}
      <div className="mb-4">
        <label className="block text-sm font-bold text-black mb-3">الكمية:</label>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-black/5 rounded-full">
            <button
              onClick={() => updateSelection('quantity', Math.max(1, selection.quantity - 1))}
              className="w-10 h-10 rounded-full hover:bg-black/10 transition flex items-center justify-center text-lg font-bold text-black"
            >
              -
            </button>
            <span className="w-12 text-center text-xl font-black text-black">{toArabicNumber(selection.quantity)}</span>
            <button
              onClick={() => updateSelection('quantity', Math.min(availableStock, selection.quantity + 1))}
              disabled={selection.quantity >= availableStock}
              className="w-10 h-10 rounded-full hover:bg-black/10 transition flex items-center justify-center text-lg font-bold text-black disabled:opacity-40 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
          <span className="text-sm font-bold text-black/60">
            <span className="font-black text-black">{toArabicNumber(availableStock)}</span> قطعة متاحة
          </span>
        </div>
      </div>

      {/* ✅ عرض خصم الكمية */}
      {product.quantityDiscount?.enabled && selection.quantity >= product.quantityDiscount.minQuantity && (
        <div className="mb-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎉</span>
              <span className="text-sm font-black text-emerald-700">خصم الكمية!</span>
            </div>
            <div className="text-right">
              <div className="text-xs text-emerald-600 line-through">{formatPrice(originalPrice)}</div>
              <div className="text-sm font-black text-emerald-700">{formatPrice(quantityDiscountPrice)}</div>
            </div>
          </div>
          <p className="text-xs text-emerald-600 mt-1 font-bold">
            وفرت {formatPrice(savings)} عند شراء {toArabicNumber(selection.quantity)} قطعة
          </p>
        </div>
      )}

      {/* أزرار الإجراءات */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={handleOrder}
          disabled={availableStock === 0}
          className="flex-1 bg-linear-to-r from-emerald-500 via-green-500 to-lime-400 text-white font-bold py-3.5 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-base"
        >
          اطلب الآن
        </button>
        
        {isInCartState ? (
          <button
            onClick={handleRemoveFromCart}
            className="flex-1 bg-red-500 text-white font-bold py-3.5 rounded-full hover:bg-red-600 transition-all duration-300 shadow-lg text-base"
          >
            إزالة من السلة
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={availableStock === 0}
            className="flex-1 bg-linear-to-r from-sky-400 via-blue-500 to-indigo-500 text-white font-bold py-3.5 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-base"
          >
            أضف للسلة
          </button>
        )}
      </div>

      {/* أزرار المفضلة والمشاركة */}
      <div className="flex gap-3">
        <button
          onClick={handleToggleFavorite}
          className={`flex-1 py-3 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 border-2 ${
            isFavoritedState
              ? 'bg-red-500 text-white border-red-500'
              : 'bg-white text-black border-black/20 hover:border-black hover:bg-black/5'
          }`}
        >
          <svg className="w-5 h-5" fill={isFavoritedState ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {isFavoritedState ? 'تمت الإضافة للمفضلة' : 'أضف للمفضلة'}
        </button>
        
        <button
          onClick={async () => {
            const url = window.location.href;
            if (navigator.share) {
              try {
                await navigator.share({
                  title: `VELIX - ${product.name}`,
                  text: `شوف منتج ${product.name} من VELIX`,
                  url,
                });
              } catch (err) {}
            } else {
              await navigator.clipboard.writeText(url);
              alert('تم نسخ رابط المنتج 📋');
            }
          }}
          className="py-3 px-6 rounded-full font-bold bg-white text-black border-2 border-black/20 hover:border-black hover:bg-black/5 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          مشاركة
        </button>
      </div>
    </motion.div>
  );
}