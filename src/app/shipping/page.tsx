'use client';

import { motion } from "framer-motion";
import Link from "next/link";

export default function ShippingPage() {
  const policies = [
    {
      number: "١",
      title: "مناطق التوصيل",
      icon: "📍",
      content: "في الفترة الحالية، بنوصل الطلبات لمناطق: القاهرة، الجيزة، قليوبية. بنشتغل على تغطية باقي المحافظات قريباً إن شاء الله."
    },
    {
      number: "٢",
      title: "الشحن مجاني",
      icon: "🎉",
      content: "الشحن مجاني بالكامل لجميع الطلبات في مناطق القاهرة والجيزة وقليوبية. من غير أي رسوم إضافية، اطلب دلوقتي واستلم مجاناً."
    },
    {
      number: "٣",
      title: "مدة التوصيل",
      icon: "⏱️",
      content: "بنجهز طلبك خلال ١-٣ أيام عمل. مدة التوصيل من ٢-٥ أيام عمل حسب منطقتك. بنشتغل بأسرع وقت عشان توصل طلبك بأمان."
    },
    {
      number: "٤",
      title: "متابعة الطلب",
      icon: "📱",
      content: "هنبعتلك رقم تتبع الطلب على واتساب بعد ما الشحنة تخرج. تقدر تتابع طلبك خطوة بخطوة لحد ما يوصل باب بيتك."
    },
    {
      number: "٥",
      title: "حالات الطلب",
      icon: "📦",
      content: "تقدر تتابع حالة طلبك من لوحة التحكم: قيد المعالجة، قيد التجهيز، تم الشحن، تم التوصيل. هتعرف فين طلبك في أي وقت."
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
            نوصللك لحد باب بيتك
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-4">
            سياسة الشحن
          </h1>
          <div className="w-20 h-0.5 bg-linear-to-r from-emerald-500 to-green-500 mx-auto mb-6" />
          <p className="text-black/60 font-bold text-base max-w-2xl mx-auto">
            بنوصل طلباتك للقاهرة والجيزة وقليوبية بأسرع وقت وبأعلى جودة
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
              className="group relative bg-white rounded-2xl p-6 border border-black/10 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start gap-5">
                {/* Number Circle */}
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-full bg-linear-to-r from-emerald-500 to-green-500 flex items-center justify-center text-white font-black text-lg shadow-md">
                    {policy.number}
                  </div>
                </div>
                
                {/* Content */}
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

        {/* Free Shipping Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 bg-linear-to-r from-emerald-50 to-green-50 rounded-2xl p-6 text-center border border-emerald-200"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-3xl">🎉</span>
            <span className="text-2xl">🚚</span>
            <span className="text-3xl">🎉</span>
          </div>
          <h3 className="text-xl font-black text-emerald-700 mb-2">الشحن مجاني بالكامل!</h3>
          <p className="text-emerald-600/80 font-bold">
            لجميع الطلبات في القاهرة والجيزة وقليوبية. اطلب دلوقتي واستلم مجاناً
          </p>
          <Link
            href="/products"
            className="inline-block mt-4 px-6 py-2 bg-linear-to-r from-emerald-500 via-green-500 to-lime-400 text-white font-black rounded-full text-sm hover:scale-[1.02] transition-all duration-300 shadow-md"
          >
            🛒 تسوق الآن
          </Link>
        </motion.div>

        {/* Delivery Areas Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mt-6 bg-white rounded-2xl p-6 border border-black/10 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-2xl">📍</span>
            <h3 className="text-lg font-black text-black">مناطق التوصيل الحالية</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {["القاهرة", "الجيزة", "قليوبية"].map((city, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-gray-50 border border-black/10 rounded-full text-black font-bold text-sm"
              >
                {city}
              </span>
            ))}
          </div>
          <p className="text-black/50 text-sm mt-4 font-bold">
            🚀 بنشتغل على تغطية باقي المحافظات قريباً
          </p>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-black/60 font-bold">
            عندك أي سؤال عن الشحن؟
          </p>
          <a
            href="https://wa.me/201500125133"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-2 text-emerald-600 font-black hover:text-emerald-700 transition"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.52 3.48A11.94 11.94 0 0012.05 0C5.5 0 .2 5.3.2 11.84c0 2.08.54 4.1 1.57 5.88L0 24l6.46-1.68a11.82 11.82 0 005.6 1.43h.01c6.55 0 11.85-5.3 11.85-11.84 0-3.16-1.23-6.12-3.4-8.43zM12.06 21.2h-.01a9.3 9.3 0 01-4.74-1.3l-.34-.2-3.83 1 1.02-3.73-.22-.38a9.23 9.23 0 01-1.42-4.92c0-5.12 4.18-9.3 9.32-9.3 2.49 0 4.82.97 6.58 2.74a9.22 9.22 0 012.73 6.57c0 5.13-4.18 9.32-9.29 9.32zm5.2-6.94c-.28-.14-1.66-.82-1.92-.91-.26-.1-.45-.14-.64.14-.19.28-.73.91-.9 1.1-.16.19-.33.21-.61.07-.28-.14-1.17-.43-2.23-1.36-.83-.74-1.38-1.65-1.54-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.5.14-.17.19-.28.28-.47.1-.19.05-.36-.02-.5-.07-.14-.64-1.54-.88-2.12-.23-.56-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.28-1 1-.97 2.43.03 1.43 1.04 2.8 1.19 3 .14.19 2.05 3.12 5.02 4.38.7.3 1.24.48 1.66.62.7.22 1.33.19 1.83.11.56-.08 1.66-.68 1.9-1.33.23-.65.23-1.2.16-1.33-.07-.12-.26-.19-.54-.33z" />
            </svg>
            تواصل مع خدمة العملاء
          </a>
        </motion.div>
      </div>
    </div>
  );
}