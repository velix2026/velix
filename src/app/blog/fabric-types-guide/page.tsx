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
    url: "https://velix-eg.store/blog/fabric-types-guide",
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
    canonical: "https://velix-eg.store/blog/fabric-types-guide",
  },
}

export default function FabricTypesPage() {
  return <FabricTypesClient />
}