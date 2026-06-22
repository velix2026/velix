import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { checkAdminAuth } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  if (!await checkAdminAuth(request)) return NextResponse.json({ error: 'غير مصرح به' }, { status: 401 });
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);
    const offset = parseInt(searchParams.get('offset') || '0');

    const { rows } = await sql.query(
      `SELECT al.id, al.username, al.action, al.details, al.ip_address, al.created_at
       FROM activity_log al ORDER BY al.created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    const { rows: countRows } = await sql.query(`SELECT COUNT(*) as total FROM activity_log`);
    return NextResponse.json({ activities: rows, total: parseInt(countRows[0].total) });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
