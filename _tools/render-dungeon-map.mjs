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

export const MAP_W = 2800;
export const MAP_H = 1800;
export const COUNTS = { hub: 1, shield: 17, sword: 6, spirit: 3, goal: 1 };

/** 本番・ピン共通のじゃばらパラメータ（高解像度） */
export const ACCORDION = {
  shield: { side: -1, colsPrefer: 3, cell: 68, gap: 24, baseOut: 260 },
  sword: { side: 1, colsPrefer: 2, cell: 68, gap: 24, baseOut: 260 },
  spirit: { cell: 84, gap: 40 },
  hub: { x: MAP_W / 2, y: MAP_H - 220, r: 96 },
  goalOffsetY: 140
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

/** 部屋群を枠内いっぱいに拡大（余白 marginPx） */
export function fitLayoutToFrame(layout, marginPx = 44) {
  const rooms = [...layout.shield, ...layout.sword, ...layout.spirit, layout.goal];
  let minX = layout.hub.x - layout.hub.r;
  let maxX = layout.hub.x + layout.hub.r;
  let minY = layout.hub.y - layout.hub.r;
  let maxY = layout.hub.y + layout.hub.r;
  for (const r of rooms) {
    minX = Math.min(minX, r.x - r.w / 2);
    maxX = Math.max(maxX, r.x + r.w / 2);
    minY = Math.min(minY, r.y - r.h / 2);
    maxY = Math.max(maxY, r.y + r.h / 2);
  }
  const bw = Math.max(1, maxX - minX);
  const bh = Math.max(1, maxY - minY);
  const scale = Math.min((MAP_W - marginPx * 2) / bw, (MAP_H - marginPx * 2) / bh);
  const ox = (MAP_W - bw * scale) / 2 - minX * scale;
  const oy = (MAP_H - bh * scale) / 2 - minY * scale;
  const mapPt = (p) => {
    const out = { ...p, x: p.x * scale + ox, y: p.y * scale + oy };
    if (p.w != null) out.w = p.w * scale;
    if (p.h != null) out.h = p.h * scale;
    if (p.r != null) out.r = p.r * scale;
    return out;
  };
  return {
    ...layout,
    scale,
    hub: mapPt(layout.hub),
    shield: layout.shield.map(mapPt),
    sword: layout.sword.map(mapPt),
    spirit: layout.spirit.map(mapPt),
    goal: mapPt(layout.goal)
  };
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
    w: 140,
    h: 116,
    kind: 'goal'
  };
  return fitLayoutToFrame(
    {
      kind: 'accordion',
      width: MAP_W,
      height: MAP_H,
      hub,
      shield,
      sword,
      spirit,
      goal
    },
    56
  );
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

function corridor(x1, y1, x2, y2, thick = 36) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${COLORS.corridor}" stroke-width="${thick}" stroke-linecap="round"/>`;
}

function roomRect(r, fill, stroke, sw = 4) {
  return `<rect x="${r.x - r.w / 2}" y="${r.y - r.h / 2}" width="${r.w}" height="${r.h}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
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
  body += `<rect x="0" y="0" width="${MAP_W}" height="${MAP_H}" fill="${COLORS.floor}" opacity="0.35"/>`;

  body += chainCorridors(hub, shield);
  body += chainCorridors(hub, sword);
  body += chainCorridors(hub, spirit);
  body += corridor(spirit[spirit.length - 1].x, spirit[spirit.length - 1].y, goal.x, goal.y, 44);

  for (const r of shield) body += roomRect(r, COLORS.shield, COLORS.shieldStroke);
  for (const r of sword) body += roomRect(r, COLORS.sword, COLORS.swordStroke);
  for (const r of spirit) body += roomRect(r, COLORS.spirit, COLORS.spiritStroke);
  body += roomRect(goal, COLORS.goal, COLORS.goalStroke, 6);

  body += `<circle cx="${hub.x}" cy="${hub.y}" r="${hub.r}" fill="${COLORS.hub}" stroke="${COLORS.hubStroke}" stroke-width="5"/>`;
  body += `<circle cx="${hub.x}" cy="${hub.y}" r="${Math.max(16, hub.r * 0.32)}" fill="none" stroke="${COLORS.hubStroke}" stroke-width="3" opacity="0.75"/>`;

  if (numbered) {
    const fs = Math.max(18, Math.round((layout.scale || 1) * 16));
    const mark = (rooms, color) =>
      rooms
        .map(
          (r, i) =>
            `<text x="${r.x}" y="${r.y + fs * 0.35}" text-anchor="middle" font-size="${fs}" font-family="Segoe UI,sans-serif" fill="${color}">${i + 1}</text>`
        )
        .join('');
    body += mark(shield, '#ffd090');
    body += mark(sword, '#e0d0ff');
    body += mark(spirit, '#b8ffd0');
    body += `<text x="${goal.x}" y="${goal.y + fs * 0.35}" text-anchor="middle" font-size="${fs + 2}" font-family="Segoe UI,sans-serif" fill="#ffe9a0">G</text>`;
    body += `<text x="${hub.x}" y="${hub.y + fs * 0.35}" text-anchor="middle" font-size="${fs + 3}" font-family="Segoe UI,sans-serif" fill="#ffe9a0">H</text>`;
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
    scale: layout.scale || 1,
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
  await sharp(Buffer.from(svg)).jpeg({ quality: 95, mozjpeg: true }).toFile(filePath);
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
