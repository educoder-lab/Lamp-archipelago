/* Lumina Code — Three.js 航路ワールド（大型島・人型アバター） */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

const REALM_Y = { sky: 3.5, underground: -2.2, land: 0.6 };
const STATE_COLOR = {
  cleared: 0xf5c451,
  current: 0x5ec8ff,
  open: 0x6b7ab8,
  fog: 0x3a3f62
};
const REALM_DECK = {
  sky: 0x2a4a7a,
  underground: 0x3d2a55,
  land: 0x2a5538
};

function hashHue(id) {
  let h = 0;
  const s = String(id || '');
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return (h % 360) / 360;
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function islandRadius(node) {
  if (node.kind === 'hub' || node.kind === 'core') return 4.2;
  const n = (node.d && node.d.total) || 6;
  return 3.6 + Math.min(4.5, n * 0.38);
}

function avatarTier(level) {
  const lv = Math.max(1, parseInt(level, 10) || 1);
  if (lv >= 11) return 'ascendant';
  if (lv >= 6) return 'keeper';
  if (lv >= 3) return 'adept';
  return 'novice';
}

/** 人型アバター。レベル帯で服装・ランプが変わる */
function createAvatar(level) {
  const tier = avatarTier(level);
  const g = new THREE.Group();
  g.userData.tier = tier;

  const palettes = {
    novice: { skin: 0xf0d0b0, cloth: 0x4a5a8a, accent: 0x7fd1ff, lamp: 0xf5c451, metal: 0x8a7040 },
    adept: { skin: 0xf0d0b0, cloth: 0x2f6f9a, accent: 0x9ae7ff, lamp: 0xffd56a, metal: 0xb0b8d0 },
    keeper: { skin: 0xf0d0b0, cloth: 0x1e3a6e, accent: 0xf5c451, lamp: 0xffe08a, metal: 0xd4af37 },
    ascendant: { skin: 0xffe8d0, cloth: 0x101828, accent: 0xa78bfa, lamp: 0xffffff, metal: 0xe8d5ff }
  };
  const p = palettes[tier];

  const mat = (color, opts) => new THREE.MeshStandardMaterial(Object.assign({
    color, roughness: 0.55, metalness: 0.12
  }, opts || {}));

  // legs
  const legGeo = new THREE.CapsuleGeometry(0.11, 0.28, 4, 8);
  const legL = new THREE.Mesh(legGeo, mat(p.cloth));
  const legR = legL.clone();
  legL.position.set(-0.14, 0.28, 0);
  legR.position.set(0.14, 0.28, 0);
  g.add(legL, legR);

  // torso
  const torso = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.28, 0.42, 6, 10),
    mat(p.cloth, { metalness: tier === 'ascendant' ? 0.35 : 0.15 })
  );
  torso.position.y = 0.85;
  g.add(torso);

  // cloak / sash by tier
  if (tier !== 'novice') {
    const cloak = new THREE.Mesh(
      new THREE.ConeGeometry(0.42, 0.7, 10, 1, true),
      mat(p.accent, { transparent: true, opacity: 0.55, side: THREE.DoubleSide, roughness: 0.7 })
    );
    cloak.position.set(0, 0.72, -0.12);
    cloak.rotation.x = 0.15;
    g.add(cloak);
  }

  // head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), mat(p.skin, { roughness: 0.65 }));
  head.position.y = 1.42;
  g.add(head);

  // hair / crown
  if (tier === 'novice' || tier === 'adept') {
    const hair = new THREE.Mesh(
      new THREE.SphereGeometry(0.21, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.55),
      mat(tier === 'adept' ? 0x2a2038 : 0x1a1520, { roughness: 0.85 })
    );
    hair.position.y = 1.48;
    g.add(hair);
  } else {
    const circlet = new THREE.Mesh(
      new THREE.TorusGeometry(0.18, 0.025, 8, 20),
      mat(p.metal, { metalness: 0.85, roughness: 0.25, emissive: p.accent, emissiveIntensity: 0.25 })
    );
    circlet.position.y = 1.58;
    circlet.rotation.x = Math.PI / 2;
    g.add(circlet);
  }

  // arms
  const armGeo = new THREE.CapsuleGeometry(0.08, 0.32, 4, 8);
  const armL = new THREE.Mesh(armGeo, mat(p.cloth));
  const armR = new THREE.Mesh(armGeo, mat(p.cloth));
  armL.position.set(-0.38, 0.95, 0.05);
  armL.rotation.z = 0.35;
  armR.position.set(0.4, 0.95, 0.12);
  armR.rotation.z = -0.55;
  armR.rotation.x = -0.35;
  g.add(armL, armR);

  // lamp staff in right hand
  const staff = new THREE.Group();
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.04, 0.95, 8),
    mat(p.metal, { metalness: 0.7, roughness: 0.35 })
  );
  pole.position.y = 0.35;
  const lamp = new THREE.Mesh(
    new THREE.SphereGeometry(tier === 'ascendant' ? 0.18 : 0.14, 16, 16),
    new THREE.MeshStandardMaterial({
      color: p.lamp,
      emissive: p.lamp,
      emissiveIntensity: tier === 'ascendant' ? 2.2 : tier === 'keeper' ? 1.7 : 1.35,
      roughness: 0.2,
      metalness: 0.1
    })
  );
  lamp.position.y = 0.95;
  const cage = new THREE.Mesh(
    new THREE.TorusGeometry(0.16, 0.02, 6, 16),
    mat(p.metal, { metalness: 0.8, roughness: 0.3 })
  );
  cage.position.y = 0.95;
  staff.add(pole, lamp, cage);
  if (tier === 'ascendant') {
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(0.32, 0.02, 8, 24),
      new THREE.MeshStandardMaterial({
        color: p.accent, emissive: p.accent, emissiveIntensity: 1.2, transparent: true, opacity: 0.85
      })
    );
    halo.rotation.x = Math.PI / 2;
    halo.position.y = 1.05;
    staff.add(halo);
    g.userData.halo = halo;
  }
  staff.position.set(0.48, 0.55, 0.22);
  g.add(staff);

  g.userData.lamp = lamp;
  g.userData.pick = false;
  g.scale.setScalar(0.95);
  return g;
}

function createIslandMesh(node) {
  const group = new THREE.Group();
  const R = islandRadius(node);
  const hue = hashHue(node.d ? node.d.id : node.kind);
  const foggy = node.state === 'fog';
  const cliffCol = new THREE.Color().setHSL(hue, foggy ? 0.12 : 0.38, foggy ? 0.18 : 0.28);
  const deckCol = new THREE.Color(REALM_DECK[node.realm] || 0x2a3a5a);
  if (foggy) deckCol.multiplyScalar(0.55);

  // cliff body
  const cliff = new THREE.Mesh(
    new THREE.CylinderGeometry(R * 0.92, R * 1.08, 1.6, 24),
    new THREE.MeshStandardMaterial({
      color: cliffCol,
      roughness: 0.92,
      metalness: 0.04,
      flatShading: true,
      transparent: foggy,
      opacity: foggy ? 0.5 : 1
    })
  );
  cliff.position.y = 0.1;
  group.add(cliff);

  // flat deck (stages sit here)
  const deckY = 0.95;
  const deck = new THREE.Mesh(
    new THREE.CylinderGeometry(R * 0.98, R * 0.98, 0.22, 32),
    new THREE.MeshStandardMaterial({
      color: deckCol,
      roughness: 0.7,
      metalness: 0.18,
      transparent: foggy,
      opacity: foggy ? 0.45 : 1
    })
  );
  deck.position.y = deckY;
  group.add(deck);

  // rim glow
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(R * 0.98, 0.07, 10, 48),
    new THREE.MeshStandardMaterial({
      color: STATE_COLOR[node.state] || 0x5a6aa8,
      emissive: STATE_COLOR[node.state] || 0x5a6aa8,
      emissiveIntensity: node.state === 'current' ? 1.1 : node.state === 'cleared' ? 0.75 : 0.2,
      roughness: 0.35,
      metalness: 0.4
    })
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = deckY + 0.12;
  group.add(rim);

  // beacon tower at back of island
  const beacon = new THREE.Group();
  const tower = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.32, 1.4, 8),
    new THREE.MeshStandardMaterial({ color: 0xd8dde8, roughness: 0.45, metalness: 0.25 })
  );
  tower.position.y = deckY + 0.85;
  const flame = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 14, 14),
    new THREE.MeshStandardMaterial({
      color: 0xf5c451,
      emissive: 0xf5c451,
      emissiveIntensity: node.state === 'cleared' || node.state === 'current' ? 1.5 : 0.35,
      transparent: foggy,
      opacity: foggy ? 0.3 : 1
    })
  );
  flame.position.y = deckY + 1.7;
  beacon.add(tower, flame);
  beacon.position.set(0, 0, -R * 0.55);
  group.add(beacon);
  group.userData.flame = flame;

  // progress arc on deck edge
  if (node.kind === 'domain' && node.d && node.d.total > 0 && !foggy) {
    const frac = Math.max(0.02, node.d.done / node.d.total);
    const prog = new THREE.Mesh(
      new THREE.RingGeometry(R * 0.72, R * 0.82, 48, 1, 0, Math.PI * 2 * frac),
      new THREE.MeshBasicMaterial({ color: 0xf5c451, side: THREE.DoubleSide, transparent: true, opacity: 0.9 })
    );
    prog.rotation.x = -Math.PI / 2;
    prog.position.y = deckY + 0.13;
    group.add(prog);
  }

  // soft under-glow plate
  const glow = new THREE.Mesh(
    new THREE.CircleGeometry(R * 1.15, 32),
    new THREE.MeshBasicMaterial({
      color: STATE_COLOR[node.state] || 0x5a6aa8,
      transparent: true,
      opacity: node.state === 'fog' ? 0.05 : 0.18,
      side: THREE.DoubleSide
    })
  );
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = -0.55;
  group.add(glow);

  group.userData.node = node;
  group.userData.pick = true;
  group.userData.radius = R;
  group.userData.deckY = deckY;
  return group;
}

function createStagePad(lesson, state, index) {
  const g = new THREE.Group();
  const color = state === 'cleared' ? 0xf5c451 : state === 'next' ? 0x5ec8ff : state === 'skipped' ? 0xc59bff : 0x3a4568;
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.48, 0.55, 0.22, 12),
    new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: state === 'next' ? 0.85 : state === 'cleared' ? 0.5 : 0.1,
      roughness: 0.45,
      metalness: 0.25
    })
  );
  const top = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.38, 0.08, 12),
    new THREE.MeshStandardMaterial({
      color: 0xe8ecff,
      emissive: state === 'next' ? 0x5ec8ff : 0x000000,
      emissiveIntensity: state === 'next' ? 0.35 : 0,
      roughness: 0.35,
      metalness: 0.4
    })
  );
  top.position.y = 0.14;
  g.add(base, top);

  // floating number plate
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 128, 128);
  ctx.fillStyle = 'rgba(15,18,38,0.85)';
  ctx.beginPath();
  ctx.arc(64, 64, 52, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = state === 'cleared' ? '#f5c451' : state === 'next' ? '#7fd1ff' : '#cfd6f3';
  ctx.font = 'bold 48px Segoe UI, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(lesson.no), 64, 64);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const badge = new THREE.Mesh(
    new THREE.CircleGeometry(0.32, 20),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true })
  );
  badge.position.y = 0.55;
  badge.rotation.x = -0.35;
  g.add(badge);

  g.userData.lesson = lesson;
  g.userData.pick = true;
  g.userData.kind = 'stage';
  g.userData.index = index;
  return g;
}

/**
 * @param {HTMLElement} container
 * @param {object} opts
 */
export function mountLampWorld(container, opts) {
  opts = opts || {};
  const reduced = opts.reducedMotion || (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const nodes = opts.nodes || [];
  const layoutW = opts.layoutW || 1000;
  const layoutH = opts.layoutH || 1000;
  let playerLevel = Math.max(1, parseInt(opts.level, 10) || 1);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070b18);
  scene.fog = new THREE.Fog(0x070b18, 40, 95);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 250);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  container.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xc5d4ff, 0x12101c, 1.05));
  const sun = new THREE.DirectionalLight(0xffe4c0, 1.05);
  sun.position.set(12, 22, 8);
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0x6a88ff, 0.4);
  fill.position.set(-14, 6, -10);
  scene.add(fill);
  const rimL = new THREE.DirectionalLight(0xf5c451, 0.2);
  rimL.position.set(0, 4, 18);
  scene.add(rimL);

  // realm sea discs
  const bandMat = {
    sky: new THREE.MeshStandardMaterial({ color: 0x142848, roughness: 0.85, metalness: 0.08, transparent: true, opacity: 0.65 }),
    underground: new THREE.MeshStandardMaterial({ color: 0x241434, roughness: 0.9, transparent: true, opacity: 0.65 }),
    land: new THREE.MeshStandardMaterial({ color: 0x143428, roughness: 0.88, transparent: true, opacity: 0.65 })
  };
  ['sky', 'underground', 'land'].forEach((realm) => {
    const plane = new THREE.Mesh(new THREE.CircleGeometry(38, 64), bandMat[realm]);
    plane.rotation.x = -Math.PI / 2;
    plane.position.set(0, REALM_Y[realm] - 2.4, realm === 'sky' ? -10 : realm === 'underground' ? 16 : 6);
    plane.scale.set(1.35, 1, realm === 'sky' ? 0.75 : 0.6);
    scene.add(plane);
  });

  // starfield
  {
    const n = 180;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 120;
      pos[i * 3 + 1] = Math.random() * 40 + 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 120;
    }
    const stars = new THREE.Points(
      new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(pos, 3)),
      new THREE.PointsMaterial({ color: 0xb8c4ff, size: 0.12, transparent: true, opacity: 0.7 })
    );
    scene.add(stars);
  }

  function toWorld(n) {
    // wider spacing so large islands don't overlap
    const x = ((n.x || 0) - layoutW / 2) * 0.095;
    const z = ((n.y || 0) - layoutH / 2) * 0.095;
    const y = REALM_Y[n.realm] || 0;
    return new THREE.Vector3(x, y, z);
  }

  const islandGroup = new THREE.Group();
  scene.add(islandGroup);
  const meshByKey = new Map();
  const worldPositions = [];

  nodes.forEach((n, i) => {
    const pos = toWorld(n);
    worldPositions.push(pos.clone());
    const mesh = createIslandMesh(n);
    mesh.position.copy(pos);
    mesh.userData.index = i;
    islandGroup.add(mesh);
    const key = n.kind === 'domain' && n.d ? n.d.id : n.kind + ':' + i;
    meshByKey.set(key, mesh);
    n._key = key;
    n._pos = pos;
    n._radius = mesh.userData.radius;
    n._deckY = mesh.userData.deckY;
  });

  if (worldPositions.length >= 2) {
    const curve = new THREE.CatmullRomCurve3(worldPositions, false, 'catmullrom', 0.25);
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, Math.max(48, worldPositions.length * 10), 0.12, 6, false),
      new THREE.MeshStandardMaterial({
        color: 0xe0b35a, emissive: 0x5a3a10, emissiveIntensity: 0.4, roughness: 0.45, metalness: 0.35
      })
    );
    scene.add(tube);
  }

  let avatar = createAvatar(playerLevel);
  scene.add(avatar);

  const stageGroup = new THREE.Group();
  stageGroup.visible = false;
  scene.add(stageGroup);

  let mode = 'world';
  let focusKey = null;
  let anim = null;
  let pulseT = 0;
  const clock = new THREE.Clock();
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  const camTarget = new THREE.Vector3(0, 2, 0);
  const camPos = new THREE.Vector3(0, 28, 42);
  camera.position.copy(camPos);

  function resize() {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  resize();
  window.addEventListener('resize', resize);

  function deckHeightAt(nodeOrMesh) {
    const dy = (nodeOrMesh && (nodeOrMesh._deckY || (nodeOrMesh.userData && nodeOrMesh.userData.deckY))) || 0.95;
    return dy;
  }

  function setAvatarAt(pos, faceNext, surfaceY) {
    const y = surfaceY != null ? surfaceY : (pos.y + 0.95);
    avatar.position.set(pos.x, y, pos.z);
    if (faceNext) {
      const dx = faceNext.x - pos.x;
      const dz = faceNext.z - pos.z;
      if (Math.abs(dx) + Math.abs(dz) > 0.01) avatar.rotation.y = Math.atan2(dx, dz);
    }
  }

  function setAvatarLevel(level) {
    playerLevel = Math.max(1, parseInt(level, 10) || 1);
    const pos = avatar.position.clone();
    const rotY = avatar.rotation.y;
    scene.remove(avatar);
    avatar.traverse(o => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        if (Array.isArray(o.material)) o.material.forEach(m => m.dispose());
        else o.material.dispose();
      }
    });
    avatar = createAvatar(playerLevel);
    avatar.position.copy(pos);
    avatar.rotation.y = rotY;
    scene.add(avatar);
  }

  function findNodeIndexForCourse(courseNo) {
    if (!courseNo) return 0;
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      if (n.kind === 'domain' && n.d && n.d.lessons && n.d.lessons.some(l => l.no === courseNo)) return i;
    }
    return Math.max(0, nodes.findIndex(n => n.state === 'current'));
  }

  function placeAvatarForProgress(courseNo) {
    const idx = findNodeIndexForCourse(courseNo) || nodes.findIndex(n => n.state === 'current');
    const i = idx >= 0 ? idx : 0;
    const n = nodes[i];
    const pos = worldPositions[i] || new THREE.Vector3();
    const next = worldPositions[Math.min(i + 1, worldPositions.length - 1)];
    setAvatarAt(pos, next, pos.y + deckHeightAt(n) + 0.05);
    return i;
  }

  function focusCameraOn(pos, dist, height, duration) {
    const toPos = pos.clone().add(new THREE.Vector3(dist * 0.4, height, dist));
    const toLook = pos.clone().add(new THREE.Vector3(0, 1.2, 0));
    if (reduced || !duration) {
      camPos.copy(toPos);
      camTarget.copy(toLook);
      return;
    }
    anim = {
      kind: 'cam',
      t0: performance.now(),
      dur: duration,
      fromPos: camPos.clone(),
      toPos,
      fromLook: camTarget.clone(),
      toLook
    };
  }

  function clearStages() {
    while (stageGroup.children.length) {
      const c = stageGroup.children[0];
      stageGroup.remove(c);
      c.traverse(o => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          if (o.material.map) o.material.map.dispose();
          o.material.dispose();
        }
      });
    }
  }

  function stageLayout(domain, mesh) {
    const ls = domain.lessons || [];
    const R = mesh.userData.radius || 4;
    const deckY = mesh.userData.deckY || 0.95;
    // path across the deck (not overflowing the rim)
    const usable = R * 1.35;
    const span = Math.min(usable, Math.max(2.2, (ls.length - 1) * 1.15));
    return { ls, R, deckY, span };
  }

  function enterIsland(domain, lessonStateFn) {
    if (!domain) return;
    mode = 'island';
    focusKey = domain.id;
    const mesh = meshByKey.get(domain.id);
    if (!mesh) return;

    islandGroup.children.forEach(ch => {
      const id = ch.userData.node && ch.userData.node.d && ch.userData.node.d.id;
      const on = id === domain.id;
      ch.visible = true;
      ch.traverse(o => {
        if (!o.isMesh || !o.material || !('opacity' in o.material)) return;
        if (!on) {
          o.material.transparent = true;
          if (o.userData._op == null) o.userData._op = o.material.opacity;
          o.material.opacity = 0.08;
        }
      });
      ch.scale.setScalar(on ? 1 : 0.92);
    });

    clearStages();
    stageGroup.visible = true;
    stageGroup.position.copy(mesh.position);
    const { ls, deckY, span } = stageLayout(domain, mesh);
    ls.forEach((l, i) => {
      const st = lessonStateFn ? lessonStateFn(l) : 'todo';
      const pad = createStagePad(l, st, i);
      const t = ls.length === 1 ? 0.5 : i / (ls.length - 1);
      pad.position.set((t - 0.5) * span, deckY + 0.12, 0.35);
      stageGroup.add(pad);
    });

    // walkway strip under stages
    const path = new THREE.Mesh(
      new THREE.BoxGeometry(span + 1.4, 0.06, 1.4),
      new THREE.MeshStandardMaterial({ color: 0x1a2240, roughness: 0.6, metalness: 0.2 })
    );
    path.position.set(0, deckY + 0.02, 0.35);
    stageGroup.add(path);

    const firstTodo = ls.find(l => lessonStateFn(l) === 'next') || ls.find(l => lessonStateFn(l) === 'todo') || ls[0];
    if (firstTodo) {
      const idx = ls.indexOf(firstTodo);
      const t = ls.length === 1 ? 0.5 : idx / (ls.length - 1);
      setAvatarAt(
        mesh.position.clone().add(new THREE.Vector3((t - 0.5) * span, 0, 0.35)),
        null,
        mesh.position.y + deckY + 0.35
      );
    }
    focusCameraOn(mesh.position.clone().add(new THREE.Vector3(0, deckY, 0)), 11, 8, reduced ? 0 : 750);
    if (opts.onModeChange) opts.onModeChange('island', domain);
  }

  function exitIsland() {
    mode = 'world';
    focusKey = null;
    clearStages();
    stageGroup.visible = false;
    islandGroup.children.forEach(ch => {
      ch.scale.setScalar(1);
      ch.traverse(o => {
        if (o.isMesh && o.material && o.userData._op != null) {
          o.material.opacity = o.userData._op;
          delete o.userData._op;
        }
      });
    });
    const cur = nodes.find(n => n.state === 'current') || nodes[0];
    if (cur && cur._pos) {
      setAvatarAt(cur._pos, null, cur._pos.y + deckHeightAt(cur) + 0.05);
      focusCameraOn(cur._pos, 26, 18, reduced ? 0 : 650);
    } else {
      focusCameraOn(new THREE.Vector3(0, 0, 0), 36, 24, reduced ? 0 : 650);
    }
    if (opts.onModeChange) opts.onModeChange('world', null);
  }

  function walkAvatar(fromIdx, toIdx, onDone) {
    const a = Math.max(0, Math.min(worldPositions.length - 1, fromIdx));
    const b = Math.max(0, Math.min(worldPositions.length - 1, toIdx));
    const lift = (i) => {
      const n = nodes[i];
      return (n && n._pos ? n._pos.y : 0) + deckHeightAt(n) + 0.05;
    };
    if (a === b || reduced) {
      const n = nodes[b];
      setAvatarAt(worldPositions[b], worldPositions[Math.min(b + 1, worldPositions.length - 1)], lift(b));
      if (onDone) onDone();
      return;
    }
    const pts = [];
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    for (let i = lo; i <= hi; i++) {
      const p = worldPositions[i].clone();
      p.y = lift(i);
      pts.push(p);
    }
    if (a > b) pts.reverse();
    const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.35);
    anim = {
      kind: 'walk',
      t0: performance.now(),
      dur: Math.min(2600, 800 + pts.length * 400),
      curve,
      onDone
    };
    focusCameraOn(worldPositions[b], 24, 16, anim.dur);
  }

  function spawnParticles(at) {
    const count = 24;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = at.x;
      positions[i * 3 + 1] = at.y + 0.4;
      positions[i * 3 + 2] = at.z;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pts = new THREE.Points(
      geo,
      new THREE.PointsMaterial({ color: 0xf5c451, size: 0.22, transparent: true, opacity: 1 })
    );
    scene.add(pts);
    const vel = [];
    for (let i = 0; i < count; i++) {
      vel.push(new THREE.Vector3((Math.random() - 0.5) * 2.4, Math.random() * 3 + 0.6, (Math.random() - 0.5) * 2.4));
    }
    const start = performance.now();
    function tickP() {
      const t = (performance.now() - start) / 1000;
      const arr = pts.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        arr[i * 3] = at.x + vel[i].x * t;
        arr[i * 3 + 1] = at.y + 0.4 + vel[i].y * t - t * t * 1.8;
        arr[i * 3 + 2] = at.z + vel[i].z * t;
      }
      pts.geometry.attributes.position.needsUpdate = true;
      pts.material.opacity = Math.max(0, 1 - t);
      if (t < 1) requestAnimationFrame(tickP);
      else {
        scene.remove(pts);
        geo.dispose();
        pts.material.dispose();
      }
    }
    requestAnimationFrame(tickP);
  }

  function pick(ev) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const targets = [];
    islandGroup.traverse(o => { if (o.userData && o.userData.pick) targets.push(o); });
    stageGroup.traverse(o => { if (o.userData && o.userData.pick) targets.push(o); });
    const hits = raycaster.intersectObjects(targets, true);
    if (!hits.length) return;
    let obj = hits[0].object;
    while (obj && !(obj.userData && (obj.userData.node || obj.userData.lesson))) obj = obj.parent;
    if (!obj) return;
    if (obj.userData.lesson) {
      if (opts.onSelectLesson) opts.onSelectLesson(obj.userData.lesson);
      return;
    }
    const n = obj.userData.node;
    if (!n) return;
    if (n.kind === 'domain' && n.d) {
      if (opts.onSelectDomain) opts.onSelectDomain(n.d);
      enterIsland(n.d, opts.lessonState);
    } else if (opts.onSelectHub) {
      opts.onSelectHub();
      exitIsland();
    }
  }

  renderer.domElement.addEventListener('pointerdown', pick);

  let zoom = 1;
  renderer.domElement.addEventListener('wheel', (ev) => {
    ev.preventDefault();
    zoom = Math.min(1.4, Math.max(0.7, zoom + (ev.deltaY > 0 ? 0.05 : -0.05)));
  }, { passive: false });

  function frame() {
    requestAnimationFrame(frame);
    const dt = clock.getDelta();
    pulseT += dt;
    islandGroup.children.forEach(ch => {
      const flame = ch.userData.flame;
      if (flame) {
        const base = (ch.userData.deckY || 0.95) + 1.7;
        flame.position.y = base + Math.sin(pulseT * 2.8 + (ch.userData.index || 0)) * 0.08;
        if (flame.material && flame.material.emissiveIntensity != null) {
          const baseE = ch.userData.node && (ch.userData.node.state === 'cleared' || ch.userData.node.state === 'current') ? 1.45 : 0.35;
          flame.material.emissiveIntensity = baseE + Math.sin(pulseT * 3.5) * 0.2;
        }
      }
    });
    if (avatar.userData.lamp) {
      avatar.userData.lamp.material.emissiveIntensity =
        (avatar.userData.tier === 'ascendant' ? 2.0 : 1.3) + Math.sin(pulseT * 4) * 0.3;
    }
    if (avatar.userData.halo) avatar.userData.halo.rotation.z += dt * 0.8;
    if (anim) {
      const u = Math.min(1, (performance.now() - anim.t0) / anim.dur);
      const e = easeInOut(u);
      if (anim.kind === 'cam') {
        camPos.lerpVectors(anim.fromPos, anim.toPos, e);
        camTarget.lerpVectors(anim.fromLook, anim.toLook, e);
        if (u >= 1) anim = null;
      } else if (anim.kind === 'walk') {
        const p = anim.curve.getPointAt(e);
        const p2 = anim.curve.getPointAt(Math.min(1, e + 0.02));
        avatar.position.copy(p);
        const dx = p2.x - p.x;
        const dz = p2.z - p.z;
        if (Math.abs(dx) + Math.abs(dz) > 0.01) avatar.rotation.y = Math.atan2(dx, dz);
        if (u >= 1) {
          const done = anim.onDone;
          anim = null;
          spawnParticles(avatar.position.clone());
          if (done) done();
        }
      }
    }
    const look = camTarget.clone();
    const pos = camPos.clone();
    pos.sub(look).multiplyScalar(zoom).add(look);
    camera.position.copy(pos);
    camera.lookAt(camTarget);
    renderer.render(scene, camera);
  }
  frame();

  const startIdx = placeAvatarForProgress(opts.avatarCourseNo || 0);
  const startPos = worldPositions[startIdx] || new THREE.Vector3();
  focusCameraOn(startPos, 28, 20, 0);

  return {
    THREE,
    enterIsland,
    exitIsland,
    walkAvatar,
    placeAvatarForProgress,
    findNodeIndexForCourse,
    spawnParticles,
    setAvatarLevel,
    getMode: () => mode,
    focusDomainId: () => focusKey,
    worldPositions,
    nodes,
    resize,
    dispose() {
      window.removeEventListener('resize', resize);
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
  };
}

window.LampWorld = { mountLampWorld, avatarTier };
