'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/products';
import OrderModal from './OrderModal';
import Toast from './Toast';

interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
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
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // دالة عرض رسائل الـ Toast
  const showToast = (message: string, toastType: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type: toastType });
    setTimeout(() => setToast(null), 3000);
  };

  // دالة معالجة الأخطاء الموحدة
  const handleError = (error: any, context: string, showUserMessage: string = 'حدث خطأ، يرجى المحاولة مرة أخرى') => {
    console.error(`[${context}]`, error);
    showToast(showUserMessage, 'error');
  };

  // حساب الإجمالي
  useEffect(() => {
    try {
      if (type === 'cart') {
        const cartItems = localItems as CartItem[];
        const sum = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
        setTotal(sum);
      }
    } catch (error) {
      handleError(error, 'Total Calculation', 'حدث خطأ في حساب الإجمالي');
    }
  }, [localItems, type]);

  // تحميل البيانات من localStorage مع معالجة الأخطاء
  const loadFromStorage = () => {
    if (isLoading) return;
    setIsLoading(true);
    
    setTimeout(() => {
      try {
        if (type === 'cart') {
          const saved = localStorage.getItem('cart');
          if (saved) {
            const cartItems = JSON.parse(saved);
            if (Array.isArray(cartItems)) {
              const cartWithQuantity = cartItems.map((item: CartItem) => ({ 
                ...item, 
                quantity: item.quantity || 1 
              }));
              setLocalItems(cartWithQuantity);
            } else {
              setLocalItems([]);
              showToast('تم مسح البيانات غير الصالحة من السلة', 'info');
            }
          } else {
            setLocalItems([]);
          }
        } else {
          const saved = localStorage.getItem('favorites');
          if (saved) {
            const favorites = JSON.parse(saved);
            if (Array.isArray(favorites)) {
              setLocalItems(favorites);
            } else {
              setLocalItems([]);
              showToast('تم مسح البيانات غير الصالحة من المفضلة', 'info');
            }
          } else {
            setLocalItems([]);
          }
        }
      } catch (error) {
        handleError(error, 'Loading from storage', 'حدث خطأ في تحميل البيانات');
        if (type === 'cart') {
          localStorage.removeItem('cart');
        } else {
          localStorage.removeItem('favorites');
        }
        setLocalItems([]);
      } finally {
        setIsLoading(false);
      }
    }, 0);
  };

  useEffect(() => {
    if (isOpen) {
      loadFromStorage();
    }
  }, [isOpen]);

  // الاستماع للتحديثات من المكونات الأخرى مع معالجة الأخطاء
  useEffect(() => {
    const handleUpdate = () => {
      try {
        setTimeout(() => {
          if (type === 'cart') {
            const saved = localStorage.getItem('cart');
            if (saved) {
              const cartItems = JSON.parse(saved);
              if (Array.isArray(cartItems)) {
                const cartWithQuantity = cartItems.map((item: CartItem) => ({ 
                  ...item, 
                  quantity: item.quantity || 1 
                }));
                setLocalItems(cartWithQuantity);
              } else {
                setLocalItems([]);
              }
            } else {
              setLocalItems([]);
            }
          } else {
            const saved = localStorage.getItem('favorites');
            if (saved) {
              const favorites = JSON.parse(saved);
              if (Array.isArray(favorites)) {
                setLocalItems(favorites);
              } else {
                setLocalItems([]);
              }
            } else {
              setLocalItems([]);
            }
          }
        }, 0);
      } catch (error) {
        handleError(error, 'Event Update', 'حدث خطأ في تحديث البيانات');
      }
    };
    
    window.addEventListener('cartUpdated', handleUpdate);
    window.addEventListener('favoritesUpdated', handleUpdate);
    return () => {
      window.removeEventListener('cartUpdated', handleUpdate);
      window.removeEventListener('favoritesUpdated', handleUpdate);
    };
  }, [type]);

  // منع التمرير عند فتح الدراور
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

  // تحديث الكمية مع معالجة الأخطاء
  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    try {
      if (newQuantity < 1) return;
      
      // البحث عن المنتج للحصول على اسمه
      const product = localItems.find(item => item.id === id);
      const productName = product?.name || 'المنتج';
      
      if (onUpdateQuantity) {
        onUpdateQuantity(id, newQuantity);
        showToast(`🔄 تم تحديث كمية ${productName}`, 'info');
      }
      
      setLocalItems(prev => 
        prev.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      handleError(error, 'Update Quantity', 'حدث خطأ في تحديث الكمية');
    }
  };

  // إضافة إلى السلة مع معالجة الأخطاء
  const handleAddToCart = (product: Product) => {
    try {
      if (onAddToCart) {
        onAddToCart(product);
        // استخدام اسم المنتج بدلاً من الـ ID
        showToast(`✅ تم إضافة "${product.name}" إلى السلة`, 'success');
      }
    } catch (error) {
      handleError(error, 'Add to Cart', `حدث خطأ في إضافة ${product?.name || 'المنتج'} إلى السلة`);
    }
  };

  // إزالة المنتج مع معالجة الأخطاء
  const handleRemove = (id: number) => {
    try {
      // البحث عن المنتج للحصول على اسمه قبل الإزالة
      const product = localItems.find(item => item.id === id);
      const productName = product?.name || 'المنتج';
      
      if (onRemove) {
        onRemove(id);
        // استخدام اسم المنتج بدلاً من الـ ID
        showToast(`🗑️ تم إزالة "${productName}" من ${type === 'cart' ? 'السلة' : 'المفضلة'}`, 'info');
      }
    } catch (error) {
      handleError(error, 'Remove Item', 'حدث خطأ في إزالة المنتج');
    }
  };

  // فتح نموذج الطلب
  const openOrderModal = () => {
    try {
      const cartItems = localItems as CartItem[];
      if (cartItems.length === 0) {
        showToast('سلة التسوق فارغة، أضف منتجات أولاً', 'error');
        return;
      }
      setOrderCartItems(cartItems);
      setIsOrderModalOpen(true);
    } catch (error) {
      handleError(error, 'Open Order Modal', 'حدث خطأ في فتح نموذج الطلب');
    }
  };

  // معالجة تقديم الطلب
  const handleOrderSubmit = async (orderData: any) => {
    try {
      console.log('Order submitted:', orderData);
      console.log('Cart items:', orderCartItems);
      console.log('Total amount:', total);
      
      // هنا يمكن إضافة API call لإرسال الطلب
      // await submitOrderToAPI(orderData, orderCartItems, total);
      
      // محاكاة نجاح العملية
      showToast('✅ تم إرسال الطلب بنجاح! سنتواصل معك قريباً', 'success');
      
      // تنظيف السلة بعد الطلب الناجح
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartUpdated'));
      
      setIsOrderModalOpen(false);
      onClose();
    } catch (error) {
      handleError(error, 'Order Submission', 'حدث خطأ في إرسال الطلب، يرجى المحاولة مرة أخرى');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 transition-all duration-300" 
        onClick={onClose} 
      />
      
      <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl z-50 transform transition-all duration-300 border border-gray-100/50 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100/80">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full transition-all duration-300 hover:bg-gray-100/80" 
            aria-label="إغلاق"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="text-gray-500 text-sm mt-2">جاري التحميل...</p>
            </div>
          ) : localItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3 opacity-70">{type === 'favorites' ? '❤️' : '🛒'}</div>
              <p className="text-gray-500 text-sm">{emptyMessage}</p>
              <button 
                onClick={() => { 
                  onClose(); 
                  window.location.href = '/products'; 
                }} 
                className="mt-4 text-sm text-black underline-offset-4 hover:underline transition"
              >
                مواصلة التسوق
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {localItems.map((item) => (
                <div key={item.id} className="flex gap-3 border-b border-gray-100/80 pb-3 last:border-0">
                  <Link 
                    href={`/products/${item.id}`} 
                    onClick={onClose} 
                    className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-50 shrink-0 transition-all hover:scale-105"
                  >
                    <Image 
                      src={item.mainImage} 
                      alt={item.name} 
                      fill 
                      className="object-cover"
                      onError={() => showToast(`فشل تحميل صورة ${item.name}`, 'error')}
                    />
                  </Link>
                  
                  <div className="flex-1 min-w-0">
                    <Link 
                      href={`/products/${item.id}`} 
                      onClick={onClose} 
                      className="font-semibold text-sm hover:text-gray-600 transition line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-gray-400 text-xs mb-1">{item.category}</p>
                    
                    {/* عرض المقاس واللون */}
                    {type === 'cart' && (item as CartItem).selectedSize && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                        <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">
                          مقاس: {(item as CartItem).selectedSize}
                        </span>
                      </div>
                    )}
                    {type === 'cart' && (item as CartItem).selectedColor && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                        <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1">
                          <span 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: (item as CartItem).selectedColor }} 
                          />
                          لون: {(item as CartItem).selectedColor}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-bold text-sm text-gray-900">
                        {(item as CartItem).quantity 
                          ? (item.price * (item as CartItem).quantity).toFixed(0) 
                          : item.price} جنيه
                      </span>
                      
                      {type === 'cart' && onUpdateQuantity && (
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, (item as CartItem).quantity - 1)} 
                            className="w-6 h-6 rounded-full border border-gray-200 hover:bg-gray-100 text-sm flex items-center justify-center transition"
                            aria-label="تقليل الكمية"
                          >
                            -
                          </button>
                          <span className="w-5 text-center text-xs font-medium">
                            {(item as CartItem).quantity}
                          </span>
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, (item as CartItem).quantity + 1)} 
                            className="w-6 h-6 rounded-full border border-gray-200 hover:bg-gray-100 text-sm flex items-center justify-center transition"
                            aria-label="زيادة الكمية"
                          >
                            +
                          </button>
                        </div>
                      )}
                      
                      {type === 'favorites' && onAddToCart && (
                        <button 
                          onClick={() => handleAddToCart(item)} 
                          className="text-xs bg-black text-white px-2 py-1 rounded-full hover:bg-gray-800 transition"
                        >
                          إضافة للسلة
                        </button>
                      )}
                      
                      {onRemove && (
                        <button 
                          onClick={() => handleRemove(item.id)} 
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

        {type === 'cart' && localItems.length > 0 && !isLoading && (
          <div className="border-t border-gray-100/80 p-4 bg-linear-to-b from-white to-gray-50/80 rounded-b-2xl">
            <div className="flex justify-between font-semibold text-sm mb-3">
              <span className="text-gray-600">الإجمالي</span>
              <span className="text-gray-900 text-lg">{total.toFixed(0)} جنيه</span>
            </div>
            <button 
              onClick={openOrderModal} 
              className="w-full bg-black text-white py-2.5 rounded-full hover:bg-gray-800 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg"
            >
              إتمام الطلب
            </button>
            <button 
              onClick={() => { 
                onClose(); 
                window.location.href = '/products'; 
              }} 
              className="w-full text-center text-xs text-gray-400 mt-3 hover:text-gray-500 transition"
            >
              مواصلة التسوق
            </button>
          </div>
        )}
      </div>

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

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </>
  );
}