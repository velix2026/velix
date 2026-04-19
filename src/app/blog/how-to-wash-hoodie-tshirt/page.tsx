// app/blog/ازاي-تغسل-الهودي-والتيشرت/page.tsx
import { Metadata } from 'next'
import WashingGuideClient from './WashingGuideClient'

export const metadata: Metadata = {
  title: "ازاي تغسل الهودي والتيشرت عشان يفضلوا زي الجديد | دليل الغسيل الكامل | VELIX",
  description: "دليل كامل لغسيل الهوديز والتيشرتات. ازاي تغسل، ازاي تنشف، ازاي تكوي عشان ملابسك تفضل زي الجديدة لسنين.",
  keywords: [
    "ازاي تغسل الهودي",
    "غسيل التيشرتات",
    "ازاي تنشف الملابس",
    "عناية بالهوديز",
    "غسيل القطن المصري",
    "ازاي تكوي التيشرت",
    "نصائح غسيل الملابس"
  ],
  openGraph: {
    title: "ازاي تغسل الهودي والتيشرت عشان يفضلوا زي الجديد",
    description: "دليل كامل لغسيل الهوديز والتيشرتات. ازاي تغسل، ازاي تنشف، ازاي تكوي عشان ملابسك تفضل زي الجديدة.",
    url: "https://velix-eg.store/blog/%D8%A7%D8%B2%D8%A7%D9%8A-%D8%AA%D8%BA%D8%B3%D9%84-%D8%A7%D9%84%D9%87%D9%88%D8%AF%D9%8A-%D9%88%D8%A7%D9%84%D8%AA%D9%8A%D8%B4%D8%B1%D8%AA",
    type: "article",
    publishedTime: "2026-04-15",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "VELIX - ازاي تغسل الهودي والتيشرت" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ازاي تغسل الهودي والتيشرت عشان يفضلوا زي الجديد",
    description: "دليل كامل لغسيل الهوديز والتيشرتات",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: "https://velix-eg.store/blog/ازاي-تغسل-الهودي-والتيشرت",
  },
}

export default function WashingGuidePage() {
  return <WashingGuideClient />
}