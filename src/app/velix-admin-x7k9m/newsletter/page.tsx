'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toArabicNumber } from '@/lib/utils';

const ADMIN_SECRET_PATH = process.env.NEXT_PUBLIC_ADMIN_SECRET_PATH || 'velix-admin-x7k9m';

interface Subscriber {
  id: number;
  email: string;
  subscribed_at: string;
  status: string;
}

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
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth');
    const loginTime = sessionStorage.getItem('adminLoginTime');
    
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
      fetchSubscribers();
    } else {
      router.push(`/${ADMIN_SECRET_PATH}/login`);
    }
  }, [router]);

  // ✅ من غير Authorization header - الـ middleware هو اللي بيحمي
  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/${ADMIN_SECRET_PATH}/newsletter`);
      if (response.ok) {
        const data = await response.json();
        setSubscribers(data);
      } else {
        console.error('Failed to fetch subscribers:', response.status);
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const addManualSubscriber = async () => {
    if (!manualEmail || !manualEmail.includes('@')) {
      setMessage('❌ أدخل بريد إلكتروني صحيح');
      return;
    }

    setAddingManual(true);
    setMessage('');

    try {
      const response = await fetch(`/api/${ADMIN_SECRET_PATH}/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: manualEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ تم إضافة ${manualEmail}`);
        setManualEmail('');
        fetchSubscribers();
      } else if (data.alreadySubscribed) {
        setMessage(`ℹ️ ${manualEmail} مسجل بالفعل`);
        setManualEmail('');
      } else {
        setMessage('❌ ' + (data.error || 'فشل الإضافة'));
      }
    } catch (error) {
      setMessage('❌ حدث خطأ');
    } finally {
      setAddingManual(false);
    }
  };

  const deleteSubscriber = async (id: number, email: string) => {
    if (!confirm(`هل أنت متأكد من حذف ${email}؟`)) return;
    
    setDeletingId(id);
    try {
      const response = await fetch(`/api/${ADMIN_SECRET_PATH}/newsletter`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setMessage(`✅ تم حذف ${email}`);
        fetchSubscribers();
      } else {
        setMessage('❌ فشل الحذف');
      }
    } catch (error) {
      setMessage('❌ حدث خطأ');
    } finally {
      setDeletingId(null);
    }
  };

  const sendBroadcast = async () => {
    if (!emailSubject || !emailBody) {
      setMessage('❌ أدخل عنوان ورسالة');
      return;
    }

    setSending(true);
    setMessage('');

    const bodyWithLink = `${emailBody}\n\n---\n🔗 ${process.env.NEXT_PUBLIC_BASE_URL || 'https://velix-eg.store'}\n🛍️ تسوق الآن!`;

    try {
      const response = await fetch(`/api/${ADMIN_SECRET_PATH}/newsletter/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: emailSubject,
          body: bodyWithLink,
          subscribers: subscribers.map(s => s.email)
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(`✅ تم الإرسال إلى ${toArabicNumber(data.sent)} مشترك`);
        setEmailSubject('');
        setEmailBody('');
      } else {
        setMessage('❌ ' + data.error);
      }
    } catch (error) {
      setMessage('❌ حدث خطأ');
    } finally {
      setSending(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-[#FCFCFC] to-[#F5F3F0] pt-28 pb-12">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-black">المشتركين في النشرة البريدية</h1>
            <p className="text-rose-gold/60 text-sm font-bold mt-1">إدارة وإرسال العروض للمشتركين</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchSubscribers}
              className="px-4 py-2 bg-rose-gold/10 hover:bg-rose-gold/20 text-rose-gold rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              تحديث
            </button>
            <Link
              href={`/${ADMIN_SECRET_PATH}`}
              className="px-4 py-2 bg-rose-gold/10 hover:bg-rose-gold/20 text-rose-gold rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              العودة للداشبورد
            </Link>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-md border border-rose-gold/20">
            <div className="text-2xl font-black text-rose-gold">{toArabicNumber(subscribers.length)}</div>
            <div className="text-black/50 text-sm font-bold mt-1">📧 إجمالي المشتركين</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md border border-rose-gold/20 bg-linear-to-r from-rose-gold/10 to-copper/10">
            <div className="text-2xl font-black text-rose-gold">{toArabicNumber(subscribers.filter(s => s.status === 'active').length)}</div>
            <div className="text-rose-gold/70 text-sm font-bold mt-1">✅ مشتركين نشطين</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md border border-rose-gold/20">
            <div className="text-2xl font-black text-black/60">{toArabicNumber(subscribers.filter(s => s.status === 'inactive').length)}</div>
            <div className="text-black/50 text-sm font-bold mt-1">⭕ ملغي الاشتراك</div>
          </div>
        </div>

        {/* إضافة بريد يدوي */}
        <div className="bg-white rounded-2xl shadow-md border border-rose-gold/20 p-6 mb-8">
          <h2 className="text-xl font-black text-black mb-4 flex items-center gap-2">
            <span className="text-2xl text-rose-gold">➕</span>
            إضافة مشترك يدوي
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={manualEmail}
              onChange={(e) => setManualEmail(e.target.value)}
              placeholder="أدخل البريد الإلكتروني"
              className="flex-1 p-3 bg-[#FDF8F5] border-2 border-rose-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent text-black font-bold"
            />
            <button
              onClick={addManualSubscriber}
              disabled={addingManual}
              className="px-6 py-3 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold rounded-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 shadow-md"
            >
              {addingManual ? 'جاري...' : '+ إضافة'}
            </button>
          </div>
        </div>

        {/* إرسال إشعار جماعي */}
        <div className="bg-white rounded-2xl shadow-md border border-rose-gold/20 p-6 mb-8">
          <h2 className="text-xl font-black text-black mb-4 flex items-center gap-2">
            <span className="text-2xl text-rose-gold">📢</span>
            إرسال إشعار جماعي
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-black text-rose-gold mb-1">عنوان الإشعار</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="مثال: 🎉 عروض الصيف وصلت!"
                className="w-full p-3 bg-[#FDF8F5] border-2 border-rose-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent text-black font-bold"
              />
            </div>
            <div>
              <label className="block text-sm font-black text-rose-gold mb-1">محتوى الإشعار</label>
              <textarea
                rows={5}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="اكتب رسالتك هنا..."
                className="w-full p-3 bg-[#FDF8F5] border-2 border-rose-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent text-black font-bold resize-none"
              />
              <p className="text-xs text-rose-gold/50 mt-1 font-bold">
                ℹ️ رابط الموقع هيتضاف تلقائياً في الآخر
              </p>
            </div>
            <button
              onClick={sendBroadcast}
              disabled={sending}
              className="w-full bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white py-3 rounded-xl font-bold hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 shadow-md"
            >
              {sending ? 'جاري الإرسال...' : `📧 إرسال إلى ${toArabicNumber(subscribers.length)} مشترك`}
            </button>
            {message && (
              <p className={`text-center font-bold ${message.includes('✅') ? 'text-rose-gold' : message.includes('ℹ️') ? 'text-blue-600' : 'text-red-500'}`}>
                {message}
              </p>
            )}
          </div>
        </div>

        {/* قائمة المشتركين */}
        <div className="bg-white rounded-2xl shadow-md border border-rose-gold/20 overflow-hidden">
          <div className="p-4 border-b border-rose-gold/20 bg-rose-gold/5 flex justify-between items-center">
            <p className="font-black text-black">📋 قائمة المشتركين</p>
            <p className="font-black text-rose-gold">العدد: {toArabicNumber(subscribers.length)}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-rose-gold/10">
                <tr>
                  <th className="p-3 text-right font-black text-black">البريد الإلكتروني</th>
                  <th className="p-3 text-right font-black text-black">تاريخ الإشتراك</th>
                  <th className="p-3 text-right font-black text-black">الحالة</th>
                  <th className="p-3 text-center font-black text-black">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-black/50 font-bold">
                      <div className="w-8 h-8 border-4 border-rose-gold/20 border-t-rose-gold rounded-full animate-spin mx-auto mb-2" />
                      جاري التحميل...
                    </td>
                  </tr>
                ) : subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-black/50 font-bold">
                      مفيش مشتركين حتى الآن
                    </td>
                  </tr>
                ) : (
                  subscribers.map((sub) => (
                    <tr key={sub.id} className="border-t border-rose-gold/10 hover:bg-rose-gold/5 transition-all duration-200">
                      <td className="p-3 font-bold text-black">{sub.email}</td>
                      <td className="p-3 text-black/60 text-sm font-bold">
                        {new Date(sub.subscribed_at).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          sub.status === 'active' 
                            ? 'bg-rose-gold/20 text-rose-gold' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {sub.status === 'active' ? '✅ نشط' : '⭕ ملغي'}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => deleteSubscriber(sub.id, sub.email)}
                          disabled={deletingId === sub.id}
                          className="text-red-500 hover:text-red-700 transition p-1"
                          title="حذف المشترك"
                        >
                          {deletingId === sub.id ? (
                            <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
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