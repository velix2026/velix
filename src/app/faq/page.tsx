// app/faq/page.tsx
import FAQClient from './FAQClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "الأسئلة الشائعة | VELIX - براند ملابس مصري",
  description: "كل اللي عايز تعرفه عن الملابس المصرية: المقاسات المناسبة، الشحن لجميع المحافظات، الدفع عند الاستلام، الاستبدال المجاني خلال 14 يوم. إجابات على أسئلة المصريين.",
  keywords: [
    "أسئلة شائعة عن الملابس مصر",
    "ازاي اعرف المقاس المناسب ليا",
    "تيشرت رجالي قطن مصري سادة",
    "هودي شتوي تقيل اصلي مصر",
    "شروال رياضي قطن رجالى",
    "شحن مجاني لكل مصر",
    "دفع عند الاستلام ملابس",
    "استبدال مجاني 14 يوم مصر",
    "قطن مصري فاخر للملابس",
    "براند ملابس مصري شبابي",
    "VELIX مصر",
    "ازاي اختار هدومي اون لاين"
  ],
  openGraph: {
    title: "الأسئلة الشائعة | VELIX - إجابات على كل أسئلتك",
    description: "دليل شامل لكل ما تريد معرفته عن VELIX: المقاسات، الشحن، الدفع، الاستبدال. أجوبة بالعامية المصرية.",
    url: "https://velix-eg.store/faq",
    siteName: "VELIX",
    locale: "ar_EG",
    type: "website",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "VELIX - الأسئلة الشائعة",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "الأسئلة الشائعة | VELIX",
    description: "كل اللي عايز تعرفه عن VELIX في مكان واحد",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: "https://velix-eg.store/faq",
  },
};

export default function FAQPage() {
  return <FAQClient />;
}