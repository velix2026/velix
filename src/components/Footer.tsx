import Link from 'next/link';
import Image from 'next/image';
import { SocialIcon } from 'react-social-icons';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200" itemScope itemType="https://schema.org/WPFooter">
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          
          {/* Brand Column - Center on mobile, Right on desktop */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="relative w-16 h-16 md:w-20 md:h-20 mb-2">
              <Image
                src="/logo.png"
                alt="VELIX - براند ملابس مصري"
                title="VELIX براند ملابس مصري"
                fill
                sizes="(max-width: 768px) 64px, 80px"
                className="object-contain"
              />
            </div>
            <p className="text-gray-600 text-xs font-bold leading-relaxed max-w-xs text-center md:text-right">
              براند ملابس مصري بيقدم ستايل عصري يناسب الشباب اللي بيحبوا يبانوا بشكل مختلف 👕🔥
              <br />
              بنركز على الجودة والتفاصيل علشان نطلعلك منتج يليق بيك في أي وقت وأي مكان 👌
            </p>
          </div>

          {/* Quick Links - Center on mobile, Right on desktop */}
          <div className="text-center md:text-right">
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 pb-1 border-b-2 border-gray-300 inline-block">
              روابط سريعة
            </h4>
            <ul className="space-y-1.5 mt-2" aria-label="روابط سريعة">
              <li>
                <Link href="/" className="text-gray-700 hover:text-black hover:translate-x-1 transition-all duration-200 text-xs font-bold inline-block">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-700 hover:text-black hover:translate-x-1 transition-all duration-200 text-xs font-bold inline-block">
                  المنتجات
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-700 hover:text-black hover:translate-x-1 transition-all duration-200 text-xs font-bold inline-block">
                  عن البراند
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies - Center on mobile, Right on desktop */}
          <div className="text-center md:text-right">
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 pb-1 border-b-2 border-gray-300 inline-block">
              سياسات
            </h4>
            <ul className="space-y-1.5 mt-2" aria-label="سياسات الموقع">
              <li>
                <Link href="/shipping" className="text-gray-700 hover:text-black hover:translate-x-1 transition-all duration-200 text-xs font-bold inline-block">
                  الشحن والتوصيل
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-700 hover:text-black hover:translate-x-1 transition-all duration-200 text-xs font-bold inline-block">
                  الاستبدال والاسترجاع
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-700 hover:text-black hover:translate-x-1 transition-all duration-200 text-xs font-bold inline-block">
                  سياسة الخصوصية
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social - Center on mobile, Right on desktop */}
          <div className="text-center md:text-right">
            {/* Contact */}
            <div className="mb-4">
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 pb-1 border-b-2 border-gray-300 inline-block">
                تواصل معنا
              </h4>
              <ul className="space-y-1.5 mt-2" aria-label="طرق التواصل">
                <li className="flex items-center justify-center md:justify-start gap-2">
                  <SocialIcon 
                    url="https://wa.me/201500125133" 
                    network="whatsapp"
                    bgColor="transparent" 
                    fgColor="#25D366"
                    style={{ width: 28, height: 28 }}
                    target="_blank"
                    className="hover:scale-110 transition-transform duration-200"
                  />
                  <span className="text-gray-700 text-xs font-bold">واتساب</span>
                </li>
                <li className="flex items-center justify-center md:justify-start gap-2">
                  <SocialIcon 
                    url="mailto:velix2026@gmail.com"
                    network="email"
                    bgColor="transparent" 
                    fgColor="#1877F2"
                    style={{ width: 28, height: 28 }}
                    target="_blank"
                    className="hover:scale-110 transition-transform duration-200"
                  />
                  <span className="text-gray-700 text-xs font-bold">البريد الإلكتروني</span>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 pb-1 border-b-2 border-gray-300 inline-block">
                صفحاتنا
              </h4>
              <div className="flex gap-2 mt-2 justify-center md:justify-start" aria-label="صفحات التواصل الاجتماعي">
                <SocialIcon 
                  url="https://instagram.com/velix.2026"
                  bgColor="transparent" 
                  fgColor="#E4405F"
                  style={{ width: 28, height: 28 }}
                  target="_blank"
                  className="hover:scale-110 transition-transform duration-200"
                  aria-label="Instagram"
                />
                <SocialIcon 
                  url="https://www.facebook.com/velix2026"
                  bgColor="transparent" 
                  fgColor="#1877F2"
                  style={{ width: 28, height: 28 }}
                  target="_blank"
                  className="hover:scale-110 transition-transform duration-200"
                  aria-label="Facebook"
                />
                <SocialIcon 
                  url="https://tiktok.com/@velix2026"
                  bgColor="transparent" 
                  fgColor="#EE1D52"
                  style={{ width: 28, height: 28 }}
                  target="_blank"
                  className="hover:scale-110 transition-transform duration-200"
                  aria-label="TikTok"
                />
                <SocialIcon 
                  url="https://whatsapp.com/channel/0029VbCamY1JUM2iILsajJ3t"
                  network="whatsapp"
                  bgColor="transparent" 
                  fgColor="#25D366"
                  style={{ width: 28, height: 28 }}
                  target="_blank"
                  className="hover:scale-110 transition-transform duration-200"
                  aria-label="قناة واتساب"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-6 pt-4 text-center">
          <p className="text-gray-400 text-[11px] font-bold">
            © {currentYear} VELIX. جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
}