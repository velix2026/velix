// app/blog/ازاي-تنسق-الستريت-وير-المصري/page.tsx
import { Metadata } from 'next'
import StreetwearClient from './StreetwearClient'

export const metadata: Metadata = {
  title: "ازاي تنسق الستريت وير المصري؟ 5 ستايلات جامدة | دليل الموضة للشباب | VELIX",
  description: "دليل تنسيق الستريت وير المصري. 5 ستايلات مختلفة تناسب الشباب المصري، ازاي تختار القطع، وايه اللي يناسب جسمك. نصائح عملية عشان تبقى شيك.",
  keywords: [
    "ستريت وير مصري",
    "ازاي تنسق هدومك",
    "ستايلات شباب مصر",
    "تنسيق هوديز",
    "موضة رجالي مصر",
    "ستريت وير ستايل",
    "ازاي تبقى شيك",
    "تنسيق ملابس شباب"
  ],
  openGraph: {
    title: "ازاي تنسق الستريت وير المصري؟ 5 ستايلات جامدة",
    description: "دليل تنسيق الستريت وير المصري. 5 ستايلات مختلفة تناسب الشباب المصري، ازاي تختار القطع، وايه اللي يناسب جسمك.",
    url: "https://velix-eg.store/blog/%D8%A7%D8%B2%D8%A7%D9%8A-%D8%AA%D9%86%D8%B3%D9%82-%D8%A7%D9%84%D8%B3%D8%AA%D8%B1%D9%8A%D8%AA-%D9%88%D9%8A%D8%B1-%D8%A7%D9%84%D9%85%D8%B5%D8%B1%D9%8A",
    type: "article",
    publishedTime: "2026-04-15",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "VELIX - ازاي تنسق الستريت وير المصري" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ازاي تنسق الستريت وير المصري؟ 5 ستايلات جامدة",
    description: "دليل تنسيق الستريت وير المصري للشباب",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: "https://velix-eg.store/blog/ازاي-تنسق-الستريت-وير-المصري",
  },
}

export default function StreetwearPage() {
  return <StreetwearClient />
}