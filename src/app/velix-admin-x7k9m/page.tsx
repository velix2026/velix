'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toArabicNumber } from '@/lib/utils';

const ADMIN_SECRET_PATH = process.env.NEXT_PUBLIC_ADMIN_SECRET_PATH || 'velix-admin-x7k9m';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ displayName: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [stats, setStats] = useState({ orders: 0, products: 0, subscribers: 0, revenue: 0 });

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(`/api/${ADMIN_SECRET_PATH}/verify-session`);
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user);
          fetchStats();
        } else {
          router.push(`/${ADMIN_SECRET_PATH}/login`);
        }
      } catch { router.push(`/${ADMIN_SECRET_PATH}/login`); }
      setLoading(false);
    }
    checkAuth();
  }, [router]);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const h = () => setIsOnline(true);
    const h2 = () => setIsOnline(false);
    window.addEventListener('online', h);
    window.addEventListener('offline', h2);
    return () => { window.removeEventListener('online', h); window.removeEventListener('offline', h2); };
  }, []);

  const fetchStats = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch(`/api/${ADMIN_SECRET_PATH}/orders`),
        fetch('/api/products'),
      ]);
      const orders = await ordersRes.json();
      const products = await productsRes.json();
      let subscribersCount = 0;
      try {
        const subRes = await fetch(`/api/${ADMIN_SECRET_PATH}/newsletter`);
        if (subRes.ok) { const subs = await subRes.json(); subscribersCount = Array.isArray(subs) ? subs.length : 0; }
      } catch {}
      const revenue = Array.isArray(orders) ? orders.filter((o: any) => o.status === 'delivered').reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0) : 0;
      setStats({
        orders: Array.isArray(orders) ? orders.length : 0,
        products: Array.isArray(products) ? products.length : 0,
        subscribers: subscribersCount,
        revenue,
      });
    } catch {}
  };

  const handleLogout = async () => {
    await fetch(`/api/${ADMIN_SECRET_PATH}/verify-session`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'logout' })
    });
    router.push(`/${ADMIN_SECRET_PATH}/login`);
  };

  const sections = [
    { title: 'الطلبات', icon: '◆', href: `/${ADMIN_SECRET_PATH}/orders`, count: stats.orders, color: 'bg-blue-100 text-blue-600' },
    { title: 'المنتجات', icon: '●', href: `/${ADMIN_SECRET_PATH}/products`, count: stats.products, color: 'bg-green-100 text-green-600' },
    { title: 'المشتركين', icon: '■', href: `/${ADMIN_SECRET_PATH}/newsletter`, count: stats.subscribers, color: 'bg-purple-100 text-purple-600' },
    { title: 'الإيرادات', icon: '★', href: '#', count: `${stats.revenue.toLocaleString()} ج.م`, color: 'bg-amber-100 text-amber-600' },
  ];

  const management = [
    { title: 'المقالات', icon: '✎', href: `/${ADMIN_SECRET_PATH}/blog`, desc: 'إدارة مقالات المدونة' },
    { title: 'أكواد الخصم', icon: '%', href: `/${ADMIN_SECRET_PATH}/coupons`, desc: 'إدارة أكواد الخصم' },
    { title: 'النشاطات', icon: '☰', href: `/${ADMIN_SECRET_PATH}/activity`, desc: 'سجل كل النشاطات' },
    { title: 'طباعة', icon: '☐', href: `/${ADMIN_SECRET_PATH}/print-multi`, desc: 'طباعة فواتير متعددة' },
  ];

  const quickActions = [
    { title: 'إضافة منتج', icon: '+', href: `/${ADMIN_SECRET_PATH}/add-product` },
    { title: 'تعديل منتج', icon: '✎', href: `/${ADMIN_SECRET_PATH}/products` },
    { title: 'الطلبات', icon: '◆', href: `/${ADMIN_SECRET_PATH}/orders` },
    { title: 'مقال جديد', icon: '✎', href: `/${ADMIN_SECRET_PATH}/blog` },
  ];

  if (loading) {
    return <div className="min-h-screen bg-[#F5F3F0] flex items-center justify-center"><div className="w-12 h-12 border-4 border-rose-gold/20 border-t-rose-gold rounded-full animate-spin" /></div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-[#FCFCFC] to-[#F5F3F0] pt-8 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {!isOnline && (
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
            <p className="text-amber-600 font-bold text-sm">! مفيش اتصال بالإنترنت</p>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-xl flex items-center justify-center">
              <span className="text-white font-black">V</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-black">VELIX</h1>
              <p className="text-rose-gold/60 text-xs font-bold">لوحة التحكم</p>
            </div>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-linear-to-r from-gray-500 to-gray-700 text-white rounded-full text-sm font-bold hover:scale-[1.02] transition-all shadow-md">خروج</button>
        </div>

        {/* Welcome */}
        <div className="bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-2xl p-6 mb-6 text-white shadow-lg">
          <p className="text-white/80 text-sm font-bold">مرحباً {user.displayName}</p>
          <p className="text-xl font-black mt-1">أهلاً بعودتك</p>
          <p className="text-white/60 text-xs mt-2">ملخص سريع لأداء متجرك</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {sections.map((item, idx) => (
            <Link key={idx} href={item.href}
              className="bg-white rounded-2xl p-4 text-black hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-rose-gold/20">
              <div className={`inline-flex w-10 h-10 rounded-xl items-center justify-center ${item.color} mb-2 font-black`}>{item.icon}</div>
              <div className="text-2xl font-black text-rose-gold">{typeof item.count === 'number' ? toArabicNumber(item.count) : item.count}</div>
              <div className="text-xs text-black/60 font-bold mt-1">{item.title}</div>
            </Link>
          ))}
        </div>

        {/* Management Sections */}
        <h2 className="text-black font-bold text-lg mb-3">إدارة المحتوى</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {management.map((item, idx) => (
            <Link key={idx} href={item.href}
              className="bg-white border border-rose-gold/20 rounded-xl p-4 text-center text-black hover:shadow-md hover:border-rose-gold/50 transition-all group">
              <div className="text-2xl font-black text-rose-gold mb-1 group-hover:scale-110 transition-transform">{item.icon}</div>
              <div className="text-sm font-bold text-black">{item.title}</div>
              <div className="text-xs text-black/40">{item.desc}</div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-black font-bold text-lg mb-3">إجراءات سريعة</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action, idx) => (
            <Link key={idx} href={action.href}
              className="bg-white border border-rose-gold/20 rounded-xl p-4 text-center text-black hover:shadow-md hover:border-rose-gold/50 transition-all group">
              <div className="text-2xl font-black text-rose-gold mb-1 group-hover:scale-110 transition-transform">{action.icon}</div>
              <div className="text-xs font-bold text-rose-gold">{action.title}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
