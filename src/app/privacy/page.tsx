import PrivacyClient from './PrivacyClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "سياسة الخصوصية | VELIX",
  description: "تعرف على سياسة خصوصية VELIX. إحنا بنحمي بياناتك، وبنستخدمها بس عشان نخدمك. خصوصيتك هي أولويتنا.",
  keywords: ["سياسة الخصوصية", "حماية البيانات", "VELIX", "خصوصية", "أمان المعلومات"],
  openGraph: {
    title: "سياسة الخصوصية | VELIX",
    description: "تعرف على سياسة خصوصية VELIX - بياناتك في أمان معانا",
    url: "https://velix-eg.store/privacy",
    siteName: "VELIX",
    locale: "ar_EG",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VELIX - سياسة الخصوصية",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "سياسة الخصوصية | VELIX",
    description: "تعرف على سياسة خصوصية VELIX",
    images: ["/images/og-image.jpg"],
  },
  alternates: {
    canonical: "https://velix-eg.store/privacy",
  },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}