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
  // خصائص إضافية اختيارية
  rating?: number;
  oldPrice?: number;
  stock?: number;
  isNew?: boolean;
  discount?: number;
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
    
    // إضافة قيم افتراضية للخصائص الإضافية
    return products.map((p: Product) => ({
      ...p,
      rating: p.rating || Math.floor(Math.random() * (50 - 35 + 1) + 35) / 10, // 3.5 - 5.0
      stock: p.stock !== undefined ? p.stock : Math.floor(Math.random() * 20) + 1,
      isNew: p.isNew !== undefined ? p.isNew : Math.random() > 0.8,
      discount: p.discount || 0,
      oldPrice: p.oldPrice || (Math.random() > 0.7 ? p.price + Math.floor(Math.random() * 200) + 50 : undefined)
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}