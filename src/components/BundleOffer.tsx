'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/products';
import { useCart } from '@/hooks/useCart';
import { formatPrice, toArabicNumber } from '@/lib/utils';

interface BundleOfferProps {
  currentProduct: Product;
  allProducts: Product[];
}

const BUNDLE_DISCOUNT = 0.15;
const BUNDLE_MAP: Record<string, string[]> = {
  'تيشرتات': ['هوديز', 'شروال'],
  'هوديز': ['تيشرتات', 'شروال'],
  'شروال': ['تيشرتات', 'هوديز'],
};

export default function BundleOffer({ currentProduct, allProducts }: BundleOfferProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const bundle = useMemo(() => {
    const suggestions = BUNDLE_MAP[currentProduct.category];
    if (!suggestions) return null;
    const related = suggestions
      .map(cat => allProducts.filter(p => p.category === cat && p.slug !== currentProduct.slug))
      .flat()
      .slice(0, 2);
    if (related.length < 2) return null;
    return [currentProduct, ...related];
  }, [currentProduct, allProducts]);

  const individualTotal = useMemo(() => {
    if (!bundle) return 0;
    return bundle.reduce((sum, p) => sum + p.price, 0);
  }, [bundle]);

  const bundleTotal = useMemo(() => {
    return Math.round(individualTotal * (1 - BUNDLE_DISCOUNT));
  }, [individualTotal]);

  const savings = individualTotal - bundleTotal;

  if (!bundle || bundle.length < 3) return null;

  const handleAddBundle = () => {
    bundle.forEach(p => addToCart(p));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-10 bg-linear-to-br from-rose-gold/5 via-white to-copper/5 rounded-2xl border border-rose-gold/20 p-6 shadow-lg"
    >
      <div className="text-center mb-6">
        <span className="text-xs text-rose-gold tracking-[0.2em] uppercase font-bold mb-2 block">
          أكمل الإطلالة
        </span>
        <h3 className="text-xl md:text-2xl font-black text-black">Complete the Look</h3>
        <div className="w-12 h-0.5 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full mx-auto mt-2 mb-3" />
        <p className="text-black/60 font-bold text-sm">اشتري المجموعة كاملة ووفر {BUNDLE_DISCOUNT * 100}%</p>
      </div>

      <div className="flex items-center justify-center gap-3 md:gap-4 mb-6">
        {bundle.map((product, idx) => (
          <div key={product.slug} className="flex items-center gap-3">
            <Link
              href={`/products/${product.slug}`}
              className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-rose-gold/10 border border-rose-gold/20 group shrink-0"
            >
              <Image
                src={product.mainImage}
                alt={product.name}
                fill
                sizes="96px"
                className="object-contain p-1 group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </Link>
            {idx < bundle.length - 1 && (
              <span className="text-rose-gold/40 text-lg font-black">+</span>
            )}
          </div>
        ))}
        <span className="text-rose-gold/40 text-lg font-black">=</span>
        <div className="flex flex-col items-center">
          <span className="text-rose-gold font-black text-lg">{formatPrice(bundleTotal)}</span>
          <span className="text-black/40 line-through text-xs font-bold">{formatPrice(individualTotal)}</span>
          <span className="text-emerald-600 text-xs font-bold">وفر {formatPrice(savings)}</span>
        </div>
      </div>

      <div className="bg-white/60 rounded-xl p-3 border border-rose-gold/10 mb-4">
        <p className="text-xs font-bold text-black/70 mb-2">المجموعة تشمل:</p>
        <ul className="space-y-1">
          {bundle.map((p, idx) => (
            <li key={p.slug} className="text-xs text-black/60 flex items-center gap-2">
              <span className="text-rose-gold font-black">{toArabicNumber(idx + 1)}.</span>
              <Link href={`/products/${p.slug}`} className="hover:text-rose-gold transition">
                {p.name} - <span className="text-rose-gold">{formatPrice(p.price)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleAddBundle}
        disabled={added}
        className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
          added
            ? 'bg-emerald-500 text-white'
            : 'bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white hover:scale-[1.02] shadow-md hover:shadow-rose-gold/30'
        }`}
      >
        {added ? '✓ أضيفت المجموعة!' : 'اطلب المجموعة كاملة'}
      </button>
    </motion.div>
  );
}
