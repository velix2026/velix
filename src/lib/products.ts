// src/lib/products.ts

export interface Product {
  id: string; // سنستخدم string لأن القادم من API قد يكون نصًا
  name: string;
  nameEn: string;
  price: string; // السعر قد يكون نصًا من الـ API، سنتعامل معه
  oldPrice?: string;
  image: string;
  category: string;
  description: string;
  inStock: string; // "TRUE" أو "FALSE"
  publishToFB: string;
  publishToIG: string;
  publishToTT: string;
}

// الرابط الخاص بـ Google Sheets عبر sheet.best
const SHEETS_API_URL = "https://api.sheetbest.com/sheets/36a4c1b1-1d0a-48ed-a597-5903634f77ba";

/**
 * جلب جميع المنتجات من Google Sheets
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(SHEETS_API_URL, {
      // تحديث البيانات كل 5 دقائق (300 ثانية) أثناء التصفح
      next: { revalidate: 300 },
      // إضافة Cache لتحسين الأداء
      cache: 'force-cache',
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status}`);
    }
    
    const data: Product[] = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching products from Google Sheets:", error);
    // في حالة الخطأ، نعيد مصفوفة فارغة بدلاً من تعطيل الموقع
    return [];
  }
}

/**
 * جلب منتج واحد بواسطة معرفه (id)
 */
export async function getProduct(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find(product => product.id === id);
}