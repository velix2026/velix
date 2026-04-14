'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toArabicNumber, formatPrice } from '@/lib/utils';

const ADMIN_SECRET_PATH = process.env.NEXT_PUBLIC_ADMIN_SECRET_PATH || 'velix-admin-x7k9m';
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'velix@2026';

interface Order {
  id: number;
  order_id: string;
  customer_name: string;
  customer_phone: string;
  customer_alt_phone?: string;
  customer_address: string;
  landmark?: string;
  total_amount: number;
  created_at: string;
  notes?: string;
  items?: any[];
}

export default function PrintMultiPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  // التحقق من الجلسة
  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth');
    const loginTime = sessionStorage.getItem('adminLoginTime');
    
    let isValid = false;
    if (auth === 'true' && loginTime) {
      const elapsed = Date.now() - parseInt(loginTime);
      if (elapsed < 60 * 60 * 1000) {
        isValid = true;
      } else {
        sessionStorage.removeItem('adminAuth');
        sessionStorage.removeItem('adminLoginTime');
      }
    }
    
    if (isValid) {
      setIsAuthenticated(true);
      fetchOrders();
    } else {
      router.push(`/${ADMIN_SECRET_PATH}/login`);
    }
  }, [router]);

  // ✅ جلب الطلبات مع Authorization header
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/${ADMIN_SECRET_PATH}/orders`, {
        headers: {
          'Authorization': `Bearer ${ADMIN_PASSWORD}`
        }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOrder = (orderId: string) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const selectAll = () => {
    if (selectedOrders.size === orders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(orders.map(o => o.order_id)));
    }
  };

  const printSelected = () => {
    if (selectedOrders.size === 0) {
      alert('اختار طلب واحد على الأقل للطباعة');
      return;
    }
    setShowPrintPreview(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => setShowPrintPreview(false), 500);
    }, 200);
  };

  const selectedOrdersData = orders.filter(o => selectedOrders.has(o.order_id));

  if (!isAuthenticated) return null;
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3F0] pt-28 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-gold/20 border-t-rose-gold rounded-full animate-spin" />
        <p className="text-black font-bold mr-3">جاري تحميل الطلبات...</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-linear-to-brom-white via-[#FCFCFC] to-[#F5F3F0] pt-20 md:pt-28 pb-12">
        <div className="container mx-auto px-3 md:px-4">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 md:mb-8">
            <div className="text-center sm:text-right">
              <h1 className="text-2xl md:text-3xl font-black text-black">طباعة فواتير متعددة</h1>
              <p className="text-rose-gold/60 text-xs md:text-sm font-bold mt-1">اختر الطلبات للطباعة (كل 4 فواتير في صفحة A4)</p>
            </div>
            <Link href={`/${ADMIN_SECRET_PATH}/orders`} className="px-3 md:px-4 py-1.5 md:py-2 bg-rose-gold/10 hover:bg-rose-gold/20 text-rose-gold rounded-full text-xs md:text-sm flex items-center gap-1 md:gap-2 transition-colors">
              ← <span className="hidden sm:inline">العودة للطلبات</span>
            </Link>
          </div>

          {/* Actions Bar */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-md border border-rose-gold/20 p-4 mb-6 flex flex-wrap gap-3 justify-between items-center">
            <div className="flex gap-3 items-center">
              <button
                onClick={selectAll}
                className="px-3 md:px-4 py-1.5 md:py-2 bg-rose-gold/10 hover:bg-rose-gold/20 text-rose-gold rounded-full text-xs md:text-sm transition-colors"
              >
                {selectedOrders.size === orders.length ? 'إلغاء الكل' : 'تحديد الكل'}
              </button>
              <span className="text-sm font-bold text-black/70">
                تم اختيار <span className="text-rose-gold font-black">{toArabicNumber(selectedOrders.size)}</span> طلب
              </span>
            </div>
            <button
              onClick={printSelected}
              disabled={selectedOrders.size === 0}
              className={`px-4 md:px-6 py-1.5 md:py-2 rounded-full font-bold text-sm transition-all ${
                selectedOrders.size > 0
                  ? 'bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white hover:shadow-lg hover:scale-[1.02]'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              🖨️ طباعة ({toArabicNumber(selectedOrders.size)} فاتورة)
            </button>
          </div>

          {/* Orders List */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-md border border-rose-gold/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-rose-gold/10">
                  <tr>
                    <th className="p-3 text-right w-12">
                      <input
                        type="checkbox"
                        checked={selectedOrders.size === orders.length && orders.length > 0}
                        onChange={selectAll}
                        className="w-4 h-4 rounded border-rose-gold/30 accent-rose-gold"
                      />
                    </th>
                    <th className="p-3 text-right font-black text-black">رقم الطلب</th>
                    <th className="p-3 text-right font-black text-black">العميل</th>
                    <th className="p-3 text-right font-black text-black">المبلغ</th>
                    <th className="p-3 text-right font-black text-black">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-t border-rose-gold/10 hover:bg-rose-gold/5 transition-colors">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedOrders.has(order.order_id)}
                          onChange={() => toggleOrder(order.order_id)}
                          className="w-4 h-4 rounded border-rose-gold/30 accent-rose-gold"
                        />
                       </td>
                      <td className="p-3 font-mono font-black text-black">{order.order_id}</td>
                      <td className="p-3 font-bold text-black">{order.customer_name}</td>
                      <td className="p-3 font-black text-rose-gold">{formatPrice(order.total_amount)}</td>
                      <td className="p-3 text-black/60 text-sm font-bold">
                        {new Date(order.created_at).toLocaleDateString('ar-EG')}
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* باقي كود الطباعة - نفس الكود القديم */}
      {showPrintPreview && (
        <div className="fixed inset-0 z-200 bg-white print:bg-white overflow-auto print:overflow-visible">
          <div className="print:hidden sticky top-0 bg-white p-4 border-b border-rose-gold/20 flex justify-between items-center">
            <h2 className="font-black text-black text-lg">معاينة الطباعة</h2>
            <button onClick={() => setShowPrintPreview(false)} className="px-4 py-2 bg-rose-gold/10 hover:bg-rose-gold/20 text-rose-gold rounded-full text-sm transition-colors">
              ✕ إغلاق
            </button>
          </div>
          
          <div className="p-4 print:p-0">
            {Array.from({ length: Math.ceil(selectedOrdersData.length / 4) }).map((_, pageIndex) => {
              const pageOrders = selectedOrdersData.slice(pageIndex * 4, (pageIndex + 1) * 4);
              return (
                <div key={pageIndex} className="print:break-after-page">
                  <div className="grid grid-cols-2 gap-2 print:gap-1.5">
                    {pageOrders.map((order) => (
                      <div key={order.order_id} className="border border-rose-gold/20 rounded-xl p-2.5 print:p-2 bg-white shadow-sm print:shadow-none" style={{ height: 'calc(297mm / 2 - 6mm)', display: 'flex', flexDirection: 'column' }}>
                        {/* Header */}
                        <div className="text-center border-b border-rose-gold/20 pb-1.5 mb-1.5">
                          <div className="flex items-center justify-center gap-1">
                            <div className="w-6 h-0.5 bg-linear-to-r from-rose-gold-light to-rose-gold"></div>
                            <h2 className="text-base font-black text-black tracking-tight">VELIX</h2>
                            <div className="w-6 h-0.5 bg-linear-to-l from-rose-gold-light to-rose-gold"></div>
                          </div>
                          <p className="text-[8px] text-rose-gold/50 font-bold mt-0.5">فخامة تسوق تستحقها</p>
                        </div>

                        {/* Order Number */}
                        <div className="text-center mb-1.5">
                          <p className="text-[7px] text-black/40 font-bold">رقم الفاتورة</p>
                          <p className="font-mono font-black text-[11px] text-black tracking-wide">{order.order_id}</p>
                        </div>

                        {/* Customer Info */}
                        <div className="border-r-2 border-rose-gold pr-1.5 mb-1.5">
                          <p className="font-black text-[8px] text-black mb-1 flex items-center gap-1">
                            <span className="text-[10px]">👤</span> بيانات العميل
                          </p>
                          <div className="grid grid-cols-2 gap-x-1 gap-y-0.5 text-[8px]">
                            <p><span className="font-bold">الاسم:</span> {order.customer_name}</p>
                            <p><span className="font-bold">هاتف:</span> {order.customer_phone}</p>
                            {order.customer_alt_phone && <p><span className="font-bold">هاتف2:</span> {order.customer_alt_phone}</p>}
                            <p className="col-span-2 truncate"><span className="font-bold">عنوان:</span> {order.customer_address}</p>
                            {order.landmark && <p className="col-span-2"><span className="font-bold">علامة مميزة:</span> {order.landmark}</p>}
                          </div>
                        </div>

                        {/* Order Info */}
                        <div className="border-r-2 border-rose-gold/60 pr-1.5 mb-1.5">
                          <p className="font-black text-[8px] text-black mb-1 flex items-center gap-1">
                            <span className="text-[10px]">📋</span> معلومات الطلب
                          </p>
                          <div className="grid grid-cols-2 gap-x-1 gap-y-0.5 text-[8px]">
                            <p><span className="font-bold">التاريخ:</span> {new Date(order.created_at).toLocaleDateString('ar-EG')}</p>
                            <p><span className="font-bold">الدفع:</span> عند الاستلام</p>
                          </div>
                        </div>

                        {/* Notes */}
                        {order.notes && (
                          <div className="border-r-2 border-amber-500 pr-1.5 mb-1.5">
                            <p className="font-black text-[8px] text-black mb-0.5 flex items-center gap-1">
                              <span className="text-[10px]">📝</span> ملاحظات
                            </p>
                            <p className="text-[7px] text-black/70 line-clamp-2">{order.notes}</p>
                          </div>
                        )}

                        {/* Products */}
                        <div className="flex-1 min-h-0">
                          <p className="font-black text-[8px] text-black mb-0.5 flex items-center gap-1">
                            <span className="text-[10px]">🛍️</span> المنتجات
                          </p>
                          <div className="border border-rose-gold/20 rounded-lg overflow-hidden">
                            <table className="w-full text-[7px]">
                              <thead className="bg-rose-gold/10">
                                <tr>
                                  <th className="p-1 text-right font-bold">المنتج</th>
                                  <th className="p-1 text-center font-bold">ك</th>
                                  <th className="p-1 text-center font-bold">السعر</th>
                                  <th className="p-1 text-center font-bold">المجموع</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.items?.slice(0, 3).map((item: any, i: number) => (
                                  <tr key={i} className="border-t border-rose-gold/10">
                                    <td className="p-1">
                                      <p className="font-bold truncate max-w-20">{item.product_name}</p>
                                      {(item.selected_size || item.selected_color) && (
                                        <p className="text-[6px] text-black/50">
                                          {item.selected_size && `م:${item.selected_size}`}
                                          {item.selected_size && item.selected_color && ' '}
                                          {item.selected_color && `ل:${item.selected_color}`}
                                        </p>
                                      )}
                                    </td>
                                    <td className="p-1 text-center font-bold">{toArabicNumber(item.quantity)}</td>
                                    <td className="p-1 text-center">{formatPrice(item.price)}</td>
                                    <td className="p-1 text-center font-bold">{formatPrice(item.price * item.quantity)}</td>
                                  </tr>
                                ))}
                                {order.items && order.items.length > 3 && (
                                  <tr className="border-t border-rose-gold/10">
                                    <td colSpan={4} className="p-1 text-center text-rose-gold/40 text-[6px] font-bold">
                                      + {toArabicNumber(order.items.length - 3)} منتجات أخرى
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                              <tfoot className="bg-rose-gold/10 border-t border-rose-gold/20">
                                <tr>
                                  <td colSpan={3} className="p-1 text-left font-black text-[8px]">الإجمالي</td>
                                  <td className="p-1 text-center font-black text-rose-gold text-[10px]">{formatPrice(order.total_amount)}</td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center border-t border-rose-gold/20 pt-1.5 mt-1.5">
                          <p className="text-[7px] font-bold text-rose-gold">شكراً لتسوقك مع VELIX</p>
                          <p className="text-[6px] text-black/40 mt-0.5">نتمنى أن نكون عند حسن ظنك</p>
                        </div>
                      </div>
                    ))}
                    {pageOrders.length < 4 && Array.from({ length: 4 - pageOrders.length }).map((_, i) => (
                      <div key={`empty-${i}`} className="border border-dashed border-rose-gold/20 rounded-xl bg-rose-gold/5" style={{ height: 'calc(297mm / 2 - 6mm)' }} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <style jsx global>{`
            @media print {
              @page {
                size: A4;
                margin: 4mm;
              }
              body * {
                visibility: hidden;
              }
              .fixed,
              .fixed * {
                visibility: visible;
              }
              .fixed {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                margin: 0;
                padding: 0;
              }
              .print\\:break-after-page {
                break-after: page;
              }
              .print\\:p-0 {
                padding: 0 !important;
              }
              .print\\:p-2 {
                padding: 0.5rem !important;
              }
              .print\\:gap-1\\.5 {
                gap: 0.375rem !important;
              }
              .print\\:shadow-none {
                box-shadow: none !important;
              }
              .grid-cols-2 {
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              }
              .gap-2 {
                gap: 0.375rem !important;
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
}