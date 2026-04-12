export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { kv } from '@vercel/kv';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    console.log('🔍 DELETE request for order:', id);
    
    // التحقق من صلاحيات الأدمن
    const authHeader = request.headers.get('authorization');
    const adminPassword = process.env.ADMIN_PASSWORD || 'velix@2026';
    
    if (authHeader !== `Bearer ${adminPassword}`) {
      console.log('🔒 Unauthorized - wrong password');
      return NextResponse.json({ error: 'غير مصرح به' }, { status: 401 });
    }
    
    // 1. حذف عناصر الطلب من order_items
    await sql`
      DELETE FROM order_items WHERE order_id = ${id}
    `;
    console.log('✅ Deleted from order_items');
    
    // 2. حذف الطلب من orders
    const result = await sql`
      DELETE FROM orders WHERE order_id = ${id}
    `;
    console.log('✅ Deleted from orders, rows affected:', result.rowCount);
    
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'الطلب غير موجود' }, { status: 404 });
    }
    
    // 3. حذف من Redis (KV) - اختياري
    try {
      await kv.del(`order:${id}`);
      console.log('✅ Deleted from Redis');
    } catch (redisError) {
      console.error('Redis delete failed (continuing):', redisError);
    }
    
    return NextResponse.json({ success: true, message: 'تم حذف الطلب بنجاح' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء حذف الطلب' }, { status: 500 });
  }
}