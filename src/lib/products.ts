export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  mainImage: string;
  subImages: string[];
  inStock: boolean;
  createdAt: string;
}

export async function getProducts(): Promise<Product[]> {
  try {
    // استخدام الرابط النسبي (يعمل في كل البيئات)
    const res = await fetch(`/api/products`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      console.error('API response not ok:', res.status);
      return [];
    }
    
    const products = await res.json();
    return Array.isArray(products) ? products : [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}