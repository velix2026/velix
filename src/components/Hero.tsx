// components/Hero.tsx
'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Hero Schema for SEO
  const heroSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'VELIX',
    'description': 'براند ملابس مصري بيقدم ستايل عصري للشباب. جودة عالية وتفاصيل مميزة مع دفع عند الاستلام.',
    'url': 'https://velixstore.vercel.app',
    'logo': 'https://velixstore.vercel.app/logo.png',
    'image': 'https://velixstore.vercel.app/images/hero-model.png',
    'address': {
      '@type': 'PostalAddress',
      'addressCountry': 'EG'
    }
  };

  return (
    <>
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(heroSchema) }}
      />
      
      <section className="min-h-screen flex items-center bg-white pt-24 md:pt-28 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Text Content - Centered Vertically */}
            <div className={`text-center md:text-right order-2 md:order-1 transition-all duration-700 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-6 tracking-tighter leading-[1.1]">
                VELIX
              </h1>
              <p className="text-gray-500 font-bold text-base md:text-lg mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
                براند ملابس مصري بيقدم ستايل عصري يناسب الشباب اللي بيحبوا يبانوا بشكل مختلف.
                <br />
                جودة في كل تفصيلة، ودفع عند الاستلام.
              </p>
              <div className="flex justify-center md:justify-start">
                <Link
                  href="/products"
                  className="group bg-linear-to-r from-gray-800 via-gray-700 to-gray-900 text-white font-bold px-8 py-4 rounded-full text-base md:text-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 inline-flex items-center justify-center gap-3 w-full md:w-auto shadow-md hover:shadow-lg"
                  style={{ minWidth: "220px" }}
                >
                  <svg 
                    className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5l-7 7 7 7" />
                  </svg>
                  تسوق الآن
                </Link>
              </div>
            </div>

            {/* Image Layout: Large Model Image + 3 Small Images Below */}
            <div className={`order-1 md:order-2 space-y-3 transition-all duration-700 delay-200 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
              {/* Large Model Image */}
              <div className="relative h-75 md:h-112.5 rounded-2xl overflow-hidden shadow-xl group">
                <Image
                  src="/images/hero-model.png"
                  alt="VELIX موديل - مجموعة الربيع 2026 - ملابس رجالي مصرية"
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Overlay gradient for better text readability */}
                <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              </div>
              
              {/* 3 Small Images Grid */}
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                <div className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
                  <Image
                    src="/images/hoodie-flat.png"
                    alt="VELIX هودي أوفر سايز - قطن مصري - مقاسات متعددة"
                    fill
                    sizes="(max-width: 768px) 33vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
                  <Image
                    src="/images/pants-flat.png"
                    alt="VELIX شروال رياضي - تصميم عصري - جودة عالية"
                    fill
                    sizes="(max-width: 768px) 33vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
                  <Image
                    src="/images/tshirt-flat.png"
                    alt="VELIX تيشرت كلاسيك - قطن فاخر - ستايل يومي"
                    fill
                    sizes="(max-width: 768px) 33vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}