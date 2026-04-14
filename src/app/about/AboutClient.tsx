'use client';

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

export default function AboutClient() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  // أرقام حقيقية - بالأرقام العربية
  const stats = [
    { number: "١٠٠+", label: "قطعة مصممة", icon: "👕" },
    { number: "٥٠+", label: "عميل راضي", icon: "⭐" },
    { number: "٣٠", label: "يوم للتوصيل", icon: "🚚" },
    { number: "١٠٠%", label: "صناعة مصرية", icon: "🇪🇬" },
  ];

  const values = [
    { icon: "✨", title: "جودة استثنائية", desc: "من أول الخامة لآخر غرزة" },
    { icon: "🎨", title: "تصميم عصري", desc: "أناقة مصرية بلمسة عالمية" },
    { icon: "🤝", title: "ثقة العميل", desc: "رضاك هو نجاحنا الحقيقي" },
    { icon: "❤️", title: "شغف", desc: "بنحب اللي بنعمله" },
    { icon: "🌍", title: "عالمية", desc: "فخامة مصرية للعالم كله" },
  ];

  const features = [
    { title: "خامات فاخرة", desc: "بنختار أفضل الأقمشة عشان تحس بالراحة طول اليوم", icon: "✨" },
    { title: "تصميم مصري", desc: "كل قطعة تحمل روح مصرية بلمسة عصرية", icon: "🎨" },
    { title: "دفع عند الاستلام", desc: "اطمن على منتجك قبل ما تدفع", icon: "💰" },
    { title: "توصيل سريع", desc: "من ٢ لـ ٥ أيام لباب بيتك", icon: "🚚" },
    { title: "دعم فوري", desc: "فريقنا معاك في أي وقت", icon: "💬" },
  ];

  // ✅ JSON-LD للصفحة
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "عن VELIX - براند ملابس مصري",
    "description": "تعرف على قصة VELIX، أول براند ملابس مصري عالمي. رؤيتنا ورسالتنا وقيمنا.",
    "url": "https://velix-eg.store/about",
    "mainEntity": {
      "@type": "Organization",
      "name": "VELIX",
      "foundingDate": "2024",
      "foundingLocation": "Cairo, Egypt",
      "areaServed": "EG",
      "sameAs": [
        "https://instagram.com/velixstore.eg",
        "https://facebook.com/velixstore.eg",
        "https://tiktok.com/@velixstore.eg"
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      
      <div className="bg-linear-to-b from-white via-[#FCFCFC] to-[#F5F3F0] min-h-screen pt-28 pb-16 overflow-hidden">
        <div className="container mx-auto px-4">
          
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-24"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-4"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-rose-gold/20 blur-xl rounded-full" />
                <span className="relative text-xs text-rose-gold tracking-[0.3em] uppercase font-black">
                  VELIX
                </span>
              </div>
            </motion.div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-black mb-6 leading-[1.1]">
              مش مجرد براند
              <br />
              <span className="bg-linear-to-r from-rose-gold-light via-rose-gold to-copper bg-clip-text text-transparent">
                أسلوب حياة
              </span>
            </h1>
            <div className="w-24 h-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full mx-auto my-6" />
            <p className="text-black/70 font-bold text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              إحنا هنا عشان نغيّر مفهوم الموضة في مصر. 
              <br />
              كل قطعة بنصنعها بتحمل حلم، وكل تفصيلة فيها قصة.
            </p>
          </motion.div>

          {/* القصة */}
          <div ref={ref} className="mb-28">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                <div className="relative">
                  <div className="absolute -top-6 -right-6 text-6xl text-rose-gold/10 font-black select-none">"</div>
                  <h2 className="text-3xl md:text-4xl font-black text-black mb-6">
                    إزاي ابتدت الحكاية؟
                  </h2>
                  <div className="space-y-5 text-black/70 font-bold leading-relaxed">
                    <p>
                      كل حاجة بدأت من حلم صغير جوه القاهرة... حلم إننا نعمل حاجة مختلفة، 
                      حاجة تخلّي كل شاب مصري يبقى فخور بلبسه، ويحس إنه لابس حاجة مميزة.
                    </p>
                    <p>
                      VELIX مش مجرد ماركة ملابس، ده مشروع بيحلم إن مصر تكون عندها براند عالمي 
                      ينافس أكتر البراندز شهرة في العالم. إحنا عايزين نثبت للعالم إن المصري 
                      يقدر يعمل حاجة فخمة، حاجة تستاهل.
                    </p>
                    <div className="pt-4">
                      <div className="border-r-4 border-rose-gold pr-4">
                        <p className="text-rose-gold font-black text-lg italic">
                          "VELIX .. فخامة في كل تفصيلة"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative"
              >
                <div className="relative h-112.5 rounded-3xl overflow-hidden shadow-2xl group ring-1 ring-rose-gold/20">
                  <Image
                    src="/images/about-story.png"
                    alt="VELIX رحلة التأسيس - صناعة مصرية"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-6 right-6 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                    <span className="text-rose-gold font-black text-sm flex items-center gap-2">
                      <span className="text-lg">🇪🇬</span> صناعة مصرية 100%
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* إحصائيات - نحاسية */}
          <div className="mb-28">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-black text-black">أرقام بتتكلم</h2>
              <div className="w-16 h-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full mx-auto mt-3" />
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  onMouseEnter={() => setHoveredStat(idx)}
                  onMouseLeave={() => setHoveredStat(null)}
                  className="text-center group cursor-pointer"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-rose-gold mb-1">{stat.number}</div>
                  <div className="text-black/60 font-bold text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* الرؤية والرسالة - نحاسية */}
          <div className="grid md:grid-cols-2 gap-8 mb-28">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group relative bg-white rounded-2xl p-8 border border-rose-gold/20 hover:shadow-xl hover:shadow-rose-gold/10 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-gold/5 rounded-full blur-2xl" />
              <div className="relative">
                <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-300 inline-block">👁️</div>
                <h3 className="text-2xl font-black text-black mb-4">رؤيتنا</h3>
                <p className="text-black/70 font-bold leading-relaxed text-lg">
                  نبي نكون أول براند مصري عالمي، نثبت للعالم إن الموضة المصرية عندها حاجة تقولها.
                  عايزين كل شاب في أي حتة في الدنيا يعرف إن VELIX دي علامة فخر وجودة.
                </p>
                <div className="mt-6 h-1 w-20 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group relative bg-white rounded-2xl p-8 border border-rose-gold/20 hover:shadow-xl hover:shadow-rose-gold/10 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-rose-gold/5 rounded-full blur-2xl" />
              <div className="relative">
                <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-300 inline-block">🎯</div>
                <h3 className="text-2xl font-black text-black mb-4">رسالتنا</h3>
                <p className="text-black/70 font-bold leading-relaxed text-lg">
                  نقدملك ملابس تخليك تحس بالفرق. جودة تحسها في إيدك، وتصميم يخليك تتطلع في المراية 
                  وتقول "دا أنا". وكل ده بدعم الصناعة المصرية وبأيد مصرية.
                </p>
                <div className="mt-6 h-1 w-20 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full" />
              </div>
            </motion.div>
          </div>

          {/* القيم */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mb-28"
          >
            <span className="text-xs text-rose-gold tracking-[0.2em] uppercase font-black mb-3 block">
              ما بنؤمن بيه
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-black mb-4">قيمنا</h2>
            <div className="w-20 h-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full mx-auto mb-12" />
            
            <div className="grid md:grid-cols-5 gap-6">
              {values.map((value, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + idx * 0.1 }}
                  className="group p-6 rounded-2xl bg-white border border-rose-gold/20 hover:shadow-xl hover:shadow-rose-gold/10 transition-all duration-300 hover:-translate-y-1 text-center"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="font-black text-black text-lg mb-2">{value.title}</h3>
                  <p className="text-black/60 font-bold text-sm leading-relaxed">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* لماذا VELIX - نحاسية */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-linear-to-br from-white to-rose-gold/5 rounded-3xl p-12 mb-28 text-center border border-rose-gold/20"
          >
            <h2 className="text-3xl md:text-4xl font-black text-black mb-4">ليه VELIX؟</h2>
            <p className="text-black/60 font-bold text-lg mb-12 max-w-2xl mx-auto">
              في عالم مليان خيارات، إحنا بنقدملك حاجة مختلفة.
            </p>
            <div className="grid md:grid-cols-5 gap-8">
              {features.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.6 + idx * 0.1 }}
                  className="text-center group"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 text-rose-gold">{item.icon}</div>
                  <h3 className="font-black text-black text-base mb-2">{item.title}</h3>
                  <p className="text-black/60 font-bold text-xs leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA - نحاسي */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-center relative py-16"
          >
            <div className="absolute inset-0 bg-linear-to-r from-rose-gold/5 via-copper/5 to-rose-gold/5 rounded-3xl blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-black text-black mb-4">
                جهّز نفسك لجزء من التاريخ
              </h2>
              <p className="text-black/60 font-bold mb-8 max-w-xl mx-auto">
                أول براند مصري عالمي في الطريق. متبقاش بره الصورة.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-3 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white px-10 py-4 rounded-full font-black text-base hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl hover:shadow-rose-gold/30"
              >
                <span className="text-lg">🚀</span>
                تسوق دلوقتي
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}