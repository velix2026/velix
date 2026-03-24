import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import Redis from 'ioredis';

// استخدام Redis مباشرة مع الرابط من .env.local
const redis = new Redis(process.env.REDIS_URL!);

const PRODUCTS_KEY = 'products';

// قراءة المنتجات من Redis
async function getProducts() {
  try {
    const data = await redis.get(PRODUCTS_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading from Redis:', error);
    return [];
  }
}

// حفظ المنتجات في Redis
async function saveProducts(products: any[]) {
  try {
    await redis.set(PRODUCTS_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error writing to Redis:', error);
    throw error;
  }
}

// رفع الصورة إلى Vercel Blob
async function uploadImageToBlob(file: File, fileName: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const { url } = await put(fileName, buffer, {
    access: 'public',
  });
  return url;
}

// POST: إضافة منتج جديد
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const mainImage = formData.get('mainImage') as File;
    const subImages = formData.getAll('subImages') as File[];

    if (!name || !price || !mainImage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const timestamp = Date.now();
    const mainImageUrl = await uploadImageToBlob(mainImage, `${timestamp}_main.jpg`);

    const subImagesUrls: string[] = [];
    for (let i = 0; i < subImages.length; i++) {
      const url = await uploadImageToBlob(subImages[i], `${timestamp}_sub${i + 1}.jpg`);
      subImagesUrls.push(url);
    }

    const products = await getProducts();
    const newId = products.length > 0 ? Math.max(...products.map((p: any) => p.id)) + 1 : 1;
    
    const newProduct = {
      id: newId,
      name,
      price,
      category,
      description,
      mainImage: mainImageUrl,
      subImages: subImagesUrls,
      inStock: true,
      createdAt: new Date().toISOString(),
    };
    
    products.push(newProduct);
    await saveProducts(products);
    
    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}

// GET: جلب جميع المنتجات
export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}