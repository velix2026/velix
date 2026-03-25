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
  // خصائص إضافية (ستأتي من قاعدة البيانات)
  rating?: number;
  oldPrice?: number;
  stock?: number;
  isNew?: boolean;
  discount?: number;
  sizes?: string[];
  colors?: string[];
}

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`/api/products`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      console.error('API response not ok:', res.status);
      return [];
    }
    
    const products = await res.json();
    
    // لا نضيف أي قيم افتراضية - كل شيء من قاعدة البيانات الحقيقية
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}