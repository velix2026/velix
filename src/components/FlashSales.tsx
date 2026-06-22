'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/products';
import { formatPrice, toArabicNumber } from '@/lib/utils';

interface FlashSalesProps {
  products: Product[];
}

function getInitialEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem('velix_flash_enabled');
  return stored !== null ? stored === 'true' : true;
}

export default function FlashSales({ products }: FlashSalesProps) {
  const [enabled] = useState(getInitialEnabled);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const flashItems = products
    .filter(p => p.oldPrice && p.oldPrice > p.price && p.inStock)
    .sort((a, b) => ((b.discount || 0) - (a.discount || 0)))
    .slice(0, 4);

  if (!enabled || flashItems.length === 0) return null;

  return (
    <section ref={ref} className="bg-linear-to-b from-white via-[#FFF8F5] to-[#F5F3F0] py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-1.5 text-xs text-rose-gold tracking-[0.2em] uppercase font-bold mb-3">
            <span className="w-2 h-2 rounded-full bg-rose-gold animate-pulse" />
            عروض محدودة
            <span className="w-2 h-2 rounded-full bg-rose-gold animate-pulse" />
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-black">صفقة اليوم</h2>
          <div className="w-20 h-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full mx-auto mt-4 mb-4" />
          <p className="text-black/60 font-bold text-sm md:text-base">
            عروض مش هتتكرر. خصومات لفترة محدودة!
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <AnimatePresence mode="popLayout">
            {flashItems.map((product, idx) => {
              const discountPercent = product.oldPrice && product.oldPrice > product.price
                ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                : 0;

              return (
                <motion.div
                  key={product.slug}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                >
                  <Link
                    href={`/products/${product.slug}`}
                    className="group block bg-white rounded-xl border border-rose-gold/10 hover:border-rose-gold/30 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative aspect-square bg-rose-gold/5">
                      <Image
                        src={product.mainImage}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2">
                        <span className="bg-linear-to-r from-red-600 to-rose-gold-dark text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                          -{toArabicNumber(discountPercent)}%
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-xs md:text-sm font-bold text-black line-clamp-2 mb-1 group-hover:text-rose-gold transition">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm md:text-base font-bold text-rose-gold">
                          {formatPrice(product.price)}
                        </span>
                        {product.oldPrice && (
                          <span className="text-[10px] md:text-xs text-black/40 line-through font-bold">
                            {formatPrice(product.oldPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-8"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 border-2 border-rose-gold/30 text-rose-gold font-bold px-6 py-2.5 rounded-full hover:bg-rose-gold hover:text-white transition-all duration-300"
          >
            عرض الكل
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
