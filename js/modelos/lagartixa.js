/* =====================================================================
   modelos/lagartixa.js — lagartixa-de-parede (Hemidactylus mabouia)
   Ações: andar, subir na parede, soltar a cauda (autotomia, e nasce outra)
   e lamber o olho (ela não tem pálpebras).
   Corpo por SDF + marching cubes; cauda em cadeia de segmentos; patas
   com cinemática (js/core3d.js). Unidades = mm. X para a frente, Y para cima.
   ===================================================================== */
(function () {
  const S = {};
  const PAREDE_Z = -93;                 // frente da parede (a câmera fica do lado +z)
  const N_CAUDA = 14, FRATURA = 3;      // segmentos da cauda; a cauda solta a partir do 4º

  /* ---------- corpo por SDF ---------- */
  function sdfLag(x, y, z) {
    const tronco = ell(x, y, z, 15, 4.6, 0, 19, 4.1, 7);
    const ombro = ell(x, y, z, 28, 4.8, 0, 6, 3.7, 6);
    const pescoco = ell(x, y, z, 33, 5.3, 0, 5, 3.6, 4.8);
    const cab = ell(x, y, z, 41, 5.8, 0, 8.6, 4.2, 6.3);
    const focinho = ell(x, y, z, 48.5, 5.1, 0, 5.2, 2.8, 3.8);
    const quadril = ell(x, y, z, -1, 4.4, 0, 6, 3.6, 5.6);
    const baseCauda = cone(x, y, z, 0, 4.4, 0, -7.5, 4.2, 0, 4.4, 3.4);
    let d = smin(tronco, ombro, 3);
    d = smin(d, pescoco, 2.5); d = smin(d, cab, 2.5); d = smin(d, focinho, 2.5);
    d = smin(d, quadril, 3); d = smin(d, baseCauda, 2);
    d = smax(d, -(y - 1.1), 1.0);                                         // barriga achatada
    // tubérculos (carocinhos) nas costas
    const tub = Math.max(0, Math.sin(x * 1.7) * Math.sin(z * 2.1 + 0.5));
    d -= 0.28 * smooth(tub, 0.75, 1) * smooth(y, 5.5, 8) * (1 - smooth(x, 30, 36));
    return d + fbm3(x * 0.8, y * 0.8, z * 0.8) * 0.04;
  }
  const _c1 = new THREE.Color(), _c2 = new THREE.Color();
  function mix(c, a, b, t) { c.copy(_c1.set(a)).lerp(_c2.set(b), clamp(t, 0, 1)); }
  function cor(x, y, z, n, c) {
    if (n.y < -0.35 || y < 2) { c.set('#b3a487'); return; }                        // barriga clara
    const manchas = smooth(fbm3(x * 0.35 + 7, y * 0.35, z * 0.35), 0.5, 0.68);
    if (x > 33) {                                                                    // cabeça com faixa escura no olho
      mix(c, '#6f5e46', '#3f3224', manchas * 0.7);
      const faixa = smooth(1 - Math.abs(y - 6.6) / 0.9, 0, 1) * smooth(Math.abs(z), 3.8, 5.2) * smooth(x, 36, 40);
      c.lerp(_c2.set('#2a2018'), faixa * 0.6);
      return;
    }
    const lado = smooth(Math.abs(z), 4.5, 6.8);
    mix(c, '#66553e', '#8e7c5e', lado * 0.6);
    const banda = smooth(Math.sin(x * 0.42 + 1.2), 0.55, 0.92) * (1 - lado * 0.7);  // faixas escuras atravessadas
    c.lerp(_c2.set('#30261b'), Math.max(banda * 0.8, manchas * 0.35));
  }

  /* ---------- cauda: cadeia de segmentos (pode soltar e crescer de novo) ---------- */
  const R0 = 3.4, LSEG = 4.0;
  const raioCauda = (k) => 0.35 + R0 * Math.pow(1 - k / N_CAUDA, 0.85);
  function segCauda(k, mat, nova) {
    const g = new THREE.Group();
    const r1 = raioCauda(k), r2 = raioCauda(k + 1);
    const geo = new THREE.CylinderGeometry(r2, r1, LSEG, 14); geo.translate(0, LSEG / 2, 0); geo.rotateZ(Math.PI / 2);   // de 0 até -LSEG em x
    const m = shadowy(new THREE.Mesh(geo, mat)); m.scale.y = 0.85; g.add(m);
    const j = shadowy(new THREE.Mesh(new THREE.SphereGeometry(r1, 14, 10), mat)); j.scale.y = 0.85; g.add(j);
    g.userData.k = k; g.userData.nova = nova;
    return g;
  }
  // monta a cauda do segmento k0 até o fim; devolve o primeiro grupo (os outros ficam dentro, em cadeia)
  function cadeia(k0, mats, nova) {
    let raiz = null, ant = null;
    const segs = [];
    for (let k = k0; k < N_CAUDA; k++) {
      const mat = nova ? mats.nova : (k % 2 ? mats.faixa : mats.cauda);
      const sg = segCauda(k, mat, nova);
      if (ant) { sg.position.x = -LSEG; ant.add(sg); } else raiz = sg;
      segs.push(sg); ant = sg;
    }
    raiz.userData.segs = segs;
    return raiz;
  }

  /* ---------- patas e dedos com almofadinhas ---------- */
  function perna(C, F, L, raios, mats) {
    const leg = { C, L, s: Math.sign(C.z) };
    leg.troch = segGroup(0.35, raios[0], raios[0], { mat: mats.pele, joint: false });
    leg.femur = segGroup(L.f, raios[0], raios[1], { mat: mats.pele, jointMat: mats.pele, bulge: 0.15 });
    leg.tibia = segGroup(L.t, raios[1], raios[2], { mat: mats.pele, jointMat: mats.pele, bulge: 0.1 });
    leg.tarsus = segGroup(L.ta, raios[2], raios[2] * 0.9, { mat: mats.pele, jointMat: mats.pele, bulge: 0 });
    leg.F = F.clone(); leg.F0 = F.clone();
    // mão/pé: 5 dedos abertos em leque, com almofadinha embaixo
    leg.pe = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const dedo = new THREE.Group(); dedo.rotation.y = (i - 2) * 0.42;
      const almo = shadowy(new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), mats.dedo));
      almo.scale.set(1.7, 0.38, 0.62); almo.position.set(1.9, 0.38, 0); dedo.add(almo);
      const unha = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.7, 6), mats.unha); unha.rotation.z = -Math.PI / 2; unha.position.set(3.8, 0.4, 0); dedo.add(unha);
      leg.pe.add(dedo);
    }
    solveLeg(leg, leg.F); poePe(leg);
    return leg;
  }
  function poePe(leg) {
    leg.pe.position.copy(leg.F);
    leg.pe.rotation.y = Math.atan2(-(leg.F.z - leg.C.z), leg.F.x - leg.C.x);      // dedos abertos na direção da pata
  }

  function construir(ctx) {
    const cell = ctx.MOBILE ? 0.6 : 0.45;
    const mCorpo = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.55, clearcoat: 0.25, clearcoatRoughness: 0.5, envMapIntensity: 0.5 });
    addCuticle(mCorpo, 0.1, 0.18);
    const mats = {
      pele: new THREE.MeshPhysicalMaterial({ color: '#66553f', roughness: 0.6, clearcoat: 0.2 }),
      dedo: new THREE.MeshPhysicalMaterial({ color: '#857559', roughness: 0.55 }),
      unha: new THREE.MeshStandardMaterial({ color: '#4a3a2a', roughness: 0.5 }),
      cauda: new THREE.MeshPhysicalMaterial({ color: '#66553f', roughness: 0.55, clearcoat: 0.2 }),
      faixa: new THREE.MeshPhysicalMaterial({ color: '#30261b', roughness: 0.55, clearcoat: 0.2 }),
      nova: new THREE.MeshPhysicalMaterial({ color: '#4a3d2e', roughness: 0.5, clearcoat: 0.3 })     // cauda regenerada: lisa e sem faixas
    };
    addCuticle(mats.cauda, 0.1, 0.2); addCuticle(mats.faixa, 0.1, 0.2);
    S.mats = mats;
    const raiz = new THREE.Group(); ctx.scene.add(raiz);

    // parede de reboco ao fundo, para ela subir
    const parede = shadowy(new THREE.Mesh(new THREE.BoxGeometry(260, 170, 6), new THREE.MeshStandardMaterial({ color: '#e9e2d3', roughness: 0.95 })));
    parede.position.set(0, 85, PAREDE_Z - 3); raiz.add(parede);
    const rodape = shadowy(new THREE.Mesh(new THREE.BoxGeometry(260, 8, 2), new THREE.MeshStandardMaterial({ color: '#b9a98f', roughness: 0.9 })));
    rodape.position.set(0, 4, PAREDE_Z + 1); raiz.add(rodape);

    const lz = new THREE.Group(); raiz.add(lz);          // lagartixa inteira (posição e direção)
    const corpo = new THREE.Group(); lz.add(corpo);      // ondula de lado ao andar
    S.casca = sdfMesh(sdfLag, new V3(-9, 0.5, -8), new V3(55, 11, 8), cell, cor, mCorpo);
    corpo.add(S.casca);

    // olhos grandes, sem pálpebra, com pupila em fenda vertical
    const mOlho = new THREE.MeshPhysicalMaterial({ color: '#6b5226', roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.05 });
    const mPupila = new THREE.MeshBasicMaterial({ color: '#0b0906' });
    S.olhos = [1, -1].map((s) => {
      const o = new THREE.Group(); o.position.set(43.6, 7.2, s * 4.7); corpo.add(o);
      const bola = shadowy(new THREE.Mesh(new THREE.SphereGeometry(2.35, 24, 16), mOlho)); o.add(bola);
      const pup = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), mPupila); pup.scale.set(0.22, 1.25, 0.2); pup.position.set(0.4, 0, s * 2.2); o.add(pup);
      o.userData.s = s; return o;
    });
    // narinas, ouvidos e boca
    const mEscuro = new THREE.MeshBasicMaterial({ color: '#2b2016' });
    [1, -1].forEach((s) => {
      const nar = new THREE.Mesh(new THREE.SphereGeometry(0.42, 8, 6), mEscuro); nar.position.set(52.6, 6.2, s * 1.6); corpo.add(nar);
      const ouv = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), mEscuro); ouv.scale.set(0.9, 0.7, 0.25); ouv.position.set(36.2, 6.3, s * 5.55); corpo.add(ouv);
      const boca = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new V3(53.2, 4.6, 0), new V3(50, 4.4, s * 2.9), new V3(44, 4.5, s * 5), new V3(38.5, 5, s * 5.4)]), 20, 0.18, 6), mEscuro);
      corpo.add(boca);
    });
    // língua (para lamber o olho)
    S.mLingua = new THREE.MeshPhysicalMaterial({ color: '#e07f86', roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.2 });
    S.lingua = shadowy(new THREE.Mesh(new THREE.BufferGeometry(), S.mLingua));
    S.lingua.visible = false; corpo.add(S.lingua);

    // patas: dianteiras e traseiras, abertas para os lados
    S.pernas = [];
    [1, -1].forEach((s) => {
      S.pernas.push(perna(new V3(28.5, 4, s * 5.6), new V3(35, 0, s * 15.5), { f: 7, t: 6.5, ta: 2.6 }, [1.5, 1.15, 0.85], mats));
      S.pernas.push(perna(new V3(1.5, 4, s * 5.2), new V3(-3, 0, s * 17), { f: 8.5, t: 7.5, ta: 3 }, [1.7, 1.25, 0.9], mats));
    });
    S.pernas.forEach((l) => ['troch', 'femur', 'tibia', 'tarsus', 'pe'].forEach((k) => corpo.add(l[k])));
    // trote: dianteira esquerda com traseira direita, e vice-versa
    S.pernas.forEach((l) => { l.fase = (l.C.x > 15) === (l.s > 0) ? 0 : Math.PI; });

    // cauda: base fixa (3 segmentos) + parte que pode soltar
    const base = cadeia(0, mats, false);
    base.position.set(-7.5, 4.2, 0); corpo.add(base);
    S.base = base;
    S.juntaFratura = base.userData.segs[FRATURA - 1];
    S.caudaPresa = base.userData.segs[FRATURA];          // primeiro segmento que solta (já está na cadeia)
    S.soltas = [];

    Object.assign(S, { raiz, lz, corpo, parede, andar: 0, subir: 0, lamber: 0, rege: 0, aPasso: 0 });
    S.ctx = ctx; window.__lagartixa = S;     // para testes
    ctx.seguir = null;
    return { grupo: raiz, raio: 60, centro: new V3(-4, 6, 0) };
  }

  /* ---------- ações ---------- */
  function andar(ctx, b) {
    if (S.subir > 0 || S.fuga > 0) return;
    S.andar = S.andar > 0 ? 0 : 0.001;
    if (!S.andar) { S.lz.position.set(0, 0, 0); S.lz.rotation.set(0, 0, 0); S.arco = 0; }
    ctx.seguir = S.andar ? S.lz : null;
    if (b) b.classList.toggle('on', S.andar > 0);
  }
  function subir(ctx, b) {
    if (S.subir > 0 || S.fuga > 0) return;
    if (S.andar > 0) andar(ctx, document.querySelector('.acao[data-id="andar"]'));
    S.subir = 0.001; if (b) b.classList.add('on');
    ctx.seguir = S.lz;
    ctx.aviso('Ela sobe na parede sem cola nenhuma!');
  }
  function soltar(ctx) {
    if (S.subir > 0 || (S.rege > 0 && S.rege < 9)) return;   // espera descer da parede e a cauda nova crescer
    // a parte de trás da cauda vai para o chão e fica se mexendo
    const solta = S.caudaPresa;
    solta.updateMatrixWorld(true);
    S.raiz.attach(solta);
    solta.userData.t = 0;
    solta.userData.segs = solta.userData.segs || coletar(solta);
    solta.traverse((o) => { if (o.isMesh) { o.material = o.material.clone(); o.material.transparent = true; } });
    S.soltas.push(solta);
    // nasce uma cauda nova (regenerada), bem pequenininha
    const nova = cadeia(FRATURA, S.mats, true);
    nova.position.x = -LSEG; nova.scale.setScalar(0.01);
    S.juntaFratura.add(nova);
    S.caudaPresa = nova;
    S.rege = 0.001;
    if (S.andar <= 0) S.fuga = 0.001;                      // corre um pouco para longe da cauda
    ctx.aviso('A cauda solta e fica se mexendo para distrair o predador. Depois nasce outra!');
  }
  function coletar(g) { const l = []; let x = g; while (x) { l.push(x); x = x.children.find((c) => c.isGroup); } return l; }
  function lamber(ctx) { if (S.lamber <= 0) { S.lamber = 0.001; S.olhoLambido = S.olhoLambido === 1 ? -1 : 1; ctx.aviso('Sem pálpebras, ela limpa os olhos com a língua!'); } }

  /* ---------- animação ---------- */
  const qChao = new THREE.Quaternion(), qVira = new THREE.Quaternion().setFromAxisAngle(UP, Math.PI / 2);
  const qParede = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(new V3(0, 1, 0), new V3(0, 0, 1), new V3(1, 0, 0)));
  const pIni = new V3(0, 0, -36), pParede0 = new V3(0, 66, PAREDE_Z), pParede1 = new V3(0, 110, PAREDE_Z);
  // passagem do chão para a parede: a cabeça não entra na parede e a cauda não entra no chão
  function curva(lz, k) {
    const th = k * Math.PI / 2;
    lz.quaternion.slerpQuaternions(qVira, qParede, k);
    lz.position.set(0, 66 * Math.sin(th), PAREDE_Z + 57 * Math.cos(th));
  }
  function update(dt, t, ctx) {
    if (!S.raiz) return;
    let passo = 0;
    // andar em círculo e voltar ao lugar
    if (S.andar > 0) {
      S.andar += dt;
      // corridinha 1,1 s, parada 0,7 s (lagartixa anda aos arranques)
      const ciclo = S.andar % 1.8, correndo = ciclo < 1.1;
      passo = correndo ? Math.min(1, ciclo / 0.15, (1.1 - ciclo) / 0.15) : 0;
      const R = 22, v = 2 * 4 * 9 / Math.PI;                    // mm/s: o pé no chão anda para trás na mesma velocidade
      S.arco = (S.arco || 0) + passo * v * dt / R;
      const a = Math.min(S.arco, Math.PI * 2);
      S.lz.position.set(R * Math.sin(a), 0, -R + R * Math.cos(a));
      S.lz.rotation.y = a;
      if (S.arco >= Math.PI * 2) { S.arco = 0; andar(ctx, document.querySelector('.acao[data-id="andar"]')); }
    }
    // subir na parede: vira, anda até a parede, sobe, espera e volta
    if (S.subir > 0) {
      S.subir += dt;
      const u = S.subir, lz = S.lz;
      if (u < 1.2) { lz.quaternion.slerpQuaternions(qChao, qVira, smooth(u, 0, 1.2)); passo = 0.5; }
      else if (u < 4) { lz.quaternion.copy(qVira); lz.position.lerpVectors(new V3(), pIni, smooth(u, 1.2, 4)); passo = 1; }
      else if (u < 5.2) { curva(lz, smooth(u, 4, 5.2)); passo = 0.6; }
      else if (u < 9) { lz.quaternion.copy(qParede); lz.position.lerpVectors(pParede0, pParede1, smooth(u, 5.2, 9)); passo = 1; }
      else if (u < 11) { passo = 0; }
      else if (u < 14) { lz.position.lerpVectors(pParede1, pParede0, smooth(u, 11, 14)); passo = 1; }
      else if (u < 15.2) { curva(lz, 1 - smooth(u, 14, 15.2)); passo = 0.6; }
      else if (u < 18) { lz.quaternion.copy(qVira); lz.position.lerpVectors(pIni, new V3(), smooth(u, 15.2, 18)); passo = 1; }
      else if (u < 19.2) { lz.quaternion.slerpQuaternions(qVira, qChao, smooth(u, 18, 19.2)); passo = 0.5; }
      else { S.subir = 0; lz.quaternion.copy(qChao); lz.position.set(0, 0, 0); ctx.seguir = null; ctx.marcar('subir', false); }
    }
    // fuga: corre para a frente, espera e volta devagar ao lugar
    if (S.fuga > 0) {
      S.fuga += dt;
      const u = S.fuga, k = u < 1.4 ? smooth(u, 0, 1.4) : u < 6 ? 1 : 1 - smooth(u, 6, 10);
      S.lz.position.set(30 * k, 0, 0);
      passo = u < 1.4 ? 1.4 : u < 6 ? 0 : u < 10 ? -0.8 : 0;     // volta andando de ré
      if (u >= 10) { S.fuga = 0; S.lz.position.set(0, 0, 0); }
    }
    // patas: trote em diagonal; o corpo ondula para os lados
    S.aPasso += dt * 9 * Math.abs(passo);
    const ph = S.aPasso;
    S.corpo.rotation.y = passo ? Math.sin(ph) * 0.09 : 0;
    S.pernas.forEach((l) => {
      const f = ph + l.fase;
      l.F.copy(l.F0);
      if (passo) { l.F.x += Math.sin(f) * 4 * passo; l.F.y = Math.max(0, Math.cos(f)) * 2.2 * Math.abs(passo); }
      solveLeg(l, l.F); poePe(l);
    });
    // cauda: balança devagar parada e ondula ao andar
    const segs = coletar(S.base);
    segs.forEach((sg, i) => {
      const amp = passo ? 0.12 : 0.035, w = passo ? 9 : 1.3;
      sg.rotation.y = (i ? 1 : 0.4) * Math.sin(t * w - i * 0.55 + (passo ? ph - t * w : 0)) * amp;
    });
    // cauda solta: se mexe no chão e some
    for (let i = S.soltas.length - 1; i >= 0; i--) {
      const c = S.soltas[i]; c.userData.t += dt;
      const k = c.userData.t, vigor = Math.max(0, 1 - k / 7);
      if (c.position.y > 3.2) c.position.y = Math.max(3.2, c.position.y - dt * 40);
      c.rotation.x = 0; c.rotation.z = 0;
      coletar(c).forEach((sg, j) => { if (j) sg.rotation.y = Math.sin(t * 16 - j * 0.9) * 0.45 * vigor; });
      if (k > 8) c.traverse((o) => { if (o.isMesh) o.material.opacity = Math.max(0, 1 - (k - 8) / 2); });
      if (k > 10) { S.raiz.remove(c); S.soltas.splice(i, 1); }
    }
    // cauda nova crescendo
    if (S.rege > 0 && S.rege < 9) {
      S.rege += dt;
      const g = smooth(S.rege, 2.5, 9);
      S.caudaPresa.scale.set(Math.max(0.01, g * 0.8), Math.max(0.01, 0.6 + g * 0.4), Math.max(0.01, 0.6 + g * 0.4));
      if (S.rege >= 9) ctx.aviso('Pronto: cauda nova! Ela é um pouco mais curta e sem listras.');
    }
    // lamber o olho: a língua sai da boca e passa no olho
    if (S.lamber > 0) {
      S.lamber += dt;
      // sai da boca (k sobe), passa duas vezes por cima do olho e volta (k desce)
      const u = S.lamber, T = 1.8;
      const k = u < 0.35 ? smooth(u, 0, 0.35) : u < T - 0.35 ? 1 : 1 - smooth(u, T - 0.35, T);
      const s = S.olhoLambido, w = u < 0.35 ? 0 : Math.sin((u - 0.35) * 9) * 1.4;          // vai e volta em cima do olho
      const pts = [new V3(52.8, 4.5, s * 0.4), new V3(55.6, 3.9, s * 2.2), new V3(54.2, 5.6, s * 6.4), new V3(49.5, 8.2 + w * 0.3, s * 7.9), new V3(45.6 - w, 9.6, s * 7.2)];
      const curva = new THREE.CatmullRomCurve3(pts);
      const n = Math.max(2, Math.round(28 * k));
      const parte = [];
      for (let i = 0; i <= n; i++) parte.push(curva.getPoint(k * i / n));
      S.lingua.geometry.dispose();
      S.lingua.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(parte), n * 2, 0.62, 10, false);
      S.lingua.visible = k > 0.02;
      if (u >= T) { S.lamber = 0; S.lingua.visible = false; }
    }
    // parada ela respira e dá umas olhadinhas para os lados
    const parado = !passo && S.subir <= 0;
    S.casca.scale.set(1, 1 + Math.sin(t * 2.6) * 0.018, 1 + Math.sin(t * 2.6) * 0.025);
    S.corpo.rotation.y += parado ? Math.sin(t * 0.45) * 0.06 + (Math.sin(t * 0.17) > 0.85 ? 0.08 : 0) : 0;
    // olhos mexem de leve
    S.olhos.forEach((o, i) => { o.rotation.y = Math.sin(t * 0.7 + i * 2) * 0.12; });
  }

  Modelos3D.lagartixa = {
    // 🔬 Cientista (anos finais): termo científico e texto técnico, por nome da parte. Em revisão científica.
    cientista: {
      'Olhos': { termo: 'espetáculo e pupila vertical', texto: 'As pálpebras são fundidas numa escama transparente, o espetáculo, que ela limpa com a língua. A pupila vertical se fecha em fenda na luz forte e se abre muito no escuro: a lagartixa é noturna.' },
      'Ouvido': { termo: 'abertura auditiva', texto: 'Lagartos não têm orelha externa: o tímpano fica logo abaixo dessa abertura. As lagartixas também emitem estalos para se comunicar.' },
      'Língua': { termo: 'língua e órgão vomeronasal', texto: 'Língua carnosa e móvel. Além de limpar o espetáculo dos olhos, leva partículas de cheiro até o órgão vomeronasal, no céu da boca.' },
      'Dedos': { termo: 'lamelas com setas', texto: 'Embaixo dos dedos há lamelas cobertas de setas microscópicas, que se dividem em pontas ainda menores (espátulas). Elas chegam tão perto da superfície que forças de van der Waals seguram o animal, sem cola.' },
      'Escamas': { termo: 'escamas de queratina e ecdise', texto: 'Pele com escamas de queratina e tubérculos no dorso. A camada externa é trocada de tempos em tempos (ecdise), e a lagartixa pode clarear ou escurecer a cor.' },
      'Cauda': { termo: 'autotomia caudal', texto: 'As vértebras da cauda têm planos de fratura. Ao soltar, músculos fecham os vasos e o pedaço solto continua se contraindo, distraindo o predador. A cauda regenerada tem um bastão de cartilagem no lugar das vértebras.' },
      'Patas': { termo: 'membros pentadáctilos', texto: 'Quatro membros com cinco dedos, projetados para os lados (postura esparramada). Ao andar, o corpo ondula para os lados, e as patas se movem em diagonal.' }
    },
    cena: 'chao',
    acoes: [
      { id: 'andar', ico: '🦎', rotulo: 'Andar', fn: andar },
      { id: 'subir', ico: '🧗', rotulo: 'Subir na parede', fn: subir },
      { id: 'cauda', ico: '✂️', rotulo: 'Soltar a cauda', fn: soltar },
      { id: 'lamber', ico: '👅', rotulo: 'Lamber o olho', fn: lamber }
    ],
    construir,
    update,
    toque: lamber,
    partes: [
      { nome: 'Olhos', emoji: '👁️', texto: 'Olhos grandes e sem pálpebras. Para limpar, ela lambe o olho com a língua!', pequeno: 'Ela limpa o olho com a língua!', ponto: () => S.olhos[0].getWorldPosition(new V3()).add(new V3(0, 3, 2)) },
      { nome: 'Ouvido', emoji: '👂', texto: 'Este buraquinho do lado da cabeça é o ouvido. Lagartixa não tem orelha.', pequeno: 'Aqui é o ouvido!', ponto: () => S.corpo.localToWorld(new V3(36.2, 7.5, 6.5)) },
      { nome: 'Língua', emoji: '👅', texto: 'Língua curta e grossa. Ela pega insetos com a boca e limpa os olhos com a língua.', pequeno: 'A língua limpa os olhos!', ponto: () => S.corpo.localToWorld(new V3(53, 3.5, 2)) },
      { nome: 'Dedos', curto: 'Dedos', emoji: '🧲', texto: 'Embaixo dos dedos há almofadinhas com pelinhos microscópicos. É por isso que ela anda na parede e no teto!', pequeno: 'Com esses dedinhos ela anda até no teto!', ponto: () => S.pernas[0].pe.getWorldPosition(new V3()).add(new V3(2, 1, 2)) },
      { nome: 'Escamas', emoji: '🔸', texto: 'A pele é coberta de escamas pequenas, com carocinhos nas costas. De tempos em tempos ela troca de pele.', pequeno: 'Pele de escamas, com carocinhos!', ponto: () => S.corpo.localToWorld(new V3(15, 9.5, 0)) },
      { nome: 'Cauda', emoji: '〰️', texto: 'Se um bicho agarra a cauda, ela solta e fica se mexendo para distrair o predador. Depois nasce outra. Por isso, nunca puxe a cauda de uma lagartixa!', pequeno: 'A cauda solta e nasce outra!', ponto: () => S.juntaFratura.getWorldPosition(new V3()).add(new V3(-6, 3, 2)) },
      { nome: 'Patas', emoji: '🐾', texto: 'Quatro patas com cinco dedos cada, abertas para os lados.', pequeno: 'Quatro patas, cinco dedos!', ponto: () => S.pernas[1].tibia.getWorldPosition(new V3()).add(new V3(0, 2, 2)) }
    ]
  };
})();
