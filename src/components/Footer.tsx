'use client'; // ✅ Add this at the top

import Link from 'next/link';
import Image from 'next/image';
import { SocialIcon } from 'react-social-icons';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Handle scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Structured Data for the Footer (this runs on client but it's fine)
  const footerSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'VELIX',
    url: 'https://velix-eg.store',
    logo: 'https://velix-eg.store/images/logo.png', // ✅ تم التحديث للمسار الصحيح
    sameAs: [
      'https://instagram.com/velix.2026',
      'https://facebook.com/velix2026',
      'https://tiktok.com/@velix2026',
      'https://whatsapp.com/channel/0029VbCamY1JUM2iILsajJ3t',
      'https://wa.me/201500125133'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+201500125133',
      contactType: 'customer service',
      availableLanguage: ['Arabic', 'English']
    }
  };

  return (
    <>
      {/* JSON-LD for Organization - This is safe in client component */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(footerSchema) }}
      />
      
      <footer 
        className="bg-white border-t border-black/10" // ✅ غيرت bg-linear-to-b من gray-50 لـ bg-white، وغيرت border-gray-200 لـ border-black/10
        itemScope 
        itemType="https://schema.org/WPFooter"
        role="contentinfo"
      >
        <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
            
            {/* Brand Column */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <Link href="/" className="block mb-3 group" aria-label="VELIX - الصفحة الرئيسية">
                <div className="relative w-20 h-20 md:w-24 md:h-24 transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src="/images/logo.png" // ✅ تم التحديث للمسار الصحيح
                    alt="VELIX - براند ملابس مصري عصري"
                    title="VELIX براند ملابس مصري"
                    fill
                    sizes="(max-width: 768px) 80px, 96px"
                    className="object-contain"
                    priority={false}
                    quality={75}
                  />
                </div>
              </Link>
              <p className="text-black/60 text-xs leading-relaxed max-w-xs font-medium"> {/* ✅ غيرت text-gray-700 لـ text-black/60 */}
                براند ملابس مصري بيقدم ستايل عصري يناسب الشباب اللي بيحبوا يبانوا بشكل مختلف 👕🔥
                <br className="hidden md:block" />
                بنركز على الجودة والتفاصيل علشان نطلعلك منتج يليق بيك في أي وقت وأي مكان 👌
              </p>
              {/* Trust Badge */}
              <div className="mt-3 flex gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] text-green-700 bg-green-50 px-2 py-1 rounded-full font-bold">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  دفع عند الاستلام
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-blue-700 bg-blue-50 px-2 py-1 rounded-full font-bold">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  توصيل سريع
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center md:text-right">
              <h4 className="text-sm font-black text-black uppercase tracking-wider mb-4 pb-2 border-b-2 border-black/20 inline-block"> {/* ✅ غيرت text-gray-800 لـ text-black، border-gray-200 لـ border-black/20 */}
                روابط سريعة
              </h4>
              <ul className="space-y-2 mt-2" aria-label="روابط سريعة">
                <li>
                  <Link 
                    href="/" 
                    className="text-black/60 hover:text-black hover:translate-x-1 transition-all duration-200 text-sm inline-flex items-center gap-1 group font-medium" // ✅ غيرت text-gray-600 لـ text-black/60
                  >
                    <span className="group-hover:translate-x-1 transition-transform">الرئيسية</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/products" 
                    className="text-black/60 hover:text-black hover:translate-x-1 transition-all duration-200 text-sm inline-flex items-center gap-1 group font-medium"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">المنتجات</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/about" 
                    className="text-black/60 hover:text-black hover:translate-x-1 transition-all duration-200 text-sm inline-flex items-center gap-1 group font-medium"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">عن البراند</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/contact" 
                    className="text-black/60 hover:text-black hover:translate-x-1 transition-all duration-200 text-sm inline-flex items-center gap-1 group font-medium"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">اتصل بنا</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Policies */}
            <div className="text-center md:text-right">
              <h4 className="text-sm font-black text-black uppercase tracking-wider mb-4 pb-2 border-b-2 border-black/20 inline-block"> {/* ✅ غيرت text-gray-800 لـ text-black، border-gray-200 لـ border-black/20 */}
                سياسات
              </h4>
              <ul className="space-y-2 mt-2" aria-label="سياسات الموقع">
                <li>
                  <Link 
                    href="/shipping" 
                    className="text-black/60 hover:text-black hover:translate-x-1 transition-all duration-200 text-sm inline-flex items-center gap-1 group font-medium"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">الشحن والتوصيل</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/returns" 
                    className="text-black/60 hover:text-black hover:translate-x-1 transition-all duration-200 text-sm inline-flex items-center gap-1 group font-medium"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">الاستبدال والاسترجاع</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/privacy" 
                    className="text-black/60 hover:text-black hover:translate-x-1 transition-all duration-200 text-sm inline-flex items-center gap-1 group font-medium"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">سياسة الخصوصية</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/terms" 
                    className="text-black/60 hover:text-black hover:translate-x-1 transition-all duration-200 text-sm inline-flex items-center gap-1 group font-medium"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">شروط الاستخدام</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact & Social */}
            <div className="text-center md:text-right">
              {/* Contact */}
              <div className="mb-6">
                <h4 className="text-sm font-black text-black uppercase tracking-wider mb-4 pb-2 border-b-2 border-black/20 inline-block"> {/* ✅ غيرت text-gray-800 لـ text-black، border-gray-200 لـ border-black/20 */}
                  تواصل معنا
                </h4>
                <ul className="space-y-2 mt-2" aria-label="طرق التواصل">
                  <li className="flex items-center justify-center md:justify-start gap-2">
                    <SocialIcon 
                      url="https://wa.me/201500125133" 
                      network="whatsapp"
                      bgColor="transparent" 
                      fgColor="#25D366"
                      style={{ width: 28, height: 28 }}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:scale-110 transition-transform duration-200"
                      aria-label="تواصل عبر واتساب"
                    />
                    <a 
                      href="https://wa.me/201500125133" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-black/60 hover:text-green-600 text-sm transition-colors font-medium"
                    >
                      واتساب
                    </a>
                  </li>
                  <li className="flex items-center justify-center md:justify-start gap-2">
                    <SocialIcon 
                      url="mailto:velix2026@gmail.com"
                      network="email"
                      bgColor="transparent" 
                      fgColor="#EA4335"
                      style={{ width: 28, height: 28 }}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:scale-110 transition-transform duration-200"
                      aria-label="البريد الإلكتروني"
                    />
                    <a 
                      href="mailto:velix2026@gmail.com"
                      className="text-black/60 hover:text-red-600 text-sm transition-colors font-medium"
                    >
                      البريد الإلكتروني
                    </a>
                  </li>
                </ul>
              </div>

              {/* Social Media */}
              <div>
                <h4 className="text-sm font-black text-black uppercase tracking-wider mb-4 pb-2 border-b-2 border-black/20 inline-block"> {/* ✅ غيرت text-gray-800 لـ text-black، border-gray-200 لـ border-black/20 */}
                  تابعنا
                </h4>
                <div className="flex gap-3 mt-2 justify-center md:justify-start" aria-label="صفحات التواصل الاجتماعي">
                  <SocialIcon 
                    url="https://instagram.com/velix.2026"
                    bgColor="transparent" 
                    fgColor="#E4405F"
                    style={{ width: 32, height: 32 }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform duration-200"
                    aria-label="Instagram"
                  />
                  <SocialIcon 
                    url="https://facebook.com/velix2026"
                    bgColor="transparent" 
                    fgColor="#1877F2"
                    style={{ width: 32, height: 32 }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform duration-200"
                    aria-label="Facebook"
                  />
                  <SocialIcon 
                    url="https://tiktok.com/@velix2026"
                    bgColor="transparent" 
                    fgColor="#EE1D52"
                    style={{ width: 32, height: 32 }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform duration-200"
                    aria-label="TikTok"
                  />
                  <SocialIcon 
                    url="https://whatsapp.com/channel/0029VbCamY1JUM2iILsajJ3t"
                    network="whatsapp"
                    bgColor="transparent" 
                    fgColor="#25D366"
                    style={{ width: 32, height: 32 }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform duration-200"
                    aria-label="قناة واتساب"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Copyright with Back to Top */}
          <div className="border-t border-black/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-3"> {/* ✅ غيرت border-gray-200 لـ border-black/10 */}
            <p className="text-black/40 text-xs font-medium"> {/* ✅ غيرت text-gray-400 لـ text-black/40 */}
              © {currentYear} VELIX. جميع الحقوق محفوظة
            </p>
            <p className="text-black/40 text-xs font-medium"> {/* ✅ غيرت text-gray-400 لـ text-black/40 */}
              براند ملابس مصري - جودة عالية وتصميم عصري
            </p>
            <button
              onClick={scrollToTop}
              className="text-black/40 hover:text-black text-xs flex items-center gap-1 transition-colors font-medium"
              aria-label="العودة للأعلى"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              العودة للأعلى
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}