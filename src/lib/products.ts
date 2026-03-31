// lib/products.ts
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
  quantityDiscount?: {
    enabled: boolean;
    tiers: Array<{
      minQuantity: number;
      discountPerItem: number;
    }>;
  };
}

export async function getProducts(): Promise<Product[]> {
  try {
    const isServer = typeof window === 'undefined';
    let url: string;
    
    if (isServer) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://velixstore.vercel.app';
      url = `${baseUrl}/api/products`;
    } else {
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