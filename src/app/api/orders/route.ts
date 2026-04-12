export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { sql } from '@vercel/postgres';
import { sendOrderEmail } from '@/lib/email';

const WHATSAPP_NUMBER = '201500125133';
const ADMIN_WHATSAPP = '201500125133';

async function updateAnalyticsPostgres(orderTotal: number) {
  try {
    await sql`
      UPDATE analytics 
      SET 
        total_orders = total_orders + 1,
        total_sales = total_sales + ${orderTotal},
        total_customers = total_customers + 1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `;
    console.log('✅ Postgres analytics updated');
  } catch (error) {
    console.error('Error updating Postgres analytics:', error);
  }
}

async function getAllOrders() {
  try {
    const keys = await kv.keys('order:*');
    const orders = await Promise.all(
      keys.map(async (key) => {
        const order = await kv.hgetall(key);
        return { id: key.split(':')[1], ...order };
      })
    );
    return orders.sort((a: any, b: any) => (b.createdAt > a.createdAt ? 1 : -1));
  } catch (error) {
    console.error('Error getting orders from Redis:', error);
    return [];
  }
}

// ✅ دالة تحديث المخزون بعد الطلب
async function updateProductStock(productId: number, quantity: number, selectedSize?: string, selectedColor?: string) {
  try {
    const productsKey = 'products';
    const productsData = await kv.get(productsKey);
    if (!productsData) return;
    
    let products = JSON.parse(productsData as string);
    const productIndex = products.findIndex((p: any) => p.id === productId);
    
    if (productIndex !== -1) {
      const product = products[productIndex];
      
      // ✅ إذا كان المنتج يستخدم stockItems
      if (product.stockItems && Array.isArray(product.stockItems) && selectedSize && selectedColor) {
        const stockIndex = product.stockItems.findIndex(
          (item: any) => item.size === selectedSize && item.colorCode === selectedColor
        );
        if (stockIndex !== -1) {
          product.stockItems[stockIndex].quantity -= quantity;
          if (product.stockItems[stockIndex].quantity < 0) {
            product.stockItems[stockIndex].quantity = 0;
          }
        }
        // تحديث salesCount
        product.salesCount = (product.salesCount || 0) + quantity;
        await kv.set(productsKey, JSON.stringify(products));
        console.log(`✅ Updated stock for product ${productId} (size: ${selectedSize}, color: ${selectedColor}): -${quantity}`);
      } 
      // ✅ للمنتجات القديمة (بدون stockItems)
      else if (product.stock !== undefined) {
        product.stock -= quantity;
        if (product.stock < 0) product.stock = 0;
        product.salesCount = (product.salesCount || 0) + quantity;
        await kv.set(productsKey, JSON.stringify(products));
        console.log(`✅ Updated stock for product ${productId}: -${quantity}, remaining: ${product.stock}`);
      } 
      // ✅ للمنتجات اللي عندها stockItems بس مفيش مقاس/لون محدد (نحسب إجمالي)
      else if (product.stockItems && Array.isArray(product.stockItems)) {
        const totalStock = product.stockItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
        if (totalStock >= quantity) {
          // نخصم من أول عنصر متاح (أو نوزع)
          let remaining = quantity;
          for (let i = 0; i < product.stockItems.length && remaining > 0; i++) {
            const deduction = Math.min(product.stockItems[i].quantity, remaining);
            product.stockItems[i].quantity -= deduction;
            remaining -= deduction;
          }
        }
        product.salesCount = (product.salesCount || 0) + quantity;
        await kv.set(productsKey, JSON.stringify(products));
        console.log(`✅ Updated stock for product ${productId} (distributed): -${quantity}`);
      }
    }
  } catch (error) {
    console.error('Error updating product stock:', error);
  }
}

async function incrementProductSales(productId: number, quantity: number) {
  try {
    const productsKey = 'products';
    const productsData = await kv.get(productsKey);
    if (!productsData) return;
    
    let products = JSON.parse(productsData as string);
    const productIndex = products.findIndex((p: any) => p.id === productId);
    
    if (productIndex !== -1) {
      products[productIndex].salesCount = (products[productIndex].salesCount || 0) + quantity;
      await kv.set(productsKey, JSON.stringify(products));
      console.log(`✅ Updated salesCount for product ${productId}: +${quantity}`);
    }
  } catch (error) {
    console.error('Error updating salesCount:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    const orderId = Date.now().toString();

    console.log('📝 Processing order:', { orderId, isMultiOrder: orderData.isMultiOrder });

    // حفظ في Redis
    try {
      await kv.hset(`order:${orderId}`, {
        ...orderData,
        orderId,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log('✅ Saved to Redis');
    } catch (redisError) {
      console.error('Redis save failed (continuing):', redisError);
    }

    // حفظ في Postgres (الطلب الرئيسي)
    await sql`
      INSERT INTO orders (
        order_id, customer_name, customer_phone, customer_alt_phone,
        customer_address, landmark, notes, total_amount
      ) VALUES (
        ${orderId}, ${orderData.name}, ${orderData.phone}, ${orderData.altPhone || null},
        ${orderData.address}, ${orderData.landmark || null}, ${orderData.notes || null}, ${orderData.totalAmount}
      )
    `;

    // حفظ كل منتج في order_items وتحديث المخزون
    for (const item of orderData.items) {
      await sql`
        INSERT INTO order_items (order_id, product_id, product_name, quantity, price, selected_size, selected_color)
        VALUES (${orderId}, ${item.id}, ${item.name}, ${item.quantity}, ${item.price}, ${item.selectedSize || null}, ${item.selectedColor || null})
      `;
      
      // ✅ تحديث المخزون باستخدام الدالة الجديدة
      await updateProductStock(item.id, item.quantity, item.selectedSize, item.selectedColor);
      await incrementProductSales(item.id, item.quantity);
    }
    console.log('✅ Saved to Postgres and updated stock');

    await updateAnalyticsPostgres(orderData.totalAmount);

    // إرسال الإيميل
    try {
      console.log('📧 Attempting to send email...');
      const emailSent = await sendOrderEmail({
        orderId,
        name: orderData.name,
        phone: orderData.phone,
        altPhone: orderData.altPhone,
        address: orderData.address,
        landmark: orderData.landmark,
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        notes: orderData.notes,
      });
      
      if (emailSent) {
        console.log('✅ Email sent successfully for order', orderId);
      } else {
        console.log('⚠️ Email sending returned false');
      }
    } catch (emailError) {
      console.error('❌ Email error:', emailError);
    }
    
    return NextResponse.json({ 
      success: true, 
      orderId,
      message: 'تم استلام طلبك بنجاح! سنتواصل معك قريباً'
    });
  } catch (error) {
    console.error('Error processing order:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orders = await getAllOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}