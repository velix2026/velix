'use client';

import { useState, useEffect, useRef, CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const ADMIN_SECRET_PATH = process.env.NEXT_PUBLIC_ADMIN_SECRET_PATH || 'velix-admin-x7k9m';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth');
    if (auth === 'true') {
      router.push(`/${ADMIN_SECRET_PATH}`);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/${ADMIN_SECRET_PATH}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        sessionStorage.setItem('adminAuth', 'true');
        sessionStorage.setItem('adminLoginTime', Date.now().toString());
        document.cookie = `adminAuth=true; path=/; max-age=3600; SameSite=Strict`;
        router.push(`/${ADMIN_SECRET_PATH}`);
      } else {
        setError('كلمة المرور غير صحيحة');
      }
    } catch {
      setError('حدث خطأ، حاول مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-[#FCFCFC] to-[#F5F3F0] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl border border-rose-gold/20 overflow-hidden">
          <div className="h-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper" />
          
          <div className="px-8 pt-12 pb-6 text-center">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <Image 
                src="/images/logo.png" 
                alt="VELIX" 
                fill 
                className="object-contain" 
                priority
                sizes="80px"
              />
            </div>
            <h1 className="text-2xl font-black text-black">VELIX</h1>
            <div className="w-12 h-0.5 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper mx-auto mt-3 mb-3" />
            <p className="text-black/60 text-sm font-bold">لوحة التحكم</p>
          </div>
          
          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="flex text-xs font-black text-black uppercase tracking-wider mb-2 items-center gap-2">
                  <svg className="w-3 h-3 text-rose-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  كلمة المرور
                </label>
                <div className="relative">
                  {/* ✅ الحقل دايمًا type="text" عشان منع زر العين بتاع المتصفح */}
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 bg-[#FDF8F5] border-2 border-rose-gold/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent text-black font-bold pl-12"
                    placeholder="••••••••"
                    required
                    autoFocus
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    data-form-type="other"
                    style={{
                      WebkitTextSecurity: showPassword ? 'none' : 'disc',
                      textSecurity: showPassword ? 'none' : 'disc',
                    } as CSSProperties & { WebkitTextSecurity: string }}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-rose-gold transition z-10"
                    aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-6 p-3 bg-red-50 border border-red-200 text-red-500 rounded-xl text-sm text-center font-bold"
                >
                  {error}
                </motion.div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white py-4 rounded-2xl disabled:opacity-50 font-black shadow-lg hover:shadow-rose-gold/30 transition"
              >
                {loading ? 'جاري التحقق...' : 'دخول'}
              </button>
            </form>
          </div>
          
          <div className="px-8 pb-10 text-center border-t border-rose-gold/20 pt-6">
            <Link href="/" className="text-sm font-bold text-black/40 hover:text-rose-gold transition">
              العودة للمتجر
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}