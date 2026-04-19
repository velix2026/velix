// app/blog/ازاي-تحافظ-على-ملابسك/page.tsx
import { Metadata } from 'next'
import ClothingCareClient from './ClothingCareClient'

export const metadata: Metadata = {
  title: "ازاي تحافظ على ملابسك لأطول فترة؟ 10 نصائح ذهبية | دليل العناية بالملابس | VELIX",
  description: "دليل كامل للعناية بالملابس: ازاي تغسل، ازاي تكوي، ازاي تخزن عشان ملابسك تفضل زي الجديدة لسنين. 10 نصائح عملية هتوفر عليك فلوس كتير.",
  keywords: [
    "ازاي تحافظ على ملابسك",
    "عناية بالملابس",
    "غسيل الملابس",
    "ازاي اغسل هدومي",
    "تخزين الملابس",
    "كي الملابس",
    "نصائح للعناية بالملابس",
    "ازاي تخلي هدومك تفضل جديدة"
  ],
  openGraph: {
    title: "ازاي تحافظ على ملابسك لأطول فترة؟ 10 نصائح ذهبية",
    description: "دليل كامل للعناية بالملابس: ازاي تغسل، ازاي تكوي، ازاي تخزن عشان ملابسك تفضل زي الجديدة لسنين.",
    url: "https://velix-eg.store/blog/%D8%A7%D8%B2%D8%A7%D9%8A-%D8%AA%D8%AD%D8%A7%D9%81%D8%B8-%D8%B9%D9%84%D9%89-%D9%85%D9%84%D8%A7%D8%A8%D8%B3%D9%83",
    type: "article",
    publishedTime: "2026-04-15",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "VELIX - ازاي تحافظ على ملابسك" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ازاي تحافظ على ملابسك لأطول فترة؟",
    description: "10 نصائح ذهبية للعناية بالملابس",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: "https://velix-eg.store/blog/ازاي-تحافظ-على-ملابسك",
  },
}

export default function ClothingCarePage() {
  return <ClothingCareClient />
}