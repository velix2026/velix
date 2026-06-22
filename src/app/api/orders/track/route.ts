export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const phone = searchParams.get('phone');

    if (!orderId || !phone) {
      return NextResponse.json({ error: 'يرجى إدخال رقم الطلب ورقم الهاتف' }, { status: 400 });
    }

    const orderResult = await sql`
      SELECT * FROM orders WHERE order_id = ${orderId} AND customer_phone = ${phone}
    `;

    if (orderResult.rows.length === 0) {
      return NextResponse.json({ error: 'لم يتم العثور على طلب بهذه البيانات' }, { status: 404 });
    }

    const order = orderResult.rows[0];

    const itemsResult = await sql`
      SELECT * FROM order_items WHERE order_id = ${orderId}
    `;

    const statusLabels: Record<string, string> = {
      pending: 'قيد المعالجة',
      processing: 'قيد التجهيز',
      shipped: 'تم الشحن',
      delivered: 'تم التوصيل',
      cancelled: 'ملغي',
    };

    return NextResponse.json({
      success: true,
      order: {
        orderId: order.order_id,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        customerAddress: order.customer_address,
        landmark: order.landmark,
        status: order.status,
        statusLabel: statusLabels[order.status] || order.status,
        totalAmount: order.total_amount,
        notes: order.notes,
        createdAt: order.created_at,
        deliveredAt: order.delivered_at,
        cancelledAt: order.cancelled_at,
        updatedAt: order.updated_at,
        items: itemsResult.rows.map((item: Record<string, unknown>) => ({
          productName: item.product_name,
          quantity: item.quantity,
          price: item.price,
          selectedSize: item.selected_size,
          selectedColor: item.selected_color,
        })),
      },
    });
  } catch (error) {
    console.error('Error tracking order:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء البحث عن الطلب' }, { status: 500 });
  }
}
