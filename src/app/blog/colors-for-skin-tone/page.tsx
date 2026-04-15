// app/blog/دليل-الوان-الملابس-للبشرة/page.tsx
import { Metadata } from 'next'
import SkinToneColorGuideClient from './SkinToneColorGuideClient'

export const metadata: Metadata = {
  title: "دليل ألوان الملابس حسب لون البشرة | ازاي تختار اللون اللي يليق بيك | VELIX",
  description: "دليل كامل لاختيار ألوان الملابس حسب لون بشرتك. ازاي تعرف لون بشرتك، وايه الألوان اللي تخليك شيك وايه الألوان اللي تخليك باهت.",
  keywords: [
    "ألوان الملابس حسب البشرة",
    "ازاي تختار لون هدومك",
    "أفضل الألوان للبشرة الحنطية",
    "ألوان تيشرتات للبشرة السمراء",
    "الألوان المناسبة للبشرة الفاتحة",
    "تنسيق ألوان الملابس",
    "موضة مصر",
    "VELIX ألوان"
  ],
  openGraph: {
    title: "دليل ألوان الملابس حسب لون البشرة | ازاي تختار اللون اللي يليق بيك",
    description: "دليل كامل لاختيار ألوان الملابس حسب لون بشرتك. ازاي تعرف لون بشرتك، وايه الألوان اللي تخليك شيك.",
    url: "https://velix-eg.store/blog/%D8%AF%D9%84%D9%8A%D9%84-%D8%A7%D9%84%D9%88%D8%A7%D9%86-%D8%A7%D9%84%D9%85%D9%84%D8%A7%D8%A8%D8%B3-%D9%84%D9%84%D8%A8%D8%B4%D8%B1%D8%A9",
    type: "article",
    publishedTime: "2026-04-15",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "VELIX - دليل ألوان الملابس حسب البشرة" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "دليل ألوان الملابس حسب لون البشرة",
    description: "ازاي تختار اللون اللي يليق بيك حسب لون بشرتك",
    images: ["/images/og-image.jpg"],
  },
  alternates: {
    canonical: "https://velix-eg.store/blog/دليل-الوان-الملابس-للبشرة",
  },
}

export default function SkinToneColorGuidePage() {
  return <SkinToneColorGuideClient />
}