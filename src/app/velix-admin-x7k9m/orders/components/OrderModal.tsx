'use client';

import Link from 'next/link';
import { formatPrice, toArabicNumber } from '@/lib/utils';
import { Order, orderStatuses } from '../hooks/useOrders';

const ADMIN_SECRET_PATH = process.env.NEXT_PUBLIC_ADMIN_SECRET_PATH || 'velix-admin-x7k9m';

interface OrderModalProps {
  order: Order;
  onClose: () => void;
}

export default function OrderModal({ order, onClose }: OrderModalProps) {
  const getStatusBadge = (status: string) => {
    const config = orderStatuses.find(s => s.value === status);
    return <span className={`px-2 py-1 ${config?.color} rounded-full text-xs font-bold`}>{config?.label}</span>;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4" onClick={onClose}>
      <div className="bg-white rounded-xl md:rounded-2xl max-w-[95%] md:max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-rose-gold/20" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-rose-gold/20 p-3 md:p-4 flex justify-between items-center">
          <h2 className="text-base md:text-xl font-black text-black">تفاصيل الطلب #{order.order_id}</h2>
          <button onClick={onClose} className="p-1.5 md:p-2 hover:bg-rose-gold/10 rounded-full transition-colors">
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-3 md:p-4 space-y-2 md:space-y-3">
          {/* معلومات العميل */}
          <div className="border-b border-rose-gold/20 pb-2">
            <p className="text-[10px] md:text-xs font-black text-rose-gold">👤 معلومات العميل</p>
            <p><span className="font-black">الاسم:</span> {order.customer_name}</p>
            <p><span className="font-black">الهاتف:</span> {order.customer_phone}</p>
            {order.customer_alt_phone && <p><span className="font-black">هاتف آخر:</span> {order.customer_alt_phone}</p>}
            <p><span className="font-black">العنوان:</span> {order.customer_address}</p>
            {order.landmark && <p><span className="font-black">علامة مميزة:</span> {order.landmark}</p>}
          </div>
          
          {/* معلومات الطلب */}
          <div className="border-b border-rose-gold/20 pb-2">
            <p className="text-[10px] md:text-xs font-black text-rose-gold">📋 معلومات الطلب</p>
            <p><span className="font-black">المبلغ:</span> <span className="font-bold text-rose-gold">{formatPrice(order.total_amount)}</span></p>
            <p><span className="font-black">الحالة:</span> {getStatusBadge(order.status)}</p>
            <p><span className="font-black">التاريخ:</span> {new Date(order.created_at).toLocaleString('ar-EG')}</p>
            {order.delivered_at && <p><span className="font-black">📦 تاريخ التسليم:</span> <span className="text-emerald-700">{new Date(order.delivered_at).toLocaleString('ar-EG')}</span></p>}
            {order.cancelled_at && <p><span className="font-black">❌ تاريخ الإلغاء:</span> <span className="text-red-600">{new Date(order.cancelled_at).toLocaleString('ar-EG')}</span></p>}
          </div>
          
          {/* ملاحظات */}
          {order.notes && (
            <div className="border-b border-rose-gold/20 pb-2">
              <p className="text-[10px] md:text-xs font-black text-rose-gold">📝 ملاحظات العميل</p>
              <p className="font-bold">{order.notes}</p>
            </div>
          )}
          
          {/* المنتجات */}
          {order.items && order.items.length > 0 && (
            <div>
              <p className="text-[10px] md:text-xs font-black text-rose-gold mb-2">🛍️ المنتجات</p>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="bg-rose-gold/5 rounded-xl p-2 border border-rose-gold/20">
                    <p className="font-black text-black text-sm md:text-base">{item.product_name}</p>
                    <div className="flex justify-between items-center mt-1 text-[10px] md:text-xs">
                      <div className="font-bold text-black">
                        {toArabicNumber(item.quantity)} × {formatPrice(item.price)}
                      </div>
                      <div className="flex gap-2 font-bold text-black">
                        {item.selected_size && <span>مقاس: {item.selected_size}</span>}
                        {item.selected_color && <span>لون: {item.selected_color}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="sticky bottom-0 bg-white border-t border-rose-gold/20 p-3 md:p-4">
          <Link href={`/${ADMIN_SECRET_PATH}/print-multi?selected=${order.order_id}`} className="w-full bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold py-2 md:py-2.5 rounded-xl text-sm md:text-base hover:scale-[1.02] transition-all text-center block shadow-md">
            🖨️ طباعة الفاتورة
          </Link>
        </div>
      </div>
    </div>
  );
}