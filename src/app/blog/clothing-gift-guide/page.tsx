// app/blog/ازاي-تختار-هدية-من-الملابس/page.tsx
import { Metadata } from 'next'
import GiftGuideClient from './GiftGuideClient'

export const metadata: Metadata = {
  title: "ازاي تختار هدية من الملابس لحد بتحبه؟ | دليل الهدايا المثالية | VELIX",
  description: "دليل كامل لاختيار هدية من الملابس لأي مناسبة (عيد ميلاد، تخرج، خطوبة). ازاي تعرف المقاس، ازاي تختار اللون، وأفضل أفكار هدايا ملابس للشباب في مصر.",
  keywords: [
    "هدية ملابس",
    "ازاي تختار هدية",
    "هدايا عيد ميلاد رجالي",
    "هدية تخرج",
    "افكار هدايا للشباب",
    "هدية مناسبة",
    "هدية خطوبة",
    "VELIX هدايا"
  ],
  openGraph: {
    title: "ازاي تختار هدية من الملابس لحد بتحبه؟ دليل الهدايا المثالية",
    description: "دليل كامل لاختيار هدية من الملابس لأي مناسبة. ازاي تعرف المقاس، ازاي تختار اللون، وأفضل أفكار هدايا.",
    url: "https://velix-eg.store/blog/ازاي-تختار-هدية-من-الملابس",
    type: "article",
    publishedTime: "2026-04-12",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "VELIX - دليل الهدايا" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ازاي تختار هدية من الملابس لحد بتحبه؟",
    description: "دليل كامل لاختيار هدية من الملابس لأي مناسبة",
    images: ["/images/og-image.jpg"],
  },
  alternates: {
    canonical: "https://velix-eg.store/blog/ازاي-تختار-هدية-من-الملابس",
  },
}

export default function GiftGuidePage() {
  return <GiftGuideClient />
}