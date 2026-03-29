// app/page.tsx
import Hero from '@/components/Hero';
import BrandFeatures from '@/components/BrandFeatures';
import FeaturedProducts from '@/components/FeaturedProducts';
import Newsletter from '@/components/Newsletter';
import { getProducts } from '@/lib/products';

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <Hero />
      <BrandFeatures />
      <FeaturedProducts products={products} />
      <Newsletter />
    </>
  );
}