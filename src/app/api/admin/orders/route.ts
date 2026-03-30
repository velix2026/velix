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

    // جلب الطلبات من قاعدة البيانات (بدون الأعمدة الجديدة لو مش موجودة)
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
        total_amount, 
        status, 
        created_at
      FROM orders 
      ORDER BY created_at DESC
    `;

    console.log(`✅ Found ${orders.rows.length} orders`);

    // جلب عناصر كل طلب
    const ordersWithItems = await Promise.all(
      orders.rows.map(async (order) => {
        const items = await sql`
          SELECT product_id, product_name, quantity, price, selected_size, selected_color
          FROM order_items
          WHERE order_id = ${order.order_id}
        `;
        return {
          ...order,
          delivered_at: null,
          cancelled_at: null,
          items: items.rows,
        };
      })
    );

    return NextResponse.json(ordersWithItems);
  } catch (error) {
    console.error('❌ Error fetching admin orders:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب الطلبات' },
      { status: 500 }
    );
  }
}