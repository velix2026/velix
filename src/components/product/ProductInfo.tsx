'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toArabicNumber, formatPrice } from '@/lib/utils';

interface ProductInfoProps {
  product: any;
}

// ✅ دالة حساب إجمالي الكمية من stockItems
const getTotalStock = (product: any): number => {
  if (product.stockItems && Array.isArray(product.stockItems)) {
    return product.stockItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
  }
  return product.stock || 0;
};

export default function ProductInfo({ product }: ProductInfoProps) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!product?.offerEndsAt) return;

    const interval = setInterval(() => {
      const diff = new Date(product.offerEndsAt).getTime() - Date.now();
      setTimeLeft(diff > 0 ? diff : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [product?.offerEndsAt]);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${toArabicNumber(hours)}:${toArabicNumber(minutes)}:${toArabicNumber(seconds)}`;
  };

  const totalStock = getTotalStock(product);
  const rating = product.rating || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* العنوان */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          {product.isNew && (
            <span className="bg-black text-white text-xs font-bold px-3 py-1 rounded-full">جديد</span>
          )}
          {product.bestseller && (
            <span className="bg-linear-to-r from-yellow-500 to-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full">الأكثر مبيعاً</span>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-3">
          {product.name}
        </h1>
        <p className="text-black font-bold text-base opacity-60">{product.category}</p>
      </div>

      {/* التقييم */}
      {rating > 0 && (
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-yellow-500 fill-yellow-500' : 'text-yellow-500'}`}
                fill={i < Math.floor(rating) ? 'currentColor' : 'none'}
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            ))}
          </div>
          <span className="text-sm font-bold text-black/60">({toArabicNumber(rating)} / {toArabicNumber(5)})</span>
          <span className="text-black/30">|</span>
          <span className="text-sm font-bold text-black/60">{toArabicNumber(product.salesCount || 0)} مراجعة</span>
        </div>
      )}

      {/* Countdown Timer */}
      {timeLeft > 0 && (
        <div className="bg-linear-to-r from-red-500 to-red-600 text-white p-5 rounded-2xl text-center mb-6 shadow-xl">
          <p className="text-sm font-bold mb-2">⏰ ينتهي العرض خلال</p>
          <p className="font-mono text-3xl font-black tracking-wider">{formatTime(timeLeft)}</p>
        </div>
      )}

      {/* السعر */}
      <div className="mb-6">
        {product.oldPrice && product.oldPrice > product.price ? (
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-4xl md:text-5xl font-black text-black">{formatPrice(product.price)}</span>
            <span className="text-xl text-black line-through opacity-40">{formatPrice(product.oldPrice)}</span>
            <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-bold">
              وفر {toArabicNumber(product.oldPrice - product.price)} جنيه
            </span>
          </div>
        ) : (
          <span className="text-4xl md:text-5xl font-black text-black">{formatPrice(product.price)}</span>
        )}
        
        <p className="text-green-600 text-sm font-bold mt-2 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          شامل الشحن المجاني لجميع المنتجات
        </p>
      </div>

      {/* حالة المخزون - نسخة بسيطة ونظيفة */}
      <div className="mb-6 p-5 bg-black/5 rounded-2xl">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-black">المخزون:</span>
          {totalStock > 0 ? (
            <span className="text-green-600 text-sm font-bold">
              {totalStock <= 10 ? `⚠️ باقي ${toArabicNumber(totalStock)} قطع فقط` : '✅ متوفر'}
            </span>
          ) : (
            <span className="text-red-500 text-sm font-bold">❌ غير متوفر</span>
          )}
        </div>
        {totalStock > 0 && totalStock <= 10 && (
          <div className="w-full bg-black/10 rounded-full h-2">
            <div 
              className="bg-linear-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(totalStock / 50) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* وصف المنتج */}
      <div className="border-t border-black/10 pt-6">
        <h3 className="font-black text-lg text-black mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          وصف المنتج
        </h3>
        <p className="text-black leading-relaxed whitespace-pre-line font-medium opacity-80">{product.description}</p>
      </div>

      {/* تفاصيل إضافية */}
      <div className="border-t border-black/10 pt-6 mt-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-black/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
            </svg>
            <span className="text-black font-bold opacity-60">القسم:</span>
            <span className="font-bold text-black">{product.category}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-black/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            <span className="text-black font-bold opacity-60">رمز المنتج:</span>
            <span className="font-bold text-black">VEL-{product.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-black/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-black font-bold opacity-60">الحالة:</span>
            <span className={`font-bold ${totalStock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {totalStock > 0 ? 'متوفر' : 'غير متوفر'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-black/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-black font-bold opacity-60">الشحن:</span>
            <span className="font-bold text-green-600">🚚 مجاني لجميع المنتجات</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}