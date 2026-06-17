import Hero from '@/components/Hero';
import BrandFeatures from '@/components/BrandFeatures';
import FeaturedProducts from '@/components/FeaturedProducts';
import BrandStory from '@/components/BrandStory';
import Newsletter from '@/components/Newsletter';
import { getProducts } from '@/lib/products';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "VELIX | لبس ولاد البلد - ستايل مصري عصري",
  description: "VELIX | لبس ولاد البلد. تيشرتات، هوديز، وشروال قطن مصري أصلي للشباب. جودة عالية، أسعار مناسبة، وشحن لكل مصر. اطلب وادفع عند الاستلام.",
  keywords: [
    "براند ملابس مصري",
    "VELIX",
    "تيشرت رجالي قطن مصري اصلي",
    "هودي شتوي تقيل مصر",
    "شروال رياضي رجالى",
    "لبس ولاد البلد",
    "ستريت وير مصر",
    "صناعة مصرية 100%",
    "اشترى ملابس اون لاين مصر",
    "تيشرتات رجالي قطن",
    "براند ملابس مصري شبابي",
  ],
  openGraph: {
    title: "VELIX | لبس ولاد البلد",
    description: "تيشرتات، هوديز، وشروال قطن مصري أصلي. جودة عالية وأسعار مناسبة. اطلب وادفع عند الاستلام.",
    url: "https://velix-eg.store",
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
    title: "VELIX | لبس ولاد البلد",
    description: "تيشرتات، هوديز، وشروال قطن مصري أصلي للشباب.",
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
    "name": "VELIX | لبس ولاد البلد",
    "description": "VELIX | لبس ولاد البلد. تيشرتات، هوديز، وشروال قطن مصري أصلي للشباب المصري",
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
        <h2>VELIX | لبس ولاد البلد</h2>
        <p>
          VELIX | لبس ولاد البلد. بنقدم تيشرتات، هوديز، وشروال قطن مصري أصلي للشباب. 
          جودة عالية، أسعار مناسبة، وشحن لكل مصر. اطلب وادفع عند الاستلام.
        </p>
        <p>
          نوفر خدمة الدفع عند الاستلام لجميع محافظات مصر، مع توصيل سريع خلال 2-5 أيام عمل. 
          اكتشف مجموعتنا الجديدة واستمتع بتجربة تسوق مع VELIX.
        </p>
        <ul>
          <li>تشكيلة متنوعة من التيشرتات القطن المصري</li>
          <li>هوديز بتصميمات عصرية تناسب الشباب</li>
          <li>شروال مريح للستريت وير المصري</li>
          <li>قطن مصري أصلي مريح في الارتداء</li>
          <li>أسعار مناسبة للجميع</li>
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