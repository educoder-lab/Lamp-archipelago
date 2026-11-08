/* Lumina Code — Three.js 航路ワールド（非オープンワールド） */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

const REALM_Y = { sky: 2.2, underground: -1.4, land: 0.4 };
const REALM_FOG = { sky: 0x16305a, underground: 0x2b1a3d, land: 0x17382a };
const STATE_COLOR = {
  cleared: 0xf5c451,
  current: 0x7fd1ff,
  open: 0x5a6aa8,
  fog: 0x3a3f62
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

function createAvatar() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.22, 0.45, 4, 8),
    new THREE.MeshStandardMaterial({ color: 0xe8e4ff, roughness: 0.55, metalness: 0.1 })
  );
  body.position.y = 0.55;
  const lamp = new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 12, 12),
    new THREE.MeshStandardMaterial({
      color: 0xf5c451, emissive: 0xf5c451, emissiveIntensity: 1.4, roughness: 0.3
    })
  );
  lamp.position.set(0.28, 0.85, 0.1);
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 0.45, 6),
    new THREE.MeshStandardMaterial({ color: 0x8a7040 })
  );
  pole.position.set(0.22, 0.55, 0.08);
  g.add(body, pole, lamp);
  g.userData.lamp = lamp;
  return g;
}

function createIslandMesh(node, scale) {
  const group = new THREE.Group();
  const hue = hashHue(node.d ? node.d.id : node.kind);
  const baseColor = new THREE.Color().setHSL(hue, node.state === 'fog' ? 0.15 : 0.45, node.state === 'fog' ? 0.22 : 0.38);
  const rock = new THREE.Mesh(
    new THREE.IcosahedronGeometry(scale * (node.kind === 'domain' ? 1 : 1.15), 0),
    new THREE.MeshStandardMaterial({
      color: baseColor,
      flatShading: true,
      roughness: 0.85,
      metalness: 0.05,
      transparent: node.state === 'fog',
      opacity: node.state === 'fog' ? 0.55 : 1
    })
  );
  rock.scale.y = 0.55;
  group.add(rock);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(scale * 1.15, 0.05, 8, 24),
    new THREE.MeshStandardMaterial({
      color: STATE_COLOR[node.state] || 0x5a6aa8,
      emissive: STATE_COLOR[node.state] || 0x5a6aa8,
      emissiveIntensity: node.state === 'current' || node.state === 'cleared' ? 0.85 : 0.15,
      transparent: true,
      opacity: 0.9
    })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.08;
  group.add(ring);

  if (node.state === 'cleared' || node.state === 'current') {
    const flame = new THREE.Mesh(
      new THREE.SphereGeometry(scale * 0.28, 10, 10),
      new THREE.MeshStandardMaterial({
        color: 0xf5c451,
        emissive: 0xf5c451,
        emissiveIntensity: node.state === 'current' ? 1.6 : 1.1
      })
    );
    flame.position.y = scale * 0.95;
    group.add(flame);
    group.userData.flame = flame;
  }

  if (node.kind === 'domain' && node.d && node.d.total > 0 && node.state !== 'fog') {
    const frac = node.d.done / node.d.total;
    const prog = new THREE.Mesh(
      new THREE.RingGeometry(scale * 1.35, scale * 1.5, 32, 1, 0, Math.PI * 2 * Math.max(0.02, frac)),
      new THREE.MeshBasicMaterial({ color: 0xf5c451, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
    );
    prog.rotation.x = -Math.PI / 2;
    prog.position.y = 0.12;
    group.add(prog);
  }

  group.userData.node = node;
  group.userData.pick = true;
  return group;
}

function createStagePad(lesson, state) {
  const g = new THREE.Group();
  const color = state === 'cleared' ? 0xf5c451 : state === 'next' ? 0x7fd1ff : state === 'skipped' ? 0xc59bff : 0x3a4068;
  const pad = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.4, 0.18, 10),
    new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: state === 'next' ? 0.7 : state === 'cleared' ? 0.45 : 0.08,
      flatShading: true,
      roughness: 0.7
    })
  );
  g.add(pad);
  g.userData.lesson = lesson;
  g.userData.pick = true;
  g.userData.kind = 'stage';
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

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0d1c);
  scene.fog = new THREE.Fog(0x0a0d1c, 28, 70);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  const hemi = new THREE.HemisphereLight(0xb0c4ff, 0x1a1020, 1.1);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffe6b0, 0.85);
  sun.position.set(8, 14, 6);
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0x6688ff, 0.35);
  fill.position.set(-10, 4, -8);
  scene.add(fill);

  // water / ground bands
  const bandMat = {
    sky: new THREE.MeshStandardMaterial({ color: 0x16305a, roughness: 0.9, metalness: 0.05, transparent: true, opacity: 0.55 }),
    underground: new THREE.MeshStandardMaterial({ color: 0x2b1a3d, roughness: 0.95, transparent: true, opacity: 0.55 }),
    land: new THREE.MeshStandardMaterial({ color: 0x17382a, roughness: 0.92, transparent: true, opacity: 0.55 })
  };
  ['sky', 'underground', 'land'].forEach((realm) => {
    const plane = new THREE.Mesh(new THREE.CircleGeometry(22, 48), bandMat[realm]);
    plane.rotation.x = -Math.PI / 2;
    plane.position.set(0, REALM_Y[realm] - 1.2, realm === 'sky' ? -6 : realm === 'underground' ? 10 : 4);
    plane.scale.set(1.2, 1, realm === 'sky' ? 0.7 : 0.55);
    scene.add(plane);
  });

  function toWorld(n) {
    const x = ((n.x || 0) - layoutW / 2) * 0.045;
    const z = ((n.y || 0) - layoutH / 2) * 0.045;
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
    const mesh = createIslandMesh(n, n.kind === 'domain' ? 1.05 : 1.25);
    mesh.position.copy(pos);
    mesh.userData.index = i;
    islandGroup.add(mesh);
    const key = n.kind === 'domain' && n.d ? n.d.id : n.kind + ':' + i;
    meshByKey.set(key, mesh);
    n._key = key;
    n._pos = pos;
  });

  // path
  if (worldPositions.length >= 2) {
    const curve = new THREE.CatmullRomCurve3(worldPositions, false, 'catmullrom', 0.35);
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, Math.max(32, worldPositions.length * 8), 0.06, 5, false),
      new THREE.MeshStandardMaterial({ color: 0xc9a24a, emissive: 0x6a4a10, emissiveIntensity: 0.35, roughness: 0.6 })
    );
    scene.add(tube);
  }

  const avatar = createAvatar();
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

  const camTarget = new THREE.Vector3(0, 1, 0);
  const camPos = new THREE.Vector3(0, 18, 28);
  camera.position.copy(camPos);
  camera.lookAt(camTarget);

  function resize() {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  resize();
  window.addEventListener('resize', resize);

  function setAvatarAt(pos, faceNext) {
    avatar.position.set(pos.x, pos.y + 0.15, pos.z);
    if (faceNext) {
      const dx = faceNext.x - pos.x;
      const dz = faceNext.z - pos.z;
      if (Math.abs(dx) + Math.abs(dz) > 0.01) avatar.rotation.y = Math.atan2(dx, dz);
    }
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
    const pos = worldPositions[i] || new THREE.Vector3();
    const next = worldPositions[Math.min(i + 1, worldPositions.length - 1)];
    setAvatarAt(pos, next);
    return i;
  }

  function focusCameraOn(pos, dist, height, duration) {
    const toPos = pos.clone().add(new THREE.Vector3(dist * 0.35, height, dist));
    const toLook = pos.clone().add(new THREE.Vector3(0, 0.6, 0));
    if (reduced || !duration) {
      camPos.copy(toPos);
      camTarget.copy(toLook);
      return;
    }
    const fromPos = camPos.clone();
    const fromLook = camTarget.clone();
    anim = {
      kind: 'cam',
      t0: performance.now(),
      dur: duration,
      fromPos, toPos, fromLook, toLook
    };
  }

  function clearStages() {
    while (stageGroup.children.length) {
      const c = stageGroup.children[0];
      stageGroup.remove(c);
      c.traverse(o => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) o.material.dispose();
      });
    }
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
        if (o.isMesh && o.material && o.material.opacity != null && ch.userData.node && ch.userData.node.state === 'fog') return;
        if (o.isMesh && o.material && 'opacity' in o.material && !on) {
          o.material.transparent = true;
          o.userData._op = o.material.opacity;
          o.material.opacity = 0.12;
        }
      });
      if (!on) ch.scale.setScalar(0.85);
      else ch.scale.setScalar(1.15);
    });
    clearStages();
    stageGroup.visible = true;
    stageGroup.position.copy(mesh.position);
    const ls = domain.lessons || [];
    const span = Math.max(1.2, ls.length * 0.85);
    ls.forEach((l, i) => {
      const st = lessonStateFn ? lessonStateFn(l) : 'todo';
      const pad = createStagePad(l, st);
      const t = ls.length === 1 ? 0.5 : i / (ls.length - 1);
      pad.position.set((t - 0.5) * span, 1.15, 0.9);
      stageGroup.add(pad);
    });
    const firstTodo = ls.find(l => lessonStateFn(l) === 'next') || ls.find(l => lessonStateFn(l) === 'todo') || ls[0];
    if (firstTodo) {
      const idx = ls.indexOf(firstTodo);
      const t = ls.length === 1 ? 0.5 : idx / (ls.length - 1);
      setAvatarAt(mesh.position.clone().add(new THREE.Vector3((t - 0.5) * span, 1.35, 0.9)));
    }
    focusCameraOn(mesh.position, 7, 5.5, reduced ? 0 : 700);
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
      setAvatarAt(cur._pos, null);
      focusCameraOn(cur._pos, 16, 12, reduced ? 0 : 600);
    } else {
      focusCameraOn(new THREE.Vector3(0, 0, 0), 22, 16, reduced ? 0 : 600);
    }
    if (opts.onModeChange) opts.onModeChange('world', null);
  }

  function walkAvatar(fromIdx, toIdx, onDone) {
    const a = Math.max(0, Math.min(worldPositions.length - 1, fromIdx));
    const b = Math.max(0, Math.min(worldPositions.length - 1, toIdx));
    if (a === b || reduced) {
      setAvatarAt(worldPositions[b], worldPositions[Math.min(b + 1, worldPositions.length - 1)]);
      if (onDone) onDone();
      return;
    }
    const pts = worldPositions.slice(Math.min(a, b), Math.max(a, b) + 1);
    if (a > b) pts.reverse();
    const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.4);
    anim = {
      kind: 'walk',
      t0: performance.now(),
      dur: Math.min(2200, 700 + pts.length * 350),
      curve,
      onDone
    };
    focusCameraOn(worldPositions[b], 14, 10, anim.dur);
  }

  function spawnParticles(at) {
    const count = 18;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = at.x;
      positions[i * 3 + 1] = at.y + 0.5;
      positions[i * 3 + 2] = at.z;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pts = new THREE.Points(
      geo,
      new THREE.PointsMaterial({ color: 0xf5c451, size: 0.18, transparent: true, opacity: 1 })
    );
    scene.add(pts);
    const vel = [];
    for (let i = 0; i < count; i++) {
      vel.push(new THREE.Vector3((Math.random() - 0.5) * 2, Math.random() * 2.5 + 0.5, (Math.random() - 0.5) * 2));
    }
    anim = anim && anim.kind === 'walk' ? anim : null;
    const start = performance.now();
    function tickP() {
      const t = (performance.now() - start) / 900;
      const pos = pts.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        pos[i * 3] = at.x + vel[i].x * t;
        pos[i * 3 + 1] = at.y + 0.5 + vel[i].y * t - t * t * 1.5;
        pos[i * 3 + 2] = at.z + vel[i].z * t;
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
    zoom = Math.min(1.35, Math.max(0.75, zoom + (ev.deltaY > 0 ? 0.05 : -0.05)));
  }, { passive: false });

  function frame() {
    requestAnimationFrame(frame);
    const dt = clock.getDelta();
    pulseT += dt;
    islandGroup.children.forEach(ch => {
      const flame = ch.userData.flame;
      if (flame) flame.position.y = (ch.userData.node.kind === 'domain' ? 1.05 : 1.25) * 0.95 + Math.sin(pulseT * 3 + (ch.userData.index || 0)) * 0.06;
      if (ch.userData.node && ch.userData.node.state === 'current') {
        ch.rotation.y += dt * 0.25;
      }
    });
    if (avatar.userData.lamp) {
      avatar.userData.lamp.material.emissiveIntensity = 1.2 + Math.sin(pulseT * 4) * 0.35;
    }
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
        setAvatarAt(p, p2);
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

  // initial camera
  const startIdx = placeAvatarForProgress(opts.avatarCourseNo || 0);
  const startPos = worldPositions[startIdx] || new THREE.Vector3();
  focusCameraOn(startPos, 16, 12, 0);

  return {
    THREE,
    enterIsland,
    exitIsland,
    walkAvatar,
    placeAvatarForProgress,
    findNodeIndexForCourse,
    spawnParticles,
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

window.LampWorld = { mountLampWorld };
