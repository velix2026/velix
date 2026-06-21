'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const ADMIN_SECRET_PATH = process.env.NEXT_PUBLIC_ADMIN_SECRET_PATH || 'velix-admin-x7k9m';

interface Coupon {
  id: number;
  code: string;
  discount_type: string;
  discount_value: number;
  min_order_amount: number;
  max_uses: number;
  current_uses: number;
  is_active: boolean;
  expires_at: string | null;
  description: string;
  created_at: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState(0);
  const [minOrderAmount, setMinOrderAmount] = useState(0);
  const [maxUses, setMaxUses] = useState(0);
  const [expiresAt, setExpiresAt] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => { fetchCoupons(); }, []);

  async function fetchCoupons() {
    try {
      const res = await fetch(`/api/${ADMIN_SECRET_PATH}/coupons`);
      const data = await res.json();
      setCoupons(Array.isArray(data) ? data : []);
    } catch {} finally { setLoading(false); }
  }

  function openNew() {
    setEditing(null);
    setCode(''); setDiscountType('percentage'); setDiscountValue(0);
    setMinOrderAmount(0); setMaxUses(0); setExpiresAt(''); setDescription(''); setIsActive(true);
    setShowForm(true);
  }

  function openEdit(c: Coupon) {
    setEditing(c);
    setCode(c.code); setDiscountType(c.discount_type); setDiscountValue(c.discount_value);
    setMinOrderAmount(c.min_order_amount); setMaxUses(c.max_uses);
    setExpiresAt(c.expires_at ? c.expires_at.split('T')[0] : ''); setDescription(c.description || ''); setIsActive(c.is_active);
    setShowForm(true);
  }

  async function handleSave() {
    if (!code || !discountValue) return;
    const body = { code, discountType, discountValue: Number(discountValue), minOrderAmount: Number(minOrderAmount), maxUses: Number(maxUses), expiresAt: expiresAt || null, description, isActive };
    try {
      const res = editing
        ? await fetch(`/api/${ADMIN_SECRET_PATH}/coupons`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...body, id: editing.id }) })
        : await fetch(`/api/${ADMIN_SECRET_PATH}/coupons`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) { setShowForm(false); fetchCoupons(); }
    } catch {}
  }

  async function handleDelete(id: number) {
    if (!confirm('متأكد من حذف الكوبون؟')) return;
    try { await fetch(`/api/${ADMIN_SECRET_PATH}/coupons?id=${id}`, { method: 'DELETE' }); fetchCoupons(); } catch {}
  }

  return (
    <div className="min-h-screen bg-[#F5F3F0] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href={`/${ADMIN_SECRET_PATH}`} className="text-sm text-rose-gold hover:underline mb-2 block">الرجوع للوحة التحكم</Link>
            <h1 className="text-3xl font-black text-black">أكواد الخصم</h1>
          </div>
          <button onClick={openNew} className="px-6 py-3 bg-rose-gold text-white font-bold rounded-xl hover:scale-[1.02] transition">+ كود خصم جديد</button>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 border border-rose-gold/20 mb-8">
            <h2 className="text-xl font-black text-black mb-4">{editing ? 'تعديل كود الخصم' : 'كود خصم جديد'}</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-black/60 mb-1">الكود</label>
                <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} className="w-full p-3 bg-[#FDF8F5] border border-rose-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold text-black font-bold" placeholder="مثال: VELIX20" />
              </div>
              <div>
                <label className="block text-sm font-bold text-black/60 mb-1">نوع الخصم</label>
                <select value={discountType} onChange={e => setDiscountType(e.target.value)} className="w-full p-3 bg-[#FDF8F5] border border-rose-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold text-black">
                  <option value="percentage">نسبة مئوية</option>
                  <option value="fixed">قيمة ثابتة</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-black/60 mb-1">قيمة الخصم</label>
                <input type="number" value={discountValue} onChange={e => setDiscountValue(Number(e.target.value))} className="w-full p-3 bg-[#FDF8F5] border border-rose-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold text-black" />
              </div>
              <div>
                <label className="block text-sm font-bold text-black/60 mb-1">أقل قيمة طلب</label>
                <input type="number" value={minOrderAmount} onChange={e => setMinOrderAmount(Number(e.target.value))} className="w-full p-3 bg-[#FDF8F5] border border-rose-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold text-black" />
              </div>
              <div>
                <label className="block text-sm font-bold text-black/60 mb-1">أقصى عدد استخدامات</label>
                <input type="number" value={maxUses} onChange={e => setMaxUses(Number(e.target.value))} className="w-full p-3 bg-[#FDF8F5] border border-rose-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold text-black" />
              </div>
              <div>
                <label className="block text-sm font-bold text-black/60 mb-1">تاريخ الانتهاء (اختياري)</label>
                <input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} className="w-full p-3 bg-[#FDF8F5] border border-rose-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold text-black" />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-bold text-black/60 mb-1">الوصف</label>
                <input value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 bg-[#FDF8F5] border border-rose-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold text-black" />
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-5 h-5 accent-rose-gold" />
                  <span className="font-bold text-black/60">نشط</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleSave} className="px-6 py-3 bg-rose-gold text-white font-bold rounded-xl hover:scale-[1.02] transition">حفظ</button>
              <button onClick={() => setShowForm(false)} className="px-6 py-3 bg-black/10 text-black font-bold rounded-xl hover:bg-black/20 transition">إلغاء</button>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="text-center py-16"><div className="w-12 h-12 border-4 border-rose-gold/20 border-t-rose-gold rounded-full animate-spin mx-auto" /></div>
        ) : (
          <div className="grid gap-4">
            {coupons.map(c => (
              <div key={c.id} className="bg-white rounded-2xl p-5 border border-rose-gold/20 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-rose-gold text-lg">{c.code}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${c.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{c.is_active ? 'نشط' : 'متوقف'}</span>
                  </div>
                  <p className="text-sm text-black/60">
                    {c.discount_type === 'percentage' ? `${c.discount_value}%` : `${c.discount_value} جنيه`}
                    {c.min_order_amount > 0 && ` | أقل طلب: ${c.min_order_amount} ج`}
                    {c.max_uses > 0 && ` | استخدم ${c.current_uses}/${c.max_uses}`}
                    {c.expires_at && ` | ينتهي: ${new Date(c.expires_at).toLocaleDateString('ar-EG')}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(c)} className="px-4 py-2 bg-rose-gold/10 text-rose-gold font-bold rounded-xl hover:bg-rose-gold/20 transition text-sm">تعديل</button>
                  <button onClick={() => handleDelete(c.id)} className="px-4 py-2 bg-red-50 text-red-500 font-bold rounded-xl hover:bg-red-100 transition text-sm">حذف</button>
                </div>
              </div>
            ))}
            {coupons.length === 0 && !loading && (
              <div className="text-center py-16 text-black/40 font-bold">مفيش أكواد خصم. اضف أول كود!</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
