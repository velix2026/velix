'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toArabicNumber, formatPrice } from '@/lib/utils';

interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  selected_size?: string;
  selected_color?: string;
}

interface Order {
  id: number;
  order_id: string;
  customer_name: string;
  customer_phone: string;
  customer_alt_phone?: string;
  customer_address: string;
  landmark?: string;
  total_amount: number;
  status: string;
  created_at: string;
  delivered_at?: string;
  cancelled_at?: string;
  notes?: string;
  items?: OrderItem[];
}

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'velix@2026';

// حالات الطلب بالترتيب
const orderStatuses = [
  { value: 'pending', label: 'قيد المعالجة', color: 'bg-yellow-100 text-yellow-700', next: 'processing' },
  { value: 'processing', label: 'قيد التجهيز', color: 'bg-blue-100 text-blue-700', next: 'shipped' },
  { value: 'shipped', label: 'تم الشحن', color: 'bg-purple-100 text-purple-700', next: 'delivered' },
  { value: 'delivered', label: 'تم التوصيل', color: 'bg-green-100 text-green-700', next: null },
  { value: 'cancelled', label: 'ملغي', color: 'bg-red-100 text-red-700', next: null },
];

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Order | null>(null);

  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchOrders();
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  // فلترة الطلبات حسب رقم الطلب والحالة
  useEffect(() => {
    let filtered = [...orders];
    
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(order => 
        order.order_id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (activeFilter !== 'all') {
      filtered = filtered.filter(order => order.status === activeFilter);
    }
    
    setFilteredOrders(filtered);
  }, [searchQuery, orders, activeFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${ADMIN_PASSWORD}`,
        },
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setOrders(data);
        setFilteredOrders(data);
      } else {
        setOrders([]);
        setFilteredOrders([]);
        setError('حدث خطأ في تحميل البيانات');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('فشل تحميل الطلبات، حاول مرة أخرى');
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const timestamp = new Date().toISOString();
      const updateData: any = { status: newStatus };
      
      if (newStatus === 'delivered') {
        updateData.delivered_at = timestamp;
      } else if (newStatus === 'cancelled') {
        updateData.cancelled_at = timestamp;
      }
      
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_PASSWORD}`,
        },
        body: JSON.stringify(updateData),
      });

      if (res.ok) {
        await fetchOrders();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  };

  const deleteOrder = async (order: Order) => {
    setDeletingId(order.id);
    
    // ✅ 1. تحديث الواجهة فوراً (optimistic update)
    const newOrders = orders.filter(o => o.id !== order.id);
    setOrders(newOrders);
    
    // تحديث الفلترة
    let filtered = [...newOrders];
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(o => 
        o.order_id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (activeFilter !== 'all') {
      filtered = filtered.filter(o => o.status === activeFilter);
    }
    setFilteredOrders(filtered);
    
    if (selectedOrder?.id === order.id) {
      setSelectedOrder(null);
    }
    setShowDeleteConfirm(null);
    setDeletingId(null);
    
    // ✅ 2. الحذف من الخلفية (لا ننتظر النتيجة)
    try {
      const res = await fetch(`/api/admin/orders/${order.order_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${ADMIN_PASSWORD}`,
        },
      });
      
      if (!res.ok) {
        // لو فشل الحذف، نرجع البيانات ونعرض خطأ
        setOrders(orders);
        setFilteredOrders(
          activeFilter === 'all' 
            ? orders 
            : orders.filter(o => o.status === activeFilter)
        );
        const data = await res.json().catch(() => ({}));
        alert(`❌ حدث خطأ: ${data.error || 'فشل الحذف'}`);
      }
    } catch (error) {
      // لو فشل الاتصال، نرجع البيانات
      setOrders(orders);
      setFilteredOrders(
        activeFilter === 'all' 
          ? orders 
          : orders.filter(o => o.status === activeFilter)
      );
      alert('❌ حدث خطأ في الاتصال');
    }
  };

  const handleStatusChange = async (order: Order, newStatus: string) => {
    setUpdatingStatus(order.id);
    
    const timestamp = new Date().toISOString();
    const updatedOrder = {
      ...order,
      status: newStatus,
      delivered_at: newStatus === 'delivered' ? timestamp : order.delivered_at,
      cancelled_at: newStatus === 'cancelled' ? timestamp : order.cancelled_at,
    };
    
    // ✅ 1. تحديث الواجهة فوراً
    const updatedOrders = orders.map(o => 
      o.id === order.id ? updatedOrder : o
    );
    setOrders(updatedOrders);
    
    // تحديث الفلترة
    let filtered = [...updatedOrders];
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(o => 
        o.order_id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (activeFilter !== 'all') {
      filtered = filtered.filter(o => o.status === activeFilter);
    }
    setFilteredOrders(filtered);
    
    if (selectedOrder?.id === order.id) {
      setSelectedOrder(updatedOrder);
    }
    setUpdatingStatus(null);
    
    // ✅ 2. التحديث في الخلفية
    try {
      const updateData: any = { status: newStatus };
      if (newStatus === 'delivered') {
        updateData.delivered_at = timestamp;
      } else if (newStatus === 'cancelled') {
        updateData.cancelled_at = timestamp;
      }
      
      const res = await fetch(`/api/orders/${order.order_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_PASSWORD}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        // لو فشل التحديث، نرجع الحالة القديمة
        setOrders(orders);
        setFilteredOrders(
          activeFilter === 'all' 
            ? orders 
            : orders.filter(o => o.status === activeFilter)
        );
        alert('حدث خطأ في تحديث حالة الطلب');
      }
    } catch (error) {
      setOrders(orders);
      setFilteredOrders(
        activeFilter === 'all' 
          ? orders 
          : orders.filter(o => o.status === activeFilter)
      );
      alert('حدث خطأ في تحديث حالة الطلب');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = orderStatuses.find(s => s.value === status);
    if (!statusConfig) {
      return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">{status}</span>;
    }
    return <span className={`px-2 py-1 ${statusConfig.color} rounded-full text-xs font-bold`}>{statusConfig.label}</span>;
  };

  // إحصائيات الطلبات
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  const totalDeliveredSales = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total_amount, 0);

  const statCards = [
    { key: 'all', label: '📦 إجمالي الطلبات', value: stats.total, color: 'text-black', bg: 'bg-white' },
    { key: 'pending', label: '⏳ قيد المعالجة', value: stats.pending, color: 'text-yellow-700', bg: 'bg-yellow-50' },
    { key: 'processing', label: '🔧 قيد التجهيز', value: stats.processing, color: 'text-blue-700', bg: 'bg-blue-50' },
    { key: 'shipped', label: '🚚 تم الشحن', value: stats.shipped, color: 'text-purple-700', bg: 'bg-purple-50' },
    { key: 'delivered', label: '✅ تم التوصيل', value: stats.delivered, color: 'text-green-700', bg: 'bg-green-50' },
    { key: 'cancelled', label: '❌ ملغي', value: stats.cancelled, color: 'text-red-700', bg: 'bg-red-50' },
  ];

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-28 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4" />
          <p className="text-black font-bold">جاري تحميل الطلبات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white pt-28 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-black text-black mb-2">حدث خطأ</h2>
          <p className="text-black/60 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-6 py-2 bg-linear-to-r from-emerald-500 via-green-500 to-lime-400 text-white font-bold rounded-full hover:scale-[1.02] transition-all duration-300"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-28 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-black">الطلبات</h1>
            <p className="text-black/50 text-sm font-bold mt-1">إدارة ومتابعة طلبات العملاء</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchOrders}
              className="px-4 py-2 bg-black/5 hover:bg-black/10 text-black rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              تحديث
            </button>
            <Link
              href="/admin"
              className="px-4 py-2 bg-black/5 hover:bg-black/10 text-black rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              العودة للوحة
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 بحث برقم الطلب..."
              className="w-full p-3 pr-10 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black font-bold placeholder:text-black/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/70"
              >
                ✕
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-black/50 mt-2 font-bold">
              تم العثور على {toArabicNumber(filteredOrders.length)} نتيجة
            </p>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {statCards.map((stat) => (
            <button
              key={stat.key}
              onClick={() => setActiveFilter(stat.key === activeFilter ? 'all' : stat.key)}
              className={`${stat.bg} rounded-2xl p-3 shadow-md border transition-all duration-300 ${
                activeFilter === stat.key 
                  ? 'border-black ring-2 ring-black/20 scale-[1.02]' 
                  : 'border-black/10 hover:border-black/30'
              }`}
            >
              <div className={`text-2xl font-black ${stat.color}`}>{toArabicNumber(stat.value)}</div>
              <div className="text-black/60 text-xs font-bold mt-1">{stat.label}</div>
            </button>
          ))}
        </div>

        {/* إجمالي المبيعات */}
        <div className="mb-8 bg-linear-to-r from-green-50 to-emerald-50 rounded-2xl p-4 shadow-md border border-green-200">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-black text-green-700">{formatPrice(totalDeliveredSales)}</div>
              <div className="text-green-600/70 text-sm font-bold mt-1">💰 إجمالي المبيعات (المكتملة)</div>
            </div>
            <div className="text-green-500 text-3xl">💰</div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-md border border-black/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/5">
                <tr>
                  <th className="p-3 text-right font-black text-black">رقم الطلب</th>
                  <th className="p-3 text-right font-black text-black">العميل</th>
                  <th className="p-3 text-right font-black text-black">الهاتف</th>
                  <th className="p-3 text-right font-black text-black">المبلغ</th>
                  <th className="p-3 text-right font-black text-black">الحالة</th>
                  <th className="p-3 text-right font-black text-black">التاريخ</th>
                  <th className="p-3 text-right font-black text-black">تاريخ التسليم/الإلغاء</th>
                  <th className="p-3 text-right font-black text-black">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-black/50 font-bold">
                      {searchQuery ? 'لا توجد طلبات تطابق البحث' : 'لا توجد طلبات حالياً'}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const currentStatusIndex = orderStatuses.findIndex(s => s.value === order.status);
                    const nextStatus = currentStatusIndex < orderStatuses.length - 1 
                      ? orderStatuses[currentStatusIndex + 1] 
                      : null;
                    const completionDate = order.status === 'delivered' ? order.delivered_at : order.status === 'cancelled' ? order.cancelled_at : null;
                    
                    return (
                      <tr key={order.id} className="border-t border-black/5 hover:bg-black/5 transition-all duration-200">
                        <td className="p-3 font-bold text-black">{order.order_id}</td>
                        <td className="p-3 font-bold text-black">{order.customer_name}</td>
                        <td className="p-3 font-bold text-black">{order.customer_phone}</td>
                        <td className="p-3 font-black text-black">{formatPrice(order.total_amount)}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            {getStatusBadge(order.status)}
                            {nextStatus && order.status !== 'cancelled' && order.status !== 'delivered' && (
                              <button
                                onClick={() => handleStatusChange(order, nextStatus.value)}
                                disabled={updatingStatus === order.id}
                                className="text-xs bg-black/5 hover:bg-black/10 text-black px-2 py-1 rounded-full transition-all duration-200 font-bold disabled:opacity-50"
                              >
                                {updatingStatus === order.id ? 'جاري...' : `→ ${nextStatus.label}`}
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-black/60 text-sm font-bold">
                          {new Date(order.created_at).toLocaleDateString('ar-EG')}
                        </td>
                        <td className="p-3 text-black/60 text-sm font-bold">
                          {completionDate ? new Date(completionDate).toLocaleDateString('ar-EG') : '-'}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="text-blue-500 hover:text-blue-600 transition p-1"
                              title="عرض التفاصيل"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(order)}
                              className="text-red-500 hover:text-red-600 transition p-1"
                              title="حذف الطلب"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-black/10" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-black/10 p-4 flex justify-between items-center">
              <h2 className="text-xl font-black text-black">تفاصيل الطلب #{selectedOrder.order_id}</h2>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-black/5 rounded-full transition">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="border-b border-black/10 pb-2">
                <p className="text-xs text-black/50 font-bold">معلومات العميل</p>
                <p className="mt-1"><span className="font-black">الاسم:</span> {selectedOrder.customer_name}</p>
                <p><span className="font-black">الهاتف:</span> {selectedOrder.customer_phone}</p>
                {selectedOrder.customer_alt_phone && <p><span className="font-black">هاتف آخر:</span> {selectedOrder.customer_alt_phone}</p>}
                <p><span className="font-black">العنوان:</span> {selectedOrder.customer_address}</p>
                {selectedOrder.landmark && <p><span className="font-black">علامة مميزة:</span> {selectedOrder.landmark}</p>}
              </div>
              
              <div className="border-b border-black/10 pb-2">
                <p className="text-xs text-black/50 font-bold">معلومات الطلب</p>
                <p className="mt-1"><span className="font-black">المبلغ:</span> {formatPrice(selectedOrder.total_amount)}</p>
                <p><span className="font-black">الحالة:</span> {getStatusBadge(selectedOrder.status)}</p>
                <p><span className="font-black">تاريخ الطلب:</span> {new Date(selectedOrder.created_at).toLocaleString('ar-EG')}</p>
                {selectedOrder.delivered_at && <p><span className="font-black">تاريخ التسليم:</span> {new Date(selectedOrder.delivered_at).toLocaleString('ar-EG')}</p>}
                {selectedOrder.cancelled_at && <p><span className="font-black">تاريخ الإلغاء:</span> {new Date(selectedOrder.cancelled_at).toLocaleString('ar-EG')}</p>}
              </div>
              
              {selectedOrder.notes && (
                <div className="border-b border-black/10 pb-2">
                  <p className="text-xs text-black/50 font-bold">ملاحظات العميل</p>
                  <p className="mt-1 text-black/70">{selectedOrder.notes}</p>
                </div>
              )}
              
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <p className="text-xs text-black/50 font-bold mb-2">المنتجات</p>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="bg-black/5 rounded-xl p-2">
                        <p className="font-black text-sm">{item.product_name}</p>
                        <div className="flex justify-between items-center mt-1 text-xs">
                          <span className="text-black/60">{toArabicNumber(item.quantity)} × {formatPrice(item.price)}</span>
                          {item.selected_size && <span className="text-black/60">مقاس: {item.selected_size}</span>}
                          {item.selected_color && <span className="text-black/60">لون: {item.selected_color}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* تحديث الحالة من المودال */}
              {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                <div className="pt-2 border-t border-black/10">
                  <p className="text-xs text-black/50 font-bold mb-2">تحديث الحالة</p>
                  <div className="flex flex-wrap gap-2">
                    {orderStatuses.map((status) => {
                      const currentIndex = orderStatuses.findIndex(s => s.value === selectedOrder.status);
                      const statusIndex = orderStatuses.findIndex(s => s.value === status.value);
                      if (statusIndex <= currentIndex || status.value === 'cancelled') return null;
                      return (
                        <button
                          key={status.value}
                          onClick={() => {
                            handleStatusChange(selectedOrder, status.value);
                            setSelectedOrder({ ...selectedOrder, status: status.value });
                          }}
                          disabled={updatingStatus === selectedOrder.id}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${status.color} hover:scale-105 disabled:opacity-50`}
                        >
                          {updatingStatus === selectedOrder.id ? 'جاري...' : `تحديث → ${status.label}`}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => {
                        handleStatusChange(selectedOrder, 'cancelled');
                        setSelectedOrder({ ...selectedOrder, status: 'cancelled' });
                      }}
                      disabled={updatingStatus === selectedOrder.id}
                      className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 hover:scale-105 transition-all duration-200 disabled:opacity-50"
                    >
                      إلغاء الطلب
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-black/10" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-black text-black mb-2">تأكيد الحذف</h3>
              <p className="text-black/60 mb-4">
                هل أنت متأكد من حذف الطلب رقم <span className="font-black text-black">{showDeleteConfirm.order_id}</span>؟
                <br />
                <span className="text-sm">لا يمكن التراجع عن هذا الإجراء.</span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => deleteOrder(showDeleteConfirm)}
                  disabled={deletingId === showDeleteConfirm.id}
                  className="flex-1 bg-red-500 text-white font-bold py-2 rounded-xl hover:bg-red-600 transition-all duration-200 disabled:opacity-50"
                >
                  {deletingId === showDeleteConfirm.id ? 'جاري الحذف...' : 'نعم، حذف'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 bg-gray-100 text-black font-bold py-2 rounded-xl hover:bg-gray-200 transition-all duration-200"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}