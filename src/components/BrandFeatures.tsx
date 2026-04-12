'use client';

import { useState, useEffect } from 'react';

interface Feature {
  id: number;
  icon: string;
  title: string;
  description: string;
  ariaLabel: string;
}

const features: Feature[] = [
  {
    id: 1,
    icon: '👕',
    title: 'جودة في التفاصيل',
    description: 'كل قطعة بتصنع بدقة عالية، ونختار أفضل الخامات عشان تدوم معاك لأطول فترة.',
    ariaLabel: 'جودة في التفاصيل - خامات عالية الجودة'
  },
  {
    id: 2,
    icon: '🇪🇬',
    title: 'صناعة مصرية',
    description: 'براند مصري 100% بيفتخر بجذوره، ويدعم الصناعة المحلية بكل فخر.',
    ariaLabel: 'صناعة مصرية - دعم المنتج المحلي'
  },
  {
    id: 3,
    icon: '📦',
    title: 'دفع عند الاستلام',
    description: 'اطلب دلوقتي واستلم منتجك وادفع بعد ما تتأكد من جودة المنتج.',
    ariaLabel: 'دفع عند الاستلام - ادفع بعد الاستلام'
  },
  {
    id: 4,
    icon: '💬',
    title: 'دعم فوري',
    description: 'فريقنا متاح للرد على استفساراتك عبر واتساب، لضمان تجربة شراء سلسة.',
    ariaLabel: 'دعم فوري - تواصل معنا عبر واتساب'
  }
];

export default function BrandFeatures() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // ✅ Schema for SEO - محدث بالألوان السوداء
  const featuresSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': 'لماذا تختار VELIX',
    'description': 'مميزات براند VELIX - جودة وتفاصيل وصناعة مصرية',
    'itemListElement': features.map((feature, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': feature.title,
      'description': feature.description
    }))
  };

  return (
    <>
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(featuresSchema) }}
      />
      
      <section className="bg-white py-20 md:py-28 border-t border-black/10">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className={`text-center mb-12 md:mb-16 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <span className="text-xs text-black/40 tracking-[0.2em] uppercase font-bold mb-3 block">
              لماذا تختار VELIX
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-black">
              جودة تستحق الثقة
            </h2>
            <div className="w-16 h-0.5 bg-black/20 mx-auto mt-4 mb-6"></div>
            <p className="text-black/60 font-bold text-base max-w-2xl mx-auto">
              نضع الجودة والتفاصيل في مقدمة أولوياتنا لنقدم لك تجربة استثنائية
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-center">
            {features.map((feature, index) => (
              <div 
                key={feature.id}
                className={`group transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Icon Container */}
                <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 flex items-center justify-center bg-black/5 rounded-xl md:rounded-2xl group-hover:bg-black/10 transition-all duration-300 shadow-sm group-hover:shadow-md">
                  <span 
                    className="text-3xl md:text-4xl group-hover:scale-110 transition-transform duration-300"
                    aria-label={feature.ariaLabel}
                    role="img"
                  >
                    {feature.icon}
                  </span>
                </div>
                
                {/* Title */}
                <h3 className="text-base md:text-xl font-bold text-black mb-2">
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="text-black/60 font-bold text-xs md:text-sm leading-relaxed max-w-xs mx-auto">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}