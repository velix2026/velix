// lib/email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export interface OrderEmailData {
  orderId: string;
  name: string;
  phone: string;
  altPhone?: string;
  address: string;
  landmark?: string;        // ✅ إضافة العلامة المميزة
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  totalAmount: number;
  size?: string;
  color?: string;
  notes?: string;
}

export async function sendOrderEmail(order: OrderEmailData) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  
  // ✅ رابط واتساب جاهز للتواصل مع العميل
  const whatsappLink = `https://wa.me/${order.phone}?text=مرحباً ${order.name}، تم استلام طلبك رقم #${order.orderId} ✅%0a%0a📦 تفاصيل الطلب:%0a• المنتج: ${order.productName}%0a• الكمية: ${order.quantity} قطعة%0a• ${order.size ? `المقاس: ${order.size}%0a• ` : ''}${order.color ? `اللون: ${order.color}%0a• ` : ''}💰 الإجمالي: ${order.totalAmount} جنيه%0a%0a📍 العنوان: ${order.address}%0a📍 علامة مميزة: ${order.landmark || 'غير مذكورة'}%0a%0aسيتم التواصل معك لتأكيد الطلب قريباً. شكراً لتسوقك مع VELIX 🚀`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>طلب جديد #${order.orderId}</title>
      <style>
        body { font-family: 'Cairo', Tahoma, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: #000; color: white; padding: 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 5px 0 0; opacity: 0.8; font-size: 14px; }
        .order-id { background: #f0f0f0; padding: 12px; text-align: center; font-size: 18px; font-weight: bold; color: #333; border-bottom: 1px solid #e0e0e0; }
        .section { padding: 20px; border-bottom: 1px solid #eee; }
        .section-title { font-size: 18px; font-weight: bold; color: #333; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #000; display: inline-block; }
        .info-row { display: flex; margin-bottom: 10px; padding: 8px 0; border-bottom: 1px dashed #eee; }
        .info-label { width: 120px; font-weight: bold; color: #666; }
        .info-value { flex: 1; color: #333; }
        .product-details { background: #f9f9f9; border-radius: 12px; padding: 15px; margin-top: 10px; }
        .product-row { display: flex; margin-bottom: 8px; }
        .product-label { width: 100px; font-weight: bold; color: #666; }
        .product-value { flex: 1; color: #333; }
        .total { background: #000; color: white; padding: 15px; text-align: center; font-size: 20px; font-weight: bold; }
        .footer { background: #f5f5f5; padding: 15px; text-align: center; color: #999; font-size: 12px; }
        .whatsapp-btn { 
          display: inline-block; 
          background: #25D366; 
          color: white; 
          padding: 14px 28px; 
          border-radius: 40px; 
          text-decoration: none; 
          margin-top: 15px; 
          font-weight: bold;
          font-size: 16px;
          transition: transform 0.2s;
        }
        .whatsapp-btn:hover { transform: scale(1.02); }
        .badge { display: inline-block; background: #e0e0e0; padding: 4px 8px; border-radius: 8px; font-size: 12px; margin-left: 5px; }
        .contact-card { background: #f0fdf4; border: 1px solid #86efac; border-radius: 12px; padding: 16px; text-align: center; margin-top: 15px; }
        .phone-number { font-size: 20px; font-weight: bold; color: #25D366; direction: ltr; }
        .landmark-box { background: #fef9e6; border: 1px solid #fcd34d; border-radius: 12px; padding: 12px; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🛍️ VELIX</h1>
          <p>طلب جديد - تواصل مع العميل</p>
        </div>
        
        <div class="order-id">
          🔖 رقم الطلب: #${order.orderId}
        </div>
        
        <div class="section">
          <div class="section-title">👤 معلومات العميل</div>
          <div class="info-row">
            <div class="info-label">الاسم:</div>
            <div class="info-value"><strong>${order.name}</strong></div>
          </div>
          <div class="info-row">
            <div class="info-label">رقم الهاتف:</div>
            <div class="info-value">
              <span class="phone-number">${order.phone}</span>
            </div>
          </div>
          ${order.altPhone ? `
          <div class="info-row">
            <div class="info-label">هاتف آخر:</div>
            <div class="info-value">${order.altPhone}</div>
          </div>
          ` : ''}
          <div class="info-row">
            <div class="info-label">العنوان:</div>
            <div class="info-value">${order.address}</div>
          </div>
          ${order.landmark ? `
          <div class="info-row">
            <div class="info-label">📍 علامة مميزة:</div>
            <div class="info-value">
              <span style="background: #fef9e6; padding: 4px 8px; border-radius: 8px; display: inline-block;">
                ${order.landmark}
              </span>
            </div>
          </div>
          ` : ''}
        </div>
        
        <div class="section">
          <div class="section-title">📦 تفاصيل المنتج</div>
          <div class="product-details">
            <div class="product-row">
              <div class="product-label">🆔 رقم المنتج:</div>
              <div class="product-value"><strong>${order.productId}</strong></div>
            </div>
            <div class="product-row">
              <div class="product-label">📌 اسم المنتج:</div>
              <div class="product-value"><strong>${order.productName}</strong></div>
            </div>
            <div class="product-row">
              <div class="product-label">💰 سعر القطعة:</div>
              <div class="product-value">${order.productPrice} جنيه</div>
            </div>
            <div class="product-row">
              <div class="product-label">🔢 الكمية:</div>
              <div class="product-value">${order.quantity} قطعة</div>
            </div>
            ${order.size ? `
            <div class="product-row">
              <div class="product-label">📏 المقاس:</div>
              <div class="product-value">${order.size}</div>
            </div>
            ` : ''}
            ${order.color ? `
            <div class="product-row">
              <div class="product-label">🎨 اللون:</div>
              <div class="product-value">
                <span style="display: inline-block; width: 16px; height: 16px; background: ${order.color}; border-radius: 50%; margin-left: 5px; border: 1px solid #ccc;"></span>
                ${order.color}
              </div>
            </div>
            ` : ''}
          </div>
        </div>
        
        ${order.notes ? `
        <div class="section">
          <div class="section-title">📝 ملاحظات العميل</div>
          <div style="background: #f9f9f9; padding: 12px; border-radius: 8px; margin-top: 10px;">
            ${order.notes}
          </div>
        </div>
        ` : ''}
        
        <div class="total">
          💰 الإجمالي الكلي: ${order.totalAmount} جنيه
        </div>
        
        <!-- ✅ زر التواصل مع العميل عبر واتساب -->
        <div class="section" style="text-align: center; background: #fafafa;">
          <div class="contact-card">
            <p style="margin: 0 0 8px 0; color: #333; font-weight: bold;">📱 تواصل مع العميل</p>
            <p style="margin: 0 0 12px 0; color: #666; font-size: 13px;">
              اضغط على الزر لفتح محادثة واتساب مع <strong>${order.name}</strong>
            </p>
            <a href="${whatsappLink}" class="whatsapp-btn" target="_blank">
              💬 تواصل مع العميل عبر واتساب
            </a>
            <div style="margin-top: 16px; padding: 12px; background: #fef3c7; border-radius: 12px; border-right: 4px solid #f59e0b;">
              <p style="margin: 0; font-size: 13px; color: #92400e;">
                ⚠️ <strong>هام:</strong> عند التواصل مع العميل، اطلب منه إرسال 
                <strong style="background: #fff; padding: 2px 6px; border-radius: 8px;">📍 "الموقع عبر واتساب"</strong> 
                لتأكيد العنوان وتسهيل التوصيل.
              </p>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p>تم إرسال هذا الإشعار من متجر VELIX</p>
          <p style="margin-top: 5px;">للتواصل السريع: <a href="tel:${order.phone}" style="color: #25D366;">اتصال</a> | <a href="${whatsappLink}" style="color: #25D366;">واتساب</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"VELIX Store" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: `🛍️ طلب جديد #${order.orderId} - ${order.productName} - ${order.quantity} قطعة`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent for order ${order.orderId}`);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}