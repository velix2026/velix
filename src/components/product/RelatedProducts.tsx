// components/product/RelatedProducts.tsx
'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import ProductCard from '@/components/ProductCard';

interface RelatedProductsProps {
  products: any[];
  currentProductId: number;
}

export default function RelatedProducts({ products, currentProductId }: RelatedProductsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  const related = products.filter(p => p.id !== currentProductId).slice(0, 4);

  if (related.length === 0) return null;

  return (
    <div className="mt-16 pt-8 border-t border-black/10" ref={ref}>
      <div className="text-center mb-8">
        <span className="text-xs text-black tracking-[0.2em] uppercase font-bold mb-3 block opacity-60">
          اكتشف المزيد
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-black">
          منتجات ذات صلة
        </h2>
        <div className="w-16 h-0.5 bg-black/20 mx-auto mt-4 mb-6" />
        <p className="text-black font-bold text-base max-w-2xl mx-auto opacity-60">
          قد تعجبك أيضاً هذه المنتجات من نفس القسم
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {related.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <ProductCard product={product} priority={idx === 0} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}