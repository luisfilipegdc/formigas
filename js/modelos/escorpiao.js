/* =====================================================================
   modelos/escorpiao.js — escorpião-amarelo (Tityus serrulatus)
   Formas: fêmea · com filhotes nas costas (a espécie é quase toda de fêmeas).
   Ações: andar, posição de defesa (cauda erguida e pinças abertas) e
   luz ultravioleta (o corpo brilha em azul-esverdeado).
   Corpo por SDF + marching cubes; cauda em cadeia de 5 segmentos + télson;
   patas com cinemática (js/core3d.js). Unidades = mm. X para a frente.
   ===================================================================== */
(function () {
  const S = {};

  /* ---------- corpo (prossoma + mesossoma) por SDF ---------- */
  function sdfCorpo(x, y, z) {
    const pro = ell(x, y, z, 12.5, 3.3, 0, 6.2, 2.2, 4.5);
    const tub = ell(x, y, z, 15, 4.7, 0, 1.4, 0.9, 1.5);                // tubérculo dos olhos
    const meso = ell(x, y, z, 1, 3.2, 0, 9.2, 2.3, 5.2);
    const fim = ell(x, y, z, -8.6, 3.2, 0, 3, 2, 3.3);
    let d = smin(pro, meso, 1.6); d = smin(d, fim, 1.6); d = smin(d, tub, 0.8);
    d = smax(d, -(y - 1.0), 0.6);                                       // barriga achatada
    const g = 1 - Math.abs(Math.sin((x + 12) * Math.PI / 2.75));         // sulcos entre os tergitos
    d += 0.22 * smooth(g, 0.8, 1) * (x < 7 ? 1 : 0) * smooth(y, 4, 5.2);
    return d + fbm3(x * 1.2, y * 1.2, z * 1.2) * 0.03;
  }
  const _c1 = new THREE.Color(), _c2 = new THREE.Color();
  function mix(c, a, b, t) { c.copy(_c1.set(a)).lerp(_c2.set(b), clamp(t, 0, 1)); }
  function cor(x, y, z, n, c) {
    if (n.y < -0.35 || y < 1.6) { c.set('#a88a3c'); return; }
    if (x > 7.5) { mix(c, '#7b5a1c', '#3d2a0e', smooth(x, 13, 18) * 0.6 + smooth(1.6 - Math.abs(z), 0, 1) * 0.3); return; }   // carapaça, escura na frente
    const manchas = smooth(fbm3(x * 0.5, 0, z * 0.5), 0.45, 0.65);
    mix(c, '#6f5016', '#3e2b0c', Math.max(manchas * 0.6, smooth(1 - Math.abs(Math.abs(z) - 2.2), 0.4, 1) * 0.5));
  }

  /* ---------- cauda (metassoma + télson) ---------- */
  const LS = [4.6, 5, 5.4, 5.8, 6.4], RS = [2.5, 2.4, 2.35, 2.3, 2.3];
  const REPOUSO = [-0.25, -0.45, -0.55, -0.55, -0.5], DEFESA = [-0.55, -0.6, -0.6, -0.5, -0.45];
  function montarCauda(mats) {
    const segs = [];
    let ant = null;
    LS.forEach((L, i) => {
      const g = new THREE.Group();
      const geo = new THREE.CylinderGeometry(RS[i] * 0.88, RS[i], L, 8); geo.translate(0, L / 2, 0); geo.rotateZ(Math.PI / 2);
      const mat = i === 4 ? mats.escuro : mats.cauda;
      const m = shadowy(new THREE.Mesh(geo, mat)); m.scale.set(1, 0.85, 0.92); g.add(m);
      const j = shadowy(new THREE.Mesh(new THREE.SphereGeometry(RS[i] * 0.86, 12, 8), mat)); j.scale.set(0.8, 0.85, 0.92); g.add(j);
      // serrilha em cima do 3º e do 4º segmento (é o "serrulatus" do nome)
      if (i === 2 || i === 3) for (let k = 0; k < 4; k++) [1, -1].forEach((s) => {
        const d = new THREE.Mesh(new THREE.ConeGeometry(0.32, 1.1, 5), mats.serra);
        d.position.set(-1.1 - k * (L - 1.6) / 3.2, RS[i] * 0.82, s * 0.9); d.rotation.z = 0.35; g.add(d);
      });
      if (ant) { g.position.x = -LS[i - 1]; ant.add(g); }
      segs.push(g); ant = g;
    });
    // télson: vesícula de veneno + ferrão (acúleo) curvo
    const tel = new THREE.Group(); tel.position.x = -LS[4]; segs[4].add(tel);
    const ves = shadowy(new THREE.Mesh(new THREE.SphereGeometry(1, 18, 12), mats.telson)); ves.scale.set(2.5, 1.75, 1.6); ves.position.x = -2.3; tel.add(ves);
    const acu = new THREE.Group(); acu.position.set(-4.5, 0.2, 0); acu.rotation.z = -0.9; tel.add(acu);
    const ag = new THREE.ConeGeometry(0.7, 3.6, 10); ag.translate(0, 1.8, 0);
    const ferrao = shadowy(new THREE.Mesh(ag, mats.ferrao)); ferrao.rotation.z = Math.PI / 2; acu.add(ferrao);     // aponta para -x do télson, curvando para cima
    const dente = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.9, 6), mats.ferrao); dente.position.set(-3.9, -1.1, 0); dente.rotation.z = Math.PI * 0.85; tel.add(dente);   // dente subaculear
    return { segs, tel, ferrao };
  }

  /* ---------- pinças (pedipalpos) ---------- */
  function montarPalpo(s, mats) {
    const g = new THREE.Group();
    const P1 = new V3(17.5, 3.4, s * 4.5), P2 = new V3(23, 4.6, s * 10.5), P3 = new V3(28.6, 4.3, s * 9), P4 = new V3(39, 3.4, s * 4.6);
    g.position.copy(P1);
    const loc = (p) => p.clone().sub(P1);
    const base = segGroup(new V3(16, 3, s * 2.6).distanceTo(P1), 0.75, 0.75, { mat: mats.palpo, joint: false }); place(base, loc(new V3(16, 3, s * 2.6)), new V3()); g.add(base);
    const fem = segGroup(P1.distanceTo(P2), 0.8, 0.75, { mat: mats.palpo, jointMat: mats.palpo, bulge: 0.1, hairMat: mats.pelo, hairDensity: 1.5, hairLen: 0.8 }); place(fem, new V3(), loc(P2)); g.add(fem);
    const pat = segGroup(P2.distanceTo(P3), 0.8, 0.9, { mat: mats.palpo, jointMat: mats.palpo, bulge: 0.15, hairMat: mats.pelo, hairDensity: 1.5, hairLen: 0.8 }); place(pat, loc(P2), loc(P3)); g.add(pat);
    // mão (quela): palma + dedo fixo + dedo móvel
    const mao = new THREE.Group(); mao.position.copy(loc(P3));
    mao.quaternion.setFromUnitVectors(new V3(1, 0, 0), P4.clone().sub(P3).normalize()); g.add(mao);
    const palma = shadowy(new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), mats.palpo)); palma.scale.set(3, 1.45, 1.6); palma.position.x = 2.4; mao.add(palma);
    const dedo = (comp) => { const dg = new THREE.ConeGeometry(0.55, comp, 8); dg.translate(0, comp / 2, 0); dg.rotateZ(-Math.PI / 2); return dg; };
    const fixo = shadowy(new THREE.Mesh(dedo(4.8), mats.dedo)); fixo.position.set(5, 0, -s * 0.45); fixo.rotation.y = s * 0.06; mao.add(fixo);
    const movel = new THREE.Group(); movel.position.set(4.8, 0, s * 0.5); mao.add(movel);
    const mv = shadowy(new THREE.Mesh(dedo(5), mats.dedo)); movel.add(mv);
    g.userData = { s, mao, movel, P1 };
    return g;
  }

  function perna(C, F, L, mats) {
    const leg = { C, L, s: Math.sign(C.z) };
    leg.troch = segGroup(0.35, 0.75, 0.7, { mat: mats.perna, joint: false });
    leg.femur = segGroup(L.f, 0.7, 0.6, { mat: mats.perna, jointMat: mats.junta, bulge: 0.1 });
    leg.tibia = segGroup(L.t, 0.58, 0.45, { mat: mats.perna, jointMat: mats.junta, bulge: 0.1, hairMat: mats.pelo, hairDensity: 1, hairLen: 0.6 });
    leg.tarsus = segGroup(L.ta, 0.42, 0.25, { mat: mats.perna, jointMat: mats.junta, bulge: 0.05 });
    leg.F = F.clone(); leg.F0 = F.clone();
    solveLeg(leg, leg.F);
    return leg;
  }

  function construir(ctx) {
    const cell = ctx.MOBILE ? 0.4 : 0.3;
    const mCorpo = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.4, clearcoat: 0.6, clearcoatRoughness: 0.3, envMapIntensity: 0.6 });
    addCuticle(mCorpo, 0.08, 0.15);
    const fis = (cor, extra) => new THREE.MeshPhysicalMaterial(Object.assign({ color: cor, roughness: 0.4, clearcoat: 0.6, clearcoatRoughness: 0.3 }, extra || {}));
    const mats = {
      cauda: fis('#8c6812'), escuro: fis('#3a270c'), serra: fis('#2e1f0a'), telson: fis('#93700f'), ferrao: fis('#1e1407'),
      palpo: fis('#957116'), dedo: fis('#4a3210'), perna: fis('#9c7a1a'), junta: fis('#6e5212'),
      pelo: new THREE.MeshStandardMaterial({ color: '#e6d6a0', roughness: 0.8 }), bebe: fis('#efe6cc', { clearcoat: 0.2, roughness: 0.6 })
    };
    S.brilham = [mCorpo, mats.cauda, mats.escuro, mats.serra, mats.telson, mats.ferrao, mats.palpo, mats.dedo, mats.perna, mats.junta, mats.bebe];
    const raiz = new THREE.Group(); ctx.scene.add(raiz);
    const ez = new THREE.Group(); raiz.add(ez);                // escorpião inteiro (posição e direção)
    const corpo = new THREE.Group(); ez.add(corpo);
    corpo.add(sdfMesh(sdfCorpo, new V3(-12.5, 0.6, -6), new V3(19.5, 6.2, 6), cell, cor, mCorpo));

    // olhos: um par no meio da carapaça e grupos pequenos nos cantos da frente
    const mOlho = new THREE.MeshPhysicalMaterial({ color: '#0a0805', roughness: 0.1, clearcoat: 1 });
    S.olhos = [[15.3, 5.55, 0.7, 0.45], [15.3, 5.55, -0.7, 0.45]].map((p) => { const o = new THREE.Mesh(new THREE.SphereGeometry(p[3], 10, 8), mOlho); o.position.set(p[0], p[1], p[2]); corpo.add(o); return o; });
    [1, -1].forEach((s) => [[18.1, 4.1, 3.1], [17.6, 4.25, 3.5], [17.9, 3.85, 3.6]].forEach((p) => {
      const o = new THREE.Mesh(new THREE.SphereGeometry(0.26, 8, 6), mOlho); o.position.set(p[0], p[1], s * p[2]); corpo.add(o);
    }));
    // quelíceras: pincinhas na frente da boca
    S.quel = [1, -1].map((s) => {
      const q = new THREE.Group(); q.position.set(18.6, 3.1, s * 0.85); corpo.add(q);
      const b = shadowy(new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), mats.palpo)); b.scale.set(1.3, 0.7, 0.75); b.position.x = 0.8; q.add(b);
      const p = new THREE.Mesh(new THREE.ConeGeometry(0.28, 1.2, 6), mats.ferrao); p.rotation.z = -Math.PI / 2; p.position.x = 2.4; q.add(p);
      return q;
    });
    // pentes (pectinas) embaixo do corpo
    S.pentes = [1, -1].map((s) => {
      const pg = new THREE.Group(); pg.position.set(5.5, 0.9, s * 1.4); pg.rotation.y = s * -0.55; corpo.add(pg);
      const haste = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.3, 0.55), mats.palpo); haste.position.x = 0; pg.add(haste);
      for (let k = 0; k < 11; k++) { const d = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.25, 1.1), mats.pelo); d.position.set(-1.6 + k * 0.32, -0.05, s * 0.7); pg.add(d); }
      return pg;
    });
    // pinças
    S.palpos = [1, -1].map((s) => { const p = montarPalpo(s, mats); corpo.add(p); return p; });
    // 4 pares de patas
    S.pernas = [];
    [1, -1].forEach((s) => {
      S.pernas.push(perna(new V3(15.5, 2.4, s * 3.2), new V3(24, 0, s * 14), { f: 5.5, t: 6, ta: 5 }, mats));
      S.pernas.push(perna(new V3(13.2, 2.4, s * 3.8), new V3(17, 0, s * 17.5), { f: 6, t: 6.5, ta: 5.5 }, mats));
      S.pernas.push(perna(new V3(10.8, 2.4, s * 4.2), new V3(6, 0, s * 18), { f: 6.8, t: 7, ta: 6 }, mats));
      S.pernas.push(perna(new V3(8.2, 2.4, s * 4.3), new V3(-6, 0, s * 15.5), { f: 7.5, t: 7.8, ta: 6.8 }, mats));
    });
    S.pernas.forEach((l, i) => { l.fase = ((i % 4) % 2 ? Math.PI : 0) + (l.s > 0 ? 0 : Math.PI); ['troch', 'femur', 'tibia', 'tarsus'].forEach((k) => corpo.add(l[k])); });
    // cauda
    const cauda = montarCauda(mats);
    cauda.segs[0].position.set(-10.8, 3.3, 0); corpo.add(cauda.segs[0]);
    S.cauda = cauda;
    poseCauda(REPOUSO, 0);
    // filhotes nas costas (forma "com filhotes")
    const bebes = new THREE.Group(); bebes.visible = false; corpo.add(bebes);
    for (let i = 0; i < 14; i++) {
      const b = new THREE.Group();
      const x = -7 + (i % 5) * 3.4 + (Math.floor(i / 5) % 2) * 1.6, z = (Math.floor(i / 5) - 1) * 2.9 + rnd(-0.4, 0.4);
      b.position.set(x, 5.2 - Math.abs(z) * 0.22, z); b.rotation.y = rnd(0, Math.PI * 2); b.rotation.z = rnd(-0.15, 0.15);
      const c = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), mats.bebe); c.scale.set(1.5, 0.55, 0.9); b.add(c);
      const cd = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.32, 2.2, 6), mats.bebe); cd.rotation.z = Math.PI / 2.4; cd.position.set(-1.9, 0.45, 0); b.add(cd);
      [1, -1].forEach((s) => { const pp = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.6, 4), mats.bebe); pp.rotation.x = Math.PI / 2; pp.position.set(1.2, 0, s * 0.9); pp.rotation.y = s * 0.5; b.add(pp); });
      bebes.add(b);
    }
    S.bebes = bebes;

    Object.assign(S, { raiz, ez, corpo, ctx, andar: 0, defesa: 0, defK: 0, uv: false, uvK: 0, pinca: 0, aPasso: 0 });
    window.__escorpiao = S;     // para testes
    return { grupo: raiz, raio: 37, centro: new V3(4, 10, 0) };
  }

  // cauda: ângulos de cada segmento (dobrando para cima) + balanço
  function poseCauda(ang, balanco) {
    S.cauda.segs.forEach((g, i) => { g.rotation.z = ang[i]; g.rotation.y = i ? balanco * 0.15 : balanco * 0.3; });
    S.cauda.tel.rotation.z = -0.55 - 0.3 * S.defK;
  }

  /* ---------- ações ---------- */
  function andar(ctx, b) {
    S.andar = S.andar > 0 ? 0 : 0.001;
    if (!S.andar) { S.ez.position.set(0, 0, 0); S.ez.rotation.set(0, 0, 0); }
    ctx.seguir = S.andar ? S.ez : null;
    if (b) b.classList.toggle('on', S.andar > 0);
  }
  function defesa(ctx, b) {
    S.defesa = !S.defesa;
    if (b) b.classList.toggle('on', S.defesa);
    if (S.defesa) ctx.aviso('Posição de defesa: cauda erguida e pinças abertas. Escorpião de verdade, só de longe!');
  }
  const salvo = { luzes: [] };
  function uv(ctx, b) {
    S.uv = !S.uv;
    if (b) b.classList.toggle('on', S.uv);
    const sc = ctx.scene;
    if (S.uv) {
      salvo.luzes = [];
      sc.traverse((o) => { if (o.isLight) { salvo.luzes.push([o, o.intensity]); o.intensity *= 0.06; } });
      salvo.fundo = sc.background; salvo.env = sc.environment; sc.environment = null; salvo.neblina = sc.fog ? sc.fog.color.clone() : null; salvo.exp = ctx.renderer.toneMappingExposure;
      sc.background = new THREE.Color('#0d0820'); if (sc.fog) sc.fog.color.set('#0d0820');
      salvo.roxa = new THREE.HemisphereLight('#6a3cff', '#140a2a', 0.5); sc.add(salvo.roxa);
      ctx.aviso('🔦 Na luz ultravioleta, o escorpião brilha! Os cientistas ainda estudam para quê.');
    } else {
      salvo.luzes.forEach(([o, i]) => { o.intensity = i; });
      sc.background = salvo.fundo; sc.environment = salvo.env; if (sc.fog && salvo.neblina) sc.fog.color.copy(salvo.neblina);
      if (salvo.roxa) sc.remove(salvo.roxa);
    }
  }
  function beliscar(ctx) { S.pinca = 0.001; ctx.aviso('Observe sem tocar! Escorpião de verdade, só de longe e com um adulto.'); }

  /* ---------- animação ---------- */
  const _cor = new THREE.Color('#14d9a6');
  function update(dt, t, ctx) {
    if (!S.raiz) return;
    let passo = 0;
    if (S.andar > 0) {
      S.andar += dt;
      const a = Math.min(1, S.andar / 12) * Math.PI * 2, R = 16;
      S.ez.position.set(R * Math.sin(a), 0, -R + R * Math.cos(a));
      S.ez.rotation.y = a;
      passo = S.andar < 12 ? 1 : 0;
      if (S.andar >= 12) andar(ctx, document.querySelector('.acao[data-id="andar"]'));
    }
    // patas: quatro de cada vez, alternando
    S.aPasso += dt * 8 * (passo ? 1 : 0);
    S.pernas.forEach((l) => {
      const f = S.aPasso + l.fase;
      l.F.copy(l.F0);
      if (passo) { l.F.x += Math.sin(f) * 2.6; l.F.y = Math.max(0, Math.cos(f)) * 1.6; }
      solveLeg(l, l.F);
    });
    // defesa: cauda sobe, pinças abrem e se erguem
    S.defK += ((S.defesa ? 1 : 0) - S.defK) * Math.min(1, dt * 3);
    const ang = REPOUSO.map((r, i) => r + (DEFESA[i] - r) * S.defK);
    poseCauda(ang, Math.sin(t * (S.defesa ? 3 : 0.8)) * (S.defesa ? 0.5 : 0.15));
    S.corpo.position.y = S.defK * 1.2;
    S.corpo.rotation.z = S.defK * 0.06;
    // pinças: abrem na defesa e fecham rápido quando toca no escorpião
    if (S.pinca > 0) { S.pinca += dt; if (S.pinca > 1.2) S.pinca = 0; }
    const fecha = S.pinca > 0 ? Math.abs(Math.sin(S.pinca * Math.PI * 2.5)) : 0;
    S.palpos.forEach((p) => {
      const s = p.userData.s;
      p.rotation.z = S.defK * 0.35; p.rotation.y = -s * S.defK * 0.2;
      p.userData.movel.rotation.y = s * (0.08 + 0.45 * S.defK) * (1 - fecha);
    });
    // luz UV: o corpo brilha em azul-esverdeado (acende e apaga devagar)
    S.uvK += ((S.uv ? 1 : 0) - S.uvK) * Math.min(1, dt * 2.5);
    S.brilham.forEach((m) => { m.emissive.copy(_cor).multiplyScalar(S.uvK * 0.75); });
    // quelíceras mexendo de leve
    S.quel.forEach((q, i) => { q.rotation.y = Math.sin(t * 2 + i * 2) * 0.12; });
  }

  Modelos3D.escorpiao = {
    // 🔬 Cientista (anos finais): termo científico e texto técnico, por nome da parte. Em revisão científica.
    cientista: {
      'Pinças': { termo: 'pedipalpos quelados', texto: 'Segundo par de apêndices, terminado em quela (pinça). Têm tricobótrias, pelos muito finos que captam vibrações do ar e ajudam a localizar a presa.' },
      'Quelíceras': { termo: 'quelíceras', texto: 'Primeiro par de apêndices, em forma de pinças pequenas. Trituram a presa enquanto enzimas digestivas a liquefazem antes de ser ingerida.' },
      'Olhos': { termo: 'olhos medianos e laterais', texto: 'Um par de olhos medianos no tubérculo ocular e grupos de olhos laterais pequenos. São sensíveis a pouca luz: o escorpião é noturno.' },
      'Patas': { termo: 'quatro pares de pernas', texto: 'Oito pernas articuladas, como em todos os aracnídeos. Escorpiões não têm antenas.' },
      'Pentes': { termo: 'pectinas', texto: 'Órgãos sensoriais exclusivos dos escorpiões, com muitos receptores químicos e mecânicos que exploram o chão por onde ele anda.' },
      'Cauda': { termo: 'metassoma', texto: 'O corpo tem prossoma, mesossoma e metassoma. O metassoma tem 5 segmentos; no T. serrulatus, o 3º e o 4º têm uma serrilha dorsal que dá nome à espécie.' },
      'Ferrão': { termo: 'télson e acúleo', texto: 'O télson guarda as glândulas de veneno e termina no acúleo. O veneno tem neurotoxinas que agem nos nervos; por isso a picada exige atendimento médico rápido, principalmente em crianças.' },
      'Filhotes': { termo: 'viviparidade e partenogênese', texto: 'Os filhotes nascem vivos e ficam nas costas da mãe até a primeira muda. Na maioria das populações de T. serrulatus só há fêmeas, que se reproduzem sem macho (partenogênese).' }
    },
    cena: 'chao',
    formas: [{ id: 'femea', nome: 'Fêmea' }, { id: 'filhotes', nome: 'Com filhotes' }],
    acoes: [
      { id: 'andar', ico: '🦂', rotulo: 'Andar', fn: andar },
      { id: 'defesa', ico: '🛡️', rotulo: 'Defesa', fn: defesa },
      { id: 'uv', ico: '🔦', rotulo: 'Luz UV', fn: uv }
    ],
    construir,
    update,
    toque: beliscar,
    forma(id, ctx) {
      S.bebes.visible = id === 'filhotes';
      if (id === 'filhotes') ctx.aviso('Os filhotes ficam nas costas da mãe até trocar de pele pela primeira vez.');
    },
    partesAtuais() {
      const l = Modelos3D.escorpiao.partes.slice();
      if (S.bebes && S.bebes.visible) l.push({ nome: 'Filhotes', emoji: '👶', texto: 'Os filhotes nascem vivos e sobem nas costas da mãe. Ficam ali até a primeira troca de pele.', pequeno: 'Os filhotes andam nas costas da mãe!', ponto: () => S.corpo.localToWorld(new V3(0, 8, 0)) });
      return l;
    },
    partes: [
      { nome: 'Pinças', emoji: '🦀', texto: 'As pinças seguram as presas, como baratas e grilos. No escorpião-amarelo elas são finas.', pequeno: 'Pinças para segurar a comida!', ponto: () => S.palpos[0].userData.mao.getWorldPosition(new V3()).add(new V3(3, 3, 2)) },
      { nome: 'Quelíceras', emoji: '✂️', texto: 'Pinças pequenininhas na frente da boca, que picam e rasgam a comida.', pequeno: 'Pinças pequeninas da boca.', ponto: () => S.quel[0].getWorldPosition(new V3()).add(new V3(2, 2, 1)) },
      { nome: 'Olhos', emoji: '👀', texto: 'Dois olhos no meio da cabeça e outros bem pequenos nos cantos. Mesmo assim, enxerga pouco: sente as vibrações do chão.', pequeno: 'Tem vários olhinhos, mas enxerga pouco.', ponto: () => S.olhos[0].getWorldPosition(new V3()).add(new V3(0, 2.5, 0)) },
      { nome: 'Patas', emoji: '🦵', texto: '8 patas: o escorpião é um aracnídeo, parente das aranhas.', pequeno: '8 patas, como a aranha!', ponto: () => S.pernas[2].tibia.getWorldPosition(new V3()).add(new V3(0, 2, 2)) },
      { nome: 'Pentes', emoji: '🪮', texto: 'Embaixo do corpo há dois "pentes" que tocam o chão e sentem cheiros e o jeito do solo.', pequeno: 'Pentinhos embaixo da barriga!', ponto: () => S.pentes[0].getWorldPosition(new V3()).add(new V3(0, -0.5, 3)) },
      { nome: 'Cauda', emoji: '〰️', texto: 'A "cauda" é a parte final do corpo, com 5 segmentos. No escorpião-amarelo ela tem uma serrinha em cima: daí o nome serrulatus.', pequeno: 'A cauda tem uma serrinha!', ponto: () => S.cauda.segs[2].getWorldPosition(new V3()).add(new V3(0, 3, 2)) },
      { nome: 'Ferrão', emoji: '⚠️', texto: 'Na ponta fica o ferrão com veneno, usado para caçar e se defender. A picada do escorpião-amarelo pode ser perigosa: nunca toque!', pequeno: 'Aqui fica o ferrão. Nunca toque!', ponto: () => S.cauda.ferrao.getWorldPosition(new V3()).add(new V3(0, 2, 1)) }
    ]
  };
})();
