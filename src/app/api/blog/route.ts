import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { rows } = await sql.query(
      `SELECT slug, title, excerpt, category, tags, read_time, published_at as date
       FROM blog_posts WHERE is_published = true ORDER BY published_at DESC`
    );
    return NextResponse.json(rows.length > 0 ? rows : []);
  } catch {
    return NextResponse.json([]);
  }
}
