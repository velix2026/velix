// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/*?*',
          '/api/admin/*',
          '/api/orders/*',
          '/api/products/*/edit',
        ],
      },
      // ✅ قاعدة خاصة بـ Googlebot (تسمح بالملفات الضرورية)
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/*?*',
        ],
      },
      // ✅ قاعدة خاصة بـ Googlebot-Image (تسمح بالصور)
      {
        userAgent: 'Googlebot-Image',
        allow: '/images/',
        disallow: '/',
      },
      // ✅ قاعدة خاصة بـ Bing (مع crawl-delay المدعوم)
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
        ],
        crawlDelay: 1,  // ✅ بينج و Yahoo بيدعموا ده
      },
      // ✅ قاعدة لروبوتات الذكاء الاصطناعي (اختياري)
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'Google-Extended',
        disallow: '/',
      },
    ],
    sitemap: [
      'https://velix-eg.store/sitemap.xml',
      // 'https://velix-eg.store/sitemap-blog.xml',  // لو عندك Sitemap تاني
    ],
  };
}