import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, delivered_at, cancelled_at } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'بيانات غير مكتملة' }, { status: 400 });
    }

    if (delivered_at) {
      await sql`
        UPDATE orders 
        SET status = ${status}, delivered_at = ${delivered_at}, updated_at = CURRENT_TIMESTAMP
        WHERE order_id = ${id}
      `;
    } else if (cancelled_at) {
      await sql`
        UPDATE orders 
        SET status = ${status}, cancelled_at = ${cancelled_at}, updated_at = CURRENT_TIMESTAMP
        WHERE order_id = ${id}
      `;
    } else {
      await sql`
        UPDATE orders 
        SET status = ${status}, updated_at = CURRENT_TIMESTAMP
        WHERE order_id = ${id}
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // 1. حذف عناصر الطلب
    await sql`DELETE FROM order_items WHERE order_id = ${id}`;
    
    // 2. حذف الطلب نفسه
    const result = await sql`DELETE FROM orders WHERE order_id = ${id}`;
    
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'الطلب غير موجود' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}