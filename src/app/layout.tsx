import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: {
    default: "VELIX | براند ملابس مصري - ستايل عصري وجودة في التفاصيل",
    template: "%s | VELIX",
  },
  description: "VELIX براند ملابس مصري بيقدم ستايل عصري للشباب. جودة عالية، تفاصيل مميزة، ودفع عند الاستلام. هتلبس بشكل مختلف في أي وقت وأي مكان.",
  keywords: ["ملابس رجالي مصر", "براند ملابس مصري", "تيشرتات رجالي", "هوديز مصر", "ملابس شبابي", "VELIX", "ستريت وير مصر", "جودة عالية ملابس", "دفع عند الاستلام ملابس", "ماركة ملابس مصرية"],
  authors: [{ name: "VELIX" }],
  creator: "VELIX",
  publisher: "VELIX",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "VELIX | براند ملابس مصري - جودة وتفاصيل مختلفة",
    description: "اكتشف مجموعة VELIX من الملابس المصرية. ستايل عصري، جودة عالية، ودفع عند الاستلام. شحن لجميع المحافظات.",
    url: "https://velixclothing.com",
    siteName: "VELIX",
    locale: "ar_EG",
    type: "website",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "VELIX - براند ملابس مصري" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VELIX | براند ملابس مصري",
    description: "ستايل عصري وجودة في التفاصيل. اطلب دلوقتي بالدفع عند الاستلام.",
    images: ["/images/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://velixclothing.com",
  },
  category: "fashion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="flex flex-col min-h-screen bg-white">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}