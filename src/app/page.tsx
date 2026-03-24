import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";
import Link from "next/link";

export default async function Home() {
  const allProducts = await getProducts();
  const featuredProducts = allProducts.slice(0, 3);

  return (
    <>
      <Hero />
      
      {/* قسم المنتجات المميزة */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            أحدث قطع VELIX
          </h2>
          <p className="text-gray-500 text-base max-w-2xl mx-auto">
            اكتشف مجموعتنا الجديدة. تفاصيل دقيقة وجودة عالية هتفرق في ستايلك.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-center col-span-3 text-gray-500">
              لا توجد منتجات متاحة حاليًا
            </p>
          )}
        </div>
        
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-8 py-3 rounded-full font-medium hover:bg-black hover:text-white hover:border-black transition-all duration-300"
          >
            شاهد جميع المنتجات
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* قسم مميزات البراند */}
      <section className="bg-gray-50 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
            <div className="p-6 rounded-2xl hover:bg-white transition-all duration-300 group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">👕</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">جودة في التفاصيل</h3>
              <p className="text-gray-500 text-sm">كل قطعة بتصنع بدقة عالية عشان تدوم معاك</p>
            </div>
            <div className="p-6 rounded-2xl hover:bg-white transition-all duration-300 group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🇪🇬</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">صناعة مصرية</h3>
              <p className="text-gray-500 text-sm">براند مصري 100% بيفتخر بجذوره</p>
            </div>
            <div className="p-6 rounded-2xl hover:bg-white transition-all duration-300 group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📦</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">دفع عند الاستلام</h3>
              <p className="text-gray-500 text-sm">اطلب دلوقتي واستلم منتجك وادفع بعد ما ترتاح</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}