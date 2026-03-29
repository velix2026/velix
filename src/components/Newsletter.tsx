// components/Newsletter.tsx
'use client';

import { useState, useEffect } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('success');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('velix_newsletter_email');
    if (savedEmail) {
      setIsSubscribed(true);
      setSubscribedEmail(savedEmail);
    }
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessageType('error');
      setMessage('❌ برجاء إدخال بريد إلكتروني صحيح');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setLoading(true);
    setMessage('');
    
    try {
      console.log('Sending email:', email);
      
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        localStorage.setItem('velix_newsletter_email', email);
        setIsSubscribed(true);
        setSubscribedEmail(email);
        setMessageType('success');
        setMessage('✅ تم الاشتراك بنجاح! هتوصلک آخر العروض');
        setEmail('');
        setTimeout(() => setMessage(''), 4000);
      } else if (data.alreadySubscribed) {
        localStorage.setItem('velix_newsletter_email', email);
        setIsSubscribed(true);
        setSubscribedEmail(email);
        setMessageType('info');
        setMessage('ℹ️ هذا البريد مسجل بالفعل في النشرة البريدية');
        setEmail('');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessageType('error');
        setMessage(data.error || '❌ حدث خطأ، حاول مرة أخرى');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setMessageType('error');
      setMessage('❌ حدث خطأ في الاتصال، حاول مرة أخرى');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const getMessageColor = () => {
    switch (messageType) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-500';
      case 'info': return 'text-blue-600';
      default: return 'text-green-600';
    }
  };

  return (
    <section className="bg-white py-20 md:py-28 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-12 md:mb-16 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <span className="text-xs text-gray-400 tracking-[0.2em] uppercase font-bold mb-3 block">
            ابقى على تواصل
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            اشترك في النشرة البريدية
          </h2>
          <div className="w-16 h-0.5 bg-gray-300 mx-auto mt-4 mb-6"></div>
          <p className="text-gray-500 font-bold text-base max-w-2xl mx-auto">
            كن أول من يعلم بآخر المنتجات والعروض الحصرية
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {isSubscribed ? (
            <div className={`bg-gray-50 rounded-2xl p-8 text-center transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="flex items-center justify-center gap-3 mb-3">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">أنت مشترك بالفعل!</h3>
              <p className="text-gray-600 font-bold">
                بريدك الإلكتروني <span className="text-gray-900">{subscribedEmail}</span> مسجل في النشرة البريدية
              </p>
              <p className="text-gray-400 text-sm mt-3">
                هتوصلک آخر العروض والمنتجات الجديدة على بريدك
              </p>
            </div>
          ) : (
            <div className={`transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="أدخل بريدك الإلكتروني"
                  className="flex-1 p-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 font-bold focus:outline-none focus:border-gray-400 transition placeholder:text-gray-400"
                  required
                  disabled={loading}
                  dir="ltr"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 min-w-35 cursor-pointer shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      جاري...
                    </div>
                  ) : (
                    'اشتراك'
                  )}
                </button>
              </form>
              
              {message && (
                <p className={`mt-4 text-center font-bold ${getMessageColor()} transition-all duration-300`}>
                  {message}
                </p>
              )}
              
              <p className="text-center text-gray-400 text-xs mt-6">
                لن نرسل لك بريداً مزعجاً، فقط العروض الحصرية
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}