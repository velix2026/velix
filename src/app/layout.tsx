import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://velixstore.vercel.app"),
  title: {
    default: "VELIX | براند ملابس مصري - ستايل عصري وجودة في التفاصيل",
    template: "%s | VELIX",
  },
  description: "VELIX براند ملابس مصري بيقدم ستايل عصري للشباب. جودة عالية، تفاصيل مميزة، ودفع عند الاستلام.",
  keywords: ["ملابس رجالي مصر", "براند ملابس مصري", "تيشرتات رجالي", "هوديز مصر", "VELIX"],
  authors: [{ name: "VELIX" }],
  creator: "VELIX",
  publisher: "VELIX",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    title: "VELIX | براند ملابس مصري",
    description: "ستايل عصري وجودة في التفاصيل. اطلب دلوقتي بالدفع عند الاستلام.",
    url: "https://velixstore.vercel.app",
    siteName: "VELIX",
    locale: "ar_EG",
    type: "website",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "VELIX" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VELIX | براند ملابس مصري",
    description: "ستايل عصري وجودة في التفاصيل. اطلب دلوقتي بالدفع عند الاستلام.",
    images: ["/images/og-image.jpg"],
  },
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
        <main className="grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}