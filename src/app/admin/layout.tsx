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

  // ✅ إزالة manifest الموقع العادي وإضافة manifest الأدمن (يشتغل فوراً)
  useEffect(() => {
    // إزالة manifest الموقع العادي (اللي معاه data-main)
    const mainManifest = document.querySelector('link[rel="manifest"][data-main="true"]');
    if (mainManifest) {
      mainManifest.remove();
    }
    
    // إضافة manifest الأدمن
    let adminManifest = document.querySelector('link[rel="manifest"][data-admin="true"]');
    if (!adminManifest) {
      adminManifest = document.createElement('link');
      adminManifest.setAttribute('rel', 'manifest');
      adminManifest.setAttribute('href', '/admin-manifest.json');
      adminManifest.setAttribute('data-admin', 'true');
      document.head.appendChild(adminManifest);
    }
    
    // ✅ تغيير عنوان الصفحة
    let title = 'VELIX Admin - لوحة التحكم';
    if (pathname === '/admin/products') title = 'إدارة المنتجات - VELIX Admin';
    if (pathname === '/admin/orders') title = 'إدارة الطلبات - VELIX Admin';
    if (pathname === '/admin/newsletter') title = 'النشرة البريدية - VELIX Admin';
    if (pathname === '/admin') title = 'إضافة منتج - VELIX Admin';
    document.title = title;
    
    // ✅ تغيير meta tags للتطبيق
    let appleTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]');
    if (!appleTitle) {
      appleTitle = document.createElement('meta');
      appleTitle.setAttribute('name', 'apple-mobile-web-app-title');
      document.head.appendChild(appleTitle);
    }
    appleTitle.setAttribute('content', 'VELIX Admin');
    
    let appName = document.querySelector('meta[name="application-name"]');
    if (!appName) {
      appName = document.createElement('meta');
      appName.setAttribute('name', 'application-name');
      document.head.appendChild(appName);
    }
    appName.setAttribute('content', 'VELIX Admin');
  }, [pathname]); // ✅ اشتغل عند كل تغيير في المسار

  // ✅ كمان خلي المؤثر ده يشتغل بعد التحميل مباشرة
  useEffect(() => {
    if (!isLoginPage) {
      // إزالة manifest الموقع العادي
      const mainManifest = document.querySelector('link[rel="manifest"][data-main="true"]');
      if (mainManifest) {
        mainManifest.remove();
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