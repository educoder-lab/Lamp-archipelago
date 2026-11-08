/* ランプ諸島 PWA — 静的アセットをキャッシュ（初回訪問後オフライン閲覧・学習用） */
const CACHE = 'lamp-archipelago-v2';
const PRECACHE = [
  './',
  './index.html',
  './map.html',
  './lesson.html',
  './ref.html',
  './manifest.webmanifest',
  './icon.svg',
  './lamp-save.js',
  './lamp-markdown.js',
  './save-data.js',
  './data/quests.json',
  './data/refs.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request).then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(event.request, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
