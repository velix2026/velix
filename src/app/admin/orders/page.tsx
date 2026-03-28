// app/admin/orders/page.tsx (حميها بكلمة سر)
'use client';

import { useState, useEffect } from 'react';

interface Order {
  id: number;
  order_id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) return <div className="p-8 text-center">جاري التحميل...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">الطلبات</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">رقم الطلب</th>
              <th className="p-2 border">العميل</th>
              <th className="p-2 border">الهاتف</th>
              <th className="p-2 border">المبلغ</th>
              <th className="p-2 border">الحالة</th>
              <th className="p-2 border">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border">
                <td className="p-2 border">{order.order_id}</td>
                <td className="p-2 border">{order.customer_name}</td>
                <td className="p-2 border">{order.customer_phone}</td>
                <td className="p-2 border">{order.total_amount} جنيه</td>
                <td className="p-2 border">{order.status}</td>
                <td className="p-2 border">{new Date(order.created_at).toLocaleString('ar-EG')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}