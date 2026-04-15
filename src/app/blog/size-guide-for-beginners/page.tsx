// app/blog/دليل-المقاسات-الكامل-ازاي-تختار-المقاس-المناسب/page.tsx
import { Metadata } from 'next'
import SizeGuideClient from './SizeGuideClient'

export const metadata: Metadata = {
  title: "دليل المقاسات الكامل | ازاي تختار المقاس المناسب لأي قطعة ملابس - VELIX",
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
    title: "دليل المقاسات الكامل | ازاي تختار المقاس المناسب لأي قطعة ملابس",
    description: "دليل شامل لقياس الجسم واختيار المقاس المناسب للتيشرتات والهوديز والشروال. جدول مقاسات ونصائح عملية.",
    url: "https://velix-eg.store/blog/%D8%AF%D9%84%D9%8A%D9%84-%D8%A7%D9%84%D9%85%D9%82%D8%A7%D8%B3%D8%A7%D8%AA-%D8%A7%D9%84%D9%83%D8%A7%D9%85%D9%84-%D8%A7%D8%B2%D8%A7%D9%8A-%D8%AA%D8%AE%D8%AA%D8%A7%D8%B1-%D8%A7%D9%84%D9%85%D9%82%D8%A7%D8%B3-%D8%A7%D9%84%D9%85%D9%86%D8%A7%D8%B3%D8%A8",
    type: "article",
    publishedTime: "2026-04-15",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "VELIX - دليل المقاسات الكامل" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "دليل المقاسات الكامل | ازاي تختار المقاس المناسب",
    description: "دليل شامل لقياس الجسم واختيار المقاس المناسب",
    images: ["/images/og-image.jpg"],
  },
  alternates: {
    canonical: "https://velix-eg.store/blog/دليل-المقاسات-الكامل-ازاي-تختار-المقاس-المناسب",
  },
}

export default function SizeGuidePage() {
  return <SizeGuideClient />
}