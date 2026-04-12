'use client';

import { motion } from "framer-motion";
import Link from "next/link";

export default function ContactClient() {
  const contactMethods = [
    {
      title: "واتساب",
      icon: "💬",
      description: "أسرع طريقة للتواصل، رد فوري",
      action: "https://wa.me/201500125133",
      buttonText: "تواصل عبر واتساب",
      buttonColor: "from-emerald-500 to-green-600",
      bgColor: "from-emerald-50 to-green-50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-700",
    },
    {
      title: "البريد الإلكتروني",
      icon: "📧",
      description: "للاقتراحات والشكاوى والاستفسارات",
      action: "mailto:velix2026@gmail.com",
      buttonText: "أرسل إيميل",
      buttonColor: "from-blue-500 to-indigo-600",
      bgColor: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
    },
    {
      title: "إنستجرام",
      icon: "📸",
      description: "تابع آخر التشكيلات والعروض",
      action: "https://instagram.com/velix.2026",
      buttonText: "تابعنا على إنستجرام",
      buttonColor: "from-pink-500 to-rose-600",
      bgColor: "from-pink-50 to-rose-50",
      borderColor: "border-pink-200",
      textColor: "text-pink-700",
    },
    {
      title: "فيسبوك",
      icon: "👍",
      description: "تواصل معنا وشاركنا رأيك",
      action: "https://facebook.com/velix2026",
      buttonText: "تابعنا على فيسبوك",
      buttonColor: "from-blue-600 to-blue-800",
      bgColor: "from-blue-50 to-sky-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
    },
    {
      title: "تيك توك",
      icon: "🎵",
      description: "شوف فيديوهات المنتجات الحصرية",
      action: "https://tiktok.com/@velix2026",
      buttonText: "تابعنا على تيك توك",
      buttonColor: "from-black to-gray-800",
      bgColor: "from-gray-50 to-gray-100",
      borderColor: "border-gray-200",
      textColor: "text-gray-700",
    },
    {
      title: "قناة واتساب",
      icon: "📢",
      description: "آخر العروض والمنتجات الجديدة",
      action: "https://whatsapp.com/channel/0029VbCamY1JUM2iILsajJ3t",
      buttonText: "اشترك في القناة",
      buttonColor: "from-emerald-600 to-green-700",
      bgColor: "from-emerald-50 to-green-50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-700",
    },
  ];

  // ✅ JSON-LD للصفحة
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "اتصل بنا - VELIX",
    "description": "تواصل مع فريق VELIX عبر多种 وسائل التواصل",
    "url": "https://velix-eg.store/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "VELIX",
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+201500125133",
          "contactType": "customer service",
          "availableLanguage": ["Arabic", "English"],
          "contactOption": "TollFree"
        },
        {
          "@type": "ContactPoint",
          "email": "velix2026@gmail.com",
          "contactType": "email support"
        }
      ],
      "sameAs": [
        "https://instagram.com/velix.2026",
        "https://facebook.com/velix2026",
        "https://tiktok.com/@velix2026",
        "https://whatsapp.com/channel/0029VbCamY1JUM2iILsajJ3t"
      ]
    }
  };

  return (
    <>
      {/* ✅ JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      
      <div className="bg-white min-h-screen pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="text-xs text-black/50 tracking-[0.2em] uppercase font-black mb-3 block">
              تواصل معانا
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-4">
              اتصل بنا
            </h1>
            <div className="w-20 h-0.5 bg-linear-to-r from-emerald-500 to-green-500 mx-auto mb-6" />
            <p className="text-black/60 font-bold text-base max-w-2xl mx-auto">
              فريق VELIX موجود عشان يساعدك في أي وقت. اختار الطريقة المناسبة لك وتواصل معانا
            </p>
          </motion.div>

          {/* Contact Methods Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {contactMethods.map((method, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`group relative bg-linear-to-br ${method.bgColor} rounded-2xl p-6 border ${method.borderColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="text-center">
                  {/* Icon */}
                  <div className={`text-5xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {method.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className={`text-xl font-black ${method.textColor} mb-2`}>
                    {method.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-black/60 font-bold text-sm mb-4">
                    {method.description}
                  </p>
                  
                  {/* Button */}
                  <a
                    href={method.action}
                    target={method.title !== "البريد الإلكتروني" ? "_blank" : undefined}
                    rel={method.title !== "البريد الإلكتروني" ? "noopener noreferrer" : undefined}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r ${method.buttonColor} text-white font-black rounded-full text-sm hover:scale-[1.02] transition-all duration-300 shadow-md hover:shadow-lg`}
                  >
                    {method.buttonText}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Office Hours Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-2xl p-6 border border-black/10 text-center mb-6"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-3xl">⏰</span>
              <h3 className="text-lg font-black text-black">ساعات العمل</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div>
                <p className="font-black text-black">الأحد - الخميس</p>
                <p className="text-black/60 font-bold">١٠ ص - ١٠ م</p>
              </div>
              <div>
                <p className="font-black text-black">الجمعة</p>
                <p className="text-black/60 font-bold">٢ م - ١٠ م</p>
              </div>
              <div>
                <p className="font-black text-black">السبت</p>
                <p className="text-black/60 font-bold">١٢ م - ١٠ م</p>
              </div>
            </div>
            <p className="text-emerald-600 text-xs mt-3 font-bold">
              🚀 فريق الدعم الفني متاح 24 ساعة على واتساب
            </p>
          </motion.div>

          {/* Response Time Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            className="bg-linear-to-r from-emerald-50 to-green-50 rounded-2xl p-5 text-center border border-emerald-200 mb-6"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">⚡</span>
              <p className="text-emerald-700 font-black text-sm">
                بنرد على استفساراتك خلال ٢٤ ساعة كحد أقصى
              </p>
              <span className="text-2xl">⚡</span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-center"
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
              <span className="text-black/30">•</span>
              <Link
                href="/terms"
                className="text-sm text-black/50 font-bold hover:text-emerald-600 transition"
              >
                شروط الاستخدام
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}