/* Lumina Code — 2D ダンジョン・オーバーワールド（Canvas） */
import { themeFor } from './island-themes.js';
import {
  TILE,
  buildDungeonFromNodes,
  buildRouteOrder,
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
  4: '#2a4060'
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

  const dungeon = buildDungeonFromNodes(nodes, layoutW, layoutH);
  const route = dungeon.route;
  const routeIndexOfNode = new Map();
  route.forEach((n, i) => routeIndexOfNode.set(n, i));

  const canvas = document.createElement('canvas');
  canvas.className = 'lamp-dungeon-canvas';
  canvas.setAttribute('aria-label', '2Dダンジョンマップ');
  container.insertBefore(canvas, container.firstChild);

  const dpad = document.createElement('div');
  dpad.className = 'lamp-dungeon-dpad';
  dpad.innerHTML = `
    <button type="button" data-dir="up" aria-label="上">▲</button>
    <button type="button" data-dir="left" aria-label="左">◀</button>
    <button type="button" data-dir="down" aria-label="下">▼</button>
    <button type="button" data-dir="right" aria-label="右">▶</button>`;
  container.appendChild(dpad);

  let mode = 'world';
  let focusKey = null;
  let islandDomain = null;
  let stagePads = [];

  let camX = 0;
  let camY = 0;
  let camZoom = 1;
  let overview = true;

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

  function findNodeIndexForCourse(courseNo) {
    if (!courseNo) return 0;
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      if (n.kind === 'domain' && n.d && n.d.lessons && n.d.lessons.some(l => l.no === courseNo)) return i;
    }
    return Math.max(0, nodes.findIndex(n => n.state === 'current'));
  }

  function placeAvatarForProgress(courseNo) {
    const idx = findNodeIndexForCourse(courseNo);
    const i = idx >= 0 ? idx : 0;
    const n = nodes[i];
    if (n && n._px != null) {
      px = n._px;
      py = n._py;
    }
    return i;
  }

  function resize() {
    const w = container.clientWidth || 640;
    const h = container.clientHeight || 480;
    canvas.width = w;
    canvas.height = h;
  }
  resize();

  function worldToScreen(wx, wy) {
    const sx = (wx - camX) * camZoom + canvas.width / 2;
    const sy = (wy - camY) * camZoom + canvas.height / 2;
    return { x: sx, y: sy };
  }

  function screenToWorld(sx, sy) {
    return {
      x: (sx - canvas.width / 2) / camZoom + camX,
      y: (sy - canvas.height / 2) / camZoom + camY
    };
  }

  function updateCamera(followPlayer) {
    if (overview) {
      camZoom = Math.min(canvas.width / dungeon.worldW, canvas.height / dungeon.worldH) * 0.92;
      camX = dungeon.worldW / 2;
      camY = dungeon.worldH / 2;
      return;
    }
    camZoom = followPlayer ? Math.max(1.1, Math.min(2.2, canvas.width / 520)) : camZoom;
    if (followPlayer) {
      camX = px;
      camY = py;
    }
  }

  function tryMove(dx, dy, dt) {
    if (anim) return;
    const speed = reduced ? 220 : 160;
    const len = Math.hypot(dx, dy) || 1;
    const nx = px + (dx / len) * speed * dt;
    const ny = py + (dy / len) * speed * dt;
    if (!worldToTile(dungeon.walls, dungeon.tw, dungeon.th, nx, py)) px = nx;
    if (!worldToTile(dungeon.walls, dungeon.tw, dungeon.th, px, ny)) py = ny;
  }

  function nearestNode() {
    let best = null;
    let bestD = 64;
    nodes.forEach((n, idx) => {
      if (mode === 'island' && islandDomain && n.d && n.d.id !== islandDomain.id && n.kind === 'domain') return;
      const d = Math.hypot(n._px - px, n._py - py);
      if (d < bestD) {
        bestD = d;
        best = { n, idx, d };
      }
    });
    return best;
  }

  function interact() {
    if (mode === 'island' && islandDomain) {
      const pad = stagePads.find(p => Math.hypot(p.x - px, p.y - py) < 28);
      if (pad && opts.onSelectLesson) opts.onSelectLesson(pad.lesson);
      return;
    }
    const hit = nearestNode();
    if (!hit || hit.d > 52) return;
    const { n } = hit;
    if (n.kind === 'hub' && opts.onSelectHub) opts.onSelectHub();
    else if (n.kind === 'domain' && n.d && opts.onSelectDomain) opts.onSelectDomain(n.d);
    else if (n.kind === 'core' && n.d) opts.onSelectDomain?.(n.d);
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
        let fill = REALM_FLOOR[code] || '#243048';
        if (litPath.has(tx + ',' + ty)) {
          const pulse = 0.85 + Math.sin(pulseT * 3 + tx * 0.2) * 0.15;
          ctx.fillStyle = `rgba(245, 196, 81, ${0.12 * pulse})`;
          ctx.fillRect(wx, wy, TILE, TILE);
        }
        ctx.fillStyle = fill;
        ctx.fillRect(wx, wy, TILE, TILE);
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

      ctx.fillStyle = '#ece9f5';
      ctx.font = '600 11px "Segoe UI", "Yu Gothic UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const label = (n.label || '').slice(0, 8);
      ctx.fillText(label, nx, ny);
      if (n.sub) {
        ctx.font = '10px sans-serif';
        ctx.fillStyle = '#9aa0c4';
        ctx.fillText(n.sub, nx, ny + 14);
      }
    });
    ctx.globalAlpha = 1;
  }

  function drawAvatar(ctx) {
    const tier = avatarTier(playerLevel);
    const colors = {
      novice: '#f5c451',
      adept: '#7fd1ff',
      keeper: '#c59bff',
      ascendant: '#ffe08a'
    };
    const size = tier === 'ascendant' ? 14 : tier === 'keeper' ? 12 : 10;
    ctx.beginPath();
    ctx.arc(px, py, size + 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(245,196,81,0.25)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(px, py, size, 0, Math.PI * 2);
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

  function drawParallax(ctx) {
    const bands = [
      { y0: 0, h: dungeon.worldH * 0.35, c1: '#16305a', c2: 'transparent' },
      { y0: dungeon.worldH * 0.35, h: dungeon.worldH * 0.35, c1: 'transparent', c2: '#1a1028' },
      { y0: dungeon.worldH * 0.55, h: dungeon.worldH * 0.45, c1: 'transparent', c2: '#17382a' }
    ];
    bands.forEach(b => {
      const g = ctx.createLinearGradient(0, b.y0, 0, b.y0 + b.h);
      g.addColorStop(0, b.c1);
      g.addColorStop(1, b.c2);
      ctx.fillStyle = g;
      ctx.globalAlpha = reduced ? 0.15 : 0.28;
      ctx.fillRect(0, b.y0, dungeon.worldW, b.h);
    });
    ctx.globalAlpha = 1;
  }

  function render() {
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.fillStyle = '#0a1428';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    updateCamera(!overview);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(camZoom, camZoom);
    ctx.translate(-camX, -camY);

    drawParallax(ctx);
    drawFloor(ctx);
    drawNodes(ctx);
    drawStagePads(ctx);
    drawAvatar(ctx);

    ctx.restore();
    ctx.restore();

    if (!overview && !anim) {
      const hint = nearestNode();
      if (hint && hint.d < 56) {
        ctx.fillStyle = 'rgba(15,18,38,0.8)';
        ctx.fillRect(12, canvas.height - 40, 200, 28);
        ctx.fillStyle = '#9aa0c4';
        ctx.font = '12px sans-serif';
        ctx.fillText('Enter / タップで入る', 20, canvas.height - 22);
      }
    }
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
    } else if (!overview) {
      let dx = 0;
      let dy = 0;
      if (keys.has('ArrowUp') || keys.has('w') || keys.has('W')) dy -= 1;
      if (keys.has('ArrowDown') || keys.has('s') || keys.has('S')) dy += 1;
      if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A')) dx -= 1;
      if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) dx += 1;
      if (dx || dy) tryMove(dx, dy, dt);
    }

    render();
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  function showOverview(duration) {
    mode = 'world';
    focusKey = null;
    islandDomain = null;
    stagePads = [];
    overview = true;
    if (opts.onModeChange) opts.onModeChange('world', null);
    if (reduced || duration === 0) return;
    const fromX = camX;
    const fromY = camY;
    const fromZ = camZoom;
    anim = {
      kind: 'cam',
      t0: performance.now(),
      dur: duration == null ? 600 : duration,
      fromX, fromY, fromZ,
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
    mode = 'world';
    focusKey = null;
    islandDomain = null;
    stagePads = [];
    if (opts.onModeChange) opts.onModeChange('world', null);
    const first = nodes.find(n => n.realm === realm && n.kind === 'domain')
      || nodes.find(n => n.realm === realm);
    if (first && first._px != null) {
      px = first._px;
      py = first._py;
    }
    overview = false;
    const c = realmCentroid(realm);
    const dur = duration == null ? (reduced ? 0 : 650) : duration;
    if (reduced || dur === 0) {
      camX = c.x;
      camY = c.y;
      camZoom = Math.max(1.1, Math.min(2.2, canvas.width / 520));
      if (opts.onTravelRealm) opts.onTravelRealm(realm, first);
      return first;
    }
    anim = {
      kind: 'cam',
      t0: performance.now(),
      dur,
      fromX: camX, fromY: camY, fromZ: camZoom,
      toX: c.x, toY: c.y,
      toZ: Math.max(1.1, Math.min(2.2, canvas.width / 520))
    };
    if (opts.onTravelRealm) opts.onTravelRealm(realm, first);
    return first;
  }

  function returnToHub(duration) {
    if (!hubNode || hubNode._px == null) return;
    mode = 'world';
    islandDomain = null;
    stagePads = [];
    px = hubNode._px;
    py = hubNode._py;
    overview = false;
    if (opts.onModeChange) opts.onModeChange('world', null);
    const dur = duration == null ? (reduced ? 0 : 500) : duration;
    if (!reduced && dur > 0) {
      anim = {
        kind: 'cam',
        t0: performance.now(),
        dur,
        fromX: camX, fromY: camY, fromZ: camZoom,
        toX: px, toY: py,
        toZ: Math.max(1.1, Math.min(2.2, canvas.width / 520))
      };
    } else {
      camX = px;
      camY = py;
    }
  }

  function layoutStagePads(domain, lessonStateFn) {
    const ls = domain.lessons || [];
    const cx = nodes.find(n => n.kind === 'domain' && n.d && n.d.id === domain.id);
    const ox = cx && cx._px != null ? cx._px : px;
    const oy = cx && cx._py != null ? cx._py : py;
    const cols = Math.min(6, Math.ceil(Math.sqrt(ls.length)));
    const gap = 44;
    stagePads = ls.map((lesson, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const st = lessonStateFn ? lessonStateFn(lesson) : 'todo';
      return {
        lesson,
        state: st,
        x: ox + (col - (cols - 1) / 2) * gap,
        y: oy + 50 + row * gap
      };
    });
    const first = stagePads.find(p => p.state === 'next') || stagePads[0];
    if (first) {
      px = first.x;
      py = first.y - 24;
    }
  }

  function enterIsland(domain, lessonStateFn) {
    if (!domain) return;
    mode = 'island';
    focusKey = domain.id;
    islandDomain = domain;
    overview = false;
    layoutStagePads(domain, lessonStateFn);
    const n = nodes.find(nd => nd.kind === 'domain' && nd.d && nd.d.id === domain.id);
    if (n && n._px != null) {
      camX = n._px;
      camY = n._py + 40;
      camZoom = Math.max(1.3, Math.min(2.4, canvas.width / 420));
    }
    if (opts.onModeChange) opts.onModeChange('island', domain);
  }

  function exitIsland() {
    mode = 'world';
    focusKey = null;
    islandDomain = null;
    stagePads = [];
    showOverview(reduced ? 0 : 550);
    if (opts.onModeChange) opts.onModeChange('world', null);
  }

  function walkAvatar(fromIdx, toIdx, onDone) {
    const a = Math.max(0, Math.min(nodes.length - 1, fromIdx));
    const b = Math.max(0, Math.min(nodes.length - 1, toIdx));
    const fromNode = nodes[a];
    const toNode = nodes[b];
    const fromRoute = route.indexOf(fromNode);
    const toRoute = route.indexOf(toNode);
    let pts;
    if (fromRoute >= 0 && toRoute >= 0) {
      pts = pathAlongRoute(route, fromRoute, toRoute);
    } else {
      pts = [{ x: fromNode?._px ?? px, y: fromNode?._py ?? py }, { x: toNode?._px ?? px, y: toNode?._py ?? py }];
    }
    if (!pts.length || reduced || a === b) {
      if (pts.length) {
        px = pts[pts.length - 1].x;
        py = pts[pts.length - 1].y;
      }
      if (onDone) onDone();
      return;
    }
    overview = false;
    anim = {
      kind: 'walk',
      t0: performance.now(),
      dur: Math.min(2800, 700 + pts.length * 350),
      pts,
      onDone
    };
  }

  function setAvatarLevel(level) {
    playerLevel = Math.max(1, parseInt(level, 10) || 1);
  }

  const particles = [];
  function spawnParticles(at) {
    if (reduced) return;
    for (let i = 0; i < 18; i++) {
      particles.push({
        x: at.x || px,
        y: at.y || py,
        vx: (Math.random() - 0.5) * 120,
        vy: -Math.random() * 80 - 20,
        life: 0.6 + Math.random() * 0.4
      });
    }
  }

  function onKeyDown(e) {
    if (overview && /^(Arrow|w|a|s|d|W|A|S|D)$/.test(e.key)) overview = false;
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
    const w = screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
    if (mode === 'island') {
      const pad = stagePads.find(p => Math.hypot(p.x - w.x, p.y - w.y) < 24);
      if (pad && opts.onSelectLesson) opts.onSelectLesson(pad.lesson);
      return;
    }
    let best = null;
    let bestD = 48;
    nodes.forEach(n => {
      const d = Math.hypot(n._px - w.x, n._py - w.y);
      if (d < bestD) { bestD = d; best = n; }
    });
    if (!best) {
      overview = false;
      return;
    }
    overview = false;
    px = best._px;
    py = best._py;
    if (bestD < 40) {
      if (best.kind === 'hub' && opts.onSelectHub) opts.onSelectHub();
      else if (best.kind === 'domain' && best.d && opts.onSelectDomain) opts.onSelectDomain(best.d);
      else if (best.kind === 'core' && best.d && opts.onSelectDomain) opts.onSelectDomain(best.d);
    }
  });

  dpad.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-dir]');
    if (!btn || overview) return;
    const d = btn.getAttribute('data-dir');
    const step = 28;
    const map = { up: [0, -step], down: [0, step], left: [-step, 0], right: [step, 0] };
    const m = map[d];
    if (!m) return;
    const nx = px + m[0];
    const ny = py + m[1];
    if (!worldToTile(dungeon.walls, dungeon.tw, dungeon.th, nx, ny)) {
      px = nx;
      py = ny;
    }
  });

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('resize', resize);

  placeAvatarForProgress(opts.avatarCourseNo || 0);
  showOverview(0);

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
    spawnParticles,
    getMode: () => mode,
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

export function mountLampDungeon(container, opts) {
  return mountLampWorld(container, opts);
}

window.LampWorld = { mountLampWorld, avatarTier };
window.LampDungeon = { mountLampWorld: mountLampDungeon, mountLampDungeon, avatarTier };