// Guarda la página en el celu (se regenera con cada versión: 74a0e8d7f8).
// Los datos (script.google.com) NO pasan por acá: siempre van a Google.
const CACHE = 'finanzas-74a0e8d7f8';
const ARCHIVOS = ['./', 'index.html', 'manifest.webmanifest', 'icon.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

// Primero lo guardado (instantáneo) y, de fondo, la versión nueva para la próxima vez.
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(c => c.match(e.request, { ignoreSearch: true }).then(guardado => {
    const red = fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => guardado);
    return guardado || red;
  })));
});
