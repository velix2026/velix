'use client';

import { motion } from "framer-motion";
import Link from "next/link";

export default function ReturnsClient() {
  const policies = [
    {
      number: "١",
      title: "فترة الاسترجاع",
      icon: "📅",
      content: "تقدر ترجع المنتج خلال ١٤ يوم من تاريخ الاستلام. لو فاتت المدة، للأسف ما نقدرش نقبل الاسترجاع."
    },
    {
      number: "٢",
      title: "شروط الاسترجاع",
      icon: "📋",
      content: "المنتج يكون بحالته الأصلية، غير مغسول ولا مستخدم، ومعاه كل التاجات والملصقات. اللبس الداخلي (مايوهات، أندر وير) ما يسترجعش لأسباب صحية."
    },
    {
      number: "٣",
      title: "مصاريف الشحن",
      icon: "🚚",
      content: "الاستبدال مجاني تماماً. في حالة الاسترجاع والاسترداد، مصاريف الشحن الراجع على العميل (٣٠ جنيه مصري). الاسترداد بيتم خلال ٥-٧ أيام عمل."
    },
    {
      number: "٤",
      title: "كيفية البدء في الإرجاع",
      icon: "📱",
      content: "كلمنا على واتساب: 01500125133، وهنوجهك خطوة بخطوة. هتستلم رقم طلب الإرجاع، وتشحن المنتج لينا، واحنا نكمل الباقي."
    },
    {
      number: "٥",
      title: "الاستبدال",
      icon: "🔄",
      content: "لو عايز تغير المقاس أو اللون، تقدر تطلب استبدال خلال ١٤ يوم. الشحن مجاني، وهنبعتلك البديل بعد ما نستلم المنتج الأصلي."
    }
  ];

  const returnSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "سياسة الاستبدال والاسترجاع - VELIX",
    "description": "سياسة إرجاع واستبدال منتجات متجر VELIX",
    "url": "https://velix-eg.store/returns",
    "mainEntity": {
      "@type": "MerchantReturnPolicy",
      "applicableCountry": "EG",
      "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
      "merchantReturnDays": 14,
      "returnMethod": "https://schema.org/ReturnByMail",
      "returnFees": "https://schema.org/FreeReturn",
      "returnPolicyCountry": "EG"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(returnSchema) }}
      />
      
      <div className="bg-linear-to-b from-white via-[#FCFCFC] to-[#F5F3F0] min-h-screen pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="text-xs text-rose-gold tracking-[0.2em] uppercase font-bold mb-3 block">
              راحة بالك أولويتنا
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-4">
              سياسة الاستبدال والاسترجاع
            </h1>
            <div className="w-20 h-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full mx-auto mb-6" />
            <p className="text-black/60 font-bold text-base max-w-2xl mx-auto">
              منتجك مش عجبك؟ ما عليش، احنا معاك لحد ما تبقى راضي ١٠٠٪
            </p>
          </motion.div>

          {/* Policies List */}
          <div className="space-y-6">
            {policies.map((policy, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="group relative bg-white rounded-2xl p-6 border border-rose-gold/20 hover:shadow-xl hover:shadow-rose-gold/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-5">
                  <div className="shrink-0">
                    <div className="w-10 h-10 rounded-full bg-linear-to-r from-rose-gold-light via-rose-gold to-copper flex items-center justify-center text-white font-black text-base shadow-sm">
                      {policy.number}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{policy.icon}</span>
                      <h2 className="text-xl font-black text-black">
                        {policy.title}
                      </h2>
                    </div>
                    <p className="text-black/70 font-bold leading-relaxed">
                      {policy.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 bg-linear-to-r from-rose-gold/10 to-copper/10 rounded-2xl p-6 text-center border border-rose-gold/30"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-3xl">✅</span>
              <span className="text-2xl">💯</span>
              <span className="text-3xl">❤️</span>
            </div>
            <h3 className="text-xl font-black text-rose-gold mb-2">رضاك هو هدفنا</h3>
            <p className="text-rose-gold/80 font-bold">
              احنا واقفين جنبك حتى بعد الشراء. أي مشكلة، احنا موجودين عشان نحلها
            </p>
          </motion.div>

          {/* WhatsApp CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="mt-6 bg-white rounded-2xl p-6 border border-rose-gold/20 text-center"
          >
            <h3 className="text-lg font-black text-black mb-3">عايز تبدأ إرجاع أو استبدال؟</h3>
            <a
              href="https://wa.me/201500125133"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-black rounded-full hover:shadow-lg transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.52 3.48A11.94 11.94 0 0012.05 0C5.5 0 .2 5.3.2 11.84c0 2.08.54 4.1 1.57 5.88L0 24l6.46-1.68a11.82 11.82 0 005.6 1.43h.01c6.55 0 11.85-5.3 11.85-11.84 0-3.16-1.23-6.12-3.4-8.43zM12.06 21.2h-.01a9.3 9.3 0 01-4.74-1.3l-.34-.2-3.83 1 1.02-3.73-.22-.38a9.23 9.23 0 01-1.42-4.92c0-5.12 4.18-9.3 9.32-9.3 2.49 0 4.82.97 6.58 2.74a9.22 9.22 0 012.73 6.57c0 5.13-4.18 9.32-9.29 9.32zm5.2-6.94c-.28-.14-1.66-.82-1.92-.91-.26-.1-.45-.14-.64.14-.19.28-.73.91-.9 1.1-.16.19-.33.21-.61.07-.28-.14-1.17-.43-2.23-1.36-.83-.74-1.38-1.65-1.54-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.5.14-.17.19-.28.28-.47.1-.19.05-.36-.02-.5-.07-.14-.64-1.54-.88-2.12-.23-.56-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.28-1 1-.97 2.43.03 1.43 1.04 2.8 1.19 3 .14.19 2.05 3.12 5.02 4.38.7.3 1.24.48 1.66.62.7.22 1.33.19 1.83.11.56-.08 1.66-.68 1.9-1.33.23-.65.23-1.2.16-1.33-.07-.12-.26-.19-.54-.33z"/>
              </svg>
              كلمنا على واتساب
            </a>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            className="mt-8 text-center"
          >
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/shipping"
                className="text-sm text-black/50 font-bold hover:text-rose-gold transition"
              >
                سياسة الشحن
              </Link>
              <span className="text-black/30">•</span>
              <Link
                href="/privacy"
                className="text-sm text-black/50 font-bold hover:text-rose-gold transition"
              >
                سياسة الخصوصية
              </Link>
              <span className="text-black/30">•</span>
              <Link
                href="/terms"
                className="text-sm text-black/50 font-bold hover:text-rose-gold transition"
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
