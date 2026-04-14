import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ✅ GET - جلب المشتركين
export async function GET(request: NextRequest) {
  try {
    const subscribers = await sql`
      SELECT id, email, subscribed_at, status FROM newsletter_subscribers 
      ORDER BY subscribed_at DESC
    `;
    return NextResponse.json(subscribers.rows);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json({ error: 'حدث خطأ في جلب المشتركين' }, { status: 500 });
  }
}

// ✅ POST - إضافة مشترك يدوي
export async function POST(request: NextRequest) {
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