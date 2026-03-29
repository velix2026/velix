// app/api/newsletter/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ POST - الاشتراك في النشرة البريدية
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'البريد الإلكتروني غير صحيح' }, { status: 400 });
    }

    await sql`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'active',
        ip_address VARCHAR(45)
      )
    `;

    const existing = await sql`
      SELECT email, status FROM newsletter_subscribers WHERE email = ${email}
    `;

    if (existing.rows.length > 0) {
      // لو كان ملغي الاشتراك قبل كدة، نفعله تاني
      if (existing.rows[0].status === 'inactive') {
        await sql`
          UPDATE newsletter_subscribers 
          SET status = 'active', subscribed_at = CURRENT_TIMESTAMP
          WHERE email = ${email}
        `;
        return NextResponse.json({ 
          success: true, 
          reactivated: true,
          message: 'تم إعادة تفعيل اشتراكك بنجاح!'
        });
      }
      
      return NextResponse.json({ 
        alreadySubscribed: true,
        message: 'هذا البريد مسجل بالفعل'
      });
    }

    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    await sql`
      INSERT INTO newsletter_subscribers (email, ip_address, status)
      VALUES (${email}, ${ip}, 'active')
    `;

    try {
      await transporter.sendMail({
        from: `"VELIX Store" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `📧 مشترك جديد في النشرة البريدية - ${email}`,
        html: `<div dir="rtl"><h2>📧 مشترك جديد!</h2><p><strong>البريد:</strong> ${email}</p><p><strong>التاريخ:</strong> ${new Date().toLocaleString('ar-EG')}</p></div>`,
      });
    } catch (emailError) {
      console.error('Admin email error:', emailError);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'تم الإشتراك بنجاح! شكراً لك'
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json({ error: 'حدث خطأ، حاول مرة أخرى' }, { status: 500 });
  }
}

// ✅ PUT - تحديث الإيميل (تغيير البريد)
export async function PUT(request: NextRequest) {
  try {
    const { oldEmail, newEmail } = await request.json();
    
    if (!oldEmail || !newEmail || !newEmail.includes('@')) {
      return NextResponse.json({ error: 'بيانات غير صحيحة' }, { status: 400 });
    }

    // التحقق من وجود الإيميل القديم
    const existing = await sql`
      SELECT id FROM newsletter_subscribers WHERE email = ${oldEmail}
    `;

    if (existing.rows.length === 0) {
      return NextResponse.json({ error: 'البريد غير مسجل في النشرة' }, { status: 404 });
    }

    // التحقق من عدم وجود الإيميل الجديد
    const newEmailExists = await sql`
      SELECT id FROM newsletter_subscribers WHERE email = ${newEmail}
    `;

    if (newEmailExists.rows.length > 0) {
      return NextResponse.json({ error: 'البريد الجديد مسجل بالفعل' }, { status: 400 });
    }

    // تحديث الإيميل
    await sql`
      UPDATE newsletter_subscribers 
      SET email = ${newEmail}, subscribed_at = CURRENT_TIMESTAMP
      WHERE email = ${oldEmail}
    `;

    return NextResponse.json({ 
      success: true, 
      message: 'تم تحديث بريدك الإلكتروني بنجاح'
    });

  } catch (error) {
    console.error('Update email error:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}

// ✅ DELETE - إلغاء الاشتراك
export async function DELETE(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'البريد الإلكتروني مطلوب' }, { status: 400 });
    }

    // تحديث الحالة إلى inactive بدل حذف البيانات
    await sql`
      UPDATE newsletter_subscribers 
      SET status = 'inactive'
      WHERE email = ${email}
    `;

    return NextResponse.json({ 
      success: true, 
      message: 'تم إلغاء الاشتراك بنجاح'
    });

  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}

// ✅ GET - جلب المشتركين (للأدمن فقط)
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const adminPassword = process.env.ADMIN_PASSWORD || 'velix@2026';
  
  if (authHeader !== `Bearer ${adminPassword}` && process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'غير مصرح به' }, { status: 401 });
  }

  try {
    const subscribers = await sql`
      SELECT id, email, subscribed_at, status FROM newsletter_subscribers 
      ORDER BY subscribed_at DESC
    `;
    return NextResponse.json(subscribers.rows);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}