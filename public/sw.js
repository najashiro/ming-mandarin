const CACHE = 'ming-public-v2';
const PUBLIC_ROUTES = new Set([
  '/', '/lesson/1', '/lesson/1/vocabulary', '/lesson/1/pinyin', '/lesson/1/listening',
  '/lesson/1/grammar', '/lesson/1/hanzi', '/lesson/1/dialogues', '/lesson/1/reading',
  '/lesson/1/games', '/leaderboard',
]);
const SHELL = ['/', '/offline.html', '/favicon.svg', '/og.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/') || url.pathname.startsWith('/login')) return;

  event.respondWith(fetch(event.request).then((response) => {
    const isPublicNavigation = event.request.mode === 'navigate' && PUBLIC_ROUTES.has(url.pathname);
    if (response.ok && isPublicNavigation) caches.open(CACHE).then((cache) => cache.put(event.request, response.clone()));
    return response;
  }).catch(async () => {
    const cached = await caches.match(event.request);
    if (cached) return cached;
    if (event.request.mode === 'navigate') return (await caches.match('/offline.html')) || Response.error();
    return Response.error();
  }));
});
