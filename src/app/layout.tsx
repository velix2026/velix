import type { Metadata, Viewport } from "next";
import { Cairo } from 'next/font/google';
import Script from "next/script";
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

export const metadata: Metadata = {
  metadataBase: new URL('https://velix-eg.store'),
  title: {
    default: "VELIX | براند ملابس مصري - جودة عالمية وتصميم عصري",
    template: "%s | VELIX",
  },
  description: "VELIX أول براند ملابس مصري يقدم لك جودة عالمية بسعر مناسب. تشكيلة رائعة من التيشرتات والهوديز والشروال. دفع عند الاستلام وتوصيل لجميع محافظات مصر.",
  openGraph: {
    title: "VELIX | براند ملابس مصري",
    description: "اكتشف أحدث تشكيلة من VELIX. جودة عالمية، تصميم عصري، ودفع عند الاستلام.",
    url: "https://velix-eg.store",
    siteName: "VELIX",
    locale: "ar_EG",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VELIX - براند ملابس مصري",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VELIX | براند ملابس مصري",
    description: "اكتشف أحدث تشكيلة من VELIX. جودة عالمية، تصميم عصري، ودفع عند الاستلام.",
    images: ["/images/og-image.jpg"],
  },
  manifest: "/manifest.json",
};

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
    <html lang="ar" dir="rtl" className={cairo.variable} data-scroll-behavior="smooth">
      <head>
        {/* Favicon and Icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" data-main="true" />
        
        {/* PWA Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/android-chrome-192x192.png" />
        
        {/* Viewport مع دعم الزوم */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        
        {/* تحسين الأداء */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        
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
        
        {/* Structured Data - JSON-LD */}
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
              "telephone": "+201500125133",
              "priceRange": "$$",
              "paymentAccepted": "Cash on Delivery",
              "currenciesAccepted": "EGP",
              "areaServed": "EG",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "EG",
                "addressRegion": "Qalyubia",
                "addressLocality": "Shubra El-Kheima",
                "streetAddress": "شبرا الخيمة، القليوبية",
                "postalCode": "13766"
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
              "openingHours": ["Mo-Sa 10:00-22:00"],
              "deliveryLeadTime": {
                "@type": "QuantitativeValue",
                "value": "5",
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
        
        {/* ✅ تسجيل Service Worker باستخدام Script component */}
        <Script
          id="service-worker"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('SW registered for main site'))
                    .catch(err => console.log('SW error:', err));
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}