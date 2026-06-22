import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productSlug = searchParams.get('productSlug');
    const approved = searchParams.get('approved');

    let query = 'SELECT * FROM product_reviews WHERE 1=1';
    const params: (string | number)[] = [];
    let paramIndex = 1;

    if (productSlug) {
      query += ` AND product_slug = $${paramIndex++}`;
      params.push(productSlug);
    }

    if (approved === 'true') {
      query += ` AND is_approved = $${paramIndex++}`;
      params.push('true');
    }

    query += ' ORDER BY created_at DESC';

    const result = await sql.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productSlug, productId, customerName, customerPhone, rating, reviewText, imageUrl } = body;

    if (!productSlug || !customerName || !rating) {
      return NextResponse.json({ error: 'بيانات غير مكتملة' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'التقييم يجب أن يكون بين 1 و 5' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO product_reviews (product_id, product_slug, customer_name, customer_phone, rating, review_text, image_url)
      VALUES (${productId || null}, ${productSlug}, ${customerName}, ${customerPhone || null}, ${rating}, ${reviewText || null}, ${imageUrl || null})
      RETURNING id
    `;

    return NextResponse.json({ success: true, id: result.rows[0].id, message: 'تم إرسال تقييمك! سيتم مراجعته قريباً' });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'بيانات غير مكتملة' }, { status: 400 });
    }

    await sql`UPDATE product_reviews SET is_approved = true WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error approving review:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}
