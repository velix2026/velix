import ContactClient from './ContactClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "اتصل بنا | VELIX",
  description: "تواصل مع فريق VELIX عبر واتساب أو البريد الإلكتروني أو السوشيال ميديا. فريقنا جاهز يرد عليك 24 ساعة.",
  keywords: ["اتصل بنا", "VELIX", "خدمة العملاء", "واتساب VELIX", "دعم فني", "تواصل مع البراند"],
  openGraph: {
    title: "اتصل بنا | VELIX",
    description: "تواصل مع فريق VELIX - بنرد عليك خلال 24 ساعة",
    url: "https://velix-eg.store/contact",
    siteName: "VELIX",
    locale: "ar_EG",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VELIX - اتصل بنا",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "اتصل بنا | VELIX",
    description: "تواصل مع فريق VELIX",
    images: ["/images/og-image.jpg"],
  },
  alternates: {
    canonical: "https://velix-eg.store/contact",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}