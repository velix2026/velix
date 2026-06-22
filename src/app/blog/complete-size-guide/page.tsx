// app/blog/دليل-المقاسات-الكامل/page.tsx
import { Metadata } from 'next'
import SizeGuideClient from './SizeGuideClient'

export const metadata: Metadata = {
  title: "دليل المقاسات الكامل | VELIX",
  description: "دليل شامل لقياس الجسم واختيار المقاس المناسب للتيشرتات والهوديز والشروال. جدول مقاسات، نصائح، وازاي تقيس نفسك صح قبل ما تشتري أونلاين.",
  keywords: [
    "دليل المقاسات",
    "ازاي اعرف مقاسي",
    "جدول مقاسات الملابس",
    "قياس الجسم للملابس",
    "مقاسات تيشرتات",
    "مقاسات هوديز",
    "مقاسات شروال",
    "ازاي تطلب مقاس صح",
    "مقاسات الملابس مصر"
  ],
  openGraph: {
    title: "دليل المقاسات الكامل",
    description: "دليل شامل لقياس الجسم واختيار المقاس المناسب للتيشرتات والهوديز والشروال. جدول مقاسات ونصائح عملية.",
    url: "https://velix-eg.store/blog/complete-size-guide",
    type: "article",
    publishedTime: "2026-04-15",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "VELIX - دليل المقاسات الكامل" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "دليل المقاسات الكامل | ازاي تختار المقاس المناسب",
    description: "دليل شامل لقياس الجسم واختيار المقاس المناسب للتيشرتات والهوديز",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: "https://velix-eg.store/blog/complete-size-guide",
  },
}

export default function SizeGuidePage() {
  return <SizeGuideClient />
}