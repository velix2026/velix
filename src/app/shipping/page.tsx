// app/shipping/page.tsx
import ShippingClient from './ShippingClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "سياسة الشحن | VELIX - توصيل سريع ومجاني للقاهرة والجيزة",
  description: "تعرف على سياسة الشحن في VELIX. شحن مجاني للقاهرة والجيزة وقليوبية، توصيل خلال 2-5 أيام، متابعة الطلب خطوة بخطوة.",
  keywords: "سياسة الشحن, توصيل مجاني, VELIX, شحن سريع, توصيل القاهرة, توصيل الجيزة, متابعة الطلب",
  openGraph: {
    title: "سياسة الشحن | VELIX - توصيل سريع ومجاني",
    description: "شحن مجاني للقاهرة والجيزة وقليوبية - توصيل خلال 2-5 أيام",
    url: "https://velix-eg.store/shipping",
    siteName: "VELIX",
    locale: "ar_EG",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VELIX - سياسة الشحن",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "سياسة الشحن | VELIX",
    description: "شحن مجاني وتوصيل سريع لجميع الطلبات",
    images: ["/images/og-image.jpg"],
  },
  alternates: {
    canonical: "https://velix-eg.store/shipping",
  },
};

export default function ShippingPage() {
  return <ShippingClient />;
}