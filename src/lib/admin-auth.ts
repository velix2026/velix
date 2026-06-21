import { NextRequest } from 'next/server';
import { sql } from '@vercel/postgres';

export async function checkAdminAuth(request: NextRequest): Promise<boolean> {
  // Check session cookie first (new system)
  const token = request.cookies.get('admin_token')?.value;
  if (token) {
    try {
      const { rows } = await sql.query(
        `SELECT u.id FROM admin_sessions s JOIN admin_users u ON s.user_id = u.id
         WHERE s.token = $1 AND s.expires_at > NOW() AND u.is_active = true`,
        [token]
      );
      if (rows.length > 0) return true;
    } catch {}
  }

  // Fallback to Bearer token (old system)
  const authHeader = request.headers.get('authorization');
  const adminPassword = process.env.ADMIN_PASSWORD || 'velix@2026';
  return authHeader === `Bearer ${adminPassword}`;
}
