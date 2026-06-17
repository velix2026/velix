import { Metadata } from 'next'
import SizeGuideClient from './SizeGuideClient'

export const metadata: Metadata = {
  title: "دليل المقاسات للمبتدئين | ازاي تطلب مقاسك الصح من أول مرة - VELIX",
  description: "لو أول مرة تشتري ملابس أونلاين، دليل المبتدئين ده هيعلمك ازاي تقيس نفسك وتختار المقاس المناسب من أول مرة بدون وجع دماغ.",
  keywords: [
    "دليل مقاسات للمبتدئين",
    "ازاي اعرف مقاسي اول مرة",
    "جدول مقاسات مبتدئين",
    "ازاي اشتري اونلاين مقاس صح",
    "مقاسات الملابس للمبتدئين",
    "اول مرة اشتري ملابس من النت",
    "تعلم قياس الملابس"
  ],
  openGraph: {
    title: "دليل المقاسات للمبتدئين | ازاي تطلب مقاسك الصح من أول مرة",
    description: "لو أول مرة تشتري ملابس أونلاين، دليل المبتدئين ده هيعلمك ازاي تقيس نفسك وتختار المقاس المناسب.",
    url: "https://velix-eg.store/blog/size-guide-for-beginners",
    type: "article",
    publishedTime: "2026-04-08",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "VELIX - دليل المقاسات للمبتدئين" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "دليل المقاسات للمبتدئين | ازاي تطلب مقاسك الصح",
    description: "دليل مبسط لقياس الجسم واختيار المقاس المناسب",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: "https://velix-eg.store/blog/size-guide-for-beginners",
  },
}

export default function SizeGuidePage() {
  return <SizeGuideClient />
}
