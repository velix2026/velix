'use client';

import { motion } from "framer-motion";
import Link from "next/link";

export default function TermsPage() {
  const terms = [
    {
      number: "١",
      title: "قبول الشروط",
      icon: "📜",
      content: "باستخدامك لموقع VELIX، انت بتوافق على الالتزام بكل الشروط والأحكام المذكورة هنا. لو مش موافق، برجاء عدم استخدام الموقع."
    },
    {
      number: "٢",
      title: "المنتجات والأسعار",
      icon: "🏷️",
      content: "بنحافظ على دقة المعلومات والصور، لكن ممكن يكون في اختلافات بسيطة في الألوان بسبب إعدادات الشاشة. الأسعار اللي معروضة هي الأسعار النهائية والرسوم المضافة (إن وجدت) بتظهر قبل إتمام الطلب."
    },
    {
      number: "٣",
      title: "الطلب والدفع",
      icon: "💳",
      content: "بمجرد تأكيد الطلب، بنعتبر إنك موافق على شراء المنتج بالسعر المحدد. الدفع عند الاستلام بالكاش، أو بأي طريقة دفع متاحة في وقتها."
    },
    {
      number: "٤",
      title: "التوصيل",
      icon: "🚚",
      content: "بنوصل الطلبات للمناطق المحددة في سياسة الشحن. مدة التوصيل تقريبية وبتعتمد على منطقتك وظروف التوصيل."
    },
    {
      number: "٥",
      title: "الاستبدال والاسترجاع",
      icon: "🔄",
      content: "سياسة الاستبدال والاسترجاع متاحة خلال ١٤ يوم للمنتجات العادية، و٣ أيام للمنتجات المخفضة (استبدال فقط). راجع سياسة الاستبدال والاسترجاع للتفاصيل."
    },
    {
      number: "٦",
      title: "الملكية الفكرية",
      icon: "©️",
      content: "كل المحتوى على الموقع (صور، نصوص، شعارات، تصاميم) ملك لـ VELIX ولا يجوز استخدامه بدون إذن خطي مسبق."
    },
    {
      number: "٧",
      title: "تعديل الشروط",
      icon: "✏️",
      content: "نحتفظ بالحق في تعديل الشروط في أي وقت. التعديلات بتظهر على الصفحة، واستمرار استخدامك للموقع بعد التعديل يعتبر موافقة منك."
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-28 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-xs text-black/50 tracking-[0.2em] uppercase font-black mb-3 block">
            الاتفاقية بينك وبين VELIX
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-4">
            شروط الاستخدام
          </h1>
          <div className="w-20 h-0.5 bg-linear-to-r from-emerald-500 to-green-500 mx-auto mb-6" />
          <p className="text-black/60 font-bold text-base max-w-2xl mx-auto">
            باستخدامك للموقع، انت بتوافق على الشروط دي. لو فيه أي استفسار، اتصل بنا
          </p>
        </motion.div>

        {/* Terms List */}
        <div className="space-y-6">
          {terms.map((term, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="group relative bg-white rounded-2xl p-6 border border-black/10 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start gap-5">
                {/* Number Circle */}
                <div className="shrink-0">
                  <div className="w-10 h-10 rounded-full bg-linear-to-r from-emerald-500 to-green-500 flex items-center justify-center text-white font-black text-base shadow-sm">
                    {term.number}
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{term.icon}</span>
                    <h2 className="text-xl font-black text-black">
                      {term.title}
                    </h2>
                  </div>
                  <p className="text-black/70 font-bold leading-relaxed">
                    {term.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Important Note Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 bg-amber-50 rounded-2xl p-6 border border-amber-200"
        >
          <div className="flex items-start gap-4">
            <div className="text-3xl">⚠️</div>
            <div>
              <h3 className="text-lg font-black text-amber-800 mb-2">ملاحظة مهمة</h3>
              <p className="text-amber-700/80 font-bold text-sm leading-relaxed">
                VELIX تحتفظ بالحق في تعديل هذه الشروط في أي وقت. التعديلات تدخل حيز التنفيذ فور نشرها على الصفحة.
                استمرار استخدامك للموقع بعد التعديل يعتبر موافقة منك على الشروط الجديدة.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="mt-6 bg-white rounded-2xl p-6 border border-black/10"
        >
          <div className="flex items-start gap-4">
            <div className="text-3xl">💬</div>
            <div>
              <h3 className="text-lg font-black text-black mb-2">للاستفسارات</h3>
              <p className="text-black/60 font-bold text-sm mb-3">
                لو عندك أي سؤال أو استفسار عن الشروط دي، اتصل بنا:
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://wa.me/201500125133"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-emerald-600 font-black hover:text-emerald-700 transition"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.52 3.48A11.94 11.94 0 0012.05 0C5.5 0 .2 5.3.2 11.84c0 2.08.54 4.1 1.57 5.88L0 24l6.46-1.68a11.82 11.82 0 005.6 1.43h.01c6.55 0 11.85-5.3 11.85-11.84 0-3.16-1.23-6.12-3.4-8.43zM12.06 21.2h-.01a9.3 9.3 0 01-4.74-1.3l-.34-.2-3.83 1 1.02-3.73-.22-.38a9.23 9.23 0 01-1.42-4.92c0-5.12 4.18-9.3 9.32-9.3 2.49 0 4.82.97 6.58 2.74a9.22 9.22 0 012.73 6.57c0 5.13-4.18 9.32-9.29 9.32zm5.2-6.94c-.28-.14-1.66-.82-1.92-.91-.26-.1-.45-.14-.64.14-.19.28-.73.91-.9 1.1-.16.19-.33.21-.61.07-.28-.14-1.17-.43-2.23-1.36-.83-.74-1.38-1.65-1.54-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.5.14-.17.19-.28.28-.47.1-.19.05-.36-.02-.5-.07-.14-.64-1.54-.88-2.12-.23-.56-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.28-1 1-.97 2.43.03 1.43 1.04 2.8 1.19 3 .14.19 2.05 3.12 5.02 4.38.7.3 1.24.48 1.66.62.7.22 1.33.19 1.83.11.56-.08 1.66-.68 1.9-1.33.23-.65.23-1.2.16-1.33-.07-.12-.26-.19-.54-.33z" />
                  </svg>
                  واتساب
                </a>
                <a
                  href="mailto:velix2026@gmail.com"
                  className="inline-flex items-center gap-2 text-emerald-600 font-black hover:text-emerald-700 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  البريد الإلكتروني
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Last Updated */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-6 text-center"
        >
          <p className="text-black/40 text-xs font-bold">
            آخر تحديث: {new Date().toLocaleDateString('ar-EG')}
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.75 }}
          className="mt-8 text-center"
        >
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/shipping"
              className="text-sm text-black/50 font-bold hover:text-emerald-600 transition"
            >
              سياسة الشحن
            </Link>
            <span className="text-black/30">•</span>
            <Link
              href="/returns"
              className="text-sm text-black/50 font-bold hover:text-emerald-600 transition"
            >
              سياسة الاستبدال والاسترجاع
            </Link>
            <span className="text-black/30">•</span>
            <Link
              href="/privacy"
              className="text-sm text-black/50 font-bold hover:text-emerald-600 transition"
            >
              سياسة الخصوصية
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}