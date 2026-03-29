// app/api/newsletter/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import nodemailer from 'nodemailer';

// إعداد الإيميل
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ POST - الاشتراك في النشرة البريدية (مفتوح للكل - بدون authentication)
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    console.log('📧 Newsletter subscription attempt:', email);
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'البريد الإلكتروني غير صحيح' }, { status: 400 });
    }

    // ✅ التحقق من وجود الجدول وإنشائه إذا لم يكن موجوداً
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS newsletter_subscribers (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          status VARCHAR(50) DEFAULT 'active',
          ip_address VARCHAR(45)
        )
      `;
      console.log('✅ Table verified/created');
    } catch (tableError) {
      console.error('Table creation error:', tableError);
    }

    // التحقق إذا كان الإيميل موجود بالفعل
    const existing = await sql`
      SELECT email FROM newsletter_subscribers WHERE email = ${email}
    `;

    if (existing.rows.length > 0) {
      console.log('⚠️ Email already subscribed:', email);
      return NextResponse.json({ 
        alreadySubscribed: true,
        message: 'هذا البريد مسجل بالفعل'
      });
    }

    // حفظ الإيميل في قاعدة البيانات
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    await sql`
      INSERT INTO newsletter_subscribers (email, ip_address, status)
      VALUES (${email}, ${ip}, 'active')
    `;
    console.log('✅ Saved to database:', email);

    // إرسال إشعار للإيميل الخاص بالشركة
    try {
      await transporter.sendMail({
        from: `"VELIX Store" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `📧 مشترك جديد في النشرة البريدية - ${email}`,
        html: `
          <div dir="rtl" style="font-family: 'Cairo', sans-serif; padding: 20px;">
            <h2 style="color: #000;">📧 مشترك جديد!</h2>
            <p><strong>البريد الإلكتروني:</strong> ${email}</p>
            <p><strong>تاريخ الإشتراك:</strong> ${new Date().toLocaleString('ar-EG')}</p>
            <p><strong>عنوان IP:</strong> ${ip}</p>
            <hr />
            <p style="color: #666;">تم الإشتراك من خلال نموذج النشرة البريدية في متجر VELIX</p>
          </div>
        `,
      });
      console.log('✅ Admin notification email sent');
    } catch (emailError) {
      console.error('Admin email error (continuing):', emailError);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'تم الإشتراك بنجاح! شكراً لك',
      email: email
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json({ error: 'حدث خطأ، حاول مرة أخرى' }, { status: 500 });
  }
}

// ✅ GET - جلب المشتركين (يتطلب authentication - للأدمن فقط)
export async function GET(request: NextRequest) {
  // التحقق من وجود كلمة المرور في الـ header
  const authHeader = request.headers.get('authorization');
  const adminPassword = process.env.ADMIN_PASSWORD || 'velix@2026';
  
  // ✅ مهم: GET بس هو اللي يحتاج authentication
  if (authHeader !== `Bearer ${adminPassword}`) {
    return NextResponse.json({ error: 'غير مصرح به - مطلوب تسجيل دخول الأدمن' }, { status: 401 });
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