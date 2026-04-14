'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toArabicNumber } from '@/lib/utils';

const ADMIN_SECRET_PATH = process.env.NEXT_PUBLIC_ADMIN_SECRET_PATH || 'velix-admin-x7k9m';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    subscribers: 0,
    revenue: 0,
  });

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
      fetchStats();
    } else {
      router.push(`/${ADMIN_SECRET_PATH}/login`);
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchStats = async () => {
    try {
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'velix@2026';
      
      const ordersRes = await fetch(`/api/${ADMIN_SECRET_PATH}/orders`, {
        headers: { 'Authorization': `Bearer ${adminPassword}` }
      });
      const orders = await ordersRes.json();
      
      const productsRes = await fetch('/api/products');
      const products = await productsRes.json();
      
      let subscribersCount = 0;
      try {
        const subscribersRes = await fetch(`/api/${ADMIN_SECRET_PATH}/newsletter`, {
          headers: { 'Authorization': `Bearer ${adminPassword}` }
        });
        if (subscribersRes.ok) {
          const subscribers = await subscribersRes.json();
          subscribersCount = Array.isArray(subscribers) ? subscribers.length : 0;
        }
      } catch (error) {
        console.error('Error fetching subscribers:', error);
      }
      
      const revenue = Array.isArray(orders) ? orders
        .filter((o: any) => o.status === 'delivered')
        .reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0) : 0;
      
      setStats({
        orders: Array.isArray(orders) ? orders.length : 0,
        products: Array.isArray(products) ? products.length : 0,
        subscribers: subscribersCount,
        revenue: revenue,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    sessionStorage.removeItem('adminLoginTime');
    document.cookie = 'adminAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push(`/${ADMIN_SECRET_PATH}/login`);
  };

  const menuItems = [
    { title: 'الطلبات', icon: '🛒', href: `/${ADMIN_SECRET_PATH}/orders`, count: stats.orders },
    { title: 'المنتجات', icon: '👕', href: `/${ADMIN_SECRET_PATH}/products`, count: stats.products },
    { title: 'المشتركين', icon: '📧', href: `/${ADMIN_SECRET_PATH}/newsletter`, count: stats.subscribers },
    { title: 'الإيرادات', icon: '💰', href: '#', count: `${stats.revenue.toLocaleString()} ج.م` },
  ];

  const quickActions = [
    { title: 'إضافة منتج', icon: '➕', href: `/${ADMIN_SECRET_PATH}/add-product` },
    { title: 'تعديل منتج', icon: '✏️', href: `/${ADMIN_SECRET_PATH}/products` },
    { title: 'الطلبات', icon: '📋', href: `/${ADMIN_SECRET_PATH}/orders` },
    { title: 'النشرة', icon: '📢', href: `/${ADMIN_SECRET_PATH}/newsletter` },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3F0] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-gold/20 border-t-rose-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-[#FCFCFC] to-[#F5F3F0] pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-md">
        
        {!isOnline && (
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
            <p className="text-amber-600 font-bold text-sm">⚠️ مفيش اتصال بالإنترنت</p>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-sm">V</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-black">VELIX</h1>
                <p className="text-rose-gold/60 text-xs font-bold">لوحة التحكم</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-linear-to-r from-gray-500 to-gray-700 text-white rounded-full text-sm font-bold hover:scale-[1.02] transition-all shadow-md"
          >
            خروج
          </button>
        </div>

        {/* Welcome Card */}
        <div className="bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-2xl p-5 mb-6 text-white shadow-lg">
          <p className="text-white/80 text-sm font-bold">مرحباً بك 👋</p>
          <p className="text-xl font-black mt-1">أهلاً بعودتك</p>
          <p className="text-white/60 text-xs mt-2">ملخص سريع لأداء متجرك</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="bg-linear-to-r from-rose-gold/10 to-copper/10 rounded-2xl p-4 text-black hover:scale-[1.02] transition-all duration-300 shadow-md hover:shadow-rose-gold/20 border border-rose-gold/20"
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-2xl font-black text-rose-gold">{typeof item.count === 'number' ? toArabicNumber(item.count) : item.count}</div>
              <div className="text-xs text-black/60 font-bold mt-1">{item.title}</div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-black font-bold text-lg">إجراءات سريعة</h2>
            <span className="text-rose-gold/40 text-xs">اضغط للإضافة</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, idx) => (
              <Link
                key={idx}
                href={action.href}
                className="bg-white border border-rose-gold/20 rounded-xl p-3 text-center text-black hover:shadow-md hover:border-rose-gold/50 transition-all group"
              >
                <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">{action.icon}</div>
                <div className="text-xs font-bold text-rose-gold">{action.title}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}