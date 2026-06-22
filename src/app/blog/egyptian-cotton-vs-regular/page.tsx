// app/blog/الفرق-بين-القطن-المصري-والقطن-العادي/page.tsx
import { Metadata } from 'next'
import EgyptianCottonClient from './EgyptianCottonClient'

export const metadata: Metadata = {
  title: "الفرق بين القطن المصري والقطن العادي | VELIX",
  description: "دليل كامل عن الفرق بين القطن المصري والقطن العادي. ازاي تفرق بينهم، ليه القطن المصري غالي، وايه اللي يخليك تختاره.",
  keywords: [
    "الفرق بين القطن المصري والقطن العادي",
    "قطن مصري",
    "مميزات القطن المصري",
    "ازاي تعرف القطن المصري الأصلي",
    "انواع الاقمشة",
    "خامات الملابس",
    "VELIX قطن مصري"
  ],
  openGraph: {
    title: "الفرق بين القطن المصري والقطن العادي",
    description: "دليل كامل عن الفرق بين القطن المصري والقطن العادي. ازاي تفرق بينهم، ليه القطن المصري غالي، وايه اللي يخليك تختاره.",
    url: "https://velix-eg.store/blog/egyptian-cotton-vs-regular",
    type: "article",
    publishedTime: "2026-04-15",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "VELIX - الفرق بين القطن المصري والقطن العادي" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "الفرق بين القطن المصري والقطن العادي",
    description: "ليه القطن المصري الأحسن؟ دليل كامل",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: "https://velix-eg.store/blog/egyptian-cotton-vs-regular",
  },
}

export default function EgyptianCottonPage() {
  return <EgyptianCottonClient />
}