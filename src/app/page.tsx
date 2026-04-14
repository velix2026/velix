import Hero from '@/components/Hero';
import BrandFeatures from '@/components/BrandFeatures';
import FeaturedProducts from '@/components/FeaturedProducts';
import BrandStory from '@/components/BrandStory';
import Newsletter from '@/components/Newsletter';
import { getProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "VELIX | براند ملابس مصري فاخر",
  description: "اكتشف VELIX، أول براند ملابس مصري يجمع بين الجودة العالمية والتصميم العصري. تشكيلة رائعة من التيشرتات والهوديز والشروال. دفع عند الاستلام وتوصيل لجميع محافظات مصر.",
  keywords: [
    "براند ملابس مصري",
    "VELIX",
    "تيشرتات رجالي",
    "هوديز مصر",
    "ملابس شباب",
    "ستريت وير مصر",
    "صناعة مصرية",
  ],
  openGraph: {
    title: "VELIX | براند ملابس مصري فاخر",
    description: "تشكيلة رائعة من التيشرتات والهوديز. جودة عالمية وتصميم عصري. دفع عند الاستلام.",
    url: "https://velix-eg.store",
    siteName: "VELIX",
    locale: "ar_EG",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VELIX - براند ملابس مصري فاخر",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VELIX | براند ملابس مصري فاخر",
    description: "تسوق أحدث تشكيلة من التيشرتات والهوديز. جودة عالمية وتصميم عصري.",
    images: ["/images/og-image.jpg"],
  },
  alternates: {
    canonical: "https://velix-eg.store",
  },
};

export default async function Home() {
  const products = await getProducts();

  const homePageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "VELIX - براند ملابس مصري فاخر",
    "description": "براند ملابس مصري بيقدم تشكيلة رائعة من التيشرتات والهوديز والشروال بجودة عالمية وتصميم عصري",
    "url": "https://velix-eg.store",
    "mainEntity": {
      "@type": "ClothingStore",
      "name": "VELIX",
      "image": "https://velix-eg.store/images/logo.png",
      "priceRange": "$$",
      "paymentAccepted": "Cash on Delivery",
      "areaServed": "EG",
      "telephone": "+201500125133",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "EG",
        "addressRegion": "Qalyubia",
        "addressLocality": "Shubra El-Kheima",
        "streetAddress": "شبرا الخيمة، القليوبية",
        "postalCode": "13766"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+201500125133",
        "contactType": "customer service",
        "availableLanguage": ["Arabic", "English"],
        "areaServed": "EG"
      },
      "sameAs": [
        "https://instagram.com/velixstore.eg",
        "https://facebook.com/velixstore.eg",
        "https://tiktok.com/@velixstore.eg",
        "https://wa.me/201500125133"
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }}
      />
      
      <Hero />
      <BrandFeatures />
      
      {products.length > 0 && (
        <FeaturedProducts products={products} />
      )}
      
      <BrandStory />
      <Newsletter />
      
      {/* نص مخفي للسيو */}
      <div className="sr-only" aria-hidden="true">
        <h2>VELIX - براند ملابس مصري رائد</h2>
        <p>
          VELIX هو براند ملابس مصري متخصص في تقديم تشكيلة رائعة من التيشرتات والهوديز والشروال 
          بجودة عالمية وتصميم عصري. نتميز بتقديم منتجاتنا بخامات عالية الجودة مع الاهتمام بأدق التفاصيل.
        </p>
        <p>
          نوفر خدمة الدفع عند الاستلام لجميع محافظات مصر، مع توصيل سريع خلال 2-5 أيام عمل. 
          اكتشف مجموعتنا الجديدة واستمتع بتجربة تسوق فريدة مع VELIX.
        </p>
        <ul>
          <li>تشكيلة متنوعة من التيشرتات بمختلف المقاسات والألوان</li>
          <li>هوديز عالية الجودة بتصميمات عصرية</li>
          <li>شروال مريح وأنيق مناسب للستريت وير المصري</li>
          <li>خامات قطن فاخرة مريحة في الارتداء</li>
          <li>أسعار مناسبة وجودة عالمية</li>
        </ul>
        <p>عدد المنتجات: {products.length} منتج</p>
        <p>الأقسام: تيشرتات، هوديز، شروال</p>
        <p>سياسة التوصيل: توصيل لجميع محافظات مصر خلال 2-5 أيام</p>
        <p>طرق الدفع: الدفع عند الاستلام</p>
      </div>
    </>
  );
}