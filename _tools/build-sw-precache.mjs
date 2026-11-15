import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const assetsRoot = path.join(root, 'docs', 'assets');

function walkPngs(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'mood') continue;
      walkPngs(full, acc);
      continue;
    }
    if (/\.png$/i.test(ent.name)) {
      acc.push('./assets/' + path.relative(assetsRoot, full).replace(/\\/g, '/'));
    }
  }
  return acc;
}

const pngs = walkPngs(assetsRoot).sort();
const domainBgDir = path.join(assetsRoot, 'rooms', 'domains');
const domainBgs = fs.existsSync(domainBgDir)
  ? fs.readdirSync(domainBgDir)
    .filter((n) => /-bg\.jpe?g$/i.test(n))
    .sort()
    .map((n) => './assets/rooms/domains/' + n)
  : [];
const growthDir = path.join(assetsRoot, 'common', 'growth');
const growthIcons = fs.existsSync(growthDir)
  ? fs.readdirSync(growthDir)
    .filter((n) => /\.jpe?g$/i.test(n))
    .sort()
    .map((n) => './assets/common/growth/' + n)
  : [];
const equipDir = path.join(assetsRoot, 'common', 'equip');
const equipPlates = fs.existsSync(equipDir)
  ? fs.readdirSync(equipDir)
    .filter((n) => /\.jpe?g$/i.test(n))
    .sort()
    .map((n) => './assets/common/equip/' + n)
  : [];
const plates = [
  './assets/rooms/hub/bg.jpg',
  './assets/rooms/shield/bg.jpg',
  './assets/rooms/sword/bg.jpg',
  './assets/rooms/spirit/bg.jpg',
  ...domainBgs,
  ...growthIcons,
  ...equipPlates,
  './assets/common/hero-bare.jpg',
  './assets/common/hero-bare-walk-1.jpg',
  './assets/common/hero-bare-walk-2.jpg',
  './assets/common/hero-hold-bare.png',
  './assets/common/hero-hold-rear.png',
  './assets/map/bg.jpg',
  './assets/common/say-frame.jpg',
  './assets/common/app-icon.jpg',
  './assets/common/icon-notes.jpg',
  './assets/map/band-shield.jpg',
  './assets/map/band-sword.jpg',
  './assets/map/band-spirit.jpg',
  './assets/slides/fe-overview.jpg',
  './assets/slides/shield-sword.jpg'
];

const core = [
  './',
  './index.html',
  './map.html',
  './lesson.html',
  './ref.html',
  './manifest.webmanifest',
  './icon.svg',
  './icon.jpg',
  './lamp-save.js',
  './lamp-debug-notes.js',
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
  './data/slides/hub.json'
];

const all = [...core, ...pngs, ...plates];
const body = all.map((p) => `  '${p}'`).join(',\n');

const out = `/* ランプ諸島 PWA — 静的アセットをキャッシュ（初回訪問後オフライン閲覧・学習用） */
const CACHE = 'lamp-archipelago-v53';
const PRECACHE = [
${body}
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
  const netFirst = /\\.(?:html?|js|css|webmanifest)$/i.test(url.pathname) || url.pathname.endsWith('/');
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
`;

fs.writeFileSync(path.join(root, 'docs', 'sw.js'), out);
console.log('sw.js:', pngs.length, 'pngs +', plates.length, 'plates');
