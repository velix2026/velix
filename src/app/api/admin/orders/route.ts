// app/api/admin/orders/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: NextRequest) {
  try {
    // التحقق من صلاحيات الأدمن
    const authHeader = request.headers.get('authorization');
    const adminPassword = process.env.ADMIN_PASSWORD || 'velix@2026';
    
    console.log('🔍 GET /api/admin/orders - auth header:', authHeader);
    
    if (authHeader !== `Bearer ${adminPassword}`) {
      console.log('🔒 Unauthorized - wrong password');
      return NextResponse.json({ error: 'غير مصرح به' }, { status: 401 });
    }

    console.log('✅ Authorized - fetching orders...');

    // جلب الطلبات من قاعدة البيانات
    const orders = await sql`
      SELECT 
        id, 
        order_id, 
        customer_name, 
        customer_phone, 
        customer_alt_phone,
        customer_address, 
        landmark,
        notes,
        total_amount::float as total_amount, 
        status, 
        created_at,
        delivered_at,
        cancelled_at
      FROM orders 
      ORDER BY created_at DESC
    `;

    console.log(`✅ Found ${orders.rows.length} orders`);
    console.log('📊 Orders sample:', orders.rows.slice(0, 2).map(o => ({
      order_id: o.order_id,
      status: o.status,
      total_amount: o.total_amount
    })));

    // جلب عناصر كل طلب
    const ordersWithItems = await Promise.all(
      orders.rows.map(async (order) => {
        const items = await sql`
          SELECT product_id, product_name, quantity, price, selected_size, selected_color
          FROM order_items
          WHERE order_id = ${order.order_id}
        `;
        return {
          id: order.id,
          order_id: order.order_id,
          customer_name: order.customer_name,
          customer_phone: order.customer_phone,
          customer_alt_phone: order.customer_alt_phone,
          customer_address: order.customer_address,
          landmark: order.landmark,
          notes: order.notes,
          total_amount: parseFloat(order.total_amount) || 0,
          status: order.status,
          created_at: order.created_at,
          delivered_at: order.delivered_at,
          cancelled_at: order.cancelled_at,
          items: items.rows.map(item => ({
            ...item,
            price: parseFloat(item.price) || 0,
            quantity: parseInt(item.quantity) || 0
          }))
        };
      })
    );

    console.log('💰 Total delivered sales:', ordersWithItems
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + o.total_amount, 0));
    
    console.log('💰 Total cancelled sales:', ordersWithItems
      .filter(o => o.status === 'cancelled')
      .reduce((sum, o) => sum + o.total_amount, 0));

    return NextResponse.json(ordersWithItems);
  } catch (error) {
    console.error('❌ Error fetching admin orders:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب الطلبات' },
      { status: 500 }
    );
  }
}