import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
    const batch = subscribers.slice(0, 50);
    
    for (const email of batch) {
      try {
        await transporter.sendMail({
          from: `"VELIX Store" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: subject,
          html: `
            <!DOCTYPE html>
            <html dir="rtl">
            <head>
              <meta charset="UTF-8">
              <title>${subject}</title>
              <style>
                body { font-family: 'Cairo', Tahoma, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #B76E79, #B87333); color: white; padding: 30px 20px; text-align: center; }
                .header h1 { margin: 0; font-size: 28px; }
                .content { padding: 30px; color: #333; line-height: 1.6; }
                .shop-link { background: linear-gradient(135deg, #B76E79, #B87333); color: white; padding: 12px 24px; border-radius: 40px; text-decoration: none; display: inline-block; margin: 15px 0; }
                .footer { background: #f5f5f5; padding: 20px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🛍️ VELIX</h1>
                  <p>فخامة تسوق تستحقها</p>
                </div>
                <div class="content">
                  <h2 style="color: #B76E79;">${subject}</h2>
                  <div style="white-space: pre-line;">${body}</div>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://velix-eg.store'}/products" class="shop-link">
                      🛒 تسوق الآن
                    </a>
                  </div>
                </div>
                <div class="footer">
                  <p>© 2025 VELIX - جميع الحقوق محفوظة</p>
                  <p><a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://velix-eg.store'}" style="color: #B76E79;">velix-eg.store</a></p>
                  <p><a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://velix-eg.store'}/unsubscribe?email=${email}" style="color: #999;">إلغاء الإشتراك</a></p>
                </div>
              </div>
            </body>
            </html>
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