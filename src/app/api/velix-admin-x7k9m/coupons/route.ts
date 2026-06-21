import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const { rows } = await sql.query(
      `SELECT * FROM coupons ORDER BY created_at DESC`
    );
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { code, discountType, discountValue, minOrderAmount, maxUses, expiresAt, description } = await request.json();
    const { rows } = await sql.query(
      `INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, max_uses, expires_at, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [code.toUpperCase(), discountType, discountValue, minOrderAmount || 0, maxUses || 0, expiresAt || null, description || '']
    );
    return NextResponse.json({ success: true, id: rows[0].id });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, code, discountType, discountValue, minOrderAmount, maxUses, isActive, expiresAt, description } = await request.json();
    await sql.query(
      `UPDATE coupons SET code = $1, discount_type = $2, discount_value = $3, min_order_amount = $4, max_uses = $5, is_active = $6, expires_at = $7, description = $8 WHERE id = $9`,
      [code.toUpperCase(), discountType, discountValue, minOrderAmount || 0, maxUses || 0, isActive ?? true, expiresAt || null, description || '', id]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    await sql.query(`DELETE FROM coupons WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
