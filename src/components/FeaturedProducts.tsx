import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { Product } from "@/lib/products";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  // الأكثر مبيعاً: حسب salesCount (الأعلى أولاً) و salesCount > 0
  const bestSellers = [...products]
    .filter(p => (p.salesCount || 0) > 0)  // ← بس اللي عليه مبيعات
    .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
    .slice(0, 4);
  
  // أحدث المنتجات: حسب id (الأحدث أولاً)
  const latestProducts = [...products]
    .sort((a, b) => b.id - a.id)
    .slice(0, 4);

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-4">
        
        {/* قسم الأكثر مبيعاً - يظهر بس لو في منتجات اتباعت */}
        {bestSellers.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
                <span className="text-2xl">⭐</span>
                الأكثر مبيعاً
              </h2>
              <div className="w-16 h-0.5 bg-gray-300 mx-auto mt-3 mb-4"></div>
              <p className="text-gray-500 text-sm">المنتجات الأكثر طلباً من عملائنا</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* قسم أحدث المنتجات - يظهر دائماً لو في منتجات */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            أحدث المنتجات
          </h2>
          <div className="w-16 h-0.5 bg-gray-300 mx-auto mt-4 mb-6"></div>
          <p className="text-gray-500 text-base max-w-2xl mx-auto">
            اكتشف أحدث تصاميمنا. جودة عالية وتفاصيل دقيقة تناسب ستايلك اليومي.
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {latestProducts.length > 0 ? (
            latestProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-center col-span-2 sm:col-span-3 lg:col-span-4 text-gray-500">
              لا توجد منتجات متاحة حاليًا
            </p>
          )}
        </div>
        
        {/* زر عرض الكل */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-8 py-3 rounded-full font-medium hover:bg-black hover:text-white hover:border-black transition-all duration-300 group"
          >
            عرض جميع المنتجات
            <svg 
              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}