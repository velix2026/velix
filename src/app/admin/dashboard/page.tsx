'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchStats();
    } else {
      router.push('/admin/login');
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
      const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'velix@2026';
      
      const ordersRes = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${password}` },
      });
      const orders = await ordersRes.json();
      
      const productsRes = await fetch('/api/products');
      const products = await productsRes.json();
      
      let subscribersCount = 0;
      try {
        const subscribersRes = await fetch('/api/newsletter', {
          headers: { Authorization: `Bearer ${password}` },
        });
        if (subscribersRes.ok) {
          const subscribers = await subscribersRes.json();
          subscribersCount = Array.isArray(subscribers) ? subscribers.length : 0;
        }
      } catch (error) {
        console.error('Error fetching subscribers:', error);
      }
      
      const revenue = orders
        .filter((o: any) => o.status === 'delivered')
        .reduce((sum: number, o: any) => sum + o.total_amount, 0);
      
      setStats({
        orders: orders.length,
        products: products.length,
        subscribers: subscribersCount,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-black font-bold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-md">
        {/* حالة الاتصال */}
        {!isOnline && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-center">
            <p className="text-red-500 font-bold text-sm">⚠️ لا يوجد اتصال بالإنترنت - بيانات مخزنة مؤقتاً</p>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-sm">V</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-black">VELIX</h1>
                <p className="text-black/40 text-xs font-bold">لوحة التحكم</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-bold hover:bg-red-600 transition-all"
          >
            تسجيل خروج
          </button>
        </div>

        {/* Welcome Card */}
        <div className="bg-linear-to-r from-black to-gray-800 rounded-2xl p-5 mb-6 text-white">
          <p className="text-white/60 text-sm font-bold">مرحباً بك 👋</p>
          <p className="text-xl font-black mt-1">أهلاً بعودتك</p>
          <p className="text-white/40 text-xs mt-2">إليك ملخص سريع لأداء متجرك</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className={`${item.color} rounded-2xl p-4 text-white hover:scale-[1.02] transition-all duration-300 shadow-md hover:shadow-lg`}
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-2xl font-black">{item.count}</div>
              <div className="text-xs opacity-80 font-bold mt-1">{item.title}</div>
            </Link>
          ))}
        </div>

        {/* Quick Actions - 4 أزرار */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-black font-bold text-lg">إجراءات سريعة</h2>
            <span className="text-black/30 text-xs">اضغط للإضافة</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/admin" className="bg-white border border-black/10 rounded-xl p-3 text-center text-black hover:shadow-md transition-all group">
              <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">➕</div>
              <div className="text-xs font-bold">إضافة منتج</div>
            </Link>
            <Link href="/admin/products" className="bg-white border border-black/10 rounded-xl p-3 text-center text-black hover:shadow-md transition-all group">
              <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">✏️</div>
              <div className="text-xs font-bold">تعديل منتج</div>
            </Link>
            <Link href="/admin/orders" className="bg-white border border-black/10 rounded-xl p-3 text-center text-black hover:shadow-md transition-all group">
              <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">📋</div>
              <div className="text-xs font-bold">الطلبات</div>
            </Link>
            <Link href="/admin/newsletter" className="bg-white border border-black/10 rounded-xl p-3 text-center text-black hover:shadow-md transition-all group">
              <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">📢</div>
              <div className="text-xs font-bold">نشرة</div>
            </Link>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-white rounded-2xl p-4 border border-black/10 mb-6">
          <h2 className="text-black font-bold mb-3 text-lg">أحدث النشاطات</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-black/60">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>لا توجد نشاطات حديثة</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}