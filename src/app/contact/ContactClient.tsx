'use client';

import { motion } from "framer-motion";
import Link from "next/link";

export default function ContactClient() {
  const contactMethods = [
    {
      title: "واتساب",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.52 3.48A11.94 11.94 0 0012.05 0C5.5 0 .2 5.3.2 11.84c0 2.08.54 4.1 1.57 5.88L0 24l6.46-1.68a11.82 11.82 0 005.6 1.43h.01c6.55 0 11.85-5.3 11.85-11.84 0-3.16-1.23-6.12-3.4-8.43zM12.06 21.2h-.01a9.3 9.3 0 01-4.74-1.3l-.34-.2-3.83 1 1.02-3.73-.22-.38a9.23 9.23 0 01-1.42-4.92c0-5.12 4.18-9.3 9.32-9.3 2.49 0 4.82.97 6.58 2.74a9.22 9.22 0 012.73 6.57c0 5.13-4.18 9.32-9.29 9.32zm5.2-6.94c-.28-.14-1.66-.82-1.92-.91-.26-.1-.45-.14-.64.14-.19.28-.73.91-.9 1.1-.16.19-.33.21-.61.07-.28-.14-1.17-.43-2.23-1.36-.83-.74-1.38-1.65-1.54-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.5.14-.17.19-.28.28-.47.1-.19.05-.36-.02-.5-.07-.14-.64-1.54-.88-2.12-.23-.56-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.28-1 1-.97 2.43.03 1.43 1.04 2.8 1.19 3 .14.19 2.05 3.12 5.02 4.38.7.3 1.24.48 1.66.62.7.22 1.33.19 1.83.11.56-.08 1.66-.68 1.9-1.33.23-.65.23-1.2.16-1.33-.07-.12-.26-.19-.54-.33z"/>
        </svg>
      ),
      description: "أسرع طريقة للتواصل، رد فوري",
      action: "https://wa.me/201500125133",
      buttonText: "تواصل عبر واتساب",
    },
    {
      title: "البريد الإلكتروني",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      description: "للاستفسارات والشكاوى والاقتراحات",
      action: "mailto:velixstore.eg@gmail.com",
      buttonText: "أرسل إيميل",
    },
    {
      title: "إنستجرام",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      description: "تابع آخر التشكيلات والعروض",
      action: "https://instagram.com/velixstore.eg",
      buttonText: "تابعنا على إنستجرام",
    },
    {
      title: "فيسبوك",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      description: "تواصل معنا وشاركنا رأيك",
      action: "https://facebook.com/velixstore.eg",
      buttonText: "تابعنا على فيسبوك",
    },
    {
      title: "تيك توك",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      ),
      description: "شوف فيديوهات المنتجات الحصرية",
      action: "https://tiktok.com/@velixstore.eg",
      buttonText: "تابعنا على تيك توك",
    },
    {
      title: "قناة واتساب",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.52 3.48A11.94 11.94 0 0012.05 0C5.5 0 .2 5.3.2 11.84c0 2.08.54 4.1 1.57 5.88L0 24l6.46-1.68a11.82 11.82 0 005.6 1.43h.01c6.55 0 11.85-5.3 11.85-11.84 0-3.16-1.23-6.12-3.4-8.43zM12.06 21.2h-.01a9.3 9.3 0 01-4.74-1.3l-.34-.2-3.83 1 1.02-3.73-.22-.38a9.23 9.23 0 01-1.42-4.92c0-5.12 4.18-9.3 9.32-9.3 2.49 0 4.82.97 6.58 2.74a9.22 9.22 0 012.73 6.57c0 5.13-4.18 9.32-9.29 9.32zm5.2-6.94c-.28-.14-1.66-.82-1.92-.91-.26-.1-.45-.14-.64.14-.19.28-.73.91-.9 1.1-.16.19-.33.21-.61.07-.28-.14-1.17-.43-2.23-1.36-.83-.74-1.38-1.65-1.54-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.5.14-.17.19-.28.28-.47.1-.19.05-.36-.02-.5-.07-.14-.64-1.54-.88-2.12-.23-.56-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.28-1 1-.97 2.43.03 1.43 1.04 2.8 1.19 3 .14.19 2.05 3.12 5.02 4.38.7.3 1.24.48 1.66.62.7.22 1.33.19 1.83.11.56-.08 1.66-.68 1.9-1.33.23-.65.23-1.2.16-1.33-.07-.12-.26-.19-.54-.33z"/>
        </svg>
      ),
      description: "آخر العروض والمنتجات الجديدة",
      action: "https://whatsapp.com/channel/0029VbCamY1JUM2iILsajJ3t",
      buttonText: "اشترك في القناة",
    },
  ];

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "اتصل بنا - VELIX",
    "description": "تواصل مع فريق VELIX عبر وسائل التواصل المختلفة",
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
          "email": "velixstore.eg@gmail.com",
          "contactType": "email support"
        }
      ],
      "sameAs": [
        "https://instagram.com/velixstore.eg",
        "https://facebook.com/velixstore.eg",
        "https://tiktok.com/@velixstore.eg",
        "https://whatsapp.com/channel/0029VbCamY1JUM2iILsajJ3t"
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      
      <div className="bg-linear-to-b from-white via-[#FCFCFC] to-[#F5F3F0] min-h-screen pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Header - نحاسي */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="text-xs text-rose-gold tracking-[0.2em] uppercase font-bold mb-3 block">
              تواصل معانا
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-4">
              اتصل بنا
            </h1>
            <div className="w-20 h-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full mx-auto mb-6" />
            <p className="text-black/60 font-bold text-base max-w-2xl mx-auto">
              فريق VELIX موجود عشان يساعدك في أي وقت. اختار الطريقة اللي تناسبك وتواصل معانا
            </p>
          </motion.div>

          {/* Contact Methods Grid - نحاسي */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {contactMethods.map((method, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="group relative bg-white rounded-2xl p-6 border border-rose-gold/20 hover:shadow-xl hover:shadow-rose-gold/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-center">
                  {/* Icon - نحاسي */}
                  <div className="flex justify-center mb-4 text-rose-gold group-hover:scale-110 transition-transform duration-300">
                    {method.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-black text-rose-gold mb-2">
                    {method.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-black/60 font-bold text-sm mb-4">
                    {method.description}
                  </p>
                  
                  {/* Button - نحاسي */}
                  <a
                    href={method.action}
                    target={method.title !== "البريد الإلكتروني" ? "_blank" : undefined}
                    rel={method.title !== "البريد الإلكتروني" ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-black rounded-full text-sm hover:scale-[1.02] transition-all duration-300 shadow-md hover:shadow-rose-gold/30"
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

          {/* Office Hours Card - نحاسي */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-2xl p-6 border border-rose-gold/20 text-center mb-6 hover:shadow-md transition"
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
            <p className="text-rose-gold text-xs mt-3 font-bold">
              🚀 فريق الدعم الفني متاح ٢٤ ساعة على واتساب
            </p>
          </motion.div>

          {/* Response Time Banner - نحاسي */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            className="bg-linear-to-r from-rose-gold/10 to-copper/10 rounded-2xl p-5 text-center border border-rose-gold/30 mb-6"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">⚡</span>
              <p className="text-rose-gold font-black text-sm">
                بنرد على استفساراتك خلال ٢٤ ساعة كحد أقصى
              </p>
              <span className="text-2xl">⚡</span>
            </div>
          </motion.div>

          {/* Quick Links - نحاسي */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-center"
          >
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/shipping" className="text-sm text-black/50 font-bold hover:text-rose-gold transition">
                سياسة الشحن
              </Link>
              <span className="text-black/30">•</span>
              <Link href="/returns" className="text-sm text-black/50 font-bold hover:text-rose-gold transition">
                سياسة الاستبدال والاسترجاع
              </Link>
              <span className="text-black/30">•</span>
              <Link href="/privacy" className="text-sm text-black/50 font-bold hover:text-rose-gold transition">
                سياسة الخصوصية
              </Link>
              <span className="text-black/30">•</span>
              <Link href="/terms" className="text-sm text-black/50 font-bold hover:text-rose-gold transition">
                شروط الاستخدام
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}