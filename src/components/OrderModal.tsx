// components/OrderModal.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

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
  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

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
    const phoneRegex = /^(01[0-2,5]{1}[0-9]{8})$/;
    return phoneRegex.test(phone);
  };

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'الاسم مطلوب';
    else if (formData.name.trim().length < 3) newErrors.name = 'الاسم 3 أحرف على الأقل';
    
    if (!formData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
    else if (!validatePhone(formData.phone)) newErrors.phone = 'رقم هاتف غير صحيح';
    
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
    
    const orderData = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      altPhone: formData.altPhone.trim(),
      address: formData.address.trim(),
      landmark: formData.landmark.trim(),
      notes: formData.notes.trim(),
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        size: product.selectedSize,
        color: product.selectedColor,
      }
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

  const total = product.price * product.quantity;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center z-20">
          <h2 className="text-xl font-bold text-black">طلب المنتج</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition" aria-label="إغلاق">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex gap-3">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
              <Image src={product.mainImage} alt={product.name} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-black line-clamp-2">{product.name}</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                <p className="text-sm text-gray-600">{product.price} جنيه × {product.quantity}</p>
                {product.selectedSize && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">مقاس: {product.selectedSize}</span>}
                {product.selectedColor && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: product.selectedColor }} />{product.selectedColor}</span>}
              </div>
              <div className="mt-2 pt-1 border-t border-gray-100">
                <p className="text-sm font-bold text-black">الإجمالي: <span className="text-lg">{total}</span> جنيه</p>
                {total > 500 && <p className="text-xs text-green-600 mt-0.5">🚚 شامل الشحن المجاني</p>}
              </div>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-280px)]">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">الاسم الكامل <span className="text-red-500">*</span></label>
            <input ref={nameInputRef} type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${errors.name ? 'border-red-500' : 'border-gray-200'}`} placeholder="أدخل اسمك الكامل" disabled={loading} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">رقم الهاتف <span className="text-red-500">*</span></label>
            <input type="tel" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${errors.phone ? 'border-red-500' : 'border-gray-200'}`} placeholder="مثال: 01012345678" disabled={loading} />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">رقم هاتف آخر (اختياري)</label>
            <input type="tel" value={formData.altPhone} onChange={(e) => handleInputChange('altPhone', e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" placeholder="رقم آخر للتواصل" disabled={loading} />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">العنوان بالتفصيل <span className="text-red-500">*</span></label>
            <textarea 
              rows={3} 
              value={formData.address} 
              onChange={(e) => handleInputChange('address', e.target.value)} 
              className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none ${errors.address ? 'border-red-500' : 'border-gray-200'}`} 
              placeholder="المحافظة - المنطقة - الشارع - رقم المنزل" 
              disabled={loading} 
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              علامة مميزة <span className="text-red-500">*</span>
              <span className="text-xs text-gray-400 mr-2">(مثل: بجوار مسجد النور، أمام مدرسة العبور، بجنيني)</span>
            </label>
            <input 
              type="text" 
              value={formData.landmark} 
              onChange={(e) => handleInputChange('landmark', e.target.value)} 
              className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${errors.landmark ? 'border-red-500' : 'border-gray-200'}`} 
              placeholder="مثال: بجوار مسجد النور، أمام مدرسة العبور" 
              disabled={loading} 
            />
            {errors.landmark && <p className="text-red-500 text-xs mt-1">{errors.landmark}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">ملاحظات إضافية (اختياري)</label>
            <textarea rows={2} value={formData.notes} onChange={(e) => handleInputChange('notes', e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none" placeholder="أي تفاصيل إضافية لتوصيل الطلب" disabled={loading} />
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
          <p className="text-center text-xs text-gray-500 font-bold mt-3">📍 بعد التأكيد، سنتواصل معك لتأكيد الطلب</p>
        </div>
      </div>
    </div>
  );
}