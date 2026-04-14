const CACHE_NAME = 'velix-v2';
const ADMIN_CACHE_NAME = 'velix-admin-v2';

// الملفات الأساسية للموقع العادي
const STATIC_CACHE_URLS = [
  '/',
  '/products',
  '/about',
  '/contact',
  '/shipping',
  '/returns',
  '/privacy',
  '/terms',
  '/manifest.json',
  '/favicon.ico',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/apple-touch-icon.png'
];

// الملفات الأساسية للأدمن (بالمسار السري الجديد)
const ADMIN_SECRET_PATH = 'velix-admin-x7k9m';
const ADMIN_STATIC_URLS = [
  `/${ADMIN_SECRET_PATH}`,
  `/${ADMIN_SECRET_PATH}/products`,
  `/${ADMIN_SECRET_PATH}/orders`,
  `/${ADMIN_SECRET_PATH}/newsletter`,
  `/${ADMIN_SECRET_PATH}/login`,
  `/${ADMIN_SECRET_PATH}/add-product`,
  `/${ADMIN_SECRET_PATH}/print-multi`,
  '/admin-manifest.json'
];

// تثبيت الـ Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_CACHE_URLS)),
      caches.open(ADMIN_CACHE_NAME).then(cache => cache.addAll(ADMIN_STATIC_URLS))
    ]).catch(err => console.log('[SW] Cache add error:', err))
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
            console.log('[SW] Deleting old cache:', cache);
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
  
  // للـ API - نحاول نعتمد على الشبكة أولاً
  if (event.request.method !== 'GET') {
    return;
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
  
  // Network First مع fallback للـ cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        const cacheName = url.pathname.startsWith(`/${ADMIN_SECRET_PATH}`) ? ADMIN_CACHE_NAME : CACHE_NAME;
        caches.open(cacheName).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) return cachedResponse;
        
        // لو في الأدمن ومفيش cache، روح للـ login
        if (url.pathname.startsWith(`/${ADMIN_SECRET_PATH}`) && !url.pathname.includes('/login')) {
          return caches.match(`/${ADMIN_SECRET_PATH}/login`);
        }
        
        // لو في الموقع العادي، روح للرئيسية
        return caches.match('/');
      })
  );
});

// إشعارات للأدمن
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || 'VELIX Admin';
  const options = {
    body: data.body || 'حدث جديد في لوحة التحكم',
    icon: '/android-chrome-192x192.png',
    badge: '/favicon-32x32.png',
    data: { url: data.url || `/${ADMIN_SECRET_PATH}/orders` },
    vibrate: [200, 100, 200]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || `/${ADMIN_SECRET_PATH}/orders`)
  );
});