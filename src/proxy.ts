// proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  
  console.log('🔍 Proxy check:', pathname, method);
  
  // ✅ المسارات المفتوحة للجميع (العملاء)
  const publicPaths = [
    '/api/orders',
    '/api/orders-simple',
    '/api/products',
    '/api/analytics',
    '/api/test-db',
    '/api/test-redis',
    '/api/test',
    '/api/newsletter',
    '/api/admin/verify',
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
  
  // ==================== مسارات الأدمن (تتطلب توثيق) ====================
  
  // ✅ التحقق العام لمسارات الأدمن
  const isAdminRoute = pathname.startsWith('/api/admin/');
  
  if (isAdminRoute) {
    const authHeader = request.headers.get('authorization');
    const adminPassword = process.env.ADMIN_PASSWORD || 'velix@2026';
    
    if (authHeader !== `Bearer ${adminPassword}`) {
      console.log('🔒 Admin auth required for:', pathname);
      return NextResponse.json(
        { error: 'غير مصرح به - تحتاج صلاحيات مدير' },
        { status: 401 }
      );
    }
    console.log('✅ Admin authorized for:', pathname);
    return NextResponse.next();
  }
  
  // ✅ PATCH للمنتجات (تعديل منتج) - يتطلب توثيق الأدمن
  if (pathname.startsWith('/api/products/') && method === 'PATCH') {
    const authHeader = request.headers.get('authorization');
    const adminPassword = process.env.ADMIN_PASSWORD || 'velix@2026';
    
    if (authHeader !== `Bearer ${adminPassword}`) {
      console.log('🔒 Admin auth required for PATCH product:', pathname);
      return NextResponse.json(
        { error: 'غير مصرح به - تحتاج صلاحيات مدير' },
        { status: 401 }
      );
    }
    console.log('✅ Admin authorized for PATCH product:', pathname);
    return NextResponse.next();
  }
  
  // ✅ DELETE للمنتجات (حذف منتج) - يتطلب توثيق الأدمن
  if (pathname.startsWith('/api/products/') && method === 'DELETE') {
    const authHeader = request.headers.get('authorization');
    const adminPassword = process.env.ADMIN_PASSWORD || 'velix@2026';
    
    if (authHeader !== `Bearer ${adminPassword}`) {
      console.log('🔒 Admin auth required for DELETE product:', pathname);
      return NextResponse.json(
        { error: 'غير مصرح به - تحتاج صلاحيات مدير' },
        { status: 401 }
      );
    }
    console.log('✅ Admin authorized for DELETE product:', pathname);
    return NextResponse.next();
  }
  
  // ✅ GET للطلبات (جلب الطلبات) - يتطلب توثيق الأدمن
  if (pathname === '/api/admin/orders' && method === 'GET') {
    const authHeader = request.headers.get('authorization');
    const adminPassword = process.env.ADMIN_PASSWORD || 'velix@2026';
    
    if (authHeader !== `Bearer ${adminPassword}`) {
      console.log('🔒 Admin auth required for GET /api/admin/orders');
      return NextResponse.json(
        { error: 'غير مصرح به - تحتاج صلاحيات مدير' },
        { status: 401 }
      );
    }
    console.log('✅ Admin authorized for GET /api/admin/orders');
    return NextResponse.next();
  }
  
  // ✅ DELETE للطلبات - يتطلب توثيق الأدمن
  if (pathname.startsWith('/api/admin/orders/') && method === 'DELETE') {
    const authHeader = request.headers.get('authorization');
    const adminPassword = process.env.ADMIN_PASSWORD || 'velix@2026';
    
    if (authHeader !== `Bearer ${adminPassword}`) {
      console.log('🔒 Admin auth required for DELETE:', pathname);
      return NextResponse.json(
        { error: 'غير مصرح به - تحتاج صلاحيات مدير' },
        { status: 401 }
      );
    }
    console.log('✅ Admin authorized for DELETE:', pathname);
    return NextResponse.next();
  }
  
  // ✅ PATCH للطلبات (تحديث الحالة) - يتطلب توثيق الأدمن
  if (pathname.startsWith('/api/orders/') && method === 'PATCH') {
    const authHeader = request.headers.get('authorization');
    const adminPassword = process.env.ADMIN_PASSWORD || 'velix@2026';
    
    if (authHeader !== `Bearer ${adminPassword}`) {
      console.log('🔒 Admin auth required for PATCH:', pathname);
      return NextResponse.json(
        { error: 'غير مصرح به - تحتاج صلاحيات مدير' },
        { status: 401 }
      );
    }
    console.log('✅ Admin authorized for PATCH:', pathname);
    return NextResponse.next();
  }
  
  // ✅ GET للنشرة البريدية (جلب المشتركين) - يتطلب توثيق الأدمن
  if (pathname === '/api/newsletter' && method === 'GET') {
    const authHeader = request.headers.get('authorization');
    const adminPassword = process.env.ADMIN_PASSWORD || 'velix@2026';
    
    if (authHeader !== `Bearer ${adminPassword}`) {
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
  const authHeader = request.headers.get('authorization');
  const adminPassword = process.env.ADMIN_PASSWORD || 'velix@2026';
  
  if (authHeader !== `Bearer ${adminPassword}`) {
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