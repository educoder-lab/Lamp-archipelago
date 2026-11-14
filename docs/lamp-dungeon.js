/* Lumina Code — 2D マップ（拠点＝後ろ姿構図 / 道中＝オーバーワールド） */
import { themeFor } from './island-themes.js';
import {
  TILE,
  buildDungeonFromNodes,
  pathAlongRoute,
  worldToTile
} from './dungeon-geometry.js';

const STATE_COLOR = {
  cleared: '#f5c451',
  current: '#5ec8ff',
  open: '#6b7ab8',
  fog: '#3a3f62'
};

const REALM_FLOOR = {
  1: '#2a4a62',
  2: '#32204a',
  3: '#1e4a32',
  4: '#3a3048'
};

const WALL = '#1a1e38';
const WALL_EDGE = '#2a3058';

function hexFromTheme(accent) {
  if (typeof accent === 'number') {
    return '#' + accent.toString(16).padStart(6, '0');
  }
  return accent || '#7fd1ff';
}

export function avatarTier(level) {
  const lv = Math.max(1, parseInt(level, 10) || 1);
  if (lv >= 11) return 'ascendant';
  if (lv >= 6) return 'keeper';
  if (lv >= 3) return 'adept';
  return 'novice';
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function pxRect(ctx, x, y, w, h, color, scale) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x * scale), Math.round(y * scale), Math.round(w * scale), Math.round(h * scale));
}

const HUB_ASSET_BASE = new URL('./assets/', import.meta.url);

function loadOneImage(rel) {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = new URL(rel, HUB_ASSET_BASE).href;
  });
}

/** PNG 優先、なければ JPG（スプライト透過／プレート両対応） */
function loadHubImage(rel) {
  const bare = String(rel || '').replace(/\.(png|jpe?g|webp)$/i, '');
  return loadOneImage(bare + '.png').then((png) => png || loadOneImage(bare + '.jpg'));
}

function drawArt(ctx, img, x, y, w, h) {
  if (!img || !img.naturalWidth) return false;
  ctx.drawImage(img, x, y, w, h);
  return true;
}

/**
 * @param {HTMLElement} container
 * @param {object} opts
 */
export function mountLampWorld(container, opts) {
  opts = opts || {};
  const nodes = opts.nodes || [];
  const layoutW = opts.layoutW || 800;
  const layoutH = opts.layoutH || 600;
  const reduced = !!opts.reducedMotion;
  let playerLevel = Math.max(1, parseInt(opts.level, 10) || 1);
  let growth = opts.growth || {
    shield: { cleared: 0, total: 1, ratio: 0 },
    sword: { cleared: 0, total: 1, ratio: 0 },
    spirit: { cleared: 0, total: 1, ratio: 0 }
  };
  let landOpen = !!opts.landOpen;

  const dungeon = buildDungeonFromNodes(nodes, layoutW, layoutH);
  const route = dungeon.route;
  const routeIndexOfNode = new Map();
  route.forEach((n, i) => routeIndexOfNode.set(n, i));

  const canvas = document.createElement('canvas');
  canvas.className = 'lamp-dungeon-canvas';
  canvas.setAttribute('aria-label', '三つの扉の間');
  container.insertBefore(canvas, container.firstChild);

  const dpad = document.createElement('div');
  dpad.className = 'lamp-dungeon-dpad';
  dpad.innerHTML = `
    <button type="button" data-dir="up" aria-label="上">▲</button>
    <button type="button" data-dir="left" aria-label="左">◀</button>
    <button type="button" data-dir="down" aria-label="下">▼</button>
    <button type="button" data-dir="right" aria-label="右">▶</button>`;
  container.appendChild(dpad);

  /** @type {'hub'|'room'|'map'|'path'} */
  let scene = 'hub';
  let mode = 'world';
  let focusKey = null;
  let islandDomain = null;
  let stagePads = [];
  /** @type {'shield'|'sword'|'spirit'|null} */
  let roomPack = null;
  let roomDomainIdx = 0;
  /** @type {'door'|'back'|'lessons'} */
  let roomFocus = 'door';

  let camX = 0;
  let camY = 0;
  let camZoom = 1;
  let overview = false;

  let px = dungeon.margin + 110;
  let py = dungeon.margin + 70;
  const hubNode = nodes.find(n => n.kind === 'hub');
  if (hubNode && hubNode._px != null) {
    px = hubNode._px;
    py = hubNode._py;
  }

  const keys = new Set();
  let anim = null;
  let pulseT = 0;
  let raf = 0;
  let hubFocus = 'elder'; // left | right | door | elder

  /** 拠点・道・マップ用アート（失敗時は手描き／コード描画） */
  const hubArt = {
    hero: null,
    heroWalk1: null,
    heroWalk2: null,
    heroMid: null,
    heroStrong: null,
    spiritAura: null,
    doorClosed: null,
    doorAjar: null,
    doorOpen1: null,
    doorOpen2: null,
    elder: null,
    elderTalk: null,
    elderSmile: null,
    pathShield: null,
    pathSword: null,
    iconShield: null,
    iconSword: null,
    iconSpirit: null,
    hubBg: null,
    shieldBg: null,
    shieldDoor: null,
    swordBg: null,
    swordDoor: null,
    spiritBg: null,
    spiritDoor: null,
    mapBg: null,
    mapHubPin: null,
    pinFog: null,
    pinOpen: null,
    pinCurrent: null,
    pinCleared: null,
    mapMarker: null,
    bandShield: null,
    bandSword: null,
    bandSpirit: null,
    /** @type {Record<string, HTMLImageElement|null>} */
    domainDoors: {}
  };
  const DOMAIN_DOOR_IDS = [
    'island-foundation', 'island-algorithm', 'island-hardware', 'island-system',
    'island-software', 'island-database', 'island-network', 'island-security',
    'island-media', 'island-corporate', 'island-business', 'island-system-plan',
    'island-dev-tech', 'island-project', 'island-service', 'island-audit',
    'gate-sky-trial',
    'fortress-algorithm', 'fortress-program', 'fortress-database',
    'fortress-network', 'fortress-security', 'fortress-deep',
    'plateau-mock-am', 'plateau-mock-pm', 'plateau-final'
  ];
  Promise.all([
    loadHubImage('common/hero-back.jpg').then((i) => { hubArt.hero = i; }),
    loadHubImage('common/hero-walk-1.jpg').then((i) => { hubArt.heroWalk1 = i; }),
    loadHubImage('common/hero-walk-2.jpg').then((i) => { hubArt.heroWalk2 = i; }),
    loadHubImage('common/hero-mid.jpg').then((i) => { hubArt.heroMid = i; }),
    loadHubImage('common/hero-strong.jpg').then((i) => { hubArt.heroStrong = i; }),
    loadHubImage('common/spirit-aura.jpg').then((i) => { hubArt.spiritAura = i; }),
    loadHubImage('rooms/hub/great-door-closed.jpg').then((i) => { hubArt.doorClosed = i; }),
    loadHubImage('rooms/hub/great-door-ajar.jpg').then((i) => { hubArt.doorAjar = i; }),
    loadHubImage('rooms/hub/great-door-open-1.jpg').then((i) => { hubArt.doorOpen1 = i; }),
    loadHubImage('rooms/hub/great-door-open-2.jpg').then((i) => { hubArt.doorOpen2 = i; }),
    loadHubImage('rooms/hub/elder.jpg').then((i) => { hubArt.elder = i; }),
    loadHubImage('rooms/hub/elder-talk.jpg').then((i) => { hubArt.elderTalk = i; }),
    loadHubImage('rooms/hub/elder-smile.jpg').then((i) => { hubArt.elderSmile = i; }),
    loadHubImage('rooms/hub/path-shield.jpg').then((i) => { hubArt.pathShield = i; }),
    loadHubImage('rooms/hub/path-sword.jpg').then((i) => { hubArt.pathSword = i; }),
    loadHubImage('rooms/hub/bg.jpg').then((i) => { hubArt.hubBg = i; }),
    loadHubImage('rooms/shield/bg.jpg').then((i) => { hubArt.shieldBg = i; }),
    loadHubImage('rooms/shield/door.jpg').then((i) => { hubArt.shieldDoor = i; }),
    loadHubImage('rooms/sword/bg.jpg').then((i) => { hubArt.swordBg = i; }),
    loadHubImage('rooms/sword/door.jpg').then((i) => { hubArt.swordDoor = i; }),
    loadHubImage('rooms/spirit/bg.jpg').then((i) => { hubArt.spiritBg = i; }),
    loadHubImage('rooms/spirit/door.jpg').then((i) => { hubArt.spiritDoor = i; }),
    loadHubImage('map/bg.jpg').then((i) => { hubArt.mapBg = i; }),
    loadHubImage('map/hub-pin.jpg').then((i) => { hubArt.mapHubPin = i; }),
    loadHubImage('map/pin-fog.jpg').then((i) => { hubArt.pinFog = i; }),
    loadHubImage('map/pin-open.jpg').then((i) => { hubArt.pinOpen = i; }),
    loadHubImage('map/pin-current.jpg').then((i) => { hubArt.pinCurrent = i; }),
    loadHubImage('map/pin-cleared.jpg').then((i) => { hubArt.pinCleared = i; }),
    loadHubImage('map/marker.jpg').then((i) => { hubArt.mapMarker = i; }),
    loadHubImage('map/band-shield.jpg').then((i) => { hubArt.bandShield = i; }),
    loadHubImage('map/band-sword.jpg').then((i) => { hubArt.bandSword = i; }),
    loadHubImage('map/band-spirit.jpg').then((i) => { hubArt.bandSpirit = i; }),
    loadHubImage('common/icon-shield.jpg').then((i) => { hubArt.iconShield = i; }),
    loadHubImage('common/icon-sword.jpg').then((i) => { hubArt.iconSword = i; }),
    loadHubImage('common/icon-spirit.jpg').then((i) => { hubArt.iconSpirit = i; }),
    ...DOMAIN_DOOR_IDS.map((id) =>
      loadHubImage('rooms/domains/' + id + '.jpg').then((i) => { hubArt.domainDoors[id] = i; })
    )
  ]).catch(() => {});

  function growthGearTier() {
    const a = (growth.shield && growth.shield.ratio) || 0;
    const b = (growth.sword && growth.sword.ratio) || 0;
    const c = (growth.spirit && growth.spirit.ratio) || 0;
    const avg = (a + b + c) / 3;
    if (avg >= 0.55) return 'strong';
    if (avg >= 0.25) return 'mid';
    return 'weak';
  }

  function pinForState(st) {
    if (st === 'fog') return hubArt.pinFog;
    if (st === 'cleared') return hubArt.pinCleared;
    if (st === 'current') return hubArt.pinCurrent;
    return hubArt.pinOpen;
  }

  function packForRealm(realm) {
    if (realm === 'sky') return 'shield';
    if (realm === 'underground') return 'sword';
    if (realm === 'land') return 'spirit';
    return null;
  }

  function domainsInRealm(realm) {
    return nodes.filter((n) => n.kind === 'domain' && n.realm === realm);
  }

  function currentRoomDomain() {
    const list = domainsInRealm(roomPack === 'shield' ? 'sky' : roomPack === 'sword' ? 'underground' : 'land');
    if (!list.length) return null;
    const i = Math.max(0, Math.min(list.length - 1, roomDomainIdx));
    return list[i];
  }

  function resize() {
    const r = container.getBoundingClientRect();
    canvas.width = Math.max(320, Math.floor(r.width));
    canvas.height = Math.max(240, Math.floor(r.height));
  }
  resize();

  function setGrowth(g, open) {
    if (g) growth = g;
    if (open != null) landOpen = !!open;
  }

  function nearestNode() {
    let best = null;
    let bestD = 1e9;
    nodes.forEach(n => {
      if (n._px == null) return;
      const d = Math.hypot(n._px - px, n._py - py);
      if (d < bestD) {
        bestD = d;
        best = n;
      }
    });
    return best ? { n: best, d: bestD } : null;
  }

  function tryMove(dx, dy, dt) {
    if (scene !== 'path') return;
    const speed = 110;
    const len = Math.hypot(dx, dy) || 1;
    const nx = px + (dx / len) * speed * dt;
    const ny = py + (dy / len) * speed * dt;
    if (!worldToTile(dungeon.walls, dungeon.tw, dungeon.th, nx, ny)) {
      px = nx;
      py = ny;
    } else if (!worldToTile(dungeon.walls, dungeon.tw, dungeon.th, nx, py)) {
      px = nx;
    } else if (!worldToTile(dungeon.walls, dungeon.tw, dungeon.th, px, ny)) {
      py = ny;
    }
  }

  function interact() {
    if (scene === 'hub') {
      interactHub();
      return;
    }
    if (scene === 'room') {
      interactRoom();
      return;
    }
    if (scene === 'map' || overview) return;
    if (mode === 'island') {
      const pad = stagePads.find(p => Math.hypot(p.x - px, p.y - py) < 28);
      if (pad && opts.onSelectLesson) opts.onSelectLesson(pad.lesson);
      return;
    }
    const hit = nearestNode();
    if (!hit || hit.d > 52) return;
    const n = hit.n;
    if (n.kind === 'hub') {
      returnToHub(0);
      if (opts.onSelectHub) opts.onSelectHub();
      return;
    }
    if (n.kind === 'domain' && n.d) {
      if (n.state === 'fog') {
        if (opts.onTravelBlocked) opts.onTravelBlocked(n.realm, n.d.lockReason || 'この分野はまだ霧の中です。');
        return;
      }
      if (opts.onSelectDomain) opts.onSelectDomain(n.d);
    }
  }

  function interactRoom() {
    if (mode === 'island') {
      returnToRoomPath();
      return;
    }
    if (roomFocus === 'back') {
      returnToHub(0);
      return;
    }
    const node = currentRoomDomain();
    if (!node || !node.d) return;
    if (node.state === 'fog') {
      if (opts.onTravelBlocked) opts.onTravelBlocked(node.realm, node.d.lockReason || 'この分野はまだ霧の中です。');
      return;
    }
    if (opts.onSelectDomain) opts.onSelectDomain(node.d);
  }

  function returnToRoomPath() {
    mode = 'world';
    islandDomain = null;
    stagePads = [];
    focusKey = null;
    roomFocus = 'door';
    if (opts.onModeChange) opts.onModeChange('world', null);
  }

  function shiftRoomDomain(delta) {
    const realm = roomPack === 'shield' ? 'sky' : roomPack === 'sword' ? 'underground' : 'land';
    const list = domainsInRealm(realm);
    if (!list.length) return;
    roomDomainIdx = (roomDomainIdx + delta + list.length) % list.length;
    const n = list[roomDomainIdx];
    if (n && n._px != null) {
      px = n._px;
      py = n._py;
    }
    focusKey = n && n.d ? n.d.id : null;
  }

  function interactHub() {
    if (hubFocus === 'elder') {
      if (opts.onSelectHub) opts.onSelectHub();
      return;
    }
    if (hubFocus === 'left') {
      travelToRealm('sky');
      return;
    }
    if (hubFocus === 'right') {
      travelToRealm('underground');
      return;
    }
    if (hubFocus === 'door') {
      if (!landOpen) {
        if (opts.onTravelBlocked) {
          opts.onTravelBlocked('land', 'その盾と剣ではまだ不十分だ。左で盾を、右で剣を鍛えなさい。');
        }
        return;
      }
      travelToRealm('land');
    }
  }

  function drawFloor(ctx) {
    const { tw, th, walls, floorRealm, litPath } = dungeon;
    for (let ty = 0; ty < th; ty++) {
      for (let tx = 0; tx < tw; tx++) {
        const i = ty * tw + tx;
        if (walls[i]) continue;
        const wx = tx * TILE;
        const wy = ty * TILE;
        const code = floorRealm[i] || 1;
        ctx.fillStyle = REALM_FLOOR[code] || '#243048';
        ctx.fillRect(wx, wy, TILE, TILE);
        if (litPath.has(tx + ',' + ty)) {
          const pulse = 0.85 + Math.sin(pulseT * 3 + tx * 0.2) * 0.15;
          ctx.fillStyle = `rgba(245, 196, 81, ${0.18 * pulse})`;
          ctx.fillRect(wx, wy, TILE, TILE);
        }
        ctx.strokeStyle = WALL_EDGE;
        ctx.strokeRect(wx + 0.5, wy + 0.5, TILE - 1, TILE - 1);
      }
    }
    for (let ty = 0; ty < th; ty++) {
      for (let tx = 0; tx < tw; tx++) {
        if (!walls[ty * tw + tx]) continue;
        ctx.fillStyle = WALL;
        ctx.fillRect(tx * TILE, ty * TILE, TILE, TILE);
      }
    }
  }

  function drawNodes(ctx) {
    dungeon.nodeMeta.forEach(({ node: n, px: nx, py: ny }) => {
      if (mode === 'island' && islandDomain && n.kind === 'domain' && n.d && n.d.id !== islandDomain.id) {
        ctx.globalAlpha = 0.12;
      } else {
        ctx.globalAlpha = 1;
      }
      const theme = themeFor(n);
      const accent = hexFromTheme(theme.accent);
      const st = n.state || 'open';
      const r = n.kind === 'hub' ? 36 : n.kind === 'core' ? 40 : 30;
      const foggy = st === 'fog';
      const pin = n.kind === 'hub' ? hubArt.mapHubPin : pinForState(st);
      const pinSize = r * 2.1;

      if (!drawArt(ctx, pin, nx - pinSize / 2, ny - pinSize / 2, pinSize, pinSize)) {
        ctx.beginPath();
        ctx.arc(nx, ny, r + 6, 0, Math.PI * 2);
        ctx.fillStyle = foggy ? 'rgba(58,63,98,0.55)' : 'rgba(15,18,38,0.65)';
        ctx.fill();
        ctx.strokeStyle = STATE_COLOR[st] || STATE_COLOR.open;
        ctx.lineWidth = n.state === 'current' ? 4 : 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(nx, ny, r, 0, Math.PI * 2);
        ctx.fillStyle = foggy ? '#2a3050' : accent;
        ctx.globalAlpha = foggy ? 0.5 : 0.85;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      ctx.fillStyle = '#ece9f5';
      ctx.font = '600 11px "Segoe UI", "Yu Gothic UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((n.label || '').slice(0, 8), nx, ny + r + 12);
      if (n.sub) {
        ctx.font = '10px sans-serif';
        ctx.fillStyle = '#9aa0c4';
        ctx.fillText(n.sub, nx, ny + r + 24);
      }
    });
    ctx.globalAlpha = 1;
  }

  function drawAvatarDot(ctx, x, y) {
    const size = 28;
    if (drawArt(ctx, hubArt.mapMarker, x - size / 2, y - size / 2, size, size)) return;
    const tier = avatarTier(playerLevel);
    const colors = {
      novice: '#f5c451',
      adept: '#7fd1ff',
      keeper: '#c59bff',
      ascendant: '#ffe08a'
    };
    const s = tier === 'ascendant' ? 14 : tier === 'keeper' ? 12 : 10;
    ctx.beginPath();
    ctx.arc(x, y, s + 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(245,196,81,0.25)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, s, 0, Math.PI * 2);
    ctx.fillStyle = colors[tier] || colors.novice;
    ctx.fill();
    ctx.strokeStyle = '#ece9f5';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function drawStagePads(ctx) {
    if (mode !== 'island' || !stagePads.length) return;
    stagePads.forEach(pad => {
      const st = pad.state;
      const col = st === 'cleared' ? STATE_COLOR.cleared
        : st === 'next' ? STATE_COLOR.current
        : st === 'skipped' ? '#c59bff' : '#3a4568';
      ctx.beginPath();
      ctx.arc(pad.x, pad.y, 18, 0, Math.PI * 2);
      ctx.fillStyle = col;
      ctx.fill();
      ctx.fillStyle = '#0f1226';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(pad.lesson.no), pad.x, pad.y);
    });
  }

  function drawGrowthHud(ctx) {
    const bars = [
      { key: 'shield', label: '盾', color: '#f0a030', glow: '#ffe08a', g: growth.shield, icon: hubArt.iconShield },
      { key: 'sword', label: '剣', color: '#a070ff', glow: '#e0d0ff', g: growth.sword, icon: hubArt.iconSword },
      { key: 'spirit', label: '精神', color: '#40c080', glow: '#b8ffd0', g: growth.spirit, icon: hubArt.iconSpirit }
    ];
    const x0 = 12;
    let y = 12;
    bars.forEach(b => {
      const ratio = Math.max(0, Math.min(1, b.g && b.g.ratio != null ? b.g.ratio : 0));
      const pulse = 0.55 + Math.sin(pulseT * 4) * 0.2 * ratio;
      ctx.fillStyle = 'rgba(10,14,28,0.82)';
      ctx.fillRect(x0, y, 168, 22);
      ctx.strokeStyle = b.color;
      ctx.strokeRect(x0 + 0.5, y + 0.5, 167, 21);
      if (!drawArt(ctx, b.icon, x0 + 4, y + 2, 18, 18)) {
        ctx.fillStyle = '#ece9f5';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(b.label, x0 + 8, y + 15);
      }
      ctx.fillStyle = b.color;
      ctx.globalAlpha = 0.35 + pulse * 0.5;
      ctx.fillRect(x0 + 48, y + 5, Math.max(2, 100 * ratio), 12);
      ctx.globalAlpha = 1;
      if (ratio > 0) {
        ctx.fillStyle = b.glow;
        ctx.globalAlpha = 0.25 + pulse * 0.4;
        ctx.fillRect(x0 + 48, y + 5, Math.max(2, 100 * ratio), 4);
        ctx.globalAlpha = 1;
      }
      ctx.fillStyle = '#9aa0c4';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'left';
      const c = (b.g && b.g.cleared) || 0;
      const t = (b.g && b.g.total) || 0;
      ctx.fillText(c + '/' + t, x0 + 138, y + 15);
      y += 26;
    });
  }

  function drawHeroSprite(ctx, W, H) {
    const gear = growthGearTier();
    let heroImg = hubArt.hero;
    if (gear === 'strong' && hubArt.heroStrong) heroImg = hubArt.heroStrong;
    else if (gear === 'mid' && hubArt.heroMid) heroImg = hubArt.heroMid;
    else {
      const walk = Math.floor(pulseT * 2) % 2 === 0 ? hubArt.heroWalk1 : hubArt.heroWalk2;
      heroImg = walk || hubArt.hero;
    }
    const heroW = Math.min(W * 0.22, 160);
    const heroH = heroW * 1.35;
    const heroX = W * 0.5 - heroW / 2;
    const heroY = H * 0.62 + Math.sin(pulseT * 2) * 2;
    const sp = (growth.spirit && growth.spirit.ratio) || 0;
    if (sp > 0.05 && hubArt.spiritAura) {
      const aw = heroW * (0.9 + sp * 0.35);
      drawArt(ctx, hubArt.spiritAura, W * 0.5 - aw / 2, heroY - aw * 0.35, aw, aw);
    }
    if (!drawArt(ctx, heroImg, heroX, heroY, heroW, heroH)) {
      const s = Math.max(3, Math.floor(Math.min(W, H) / 120));
      drawHeroBack(ctx, W * 0.5, H * 0.78, s * 1.15, pulseT);
    }
  }

  /** 後ろ姿視点の拠点シーン（第１弾アート＋手描きフォールバック） */
  function drawHubScene(ctx) {
    const W = canvas.width;
    const H = canvas.height;
    const s = Math.max(3, Math.floor(Math.min(W, H) / 120));

    if (!drawArt(ctx, hubArt.hubBg, 0, 0, W, H)) {
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#1a1040');
      bg.addColorStop(0.45, '#2a1858');
      bg.addColorStop(1, '#0c1018');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      for (let row = 0; row < 14; row++) {
        const y = H * 0.42 + row * (H * 0.045);
        const fade = row / 14;
        ctx.fillStyle = fade > 0.55 ? '#2a2438' : '#352a4a';
        ctx.globalAlpha = 0.35 + fade * 0.5;
        ctx.fillRect(0, y, W, H * 0.045 - 1);
        ctx.strokeStyle = 'rgba(80,60,120,0.35)';
        ctx.beginPath();
        ctx.moveTo(W * 0.5 - (row + 2) * 18, y);
        ctx.lineTo(W * 0.5 + (row + 2) * 18, y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // 左・盾の道 / 右・剣の道
    const leftLit = hubFocus === 'left';
    const rightLit = hubFocus === 'right';
    const pathW = W * 0.24;
    const pathH = H * 0.36;
    const pathY = H * 0.36;
    if (!drawArt(ctx, hubArt.pathShield, W * 0.08, pathY, pathW, pathH)) {
      drawPathArch(ctx, W * 0.14, H * 0.38, W * 0.22, H * 0.42, '#c47820', '#ffe08a', leftLit, '盾');
    } else if (leftLit) {
      ctx.strokeStyle = '#ffe08a';
      ctx.lineWidth = 3;
      ctx.strokeRect(W * 0.08 + 2, pathY + 2, pathW - 4, pathH - 4);
    }
    if (!drawArt(ctx, hubArt.pathSword, W * 0.68, pathY, pathW, pathH)) {
      drawPathArch(ctx, W * 0.64, H * 0.38, W * 0.22, H * 0.42, '#7040c0', '#d8c8ff', rightLit, '剣');
    } else if (rightLit) {
      ctx.strokeStyle = '#d8c8ff';
      ctx.lineWidth = 3;
      ctx.strokeRect(W * 0.68 + 2, pathY + 2, pathW - 4, pathH - 4);
    }

    // 正面の仰々しい大扉
    const doorOpen = landOpen;
    const doorLit = hubFocus === 'door';
    let doorImg = hubArt.doorClosed;
    if (doorOpen) {
      const frame = Math.floor(pulseT * 2.2) % 3;
      doorImg = frame === 0 ? (hubArt.doorOpen1 || hubArt.doorAjar)
        : frame === 1 ? (hubArt.doorAjar || hubArt.doorOpen1)
        : (hubArt.doorOpen2 || hubArt.doorAjar || hubArt.doorClosed);
    }
    const doorW = W * 0.3;
    const doorH = H * 0.5;
    const doorX = W * 0.5 - doorW / 2;
    const doorY = H * 0.12;
    if (!drawArt(ctx, doorImg, doorX, doorY, doorW, doorH)) {
      drawGreatDoor(ctx, W * 0.5, H * 0.18, W * 0.28, H * 0.48, doorOpen, doorLit, s);
    } else if (doorLit) {
      ctx.strokeStyle = '#ffe08a';
      ctx.lineWidth = 3;
      ctx.strokeRect(doorX - 4, doorY - 4, doorW + 8, doorH + 8);
    }

    // 謎の老人（扉の右前）
    const elderLit = hubFocus === 'elder';
    const elderW = Math.min(W * 0.18, 140);
    const elderH = elderW * 1.35;
    const elderX = W * 0.58;
    const elderY = H * 0.42;
    const elderImg = elderLit
      ? (hubArt.elderTalk || hubArt.elder)
      : (hubArt.elderSmile || hubArt.elder);
    if (!drawArt(ctx, elderImg, elderX, elderY, elderW, elderH)) {
      drawElder(ctx, W * 0.58, H * 0.52, s, elderLit);
    } else {
      if (elderLit) {
        ctx.strokeStyle = '#7fd1ff';
        ctx.lineWidth = 2;
        ctx.strokeRect(elderX - 2, elderY - 2, elderW + 4, elderH + 4);
      }
      ctx.fillStyle = '#c8c4e0';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('謎の老人', elderX + elderW / 2, elderY + elderH + 14);
    }

    drawHeroSprite(ctx, W, H);

    // フォーカス枠ヒント
    ctx.fillStyle = 'rgba(10,14,28,0.75)';
    ctx.fillRect(W / 2 - 140, H - 36, 280, 26);
    ctx.fillStyle = '#c8c4e0';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    const hints = {
      elder: 'Enter … 話す',
      left: 'Enter … 盾の道',
      right: 'Enter … 剣の道',
      door: landOpen ? 'Enter … 大扉' : 'Enter … まだ不十分'
    };
    ctx.fillText(hints[hubFocus] || '', W / 2, H - 18);

    drawGrowthHud(ctx);
  }

  /** 道中も同じ後ろ姿構図（背景・扉セットだけ差し替え） */
  function drawRoomScene(ctx) {
    const W = canvas.width;
    const H = canvas.height;
    const pack = roomPack || 'shield';
    const bgImg = pack === 'sword' ? hubArt.swordBg : pack === 'spirit' ? hubArt.spiritBg : hubArt.shieldBg;
    const packDoor = pack === 'sword' ? hubArt.swordDoor : pack === 'spirit' ? hubArt.spiritDoor : hubArt.shieldDoor;
    const domainNode = currentRoomDomain();
    const domainId = domainNode && domainNode.d && domainNode.d.id;
    const doorImg = (domainId && hubArt.domainDoors[domainId]) || packDoor;
    const accent = pack === 'sword' ? '#d8c8ff' : pack === 'spirit' ? '#b8ffd0' : '#ffe08a';
    const realmLabel = pack === 'sword' ? '剣の道' : pack === 'spirit' ? '大扉の奥' : '盾の道';

    if (!drawArt(ctx, bgImg, 0, 0, W, H)) {
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, pack === 'spirit' ? '#0e2818' : pack === 'sword' ? '#1a1030' : '#1a2040');
      bg.addColorStop(1, '#0c1018');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
    }

    const doorW = W * 0.32;
    const doorH = H * 0.52;
    const doorX = W * 0.5 - doorW / 2;
    const doorY = H * 0.1;
    if (!drawArt(ctx, doorImg, doorX, doorY, doorW, doorH)) {
      ctx.fillStyle = '#2a1a10';
      ctx.fillRect(doorX, doorY, doorW, doorH);
      ctx.strokeStyle = accent;
      ctx.strokeRect(doorX + 8, doorY + 8, doorW - 16, doorH - 16);
    }
    if (roomFocus === 'door') {
      ctx.strokeStyle = accent;
      ctx.lineWidth = 3;
      ctx.strokeRect(doorX - 4, doorY - 4, doorW + 8, doorH + 8);
    }

    const title = (domainNode && domainNode.d && domainNode.d.title) || realmLabel;
    ctx.fillStyle = 'rgba(10,14,28,0.8)';
    ctx.fillRect(W / 2 - 160, doorY + doorH + 6, 320, 28);
    ctx.fillStyle = accent;
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, W / 2, doorY + doorH + 25);
    if (domainNode && domainNode.state === 'fog') {
      ctx.fillStyle = '#9aa0c4';
      ctx.font = '11px sans-serif';
      ctx.fillText('霧の中', W / 2, doorY + doorH + 42);
    }

    if (mode === 'island' && stagePads.length) {
      const y0 = H * 0.52;
      stagePads.forEach((pad, i) => {
        const x = W * 0.5 + (i - (stagePads.length - 1) / 2) * 52;
        const col = pad.state === 'cleared' ? STATE_COLOR.cleared
          : pad.state === 'next' ? STATE_COLOR.current
          : pad.state === 'skipped' ? '#c59bff' : '#3a4568';
        ctx.beginPath();
        ctx.arc(x, y0, 18, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.fill();
        ctx.fillStyle = '#0f1226';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(pad.lesson.no), x, y0);
        pad._sx = x;
        pad._sy = y0;
      });
    }

    drawHeroSprite(ctx, W, H);

    ctx.fillStyle = 'rgba(10,14,28,0.75)';
    ctx.fillRect(W / 2 - 170, H - 36, 340, 26);
    ctx.fillStyle = '#c8c4e0';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    const hint = mode === 'island'
      ? '講座を選ぶ　↓ 道へ戻る'
      : '←→ 分野　Enter 入る　↓ 拠点へ';
    ctx.fillText(hint, W / 2, H - 18);

    drawGrowthHud(ctx);
  }

  function drawRealmBands(ctx) {
    if (!hubNode || hubNode._px == null) return;
    const pairs = [
      { realm: 'sky', img: hubArt.bandShield },
      { realm: 'underground', img: hubArt.bandSword },
      { realm: 'land', img: hubArt.bandSpirit }
    ];
    pairs.forEach((p) => {
      if (!p.img || !p.img.naturalWidth) return;
      const c = realmCentroid(p.realm);
      const x0 = hubNode._px;
      const y0 = hubNode._py;
      const x1 = c.x;
      const y1 = c.y;
      const len = Math.hypot(x1 - x0, y1 - y0) || 1;
      const ang = Math.atan2(y1 - y0, x1 - x0);
      const h = 28;
      ctx.save();
      ctx.translate(x0, y0);
      ctx.rotate(ang);
      ctx.globalAlpha = 0.55;
      ctx.drawImage(p.img, 0, -h / 2, len, h);
      ctx.restore();
    });
  }

  /** 全体マップ（俯瞰専用）— map/bg を正とし、旧タイル／道帯は非表示 */
  function drawMapScene(ctx) {
    const W = canvas.width;
    const H = canvas.height;
    updateCamera(false);
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.scale(camZoom, camZoom);
    ctx.translate(-camX, -camY);
    const hasMapBg = !!(hubArt.mapBg && hubArt.mapBg.naturalWidth);
    if (hasMapBg) {
      // 案A じゃばら：bg は layout と同じ座標。ピンは n.x+MARGIN なので画像px = n.x+MARGIN
      drawArt(ctx, hubArt.mapBg, 0, 0, layoutW, layoutH);
    } else {
      ctx.fillStyle = '#0a1428';
      ctx.fillRect(-40, -40, layoutW + 80, layoutH + 80);
      drawFloor(ctx);
      drawRealmBands(ctx);
    }
    drawNodes(ctx);
    drawAvatarDot(ctx, px, py);
    ctx.restore();
    drawGrowthHud(ctx);
    ctx.fillStyle = 'rgba(10,14,28,0.8)';
    ctx.fillRect(W / 2 - 120, H - 36, 240, 26);
    ctx.fillStyle = '#c8c4e0';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('全体マップ　クリックで移動', W / 2, H - 18);
  }

  function drawPathArch(ctx, x, y, w, h, base, glow, lit, label) {
    ctx.save();
    ctx.translate(x, y);
    // 通路奥の光
    const g = ctx.createLinearGradient(w / 2, h, w / 2, 0);
    g.addColorStop(0, 'transparent');
    g.addColorStop(1, lit ? glow : base);
    ctx.globalAlpha = lit ? 0.55 : 0.28;
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(w * 0.15, h);
    ctx.lineTo(w * 0.35, h * 0.2);
    ctx.quadraticCurveTo(w * 0.5, 0, w * 0.65, h * 0.2);
    ctx.lineTo(w * 0.85, h);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
    // 枠
    ctx.strokeStyle = lit ? glow : base;
    ctx.lineWidth = lit ? 4 : 2;
    ctx.stroke();
    // 紋章
    ctx.fillStyle = glow;
    ctx.globalAlpha = 0.85;
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label === '盾' ? '🛡' : '⚔', w / 2, h * 0.55);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ece9f5';
    ctx.font = '600 13px sans-serif';
    ctx.fillText(label + 'の道', w / 2, h * 0.78);
    if (lit) {
      ctx.strokeStyle = glow;
      ctx.globalAlpha = 0.5;
      ctx.strokeRect(4, 4, w - 8, h - 8);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  function drawGreatDoor(ctx, cx, top, w, h, open, lit, s) {
    const x = cx - w / 2;
    // 石枠
    ctx.fillStyle = '#4a3a28';
    ctx.fillRect(x - 10, top - 8, w + 20, h + 16);
    ctx.fillStyle = '#6a5438';
    ctx.fillRect(x - 4, top - 2, w + 8, h + 8);
    // 扉本体
    if (open) {
      ctx.fillStyle = '#1a2838';
      ctx.fillRect(x + 8, top + 10, w - 16, h - 20);
      const glow = ctx.createRadialGradient(cx, top + h * 0.4, 10, cx, top + h * 0.4, w * 0.4);
      glow.addColorStop(0, 'rgba(64,192,128,0.55)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(x, top, w, h);
    } else {
      ctx.fillStyle = '#2a1a10';
      ctx.fillRect(x + 6, top + 8, w - 12, h - 16);
      // 装飾の線
      ctx.strokeStyle = '#c9a227';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 14, top + 18, w - 28, h - 36);
      ctx.beginPath();
      ctx.moveTo(cx, top + 18);
      ctx.lineTo(cx, top + h - 18);
      ctx.stroke();
      // 封印の紋
      ctx.fillStyle = '#f0a030';
      ctx.globalAlpha = 0.5 + Math.sin(pulseT * 2) * 0.2;
      ctx.beginPath();
      ctx.arc(cx, top + h * 0.45, Math.min(22, w * 0.12), 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#1a1010';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('封', cx, top + h * 0.48);
    }
    // 楣
    ctx.fillStyle = '#8a6a30';
    ctx.fillRect(x - 16, top - 18, w + 32, 14);
    ctx.fillStyle = lit ? '#ffe08a' : '#d4b060';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(open ? '大扉 — 開' : '仰々しき大扉', cx, top - 7);
    if (lit) {
      ctx.strokeStyle = '#ffe08a';
      ctx.lineWidth = 3;
      ctx.strokeRect(x - 12, top - 20, w + 24, h + 28);
    }
  }

  function drawElder(ctx, cx, cy, s, lit) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 10 * s, 8 * s, 3 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    pxRect(ctx, -4, 2, 9, 12, '#2a1848', s);
    pxRect(ctx, -5, 4, 11, 10, '#3a2060', s);
    pxRect(ctx, -2, -2, 5, 5, '#e8c8a0', s);
    pxRect(ctx, -3, -3, 7, 2, '#f0f0f8', s);
    pxRect(ctx, -1, 2, 3, 4, '#e8e8f0', s);
    pxRect(ctx, 5, -1, 1, 14, '#c9a227', s);
    pxRect(ctx, 4, -3, 3, 2, '#7fd1ff', s);
    ctx.fillStyle = '#7fd1ff';
    ctx.globalAlpha = 0.7 + Math.sin(pulseT * 3) * 0.3;
    ctx.fillRect(-1 * s, -2 * s, s, s);
    ctx.fillRect(1 * s, -2 * s, s, s);
    ctx.globalAlpha = 1;
    if (lit) {
      ctx.strokeStyle = '#7fd1ff';
      ctx.lineWidth = 2;
      ctx.strokeRect(-8 * s, -6 * s, 16 * s, 22 * s);
    }
    ctx.restore();
    ctx.fillStyle = '#c8c4e0';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('謎の老人', cx, cy + 14 * s);
  }

  function drawHeroBack(ctx, cx, cy, s, t) {
    const bob = Math.sin(t * 2) * 1.5;
    ctx.save();
    ctx.translate(cx, cy + bob);
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(0, 12 * s, 10 * s, 3.5 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    pxRect(ctx, -6, 0, 13, 14, '#1e3a5f', s);
    pxRect(ctx, -7, 2, 15, 12, '#2a4a72', s);
    pxRect(ctx, -4, 2, 9, 10, '#3a5a80', s);
    pxRect(ctx, -3, -4, 7, 6, '#2a2030', s);
    pxRect(ctx, -2, -3, 5, 4, '#c49a6c', s);
    const sh = growth.shield.ratio || 0;
    pxRect(ctx, -8, 4, 4, 5, sh > 0.3 ? '#f0a030' : '#6a5a40', s);
    if (sh > 0) {
      ctx.fillStyle = `rgba(255,224,138,${0.2 + sh * 0.5})`;
      ctx.fillRect(-8 * s, 4 * s, 4 * s, 5 * s);
    }
    const sw = growth.sword.ratio || 0;
    pxRect(ctx, 5, 1, 2, 10, sw > 0.3 ? '#c0a0ff' : '#5a5068', s);
    if (sw > 0) {
      ctx.fillStyle = `rgba(200,160,255,${0.2 + sw * 0.5})`;
      ctx.fillRect(5 * s, 1 * s, 2 * s, 10 * s);
    }
    const sp = growth.spirit.ratio || 0;
    if (sp > 0 || landOpen) {
      ctx.strokeStyle = `rgba(64,192,128,${0.25 + sp * 0.6})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, -8 * s, 10 + sp * 8, 3 + sp * 2, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function updateCamera(follow) {
    if (!follow) return;
    camX += (px - camX) * 0.12;
    camY += (py - camY) * 0.12;
  }

  function render() {
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.save();
    ctx.fillStyle = '#0a1428';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (scene === 'hub') {
      drawHubScene(ctx);
      ctx.restore();
      return;
    }
    if (scene === 'room') {
      drawRoomScene(ctx);
      ctx.restore();
      return;
    }
    if (scene === 'map' || overview) {
      drawMapScene(ctx);
      ctx.restore();
      return;
    }

    updateCamera(true);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(camZoom, camZoom);
    ctx.translate(-camX, -camY);
    drawFloor(ctx);
    drawNodes(ctx);
    drawStagePads(ctx);
    drawAvatarDot(ctx, px, py);
    ctx.restore();
    drawGrowthHud(ctx);
    ctx.restore();
  }

  let lastT = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;
    pulseT += dt;

    if (anim) {
      const u = Math.min(1, (now - anim.t0) / anim.dur);
      const e = easeInOut(u);
      if (anim.kind === 'walk') {
        const i = e * (anim.pts.length - 1);
        const i0 = Math.floor(i);
        const i1 = Math.min(anim.pts.length - 1, i0 + 1);
        const t = i - i0;
        const p0 = anim.pts[i0];
        const p1 = anim.pts[i1];
        px = p0.x + (p1.x - p0.x) * t;
        py = p0.y + (p1.y - p0.y) * t;
        overview = false;
        if (u >= 1) {
          const done = anim.onDone;
          anim = null;
          if (done) done();
        }
      } else if (anim.kind === 'cam') {
        camX = anim.fromX + (anim.toX - anim.fromX) * e;
        camY = anim.fromY + (anim.toY - anim.fromY) * e;
        camZoom = anim.fromZ + (anim.toZ - anim.fromZ) * e;
        if (u >= 1) anim = null;
      }
    } else if (scene === 'hub') {
      if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A')) hubFocus = 'left';
      if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) hubFocus = 'right';
      if (keys.has('ArrowUp') || keys.has('w') || keys.has('W')) hubFocus = 'door';
      if (keys.has('ArrowDown') || keys.has('s') || keys.has('S')) hubFocus = 'elder';
    } else if (scene === 'room') {
      if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A')) {
        keys.delete('ArrowLeft'); keys.delete('a'); keys.delete('A');
        if (mode !== 'island') shiftRoomDomain(-1);
        roomFocus = 'door';
      }
      if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) {
        keys.delete('ArrowRight'); keys.delete('d'); keys.delete('D');
        if (mode !== 'island') shiftRoomDomain(1);
        roomFocus = 'door';
      }
      if (keys.has('ArrowUp') || keys.has('w') || keys.has('W')) roomFocus = 'door';
      if (keys.has('ArrowDown') || keys.has('s') || keys.has('S')) roomFocus = 'back';
    }

    render();
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  function enterIsland(domain, lessonStateFn) {
    const pack = packForRealm(domain && domain.realm) || roomPack || 'shield';
    roomPack = pack;
    scene = 'room';
    mode = 'island';
    islandDomain = domain;
    focusKey = domain && domain.id;
    overview = false;
    roomFocus = 'door';
    const list = domainsInRealm(domain.realm || (pack === 'shield' ? 'sky' : pack === 'sword' ? 'underground' : 'land'));
    roomDomainIdx = Math.max(0, list.findIndex((n) => n.d && n.d.id === domain.id));
    const node = list[roomDomainIdx] || nodes.find(n => n.kind === 'domain' && n.d && n.d.id === domain.id);
    if (node && node._px != null) {
      px = node._px;
      py = node._py;
    }
    stagePads = [];
    const lessons = (domain.lessons || []).slice().sort((a, b) => a.no - b.no);
    lessons.forEach((l) => {
      const st = lessonStateFn ? lessonStateFn(l) : 'todo';
      stagePads.push({ lesson: l, x: 0, y: 0, state: st });
    });
    if (opts.onModeChange) opts.onModeChange('island', domain);
  }

  function exitIsland() {
    mode = 'world';
    islandDomain = null;
    stagePads = [];
    focusKey = null;
    if (opts.onModeChange) opts.onModeChange('world', null);
  }

  function findNodeIndexForCourse(courseNo) {
    if (!courseNo) return 0;
    const idx = nodes.findIndex(n =>
      n.kind === 'domain' && n.d && n.d.lessons && n.d.lessons.some(l => l.no === courseNo)
    );
    return idx >= 0 ? idx : 0;
  }

  function placeAvatarForProgress(courseNo) {
    if (!courseNo) {
      returnToHub(0);
      return;
    }
    const n = nodes[findNodeIndexForCourse(courseNo)];
    if (n && n.realm) {
      travelToRealm(n.realm, 0);
      const list = domainsInRealm(n.realm);
      const idx = list.findIndex((x) => x === n);
      if (idx >= 0) roomDomainIdx = idx;
      if (n._px != null) {
        px = n._px;
        py = n._py;
      }
    }
  }

  function walkAvatar(fromIdx, toIdx, onDone) {
    const dest = nodes[toIdx];
    if (dest && dest.realm && dest.kind === 'domain') {
      travelToRealm(dest.realm, 0);
      const list = domainsInRealm(dest.realm);
      const idx = list.findIndex((x) => x === dest);
      if (idx >= 0) roomDomainIdx = idx;
      if (onDone) onDone();
      return;
    }
    if (dest && dest.kind === 'hub') {
      returnToHub(0);
      if (onDone) onDone();
      return;
    }
    if (onDone) onDone();
  }

  function showOverview(duration) {
    scene = 'map';
    mode = 'world';
    focusKey = null;
    islandDomain = null;
    stagePads = [];
    roomPack = null;
    overview = true;
    if (opts.onModeChange) opts.onModeChange('world', null);
    if (reduced || duration === 0) {
      camX = dungeon.worldW / 2;
      camY = dungeon.worldH / 2;
      camZoom = Math.min(canvas.width / dungeon.worldW, canvas.height / dungeon.worldH) * 0.92;
      return;
    }
    anim = {
      kind: 'cam',
      t0: performance.now(),
      dur: duration == null ? 600 : duration,
      fromX: camX, fromY: camY, fromZ: camZoom,
      toX: dungeon.worldW / 2,
      toY: dungeon.worldH / 2,
      toZ: Math.min(canvas.width / dungeon.worldW, canvas.height / dungeon.worldH) * 0.92
    };
  }

  function realmCentroid(realm) {
    const rs = nodes.filter(n => n.realm === realm && n._px != null);
    if (!rs.length) return { x: dungeon.worldW / 2, y: dungeon.worldH / 2 };
    let sx = 0;
    let sy = 0;
    rs.forEach(n => { sx += n._px; sy += n._py; });
    return { x: sx / rs.length, y: sy / rs.length };
  }

  function travelToRealm(realm, duration) {
    if (typeof opts.canTravelRealm === 'function' && !opts.canTravelRealm(realm)) {
      if (opts.onTravelBlocked) opts.onTravelBlocked(realm, 'まだこの道へは進めません。');
      return null;
    }
    const pack = packForRealm(realm);
    if (!pack) return null;
    const inRealm = domainsInRealm(realm);
    const first = inRealm.find(n => n.state === 'open' || n.state === 'current' || n.state === 'cleared')
      || inRealm[0];
    if (!first) {
      if (opts.onTravelBlocked) opts.onTravelBlocked(realm, 'この道の分野がまだマップにありません。');
      return null;
    }
    roomPack = pack;
    roomDomainIdx = Math.max(0, inRealm.indexOf(first));
    roomFocus = 'door';
    scene = 'room';
    mode = 'world';
    focusKey = first.d ? first.d.id : null;
    islandDomain = null;
    stagePads = [];
    overview = false;
    anim = null;
    if (first._px != null) {
      px = first._px;
      py = first._py;
    }
    if (opts.onModeChange) opts.onModeChange('world', null);
    if (opts.onTravelRealm) opts.onTravelRealm(realm, first);
    void duration;
    return first;
  }

  function returnToHub(duration) {
    scene = 'hub';
    mode = 'world';
    islandDomain = null;
    stagePads = [];
    roomPack = null;
    overview = false;
    hubFocus = 'elder';
    if (hubNode && hubNode._px != null) {
      px = hubNode._px;
      py = hubNode._py;
    }
    if (opts.onModeChange) opts.onModeChange('world', null);
    anim = null;
    void duration;
  }

  function setAvatarLevel(level) {
    playerLevel = Math.max(1, parseInt(level, 10) || 1);
  }

  function screenToWorld(sx, sy) {
    return {
      x: camX + (sx - canvas.width / 2) / camZoom,
      y: camY + (sy - canvas.height / 2) / camZoom
    };
  }

  function hubHitTest(sx, sy) {
    const W = canvas.width;
    const H = canvas.height;
    if (sx > W * 0.1 && sx < W * 0.36 && sy > H * 0.35 && sy < H * 0.82) return 'left';
    if (sx > W * 0.64 && sx < W * 0.9 && sy > H * 0.35 && sy < H * 0.82) return 'right';
    if (sx > W * 0.36 && sx < W * 0.64 && sy > H * 0.12 && sy < H * 0.55) return 'door';
    if (sx > W * 0.5 && sx < W * 0.72 && sy > H * 0.45 && sy < H * 0.7) return 'elder';
    if (sy > H * 0.7) return 'elder';
    return null;
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      interact();
      return;
    }
    keys.add(e.key);
  }
  function onKeyUp(e) { keys.delete(e.key); }

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    if (scene === 'hub') {
      const hit = hubHitTest(sx, sy);
      if (hit) {
        hubFocus = hit;
        interactHub();
      }
      return;
    }
    if (scene === 'room') {
      if (mode === 'island' && stagePads.length) {
        const pad = stagePads.find((p) => p._sx != null && Math.hypot(p._sx - sx, p._sy - sy) < 22);
        if (pad && opts.onSelectLesson) {
          opts.onSelectLesson(pad.lesson);
          return;
        }
      }
      if (sy > canvas.height * 0.85) {
        roomFocus = 'back';
        interactRoom();
        return;
      }
      if (sx < canvas.width * 0.25 && mode !== 'island') {
        shiftRoomDomain(-1);
        return;
      }
      if (sx > canvas.width * 0.75 && mode !== 'island') {
        shiftRoomDomain(1);
        return;
      }
      roomFocus = 'door';
      interactRoom();
      return;
    }
    const w = screenToWorld(sx, sy);
    let best = null;
    let bestD = 48;
    nodes.forEach(n => {
      const d = Math.hypot(n._px - w.x, n._py - w.y);
      if (d < bestD) { bestD = d; best = n; }
    });
    if (!best) return;
    px = best._px;
    py = best._py;
    if (bestD < 40) {
      if (best.kind === 'hub') {
        returnToHub(0);
        if (opts.onSelectHub) opts.onSelectHub();
      } else if (best.kind === 'domain' && best.d) {
        if (best.state === 'fog') {
          if (opts.onTravelBlocked) opts.onTravelBlocked(best.realm, best.d.lockReason || 'この分野はまだ霧の中です。');
        } else if (opts.onSelectDomain) {
          travelToRealm(best.realm, 0);
          opts.onSelectDomain(best.d);
        }
      } else if (best.kind === 'core') {
        if (best.state === 'fog') {
          if (opts.onTravelBlocked) opts.onTravelBlocked('land', '中枢はすべての灯が点いてから開きます。');
        } else if (best.d && opts.onSelectDomain) {
          travelToRealm('land', 0);
          opts.onSelectDomain(best.d);
        }
      }
    }
  });

  dpad.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-dir]');
    if (!btn) return;
    const d = btn.getAttribute('data-dir');
    if (scene === 'hub') {
      if (d === 'left') hubFocus = 'left';
      if (d === 'right') hubFocus = 'right';
      if (d === 'up') hubFocus = 'door';
      if (d === 'down') hubFocus = 'elder';
      return;
    }
    if (scene === 'room') {
      if (d === 'left' && mode !== 'island') shiftRoomDomain(-1);
      if (d === 'right' && mode !== 'island') shiftRoomDomain(1);
      if (d === 'up') roomFocus = 'door';
      if (d === 'down') {
        roomFocus = 'back';
        interactRoom();
      }
      return;
    }
    if (scene === 'map' || overview) return;
  });

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('resize', resize);

  // 初期は拠点シーン（後ろ姿構図）
  returnToHub(0);
  if (opts.avatarCourseNo > 1) {
    placeAvatarForProgress(opts.avatarCourseNo);
  }

  return {
    enterIsland,
    exitIsland,
    walkAvatar,
    placeAvatarForProgress,
    findNodeIndexForCourse,
    showOverview,
    travelToRealm,
    returnToHub,
    setAvatarLevel,
    setGrowth,
    spawnParticles() {},
    getMode: () => mode,
    getScene: () => scene,
    focusDomainId: () => focusKey,
    nodes,
    resize,
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', resize);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      if (dpad.parentNode) dpad.parentNode.removeChild(dpad);
    }
  };
}

export const mountLampDungeon = mountLampWorld;
