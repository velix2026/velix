// app/api/products/[id]/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);
const PRODUCTS_KEY = 'products';

async function getProducts() {
  try {
    const data = await redis.get(PRODUCTS_KEY);
    if (!data) return [];
    let products = JSON.parse(data);
    
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

async function uploadImageToBlob(file: File, fileName: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const { url } = await put(fileName, buffer, {
    access: 'public',
  });
  return url;
}

// ==================== GET: منتج واحد ====================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const products = await getProducts();
    const product = products.find((p: any) => p.id === parseInt(id));
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// ==================== PATCH: تحديث منتج ====================
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const stock = parseInt(formData.get('stock') as string);
    const oldPrice = formData.get('oldPrice') ? parseFloat(formData.get('oldPrice') as string) : undefined;
    const discount = formData.get('discount') ? parseInt(formData.get('discount') as string) : 0;
    const isNew = formData.get('isNew') === 'true';
    const sizes = JSON.parse(formData.get('sizes') as string || '[]');
    const colors = JSON.parse(formData.get('colors') as string || '[]');
    const removedImages = JSON.parse(formData.get('removedImages') as string || '[]');
    
    let products = await getProducts();
    const index = products.findIndex((p: any) => p.id === parseInt(id));
    
    if (index === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // حذف الصور المرفوعة من Blob
    for (const imageUrl of removedImages) {
      try {
        const url = new URL(imageUrl);
        const pathname = url.pathname;
        const blobKey = pathname.split('/').pop();
        if (blobKey) {
          await del(blobKey);
        }
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
    
    // رفع الصورة الرئيسية الجديدة
    let mainImageUrl = products[index].mainImage;
    const newMainImage = formData.get('newMainImage') as File;
    if (newMainImage && newMainImage.size > 0) {
      const timestamp = Date.now();
      mainImageUrl = await uploadImageToBlob(newMainImage, `${timestamp}_main.jpg`);
    }
    
    // رفع الصور الإضافية الجديدة
    const newSubImagesFiles = formData.getAll('newSubImages') as File[];
    const newSubImagesUrls: string[] = [];
    for (let i = 0; i < newSubImagesFiles.length; i++) {
      const timestamp = Date.now();
      const url = await uploadImageToBlob(newSubImagesFiles[i], `${timestamp}_sub${i + 1}.jpg`);
      newSubImagesUrls.push(url);
    }
    
    // تحديث المنتج
    const updatedProduct = {
      ...products[index],
      name: name || products[index].name,
      price: price || products[index].price,
      category: category || products[index].category,
      description: description || products[index].description,
      stock: stock !== undefined ? stock : products[index].stock,
      oldPrice: oldPrice !== undefined ? oldPrice : products[index].oldPrice,
      discount: discount !== undefined ? discount : products[index].discount,
      isNew: isNew !== undefined ? isNew : products[index].isNew,
      sizes: sizes.length ? sizes : products[index].sizes,
      colors: colors.length ? colors : products[index].colors,
      mainImage: mainImageUrl,
      subImages: [...products[index].subImages.filter((img: string) => !removedImages.includes(img)), ...newSubImagesUrls],
    };
    
    products[index] = updatedProduct;
    await saveProducts(products);
    
    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// ==================== DELETE: حذف منتج ====================
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let products = await getProducts();
    const productToDelete = products.find((p: any) => p.id === parseInt(id));
    
    if (!productToDelete) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // حذف الصور من Blob
    const allImages = [productToDelete.mainImage, ...productToDelete.subImages];
    for (const imageUrl of allImages) {
      try {
        const url = new URL(imageUrl);
        const pathname = url.pathname;
        const blobKey = pathname.split('/').pop();
        if (blobKey) {
          await del(blobKey);
        }
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
    
    const newProducts = products.filter((p: any) => p.id !== parseInt(id));
    await saveProducts(newProducts);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}