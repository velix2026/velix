'use client';

import { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface Feature {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    id: 1,
    icon: (
      <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3" />
      </svg>
    ),
    title: 'جودة في التفاصيل',
    description: 'كل قطعة بتتصنع بدقة عالية، وبنختار أفضل الخامات عشان تدوم معاك لأطول فترة.'
  },
  {
    id: 2,
    icon: (
      <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'صناعة مصرية',
    description: 'براند مصري ١٠٠٪ وفتخر بجذوره، وبنشجع الصناعة المحلية بجد.'
  },
  {
    id: 3,
    icon: (
      <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'دفع عند الاستلام',
    description: 'اطلب دلوقتي واستلم منتجك وادفع بعد ما تتأكد إنه زي الفل.'
  },
  {
    id: 4,
    icon: (
      <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: 'دعم فوري',
    description: 'فريقنا موجود على واتساب عشان يرد عليك في أي وقت، وخلاص.'
  }
];

export default function BrandFeatures() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(featuresSchema) }}
      />
      
      {/* 🎯 تدرج من فوق لتحت - عكس الهيرو */}
      <section className="bg-linear-to-t from-white via-[#FCFCFC] to-[#F5F3F0] py-20 md:py-28 border-t border-rose-gold/10">
        <div className="container mx-auto px-4">
          
          {/* Header - بالعامية */}
          <motion.div 
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="text-xs text-rose-gold tracking-[0.2em] uppercase font-bold mb-3 block">
              إيه اللي مميزنا؟
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-black">
              ثق في جودة شغلك
            </h2>
            {/* خط فاصل نحاسي */}
            <div className="w-20 h-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full mx-auto mt-4 mb-6" />
            <p className="text-black/60 font-bold text-base max-w-2xl mx-auto">
              احنا بنحط الجودة والتفاصيل في الأولوية عشان نقدملك تجربة تسوق تختلف
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-center">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                {/* Icon Container */}
                <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 flex items-center justify-center bg-white rounded-xl md:rounded-2xl group-hover:bg-rose-gold/5 transition-all duration-300 shadow-sm group-hover:shadow-md border border-rose-gold/10 group-hover:border-rose-gold/30">
                  <span 
                    className="text-rose-gold group-hover:text-copper transition-colors duration-300"
                    role="img"
                  >
                    {feature.icon}
                  </span>
                </div>
                
                {/* Title */}
                <h3 className="text-base md:text-xl font-bold text-black mb-2 group-hover:text-rose-gold transition-colors duration-300">
                  {feature.title}
                </h3>
                
                {/* Description - بالعامية */}
                <p className="text-black/60 font-bold text-xs md:text-sm leading-relaxed max-w-xs mx-auto">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}