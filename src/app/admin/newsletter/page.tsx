// app/admin/newsletter/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Subscriber {
  id: number;
  email: string;
  subscribed_at: string;
  status: string;
}

export default function AdminNewsletter() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const router = useRouter();

  // التحقق من تسجيل الدخول
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    if (isLoggedIn === 'true') {
      setIsAuthenticated(true);
      fetchSubscribers();
    }
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'velix@2026';
      const response = await fetch('/api/newsletter', {
        headers: { 'Authorization': `Bearer ${adminPassword}` }
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'velix@2026') {
      localStorage.setItem('admin_logged_in', 'true');
      setIsAuthenticated(true);
      fetchSubscribers();
    } else {
      alert('كلمة المرور غير صحيحة');
    }
  };

  const sendBroadcast = async () => {
    if (!emailSubject || !emailBody) {
      setMessage('❌ برجاء إدخال عنوان ورسالة');
      return;
    }

    setSending(true);
    setMessage('');

    try {
      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: emailSubject,
          body: emailBody,
          subscribers: subscribers.map(s => s.email)
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(`✅ تم إرسال الإشعار إلى ${data.sent} مشترك`);
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-center text-black mb-6">لوحة التحكم</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-bold text-black"
            />
            <button
              type="submit"
              className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition"
            >
              دخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-black">📧 المشتركين في النشرة البريدية</h1>
          <button
            onClick={() => {
              localStorage.removeItem('admin_logged_in');
              setIsAuthenticated(false);
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-bold"
          >
            تسجيل خروج
          </button>
        </div>

        {/* إرسال إشعار جماعي */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-black mb-4">📢 إرسال إشعار جماعي</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-black mb-1">عنوان الإشعار</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="مثال: 🎉 عروض الصيف وصلت!"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-bold"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-1">محتوى الإشعار</label>
              <textarea
                rows={5}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="أكتب رسالتك هنا..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-bold resize-none"
              />
            </div>
            <button
              onClick={sendBroadcast}
              disabled={sending}
              className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
            >
              {sending ? 'جاري الإرسال...' : `إرسال إلى ${subscribers.length} مشترك`}
            </button>
            {message && (
              <p className={`text-center font-bold ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
          </div>
        </div>

        {/* قائمة المشتركين */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <p className="font-bold text-black">عدد المشتركين: {subscribers.length}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-right font-bold text-black">البريد الإلكتروني</th>
                  <th className="p-3 text-right font-bold text-black">تاريخ الإشتراك</th>
                  <th className="p-3 text-right font-bold text-black">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={3} className="p-8 text-center text-gray-500">جاري التحميل...</td></tr>
                ) : subscribers.length === 0 ? (
                  <tr><td colSpan={3} className="p-8 text-center text-gray-500">لا يوجد مشتركين حتى الآن</td></tr>
                ) : (
                  subscribers.map((sub) => (
                    <tr key={sub.id} className="border-t border-gray-100">
                      <td className="p-3 text-black font-bold">{sub.email}</td>
                      <td className="p-3 text-gray-500">{new Date(sub.subscribed_at).toLocaleDateString('ar-EG')}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                          نشط
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