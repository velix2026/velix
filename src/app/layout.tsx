import type { Viewport } from "next";
import { Cairo } from 'next/font/google';
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToastProvider from "@/components/ToastProvider";

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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
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
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* PWA Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/android-chrome-192x192.png" />
        
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
        
        {/* Structured Data - JSON-LD (بيانات الموقع الأساسية) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ClothingStore",
              "name": "VELIX",
              "url": "https://velix-eg.store",
              "logo": "https://velix-eg.store/images/logo.png",
              "image": "https://velix-eg.store/images/og-image.jpg",
              "description": "براند ملابس مصري - جودة عالمية وتصميم عصري",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "EG",
                "addressRegion": "Cairo"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+201500125133",
                "contactType": "customer service",
                "availableLanguage": ["Arabic", "English"],
                "areaServed": "EG"
              },
              "sameAs": [
                "https://instagram.com/velix.2026",
                "https://facebook.com/velix2026",
                "https://tiktok.com/@velix2026",
                "https://wa.me/201500125133"
              ],
              "openingHours": "Mo-Sa 10:00-22:00",
              "paymentAccepted": "Cash on Delivery",
              "priceRange": "$$",
              "currenciesAccepted": "EGP",
              "deliveryLeadTime": {
                "@type": "QuantitativeValue",
                "value": "2-5",
                "unitCode": "DAY"
              }
            })
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen bg-white font-sans antialiased">
        <ToastProvider />
        <Header />
        <main className="grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}