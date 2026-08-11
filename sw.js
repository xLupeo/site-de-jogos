/* =====================================================================
   ARCADE Setor 7 — Service Worker (PWA)
   Estratégias:
     • Navegação (HTML): network-first com fallback ao cache (offline).
     • Estáticos do próprio site (ícones/manifest): cache-first.
     • Google Fonts: stale-while-revalidate (funciona offline após 1ª visita).
     • API do placar (/api/leaderboard): SEMPRE rede (nunca cacheia).
   Atualização: novo SW assume na hora (skipWaiting + clients.claim) e avisa
   as abas (postMessage 'sw-updated') para recarregarem.
===================================================================== */
const VERSION = 'arcade-v1.7.0';
const APP_CACHE = 'app-' + VERSION;
const RUNTIME   = 'runtime-' + VERSION;
const FONTS     = 'fonts-' + VERSION;

// App shell — o essencial para abrir offline.
const PRECACHE = [
  '/', '/index.html',
  '/site.webmanifest',
  '/favicon.ico', '/favicon.svg',
  '/apple-touch-icon.png',
  '/icon-48.png', '/icon-192.png', '/icon-512.png',
  '/icon-192-maskable.png', '/icon-512-maskable.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(APP_CACHE);
    // addAll falha se algum item faltar; então adicionamos tolerando ausências.
    await Promise.all(PRECACHE.map(async (url) => {
      try { const res = await fetch(url, { cache: 'no-cache' }); if (res.ok) await cache.put(url, res); } catch (e) {}
    }));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => {
      if (![APP_CACHE, RUNTIME, FONTS].includes(k)) return caches.delete(k);
    }));
    await self.clients.claim();
    // Avisa as abas que há uma versão nova ativa.
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach((c) => c.postMessage({ type: 'sw-updated', version: VERSION }));
  })());
});

// Permite forçar atualização pela página.
self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'skip-waiting') self.skipWaiting();
});

function isHTML(req) {
  return req.mode === 'navigate' ||
    (req.headers.get('accept') || '').includes('text/html');
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return; // POSTs do placar passam direto

  const url = new URL(req.url);

  // 1) API do placar: sempre rede (sem cache).
  if (url.pathname.startsWith('/api/')) return;

  // 2) Navegação (HTML): network-first → cache → offline.
  if (isHTML(req)) {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(APP_CACHE);
        cache.put('/index.html', fresh.clone());
        return fresh;
      } catch (e) {
        const cache = await caches.open(APP_CACHE);
        return (await cache.match(req)) ||
               (await cache.match('/index.html')) ||
               (await cache.match('/')) ||
               new Response('Offline', { status: 503, headers: { 'content-type': 'text/plain' } });
      }
    })());
    return;
  }

  // 3) Google Fonts (css + arquivos): stale-while-revalidate.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith((async () => {
      const cache = await caches.open(FONTS);
      const cached = await cache.match(req);
      const network = fetch(req).then((res) => { if (res && res.ok) cache.put(req, res.clone()); return res; }).catch(() => null);
      return cached || (await network) || new Response('', { status: 504 });
    })());
    return;
  }

  // 4) Estáticos do próprio site: cache-first, com atualização em segundo plano.
  if (url.origin === self.location.origin) {
    event.respondWith((async () => {
      const cache = await caches.open(RUNTIME);
      const cached = await cache.match(req);
      if (cached) {
        fetch(req).then((res) => { if (res && res.ok) cache.put(req, res.clone()); }).catch(() => {});
        return cached;
      }
      try {
        const res = await fetch(req);
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      } catch (e) {
        return new Response('', { status: 504 });
      }
    })());
  }
});
