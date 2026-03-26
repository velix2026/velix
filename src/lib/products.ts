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
  rating?: number;
  oldPrice?: number;
  stock?: number;
  isNew?: boolean;
  discount?: number;
  sizes?: string[];
  colors?: string[];
  salesCount?: number;  
}

export async function getProducts(): Promise<Product[]> {
  try {
    // استخدام الرابط النسبي في المتصفح، والمطلق في الخادم
    const isServer = typeof window === 'undefined';
    let url: string;
    
    if (isServer) {
      // في الخادم (Server Component)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://velixstore.vercel.app';
      url = `${baseUrl}/api/products`;
    } else {
      // في المتصفح (Client Component)
      url = `/api/products`;
    }
    
    const res = await fetch(url, {
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