import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ✅ دالة للتحقق من صلاحيات الأدمن
function isAdminAuthorized(request: NextRequest): boolean {
  // نتحقق من الـ session storage (بيتم إرساله في الـ headers)
  const authHeader = request.headers.get('authorization');
  const adminPassword = process.env.ADMIN_PASSWORD || 'velix@2026';
  
  // طريقة 1: التحقق من الـ session عبر الـ header (من الـ middleware)
  // طريقة 2: السماح في development environment
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  
  // التحقق من الباسورد (مؤقت)
  if (authHeader === `Bearer ${adminPassword}`) {
    return true;
  }
  
  return false;
}

// ✅ GET - جلب المشتركين
export async function GET(request: NextRequest) {
  // التحقق من الصلاحيات
  if (!isAdminAuthorized(request)) {
    console.log('🔒 Unauthorized access to newsletter API');
    return NextResponse.json({ error: 'غير مصرح به' }, { status: 401 });
  }
  
  try {
    console.log('🔍 Fetching subscribers...');
    
    // نتأكد من وجود الجدول
    await sql`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'active',
        ip_address VARCHAR(45)
      )
    `;

    const subscribers = await sql`
      SELECT id, email, subscribed_at, status FROM newsletter_subscribers 
      ORDER BY subscribed_at DESC
    `;
    
    console.log(`✅ Found ${subscribers.rows.length} subscribers`);
    return NextResponse.json(subscribers.rows);
    
  } catch (error) {
    console.error('❌ Error fetching subscribers:', error);
    return NextResponse.json({ 
      error: 'حدث خطأ في جلب المشتركين'
    }, { status: 500 });
  }
}

// ✅ POST - إضافة مشترك
export async function POST(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: 'غير مصرح به' }, { status: 401 });
  }
  
  try {
    const { email } = await request.json();
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'البريد الإلكتروني غير صحيح' }, { status: 400 });
    }

    const existing = await sql`
      SELECT id, status FROM newsletter_subscribers WHERE email = ${email}
    `;

    if (existing.rows.length > 0) {
      if (existing.rows[0].status === 'inactive') {
        await sql`
          UPDATE newsletter_subscribers 
          SET status = 'active', subscribed_at = CURRENT_TIMESTAMP
          WHERE email = ${email}
        `;
        return NextResponse.json({ 
          success: true, 
          reactivated: true,
          message: 'تم إعادة تفعيل المشترك'
        });
      }
      return NextResponse.json({ 
        alreadySubscribed: true,
        message: 'البريد مسجل بالفعل'
      });
    }

    await sql`
      INSERT INTO newsletter_subscribers (email, status)
      VALUES (${email}, 'active')
    `;

    return NextResponse.json({ 
      success: true, 
      message: 'تم إضافة المشترك بنجاح'
    });
  } catch (error) {
    console.error('Error adding subscriber:', error);
    return NextResponse.json({ error: 'حدث خطأ في الإضافة' }, { status: 500 });
  }
}

// ✅ DELETE - حذف مشترك
export async function DELETE(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: 'غير مصرح به' }, { status: 401 });
  }
  
  try {
    const { id, email } = await request.json();
    
    if (id) {
      await sql`DELETE FROM newsletter_subscribers WHERE id = ${id}`;
      return NextResponse.json({ success: true, message: 'تم حذف المشترك' });
    } else if (email) {
      await sql`DELETE FROM newsletter_subscribers WHERE email = ${email}`;
      return NextResponse.json({ success: true, message: 'تم حذف المشترك' });
    } else {
      return NextResponse.json({ error: 'ID أو البريد مطلوب' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    return NextResponse.json({ error: 'حدث خطأ في الحذف' }, { status: 500 });
  }
}