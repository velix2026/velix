'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const ADMIN_SECRET_PATH = process.env.NEXT_PUBLIC_ADMIN_SECRET_PATH || 'velix-admin-x7k9m';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ displayName: string } | null>(null);
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
    async function checkAuth() {
      try {
        const res = await fetch(`/api/${ADMIN_SECRET_PATH}/verify-session`);
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          setUser(data.user);
        } else if (!isLoginPage) {
          router.push(`/${ADMIN_SECRET_PATH}/login`);
        }
      } catch {
        if (!isLoginPage) router.push(`/${ADMIN_SECRET_PATH}/login`);
      }
      setLoading(false);
    }
    checkAuth();
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
