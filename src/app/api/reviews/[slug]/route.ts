import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const result = await sql`
      SELECT 
        COUNT(*)::int as review_count,
        COALESCE(AVG(rating)::numeric(10,2), 0)::float as average_rating
      FROM product_reviews 
      WHERE product_slug = ${slug} AND is_approved = true
    `;

    return NextResponse.json({
      averageRating: result.rows[0].average_rating,
      reviewCount: result.rows[0].review_count,
    });
  } catch (error) {
    console.error('Error fetching review stats:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}
