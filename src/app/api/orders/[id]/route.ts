export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, delivered_at, cancelled_at } = body;

    console.log('🔍 PATCH request for order:', id, 'status:', status);

    if (!id) {
      return NextResponse.json({ error: 'Missing order id' }, { status: 400 });
    }

    if (!status) {
      return NextResponse.json({ error: 'Missing status' }, { status: 400 });
    }

    // تحديث في Postgres
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
    
    console.log('✅ Updated in Postgres');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}