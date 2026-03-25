'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/products';
import OrderModal from '@/components/OrderModal';
import { ProductCardSkeleton } from '@/components/Skeleton';

export const dynamic = 'force-dynamic';

interface CartItem extends Product {
  quantity: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderData, setOrderData] = useState<{
    id: number;
    name: string;
    price: number;
    mainImage: string;
    quantity: number;
    products?: CartItem[];
  } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      const items = JSON.parse(saved);
      const cartWithQuantity = items.map((item: Product & { quantity?: number }) => ({ 
        ...item, 
        quantity: item.quantity || 1 
      }));
      setCart(cartWithQuantity);
    }
    setLoading(false);
  }, []);

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const newCart = cart.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(newCart);
    const toSave = newCart.map(({ quantity, ...rest }) => rest);
    localStorage.setItem('cart', JSON.stringify(toSave));
    
    const totalQuantity = newCart.reduce((sum, item) => sum + item.quantity, 0);
    const event = new CustomEvent('cartUpdated', { detail: totalQuantity });
    window.dispatchEvent(event);
  };

  const removeFromCart = (productId: number) => {
    const newCart = cart.filter(item => item.id !== productId);
    setCart(newCart);
    const toSave = newCart.map(({ quantity, ...rest }) => rest);
    localStorage.setItem('cart', JSON.stringify(toSave));
    
    const totalQuantity = newCart.reduce((sum, item) => sum + item.quantity, 0);
    const event = new CustomEvent('cartUpdated', { detail: totalQuantity });
    window.dispatchEvent(event);
  };

  const handleOrderSubmit = (orderData: any) => {
    console.log('Order submitted:', orderData);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : 50;
  const total = subtotal + shipping;

  // فتح نافذة الطلب مع جميع المنتجات
  const openOrderModal = () => {
    if (cart.length === 0) return;
    
    // تحضير بيانات الطلب
    setOrderData({
      id: 0,
      name: `طلب متعدد (${cart.length} منتج)`,
      price: total,
      mainImage: cart[0]?.mainImage || '',
      quantity: 1,
      products: cart,
    });
    setIsOrderModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">سلة التسوق</h1>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-md p-4 flex gap-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-6 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 h-fit">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
            سلة التسوق
          </h1>
          <p className="text-center text-gray-600 mb-12">
            مراجعة المنتجات قبل إتمام الطلب
          </p>

          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-bold mb-2">سلة التسوق فارغة</h2>
              <p className="text-gray-500 mb-6">لم تقم بإضافة أي منتجات إلى السلة بعد</p>
              <Link
                href="/products"
                className="inline-block bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
              >
                استكشف المنتجات
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* قائمة المنتجات */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-md p-4 flex gap-4">
                    {/* صورة المنتج */}
                    <Link href={`/product/${item.id}`} className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={item.mainImage}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </Link>
                    
                    {/* معلومات المنتج */}
                    <div className="flex-1">
                      <Link href={`/product/${item.id}`}>
                        <h3 className="font-bold hover:text-gray-600 transition line-clamp-1">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-gray-500 text-sm mb-2">{item.category}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 transition"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 transition"
                          >
                            +
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold">{item.price * item.quantity} جنيه</span>
                          <button
                            onClick={() => {
                              // فتح نافذة الطلب لمنتج واحد
                              setIsOrderModalOpen(true);
                              setOrderData({
                                id: item.id,
                                name: item.name,
                                price: item.price,
                                mainImage: item.mainImage,
                                quantity: item.quantity,
                              });
                            }}
                            className="bg-black text-white px-3 py-1 rounded-full text-sm hover:bg-gray-800 transition"
                          >
                            طلب
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 transition"
                            aria-label="حذف"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ملخص الطلب */}
              <div className="bg-white rounded-xl shadow-md p-6 h-fit sticky top-24">
                <h2 className="text-xl font-bold mb-4">ملخص الطلب</h2>
                <div className="space-y-2 border-b pb-4">
                  <div className="flex justify-between">
                    <span>المجموع الفرعي</span>
                    <span>{subtotal} جنيه</span>
                  </div>
                  <div className="flex justify-between">
                    <span>الشحن</span>
                    <span>{shipping === 0 ? 'مجاني' : `${shipping} جنيه`}</span>
                  </div>
                  {subtotal > 0 && subtotal < 1000 && (
                    <p className="text-xs text-gray-500">أضف {1000 - subtotal} جنيه للحصول على شحن مجاني</p>
                  )}
                </div>
                <div className="flex justify-between font-bold text-lg py-4">
                  <span>الإجمالي</span>
                  <span>{total} جنيه</span>
                </div>
                <button
                  onClick={openOrderModal}
                  className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition font-medium"
                >
                  إتمام الطلب
                </button>
                <Link
                  href="/products"
                  className="block text-center text-sm text-gray-500 mt-4 hover:text-black transition"
                >
                  ← مواصلة التسوق
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Modal */}
      {isOrderModalOpen && orderData && (
        <OrderModal
          isOpen={isOrderModalOpen}
          onClose={() => {
            setIsOrderModalOpen(false);
            setOrderData(null);
          }}
          product={{
            id: orderData.id,
            name: orderData.name,
            price: orderData.price,
            mainImage: orderData.mainImage,
            quantity: orderData.quantity,
          }}
          onSubmit={(order) => {
            console.log('Order submitted:', order);
            setIsOrderModalOpen(false);
            setOrderData(null);
          }}
        />
      )}
    </>
  );
}