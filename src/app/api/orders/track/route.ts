export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

const statusLabels: Record<string, string> = {
  pending: 'قيد المعالجة',
  processing: 'قيد التجهيز',
  shipped: 'تم الشحن',
  delivered: 'تم التوصيل',
  cancelled: 'ملغي',
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');

    if (!phone) {
      return NextResponse.json({ error: 'يرجى إدخال رقم الهاتف' }, { status: 400 });
    }

    const ordersResult = await sql`
      SELECT * FROM orders WHERE customer_phone = ${phone} ORDER BY created_at DESC
    `;

    if (ordersResult.rows.length === 0) {
      return NextResponse.json({ error: 'لم يتم العثور على طلبات بهذا الرقم' }, { status: 404 });
    }

    const orders = await Promise.all(
      ordersResult.rows.map(async (order: Record<string, unknown>) => {
        const itemsResult = await sql`
          SELECT * FROM order_items WHERE order_id = ${order.order_id as string}
        `;
        return {
          orderId: order.order_id,
          customerName: order.customer_name,
          customerPhone: order.customer_phone,
          customerAddress: order.customer_address,
          landmark: order.landmark,
          status: order.status,
          statusLabel: statusLabels[order.status as string] || (order.status as string),
          totalAmount: Number(order.total_amount) || 0,
          notes: order.notes,
          createdAt: order.created_at,
          deliveredAt: order.delivered_at,
          cancelledAt: order.cancelled_at,
          updatedAt: order.updated_at,
          items: itemsResult.rows.map((item: Record<string, unknown>) => ({
            productName: item.product_name,
            quantity: Number(item.quantity) || 0,
            price: Number(item.price) || 0,
            selectedSize: item.selected_size,
            selectedColor: item.selected_color,
          })),
        };
      })
    );

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Error tracking orders:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء البحث عن الطلبات' }, { status: 500 });
  }
}
