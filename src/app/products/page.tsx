import { getProducts } from "@/lib/products";
import ProductsClient from "./ProductsClient";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "المنتجات | VELIX | لبس ولاد البلد",
  description: "اكتشف تشكيلة VELIX. تيشرتات، هوديز، وشروال قطن مصري أصلي للشباب. جودة عالية وأسعار مناسبة. اطلب وادفع عند الاستلام.",
  keywords: ["تيشرت رجالي قطن مصري", "هودي شتوي مصر", "شروال رياضي رجالى", "ملابس شبابي مصر", "VELIX", "ستريت وير مصر", "لبس ولاد البلد", "براند ملابس مصري", "اشترى ملابس اون لاين مصر", "تيشرتات اوفر سايز مصر"],
  openGraph: {
    title: "المنتجات | VELIX - تشكيلة كاملة",
    description: "اكتشف أحدث تشكيلة من التيشرتات والهوديز. جودة عالية وتصميم عصري. تسوق الآن وادفع عند الاستلام.",
    url: "https://velix-eg.store/products",
    siteName: "VELIX",
    locale: "ar_EG",
    type: "website",
    images: [
      {
        url: "/images/og-image.png",
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
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: "https://velix-eg.store/products",
  },
};

export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductsClient initialProducts={products} />;
}