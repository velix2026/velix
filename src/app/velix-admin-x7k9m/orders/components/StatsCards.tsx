'use client';

import { toArabicNumber } from '@/lib/utils';

interface StatsCardsProps {
  stats: {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

const statCards = [
  { key: 'total', label: '📦 إجمالي الطلبات', color: 'text-black', bg: 'bg-white' },
  { key: 'pending', label: '⏳ قيد المعالجة', color: 'text-amber-700', bg: 'bg-amber-50' },
  { key: 'processing', label: '🔧 قيد التجهيز', color: 'text-rose-gold', bg: 'bg-rose-gold/10' },
  { key: 'shipped', label: '🚚 تم الشحن', color: 'text-copper', bg: 'bg-copper/10' },
  { key: 'delivered', label: '✅ تم التوصيل', color: 'text-emerald-700', bg: 'bg-emerald-50' },
  { key: 'cancelled', label: '❌ ملغي', color: 'text-red-700', bg: 'bg-red-50' },
];

export default function StatsCards({ stats, activeFilter, setActiveFilter }: StatsCardsProps) {
  console.log('🎯 [StatsCards] Received stats:', stats);
  
  const cards = statCards.map(card => ({
    ...card,
    value: stats[card.key as keyof typeof stats] || 0,
  }));

  console.log('🎯 [StatsCards] Cards with values:', cards.map(c => ({ key: c.key, value: c.value })));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3 mb-6 md:mb-8">
      {cards.map(stat => (
        <button
          key={stat.key}
          onClick={() => setActiveFilter(stat.key === activeFilter ? 'all' : stat.key)}
          className={`${stat.bg} rounded-xl md:rounded-2xl p-2 md:p-3 shadow-md border transition-all duration-300 ${
            activeFilter === stat.key 
              ? 'border-rose-gold ring-2 ring-rose-gold/50 scale-[1.02]' 
              : 'border-rose-gold/20'
          }`}
        >
          <div className={`text-lg md:text-2xl font-black ${stat.color}`}>
            {toArabicNumber(stat.value)}
          </div>
          <div className="text-black/70 text-[10px] md:text-xs font-bold mt-1 leading-tight">
            {stat.label}
          </div>
        </button>
      ))}
    </div>
  );
}