import TrackClient from './TrackClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "تتبع طلبك | VELIX",
  description: "تابع حالة طلبك من VELIX - أدخل رقم الطلب ورقم الهاتف لمعرفة حالة طلبك في أي وقت.",
  keywords: ["تتبع الطلب", "متابعة الشحنة", "VELIX", "حالة الطلب", "توصيل", "متابعة طلب"],
  openGraph: {
    title: "تتبع طلبك | VELIX",
    description: "تابع حالة طلبك خطوة بخطوة",
    url: "https://velix-eg.store/track",
    siteName: "VELIX",
    locale: "ar_EG",
    type: "website",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "VELIX - تتبع طلبك",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "تتبع طلبك | VELIX",
    description: "تابع حالة طلبك خطوة بخطوة",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: "https://velix-eg.store/track",
  },
};

export default function TrackPage() {
  return <TrackClient />;
}
