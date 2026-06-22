import LoyaltyClient from './LoyaltyClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "برنامج المكافآت | VELIX - نقاط ولاء وخصومات",
  description: "برنامج ولاء VELIX: اكسب نقاط على كل طلبك واستبدلها بخصم. مستويات برونزي، فضي، ذهبي، بلاتيني. كل ١٠٠ نقطة = ١٠ جنيه خصم.",
  keywords: [
    "برنامج ولاء ملابس مصر",
    "نقاط ولاء",
    "خصم على الملابس",
    "VELIX loyalty",
    "اكسب نقاط مع كل طلب",
    "استبدال النقاط بخصم",
    "مستويات ولاء",
    "برونزي فضي ذهبي بلاتيني"
  ],
  openGraph: {
    title: "برنامج المكافآت | VELIX - نقاط ولاء وخصومات",
    description: "كل ما تطلب، كل ما تكسب نقاط. استبدل نقاطك بخصم على طلباتك الجاية.",
    url: "https://velix-eg.store/loyalty",
    siteName: "VELIX",
    locale: "ar_EG",
    type: "website",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "VELIX Loyalty" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "برنامج المكافآت | VELIX",
    description: "كل ما تطلب، كل ما تكسب نقاط.",
    images: ["/images/og-image.png"],
  },
  alternates: { canonical: "https://velix-eg.store/loyalty" },
};

export default function LoyaltyPage() {
  return <LoyaltyClient />;
}
