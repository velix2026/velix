'use client';

import { formatPrice } from '@/lib/utils';
import { toArabicNumber } from '@/lib/utils';

interface SalesSummaryProps {
  totalDeliveredSales: number;
  totalCancelledSales: number;
  deliveredCount: number;
  cancelledCount: number;
}

export default function SalesSummary({ 
  totalDeliveredSales, 
  totalCancelledSales, 
  deliveredCount, 
  cancelledCount 
}: SalesSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
      {/* المبيعات المكتملة */}
      <div className="bg-linear-to-r from-rose-gold/10 to-copper/10 rounded-xl md:rounded-2xl p-3 md:p-5 shadow-md border border-rose-gold/20">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <div className="text-xl md:text-3xl font-black text-rose-gold mb-1">
              {formatPrice(totalDeliveredSales)}
            </div>
            <div className="text-rose-gold text-xs md:text-sm font-bold">
              💰 إجمالي المبيعات المكتملة
            </div>
            <div className="text-rose-gold/70 text-[10px] md:text-xs font-bold mt-1">
              {toArabicNumber(deliveredCount)} طلب مكتمل
            </div>
          </div>
          <div className="text-3xl md:text-5xl text-rose-gold">💰</div>
        </div>
      </div>

      {/* المبيعات الملغية */}
      <div className="bg-linear-to-r from-red-50 to-rose-50 rounded-xl md:rounded-2xl p-3 md:p-5 shadow-md border border-red-200">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <div className="text-xl md:text-3xl font-black text-red-700 mb-1">
              {formatPrice(totalCancelledSales)}
            </div>
            <div className="text-red-700 text-xs md:text-sm font-bold">
              ❌ إجمالي المبيعات الملغية
            </div>
            <div className="text-red-700/70 text-[10px] md:text-xs font-bold mt-1">
              {toArabicNumber(cancelledCount)} طلب ملغي
            </div>
          </div>
          <div className="text-3xl md:text-5xl text-red-500">❌</div>
        </div>
      </div>
    </div>
  );
}