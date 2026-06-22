const WHATSAPP_NUMBER = '201500125133';

const formatPhoneForWhatsApp = (phone: string) => {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '20' + cleaned.substring(1);
  } else if (!cleaned.startsWith('20')) {
    cleaned = '20' + cleaned;
  }
  return cleaned;
};

export function sendOrderWhatsApp(order: {
  orderId: string;
  name: string;
  phone: string;
  items: Array<{ name: string; quantity: number; price: number; selectedSize?: string; selectedColor?: string }>;
  totalAmount: number;
  deliveryEstimate?: string;
  paymentMethod?: string;
}) {
  let productsList = '';
  order.items.forEach((item, idx) => {
    productsList += `\n${idx + 1}- ${item.name}`;
    productsList += `\n   الكمية: ${item.quantity} قطعة`;
    productsList += `\n   السعر: ${item.price} جنيه`;
    if (item.selectedSize) productsList += `\n   المقاس: ${item.selectedSize}`;
    if (item.selectedColor) productsList += `\n   اللون: ${item.selectedColor}`;
    if (idx < order.items.length - 1) productsList += `\n   --------------------`;
  });

  const message = `أهلاً وسهلاً أستاذ ${order.name}،

تم استلام طلبك رقم #${order.orderId} من متجر VELIX

تفاصيل طلبك:
${productsList}

إجمالي المبلغ: ${order.totalAmount} جنيه
طريقة الدفع: ${order.paymentMethod || 'الدفع عند الاستلام'}
مدة التوصيل: ${order.deliveryEstimate || '2 - 5 أيام عمل'}

مهم جداً:
برجاء إرسال موقعك (لوكيشن) على الواتساب لتسهيل عملية التوصيل

شكراً لثقتك في VELIX
VELIX - فخامة تسوق تستحقها`;

  const customerPhone = formatPhoneForWhatsApp(order.phone);
  return `https://wa.me/${customerPhone}?text=${encodeURIComponent(message)}`;
}

export function getAdminWhatsAppLink(orderId: string) {
  const message = `🔔 طلب جديد #${orderId} من متجر VELIX`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppChannelLink() {
  return 'https://whatsapp.com/channel/0029VbCamY1JUM2iILsajJ3t';
}
