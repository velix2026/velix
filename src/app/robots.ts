// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',                    // الصفحة الرئيسية
          '/products',            // صفحة المنتجات
          '/products/*',          // كل صفحة منتج على حدة
          '/blog',                // صفحة المدونة الرئيسية
          '/blog/*',              // كل مقالة على حدة
          '/faq',                 // الأسئلة الشائعة
          '/contact',             // اتصل بنا
          '/about',               // عن البراند
          '/shipping',            // الشحن
          '/returns',             // الاستبدال والاسترجاع
          '/privacy',             // سياسة الخصوصية
          '/terms',               // شروط الاستخدام
          '/images/',             // الصور عشان تظهر في بحث الصور
        ],
        disallow: [
          '/api/',                // API مش مهم لجوجل
          '/admin/',              // لوحة التحكم (أمان)
          '/_next/',              // ملفات Next.js الداخلية
          '/*?*',                 // أي رابط فيه علامة استفهام
          '/api/admin/*',
          '/api/orders/*',
          '/api/products/*/edit',
        ],
      },
      // ✅ قاعدة خاصة بـ Googlebot (تزحف أهم الصفحات)
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/products',
          '/products/*',
          '/blog',
          '/blog/*',
          '/faq',
          '/contact',
          '/about',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/*?*',
        ],
      },
      // ✅ قاعدة خاصة بـ Googlebot-Image (تسمح بالصور عشان تظهر في بحث الصور)
      {
        userAgent: 'Googlebot-Image',
        allow: '/images/',
        disallow: '/',
      },
      // ✅ قاعدة خاصة بـ Bing
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/products',
          '/products/*',
          '/blog',
          '/blog/*',
          '/faq',
        ],
        disallow: [
          '/api/',
          '/admin/',
        ],
        crawlDelay: 0.5,
      },
      // ✅ روبوتات الذكاء الاصطناعي (تسمح لهم عشان تظهر في ChatGPT و Gemini)
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
    ],
    sitemap: [
      'https://velix-eg.store/sitemap.xml',
    ],
  };
}