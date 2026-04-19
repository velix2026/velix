'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ProductCard from "@/components/ProductCard";
import { Product } from '@/lib/products';
import Image from 'next/image';
import Link from 'next/link';
import { create } from 'zustand';
import { ProductGridSkeleton } from '@/components/Skeleton';
import { toArabicNumber } from '@/lib/utils';

export const dynamic = 'force-dynamic';

// Zustand Store
interface StoreState {
  favorites: string[];
  cart: string[];
  addToFavorites: (id: string) => void;
  removeFromFavorites: (id: string) => void;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  loadFromStorage: () => void;
}

const useStore = create<StoreState>((set) => ({
  favorites: [],
  cart: [],
  addToFavorites: (id) => set((state) => ({ 
    favorites: state.favorites.includes(id) ? state.favorites : [...state.favorites, id] 
  })),
  removeFromFavorites: (id) => set((state) => ({ 
    favorites: state.favorites.filter(i => i !== id) 
  })),
  addToCart: (id) => set((state) => ({ 
    cart: state.cart.includes(id) ? state.cart : [...state.cart, id] 
  })),
  removeFromCart: (id) => set((state) => ({ 
    cart: state.cart.filter(i => i !== id) 
  })),
  loadFromStorage: () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    set({ 
      favorites: favorites.map((p: Product) => p.id.toString()),
      cart: cart.map((p: Product) => p.id.toString()),
    });
  }
}));

// AutoGrid Component
const AutoGrid = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3 md:gap-4 ${className}`}>
    {children}
  </div>
);

// FixedGrid Component
const FixedGrid = ({ children, cols = 4, className = "" }: { children: React.ReactNode; cols?: 2 | 3 | 4; className?: string }) => {
  const colsClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
  };
  return (
    <div className={`grid ${colsClass[cols]} gap-4 md:gap-6 ${className}`}>
      {children}
    </div>
  );
};

// Best Seller Badge - نحاسي
const BestSellerBadge = () => (
  <div className="absolute -top-2 -right-2 z-20">
    <div className="relative">
      <div className="absolute inset-0 bg-rose-gold rounded-full blur-md animate-pulse" />
      <div className="relative bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
        <span>⭐</span> الأكثر مبيعاً
      </div>
    </div>
  </div>
);

// ✅ التصنيفات الجديدة مع الترتيب
const allCategories = [
  { id: 'all', name: 'الكل', image: '/images/all-categories.png', order: 0 },
  { id: 'تيشرتات', name: 'تيشرتات', image: '/images/tshirt-category.png', order: 1 },
  { id: 'هوديز', name: 'هوديز', image: '/images/hoodie-category.png', order: 2 },
  { id: 'شروال', name: 'شروال', image: '/images/pants-category.png', order: 3 },
  { id: 'جينز', name: 'جينز', image: '/images/jeans-category.png', order: 4 },
  { id: 'جواكت', name: 'جواكت', image: '/images/jacket-category.png', order: 5 },
  { id: 'شوزات', name: 'شوزات', image: '/images/shoes-category.png', order: 6 },
  { id: 'اكسسوارات', name: '✨ أكسسوارات VELIX', image: '/images/accessories-category.png', order: 7 },
];

const sortOptions = [
  { value: 'newest', label: 'الأحدث' },
  { value: 'price-asc', label: 'السعر: من الأقل للأعلى' },
  { value: 'price-desc', label: 'السعر: من الأعلى للأقل' },
  { value: 'popular', label: 'الأكثر طلباً' }
];

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const getTotalStock = (product: Product): number => {
  if (product.stockItems && Array.isArray(product.stockItems)) {
    return product.stockItems.reduce((sum, item) => sum + item.quantity, 0);
  }
  return product.stock || 0;
};

interface ProductsClientProps {
  initialProducts: Product[];
}

export default function ProductsClient({ initialProducts }: ProductsClientProps) {
  // ✅ الحل: useRef عشان نتجنب الـ Hydration Mismatch
  const [products, setProducts] = useState<Product[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { loadFromStorage } = useStore();
  const { ref: loadMoreRef, inView } = useInView();

  // ✅ 1. تأكد من الـ Hydration (مرة واحدة)
  useEffect(() => {
    setIsHydrated(true);
    setProducts(initialProducts);
    setLoading(false);
  }, [initialProducts]);

  // ✅ 2. حساب best sellers والـ price range بعد ما البيانات تتحمل
  useEffect(() => {
    if (products.length === 0) return;
    
    const sortedBySales = [...products]
      .filter(p => (p.salesCount || 0) > 0)
      .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
      .slice(0, 4);
    setBestSellers(sortedBySales);
    
    const prices = products.map(p => p.price);
    setMinPrice(Math.min(...prices, 0));
    setMaxPrice(Math.max(...prices, 1000));
    setPriceRange([Math.min(...prices, 0), Math.max(...prices, 1000)]);
    
    loadFromStorage();
  }, [products, loadFromStorage]);

  const recommended = useMemo(() => {
    if (products.length === 0) return [];
    const candidates = products.filter(p => !bestSellers.some(b => b.id === p.id));
    const shuffled = shuffleArray(candidates);
    return shuffled.slice(0, 4);
  }, [products, bestSellers]);

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); };
  }, [searchQuery]);

  useEffect(() => {
    let filtered = [...products];
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    if (debouncedQuery) {
      const query = debouncedQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
      );
    }
    
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    
    if (sortBy === 'newest') {
      filtered.sort((a, b) => (b.createdAt ? new Date(b.createdAt).getTime() : b.id) - (a.createdAt ? new Date(a.createdAt).getTime() : a.id));
    } else if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
    }
    
    setFilteredProducts(filtered);
    setVisibleCount(12);
  }, [selectedCategory, sortBy, debouncedQuery, priceRange, products]);

  // ✅ حساب عدد المنتجات في كل قسم
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return products.length;
    return products.filter(p => p.category === categoryId).length;
  };

  // ✅ فلترة الأقسام اللي فيها منتجات بس (ما عدا "الكل")
  const getAvailableCategories = () => {
    return allCategories.filter(cat => {
      if (cat.id === 'all') return true; // "الكل" بيظهر دايماً
      return getCategoryCount(cat.id) > 0;
    }).sort((a, b) => a.order - b.order);
  };

  const availableCategories = getAvailableCategories();

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  useEffect(() => {
    if (inView && hasMore && !loading) {
      setVisibleCount(prev => prev + 12);
    }
  }, [inView, hasMore, loading]);

  // ✅ قبل الـ Hydration، اعرض Skeleton
  if (!isHydrated || (loading && products.length === 0)) {
    return (
      <div className="bg-linear-to-b from-white via-[#FCFCFC] to-[#F5F3F0] py-16 md:py-24">
        <div className="container mx-auto px-4">
          <ProductGridSkeleton count={12} />
        </div>
      </div>
    );
  }

  return (
    <section className="bg-linear-to-b from-white via-[#FCFCFC] to-[#F5F3F0] py-12 md:py-20">
      <div className="container mx-auto px-4">
        
        {/* Hero Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="text-xs text-rose-gold tracking-[0.2em] uppercase font-bold mb-3 block">
            تشكيلتنا
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-black">
            كل المنتجات
          </h1>
          <div className="w-20 h-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full mx-auto mt-4 mb-6" />
          <p className="text-black/60 font-bold text-base max-w-2xl mx-auto">
            اكتشف مجموعتنا الكاملة. تفاصيل دقيقة وجودة عالية في كل قطعة.
          </p>
        </motion.div>

        {/* Best Sellers Section */}
        {bestSellers.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-black flex items-center justify-center gap-2">
                <span className="text-2xl animate-pulse text-rose-gold">⭐</span>
                الأكثر مبيعاً
              </h2>
              <div className="w-16 h-0.5 bg-rose-gold/30 mx-auto mt-3 mb-4" />
              <p className="text-black/60 font-bold text-sm">المنتجات الأكثر طلباً من عملائنا</p>
            </div>
            <FixedGrid cols={4}>
              {bestSellers.map((product, idx) => (
                <motion.div
                  key={product.slug}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="relative"
                >
                  <BestSellerBadge />
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </FixedGrid>
          </motion.div>
        )}

        {/* Categories Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <span className="text-xs text-rose-gold tracking-[0.2em] uppercase font-bold mb-3 block">
              اكتشف
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-black">
              تصفح حسب القسم
            </h2>
            <div className="w-16 h-0.5 bg-rose-gold/30 mx-auto mt-3 mb-4" />
          </div>
          <FixedGrid cols={4}>
            {availableCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`group relative overflow-hidden rounded-2xl aspect-square transition-all duration-300 ${
                  selectedCategory === category.id 
                    ? 'ring-2 ring-rose-gold shadow-xl scale-[1.02]' 
                    : 'shadow-md hover:shadow-rose-gold/20'
                }`}
              >
                <div className="absolute inset-0">
                  <Image 
                      src={category.image} 
                      alt={category.name} 
                      fill 
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="eager"
                      priority
                    />
                </div>
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-300" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-white p-3">
                  <h3 className="text-sm md:text-base font-bold text-center drop-shadow-md">{category.name}</h3>
                  <p className="text-xs text-white/90 mt-1 drop-shadow-sm">{toArabicNumber(getCategoryCount(category.id))} منتج</p>
                </div>
              </button>
            ))}
          </FixedGrid>
        </div>

        {/* Filter Bar */}
        <div className="bg-rose-gold/5 rounded-2xl p-4 mb-8 border border-rose-gold/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="ابحث عن منتج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pr-10 border border-rose-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent text-sm bg-white text-black"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-rose-gold text-sm"
                >
                  ✕
                </button>
              )}
            </div>
            
            {/* Price Range */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-black/60">السعر:</span>
              <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-1.5 border border-rose-gold/20">
                <input 
                  type="number" 
                  value={priceRange[0]} 
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])} 
                  className="w-16 px-1 py-0.5 text-sm focus:outline-none text-black" 
                  placeholder={`من ${toArabicNumber(minPrice)}`} 
                />
                <span className="text-black/40">-</span>
                <input 
                  type="number" 
                  value={priceRange[1]} 
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} 
                  className="w-16 px-1 py-0.5 text-sm focus:outline-none text-black" 
                  placeholder={`إلى ${toArabicNumber(maxPrice)}`} 
                />
              </div>
            </div>
            
            {/* Sort */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-black/60">ترتيب حسب:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)} 
                className="px-4 py-2 border border-rose-gold/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold bg-white text-black cursor-pointer"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-8">
          <p className="text-black/60 text-sm font-bold">
            <span className="font-bold text-rose-gold">{toArabicNumber(filteredProducts.length)}</span> منتج
            {selectedCategory !== 'all' && <> في <span className="font-bold text-black">{allCategories.find(c => c.id === selectedCategory)?.name}</span></>}
            {searchQuery && <> مطابق لـ <span className="font-bold text-rose-gold">"{searchQuery}"</span></>}
          </p>
        </div>
        
        {/* Products Grid */}
        <AnimatePresence mode="wait">
          {displayedProducts.length > 0 ? (
            <AutoGrid>
              {displayedProducts.map((product, idx) => (
                <motion.div
                  key={product.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: (idx % 12) * 0.02 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AutoGrid>
          ) : (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-black mb-2">{searchQuery ? 'مفيش نتائج' : 'مفيش منتجات'}</h3>
              <p className="text-black/60 mb-4">{searchQuery ? `مفيش منتجات تطابق "${searchQuery}"` : 'مفيش منتجات في التصنيف ده حالياً'}</p>
              {(searchQuery || selectedCategory !== 'all') && (
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setPriceRange([minPrice, maxPrice]); }} 
                  className="px-6 py-2 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold rounded-full hover:scale-[1.02] transition"
                >
                  شوف كل المنتجات
                </button>
              )}
            </div>
          )}
        </AnimatePresence>

        {/* Load More Trigger */}
        {hasMore && <div ref={loadMoreRef} className="h-10" />}

        {/* Recommended Section */}
        {recommended.length > 0 && (
          <div className="mt-16 pt-8 border-t border-rose-gold/20">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-black">
                قد يعجبك كمان
              </h2>
              <div className="w-16 h-0.5 bg-rose-gold/30 mx-auto mt-3 mb-4" />
            </div>
            <FixedGrid cols={4}>
              {recommended.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </FixedGrid>
          </div>
        )}
      </div>
    </section>
  );
}