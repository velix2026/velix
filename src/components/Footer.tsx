'use client';

import Link from 'next/link';
import Image from 'next/image';
import { SocialIcon } from 'react-social-icons';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerSchema = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    'name': 'VELIX',
    'url': 'https://velix-eg.store',
    'logo': 'https://velix-eg.store/images/logo.png',
    'image': 'https://velix-eg.store/images/og-image.png',
    'description': 'براند ملابس مصري بيقدم ستايل عصري للشباب. جودة عالية وتفاصيل مميزة مع دفع عند الاستلام.',
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
      'https://whatsapp.com/channel/0029VbCamY1JUM2iILsajJ3t',
      'https://wa.me/201500125133'
    ],
    'openingHours': ['Mo-Sa 10:00-22:00']
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(footerSchema) }}
      />
      
      <footer 
        className="bg-linear-to-t from-white via-[#FCFCFC] to-[#F5F3F0] border-t border-rose-gold/20"
        itemScope 
        itemType="https://schema.org/WPFooter"
        role="contentinfo"
      >
        <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
            
            {/* Brand Column */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <Link href="/" className="block mb-3 group">
                <div className="relative w-20 h-20 md:w-24 md:h-24 transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src="/images/logo.png"
                    alt="VELIX - براند ملابس مصري"
                    title="VELIX"
                    fill
                    sizes="(max-width: 768px) 80px, 96px"
                    className="object-contain"
                    priority={false}
                    quality={75}
                  />
                </div>
              </Link>
              <p className="text-black/60 text-xs leading-relaxed max-w-xs font-medium">
                براند ملابس مصري بيقدم ستايل عصري يناسب الشباب اللي بيحبوا يبانوا بشكل مختلف 👕🔥
                <br className="hidden md:block" />
                بنركز على الجودة والتفاصيل عشان نطلعلك منتج يليق بيك في أي وقت 👌
              </p>
              
              {/* Trust Badges */}
              <div className="mt-3 flex gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] text-rose-gold bg-rose-gold/10 px-2 py-1 rounded-full font-bold">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  دفع عند الاستلام
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-rose-gold bg-rose-gold/10 px-2 py-1 rounded-full font-bold">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  توصيل سريع
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center md:text-right">
              <h4 className="text-sm font-black text-black uppercase tracking-wider mb-4 pb-2 border-b-2 border-rose-gold/30 inline-block">
                روابط سريعة
              </h4>
              <ul className="space-y-2 mt-2">
                <li>
                  <Link 
                    href="/" 
                    className="text-black/60 hover:text-rose-gold hover:translate-x-1 transition-all duration-200 text-sm inline-flex items-center gap-1 group font-medium"
                  >
                    الرئيسية
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/products" 
                    className="text-black/60 hover:text-rose-gold hover:translate-x-1 transition-all duration-200 text-sm inline-flex items-center gap-1 group font-medium"
                  >
                    المنتجات
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/blog" 
                    className="text-black/60 hover:text-rose-gold hover:translate-x-1 transition-all duration-200 text-sm inline-flex items-center gap-1 group font-medium"
                  >
                    المدونة
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/faq" 
                    className="text-black/60 hover:text-rose-gold hover:translate-x-1 transition-all duration-200 text-sm inline-flex items-center gap-1 group font-medium"
                  >
                    الأسئلة الشائعة
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/about" 
                    className="text-black/60 hover:text-rose-gold hover:translate-x-1 transition-all duration-200 text-sm inline-flex items-center gap-1 group font-medium"
                  >
                    عن البراند
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/contact" 
                    className="text-black/60 hover:text-rose-gold hover:translate-x-1 transition-all duration-200 text-sm inline-flex items-center gap-1 group font-medium"
                  >
                    اتصل بنا
                  </Link>
                </li>
              </ul>
            </div>

            {/* Policies */}
            <div className="text-center md:text-right">
              <h4 className="text-sm font-black text-black uppercase tracking-wider mb-4 pb-2 border-b-2 border-rose-gold/30 inline-block">
                سياسات
              </h4>
              <ul className="space-y-2 mt-2">
                <li>
                  <Link 
                    href="/shipping" 
                    className="text-black/60 hover:text-rose-gold hover:translate-x-1 transition-all duration-200 text-sm inline-flex items-center gap-1 group font-medium"
                  >
                    الشحن والتوصيل
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/returns" 
                    className="text-black/60 hover:text-rose-gold hover:translate-x-1 transition-all duration-200 text-sm inline-flex items-center gap-1 group font-medium"
                  >
                    الاستبدال والاسترجاع
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/privacy" 
                    className="text-black/60 hover:text-rose-gold hover:translate-x-1 transition-all duration-200 text-sm inline-flex items-center gap-1 group font-medium"
                  >
                    سياسة الخصوصية
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/terms" 
                    className="text-black/60 hover:text-rose-gold hover:translate-x-1 transition-all duration-200 text-sm inline-flex items-center gap-1 group font-medium"
                  >
                    شروط الاستخدام
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact & Social */}
            <div className="text-center md:text-right">
              {/* Contact */}
              <div className="mb-6">
                <h4 className="text-sm font-black text-black uppercase tracking-wider mb-4 pb-2 border-b-2 border-rose-gold/30 inline-block">
                  تواصل معانا
                </h4>
                <ul className="space-y-2 mt-2">
                  <li className="flex items-center justify-center md:justify-start gap-2">
                    <SocialIcon 
                      url="https://wa.me/201500125133" 
                      network="whatsapp"
                      bgColor="transparent" 
                      fgColor="#B76E79"
                      style={{ width: 28, height: 28 }}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:scale-110 transition-transform duration-200"
                    />
                    <a 
                      href="https://wa.me/201500125133" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-black/60 hover:text-rose-gold text-sm transition-colors font-medium"
                    >
                      واتساب
                    </a>
                  </li>
                  <li className="flex items-center justify-center md:justify-start gap-2">
                    <SocialIcon 
                      url="mailto:velixstore.eg@gmail.com"
                      network="email"
                      bgColor="transparent" 
                      fgColor="#B76E79"
                      style={{ width: 28, height: 28 }}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:scale-110 transition-transform duration-200"
                    />
                    <a 
                      href="mailto:velixstore.eg@gmail.com"
                      className="text-black/60 hover:text-rose-gold text-sm transition-colors font-medium"
                    >
                      البريد الإلكتروني
                    </a>
                  </li>
                </ul>
              </div>

              {/* Social Media */}
              <div>
                <h4 className="text-sm font-black text-black uppercase tracking-wider mb-4 pb-2 border-b-2 border-rose-gold/30 inline-block">
                  تابعنا
                </h4>
                <div className="flex gap-3 mt-2 justify-center md:justify-start">
                  <SocialIcon 
                    url="https://instagram.com/velixstore.eg"
                    bgColor="transparent" 
                    fgColor="#B76E79"
                    style={{ width: 32, height: 32 }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform duration-200"
                  />
                  <SocialIcon 
                    url="https://facebook.com/velixstore.eg"
                    bgColor="transparent" 
                    fgColor="#B76E79"
                    style={{ width: 32, height: 32 }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform duration-200"
                  />
                  <SocialIcon 
                    url="https://tiktok.com/@velixstore.eg"
                    bgColor="transparent" 
                    fgColor="#B76E79"
                    style={{ width: 32, height: 32 }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform duration-200"
                  />
                  <SocialIcon 
                    url="https://whatsapp.com/channel/0029VbCamY1JUM2iILsajJ3t"
                    network="whatsapp"
                    bgColor="transparent" 
                    fgColor="#B76E79"
                    style={{ width: 32, height: 32 }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform duration-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-rose-gold/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-black/40 text-xs font-medium">
              © {currentYear} VELIX. All Rights Reserved.
            </p>
            <p className="text-black/40 text-xs font-medium">
              Egyptian Clothing Brand - Luxury You Deserve
            </p>
            <button
              onClick={scrollToTop}
              className="text-black/40 hover:text-rose-gold text-xs flex items-center gap-1 transition-colors font-medium"
              aria-label="العودة للأعلى"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              Back to Top
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}