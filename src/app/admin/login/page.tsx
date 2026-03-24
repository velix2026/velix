'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        sessionStorage.setItem('adminAuth', 'true');
        router.push('/admin');
      } else {
        setError('كلمة المرور غير صحيحة');
      }
    } catch {
      setError('حدث خطأ، حاول مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-stone-50 via-white to-stone-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-10 pb-4 text-center">
            <h1 className="text-4xl font-bold tracking-wide text-stone-800">
              VELIX
            </h1>
            <p className="text-stone-400 text-sm mt-2 font-medium">
              لوحة التحكم
            </p>
          </div>
          
          {/* Body */}
          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent transition text-stone-800 font-medium placeholder:text-stone-300"
                    placeholder="••••••••"
                    required
                    autoFocus
                  />
                </div>
              </div>
              
              {error && (
                <div className="mb-6 p-3 bg-red-50/80 border border-red-100 text-red-500 rounded-xl text-sm text-center font-medium">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-stone-800 text-white py-4 rounded-2xl hover:bg-stone-700 transition-all duration-200 disabled:opacity-50 font-bold tracking-wide"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري التحقق...
                  </span>
                ) : (
                  'دخول'
                )}
              </button>
            </form>
          </div>
          
          {/* Footer with button */}
          <div className="px-8 pb-10 text-center">
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 text-sm font-medium text-stone-400 hover:text-stone-600 transition-colors duration-200 group"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              العودة إلى الموقع
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}