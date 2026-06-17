import AboutClient from './AboutClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "عن VELIX | براند ملابس مصري فاخر",
  description: "تعرف على قصة VELIX، أول براند ملابس مصري عالمي. اكتشف رؤيتنا ورسالتنا وقيمنا. صناعة مصرية بجودة عالمية وتصميم عصري. 🇪🇬",
  keywords: ["عن VELIX", "قصة براند ملابس مصري", "صناعة مصرية 100%", "VELIX براند مصري", "ملابس مصرية فاخرة شبابي", "براند ملابس شباب مصر", "براند ملابس مصري عالمي", "ازاي بدت VELIX", "مستقبل الموضة المصرية"],
  openGraph: {
    title: "عن VELIX | براند ملابس مصري فاخر",
    description: "اكتشف قصة VELIX ورؤيتنا لصناعة ملابس مصرية بجودة عالمية. فخامة في كل تفصيلة.",
    url: "https://velix-eg.store/about",
    siteName: "VELIX",
    locale: "ar_EG",
    type: "website",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "VELIX - براند ملابس مصري فاخر",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "عن VELIX | براند ملابس مصري فاخر",
    description: "اكتشف قصة VELIX - صناعة مصرية بجودة عالمية",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: "https://velix-eg.store/about",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}