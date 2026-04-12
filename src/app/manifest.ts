// app/manifest.ts
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'VELIX - براند ملابس مصري',
    short_name: 'VELIX',
    description: 'براند ملابس مصري - جودة عالية وتصميم عصري. دفع عند الاستلام وتوصيل لجميع محافظات مصر.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable', // ✅ غيرنا من 'any maskable' لـ 'maskable'
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable', // ✅ غيرنا من 'any maskable' لـ 'maskable'
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        // ✅ شيلنا purpose خالص (مش محتاجها للأيقونات العادية)
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
    lang: 'ar',
    dir: 'rtl',
    orientation: 'portrait',
    categories: ['shopping', 'fashion', 'clothing'],
  };
}