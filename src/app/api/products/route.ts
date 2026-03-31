// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);
const PRODUCTS_KEY = 'products';

async function getProducts() {
  try {
    const data = await redis.get(PRODUCTS_KEY);
    if (!data) return [];
    let products = JSON.parse(data);
    
    // ✅ إضافة createdAt للمنتجات القديمة اللي مفيهاش
    products = products.map((product: any, index: number) => {
      if (!product.createdAt) {
        const daysAgo = Math.min(30, (product.id || index + 1) % 31);
        const fakeDate = new Date();
        fakeDate.setDate(fakeDate.getDate() - daysAgo);
        return {
          ...product,
          createdAt: product.createdAt || fakeDate.toISOString(),
          salesCount: product.salesCount || 0,
          rating: product.rating || 0,
        };
      }
      return product;
    });
    
    return products;
  } catch (error) {
    console.error('Error reading from Redis:', error);
    return [];
  }
}

async function saveProducts(products: any[]) {
  try {
    await redis.set(PRODUCTS_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error writing to Redis:', error);
    throw error;
  }
}

async function renumberProducts(products: any[]) {
  return products.map((product, index) => ({
    ...product,
    id: index + 1,
  }));
}

async function uploadImageToBlob(file: File, fileName: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const { url } = await put(fileName, buffer, {
    access: 'public',
  });
  return url;
}

// ==================== POST: إضافة منتج جديد ====================
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const mainImage = formData.get('mainImage') as File;
    const subImages = formData.getAll('subImages') as File[];
    
    const stock = parseInt(formData.get('stock') as string);
    const oldPrice = formData.get('oldPrice') ? parseFloat(formData.get('oldPrice') as string) : undefined;
    const discount = formData.get('discount') ? parseInt(formData.get('discount') as string) : 0;
    const isNew = formData.get('isNew') === 'true';
    const sizes = JSON.parse(formData.get('sizes') as string || '[]');
    const colors = JSON.parse(formData.get('colors') as string || '[]');
    const createdAt = formData.get('createdAt') as string || new Date().toISOString();
    const quantityDiscount = JSON.parse(formData.get('quantityDiscount') as string || '{"enabled":false,"minQuantity":2,"discountPerItem":0}');

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

    let products = await getProducts();
    
    const newProduct = {
      id: 0,
      name,
      price,
      oldPrice,
      discount,
      category,
      description,
      mainImage: mainImageUrl,
      subImages: subImagesUrls,
      inStock: stock > 0,
      stock,
      sizes,
      colors,
      isNew,
      salesCount: 0,
      rating: 0,
      createdAt,
      quantityDiscount, // ✅ إضافة خصم الكمية
    };
    
    products.push(newProduct);
    
    const renumbered = await renumberProducts(products);
    await saveProducts(renumbered);
    
    return NextResponse.json({ success: true, product: renumbered[renumbered.length - 1] });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}

// ==================== GET: جلب جميع المنتجات ====================
export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}