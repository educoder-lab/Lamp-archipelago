/* オーバーワールド2D：nodes.x/y から床・壁・主線を生成 */

export const TILE = 32;
const MARGIN = 80;

export function buildRouteOrder(nodes) {
  const hub = nodes.find(n => n.kind === 'hub');
  const core = nodes.find(n => n.kind === 'core');
  const sky = nodes.filter(n => n.kind === 'domain' && n.realm === 'sky');
  const ug = nodes.filter(n => n.kind === 'domain' && n.realm === 'underground');
  const land = nodes.filter(n => n.kind === 'domain' && n.realm === 'land');
  return [hub, ...sky, ...ug, ...land, core].filter(Boolean);
}

function carveRect(walls, tw, th, x0, y0, w, h) {
  for (let ty = y0; ty < y0 + h; ty++) {
    for (let tx = x0; tx < x0 + w; tx++) {
      if (tx < 0 || ty < 0 || tx >= tw || ty >= th) continue;
      walls[ty * tw + tx] = 0;
    }
  }
}

function carveCorridor(walls, tw, th, ax, ay, bx, by) {
  let x = ax;
  let y = ay;
  const stepX = bx > ax ? 1 : bx < ax ? -1 : 0;
  const stepY = by > ay ? 1 : by < ay ? -1 : 0;
  while (x !== bx) {
    carveRect(walls, tw, th, x - 1, y - 1, 3, 3);
    x += stepX;
  }
  while (y !== by) {
    carveRect(walls, tw, th, x - 1, y - 1, 3, 3);
    y += stepY;
  }
  carveRect(walls, tw, th, x - 1, y - 1, 3, 3);
}

/**
 * @param {object[]} nodes
 * @param {number} layoutW
 * @param {number} layoutH
 */
export function buildDungeonFromNodes(nodes, layoutW, layoutH) {
  const route = buildRouteOrder(nodes);
  route.forEach((n, i) => {
    n._routeIndex = i;
  });

  const worldW = Math.max(layoutW, 400) + MARGIN * 2;
  const worldH = Math.max(layoutH, 320) + MARGIN * 2;
  const tw = Math.ceil(worldW / TILE);
  const th = Math.ceil(worldH / TILE);
  const walls = new Uint8Array(tw * th);
  walls.fill(1);

  const floorRealm = new Uint8Array(tw * th);
  const litPath = new Set();

  const realmCode = { sky: 1, underground: 2, land: 3 };

  function tileOf(px, py) {
    return {
      tx: Math.floor(px / TILE),
      ty: Math.floor(py / TILE)
    };
  }

  const nodeMeta = [];

  nodes.forEach((n, idx) => {
    const px = (n.x ?? 0) + MARGIN;
    const py = (n.y ?? 0) + MARGIN;
    n._px = px;
    n._py = py;
    const { tx, ty } = tileOf(px, py);
    const roomW = n.kind === 'hub' || n.kind === 'core' ? 7 : 5;
    const roomH = roomW;
    carveRect(walls, tw, th, tx - Math.floor(roomW / 2), ty - Math.floor(roomH / 2), roomW, roomH);
    const code = n.kind === 'hub' ? 4 : realmCode[n.realm] || 1;
    for (let dy = 0; dy < roomH; dy++) {
      for (let dx = 0; dx < roomW; dx++) {
        const ttx = tx - Math.floor(roomW / 2) + dx;
        const tty = ty - Math.floor(roomH / 2) + dy;
        if (ttx >= 0 && tty >= 0 && ttx < tw && tty < th) {
          floorRealm[tty * tw + ttx] = code;
        }
      }
    }
    nodeMeta.push({ idx, px, py, tx, ty, node: n, radius: Math.max(roomW, roomH) * TILE * 0.45 });
  });

  for (let i = 0; i < route.length - 1; i++) {
    const a = route[i];
    const b = route[i + 1];
    if (!a || !b) continue;
    const { tx: ax, ty: ay } = tileOf(a._px, a._py);
    const { tx: bx, ty: by } = tileOf(b._px, b._py);
    carveCorridor(walls, tw, th, ax, ay, bx, by);
    const lit =
      a.state !== 'fog' || b.state !== 'fog' ||
      a.kind === 'hub' || b.state === 'current' || a.state === 'current';
    if (lit) {
      let x = ax;
      let y = ay;
      while (x !== bx) {
        litPath.add(x + ',' + y);
        x += bx > ax ? 1 : -1;
      }
      while (y !== by) {
        litPath.add(x + ',' + y);
        y += by > ay ? 1 : -1;
      }
      litPath.add(bx + ',' + by);
    }
  }

  return {
    tw,
    th,
    worldW,
    worldH,
    walls,
    floorRealm,
    litPath,
    route,
    nodeMeta,
    margin: MARGIN,
    TILE
  };
}

export function worldToTile(walls, tw, th, wx, wy) {
  const tx = Math.floor(wx / TILE);
  const ty = Math.floor(wy / TILE);
  if (tx < 0 || ty < 0 || tx >= tw || ty >= th) return true;
  return walls[ty * tw + tx] === 1;
}

export function pathAlongRoute(route, fromIdx, toIdx) {
  const a = Math.max(0, Math.min(route.length - 1, fromIdx));
  const b = Math.max(0, Math.min(route.length - 1, toIdx));
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  const pts = [];
  for (let i = lo; i <= hi; i++) {
    const n = route[i];
    if (n && n._px != null) pts.push({ x: n._px, y: n._py });
  }
  if (a > b) pts.reverse();
  return pts;
}