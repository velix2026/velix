'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { Product } from "@/lib/products";
import { toArabicNumber } from '@/lib/utils';

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const isMountedRef = useRef(true);

  // الأكثر مبيعاً
  const bestSellers = [...products]
    .filter(p => (p.salesCount || 0) > 0)
    .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
    .slice(0, 4);
  
  // ✅ أحدث المنتجات - حسب createdAt (الأحدث أولاً)
  const latestProducts = [...products]
    .filter(p => p.createdAt) // بس اللي ليه تاريخ
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 4);

  // تحميل المنتجات المفضلة
  const loadFavorites = useCallback(() => {
    setTimeout(() => {
      if (!isMountedRef.current) return;
      
      try {
        const saved = localStorage.getItem('favorites');
        if (saved) {
          const favs: Product[] = JSON.parse(saved);
          const favIds = new Set<number>(favs.map((p: Product) => p.id));
          setFavoriteIds(favIds);
          
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

  useEffect(() => {
    isMountedRef.current = true;
    loadFavorites();
    
    const handleFavoritesUpdate = () => {
      loadFavorites();
    };
    
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    
    return () => {
      isMountedRef.current = false;
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
    };
  }, [loadFavorites]);

  // إذا مفيش منتجات، متعرضش حاجة
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-4">
        
        {/* جميع المنتجات - القسم الرئيسي */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* قسم الأكثر مبيعاً - يظهر بس لو في منتجات اتباعت */}
        {bestSellers.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-black flex items-center justify-center gap-2">
                <span className="text-2xl">⭐</span>
                الأكثر مبيعاً
              </h2>
              <div className="w-16 h-0.5 bg-black/20 mx-auto mt-3 mb-4"></div>
              <p className="text-black/60 font-bold text-sm">المنتجات الأكثر طلباً من عملائنا</p>
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
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-black flex items-center justify-center gap-2">
                <span className="text-2xl">❤️</span>
                منتجاتك المفضلة
              </h2>
              <div className="w-16 h-0.5 bg-black/20 mx-auto mt-3 mb-4"></div>
              <p className="text-black/60 font-bold text-sm">
                {favoriteProducts.length === 1 
                  ? 'لديك منتج واحد في المفضلة' 
                  : `لديك ${toArabicNumber(favoriteProducts.length)} منتج في المفضلة`}
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
                  className="inline-flex items-center gap-2 text-black/60 hover:text-black font-bold text-sm transition-colors"
                >
                  عرض كل المفضلة ({toArabicNumber(favoriteIds.size)})
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ✅ قسم أحدث المنتجات - حسب createdAt */}
        {latestProducts.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-black">
                أحدث المنتجات
              </h2>
              <div className="w-16 h-0.5 bg-black/20 mx-auto mt-4 mb-6"></div>
              <p className="text-black/60 font-bold text-base max-w-2xl mx-auto">
                اكتشف أحدث تصاميمنا. جودة عالية وتفاصيل دقيقة تناسب ستايلك اليومي.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {latestProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* زر عرض الكل - يظهر دائماً لو في منتجات */}
        {products.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 border border-black/20 text-black/80 font-bold px-8 py-3 rounded-full hover:bg-black hover:text-white hover:border-black transition-all duration-300 group"
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
        )}
      </div>
    </section>
  );
}