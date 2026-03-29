// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { sql } from '@vercel/postgres';
import { sendOrderEmail } from '@/lib/email';

const WHATSAPP_NUMBER = '201500125133';
const ADMIN_WHATSAPP = '201500125133';

// ✅ دالة لتحديث الإحصائيات
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

// ✅ POST - إنشاء طلب جديد
export async function POST(request: NextRequest) {
  try {
    const order = await request.json();
    const totalAmount = order.product.price * order.product.quantity;
    const orderId = Date.now().toString();

    // ✅ حفظ في Redis
    try {
      await kv.hset(`order:${orderId}`, {
        ...order,
        orderId,
        totalAmount,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log('✅ Saved to Redis');
    } catch (redisError) {
      console.error('Redis save failed (continuing):', redisError);
    }

    // ✅ حفظ في Postgres
    await sql`
      INSERT INTO orders (
        order_id, 
        customer_name, 
        customer_phone, 
        customer_alt_phone,
        customer_address, 
        landmark,
        notes, 
        total_amount
      )
      VALUES (
        ${orderId}, 
        ${order.name}, 
        ${order.phone}, 
        ${order.altPhone || null},
        ${order.address}, 
        ${order.landmark || null},
        ${order.notes || null}, 
        ${totalAmount}
      )
    `;

    await sql`
      INSERT INTO order_items (order_id, product_id, product_name, quantity, price, selected_size, selected_color)
      VALUES (${orderId}, ${order.product.id}, ${order.product.name}, ${order.product.quantity}, ${order.product.price}, ${order.product.size || null}, ${order.product.color || null})
    `;
    console.log('✅ Saved to Postgres');

    // ✅ تحديث الإحصائيات
    await updateAnalyticsPostgres(totalAmount);

    // ✅ تحديث عدد المبيعات
    try {
      await incrementProductSales(order.product.id, order.product.quantity);
    } catch (salesError) {
      console.error('Sales update failed:', salesError);
    }

    // ✅ إرسال إشعار إيميل
    try {
      await sendOrderEmail({
        orderId,
        name: order.name,
        phone: order.phone,
        altPhone: order.altPhone,
        address: order.address,
        landmark: order.landmark,
        productId: order.product.id,
        productName: order.product.name,
        productPrice: order.product.price,
        quantity: order.product.quantity,
        totalAmount,
        size: order.product.size,
        color: order.product.color,
        notes: order.notes,
      });
      console.log('✅ Email sent');
    } catch (emailError) {
      console.error('Email error (continuing):', emailError);
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

// ✅ GET - جلب جميع الطلبات
export async function GET() {
  try {
    const orders = await getAllOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}