import { NextRequest, NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';
import Redis from 'ioredis';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
    
    let stockItems: Array<{ colorCode: string; size: string; quantity: number }> = [];
    const stockItemsRaw = formData.get('stockItems') as string;
    if (stockItemsRaw && stockItemsRaw !== '') {
      try {
        stockItems = JSON.parse(stockItemsRaw);
        console.log('✅ Parsed stockItems:', stockItems.length);
      } catch (e) {
        console.error('Error parsing stockItems:', e);
      }
    }
    
    const stock = parseInt(formData.get('stock') as string);
    
    const oldPriceRaw = formData.get('oldPrice') as string;
    const oldPrice = oldPriceRaw && oldPriceRaw !== '' ? parseFloat(oldPriceRaw) : undefined;
    
    const discount = parseInt(formData.get('discount') as string || '0');
    const isNew = formData.get('isNew') === 'true';
    const sizes = JSON.parse(formData.get('sizes') as string || '[]');
    const colors = JSON.parse(formData.get('colors') as string || '[]');
    const removedImages = JSON.parse(formData.get('removedImages') as string || '[]');
    
    let quantityDiscount = { enabled: false, tiers: [] };
    const quantityDiscountRaw = formData.get('quantityDiscount') as string;
    if (quantityDiscountRaw && quantityDiscountRaw !== '') {
      try {
        const parsed = JSON.parse(quantityDiscountRaw);
        quantityDiscount = {
          enabled: parsed.enabled || false,
          tiers: parsed.tiers || []
        };
      } catch (e) {
        console.error('Error parsing quantityDiscount:', e);
      }
    }
    
    console.log('📦 Updating product:', {
      id,
      name,
      price,
      oldPrice,
      discount,
      stock,
      stockItemsCount: stockItems.length,
      sizes,
      colors,
      quantityDiscount,
      removedImages
    });
    
    let products = await getProducts();
    const index = products.findIndex((p: any) => p.id === parseInt(id));
    
    if (index === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // حذف الصور المرفوعة من Blob
    for (const imageUrl of removedImages) {
      try {
        if (imageUrl && imageUrl.includes('blob.vercel-storage.com')) {
          const url = new URL(imageUrl);
          const pathname = url.pathname;
          const blobKey = pathname.split('/').pop();
          if (blobKey) {
            await del(blobKey);
            console.log('✅ Deleted image:', blobKey);
          }
        }
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
    
    // رفع الصورة الرئيسية الجديدة
    let mainImageUrl = products[index].mainImage;
    const newMainImage = formData.get('newMainImage') as File;
    if (newMainImage && newMainImage.size > 0 && newMainImage.name !== 'undefined') {
      const timestamp = Date.now();
      mainImageUrl = await uploadImageToBlob(newMainImage, `${timestamp}_main.jpg`);
      console.log('✅ Uploaded main image:', mainImageUrl);
    }
    
    // رفع الصور الإضافية الجديدة
    const newSubImagesFiles = formData.getAll('newSubImages') as File[];
    const newSubImagesUrls: string[] = [];
    for (let i = 0; i < newSubImagesFiles.length; i++) {
      const file = newSubImagesFiles[i];
      if (file && file.size > 0 && file.name !== 'undefined') {
        const timestamp = Date.now();
        const url = await uploadImageToBlob(file, `${timestamp}_sub${i + 1}.jpg`);
        newSubImagesUrls.push(url);
        console.log('✅ Uploaded sub image:', url);
      }
    }
    
    // الحفاظ على الصور الموجودة
    const existingSubImages = products[index].subImages.filter(
      (img: string) => !removedImages.includes(img)
    );
    
    // حساب inStock
    const inStock = stockItems.length > 0 
      ? stockItems.some(item => item.quantity > 0)
      : (!isNaN(stock) ? stock > 0 : products[index].inStock);
    
    // إنشاء المنتج المحدث
    const updatedProduct = {
      ...products[index],
      name: name || products[index].name,
      price: isNaN(price) ? products[index].price : price,
      category: category || products[index].category,
      description: description || products[index].description,
      stock: isNaN(stock) ? products[index].stock : stock,
      stockItems: stockItems.length > 0 ? stockItems : products[index].stockItems || [],
      oldPrice: oldPrice,
      discount: isNaN(discount) ? products[index].discount : discount,
      isNew: isNew,
      inStock: inStock,
      sizes: sizes.length ? sizes : products[index].sizes,
      colors: colors.length ? colors : products[index].colors,
      mainImage: mainImageUrl,
      subImages: [...existingSubImages, ...newSubImagesUrls],
      quantityDiscount: quantityDiscount,
      updatedAt: new Date().toISOString(),
    };
    
    products[index] = updatedProduct;
    await saveProducts(products);
    
    console.log('✅ Product updated successfully:', updatedProduct.id);
    
    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('❌ Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product', details: String(error) }, { status: 500 });
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
        if (imageUrl && imageUrl.includes('blob.vercel-storage.com')) {
          const url = new URL(imageUrl);
          const pathname = url.pathname;
          const blobKey = pathname.split('/').pop();
          if (blobKey) {
            await del(blobKey);
            console.log('✅ Deleted image:', blobKey);
          }
        }
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
    
    const newProducts = products.filter((p: any) => p.id !== parseInt(id));
    await saveProducts(newProducts);
    
    console.log('✅ Product deleted successfully:', id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}