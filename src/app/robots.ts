// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/_next/',
        '/*?*', // أي رابط ب query parameters
        '/api/admin/*',
        '/api/orders/*',
        '/api/products/*/edit',
      ],
    },
    sitemap: 'https://velix-eg.store/sitemap.xml',
    host: 'https://velix-eg.store',
  };
}