import Hero from '@/components/Hero';
import BrandFeatures from '@/components/BrandFeatures';
import FeaturedProducts from '@/components/FeaturedProducts';
import BrandStory from '@/components/BrandStory';
import Newsletter from '@/components/Newsletter';
import { getProducts } from '@/lib/products';
import Link from 'next/link';

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
        url: "/images/og-image.png",
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
    images: ["/images/og-image.png"],
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
      
      {/* رابط للمدونة - إضافة قسم صغير */}
      <div className="bg-linear-to-r from-rose-gold/5 to-copper/5 py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-black text-black mb-3">📚 اكتشف مدونتنا</h3>
          <p className="text-black/60 font-bold mb-4 max-w-md mx-auto">
            نصائح وإرشادات للموضة المصرية. ازاي تختار هدومك، ازاي تحافظ عليها، ودليل المقاسات.
          </p>
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 border-2 border-rose-gold/30 text-rose-gold font-bold px-6 py-2.5 rounded-full hover:bg-rose-gold hover:text-white transition-all duration-300"
          >
            زور المدونة
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
      
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
        
        {/* ✅ روابط داخلية للمدونة والـ FAQ في النص المخفي */}
        <p>اقرأ مقالاتنا في مدونة VELIX: <a href="https://velix-eg.store/blog">مدونة الموضة المصرية</a></p>
        <p>للأسئلة الشائعة: <a href="https://velix-eg.store/faq">الأسئلة الشائعة</a></p>
      </div>
    </>
  );
}