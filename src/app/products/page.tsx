import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
        جميع منتجات VELIX
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        اكتشف مجموعتنا الكاملة. تفاصيل دقيقة وجودة عالية.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-500">
            لا توجد منتجات متاحة حاليًا
          </p>
        )}
      </div>
    </section>
  );
}