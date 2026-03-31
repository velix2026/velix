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
  
  // ✅ حالات التعديل
  const [isEditing, setIsEditing] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [showUnsubscribeConfirm, setShowUnsubscribeConfirm] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('velix_newsletter_email');
    if (savedEmail) {
      setIsSubscribed(true);
      setSubscribedEmail(savedEmail);
      setNewEmail(savedEmail);
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
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('velix_newsletter_email', email);
        setIsSubscribed(true);
        setSubscribedEmail(email);
        setNewEmail(email);
        setMessageType('success');
        setMessage(data.reactivated ? '✅ تم إعادة تفعيل اشتراكك بنجاح!' : '✅ تم الاشتراك بنجاح! هتوصلک آخر العروض');
        setEmail('');
        setTimeout(() => setMessage(''), 4000);
      } else if (data.alreadySubscribed) {
        localStorage.setItem('velix_newsletter_email', email);
        setIsSubscribed(true);
        setSubscribedEmail(email);
        setNewEmail(email);
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
      setMessageType('error');
      setMessage('❌ حدث خطأ في الاتصال، حاول مرة أخرى');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // ✅ تحديث الإيميل
  const handleUpdateEmail = async () => {
    if (!newEmail || !newEmail.includes('@')) {
      setMessageType('error');
      setMessage('❌ برجاء إدخال بريد إلكتروني صحيح');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/newsletter', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldEmail: subscribedEmail, newEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('velix_newsletter_email', newEmail);
        setSubscribedEmail(newEmail);
        setIsEditing(false);
        setMessageType('success');
        setMessage('✅ تم تحديث بريدك الإلكتروني بنجاح');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessageType('error');
        setMessage(data.error || '❌ حدث خطأ في التحديث');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessageType('error');
      setMessage('❌ حدث خطأ في الاتصال');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // ✅ إلغاء الاشتراك
  const handleUnsubscribe = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/newsletter', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subscribedEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.removeItem('velix_newsletter_email');
        setIsSubscribed(false);
        setSubscribedEmail('');
        setNewEmail('');
        setShowUnsubscribeConfirm(false);
        setMessageType('success');
        setMessage('✅ تم إلغاء الاشتراك بنجاح. يمكنك الاشتراك مرة أخرى في أي وقت');
        setTimeout(() => setMessage(''), 4000);
      } else {
        setMessageType('error');
        setMessage(data.error || '❌ حدث خطأ في إلغاء الاشتراك');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessageType('error');
      setMessage('❌ حدث خطأ في الاتصال');
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
              
              {isEditing ? (
                // ✅ وضع التعديل
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">تعديل البريد الإلكتروني</h3>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="البريد الإلكتروني الجديد"
                    className="w-full p-3 rounded-xl border-2 border-gray-200 bg-white text-gray-900 font-bold focus:outline-none focus:border-gray-400 transition"
                    dir="ltr"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleUpdateEmail}
                      disabled={loading}
                      className="flex-1 px-4 py-2 bg-linear-to-r from-sky-400 via-blue-500 to-indigo-500 text-white font-bold rounded-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
                    >
                      {loading ? 'جاري...' : 'حفظ التعديل'}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      disabled={loading}
                      className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-400 transition"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : showUnsubscribeConfirm ? (
                // ✅ تأكيد إلغاء الاشتراك
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">هل أنت متأكد؟</h3>
                  <p className="text-gray-600">هل تريد إلغاء الاشتراك من النشرة البريدية؟</p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleUnsubscribe}
                      disabled={loading}
                      className="flex-1 px-4 py-2 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition"
                    >
                      {loading ? 'جاري...' : 'نعم، إلغاء الاشتراك'}
                    </button>
                    <button
                      onClick={() => setShowUnsubscribeConfirm(false)}
                      className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-400 transition"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : (
                // ✅ الوضع العادي - عرض المشترك
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">أنت مشترك بالفعل!</h3>
                  <p className="text-gray-600 font-bold">
                    بريدك الإلكتروني <span className="text-gray-900">{subscribedEmail}</span>
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    هتوصلک آخر العروض والمنتجات الجديدة على بريدك
                  </p>
                  
                  <div className="flex gap-3 mt-6 justify-center">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition text-sm"
                    >
                      تعديل البريد
                    </button>
                    <button
                      onClick={() => setShowUnsubscribeConfirm(true)}
                      className="px-4 py-2 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition text-sm"
                    >
                      إلغاء الاشتراك
                    </button>
                  </div>
                </>
              )}
              
              {message && (
                <p className={`mt-4 text-center font-bold ${getMessageColor()}`}>
                  {message}
                </p>
              )}
            </div>
          ) : (
            <div className={`transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="أدخل بريدك الإلكتروني"
                    className="flex-1 h-14 px-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 font-bold focus:outline-none focus:border-gray-400 transition placeholder:text-gray-400 leading-14"
                    required
                    disabled={loading}
                    dir="rtl"
                  />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-linear-to-r from-sky-400 via-blue-500 to-indigo-500 text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 min-w-35 cursor-pointer shadow-md hover:shadow-lg"
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