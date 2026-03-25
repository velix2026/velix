import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import BrandFeatures from "@/components/BrandFeatures";
import { getProducts } from "@/lib/products";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const allProducts = await getProducts();

  return (
    <>
      <Hero />
      <FeaturedProducts products={allProducts} />
      <BrandFeatures />
    </>
  );
}