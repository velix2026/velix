// components/FeaturedProducts.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { Product } from "@/lib/products";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const isMountedRef = useRef(true);

  // الأكثر مبيعاً: حسب salesCount (الأعلى أولاً) و salesCount > 0
  const bestSellers = [...products]
    .filter(p => (p.salesCount || 0) > 0)
    .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
    .slice(0, 4);
  
  // أحدث المنتجات: حسب id (الأحدث أولاً)
  const latestProducts = [...products]
    .sort((a, b) => b.id - a.id)
    .slice(0, 4);

  // دالة تحميل المنتجات المفضلة مع تأجيل الـ setState
  const loadFavorites = useCallback(() => {
    // ✅ استخدام setTimeout لتأجيل الـ setState خارج الـ render
    setTimeout(() => {
      if (!isMountedRef.current) return;
      
      try {
        const saved = localStorage.getItem('favorites');
        if (saved) {
          const favs: Product[] = JSON.parse(saved);
          const favIds = new Set<number>(favs.map((p: Product) => p.id));
          setFavoriteIds(favIds);
          
          // جلب المنتجات الكاملة من الـ products array
          const favProducts = products.filter(p => favIds.has(p.id));
          setFavoriteProducts(favProducts.slice(0, 4));
        } else {
          setFavoriteIds(new Set());
          setFavoriteProducts([]);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
        setFavoriteIds(new Set());
        setFavoriteProducts([]);
      }
    }, 0);
  }, [products]);

  // تحميل المنتجات المفضلة عند التحميل الأول
  useEffect(() => {
    isMountedRef.current = true;
    loadFavorites();
    
    // الاستماع لتحديثات المفضلة
    const handleFavoritesUpdate = () => {
      loadFavorites();
    };
    
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    
    return () => {
      isMountedRef.current = false;
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
    };
  }, [loadFavorites]);

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-4">
        
        {/* قسم الأكثر مبيعاً - يظهر بس لو في منتجات اتباعت */}
        {bestSellers.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
                <span className="text-2xl">⭐</span>
                الأكثر مبيعاً
              </h2>
              <div className="w-16 h-0.5 bg-gray-300 mx-auto mt-3 mb-4"></div>
              <p className="text-gray-500 font-bold text-sm">المنتجات الأكثر طلباً من عملائنا</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* قسم المنتجات المفضلة - يظهر بس لو العميل عنده منتجات في المفضلة */}
        {favoriteProducts.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
                <span className="text-2xl">❤️</span>
                منتجاتك المفضلة
              </h2>
              <div className="w-16 h-0.5 bg-gray-300 mx-auto mt-3 mb-4"></div>
              <p className="text-gray-500 font-bold text-sm">
                {favoriteProducts.length === 1 
                  ? 'لديك منتج واحد في المفضلة' 
                  : `لديك ${favoriteProducts.length} منتج في المفضلة`}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {favoriteProducts.map((product) => (
                <ProductCard key={product.id} product={product} priority={true} />
              ))}
            </div>
            {favoriteProducts.length < favoriteIds.size && (
              <div className="text-center mt-6">
                <Link
                  href="/favorites"
                  className="inline-flex items-center gap-2 text-gray-500 hover:text-black font-bold text-sm transition-colors"
                >
                  عرض كل المفضلة ({favoriteIds.size})
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* قسم أحدث المنتجات - يظهر دائماً لو في منتجات */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            أحدث المنتجات
          </h2>
          <div className="w-16 h-0.5 bg-gray-300 mx-auto mt-4 mb-6"></div>
          <p className="text-gray-500 font-bold text-base max-w-2xl mx-auto">
            اكتشف أحدث تصاميمنا. جودة عالية وتفاصيل دقيقة تناسب ستايلك اليومي.
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {latestProducts.length > 0 ? (
            latestProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-center col-span-2 sm:col-span-3 lg:col-span-4 text-gray-500 font-bold">
              لا توجد منتجات متاحة حاليًا
            </p>
          )}
        </div>
        
        {/* زر عرض الكل */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 font-bold px-8 py-3 rounded-full hover:bg-black hover:text-white hover:border-black transition-all duration-300 group"
          >
            عرض جميع المنتجات
            <svg 
              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}