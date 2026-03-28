// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Cairo } from 'next/font/google';
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToastProvider from "@/components/ToastProvider";

// تحسين الخط للعربية - load faster مع performance
const cairo = Cairo({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-cairo',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://velixstore.vercel.app"),
  title: {
    default: "VELIX | براند ملابس مصري - ستايل عصري وجودة في التفاصيل",
    template: "%s | VELIX",
  },
  description: "VELIX براند ملابس مصري بيقدم ستايل عصري للشباب. جودة عالية، تفاصيل مميزة، ودفع عند الاستلام.",
  keywords: [
    "ملابس رجالي مصر",
    "براند ملابس مصري",
    "تيشرتات رجالي",
    "هوديز مصر",
    "VELIX",
    "ستريت وير مصر",
    "جودة عالية ملابس",
    "دفع عند الاستلام",
    "ماركة ملابس مصرية",
    "أزياء مصرية",
    "تصميم عصري",
  ],
  authors: [{ name: "VELIX", url: "https://velixstore.vercel.app" }],
  creator: "VELIX",
  publisher: "VELIX",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "VELIX | براند ملابس مصري",
    description: "ستايل عصري وجودة في التفاصيل. اطلب دلوقتي بالدفع عند الاستلام.",
    url: "https://velixstore.vercel.app",
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
    description: "ستايل عصري وجودة في التفاصيل. اطلب دلوقتي بالدفع عند الاستلام.",
    images: ["/images/og-image.jpg"],
  },
  alternates: {
    canonical: "https://velixstore.vercel.app",
  },
  category: "fashion",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "",
  },
  // إضافة meta tags محسنة للـ mobile
  other: {
    'format-detection': 'telephone=no',
    'msapplication-tap-highlight': 'no',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'VELIX',
  },
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
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <head>
        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.png" />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload critical assets */}
        <link rel="preload" href="/logo.png" as="image" />
        
        {/* Sitemap and RSS - for better SEO */}
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
        
        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://wa.me" />
        <link rel="dns-prefetch" href="https://instagram.com" />
      </head>
      <body className="flex flex-col min-h-screen bg-white font-sans antialiased">
        {/* Toast Provider for notifications */}
        <ToastProvider />
        
        {/* Header */}
        <Header />
        
        {/* Main Content */}
        <main className="grow">
          {children}
        </main>
        
        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}