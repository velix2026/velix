export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { canRedeem, pointsToEGP } from '@/lib/loyalty';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, points, orderId } = body;

    if (!phone || !points || !orderId) {
      return NextResponse.json({ error: 'phone, points, and orderId are required' }, { status: 400 });
    }

    if (!canRedeem(points)) {
      return NextResponse.json({ error: 'الحد الأدنى للاستبدال ١٠٠ نقطة' }, { status: 400 });
    }

    const { rows: existing } = await sql`SELECT points FROM loyalty_points WHERE phone = ${phone}`;
    if (existing.length === 0) {
      return NextResponse.json({ error: 'رقم التليفون مش مسجل في نظام النقاط' }, { status: 404 });
    }

    if (existing[0].points < points) {
      return NextResponse.json({ error: 'مش معاك نقاط كافية' }, { status: 400 });
    }

    const discount = pointsToEGP(points);

    // Deduct points
    await sql`UPDATE loyalty_points SET points = points - ${points}, updated_at = CURRENT_TIMESTAMP WHERE phone = ${phone}`;

    // Record transaction
    await sql`INSERT INTO loyalty_transactions (phone, points, type, reference_type, reference_id, description) VALUES (${phone}, ${points}, 'spent', 'order', ${orderId}, 'استبدال نقاط في الطلب')`;

    // Record redemption
    await sql`INSERT INTO loyalty_redemptions (order_id, phone, points_used, discount_amount) VALUES (${orderId}, ${phone}, ${points}, ${discount})`;

    return NextResponse.json({
      success: true,
      discount,
      pointsUsed: points,
      message: `تم استبدال ${points} نقطة بقيمة ${discount} ج.م`,
    });
  } catch (error) {
    console.error('Loyalty redeem error:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}
