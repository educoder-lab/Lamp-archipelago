/**
 * 室数保証のダンジョン俯瞰図（案A じゃばら確定）。
 * 拠点1 / 盾17 / 剣6 / 精神3+ゴール1。拠点から三方向。
 *
 * node _tools/render-dungeon-map.mjs
 * → docs/assets/map/bg.jpg（本番）
 * → docs/data/map-layout.json（ピン座標）
 * → docs/assets/mood/explore/map-exact-A-accordion.jpg（番号付き）
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

export const MAP_W = 1400;
export const MAP_H = 900;
export const COUNTS = { hub: 1, shield: 17, sword: 6, spirit: 3, goal: 1 };

/** 本番・ピン共通のじゃばらパラメータ */
export const ACCORDION = {
  shield: { side: -1, colsPrefer: 3, cell: 34, gap: 12, baseOut: 130 },
  sword: { side: 1, colsPrefer: 2, cell: 34, gap: 12, baseOut: 130 },
  spirit: { cell: 42, gap: 20 },
  hub: { x: MAP_W / 2, y: MAP_H - 110, r: 48 },
  goalOffsetY: 70
};

const COLORS = {
  bg: '#070a12',
  floor: '#121826',
  hub: '#3a4558',
  hubStroke: '#c9a84c',
  shield: '#2a4a6e',
  shieldStroke: '#e0a040',
  sword: '#3a2a55',
  swordStroke: '#b090ff',
  spirit: '#2a4a3a',
  spiritStroke: '#70c090',
  goal: '#1e4a38',
  goalStroke: '#d4c060',
  corridor: '#2a3344',
  text: '#9aa3b5'
};

export function accordionCenters(n, origin, opts) {
  const { cell = 36, gap = 14, colsPrefer = 3, side = -1, baseOut = 110 } = opts;
  const step = cell + gap;
  const cols = Math.max(1, colsPrefer);
  const rows = Math.ceil(n / cols);
  const pts = [];
  for (let i = 0; i < n; i++) {
    const col = Math.floor(i / rows);
    const rowInCol = i % rows;
    const row = col % 2 === 0 ? rowInCol : rows - 1 - rowInCol;
    const x = origin.x + side * (baseOut + col * step);
    const y = origin.y - (row + 1) * step;
    pts.push({ x, y, w: cell, h: cell });
  }
  return pts;
}

function spiritLine(n, origin, cell, gap) {
  const step = cell + gap;
  const pts = [];
  for (let i = 0; i < n; i++) {
    pts.push({ x: origin.x, y: origin.y - (i + 1) * step - 10, w: cell, h: cell });
  }
  return pts;
}

export function buildAccordionLayout() {
  const hub = { ...ACCORDION.hub, kind: 'hub' };
  const origin = { x: hub.x, y: hub.y - hub.r };
  const shield = accordionCenters(COUNTS.shield, origin, ACCORDION.shield).map((p) => ({
    ...p,
    kind: 'shield'
  }));
  const sword = accordionCenters(COUNTS.sword, origin, ACCORDION.sword).map((p) => ({
    ...p,
    kind: 'sword'
  }));
  const spirit = spiritLine(
    COUNTS.spirit,
    origin,
    ACCORDION.spirit.cell,
    ACCORDION.spirit.gap
  ).map((p) => ({ ...p, kind: 'spirit' }));
  const last = spirit[spirit.length - 1];
  const goal = {
    x: last.x,
    y: last.y - ACCORDION.goalOffsetY,
    w: 70,
    h: 58,
    kind: 'goal'
  };
  return { kind: 'accordion', width: MAP_W, height: MAP_H, hub, shield, sword, spirit, goal };
}

function assertCounts(layout) {
  const got = {
    hub: 1,
    shield: layout.shield.length,
    sword: layout.sword.length,
    spirit: layout.spirit.length,
    goal: 1
  };
  for (const k of Object.keys(COUNTS)) {
    if (got[k] !== COUNTS[k]) throw new Error(`count mismatch ${k}: ${got[k]} !== ${COUNTS[k]}`);
  }
  const all = [...layout.shield, ...layout.sword, ...layout.spirit, layout.goal];
  for (const r of all) {
    if (r.x < 20 || r.x > MAP_W - 20 || r.y < 20 || r.y > MAP_H - 20) {
      throw new Error(`room off-canvas @ ${r.x | 0},${r.y | 0}`);
    }
  }
  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      const dx = all[i].x - all[j].x;
      const dy = all[i].y - all[j].y;
      if (dx * dx + dy * dy < 18 * 18) throw new Error(`rooms overlap ${i}/${j}`);
    }
  }
  return got;
}

function corridor(x1, y1, x2, y2, thick = 14) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${COLORS.corridor}" stroke-width="${thick}" stroke-linecap="round"/>`;
}

function roomRect(r, fill, stroke, sw = 2.5) {
  return `<rect x="${r.x - r.w / 2}" y="${r.y - r.h / 2}" width="${r.w}" height="${r.h}" rx="5" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
}

function chainCorridors(hub, rooms) {
  let s = '';
  let prev = { x: hub.x, y: hub.y - hub.r };
  for (const r of rooms) {
    s += corridor(prev.x, prev.y, r.x, r.y);
    prev = r;
  }
  return s;
}

function toSvg(layout, { numbered = false, label = '' } = {}) {
  const { hub, shield, sword, spirit, goal } = layout;
  let body = '';
  body += `<rect x="0" y="0" width="${MAP_W}" height="${MAP_H}" fill="${COLORS.bg}"/>`;
  // soft floor wash
  body += `<rect x="40" y="40" width="${MAP_W - 80}" height="${MAP_H - 80}" rx="12" fill="${COLORS.floor}" opacity="0.55"/>`;

  body += chainCorridors(hub, shield);
  body += chainCorridors(hub, sword);
  body += chainCorridors(hub, spirit);
  body += corridor(spirit[spirit.length - 1].x, spirit[spirit.length - 1].y, goal.x, goal.y, 16);

  for (const r of shield) body += roomRect(r, COLORS.shield, COLORS.shieldStroke);
  for (const r of sword) body += roomRect(r, COLORS.sword, COLORS.swordStroke);
  for (const r of spirit) body += roomRect(r, COLORS.spirit, COLORS.spiritStroke);
  body += roomRect(goal, COLORS.goal, COLORS.goalStroke, 3.5);

  body += `<circle cx="${hub.x}" cy="${hub.y}" r="${hub.r}" fill="${COLORS.hub}" stroke="${COLORS.hubStroke}" stroke-width="3"/>`;
  body += `<circle cx="${hub.x}" cy="${hub.y}" r="16" fill="none" stroke="${COLORS.hubStroke}" stroke-width="2" opacity="0.75"/>`;

  if (numbered) {
    const mark = (rooms, color) =>
      rooms
        .map(
          (r, i) =>
            `<text x="${r.x}" y="${r.y + 3}" text-anchor="middle" font-size="9" font-family="Segoe UI,sans-serif" fill="${color}">${i + 1}</text>`
        )
        .join('');
    body += mark(shield, '#ffd090');
    body += mark(sword, '#e0d0ff');
    body += mark(spirit, '#b8ffd0');
    body += `<text x="${goal.x}" y="${goal.y + 4}" text-anchor="middle" font-size="11" font-family="Segoe UI,sans-serif" fill="#ffe9a0">G</text>`;
    body += `<text x="${hub.x}" y="${hub.y + 4}" text-anchor="middle" font-size="12" font-family="Segoe UI,sans-serif" fill="#ffe9a0">H</text>`;
    if (label) {
      body += `<text x="24" y="28" font-size="14" font-family="Segoe UI,sans-serif" fill="${COLORS.text}">${label}</text>`;
      body += `<text x="24" y="48" font-size="12" font-family="Segoe UI,sans-serif" fill="${COLORS.text}">H1 · 盾${COUNTS.shield} · 剣${COUNTS.sword} · 精神${COUNTS.spirit}+G1</text>`;
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${MAP_W}" height="${MAP_H}" viewBox="0 0 ${MAP_W} ${MAP_H}">
${body}
</svg>`;
}

function layoutJson(layout) {
  return {
    kind: 'accordion',
    width: MAP_W,
    height: MAP_H,
    counts: COUNTS,
    // 画像ピクセル座標（ピンは dungeon MARGIN=80 を引いて n.x に入れる）
    hub: { x: layout.hub.x, y: layout.hub.y },
    shield: layout.shield.map((p) => ({ x: p.x, y: p.y })),
    sword: layout.sword.map((p) => ({ x: p.x, y: p.y })),
    spirit: layout.spirit.map((p) => ({ x: p.x, y: p.y })),
    goal: { x: layout.goal.x, y: layout.goal.y }
  };
}

async function writeJpeg(svg, filePath) {
  await sharp(Buffer.from(svg)).jpeg({ quality: 92 }).toFile(filePath);
}

async function main() {
  const layout = buildAccordionLayout();
  const counts = assertCounts(layout);

  const exploreDir = path.join(root, 'docs/assets/mood/explore');
  const chosenDir = path.join(root, 'docs/assets/mood/chosen');
  const mapDir = path.join(root, 'docs/assets/map');
  const dataDir = path.join(root, 'docs/data');
  for (const d of [exploreDir, chosenDir, mapDir, dataDir]) fs.mkdirSync(d, { recursive: true });

  const prodSvg = toSvg(layout, { numbered: false });
  const qaSvg = toSvg(layout, { numbered: true, label: '案A じゃばら（確定）' });

  await writeJpeg(prodSvg, path.join(mapDir, 'bg.jpg'));
  await writeJpeg(prodSvg, path.join(chosenDir, 'map-accordion.jpg'));
  await writeJpeg(qaSvg, path.join(exploreDir, 'map-exact-A-accordion.jpg'));

  const json = layoutJson(layout);
  fs.writeFileSync(path.join(dataDir, 'map-layout.json'), JSON.stringify(json, null, 2) + '\n');

  console.log('locked accordion', counts);
  console.log('wrote map/bg.jpg, map-layout.json, mood copies');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
