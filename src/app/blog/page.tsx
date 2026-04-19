// app/blog/page.tsx
import { Metadata } from 'next'
import BlogClient from './BlogClient'

export const metadata: Metadata = {
  title: "مدونة VELIX | دليل الموضة المصري - نصائح وإرشادات للملابس",
  description: "دليل الموضة المصري الشامل. نصائح لاختيار الملابس، دليل المقاسات، العناية بالملابس، وأحدث صيحات الستريت وير في مصر.",
  keywords: ["مدونة موضة مصرية", "دليل المقاسات", "ازاي تختار هدومك", "نصائح موضة للشباب", "ستريت وير مصر", "القطن المصري", "عناية بالملابس", "تسوق أونلاين مصر"],
  openGraph: {
    title: "مدونة VELIX | دليل الموضة المصري الشامل",
    description: "دليل شامل للموضة المصرية. نصائح وإرشادات لاختيار الملابس، العناية بها، وأحدث صيحات الستريت وير.",
    url: "https://velix-eg.store/blog",
    siteName: "VELIX",
    locale: "ar_EG",
    type: "website",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "VELIX - مدونة الموضة المصرية" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "مدونة VELIX | دليل الموضة المصري",
    description: "نصائح وإرشادات للموضة المصرية. ازاي تبقى شيك في كل وقت.",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: "https://velix-eg.store/blog",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function BlogPage() {
  return <BlogClient />
}