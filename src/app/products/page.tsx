// app/products/page.tsx
import { getProducts } from "@/lib/products";
import ProductsClient from "./ProductsClient";
import { productsMetadata } from "./metadata";

// ✅ تصدير الـ metadata للصفحة (شغال لأن الملف مش 'use client')
export const metadata = productsMetadata;

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await getProducts();
  
  return <ProductsClient initialProducts={products} />;
}