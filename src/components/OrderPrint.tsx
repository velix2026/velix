// components/OrderPrint.tsx
'use client';

import { useEffect } from 'react';
import { toArabicNumber, formatPrice } from '@/lib/utils';

interface OrderPrintProps {
  order: any;
  onClose: () => void;
}

const getItemDiscountedPrice = (item: any) => {
  if (!item.quantityDiscount?.enabled) return item.price * item.quantity;
  const { tiers } = item.quantityDiscount;
  let applicableTier = null;
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (item.quantity >= tiers[i].minQuantity) {
      applicableTier = tiers[i];
      break;
    }
  }
  if (!applicableTier) return item.price * item.quantity;
  return item.quantity * (item.price - applicableTier.discountPerItem);
};

export default function OrderPrint({ order, onClose }: OrderPrintProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
      setTimeout(() => onClose(), 500);
    }, 200);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] bg-white overflow-auto p-4 print:p-0" style={{ display: 'block' }}>
      <div className="max-w-2xl mx-auto bg-white shadow-xl print:shadow-none" style={{ width: '210mm', minHeight: '297mm', margin: '0 auto' }}>
        {/* زر إغلاق للشاشة فقط */}
        <div className="print:hidden sticky top-0 bg-white p-4 border-b flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">✕ إغلاق</button>
        </div>

        {/* محتوى الفاتورة */}
        <div className="p-8">
          {/* الهيدر */}
          <div className="text-center mb-8 border-b border-black/20 pb-6">
            <h1 className="text-4xl font-black text-black">VELIX</h1>
            <p className="text-black/60 font-bold mt-2">فخامة تسوق تستحقها</p>
            <div className="w-24 h-0.5 bg-gradient-to-r from-emerald-500 to-green-500 mx-auto mt-4" />
          </div>

          {/* معلومات العميل والطلب */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="border border-black/10 rounded-xl p-4">
              <h3 className="font-black text-black mb-3 text-lg border-r-4 border-emerald-500 pr-2">👤 بيانات العميل</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-black">الاسم:</span> {order.customer_name}</p>
                <p><span className="font-black">الهاتف:</span> {order.customer_phone}</p>
                {order.customer_alt_phone && <p><span className="font-black">هاتف آخر:</span> {order.customer_alt_phone}</p>}
                <p><span className="font-black">العنوان:</span> {order.customer_address}</p>
                {order.landmark && <p><span className="font-black">علامة مميزة:</span> {order.landmark}</p>}
              </div>
            </div>
            <div className="border border-black/10 rounded-xl p-4">
              <h3 className="font-black text-black mb-3 text-lg border-r-4 border-emerald-500 pr-2">📋 بيانات الطلب</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-black">رقم الطلب:</span> <span className="font-mono">{order.order_id}</span></p>
                <p><span className="font-black">التاريخ:</span> {new Date(order.created_at).toLocaleDateString('ar-EG')}</p>
                <p><span className="font-black">الساعة:</span> {new Date(order.created_at).toLocaleTimeString('ar-EG')}</p>
                <p><span className="font-black">الحالة:</span> 
                  {order.status === 'delivered' ? '✅ تم التوصيل' : 
                   order.status === 'cancelled' ? '❌ ملغي' :
                   order.status === 'shipped' ? '🚚 تم الشحن' :
                   order.status === 'processing' ? '🔧 قيد التجهيز' :
                   order.status === 'pending' ? '⏳ قيد المعالجة' : order.status}
                </p>
                {order.delivered_at && <p><span className="font-black">📦 تاريخ التسليم:</span> {new Date(order.delivered_at).toLocaleDateString('ar-EG')}</p>}
              </div>
            </div>
          </div>

          {/* المنتجات */}
          <div className="mb-8">
            <h3 className="font-black text-black mb-4 text-lg border-r-4 border-emerald-500 pr-2">🛍️ المنتجات</h3>
            <div className="border border-black/10 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-black/5">
                  <tr>
                    <th className="p-3 text-right font-black">المنتج</th>
                    <th className="p-3 text-center font-black">الكمية</th>
                    <th className="p-3 text-center font-black">السعر</th>
                    <th className="p-3 text-center font-black">الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item: any, idx: number) => {
                    const originalTotal = item.price * item.quantity;
                    const discountedTotal = getItemDiscountedPrice(item);
                    const hasDiscount = discountedTotal < originalTotal;
                    return (
                      <tr key={idx} className="border-t border-black/5">
                        <td className="p-3">
                          <p className="font-black">{item.product_name}</p>
                          {(item.selected_size || item.selected_color) && (
                            <p className="text-xs text-black/60 mt-1">
                              {item.selected_size && `مقاس: ${item.selected_size}  `}
                              {item.selected_color && `لون: ${item.selected_color}`}
                            </p>
                          )}
                        </td>
                        <td className="p-3 text-center font-bold">{toArabicNumber(item.quantity)}</td>
                        <td className="p-3 text-center">{formatPrice(item.price)}</td>
                        <td className="p-3 text-center font-black">
                          {hasDiscount ? (
                            <>
                              <span className="line-through text-black/40 text-xs block">{formatPrice(originalTotal)}</span>
                              <span className="text-green-700">{formatPrice(discountedTotal)}</span>
                            </>
                          ) : formatPrice(originalTotal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-black/5 border-t border-black/10">
                  <tr>
                    <td colSpan={3} className="p-3 text-left font-black">الإجمالي الكلي</td>
                    <td className="p-3 text-center font-black text-lg">{formatPrice(order.total_amount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* رسالة شكر */}
          <div className="text-center border-t border-black/10 pt-6 mt-4">
            <p className="text-black/60 text-sm">شكراً لتسوقك مع VELIX</p>
            <p className="text-black/40 text-xs mt-1">نتمنى أن نكون عند حسن ظنك ❤️</p>
            <div className="mt-4">
              <p className="text-black/30 text-[10px]">VELIX - فخامة تسوق تستحقها</p>
            </div>
          </div>

          {/* تاريخ الطباعة */}
          <div className="text-center mt-6 text-black/30 text-[8px]">
            تمت الطباعة في {new Date().toLocaleString('ar-EG')}
          </div>
        </div>
      </div>
    </div>
  );
}