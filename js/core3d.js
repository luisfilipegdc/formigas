/* =====================================================================
   core3d.js — peças comuns do Museu dos Insetos 3D
   (usado pelas telas de cada inseto; a formiga ainda tem a sua cópia própria)

   - funções de distância (SDF) para "esculpir" corpos de insetos
   - marching cubes: transforma a SDF numa malha 3D lisa
   - relevo fino de cutícula feito na placa de vídeo
   - pelos, segmentos de pernas/antenas e cinemática das pernas
   Unidades ≈ milímetros. X = frente, Y = cima, Z = lados.
   ===================================================================== */

if (window.THREE && THREE.ColorManagement) THREE.ColorManagement.legacyMode = false;  // cores hex fiéis

const V3 = THREE.Vector3, UP = new V3(0, 1, 0);
const clamp = THREE.MathUtils.clamp, smooth = THREE.MathUtils.smoothstep;

// números "aleatórios" que se repetem (o inseto sai sempre igual)
let seed = 7;
const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const rnd = (a, b) => a + Math.random() * (b - a);

/* ---------------- formas básicas ---------------- */
function ell(x, y, z, cx, cy, cz, rx, ry, rz) {
  const px = (x - cx) / rx, py = (y - cy) / ry, pz = (z - cz) / rz;
  const k0 = Math.sqrt(px * px + py * py + pz * pz);
  const qx = px / rx, qy = py / ry, qz = pz / rz;
  const k1 = Math.sqrt(qx * qx + qy * qy + qz * qz);
  return k1 < 1e-9 ? -Math.min(rx, ry, rz) : k0 * (k0 - 1) / k1;
}
// cone arredondado entre dois pontos (raio ra → rb)
function cone(x, y, z, ax, ay, az, bx, by, bz, ra, rb) {
  const pax = x - ax, pay = y - ay, paz = z - az;
  const bax = bx - ax, bay = by - ay, baz = bz - az;
  let h = (pax * bax + pay * bay + paz * baz) / (bax * bax + bay * bay + baz * baz);
  h = h < 0 ? 0 : h > 1 ? 1 : h;
  const dx = pax - bax * h, dy = pay - bay * h, dz = paz - baz * h;
  return Math.sqrt(dx * dx + dy * dy + dz * dz) - (ra + (rb - ra) * h);
}
function smin(a, b, k) { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * 0.25; }
function smax(a, b, k) { return -smin(-a, -b, k); }

// ruído suave 3D (0..1)
function hash3(i, j, k) { const h = Math.sin(i * 127.1 + j * 311.7 + k * 74.7) * 43758.5453; return h - Math.floor(h); }
function vnoise3(x, y, z) {
  const i = Math.floor(x), j = Math.floor(y), k = Math.floor(z);
  const fx = x - i, fy = y - j, fz = z - k;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy), w = fz * fz * (3 - 2 * fz);
  const L = (a, b, t) => a + (b - a) * t;
  return L(L(L(hash3(i, j, k), hash3(i + 1, j, k), u), L(hash3(i, j + 1, k), hash3(i + 1, j + 1, k), u), v),
           L(L(hash3(i, j, k + 1), hash3(i + 1, j, k + 1), u), L(hash3(i, j + 1, k + 1), hash3(i + 1, j + 1, k + 1), u), v), w);
}
function fbm3(x, y, z) { return vnoise3(x, y, z) * 0.6 + vnoise3(x * 2.03, y * 2.03, z * 2.03) * 0.28 + vnoise3(x * 4.1, y * 4.1, z * 4.1) * 0.12; }

function gradOf(fn, x, y, z) {
  const e = 0.006;
  return new V3(fn(x + e, y, z) - fn(x - e, y, z), fn(x, y + e, z) - fn(x, y - e, z), fn(x, y, z + e) - fn(x, y, z - e)).normalize();
}

/* ---------------- marching cubes ---------------- */
function polygonize(fn, min, max, cell) {
  const nx = Math.ceil((max.x - min.x) / cell) + 1, ny = Math.ceil((max.y - min.y) / cell) + 1, nz = Math.ceil((max.z - min.z) / cell) + 1;
  const N = nx * ny * nz, field = new Float32Array(N);
  for (let k = 0, q = 0; k < nz; k++) {
    const z = min.z + k * cell;
    for (let j = 0; j < ny; j++) {
      const y = min.y + j * cell;
      for (let i = 0; i < nx; i++, q++) field[q] = fn(min.x + i * cell, y, z);
    }
  }
  const CO = [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0], [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]];
  const ED = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
  const edgeMap = new Int32Array(N * 3).fill(-1);
  const pos = [], idx = [], vals = new Float32Array(8), vid = new Int32Array(12);
  const id = (i, j, k) => i + nx * (j + ny * k);
  for (let k = 0; k < nz - 1; k++) for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
    let ci = 0;
    for (let c = 0; c < 8; c++) {
      const v = field[id(i + CO[c][0], j + CO[c][1], k + CO[c][2])];
      vals[c] = v;
      if (v < 0) ci |= 1 << c;
    }
    if (ci === 0 || ci === 255) continue;
    const mask = THREE.edgeTable[ci];
    for (let e = 0; e < 12; e++) {
      if (!(mask & (1 << e))) continue;
      const A = ED[e][0], B = ED[e][1], ca = CO[A], cb = CO[B];
      const axis = ca[0] !== cb[0] ? 0 : ca[1] !== cb[1] ? 1 : 2;
      const lo = ca[axis] < cb[axis] ? ca : cb;
      const key = id(i + lo[0], j + lo[1], k + lo[2]) * 3 + axis;
      if (edgeMap[key] < 0) {
        const t = vals[A] / (vals[A] - vals[B]);
        pos.push(min.x + (i + ca[0] + t * (cb[0] - ca[0])) * cell,
                 min.y + (j + ca[1] + t * (cb[1] - ca[1])) * cell,
                 min.z + (k + ca[2] + t * (cb[2] - ca[2])) * cell);
        edgeMap[key] = pos.length / 3 - 1;
      }
      vid[e] = edgeMap[key];
    }
    for (let t = ci * 16; THREE.triTable[t] !== -1; t += 3) idx.push(vid[THREE.triTable[t]], vid[THREE.triTable[t + 1]], vid[THREE.triTable[t + 2]]);
  }
  return { pos: new Float32Array(pos), idx };
}

function shadowy(m) { m.castShadow = true; m.receiveShadow = true; return m; }

// malha pronta: normais pela SDF, cor por vértice e triângulos virados para fora
function sdfMesh(fn, min, max, cell, colorFn, mat) {
  const { pos, idx } = polygonize(fn, min, max, cell);
  const count = pos.length / 3;
  const nor = new Float32Array(pos.length), col = new Float32Array(pos.length), c = new THREE.Color();
  for (let v = 0; v < count; v++) {
    const x = pos[v * 3], y = pos[v * 3 + 1], z = pos[v * 3 + 2];
    const n = gradOf(fn, x, y, z);
    nor[v * 3] = n.x; nor[v * 3 + 1] = n.y; nor[v * 3 + 2] = n.z;
    colorFn(x, y, z, n, c);
    col[v * 3] = c.r; col[v * 3 + 1] = c.g; col[v * 3 + 2] = c.b;
  }
  let s = 0;
  for (let t = 0; t < Math.min(idx.length, 3000); t += 3) {
    const a = new V3().fromArray(pos, idx[t] * 3), b = new V3().fromArray(pos, idx[t + 1] * 3), cc = new V3().fromArray(pos, idx[t + 2] * 3);
    s += new V3().subVectors(b, a).cross(new V3().subVectors(cc, a)).dot(new V3().fromArray(nor, idx[t] * 3));
  }
  if (s < 0) for (let t = 0; t < idx.length; t += 3) { const tmp = idx[t + 1]; idx[t + 1] = idx[t + 2]; idx[t + 2] = tmp; }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.setIndex(count > 65535 ? new THREE.Uint32BufferAttribute(idx, 1) : new THREE.Uint16BufferAttribute(idx, 1));
  return shadowy(new THREE.Mesh(geo, mat));
}

/* ---------------- relevo fino da cutícula (na placa de vídeo) ---------------- */
function addCuticle(mat, strength, scale) {
  mat.extensions = { derivatives: true };
  mat.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vObjPos;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvObjPos = position;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>
varying vec3 vObjPos;
float h3(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float vn(vec3 x) {
  vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(h3(i), h3(i + vec3(1,0,0)), f.x), mix(h3(i + vec3(0,1,0)), h3(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(h3(i + vec3(0,0,1)), h3(i + vec3(1,0,1)), f.x), mix(h3(i + vec3(0,1,1)), h3(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float cuticle(vec3 p) { p *= ${scale.toFixed(2)}; return vn(p * 9.0) * 0.65 + vn(p * 24.0) * 0.35; }
vec3 bumpN(vec3 pos, vec3 n, float h, float fd) {
  vec2 dh = vec2(dFdx(h), dFdy(h));
  vec3 sx = dFdx(pos), sy = dFdy(pos), r1 = cross(sy, n), r2 = cross(n, sx);
  float det = dot(sx, r1) * fd;
  return normalize(abs(det) * n - sign(det) * (dh.x * r1 + dh.y * r2));
}`).replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
normal = bumpN(-vViewPosition, normal, cuticle(vObjPos) * ${strength.toFixed(3)}, faceDirection);`);
  };
}

/* ---------------- pelos ---------------- */
// list: [{ p, dir, len, r, col? }] → um único InstancedMesh (com cor por pelo, se houver)
function hairMesh(list, mat) {
  const geo = new THREE.ConeGeometry(1, 1, 4, 1, true);
  geo.translate(0, 0.5, 0);
  const inst = new THREE.InstancedMesh(geo, mat, list.length);
  const mtx = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new V3();
  list.forEach((hh, i) => {
    q.setFromUnitVectors(UP, hh.dir);
    sc.set(hh.r, hh.len, hh.r);
    mtx.compose(hh.p, q, sc);
    inst.setMatrixAt(i, mtx);
    if (hh.col) inst.setColorAt(i, hh.col);
  });
  return inst;
}

/* ---------------- segmentos de pernas e antenas ---------------- */
// grupo "em pé" (eixo +Y, de 0 até len), com junta na ponta e pelinhos.
// opts: mat, jointMat, hairMat, bulge, skew, hairDensity, hairLen, joint, flat
function segGroup(len, r0, r1, opts) {
  const g = new THREE.Group();
  const bulge = opts.bulge === undefined ? 0.25 : opts.bulge;
  const R = (t) => (r0 + (r1 - r0) * t) * (1 + bulge * Math.sin(Math.PI * Math.pow(t, opts.skew || 1)));
  const pts = [new THREE.Vector2(0, 0)];
  for (let i = 0; i <= 10; i++) pts.push(new THREE.Vector2(R(i / 10), i / 10 * len));
  pts.push(new THREE.Vector2(0, len));
  const mesh = shadowy(new THREE.Mesh(new THREE.LatheGeometry(pts, 12), opts.mat));
  if (opts.flat) mesh.scale.set(opts.flat, 1, 1 / Math.sqrt(opts.flat));   // segmento achatado (ex.: tíbia da abelha)
  g.add(mesh);
  if (opts.joint !== false && opts.jointMat) {
    const j = shadowy(new THREE.Mesh(new THREE.SphereGeometry(r1 * 0.95, 12, 8), opts.jointMat));
    j.position.y = len;
    g.add(j);
  }
  const nh = Math.round(len * (opts.hairDensity || 6)), list = [];
  for (let i = 0; i < nh; i++) {
    const t = 0.1 + rand() * 0.85, ang = rand() * Math.PI * 2;
    const radial = new V3(Math.cos(ang) * (opts.flat || 1), 0, Math.sin(ang));
    list.push({ p: radial.clone().multiplyScalar(R(t) * 0.92).setY(t * len),
                dir: radial.normalize().multiplyScalar(0.55).add(new V3(0, 0.85, 0)).normalize(),
                len: (opts.hairLen || 0.14) * (0.5 + rand() * 0.5), r: 0.006 });
  }
  if (list.length && opts.hairMat) g.add(hairMesh(list, opts.hairMat));
  g.userData.len = len;
  return g;
}
const _tmpDir = new V3();
function place(g, a, b) {
  g.position.copy(a);
  g.quaternion.setFromUnitVectors(UP, _tmpDir.subVectors(b, a).normalize());
}

/* ---------------- perna com joelho para cima (cinemática inversa) ---------------- */
// leg: { C (coxa), L: {f, t, ta}, s (lado) } → [coxa, trocânter, joelho, tornozelo, pé]
function legPoints(leg, F) {
  const { C, L } = leg;
  const h = new V3(F.x - C.x, 0, F.z - C.z);
  if (h.lengthSq() < 1e-6) h.set(leg.s * 0.01, 0, leg.s);
  h.normalize();
  const t = C.clone().addScaledVector(h, 0.33); t.y -= 0.12;
  const rt = Math.sqrt(Math.max(0.01, L.ta * L.ta - 0.37 * 0.37));
  const a = F.clone().addScaledVector(h, -rt); a.y = F.y + 0.37;
  const d = new V3().subVectors(a, t);
  let dist = d.length();
  const maxD = (L.f + L.t) * 0.999;
  if (dist > maxD) { d.multiplyScalar(maxD / dist); a.copy(t).add(d); dist = maxD; }
  d.normalize();
  const along = (L.f * L.f - L.t * L.t + dist * dist) / (2 * dist);
  const up = Math.sqrt(Math.max(0, L.f * L.f - along * along));
  const b = UP.clone().addScaledVector(d, -UP.dot(d)).normalize();
  const k = t.clone().addScaledVector(d, along).addScaledVector(b, up);
  return [C.clone(), t, k, a, F.clone()];
}
function solveLeg(leg, F) {
  const P = legPoints(leg, F);
  place(leg.troch, P[0], P[1]);
  place(leg.femur, P[1], P[2]);
  place(leg.tibia, P[2], P[3]);
  place(leg.tarsus, P[3], P[4]);
}

/* ---------------- junta geometrias coloridas numa só ---------------- */
function mergeColored(parts) {
  const pos = [], nor = [], col = [];
  parts.forEach(([geo, m, c]) => {
    const g = geo.index ? geo.toNonIndexed() : geo.clone();
    g.applyMatrix4(m);
    pos.push(...g.attributes.position.array);
    nor.push(...g.attributes.normal.array);
    const n = g.attributes.position.count, ca = g.attributes.color;
    for (let i = 0; i < n; i++) ca && !c ? col.push(ca.getX(i), ca.getY(i), ca.getZ(i)) : col.push(c.r, c.g, c.b);
  });
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  out.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  return out;
}

/* ---------------- textura de asa transparente com nervuras ---------------- */
// draw(g): desenha as nervuras em coordenadas 0..1 (v para cima); outline(g): contorno da asa
function wingTextureFrom(outline, draw, tint) {
  const W = 1024, H = 320, c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.setTransform(W, 0, 0, -H, 0, H);
  outline(g);
  const gr = g.createLinearGradient(0, 0, 1, 0);
  gr.addColorStop(0, tint[0]); gr.addColorStop(0.3, tint[1]); gr.addColorStop(1, tint[2]);
  g.fillStyle = gr; g.fill();
  g.save(); outline(g); g.clip();
  g.strokeStyle = 'rgba(60,38,20,.95)'; g.lineCap = 'round'; g.lineJoin = 'round';
  draw(g, (w, pts) => { g.lineWidth = w; g.beginPath(); g.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) g.lineTo(pts[i], pts[i + 1]); g.stroke(); });
  g.restore();
  outline(g); g.strokeStyle = 'rgba(80,55,35,.75)'; g.lineWidth = 0.004; g.stroke();
  const t = new THREE.CanvasTexture(c);
  t.encoding = THREE.sRGBEncoding;
  return t;
}
