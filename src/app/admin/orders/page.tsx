'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toArabicNumber } from '@/lib/utils';
import OrderPrint from '@/components/OrderPrint';

// دالة مؤقتة لتنسيق السعر بشكل صحيح
const formatPriceCorrect = (price: number) => {
  if (isNaN(price)) return '٠ ج.م';
  const formatted = price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  // تحويل الأرقام الإنجليزية إلى عربية
  const arabicNumbers = formatted.replace(/\d/g, (d) => {
    return '٠١٢٣٤٥٦٧٨٩'[parseInt(d)];
  });
  return `${arabicNumbers} ج.م`;
};

interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  selected_size?: string;
  selected_color?: string;
  quantityDiscount?: {
    enabled: boolean;
    tiers: Array<{
      minQuantity: number;
      discountPerItem: number;
    }>;
  };
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

const orderStatuses = [
  { value: 'pending', label: 'قيد المعالجة', color: 'bg-yellow-100 text-yellow-700', next: 'processing' },
  { value: 'processing', label: 'قيد التجهيز', color: 'bg-blue-100 text-blue-700', next: 'shipped' },
  { value: 'shipped', label: 'تم الشحن', color: 'bg-purple-100 text-purple-700', next: 'delivered' },
  { value: 'delivered', label: 'تم التوصيل', color: 'bg-green-100 text-green-700', next: null },
  { value: 'cancelled', label: 'ملغي', color: 'bg-red-100 text-red-700', next: null },
];

const getItemDiscountedPrice = (item: OrderItem) => {
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
  const [showPrint, setShowPrint] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchOrders();
    } else {
      router.push('/admin/login');
    }
  }, [router]);

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
        headers: { 'Authorization': `Bearer ${ADMIN_PASSWORD}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
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
      if (newStatus === 'delivered') updateData.delivered_at = timestamp;
      else if (newStatus === 'cancelled') updateData.cancelled_at = timestamp;
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ADMIN_PASSWORD}` },
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

  const cancelOrder = async (order: Order) => {
    if (order.status === 'cancelled') {
      alert('الطلب ملغي بالفعل');
      return;
    }
    if (order.status === 'delivered') {
      alert('لا يمكن إلغاء طلب تم تسليمه');
      return;
    }
    
    const confirmed = confirm(`هل أنت متأكد من إلغاء الطلب رقم ${order.order_id}؟`);
    if (!confirmed) return;
    
    setUpdatingStatus(order.id);
    const success = await updateOrderStatus(order.order_id, 'cancelled');
    setUpdatingStatus(null);
    
    if (!success) {
      alert('حدث خطأ في إلغاء الطلب');
    }
  };

  const deleteOrder = async (order: Order) => {
    setDeletingId(order.id);
    const newOrders = orders.filter(o => o.id !== order.id);
    setOrders(newOrders);
    let filtered = [...newOrders];
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(o => o.order_id.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (activeFilter !== 'all') filtered = filtered.filter(o => o.status === activeFilter);
    setFilteredOrders(filtered);
    if (selectedOrder?.id === order.id) setSelectedOrder(null);
    setShowDeleteConfirm(null);
    setDeletingId(null);
    try {
      const res = await fetch(`/api/admin/orders/${order.order_id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${ADMIN_PASSWORD}` },
      });
      if (!res.ok) {
        setOrders(orders);
        setFilteredOrders(activeFilter === 'all' ? orders : orders.filter(o => o.status === activeFilter));
        alert('❌ فشل الحذف');
      }
    } catch { alert('❌ حدث خطأ في الاتصال'); }
  };

  const handleStatusChange = async (order: Order, newStatus: string) => {
    setUpdatingStatus(order.id);
    const timestamp = new Date().toISOString();
    const updatedOrder = { ...order, status: newStatus,
      delivered_at: newStatus === 'delivered' ? timestamp : order.delivered_at,
      cancelled_at: newStatus === 'cancelled' ? timestamp : order.cancelled_at,
    };
    const updatedOrders = orders.map(o => o.id === order.id ? updatedOrder : o);
    setOrders(updatedOrders);
    let filtered = [...updatedOrders];
    if (searchQuery.trim() !== '') filtered = filtered.filter(o => o.order_id.toLowerCase().includes(searchQuery.toLowerCase()));
    if (activeFilter !== 'all') filtered = filtered.filter(o => o.status === activeFilter);
    setFilteredOrders(filtered);
    if (selectedOrder?.id === order.id) setSelectedOrder(updatedOrder);
    setUpdatingStatus(null);
    try {
      const updateData: any = { status: newStatus };
      if (newStatus === 'delivered') updateData.delivered_at = timestamp;
      else if (newStatus === 'cancelled') updateData.cancelled_at = timestamp;
      const res = await fetch(`/api/orders/${order.order_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ADMIN_PASSWORD}` },
        body: JSON.stringify(updateData),
      });
      if (!res.ok) {
        setOrders(orders);
        setFilteredOrders(activeFilter === 'all' ? orders : orders.filter(o => o.status === activeFilter));
        alert('حدث خطأ في تحديث حالة الطلب');
      }
    } catch { alert('حدث خطأ في تحديث حالة الطلب'); }
  };

  const getStatusBadge = (status: string) => {
    const config = orderStatuses.find(s => s.value === status);
    if (!config) return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">{status}</span>;
    return <span className={`px-2 py-1 ${config.color} rounded-full text-xs font-bold`}>{config.label}</span>;
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  // حساب إجمالي المبيعات المكتملة (مجموع واحد)
  const totalDeliveredSales = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, order) => sum + order.total_amount, 0);

  // حساب إجمالي المبيعات الملغية (مجموع واحد)
  const totalCancelledSales = orders
    .filter(o => o.status === 'cancelled')
    .reduce((sum, order) => sum + order.total_amount, 0);

  const statCards = [
    { key: 'all', label: '📦 إجمالي الطلبات', value: stats.total, color: 'text-black', bg: 'bg-white' },
    { key: 'pending', label: '⏳ قيد المعالجة', value: stats.pending, color: 'text-yellow-700', bg: 'bg-yellow-50' },
    { key: 'processing', label: '🔧 قيد التجهيز', value: stats.processing, color: 'text-blue-700', bg: 'bg-blue-50' },
    { key: 'shipped', label: '🚚 تم الشحن', value: stats.shipped, color: 'text-purple-700', bg: 'bg-purple-50' },
    { key: 'delivered', label: '✅ تم التوصيل', value: stats.delivered, color: 'text-green-700', bg: 'bg-green-50' },
    { key: 'cancelled', label: '❌ ملغي', value: stats.cancelled, color: 'text-red-700', bg: 'bg-red-50' },
  ];

  if (!isAuthenticated) return null;
  
  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-28">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent absolute top-0 left-0"></div>
            </div>
            <p className="text-black font-bold text-lg mt-6">جاري تحميل الطلبات...</p>
            <p className="text-black/60 text-sm mt-2">يرجى الانتظار قليلاً</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-white pt-28">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-xl font-black text-black mb-2">حدث خطأ</h2>
              <p className="text-black/70 mb-6 font-bold">{error}</p>
              <button 
                onClick={fetchOrders} 
                className="px-6 py-2 bg-linear-to-r from-emerald-500 via-green-500 to-lime-400 text-white font-bold rounded-full hover:shadow-lg transition-shadow"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20 md:pt-28 pb-12">
      <div className="container mx-auto px-3 md:px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 md:mb-8">
          <div className="text-center sm:text-right">
            <h1 className="text-2xl md:text-3xl font-black text-black">الطلبات</h1>
            <p className="text-black/70 text-xs md:text-sm font-bold mt-1">إدارة ومتابعة طلبات العملاء</p>
          </div>
          <div className="flex gap-2 md:gap-3">
            <button 
              onClick={fetchOrders} 
              className="px-3 md:px-4 py-1.5 md:py-2 bg-black/5 hover:bg-black/10 text-black font-bold rounded-full text-xs md:text-sm flex items-center gap-1 md:gap-2 transition-colors"
            >
              🔄 <span className="hidden sm:inline">تحديث</span>
            </button>
            <Link 
              href="/admin" 
              className="px-3 md:px-4 py-1.5 md:py-2 bg-black/5 hover:bg-black/10 text-black font-bold rounded-full text-xs md:text-sm flex items-center gap-1 md:gap-2 transition-colors"
            >
              ← <span className="hidden sm:inline">العودة للوحة</span>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-full sm:max-w-md">
            <input 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="🔍 بحث برقم الطلب..." 
              className="w-full p-3 pr-10 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-black font-bold text-sm md:text-base" 
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-black font-bold"
              >
                ✕
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-black/70 font-bold mt-2">تم العثور على {toArabicNumber(filteredOrders.length)} نتيجة</p>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3 mb-6 md:mb-8">
          {statCards.map(stat => (
            <button 
              key={stat.key} 
              onClick={() => setActiveFilter(stat.key === activeFilter ? 'all' : stat.key)} 
              className={`${stat.bg} rounded-xl md:rounded-2xl p-2 md:p-3 shadow-md border transition-all duration-300 ${activeFilter === stat.key ? 'border-black ring-2 ring-black/20 scale-[1.02]' : 'border-black/20'}`}
            >
              <div className={`text-lg md:text-2xl font-black ${stat.color}`}>{toArabicNumber(stat.value)}</div>
              <div className="text-black/70 text-[10px] md:text-xs font-bold mt-1 leading-tight">{stat.label}</div>
            </button>
          ))}
        </div>

        {/* Sales Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
          {/* Completed Sales Card */}
          <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-xl md:rounded-2xl p-3 md:p-5 shadow-md border border-green-200">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <div className="text-xl md:text-3xl font-black text-green-700 mb-1">
                  {formatPriceCorrect(totalDeliveredSales)}
                </div>
                <div className="text-green-700 text-xs md:text-sm font-bold">💰 إجمالي المبيعات المكتملة</div>
                <div className="text-green-700/70 text-[10px] md:text-xs font-bold mt-1 md:mt-2">
                  {toArabicNumber(stats.delivered)} طلب مكتمل
                </div>
              </div>
              <div className="text-3xl md:text-5xl text-green-500">💰</div>
            </div>
          </div>

          {/* Cancelled Sales Card */}
          <div className="bg-linear-to-r from-red-50 to-rose-50 rounded-xl md:rounded-2xl p-3 md:p-5 shadow-md border border-red-200">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <div className="text-xl md:text-3xl font-black text-red-700 mb-1">
                  {formatPriceCorrect(totalCancelledSales)}
                </div>
                <div className="text-red-700 text-xs md:text-sm font-bold">❌ إجمالي المبيعات الملغية</div>
                <div className="text-red-700/70 text-[10px] md:text-xs font-bold mt-1 md:mt-2">
                  {toArabicNumber(stats.cancelled)} طلب ملغي
                </div>
              </div>
              <div className="text-3xl md:text-5xl text-red-500">❌</div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-md border border-black/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-160 md:min-w-full">
              <thead className="bg-black/10">
                <tr>
                  <th className="p-2 md:p-3 text-right font-black text-black text-xs md:text-sm">رقم الطلب</th>
                  <th className="p-2 md:p-3 text-right font-black text-black text-xs md:text-sm">العميل</th>
                  <th className="p-2 md:p-3 text-right font-black text-black text-xs md:text-sm hidden sm:table-cell">الهاتف</th>
                  <th className="p-2 md:p-3 text-right font-black text-black text-xs md:text-sm">المبلغ</th>
                  <th className="p-2 md:p-3 text-right font-black text-black text-xs md:text-sm">الحالة</th>
                  <th className="p-2 md:p-3 text-right font-black text-black text-xs md:text-sm hidden md:table-cell">التاريخ</th>
                  <th className="p-2 md:p-3 text-right font-black text-black text-xs md:text-sm hidden lg:table-cell">تاريخ التسليم/الإلغاء</th>
                  <th className="p-2 md:p-3 text-right font-black text-black text-xs md:text-sm">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 md:p-8 text-center text-black/70 font-bold text-sm">
                      لا توجد طلبات
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(order => {
                    const nextStatus = orderStatuses.find(s => s.value === order.status)?.next;
                    const completionDate = order.status === 'delivered' ? order.delivered_at : order.status === 'cancelled' ? order.cancelled_at : null;
                    const canCancel = order.status !== 'cancelled' && order.status !== 'delivered';
                    
                    return (
                      <tr key={order.id} className="border-t border-black/10 hover:bg-black/5 transition-colors">
                        <td className="p-2 md:p-3 font-black text-black text-xs md:text-sm">{order.order_id}</td>
                        <td className="p-2 md:p-3 font-black text-black text-xs md:text-sm">{order.customer_name}</td>
                        <td className="p-2 md:p-3 font-black text-black text-xs md:text-sm hidden sm:table-cell">{order.customer_phone}</td>
                        <td className="p-2 md:p-3 font-black text-black text-xs md:text-sm">{formatPriceCorrect(order.total_amount)}</td>
                        <td className="p-2 md:p-3">
                          <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                            {getStatusBadge(order.status)}
                            {nextStatus && order.status !== 'cancelled' && order.status !== 'delivered' && (
                              <button 
                                onClick={() => handleStatusChange(order, nextStatus)} 
                                disabled={updatingStatus === order.id} 
                                className="text-[10px] md:text-xs bg-black/10 hover:bg-black/20 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full transition-colors whitespace-nowrap text-black font-bold"
                              >
                                → {orderStatuses.find(s => s.value === nextStatus)?.label}
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="p-2 md:p-3 text-black/70 font-bold text-[10px] md:text-sm hidden md:table-cell">
                          {new Date(order.created_at).toLocaleDateString('ar-EG')}
                        </td>
                        <td className="p-2 md:p-3 text-black/70 font-bold text-[10px] md:text-sm hidden lg:table-cell">
                          {completionDate ? new Date(completionDate).toLocaleDateString('ar-EG') : '-'}
                        </td>
                        <td className="p-2 md:p-3">
                          <div className="flex gap-1 md:gap-2">
                            <button 
                              onClick={() => setSelectedOrder(order)} 
                              className="text-blue-600 hover:text-blue-800 p-1 transition-colors font-bold" 
                              title="عرض التفاصيل"
                            >
                              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            {canCancel && (
                              <button 
                                onClick={() => cancelOrder(order)} 
                                disabled={updatingStatus === order.id}
                                className="text-orange-600 hover:text-orange-800 p-1 transition-colors font-bold" 
                                title="إلغاء الطلب"
                              >
                                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            )}
                            <button 
                              onClick={() => setShowDeleteConfirm(order)} 
                              className="text-red-600 hover:text-red-800 p-1 transition-colors font-bold"
                              title="حذف الطلب"
                            >
                              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-xl md:rounded-2xl max-w-[95%] md:max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-black/20" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-black/10 p-3 md:p-4 flex justify-between items-center">
              <h2 className="text-base md:text-xl font-black text-black">تفاصيل الطلب #{selectedOrder.order_id}</h2>
              <div className="flex gap-1 md:gap-2">
                <button onClick={() => setShowPrint(true)} className="p-1.5 md:p-2 hover:bg-black/5 rounded-full transition-colors" title="طباعة">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                </button>
                <button onClick={() => setSelectedOrder(null)} className="p-1.5 md:p-2 hover:bg-black/5 rounded-full transition-colors">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-3 md:p-4 space-y-2 md:space-y-3">
              <div className="border-b border-black/10 pb-2">
                <p className="text-[10px] md:text-xs font-black text-black">👤 معلومات العميل</p>
                <p className="text-sm md:text-base"><span className="font-black text-black">الاسم:</span> <span className="font-bold text-black">{selectedOrder.customer_name}</span></p>
                <p className="text-sm md:text-base"><span className="font-black text-black">الهاتف:</span> <span className="font-bold text-black">{selectedOrder.customer_phone}</span></p>
                {selectedOrder.customer_alt_phone && <p className="text-sm md:text-base"><span className="font-black text-black">هاتف آخر:</span> <span className="font-bold text-black">{selectedOrder.customer_alt_phone}</span></p>}
                <p className="text-sm md:text-base"><span className="font-black text-black">العنوان:</span> <span className="font-bold text-black">{selectedOrder.customer_address}</span></p>
                {selectedOrder.landmark && <p className="text-sm md:text-base"><span className="font-black text-black">علامة مميزة:</span> <span className="font-bold text-black">{selectedOrder.landmark}</span></p>}
              </div>
              <div className="border-b border-black/10 pb-2">
                <p className="text-[10px] md:text-xs font-black text-black">📋 معلومات الطلب</p>
                <p className="text-sm md:text-base"><span className="font-black text-black">رقم الطلب:</span> <span className="font-bold text-black">{selectedOrder.order_id}</span></p>
                <p className="text-sm md:text-base"><span className="font-black text-black">المبلغ:</span> <span className="font-bold text-black">{formatPriceCorrect(selectedOrder.total_amount)}</span></p>
                <p className="text-sm md:text-base"><span className="font-black text-black">الحالة:</span> {getStatusBadge(selectedOrder.status)}</p>
                <p className="text-sm md:text-base"><span className="font-black text-black">التاريخ:</span> <span className="font-bold text-black">{new Date(selectedOrder.created_at).toLocaleString('ar-EG')}</span></p>
                {selectedOrder.delivered_at && (
                  <p className="text-sm md:text-base">
                    <span className="font-black text-black">📦 تاريخ التسليم:</span> 
                    <span className="font-bold text-green-700"> {new Date(selectedOrder.delivered_at).toLocaleString('ar-EG')}</span>
                  </p>
                )}
                {selectedOrder.cancelled_at && (
                  <p className="text-sm md:text-base">
                    <span className="font-black text-black">❌ تاريخ الإلغاء:</span> 
                    <span className="font-bold text-red-600"> {new Date(selectedOrder.cancelled_at).toLocaleString('ar-EG')}</span>
                  </p>
                )}
              </div>
              {selectedOrder.notes && (
                <div className="border-b border-black/10 pb-2">
                  <p className="text-[10px] md:text-xs font-black text-black">📝 ملاحظات العميل</p>
                  <p className="text-sm md:text-base font-bold text-black">{selectedOrder.notes}</p>
                </div>
              )}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <p className="text-[10px] md:text-xs font-black text-black mb-2">🛍️ المنتجات</p>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => {
                      const discounted = getItemDiscountedPrice(item);
                      return (
                        <div key={idx} className="bg-black/5 rounded-xl p-2">
                          <p className="font-black text-black text-sm md:text-base">{item.product_name}</p>
                          <div className="flex justify-between items-center mt-1 text-[10px] md:text-xs">
                            <div className="font-bold text-black">
                              <span>{toArabicNumber(item.quantity)} × {formatPriceCorrect(item.price)}</span>
                              {discounted < item.price * item.quantity && (
                                <span className="text-green-700 mr-2 font-bold">← {formatPriceCorrect(discounted)}</span>
                              )}
                            </div>
                            <div className="flex gap-2 font-bold text-black">
                              {item.selected_size && <span>مقاس: {item.selected_size}</span>}
                              {item.selected_color && <span>لون: {item.selected_color}</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="sticky bottom-0 bg-white border-t border-black/10 p-3 md:p-4">
              <button onClick={() => setShowPrint(true)} className="w-full bg-linear-to-r from-emerald-500 via-green-500 to-lime-400 text-white font-bold py-2 md:py-2.5 rounded-xl text-sm md:text-base hover:shadow-lg transition-all">
                🖨️ طباعة الفاتورة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl max-w-[90%] md:max-w-sm w-full p-4 md:p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="text-5xl md:text-6xl mb-4">⚠️</div>
            <h3 className="text-lg md:text-xl font-black text-black mb-2">تأكيد الحذف</h3>
            <p className="text-black/60 text-sm md:text-base mb-4">هل أنت متأكد من حذف الطلب رقم {showDeleteConfirm.order_id}؟</p>
            <div className="flex gap-3">
              <button onClick={() => deleteOrder(showDeleteConfirm)} className="flex-1 bg-red-500 text-white py-2 rounded-xl text-sm md:text-base hover:bg-red-600 transition-colors">
                نعم، حذف
              </button>
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 bg-gray-100 py-2 rounded-xl text-sm md:text-base hover:bg-gray-200 transition-colors">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Component */}
      {showPrint && selectedOrder && <OrderPrint order={selectedOrder} onClose={() => setShowPrint(false)} />}
    </div>
  );
}