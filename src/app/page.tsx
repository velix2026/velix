import Hero from '@/components/Hero';
import BrandFeatures from '@/components/BrandFeatures';
import FeaturedProducts from '@/components/FeaturedProducts';
import Newsletter from '@/components/Newsletter';
import { getProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

// ✅ SEO للصفحة الرئيسية
export const metadata = {
  title: "VELIX | أقوى براند ملابس مصري - تسوق أحدث التيشرتات والهوديز",
  description: "اكتشف VELIX، أول براند ملابس مصري يجمع بين الجودة العالمية والتصميم العصري. تشكيلة رائعة من التيشرتات والهوديز والشروال. دفع عند الاستلام وتوصيل لجميع محافظات مصر.",
  keywords: [
    "براند ملابس مصري VELIX",
    "تيشرتات رجالي مصر",
    "هوديز مصر",
    "ملابس شباب مصر",
    "ستريت وير مصر",
  ],
  openGraph: {
    title: "VELIX | براند ملابس مصري - تسوق الآن",
    description: "تشكيلة رائعة من التيشرتات والهوديز. جودة عالمية وتصميم عصري. دفع عند الاستلام.",
    url: "https://velix-eg.store",
    siteName: "VELIX",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VELIX - براند ملابس مصري",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VELIX | براند ملابس مصري",
    description: "تسوق أحدث تشكيلة من التيشرتات والهوديز. جودة عالمية وتصميم عصري.",
    images: ["/images/og-image.jpg"],
  },
  alternates: {
    canonical: "https://velix-eg.store",
  },
};

export default async function Home() {
  const products = await getProducts();

  // ✅ جميع المنتجات
  const allProducts = products;
  
  // ✅ بيانات منظمة للصفحة الرئيسية (JSON-LD)
  const homePageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "VELIX - براند ملابس مصري",
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
        "https://instagram.com/velix.2026",
        "https://facebook.com/velix2026",
        "https://tiktok.com/@velix2026",
        "https://wa.me/201500125133"
      ]
    }
  };

  // ✅ إحصائيات الموقع
  const stats = {
    productsCount: products.length,
    categories: ["تيشرتات", "هوديز", "شروال"],
    deliveryInfo: "توصيل لجميع محافظات مصر خلال 2-5 أيام",
    paymentInfo: "الدفع عند الاستلام",
  };

  return (
    <>
      {/* ✅ JSON-LD للصفحة الرئيسية */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }}
      />
      
      {/* ✅ Hero Section */}
      <Hero />
      
      {/* ✅ Brand Features */}
      <BrandFeatures />
      
      {/* ✅ منتجاتنا المميزة - يظهر بس لو فيه منتجات */}
      {allProducts.length > 0 && (
        <section>
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <span className="text-xs text-black/40 tracking-[0.2em] uppercase font-bold mb-3 block">
                أحدث المجموعات
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-black">
                منتجاتنا المميزة
              </h1>
              <div className="w-16 h-0.5 bg-black/20 mx-auto mt-4 mb-6" />
              <p className="text-black/60 font-bold text-base max-w-2xl mx-auto">
                اكتشف تشكيلتنا المميزة من التيشرتات والهوديز بتصميم عصري وجودة عالية
              </p>
            </div>
          </div>
          <FeaturedProducts key={allProducts.length} products={allProducts} />
        </section>
      )}
      
      {/* ✅ Newsletter */}
      <Newsletter />
      
      {/* ✅ Hidden SEO Text */}
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
      </div>
      
      {/* ✅ إحصائيات سريعة للسيو */}
      <div className="sr-only" aria-hidden="true">
        <p>عدد المنتجات: {stats.productsCount} منتج</p>
        <p>الأقسام: {stats.categories.join('، ')}</p>
        <p>سياسة التوصيل: {stats.deliveryInfo}</p>
        <p>طرق الدفع: {stats.paymentInfo}</p>
      </div>
    </>
  );
}