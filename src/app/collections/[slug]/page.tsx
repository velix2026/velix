// app/collections/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getProducts } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { Metadata } from 'next';

// ✅ الأقسام - English slugs عشان Vercel (Arabic characters مش بتشتغل في الـ URLs)
const categories = [
  { slug: 'tshirts', arabicSlug: 'تيشرتات', name: 'تيشرتات', icon: '👕', description: 'تشكيلة تيشرتات قطن مصري أصلي للشباب' },
  { slug: 'hoodies', arabicSlug: 'هوديز', name: 'هوديز', icon: '🧥', description: 'هوديز شتوية وصيفية بجودة عالية' },
  { slug: 'pants', arabicSlug: 'شروال', name: 'شروال', icon: '👖', description: 'شروال رياضي مريح للاستخدام اليومي' },
  { slug: 'jeans', arabicSlug: 'جينز', name: 'جينز', icon: '👖', description: 'جينز عصري يناسب كل الأذواق' },
  { slug: 'jackets', arabicSlug: 'جواكت', name: 'جواكت', icon: '🧥', description: 'جواكت شتوية أنيقة' },
  { slug: 'shoes', arabicSlug: 'شوزات', name: 'شوزات', icon: '👟', description: 'أحذية رياضية عالية الجودة' },
  { slug: 'accessories', arabicSlug: 'اكسسوارات', name: '✨ أكسسوارات VELIX', icon: '💎', description: 'أكسسوارات تكمل إطلالتك' },
];

// ✅ توليد الـ metadata الديناميكي لكل قسم
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find(c => c.slug === slug);
  
  if (!category) {
    return { title: 'القسم غير موجود | VELIX' };
  }
  
  return {
    title: `${category.name} | VELIX`,
    description: category.description,
    keywords: [`${category.name}`, 'ملابس مصرية', 'VELIX', 'تسوق أونلاين', 'لبس ولاد البلد'],
    alternates: {
      canonical: `https://velix-eg.store/collections/${category.slug}`,
    },
    openGraph: {
      title: `${category.name} | VELIX`,
      description: category.description,
      url: `https://velix-eg.store/collections/${category.slug}`,
      siteName: "VELIX",
      locale: "ar_EG",
      type: "website",
      images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: `${category.name} - VELIX` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} | VELIX`,
      description: category.description,
      images: ["/images/og-image.png"],
    },
  };
}

// ✅ توليد الـ static params عشان الـ build
export async function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find(c => c.slug === slug);
  
  if (!category) {
    notFound();
  }
  
  const allProducts = await getProducts();
  const products = allProducts.filter(p => p.category === category.arabicSlug);
  
  // ✅ عدد المنتجات في القسم
  const productCount = products.length;
  
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${category.name} | VELIX`,
    "description": category.description,
    "url": `https://velix-eg.store/collections/${category.slug}`,
    "mainEntity": {
      "@type": "ItemList",
      "name": category.name,
      "numberOfItems": productCount,
      "itemListElement": products.slice(0, 10).map((p, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "url": `https://velix-eg.store/products/${p.slug}`,
      })),
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://velix-eg.store/" },
        { "@type": "ListItem", "position": 2, "name": "المنتجات", "item": "https://velix-eg.store/products" },
        { "@type": "ListItem", "position": 3, "name": category.name, "item": `https://velix-eg.store/collections/${category.slug}` },
      ],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      
      <div className="bg-linear-to-b from-white via-[#FCFCFC] to-[#F5F3F0] min-h-screen pt-28 pb-16">
        <div className="container mx-auto px-4">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6 flex-wrap">
            <Link href="/" className="text-black/40 hover:text-rose-gold">الرئيسية</Link>
            <span className="text-black/30">/</span>
            <Link href="/products" className="text-black/40 hover:text-rose-gold">المنتجات</Link>
            <span className="text-black/30">/</span>
            <span className="text-rose-gold font-bold">{category.name}</span>
          </div>
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="text-5xl mb-4">{category.icon}</div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-4">
              {category.name}
            </h1>
            <div className="w-20 h-1 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper rounded-full mx-auto mb-6" />
            <p className="text-black/60 font-bold text-base max-w-2xl mx-auto">
              {category.description}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-rose-gold/10 rounded-full px-4 py-1.5">
              <span className="text-rose-gold font-black">{productCount}</span>
              <span className="text-black/40 text-sm">منتج</span>
            </div>
          </div>
        
        {/* No Products */}
        {productCount === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-rose-gold/20">
            <div className="text-6xl mb-4">🛍️</div>
            <h2 className="text-xl font-black text-black mb-2">قريباً</h2>
            <p className="text-black/60">تشكيلة {category.name} هتنزل قريباً، تابعنا!</p>
            <Link href="/products" className="inline-block mt-4 text-rose-gold font-bold hover:underline">
              تصفح كل المنتجات →
            </Link>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
        
        {/* SEO Text */}
        <div className="mt-12 text-center text-black/40 text-xs">
          <p>تسوق أحدث تشكيلة {category.name} من VELIX. جودة عالية وتصميم عصري.</p>
        </div>
      </div>
    </div>
    </>
  );
}