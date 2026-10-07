/* =====================================================================
   modelos/aranha.js — aranha-de-teia-dourada (Trichonephila clavipes)
   Fêmea grande no centro da teia e o macho pequenininho por perto.
   Ações: andar na teia, descer pelo fio, tremer a teia.
   Corpo por SDF + marching cubes; pernas com cinemática (js/core3d.js).
   ===================================================================== */
(function () {
  const S = {};
  const HUB = new V3(0, 125, 0);

  function sdfCorpo(x, y, z) {
    const cef = ell(x, y, z, 6, 3.6, 0, 5.4, 2.9, 4.2);
    const ped = ell(x, y, z, 0.2, 3.6, 0, 1.6, 1.2, 1.2);
    const abd = ell(x, y, z, -12.5, 4.8, 0, 13, 4.7, 4.3);
    let d = smin(cef, ped, 1.2);
    d = smin(d, abd, 1.4);
    return d + fbm3(x * 0.9, y * 0.9, z * 0.9) * 0.05;
  }
  const _c1 = new THREE.Color(), _c2 = new THREE.Color();
  function mix(c, a, b, t) { c.copy(_c1.set(a)).lerp(_c2.set(b), clamp(t, 0, 1)); }
  function cor(x, y, z, n, c) {
    if (x > 0.8) {                                   // cefalotórax prateado com borda escura
      if (n.y < -0.2) { c.set('#2a2118'); return; }
      mix(c, '#dcd6c2', '#3b3024', smooth(Math.abs(z), 2.6, 3.8));
      return;
    }
    if (n.y < -0.25) { mix(c, '#2f2519', '#d9b844', smooth(Math.sin(x * 1.3), 0.6, 0.9) * smooth(1.8 - Math.abs(z), 0, 0.6)); return; }
    // costas oliva-amareladas, laterais escuras e duas fileiras de pintas claras
    mix(c, '#bba660', '#6b5530', smooth(Math.abs(z), 2.6, 3.8));
    const pinta = smooth(0.9 - Math.abs(Math.abs(z) - 1.9), 0, 0.35) * smooth(Math.sin((x + 30) * 0.95), 0.5, 0.75);
    if (pinta > 0) c.lerp(_c2.set('#f5efd8'), pinta);
  }
  function perna(C, F, L, mats) {
    const leg = { C, L, s: Math.sign(C.z) };
    leg.troch = segGroup(0.35, 0.9, 0.8, { mat: mats.f, joint: false });
    leg.femur = segGroup(L.f, 0.85, 0.65, { mat: mats.f, jointMat: mats.j, bulge: 0.1, hairMat: mats.pelo, hairDensity: 3, hairLen: 0.8 });
    leg.tibia = segGroup(L.t, 0.62, 0.45, { mat: mats.t, jointMat: mats.j, bulge: 0.15, hairMat: mats.tufo, hairDensity: L.tufo ? 9 : 2, hairLen: L.tufo ? 1.6 : 0.6 });
    leg.tarsus = segGroup(L.ta, 0.42, 0.18, { mat: mats.f, jointMat: mats.j, bulge: 0.05 });
    leg.F = F.clone(); leg.F0 = F.clone();
    solveLeg(leg, leg.F);
    return leg;
  }

  function montarAranha(cell, mCorpo, mats) {
    const g = new THREE.Group();
    g.add(sdfMesh(sdfCorpo, new V3(-27, 0.5, -6), new V3(12.5, 9.5, 6), cell, cor, mCorpo));
    const mOlho = new THREE.MeshPhysicalMaterial({ color: '#0d0d10', roughness: 0.1, clearcoat: 1 });
    const olhos = [];
    [[10.6, 5.2, 0.9, 0.55], [10.6, 5.2, -0.9, 0.55], [10.1, 5.9, 0.5, 0.45], [10.1, 5.9, -0.5, 0.45], [9.6, 5.6, 2.1, 0.42], [9.6, 5.6, -2.1, 0.42], [9.2, 6.0, 1.9, 0.38], [9.2, 6.0, -1.9, 0.38]]
      .forEach((p) => { const o = new THREE.Mesh(new THREE.SphereGeometry(p[3], 12, 8), mOlho); o.position.set(p[0], p[1], p[2]); g.add(o); olhos.push(o); });
    const mQuel = new THREE.MeshPhysicalMaterial({ color: '#2a1d12', roughness: 0.35, clearcoat: 0.6 });
    const quel = [1, -1].map((s) => { const q = segGroup(2.6, 0.9, 0.4, { mat: mQuel, joint: false }); place(q, new V3(10.5, 3.6, s * 0.9), new V3(12, 1.4, s * 0.8)); g.add(q); return q; });
    const palpos = [1, -1].map((s) => {
      const a = segGroup(3.2, 0.42, 0.35, { mat: mats.f, jointMat: mats.j }); place(a, new V3(10.4, 3, s * 2), new V3(12.8, 4.5, s * 3)); g.add(a);
      const b = segGroup(3, 0.35, 0.28, { mat: mats.t, jointMat: mats.j }); place(b, new V3(12.8, 4.5, s * 3), new V3(15, 2.2, s * 3.4)); g.add(b);
      return b;
    });
    const fiand = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.6, 10), mQuel); fiand.position.set(-25.6, 4.2, 0); fiand.rotation.z = Math.PI / 2; g.add(fiand);
    // 4 pares de pernas: I e II para a frente, III curta, IV para trás. Tufos de pelos nas I, II e IV.
    const pernas = [];
    [1, -1].forEach((s) => {
      pernas.push(perna(new V3(8.5, 2.6, s * 2.6), new V3(44, 0, s * 15), { f: 15, t: 16, ta: 21, tufo: true }, mats));
      pernas.push(perna(new V3(7, 2.4, s * 3.4), new V3(28, 0, s * 33), { f: 13, t: 14, ta: 17, tufo: true }, mats));
      pernas.push(perna(new V3(5.2, 2.4, s * 3.6), new V3(2, 0, s * 22), { f: 8, t: 8, ta: 9 }, mats));
      pernas.push(perna(new V3(3.5, 2.4, s * 3.2), new V3(-30, 0, s * 20), { f: 13, t: 13, ta: 17, tufo: true }, mats));
    });
    pernas.forEach((l) => ['troch', 'femur', 'tibia', 'tarsus'].forEach((k) => g.add(l[k])));
    return { g, pernas, olhos, quel, palpos, fiand };
  }

  /* ---------- teia dourada ---------- */
  function montarTeia() {
    const R = 100, N = 30, raios = [], pts = [];
    for (let i = 0; i < N; i++) {
      const a = i / N * Math.PI * 2 + (Math.random() - 0.5) * 0.06;
      const r = R * (1 + 0.35 * Math.max(0, -Math.sin(a))) * (0.9 + Math.random() * 0.12);    // mais comprida para baixo
      raios.push({ a, r });
      pts.push(0, 0, 0, Math.cos(a) * r, Math.sin(a) * r, 0);
    }
    // espiral de captura (fios dourados ligando os raios)
    for (let rr = 12; rr < R * 1.3; rr += 4) {
      for (let i = 0; i < N; i++) {
        const A = raios[i], B = raios[(i + 1) % N];
        const ra = Math.min(rr + i / N * 4, A.r - 3), rb = Math.min(rr + (i + 1) / N * 4, B.r - 3);
        if (ra <= 10 || rb <= 10) continue;
        pts.push(Math.cos(A.a) * ra, Math.sin(A.a) * ra, 0, Math.cos(B.a) * rb, Math.sin(B.a) * rb, 0);
      }
    }
    // moldura e fios de sustentação até os galhos
    for (let i = 0; i < N; i++) { const A = raios[i], B = raios[(i + 1) % N]; pts.push(Math.cos(A.a) * A.r, Math.sin(A.a) * A.r, 0, Math.cos(B.a) * B.r, Math.sin(B.a) * B.r, 0); }
    [[-1, 0.3], [1, 0.4], [-1, -0.7], [1, -0.9]].forEach(([sx, sy]) => pts.push(sx * R * 0.9, sy * R, 0, sx * 175, sy * R + 40, 0));
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const fios = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: '#ffd84f', transparent: true, opacity: 0.92 }));
    fios.userData.base = Float32Array.from(pts);
    return fios;
  }
  function galho(de, ate, mat) {
    const g = shadowy(new THREE.Mesh(new THREE.CylinderGeometry(2.6, 4, de.distanceTo(ate), 8), mat));
    place(g, de, ate); g.position.copy(de).lerp(ate, 0.5);
    g.quaternion.setFromUnitVectors(UP, new V3().subVectors(ate, de).normalize());
    return g;
  }

  function construir(ctx) {
    const cell = ctx.MOBILE ? 0.55 : 0.42;
    const mCorpo = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.45, clearcoat: 0.5, clearcoatRoughness: 0.35, envMapIntensity: 0.6 });
    addCuticle(mCorpo, 0.18, 0.5);
    const mats = {
      f: new THREE.MeshPhysicalMaterial({ color: '#5a3a1c', roughness: 0.45, clearcoat: 0.4 }),
      t: new THREE.MeshPhysicalMaterial({ color: '#1e150d', roughness: 0.45, clearcoat: 0.4 }),
      j: new THREE.MeshPhysicalMaterial({ color: '#e0a82a', roughness: 0.4, clearcoat: 0.5 }),    // anéis amarelos nas juntas
      pelo: new THREE.MeshStandardMaterial({ color: '#3a2a1a', roughness: 0.8 }),
      tufo: new THREE.MeshStandardMaterial({ color: '#0e0b08', roughness: 0.9 })
    };
    const raiz = new THREE.Group(); ctx.scene.add(raiz);
    const teia = montarTeia(); teia.position.copy(HUB); raiz.add(teia);
    const mGalho = new THREE.MeshStandardMaterial({ color: '#5b4128', roughness: 0.9 });
    raiz.add(galho(new V3(-175, 0, 0), new V3(-175, 260, 0), mGalho), galho(new V3(175, 0, 0), new V3(175, 280, 0), mGalho));

    // fêmea: costas viradas para a câmera, cabeça para baixo (como fica na teia)
    const base = new THREE.Matrix4().makeBasis(new V3(0, -1, 0), new V3(0, 0, 1), new V3(-1, 0, 0));
    const fem = montarAranha(cell, mCorpo, mats);
    const femea = new THREE.Group(); femea.add(fem.g); femea.quaternion.setFromRotationMatrix(base); femea.position.copy(HUB).add(new V3(0, 8, 0.6));
    raiz.add(femea);
    // macho: bem menor e mais escuro, perto do centro
    const mCorpoM = mCorpo.clone(); mCorpoM.color = new THREE.Color('#8a7a60');
    const mac = montarAranha(cell * 0.6, mCorpoM, mats);
    const macho = new THREE.Group(); macho.add(mac.g); macho.scale.setScalar(0.24);
    macho.quaternion.setFromRotationMatrix(base).multiply(new THREE.Quaternion().setFromAxisAngle(UP, 0.6));
    macho.position.copy(HUB).add(new V3(14, 30, 0.4));
    raiz.add(macho);
    // fio de seda para descer
    const fioGeo = new THREE.BufferGeometry().setFromPoints([new V3(), new V3()]);
    const fio = new THREE.Line(fioGeo, new THREE.LineBasicMaterial({ color: '#fff6d0' })); fio.visible = false; raiz.add(fio);

    Object.assign(S, { raiz, teia, fem, femea, mac, macho, fio, pos0: femea.position.clone(), andar: 0, descer: 0, tremer: 0, fase: 'parada' });
    return { grupo: raiz, raio: 62, centro: HUB.clone().add(new V3(0, 2, 0)) };
  }

  function andar(ctx, b) {
    if (S.descer > 0) return;
    S.andar = S.andar > 0 ? 0 : 0.001;
    if (b) b.classList.toggle('on', S.andar > 0);
  }
  function descer(ctx, b) {
    if (S.descer > 0) return;
    S.andar = 0; ctx.marcar('andar', false);
    S.descer = 0.001; if (b) b.classList.add('on');
    ctx.aviso('Ela solta um fio de seda e desce!');
  }
  function tremer(ctx) { S.tremer = 1.4; ctx.aviso('A aranha sente a teia tremer!'); }

  const _q = new V3();
  function update(dt, t, ctx) {
    if (!S.raiz) return;
    // teia tremendo
    if (S.tremer > 0) {
      S.tremer -= dt;
      const p = S.teia.geometry.attributes.position, b0 = S.teia.userData.base, k = Math.max(0, S.tremer) * 1.6;
      for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin(t * 28 + b0[i * 3] * 0.05 + b0[i * 3 + 1] * 0.04) * k * Math.min(1, Math.hypot(b0[i * 3], b0[i * 3 + 1]) / 40));
      p.needsUpdate = true;
      if (S.tremer <= 0) { for (let i = 0; i < p.count; i++) p.setZ(i, 0); p.needsUpdate = true; }
    }
    // andar: desce por um raio da teia e volta
    let passo = 0;
    if (S.andar > 0) {
      S.andar += dt;
      const k = Math.sin(Math.min(1, S.andar / 6) * Math.PI);       // vai e volta em 6 s
      S.femea.position.copy(S.pos0).add(new V3(0, -42 * k, 0));
      passo = S.andar < 6 ? 1 : 0;
      if (S.andar >= 6) { S.andar = 0; ctx.marcar('andar', false); S.femea.position.copy(S.pos0); }
    }
    // descer pelo fio: cai devagar, balança e sobe de volta
    if (S.descer > 0) {
      S.descer += dt;
      const d = S.descer, k = d < 3 ? smooth(d, 0, 3) : d < 5 ? 1 : 1 - smooth(d, 5, 9);
      S.femea.position.copy(S.pos0).add(new V3(Math.sin(d * 1.8) * 4 * k, -80 * k, 10 * k));
      S.femea.rotation.z = 0;
      S.fio.visible = true;
      const a = S.fio.geometry.attributes.position;
      a.setXYZ(0, S.pos0.x, S.pos0.y + 22, S.pos0.z + 0.5);
      S.fem.fiand.getWorldPosition(_q); a.setXYZ(1, _q.x, _q.y, _q.z); a.needsUpdate = true;
      passo = d > 5 ? 0.6 : 0.15;
      if (d >= 9) { S.descer = 0; S.fio.visible = false; S.femea.position.copy(S.pos0); ctx.marcar('descer', false); }
    }
    // pernas: passos alternados quando anda; respiração leve parada
    S.fem.pernas.forEach((l, i) => {
      const fase = t * 7 + (i % 4) * Math.PI / 2 + (l.s > 0 ? 0 : Math.PI);
      l.F.copy(l.F0);
      if (passo) { l.F.x += Math.sin(fase) * 3.5 * passo; l.F.y = Math.max(0, Math.cos(fase)) * 2.5 * passo; }
      else l.F.y = Math.max(0, Math.sin(t * 0.8 + i)) * 0.3;
      solveLeg(l, l.F);
    });
    S.fem.palpos.forEach((p, i) => { p.rotation.x += Math.sin(t * 3 + i) * 0.003; });
  }

  Modelos3D.aranha = {
    cena: 'teia',
    formas: [{ id: 'femea', nome: 'Fêmea' }, { id: 'macho', nome: 'Macho' }],
    acoes: [
      { id: 'andar', ico: '🕷️', rotulo: 'Andar', fn: andar },
      { id: 'descer', ico: '🧵', rotulo: 'Descer no fio', fn: descer },
      { id: 'tremer', ico: '🕸️', rotulo: 'Tremer a teia', fn: tremer }
    ],
    construir,
    update,
    toque: tremer,
    forma(id, ctx) {
      if (id === 'macho') { ctx.foco(S.macho.position.clone(), 14); ctx.aviso('O macho é pequenininho perto da fêmea!'); }
      else ctx.foco(HUB.clone().add(new V3(0, 2, 0)), 62);
    },
    partes: [
      { nome: 'Olhos', texto: 'Oito olhinhos na frente da cabeça. Mesmo assim, ela enxerga pouco: sente tudo pela teia.', ponto: () => S.fem.olhos[0].getWorldPosition(new V3()).add(new V3(0, 0, 3)) },
      { nome: 'Quelíceras', texto: 'As "presas", que seguram e picam os insetos presos.', ponto: () => S.fem.quel[0].getWorldPosition(new V3()).add(new V3(4, -4, 3)) },
      { nome: 'Pedipalpos', texto: 'Dois "bracinhos" perto da boca, que ajudam a segurar a comida.', ponto: () => S.fem.palpos[0].getWorldPosition(new V3()).add(new V3(-3, -3, 3)) },
      { nome: 'Cefalotórax', texto: 'Cabeça e tórax juntos numa peça só. É onde ficam presas as 8 patas.', ponto: () => S.femea.localToWorld(new V3(6, 7, 0)) },
      { nome: 'Abdômen', texto: 'A parte comprida de trás, com pintas claras. Guarda a seda.', ponto: () => S.femea.localToWorld(new V3(-13, 10, 0)) },
      { nome: 'Fiandeiras', texto: 'Na ponta da barriga: é por aqui que sai o fio de seda.', ponto: () => S.fem.fiand.getWorldPosition(new V3()).add(new V3(0, 3, 3)) },
      { nome: 'Patas', texto: 'Oito patas compridas, com anéis amarelos e tufos de pelos pretos.', ponto: () => S.fem.pernas[0].tibia.getWorldPosition(new V3()).add(new V3(0, 0, 6)) }
    ]
  };
})();
