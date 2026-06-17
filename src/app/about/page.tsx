import AboutClient from './AboutClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "عن VELIX (فيلكس) | لبس ولاد البلد",
  description: "VELIX - براند ملابس مصري للشباب. قصتنا، رؤيتنا، ورسالتنا. بنقدم تيشرتات وهوديز وشروال قطن مصري أصلي بجودة عالية.",
  keywords: ["عن VELIX", "قصة براند ملابس مصري", "صناعة مصرية 100%", "VELIX براند مصري", "لبس ولاد البلد", "براند ملابس شباب مصر", "براند ملابس مصري", "ازاي بدت VELIX", "مستقبل الموضة المصرية"],
  openGraph: {
    title: "عن VELIX (فيلكس) | لبس ولاد البلد",
    description: "اكتشف قصة VELIX - لبس ولاد البلد. تيشرتات وهوديز وشروال قطن مصري أصلي.",
    url: "https://velix-eg.store/about",
    siteName: "VELIX",
    locale: "ar_EG",
    type: "website",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "VELIX - لبس ولاد البلد",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "عن VELIX (فيلكس) | لبس ولاد البلد",
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