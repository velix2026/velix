// app/terms/page.tsx
import TermsClient from './TermsClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "شروط الاستخدام | VELIX - الاتفاقية بينك وبين VELIX",
  description: "تعرف على شروط استخدام متجر VELIX. المنتجات والأسعار، الطلب والدفع، التوصيل، الاستبدال والاسترجاع، والملكية الفكرية.",
  keywords: "شروط الاستخدام, VELIX, سياسة الموقع, اتفاقية المستخدم, أحكام التسوق",
  openGraph: {
    title: "شروط الاستخدام | VELIX",
    description: "تعرف على شروط استخدام متجر VELIX - حقوقك وواجباتك",
    url: "https://velix-eg.store/terms",
    siteName: "VELIX",
    locale: "ar_EG",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VELIX - شروط الاستخدام",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "شروط الاستخدام | VELIX",
    description: "تعرف على شروط استخدام متجر VELIX",
    images: ["/images/og-image.jpg"],
  },
  alternates: {
    canonical: "https://velix-eg.store/terms",
  },
};

export default function TermsPage() {
  return <TermsClient />;
}