// proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  
  console.log('🔍 Proxy check:', pathname, method);
  
  // ✅ المسارات المفتوحة للجميع (العملاء)
  const publicPaths = [
    '/api/orders',        // إنشاء طلب جديد
    '/api/orders-simple', // API بسيط للاختبار
    '/api/products',      // عرض المنتجات
    '/api/analytics',     // عرض الإحصائيات
    '/api/test-db',       // اختبار قاعدة البيانات
    '/api/test-redis',    // اختبار Redis
    '/api/test',          // اختبار عام
    '/api/newsletter',    // ✅ النشرة البريدية - الاشتراك (POST) مفتوح للجميع
    '/api/admin/verify', // 🔥 الحل هنا
  ];
  
  // ✅ لو المسار مفتوح للجميع، سمح بالدخول
  if (publicPaths.includes(pathname)) {
    console.log('✅ Public path allowed:', pathname);
    return NextResponse.next();
  }
  
  // ✅ GET للمنتجات مفتوح للجميع
  if (pathname === '/api/products' && method === 'GET') {
    return NextResponse.next();
  }
  
  // ✅ POST للطلبات مفتوح للجميع
  if (pathname === '/api/orders' && method === 'POST') {
    return NextResponse.next();
  }
  
  // ✅ POST للنشرة البريدية (اشتراك) مفتوح للجميع
  if (pathname === '/api/newsletter' && method === 'POST') {
    console.log('✅ Newsletter POST allowed (public)');
    return NextResponse.next();
  }
  
  // ✅ PUT للنشرة البريدية (تعديل الإيميل) - مفتوح للجميع
  if (pathname === '/api/newsletter' && method === 'PUT') {
    console.log('✅ Newsletter PUT allowed (public)');
    return NextResponse.next();
  }
  
  // ✅ DELETE للنشرة البريدية (إلغاء الاشتراك) - مفتوح للجميع
  if (pathname === '/api/newsletter' && method === 'DELETE') {
    console.log('✅ Newsletter DELETE allowed (public)');
    return NextResponse.next();
  }
  
  // ✅ GET للنشرة البريدية (جلب المشتركين) - يتطلب توثيق الأدمن
  if (pathname === '/api/newsletter' && method === 'GET') {
    const adminAuth = request.cookies.get('adminAuth')?.value;
    if (!adminAuth || adminAuth !== 'true') {
      console.log('🔒 Admin auth required for GET /api/newsletter');
      return NextResponse.json(
        { error: 'غير مصرح به - تحتاج صلاحيات مدير' },
        { status: 401 }
      );
    }
    console.log('✅ Admin authorized for GET /api/newsletter');
    return NextResponse.next();
  }
  
  // ✅ باقي المسارات تتطلب توثيق للمسؤول
  const adminAuth = request.cookies.get('adminAuth')?.value;
  
  if (!adminAuth || adminAuth !== 'true') {
    console.log('🔒 Admin auth required for:', pathname);
    return NextResponse.json(
      { error: 'غير مصرح به - تحتاج صلاحيات مدير' },
      { status: 401 }
    );
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};