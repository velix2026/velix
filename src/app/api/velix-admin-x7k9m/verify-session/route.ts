import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const { rows } = await sql.query(
      `SELECT u.id, u.username, u.display_name, u.role
       FROM admin_sessions s JOIN admin_users u ON s.user_id = u.id
       WHERE s.token = $1 AND s.expires_at > NOW() AND u.is_active = true`,
      [token]
    );

    if (rows.length === 0) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: { id: rows[0].id, username: rows[0].username, displayName: rows[0].display_name, role: rows[0].role }
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    if (action === 'logout') {
      const token = request.cookies.get('admin_token')?.value;
      if (token) {
        await sql.query(`DELETE FROM admin_sessions WHERE token = $1`, [token]);
      }
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_token', '', { maxAge: 0, path: '/' });
      return response;
    }
  } catch {}
  return NextResponse.json({ success: false }, { status: 400 });
}
