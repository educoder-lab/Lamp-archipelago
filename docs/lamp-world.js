/* Lumina Code — Three.js 航路ワールド（大型島・人型アバター） */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

const REALM_Y = { sky: 3.5, underground: -2.2, land: 0.6 };
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

/** テーマ別ローポリ小物 */
function addThemeProps(group, theme, R, deckY, foggy) {
  const accent = theme.accent || 0xf5c451;
  const props = theme.props || [];
  const op = foggy ? 0.35 : 1;

  function place(mesh, x, z, yOff) {
    mesh.position.set(x, deckY + (yOff || 0), z);
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
      g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 1.1, 8), matStd(0xe8eef5)));
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), matStd(accent, { emissive: accent, emissiveIntensity: 1.2 }));
      lamp.position.y = 0.7;
      g.add(lamp);
      place(g, 0, -R * 0.45, 0.55);
    },
    lighthouse_l() {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.42, 2.2, 10), matStd(0xf0f4fa)));
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.32, 14, 14), matStd(accent, { emissive: accent, emissiveIntensity: 1.5 }));
      lamp.position.y = 1.35;
      g.add(lamp);
      place(g, 0, -R * 0.5, 1.1);
      group.userData.flame = lamp;
    },
    pier() {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.12, 0.7), matStd(0x6a5030)));
      place(g, 0, R * 0.55, 0.1);
    },
    crate() {
      place(new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.45), matStd(0x8a6230)), R * 0.35, R * 0.35, 0.28);
    },
    board() {
      place(new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.55, 0.08), matStd(0x3a3048, { emissive: accent, emissiveIntensity: 0.2 })), -R * 0.4, R * 0.25, 0.45);
    },
    core_crystal() {
      const m = new THREE.Mesh(new THREE.OctahedronGeometry(0.7, 0), matStd(accent, { emissive: accent, emissiveIntensity: 1.4, metalness: 0.4 }));
      place(m, 0, 0, 0.9);
      group.userData.flame = m;
    },
    ring_rail() {
      place(new THREE.Mesh(new THREE.TorusGeometry(R * 0.55, 0.06, 8, 32), matStd(0xb8b0d0, { metalness: 0.7 })), 0, 0, 0.2);
    },
    dawn_gate() {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.6, 0.25), matStd(0xe8d5a0)));
      const r = g.children[0].clone(); r.position.x = 1.2; g.add(r);
      g.children[0].position.x = -0.6;
      place(g, 0, -R * 0.4, 0.85);
    },
    cliff_pillar() {
      place(new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 1.8, 6), matStd(0xd0d8e0, { flatShading: true })), -R * 0.55, -R * 0.2, 0.9);
    },
    bit_stone() {
      const a = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.5, 0.2), matStd(accent, { emissive: accent, emissiveIntensity: 0.5 }));
      place(a, R * 0.4, R * 0.15, 0.35);
    },
    clock_tower() {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.BoxGeometry(0.7, 2.0, 0.7), matStd(0x8a7040)));
      const face = new THREE.Mesh(new THREE.CircleGeometry(0.28, 16), matStd(0xf5e6c0, { emissive: accent, emissiveIntensity: 0.3 }));
      face.position.set(0, 0.55, 0.36);
      g.add(face);
      place(g, 0, -R * 0.45, 1.05);
    },
    gear() {
      place(new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.15, 12), matStd(0xc9a24a, { metalness: 0.75, roughness: 0.35 })), R * 0.35, 0.2, 0.2);
    },
    hourglass() {
      place(new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.5, 6), matStd(0xa09070)), -R * 0.35, R * 0.2, 0.4);
    },
    chimney() {
      place(new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 1.6, 8), matStd(0x4a3030)), -R * 0.4, -R * 0.35, 0.85);
    },
    copper_pipe() {
      const p = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.08, 6, 16, Math.PI), matStd(0xb87333, { metalness: 0.8 }));
      p.rotation.y = Math.PI / 2;
      place(p, R * 0.25, -R * 0.2, 0.45);
    },
    boiler() {
      place(new THREE.Mesh(new THREE.SphereGeometry(0.45, 10, 10), matStd(0x6a5040, { metalness: 0.5 })), R * 0.15, R * 0.35, 0.45);
    },
    bookshelf() {
      place(new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.2, 0.35), matStd(0x5a4030)), -R * 0.35, -R * 0.35, 0.7);
    },
    globe() {
      place(new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), matStd(0x4a80a0, { metalness: 0.3 })), R * 0.35, -R * 0.15, 0.45);
    },
    thread() {
      place(new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.03, 6, 24), matStd(accent, { emissive: accent, emissiveIntensity: 0.4 })), 0, R * 0.25, 0.35);
    },
    layer_floor() {
      for (let i = 0; i < 3; i++) {
        const f = new THREE.Mesh(new THREE.CylinderGeometry(0.7 - i * 0.12, 0.7 - i * 0.12, 0.12, 10), matStd(0x3a5850));
        place(f, -R * 0.3, -R * 0.3, 0.25 + i * 0.35);
      }
    },
    stack_box() {
      place(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.5), matStd(0x486858)), R * 0.4, 0.1, 0.45);
    },
    process_flag() {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.1, 6), matStd(0xaaaaaa)));
      const flag = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.28, 0.04), matStd(accent, { emissive: accent, emissiveIntensity: 0.35 }));
      flag.position.set(0.22, 0.35, 0);
      g.add(flag);
      place(g, R * 0.2, -R * 0.4, 0.55);
    },
    spring() {
      place(new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.0, 0.25, 20), matStd(0x3a90c0, { transparent: true, opacity: 0.75, metalness: 0.4, roughness: 0.2 })), 0, R * 0.15, 0.12);
    },
    crystal() {
      const c = new THREE.Mesh(new THREE.OctahedronGeometry(0.45, 0), matStd(accent, { emissive: accent, emissiveIntensity: 0.9, flatShading: true }));
      place(c, -R * 0.4, -R * 0.25, 0.55);
      group.userData.flame = c;
    },
    grid() {
      place(new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.08, 1.0), matStd(0x80c0e0, { wireframe: false, metalness: 0.3 })), R * 0.35, -R * 0.2, 0.1);
    },
    chain() {
      place(new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.05, 6, 14), matStd(0xc0c8d0, { metalness: 0.8 })), R * 0.15, R * 0.4, 0.35);
    },
    beacon() {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 1.3, 8), matStd(0xe8eef8)));
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), matStd(accent, { emissive: accent, emissiveIntensity: 1.3 }));
      lamp.position.y = 0.8;
      g.add(lamp);
      place(g, -R * 0.35, -R * 0.4, 0.7);
      group.userData.flame = lamp;
    },
    bridge() {
      place(new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 0.45), matStd(0x8a7048)), 0, R * 0.5, 0.12);
    },
    sail() {
      place(new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.2, 3), matStd(0xf0f4ff)), R * 0.35, -R * 0.15, 0.7);
    },
    gate() {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.5, 0.3), matStd(0x4a5050)));
      const r = g.children[0].clone(); r.position.x = 1.1; g.add(r);
      g.children[0].position.x = -0.55;
      const lintel = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.25, 0.3), matStd(0x4a5050));
      lintel.position.set(0, 0.75, 0);
      g.add(lintel);
      place(g, 0, -R * 0.45, 0.8);
    },
    shield() {
      place(new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 0.12, 5), matStd(accent, { metalness: 0.6 })), R * 0.35, 0.15, 0.35);
    },
    keyhole() {
      place(new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 1.0, 8), matStd(0x3a4040)), -R * 0.4, R * 0.1, 0.55);
    },
    easel() {
      place(new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.12), matStd(0xf5f0e8)), -R * 0.25, -R * 0.3, 0.55);
    },
    paint() {
      place(new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.35, 10), matStd(accent, { emissive: accent, emissiveIntensity: 0.4 })), R * 0.3, -R * 0.2, 0.25);
    },
    canvas() {
      place(new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.7), matStd(0xffffff)), R * 0.1, R * 0.35, 0.55);
    },
    seal_tower() {
      place(new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 1.3, 8), matStd(0xc04040, { emissive: 0x801010, emissiveIntensity: 0.3 })), 0, -R * 0.4, 0.7);
    },
    desk() {
      place(new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.35, 0.55), matStd(0x6a5030)), R * 0.25, 0.2, 0.25);
    },
    compass() {
      place(new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.12, 24), matStd(0xd4af37, { metalness: 0.7, emissive: accent, emissiveIntensity: 0.25 })), 0, -R * 0.2, 0.15);
    },
    round_table() {
      place(new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.2, 16), matStd(0x5a4030)), R * 0.3, R * 0.25, 0.18);
    },
    star_arch() {
      place(new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.06, 6, 20, Math.PI), matStd(accent, { emissive: accent, emissiveIntensity: 0.5 })), -R * 0.25, -R * 0.35, 0.7);
    },
    draft_table() {
      place(new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.15, 0.8), matStd(0xa0c4e8)), 0, R * 0.2, 0.2);
    },
    ruler_arch() {
      place(new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.08, 0.12), matStd(0xe8eef5)), 0, -R * 0.35, 0.55);
    },
    model_block() {
      place(new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), matStd(accent)), R * 0.4, -R * 0.15, 0.3);
    },
    scaffold() {
      place(new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 0.15), matStd(0x888890, { wireframe: false, metalness: 0.5 })), -R * 0.35, -R * 0.3, 0.75);
    },
    formwork() {
      place(new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 0.2), matStd(0xc0a070)), R * 0.25, 0.2, 0.45);
    },
    proto_lamp() {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), matStd(accent, { emissive: accent, emissiveIntensity: 1.2 }));
      place(m, 0, -R * 0.35, 0.45);
      group.userData.flame = m;
    },
    wbs_sign() {
      place(new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.1), matStd(0xf5f0d0)), -R * 0.3, R * 0.25, 0.5);
    },
    arrow_stone() {
      place(new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.7, 4), matStd(accent)), R * 0.35, -R * 0.2, 0.45);
    },
    cabin() {
      place(new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.8, 0.9), matStd(0x6a4530)), -R * 0.25, -R * 0.3, 0.5);
    },
    bell() {
      place(new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 10), matStd(0xd4af37, { metalness: 0.8 })), R * 0.3, -R * 0.25, 0.7);
    },
    lantern_row() {
      for (let i = 0; i < 3; i++) {
        const lan = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), matStd(accent, { emissive: accent, emissiveIntensity: 1.0 }));
        place(lan, -0.5 + i * 0.5, R * 0.4, 0.35);
      }
    },
    archive() {
      place(new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.1, 0.4), matStd(0x3a3848)), -R * 0.3, -R * 0.35, 0.65);
    },
    stamp() {
      place(new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.35, 10), matStd(0xc04040)), R * 0.35, 0.1, 0.3);
    },
    evidence_box() {
      place(new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.35, 0.4), matStd(0x5a5040)), R * 0.15, R * 0.35, 0.25);
    },
    triple_gate() {
      for (let i = 0; i < 3; i++) {
        const p = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.8, 0.2), matStd(0xd0d0e8));
        place(p, -0.9 + i * 0.9, -R * 0.4, 0.95);
      }
    },
    storm_pillar() {
      place(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.28, 2.0, 8), matStd(0x6a58a0, { emissive: accent, emissiveIntensity: 0.35 })), R * 0.45, 0.1, 1.05);
    },
    trial_flame() {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 12), matStd(accent, { emissive: accent, emissiveIntensity: 1.6 }));
      place(m, 0, R * 0.2, 0.5);
      group.userData.flame = m;
    },
    slab() {
      place(new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.0, 0.2), matStd(0x4a5850, { emissive: accent, emissiveIntensity: 0.15 })), 0, -R * 0.35, 0.6);
    },
    trace_line() {
      place(new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.05, 0.15), matStd(accent, { emissive: accent, emissiveIntensity: 0.6 })), 0, R * 0.25, 0.08);
    },
    spear() {
      place(new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.4, 6), matStd(0xa0a8a0)), R * 0.4, -R * 0.1, 0.75);
    },
    blackboard() {
      place(new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.85, 0.1), matStd(0x1a2a20)), 0, -R * 0.4, 0.6);
    },
    workbench() {
      place(new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 0.6), matStd(0x5a4830)), R * 0.2, R * 0.25, 0.28);
    },
    vault() {
      place(new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.2, 0.8), matStd(0x3a6080, { metalness: 0.4 })), -R * 0.25, -R * 0.3, 0.7);
    },
    er_board() {
      place(new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.08), matStd(0xe8f0ff)), R * 0.35, 0.15, 0.5);
    },
    lock() {
      place(new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.45, 0.25), matStd(0xd4af37, { metalness: 0.8 })), R * 0.1, R * 0.4, 0.35);
    },
    cable_wall() {
      place(new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 0.15), matStd(0x3a5040)), 0, -R * 0.4, 0.6);
    },
    switch_box() {
      place(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.35), matStd(0xc07040, { metalness: 0.5 })), R * 0.35, 0.2, 0.3);
    },
    packet_crate() {
      place(new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.35, 0.45), matStd(0x7fd1ff, { emissive: 0x306080, emissiveIntensity: 0.3 })), -R * 0.35, R * 0.25, 0.25);
    },
    shield_wall() {
      place(new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.1, 0.2), matStd(0x4a4040)), 0, -R * 0.4, 0.65);
    },
    risk_board() {
      place(new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.65, 0.08), matStd(0xf0e0c0)), R * 0.35, 0.1, 0.5);
    },
    keys() {
      place(new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.05, 6, 12), matStd(0xd4af37, { metalness: 0.85 })), -R * 0.35, R * 0.25, 0.35);
    },
    giant_book() {
      place(new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.35, 1.0), matStd(0x3a2040, { emissive: accent, emissiveIntensity: 0.2 })), 0, -R * 0.2, 0.3);
    },
    long_table() {
      place(new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.25, 0.7), matStd(0x4a4030)), 0, R * 0.3, 0.2);
    },
    gold_arch() {
      place(new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.07, 6, 20, Math.PI), matStd(0xf5c451, { metalness: 0.75, emissive: accent, emissiveIntensity: 0.4 })), 0, -R * 0.45, 0.9);
    },
    union_flag() {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5, 6), matStd(0xcccccc)));
      const f = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.35, 0.05), matStd(accent, { emissive: accent, emissiveIntensity: 0.35 }));
      f.position.set(0.28, 0.45, 0);
      g.add(f);
      place(g, -R * 0.4, -R * 0.3, 0.75);
    },
    long_desk() {
      place(new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.3, 0.6), matStd(0x6a5a40)), 0, R * 0.2, 0.22);
    },
    sundial() {
      place(new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.1, 20), matStd(0xd4af37, { metalness: 0.6 })), R * 0.35, -R * 0.15, 0.12);
    },
    war_table() {
      place(new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.25, 8), matStd(0x4a4840)), 0, 0.1, 0.2);
    },
    slab_stack() {
      for (let i = 0; i < 3; i++) {
        place(new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.12, 0.5), matStd(0x6a6a68)), R * 0.35, -R * 0.25, 0.15 + i * 0.14);
      }
    },
    bonfire() {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 10), matStd(accent, { emissive: accent, emissiveIntensity: 1.4 }));
      place(m, -R * 0.35, R * 0.3, 0.4);
      group.userData.flame = m;
    },
    lamp_ring() {
      place(new THREE.Mesh(new THREE.TorusGeometry(R * 0.45, 0.08, 8, 28), matStd(accent, { emissive: accent, emissiveIntensity: 0.8 })), 0, 0, 0.25);
    },
    horizon_pillar() {
      place(new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 2.2, 8), matStd(0xe8d5a0)), 0, -R * 0.4, 1.15);
    },
    final_line() {
      place(new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 0.2), matStd(accent, { emissive: accent, emissiveIntensity: 0.7 })), 0, R * 0.45, 0.1);
    }
  };

  props.forEach(name => {
    if (makers[name]) {
      try { makers[name](); } catch (e) { /* ignore prop errors */ }
    }
  });
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
  const foggy = node.state === 'fog';
  const themes = globalThis.LampIslandThemes;
  const theme = (themes && themes.themeFor)
    ? themes.themeFor(node)
    : { deck: 0x2a3a5a, cliff: 0x1a2a3a, accent: 0xf5c451, props: [] };

  const cliffCol = new THREE.Color(theme.cliff);
  const deckCol = new THREE.Color(theme.deck);
  if (foggy) {
    cliffCol.multiplyScalar(0.55);
    deckCol.multiplyScalar(0.55);
  }

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

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(R * 0.98, 0.07, 10, 48),
    new THREE.MeshStandardMaterial({
      color: STATE_COLOR[node.state] || theme.accent,
      emissive: STATE_COLOR[node.state] || theme.accent,
      emissiveIntensity: node.state === 'current' ? 1.1 : node.state === 'cleared' ? 0.75 : 0.2,
      roughness: 0.35,
      metalness: 0.4
    })
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = deckY + 0.12;
  group.add(rim);

  // theme props (lighthouse / gear / crystal / etc.)
  addThemeProps(group, theme, R, deckY, foggy);

  if (!group.userData.flame && (node.state === 'cleared' || node.state === 'current')) {
    const flame = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 12, 12),
      new THREE.MeshStandardMaterial({
        color: theme.accent,
        emissive: theme.accent,
        emissiveIntensity: 1.3,
        transparent: foggy,
        opacity: foggy ? 0.3 : 1
      })
    );
    flame.position.set(0, deckY + 1.5, -R * 0.5);
    group.add(flame);
    group.userData.flame = flame;
  }

  if (node.kind === 'domain' && node.d && node.d.total > 0 && !foggy) {
    const frac = Math.max(0.02, node.d.done / node.d.total);
    const prog = new THREE.Mesh(
      new THREE.RingGeometry(R * 0.72, R * 0.82, 48, 1, 0, Math.PI * 2 * frac),
      new THREE.MeshBasicMaterial({ color: theme.accent, side: THREE.DoubleSide, transparent: true, opacity: 0.9 })
    );
    prog.rotation.x = -Math.PI / 2;
    prog.position.y = deckY + 0.13;
    group.add(prog);
  }

  const glow = new THREE.Mesh(
    new THREE.CircleGeometry(R * 1.15, 32),
    new THREE.MeshBasicMaterial({
      color: STATE_COLOR[node.state] || theme.accent,
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
  group.userData.themeName = theme.theme || '';
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
