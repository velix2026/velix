'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";
import { Product } from '@/lib/products';
import Image from 'next/image';
import { create } from 'zustand';
import { ProductGridSkeleton } from '@/components/Skeleton';

export const dynamic = 'force-dynamic';

// ==================== Zustand Store (Global State) ====================
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

// ==================== AutoGrid Component ====================
const AutoGrid = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3 md:gap-4 ${className}`}>
    {children}
  </div>
);

// ==================== FixedGrid Component ====================
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

// ==================== Best Seller Badge ====================
const BestSellerBadge = () => (
  <div className="absolute -top-2 -right-2 z-20">
    <div className="relative">
      <div className="absolute inset-0 bg-yellow-400 rounded-full blur-md animate-pulse" />
      <div className="relative bg-linear-to-r from-yellow-500 to-yellow-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
        <span>⭐</span> الأكثر مبيعاً
      </div>
    </div>
  </div>
);

// تعريف التصنيفات
const categories = [
  { id: 'all', name: 'الكل', image: '/images/all-categories.png', count: 0 },
  { id: 'تيشرتات', name: 'تيشرتات', image: '/images/tshirt-category.png', count: 0 },
  { id: 'هوديز', name: 'هوديز', image: '/images/hoodie-category.png', count: 0 },
  { id: 'شروال', name: 'شروال', image: '/images/pants-category.png', count: 0 },
];

const sortOptions = [
  { value: 'newest', label: 'الأحدث' },
  { value: 'price-asc', label: 'السعر: من الأقل إلى الأعلى' },
  { value: 'price-desc', label: 'السعر: من الأعلى إلى الأقل' },
  { value: 'popular', label: 'الأكثر طلباً' }
];

// دالة للخلط العشوائي (Fisher-Yates)
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
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
  
  const { favorites, cart, loadFromStorage } = useStore();
  const { ref: loadMoreRef, inView } = useInView();

  // تحميل المنتجات
  useEffect(() => {
    const fetchProducts = async () => {
      const allProducts = await getProducts();
      setProducts(allProducts);
      
      // الأكثر مبيعاً: حسب salesCount (المنتجات اللي عليها مبيعات فقط)
      const sortedBySales = [...allProducts]
        .filter(p => (p.salesCount || 0) > 0)
        .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
        .slice(0, 4);
      setBestSellers(sortedBySales);
      
      const prices = allProducts.map(p => p.price);
      setMinPrice(Math.min(...prices, 0));
      setMaxPrice(Math.max(...prices, 1000));
      setPriceRange([Math.min(...prices, 0), Math.max(...prices, 1000)]);
      
      setLoading(false);
    };
    fetchProducts();
    loadFromStorage();
  }, [loadFromStorage]);

  // المنتجات الموصى بها (عشوائية مع استبعاد الأكثر مبيعاً)
  const recommended = useMemo(() => {
    // استبعاد الأكثر مبيعاً
    const candidates = products.filter(p => !bestSellers.some(b => b.id === p.id));
    // خلط عشوائي
    const shuffled = shuffleArray(candidates);
    // أخذ أول 4
    return shuffled.slice(0, 4);
  }, [products, bestSellers]);

  // Debounce search
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); };
  }, [searchQuery]);

  // تحديث المنتجات
  useEffect(() => {
    let filtered = [...products];
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    if (debouncedQuery) {
      const query = debouncedQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }
    
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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

  // تحديث عدد المنتجات في التصنيفات
  categories.forEach(cat => {
    if (cat.id === 'all') cat.count = products.length;
    else cat.count = products.filter(p => p.category === cat.id).length;
  });

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  // Auto load more when scrolling
  useEffect(() => {
    if (inView && hasMore && !loading) {
      setVisibleCount(prev => prev + 12);
    }
  }, [inView, hasMore, loading]);

  if (loading) {
    return (
      <div className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <ProductGridSkeleton count={12} />
        </div>
      </div>
    );
  }

  return (
    <section className="bg-white py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Hero Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="text-xs text-gray-400 tracking-[0.2em] uppercase mb-3 block">
            مجموعتنا
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            جميع المنتجات
          </h1>
          <div className="w-16 h-0.5 bg-gray-300 mx-auto mt-4 mb-6" />
          <p className="text-gray-500 text-base max-w-2xl mx-auto">
            اكتشف مجموعتنا الكاملة. تفاصيل دقيقة وجودة عالية في كل قطعة.
          </p>
        </motion.div>

        {/* Best Sellers Section - يظهر بس لو في منتجات اتباعت */}
        {bestSellers.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-16"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-2xl animate-pulse">⭐</span>
                  الأكثر مبيعاً
                </h2>
                <p className="text-gray-500 text-sm mt-1">المنتجات الأكثر طلباً من عملائنا</p>
              </div>
            </div>
            <FixedGrid cols={4}>
              {bestSellers.map((product, idx) => (
                <motion.div
                  key={product.id}
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

        {/* Filter Bar */}
        <div className="bg-white py-4 border-b border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="ابحث عن منتج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black text-sm"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">السعر:</span>
              <div className="flex items-center gap-2">
                <input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])} className="w-20 px-2 py-1 border border-gray-200 rounded text-sm" placeholder="من" />
                <span>-</span>
                <input type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} className="w-20 px-2 py-1 border border-gray-200 rounded text-sm" placeholder="إلى" />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">ترتيب حسب:</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black">
                {sortOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Categories Grid - Fixed */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center md:text-right">تصفح حسب القسم</h2>
          <FixedGrid cols={4}>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`group relative overflow-hidden rounded-2xl aspect-square transition-all duration-300 ${selectedCategory === category.id ? 'ring-2 ring-black shadow-lg scale-[1.02]' : 'hover:scale-[1.02]'}`}
              >
                <div className="absolute inset-0">
                  <Image src={category.image} alt={category.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-300" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-white p-3">
                  <h3 className="text-sm md:text-base font-bold text-center drop-shadow-md">{category.name}</h3>
                  <p className="text-xs text-white/90 mt-1 drop-shadow-sm">{category.count} منتج</p>
                </div>
              </button>
            ))}
          </FixedGrid>
        </div>

        {/* Results Count */}
        <div className="text-center mb-8">
          <p className="text-gray-500 text-sm">
            <span className="font-bold text-gray-900">{filteredProducts.length}</span> منتج
            {selectedCategory !== 'all' && <> في <span className="font-bold text-gray-900">{categories.find(c => c.id === selectedCategory)?.name}</span></>}
            {searchQuery && <> مطابق لـ <span className="font-bold text-gray-900">"{searchQuery}"</span></>}
          </p>
        </div>
        
        {/* Products Grid - Auto (Responsive) */}
        <AnimatePresence mode="wait">
          {displayedProducts.length > 0 ? (
            <AutoGrid>
              {displayedProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">{searchQuery ? 'لا توجد نتائج' : 'لا توجد منتجات'}</h3>
              <p className="text-gray-500 mb-4">{searchQuery ? `لا توجد منتجات تطابق "${searchQuery}"` : 'لا توجد منتجات في هذا التصنيف حالياً'}</p>
              {(searchQuery || selectedCategory !== 'all') && (
                <button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setPriceRange([minPrice, maxPrice]); }} className="text-sm text-black underline hover:no-underline">عرض جميع المنتجات</button>
              )}
            </div>
          )}
        </AnimatePresence>

        {/* Load More Trigger (Infinite Scroll) */}
        {hasMore && <div ref={loadMoreRef} className="h-10" />}

        {/* Recommended Section - عشوائي مع استبعاد الأكثر مبيعاً */}
        {recommended.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center md:text-right">
              قد يعجبك أيضاً
            </h2>
            <FixedGrid cols={4}>
              {recommended.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </FixedGrid>
          </div>
        )}
      </div>
    </section>
  );
}