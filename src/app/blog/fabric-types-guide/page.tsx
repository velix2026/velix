// app/blog/انواع-الأقمشة-ودليل-اختيارها/page.tsx
import { Metadata } from 'next'
import FabricTypesClient from './FabricTypesClient'

export const metadata: Metadata = {
  title: "أنواع الأقمشة الكامل | دليل اختيار القماش المناسب لكل فصل | VELIX",
  description: "دليل شامل لأنواع الأقمشة: قطن، بوليستر، صوف، حرير، دنيم. ازاي تختار القماش المناسب للصيف والشتاء حسب احتياجك. مميزات وعيوب كل نوع.",
  keywords: [
    "أنواع الأقمشة",
    "دليل اختيار القماش",
    "الفرق بين القطن والبوليستر",
    "أفضل قماش للصيف",
    "أفضل قماش للشتاء",
    "القطن المصري",
    "خامات الملابس",
    "ازاي تختار قماش هدومك"
  ],
  openGraph: {
    title: "أنواع الأقمشة الكامل | دليل اختيار القماش المناسب لكل فصل",
    description: "دليل شامل لأنواع الأقمشة: قطن، بوليستر، صوف، حرير، دنيم. مميزات وعيوب كل نوع. ازاي تختار القماش المناسب للصيف والشتاء.",
    url: "https://velix-eg.store/blog/%D8%A7%D9%86%D9%88%D8%A7%D8%B9-%D8%A7%D9%84%D8%A7%D9%82%D9%85%D8%B4%D8%A9-%D9%88%D8%AF%D9%84%D9%8A%D9%84-%D8%A7%D8%AE%D8%AA%D9%8A%D8%A7%D8%B1%D9%87%D8%A7",
    type: "article",
    publishedTime: "2026-04-15",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "VELIX - أنواع الأقمشة ودليل اختيارها" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "أنواع الأقمشة الكامل | دليل اختيار القماش المناسب",
    description: "دليل شامل لأنواع الأقمشة: مميزات وعيوب كل نوع",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: "https://velix-eg.store/blog/انواع-الأقمشة-ودليل-اختيارها",
  },
}

export default function FabricTypesPage() {
  return <FabricTypesClient />
}