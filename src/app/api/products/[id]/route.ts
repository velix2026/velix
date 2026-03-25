import { NextRequest, NextResponse } from 'next/server';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);
const PRODUCTS_KEY = 'products';

async function getProducts() {
  try {
    const data = await redis.get(PRODUCTS_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
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

// ==================== DELETE: حذف منتج ====================
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const products = await getProducts();
    const filtered = products.filter((p: any) => p.id !== parseInt(id));
    
    if (filtered.length === products.length) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    await saveProducts(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

// ==================== PATCH: تعديل منتج ====================
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const products = await getProducts();
    const index = products.findIndex((p: any) => p.id === parseInt(id));
    
    if (index === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // تحديث المنتج مع الحفاظ على البيانات الموجودة
    products[index] = { 
      ...products[index], 
      ...body,
      // إعادة حساب الخصم إذا تم تغيير السعر أو السعر القديم
      discount: body.oldPrice && body.oldPrice > body.price 
        ? Math.round(((body.oldPrice - body.price) / body.oldPrice) * 100)
        : (body.discount || 0),
      inStock: (body.stock !== undefined) ? body.stock > 0 : products[index].inStock,
    };
    
    await saveProducts(products);
    return NextResponse.json({ success: true, product: products[index] });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}