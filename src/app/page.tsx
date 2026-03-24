import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";

export default async function Home() {
  const allProducts = await getProducts();
  const featuredProducts = allProducts.slice(0, 3);

  return (
    <>
      <Hero />
      <section className="container mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
          أحدث قطع VELIX
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          اكتشف مجموعتنا الجديدة. تفاصيل دقيقة وجودة عالية هتفرق في ستايلك.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-center col-span-3 text-gray-500">لا توجد منتجات متاحة حاليًا</p>
          )}
        </div>
        
        <div className="text-center mt-12">
          <a
            href="/products"
            className="inline-block bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition"
          >
            شاهد جميع المنتجات
          </a>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl mb-3">👕</div>
              <h3 className="text-xl font-bold mb-2">جودة في التفاصيل</h3>
              <p className="text-gray-600">كل قطعة بتصنع بدقة عالية عشان تدوم معاك</p>
            </div>
            <div>
              <div className="text-4xl mb-3">🇪🇬</div>
              <h3 className="text-xl font-bold mb-2">صناعة مصرية</h3>
              <p className="text-gray-600">براند مصري 100% بيفتخر بجذوره</p>
            </div>
            <div>
              <div className="text-4xl mb-3">📦</div>
              <h3 className="text-xl font-bold mb-2">دفع عند الاستلام</h3>
              <p className="text-gray-600">اطلب دلوقتي واستلم منتجك وادفع بعد ما ترتاح</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}