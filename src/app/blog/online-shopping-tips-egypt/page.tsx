// app/blog/نصائح-للتسوق-اونلاين-في-مصر/page.tsx
import { Metadata } from 'next'
import OnlineShoppingClient from './OnlineShoppingClient'

export const metadata: Metadata = {
  title: "نصائح التسوق أونلاين في مصر | VELIX",
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
    title: "نصائح التسوق أونلاين في مصر",
    description: "دليل كامل للتسوق أونلاين في مصر. ازاي تتأكد من جودة المنتج، ازاي تختار المقاس، وايه حقوقك كعميل.",
    url: "https://velix-eg.store/blog/online-shopping-tips-egypt",
    type: "article",
    publishedTime: "2026-04-15",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "VELIX - نصائح التسوق أونلاين في مصر" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "نصائح التسوق أونلاين في مصر",
    description: "ازاي تشتري من النت من غير وجع دماغ",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: "https://velix-eg.store/blog/online-shopping-tips-egypt",
  },
}

export default function OnlineShoppingPage() {
  return <OnlineShoppingClient />
}