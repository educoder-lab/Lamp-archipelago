/* Lumina Code — Three.js 航路ワールド（X軸三領域・リッチビジュアル） */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';
import { themeFor as islandThemeFor } from './island-themes.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/postprocessing/OutputPass.js';

/** 空 → 地下 → 陸 を X 軸に並べ、Z は共通基準 */
const REALM_X = { sky: -78, underground: 0, land: 78 };
const REALM_COLOR = { sky: 0x7fd1ff, land: 0xf0a060, underground: 0xc59bff };
const STATE_COLOR = {
  cleared: 0xf5c451,
  current: 0x5ec8ff,
  open: 0x6b7ab8,
  fog: 0x3a3f62
};

function matStd(color, opts) {
  return new THREE.MeshStandardMaterial(Object.assign({
    color, roughness: 0.55, metalness: 0.15
  }, opts || {}));
}

function enableShadow(root, cast, receive) {
  root.traverse(o => {
    if (!o.isMesh) return;
    o.castShadow = !!cast;
    o.receiveShadow = !!receive;
  });
}

function hash01(i, salt) {
  const x = Math.sin((i + 1) * 12.9898 + (salt || 0) * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function islandRadius(node) {
  if (node.kind === 'hub') return 4.4;
  if (node.kind === 'core') return 5.2;
  const n = (node.d && node.d.total) || 6;
  return 3.4 + Math.min(3.8, n * 0.32);
}

function avatarTier(level) {
  const lv = Math.max(1, parseInt(level, 10) || 1);
  if (lv >= 11) return 'ascendant';
  if (lv >= 6) return 'keeper';
  if (lv >= 3) return 'adept';
  return 'novice';
}

/** テーマ小物（領域メッシュ上に載せるアクセント） */
function addThemeProps(group, theme, R, deckY, foggy) {
  const accent = theme.accent || 0xf5c451;
  const props = (theme.props || []).slice(0, 3);
  const op = foggy ? 0.35 : 1;
  const S = Math.max(1.1, R / 3.6);

  function place(mesh, x, z, yOff) {
    mesh.scale.multiplyScalar(S);
    mesh.position.set(x, deckY + (yOff || 0) * S, z);
    mesh.traverse(o => {
      if (o.isMesh && o.material && 'opacity' in o.material) {
        o.material.transparent = foggy || o.material.transparent;
        if (foggy) o.material.opacity = Math.min(o.material.opacity ?? 1, op);
      }
    });
    group.add(mesh);
  }

  const makers = {
    lighthouse_s() {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 1.1, 10), matStd(0xf4f7fb)));
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), matStd(accent, { emissive: accent, emissiveIntensity: 1.3 }));
      lamp.position.y = 0.7; g.add(lamp); place(g, 0, -R * 0.4, 0.55);
    },
    lighthouse_l() {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.42, 2.0, 12), matStd(0xf7fafc)));
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.3, 14, 14), matStd(accent, { emissive: accent, emissiveIntensity: 1.6 }));
      lamp.position.y = 1.25; g.add(lamp); place(g, 0, -R * 0.45, 1.05); group.userData.flame = lamp;
    },
    pier() { place(new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.12, 0.65), matStd(0x8a6a40)), 0, R * 0.5, 0.1); },
    crate() { place(new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), matStd(0x8a6230)), R * 0.32, R * 0.28, 0.25); },
    board() { place(new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.08), matStd(0x3a3048, { emissive: accent, emissiveIntensity: 0.25 })), -R * 0.35, R * 0.2, 0.4); },
    core_crystal() {
      const m = new THREE.Mesh(new THREE.OctahedronGeometry(0.75, 0), matStd(accent, { emissive: accent, emissiveIntensity: 1.5, metalness: 0.45 }));
      place(m, 0, 0, 0.95); group.userData.flame = m;
    },
    ring_rail() { place(new THREE.Mesh(new THREE.TorusGeometry(R * 0.5, 0.06, 8, 36), matStd(0xc8c0e8, { metalness: 0.75 })), 0, 0, 0.2); },
    dawn_gate() {
      const g = new THREE.Group();
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.5, 0.22), matStd(0xe8d5a0));
      const r = p.clone(); p.position.x = -0.55; r.position.x = 0.55; g.add(p, r); place(g, 0, -R * 0.35, 0.8);
    },
    cliff_pillar() { place(new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.42, 1.6, 8), matStd(0xd8e2ec)), -R * 0.5, -R * 0.15, 0.85); },
    bit_stone() { place(new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.45, 0.18), matStd(accent, { emissive: accent, emissiveIntensity: 0.55 })), R * 0.35, R * 0.12, 0.32); },
    clock_tower() {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.BoxGeometry(0.65, 1.8, 0.65), matStd(0x8a7040)));
      const face = new THREE.Mesh(new THREE.CircleGeometry(0.25, 16), matStd(0xf5e6c0, { emissive: accent, emissiveIntensity: 0.35 }));
      face.position.set(0, 0.5, 0.34); g.add(face); place(g, 0, -R * 0.4, 0.95);
    },
    gear() { place(new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.14, 14), matStd(0xc9a24a, { metalness: 0.8, roughness: 0.3 })), R * 0.3, 0.15, 0.18); },
    hourglass() { place(new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.45, 6), matStd(0xa09070)), -R * 0.3, R * 0.18, 0.35); },
    chimney() { place(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.26, 1.5, 8), matStd(0x4a3030)), -R * 0.35, -R * 0.3, 0.8); },
    copper_pipe() {
      const p = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.07, 6, 18, Math.PI), matStd(0xb87333, { metalness: 0.85 }));
      p.rotation.y = Math.PI / 2; place(p, R * 0.22, -R * 0.15, 0.4);
    },
    boiler() { place(new THREE.Mesh(new THREE.SphereGeometry(0.4, 12, 12), matStd(0x6a5040, { metalness: 0.55 })), R * 0.12, R * 0.3, 0.4); },
    bookshelf() { place(new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.1, 0.32), matStd(0x5a4030)), -R * 0.3, -R * 0.3, 0.65); },
    globe() { place(new THREE.Mesh(new THREE.SphereGeometry(0.32, 14, 14), matStd(0x4a80a0, { metalness: 0.35 })), R * 0.3, -R * 0.12, 0.4); },
    thread() { place(new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.03, 6, 24), matStd(accent, { emissive: accent, emissiveIntensity: 0.45 })), 0, R * 0.22, 0.3); },
    layer_floor() {
      for (let i = 0; i < 3; i++) place(new THREE.Mesh(new THREE.CylinderGeometry(0.65 - i * 0.1, 0.65 - i * 0.1, 0.1, 12), matStd(0x3a5850)), -R * 0.25, -R * 0.25, 0.2 + i * 0.3);
    },
    stack_box() { place(new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.65, 0.45), matStd(0x486858)), R * 0.35, 0.08, 0.4); },
    process_flag() {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.0, 6), matStd(0xaaaaaa)));
      const f = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.25, 0.04), matStd(accent, { emissive: accent, emissiveIntensity: 0.4 }));
      f.position.set(0.2, 0.32, 0); g.add(f); place(g, R * 0.18, -R * 0.35, 0.5);
    },
    spring() { place(new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.9, 0.22, 22), matStd(0x3a90c0, { transparent: true, opacity: 0.75, metalness: 0.4 })), 0, R * 0.12, 0.12); },
    crystal() {
      const c = new THREE.Mesh(new THREE.OctahedronGeometry(0.4, 0), matStd(accent, { emissive: accent, emissiveIntensity: 1.0 }));
      place(c, -R * 0.35, -R * 0.2, 0.5); group.userData.flame = c;
    },
    grid() { place(new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.07, 0.9), matStd(0x80c0e0, { metalness: 0.35 })), R * 0.3, -R * 0.15, 0.08); },
    chain() { place(new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.045, 6, 14), matStd(0xc0c8d0, { metalness: 0.85 })), R * 0.12, R * 0.35, 0.3); },
    beacon() {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 1.2, 8), matStd(0xe8eef8)));
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), matStd(accent, { emissive: accent, emissiveIntensity: 1.4 }));
      lamp.position.y = 0.75; g.add(lamp); place(g, -R * 0.3, -R * 0.35, 0.65); group.userData.flame = lamp;
    },
    bridge() { place(new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.1, 0.4), matStd(0x8a7048)), 0, R * 0.45, 0.1); },
    sail() { place(new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.1, 3), matStd(0xf0f4ff)), R * 0.3, -R * 0.12, 0.65); },
    gate() {
      const g = new THREE.Group();
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.28, 1.4, 0.28), matStd(0x4a5050));
      const r = p.clone(); p.position.x = -0.5; r.position.x = 0.5;
      const lintel = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.22, 0.28), matStd(0x4a5050)); lintel.position.y = 0.7;
      g.add(p, r, lintel); place(g, 0, -R * 0.4, 0.75);
    },
    shield() { place(new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.1, 5), matStd(accent, { metalness: 0.65 })), R * 0.3, 0.12, 0.3); },
    keyhole() { place(new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.9, 8), matStd(0x3a4040)), -R * 0.35, R * 0.08, 0.5); },
    easel() { place(new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.85, 0.1), matStd(0xf5f0e8)), -R * 0.22, -R * 0.25, 0.5); },
    paint() { place(new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.32, 10), matStd(accent, { emissive: accent, emissiveIntensity: 0.45 })), R * 0.28, -R * 0.18, 0.22); },
    canvas() { place(new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.65), matStd(0xffffff)), R * 0.08, R * 0.3, 0.5); },
    seal_tower() { place(new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 1.2, 10), matStd(0xc04040, { emissive: 0x801010, emissiveIntensity: 0.35 })), 0, -R * 0.35, 0.65); },
    desk() { place(new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.32, 0.5), matStd(0x6a5030)), R * 0.22, 0.15, 0.22); },
    compass() { place(new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.1, 28), matStd(0xd4af37, { metalness: 0.75, emissive: accent, emissiveIntensity: 0.3 })), 0, -R * 0.15, 0.12); },
    round_table() { place(new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.18, 18), matStd(0x5a4030)), R * 0.28, R * 0.22, 0.16); },
    star_arch() { place(new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.055, 6, 22, Math.PI), matStd(accent, { emissive: accent, emissiveIntensity: 0.55 })), -R * 0.22, -R * 0.3, 0.65); },
    draft_table() { place(new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.14, 0.75), matStd(0xa0c4e8)), 0, R * 0.18, 0.18); },
    ruler_arch() { place(new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.07, 0.1), matStd(0xe8eef5)), 0, -R * 0.3, 0.5); },
    model_block() { place(new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, 0.38), matStd(accent)), R * 0.35, -R * 0.12, 0.28); },
    scaffold() { place(new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.3, 0.12), matStd(0x888890, { metalness: 0.55 })), -R * 0.3, -R * 0.25, 0.7); },
    formwork() { place(new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.65, 0.18), matStd(0xc0a070)), R * 0.22, 0.15, 0.4); },
    proto_lamp() {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), matStd(accent, { emissive: accent, emissiveIntensity: 1.3 }));
      place(m, 0, -R * 0.3, 0.4); group.userData.flame = m;
    },
    wbs_sign() { place(new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.55, 0.08), matStd(0xf5f0d0)), -R * 0.28, R * 0.22, 0.45); },
    arrow_stone() { place(new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.65, 4), matStd(accent)), R * 0.3, -R * 0.18, 0.4); },
    cabin() { place(new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.75, 0.85), matStd(0x6a4530)), -R * 0.22, -R * 0.25, 0.45); },
    bell() { place(new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), matStd(0xd4af37, { metalness: 0.85 })), R * 0.28, -R * 0.22, 0.65); },
    lantern_row() {
      for (let i = 0; i < 3; i++) place(new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), matStd(accent, { emissive: accent, emissiveIntensity: 1.1 })), -0.45 + i * 0.45, R * 0.35, 0.3);
    },
    archive() { place(new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.0, 0.35), matStd(0x3a3848)), -R * 0.28, -R * 0.3, 0.6); },
    stamp() { place(new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.32, 10), matStd(0xc04040)), R * 0.3, 0.08, 0.28); },
    evidence_box() { place(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.32, 0.38), matStd(0x5a5040)), R * 0.12, R * 0.3, 0.22); },
    triple_gate() {
      for (let i = 0; i < 3; i++) place(new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.65, 0.18), matStd(0xd0d0e8)), -0.8 + i * 0.8, -R * 0.35, 0.9);
    },
    storm_pillar() { place(new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.26, 1.85, 8), matStd(0x6a58a0, { emissive: accent, emissiveIntensity: 0.4 })), R * 0.4, 0.08, 0.95); },
    trial_flame() {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), matStd(accent, { emissive: accent, emissiveIntensity: 1.7 }));
      place(m, 0, R * 0.18, 0.45); group.userData.flame = m;
    },
    slab() { place(new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.95, 0.18), matStd(0x4a5850, { emissive: accent, emissiveIntensity: 0.2 })), 0, -R * 0.3, 0.55); },
    trace_line() { place(new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.05, 0.12), matStd(accent, { emissive: accent, emissiveIntensity: 0.7 })), 0, R * 0.22, 0.08); },
    spear() { place(new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.3, 6), matStd(0xa0a8a0)), R * 0.35, -R * 0.08, 0.7); },
    blackboard() { place(new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.08), matStd(0x1a2a20)), 0, -R * 0.35, 0.55); },
    workbench() { place(new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.35, 0.55), matStd(0x5a4830)), R * 0.18, R * 0.22, 0.25); },
    vault() { place(new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.1, 0.75), matStd(0x3a6080, { metalness: 0.55 })), -R * 0.22, -R * 0.25, 0.65); },
    er_board() { place(new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.55, 0.07), matStd(0xe8f0ff)), R * 0.3, 0.12, 0.45); },
    lock() { place(new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.4, 0.22), matStd(0xd4af37, { metalness: 0.85 })), R * 0.08, R * 0.35, 0.32); },
    cable_wall() { place(new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.95, 0.12), matStd(0x3a5040)), 0, -R * 0.35, 0.55); },
    switch_box() { place(new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.35, 0.32), matStd(0xc07040, { metalness: 0.6 })), R * 0.3, 0.15, 0.28); },
    packet_crate() { place(new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.32, 0.4), matStd(0x7fd1ff, { emissive: 0x306080, emissiveIntensity: 0.35 })), -R * 0.3, R * 0.22, 0.22); },
    shield_wall() { place(new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.0, 0.18), matStd(0x4a4040)), 0, -R * 0.35, 0.6); },
    risk_board() { place(new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.07), matStd(0xf0e0c0)), R * 0.3, 0.08, 0.45); },
    keys() { place(new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.045, 6, 12), matStd(0xd4af37, { metalness: 0.9 })), -R * 0.3, R * 0.22, 0.3); },
    giant_book() { place(new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.32, 0.95), matStd(0x3a2040, { emissive: accent, emissiveIntensity: 0.25 })), 0, -R * 0.18, 0.28); },
    long_table() { place(new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.22, 0.65), matStd(0x4a4030)), 0, R * 0.28, 0.18); },
    gold_arch() { place(new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.065, 6, 22, Math.PI), matStd(0xf5c451, { metalness: 0.8, emissive: accent, emissiveIntensity: 0.45 })), 0, -R * 0.4, 0.85); },
    union_flag() {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.4, 6), matStd(0xcccccc)));
      const f = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.32, 0.04), matStd(accent, { emissive: accent, emissiveIntensity: 0.4 }));
      f.position.set(0.25, 0.4, 0); g.add(f); place(g, -R * 0.35, -R * 0.25, 0.7);
    },
    long_desk() { place(new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.28, 0.55), matStd(0x6a5a40)), 0, R * 0.18, 0.2); },
    sundial() { place(new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.1, 22), matStd(0xd4af37, { metalness: 0.65 })), R * 0.3, -R * 0.12, 0.1); },
    war_table() { place(new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.22, 8), matStd(0x4a4840)), 0, 0.08, 0.18); },
    slab_stack() {
      for (let i = 0; i < 3; i++) place(new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.1, 0.45), matStd(0x6a6a68)), R * 0.3, -R * 0.22, 0.12 + i * 0.12);
    },
    bonfire() {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.26, 10, 10), matStd(accent, { emissive: accent, emissiveIntensity: 1.5 }));
      place(m, -R * 0.3, R * 0.28, 0.35); group.userData.flame = m;
    },
    lamp_ring() { place(new THREE.Mesh(new THREE.TorusGeometry(R * 0.42, 0.07, 8, 28), matStd(accent, { emissive: accent, emissiveIntensity: 0.85 })), 0, 0, 0.22); },
    horizon_pillar() { place(new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.32, 2.0, 10), matStd(0xe8d5a0)), 0, -R * 0.35, 1.05); },
    final_line() { place(new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.07, 0.18), matStd(accent, { emissive: accent, emissiveIntensity: 0.75 })), 0, R * 0.4, 0.1); }
  };

  props.forEach(name => {
    if (makers[name]) {
      try { makers[name](); }
      catch (e) { console.warn('[lamp-world] prop failed:', name, e); }
    }
  });
}

/** 人型アバター */
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
  const mat = (color, opts) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.55, metalness: 0.12 }, opts || {}));

  const legGeo = new THREE.CapsuleGeometry(0.11, 0.28, 4, 8);
  const legL = new THREE.Mesh(legGeo, mat(p.cloth));
  const legR = legL.clone();
  legL.position.set(-0.14, 0.28, 0);
  legR.position.set(0.14, 0.28, 0);
  g.add(legL, legR);

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 0.42, 6, 10), mat(p.cloth, { metalness: tier === 'ascendant' ? 0.35 : 0.15 }));
  torso.position.y = 0.85;
  g.add(torso);

  if (tier !== 'novice') {
    const cloak = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.7, 10, 1, true), mat(p.accent, { transparent: true, opacity: 0.55, side: THREE.DoubleSide, roughness: 0.7 }));
    cloak.position.set(0, 0.72, -0.12);
    cloak.rotation.x = 0.15;
    g.add(cloak);
  }

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), mat(p.skin, { roughness: 0.65 }));
  head.position.y = 1.42;
  g.add(head);

  if (tier === 'novice' || tier === 'adept') {
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.21, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), mat(tier === 'adept' ? 0x2a2038 : 0x1a1520, { roughness: 0.85 }));
    hair.position.y = 1.48;
    g.add(hair);
  } else {
    const circlet = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.025, 8, 20), mat(p.metal, { metalness: 0.85, roughness: 0.25, emissive: p.accent, emissiveIntensity: 0.25 }));
    circlet.position.y = 1.58;
    circlet.rotation.x = Math.PI / 2;
    g.add(circlet);
  }

  const armGeo = new THREE.CapsuleGeometry(0.08, 0.32, 4, 8);
  const armL = new THREE.Mesh(armGeo, mat(p.cloth));
  const armR = new THREE.Mesh(armGeo, mat(p.cloth));
  armL.position.set(-0.38, 0.95, 0.05);
  armL.rotation.z = 0.35;
  armR.position.set(0.4, 0.95, 0.12);
  armR.rotation.z = -0.55;
  armR.rotation.x = -0.35;
  g.add(armL, armR);

  const staff = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.95, 8), mat(p.metal, { metalness: 0.7, roughness: 0.35 }));
  pole.position.y = 0.35;
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(tier === 'ascendant' ? 0.18 : 0.14, 16, 16), new THREE.MeshStandardMaterial({
    color: p.lamp, emissive: p.lamp, emissiveIntensity: tier === 'ascendant' ? 2.2 : tier === 'keeper' ? 1.7 : 1.35, roughness: 0.2, metalness: 0.1
  }));
  lamp.position.y = 0.95;
  const cage = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.02, 6, 16), mat(p.metal, { metalness: 0.8, roughness: 0.3 }));
  cage.position.y = 0.95;
  staff.add(pole, lamp, cage);
  if (tier === 'ascendant') {
    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.02, 8, 24), new THREE.MeshStandardMaterial({
      color: p.accent, emissive: p.accent, emissiveIntensity: 1.2, transparent: true, opacity: 0.85
    }));
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
  enableShadow(g, true, false);
  return g;
}

function addStateRim(group, node, theme, R, deckY) {
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(R * 0.98, 0.08, 10, 48),
    new THREE.MeshStandardMaterial({
      color: STATE_COLOR[node.state] || theme.accent,
      emissive: STATE_COLOR[node.state] || theme.accent,
      emissiveIntensity: node.state === 'current' ? 1.15 : node.state === 'cleared' ? 0.8 : 0.18,
      roughness: 0.3,
      metalness: 0.45
    })
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = deckY + 0.12;
  group.add(rim);

  if (node.kind === 'domain' && node.d && node.d.total > 0 && node.state !== 'fog') {
    const frac = Math.max(0.02, node.d.done / node.d.total);
    const prog = new THREE.Mesh(
      new THREE.RingGeometry(R * 0.72, R * 0.82, 48, 1, 0, Math.PI * 2 * frac),
      new THREE.MeshBasicMaterial({ color: theme.accent, side: THREE.DoubleSide, transparent: true, opacity: 0.9 })
    );
    prog.rotation.x = -Math.PI / 2;
    prog.position.y = deckY + 0.14;
    group.add(prog);
  }
}

function createSkyIsland(node, theme, R, foggy) {
  const group = new THREE.Group();
  const deckY = 1.15;
  const rock = new THREE.Mesh(
    new THREE.SphereGeometry(R * 0.95, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.62),
    new THREE.MeshStandardMaterial({
      color: foggy ? 0x9aacbe : 0xe8f2fa,
      roughness: 0.78,
      metalness: 0.05,
      flatShading: false,
      transparent: foggy,
      opacity: foggy ? 0.45 : 1
    })
  );
  rock.scale.set(1.05, 0.72, 1.05);
  rock.position.y = 0.15;
  group.add(rock);

  const belly = new THREE.Mesh(
    new THREE.DodecahedronGeometry(R * 0.55, 0),
    new THREE.MeshStandardMaterial({
      color: foggy ? 0x7a90a8 : 0xc5daf0,
      roughness: 0.85,
      metalness: 0.04,
      transparent: foggy,
      opacity: foggy ? 0.4 : 1
    })
  );
  belly.position.y = -0.35;
  belly.rotation.y = 0.4;
  group.add(belly);

  const deck = new THREE.Mesh(
    new THREE.CylinderGeometry(R * 0.92, R * 0.95, 0.28, 36),
    new THREE.MeshStandardMaterial({
      color: foggy ? 0xb0c4d8 : 0xf7fbff,
      roughness: 0.45,
      metalness: 0.12,
      transparent: foggy,
      opacity: foggy ? 0.5 : 1
    })
  );
  deck.position.y = deckY;
  group.add(deck);

  addStateRim(group, node, theme, R, deckY);
  addThemeProps(group, theme, R, deckY, foggy);

  if (!group.userData.flame && (node.state === 'cleared' || node.state === 'current')) {
    const flame = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 14, 14),
      new THREE.MeshStandardMaterial({ color: theme.accent, emissive: theme.accent, emissiveIntensity: 1.4 })
    );
    flame.position.set(0, deckY + 1.4, -R * 0.4);
    group.add(flame);
    group.userData.flame = flame;
  }

  group.userData.float = true;
  group.userData.floatPhase = hash01(node.d ? node.d.id.length : 1, 3) * Math.PI * 2;
  group.userData.floatAmp = 0.28 + hash01(node.d ? node.d.total : 2, 7) * 0.45;
  group.userData.floatSpeed = 0.55 + hash01(node.d ? node.d.total : 2, 11) * 0.45;
  enableShadow(group, true, true);
  return { group, deckY };
}

function createFortress(node, theme, R, foggy) {
  const group = new THREE.Group();
  const deckY = 1.35;
  const bodyCol = foggy ? 0x1a1c22 : 0x1c1f28;
  const metal = new THREE.MeshStandardMaterial({
    color: bodyCol,
    roughness: 0.28,
    metalness: 0.88,
    transparent: foggy,
    opacity: foggy ? 0.45 : 1
  });
  const neon = theme.accent || 0x66fcf1;

  const base = new THREE.Mesh(new THREE.BoxGeometry(R * 1.7, 1.1, R * 1.5), metal);
  base.position.y = 0.55;
  group.add(base);

  const keep = new THREE.Mesh(new THREE.BoxGeometry(R * 1.05, 2.2, R * 0.95), metal.clone());
  keep.position.y = 1.9;
  group.add(keep);

  const battlement = new THREE.Mesh(new THREE.BoxGeometry(R * 1.25, 0.35, R * 1.15), metal.clone());
  battlement.position.y = 3.1;
  group.add(battlement);

  for (let i = 0; i < 4; i++) {
    const turret = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.34, 1.4, 10),
      new THREE.MeshStandardMaterial({ color: 0x12141a, roughness: 0.25, metalness: 0.92 })
    );
    const a = (i / 4) * Math.PI * 2 + 0.4;
    turret.position.set(Math.cos(a) * R * 0.75, 2.4, Math.sin(a) * R * 0.65);
    group.add(turret);
  }

  // neon window strips
  for (let i = 0; i < 3; i++) {
    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(R * 0.7, 0.12, 0.06),
      new THREE.MeshStandardMaterial({
        color: neon,
        emissive: neon,
        emissiveIntensity: foggy ? 0.4 : 2.4,
        roughness: 0.2,
        metalness: 0.3
      })
    );
    strip.position.set(0, 1.2 + i * 0.55, R * 0.76);
    group.add(strip);
  }
  const edge = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 2.0, R * 1.35),
    new THREE.MeshStandardMaterial({ color: neon, emissive: neon, emissiveIntensity: foggy ? 0.35 : 1.8, metalness: 0.4 })
  );
  edge.position.set(R * 0.86, 1.6, 0);
  group.add(edge);

  const deck = new THREE.Mesh(
    new THREE.BoxGeometry(R * 1.55, 0.2, R * 1.35),
    new THREE.MeshStandardMaterial({ color: 0x2a2e3a, roughness: 0.4, metalness: 0.7 })
  );
  deck.position.y = deckY;
  group.add(deck);

  addStateRim(group, node, theme, R * 0.9, deckY);
  addThemeProps(group, theme, R * 0.85, deckY, foggy);

  if (!group.userData.flame) {
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 14, 14),
      new THREE.MeshStandardMaterial({ color: neon, emissive: neon, emissiveIntensity: 2.6 })
    );
    core.position.set(0, deckY + 1.6, 0);
    group.add(core);
    group.userData.flame = core;
  }

  enableShadow(group, true, true);
  return { group, deckY };
}

function createPlateau(node, theme, R, foggy) {
  const group = new THREE.Group();
  const deckY = 2.4;
  const stone = foggy ? 0x6a5a48 : 0xc4a574;
  const dark = foggy ? 0x3a3028 : 0x8a6a42;

  const terrace = (y, s, col) => {
    const m = new THREE.Mesh(
      new THREE.CylinderGeometry(R * s, R * (s + 0.08), 0.55, 8),
      new THREE.MeshStandardMaterial({ color: col, roughness: 0.82, metalness: 0.08, flatShading: false })
    );
    m.position.y = y;
    group.add(m);
  };
  terrace(0.35, 1.35, dark);
  terrace(0.95, 1.15, stone);
  terrace(1.55, 1.0, dark);
  terrace(2.15, 0.88, stone);

  // temple columns
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const col = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.22, 1.8, 10),
      new THREE.MeshStandardMaterial({ color: 0xe8d5b0, roughness: 0.55, metalness: 0.12 })
    );
    col.position.set(Math.cos(a) * R * 0.55, deckY + 0.95, Math.sin(a) * R * 0.55);
    group.add(col);
  }
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(R * 0.75, 0.9, 8),
    new THREE.MeshStandardMaterial({ color: theme.accent || 0xf0a060, roughness: 0.45, metalness: 0.2, emissive: theme.accent || 0xf0a060, emissiveIntensity: 0.15 })
  );
  roof.position.y = deckY + 2.2;
  group.add(roof);

  const deck = new THREE.Mesh(
    new THREE.CylinderGeometry(R * 0.82, R * 0.82, 0.22, 24),
    new THREE.MeshStandardMaterial({ color: 0xeadec8, roughness: 0.5, metalness: 0.1 })
  );
  deck.position.y = deckY;
  group.add(deck);

  addStateRim(group, node, theme, R * 0.82, deckY);
  addThemeProps(group, theme, R * 0.75, deckY, foggy);
  enableShadow(group, true, true);
  return { group, deckY };
}

function createIslandMesh(node) {
  const R = islandRadius(node);
  const foggy = node.state === 'fog';
  const theme = islandThemeFor(node) || { deck: 0x2a3a5a, cliff: 0x1a2a3a, accent: 0xf5c451, props: [] };
  const realm = node.realm || 'sky';

  let built;
  if (realm === 'underground' && node.kind === 'domain') built = createFortress(node, theme, R, foggy);
  else if (realm === 'land' && (node.kind === 'domain' || node.kind === 'core')) built = createPlateau(node, theme, Math.max(R, 4.5), foggy);
  else built = createSkyIsland(node, theme, R, foggy);

  const { group, deckY } = built;
  group.userData.node = node;
  group.userData.pick = true;
  group.userData.radius = R;
  group.userData.deckY = deckY;
  group.userData.themeName = theme.theme || '';
  group.userData.baseY = 0;
  return group;
}

function createStagePad(lesson, state, index) {
  const g = new THREE.Group();
  const color = state === 'cleared' ? 0xf5c451 : state === 'next' ? 0x5ec8ff : state === 'skipped' ? 0xc59bff : 0x3a4568;
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.48, 0.55, 0.22, 12),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: state === 'next' ? 0.85 : state === 'cleared' ? 0.5 : 0.1, roughness: 0.45, metalness: 0.25 })
  );
  const top = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.38, 0.08, 12),
    new THREE.MeshStandardMaterial({ color: 0xe8ecff, emissive: state === 'next' ? 0x5ec8ff : 0x000000, emissiveIntensity: state === 'next' ? 0.35 : 0, roughness: 0.35, metalness: 0.4 })
  );
  top.position.y = 0.14;
  g.add(base, top);

  const canvas = document.createElement('canvas');
  canvas.width = 128; canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 128, 128);
  ctx.fillStyle = 'rgba(15,18,38,0.85)';
  ctx.beginPath(); ctx.arc(64, 64, 52, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = state === 'cleared' ? '#f5c451' : state === 'next' ? '#7fd1ff' : '#cfd6f3';
  ctx.font = 'bold 48px Segoe UI, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(String(lesson.no), 64, 64);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const badge = new THREE.Mesh(new THREE.CircleGeometry(0.32, 20), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
  badge.position.y = 0.55;
  badge.rotation.x = -0.35;
  g.add(badge);

  g.userData.lesson = lesson;
  g.userData.pick = true;
  g.userData.kind = 'stage';
  g.userData.index = index;
  return g;
}

/** 領域内のノードを X クラスタ（Z≈0）に配置 */
function layoutRealmPositions(list, centerX, realm) {
  const n = list.length;
  if (!n) return;
  list.forEach((node, i) => {
    const t = n === 1 ? 0.5 : i / (n - 1);
    let x; let z; let y;
    if (realm === 'sky') {
      const ang = i * 2.399; // golden-ish
      const rad = 6 + Math.sqrt(i + 1) * 5.2;
      x = centerX + Math.cos(ang) * rad * 0.85;
      z = Math.sin(ang) * rad * 0.55;
      y = 3.5 + hash01(i, 1) * 7.5;
    } else if (realm === 'underground') {
      const cols = Math.min(3, n);
      const row = Math.floor(i / cols);
      const col = i % cols;
      x = centerX + (col - (cols - 1) / 2) * 14;
      z = (row - 0.5) * 12;
      y = 0.2;
    } else {
      // land: spaced temples along X near center
      x = centerX + (i - (n - 1) / 2) * 22;
      z = (hash01(i, 5) - 0.5) * 6;
      y = 0;
    }
    if (node.kind === 'hub') {
      x = centerX - 18; z = 8; y = 5.5;
    }
    if (node.kind === 'core') {
      x = centerX + 28; z = 0; y = 0;
    }
    node._pos = new THREE.Vector3(x, y, z);
  });
}

/**
 * @param {HTMLElement} container
 * @param {object} opts
 */
export function mountLampWorld(container, opts) {
  opts = opts || {};
  const reduced = opts.reducedMotion || (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const nodes = opts.nodes || [];
  let playerLevel = Math.max(1, parseInt(opts.level, 10) || 1);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a1428);
  scene.fog = new THREE.Fog(0x0a1428, 55, 210);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 600);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // 空向けクリーン光
  const hemiSky = new THREE.HemisphereLight(0xd8ecff, 0xb0c4de, 0.85);
  scene.add(hemiSky);
  const skySun = new THREE.DirectionalLight(0xfff6e8, 0.95);
  skySun.position.set(REALM_X.sky - 20, 40, 25);
  scene.add(skySun);

  // 地下の冷たいネオンフィル
  const ugFill = new THREE.PointLight(0x66fcf1, 1.4, 70);
  ugFill.position.set(REALM_X.underground, 8, 10);
  scene.add(ugFill);
  const ugFill2 = new THREE.PointLight(0xc084fc, 0.9, 55);
  ugFill2.position.set(REALM_X.underground - 10, 4, -8);
  scene.add(ugFill2);

  // 陸地の夕暮れ太陽光（長影）
  const landSun = new THREE.DirectionalLight(0xffb070, 2.1);
  landSun.position.set(REALM_X.land + 35, 42, 18);
  landSun.castShadow = true;
  landSun.shadow.mapSize.set(2048, 2048);
  landSun.shadow.camera.near = 5;
  landSun.shadow.camera.far = 160;
  landSun.shadow.camera.left = -50;
  landSun.shadow.camera.right = 50;
  landSun.shadow.camera.top = 50;
  landSun.shadow.camera.bottom = -50;
  landSun.shadow.bias = -0.00025;
  scene.add(landSun);
  const landAmb = new THREE.HemisphereLight(0xffd2a8, 0x3a2818, 0.35);
  scene.add(landAmb);

  // 領域床
  const skyFloor = new THREE.Mesh(
    new THREE.CircleGeometry(42, 64),
    new THREE.MeshStandardMaterial({ color: 0x9ec9f0, transparent: true, opacity: 0.22, roughness: 1, metalness: 0 })
  );
  skyFloor.rotation.x = -Math.PI / 2;
  skyFloor.position.set(REALM_X.sky, -1.5, 0);
  scene.add(skyFloor);

  const ugFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(55, 40),
    new THREE.MeshStandardMaterial({ color: 0x0a0b10, roughness: 0.9, metalness: 0.6 })
  );
  ugFloor.rotation.x = -Math.PI / 2;
  ugFloor.position.set(REALM_X.underground, -0.05, 0);
  ugFloor.receiveShadow = true;
  scene.add(ugFloor);

  // industrial grid lines
  {
    const grid = new THREE.GridHelper(50, 20, 0x1f3a3a, 0x12161c);
    grid.position.set(REALM_X.underground, 0.02, 0);
    grid.material.transparent = true;
    grid.material.opacity = 0.45;
    scene.add(grid);
  }

  const landGround = new THREE.Mesh(
    new THREE.CircleGeometry(48, 64),
    new THREE.MeshStandardMaterial({ color: 0x5a7a3a, roughness: 0.92, metalness: 0.05 })
  );
  landGround.rotation.x = -Math.PI / 2;
  landGround.position.set(REALM_X.land, -0.02, 0);
  landGround.receiveShadow = true;
  scene.add(landGround);

  // 雲パーティクル（空エリア）
  const cloudGroup = new THREE.Group();
  {
    const count = 90;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = REALM_X.sky + (hash01(i, 1) - 0.5) * 70;
      pos[i * 3 + 1] = 2 + hash01(i, 2) * 16;
      pos[i * 3 + 2] = (hash01(i, 3) - 0.5) * 36;
    }
    const clouds = new THREE.Points(
      new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(pos, 3)),
      new THREE.PointsMaterial({ color: 0xffffff, size: 1.8, transparent: true, opacity: 0.28, depthWrite: false, sizeAttenuation: true })
    );
    cloudGroup.add(clouds);
    for (let i = 0; i < 18; i++) {
      const puff = new THREE.Mesh(
        new THREE.SphereGeometry(1.6 + hash01(i, 4) * 2.2, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0xf5faff, transparent: true, opacity: 0.18, roughness: 1, depthWrite: false })
      );
      puff.position.set(
        REALM_X.sky + (hash01(i, 5) - 0.5) * 55,
        4 + hash01(i, 6) * 10,
        (hash01(i, 7) - 0.5) * 28
      );
      puff.scale.set(1.6 + hash01(i, 8), 0.7, 1.2);
      cloudGroup.add(puff);
    }
  }
  scene.add(cloudGroup);

  // soft stars / dust across the corridor
  {
    const n = 220;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (hash01(i, 9) - 0.5) * 220;
      pos[i * 3 + 1] = 8 + hash01(i, 10) * 40;
      pos[i * 3 + 2] = (hash01(i, 11) - 0.5) * 80;
    }
    scene.add(new THREE.Points(
      new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(pos, 3)),
      new THREE.PointsMaterial({ color: 0xb8c8ff, size: 0.12, transparent: true, opacity: 0.55 })
    ));
  }

  // layout positions along X realms
  const byRealm = { sky: [], underground: [], land: [] };
  nodes.forEach(n => {
    const r = n.realm || 'sky';
    if (!byRealm[r]) byRealm[r] = [];
    byRealm[r].push(n);
  });
  layoutRealmPositions(byRealm.sky, REALM_X.sky, 'sky');
  layoutRealmPositions(byRealm.underground, REALM_X.underground, 'underground');
  layoutRealmPositions(byRealm.land, REALM_X.land, 'land');

  const islandGroup = new THREE.Group();
  scene.add(islandGroup);
  const meshByKey = new Map();
  const worldPositions = [];

  nodes.forEach((n, i) => {
    const pos = n._pos || new THREE.Vector3(0, 0, 0);
    worldPositions.push(pos.clone());
    const mesh = createIslandMesh(n);
    mesh.position.copy(pos);
    mesh.userData.index = i;
    mesh.userData.baseY = pos.y;
    islandGroup.add(mesh);
    const key = n.kind === 'domain' && n.d ? n.d.id : n.kind + ':' + i;
    meshByKey.set(key, mesh);
    n._key = key;
    n._radius = mesh.userData.radius;
    n._deckY = mesh.userData.deckY;
  });

  if (worldPositions.length >= 2) {
    const curve = new THREE.CatmullRomCurve3(worldPositions, false, 'catmullrom', 0.2);
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, Math.max(64, worldPositions.length * 12), 0.1, 6, false),
      new THREE.MeshStandardMaterial({
        color: 0xe8c56a, emissive: 0x5a3a10, emissiveIntensity: 0.35, roughness: 0.4, metalness: 0.45, transparent: true, opacity: 0.85
      })
    );
    scene.add(tube);
  }

  let avatar = createAvatar(playerLevel);
  scene.add(avatar);

  const stageGroup = new THREE.Group();
  stageGroup.visible = false;
  scene.add(stageGroup);

  // hub realm gates
  const hubNode = nodes.find(n => n.kind === 'hub');
  const hubPos = (hubNode && hubNode._pos) ? hubNode._pos.clone() : new THREE.Vector3(REALM_X.sky, 5, 0);
  const gateGroup = new THREE.Group();
  scene.add(gateGroup);
  const realmGates = [];
  [['sky', '空'], ['underground', '地下'], ['land', '陸']].forEach((pair, i) => {
    const realm = pair[0];
    const g = new THREE.Group();
    const col = REALM_COLOR[realm];
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.1, 10, 28), new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.9, metalness: 0.45 }));
    ring.rotation.x = Math.PI / 2;
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 1.5, 10), new THREE.MeshStandardMaterial({ color: 0xf0f4fa, emissive: col, emissiveIntensity: 0.3 }));
    pillar.position.y = 0.8;
    const flame = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 12), new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 1.5 }));
    flame.position.y = 1.75;
    g.add(ring, pillar, flame);
    g.position.set(hubPos.x + (i - 1) * 3.2, hubPos.y + (hubNode && hubNode._deckY != null ? hubNode._deckY : 1.1), hubPos.z + 4.5);
    g.userData.pick = true;
    g.userData.realmGate = realm;
    gateGroup.add(g);
    realmGates.push(g);
  });

  let mode = 'world';
  let focusKey = null;
  let anim = null;
  let pulseT = 0;
  let zoom = 1;
  let orbitAz = 0.15;
  let orbitEl = 0.85;
  let orbitDist = 48;
  let userOrbit = false;
  const clock = new THREE.Clock();
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  const camTarget = new THREE.Vector3(REALM_X.sky, 4, 0);
  const camPos = new THREE.Vector3(REALM_X.sky, 28, 52);
  camera.position.copy(camPos);

  // postprocessing bloom（地下で強く）
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.55, 0.5, 0.72);
  composer.addPass(bloomPass);
  composer.addPass(new OutputPass());

  function resize() {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    bloomPass.resolution.set(w, h);
  }
  resize();
  window.addEventListener('resize', resize);

  function deckHeightAt(nodeOrMesh) {
    return (nodeOrMesh && (nodeOrMesh._deckY || (nodeOrMesh.userData && nodeOrMesh.userData.deckY))) || 0.95;
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

  function applyOrbitFromSpherical() {
    const x = orbitDist * Math.sin(orbitEl) * Math.sin(orbitAz);
    const y = orbitDist * Math.cos(orbitEl);
    const z = orbitDist * Math.sin(orbitEl) * Math.cos(orbitAz);
    camPos.set(camTarget.x + x, camTarget.y + y, camTarget.z + z);
  }

  function setOrbitFromCamera() {
    const off = camPos.clone().sub(camTarget);
    orbitDist = Math.max(10, off.length());
    orbitAz = Math.atan2(off.x, off.z);
    orbitEl = Math.acos(THREE.MathUtils.clamp(off.y / orbitDist, -1, 1));
    orbitEl = THREE.MathUtils.clamp(orbitEl, 0.28, 1.25);
  }

  function focusCameraOn(pos, dist, height, duration) {
    const toPos = pos.clone().add(new THREE.Vector3(dist * 0.15, height, dist));
    const toLook = pos.clone().add(new THREE.Vector3(0, 1.5, 0));
    userOrbit = false;
    if (reduced || !duration) {
      camPos.copy(toPos);
      camTarget.copy(toLook);
      setOrbitFromCamera();
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

  /** X 方向スライドで領域へ */
  function slideToRealm(realm, duration) {
    const x = REALM_X[realm] != null ? REALM_X[realm] : 0;
    const lookY = realm === 'sky' ? 5 : realm === 'land' ? 3 : 2;
    focusCameraOn(new THREE.Vector3(x, lookY, 0), realm === 'sky' ? 36 : 32, realm === 'land' ? 22 : 18, duration);
  }

  function restoreWorldOpacity() {
    islandGroup.children.forEach(ch => {
      ch.scale.setScalar(1);
      ch.traverse(o => {
        if (o.isMesh && o.material && o.userData._op != null) {
          o.material.opacity = o.userData._op;
          delete o.userData._op;
        }
      });
    });
  }

  function showOverview(duration) {
    if (mode === 'island') {
      mode = 'world';
      focusKey = null;
      clearStages();
      stageGroup.visible = false;
      restoreWorldOpacity();
      if (opts.onModeChange) opts.onModeChange('world', null);
    }
    // 三領域を一望（やや南から）
    userOrbit = false;
    const toLook = new THREE.Vector3(0, 3, 0);
    const toPos = new THREE.Vector3(0, 55, 130);
    if (reduced || duration === 0) {
      camPos.copy(toPos);
      camTarget.copy(toLook);
      setOrbitFromCamera();
      zoom = 1;
      return;
    }
    anim = {
      kind: 'cam',
      t0: performance.now(),
      dur: duration == null ? 750 : duration,
      fromPos: camPos.clone(),
      toPos,
      fromLook: camTarget.clone(),
      toLook
    };
    zoom = 1;
  }

  function firstNodeInRealm(realm) {
    return nodes.find(n => n.realm === realm && n.kind === 'domain')
      || nodes.find(n => n.realm === realm)
      || null;
  }

  function travelToRealm(realm, duration) {
    if (mode === 'island') {
      clearStages();
      stageGroup.visible = false;
      restoreWorldOpacity();
      mode = 'world';
      focusKey = null;
      if (opts.onModeChange) opts.onModeChange('world', null);
    }
    const n = firstNodeInRealm(realm);
    if (n && n._pos) setAvatarAt(n._pos, null, n._pos.y + deckHeightAt(n) + 0.05);
    slideToRealm(realm, duration == null ? (reduced ? 0 : 700) : duration);
    if (opts.onTravelRealm) opts.onTravelRealm(realm, n);
    return n;
  }

  function returnToHub(duration) {
    if (!hubNode || !hubNode._pos) return;
    if (mode === 'island') {
      clearStages();
      stageGroup.visible = false;
      restoreWorldOpacity();
      mode = 'world';
      focusKey = null;
      if (opts.onModeChange) opts.onModeChange('world', null);
    }
    setAvatarAt(hubNode._pos, null, hubNode._pos.y + deckHeightAt(hubNode) + 0.05);
    slideToRealm('sky', duration == null ? (reduced ? 0 : 650) : duration);
    if (opts.onSelectHub) opts.onSelectHub();
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
    const usable = R * 1.25;
    const span = Math.min(usable, Math.max(2.2, (ls.length - 1) * 1.05));
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
    // cancel float offset for stable stages
    stageGroup.position.y = mesh.userData.baseY != null ? mesh.userData.baseY : mesh.position.y;
    const { ls, deckY, span } = stageLayout(domain, mesh);
    ls.forEach((l, i) => {
      const st = lessonStateFn ? lessonStateFn(l) : 'todo';
      const pad = createStagePad(l, st, i);
      const t = ls.length === 1 ? 0.5 : i / (ls.length - 1);
      pad.position.set((t - 0.5) * span, deckY + 0.12, 0.35);
      stageGroup.add(pad);
    });
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
        new THREE.Vector3(mesh.position.x, stageGroup.position.y, mesh.position.z).add(new THREE.Vector3((t - 0.5) * span, 0, 0.35)),
        null,
        stageGroup.position.y + deckY + 0.35
      );
    }
    focusCameraOn(new THREE.Vector3(mesh.position.x, stageGroup.position.y + deckY, mesh.position.z), 12, 9, reduced ? 0 : 750);
    if (opts.onModeChange) opts.onModeChange('island', domain);
  }

  function exitIsland() {
    mode = 'world';
    focusKey = null;
    clearStages();
    stageGroup.visible = false;
    restoreWorldOpacity();
    showOverview(reduced ? 0 : 650);
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
    anim = { kind: 'walk', t0: performance.now(), dur: Math.min(2800, 800 + pts.length * 380), curve, onDone };
    // slide camera along X toward destination
    focusCameraOn(worldPositions[b], 28, 16, anim.dur);
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
    const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xf5c451, size: 0.22, transparent: true, opacity: 1 }));
    scene.add(pts);
    const vel = [];
    for (let i = 0; i < count; i++) vel.push(new THREE.Vector3((Math.random() - 0.5) * 2.4, Math.random() * 3 + 0.6, (Math.random() - 0.5) * 2.4));
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
      else { scene.remove(pts); geo.dispose(); pts.material.dispose(); }
    }
    requestAnimationFrame(tickP);
  }

  function pickAt(clientX, clientY) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const targets = [];
    islandGroup.traverse(o => { if (o.userData && o.userData.pick) targets.push(o); });
    stageGroup.traverse(o => { if (o.userData && o.userData.pick) targets.push(o); });
    gateGroup.traverse(o => { if (o.userData && o.userData.pick) targets.push(o); });
    const hits = raycaster.intersectObjects(targets, true);
    if (!hits.length) return;
    let obj = hits[0].object;
    while (obj && !(obj.userData && (obj.userData.node || obj.userData.lesson || obj.userData.realmGate))) obj = obj.parent;
    if (!obj) return;
    if (obj.userData.realmGate) { travelToRealm(obj.userData.realmGate); return; }
    if (obj.userData.lesson) { if (opts.onSelectLesson) opts.onSelectLesson(obj.userData.lesson); return; }
    const n = obj.userData.node;
    if (!n) return;
    if (n.kind === 'domain' && n.d) {
      if (opts.onSelectDomain) opts.onSelectDomain(n.d);
      enterIsland(n.d, opts.lessonState);
    } else if (n.kind === 'hub') {
      returnToHub(reduced ? 0 : 500);
    } else if (opts.onSelectHub) {
      opts.onSelectHub();
      showOverview(reduced ? 0 : 500);
    }
  }

  let dragState = null;
  renderer.domElement.addEventListener('pointerdown', (ev) => {
    if (ev.button !== 0) return;
    dragState = { x: ev.clientX, y: ev.clientY, downX: ev.clientX, downY: ev.clientY, moved: false, id: ev.pointerId };
    try { renderer.domElement.setPointerCapture(ev.pointerId); } catch (e) { /* ignore */ }
  });
  renderer.domElement.addEventListener('pointermove', (ev) => {
    if (!dragState || dragState.id !== ev.pointerId) return;
    const dx = ev.clientX - dragState.x;
    const dy = ev.clientY - dragState.y;
    if (!dragState.moved && Math.hypot(ev.clientX - dragState.downX, ev.clientY - dragState.downY) < 6) return;
    if (!dragState.moved) {
      dragState.moved = true;
      if (mode === 'world') { anim = null; setOrbitFromCamera(); userOrbit = true; }
    }
    if (mode !== 'world') return;
    dragState.x = ev.clientX;
    dragState.y = ev.clientY;
    // 水平ドラッグは主に X スライド（領域間移動感）
    camTarget.x = THREE.MathUtils.clamp(camTarget.x - dx * 0.085, REALM_X.sky - 35, REALM_X.land + 35);
    orbitAz -= dx * 0.0025;
    orbitEl = THREE.MathUtils.clamp(orbitEl - dy * 0.004, 0.28, 1.25);
    applyOrbitFromSpherical();
  });
  function endDrag(ev) {
    if (!dragState || dragState.id !== ev.pointerId) return;
    const wasDrag = dragState.moved;
    dragState = null;
    try { renderer.domElement.releasePointerCapture(ev.pointerId); } catch (e) { /* ignore */ }
    if (!wasDrag) pickAt(ev.clientX, ev.clientY);
  }
  renderer.domElement.addEventListener('pointerup', endDrag);
  renderer.domElement.addEventListener('pointercancel', endDrag);

  renderer.domElement.addEventListener('wheel', (ev) => {
    ev.preventDefault();
    if (mode === 'world' && userOrbit) {
      orbitDist = THREE.MathUtils.clamp(orbitDist + (ev.deltaY > 0 ? 2.4 : -2.4), 14, 160);
      applyOrbitFromSpherical();
    } else {
      zoom = Math.min(1.6, Math.max(0.4, zoom + (ev.deltaY > 0 ? 0.06 : -0.06)));
    }
  }, { passive: false });

  function frame() {
    requestAnimationFrame(frame);
    const dt = clock.getDelta();
    pulseT += dt;

    // sky float
    islandGroup.children.forEach(ch => {
      if (ch.userData.float && mode !== 'island') {
        const base = ch.userData.baseY || 0;
        ch.position.y = base + Math.sin(pulseT * (ch.userData.floatSpeed || 0.7) + (ch.userData.floatPhase || 0)) * (ch.userData.floatAmp || 0.35);
      }
      const flame = ch.userData.flame;
      if (flame && flame.material && flame.material.emissiveIntensity != null) {
        const baseE = ch.userData.node && (ch.userData.node.state === 'cleared' || ch.userData.node.state === 'current') ? 1.5 : 0.9;
        flame.material.emissiveIntensity = baseE + Math.sin(pulseT * 3.2 + (ch.userData.index || 0)) * 0.25;
      }
    });

    cloudGroup.rotation.y = pulseT * 0.02;
    realmGates.forEach((g, i) => {
      g.rotation.y = pulseT * 0.45 + i;
      const flame = g.children[2];
      if (flame && flame.material) flame.material.emissiveIntensity = 1.2 + Math.sin(pulseT * 3 + i) * 0.35;
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
        if (u >= 1) { anim = null; setOrbitFromCamera(); }
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
    } else if (mode === 'world' && userOrbit) {
      applyOrbitFromSpherical();
    }

    // bloom: stronger near underground
    const nearUg = 1 - Math.min(1, Math.abs(camTarget.x - REALM_X.underground) / 55);
    bloomPass.strength = 0.25 + nearUg * 1.55;
    bloomPass.threshold = 0.55 - nearUg * 0.25;

    // fog / bg tint by realm proximity
    const skyW = Math.max(0, 1 - Math.abs(camTarget.x - REALM_X.sky) / 70);
    const landW = Math.max(0, 1 - Math.abs(camTarget.x - REALM_X.land) / 70);
    const ugW = Math.max(0, 1 - Math.abs(camTarget.x - REALM_X.underground) / 70);
    const bg = new THREE.Color(0x0a1428);
    bg.lerp(new THREE.Color(0x7eb6e8), skyW * 0.45);
    bg.lerp(new THREE.Color(0x08060f), ugW * 0.55);
    bg.lerp(new THREE.Color(0x2a1810), landW * 0.4);
    scene.background.copy(bg);
    if (scene.fog) scene.fog.color.copy(bg);

    const look = camTarget.clone();
    const pos = camPos.clone();
    pos.sub(look).multiplyScalar(zoom).add(look);
    camera.position.copy(pos);
    camera.lookAt(camTarget);
    composer.render();
  }
  frame();

  placeAvatarForProgress(opts.avatarCourseNo || 0);
  if (hubNode && hubNode._pos && !(opts.avatarCourseNo > 1)) {
    setAvatarAt(hubNode._pos, null, hubNode._pos.y + deckHeightAt(hubNode) + 0.05);
  }
  showOverview(0);

  return {
    THREE,
    enterIsland,
    exitIsland,
    walkAvatar,
    placeAvatarForProgress,
    findNodeIndexForCourse,
    spawnParticles,
    setAvatarLevel,
    showOverview,
    travelToRealm,
    returnToHub,
    getMode: () => mode,
    focusDomainId: () => focusKey,
    worldPositions,
    nodes,
    resize,
    dispose() {
      window.removeEventListener('resize', resize);
      composer.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
  };
}

window.LampWorld = { mountLampWorld, avatarTier };
