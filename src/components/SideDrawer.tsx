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
          {items.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">{type === 'favorites' ? '❤️' : '🛒'}</div>
              <p className="text-gray-500 text-sm">{emptyMessage}</p>
              <button
                onClick={onClose}
                className="mt-4 text-xs text-black underline hover:no-underline"
              >
                مواصلة التسوق
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 border-b border-gray-100 pb-3">
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
                            onClick={() => onUpdateQuantity(item.id, (item as CartItem).quantity - 1)}
                            className="w-6 h-6 rounded-full border border-gray-200 hover:bg-gray-100 text-sm flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="w-5 text-center text-xs">{(item as CartItem).quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, (item as CartItem).quantity + 1)}
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
                          إضافة
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
        {type === 'cart' && items.length > 0 && (
          <div className="border-t border-gray-100 p-4 bg-gray-50 rounded-b-2xl">
            <div className="flex justify-between font-semibold text-sm mb-3">
              <span className="text-gray-600">الإجمالي</span>
              <span className="text-gray-900">{calculateTotal()} جنيه</span>
            </div>
            <button
              onClick={() => {
                alert('جاري التوجيه لصفحة الدفع...');
                onClose();
              }}
              className="w-full bg-black text-white py-2.5 rounded-full hover:bg-gray-800 transition text-sm font-medium"
            >
              إتمام الطلب
            </button>
            <button
              onClick={onClose}
              className="w-full text-center text-xs text-gray-400 mt-2 hover:text-gray-500 transition"
            >
              مواصلة التسوق
            </button>
          </div>
        )}
      </div>
    </>
  );
}