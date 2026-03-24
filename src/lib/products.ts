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
    // في بيئة الإنتاج، نستخدم الرابط المطلق
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://velixstore.vercel.app';
    const res = await fetch(`${baseUrl}/api/products`, {
      cache: 'no-store', // عدم التخزين المؤقت لجلب أحدث البيانات
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