// public/sw.js
const CACHE_NAME = 'velix-v1';
const ADMIN_CACHE_NAME = 'velix-admin-v1';

// الملفات الأساسية للموقع العادي
const STATIC_CACHE_URLS = [
  '/',
  '/products',
  '/about',
  '/contact',
  '/manifest.json',
  '/favicon.ico',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/apple-touch-icon.png'
];

// الملفات الأساسية للأدمن
const ADMIN_STATIC_URLS = [
  '/admin/dashboard',
  '/admin/products',
  '/admin/orders',
  '/admin/newsletter',
  '/admin-manifest.json'
];

// تثبيت الـ Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_CACHE_URLS)),
      caches.open(ADMIN_CACHE_NAME).then(cache => cache.addAll(ADMIN_STATIC_URLS))
    ])
  );
  self.skipWaiting();
});

// تفعيل
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME && cache !== ADMIN_CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// جلب البيانات
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // حماية صفحات الأدمن - لو مش مسجل، يتحول للـ login
  if (url.pathname.startsWith('/admin/') && !url.pathname.includes('/admin/login')) {
    // هنتعامل معاها من الـ frontend
  }
  
  // للـ API
  if (event.request.method !== 'GET') {
    return event.respondWith(fetch(event.request));
  }
  
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // Network First
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        const cacheName = url.pathname.startsWith('/admin/') ? ADMIN_CACHE_NAME : CACHE_NAME;
        caches.open(cacheName).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) return cachedResponse;
        
        if (url.pathname.startsWith('/admin/')) {
          return caches.match('/admin/login');
        }
        return caches.match('/');
      })
  );
});

// إشعارات
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || 'VELIX Admin';
  const options = {
    body: data.body || 'حدث جديد',
    icon: '/android-chrome-192x192.png',
    badge: '/favicon-32x32.png',
    data: { url: data.url || '/admin/orders' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/admin/orders')
  );
});