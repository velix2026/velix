import type { Viewport } from "next";
import { Cairo } from 'next/font/google';
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToastProvider from "@/components/ToastProvider";
import SplashScreen from "@/components/SplashScreen";
import Breadcrumbs from "@/components/Breadcrumbs";

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

export const metadata = {
  metadataBase: new URL('https://velix-eg.store'),
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
        
        {/* Google Merchant Feed */}
        <link rel="alternate" type="application/rss+xml" title="VELIX Products Feed" href="https://velix-eg.store/api/products/feed" />
        
        {/* Preload Cairo Font */}
        <link rel="preload" href="/_next/static/media/cairo-font.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://wa.me" />
        <link rel="dns-prefetch" href="https://instagram.com" />
        <link rel="dns-prefetch" href="https://facebook.com" />
        <link rel="dns-prefetch" href="https://tiktok.com" />

        {/* Social Meta Tags — سجل في Facebook Developers عشان تاخد App ID */}
        <meta property="fb:app_id" content="" />
        <meta name="twitter:site" content="@velixstore" />
        <meta name="twitter:creator" content="@velixstore" />

        {/* ChatGPT Search Verification */}
        <meta name="openai-domain-verification" content="dv-2PmqVRRiAdC0ozu60zptZrJ6" />
        <meta name="msvalidate.01" content="" />
        <meta name="google-site-verification" content="" />

        {/* ✅ Schema 1: Website - عشان جوجل تعرف اسم الموقع */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "VELIX",
              "url": "https://velix-eg.store",
              "alternateName": "VELIX Store",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://velix-eg.store/products?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />

        {/* ✅ Schema 2: Organization - تأكيد إضافي لجوجل */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "VELIX",
              "url": "https://velix-eg.store",
              "logo": "https://velix-eg.store/images/logo.png",
              "sameAs": [
                "https://instagram.com/velixstore.eg",
                "https://facebook.com/velixstore.eg",
                "https://tiktok.com/@velixstore.eg",
                "https://wa.me/201500125133"
              ]
            })
          }}
        />

        {/* ✅ Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-SJWDM5GQ6B"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-SJWDM5GQ6B');
            `,
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen bg-white font-sans antialiased">
        <SplashScreen />
        <ToastProvider />
        <Header />
        <Breadcrumbs />
        <main className="grow">
          {children}
        </main>
        <Footer />
        
        {/* Google Customer Reviews Badge */}
        <Script
          id="google-customer-reviews"
          strategy="afterInteractive"
          src="https://apis.google.com/js/platform.js?onload=renderBadge"
          async
          defer
        />
        <Script
          id="google-customer-reviews-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.renderBadge = function() {
                var ratingBadgeContainer = document.createElement("div");
                document.body.appendChild(ratingBadgeContainer);
                window.gapi.load('ratingbadge', function() {
                  window.gapi.ratingbadge.render(ratingBadgeContainer, {"merchant_id": 5810030916});
                });
              }
            `,
          }}
        />
        
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