/* ランプ諸島 PWA — 静的アセットをキャッシュ（初回訪問後オフライン閲覧・学習用） */
const CACHE = 'lamp-archipelago-v25';
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
  './lamp-dungeon.js',
  './lamp-dungeon.css',
  './dungeon-geometry.js',
  './lamp-progress.js',
  './island-themes.js',
  './save-data.js',
  './data/quests.json',
  './data/refs.json',
  './data/hub-quest.json',
  './data/slides/hub.json',
  './assets/common/hero-back.jpg',
  './assets/common/hero-walk-1.jpg',
  './assets/common/hero-walk-2.jpg',
  './assets/common/hero-mid.jpg',
  './assets/common/hero-strong.jpg',
  './assets/common/spirit-aura.jpg',
  './assets/common/icon-shield.jpg',
  './assets/common/icon-sword.jpg',
  './assets/common/icon-spirit.jpg',
  './assets/common/icon-settings.jpg',
  './assets/common/icon-map.jpg',
  './assets/common/icon-lamp.jpg',
  './assets/rooms/hub/bg.jpg',
  './assets/rooms/hub/great-door-closed.jpg',
  './assets/rooms/hub/great-door-ajar.jpg',
  './assets/rooms/hub/elder.jpg',
  './assets/rooms/hub/elder-talk.jpg',
  './assets/rooms/hub/path-shield.jpg',
  './assets/rooms/hub/path-sword.jpg',
  './assets/rooms/shield/bg.jpg',
  './assets/rooms/shield/door.jpg',
  './assets/rooms/sword/bg.jpg',
  './assets/rooms/sword/door.jpg',
  './assets/rooms/spirit/bg.jpg',
  './assets/rooms/spirit/door.jpg',
  './assets/map/bg.jpg',
  './assets/map/hub-pin.jpg',
  './assets/map/pin-fog.jpg',
  './assets/map/pin-open.jpg',
  './assets/map/pin-current.jpg',
  './assets/map/pin-cleared.jpg',
  './assets/map/marker.jpg'
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
      if (cached) return cached;
      return fetch(event.request).then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(event.request, copy));
        }
        return res;
      });
    })
  );
});
