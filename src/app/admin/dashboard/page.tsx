'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);
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
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((result) => {
        if (result.outcome === 'accepted') {
          console.log('✅ VELIX Admin app installed');
        }
        setDeferredPrompt(null);
        setShowInstall(false);
      });
    }
  };

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
    <div className="min-h-screen bg-gray-50 pt-20 pb-24">
      <div className="container mx-auto px-4 max-w-md">
        {/* حالة الاتصال */}
        {!isOnline && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-center">
            <p className="text-red-500 font-bold text-sm">⚠️ لا يوجد اتصال بالإنترنت - بيانات مخزنة مؤقتاً</p>
          </div>
        )}

        {/* زر تثبيت التطبيق */}
        {showInstall && (
          <button
            onClick={handleInstall}
            className="w-full mb-4 bg-linear-to-r from-black to-gray-800 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 9V7a5 5 0 00-10 0v2M7 9h10a2 2 0 012 2v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7a2 2 0 012-2z" />
            </svg>
            تثبيت تطبيق VELIX Admin
          </button>
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

        {/* Quick Actions - 4 أزرار بدل 3 */}
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

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-black/10 py-3 shadow-lg">
          <div className="flex justify-around items-center max-w-md mx-auto">
            <Link href="/admin/dashboard" className="text-black flex flex-col items-center gap-1">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
              </svg>
              <span className="text-[10px] font-bold">الرئيسية</span>
            </Link>
            <Link href="/admin/orders" className="text-black/40 flex flex-col items-center gap-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              <span className="text-[10px] font-bold">الطلبات</span>
            </Link>
            <Link href="/admin/products" className="text-black/40 flex flex-col items-center gap-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"/>
              </svg>
              <span className="text-[10px] font-bold">المنتجات</span>
            </Link>
            <Link href="/admin" className="text-black/40 flex flex-col items-center gap-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
              </svg>
              <span className="text-[10px] font-bold">إضافة</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}