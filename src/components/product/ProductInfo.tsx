'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toArabicNumber, formatPrice } from '@/lib/utils';
import SizeGuideModal from '@/components/SizeGuideModal';

interface ProductInfoProps {
  product: any;
}

const getTotalStock = (product: any): number => {
  if (product.stockItems && Array.isArray(product.stockItems)) {
    return product.stockItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
  }
  return product.stock || 0;
};

export default function ProductInfo({ product }: ProductInfoProps) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

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
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            {product.isNew && <span className="bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white text-xs font-bold px-3 py-1 rounded-full">🆕 جديد</span>}
            {product.bestseller && <span className="bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white text-xs font-bold px-3 py-1 rounded-full">⭐ الأكثر مبيعاً</span>}
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-3">{product.name}</h1>
          <p className="text-black/60 font-bold text-base">{product.category}</p>
        </div>

        {rating > 0 && (
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-rose-gold fill-rose-gold' : 'text-rose-gold/30'}`} fill={i < Math.floor(rating) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-bold text-black/60">({toArabicNumber(rating)} / ٥)</span>
            <span className="text-rose-gold/30">|</span>
            <span className="text-sm font-bold text-black/60">{toArabicNumber(product.salesCount || 0)} تقييم</span>
          </div>
        )}

        {timeLeft > 0 && (
          <div className="bg-linear-to-r from-rose-gold-dark via-red-600 to-rose-gold-dark text-white p-5 rounded-2xl text-center mb-6 shadow-xl">
            <p className="text-sm font-bold mb-2">⏰ العرض بيخلص خلال</p>
            <p className="font-mono text-3xl font-black tracking-wider">{formatTime(timeLeft)}</p>
          </div>
        )}

        <div className="mb-6">
          {product.oldPrice && product.oldPrice > product.price ? (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-4xl md:text-5xl font-black text-rose-gold">{formatPrice(product.price)}</span>
              <span className="text-xl text-black/40 line-through">{formatPrice(product.oldPrice)}</span>
              <span className="bg-rose-gold/10 text-rose-gold px-3 py-1.5 rounded-full text-sm font-bold">وفرت {toArabicNumber(product.oldPrice - product.price)} جنيه</span>
            </div>
          ) : (
            <span className="text-4xl md:text-5xl font-black text-rose-gold">{formatPrice(product.price)}</span>
          )}
          <p className="text-rose-gold text-sm font-bold mt-2 flex items-center gap-1">✓ شامل الشحن المجاني</p>
        </div>

        <div className="mb-6 p-5 bg-rose-gold/5 rounded-2xl border border-rose-gold/20">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-black">المخزون:</span>
            {totalStock > 0 ? (
              <span className="text-rose-gold text-sm font-bold">{totalStock <= 10 ? `⚠️ باقي ${toArabicNumber(totalStock)} قطع بس` : '✅ متوفر'}</span>
            ) : (
              <span className="text-red-500 text-sm font-bold">❌ خلص</span>
            )}
          </div>
          {totalStock > 0 && totalStock <= 10 && (
            <div className="w-full bg-rose-gold/10 rounded-full h-2">
              <div className="bg-linear-to-r from-rose-gold to-copper h-2 rounded-full transition-all duration-500" style={{ width: `${(totalStock / 50) * 100}%` }} />
            </div>
          )}
        </div>

        {/* ✅ زر دليل المقاسات */}
        <div className="mb-6">
          <button
            onClick={() => setIsSizeGuideOpen(true)}
            className="inline-flex items-center gap-2 text-sm text-rose-gold hover:text-copper transition-colors group"
          >
            <svg className="w-5 h-5 group-hover:scale-105 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="border-b border-rose-gold/30 group-hover:border-rose-gold transition">📏 مش عارف مقاسك؟ شوف دليل المقاسات</span>
          </button>
        </div>

        <div className="border-t border-rose-gold/20 pt-6">
          <h3 className="font-black text-lg text-black mb-3 flex items-center gap-2">📝 وصف المنتج</h3>
          <p className="text-black/70 leading-relaxed whitespace-pre-line font-medium">{product.description}</p>
        </div>

        <div className="border-t border-rose-gold/20 pt-6 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2"><span className="text-black/60">القسم:</span><span className="font-bold text-black">{product.category}</span></div>
            <div className="flex items-center gap-2"><span className="text-black/60">رمز المنتج:</span><span className="font-bold text-black">VEL-{product.id}</span></div>
            <div className="flex items-center gap-2"><span className="text-black/60">الحالة:</span><span className={`font-bold ${totalStock > 0 ? 'text-rose-gold' : 'text-red-500'}`}>{totalStock > 0 ? 'متوفر' : 'خلص'}</span></div>
            <div className="flex items-center gap-2"><span className="text-black/60">الشحن:</span><span className="font-bold text-rose-gold">🚚 مجاني</span></div>
          </div>
        </div>
      </motion.div>

      {/* ✅ مودال دليل المقاسات */}
      <SizeGuideModal 
        isOpen={isSizeGuideOpen} 
        onClose={() => setIsSizeGuideOpen(false)} 
      />
    </>
  );
}