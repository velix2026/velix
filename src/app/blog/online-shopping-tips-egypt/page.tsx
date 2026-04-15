// app/blog/نصائح-للتسوق-اونلاين-في-مصر/page.tsx
import { Metadata } from 'next'
import OnlineShoppingClient from './OnlineShoppingClient'

export const metadata: Metadata = {
  title: "نصائح التسوق أونلاين في مصر | ازاي تشتري من النت من غير وجع دماغ | VELIX",
  description: "دليل كامل للتسوق أونلاين في مصر. ازاي تتأكد من جودة المنتج، ازاي تختار المقاس، وايه حقوقك كعميل عند الشراء أونلاين.",
  keywords: [
    "التسوق أونلاين في مصر",
    "نصائح لشراء من النت",
    "ازاي تشتري أونلاين",
    "تسوق ملابس أونلاين",
    "دفع عند الاستلام",
    "حقوق المستهلك في مصر",
    "التسوق الآمن"
  ],
  openGraph: {
    title: "نصائح التسوق أونلاين في مصر | ازاي تشتري من النت من غير وجع دماغ",
    description: "دليل كامل للتسوق أونلاين في مصر. ازاي تتأكد من جودة المنتج، ازاي تختار المقاس، وايه حقوقك كعميل.",
    url: "https://velix-eg.store/blog/%D9%86%D8%B5%D8%A7%D8%A6%D8%AD-%D9%84%D9%84%D8%AA%D8%B3%D9%88%D9%82-%D8%A7%D9%88%D9%86%D9%84%D8%A7%D9%8A%D9%86-%D9%81%D9%8A-%D9%85%D8%B5%D8%B1",
    type: "article",
    publishedTime: "2026-04-15",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "VELIX - نصائح التسوق أونلاين في مصر" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "نصائح التسوق أونلاين في مصر",
    description: "ازاي تشتري من النت من غير وجع دماغ",
    images: ["/images/og-image.jpg"],
  },
  alternates: {
    canonical: "https://velix-eg.store/blog/نصائح-للتسوق-اونلاين-في-مصر",
  },
}

export default function OnlineShoppingPage() {
  return <OnlineShoppingClient />
}