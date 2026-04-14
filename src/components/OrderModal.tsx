'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { toArabicNumber, formatPrice } from '@/lib/utils';
import { getColorByCode } from '@/lib/colors';

interface OrderItemVariation {
  variationId: string;
  size?: string;
  color?: string;
  quantity: number;
}

interface OrderItem {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  mainImage: string;
  quantityDiscount?: { enabled: boolean; tiers: Array<{ minQuantity: number; discountPerItem: number }> };
  variations: OrderItemVariation[];
}

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: { id: number; name: string; price: number; mainImage: string; quantity: number };
  onSubmit: (orderData: any) => void;
  onCartCleared?: () => void;
}

const getItemTotalPrice = (item: OrderItem): number => {
  const totalQty = item.variations.reduce((sum, v) => sum + v.quantity, 0);
  if (!item.quantityDiscount?.enabled) return item.price * totalQty;
  const { tiers } = item.quantityDiscount;
  let applicableTier = null;
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (totalQty >= tiers[i].minQuantity) { applicableTier = tiers[i]; break; }
  }
  if (!applicableTier) return item.price * totalQty;
  return totalQty * (item.price - applicableTier.discountPerItem);
};

const getColorName = (colorCode: string): string => {
  const color = getColorByCode(colorCode);
  return color.name || colorCode;
};

export default function OrderModal({ isOpen, onClose, product, onSubmit, onCartCleared }: OrderModalProps) {
  const [formData, setFormData] = useState({ name: '', phone: '', altPhone: '', address: '', landmark: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [isMultiOrder, setIsMultiOrder] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const loadSavedCustomerData = useCallback(() => {
    try {
      const savedData = localStorage.getItem('velix_customer_data');
      if (savedData) {
        const customerData = JSON.parse(savedData);
        setFormData(prev => ({ ...prev, name: customerData.name || '', phone: customerData.phone || '', altPhone: customerData.altPhone || '', address: customerData.address || '', landmark: customerData.landmark || '' }));
      }
    } catch (error) { console.error('Error loading saved customer data:', error); }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadSavedCustomerData();
      try {
        const tempData = localStorage.getItem('tempOrderData');
        if (tempData) {
          const data = JSON.parse(tempData);
          setCartItems(data.items);
          const total = data.items.reduce((sum: number, item: OrderItem) => sum + getItemTotalPrice(item), 0);
          setTotalAmount(total);
          setIsMultiOrder(true);
        }
      } catch (error) { console.error('Error loading order data:', error); }
    }
  }, [isOpen, loadSavedCustomerData]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEscKey);
    setTimeout(() => nameInputRef.current?.focus(), 100);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const validatePhone = (phone: string): boolean => /^(010|011|012|015)[0-9]{8}$/.test(phone);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'الاسم مطلوب';
    else if (formData.name.trim().length < 3) newErrors.name = 'الاسم لازم يكون ٣ حروف على الأقل';
    if (!formData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
    else if (!validatePhone(formData.phone)) newErrors.phone = 'رقم هاتف مش صحيح (زي 01012345678)';
    if (!formData.address.trim()) newErrors.address = 'العنوان مطلوب';
    else if (formData.address.trim().length < 10) newErrors.address = 'العنوان كامل مطلوب';
    if (!formData.landmark.trim()) newErrors.landmark = 'العلامة المميزة مطلوبة';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const saveCustomerData = useCallback((data: typeof formData) => {
    try {
      localStorage.setItem('velix_customer_data', JSON.stringify({ name: data.name, phone: data.phone, altPhone: data.altPhone, address: data.address, landmark: data.landmark, savedAt: new Date().toISOString() }));
    } catch (error) { console.error('Error saving customer data:', error); }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    saveCustomerData(formData);

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
      const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderData) });
      const data = await res.json();
      if (res.ok) {
        window.dispatchEvent(new CustomEvent('showToast', { detail: { message: `✅ تم استلام طلبك! رقم الطلب: ${data.orderId} - هنتواصل معاك قريب`, type: 'success' } }));
        onSubmit(orderData);
        localStorage.removeItem('cart');
        localStorage.removeItem('tempOrderData');
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        if (onCartCleared) onCartCleared();
        onClose();
        setFormData({ name: '', phone: '', altPhone: '', address: '', landmark: '', notes: '' });
      } else throw new Error(data.error || 'فشل إرسال الطلب');
    } catch (error) {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { message: '❌ حصل مشكلة، حاول تاني', type: 'error' } }));
    } finally { setLoading(false); }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const newErrors = { ...prev }; delete newErrors[field]; return newErrors; });
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.variations.reduce((s, v) => s + v.quantity, 0), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-[calc(100%-2rem)] sm:w-120 md:w-130 lg:w-140 xl:w-150 h-auto max-h-[85vh] overflow-y-auto shadow-2xl animate-scale-in mx-auto border border-rose-gold/20" onClick={(e) => e.stopPropagation()}>
        
        <div className="sticky top-0 bg-white border-b border-rose-gold/20 p-4 flex justify-between items-center z-20">
          <h2 className="text-xl font-bold text-black">{isMultiOrder ? `طلب متعدد (${toArabicNumber(cartItems.length)} منتج)` : 'طلب المنتج'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-rose-gold/10 rounded-full transition"><svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>

        <div className="p-4 border-b border-rose-gold/20 bg-rose-gold/5">
          {cartItems.map((item, idx) => (
            <div key={idx} className="mb-4 last:mb-0 pb-3 last:pb-0 border-b last:border-b-0 border-rose-gold/20">
              <div className="flex gap-3 mb-2">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-rose-gold/10 shrink-0"><Image src={item.mainImage} alt={item.name} fill className="object-cover" /></div>
                <div><h3 className="font-bold text-sm text-black">{item.name}</h3><p className="text-xs text-black/60">{formatPrice(item.price)} للقطعة</p></div>
              </div>
              <div className="space-y-2 mr-4">
                {item.variations.map((variation, vIdx) => (
                  <div key={vIdx} className="flex justify-between items-center text-sm bg-white/50 rounded-lg p-2">
                    <div className="flex gap-2">
                      {variation.size && <span className="text-xs bg-rose-gold/10 px-2 py-0.5 rounded-full text-rose-gold">مقاس {variation.size}</span>}
                      {variation.color && <span className="text-xs bg-rose-gold/10 px-2 py-0.5 rounded-full text-rose-gold flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: variation.color }} />{getColorName(variation.color)}</span>}
                    </div>
                    <span className="font-bold text-rose-gold">{toArabicNumber(variation.quantity)} × {formatPrice(item.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="mt-3 pt-2 border-t border-rose-gold/20">
            <div className="flex justify-between"><span className="font-bold">إجمالي القطع:</span><span>{toArabicNumber(totalItems)} قطعة</span></div>
            <div className="flex justify-between mt-1"><span className="font-bold">الإجمالي:</span><span className="text-xl font-bold text-rose-gold">{formatPrice(totalAmount)}</span></div>
            {totalAmount > 500 && <p className="text-xs text-rose-gold mt-1">🚚 شامل الشحن المجاني</p>}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div><label className="block text-sm font-bold text-black mb-1">الاسم بالكامل <span className="text-rose-gold">*</span></label><input ref={nameInputRef} type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-gold font-bold text-black ${errors.name ? 'border-red-500' : 'border-rose-gold/20'}`} placeholder="اكتب اسمك بالكامل" disabled={loading} autoComplete="name" />{errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}</div>
          <div><label className="block text-sm font-bold text-black mb-1">رقم الهاتف <span className="text-rose-gold">*</span></label><input type="tel" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-gold font-bold text-black ${errors.phone ? 'border-red-500' : 'border-rose-gold/20'}`} placeholder="زي 01012345678" disabled={loading} autoComplete="tel" />{errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}</div>
          <div><label className="block text-sm font-bold text-black mb-1">رقم تاني (اختياري)</label><input type="tel" value={formData.altPhone} onChange={(e) => handleInputChange('altPhone', e.target.value)} className="w-full p-2.5 border border-rose-gold/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-gold font-bold text-black" placeholder="رقم تاني عشان نتواصل معاك" disabled={loading} autoComplete="tel" /></div>
          <div><label className="block text-sm font-bold text-black mb-1">العنوان بالتفصيل <span className="text-rose-gold">*</span></label><textarea rows={3} value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-gold font-bold text-black resize-none ${errors.address ? 'border-red-500' : 'border-rose-gold/20'}`} placeholder="المحافظة - المنطقة - الشارع - رقم المنزل" disabled={loading} autoComplete="address-line1" />{errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}</div>
          <div><label className="block text-sm font-bold text-black mb-1">علامة مميزة <span className="text-rose-gold">*</span></label><input type="text" value={formData.landmark} onChange={(e) => handleInputChange('landmark', e.target.value)} className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-gold font-bold text-black ${errors.landmark ? 'border-red-500' : 'border-rose-gold/20'}`} placeholder="مثال: بجوار مسجد النور، قدام مدرسة العبور" disabled={loading} />{errors.landmark && <p className="text-red-500 text-xs mt-1">{errors.landmark}</p>}</div>
          <div><label className="block text-sm font-bold text-black mb-1">ملاحظات إضافية (اختياري)</label><textarea rows={2} value={formData.notes} onChange={(e) => handleInputChange('notes', e.target.value)} className="w-full p-2.5 border border-rose-gold/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-gold font-bold text-black resize-none" placeholder="أي تفاصيل إضافية عشان نوصل لك أسرع" disabled={loading} /></div>
        </form>

        <div className="sticky bottom-0 bg-white border-t border-rose-gold/20 p-4">
          <div className="flex gap-3">
            <button type="submit" onClick={handleSubmit} disabled={loading} className="flex-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold py-2.5 rounded-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-rose-gold/30">{loading ? 'بيتم الإرسال...' : 'أكد الطلب'}</button>
            <button type="button" onClick={onClose} disabled={loading} className="flex-1 bg-linear-to-r from-gray-500 via-gray-600 to-gray-700 text-white font-bold py-2.5 rounded-xl hover:scale-[1.02] transition-all shadow-md">إلغاء</button>
          </div>
          <p className="text-center text-xs font-bold text-black/60 mt-3">📍 بعد التأكيد، هنتواصل معاك عشان نأكد الطلب</p>
        </div>
      </div>
    </div>
  );
}