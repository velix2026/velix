// app/admin/layout.tsx
import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import '../globals.css';
import AdminPWAProvider from '@/components/AdminPWAProvider';

const cairo = Cairo({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-cairo',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'VELIX Admin - لوحة التحكم',
  description: 'إدارة منتجات وطلبات متجر VELIX',
  robots: 'noindex, nofollow',
  manifest: '/admin-manifest.json',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="VELIX Admin" />
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/admin-manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('SW registered'))
                    .catch(err => console.log('SW error:', err));
                });
              }
            `,
          }}
        />
      </head>
      <body className="bg-black font-sans antialiased">
        <AdminPWAProvider>
          {children}
        </AdminPWAProvider>
      </body>
    </html>
  );
}