import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// المسارات المحمية التي تحتاج توثيق
const protectedPaths = [
  '/api/products/[id]',
  '/api/orders',
  '/api/orders/[id]',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // التحقق من أن المسار محمي
  const isProtected = protectedPaths.some(path => {
    const pattern = new RegExp(path.replace(/\[id\]/g, '\\d+'));
    return pattern.test(pathname);
  });
  
  if (isProtected) {
    // التحقق من وجود session في الـ headers
    const adminAuth = request.cookies.get('adminAuth')?.value;
    
    if (!adminAuth || adminAuth !== 'true') {
      return NextResponse.json(
        { error: 'غير مصرح به' },
        { status: 401 }
      );
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};