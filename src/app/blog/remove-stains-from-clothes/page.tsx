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
    url: "https://velix-eg.store/blog/remove-stains-from-clothes",
    type: "article",
    publishedTime: "2026-04-15",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "VELIX - ازاي تزيل البقع من الملابس" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ازاي تزيل البقع من الملابس",
    description: "دليل كامل لتنظيف أي نوع بقع",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: "https://velix-eg.store/blog/remove-stains-from-clothes",
  },
}

export default function StainRemovalPage() {
  return <StainRemovalClient />
}