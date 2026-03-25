import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
    google: "your-google-verification-code", // ضع الكود بعد ما تاخده من Google Search Console
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="flex flex-col min-h-screen bg-white">
        <Header />
        <main className="grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}