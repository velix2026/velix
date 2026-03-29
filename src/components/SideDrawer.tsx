// components/SideDrawer.tsx
'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/products';
import { useCart, CartItem } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import OrderModal from './OrderModal';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'favorites' | 'cart';
}

const isCartItem = (item: Product | CartItem): item is CartItem => {
  return (item as CartItem).cartItemId !== undefined;
};

export default function SideDrawer({ isOpen, onClose, type }: SideDrawerProps) {
  const title = type === 'favorites' ? 'المفضلة' : 'سلة التسوق';
  const emptyMessage = type === 'favorites' 
    ? 'لم تقم بإضافة أي منتجات إلى المفضلة بعد'
    : 'سلة التسوق فارغة';
  
  const { cart, removeFromCart, updateCartQuantity, clearCart } = useCart();
  const { favorites, removeFromFavorites } = useFavorites();
  
  const items = type === 'cart' ? cart : favorites;
  const [total, setTotal] = useState(0);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (type === 'cart') {
      const sum = cart.reduce((sum, item) => {
        const price = item.oldPrice && item.oldPrice > item.price ? item.price : item.price;
        return sum + price * (item.quantity || 1);
      }, 0);
      setTotal(sum);
    }
  }, [cart, type]);

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { 
      document.body.style.overflow = ''; 
    };
  }, [isOpen]);

  const handleUpdateQuantity = useCallback((cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateCartQuantity(cartItemId, newQuantity);
  }, [updateCartQuantity]);

  const handleRemove = useCallback((item: Product | CartItem) => {
    if (type === 'cart' && isCartItem(item)) {
      removeFromCart(item.cartItemId, item.name);
    } else {
      removeFromFavorites(item.id, item.name);
    }
  }, [type, removeFromCart, removeFromFavorites]);

  const openOrderModal = useCallback(() => {
    if (cart.length === 0) return;
    
    const orderData = {
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        oldPrice: item.oldPrice,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        mainImage: item.mainImage,
      })),
      totalAmount: total,
      totalItems: cart.reduce((sum, item) => sum + item.quantity, 0),
    };
    
    localStorage.setItem('tempOrderData', JSON.stringify(orderData));
    setIsOrderModalOpen(true);
  }, [cart, total]);

  const handleOrderSubmit = useCallback(async (orderData: any) => {
    try {
      console.log('Order submitted:', orderData);
      clearCart();
      localStorage.removeItem('tempOrderData');
      setIsOrderModalOpen(false);
      onClose();
      
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: {
          message: '🛒 تم تفريغ سلة التسوق بنجاح! شكراً لتسوقك مع VELIX',
          type: 'success'
        }
      }));
    } catch (error) {
      console.error('Order submission error:', error);
    }
  }, [clearCart, onClose]);

  const getItemKey = (item: Product | CartItem): string => {
    if (type === 'cart' && isCartItem(item)) {
      return item.cartItemId;
    }
    return `fav-${item.id}`;
  };

  const getColorName = (colorCode: string): string => {
    const colorMap: Record<string, string> = {
      '#000000': 'أسود',
      '#FFFFFF': 'أبيض',
      '#808080': 'رمادي',
      '#FF0000': 'أحمر',
      '#0000FF': 'أزرق',
      '#008000': 'أخضر',
      '#FFFF00': 'أصفر',
      '#FFC0CB': 'وردي',
      '#A52A2A': 'بني',
      '#800080': 'بنفسجي',
    };
    return colorMap[colorCode] || colorCode;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* ✅ خلفية داكنة مع blur */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-all duration-300" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* ✅ الدروير - من 80% في الموبايل و 400px في الديسكتوب */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`fixed top-0 left-0 h-full bg-white shadow-2xl z-50 transform transition-all duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } w-full sm:w-112.5 md:w-125 lg:w-137.5ax-w-[85vw]`}
      >
        {/* ✅ Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <h2 className="text-lg font-bold text-black">{title}</h2>
          <button 
            ref={closeButtonRef}
            onClick={onClose} 
            className="p-2 rounded-full transition-all duration-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
            aria-label="إغلاق"
          >
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ✅ Content */}
        <div 
          ref={contentRef}
          className="flex-1 overflow-y-auto overflow-x-hidden p-4"
          style={{ 
            height: type === 'cart' && items.length > 0 ? 'calc(100% - 73px - 140px)' : 'calc(100% - 73px)',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-100 text-center">
              <div className="text-6xl mb-4 opacity-50">{type === 'favorites' ? '❤️' : '🛒'}</div>
              <p className="text-black font-bold text-sm opacity-70">{emptyMessage}</p>
              <button 
                onClick={() => { 
                  onClose(); 
                  window.location.href = '/products'; 
                }} 
                className="mt-4 text-sm text-black font-bold underline-offset-4 hover:underline transition"
              >
                مواصلة التسوق
              </button>
            </div>
          ) : (
            <div className="space-y-4 pb-4">
              {items.map((item) => (
                <div key={getItemKey(item)} className="flex gap-3 bg-gray-50 rounded-xl p-3 hover:shadow-md transition-all duration-300">
                  <Link 
                    href={`/products/${item.id}`} 
                    onClick={onClose} 
                    className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    <Image 
                      src={item.mainImage} 
                      alt={item.name} 
                      fill 
                      sizes="80px"
                      className="object-cover"
                    />
                  </Link>
                  
                  <div className="flex-1 min-w-0">
                    <Link 
                      href={`/products/${item.id}`} 
                      onClick={onClose} 
                      className="font-bold text-sm text-black hover:text-gray-600 transition line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <p className="text-black font-bold text-xs mb-2 opacity-70">{item.category}</p>
                    
                    {type === 'cart' && (item as any).selectedSize && (
                      <div className="inline-flex items-center gap-1 text-xs font-bold mb-2 ml-2">
                        <span className="bg-gray-200 px-2 py-0.5 rounded text-[10px] text-black">
                          مقاس: {(item as any).selectedSize}
                        </span>
                      </div>
                    )}
                    {type === 'cart' && (item as any).selectedColor && (
                      <div className="inline-flex items-center gap-1 text-xs font-bold mb-2">
                        <span className="bg-gray-200 px-2 py-0.5 rounded text-[10px] text-black flex items-center gap-1">
                          <span 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: (item as any).selectedColor }} 
                          />
                          لون: {getColorName((item as any).selectedColor)}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        {item.oldPrice && item.oldPrice > item.price ? (
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-sm text-black">
                              {item.price} جنيه
                            </span>
                            <span className="line-through text-black text-xs opacity-50 mr-1">
                              {item.oldPrice}
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold text-sm text-black">
                            {item.price} جنيه
                          </span>
                        )}
                        {type === 'cart' && (item as any).quantity > 1 && (
                          <span className="text-xs font-bold text-black opacity-70 mr-2">
                            × {(item as any).quantity}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {type === 'cart' && isCartItem(item) && (
                          <div className="flex items-center gap-1 bg-white rounded-lg px-1 shadow-sm">
                            <button 
                              onClick={() => handleUpdateQuantity(item.cartItemId, (item as CartItem).quantity - 1)} 
                              className="w-6 h-6 rounded-full hover:bg-gray-100 text-sm font-bold flex items-center justify-center transition text-black"
                              aria-label="تقليل الكمية"
                            >
                              -
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-black">
                              {(item as CartItem).quantity}
                            </span>
                            <button 
                              onClick={() => handleUpdateQuantity(item.cartItemId, (item as CartItem).quantity + 1)} 
                              className="w-6 h-6 rounded-full hover:bg-gray-100 text-sm font-bold flex items-center justify-center transition text-black"
                              aria-label="زيادة الكمية"
                            >
                              +
                            </button>
                          </div>
                        )}
                        
                        <button 
                          onClick={() => handleRemove(item)} 
                          className="text-red-400 hover:text-red-600 transition p-1" 
                          aria-label="حذف"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

        {/* ✅ Footer - للسلة فقط */}
        {type === 'cart' && items.length > 0 && (
          <div className="border-t border-gray-100 p-4 bg-white sticky bottom-0 z-10 shadow-lg rounded-t-2xl">
            <div className="flex justify-between items-center mb-3">
              <span className="text-black font-bold text-sm">الإجمالي</span>
              <div className="text-right">
                {(() => {
                  const hasDiscount = cart.some(item => item.oldPrice && item.oldPrice > item.price);
                  const originalTotal = cart.reduce((sum, item) => sum + (item.oldPrice || item.price) * item.quantity, 0);
                  const savings = originalTotal - total;
                  
                  return (
                    <>
                      {hasDiscount && savings > 0 && (
                        <div className="text-xs font-bold text-green-700 mb-1">
                          وفرت {savings.toFixed(0)} جنيه
                        </div>
                      )}
                      <span className="text-xl font-bold text-black">{total.toFixed(0)}</span>
                      <span className="text-xs font-bold text-black mr-1">جنيه</span>
                    </>
                  );
                })()}
              </div>
            </div>
            <button 
              onClick={openOrderModal} 
              className="w-full bg-linear-to-r from-emerald-500 via-green-500 to-lime-400 text-white font-bold py-3 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-sm shadow-md hover:shadow-lg"
            >
              إتمام الطلب
            </button>
            <button 
              onClick={() => { 
                onClose(); 
                window.location.href = '/products'; 
              }} 
              className="w-full text-center text-xs font-bold text-black opacity-50 mt-3 hover:opacity-70 transition"
            >
              مواصلة التسوق
            </button>
          </div>
        )}
      </div>

      {isOrderModalOpen && cart.length > 0 && (
        <OrderModal 
          isOpen={isOrderModalOpen} 
          onClose={() => setIsOrderModalOpen(false)} 
          product={{
            id: 0,
            name: `طلب متعدد (${cart.length} منتج)`,
            price: total,
            mainImage: cart[0]?.mainImage || '',
            quantity: 1,
          }} 
          onSubmit={handleOrderSubmit}
        />
      )}
    </>
  );
}