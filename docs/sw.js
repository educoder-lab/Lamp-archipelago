/* ランプ諸島 PWA — 静的アセットをキャッシュ（初回訪問後オフライン閲覧・学習用） */
const CACHE = 'lamp-archipelago-v14';
const PRECACHE = [
  './',
  './index.html',
  './map.html',
  './lesson.html',
  './ref.html',
  './manifest.webmanifest',
  './icon.svg',
  './lamp-save.js',
  './lamp-cloud.js',
  './lamp-markdown.js',
  './lamp-slides.js',
  './lamp-slides.css',
  './lamp-world.js',
  './lamp-world.css',
  './island-themes.js',
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
  // HTML/JS/CSS はネットワーク優先（テーマ更新がすぐ見える）
  const netFirst = /\.(?:html?|js|css|webmanifest)$/i.test(url.pathname) || url.pathname.endsWith('/');
  if (netFirst) {
    event.respondWith(
      fetch(event.request).then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(event.request, copy));
        }
        return res;
      }).catch(() => caches.match(event.request))
    );
    return;
  }
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
