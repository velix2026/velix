import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const WHATSAPP_NUMBER = '201500125133';
const ADMIN_WHATSAPP = '201500125133'; // رقم الـ Admin لتلقي الإشعارات

async function getAllOrders() {
  const keys = await kv.keys('order:*');
  const orders = await Promise.all(
    keys.map(async (key) => {
      const order = await kv.hgetall(key);
      return { id: key.split(':')[1], ...order };
    })
  );
  return orders.sort((a: any, b: any) => (b.createdAt > a.createdAt ? 1 : -1));
}

// إرسال إشعار للـ Admin
async function sendAdminNotification(order: any) {
  let adminMessage = `🔔 *طلب جديد #${order.orderId}*\n\n`;
  adminMessage += `👤 *الاسم:* ${order.name}\n`;
  adminMessage += `📱 *رقم الهاتف:* ${order.phone}\n`;
  adminMessage += `📍 *العنوان:* ${order.address}\n`;
  adminMessage += `📦 *المنتج:* ${order.product.name}\n`;
  adminMessage += `💰 *الإجمالي:* ${order.product.price * order.product.quantity} جنيه\n`;
  
  const adminUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(adminMessage)}`;
  
  // يمكن إرسال إشعار داخلي أو تسجيل في console
  console.log('New order notification:', adminUrl);
  
  return adminUrl;
}

export async function POST(request: NextRequest) {
  try {
    const order = await request.json();

    let whatsappMessage = `🛍️ *طلب منتج جديد من VELIX*\n\n`;
    whatsappMessage += `👤 *الاسم:* ${order.name}\n📱 *رقم الهاتف:* ${order.phone}\n`;
    if (order.altPhone) whatsappMessage += `📞 *هاتف آخر:* ${order.altPhone}\n`;
    whatsappMessage += `📍 *العنوان:* ${order.address}\n`;
    whatsappMessage += `━━━━━━━━━━━━━━━━━━━━\n`;
    whatsappMessage += `📦 *تفاصيل المنتج:*\n`;
    whatsappMessage += `• *المنتج:* ${order.product.name}\n`;
    whatsappMessage += `• *السعر:* ${order.product.price} جنيه\n`;
    whatsappMessage += `• *الكمية:* ${order.product.quantity}\n`;
    if (order.product.size) whatsappMessage += `• *المقاس:* ${order.product.size}\n`;
    if (order.product.color) whatsappMessage += `• *اللون:* ${order.product.color}\n`;
    whatsappMessage += `━━━━━━━━━━━━━━━━━━━━\n`;
    whatsappMessage += `💰 *الإجمالي:* ${order.product.price * order.product.quantity} جنيه\n`;
    if (order.notes) whatsappMessage += `📝 *ملاحظات:* ${order.notes}\n`;

    const orderId = Date.now().toString();
    await kv.hset(`order:${orderId}`, {
      ...order,
      orderId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // إرسال إشعار للـ Admin
    const adminNotification = await sendAdminNotification({ ...order, orderId });
    
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
    return NextResponse.json({ success: true, whatsappUrl, orderId, adminNotification });
  } catch (error) {
    console.error('Error processing order:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orders = await getAllOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}