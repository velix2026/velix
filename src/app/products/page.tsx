'use client';

import { useState, useEffect } from 'react';
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";
import { Product } from '@/lib/products';
import Image from 'next/image';
import Link from 'next/link';

// تعريف التصنيفات - بدون ألوان وأيقونات
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const allProducts = await getProducts();
      setProducts(allProducts);
      
      // الأكثر مبيعاً (أول 4 منتجات)
      setBestSellers(allProducts.slice(0, 4));
      
      setLoading(false);
    };
    
    fetchProducts();
  }, []);

  // تحديث المنتجات عند تغيير التصنيف أو الترتيب
  useEffect(() => {
    let filtered = [...products];
    
    // تصفية حسب التصنيف
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    // ترتيب حسب الاختيار
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    }
    
    setFilteredProducts(filtered);
  }, [selectedCategory, sortBy, products]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">جاري التحميل...</div>
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
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* قسم التصنيفات - كروت بدون ألوان وأيقونات */}
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
                {/* صورة الخلفية فقط - بدون ظل ملون */}
                <div className="absolute inset-0">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                {/* المحتوى - اسم التصنيف وعدد المنتجات */}
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

        {/* شريط الفلترة والترتيب */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 pb-4 border-b border-gray-100">
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
          
          <p className="text-gray-500 text-sm">
            <span className="font-bold text-gray-900">{filteredProducts.length}</span> منتج
            {selectedCategory !== 'all' && (
              <> في <span className="font-bold text-gray-900">
                {categories.find(c => c.id === selectedCategory)?.name}
              </span></>
            )}
          </p>
        </div>
        
        {/* شبكة المنتجات */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد منتجات</h3>
            <p className="text-gray-500">لا توجد منتجات في هذا التصنيف حالياً</p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="mt-4 text-sm text-black underline hover:no-underline"
            >
              عرض جميع المنتجات
            </button>
          </div>
        )}
      </div>
    </section>
  );
}