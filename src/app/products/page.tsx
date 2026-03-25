'use client';

import { useState, useEffect, useRef } from 'react';
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";
import { Product } from '@/lib/products';
import Image from 'next/image';

// تعريف التصنيفات
const categories = [
  { id: 'all', name: 'الكل', image: '/images/all-categories.png' },
  { id: 'تيشرتات', name: 'تيشرتات', image: '/images/tshirt-category.png' },
  { id: 'هوديز', name: 'هوديز', image: '/images/hoodie-category.png' },
  { id: 'جاكيتات', name: 'جاكيتات', image: '/images/jacket-category.png' },
  { id: 'شروال', name: 'شروال', image: '/images/pants-category.png' },
];

// خيارات الترتيب
const sortOptions = [
  { value: 'newest', label: 'الأحدث' },
  { value: 'price-asc', label: 'السعر: من الأقل إلى الأعلى' },
  { value: 'price-desc', label: 'السعر: من الأعلى إلى الأقل' },
];

export default function ProductsPage() {
  // States
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(8);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // تحميل المنتجات والمفضلة
  useEffect(() => {
    const fetchProducts = async () => {
      const allProducts = await getProducts();
      setProducts(allProducts);
      setBestSellers(allProducts.slice(0, 4));
      
      // حساب أقل وأعلى سعر
      const prices = allProducts.map(p => p.price);
      setMinPrice(Math.min(...prices, 0));
      setMaxPrice(Math.max(...prices, 1000));
      setPriceRange([Math.min(...prices, 0), Math.max(...prices, 1000)]);
      
      setLoading(false);
    };
    fetchProducts();
    
    // تحميل المفضلة
    const savedWishlist = localStorage.getItem('favorites');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist).map((p: Product) => p.id.toString()));
    }
    
    // تحميل المنتجات التي تمت مشاهدتها مؤخراً
    const savedRecent = localStorage.getItem('recentlyViewed');
    if (savedRecent) {
      setRecentlyViewed(JSON.parse(savedRecent));
    }
  }, []);

  // Debounce search
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  // تحديث المنتجات عند تغيير الفلاتر
  useEffect(() => {
    let filtered = [...products];
    
    // تصفية حسب التصنيف
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    // تصفية حسب البحث
    if (debouncedQuery) {
      const query = debouncedQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }
    
    // تصفية حسب السعر
    filtered = filtered.filter(p => 
      p.price >= priceRange[0] && p.price <= priceRange[1]
    );
    
    // ترتيب حسب الاختيار
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    }
    
    setFilteredProducts(filtered);
    setVisibleCount(8);
  }, [selectedCategory, sortBy, debouncedQuery, priceRange, products]);

  // المنتجات الموصى بها (استثناء الأكثر مبيعاً)
  const recommended = products.filter(p => !bestSellers.some(b => b.id === p.id)).slice(0, 4);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  // إضافة منتج للمشاهدة مؤخراً
  const addToRecentlyViewed = (product: Product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, 5);
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      return updated;
    });
  };

  if (loading) {
    return (
      <div className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Skeleton Loading */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-xl"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* عنوان القسم */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-xs text-gray-400 tracking-[0.2em] uppercase mb-3 block">
            مجموعتنا
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            جميع المنتجات
          </h1>
          <div className="w-16 h-0.5 bg-gray-300 mx-auto mt-4 mb-6"></div>
          <p className="text-gray-500 text-base max-w-2xl mx-auto">
            اكتشف مجموعتنا الكاملة. تفاصيل دقيقة وجودة عالية في كل قطعة.
          </p>
        </div>

        {/* قسم الأكثر مبيعاً */}
        {bestSellers.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  الأكثر مبيعاً
                </h2>
                <p className="text-gray-500 text-sm mt-1">أكثر القطع طلباً من عملائنا</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {bestSellers.map((product) => (
                <div key={product.id} onClick={() => addToRecentlyViewed(product)}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sticky Filter Bar */}
        <div className="sticky top-16 md:top-20 z-40 bg-white py-4 border-b border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* شريط البحث */}
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
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
            
            {/* Price Filter */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">السعر:</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-20 px-2 py-1 border border-gray-200 rounded text-sm"
                  placeholder="من"
                />
                <span>-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-20 px-2 py-1 border border-gray-200 rounded text-sm"
                  placeholder="إلى"
                />
              </div>
            </div>
            
            {/* الترتيب */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">ترتيب حسب:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* قسم التصنيفات */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center md:text-right">
            تصفح حسب القسم
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`group relative overflow-hidden rounded-2xl aspect-square transition-all duration-300 ${
                  selectedCategory === category.id 
                    ? 'ring-2 ring-black shadow-lg scale-[1.02]' 
                    : 'hover:scale-[1.02]'
                }`}
              >
                <div className="absolute inset-0">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-300" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-white p-3">
                  <h3 className="text-sm md:text-base font-bold text-center drop-shadow-md">
                    {category.name}
                  </h3>
                  {category.id !== 'all' && (
                    <p className="text-xs text-white/90 mt-1 drop-shadow-sm">
                      {products.filter(p => p.category === category.id).length} منتج
                    </p>
                  )}
                  {category.id === 'all' && (
                    <p className="text-xs text-white/90 mt-1 drop-shadow-sm">
                      {products.length} منتج
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* عرض عدد المنتجات */}
        <div className="text-center mb-8">
          <p className="text-gray-500 text-sm">
            <span className="font-bold text-gray-900">{filteredProducts.length}</span> منتج
            {selectedCategory !== 'all' && (
              <> في <span className="font-bold text-gray-900">
                {categories.find(c => c.id === selectedCategory)?.name}
              </span></>
            )}
            {searchQuery && (
              <> مطابق لـ <span className="font-bold text-gray-900">"{searchQuery}"</span></>
            )}
          </p>
        </div>
        
        {/* شبكة المنتجات */}
        {displayedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {displayedProducts.map((product) => (
                <div key={product.id} onClick={() => addToRecentlyViewed(product)}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            
            {/* زر تحميل المزيد */}
            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setVisibleCount(prev => prev + 8)}
                  className="px-8 py-3 border border-gray-300 rounded-full text-sm font-medium hover:bg-black hover:text-white hover:border-black transition-all duration-300"
                >
                  تحميل المزيد ({filteredProducts.length - visibleCount} منتج متبقي)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {searchQuery ? 'لا توجد نتائج' : 'لا توجد منتجات'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery 
                ? `لا توجد منتجات تطابق "${searchQuery}"` 
                : 'لا توجد منتجات في هذا التصنيف حالياً'}
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setPriceRange([minPrice, maxPrice]);
                }}
                className="text-sm text-black underline hover:no-underline"
              >
                عرض جميع المنتجات
              </button>
            )}
          </div>
        )}

        {/* Recommended Section */}
        {recommended.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center md:text-right">
              قد يعجبك أيضاً
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {recommended.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed Section */}
        {recentlyViewed.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center md:text-right">
              سبق وشاهدتها
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {recentlyViewed.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setQuickViewProduct(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-square mb-4 rounded-xl overflow-hidden">
              <Image
                src={quickViewProduct.mainImage}
                alt={quickViewProduct.name}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-bold mb-2">{quickViewProduct.name}</h3>
            <p className="text-gray-500 text-sm mb-2">{quickViewProduct.category}</p>
            <p className="text-gray-600 text-sm mb-4">{quickViewProduct.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-black">{quickViewProduct.price} جنيه</span>
              <button
                onClick={() => setQuickViewProduct(null)}
                className="px-4 py-2 bg-black text-white rounded-full text-sm hover:bg-gray-800"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}