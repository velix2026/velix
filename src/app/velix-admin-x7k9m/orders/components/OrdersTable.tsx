'use client';

import { useState } from 'react';
import { toArabicNumber, formatPrice } from '@/lib/utils';
import { Order, orderStatuses } from '../hooks/useOrders';
import OrderModal from './OrderModal';
import DeleteConfirm from './DeleteConfirm';

interface OrdersTableProps {
  orders: Order[];
  onStatusChange: (orderId: string, newStatus: string) => Promise<boolean>;
  onDelete: (orderId: string) => Promise<boolean>;
  updatingId: number | null;
}

export default function OrdersTable({ orders, onStatusChange, onDelete, updatingId }: OrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);

  const getStatusBadge = (status: string) => {
    const config = orderStatuses.find(s => s.value === status);
    if (!config) return <span className="px-2 py-1 bg-black/10 rounded-full text-xs font-bold">{status}</span>;
    return <span className={`px-2 py-1 ${config.color} rounded-full text-xs font-bold`}>{config.label}</span>;
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl md:rounded-2xl shadow-md border border-rose-gold/20 p-8 text-center">
        <p className="text-black/70 font-bold">لا توجد طلبات</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl md:rounded-2xl shadow-md border border-rose-gold/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-160 md:min-w-full">
            <thead className="bg-rose-gold/10">
              <tr>
                <th className="p-2 md:p-3 text-right font-black text-black text-xs md:text-sm">رقم الطلب</th>
                <th className="p-2 md:p-3 text-right font-black text-black text-xs md:text-sm">العميل</th>
                <th className="p-2 md:p-3 text-right font-black text-black text-xs md:text-sm hidden sm:table-cell">الهاتف</th>
                <th className="p-2 md:p-3 text-right font-black text-black text-xs md:text-sm">المبلغ</th>
                <th className="p-2 md:p-3 text-right font-black text-black text-xs md:text-sm">الحالة</th>
                <th className="p-2 md:p-3 text-right font-black text-black text-xs md:text-sm hidden md:table-cell">التاريخ</th>
                <th className="p-2 md:p-3 text-right font-black text-black text-xs md:text-sm">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const nextStatus = orderStatuses.find(s => s.value === order.status)?.next;
                const canCancel = order.status !== 'cancelled' && order.status !== 'delivered';
                
                return (
                  <tr key={order.id} className="border-t border-rose-gold/10 hover:bg-rose-gold/5 transition-colors">
                    <td className="p-2 md:p-3 font-black text-black text-xs md:text-sm">{order.order_id}</td>
                    <td className="p-2 md:p-3 font-black text-black text-xs md:text-sm">{order.customer_name}</td>
                    <td className="p-2 md:p-3 font-black text-black text-xs md:text-sm hidden sm:table-cell">{order.customer_phone}</td>
                    <td className="p-2 md:p-3 font-black text-rose-gold text-xs md:text-sm">{formatPrice(order.total_amount)}</td>
                    <td className="p-2 md:p-3">
                      <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                        {getStatusBadge(order.status)}
                        {nextStatus && order.status !== 'cancelled' && order.status !== 'delivered' && (
                          <button
                            onClick={() => onStatusChange(order.order_id, nextStatus)}
                            disabled={updatingId === order.id}
                            className="text-[10px] md:text-xs bg-rose-gold/10 hover:bg-rose-gold/20 text-rose-gold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full transition-colors whitespace-nowrap font-bold"
                          >
                            → {orderStatuses.find(s => s.value === nextStatus)?.label}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="p-2 md:p-3 text-black/70 font-bold text-[10px] md:text-sm hidden md:table-cell">
                      {new Date(order.created_at).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="p-2 md:p-3">
                      <div className="flex gap-1 md:gap-2">
                        <button onClick={() => setSelectedOrder(order)} className="text-rose-gold hover:text-copper p-1 transition-colors" title="عرض التفاصيل">
                          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        {canCancel && (
                          <button onClick={() => onStatusChange(order.order_id, 'cancelled')} disabled={updatingId === order.id} className="text-amber-600 hover:text-amber-800 p-1 transition-colors" title="إلغاء الطلب">
                            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                        <button onClick={() => setDeletingOrder(order)} className="text-red-500 hover:text-red-700 p-1 transition-colors" title="حذف الطلب">
                          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
      
      {deletingOrder && (
        <DeleteConfirm order={deletingOrder} onConfirm={() => onDelete(deletingOrder.order_id)} onClose={() => setDeletingOrder(null)} />
      )}
    </>
  );
}