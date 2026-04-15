// app/blog/الفرق-بين-القطن-المصري-والقطن-العادي/page.tsx
import { Metadata } from 'next'
import EgyptianCottonClient from './EgyptianCottonClient'

export const metadata: Metadata = {
  title: "الفرق بين القطن المصري والقطن العادي | ليه القطن المصري الأحسن؟ | VELIX",
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
    title: "الفرق بين القطن المصري والقطن العادي | ليه القطن المصري الأحسن؟",
    description: "دليل كامل عن الفرق بين القطن المصري والقطن العادي. ازاي تفرق بينهم، ليه القطن المصري غالي، وايه اللي يخليك تختاره.",
    url: "https://velix-eg.store/blog/%D8%A7%D9%84%D9%81%D8%B1%D9%82-%D8%A8%D9%8A%D9%86-%D8%A7%D9%84%D9%82%D8%B7%D9%86-%D8%A7%D9%84%D9%85%D8%B5%D8%B1%D9%8A-%D9%88%D8%A7%D9%84%D9%82%D8%B7%D9%86-%D8%A7%D9%84%D8%B9%D8%A7%D8%AF%D9%8A",
    type: "article",
    publishedTime: "2026-04-15",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "VELIX - الفرق بين القطن المصري والقطن العادي" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "الفرق بين القطن المصري والقطن العادي",
    description: "ليه القطن المصري الأحسن؟ دليل كامل",
    images: ["/images/og-image.jpg"],
  },
  alternates: {
    canonical: "https://velix-eg.store/blog/الفرق-بين-القطن-المصري-والقطن-العادي",
  },
}

export default function EgyptianCottonPage() {
  return <EgyptianCottonClient />
}