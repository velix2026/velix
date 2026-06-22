'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toArabicNumber } from '@/lib/utils';
import { getTier, TIERS, pointsToEGP, canRedeem } from '@/lib/loyalty';

interface LoyaltyData {
  enrolled: boolean;
  phone: string;
  points: number;
  totalEarned: number;
  tier: ReturnType<typeof getTier>;
  transactions: Array<{
    id: number;
    points: number;
    type: string;
    description: string;
    reference_type: string | null;
    created_at: string;
  }>;
}

export default function LoyaltyCard({ phone: initialPhone }: { phone?: string }) {
  const [phone, setPhone] = useState(initialPhone || '');
  const [data, setData] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLoyalty = async (p: string) => {
    if (!p) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/loyalty?phone=${encodeURIComponent(p)}&stats=true`);
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const d = await res.json();
      setData(d);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حصل خطأ');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialPhone) fetchLoyalty(initialPhone);
  }, [initialPhone]);

  const tierColors: Record<string, string> = {
    bronze: 'from-amber-700 to-amber-600',
    silver: 'from-slate-400 to-slate-300',
    gold: 'from-yellow-600 to-yellow-400',
    platinum: 'from-cyan-700 to-cyan-400',
  };

  const tierBadgeColors: Record<string, string> = {
    bronze: 'bg-amber-100 text-amber-800 border-amber-300',
    silver: 'bg-slate-100 text-slate-800 border-slate-300',
    gold: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    platinum: 'bg-cyan-100 text-cyan-800 border-cyan-300',
  };

  return (
    <div className="bg-white rounded-2xl border border-rose-gold/20 overflow-hidden shadow-sm">
      {!data ? (
        <div className="p-4 space-y-3">
          <h3 className="font-black text-black text-sm">نقاط المكافآت</h3>
          <div className="flex gap-2">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="رقم التليفون"
              className="flex-1 p-2 text-sm border border-rose-gold/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-gold font-bold text-black"
            />
            <button
              onClick={() => fetchLoyalty(phone)}
              disabled={loading || !phone}
              className="px-4 py-2 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white text-sm font-bold rounded-xl hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {loading ? '...' : 'اعرض'}
            </button>
          </div>
          {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
          <p className="text-xs text-black/50 font-bold">ادخل رقم تليفونك عشان تشوف نقاطك</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={data.phone}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-black text-black text-sm">نقاط المكافآت</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tierBadgeColors[data.tier.name] || tierBadgeColors.bronze}`}>
                {data.tier.nameAr}
              </span>
            </div>

            <div className={`bg-linear-to-r ${tierColors[data.tier.name] || tierColors.bronze} rounded-xl p-4 text-white text-center`}>
              <div className="text-3xl font-black">{toArabicNumber(data.points)}</div>
              <div className="text-xs opacity-80 font-bold">نقطة</div>
            </div>

            {data.tier.nextTierName && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-black/60">
                  <span>{data.tier.nextTierName}</span>
                  <span>{toArabicNumber(data.tier.pointsToNext)} نقطة متبقية</span>
                </div>
                <div className="w-full h-2 bg-rose-gold/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${data.tier.progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <p className="text-xs font-black text-black">مميزاتك:</p>
              {data.tier.benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs text-black/70 font-bold">
                  <span className="text-rose-gold shrink-0 mt-0.5">✓</span>
                  {b}
                </div>
              ))}
            </div>

            {data.transactions.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-black text-black">آخر الحركات:</p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {data.transactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="flex justify-between items-center text-xs bg-rose-gold/5 rounded-lg p-2">
                      <div>
                        <span className={`font-bold ${tx.type === 'earned' ? 'text-green-600' : 'text-red-500'}`}>
                          {tx.type === 'earned' ? '+' : '-'}{toArabicNumber(Math.abs(tx.points))}
                        </span>
                        <span className="text-black/50 mr-1 text-[10px]">{tx.description}</span>
                      </div>
                      <span className="text-[10px] text-black/40">{new Date(tx.created_at).toLocaleDateString('ar-EG')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {canRedeem(data.points) && (
              <div className="bg-rose-gold/5 rounded-xl p-3 text-center border border-rose-gold/20">
                <p className="text-xs font-bold text-black/70">
                  تقدر تستبدل {toArabicNumber(Math.floor(data.points / 100) * 100)} نقطة بـ {toArabicNumber(pointsToEGP(data.points))} ج.م
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
