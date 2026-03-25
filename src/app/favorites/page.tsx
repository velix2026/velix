'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/products';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const removeFromFavorites = (productId: number) => {
    const newFavorites = favorites.filter(p => p.id !== productId);
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    
    // تحديث العداد في الهيدر
    const event = new CustomEvent('favoritesUpdated', { detail: newFavorites.length });
    window.dispatchEvent(event);
  };

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((item: Product) => item.id === product.id);
    
    if (!existing) {
      cart.push(product);
      localStorage.setItem('cart', JSON.stringify(cart));
      const event = new CustomEvent('cartUpdated', { detail: cart.length });
      window.dispatchEvent(event);
      alert('تم إضافة المنتج إلى السلة');
    } else {
      alert('المنتج موجود بالفعل في السلة');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
          المفضلة
        </h1>
        <p className="text-center text-gray-600 mb-12">
          المنتجات التي أضفتها إلى قائمة المفضلة
        </p>

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">❤️</div>
            <h2 className="text-2xl font-bold mb-2">قائمة المفضلة فارغة</h2>
            <p className="text-gray-500 mb-6">لم تقم بإضافة أي منتجات إلى المفضلة بعد</p>
            <Link
              href="/products"
              className="inline-block bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
            >
              استكشف المنتجات
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden">
                {/* صورة المنتج */}
                <Link href={`/product/${product.id}`} className="block relative aspect-square bg-gray-100">
                  <Image
                    src={product.mainImage}
                    alt={product.name}
                    fill
                    className="object-cover hover:scale-105 transition duration-500"
                  />
                </Link>
                
                {/* معلومات المنتج */}
                <div className="p-4">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-bold text-lg mb-1 hover:text-gray-600 transition line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-gray-500 text-sm mb-2">{product.category}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xl font-bold text-black">{product.price} جنيه</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => addToCart(product)}
                        className="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition"
                        aria-label="إضافة إلى السلة"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => removeFromFavorites(product.id)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                        aria-label="حذف من المفضلة"
                      >
                        <svg className="w-5 h-5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}