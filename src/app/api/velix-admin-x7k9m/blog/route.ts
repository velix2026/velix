import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { checkAdminAuth } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  if (!await checkAdminAuth(request)) return NextResponse.json({ error: 'غير مصرح به' }, { status: 401 });
  try {
    const { rows } = await sql.query(
      `SELECT id, slug, title, excerpt, content, category, tags, read_time, is_published, published_at, created_at, updated_at
       FROM blog_posts ORDER BY created_at DESC`
    );
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!await checkAdminAuth(request)) return NextResponse.json({ error: 'غير مصرح به' }, { status: 401 });
  try {
    const { slug, title, excerpt, content, category, tags, readTime, isPublished } = await request.json();
    const { rows } = await sql.query(
      `INSERT INTO blog_posts (slug, title, excerpt, content, category, tags, read_time, is_published, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CASE WHEN $8 THEN NOW() ELSE NULL END)
       RETURNING id`,
      [slug, title, excerpt || '', content, category || 'نصائح', tags || [], readTime || '5 دقايق', isPublished ?? true]
    );
    return NextResponse.json({ success: true, id: rows[0].id });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!await checkAdminAuth(request)) return NextResponse.json({ error: 'غير مصرح به' }, { status: 401 });
  try {
    const { id, slug, title, excerpt, content, category, tags, readTime, isPublished } = await request.json();
    await sql.query(
      `UPDATE blog_posts SET slug = $1, title = $2, excerpt = $3, content = $4, category = $5, tags = $6, read_time = $7, is_published = $8, updated_at = NOW() WHERE id = $9`,
      [slug, title, excerpt || '', content, category || 'نصائح', tags || [], readTime || '5 دقايق', isPublished ?? true, id]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!await checkAdminAuth(request)) return NextResponse.json({ error: 'غير مصرح به' }, { status: 401 });
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    await sql.query(`DELETE FROM blog_posts WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
