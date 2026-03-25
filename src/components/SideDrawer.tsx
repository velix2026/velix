'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/products';

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
  items,
  onRemove,
  onUpdateQuantity,
  onAddToCart,
}: SideDrawerProps) {
  const title = type === 'favorites' ? 'المفضلة' : 'سلة التسوق';
  const emptyMessage = type === 'favorites' 
    ? 'لم تقم بإضافة أي منتجات إلى المفضلة بعد'
    : 'سلة التسوق فارغة';

  // حساب الإجمالي للسلة
  const calculateTotal = () => {
    if (type === 'cart') {
      const cartItems = items as CartItem[];
      return cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    }
    return 0;
  };

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

  if (!isOpen) return null;

  return (
    <>
      {/* الخلفية الداكنة */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* النافذة المنبثقة */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* الرأس */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
            aria-label="إغلاق"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* المحتوى */}
        <div className="flex-1 overflow-y-auto p-4" style={{ height: type === 'cart' && items.length > 0 ? 'calc(100% - 140px)' : 'calc(100% - 73px)' }}>
          {items.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">{type === 'favorites' ? '❤️' : '🛒'}</div>
              <p className="text-gray-500">{emptyMessage}</p>
              <button
                onClick={onClose}
                className="mt-4 text-sm text-black underline hover:no-underline"
              >
                مواصلة التسوق
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 border-b border-gray-100 pb-4">
                  {/* صورة المنتج */}
                  <Link
                    href={`/product/${item.id}`}
                    onClick={onClose}
                    className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0"
                  >
                    <Image
                      src={item.mainImage}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </Link>
                  
                  {/* معلومات المنتج */}
                  <div className="flex-1">
                    <Link
                      href={`/product/${item.id}`}
                      onClick={onClose}
                      className="font-bold hover:text-gray-600 transition line-clamp-1 text-sm"
                    >
                      {item.name}
                    </Link>
                    <p className="text-gray-500 text-xs mb-1">{item.category}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-bold text-sm">
                        {(item as CartItem).quantity 
                          ? (item.price * (item as CartItem).quantity).toFixed(0) 
                          : item.price} جنيه
                      </span>
                      
                      {/* أزرار التحكم حسب النوع */}
                      {type === 'cart' && onUpdateQuantity && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onUpdateQuantity(item.id, (item as CartItem).quantity - 1)}
                            className="w-6 h-6 rounded-full border border-gray-300 hover:bg-gray-100 text-sm"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-sm">{(item as CartItem).quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, (item as CartItem).quantity + 1)}
                            className="w-6 h-6 rounded-full border border-gray-300 hover:bg-gray-100 text-sm"
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
                          className="text-red-500 hover:text-red-700 transition"
                          aria-label="حذف"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
        {type === 'cart' && items.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex justify-between font-bold mb-3">
              <span>الإجمالي</span>
              <span>{calculateTotal()} جنيه</span>
            </div>
            <button
              onClick={() => {
                alert('جاري التوجيه لصفحة الدفع...');
                onClose();
              }}
              className="w-full bg-black text-white py-2 rounded-full hover:bg-gray-800 transition font-medium"
            >
              إتمام الطلب
            </button>
          </div>
        )}
      </div>
    </>
  );
}