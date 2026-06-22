import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    if (!password) {
      return NextResponse.json({ success: false, error: 'كلمة المرور مطلوبة' }, { status: 400 });
    }

    // Rate limiting
    const { rows: attempts } = await sql.query(
      `SELECT COUNT(*) as count FROM login_attempts WHERE ip_address = $1 AND attempted_at > NOW() - INTERVAL '15 minutes'`,
      [ip]
    );
    if (parseInt(attempts[0].count) >= 5) {
      return NextResponse.json({ success: false, error: 'محاولات كتير. استنى 15 دقيقة.' }, { status: 429 });
    }

    // Check password against env var
    const adminPassword = process.env.ADMIN_PASSWORD || 'velix@2026';
    if (password !== adminPassword) {
      await sql.query(`INSERT INTO login_attempts (ip_address) VALUES ($1)`, [ip]);
      return NextResponse.json({ success: false, error: 'كلمة المرور غلط' }, { status: 401 });
    }

    // Create session
    const token = crypto.randomBytes(48).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Find or create admin user
    const { rows: users } = await sql.query(`SELECT id FROM admin_users WHERE username = 'admin'`);
    if (users.length > 0) {
      await sql.query(`DELETE FROM admin_sessions WHERE user_id = $1 OR expires_at < NOW()`, [users[0].id]);
      await sql.query(`INSERT INTO admin_sessions (user_id, token, ip_address, expires_at) VALUES ($1, $2, $3, $4)`,
        [users[0].id, token, ip, expiresAt]);
      await sql.query(`UPDATE admin_users SET last_login = NOW() WHERE id = $1`, [users[0].id]);
      await sql.query(`INSERT INTO activity_log (user_id, username, action, details, ip_address) VALUES ($1, $2, 'login', 'تم تسجيل الدخول', $3)`,
        [users[0].id, 'Admin', ip]);
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_token', token, {
      httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 86400
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'حصل مشكلة' }, { status: 500 });
  }
}
