// components/AnalyticsStats.tsx
'use client';

import { useState, useEffect } from 'react';

interface AnalyticsData {
  totalOrders: number;
  totalSales: number;
  totalCustomers: number;
  averageRating: number;
  totalReviews: number;
}

export default function AnalyticsStats() {
  const [stats, setStats] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/analytics');
        const data = await res.json();
        if (!data.error) {
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
        setIsVisible(true);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) return null;
  if (!stats || (stats.totalOrders === 0 && stats.totalSales === 0)) return null;

  return (
    <div className={`bg-white py-12 border-t border-gray-100 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
          
          {/* عدد الطلبات */}
          <div className="group">
            <div className="text-3xl md:text-4xl font-black text-gray-900 mb-2 group-hover:scale-105 transition-transform">
              {stats.totalOrders.toLocaleString()}+
            </div>
            <p className="text-gray-500 font-bold text-sm">طلب مكتمل</p>
          </div>

          {/* عدد العملاء */}
          <div className="group">
            <div className="text-3xl md:text-4xl font-black text-gray-900 mb-2 group-hover:scale-105 transition-transform">
              {stats.totalCustomers.toLocaleString()}+
            </div>
            <p className="text-gray-500 font-bold text-sm">عميل وثق فينا</p>
          </div>

          {/* التقييم - يظهر بس لو فيه تقييمات */}
          {stats.averageRating > 0 && (
            <div className="group">
              <div className="text-3xl md:text-4xl font-black text-gray-900 mb-2 group-hover:scale-105 transition-transform flex items-center justify-center gap-1">
                {stats.averageRating}
                <span className="text-yellow-500 text-2xl">★</span>
              </div>
              <p className="text-gray-500 font-bold text-sm">تقييم العملاء</p>
            </div>
          )}

          {/* إجمالي المبيعات */}
          <div className="group">
            <div className="text-3xl md:text-4xl font-black text-gray-900 mb-2 group-hover:scale-105 transition-transform">
              {Math.floor(stats.totalSales).toLocaleString()}+
            </div>
            <p className="text-black font-bold text-sm">جنيه مبيعات</p>
          </div>
        </div>
      </div>
    </div>
  );
}