export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { checkAdminAuth } from '@/lib/admin-auth';
import { getTier, canRedeem } from '@/lib/loyalty';

export async function POST(request: NextRequest) {
  try {
    const authed = await checkAdminAuth(request);
    if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const body = await request.json();
    const { phone, points, description } = body;

    if (!phone || !points) {
      return NextResponse.json({ error: 'phone and points are required' }, { status: 400 });
    }

    if (action === 'use') {
      const { rows: existing } = await sql`SELECT points FROM loyalty_points WHERE phone = ${phone}`;
      if (existing.length === 0) {
        return NextResponse.json({ error: 'رقم التليفون مش مسجل في نظام النقاط' }, { status: 404 });
      }
      if (!canRedeem(existing[0].points)) {
        return NextResponse.json({ error: 'مش معاك نقاط كافية للاستبدال. الحد الأدنى ١٠٠ نقطة' }, { status: 400 });
      }

      await sql`UPDATE loyalty_points SET points = points - ${points}, updated_at = CURRENT_TIMESTAMP WHERE phone = ${phone}`;
      await sql`INSERT INTO loyalty_transactions (phone, points, type, description) VALUES (${phone}, ${points}, 'spent', ${description || 'استبدال نقاط'})`;

      const { rows: updated } = await sql`SELECT points FROM loyalty_points WHERE phone = ${phone}`;
      const tier = getTier(updated[0].points);
      return NextResponse.json({ success: true, points: updated[0].points, tier: tier.nameAr });
    }

    // Earn points
    const { referenceType, referenceId } = body;
    await sql`
      INSERT INTO loyalty_points (phone, points, total_earned, tier, updated_at)
      VALUES (${phone}, ${points}, ${points}, 'bronze', CURRENT_TIMESTAMP)
      ON CONFLICT (phone) DO UPDATE SET
        points = loyalty_points.points + ${points},
        total_earned = loyalty_points.total_earned + ${points},
        updated_at = CURRENT_TIMESTAMP
    `;

    await sql`INSERT INTO loyalty_transactions (phone, points, type, reference_type, reference_id, description) VALUES (${phone}, ${points}, 'earned', ${referenceType || null}, ${referenceId || null}, ${description || 'ربح نقاط'})`;

    const { rows: updated } = await sql`SELECT points, total_earned FROM loyalty_points WHERE phone = ${phone}`;
    const tier = getTier(updated[0].points);

    return NextResponse.json({ success: true, points: updated[0].points, totalEarned: updated[0].total_earned, tier: tier.nameAr });
  } catch (error) {
    console.error('Loyalty POST error:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');

    if (!phone) {
      return NextResponse.json({ error: 'phone query parameter is required' }, { status: 400 });
    }

    const { rows: pointsRows } = await sql`SELECT * FROM loyalty_points WHERE phone = ${phone}`;
    const { rows: txRows } = await sql`SELECT * FROM loyalty_transactions WHERE phone = ${phone} ORDER BY created_at DESC LIMIT 20`;

    const stats = searchParams.get('stats') === 'true';

    if (pointsRows.length === 0) {
      return NextResponse.json({
        enrolled: false,
        phone,
        points: 0,
        totalEarned: 0,
        tier: getTier(0),
        transactions: [],
      });
    }

    const row = pointsRows[0];
    const tier = getTier(row.points);

    if (stats) {
      return NextResponse.json({
        enrolled: true,
        phone: row.phone,
        points: row.points,
        totalEarned: row.total_earned,
        tier,
        transactions: txRows,
      });
    }

    return NextResponse.json({
      enrolled: true,
      phone: row.phone,
      points: row.points,
      totalEarned: row.total_earned,
      tier: tier.nameAr,
      transactions: txRows,
    });
  } catch (error) {
    console.error('Loyalty GET error:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}
