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
 * 構えた後ろ姿（hero-hold-bare）への着せ替えスロット。
 * 単位: 幅/高さ 100 基準、原点=胴体中心（画像の 50%, 48%）。facing で X・scaleX 連動。
 * ax/ay: プレート内の持ち手アンカー（0–1）。盾=内側、剣=グリップ。
 */
const HERO_EQUIP_ATTACH = {
  // hero-hold-bare 実測: 左手≈(-19,-11) 右手≈(14,2)。盾は手に重ね、剣は握りを拳に
  shield: {
    lx: -19,
    ly: -11,
    w: 30,
    h: 34,
    rot: -0.02,
    ax: 0.50,
    ay: 0.48,
    z: 'front',
    flipWithFacing: true
  },
  sword: {
    lx: 14,
    ly: 2,
    w: 14,
    h: 38,
    rot: 0.03,
    ax: 0.50,
    ay: 0.30,
    z: 'front',
    flipWithFacing: true
  }
};

/** 黒背景フォールバック用（JPG 時）。PNG はアルファをそのまま使う */
const _keyedCanvasCache = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
function keyedCanvasFor(img, threshold) {
  const thr = threshold == null ? 28 : threshold;
  if (_keyedCanvasCache) {
    const hit = _keyedCanvasCache.get(img);
    if (hit && hit.thr === thr) return hit.canvas;
  }
  const oc = document.createElement('canvas');
  oc.width = img.naturalWidth;
  oc.height = img.naturalHeight;
  const octx = oc.getContext('2d');
  octx.drawImage(img, 0, 0);
  const data = octx.getImageData(0, 0, oc.width, oc.height);
  const d = data.data;
  const soft = 18;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    const mx = Math.max(r, g, b);
    // 真の黒背景のみ透過（暗い紺コート等は残す）
    if (mx <= thr) d[i + 3] = 0;
    else if (mx <= thr + soft && r <= thr + soft && g <= thr + soft && b <= thr + soft) {
      d[i + 3] = Math.max(0, Math.min(255, Math.round(255 * ((mx - thr) / soft))));
    }
  }
  octx.putImageData(data, 0, 0);
  if (_keyedCanvasCache) _keyedCanvasCache.set(img, { thr, canvas: oc });
  return oc;
}
function spriteHasAlpha(img) {
  return !!(img && /\.png($|\?)/i.test(img.src || ''));
}
function drawSpriteAlpha(ctx, img, x, y, w, h) {
  if (!img || !img.naturalWidth) return false;
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.globalCompositeOperation = 'source-over';
  if (spriteHasAlpha(img)) ctx.drawImage(img, x, y, w, h);
  else ctx.drawImage(keyedCanvasFor(img, 28), x, y, w, h);
  ctx.restore();
  return true;
}

/** PNG アルファをそのまま描く（アルファブレンド有効）。親子変換付き */
function drawChildSprite(ctx, img, parent, attach, facing) {
  if (!img || !img.naturalWidth || !parent || !attach) return false;
  const face = facing < 0 ? -1 : 1;
  const ux = parent.w / 100;
  const uy = parent.h / 100;
  const localX = (attach.lx || 0) * face * ux;
  const localY = (attach.ly || 0) * uy;
  const dw = (attach.w || 40) * ux;
  const dh = (attach.h || 40) * uy;
  const rot = (attach.rot || 0) * face;
  const flipX = attach.flipWithFacing ? face : 1;
  const ax = attach.ax == null ? 0.5 : attach.ax;
  const ay = attach.ay == null ? 0.5 : attach.ay;
  const src = spriteHasAlpha(img) ? img : keyedCanvasFor(img, 26);

  ctx.save();
  // 親原点（主人公中心）→ 手の位置 → プレート内アンカーで持つ
  ctx.translate(parent.cx + localX, parent.cy + localY);
  ctx.rotate(rot);
  ctx.scale(flipX, 1);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.globalCompositeOperation = 'source-over';
  ctx.drawImage(src, -dw * ax, -dh * ay, dw, dh);
  ctx.restore();
  return true;
}

function drawAuraSprite(ctx, img, parent, spiritLv) {
  if (!img || !img.naturalWidth || !parent) return false;
  const scale = 1.15 + spiritLv * 0.12;
  const aw = parent.w * scale;
  const ah = parent.h * (1.05 + spiritLv * 0.08);
  ctx.save();
  ctx.globalCompositeOperation = spiritLv >= 3 ? 'lighter' : 'screen';
  ctx.globalAlpha = 0.55 + spiritLv * 0.1;
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(img, parent.cx - aw / 2, parent.cy - ah * 0.42, aw, ah);
  ctx.restore();
  return true;
}

function heldEquipRel(kind, level) {
  const n = String(Math.max(1, level || 1)).padStart(2, '0');
  // on-character は slot のみ（growth は HUD、held-* は腕焼き付きで使わない）
  if (kind === 'shield') return 'common/equip/slot-shield-' + n + '.png';
  if (kind === 'sword') return 'common/equip/slot-sword-' + n + '.png';
  if (kind === 'aura') return 'common/equip/aura-' + n + '.png';
  return growthIconRel(kind, level);
}

/** 背景の空きニッチに扉をピッタリはめ込む矩形（拠点／部屋／剣は下延長） */
function doorNicheRect(W, H, kind) {
  if (kind === 'hub') {
    const w = W * 0.30;
    const h = H * 0.76;
    return { x: W * 0.5 - w / 2, y: H * 0.045, w, h };
  }
  if (kind === 'sword') {
    const w = W * 0.32;
    const h = H * 0.88;
    return { x: W * 0.5 - w / 2, y: H * 0.02, w, h };
  }
  const w = W * 0.305;
  const h = H * 0.80;
  return { x: W * 0.5 - w / 2, y: H * 0.025, w, h };
}

function growthLevelOf(g) {
  if (g && g.level != null) return Math.max(1, parseInt(g.level, 10) || 1);
  const r = (g && g.ratio) || 0;
  if (r >= 0.45) return 3;
  if (r >= 0.15) return 2;
  return 1;
}

function growthIconRel(key, level) {
  const n = String(Math.max(1, level || 1)).padStart(2, '0');
  return 'common/growth/' + key + '-' + n + '.jpg';
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

  const growthHud = document.createElement('div');
  growthHud.className = 'lamp-growth-hud';
  growthHud.setAttribute('aria-label', '盾・剣・精神の成長');
  growthHud.innerHTML = `
    <div class="lamp-growth-row" data-key="shield"><img alt="" width="28" height="28"><span class="g-name">盾</span><span class="g-lv">Lv1</span></div>
    <div class="lamp-growth-row" data-key="sword"><img alt="" width="28" height="28"><span class="g-name">剣</span><span class="g-lv">Lv1</span></div>
    <div class="lamp-growth-row" data-key="spirit"><img alt="" width="28" height="28"><span class="g-name">精神</span><span class="g-lv">Lv1</span></div>`;
  container.appendChild(growthHud);

  const doorNav = document.createElement('div');
  doorNav.className = 'lamp-door-nav';
  doorNav.setAttribute('role', 'toolbar');
  doorNav.setAttribute('aria-label', '扉ナビ');
  doorNav.innerHTML = `
    <button type="button" data-door="prev">◀ 前の扉 <kbd>[</kbd></button>
    <button type="button" class="primary" data-door="current">この扉 <kbd>F</kbd></button>
    <button type="button" data-door="next">次の扉 ▶ <kbd>]</kbd></button>`;
  container.appendChild(doorNav);

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
  /** 主人公の向き: 1=右寄り（既定） / -1=左。装備の X・scaleX と連動 */
  let heroFacing = 1;

  /** 拠点・道・マップ用アート（失敗時は手描き／コード描画） */
  const hubArt = {
    heroHoldBare: null,
    heroHoldRear: null,
    heroBare: null,
    heroBareWalk1: null,
    heroBareWalk2: null,
    hero: null,
    heroWalk1: null,
    heroWalk2: null,
    heroMid: null,
    heroStrong: null,
    spiritAura: null,
    aura1: null,
    aura2: null,
    aura3: null,
    aura4: null,
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
    iconShieldMid: null,
    iconShieldStrong: null,
    iconSwordMid: null,
    iconSwordStrong: null,
    iconSpiritMid: null,
    iconSpiritStrong: null,
    /** @type {Record<string, HTMLImageElement|null>} */
    domainDoors: {},
    /** @type {Record<string, HTMLImageElement|null>} */
    domainBgs: {}
  };
  let doorAnim = null;
  let clearDoorFlash = 0;
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
    loadHubImage('common/hero-hold-bare.png').then((i) => { hubArt.heroHoldBare = i; }),
    // hero-hold-rear は焼き付き装備ありのため読み込まない

    loadHubImage('common/hero-bare.png').then((i) => { hubArt.heroBare = i; }),
    loadHubImage('common/hero-bare-walk-1.png').then((i) => { hubArt.heroBareWalk1 = i; }),
    loadHubImage('common/hero-bare-walk-2.png').then((i) => { hubArt.heroBareWalk2 = i; }),
    loadHubImage('common/hero-back.png').then((i) => { hubArt.hero = i; }),
    loadHubImage('common/hero-walk-1.png').then((i) => { hubArt.heroWalk1 = i; }),
    loadHubImage('common/hero-walk-2.png').then((i) => { hubArt.heroWalk2 = i; }),
    loadHubImage('common/hero-mid.jpg').then((i) => { hubArt.heroMid = i; }),
    loadHubImage('common/hero-strong.jpg').then((i) => { hubArt.heroStrong = i; }),
    loadHubImage('common/spirit-aura.jpg').then((i) => { hubArt.spiritAura = i; }),
    loadHubImage('common/equip/aura-01.jpg').then((i) => { hubArt.aura1 = i; }),
    loadHubImage('common/equip/aura-02.jpg').then((i) => { hubArt.aura2 = i; }),
    loadHubImage('common/equip/aura-03.jpg').then((i) => { hubArt.aura3 = i; }),
    loadHubImage('common/equip/aura-04.jpg').then((i) => { hubArt.aura4 = i; }),
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
    loadHubImage('common/icon-shield-mid.png').then((i) => { hubArt.iconShieldMid = i; }),
    loadHubImage('common/icon-shield-strong.png').then((i) => { hubArt.iconShieldStrong = i; }),
    loadHubImage('common/icon-sword-mid.png').then((i) => { hubArt.iconSwordMid = i; }),
    loadHubImage('common/icon-sword-strong.png').then((i) => { hubArt.iconSwordStrong = i; }),
    loadHubImage('common/icon-spirit-mid.png').then((i) => { hubArt.iconSpiritMid = i; }),
    loadHubImage('common/icon-spirit-strong.png').then((i) => { hubArt.iconSpiritStrong = i; }),
    ...DOMAIN_DOOR_IDS.map((id) =>
      loadHubImage('rooms/domains/' + id + '.jpg').then((i) => { hubArt.domainDoors[id] = i; })
    ),
    ...DOMAIN_DOOR_IDS.map((id) =>
      loadHubImage('rooms/domains/' + id + '-bg.jpg').then((i) => { hubArt.domainBgs[id] = i; })
    )
  ]).catch(() => {});

  function growthGearTier() {
    // 現在レベルの装備を必ず反映（道の平均レベルで見た目段階を決める）
    const levels = [
      growthLevelOf(growth.shield),
      growthLevelOf(growth.sword),
      growthLevelOf(growth.spirit)
    ];
    const avg = levels.reduce((s, n) => s + n, 0) / levels.length;
    if (avg >= 8) return 'strong';
    if (avg >= 3) return 'mid';
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

  let viewDpr = 1;
  function resize() {
    const r = container.getBoundingClientRect();
    viewDpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(320, Math.floor(r.width * viewDpr));
    canvas.height = Math.max(240, Math.floor(r.height * viewDpr));
    canvas.style.width = Math.max(1, Math.floor(r.width)) + 'px';
    canvas.style.height = Math.max(1, Math.floor(r.height)) + 'px';
  }
  resize();

  function growthIconSrc(key, level) {
    return new URL(growthIconRel(key, level), HUB_ASSET_BASE).href;
  }

  /** 現在レベルのテクスチャだけ差し替え（アタッチ位置・透過設定は維持＝着せ替え） */
  function ensureEquippedIcons() {
    const shieldLv = growthLevelOf(growth.shield);
    const swordLv = growthLevelOf(growth.sword);
    const spiritLv = Math.max(1, Math.min(4, growthLevelOf(growth.spirit)));
    const nSp = String(spiritLv).padStart(2, '0');
    const jobs = [
      // on-character: slot のみ（held / growth は二重・浮きの原因なので使わない）
      ['held_shield_' + shieldLv, heldEquipRel('shield', shieldLv)],
      ['held_sword_' + swordLv, heldEquipRel('sword', swordLv)],
      ['held_aura_' + spiritLv, heldEquipRel('aura', spiritLv), 'common/equip/aura-' + nSp + '.jpg']
    ];
    jobs.forEach(([artKey, primary, ...fallbacks]) => {
      if (hubArt[artKey] && hubArt[artKey].naturalWidth) return;
      let chain = loadHubImage(primary);
      fallbacks.forEach((fb) => {
        chain = chain.then((im) => {
          if (im) {
            hubArt[artKey] = im;
            return im;
          }
          return loadHubImage(fb);
        });
      });
      chain.then((im) => { if (im) hubArt[artKey] = im; });
    });
  }

  function refreshGrowthHud() {
    [
      ['shield', growth.shield],
      ['sword', growth.sword],
      ['spirit', growth.spirit]
    ].forEach(([key, g]) => {
      const row = growthHud.querySelector('[data-key="' + key + '"]');
      if (!row) return;
      const lv = growthLevelOf(g);
      const maxLv = (g && g.maxLevel) || (key === 'shield' ? 18 : key === 'sword' ? 7 : 4);
      const img = row.querySelector('img');
      const lvEl = row.querySelector('.g-lv');
      // HUD は成長アイコン、キャラは手持ちプレートを装備
      if (img) img.src = growthIconSrc(key, lv);
      if (lvEl) lvEl.textContent = 'Lv' + lv + '/' + maxLv;
      row.title = 'ギャラリーを開く（' + (key === 'shield' ? '盾' : key === 'sword' ? '剣' : '精神') + '）';
      row.style.pointerEvents = 'auto';
      row.style.cursor = 'pointer';
    });
    ensureEquippedIcons();
  }

  function setGrowth(g, open) {
    if (g) growth = g;
    if (open != null) landOpen = !!open;
    refreshGrowthHud();
  }

  function syncDoorNav() {
    const show = scene === 'room';
    doorNav.classList.toggle('show', show);
  }

  function enterCurrentDoor() {
    if (scene !== 'room') return;
    if (mode === 'island') {
      roomFocus = 'door';
      return;
    }
    roomFocus = 'door';
    interactRoom();
  }

  refreshGrowthHud();

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
    syncDoorNav();
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
    const onMap = scene === 'map' || overview;
    const u = onMap ? Math.max(1.6, layoutW / 1400) : 1;
    dungeon.nodeMeta.forEach(({ node: n, px: nx, py: ny }) => {
      if (mode === 'island' && islandDomain && n.kind === 'domain' && n.d && n.d.id !== islandDomain.id) {
        ctx.globalAlpha = 0.12;
      } else {
        ctx.globalAlpha = 1;
      }
      const theme = themeFor(n);
      const accent = hexFromTheme(theme.accent);
      const st = n.state || 'open';
      const r = (n.kind === 'hub' ? 36 : n.kind === 'core' ? 40 : 30) * u;
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
      if (st === 'cleared' && n.kind === 'domain') {
        ctx.beginPath();
        ctx.arc(nx, ny, r + 10 * u, 0, Math.PI * 2);
        ctx.strokeStyle = STATE_COLOR.cleared;
        ctx.lineWidth = 3 * u;
        ctx.globalAlpha = 0.95;
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.fillStyle = STATE_COLOR.cleared;
        ctx.font = 'bold ' + Math.round(12 * u) + 'px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('✓', nx + r * 0.75, ny - r * 0.75);
      }

      const labelPx = Math.round(11 * u);
      const subPx = Math.round(10 * u);
      ctx.fillStyle = st === 'cleared' ? STATE_COLOR.cleared : '#ece9f5';
      ctx.font = '600 ' + labelPx + 'px "Segoe UI", "Yu Gothic UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((n.label || '').slice(0, onMap ? 10 : 8), nx, ny + r + 12 * u);
      if (st === 'cleared' && n.kind === 'domain') {
        ctx.font = subPx + 'px sans-serif';
        ctx.fillStyle = '#c8e090';
        ctx.fillText('解錠済み', nx, ny + r + 24 * u);
      } else if (n.sub) {
        ctx.font = subPx + 'px sans-serif';
        ctx.fillStyle = '#9aa0c4';
        ctx.fillText(n.sub, nx, ny + r + 24 * u);
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

  function drawGrowthHud(_ctx) {
    /* DOM の右下 HUD に移した */
  }

  function syncHeroFacing() {
    if (scene === 'hub') {
      if (hubFocus === 'left') heroFacing = -1;
      else if (hubFocus === 'right') heroFacing = 1;
      // door / elder は直前の向きを維持
      return;
    }
    if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A')) heroFacing = -1;
    else if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) heroFacing = 1;
  }

  function drawHeroSprite(ctx, W, H) {
    ensureEquippedIcons();
    syncHeroFacing();
    const shieldLv = growthLevelOf(growth.shield);
    const swordLv = growthLevelOf(growth.sword);
    const spiritLv = Math.max(1, Math.min(4, growthLevelOf(growth.spirit)));

    // 構えた後ろ姿（空手）＋スロット装備の着せ替え。歩行は構えポーズを優先
    let heroImg = hubArt.heroHoldBare || hubArt.heroBare || hubArt.hero;

    const heroW = Math.min(W * 0.30, 220);
    const heroH = heroW * 1.35;
    const bob = Math.sin(pulseT * 2) * 1.5;
    const footY = H * 0.955;
    const heroX = W * 0.5 - heroW / 2;
    const heroY = footY - heroH + bob;
    // 親（主人公）トランスフォーム — 子装備はこの中心に追従
    const parent = {
      x: heroX,
      y: heroY,
      w: heroW,
      h: heroH,
      cx: heroX + heroW / 2,
      cy: heroY + heroH * 0.48,
      facing: heroFacing,
      bob
    };

    const auraImg = hubArt['held_aura_' + spiritLv]
      || hubArt['aura' + spiritLv]
      || hubArt.spiritAura;
    const shieldImg = hubArt['held_shield_' + shieldLv];
    const swordImg = hubArt['held_sword_' + swordLv];

    // 描画順: オーラ → 体 → 盾（表・左手の上） → 剣（グリップを右手に）
    if (auraImg) drawAuraSprite(ctx, auraImg, parent, spiritLv);

    ctx.save();
    ctx.translate(parent.cx, parent.cy);
    ctx.scale(heroFacing, 1);
    ctx.translate(-parent.cx, -parent.cy);
    if (!drawSpriteAlpha(ctx, heroImg, heroX, heroY, heroW, heroH)) {
      const s = Math.max(3, Math.floor(Math.min(W, H) / 120));
      drawHeroBack(ctx, W * 0.5, footY - H * 0.02, s * 1.05, pulseT);
    }
    ctx.restore();

    if (shieldImg) {
      drawChildSprite(ctx, shieldImg, parent, HERO_EQUIP_ATTACH.shield, heroFacing);
    }
    if (swordImg) {
      drawChildSprite(ctx, swordImg, parent, HERO_EQUIP_ATTACH.sword, heroFacing);
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

    // 左・盾の通路 / 右・剣の通路（扉ではなく奥が見える開いた通路。背景に焼き込み）
    const leftLit = hubFocus === 'left';
    const rightLit = hubFocus === 'right';
    const pathL = { x: W * 0.03, y: H * 0.20, w: W * 0.28, h: H * 0.55 };
    const pathR = { x: W * 0.69, y: H * 0.20, w: W * 0.28, h: H * 0.55 };
    // 背景に通路が無い場合のみスプライトで補完（扉パネル無しの通路絵）
    const hasHubBg = !!(hubArt.hubBg && hubArt.hubBg.naturalWidth);
    if (!hasHubBg) {
      if (!drawArt(ctx, hubArt.pathShield, pathL.x, pathL.y, pathL.w, pathL.h)) {
        drawPathArch(ctx, pathL.x + pathL.w * 0.1, pathL.y, pathL.w * 0.8, pathL.h, '#c47820', '#ffe08a', leftLit, '盾');
      }
      if (!drawArt(ctx, hubArt.pathSword, pathR.x, pathR.y, pathR.w, pathR.h)) {
        drawPathArch(ctx, pathR.x + pathR.w * 0.1, pathR.y, pathR.w * 0.8, pathR.h, '#7040c0', '#d8c8ff', rightLit, '剣');
      }
    }
    if (leftLit) {
      ctx.strokeStyle = '#ffe08a';
      ctx.lineWidth = 3;
      ctx.strokeRect(pathL.x + 2, pathL.y + 2, pathL.w - 4, pathL.h - 4);
      ctx.fillStyle = '#ffe08a';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('盾の通路', pathL.x + pathL.w / 2, pathL.y + pathL.h + 16);
    }
    if (rightLit) {
      ctx.strokeStyle = '#d8c8ff';
      ctx.lineWidth = 3;
      ctx.strokeRect(pathR.x + 2, pathR.y + 2, pathR.w - 4, pathR.h - 4);
      ctx.fillStyle = '#d8c8ff';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('剣の通路', pathR.x + pathR.w / 2, pathR.y + pathR.h + 16);
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
    const niche = doorNicheRect(W, H, 'hub');
    const doorW = niche.w;
    const doorH = niche.h;
    const doorX = niche.x;
    const doorY = niche.y;
    if (!drawArt(ctx, doorImg, doorX, doorY, doorW, doorH)) {
      drawGreatDoor(ctx, W * 0.5, doorY + H * 0.02, doorW * 0.95, doorH * 0.92, doorOpen, doorLit, s);
    } else if (doorLit) {
      ctx.strokeStyle = '#ffe08a';
      ctx.lineWidth = 3;
      ctx.strokeRect(doorX - 4, doorY - 4, doorW + 8, doorH + 8);
    }

    // 謎の老人（扉の右・床に足）
    const elderLit = hubFocus === 'elder';
    const elderW = Math.min(W * 0.24, 180);
    const elderH = elderW * 1.35;
    const elderX = W * 0.62;
    const elderFootY = H * 0.90;
    const elderY = elderFootY - elderH;
    const elderImg = elderLit
      ? (hubArt.elderTalk || hubArt.elder)
      : (hubArt.elderSmile || hubArt.elder);
    if (!drawArt(ctx, elderImg, elderX, elderY, elderW, elderH)) {
      drawElder(ctx, elderX + elderW * 0.35, elderFootY - H * 0.08, s, elderLit);
    } else {
      if (elderLit) {
        ctx.strokeStyle = '#7fd1ff';
        ctx.lineWidth = 2;
        ctx.strokeRect(elderX - 2, elderY - 2, elderW + 4, elderH + 4);
      }
      ctx.fillStyle = '#c8c4e0';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('謎の老人', elderX + elderW / 2, elderY - 6);
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
      left: 'Enter … 盾の通路へ',
      right: 'Enter … 剣の通路へ',
      door: landOpen ? 'Enter … 大扉' : 'Enter … まだ不十分'
    };
    ctx.fillText(hints[hubFocus] || '', W / 2, H - 18);
  }

  /** 道中も同じ後ろ姿構図（背景・扉セットだけ差し替え） */
  function drawRoomScene(ctx) {
    const W = canvas.width;
    const H = canvas.height;
    const pack = roomPack || 'shield';
    const packBg = pack === 'sword' ? hubArt.swordBg : pack === 'spirit' ? hubArt.spiritBg : hubArt.shieldBg;
    const packDoor = pack === 'sword' ? hubArt.swordDoor : pack === 'spirit' ? hubArt.spiritDoor : hubArt.shieldDoor;
    const domainNode = currentRoomDomain();
    const domainId = domainNode && domainNode.d && domainNode.d.id;
    const domainCleared = !!(domainNode && domainNode.state === 'cleared');
    const bgImg = (domainId && hubArt.domainBgs[domainId]) || packBg;
    let doorImg = (domainId && hubArt.domainDoors[domainId]) || packDoor;
    if (domainCleared && !(doorAnim || clearDoorFlash > 0)) {
      doorImg = hubArt.doorOpen2 || hubArt.doorAjar || doorImg;
    }
    if (doorAnim || clearDoorFlash > 0) {
      const phase = doorAnim
        ? Math.min(1, (performance.now() - doorAnim.t0) / Math.max(1, doorAnim.dur))
        : clearDoorFlash;
      doorImg = phase < 0.35
        ? (hubArt.doorOpen1 || hubArt.doorAjar || doorImg)
        : phase < 0.7
          ? (hubArt.doorAjar || hubArt.doorOpen1 || doorImg)
          : (hubArt.doorOpen2 || hubArt.doorAjar || doorImg);
    }
    const accent = pack === 'sword' ? '#d8c8ff' : pack === 'spirit' ? '#b8ffd0' : '#ffe08a';
    const clearAccent = '#ffe08a';
    const realmLabel = pack === 'sword' ? '剣の道' : pack === 'spirit' ? '大扉の奥' : '盾の道';

    if (!drawArt(ctx, bgImg, 0, 0, W, H)) {
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, pack === 'spirit' ? '#0e2818' : pack === 'sword' ? '#1a1030' : '#1a2040');
      bg.addColorStop(1, '#0c1018');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
    }

    const niche = doorNicheRect(W, H, pack === 'sword' ? 'sword' : 'room');
    const doorW = niche.w;
    const doorH = niche.h;
    const doorX = niche.x;
    const doorY = niche.y;
    if (!drawArt(ctx, doorImg, doorX, doorY, doorW, doorH)) {
      ctx.fillStyle = '#2a1a10';
      ctx.fillRect(doorX, doorY, doorW, doorH);
      ctx.strokeStyle = accent;
      ctx.strokeRect(doorX + 8, doorY + 8, doorW - 16, doorH - 16);
    }
    if (domainCleared) {
      // 解錠済みの印（開いた扉＋金の光＋札）— ニッチ内の同じ矩形に合わせる
      ctx.save();
      const glow = ctx.createRadialGradient(
        doorX + doorW * 0.5, doorY + doorH * 0.45, doorW * 0.08,
        doorX + doorW * 0.5, doorY + doorH * 0.45, doorW * 0.7
      );
      glow.addColorStop(0, 'rgba(255, 224, 138, 0.28)');
      glow.addColorStop(1, 'rgba(255, 224, 138, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(doorX - 20, doorY - 20, doorW + 40, doorH + 40);
      ctx.strokeStyle = clearAccent;
      ctx.lineWidth = 4;
      ctx.globalAlpha = 0.95;
      ctx.strokeRect(doorX - 6, doorY - 6, doorW + 12, doorH + 12);
      ctx.globalAlpha = 1;
      const badgeY = doorY + doorH * 0.48;
      ctx.fillStyle = 'rgba(20, 28, 12, 0.88)';
      ctx.fillRect(doorX + doorW * 0.18, badgeY, doorW * 0.64, 36);
      ctx.strokeStyle = clearAccent;
      ctx.lineWidth = 2;
      ctx.strokeRect(doorX + doorW * 0.18, badgeY, doorW * 0.64, 36);
      ctx.fillStyle = clearAccent;
      ctx.font = 'bold 16px "Segoe UI", "Yu Gothic UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('解錠済み', doorX + doorW * 0.5, badgeY + 18);
      ctx.restore();
    }
    if (roomFocus === 'door') {
      ctx.strokeStyle = domainCleared ? clearAccent : accent;
      ctx.lineWidth = 3;
      ctx.strokeRect(doorX - 4, doorY - 4, doorW + 8, doorH + 8);
    }

    // 扉がニッチいっぱいに伸びるので、ラベルは扉下端ではなく手前帯に置く
    const title = (domainNode && domainNode.d && domainNode.d.title) || realmLabel;
    const labelY = H * 0.395;
    ctx.fillStyle = 'rgba(10,14,28,0.8)';
    ctx.fillRect(W / 2 - 160, labelY, 320, 28);
    ctx.fillStyle = domainCleared ? clearAccent : accent;
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title + (domainCleared ? '　✓' : ''), W / 2, labelY + 19);
    if (domainNode && domainNode.state === 'fog') {
      ctx.fillStyle = '#9aa0c4';
      ctx.font = '11px sans-serif';
      ctx.fillText('霧の中', W / 2, labelY + 36);
    } else if (domainCleared) {
      ctx.fillStyle = '#c8e090';
      ctx.font = '11px sans-serif';
      ctx.fillText('この扉はすでに開いている', W / 2, labelY + 36);
    }

    drawHeroSprite(ctx, W, H);

    // 講座番号はキャラ頭上（手前帯の上）に置き、被りを避ける
    if (mode === 'island' && stagePads.length) {
      const y0 = H * 0.48;
      stagePads.forEach((pad, i) => {
        const x = W * 0.5 + (i - (stagePads.length - 1) / 2) * 52;
        const col = pad.state === 'cleared' ? STATE_COLOR.cleared
          : pad.state === 'next' ? STATE_COLOR.current
          : pad.state === 'skipped' ? '#c59bff' : '#3a4568';
        ctx.beginPath();
        ctx.arc(x, y0, 18, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.fill();
        ctx.strokeStyle = 'rgba(15,18,38,0.85)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#0f1226';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(pad.lesson.no), x, y0);
        pad._sx = x;
        pad._sy = y0;
      });
    }

    ctx.fillStyle = 'rgba(10,14,28,0.75)';
    ctx.fillRect(W / 2 - 170, H - 36, 340, 26);
    ctx.fillStyle = '#c8c4e0';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    const hint = mode === 'island'
      ? '講座を選ぶ　↓ 道へ戻る'
      : '[ ] 前後の扉　F 入る　↓ 拠点へ';
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
    canvas.classList.add('map-hires');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
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
    ctx.font = Math.round(13 * viewDpr) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('全体マップ　クリックで移動', W / 2, H - 18 * viewDpr);
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
    const mapView = scene === 'map' || overview;
    if (!mapView) canvas.classList.remove('map-hires');
    ctx.imageSmoothingEnabled = !!mapView;
    if (mapView) ctx.imageSmoothingQuality = 'high';
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
    if (mapView) {
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

    if (doorAnim) {
      const u = Math.min(1, (now - doorAnim.t0) / Math.max(1, doorAnim.dur));
      clearDoorFlash = u;
      if (u >= 1) {
        const done = doorAnim.onDone;
        doorAnim = null;
        clearDoorFlash = 0;
        if (done) done();
      }
    }

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
      // 矢印では扉移動しない（ボタン / [ ] / F のみ）
      if (keys.has('ArrowDown') || keys.has('s') || keys.has('S')) roomFocus = 'back';
      if (keys.has('ArrowUp') || keys.has('w') || keys.has('W')) roomFocus = 'door';
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
    syncDoorNav();
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
    syncDoorNav();
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
    syncDoorNav();
    focusKey = null;
    islandDomain = null;
    stagePads = [];
    roomPack = null;
    overview = true;
    if (opts.onModeChange) opts.onModeChange('world', null);
    if (reduced || duration === 0) {
      camX = dungeon.worldW / 2;
      camY = dungeon.worldH / 2;
      camZoom = Math.min(canvas.width / dungeon.worldW, canvas.height / dungeon.worldH) * 0.98;
      return;
    }
    anim = {
      kind: 'cam',
      t0: performance.now(),
      dur: duration == null ? 600 : duration,
      fromX: camX, fromY: camY, fromZ: camZoom,
      toX: dungeon.worldW / 2,
      toY: dungeon.worldH / 2,
      toZ: Math.min(canvas.width / dungeon.worldW, canvas.height / dungeon.worldH) * 0.98
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

  function travelToRealm(realm, duration, targetNode) {
    if (typeof opts.canTravelRealm === 'function' && !opts.canTravelRealm(realm)) {
      if (opts.onTravelBlocked) opts.onTravelBlocked(realm, 'まだこの道へは進めません。');
      return null;
    }
    const pack = packForRealm(realm);
    if (!pack) return null;
    const inRealm = domainsInRealm(realm);
    let target = targetNode && inRealm.includes(targetNode) ? targetNode : null;
    if (!target && targetNode && targetNode.d) {
      target = inRealm.find((n) => n.d && n.d.id === targetNode.d.id) || null;
    }
    if (!target) {
      target = inRealm.find(n => n.state === 'open' || n.state === 'current' || n.state === 'cleared')
        || inRealm[0];
    }
    if (!target) {
      if (opts.onTravelBlocked) opts.onTravelBlocked(realm, 'この道の分野がまだマップにありません。');
      return null;
    }
    roomPack = pack;
    roomDomainIdx = Math.max(0, inRealm.indexOf(target));
    roomFocus = 'door';
    scene = 'room';
    mode = 'world';
    syncDoorNav();
    focusKey = target.d ? target.d.id : null;
    islandDomain = null;
    stagePads = [];
    overview = false;
    anim = null;
    if (target._px != null) {
      px = target._px;
      py = target._py;
    }
    if (opts.onModeChange) opts.onModeChange('world', null);
    if (opts.onTravelRealm) opts.onTravelRealm(realm, target);
    void duration;
    return target;
  }

  function playClearDoorThen(onDone) {
    doorAnim = { t0: performance.now(), dur: 900, onDone: onDone || null };
    clearDoorFlash = 0.01;
  }

  function returnToHub(duration) {
    scene = 'hub';
    mode = 'world';
    syncDoorNav();
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
    if (sx > W * 0.02 && sx < W * 0.32 && sy > H * 0.18 && sy < H * 0.78) return 'left';
    if (sx > W * 0.68 && sx < W * 0.98 && sy > H * 0.18 && sy < H * 0.78) return 'right';
    if (sx > W * 0.35 && sx < W * 0.65 && sy > H * 0.04 && sy < H * 0.78) return 'door';
    if (sx > W * 0.58 && sx < W * 0.82 && sy > H * 0.55 && sy < H * 0.9) return 'elder';
    if (sy > H * 0.88) return 'elder';
    return null;
  }

  function onKeyDown(e) {
    // 前／次の扉はショートカットのみ（矢印・Enter では動かさない）
    if (scene === 'room' && doorNav.classList.contains('show') && mode !== 'island') {
      if (e.key === '[' || e.key === 'q' || e.key === 'Q') {
        e.preventDefault();
        shiftRoomDomain(-1);
        roomFocus = 'door';
        return;
      }
      if (e.key === ']' || e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        shiftRoomDomain(1);
        roomFocus = 'door';
        return;
      }
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        enterCurrentDoor();
        return;
      }
    }
    if (e.key === 'Enter' || e.key === ' ') {
      // セリフ操作中は map.html 側へ任せる
      if (typeof document !== 'undefined') {
        const say = document.getElementById('say-box');
        if (say && say.classList.contains('show')) return;
      }
      e.preventDefault();
      interact();
      return;
    }
    keys.add(e.key);
  }
  function onKeyUp(e) { keys.delete(e.key); }

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const sx = (e.clientX - rect.left) * viewDpr;
    const sy = (e.clientY - rect.top) * viewDpr;
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
      // 前後の扉はボタン／ショートカットのみ（画面端クリックでは動かさない）
      roomFocus = 'door';
      interactRoom();
      return;
    }
    const w = screenToWorld(sx, sy);
    let best = null;
    let bestD = 1e9;
    const hitR = Math.max(72, (layoutW / 2800) * 90) / Math.max(0.35, camZoom);
    nodes.forEach(n => {
      if (n._px == null) return;
      const d = Math.hypot(n._px - w.x, n._py - w.y);
      if (d < bestD) { bestD = d; best = n; }
    });
    if (!best || bestD > hitR) return;
    px = best._px;
    py = best._py;
    if (best.kind === 'hub') {
      returnToHub(0);
      if (opts.onSelectHub) opts.onSelectHub();
    } else if (best.kind === 'domain' && best.d) {
      if (best.state === 'fog') {
        if (opts.onTravelBlocked) opts.onTravelBlocked(best.realm, best.d.lockReason || 'この分野はまだ霧の中です。');
      } else {
        travelToRealm(best.realm, 0, best);
        if (opts.onSelectDomain) opts.onSelectDomain(best.d);
        if (opts.lessonState) enterIsland(best.d, opts.lessonState);
        else enterIsland(best.d, null);
      }
    } else if (best.kind === 'core') {
      if (best.state === 'fog') {
        if (opts.onTravelBlocked) opts.onTravelBlocked('land', '中枢はすべての灯が点いてから開きます。');
      } else {
        travelToRealm('land', 0);
        if (best.d && opts.onSelectDomain) opts.onSelectDomain(best.d);
      }
    }
  });

  doorNav.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-door]');
    if (!btn || scene !== 'room') return;
    const act = btn.getAttribute('data-door');
    if (act === 'prev' && mode !== 'island') {
      shiftRoomDomain(-1);
      roomFocus = 'door';
      return;
    }
    if (act === 'next' && mode !== 'island') {
      shiftRoomDomain(1);
      roomFocus = 'door';
      return;
    }
    if (act === 'current') enterCurrentDoor();
  });

  growthHud.addEventListener('click', (e) => {
    const row = e.target.closest('[data-key]');
    if (!row) return;
    const key = row.getAttribute('data-key');
    if (opts.onOpenGrowthGallery) opts.onOpenGrowthGallery(key, growth);
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
    getGrowth: () => growth,
    playClearDoorThen,
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
      if (growthHud.parentNode) growthHud.parentNode.removeChild(growthHud);
      if (doorNav.parentNode) doorNav.parentNode.removeChild(doorNav);
    }
  };
}

export const mountLampDungeon = mountLampWorld;
