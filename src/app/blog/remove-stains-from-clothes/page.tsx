// app/blog/ازاي-تزيل-البقع-من-الملابس/page.tsx
import { Metadata } from 'next'
import StainRemovalClient from './StainRemovalClient'

export const metadata: Metadata = {
  title: "ازاي تزيل البقع من الملابس | دليل كامل لتنظيف أي نوع بقع | VELIX",
  description: "دليل شامل لإزالة البقع من الملابس: زيت، قهوة، شاي، دم، حبر، وماكياج. طرق طبيعية وكيميائية لتنظيف أي بقعة. نصائح عملية من VELIX.",
  keywords: [
    "ازاي تزيل البقع من الملابس",
    "إزالة بقع الزيت",
    "إزالة بقع الدم",
    "إزالة بقع الحبر",
    "تنظيف الملابس",
    "إزالة بقع القهوة",
    "عناية بالملابس"
  ],
  openGraph: {
    title: "ازاي تزيل البقع من الملابس | دليل كامل لتنظيف أي نوع بقع",
    description: "دليل شامل لإزالة البقع من الملابس: زيت، قهوة، شاي، دم، حبر، وماكياج. طرق طبيعية وكيميائية لتنظيف أي بقعة.",
    url: "https://velix-eg.store/blog/%D8%A7%D8%B2%D8%A7%D9%8A-%D8%AA%D8%B2%D9%8A%D9%84-%D8%A7%D9%84%D8%A8%D9%82%D8%B9-%D9%85%D9%86-%D8%A7%D9%84%D9%85%D9%84%D8%A7%D8%A8%D8%B3",
    type: "article",
    publishedTime: "2026-04-15",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "VELIX - ازاي تزيل البقع من الملابس" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ازاي تزيل البقع من الملابس",
    description: "دليل كامل لتنظيف أي نوع بقع",
    images: ["/images/og-image.jpg"],
  },
  alternates: {
    canonical: "https://velix-eg.store/blog/ازاي-تزيل-البقع-من-الملابس",
  },
}

export default function StainRemovalPage() {
  return <StainRemovalClient />
}