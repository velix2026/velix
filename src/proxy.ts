// proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_SECRET_PATH = 'velix-admin-x7k9m';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'velix@2026';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  
  console.log('🔍 Proxy check:', pathname, method);
  
  // ==================== 1. السماح لـ API التحقق (verify) ====================
  
  if (pathname === `/api/${ADMIN_SECRET_PATH}/verify` && method === 'POST') {
    console.log('✅ Verify API allowed (public)');
    return NextResponse.next();
  }
  
  // ==================== 2. منع الوصول للمسار القديم ====================
  
  if (pathname.startsWith('/admin') && !pathname.startsWith(`/${ADMIN_SECRET_PATH}`)) {
    console.log('🚫 Blocked old admin path:', pathname);
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // ==================== 3. مسارات الأدمن (الصفحات) ====================
  
  if (pathname.startsWith(`/${ADMIN_SECRET_PATH}`)) {
    const adminAuth = request.cookies.get('adminAuth')?.value;
    const isLoginPage = pathname === `/${ADMIN_SECRET_PATH}/login`;
    
    if (!isLoginPage && adminAuth !== 'true') {
      console.log('🔒 Redirecting to login, adminAuth:', adminAuth);
      const loginUrl = new URL(`/${ADMIN_SECRET_PATH}/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }
    
    return NextResponse.next();
  }
  
  // ==================== 4. المسارات المفتوحة للجميع ====================
  
  if (pathname === '/api/products' && method === 'GET') {
    return NextResponse.next();
  }
  
  if (pathname === '/api/orders' && method === 'POST') {
    return NextResponse.next();
  }
  
  if (pathname === '/api/newsletter' && ['POST', 'PUT', 'DELETE'].includes(method)) {
    return NextResponse.next();
  }
  
  // ==================== 5. مسارات API الأدمن (تتحقق من header أو cookie) ====================
  
  if (pathname.startsWith(`/api/${ADMIN_SECRET_PATH}`)) {
    // ✅ التحقق من Authorization header أولاً
    const authHeader = request.headers.get('authorization');
    if (authHeader === `Bearer ${ADMIN_PASSWORD}`) {
      console.log('✅ Admin authorized via header:', pathname);
      return NextResponse.next();
    }
    
    // ✅ ثم التحقق من الـ cookie
    const adminAuth = request.cookies.get('adminAuth')?.value;
    if (adminAuth === 'true') {
      console.log('✅ Admin authorized via cookie:', pathname);
      return NextResponse.next();
    }
    
    console.log('🔒 Unauthorized - no valid auth');
    return NextResponse.json({ error: 'غير مصرح به' }, { status: 401 });
  }
  
  // منع API الأدمن القديم
  if (pathname.startsWith('/api/admin/')) {
    return NextResponse.json({ error: 'API غير متاح' }, { status: 404 });
  }
  
  // ==================== 6. PATCH/DELETE للمنتجات ====================
  
  if (pathname.startsWith('/api/products/') && (method === 'PATCH' || method === 'DELETE')) {
    const authHeader = request.headers.get('authorization');
    if (authHeader === `Bearer ${ADMIN_PASSWORD}`) {
      return NextResponse.next();
    }
    const adminAuth = request.cookies.get('adminAuth')?.value;
    if (adminAuth !== 'true') {
      return NextResponse.json({ error: 'غير مصرح به' }, { status: 401 });
    }
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};