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
  quantity?: number; // ✅ أضف السطر ده - مهم للـ SideDrawer
  quantityDiscount?: {
    enabled: boolean;
    tiers: Array<{
      minQuantity: number;
      discountPerItem: number;
    }>;
  };
  stockItems?: Array<{
    colorCode: string;
    size: string;
    quantity: number;
  }>;
}

export async function getProducts(): Promise<Product[]> {
  try {
    const isServer = typeof window === 'undefined';
    let url: string;
    
    if (isServer) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://velix-eg.store';
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
    
    const productsWithStock = products.map((p: any) => ({
      ...p,
      stockItems: p.stockItems || [],
      stock: p.stock || 0,
      quantity: p.quantity || 0, // ✅ أضف السطر ده كمان
    }));
    
    return Array.isArray(productsWithStock) ? productsWithStock : [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export function getTotalStock(product: Product): number {
  if (product.stockItems && product.stockItems.length > 0) {
    return product.stockItems.reduce((sum, item) => sum + item.quantity, 0);
  }
  return product.stock || 0;
}

export function getAvailableStock(product: Product, size?: string, color?: string): number {
  if (!size || !color) return getTotalStock(product);
  
  if (product.stockItems && product.stockItems.length > 0) {
    const stockItem = product.stockItems.find(
      item => item.size === size && item.colorCode === color
    );
    return stockItem?.quantity || 0;
  }
  
  return product.stock || 0;
}

export function isProductInStock(product: Product, size?: string, color?: string): boolean {
  return getAvailableStock(product, size, color) > 0;
}

export function getAvailableColorsWithStock(product: Product): Array<{ colorCode: string; totalStock: number; sizes: Array<{ size: string; quantity: number }> }> {
  if (!product.stockItems || product.stockItems.length === 0) {
    return (product.colors || []).map(colorCode => ({
      colorCode,
      totalStock: product.stock || 0,
      sizes: (product.sizes || []).map(size => ({ size, quantity: product.stock || 0 }))
    }));
  }
  
  const colorMap = new Map<string, Map<string, number>>();
  
  product.stockItems.forEach(item => {
    if (!colorMap.has(item.colorCode)) {
      colorMap.set(item.colorCode, new Map());
    }
    const sizeMap = colorMap.get(item.colorCode)!;
    sizeMap.set(item.size, (sizeMap.get(item.size) || 0) + item.quantity);
  });
  
  return Array.from(colorMap.entries()).map(([colorCode, sizeMap]) => ({
    colorCode,
    totalStock: Array.from(sizeMap.values()).reduce((sum, q) => sum + q, 0),
    sizes: Array.from(sizeMap.entries()).map(([size, quantity]) => ({ size, quantity }))
  }));
}

export function getAvailableSizesWithStock(product: Product): Array<{ size: string; totalStock: number; colors: Array<{ colorCode: string; quantity: number }> }> {
  if (!product.stockItems || product.stockItems.length === 0) {
    return (product.sizes || []).map(size => ({
      size,
      totalStock: product.stock || 0,
      colors: (product.colors || []).map(colorCode => ({ colorCode, quantity: product.stock || 0 }))
    }));
  }
  
  const sizeMap = new Map<string, Map<string, number>>();
  
  product.stockItems.forEach(item => {
    if (!sizeMap.has(item.size)) {
      sizeMap.set(item.size, new Map());
    }
    const colorMap = sizeMap.get(item.size)!;
    colorMap.set(item.colorCode, (colorMap.get(item.colorCode) || 0) + item.quantity);
  });
  
  return Array.from(sizeMap.entries()).map(([size, colorMap]) => ({
    size,
    totalStock: Array.from(colorMap.values()).reduce((sum, q) => sum + q, 0),
    colors: Array.from(colorMap.entries()).map(([colorCode, quantity]) => ({ colorCode, quantity }))
  }));
}