// app/products/metadata.ts
import { Metadata } from 'next';

export const productsMetadata: Metadata = {
  title: "جميع المنتجات | VELIX - تشكيلة التيشرتات والهوديز",
  description: "اكتشف أحدث تشكيلة من VELIX. تشكيلة واسعة من التيشرتات والهوديز والشروال بتصميمات عصرية وجودة عالية. تسوق الآن وادفع عند الاستلام لجميع محافظات مصر.",
  keywords: "تيشرتات رجالي, هوديز مصر, ملابس شباب, VELIX, ستريت وير مصر, ملابس مصرية, براند ملابس مصري",
  authors: [{ name: "VELIX", url: "https://velix-eg.store" }],
  creator: "VELIX",
  publisher: "VELIX",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": 200,
    },
  },
  openGraph: {
    title: "جميع المنتجات | VELIX - تشكيلة التيشرتات والهوديز",
    description: "اكتشف أحدث تشكيلة من التيشرتات والهوديز. جودة عالية وتصميم عصري. تسوق الآن وادفع عند الاستلام.",
    url: "https://velix-eg.store/products",
    siteName: "VELIX",
    locale: "ar_EG",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VELIX - تشكيلة المنتجات - تيشرتات وهوديز",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "جميع المنتجات | VELIX",
    description: "اكتشف أحدث تشكيلة من التيشرتات والهوديز. جودة عالية وتصميم عصري.",
    images: ["/images/og-image.jpg"],
  },
  alternates: {
    canonical: "https://velix-eg.store/products",
  },
  category: "clothing",
};