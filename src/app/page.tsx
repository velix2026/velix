import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import BrandFeatures from "@/components/BrandFeatures";
import { getProducts } from "@/lib/products";

export default async function Home() {
  const allProducts = await getProducts();
  
  console.log('=== Home Page ===');
  console.log('Total products:', allProducts.length);
  console.log('Products:', allProducts.map(p => ({ id: p.id, name: p.name, createdAt: p.createdAt })));

  return (
    <>
      <Hero />
      <FeaturedProducts products={allProducts} />
      <BrandFeatures />
    </>
  );
}