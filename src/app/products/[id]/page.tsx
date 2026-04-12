// app/products/[id]/page.tsx
import Link from 'next/link';
import { getProducts } from "@/lib/products";
import ProductClient from "./ProductClient";
import { generateProductMetadata } from "./metadata";

// ✅ تصدير الـ metadata ديناميكياً للصفحة
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  // ✅ هنا بنبعت الـ params كـ Promise زي ما هي، مش بنفكها
  return generateProductMetadata({ params });
}

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  // ✅ انتظر الـ params قبل استخدامها
  const { id } = await params;
  const allProducts = await getProducts();
  const product = allProducts.find(p => p.id === parseInt(id));
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-black text-black mb-2">المنتج غير موجود</h1>
          <p className="text-black/60 font-bold mb-6">عذراً، المنتج الذي تبحث عنه غير متوفر</p>
          <Link href="/products" className="inline-flex items-center gap-2 bg-linear-to-r from-sky-400 via-blue-500 to-indigo-500 text-white font-bold px-6 py-3 rounded-full hover:scale-105 transition-all duration-300 shadow-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            تصفح المنتجات
          </Link>
        </div>
      </div>
    );
  }
  
  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 8);
  
  return <ProductClient product={product} relatedProducts={relatedProducts} />;
}