import Link from 'next/link';
import Image from 'next/image';
import { SocialIcon } from 'react-social-icons';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          
          {/* Brand Column - Logo Left Aligned */}
          <div className="flex flex-col items-center md:items-start text-center md:text-right">
            <div className="relative w-16 h-16 md:w-20 md:h-20 mb-2">
              <Image
                src="/logo.png"
                alt="VELIX"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-gray-600 text-xs font-bold leading-relaxed max-w-xs space-y-1">
              براند ملابس مصري بيقدم ستايل عصري يناسب الشباب اللي بيحبوا يبانوا بشكل مختلف 👕🔥
              <br />
              بنركز على الجودة والتفاصيل علشان نطلعلك منتج يليق بيك في أي وقت وأي مكان 👌
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 pb-1 border-b-2 border-gray-300 inline-block">
              روابط سريعة
            </h4>
            <ul className="space-y-1.5 mt-2">
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

          {/* Policies */}
          <div>
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 pb-1 border-b-2 border-gray-300 inline-block">
              سياسات
            </h4>
            <ul className="space-y-1.5 mt-2">
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

          {/* Contact & Social */}
          <div>
            {/* Contact */}
            <div className="mb-4">
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 pb-1 border-b-2 border-gray-300 inline-block">
                تواصل معنا
              </h4>
              <ul className="space-y-1.5 mt-2">
                <li>
                  <a 
                    href="https://wa.me/201500125133" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-black hover:translate-x-1 transition-all duration-200 text-xs font-bold flex items-center gap-2 group"
                  >
                    <svg className="w-7 h-7 text-green-600 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.277-.582c.897.482 1.849.722 2.982.722h.001c3.18 0 5.767-2.587 5.768-5.766.001-3.18-2.585-5.766-5.765-5.766zM15.87 15.619c-.297.736-1.256 1.412-1.922 1.476-.513.05-1.117-.106-1.792-.333-1.147-.386-2.225-1.002-3.094-1.783-.857-.769-1.434-1.677-1.795-2.624-.345-.902-.378-1.667-.091-2.354.268-.644.881-1.135 1.565-1.258.259-.047.516-.03.757.018.248.05.492.166.707.344.219.181.422.424.576.724.08.156.135.333.168.52.021.115.02.236-.009.355-.028.118-.078.233-.138.344-.107.197-.329.523-.473.7-.132.164-.276.338-.381.488-.131.187-.021.387.044.484.255.376.649.77 1.097 1.057.386.249.876.425 1.266.505.214.044.382.006.505-.135.159-.181.329-.385.489-.597.131-.174.287-.221.489-.138.201.082.437.197.75.366.288.155.509.291.668.401.154.107.289.232.379.388.09.156.114.336.071.511-.085.345-.399.792-.664 1.059z"/>
                    </svg>
                    واتساب
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:info@velix.com" 
                    className="text-gray-700 hover:text-black hover:translate-x-1 transition-all duration-200 text-xs font-bold flex items-center gap-2 group"
                  >
                    <svg className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    البريد الإلكتروني
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 pb-1 border-b-2 border-gray-300 inline-block">
                صفحاتنا
              </h4>
              <div className="flex gap-2 mt-2">
                <SocialIcon 
                  url="https://instagram.com/velix" 
                  bgColor="transparent" 
                  fgColor="#9ca3af"
                  style={{ width: 28, height: 28 }}
                  target="_blank"
                  className="hover:scale-110 transition-transform duration-200"
                />
                <SocialIcon 
                  url="https://facebook.com/velix2026" 
                  bgColor="transparent" 
                  fgColor="#9ca3af"
                  style={{ width: 28, height: 28 }}
                  target="_blank"
                  className="hover:scale-110 transition-transform duration-200"
                />
                <SocialIcon 
                  url="https://tiktok.com/@velix" 
                  bgColor="transparent" 
                  fgColor="#9ca3af"
                  style={{ width: 28, height: 28 }}
                  target="_blank"
                  className="hover:scale-110 transition-transform duration-200"
                />
                <SocialIcon 
                  url="https://wa.me/201500125133" 
                  network="whatsapp"
                  bgColor="transparent" 
                  fgColor="#9ca3af"
                  style={{ width: 28, height: 28 }}
                  target="_blank"
                  className="hover:scale-110 transition-transform duration-200"
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