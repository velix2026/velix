import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_SECRET_PATH = 'velix-admin-x7k9m';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'velix@2026';

export function proxy(request: NextRequest) {
  const { pathname, protocol, host } = request.nextUrl;
  const method = request.method;

  if (protocol === 'http:') {
    const httpsUrl = new URL(`https://${host}${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(httpsUrl, 301);
  }

  if (host.startsWith('www.')) {
    const nonWwwUrl = new URL(`https://${host.slice(4)}${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(nonWwwUrl, 301);
  }

  const publicAdminApis = [
    `/api/${ADMIN_SECRET_PATH}/verify`,
    `/api/${ADMIN_SECRET_PATH}/setup`,
    `/api/${ADMIN_SECRET_PATH}/login`,
    `/api/${ADMIN_SECRET_PATH}/verify-session`,
  ];
  if (publicAdminApis.includes(pathname)) {
    return NextResponse.next();
  }

  if (pathname === '/api/blog' && method === 'GET') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin') && !pathname.startsWith(`/${ADMIN_SECRET_PATH}`)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (pathname.startsWith(`/${ADMIN_SECRET_PATH}`)) {
    const adminAuth = request.cookies.get('adminAuth')?.value;
    const adminToken = request.cookies.get('admin_token')?.value;
    const isLoginPage = pathname === `/${ADMIN_SECRET_PATH}/login`;

    if (!isLoginPage && adminAuth !== 'true' && !(adminToken && adminToken.length > 20)) {
      const loginUrl = new URL(`/${ADMIN_SECRET_PATH}/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  if (pathname === '/api/products' && method === 'GET') {
    return NextResponse.next();
  }

  if (pathname === '/api/orders' && method === 'POST') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/orders/track') && method === 'GET') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/loyalty') && method === 'GET') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/reviews') && !pathname.startsWith(`/api/${ADMIN_SECRET_PATH}`)) {
    return NextResponse.next();
  }

  if (pathname === '/api/track' && method === 'POST') {
    return NextResponse.next();
  }

  if (pathname === '/api/indexnow' && method === 'GET') {
    return NextResponse.next();
  }

  const arabicSlugMap: Record<string, string> = {
    'تيشرتات': 'tshirts',
    'هوديز': 'hoodies',
    'شروال': 'pants',
    'جينز': 'jeans',
    'جواكت': 'jackets',
    'شوزات': 'shoes',
    'اكسسوارات': 'accessories',
  };
  for (const [arabic, english] of Object.entries(arabicSlugMap)) {
    if (pathname === `/collections/${encodeURIComponent(arabic)}` || pathname === `/collections/${arabic}`) {
      return NextResponse.redirect(new URL(`/collections/${english}`, request.url), 301);
    }
  }

  if (pathname === '/api/newsletter' && ['POST', 'PUT', 'DELETE'].includes(method)) {
    return NextResponse.next();
  }

  if (pathname.startsWith(`/api/${ADMIN_SECRET_PATH}`)) {
    const authHeader = request.headers.get('authorization');
    if (authHeader === `Bearer ${ADMIN_PASSWORD}`) {
      return NextResponse.next();
    }

    const adminAuth = request.cookies.get('adminAuth')?.value;
    if (adminAuth === 'true') {
      return NextResponse.next();
    }

    const adminToken = request.cookies.get('admin_token')?.value;
    if (adminToken && adminToken.length > 20) {
      return NextResponse.next();
    }

    return NextResponse.json({ error: 'غير مصرح به' }, { status: 401 });
  }

  if (pathname.startsWith('/api/admin/')) {
    return NextResponse.json({ error: 'API غير متاح' }, { status: 404 });
  }

  if (pathname.startsWith('/api/products/') && (method === 'PATCH' || method === 'DELETE')) {
    const authHeader = request.headers.get('authorization');
    if (authHeader === `Bearer ${ADMIN_PASSWORD}`) {
      return NextResponse.next();
    }
    const adminAuth = request.cookies.get('adminAuth')?.value;
    if (adminAuth === 'true') {
      return NextResponse.next();
    }
    const adminToken = request.cookies.get('admin_token')?.value;
    if (adminToken && adminToken.length > 20) {
      return NextResponse.next();
    }
    return NextResponse.json({ error: 'غير مصرح به' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/|sw.js|manifest.json|android-chrome|apple-touch-icon|favicon|site\\.webmanifest|llms\\.txt|opengraph-image|Stamp\\.png).*)',
  ],
};
