'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toArabicNumber } from '@/lib/utils';

interface Subscriber {
  id: number;
  email: string;
  subscribed_at: string;
  status: string;
}

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'velix@2026';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://velix-eg.store';

export default function AdminNewsletter() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [addingManual, setAddingManual] = useState(false);

  // التحقق من تسجيل الدخول
  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchSubscribers();
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/newsletter', {
        headers: { 'Authorization': `Bearer ${ADMIN_PASSWORD}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSubscribers(data);
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const addManualSubscriber = async () => {
    if (!manualEmail || !manualEmail.includes('@')) {
      setMessage('❌ برجاء إدخال بريد إلكتروني صحيح');
      return;
    }

    setAddingManual(true);
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_PASSWORD}`
        },
        body: JSON.stringify({ email: manualEmail }),
      });

      const data = await response.json();

      if (response.ok || data.alreadySubscribed) {
        setMessage(`✅ تم إضافة ${manualEmail} بنجاح`);
        setManualEmail('');
        fetchSubscribers();
      } else {
        setMessage('❌ ' + (data.error || 'فشل الإضافة'));
      }
    } catch (error) {
      setMessage('❌ حدث خطأ في الإضافة');
    } finally {
      setAddingManual(false);
    }
  };

  const sendBroadcast = async () => {
    if (!emailSubject || !emailBody) {
      setMessage('❌ برجاء إدخال عنوان ورسالة');
      return;
    }

    setSending(true);
    setMessage('');

    // إضافة رابط الموقع إلى الرسالة
    const bodyWithLink = `${emailBody}\n\n---\n🔗 رابط الموقع: ${BASE_URL}\n🛍️ تسوق الآن واستمتع بأحدث التشكيلات!`;

    try {
      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_PASSWORD}`
        },
        body: JSON.stringify({
          subject: emailSubject,
          body: bodyWithLink,
          subscribers: subscribers.map(s => s.email)
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(`✅ تم إرسال الإشعار إلى ${toArabicNumber(data.sent)} مشترك`);
        setEmailSubject('');
        setEmailBody('');
      } else {
        setMessage('❌ ' + data.error);
      }
    } catch (error) {
      setMessage('❌ حدث خطأ في الإرسال');
    } finally {
      setSending(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12">
      <div className="container mx-auto px-4">
        {/* Header - مع إضافة زر رجوع للداش بورد */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-black">📧 المشتركين في النشرة البريدية</h1>
            <p className="text-black/50 text-sm font-bold mt-1">إدارة وإرسال العروض للمشتركين</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchSubscribers}
              className="px-4 py-2 bg-black/10 hover:bg-black/20 text-black rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              تحديث
            </button>
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 bg-black/10 hover:bg-black/20 text-black rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              العودة للداش بورد
            </Link>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-md border border-black/10">
            <div className="text-2xl font-black text-black">{toArabicNumber(subscribers.length)}</div>
            <div className="text-black/50 text-sm font-bold mt-1">📧 إجمالي المشتركين</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md border border-black/10 bg-linear-to-r from-green-50 to-emerald-50">
            <div className="text-2xl font-black text-green-700">{toArabicNumber(subscribers.filter(s => s.status === 'active').length)}</div>
            <div className="text-green-600/70 text-sm font-bold mt-1">✅ مشتركين نشطين</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md border border-black/10">
            <div className="text-2xl font-black text-black">{toArabicNumber(subscribers.filter(s => s.status === 'inactive').length)}</div>
            <div className="text-black/50 text-sm font-bold mt-1">⭕ ملغي الاشتراك</div>
          </div>
        </div>

        {/* إضافة بريد يدوي */}
        <div className="bg-white rounded-2xl shadow-md border border-black/10 p-6 mb-8">
          <h2 className="text-xl font-black text-black mb-4 flex items-center gap-2">
            <span className="text-2xl">➕</span>
            إضافة مشترك يدوي
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={manualEmail}
              onChange={(e) => setManualEmail(e.target.value)}
              placeholder="أدخل البريد الإلكتروني"
              className="flex-1 p-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black font-bold"
            />
            <button
              onClick={addManualSubscriber}
              disabled={addingManual}
              className="px-6 py-3 bg-linear-to-r from-emerald-500 via-green-500 to-lime-400 text-white font-bold rounded-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 shadow-md"
            >
              {addingManual ? 'جاري الإضافة...' : '+ إضافة'}
            </button>
          </div>
        </div>

        {/* إرسال إشعار جماعي */}
        <div className="bg-white rounded-2xl shadow-md border border-black/10 p-6 mb-8">
          <h2 className="text-xl font-black text-black mb-4 flex items-center gap-2">
            <span className="text-2xl">📢</span>
            إرسال إشعار جماعي
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-black text-black mb-1">عنوان الإشعار</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="مثال: 🎉 عروض الصيف وصلت!"
                className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black font-bold"
              />
            </div>
            <div>
              <label className="block text-sm font-black text-black mb-1">محتوى الإشعار</label>
              <textarea
                rows={5}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="أكتب رسالتك هنا..."
                className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black font-bold resize-none"
              />
              <p className="text-xs text-black/50 mt-1 font-bold">
                ℹ️ سيتم إضافة رابط الموقع تلقائياً في نهاية الرسالة
              </p>
            </div>
            <button
              onClick={sendBroadcast}
              disabled={sending}
              className="w-full bg-linear-to-r from-sky-400 via-blue-500 to-indigo-500 text-white py-3 rounded-xl font-bold hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 shadow-md"
            >
              {sending ? 'جاري الإرسال...' : `📧 إرسال إلى ${toArabicNumber(subscribers.length)} مشترك`}
            </button>
            {message && (
              <p className={`text-center font-bold ${message.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>
                {message}
              </p>
            )}
          </div>
        </div>

        {/* قائمة المشتركين */}
        <div className="bg-white rounded-2xl shadow-md border border-black/10 overflow-hidden">
          <div className="p-4 border-b border-black/10 bg-black/5 flex justify-between items-center">
            <p className="font-black text-black">📋 قائمة المشتركين</p>
            <p className="font-black text-black">عدد المشتركين: {toArabicNumber(subscribers.length)}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/5">
                <tr>
                  <th className="p-3 text-right font-black text-black">البريد الإلكتروني</th>
                  <th className="p-3 text-right font-black text-black">تاريخ الإشتراك</th>
                  <th className="p-3 text-right font-black text-black">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-black/50 font-bold">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2" />
                      جاري التحميل...
                    </td>
                  </tr>
                ) : subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-black/50 font-bold">
                      لا يوجد مشتركين حتى الآن
                    </td>
                  </tr>
                ) : (
                  subscribers.map((sub) => (
                    <tr key={sub.id} className="border-t border-black/5 hover:bg-black/5 transition-all duration-200">
                      <td className="p-3 font-bold text-black">{sub.email}</td>
                      <td className="p-3 text-black/60 text-sm font-bold">
                        {new Date(sub.subscribed_at).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          sub.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {sub.status === 'active' ? '✅ نشط' : '⭕ ملغي'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}