// lib/email.ts
export const runtime = 'nodejs';

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
  landmark?: string;
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    selectedSize?: string;
    selectedColor?: string;
  }>;
  totalAmount: number;
  notes?: string;
}

export async function sendOrderEmail(order: OrderEmailData) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  
  // ✅ إضافة 20+ لرقم العميل للواتساب
  const formatPhoneForWhatsApp = (phone: string) => {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '20' + cleaned.substring(1);
    } else if (!cleaned.startsWith('20')) {
      cleaned = '20' + cleaned;
    }
    return cleaned;
  };

  const customerPhoneFormatted = formatPhoneForWhatsApp(order.phone);
  
  // ✅ رسالة واتساب احترافية باللهجة المصرية
  const generateWhatsAppMessage = () => {
    let productsList = '';
    order.items.forEach((item, idx) => {
      productsList += `%0a• ${idx + 1}- ${item.name} (${item.quantity} قطعة)`;
      if (item.selectedSize) productsList += ` - مقاس ${item.selectedSize}`;
      if (item.selectedColor) productsList += ` - لون ${item.selectedColor}`;
    });

    return `مرحباً يا فندم ${order.name}، عامل إيه؟ 😊%0a%0a✅ تم استلام طلبك رقم #${order.orderId} من متجر VELIX%0a%0a📦 تفاصيل طلبك:${productsList}%0a%0a💰 الإجمالي: ${order.totalAmount} جنيه%0a%0a📍 عنوان التوصيل: ${order.address}%0a📍 علامة مميزة: ${order.landmark || 'غير مذكورة'}%0a%0a⏳ هنتواصل معاك خلال 24 ساعة عشان نأكد الطلب وننسق معاك التوصيل.%0a%0aشكراً لتسوقك مع VELIX - بنتمنى الطلب يعجبك يا رب ❤️🚀`;
  };

  const whatsappLink = `https://wa.me/${customerPhoneFormatted}?text=${generateWhatsAppMessage()}`;
  
  // ✅ بناء HTML الإيميل
  const itemsHtml = order.items.map((item, idx) => `
    <div style="background: #f9f9f9; border-radius: 12px; padding: 12px; margin-bottom: 12px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span style="font-weight: bold;">${idx + 1}. ${item.name}</span>
        <span style="font-weight: bold;">${item.price} جنيه × ${item.quantity}</span>
      </div>
      <div style="display: flex; gap: 10px; margin-top: 5px;">
        ${item.selectedSize ? `<span style="background: #e0e0e0; padding: 4px 8px; border-radius: 8px; font-size: 12px;">📏 مقاس: ${item.selectedSize}</span>` : ''}
        ${item.selectedColor ? `<span style="background: #e0e0e0; padding: 4px 8px; border-radius: 8px; font-size: 12px;">🎨 لون: ${item.selectedColor}</span>` : ''}
      </div>
    </div>
  `).join('');

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
        .contact-card { background: #f0fdf4; border: 1px solid #86efac; border-radius: 12px; padding: 16px; text-align: center; margin-top: 15px; }
        .phone-number { font-size: 20px; font-weight: bold; color: #25D366; direction: ltr; }
        .items-container { margin-top: 10px; }
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
              <span style="color: green; font-size: 12px; margin-right: 10px;">+20</span>
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
          <div class="section-title">📦 تفاصيل المنتجات</div>
          <div class="items-container">
            ${itemsHtml}
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
        
        <div class="section" style="text-align: center; background: #fafafa;">
          <div class="contact-card">
            <p style="margin: 0 0 8px 0; color: #333; font-weight: bold;">📱 تواصل مع العميل</p>
            <p style="margin: 0 0 12px 0; color: #666; font-size: 13px;">
              اضغط على الزر لفتح محادثة واتساب مع <strong>${order.name}</strong>
            </p>
            <a href="${whatsappLink}" class="whatsapp-btn" target="_blank">
              💬 تواصل مع العميل عبر واتساب
            </a>
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
    subject: `🛍️ طلب جديد #${order.orderId} - ${order.items.length} منتج - ${order.totalAmount} جنيه`,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent for order ${order.orderId}`, info.messageId);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}