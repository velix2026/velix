'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/products';
import OrderModal from './OrderModal';

interface CartItem extends Product {
  quantity: number;
}

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'favorites' | 'cart';
  items: Product[] | CartItem[];
  onRemove?: (id: number) => void;
  onUpdateQuantity?: (id: number, quantity: number) => void;
  onAddToCart?: (product: Product) => void;
}

export default function SideDrawer({
  isOpen,
  onClose,
  type,
  items: initialItems,
  onRemove,
  onUpdateQuantity,
  onAddToCart,
}: SideDrawerProps) {
  const title = type === 'favorites' ? 'المفضلة' : 'سلة التسوق';
  const emptyMessage = type === 'favorites' 
    ? 'لم تقم بإضافة أي منتجات إلى المفضلة بعد'
    : 'سلة التسوق فارغة';
  
  const [localItems, setLocalItems] = useState<(Product | CartItem)[]>(initialItems);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderCartItems, setOrderCartItems] = useState<CartItem[]>([]);

  // حساب الإجمالي
  useEffect(() => {
    if (type === 'cart') {
      const cartItems = localItems as CartItem[];
      const sum = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
      setTotal(sum);
    }
  }, [localItems, type]);

  // دالة تحميل البيانات من localStorage (مع تأخير لمنع خطأ React)
  const loadFromStorage = () => {
    if (isLoading) return;
    setIsLoading(true);
    
    setTimeout(() => {
      if (type === 'cart') {
        const saved = localStorage.getItem('cart');
        if (saved) {
          const cartItems = JSON.parse(saved);
          const cartWithQuantity = cartItems.map((item: Product & { quantity?: number }) => ({ 
            ...item, 
            quantity: item.quantity || 1 
          }));
          setLocalItems(cartWithQuantity);
        } else {
          setLocalItems([]);
        }
      } else {
        const saved = localStorage.getItem('favorites');
        if (saved) {
          setLocalItems(JSON.parse(saved));
        } else {
          setLocalItems([]);
        }
      }
      setIsLoading(false);
    }, 0);
  };

  // تحميل البيانات عند فتح النافذة
  useEffect(() => {
    if (isOpen) {
      loadFromStorage();
    }
  }, [isOpen]);

  // الاستماع لتحديثات السلة والمفضلة
  useEffect(() => {
    const handleUpdate = () => {
      setTimeout(() => {
        if (type === 'cart') {
          const saved = localStorage.getItem('cart');
          if (saved) {
            const cartItems = JSON.parse(saved);
            const cartWithQuantity = cartItems.map((item: Product & { quantity?: number }) => ({ 
              ...item, 
              quantity: item.quantity || 1 
            }));
            setLocalItems(cartWithQuantity);
          } else {
            setLocalItems([]);
          }
        } else {
          const saved = localStorage.getItem('favorites');
          if (saved) {
            setLocalItems(JSON.parse(saved));
          } else {
            setLocalItems([]);
          }
        }
      }, 0);
    };
    
    window.addEventListener('cartUpdated', handleUpdate);
    window.addEventListener('favoritesUpdated', handleUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleUpdate);
      window.removeEventListener('favoritesUpdated', handleUpdate);
    };
  }, [type]);

  // منع التمرير عند فتح النافذة
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // دالة تحديث الكمية المحلية
  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    if (onUpdateQuantity) {
      onUpdateQuantity(id, newQuantity);
    }
    setLocalItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // فتح نافذة الطلب
  const openOrderModal = () => {
    const cartItems = localItems as CartItem[];
    setOrderCartItems(cartItems);
    setIsOrderModalOpen(true);
  };

  const handleOrderSubmit = (orderData: any) => {
    console.log('Order submitted:', orderData);
    setIsOrderModalOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* الخلفية الداكنة */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* النافذة المنبثقة في المنتصف */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl z-50 transform transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* الرأس */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition"
            aria-label="إغلاق"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* المحتوى */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {localItems.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">{type === 'favorites' ? '❤️' : '🛒'}</div>
              <p className="text-gray-500 text-sm">{emptyMessage}</p>
              <button
                onClick={() => {
                  onClose();
                  window.location.href = '/products';
                }}
                className="mt-4 text-xs text-black underline hover:no-underline"
              >
                مواصلة التسوق
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {localItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex gap-3 border-b border-gray-100 pb-3"
                >
                  {/* صورة المنتج */}
                  <Link
                    href={`/product/${item.id}`}
                    onClick={onClose}
                    className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0"
                  >
                    <Image
                      src={item.mainImage}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </Link>
                  
                  {/* معلومات المنتج */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.id}`}
                      onClick={onClose}
                      className="font-medium text-sm hover:text-gray-600 transition line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-gray-500 text-xs mb-1">{item.category}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-bold text-sm text-gray-900">
                        {(item as CartItem).quantity 
                          ? (item.price * (item as CartItem).quantity).toFixed(0) 
                          : item.price} جنيه
                      </span>
                      
                      {/* أزرار التحكم حسب النوع */}
                      {type === 'cart' && onUpdateQuantity && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              const newQuantity = (item as CartItem).quantity - 1;
                              if (newQuantity >= 1) {
                                handleUpdateQuantity(item.id, newQuantity);
                              }
                            }}
                            className="w-6 h-6 rounded-full border border-gray-200 hover:bg-gray-100 text-sm flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="w-5 text-center text-xs">{(item as CartItem).quantity}</span>
                          <button
                            onClick={() => {
                              const newQuantity = (item as CartItem).quantity + 1;
                              handleUpdateQuantity(item.id, newQuantity);
                            }}
                            className="w-6 h-6 rounded-full border border-gray-200 hover:bg-gray-100 text-sm flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      )}
                      
                      {type === 'favorites' && onAddToCart && (
                        <button
                          onClick={() => onAddToCart(item)}
                          className="text-xs bg-black text-white px-2 py-1 rounded-full hover:bg-gray-800 transition"
                        >
                          إضافة للسلة
                        </button>
                      )}
                      
                      {onRemove && (
                        <button
                          onClick={() => onRemove(item.id)}
                          className="text-red-400 hover:text-red-600 transition"
                          aria-label="حذف"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* أسفل النافذة (للسلة فقط) */}
        {type === 'cart' && localItems.length > 0 && (
          <div className="border-t border-gray-100 p-4 bg-gray-50 rounded-b-2xl">
            <div className="flex justify-between font-semibold text-sm mb-3">
              <span className="text-gray-600">الإجمالي</span>
              <span className="text-gray-900">{total} جنيه</span>
            </div>
            <button
              onClick={openOrderModal}
              className="w-full bg-black text-white py-2.5 rounded-full hover:bg-gray-800 transition text-sm font-medium"
            >
              إتمام الطلب
            </button>
            <button
              onClick={() => {
                onClose();
                window.location.href = '/products';
              }}
              className="w-full text-center text-xs text-gray-400 mt-2 hover:text-gray-500 transition"
            >
              مواصلة التسوق
            </button>
          </div>
        )}
      </div>

      {/* Order Modal */}
      {isOrderModalOpen && orderCartItems.length > 0 && (
        <OrderModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          product={{
            id: 0,
            name: `طلب متعدد (${orderCartItems.length} منتج)`,
            price: total,
            mainImage: orderCartItems[0]?.mainImage || '',
            quantity: 1,
          }}
          onSubmit={handleOrderSubmit}
        />
      )}
    </>
  );
}