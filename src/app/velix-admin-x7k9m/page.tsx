'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toArabicNumber } from '@/lib/utils';

const ADMIN_SECRET_PATH = process.env.NEXT_PUBLIC_ADMIN_SECRET_PATH || 'velix-admin-x7k9m';

interface RevenueData {
  daily: { date: string; orders: number; revenue: number }[];
  summary: { totalOrders: number; totalRevenue: number; avgOrderValue: number; deliveredCount: number; cancelledCount: number; pendingCount: number };
  topProducts: { name: string; total: number; sold: number }[];
}

function SparklineChart({ revenue, maxRevenue }: { revenue: RevenueData | null; maxRevenue: number }) {
  const data = revenue?.daily?.slice().reverse() || [];
  if (data.length === 0) return null;
  const w = 280, h = 80;
  const px = (i: number) => (i / (data.length - 1 || 1)) * w;
  const py = (v: number) => h - (v / maxRevenue) * (h - 4) - 2;
  const pts = data.map((d, i) => `${px(i)},${py(d.revenue)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-24">
      <defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#B76E79" stopOpacity="0.3"/><stop offset="100%" stopColor="#B76E79" stopOpacity="0"/></linearGradient></defs>
      <polyline fill="none" stroke="#B76E79" strokeWidth="2" points={pts} className="drop-shadow-sm" />
      <polygon fill="url(#rg)" points={`${px(0)},${h} ${pts} ${px(data.length - 1)},${h}`} />
    </svg>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ displayName: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [stats, setStats] = useState({ orders: 0, products: 0, subscribers: 0, revenue: 0 });
  const [revenue, setRevenue] = useState<RevenueData | null>(null);
  const [showRevenue, setShowRevenue] = useState(false);

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
      const revenue = Array.isArray(orders) ? orders.filter((o: { status: string }) => o.status === 'delivered').reduce((sum: number, o: { total_amount?: number }) => sum + (o.total_amount || 0), 0) : 0;
      setStats({
        orders: Array.isArray(orders) ? orders.length : 0,
        products: Array.isArray(products) ? products.length : 0,
        subscribers: subscribersCount,
        revenue,
      });
    } catch {}
  };

  const fetchRevenue = async () => {
    try {
      const res = await fetch(`/api/${ADMIN_SECRET_PATH}/revenue`);
      if (res.ok) setRevenue(await res.json());
    } catch {}
  };

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(`/api/${ADMIN_SECRET_PATH}/verify-session`);
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user);
          fetchStats();
          fetchRevenue();
        } else {
          router.push(`/${ADMIN_SECRET_PATH}/login`);
        }
      } catch { router.push(`/${ADMIN_SECRET_PATH}/login`); }
      setLoading(false);
    }
    checkAuth();
  }, [router]);

  useEffect(() => {
    const h = () => setIsOnline(true);
    const h2 = () => setIsOnline(false);
    window.addEventListener('online', h);
    window.addEventListener('offline', h2);
    return () => { window.removeEventListener('online', h); window.removeEventListener('offline', h2); };
  }, []);

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

  const maxRevenue = revenue?.daily?.length ? Math.max(...revenue.daily.map(d => d.revenue), 1) : 1;

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

        <div className="bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-2xl p-6 mb-6 text-white shadow-lg">
          <p className="text-white/80 text-sm font-bold">مرحباً {user.displayName}</p>
          <p className="text-xl font-black mt-1">أهلاً بعودتك</p>
          <p className="text-white/60 text-xs mt-2">ملخص سريع لأداء متجرك</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {sections.map((item, idx) => (
            <button key={idx} onClick={() => { if (idx === 3) setShowRevenue(true); else router.push(item.href); }}
              className="bg-white rounded-2xl p-4 text-black hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-rose-gold/20 text-right">
              <div className={`inline-flex w-10 h-10 rounded-xl items-center justify-center ${item.color} mb-2 font-black`}>{item.icon}</div>
              <div className="text-2xl font-black text-rose-gold">{typeof item.count === 'number' ? toArabicNumber(item.count) : item.count}</div>
              <div className="text-xs text-black/60 font-bold mt-1">{item.title}</div>
            </button>
          ))}
        </div>

        {/* --- Revenue Section --- */}
        {showRevenue && revenue && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowRevenue(false)}>
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-rose-gold/20 p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-black">الإيرادات</h2>
                <button onClick={() => setShowRevenue(false)} className="p-2 hover:bg-rose-gold/10 rounded-full transition">
                  <svg className="w-5 h-5 text-rose-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
                  <div className="text-xs text-amber-600 font-bold mb-1">إجمالي الإيرادات</div>
                  <div className="text-lg font-black text-amber-700">{toArabicNumber(Math.round(revenue.summary.totalRevenue))} ج.م</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                  <div className="text-xs text-blue-600 font-bold mb-1">معدل الطلب</div>
                  <div className="text-lg font-black text-blue-700">{toArabicNumber(Math.round(revenue.summary.avgOrderValue))} ج.م</div>
                </div>
                <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                  <div className="text-xs text-green-600 font-bold mb-1">تم التوصيل</div>
                  <div className="text-lg font-black text-green-700">{toArabicNumber(revenue.summary.deliveredCount)}</div>
                </div>
                <div className="bg-red-50 rounded-xl p-3 border border-red-200">
                  <div className="text-xs text-red-600 font-bold mb-1">ملغي</div>
                  <div className="text-lg font-black text-red-700">{toArabicNumber(revenue.summary.cancelledCount)}</div>
                </div>
              </div>

              {/* Chart */}
              {revenue.daily.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-black text-black mb-2">الإيرادات اليومية (آخر 30 يوم)</p>
                  <div className="bg-[#FDF8F5] rounded-xl p-4 border border-rose-gold/20">
                    <SparklineChart revenue={revenue} maxRevenue={maxRevenue} />
                    <div className="flex justify-between text-xs text-black/40 font-bold mt-1">
                      <span>{revenue.daily[revenue.daily.length - 1]?.date?.slice(5) || ''}</span>
                      <span>{revenue.daily[0]?.date?.slice(5) || ''}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Top Products */}
              {revenue.topProducts.length > 0 && (
                <div>
                  <p className="text-sm font-black text-black mb-2">أكثر المنتجات مبيعاً</p>
                  <div className="space-y-2">
                    {revenue.topProducts.map((p, i) => (
                      <div key={i} className="flex items-center justify-between bg-[#FDF8F5] rounded-xl p-3 border border-rose-gold/20">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-rose-gold w-5">{toArabicNumber(i + 1)}</span>
                          <span className="text-sm font-bold text-black truncate max-w-[200px]">{p.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-black/50">×{toArabicNumber(p.sold)}</span>
                          <span className="text-sm font-black text-rose-gold">{toArabicNumber(Math.round(p.total))} ج.م</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {revenue.topProducts.length === 0 && revenue.daily.length === 0 && (
                <div className="text-center py-8 text-black/50 font-bold">مفيش إيرادات حتى الآن</div>
              )}
            </div>
          </div>
        )}

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
