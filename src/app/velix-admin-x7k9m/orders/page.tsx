'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useOrders } from './hooks/useOrders';
import StatsCards from './components/StatsCards';
import SalesSummary from './components/SalesSummary';
import OrdersTable from './components/OrdersTable';

const ADMIN_SECRET_PATH = process.env.NEXT_PUBLIC_ADMIN_SECRET_PATH || 'velix-admin-x7k9m';

export default function AdminOrdersPage() {
  const {
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
  } = useOrders();

  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: string): Promise<boolean> => {
    setUpdatingId(parseInt(orderId));
    const result = await updateOrderStatus(orderId, newStatus);
    setUpdatingId(null);
    return result;
  };

  const handleDelete = async (orderId: string): Promise<boolean> => {
    const result = await deleteOrder(orderId);
    return result;
  };

  if (!isAuthenticated) return null;
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3F0] pt-28 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-rose-gold/20 border-t-rose-gold rounded-full animate-spin" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F3F0] pt-28 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-black text-black mb-2">حدث خطأ</h2>
          <p className="text-black/70 mb-6">{error}</p>
          <button onClick={fetchOrders} className="px-6 py-2 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold rounded-full">
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-[#FCFCFC] to-[#F5F3F0] pt-20 md:pt-28 pb-12">
      <div className="container mx-auto px-3 md:px-4">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-black">الطلبات</h1>
            <p className="text-rose-gold/60 text-xs md:text-sm font-bold mt-1">إدارة ومتابعة طلبات العملاء</p>
          </div>
          <div className="flex gap-2 md:gap-3">
            <button onClick={fetchOrders} className="px-3 md:px-4 py-1.5 md:py-2 bg-rose-gold/10 hover:bg-rose-gold/20 text-rose-gold rounded-full text-xs md:text-sm">
              🔄 تحديث
            </button>
            <Link href={`/${ADMIN_SECRET_PATH}/print-multi`} className="px-3 md:px-4 py-1.5 md:py-2 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white rounded-full text-xs md:text-sm">
              🖨️ طباعة
            </Link>
            <Link href={`/${ADMIN_SECRET_PATH}`} className="px-3 md:px-4 py-1.5 md:py-2 bg-rose-gold/10 hover:bg-rose-gold/20 text-rose-gold rounded-full text-xs md:text-sm">
              ← العودة
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
              className="w-full p-3 pr-10 bg-white border-2 border-rose-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold text-black font-bold"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-rose-gold">
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <StatsCards stats={stats} activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        
        {/* Sales Summary */}
        <SalesSummary
          totalDeliveredSales={totalDeliveredSales}
          totalCancelledSales={totalCancelledSales}
          deliveredCount={stats.delivered}
          cancelledCount={stats.cancelled}
        />

        {/* Orders Table */}
        <OrdersTable
          orders={filteredOrders}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          updatingId={updatingId}
        />
      </div>
    </div>
  );
}