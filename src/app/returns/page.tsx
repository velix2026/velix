import ReturnsClient from './ReturnsClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "سياسة الاستبدال والاسترجاع | VELIX",
  description: "تعرف على سياسة الاستبدال والاسترجاع في VELIX. استبدال أو استرجاع خلال 14 يوم، خدمة مجانية، رضاك هو أولويتنا.",
  keywords: ["سياسة الاستبدال", "استرجاع المنتجات", "VELIX", "خدمة العملاء", "استبدال مجاني", "ضمان الرضا"],
  openGraph: {
    title: "سياسة الاستبدال والاسترجاع | VELIX",
    description: "استبدال أو استرجاع خلال 14 يوم - خدمة مجانية ورضاك مضمون",
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
    description: "استبدال أو استرجاع خلال 14 يوم - خدمة مجانية",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: "https://velix-eg.store/returns",
  },
};

export default function ReturnsPage() {
  return <ReturnsClient />;
}