'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const ADMIN_SECRET_PATH = process.env.NEXT_PUBLIC_ADMIN_SECRET_PATH || 'velix-admin-x7k9m';

interface Activity {
  id: number;
  username: string;
  action: string;
  details: string;
  ip_address: string;
  created_at: string;
}

export default function AdminActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const limit = 50;

  useEffect(() => { fetchActivity(); }, [page]);

  async function fetchActivity() {
    try {
      const res = await fetch(`/api/${ADMIN_SECRET_PATH}/activity?limit=${limit}&offset=${page * limit}`);
      const data = await res.json();
      setActivities(data.activities || []);
      setTotal(data.total || 0);
    } catch {} finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-[#F5F3F0] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href={`/${ADMIN_SECRET_PATH}`} className="text-sm text-rose-gold hover:underline mb-2 block">الرجوع للوحة التحكم</Link>
          <h1 className="text-3xl font-black text-black">سجل النشاطات</h1>
          <p className="text-black/40">إجمالي {total} نشاط</p>
        </div>

        {loading ? (
          <div className="text-center py-16"><div className="w-12 h-12 border-4 border-rose-gold/20 border-t-rose-gold rounded-full animate-spin mx-auto" /></div>
        ) : (
          <>
            <div className="bg-white rounded-2xl border border-rose-gold/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-rose-gold/5 border-b border-rose-gold/20">
                      <th className="p-4 text-right text-sm font-black text-black">المستخدم</th>
                      <th className="p-4 text-right text-sm font-black text-black">الإجراء</th>
                      <th className="p-4 text-right text-sm font-black text-black">التفاصيل</th>
                      <th className="p-4 text-right text-sm font-black text-black">IP</th>
                      <th className="p-4 text-right text-sm font-black text-black">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map(a => (
                      <tr key={a.id} className="border-b border-rose-gold/10 hover:bg-rose-gold/5">
                        <td className="p-4 font-bold text-black">{a.username}</td>
                        <td className="p-4"><span className="px-2 py-1 bg-rose-gold/10 text-rose-gold text-sm rounded-lg">{a.action}</span></td>
                        <td className="p-4 text-black/60 text-sm">{a.details}</td>
                        <td className="p-4 text-black/40 text-sm">{a.ip_address}</td>
                        <td className="p-4 text-black/40 text-sm">{new Date(a.created_at).toLocaleString('ar-EG')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {total > limit && (
              <div className="flex justify-center gap-4 mt-6">
                <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 bg-white border border-rose-gold/20 rounded-xl font-bold text-black disabled:opacity-30 hover:bg-rose-gold/5 transition">
                  السابق
                </button>
                <span className="px-4 py-2 font-bold text-black/60">صفحة {page + 1} من {Math.ceil(total / limit)}</span>
                <button disabled={(page + 1) * limit >= total} onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 bg-white border border-rose-gold/20 rounded-xl font-bold text-black disabled:opacity-30 hover:bg-rose-gold/5 transition">
                  التالي
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
