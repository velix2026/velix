'use client';

import { useState, useMemo } from 'react';
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { Product } from "@/lib/products";
import { motion } from "framer-motion";

interface FeaturedProductsProps {
  products: Product[];
}

type TabType = 'all' | 'latest' | 'bestsellers';

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  // ✅ حساب المنتجات
  const bestSellers = useMemo(() => 
    [...products]
      .filter(p => (p.salesCount || 0) > 0)
      .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
      .slice(0, 8)
  , [products]);

  const latestProducts = useMemo(() => 
    [...products]
      .filter(p => p.createdAt)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 8)
  , [products]);

  // ✅ تعريف التبويبات اللي هتظهر (اللي فيها منتجات بس)
  const tabs = useMemo(() => {
    const tabsList = [];
    
    // تبويب "كل المنتجات" - بيظهر دايمًا لو فيه منتجات أصلًا
    if (products.length > 0) {
      tabsList.push({ id: 'all', label: 'كل المنتجات', icon: '🎯', count: products.length });
    }
    
    // تبويب "الجديد" - بيظهر بس لو فيه منتجات جديدة
    if (latestProducts.length > 0) {
      tabsList.push({ id: 'latest', label: 'الجديد', icon: '🆕', count: latestProducts.length });
    }
    
    // تبويب "الأكثر مبيعاً" - بيظهر بس لو فيه منتجات اتباعت
    if (bestSellers.length > 0) {
      tabsList.push({ id: 'bestsellers', label: 'الأكثر مبيعاً', icon: '⭐', count: bestSellers.length });
    }
    
    return tabsList;
  }, [products.length, latestProducts.length, bestSellers.length]);

  // ✅ المنتجات اللي هتظهر حسب التبويب النشط
  const displayedProducts = useMemo(() => {
    if (activeTab === 'latest') {
      return latestProducts;
    } else if (activeTab === 'bestsellers') {
      return bestSellers;
    } else {
      return products.slice(0, 8);
    }
  }, [activeTab, products, latestProducts, bestSellers]);

  // لو مفيش منتجات خالص، متعرضش حاجة
  if (products.length === 0) return null;

  // لو التبويب النشط اختفى (مثلاً كان الأكثر مبيعاً واتمسح)، نغير التبويب لأول تبويب موجود
  const currentTabExists = tabs.some(tab => tab.id === activeTab);
  if (!currentTabExists && tabs.length > 0) {
    setActiveTab(tabs[0].id as TabType);
  }

  return (
    <section className="bg-linear-to-b from-white via-[#FCFCFC] to-[#F5F3F0] py-20 md:py-28">
      <div className="container mx-auto px-4">
        
        {/* Header - بالعامية */}
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

        {/* Tabs - بيظهر بس التبويبات اللي فيها حاجة */}
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

        {/* Products Grid */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>

        {/* زر عرض الكل - يظهر بس لو فيه منتجات أكتر من اللي ظاهر */}
        {(activeTab === 'all' && products.length > 8) && (
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 border-2 border-rose-gold/30 text-rose-gold font-bold px-8 py-3 rounded-full hover:bg-rose-gold hover:text-white hover:border-rose-gold transition-all duration-300"
            >
              شوف كل المنتجات
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