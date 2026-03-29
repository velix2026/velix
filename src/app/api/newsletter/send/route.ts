// app/api/newsletter/send/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { subject, body, subscribers } = await request.json();

    if (!subject || !body || !subscribers || subscribers.length === 0) {
      return NextResponse.json({ error: 'بيانات غير مكتملة' }, { status: 400 });
    }

    let sentCount = 0;
    const errors: string[] = [];

    // إرسال لكل مشترك (بحد أقصى 50 في المرة عشان الـ Gmail limit)
    const batch = subscribers.slice(0, 50);
    
    for (const email of batch) {
      try {
        await transporter.sendMail({
          from: `"VELIX Store" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: subject,
          html: `
            <div dir="rtl" style="font-family: 'Cairo', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: #000; color: white; padding: 20px; text-align: center; border-radius: 20px 20px 0 0;">
                <h1 style="margin: 0;">🛍️ VELIX</h1>
              </div>
              <div style="background: #fff; padding: 30px; border: 1px solid #eee; border-radius: 0 0 20px 20px;">
                <h2 style="color: #000; margin-bottom: 20px;">${subject}</h2>
                <div style="color: #333; line-height: 1.6;">
                  ${body.replace(/\n/g, '<br/>')}
                </div>
                <hr style="margin: 20px 0; border-color: #eee;" />
                <p style="color: #999; font-size: 12px; text-align: center;">
                  تم إرسال هذه الرسالة من متجر VELIX - <a href="${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?email=${email}" style="color: #999;">إلغاء الإشتراك</a>
                </p>
              </div>
            </div>
          `,
        });
        sentCount++;
      } catch (error) {
        errors.push(email);
        console.error(`Failed to send to ${email}:`, error);
      }
    }

    return NextResponse.json({ 
      success: true, 
      sent: sentCount,
      failed: errors,
      message: `تم الإرسال إلى ${sentCount} مشترك`
    });

  } catch (error) {
    console.error('Broadcast error:', error);
    return NextResponse.json({ error: 'حدث خطأ في الإرسال' }, { status: 500 });
  }
}