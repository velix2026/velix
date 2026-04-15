// components/SizeGuideModal.tsx
'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  // منع التمرير خلف المودال
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // إغلاق المودال بالـ Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* الخلفية */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* المودال */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95%] max-w-2xl max-h-[85vh] overflow-y-auto"
          >
            <div className="bg-white rounded-3xl shadow-2xl border border-rose-gold/20 overflow-hidden">
              
              {/* Header */}
              <div className="relative bg-linear-to-r from-rose-gold-light via-rose-gold to-copper p-4 text-center">
                <button
                  onClick={onClose}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">📏</span>
                  <h3 className="text-lg font-black text-white">دليل المقاسات</h3>
                </div>
              </div>

              {/* المحتوى */}
              <div className="p-6 space-y-6">
                {/* ازاي تقيس نفسك */}
                <div>
                  <h4 className="text-lg font-black text-black mb-3 flex items-center gap-2">
                    <span className="text-rose-gold">📏</span> ازاي تقيس نفسك صح؟
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-rose-gold font-bold">1️⃣</span>
                      <div>
                        <p className="font-bold text-black">محيط الصدر (Chest)</p>
                        <p className="text-black/60">لف شريط القياس حوالين أعرض جزء في صدرك (تحت الإبط بشوية)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-rose-gold font-bold">2️⃣</span>
                      <div>
                        <p className="font-bold text-black">طول الجسم (Length)</p>
                        <p className="text-black/60">من أعلى كتفك لحد المكان اللي عايز التيشرت يوصل له</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-rose-gold font-bold">3️⃣</span>
                      <div>
                        <p className="font-bold text-black">عرض الكتف (Shoulder)</p>
                        <p className="text-black/60">المسافة بين طرف كتفك الأيمن والأيسر</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-rose-gold font-bold">4️⃣</span>
                      <div>
                        <p className="font-bold text-black">محيط الخصر (Waist)</p>
                        <p className="text-black/60">لف شريط القياس حوالين أنحف جزء في خصرك</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* جدول المقاسات - التيشرتات */}
                <div>
                  <h4 className="text-lg font-black text-black mb-3 flex items-center gap-2">
                    <span className="text-rose-gold">👕</span> جدول مقاسات التيشرتات
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-rose-gold/10">
                          <th className="border border-rose-gold/20 p-2 text-center">المقاس</th>
                          <th className="border border-rose-gold/20 p-2 text-center">الصدر (سم)</th>
                          <th className="border border-rose-gold/20 p-2 text-center">الطول (سم)</th>
                          <th className="border border-rose-gold/20 p-2 text-center">الوزن (كجم)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td className="border p-2 text-center font-bold">S</td><td className="border p-2 text-center">88-92</td><td className="border p-2 text-center">66-68</td><td className="border p-2 text-center">55-65</td></tr>
                        <tr className="bg-rose-gold/5"><td className="border p-2 text-center font-bold">M</td><td className="border p-2 text-center">92-96</td><td className="border p-2 text-center">68-70</td><td className="border p-2 text-center">65-75</td></tr>
                        <tr><td className="border p-2 text-center font-bold">L</td><td className="border p-2 text-center">96-100</td><td className="border p-2 text-center">70-72</td><td className="border p-2 text-center">75-85</td></tr>
                        <tr className="bg-rose-gold/5"><td className="border p-2 text-center font-bold">XL</td><td className="border p-2 text-center">100-104</td><td className="border p-2 text-center">72-74</td><td className="border p-2 text-center">85-95</td></tr>
                        <tr><td className="border p-2 text-center font-bold">2XL</td><td className="border p-2 text-center">104-108</td><td className="border p-2 text-center">74-76</td><td className="border p-2 text-center">95-110</td></tr>
                        <tr className="bg-rose-gold/5"><td className="border p-2 text-center font-bold">3XL</td><td className="border p-2 text-center">108-112</td><td className="border p-2 text-center">76-78</td><td className="border p-2 text-center">110-125</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* جدول المقاسات - الهوديز */}
                <div>
                  <h4 className="text-lg font-black text-black mb-3 flex items-center gap-2">
                    <span className="text-rose-gold">🧥</span> جدول مقاسات الهوديز
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-rose-gold/10">
                          <th className="border border-rose-gold/20 p-2 text-center">المقاس</th>
                          <th className="border border-rose-gold/20 p-2 text-center">الصدر (سم)</th>
                          <th className="border border-rose-gold/20 p-2 text-center">الطول (سم)</th>
                          <th className="border border-rose-gold/20 p-2 text-center">الوزن (كجم)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td className="border p-2 text-center font-bold">S</td><td className="border p-2 text-center">94-98</td><td className="border p-2 text-center">64-66</td><td className="border p-2 text-center">55-65</td></tr>
                        <tr className="bg-rose-gold/5"><td className="border p-2 text-center font-bold">M</td><td className="border p-2 text-center">98-102</td><td className="border p-2 text-center">66-68</td><td className="border p-2 text-center">65-75</td></tr>
                        <tr><td className="border p-2 text-center font-bold">L</td><td className="border p-2 text-center">102-106</td><td className="border p-2 text-center">68-70</td><td className="border p-2 text-center">75-85</td></tr>
                        <tr className="bg-rose-gold/5"><td className="border p-2 text-center font-bold">XL</td><td className="border p-2 text-center">106-110</td><td className="border p-2 text-center">70-72</td><td className="border p-2 text-center">85-95</td></tr>
                        <tr><td className="border p-2 text-center font-bold">2XL</td><td className="border p-2 text-center">110-114</td><td className="border p-2 text-center">72-74</td><td className="border p-2 text-center">95-110</td></tr>
                        <tr className="bg-rose-gold/5"><td className="border p-2 text-center font-bold">3XL</td><td className="border p-2 text-center">114-118</td><td className="border p-2 text-center">74-76</td><td className="border p-2 text-center">110-125</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* نصائح إضافية */}
                <div className="bg-rose-gold/5 rounded-xl p-4 border border-rose-gold/20">
                  <h4 className="font-black text-black mb-2 flex items-center gap-2">
                    <span className="text-rose-gold">💡</span> نصائح مهمة
                  </h4>
                  <ul className="space-y-1 text-sm text-black/70">
                    <li>• لو بين مقاسين، اختار المقاس الأكبر (تقدري تستبدل مجاناً)</li>
                    <li>• الهوديز بتكون أكبر من التيشرتات بنفس المقاس بحوالي ٢-٣ سم</li>
                    <li>• القياسات تقريبية وقد تختلف حسب القصة (Slim / Regular / Oversize)</li>
                    <li>• عندك ١٤ يوم لتستبدل المنتج لو المقاس مش مناسب</li>
                  </ul>
                </div>

                {/* زر التسوق */}
                <div className="text-center pt-2">
                  <button
                    onClick={onClose}
                    className="bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold px-6 py-2.5 rounded-full hover:scale-[1.02] transition-all duration-300"
                  >
                    ✕ إغلاق
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}