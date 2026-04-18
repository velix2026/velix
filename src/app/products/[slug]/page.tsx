// app/products/[slug]/page.tsx
import Link from 'next/link';
import { getProducts, getTotalStock } from "@/lib/products";
import ProductClient from "./ProductClient";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug); // ✅ فك التشفير
  console.log('🔍 [generateMetadata] Original slug:', slug);
  console.log('🔍 [generateMetadata] Decoded slug:', decodedSlug);
  
  const products = await getProducts();
  const product = products.find(p => p.slug === decodedSlug);
  
  if (!product) {
    console.log('❌ [generateMetadata] Product NOT found for slug:', decodedSlug);
    return {
      title: "المنتج غير موجود | VELIX",
      description: "عذراً، المنتج اللي بتدور عليه مش موجود عندنا",
    };
  }
  
  console.log('✅ [generateMetadata] Product found:', product.name);
  
  return {
    title: `${product.name} | VELIX`,
    description: product.description?.substring(0, 160) || "اكتشف المنتج ده من VELIX. جودة عالية وتصميم عصري. تسوق الآن وادفع عند الاستلام.",
    keywords: [product.name, product.category, "VELIX", "ملابس مصرية"],
    openGraph: {
      title: `${product.name} | VELIX`,
      description: product.description?.substring(0, 160),
      url: `https://velix-eg.store/products/${product.slug}`,
      siteName: "VELIX",
      locale: "ar_EG",
      type: "website",
      images: [{ url: product.mainImage, width: 1200, height: 630, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | VELIX`,
      description: product.description?.substring(0, 160),
      images: [product.mainImage],
    },
    alternates: { canonical: `https://velix-eg.store/products/${product.slug}` },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug); // ✅ فك التشفير
  console.log('🔍 [ProductPage] 1. Original slug:', slug);
  console.log('🔍 [ProductPage] 1b. Decoded slug:', decodedSlug);
  
  const allProducts = await getProducts();
  console.log('📦 [ProductPage] 2. Total products:', allProducts.length);
  console.log('📦 [ProductPage] 3. All slugs in DB:', allProducts.map(p => p.slug));
  
  const product = allProducts.find(p => p.slug === decodedSlug);
  console.log('🎯 [ProductPage] 4. Looking for slug exactly:', `"${decodedSlug}"`);
  console.log('✅ [ProductPage] 5. Found product:', product?.name || 'NOT FOUND');
  
  if (!product) {
    console.log('❌ [ProductPage] 6. Product NOT found - showing 404 page');
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-white via-[#FCFCFC] to-[#F5F3F0]">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-black text-black mb-2">المنتج مش موجود</h1>
          <p className="text-black/60 font-bold mb-6">عذراً، المنتج اللي بتدور عليه مش موجود عندنا</p>
          <Link href="/products" className="inline-flex items-center gap-2 bg-linear-to-r from-rose-gold-light via-rose-gold to-copper text-white font-bold px-6 py-3 rounded-full hover:scale-105 transition-all duration-300 shadow-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            تصفح المنتجات
          </Link>
        </div>
      </div>
    );
  }
  
  console.log('✅ [ProductPage] 7. Product found, loading related products...');
  
  const relatedProducts = allProducts.filter(p => p.category === product.category && p.slug !== decodedSlug).slice(0, 8);
  console.log('✅ [ProductPage] 8. Related products count:', relatedProducts.length);
  
  return <ProductClient product={product} relatedProducts={relatedProducts} />;
}