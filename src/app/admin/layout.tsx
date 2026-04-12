'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    } else if (!isLoginPage) {
      router.push('/admin/login');
    }
    setLoading(false);
  }, [router, isLoginPage]);

  // ✅ تسجيل Service Worker للأدمن
  useEffect(() => {
    if ('serviceWorker' in navigator && !isLoginPage) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('SW registered for admin'))
        .catch(err => console.log('SW error:', err));
    }
  }, [isLoginPage]);

  // ✅ إضافة الـ manifest ديناميكياً
  useEffect(() => {
    if (!isLoginPage) {
      // إضافة link manifest في head إذا مش موجود
      let manifestLink = document.querySelector('link[rel="manifest"][data-admin="true"]');
      if (!manifestLink) {
        manifestLink = document.createElement('link');
        manifestLink.setAttribute('rel', 'manifest');
        manifestLink.setAttribute('href', '/admin-manifest.json');
        manifestLink.setAttribute('data-admin', 'true');
        document.head.appendChild(manifestLink);
      }
    }
  }, [isLoginPage]);

  if (loading && !isLoginPage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black/10 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black font-bold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}