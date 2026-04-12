// app/admin/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePWA } from '@/components/AdminPWAProvider';

export default function AdminDashboard() {
  const router = useRouter();
  const { showInstall, handleInstall, notificationPermission, requestNotificationPermission, isOnline } = usePWA();
  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    subscribers: 0,
    revenue: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'velix@2026';
      const ordersRes = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${password}` },
      });
      const orders = await ordersRes.json();
      
      const productsRes = await fetch('/api/products');
      const products = await productsRes.json();
      
      const revenue = orders
        .filter((o: any) => o.status === 'delivered')
        .reduce((sum: number, o: any) => sum + o.total_amount, 0);
      
      setStats({
        orders: orders.length,
        products: products.length,
        subscribers: 0,
        revenue: revenue,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    router.push('/admin/login');
  };

  const menuItems = [
    { title: 'الطلبات', icon: '🛒', href: '/admin/orders', color: 'bg-blue-500', count: stats.orders },
    { title: 'المنتجات', icon: '👕', href: '/admin/products', color: 'bg-green-500', count: stats.products },
    { title: 'المشتركين', icon: '📧', href: '/admin/newsletter', color: 'bg-purple-500', count: stats.subscribers },
    { title: 'الإيرادات', icon: '💰', href: '#', color: 'bg-emerald-500', count: `${stats.revenue.toLocaleString()} ج.م` },
  ];

  return (
    <div className="min-h-screen bg-black pt-20 pb-24">
      <div className="container mx-auto px-4 max-w-md">
        {/* حالة الاتصال */}
        {!isOnline && (
          <div className="mb-4 bg-red-500/20 border border-red-500 rounded-xl p-3 text-center">
            <p className="text-red-400 font-bold text-sm">⚠️ لا يوجد اتصال بالإنترنت - بيانات مخزنة مؤقتاً</p>
          </div>
        )}

        {/* زر تثبيت التطبيق */}
        {showInstall && (
          <button
            onClick={handleInstall}
            className="w-full mb-4 bg-emerald-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            📲 تثبيت تطبيق VELIX Admin
          </button>
        )}

        {/* زر تفعيل الإشعارات */}
        {notificationPermission !== 'granted' && (
          <button
            onClick={requestNotificationPermission}
            className="w-full mb-4 bg-blue-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            🔔 تفعيل الإشعارات
          </button>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-black text-white">VELIX</h1>
            <p className="text-white/50 text-sm font-bold">لوحة التحكم</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-bold"
          >
            تسجيل خروج
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className={`${item.color} rounded-2xl p-4 text-white hover:scale-[1.02] transition-all duration-300`}
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-2xl font-black">{item.count}</div>
              <div className="text-xs opacity-80 font-bold">{item.title}</div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-white font-bold mb-3 text-lg">إجراءات سريعة</h2>
          <div className="grid grid-cols-3 gap-3">
            <Link href="/admin" className="bg-black border border-white/20 rounded-xl p-3 text-center text-white">
              <div className="text-2xl mb-1">➕</div>
              <div className="text-xs font-bold">إضافة منتج</div>
            </Link>
            <Link href="/admin/orders" className="bg-black border border-white/20 rounded-xl p-3 text-center text-white">
              <div className="text-2xl mb-1">📋</div>
              <div className="text-xs font-bold">الطلبات</div>
            </Link>
            <Link href="/admin/newsletter" className="bg-black border border-white/20 rounded-xl p-3 text-center text-white">
              <div className="text-2xl mb-1">📢</div>
              <div className="text-xs font-bold">نشرة</div>
            </Link>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 py-2">
          <div className="flex justify-around items-center max-w-md mx-auto">
            <Link href="/admin/dashboard" className="text-white flex flex-col items-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
              </svg>
              <span className="text-[10px]">الرئيسية</span>
            </Link>
            <Link href="/admin/orders" className="text-white/50 flex flex-col items-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              <span className="text-[10px]">الطلبات</span>
            </Link>
            <Link href="/admin/products" className="text-white/50 flex flex-col items-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"/>
              </svg>
              <span className="text-[10px]">المنتجات</span>
            </Link>
            <Link href="/admin" className="text-white/50 flex flex-col items-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
              </svg>
              <span className="text-[10px]">إضافة</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}