// app/blog/ازاي-تختار-التيشرت-المناسب/page.tsx
import { Metadata } from 'next'
import TshirtGuideClient from './TshirtGuideClient'

export const metadata: Metadata = {
  title: "ازاي تختار التيشرت المناسب ليك؟ دليل كامل | VELIX",
  description: "دليل شامل لاختيار التيشرت المناسب حسب شكل جسمك ولون بشرتك والمناسبة. نصائح من VELIX عشان تبقى شيك دايماً.",
  keywords: [
    "ازاي تختار التيشرت المناسب",
    "تيشرتات رجالي",
    "اختيار مقاس التيشرت",
    "أفضل ألوان التيشرتات",
    "تيشرت قطـن مصري",
    "نصائح لشراء التيشرتات",
    "موضة رجالي",
    "ستايل تيشرتات"
  ],
  openGraph: {
    title: "ازاي تختار التيشرت المناسب ليك؟ دليل كامل",
    description: "دليل شامل لاختيار التيشرت المناسب حسب شكل جسمك ولون بشرتك والمناسبة. نصائح من VELIX عشان تبقى شيك دايماً.",
    url: "https://velix-eg.store/blog/how-to-choose-right-tshirt",
    type: "article",
    publishedTime: "2026-04-15",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "VELIX - ازاي تختار التيشرت المناسب" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ازاي تختار التيشرت المناسب ليك؟ دليل كامل",
    description: "نصائح لاختيار التيشرت المناسب حسب جسمك وبشرتك",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: "https://velix-eg.store/blog/how-to-choose-right-tshirt",
  },
}

export default function TshirtGuidePage() {
  return <TshirtGuideClient />
}