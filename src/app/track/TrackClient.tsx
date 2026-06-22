'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toArabicNumber, formatPrice } from '@/lib/utils';

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface OrderData {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  landmark?: string;
  status: string;
  statusLabel: string;
  totalAmount: number;
  notes?: string;
  createdAt: string;
  deliveredAt?: string;
  cancelledAt?: string;
  updatedAt?: string;
  items: OrderItem[];
}

const statusSteps = [
  { key: 'pending', label: 'قيد المعالجة', icon: '📋' },
  { key: 'processing', label: 'قيد التجهيز', icon: '⚙️' },
  { key: 'shipped', label: 'تم الشحن', icon: '🚚' },
  { key: 'delivered', label: 'تم التوصيل', icon: '✅' },
];

const trackSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'تتبع طلبك - VELIX',
  description: 'تابع حالة طلبك من VELIX',
  url: 'https://velix-eg.store/track',
};

export default function TrackClient() {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !phone.trim()) {
      setError('يرجى إدخال رقم الطلب ورقم الهاتف');
      return;
    }
    setLoading(true);
    setError('');
    setOrderData(null);
    setSearched(true);

    try {
      const res = await fetch(`/api/orders/track?orderId=${encodeURIComponent(orderId.trim())}&phone=${encodeURIComponent(phone.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'لم يتم العثور على الطلب');
      }

      setOrderData(data.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status: string) => {
    return statusSteps.findIndex(s => s.key === status);
  };

  const currentStep = orderData ? getStatusIndex(orderData.status) : -1;
  const isCancelled = orderData?.status === 'cancelled';

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(trackSchema) }}
      />

      <div className="bg-linear-to-b from-white via-[#FCFCFC] to-[#F5F3F0] min-h-screen pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <span className="text-xs text-rose-gold tracking-[0.2em] uppercase font-bold mb-3 block">
              طلبك في أمان
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-black mb-4">
              تتبع طلبك
            </h1>
            <div className="w-20 h-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full mx-auto mb-6" />
            <p className="text-black/60 font-bold text-sm max-w-xl mx-auto">
              أدخل رقم الطلب ورقم الهاتف عشان تعرف طلبك فين دلوقتي
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl p-6 border border-rose-gold/20 shadow-lg mb-8"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  رقم الطلب <span className="text-rose-gold">*</span>
                </label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full p-3 border border-rose-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold font-bold text-black"
                  placeholder="مثلاً: 1712345678901"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  رقم الهاتف <span className="text-rose-gold">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 border border-rose-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold font-bold text-black"
                  placeholder="مثلاً: 01012345678"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold py-3 rounded-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-rose-gold/30"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    بيتم البحث...
                  </span>
                ) : (
                  '🔍 تتبع الطلب'
                )}
              </button>
            </div>
          </motion.form>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center"
              >
                <span className="text-4xl block mb-3">😢</span>
                <p className="text-red-600 font-bold">{error}</p>
                {searched && (
                  <p className="text-red-400 text-sm mt-2 font-bold">
                    تأكد من رقم الطلب ورقم الهاتف
                  </p>
                )}
                <a
                  href="https://wa.me/201500125133"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-600 text-white font-bold rounded-full text-sm hover:bg-green-700 transition"
                >
                  كلم خدمة العملاء
                </a>
              </motion.div>
            )}

            {orderData && !error && (
              <motion.div
                key="order-details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="bg-white rounded-2xl border border-rose-gold/20 shadow-lg overflow-hidden mb-6">
                  <div className="bg-linear-to-r from-rose-gold-light via-rose-gold to-copper p-4 text-center">
                    <p className="text-white/80 text-sm font-bold">رقم الطلب</p>
                    <h2 className="text-white text-2xl font-black">#{orderData.orderId}</h2>
                  </div>

                  <div className="p-6">
                    <div className="text-center mb-6">
                      <span className="text-5xl block mb-2">
                        {isCancelled ? '❌' : statusSteps[currentStep]?.icon || '📦'}
                      </span>
                      <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-black ${
                        isCancelled
                          ? 'bg-red-100 text-red-700'
                          : orderData.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-gold/10 text-rose-gold'
                      }`}>
                        {orderData.statusLabel}
                      </span>
                      <p className="text-black/50 text-xs mt-2 font-bold">
                        آخر تحديث: {formatDate(orderData.updatedAt || orderData.createdAt)}
                      </p>
                    </div>

                    {!isCancelled && (
                      <div className="mb-6">
                        <div className="flex justify-between items-center">
                          {statusSteps.map((step, idx) => (
                            <div key={step.key} className="flex flex-col items-center relative">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                                idx <= currentStep
                                  ? 'bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white shadow-md'
                                  : 'bg-gray-100 text-gray-400'
                              }`}>
                                {idx < currentStep ? '✓' : step.icon}
                              </div>
                              <p className={`text-xs font-bold mt-1 ${
                                idx <= currentStep ? 'text-rose-gold' : 'text-gray-400'
                              }`}>
                                {step.label}
                              </p>
                              {idx < statusSteps.length - 1 && (
                                <div className={`absolute top-5 left-10 w-full h-0.5 -z-10 ${
                                  idx < currentStep ? 'bg-rose-gold' : 'bg-gray-200'
                                }`} style={{ width: 'calc(100% + 1rem)' }} />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="border-t border-rose-gold/10 pt-4 space-y-3">
                      <h3 className="font-black text-black mb-3">تفاصيل العميل</h3>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-black/50 font-bold">الاسم</p>
                          <p className="font-bold text-black">{orderData.customerName}</p>
                        </div>
                        <div>
                          <p className="text-black/50 font-bold">الهاتف</p>
                          <p className="font-bold text-black" dir="ltr">{orderData.customerPhone}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-black/50 font-bold">العنوان</p>
                          <p className="font-bold text-black">{orderData.customerAddress}</p>
                        </div>
                        {orderData.landmark && (
                          <div className="col-span-2">
                            <p className="text-black/50 font-bold">علامة مميزة</p>
                            <p className="font-bold text-black">{orderData.landmark}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-rose-gold/10 pt-4 mt-4">
                      <h3 className="font-black text-black mb-3">المنتجات</h3>
                      <div className="space-y-3">
                        {orderData.items.map((item, idx) => (
                          <div key={idx} className="bg-rose-gold/5 rounded-xl p-3 border border-rose-gold/10">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-bold text-black text-sm">{item.productName}</p>
                                <div className="flex gap-2 mt-1">
                                  {item.selectedSize && (
                                    <span className="text-xs bg-rose-gold/10 px-2 py-0.5 rounded-full text-rose-gold">
                                      مقاس {item.selectedSize}
                                    </span>
                                  )}
                                  {item.selectedColor && (
                                    <span className="text-xs bg-rose-gold/10 px-2 py-0.5 rounded-full text-rose-gold">
                                      {item.selectedColor}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-left">
                                <p className="font-bold text-rose-gold">{formatPrice(item.price)}</p>
                                <p className="text-xs text-black/50 font-bold">الكمية: {toArabicNumber(item.quantity)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-rose-gold/10 pt-4 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-black text-black text-lg">الإجمالي</span>
                        <span className="font-black text-rose-gold text-xl">{formatPrice(orderData.totalAmount)}</span>
                      </div>
                      <p className="text-xs text-rose-gold/70 mt-1 font-bold">الدفع عند الاستلام</p>
                    </div>

                    {orderData.notes && (
                      <div className="border-t border-rose-gold/10 pt-4 mt-4">
                        <p className="text-black/50 text-sm font-bold">ملاحظات</p>
                        <p className="font-bold text-black text-sm mt-1">{orderData.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center space-y-3"
                >
                  <p className="text-black/60 font-bold text-sm">
                    محتاج مساعدة؟
                  </p>
                  <a
                    href="https://wa.me/201500125133"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-all shadow-md hover:shadow-green-600/30"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.52 3.48A11.94 11.94 0 0012.05 0C5.5 0 .2 5.3.2 11.84c0 2.08.54 4.1 1.57 5.88L0 24l6.46-1.68a11.82 11.82 0 005.6 1.43h.01c6.55 0 11.85-5.3 11.85-11.84 0-3.16-1.23-6.12-3.4-8.43zM12.06 21.2h-.01a9.3 9.3 0 01-4.74-1.3l-.34-.2-3.83 1 1.02-3.73-.22-.38a9.23 9.23 0 01-1.42-4.92c0-5.12 4.18-9.3 9.32-9.3 2.49 0 4.82.97 6.58 2.74a9.22 9.22 0 012.73 6.57c0 5.13-4.18 9.32-9.29 9.32zm5.2-6.94c-.28-.14-1.66-.82-1.92-.91-.26-.1-.45-.14-.64.14-.19.28-.73.91-.9 1.1-.16.19-.33.21-.61.07-.28-.14-1.17-.43-2.23-1.36-.83-.74-1.38-1.65-1.54-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.5.14-.17.19-.28.28-.47.1-.19.05-.36-.02-.5-.07-.14-.64-1.54-.88-2.12-.23-.56-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.28-1 1-.97 2.43.03 1.43 1.04 2.8 1.19 3 .14.19 2.05 3.12 5.02 4.38.7.3 1.24.48 1.66.62.7.22 1.33.19 1.83.11.56-.08 1.66-.68 1.9-1.33.23-.65.23-1.2.16-1.33-.07-.12-.26-.19-.54-.33z"/>
                    </svg>
                    كلم خدمة العملاء
                  </a>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
