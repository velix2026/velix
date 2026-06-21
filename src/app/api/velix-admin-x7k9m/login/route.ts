import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'username and password required' }, { status: 400 });
    }

    // Rate limiting: check attempts in last 15 minutes
    const { rows: attempts } = await sql.query(
      `SELECT COUNT(*) as count FROM login_attempts WHERE ip_address = $1 AND attempted_at > NOW() - INTERVAL '15 minutes'`,
      [ip]
    );
    if (parseInt(attempts[0].count) >= 5) {
      return NextResponse.json({ success: false, error: 'محاولات كتير. استنى 15 دقيقة.' }, { status: 429 });
    }

    // Find user
    const { rows: users } = await sql.query(
      `SELECT id, username, password_hash, display_name, role, is_active FROM admin_users WHERE username = $1`,
      [username]
    );

    if (users.length === 0 || !users[0].is_active) {
      await sql.query(`INSERT INTO login_attempts (ip_address) VALUES ($1)`, [ip]);
      return NextResponse.json({ success: false, error: 'بيانات الدخول غلط' }, { status: 401 });
    }

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      await sql.query(`INSERT INTO login_attempts (ip_address) VALUES ($1)`, [ip]);
      return NextResponse.json({ success: false, error: 'بيانات الدخول غلط' }, { status: 401 });
    }

    // Clear old sessions for this user
    await sql.query(`DELETE FROM admin_sessions WHERE user_id = $1 OR expires_at < NOW()`, [user.id]);

    // Create session
    const token = crypto.randomBytes(48).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await sql.query(
      `INSERT INTO admin_sessions (user_id, token, ip_address, expires_at) VALUES ($1, $2, $3, $4)`,
      [user.id, token, ip, expiresAt]
    );

    // Update last login
    await sql.query(`UPDATE admin_users SET last_login = NOW() WHERE id = $1`, [user.id]);

    // Log activity
    await sql.query(
      `INSERT INTO activity_log (user_id, username, action, details, ip_address) VALUES ($1, $2, 'login', 'تم تسجيل الدخول', $3)`,
      [user.id, user.display_name, ip]
    );

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username, displayName: user.display_name, role: user.role }
    });
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/velix-admin-x7k9m',
      maxAge: 86400 // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'حصل مشكلة' }, { status: 500 });
  }
}
