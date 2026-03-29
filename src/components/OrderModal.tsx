// components/OrderModal.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  mainImage: string;
}

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: number;
    name: string;
    price: number;
    mainImage: string;
    selectedSize?: string;
    selectedColor?: string;
    quantity: number;
  };
  onSubmit: (orderData: any) => void;
}

export default function OrderModal({ isOpen, onClose, product, onSubmit }: OrderModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    altPhone: '',
    address: '',
    landmark: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [isMultiOrder, setIsMultiOrder] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // تحميل بيانات الطلب المتعدد من localStorage
  useEffect(() => {
    if (isOpen) {
      try {
        const tempData = localStorage.getItem('tempOrderData');
        if (tempData) {
          const data = JSON.parse(tempData);
          setCartItems(data.items);
          setTotalAmount(data.totalAmount);
          setIsMultiOrder(true);
        } else if (product.id !== 0) {
          // طلب عادي (منتج واحد)
          setCartItems([{
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            selectedSize: product.selectedSize,
            selectedColor: product.selectedColor,
            mainImage: product.mainImage,
          }]);
          setTotalAmount(product.price * product.quantity);
          setIsMultiOrder(false);
        }
      } catch (error) {
        console.error('Error loading order data:', error);
      }
    }
  }, [isOpen, product]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscKey);
    setTimeout(() => nameInputRef.current?.focus(), 100);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^(010|011|012|015)[0-9]{8}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'الاسم مطلوب';
    else if (formData.name.trim().length < 3) newErrors.name = 'الاسم 3 أحرف على الأقل';

    if (!formData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
    else if (!validatePhone(formData.phone)) newErrors.phone = 'رقم هاتف غير صحيح (مثال: 01012345678)';

    if (!formData.address.trim()) newErrors.address = 'العنوان مطلوب';
    else if (formData.address.trim().length < 10) newErrors.address = 'عنوان كامل مطلوب';

    if (!formData.landmark.trim()) newErrors.landmark = 'العلامة المميزة مطلوبة';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    // إضافة 20+ لأرقام الهواتف المصرية
    const formatPhoneForWhatsApp = (phone: string) => {
      let cleaned = phone.replace(/\D/g, '');
      if (cleaned.startsWith('0')) {
        cleaned = '20' + cleaned.substring(1);
      } else if (!cleaned.startsWith('20')) {
        cleaned = '20' + cleaned;
      }
      return cleaned;
    };

    const orderData = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      altPhone: formData.altPhone.trim(),
      address: formData.address.trim(),
      landmark: formData.landmark.trim(),
      notes: formData.notes.trim(),
      items: cartItems,
      totalAmount: totalAmount,
      isMultiOrder: isMultiOrder,
      orderId: Date.now().toString(),
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (res.ok) {
        window.dispatchEvent(new CustomEvent('showToast', {
          detail: {
            message: `✅ تم استلام طلبك بنجاح! رقم الطلب: ${data.orderId} - سنتواصل معك قريباً`,
            type: 'success'
          }
        }));

        onSubmit(orderData);
        onClose();
        setFormData({ name: '', phone: '', altPhone: '', address: '', landmark: '', notes: '' });
        localStorage.removeItem('tempOrderData');
      } else {
        throw new Error(data.error || 'فشل إرسال الطلب');
      }
    } catch (error) {
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: {
          message: '❌ حدث خطأ، حاول مرة أخرى',
          type: 'error'
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const newErrors = { ...prev }; delete newErrors[field]; return newErrors; });
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
      '#FFA500': 'برتقالي',
      '#00FFFF': 'سماوي',
    };
    return colorMap[colorCode] || colorCode;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center z-20">
          <h2 className="text-xl font-bold text-black">
            {isMultiOrder ? `طلب متعدد (${cartItems.length} منتج)` : 'طلب المنتج'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition" aria-label="إغلاق">
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* عرض المنتجات في الـ Modal */}
        <div className="p-4 border-b border-gray-100 bg-gray-50 max-h-64 overflow-y-auto">
          {cartItems.map((item, idx) => (
            <div key={idx} className="flex gap-3 mb-3 last:mb-0 pb-3 last:pb-0 border-b last:border-b-0 border-gray-200">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                <Image src={item.mainImage} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-black line-clamp-2">{item.name}</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  <p className="text-xs font-bold text-black">{item.price} جنيه × {item.quantity}</p>
                  {item.selectedSize && (
                    <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full font-bold text-black">مقاس: {item.selectedSize}</span>
                  )}
                  {item.selectedColor && (
                    <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full font-bold text-black flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.selectedColor }} />
                      لون: {getColorName(item.selectedColor)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-sm font-bold text-black">الإجمالي: <span className="text-lg">{totalAmount}</span> جنيه</p>
            {totalAmount > 500 && <p className="text-xs font-bold text-green-700 mt-0.5">🚚 شامل الشحن المجاني</p>}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-320px)]">
          {/* نفس حقول الفورم اللي كانت موجودة */}
          <div>
            <label className="block text-sm font-bold text-black mb-1">الاسم الكامل <span className="text-red-500">*</span></label>
            <input ref={nameInputRef} type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-bold text-black ${errors.name ? 'border-red-500' : 'border-gray-300'}`} placeholder="أدخل اسمك الكامل" disabled={loading} autoComplete="name" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-1">رقم الهاتف <span className="text-red-500">*</span></label>
            <input type="tel" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-bold text-black ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} placeholder="مثال: 01012345678" disabled={loading} autoComplete="tel" />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-1">رقم هاتف آخر (اختياري)</label>
            <input type="tel" value={formData.altPhone} onChange={(e) => handleInputChange('altPhone', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-bold text-black" placeholder="رقم آخر للتواصل" disabled={loading} autoComplete="tel" />
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-1">العنوان بالتفصيل <span className="text-red-500">*</span></label>
            <textarea rows={3} value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-bold text-black resize-none ${errors.address ? 'border-red-500' : 'border-gray-300'}`} placeholder="المحافظة - المنطقة - الشارع - رقم المنزل" disabled={loading} autoComplete="address-line1" />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-1">علامة مميزة <span className="text-red-500">*</span></label>
            <input type="text" value={formData.landmark} onChange={(e) => handleInputChange('landmark', e.target.value)} className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-bold text-black ${errors.landmark ? 'border-red-500' : 'border-gray-300'}`} placeholder="مثال: بجوار مسجد النور، أمام مدرسة العبور" disabled={loading} />
            {errors.landmark && <p className="text-red-500 text-xs mt-1">{errors.landmark}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-1">ملاحظات إضافية (اختياري)</label>
            <textarea rows={2} value={formData.notes} onChange={(e) => handleInputChange('notes', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-bold text-black resize-none" placeholder="أي تفاصيل إضافية لتوصيل الطلب" disabled={loading} />
          </div>
        </form>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
          <div className="flex gap-3">
            <button type="submit" onClick={handleSubmit} disabled={loading} className="flex-1 bg-linear-to-r from-emerald-500 via-green-500 to-lime-400 text-white font-bold py-2.5 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 shadow-md">
              {loading ? 'جاري الإرسال...' : 'تأكيد الطلب'}
            </button>
            <button type="button" onClick={onClose} disabled={loading} className="flex-1 bg-linear-to-r from-red-500 via-rose-500 to-pink-500 text-white font-bold py-2.5 rounded-xl hover:scale-[1.02] transition-all shadow-md">
              إلغاء
            </button>
          </div>
          <p className="text-center text-xs font-bold text-black mt-3">📍 بعد التأكيد، سنتواصل معك لتأكيد الطلب</p>
        </div>
      </div>
    </div>
  );
}