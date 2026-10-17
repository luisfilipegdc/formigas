/* =====================================================================
   Terra Codex · Brasil Vivo · formas 3D estilizadas
   Material "toon" (sombra em degraus) para o visual de desenho animado
   com realismo encantado: bichos reconhecíveis, personagens com rosto,
   árvores do Cerrado, buritis e a Base Brasília modernista.
   Cada bicho devolve um Group com userData.animar(t, agindo).
   Unidades: metros. Y para cima. Bicho olha para +X.
   ===================================================================== */
// cores em sRGB de verdade (sem isso, tudo sai lavado no celular)
THREE.ColorManagement.legacyMode = false;

const Formas = (function () {
  const V3 = THREE.Vector3;

  // degraus de luz do toon
  const grad = (() => {
    const px = new Uint8Array([90, 90, 90, 255, 160, 160, 160, 255, 215, 215, 215, 255, 255, 255, 255, 255]);
    const t = new THREE.DataTexture(px, 4, 1, THREE.RGBAFormat);
    t.minFilter = t.magFilter = THREE.NearestFilter; t.generateMipmaps = false; t.needsUpdate = true; return t;
  })();
  const cache = {};
  function T(cor, extra) {
    const k = cor + JSON.stringify(extra || {});
    if (!cache[k]) cache[k] = extra && extra.flatShading
      ? new THREE.MeshPhongMaterial({ color: cor, flatShading: true, shininess: 6, specular: '#1a1a1a' })   // facetado (copas, pedras)
      : new THREE.MeshToonMaterial(Object.assign({ color: cor, gradientMap: grad }, extra || {}));
    return cache[k];
  }
  const B = (cor, opac) => new THREE.MeshBasicMaterial({ color: cor, transparent: opac < 1, opacity: opac === undefined ? 1 : opac, side: THREE.DoubleSide, depthWrite: !(opac < 1) });
  function m(geo, mat, x, y, z, sx, sy, sz) {
    const o = new THREE.Mesh(geo, mat); o.position.set(x || 0, y || 0, z || 0);
    if (sx !== undefined) o.scale.set(sx, sy === undefined ? sx : sy, sz === undefined ? sx : sz);
    o.castShadow = true; return o;
  }
  const esfera = new THREE.SphereGeometry(1, 16, 12), esferaP = new THREE.SphereGeometry(1, 10, 8);
  const cil = (r1, r2, h, s) => new THREE.CylinderGeometry(r1, r2, h, s || 8);
  const OLHO = T('#1d1a16'), BRILHO = B('#ffffff');
  function olho(g, x, y, z, r) { g.add(m(esferaP, OLHO, x, y, z, r)); g.add(m(esferaP, BRILHO, x + r * 0.45, y + r * 0.35, z + (z > 0 ? r * 0.3 : -r * 0.3), r * 0.35)); }

  // junta geometrias (para instâncias com várias peças, ex.: tufo de capim)
  function juntar(lista) {
    const pos = [], nor = [];
    lista.forEach(([geo, mat4]) => {
      const g = geo.index ? geo.toNonIndexed() : geo.clone(); g.applyMatrix4(mat4);
      pos.push(...g.attributes.position.array); nor.push(...g.attributes.normal.array);
    });
    const out = new THREE.BufferGeometry();
    out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); out.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    return out;
  }
  const M4 = (x, y, z, rx, ry, rz, s) => new THREE.Matrix4().compose(new V3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx || 0, ry || 0, rz || 0)), new V3(s || 1, s || 1, s || 1));

  /* ---------- personagens ---------- */
  function pessoa(o) {
    o = Object.assign({ pele: '#d9a47a', camisa: '#2f8a47', calca: '#3b4a5c', cabelo: '#3a2516', chapeu: null, mochila: false, saia: false }, o);
    const g = new THREE.Group(), pele = T(o.pele);
    const perna = (x) => { const p = new THREE.Group(); p.position.set(x, 0.95, 0); p.add(m(new THREE.CapsuleGeometry(0.17, 0.55, 4, 8), T(o.calca), 0, -0.45, 0)); p.add(m(esferaP, T('#5a3a24'), 0, -0.9, 0.08, 0.2, 0.13, 0.28)); g.add(p); return p; };
    const pernas = [perna(-0.2), perna(0.2)];
    const tronco = m(new THREE.CapsuleGeometry(0.42, 0.55, 4, 12), T(o.camisa), 0, 1.45, 0); g.add(tronco);
    if (o.saia) g.add(m(cil(0.42, 0.62, 0.55, 12), T(o.camisa), 0, 1.0, 0));
    const braco = (x) => { const b = new THREE.Group(); b.position.set(x, 1.82, 0); b.add(m(new THREE.CapsuleGeometry(0.12, 0.5, 4, 8), T(o.camisa), 0, -0.3, 0)); b.add(m(esferaP, pele, 0, -0.65, 0, 0.13)); g.add(b); return b; };
    const bracos = [braco(-0.55), braco(0.55)];
    const cab = new THREE.Group(); cab.position.y = 2.45; g.add(cab);
    cab.add(m(esfera, pele, 0, 0, 0, 0.5, 0.48, 0.48));
    cab.add(m(new THREE.SphereGeometry(1, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.4), T(o.cabelo), 0, 0.06, -0.05, 0.53, 0.52, 0.52));
    cab.add(m(esfera, T(o.cabelo), 0, 0.02, -0.22, 0.46, 0.42, 0.34));   // nuca
    olho(cab, -0.17, -0.04, 0.42, 0.075); olho(cab, 0.17, -0.04, 0.42, 0.075);
    cab.add(m(esferaP, T('#e98a7a'), -0.3, -0.12, 0.36, 0.08, 0.05, 0.03)); cab.add(m(esferaP, T('#e98a7a'), 0.3, -0.12, 0.36, 0.08, 0.05, 0.03));
    if (o.chapeu) { cab.add(m(cil(0.85, 0.85, 0.06, 20), T(o.chapeu), 0, 0.3, 0)); cab.add(m(cil(0.42, 0.5, 0.36, 16), T(o.chapeu), 0, 0.48, 0)); cab.add(m(cil(0.505, 0.505, 0.08, 16), T('#7a4a2a'), 0, 0.35, 0)); }
    if (o.mochila) { g.add(m(new THREE.BoxGeometry(0.75, 0.85, 0.38), T('#b86a32'), 0, 1.55, -0.5)); g.add(m(cil(0.18, 0.18, 0.8, 10), T('#5f8a3a'), 0, 2.05, -0.5, 1, 1, 1)); g.children[g.children.length - 1].rotation.z = Math.PI / 2; }
    g.userData.animar = (passo, andando) => {
      const a = Math.sin(passo) * 0.7 * andando;
      pernas[0].rotation.x = a; pernas[1].rotation.x = -a; bracos[0].rotation.x = -a * 0.8; bracos[1].rotation.x = a * 0.8;
      tronco.position.y = 1.45 + Math.abs(Math.cos(passo)) * 0.06 * andando; cab.position.y = 2.45 + Math.abs(Math.cos(passo)) * 0.06 * andando;
    };
    return g;
  }

  /* ---------- bichos ---------- */
  // asa: x = para a frente, y = para fora do corpo (envergadura)
  function asaBorboleta(cor, borda, frente) {
    const s = new THREE.Shape();
    if (frente) { s.moveTo(0.05, 0); s.bezierCurveTo(0.4, 0.3, 0.8, 0.95, 0.45, 1.15); s.bezierCurveTo(0.15, 1.3, -0.25, 0.8, -0.05, 0); }
    else { s.moveTo(-0.05, 0); s.bezierCurveTo(-0.02, 0.5, -0.2, 0.95, -0.55, 0.82); s.bezierCurveTo(-0.85, 0.6, -0.5, 0.15, -0.1, 0); }
    const g = new THREE.Group(), geo = new THREE.ShapeGeometry(s, 12);
    g.add(new THREE.Mesh(geo, B(borda)));
    const dentro = new THREE.Mesh(geo, B(cor)); dentro.scale.setScalar(0.8); dentro.position.z = 0.003; g.add(dentro);
    if (frente) { [[0.42, 1.0], [0.3, 1.08]].forEach(([x, y]) => { const pt = new THREE.Mesh(new THREE.CircleGeometry(0.04, 8), B('#ffffff')); pt.position.set(x, y, 0.006); g.add(pt); }); }
    return g;
  }
  function borboleta() {
    const g = new THREE.Group(), corpo = T('#2a2420');
    const c = m(new THREE.CapsuleGeometry(0.06, 0.5, 4, 8), corpo, 0, 0, 0); c.rotation.z = Math.PI / 2; g.add(c);
    g.add(m(esferaP, corpo, 0.34, 0.02, 0, 0.09));
    [-1, 1].forEach((s) => { const an = m(cil(0.008, 0.008, 0.4, 4), corpo, 0.48, 0.16, s * 0.06); an.rotation.set(s * 0.35, 0, -0.85); g.add(an); g.add(m(esferaP, corpo, 0.62, 0.3, s * 0.12, 0.028)); });
    const lados = [-1, 1].map((s) => {
      const p = new THREE.Group();
      [asaBorboleta('#3e95f5', '#16203a', true), asaBorboleta('#2c6fd6', '#16203a', false)].forEach((a) => { a.rotation.x = -Math.PI / 2; if (s > 0) a.scale.y = -1; p.add(a); });
      g.add(p); return p;
    });
    g.userData.animar = (t, agindo) => { const a = 0.15 + (Math.sin(t * (agindo ? 3 : 10)) + 1) * 0.6; lados[0].rotation.x = a; lados[1].rotation.x = -a; };
    return g;
  }
  function abelha() {
    const g = new THREE.Group(), ouro = T('#e9b23a'), preto = T('#2a2016');
    g.add(m(esfera, ouro, -0.15, 0, 0, 0.42, 0.3, 0.3));
    [-0.05, -0.28].forEach((x) => g.add(m(cil(0.31, 0.31, 0.07, 14), preto, x, 0, 0, 1, 1, 1))); g.children.slice(1).forEach((c) => { c.rotation.z = Math.PI / 2; c.scale.set(1, 1, 0.98); });
    g.add(m(esfera, T('#7a5a2a'), 0.25, 0.02, 0, 0.2));
    g.add(m(esfera, preto, 0.48, 0.03, 0, 0.17));
    olho(g, 0.56, 0.08, 0.11, 0.06); olho(g, 0.56, 0.08, -0.11, 0.06);
    const asaMat = B('#eaf6ff', 0.55), asas = [-1, 1].map((s) => { const p = new THREE.Group(); p.position.set(0.2, 0.2, s * 0.08); const a = new THREE.Mesh(new THREE.CircleGeometry(0.32, 14), asaMat); a.scale.set(1.3, 0.6, 1); a.position.set(-0.15, 0, s * 0.3); a.rotation.x = Math.PI / 2; p.add(a); g.add(p); return p; });
    g.userData.animar = (t) => { const a = Math.sin(t * 40) * 0.5; asas[0].rotation.x = a; asas[1].rotation.x = -a; };
    return g;
  }
  function formiga() {
    const g = new THREE.Group(), c = T('#8a3a1e');
    g.add(m(esfera, c, -0.45, 0.25, 0, 0.32, 0.26, 0.26));
    g.add(m(esfera, c, 0, 0.3, 0, 0.2, 0.15, 0.15));
    g.add(m(esfera, c, 0.35, 0.33, 0, 0.2, 0.18, 0.2));
    olho(g, 0.48, 0.38, 0.12, 0.04); olho(g, 0.48, 0.38, -0.12, 0.04);
    [-1, 1].forEach((s) => [-0.15, 0, 0.15].forEach((x, i) => { const p = m(cil(0.025, 0.02, 0.5, 4), c, x, 0.15, s * 0.22); p.rotation.set(s * 0.9, 0, (i - 1) * 0.5); g.add(p); }));
    [-1, 1].forEach((s) => { const an = m(cil(0.015, 0.015, 0.4, 4), c, 0.55, 0.5, s * 0.08); an.rotation.set(s * 0.4, 0, -0.9); g.add(an); });
    // pedaço de folha carregado
    const folha = new THREE.Mesh(new THREE.CircleGeometry(0.42, 7, 0, Math.PI * 1.3), B('#5fa83a')); folha.position.set(0.45, 0.85, 0); folha.rotation.set(0, 0, 0.3); g.add(folha);
    g.userData.animar = (t) => { g.children.forEach((ch, i) => { if (ch.geometry && ch.geometry.type === 'CylinderGeometry' && i < 22) ch.rotation.y = Math.sin(t * 18 + i) * 0.3; }); folha.rotation.y = Math.sin(t * 6) * 0.15; };
    return g;
  }
  function lagartixa() {
    const g = new THREE.Group(), c = T('#d8c39a'), esc = T('#b8a070');
    g.add(m(esfera, c, 0, 0.18, 0, 0.55, 0.16, 0.24));
    g.add(m(esfera, c, 0.62, 0.22, 0, 0.24, 0.14, 0.2));
    olho(g, 0.72, 0.3, 0.14, 0.05); olho(g, 0.72, 0.3, -0.14, 0.05);
    const cauda = m(new THREE.ConeGeometry(0.15, 1.1, 8), esc, -0.95, 0.15, 0); cauda.rotation.z = Math.PI / 2; g.add(cauda);
    const pernas = [];
    [[0.3, 1], [0.3, -1], [-0.3, 1], [-0.3, -1]].forEach(([x, s]) => { const p = m(cil(0.05, 0.04, 0.32, 5), c, x, 0.1, s * 0.28); p.rotation.x = s * 1.1; g.add(p); g.add(m(esferaP, c, x + 0.05, 0.02, s * 0.42, 0.07, 0.03, 0.07)); pernas.push(p); });
    for (let i = 0; i < 4; i++) g.add(m(esferaP, esc, 0.3 - i * 0.2, 0.32, 0, 0.06, 0.03, 0.06));
    g.userData.animar = (t, agindo) => { cauda.rotation.y = Math.sin(t * 3) * 0.25; pernas.forEach((p, i) => { p.rotation.z = agindo ? 0 : Math.sin(t * 10 + i * 1.6) * 0.4; }); };
    return g;
  }
  function sapo() {
    const g = new THREE.Group(), c = T('#8a7440'), barriga = T('#d9c79a');
    g.add(m(esfera, c, 0, 0.38, 0, 0.6, 0.38, 0.52));
    g.add(m(esfera, barriga, 0.1, 0.25, 0, 0.5, 0.25, 0.42));
    [-1, 1].forEach((s) => { g.add(m(esfera, c, 0.32, 0.72, s * 0.22, 0.16)); olho(g, 0.42, 0.76, s * 0.25, 0.08); g.add(m(esfera, c, -0.3, 0.2, s * 0.45, 0.32, 0.18, 0.18)); g.add(m(esferaP, c, 0.45, 0.08, s * 0.3, 0.12, 0.06, 0.14)); });
    for (let i = 0; i < 6; i++) g.add(m(esferaP, T('#6a5a30'), -0.2 + (i % 3) * 0.2, 0.7, (i < 3 ? 1 : -1) * 0.15, 0.06));
    const papo = m(esfera, barriga, 0.45, 0.25, 0, 0.12); g.add(papo);
    g.userData.animar = (t, agindo) => { papo.scale.setScalar(0.12 + (agindo ? 0.06 : 0.02) * (Math.sin(t * 6) + 1)); };
    return g;
  }
  const BICHOS = { borboleta, abelha, formiga, lagartixa, sapo };
  function bicho(nome, cor) {
    if (BICHOS[nome]) return BICHOS[nome]();
    const g = new THREE.Group(); g.add(m(esfera, T(cor || '#888'), 0, 0.4, 0, 0.5, 0.35, 0.35)); g.userData.animar = () => {}; return g;
  }

  /* ---------- paisagem ---------- */
  // tronco torto do Cerrado: cilindro curvado (uma geometria para todas as instâncias)
  function troncoTorto() {
    const geo = cil(0.18, 0.32, 4, 7); geo.translate(0, 2, 0);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) { const y = p.getY(i); p.setX(i, p.getX(i) + Math.sin(y * 0.9) * 0.45); p.setZ(i, p.getZ(i) + Math.sin(y * 0.6 + 1) * 0.25); }
    geo.computeVertexNormals(); return geo;
  }
  const copaGeo = new THREE.IcosahedronGeometry(1, 0);
  // tufo de capim: 5 lâminas
  function tufo() {
    const lam = new THREE.ConeGeometry(0.07, 0.9, 3); lam.translate(0, 0.45, 0);
    return juntar([[lam, M4(0, 0, 0)], [lam, M4(0.1, 0, 0.05, 0.25, 0, -0.3, 0.9)], [lam, M4(-0.1, 0, 0.04, -0.2, 0, 0.35, 0.85)], [lam, M4(0.04, 0, -0.1, -0.35, 0, 0.1, 0.8)], [lam, M4(-0.05, 0, -0.08, 0.3, 0, -0.15, 0.95)]]);
  }
  function buriti() {
    const g = new THREE.Group(), h = 9 + Math.random() * 4;
    const t = m(cil(0.3, 0.42, h, 8), T('#8a6a4a'), 0, h / 2, 0); g.add(t);
    for (let i = 0; i < 5; i++) g.add(m(cil(0.44, 0.44, 0.12, 8), T('#6e5238'), 0, 1 + i * (h / 6), 0));
    const folha = T('#4f8a34'), folha2 = T('#3d7028');
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * Math.PI * 2, f = new THREE.Group(); f.position.y = h; f.rotation.y = a;
      const lam = m(new THREE.ConeGeometry(0.75, 3.6, 4), i % 2 ? folha : folha2, 1.6, 0.3, 0); lam.rotation.z = -1.25 - Math.random() * 0.3; lam.scale.z = 0.25; f.add(lam); g.add(f);
    }
    g.add(m(esfera, T('#7a3a1e'), 0, h - 0.4, 0, 0.6, 0.5, 0.6));
    return g;
  }
  // casa modernista sobre pilotis
  function casa(cor) {
    const g = new THREE.Group(), branco = T('#f4f1ea'), concreto = T('#cfc8bb');
    for (let i = 0; i < 6; i++) g.add(m(cil(0.18, 0.18, 2.6, 8), concreto, -3.3 + (i % 3) * 3.3, 1.3, i < 3 ? -2.2 : 2.2));
    g.add(m(new THREE.BoxGeometry(8.6, 2.6, 5.4), branco, 0, 3.9, 0));
    g.add(m(new THREE.BoxGeometry(8.8, 0.25, 5.6), concreto, 0, 5.3, 0));
    g.add(m(new THREE.BoxGeometry(8.2, 0.9, 0.08), T('#2b3a44'), 0, 4.0, 2.72));
    for (let i = 0; i < 6; i++) g.add(m(new THREE.BoxGeometry(1.1, 0.9, 0.06), T(cor), -3.4 + i * 1.36, 4.0, 2.77, 0.92, 0.9, 1));
    g.add(m(new THREE.BoxGeometry(1.6, 2.6, 1.6), T(cor), 2.6, 1.3, 0.6));
    return g;
  }
  // pavilhão curvo da praça central da Base
  function pavilhao() {
    const g = new THREE.Group(), branco = T('#f7f4ee');
    const arco = m(new THREE.TorusGeometry(6, 0.45, 8, 30, Math.PI), branco, 0, 0, 0); g.add(arco);
    const arco2 = m(new THREE.TorusGeometry(6, 0.45, 8, 30, Math.PI), branco, 0, 0, -5); g.add(arco2);
    const teto = m(new THREE.CylinderGeometry(6, 6, 5, 30, 1, true, -Math.PI / 2, Math.PI), T('#ece6da', { side: THREE.DoubleSide }), 0, 0, -2.5); teto.rotation.x = Math.PI / 2; g.add(teto);
    return g;
  }
  // muro de cobogó (com lâmpada) para a lagartixa
  function muro() {
    const g = new THREE.Group(), c = T('#e9dfcf');
    g.add(m(new THREE.BoxGeometry(6, 2.6, 0.35), c, 0, 1.3, 0));
    for (let i = 0; i < 5; i++) for (let j = 0; j < 2; j++) g.add(m(new THREE.BoxGeometry(0.6, 0.6, 0.4), T('#c9bba3'), -2 + i, 1.2 + j * 0.8, 0.02));
    return g;
  }

  // retrato do bicho para a BioDex: desenha o modelo 3D numa tela pequena e guarda a imagem
  const retratos = {};
  function retrato(forma, cor) {
    const k = forma + cor; if (retratos[k]) return retratos[k];
    try {
      const W = 256, r = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
      r.setSize(W, W); r.outputEncoding = THREE.sRGBEncoding; r.toneMapping = THREE.ACESFilmicToneMapping;
      const cena = new THREE.Scene(), cam = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
      cena.add(new THREE.HemisphereLight('#ffffff', '#8a7a5a', 1.1)); const sol = new THREE.DirectionalLight('#fff4dd', 1.6); sol.position.set(2, 4, 3); cena.add(sol);
      const g = bicho(forma, cor); g.rotation.set(forma === 'borboleta' ? 0.95 : 0.35, -0.6, 0); if (g.userData.animar) g.userData.animar(forma === 'borboleta' ? -0.157 : 0.6, false); cena.add(g);
      const caixa = new THREE.Box3().setFromObject(g), c = caixa.getCenter(new V3()), t = caixa.getSize(new V3()).length();
      cam.position.set(c.x, c.y + t * 0.25, c.z + t * 1.75); cam.lookAt(c);
      r.render(cena, cam); retratos[k] = r.domElement.toDataURL('image/png');
      r.dispose(); if (r.forceContextLoss) r.forceContextLoss();
    } catch (e) { retratos[k] = null; }
    return retratos[k];
  }

  return { T, B, juntar, M4, pessoa, bicho, retrato, troncoTorto, copaGeo, tufo, buriti, casa, pavilhao, muro, grad };
})();
