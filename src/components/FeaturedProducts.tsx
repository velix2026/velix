import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { Product } from "@/lib/products";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const featuredProducts = products.slice(0, 3);

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-4">
        {/* عنوان القسم */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            أحدث المنتجات
          </h2>
          <div className="w-16 h-0.5 bg-gray-300 mx-auto mt-4 mb-6"></div>
          <p className="text-gray-500 text-base max-w-2xl mx-auto">
            اكتشف أحدث تصاميمنا. جودة عالية وتفاصيل دقيقة تناسب ستايلك اليومي.
          </p>
        </div>
        
        {/* المنتجات - 3 على الكمبيوتر، 2 على الموبايل */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-center col-span-2 lg:col-span-3 text-gray-500">
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