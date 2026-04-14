import { getProducts } from "@/lib/products";
import ProductsClient from "./ProductsClient";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "المنتجات | VELIX - تشكيلة كاملة",
  description: "اكتشف أحدث تشكيلة من VELIX. تشكيلة واسعة من التيشرتات والهوديز والشروال بتصميمات عصرية وجودة عالية. تسوق الآن وادفع عند الاستلام.",
  keywords: ["تيشرتات رجالي", "هوديز مصر", "ملابس شباب", "VELIX", "ستريت وير مصر", "ملابس مصرية", "براند ملابس مصري"],
  openGraph: {
    title: "المنتجات | VELIX - تشكيلة كاملة",
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
        alt: "VELIX - تشكيلة المنتجات",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "المنتجات | VELIX",
    description: "اكتشف أحدث تشكيلة من التيشرتات والهوديز. جودة عالية وتصميم عصري.",
    images: ["/images/og-image.jpg"],
  },
  alternates: {
    canonical: "https://velix-eg.store/products",
  },
};

export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductsClient initialProducts={products} />;
}