import ReturnsClient from './ReturnsClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "سياسة الاستبدال والاسترجاع | VELIX",
  description: "تعرف على سياسة الاستبدال والاسترجاع في VELIX. تقدر ترجع المنتج خلال ١٤ يوم، وشحن مجاني على الاستبدال.",
  keywords: ["سياسة الاسترجاع", "استبدال المنتجات", "VELIX", "إرجاع", "استبدال", "شحن مجاني"],
  openGraph: {
    title: "سياسة الاستبدال والاسترجاع | VELIX",
    description: "سياسة إرجاع واستبدال منتجات VELIX - ١٤ يوم للاسترجاع",
    url: "https://velix-eg.store/returns",
    siteName: "VELIX",
    locale: "ar_EG",
    type: "website",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "VELIX - سياسة الاستبدال والاسترجاع",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "سياسة الاستبدال والاسترجاع | VELIX",
    description: "سياسة إرجاع واستبدال منتجات VELIX",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: "https://velix-eg.store/returns",
  },
};

export default function ReturnsPage() {
  return <ReturnsClient />;
}
