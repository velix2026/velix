'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const ADMIN_SECRET_PATH = process.env.NEXT_PUBLIC_ADMIN_SECRET_PATH || 'velix-admin-x7k9m';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === `/${ADMIN_SECRET_PATH}/login`;

  useEffect(() => {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    if (header) header.style.display = 'none';
    if (footer) footer.style.display = 'none';
    return () => {
      if (header) header.style.display = '';
      if (footer) footer.style.display = '';
    };
  }, []);

  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth');
    const loginTime = sessionStorage.getItem('adminLoginTime');
    
    // التحقق من صلاحية الجلسة (ساعة واحدة)
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
    } else if (!isLoginPage) {
      router.push(`/${ADMIN_SECRET_PATH}/login`);
    }
    setLoading(false);
  }, [router, isLoginPage]);

  if (loading && !isLoginPage) {
    return (
      <div className="min-h-screen bg-[#F5F3F0] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-gold/20 border-t-rose-gold rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}