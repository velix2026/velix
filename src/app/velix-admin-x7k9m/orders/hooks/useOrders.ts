'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const ADMIN_SECRET_PATH = process.env.NEXT_PUBLIC_ADMIN_SECRET_PATH || 'velix-admin-x7k9m';
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'velix@2026';

export interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  selected_size?: string;
  selected_color?: string;
}

export interface Order {
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

export const orderStatuses = [
  { value: 'pending', label: 'قيد المعالجة', color: 'bg-amber-100 text-amber-700', next: 'processing' },
  { value: 'processing', label: 'قيد التجهيز', color: 'bg-rose-gold/20 text-rose-gold', next: 'shipped' },
  { value: 'shipped', label: 'تم الشحن', color: 'bg-copper/20 text-copper', next: 'delivered' },
  { value: 'delivered', label: 'تم التوصيل', color: 'bg-emerald-100 text-emerald-700', next: null },
  { value: 'cancelled', label: 'ملغي', color: 'bg-red-100 text-red-700', next: null },
];

export function useOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // ✅ التحقق من الجلسة
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

  // ✅ جلب الطلبات مع console.log
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    console.log('🔍 [fetchOrders] Starting...');
    
    try {
      const res = await fetch(`/api/${ADMIN_SECRET_PATH}/orders`, {
        headers: {
          'Authorization': `Bearer ${ADMIN_PASSWORD}`
        }
      });
      
      console.log('🔍 [fetchOrders] Response status:', res.status);
      
      if (!res.ok) {
        if (res.status === 401) {
          console.log('🔒 [fetchOrders] Unauthorized, redirecting to login');
          router.push(`/${ADMIN_SECRET_PATH}/login`);
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }
      
      const data = await res.json();
      
      // ✅ console.log مفصلة للبيانات
      console.log('📦 [fetchOrders] ====== START ======');
      console.log('📦 typeof data:', typeof data);
      console.log('📦 Is array?', Array.isArray(data));
      console.log('📦 data:', data);
      
      if (Array.isArray(data)) {
        console.log('📦 Array length:', data.length);
        
        if (data.length > 0) {
          console.log('📦 First order:', data[0]);
          console.log('📦 First order keys:', Object.keys(data[0]));
          console.log('📦 First order status:', data[0]?.status);
          console.log('📦 First order total_amount:', data[0]?.total_amount);
          console.log('📦 First order total_amount type:', typeof data[0]?.total_amount);
        }
        
        setOrders(data);
        setFilteredOrders(data);
      } else {
        console.error('❌ Data is NOT an array! It is:', typeof data);
        console.error('❌ Data content:', data);
        setOrders([]);
        setFilteredOrders([]);
      }
      
      console.log('📦 [fetchOrders] ====== END ======');
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      setError('فشل تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  }, [router]);

  // ✅ تحديث حالة الطلب
  const updateOrderStatus = useCallback(async (orderId: string, newStatus: string) => {
    console.log('🔍 [updateOrderStatus] Order:', orderId, 'New status:', newStatus);
    
    try {
      const timestamp = new Date().toISOString();
      const updateData: any = { status: newStatus };
      if (newStatus === 'delivered') updateData.delivered_at = timestamp;
      else if (newStatus === 'cancelled') updateData.cancelled_at = timestamp;
      
      const res = await fetch(`/api/${ADMIN_SECRET_PATH}/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_PASSWORD}`
        },
        body: JSON.stringify(updateData),
      });
      
      console.log('🔍 [updateOrderStatus] Response status:', res.status);
      
      if (res.ok) {
        console.log('✅ Order status updated successfully');
        await fetchOrders();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  }, [fetchOrders]);

  // ✅ حذف طلب
  const deleteOrder = useCallback(async (orderId: string) => {
    console.log('🔍 [deleteOrder] Order:', orderId);
    
    try {
      const res = await fetch(`/api/${ADMIN_SECRET_PATH}/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${ADMIN_PASSWORD}`
        }
      });
      
      console.log('🔍 [deleteOrder] Response status:', res.status);
      
      if (res.ok) {
        console.log('✅ Order deleted successfully');
        await fetchOrders();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting order:', error);
      return false;
    }
  }, [fetchOrders]);

  // ✅ فلترة الطلبات
  useEffect(() => {
    console.log('🔍 [filter] Orders changed, filtering...');
    let filtered = [...orders];
    
    if (searchQuery.trim()) {
      filtered = filtered.filter(order => 
        order.order_id.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log('🔍 [filter] After search filter:', filtered.length);
    }
    
    if (activeFilter !== 'all') {
      filtered = filtered.filter(order => order.status === activeFilter);
      console.log('🔍 [filter] After status filter:', filtered.length);
    }
    
    setFilteredOrders(filtered);
  }, [searchQuery, orders, activeFilter]);

  // ✅ إحصائيات مع console.log
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o?.status === 'pending').length,
    processing: orders.filter(o => o?.status === 'processing').length,
    shipped: orders.filter(o => o?.status === 'shipped').length,
    delivered: orders.filter(o => o?.status === 'delivered').length,
    cancelled: orders.filter(o => o?.status === 'cancelled').length,
  };

  console.log('📊 [stats] ====== START ======');
  console.log('📊 orders.length:', orders.length);
  console.log('📊 stats:', stats);
  console.log('📊 All order statuses:', orders.map(o => o?.status));
  console.log('📊 [stats] ====== END ======');

  const totalDeliveredSales = orders
    .filter(o => o?.status === 'delivered')
    .reduce((sum, order) => sum + (order?.total_amount || 0), 0);

  const totalCancelledSales = orders
    .filter(o => o?.status === 'cancelled')
    .reduce((sum, order) => sum + (order?.total_amount || 0), 0);

  console.log('💰 totalDeliveredSales:', totalDeliveredSales);
  console.log('💰 totalCancelledSales:', totalCancelledSales);

  return {
    orders,
    filteredOrders,
    loading,
    error,
    isAuthenticated,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    stats,
    totalDeliveredSales,
    totalCancelledSales,
    fetchOrders,
    updateOrderStatus,
    deleteOrder,
  };
}