/* =====================================================================
   ant-builder.js — monta uma formiga 3D a partir de SPECIES[i].forma
   Eixo X = frente (cabeça), Y = cima, Z = lados. Pés no chão (y = 0).
   O resultado é normalizado: corpo com comprimento 1.
   userData.parts guarda os materiais de cada parte (cabeça, tórax,
   abdômen, 6 pernas, 2 antenas) para o botão "Conte as partes".
   ===================================================================== */

function buildProceduralAnt(sp) {
  const f = sp.forma, C = f.cores;
  const g = new THREE.Group();
  const body = [];                       // peças usadas para medir o corpo
  const parts = { head: [], thorax: [], abdomen: [], legs: [], antennae: [] };

  const [hl, hh, hw] = f.cabeca, [tl, th, tw] = f.torax, [gl, gh, gw] = f.abdomen;
  const L = f.pernas, A = f.antenas, n = f.tamanhoNo;
  const ty = L * 0.3 + th * 0.12;        // altura do tórax

  const mHead = mat(C.cabeca, { shininess: f.brilho });
  const mThor = mat(C.torax, { shininess: f.brilho });
  const mGast = mat(C.abdomen, f.abdomenTransparente
    ? { shininess: 90, transparent: true, opacity: 0.72 } : { shininess: f.brilho });
  const mPet = mat(C.torax, { shininess: f.brilho });
  const mDark = mat(new THREE.Color(C.cabeca).multiplyScalar(0.5), { shininess: 30 });  // mandíbulas e ferrão
  const mEye = mat('#050505', { shininess: 120, specular: 0xffffff });
  parts.head.push(mHead);
  parts.thorax.push(mThor);
  parts.abdomen.push(mGast, mPet);

  // --- posições ao longo do corpo (da cabeça para trás) ---
  const hx = 0, hy = ty + th * 0.22;
  const tx = hx - hl * 0.5 - 0.06 - tl * 0.5;
  const nodeStart = tx - tl * 0.5 - n * 0.7;
  const nodeXs = [];
  for (let i = 0; i < f.nos; i++) nodeXs.push(nodeStart - i * n * 1.9);
  const lastNode = nodeXs[nodeXs.length - 1];
  const gx = lastNode - n * 0.7 - gl * 0.45;
  const gy = ty + gh * 0.05;

  buildHead();
  buildThorax();
  buildPetiole();
  buildGaster();
  buildLegs();
  const antennaGroups = buildAntennae();
  if (f.folha) buildLeaf();

  // ---------------- CABEÇA (olhos e mandíbulas) ----------------
  function buildHead() {
    const head = ellipsoid(mHead, hl, hh, hw);
    head.position.set(hx, hy, 0);
    head.rotation.z = -0.18;
    g.add(head); body.push(head);
    if (f.lobos) {                       // cabeça em forma de coração (saúva)
      for (const s of [-1, 1]) {
        const lobe = ellipsoid(mHead, hl * 0.6, hh * 0.75, hw * 0.55);
        lobe.position.set(hx - hl * 0.2, hy + hh * 0.12, s * hw * 0.25);
        g.add(lobe);
      }
    }
    for (const s of [-1, 1]) {
      const eye = ellipsoid(mEye, hw * 0.16, hw * 0.16, hw * 0.12, GEO.sphereLo);
      eye.position.set(hx + hl * 0.12, hy + hh * 0.12, s * hw * 0.44);
      g.add(eye);
      const md = ellipsoid(mDark, f.mandibulas, hh * 0.14, f.mandibulas * 0.38);
      md.position.set(hx + hl * 0.42 + f.mandibulas * 0.28, hy - hh * 0.22, s * hw * 0.17);
      md.rotation.y = s * 0.6;           // pontas viradas para dentro
      g.add(md); body.push(md);
    }
  }

  // ---------------- TÓRAX (pescoço + mesossoma + espinhos) ----------------
  function buildThorax() {
    segment(g, new V3(tx + tl * 0.42, ty + th * 0.08, 0), new V3(hx - hl * 0.35, hy - hh * 0.05, 0), tw * 0.16, mThor);
    const thorax = ellipsoid(mThor, tl, th, tw);
    thorax.position.set(tx + tl * 0.08, ty + th * 0.08, 0);
    thorax.rotation.z = -0.08;
    g.add(thorax); body.push(thorax);
    const thorax2 = ellipsoid(mThor, tl * 0.5, th * 0.78, tw * 0.82);
    thorax2.position.set(tx - tl * 0.3, ty, 0);
    g.add(thorax2); body.push(thorax2);
    if (f.espinhos) {
      for (const ox of [0.3, 0.02, -0.38]) for (const s of [-1, 1]) {
        const sp2 = new THREE.Mesh(GEO.cone, mThor);
        sp2.scale.set(tw * 0.06, th * 0.42, tw * 0.06);
        sp2.position.set(tx + tl * ox, ty + th * 0.52, s * tw * 0.2);
        sp2.rotation.set(s * 0.45, 0, 0.35);
        g.add(sp2);
      }
    }
  }

  // ---------------- PECÍOLO (cintura fina, 1 ou 2 nós) ----------------
  function buildPetiole() {
    let prevX = tx - tl * 0.5;
    const fn = f.formaNo || [1, 1.15, 1];
    nodeXs.forEach((x) => {
      segment(g, new V3(prevX, ty, 0), new V3(x, ty + n * 0.2, 0), n * 0.35, mPet);
      const node = ellipsoid(mPet, n * 2 * fn[0], n * 2 * fn[1], n * 2 * fn[2]);
      node.position.set(x, ty + n * 0.35, 0);
      g.add(node); body.push(node);
      prevX = x;
    });
    segment(g, new V3(prevX, ty + n * 0.2, 0), new V3(gx + gl * 0.35, gy, 0), n * 0.32, mPet);
  }

  // ---------------- ABDÔMEN (gáster + ferrão) ----------------
  function buildGaster() {
    const gaster = ellipsoid(mGast, gl, gh, gw);
    gaster.position.set(gx, gy, 0);
    gaster.rotation.z = 0.22;
    g.add(gaster); body.push(gaster);
    if (f.ferrao) {
      const st = new THREE.Mesh(GEO.cone, mDark);
      st.scale.set(gw * 0.05, gl * 0.18, gw * 0.05);
      st.rotation.z = Math.PI / 2 + 0.22;
      st.position.set(gx - gl * 0.53, gy - gh * 0.14, 0);
      g.add(st);
    }
  }

  // ---------------- 6 PERNAS articuladas, presas ao tórax ----------------
  function buildLegs() {
    const legAt = [0.3, 0.0, -0.3], legAng = [38, 92, 142];
    const rF = tw * 0.13, rT = tw * 0.105, rS = tw * 0.075;
    for (const s of [1, -1]) for (let i = 0; i < 3; i++) {
      const m = mat(C.pernas, { shininess: f.brilho });
      const leg = new THREE.Group();
      const a = legAng[i] * Math.PI / 180;
      const dir = new V3(Math.cos(a), 0, s * Math.sin(a));
      const hip = new V3(tx + tl * legAt[i], ty - th * 0.3, s * tw * 0.28);
      const knee = hip.clone().addScaledVector(dir, L * 0.36); knee.y = hip.y + L * 0.2;
      const ankle = knee.clone().addScaledVector(dir, L * 0.34); ankle.y = L * 0.07;
      const foot = ankle.clone().addScaledVector(dir, L * 0.24); foot.y = 0.004;
      const coxa = new THREE.Mesh(GEO.sphereLo, m);
      coxa.position.copy(hip); coxa.scale.setScalar(rF * 1.5);
      leg.add(coxa);
      segment(leg, hip, knee, rF, m);     // fêmur
      segment(leg, knee, ankle, rT, m);   // tíbia
      segment(leg, ankle, foot, rS, m);   // tarso
      g.add(leg);
      parts.legs.push(m);
    }
  }

  // ---------------- 2 ANTENAS cotoveladas ----------------
  function buildAntennae() {
    const groups = [];
    for (const s of [1, -1]) {
      const m = mat(C.pernas, { shininess: f.brilho });
      const ag = new THREE.Group();
      ag.position.set(hx + hl * 0.3, hy + hh * 0.2, s * hw * 0.2);
      const o = new V3();
      const elbow = new V3(0.02 * A, 0.4 * A, s * 0.2 * A);                     // escapo sobe
      const mid = elbow.clone().add(new V3(0.34 * A, 0.04 * A, s * 0.12 * A));  // cotovelo → frente
      const tip = mid.clone().add(new V3(0.26 * A, -0.1 * A, s * 0.07 * A));
      segment(ag, o, elbow, hw * 0.045, m);
      segment(ag, elbow, mid, hw * 0.04, m);
      segment(ag, mid, tip, hw * 0.05, m);
      const club = ellipsoid(m, hw * 0.2, hw * 0.12, hw * 0.12, GEO.sphereLo);
      club.position.copy(tip);
      ag.add(club);
      g.add(ag);
      groups.push(ag);
      parts.antennae.push(m);
    }
    return groups;
  }

  // ---------------- FOLHA na mandíbula (saúva) ----------------
  function buildLeaf() {
    const sh = new THREE.Shape();
    sh.moveTo(0, 0);
    sh.bezierCurveTo(0.7, 0.1, 0.95, 0.6, 0.55, 1.05);
    sh.lineTo(0.3, 0.85); sh.lineTo(0.1, 1.15);
    sh.bezierCurveTo(-0.5, 1.2, -0.95, 0.6, -0.55, 0.15);
    sh.lineTo(0, 0);
    const leaf = new THREE.Mesh(new THREE.ShapeGeometry(sh, 6),
      new THREE.MeshPhongMaterial({ color: 0x3fb54a, side: THREE.DoubleSide, shininess: 20 }));
    const sz = L * 0.48;
    leaf.scale.setScalar(sz);
    leaf.position.set(hx + hl * 0.55 + f.mandibulas * 0.4, hy - hh * 0.05, 0);
    leaf.rotation.z = 0.55;
    g.add(leaf);
    segment(g, leaf.position.clone(), leaf.position.clone().add(new V3(-0.45 * sz, 0.95 * sz, 0)), sz * 0.012,
      new THREE.MeshPhongMaterial({ color: 0x2b8a35 }));
  }

  // --- normalizar: corpo com comprimento 1, centrado ---
  const box = new THREE.Box3();
  g.updateMatrixWorld(true);
  body.forEach((b) => box.expandByObject(b));
  const s = 1 / (box.max.x - box.min.x);
  g.scale.setScalar(s);
  g.position.x = -((box.max.x + box.min.x) / 2) * s;
  const wrap = new THREE.Group();
  wrap.add(g);
  wrap.userData.parts = parts;
  wrap.userData.antennae = antennaGroups;
  wrap.userData.bodyHeight = box.max.y * s;
  return wrap;
}
