'use client';

import { useState } from 'react';
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
  onSubmit: (orderData: OrderData) => void;
}

interface OrderData {
  name: string;
  phone: string;
  altPhone?: string;
  address: string;
  notes?: string;
  product: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
  };
}

export default function OrderModal({ isOpen, onClose, product, onSubmit }: OrderModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    altPhone: '',
    address: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address) {
      alert('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    
    const orderData: OrderData = {
      name: formData.name,
      phone: formData.phone,
      altPhone: formData.altPhone,
      address: formData.address,
      notes: formData.notes,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        size: product.selectedSize,
        color: product.selectedColor,
      },
    };
    
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      
      const data = await res.json();
      
      if (res.ok && data.whatsappUrl) {
        // فتح رابط الواتساب مباشرة
        window.open(data.whatsappUrl, '_blank');
        alert('✅ تم إرسال طلبك! سيتم توجيهك إلى واتساب لإتمام الطلب');
        onSubmit(orderData);
        onClose();
      } else {
        alert('❌ حدث خطأ، حاول مرة أخرى');
      }
    } catch {
      alert('❌ حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">طلب المنتج</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Product Preview */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex gap-3">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden">
              <Image src={product.mainImage} alt={product.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.price} جنيه × {product.quantity}</p>
              {product.selectedSize && <p className="text-sm text-gray-500">المقاس: {product.selectedSize}</p>}
              {product.selectedColor && <p className="text-sm text-gray-500">اللون: {product.selectedColor}</p>}
              <p className="text-sm font-bold text-black mt-1">الإجمالي: {product.price * product.quantity} جنيه</p>
            </div>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">الاسم *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="أدخل اسمك الكامل"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">رقم الهاتف *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="مثال: 01012345678"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">رقم هاتف آخر (اختياري)</label>
            <input
              type="tel"
              value={formData.altPhone}
              onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="رقم آخر للتواصل"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">العنوان *</label>
            <textarea
              required
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="المحافظة - المنطقة - الشارع - رقم المنزل"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">ملاحظات (اختياري)</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="أي تفاصيل إضافية"
            />
          </div>
          
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? 'جاري الإرسال...' : 'تأكيد الطلب'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}