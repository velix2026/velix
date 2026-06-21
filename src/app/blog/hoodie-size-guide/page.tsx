// app/blog/دليل-المقاسات-للهوديز/page.tsx
import { Metadata } from 'next'
import HoodieSizeGuideClient from './HoodieSizeGuideClient'

export const metadata: Metadata = {
  title: "دليل المقاسات الكامل للهوديز | ازاي تختار المقاس الصح | VELIX",
  description: "دليل شامل لاختيار مقاس الهودي المناسب. ازاي تقيس نفسك، جدول مقاسات الهوديز، ونصائح لشراء الهودي المثالي. اعرف الفرق بين الهودي والتيشرت في المقاسات.",
  keywords: [
    "دليل مقاسات الهوديز",
    "ازاي تختار مقاس الهودي",
    "مقاسات هوديز",
    "هودي اوفر سايز",
    "هودي شتوي",
    "ازاي تقيس نفسك للهودي",
    "مقاسات الملابس"
  ],
  openGraph: {
    title: "دليل المقاسات الكامل للهوديز | ازاي تختار المقاس الصح",
    description: "دليل شامل لاختيار مقاس الهودي المناسب. ازاي تقيس نفسك، جدول مقاسات الهوديز، ونصائح لشراء الهودي المثالي.",
    url: "https://velix-eg.store/blog/hoodie-size-guide",
    type: "article",
    publishedTime: "2026-04-15",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "VELIX - دليل مقاسات الهوديز" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "دليل المقاسات الكامل للهوديز",
    description: "ازاي تختار المقاس الصح للهودي",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: "https://velix-eg.store/blog/hoodie-size-guide",
  },
}

export default function HoodieSizeGuidePage() {
  return <HoodieSizeGuideClient />
}