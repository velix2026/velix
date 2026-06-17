'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { Product } from "@/lib/products";
import { motion } from "framer-motion";

interface FeaturedProductsProps {
  products: Product[];
}

type TabType = 'all' | 'latest' | 'bestsellers';

// ✅ الأقسام مع الحملات التسويقية
const categories = [
  { id: 'تيشرتات', name: 'تيشرتات', slogan: 'تيشرتات من VELIX', desc: 'قطن مصري ١٠٠٪ | جودة تدوم' },
  { id: 'هوديز', name: 'هوديز', slogan: 'هوديز من VELIX', desc: 'دفا وراحة في كل شتوية' },
  { id: 'شروال', name: 'شروال', slogan: 'شروال من VELIX', desc: 'حرية في الحركة | ستايل رياضي' },
  { id: 'جينز', name: 'جينز', slogan: 'جينز من VELIX', desc: 'كلاسيك بعصرية | إطلالة لا تنسى' },
  { id: 'جواكت', name: 'جواكت', slogan: 'جواكت من VELIX', desc: 'أناقة شتوية | خامات فاخرة' },
  { id: 'شوزات', name: 'شوزات', slogan: 'شوزات من VELIX', desc: 'خطوة مميزة | إحساس مختلف' },
];

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  // حساب المنتجات
  const bestSellers = useMemo(() => 
    [...products]
      .filter(p => (p.salesCount || 0) > 0)
      .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
      .slice(0, 12)
  , [products]);

  const latestProducts = useMemo(() => 
    [...products]
      .filter(p => p.createdAt)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 12)
  , [products]);

  const categoryProducts = useMemo(() => {
    const result: Record<string, Product[]> = {};
    categories.forEach(cat => {
      result[cat.id] = products.filter(p => p.category === cat.id).slice(0, 12);
    });
    return result;
  }, [products]);

  const tabs = useMemo(() => {
    const tabsList = [];
    if (products.length > 0) tabsList.push({ id: 'all', label: 'كل المنتجات', icon: '🎯', count: products.length });
    if (latestProducts.length > 0) tabsList.push({ id: 'latest', label: 'الجديد', icon: '🆕', count: latestProducts.length });
    if (bestSellers.length > 0) tabsList.push({ id: 'bestsellers', label: 'الأكثر مبيعاً', icon: '⭐', count: bestSellers.length });
    return tabsList;
  }, [products.length, latestProducts.length, bestSellers.length]);

  const displayedProducts = useMemo(() => {
    if (activeTab === 'latest') return latestProducts;
    if (activeTab === 'bestsellers') return bestSellers;
    return products.slice(0, 12);
  }, [activeTab, products, latestProducts, bestSellers]);

  // Refs للتمرير
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const categoryScrollRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // دوال التمرير (بسيطة وشغالة)
  const scrollLeft = (ref: React.RefObject<HTMLDivElement | null> | HTMLDivElement | null) => {
    const container = ref && 'current' in ref ? ref.current : ref;
    if (container) {
      container.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRight = (ref: React.RefObject<HTMLDivElement | null> | HTMLDivElement | null) => {
    const container = ref && 'current' in ref ? ref.current : ref;
    if (container) {
      container.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  if (products.length === 0) return null;

  const currentTabExists = tabs.some(tab => tab.id === activeTab);
  if (!currentTabExists && tabs.length > 0) {
    setActiveTab(tabs[0].id as TabType);
  }

  return (
    <section className="bg-linear-to-b from-white via-[#FCFCFC] to-[#F5F3F0] py-20 md:py-28">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs text-rose-gold tracking-[0.2em] uppercase font-bold mb-3 block">
            شوف عندنا إيه
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-black">
            اكتشف مجموعتنا
          </h2>
          <div className="w-20 h-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full mx-auto mt-4 mb-6" />
          <p className="text-black/60 font-bold text-base max-w-2xl mx-auto">
            تشكيلة متنوعة تناسب كل الأذواق. جودة عالية وتصميم عصري يليق بيك
          </p>
        </div>

        {/* Tabs */}
        {tabs.length > 1 && (
          <div className="flex justify-center gap-2 mb-10 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white shadow-lg shadow-rose-gold/20'
                    : 'bg-white text-black/70 hover:bg-rose-gold/10 border border-rose-gold/20'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
                <span className="text-xs opacity-70">({tab.count})</span>
              </button>
            ))}
          </div>
        )}

        {/* ============================================ */}
        {/* الصف الأول: منتجات مميزة */}
        {/* ============================================ */}
        <div className="mb-20">
          <div className="text-center mb-6">
            <h3 className="text-2xl md:text-3xl font-black text-black">
              {activeTab === 'all' && 'أحدث المنتجات'}
              {activeTab === 'latest' && 'جديد VELIX'}
              {activeTab === 'bestsellers' && 'الأكثر مبيعاً'}
            </h3>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="w-12 h-0.5 bg-rose-gold/30" />
              <p className="text-rose-gold font-bold text-sm">تشكيلة مميزة تليق بيك</p>
              <div className="w-12 h-0.5 bg-rose-gold/30" />
            </div>
          </div>
          
          {/* أزرار التنقل */}
          <div className="flex justify-end gap-2 mb-3">
            <button
              onClick={() => scrollLeft(mainScrollRef)}
              className="w-9 h-9 rounded-full border-2 border-rose-gold/40 text-rose-gold hover:bg-rose-gold hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scrollRight(mainScrollRef)}
              className="w-9 h-9 rounded-full border-2 border-rose-gold/40 text-rose-gold hover:bg-rose-gold hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* المنتجات */}
          <div
            ref={mainScrollRef}
            className="overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-4 md:gap-6" style={{ width: 'max-content' }}>
              {displayedProducts.map((product, idx) => (
                <motion.div
                  key={product.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="w-40-[180px] md:w-50 lg:w-55 shrink-0"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
          
          {activeTab === 'all' && products.length > 12 && (
            <div className="text-center mt-8">
              <Link href="/products" className="inline-flex items-center gap-2 text-rose-gold font-bold hover:gap-3 transition-all">
                شوف كل المنتجات
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* الأقسام */}
        {/* ============================================ */}
        {activeTab === 'all' && (
          <div className="space-y-16">
            {categories.map((category) => {
              const catProducts = categoryProducts[category.id];
              if (catProducts.length === 0) return null;
              
              return (
                <div key={category.id}>
                  {/* عنوان القسم */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-20 invisible md:visible" />
                    <div className="text-center flex-1">
                      <h3 className="text-xl md:text-2xl font-black text-black">
                        {category.slogan}
                      </h3>
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <div className="w-8 h-0.5 bg-rose-gold/30" />
                        <p className="text-rose-gold font-bold text-xs md:text-sm">
                          {category.desc}
                        </p>
                        <div className="w-8 h-0.5 bg-rose-gold/30" />
                      </div>
                    </div>
                    <div className="w-20 flex justify-end">
                      <Link
                        href={`/collections/${category.id}`}
                        className="inline-flex items-center gap-1 text-xs md:text-sm text-rose-gold/60 hover:text-rose-gold transition-all group whitespace-nowrap"
                      >
                        <span>تسوق {category.name}</span>
                        <svg className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                  
                  {/* أزرار التنقل لكل قسم */}
                  <div className="flex justify-end gap-2 mb-3">
                    <button
                      onClick={() => scrollLeft(categoryScrollRefs.current[category.id])}
                      className="w-9 h-9 rounded-full border-2 border-rose-gold/40 text-rose-gold hover:bg-rose-gold hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => scrollRight(categoryScrollRefs.current[category.id])}
                      className="w-9 h-9 rounded-full border-2 border-rose-gold/40 text-rose-gold hover:bg-rose-gold hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* منتجات القسم */}
                  <div
                    ref={(el) => { categoryScrollRefs.current[category.id] = el; }}
                    className="overflow-x-auto scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    <div className="flex gap-4 md:gap-6" style={{ width: 'max-content' }}>
                      {catProducts.map((product) => (
                        <div key={product.slug} className="w-40 sm:w-45 md:w-50 lg:w-55 shrink-0">
                          <ProductCard product={product} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}