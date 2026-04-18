'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const heroSchema = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    'name': 'VELIX',
    'description': 'براند ملابس مصري بيقدم ستايل عصري للشباب. جودة عالية وتفاصيل مميزة مع دفع عند الاستلام.',
    'url': 'https://velix-eg.store',
    'logo': 'https://velix-eg.store/images/logo.png',
    'image': 'https://velix-eg.store/images/hero-model.png',
    'telephone': '+201500125133',
    'priceRange': '$$',
    'paymentAccepted': 'Cash on Delivery',
    'currenciesAccepted': 'EGP',
    'areaServed': 'EG',
    'address': {
      '@type': 'PostalAddress',
      'addressCountry': 'EG',
      'addressRegion': 'Qalyubia',
      'addressLocality': 'Shubra El-Kheima',
      'streetAddress': 'شبرا الخيمة، القليوبية',
      'postalCode': '13766'
    },
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '+201500125133',
      'contactType': 'customer service',
      'availableLanguage': ['Arabic', 'English'],
      'areaServed': 'EG'
    },
    'sameAs': [
      'https://instagram.com/velixstore.eg',
      'https://facebook.com/velixstore.eg',
      'https://tiktok.com/@velixstore.eg',
      'https://wa.me/201500125133'
    ],
    'openingHours': ['Mo-Sa 10:00-22:00']
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(heroSchema) }}
      />
      
      <section className="min-h-screen flex items-center bg-linear-to-b from-white via-[#FCFCFC] to-[#F5F3F0] pt-24 md:pt-28 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Text Content - بالعامية المصرية */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-center md:text-right order-2 md:order-1"
            >
              {/* Badge ثقة */}
              <div className="inline-flex items-center gap-2 bg-rose-gold/10 rounded-full px-4 py-1.5 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-gold opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-gold"></span>
                </span>
                <span className="text-rose-gold text-xs font-bold tracking-wider">🇪🇬 ١٠٠٪ صناعة مصرية</span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-black mb-6 tracking-tighter leading-[1.1]">
                VELIX
              </h1>
              
              {/* خط فاصل نحاسي */}
              <div className="w-20 h-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full mx-auto md:mx-0 mb-6" />

              {/* التعريف المطول بالعامية */}
              <div className="space-y-4 mb-8">
                <p className="text-black/70 font-bold text-base md:text-lg leading-relaxed">
                  VELIX مش مجرد براند ملابس عادي. احنا جايين نغير الدنيا في مصر.
                </p>
                <p className="text-black/60 font-bold text-base md:text-lg leading-relaxed">
                  كل قطعة بنصنعها بنحط فيها روحنا، عشان لما تلبسها تحس إنك لابس حاجة مختلفة. 
                  خامات نضيفة، تفصيل محترم، وشكل يليق بيك.
                </p>
                <p className="text-black/60 font-bold text-base md:text-lg leading-relaxed">
                  واحنا عارفين إن الثقة بتتاخد مش بتتقال، علشان كدا وفرنالك:
                </p>
                <ul className="space-y-2 mr-4">
                  <li className="flex items-center gap-2 text-black/60 font-bold text-base">
                    <span className="text-rose-gold text-lg">✓</span>
                    دفع عند الاستلام - متدفعش غير لما تتأكد إن القطعة زي الفل
                  </li>
                  <li className="flex items-center gap-2 text-black/60 font-bold text-base">
                    <span className="text-rose-gold text-lg">✓</span>
                    استبدال مجاني خلال ١٤ يوم - لو مش عجبك، غيرها من غير وجع دماغ
                  </li>
                  <li className="flex items-center gap-2 text-black/60 font-bold text-base">
                    <span className="text-rose-gold text-lg">✓</span>
                    توصيل لجميع المحافظات - واحنا بنجيب الطلب لحد عندك
                  </li>
                </ul>
                <p className="text-rose-gold font-bold text-base md:text-lg leading-relaxed mt-4">
                  يلا بينا، جهز نفسك لجزء من التاريخ. أول براند مصري عالمي في الطريق!
                </p>
              </div>
              
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                <Link
                  href="/products"
                  className="group bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold px-8 py-4 rounded-full text-base md:text-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 inline-flex items-center justify-center gap-3 shadow-lg hover:shadow-rose-gold/30"
                  style={{ minWidth: "200px" }}
                >
                  <svg 
                    className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5l-7 7 7 7" />
                  </svg>
                  تسوق دلوقتي
                </Link>
                
                <Link
                  href="/about"
                  className="group bg-transparent border-2 border-rose-gold text-rose-gold font-bold px-8 py-4 rounded-full text-base md:text-lg hover:bg-rose-gold hover:text-white transition-all duration-300 inline-flex items-center justify-center gap-3"
                  style={{ minWidth: "200px" }}
                >
                  <svg 
                    className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  اعرف أكتر
                </Link>
              </div>
            </motion.div>

            {/* Images */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="order-1 md:order-2 space-y-3"
            >
              {/* Main Image */}
              <div className="relative h-75 md:h-112.5 rounded-2xl overflow-hidden shadow-xl group">
                <div className="absolute inset-0 rounded-2xl ring-1 ring-rose-gold/20 z-10 pointer-events-none" />
                <Image
                  src="/images/hero-model.png"
                  alt="VELIX موديل - تشكيلة 2026"
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                
                <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1.5 z-10">
                  <span className="text-rose-gold text-xs font-bold flex items-center gap-1">
                    <span>🚚</span> شحن مجاني لكل مصر
                  </span>
                </div>
              </div>
              
              {/* 3 Small Images */}
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                  {[
                    { src: "/images/hoodie-flat.png", alt: "VELIX هودي أوفر سايز - قطن نضيف", name: "هوديز", link: "/products?category=هوديز" },
                    { src: "/images/pants-flat.png", alt: "VELIX شروال رياضي - مريح وأنيق", name: "شروال", link: "/products?category=شروال" },
                    { src: "/images/tshirt-flat.png", alt: "VELIX تيشرت كلاسيك - قطن فاخر", name: "تيشرتات", link: "/products?category=تيشرتات" }
                  ].map((item, idx) => (
                  <Link 
                    key={idx}
                    href={item.link}
                    className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-rose-gold/20 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="absolute inset-0 rounded-xl ring-1 ring-rose-gold/10 group-hover:ring-2 group-hover:ring-rose-gold/50 transition-all z-10 pointer-events-none" />
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 768px) 33vw, 25vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white font-bold text-sm bg-black/60 px-3 py-1 rounded-full">
                        {item.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}