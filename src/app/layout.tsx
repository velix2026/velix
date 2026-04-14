import type { Viewport } from "next";
import { Cairo } from 'next/font/google';
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToastProvider from "@/components/ToastProvider";
import SplashScreen from "@/components/SplashScreen";

const cairo = Cairo({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-cairo',
  weight: ['400', '500', '600', '700', '800'],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#B76E79",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <head>
        {/* Favicon and Icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" data-main="true" />
        
        {/* PWA Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#B76E79" />
        <meta name="msapplication-TileColor" content="#B76E79" />
        <meta name="msapplication-TileImage" content="/android-chrome-192x192.png" />
        
        {/* Viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Sitemap */}
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://wa.me" />
        <link rel="dns-prefetch" href="https://instagram.com" />
        <link rel="dns-prefetch" href="https://facebook.com" />
        <link rel="dns-prefetch" href="https://tiktok.com" />
      </head>
      <body className="flex flex-col min-h-screen bg-white font-sans antialiased">
        <SplashScreen />
        <ToastProvider />
        <Header />
        <main className="grow">
          {children}
        </main>
        <Footer />
        
        <Script
          id="service-worker"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('✅ SW registered for VELIX'))
                    .catch(err => console.log('❌ SW error:', err));
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}