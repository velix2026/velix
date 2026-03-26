'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';

interface RelatedProductsProps {
  products: any[];
  currentProductId: number;
}

export default function RelatedProducts({ products, currentProductId }: RelatedProductsProps) {
  const [showRelated, setShowRelated] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      setShowRelated(true);
    }
  }, [inView]);

  const related = products.filter(p => p.id !== currentProductId).slice(0, 4);

  if (related.length === 0) return null;

  return (
    <div className="mt-16 pt-8 border-t border-gray-100" ref={ref}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center md:text-right">
        منتجات ذات صلة
      </h2>
      
      {showRelated ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {related.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src={product.mainImage}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <h3 className="font-medium mt-2 text-sm line-clamp-1 group-hover:text-gray-600 transition">
                {product.name}
              </h3>
              <p className="text-sm font-bold">{product.price} جنيه</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-xl" />
              <div className="h-4 bg-gray-200 rounded mt-2 w-3/4" />
              <div className="h-3 bg-gray-200 rounded mt-1 w-1/2" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}