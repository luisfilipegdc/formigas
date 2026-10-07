/* =====================================================================
   modelos/cigarra.js — cigarra-gigante (Quesada gigas) em 3D
   Formas: adulta · ninfa · casca (exúvia grudada no tronco).
   Ações: cantar (tímbalos vibrando + anéis de som + som imitado), voar.
   Corpo "esculpido" por SDF + marching cubes (js/core3d.js). mm.
   ===================================================================== */
(function () {
  const S = {};                      // peças e estado da cigarra
  let audio = null;

  /* ---------- formas por SDF ---------- */
  function sdfFrente(x, y, z) {            // cabeça + tórax
    const cab = ell(x, y, z, 21, 9, 0, 4.5, 5, 8.6);
    const face = ell(x, y, z, 24.6, 7.2, 0, 3, 4.4, 3.6);
    const pro = ell(x, y, z, 14, 10.2, 0, 6.2, 6.2, 9.2);
    const meso = ell(x, y, z, 5, 10.6, 0, 7.4, 6.8, 7.8);
    let d = smin(cab, face, 2);
    d = smin(d, pro, 2.2);
    d = smin(d, meso, 2.2);
    return d + fbm3(x * 0.6, y * 0.6, z * 0.6) * 0.08;
  }
  function sdfAbd(x, y, z) {               // abdômen (pulsa no canto)
    const a = ell(x, y, z, -9, 8.6, 0, 13, 6.6, 7.8);
    const ponta = cone(x, y, z, -4, 8.4, 0, -25, 6.6, 0, 7.4, 1.4);
    let d = smin(a, ponta, 3);
    d += 0.25 * Math.max(0, Math.sin((x + 30) * 1.15)) * smooth(-y, -9, -5);   // anéis dos segmentos
    return d;
  }
  const _c1 = new THREE.Color(), _c2 = new THREE.Color();
  function mix(c, a, b, t) { c.copy(_c1.set(a)).lerp(_c2.set(b), clamp(t, 0, 1)); }
  function corFrente(x, y, z, n, c) {
    const m = fbm3(x * 0.16 + 3, y * 0.16, z * 0.16);
    const escuro = smooth(m, 0.48, 0.66);
    if (n.y < -0.35) { mix(c, '#c4ad78', '#a8925e', m); return; }                   // barriga clara
    if (x > 17) mix(c, '#76843f', '#3f4a22', escuro);                                 // cabeça
    else if (x > 8.5) mix(c, Math.abs(z) > 7.2 ? '#9aa957' : '#6f7d3a', '#4a3a22', escuro * 0.8);   // pronoto com borda clara
    else mix(c, '#6a7835', '#3d2f1d', Math.max(escuro, smooth(1.2 - Math.abs(Math.abs(z) - 2.6), 0, 1) * smooth(y, 13, 16)));      // "W" escuro
  }
  function corAbd(x, y, z, n, c) {
    if (n.y < -0.3) { c.set('#ad8d5e'); return; }
    mix(c, '#5a3f26', '#a2834f', smooth(Math.sin((x + 30) * 1.15), 0.4, 0.9));
  }
  function sdfNinfa(x, y, z) {
    const cab = ell(x, y, z, 11, 6.2, 0, 4.2, 4.6, 6.2);
    const tor = ell(x, y, z, 4, 7.4, 0, 6.4, 6.4, 6.8);
    const asaE = ell(x, y, z, -0.5, 8.8, 4.8, 6, 2.2, 3);
    const asaD = ell(x, y, z, -0.5, 8.8, -4.8, 6, 2.2, 3);
    const abd = ell(x, y, z, -9, 5.8, 0, 9.5, 5.2, 6.4);
    let d = smin(cab, tor, 2); d = smin(d, asaE, 1.5); d = smin(d, asaD, 1.5); d = smin(d, abd, 2.4);
    d += 0.2 * Math.max(0, Math.sin((x + 20) * 1.3)) * smooth(x, -2, -6);
    return d + fbm3(x * 0.7, y * 0.7, z * 0.7) * 0.12;
  }
  function corNinfa(x, y, z, n, c) { if (n.y < -0.3) { c.set('#c49a62'); return; } mix(c, '#a0703f', '#6e4728', smooth(fbm3(x * 0.2, y * 0.2, z * 0.2), 0.45, 0.65)); }

  /* ---------- asas com nervuras ---------- */
  function texAsa(dianteira) {
    const outline = (g) => {
      g.beginPath(); g.moveTo(0.02, 0.5);
      if (dianteira) { g.bezierCurveTo(0.2, 0.95, 0.7, 0.98, 0.95, 0.72); g.bezierCurveTo(1.02, 0.55, 0.98, 0.3, 0.88, 0.2); g.bezierCurveTo(0.6, 0.02, 0.2, 0.08, 0.02, 0.5); }
      else { g.bezierCurveTo(0.15, 0.92, 0.6, 0.96, 0.9, 0.7); g.bezierCurveTo(1.0, 0.5, 0.92, 0.25, 0.7, 0.18); g.bezierCurveTo(0.4, 0.06, 0.15, 0.15, 0.02, 0.5); }
      g.closePath();
    };
    const draw = (g, L) => {
      g.strokeStyle = 'rgba(70,90,40,.95)';
      L(0.012, [0.02, 0.55, 0.3, 0.86, 0.7, 0.92, 0.94, 0.72]);           // costa (borda da frente)
      L(0.008, [0.02, 0.5, 0.35, 0.6, 0.62, 0.62, 0.9, 0.55]);
      L(0.008, [0.02, 0.48, 0.3, 0.38, 0.6, 0.3, 0.86, 0.24]);
      L(0.006, [0.3, 0.6, 0.32, 0.86]); L(0.006, [0.35, 0.6, 0.3, 0.38]);
      for (let i = 0; i < 8; i++) { const u = 0.5 + i * 0.06; L(0.005, [u, 0.62 + (i % 2) * 0.02, u + 0.04, 0.9 - i * 0.02]); L(0.005, [u, 0.6, u + 0.05, 0.3 - i * 0.01]); }
      g.strokeStyle = 'rgba(70,90,40,.6)';
      for (let i = 0; i < 9; i++) { const u = 0.55 + i * 0.05; L(0.004, [u, 0.92 - i * 0.02, u, 0.2 + i * 0.01]); }
    };
    return wingTextureFrom(outline, draw, ['rgba(150,180,110,.55)', 'rgba(215,232,210,.32)', 'rgba(232,242,238,.26)']);
  }
  function asa(L, W, dianteira, mat) {
    const geo = new THREE.PlaneGeometry(L, W); geo.translate(L / 2, 0, 0);
    const m = new THREE.Mesh(geo, mat.clone()); m.material.map = texAsa(dianteira);
    m.castShadow = true;
    const ori = new THREE.Group(); ori.add(m); ori.rotation.order = 'YXZ';
    const piv = new THREE.Group(); piv.add(ori); piv.userData.ori = ori;     // piv: batida · ori: direção da asa
    return piv;
  }

  /* ---------- pernas (cinemática do core3d) ---------- */
  function perna(C, F, L, s, raios, mats) {
    const leg = { C, L, s };
    leg.troch = segGroup(0.35, raios[0], raios[0] * 0.9, { mat: mats.p, jointMat: mats.j, joint: false });
    leg.femur = segGroup(L.f, raios[0], raios[1], { mat: mats.p, jointMat: mats.j, bulge: raios[3] || 0.35, hairMat: mats.pelo, hairDensity: 2, hairLen: 0.6 });
    leg.tibia = segGroup(L.t, raios[1], raios[2], { mat: mats.p, jointMat: mats.j, hairMat: mats.pelo, hairDensity: 3, hairLen: 0.7 });
    leg.tarsus = segGroup(L.ta, raios[2], raios[2] * 0.7, { mat: mats.p, jointMat: mats.j, bulge: 0.1 });
    leg.F = F.clone(); leg.F0 = F.clone();
    solveLeg(leg, leg.F);
    return leg;
  }

  function construir(ctx) {
    const cell = ctx.MOBILE ? 0.85 : 0.65;
    const mCorpo = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.5, clearcoat: 0.4, clearcoatRoughness: 0.4, envMapIntensity: 0.6 });
    addCuticle(mCorpo, 0.25, 0.35);
    const mats = {
      p: new THREE.MeshPhysicalMaterial({ color: '#6b5a34', roughness: 0.5, clearcoat: 0.3 }),
      j: new THREE.MeshPhysicalMaterial({ color: '#3d2f1d', roughness: 0.5 }),
      pelo: new THREE.MeshStandardMaterial({ color: '#d8cfae', roughness: 0.8 })
    };
    const raiz = new THREE.Group();
    ctx.scene.add(raiz);

    /* adulta */
    const ad = new THREE.Group(); raiz.add(ad);
    const corpo = new THREE.Group(); corpo.position.y = 2.2; ad.add(corpo);
    corpo.add(sdfMesh(sdfFrente, new V3(-1, 1.5, -11), new V3(28.5, 18, 11), cell, corFrente, mCorpo));
    const abd = new THREE.Group(); corpo.add(abd);
    abd.add(sdfMesh(sdfAbd, new V3(-27, 1, -9), new V3(4, 16, 9), cell, corAbd, mCorpo));
    S.abd = abd;
    const mOlho = new THREE.MeshPhysicalMaterial({ color: '#6a5634', roughness: 0.35, clearcoat: 0.7, clearcoatRoughness: 0.25 });
    S.olhos = [1, -1].map((s) => { const o = shadowy(new THREE.Mesh(new THREE.SphereGeometry(3.0, 24, 16), mOlho)); o.position.set(21.6, 10.4, s * 8.3); o.scale.set(1, 1.05, 0.85); corpo.add(o); return o; });
    const mOcelo = new THREE.MeshPhysicalMaterial({ color: '#c0392b', roughness: 0.1, clearcoat: 1, emissive: '#3a0a05' });
    [[22.6, 13.7, 0], [21, 13.5, 1.7], [21, 13.5, -1.7]].forEach((p) => { const o = new THREE.Mesh(new THREE.SphereGeometry(0.55, 10, 8), mOcelo); o.position.set(p[0], p[1], p[2]); corpo.add(o); });
    S.antenas = [1, -1].map((s) => { const a = segGroup(4.5, 0.35, 0.12, { mat: mats.j, jointMat: mats.j, joint: false }); place(a, new V3(24.8, 10.6, s * 4.2), new V3(28, 12.5, s * 6.5)); corpo.add(a); return a; });
    const rostro = segGroup(13, 0.9, 0.45, { mat: mats.j, joint: false }); place(rostro, new V3(24, 4.2, 0), new V3(11.5, 2.2, 0)); corpo.add(rostro);
    S.rostro = rostro;
    // asas: dianteiras grandes e traseiras menores, em "telhado" sobre a barriga
    const mAsa = new THREE.MeshPhysicalMaterial({ transparent: true, side: THREE.DoubleSide, depthWrite: false, roughness: 0.15, metalness: 0, clearcoat: 1, alphaTest: 0.01, envMapIntensity: 1.2 });
    S.asas = [];
    [1, -1].forEach((s) => {
      const tras = asa(30, 12, false, mAsa); tras.position.set(5, 13, s * 3.2); corpo.add(tras);
      const fr = asa(44, 14, true, mAsa); fr.position.set(9, 14.2, s * 3.6); corpo.add(fr);
      S.asas.push({ p: fr, s, f: true }, { p: tras, s, f: false });
    });
    // pernas: dianteiras com fêmur grosso
    S.pernas = [];
    [1, -1].forEach((s) => {
      S.pernas.push(perna(new V3(16, 4.5, s * 3.2), new V3(27, 0, s * 9.5), { f: 7, t: 6.2, ta: 4 }, s, [1.25, 0.75, 0.5, 0.55], mats));
      S.pernas.push(perna(new V3(8.5, 4.2, s * 4), new V3(13, 0, s * 14), { f: 7, t: 7.5, ta: 4.6 }, s, [0.9, 0.6, 0.45], mats));
      S.pernas.push(perna(new V3(2.5, 4.2, s * 4.4), new V3(-5, 0, s * 14.5), { f: 8, t: 10, ta: 5.2 }, s, [0.9, 0.6, 0.45], mats));
    });
    S.pernas.forEach((l) => ['troch', 'femur', 'tibia', 'tarsus'].forEach((k) => corpo.add(l[k])));
    poseAsas(0, 0);

    /* ninfa (sai da terra) */
    const nf = new THREE.Group(); nf.visible = false; raiz.add(nf);
    const mNinfa = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.6, clearcoat: 0.25, envMapIntensity: 0.5 });
    addCuticle(mNinfa, 0.7, 0.45);
    const corpoN = sdfMesh(sdfNinfa, new V3(-20, 0, -9), new V3(16.5, 15, 9), cell * 0.9, corNinfa, mNinfa);
    const nfc = new THREE.Group(); nfc.position.y = 1.8; nfc.add(corpoN); nf.add(nfc);
    const mOlhoN = new THREE.MeshPhysicalMaterial({ color: '#d9c7a4', roughness: 0.35, clearcoat: 0.8 });
    [1, -1].forEach((s) => { const o = new THREE.Mesh(new THREE.SphereGeometry(1.6, 14, 10), mOlhoN); o.position.set(12.5, 8.2, s * 5); nfc.add(o); });
    const matsN = { p: new THREE.MeshPhysicalMaterial({ color: '#8a5e36', roughness: 0.6 }), j: new THREE.MeshPhysicalMaterial({ color: '#5a3c22', roughness: 0.6 }), pelo: mats.pelo };
    const pernasN = [];
    [1, -1].forEach((s) => {
      pernasN.push(perna(new V3(8, 3.5, s * 3), new V3(19, 0, s * 8), { f: 5.5, t: 4.5, ta: 2.5 }, s, [2, 1.3, 0.7, 0.5], matsN));   // pernas de cavar
      pernasN.push(perna(new V3(3, 3.3, s * 3.6), new V3(6, 0, s * 11), { f: 5, t: 5.2, ta: 2.8 }, s, [0.8, 0.55, 0.4], matsN));
      pernasN.push(perna(new V3(-1, 3.3, s * 3.8), new V3(-8, 0, s * 11), { f: 5.5, t: 6.5, ta: 3 }, s, [0.8, 0.55, 0.4], matsN));
    });
    pernasN.forEach((l) => ['troch', 'femur', 'tibia', 'tarsus'].forEach((k) => nfc.add(l[k])));
    const buraco = new THREE.Mesh(new THREE.CircleGeometry(9, 28), new THREE.MeshBasicMaterial({ color: '#2a1d10' }));
    buraco.rotation.x = -Math.PI / 2; buraco.position.set(-26, 0.25, 4); nf.add(buraco);
    const monte = shadowy(new THREE.Mesh(new THREE.TorusGeometry(10, 2.6, 8, 24), new THREE.MeshStandardMaterial({ color: '#6b4a2c', roughness: 1 })));
    monte.rotation.x = -Math.PI / 2; monte.position.copy(buraco.position).setY(0.8); monte.scale.z = 0.5; nf.add(monte);

    /* casca (exúvia) grudada num tronco */
    const ex = new THREE.Group(); ex.visible = false; raiz.add(ex);
    const tronco = shadowy(new THREE.Mesh(new THREE.CylinderGeometry(26, 32, 170, 20), new THREE.MeshStandardMaterial({ color: '#6a5038', roughness: 0.95 })));
    tronco.position.set(-30, 85, 0); ex.add(tronco);
    const mCasca = new THREE.MeshPhysicalMaterial({ color: '#c08a45', roughness: 0.35, clearcoat: 0.6, transparent: true, opacity: 0.78, envMapIntensity: 0.8 });
    const casca = nfc.clone(true);
    casca.traverse((o) => { if (o.isMesh) { o.material = mCasca; o.castShadow = true; } });
    const rasgo = new THREE.Mesh(new THREE.BoxGeometry(9, 0.25, 0.5), new THREE.MeshBasicMaterial({ color: '#3a2412' }));
    rasgo.position.set(4, 13.9, 0); casca.add(rasgo);
    // barriga encostada no tronco, costas para fora, cabeça para cima
    casca.quaternion.setFromAxisAngle(new V3(1, 0, 0), Math.PI).multiply(new THREE.Quaternion().setFromAxisAngle(new V3(0, 0, 1), -Math.PI / 2));
    casca.position.set(0.2, 40, 0); ex.add(casca);

    ctx.seguir = ad;
    S.raiz = raiz; S.ad = ad; S.corpo = corpo; S.nf = nf; S.ex = ex;
    S.voo = 0; S.alvoVoo = 0; S.canto = 0; S.aneis = [];
    return { grupo: raiz, raio: 34, centro: new V3(2, 8, 0) };
  }

  // asas: k = 0 (fechadas em telhado) → 1 (abertas para voar); bate = ângulo da batida
  function poseAsas(k, bate) {
    S.asas.forEach((w) => {
      const o = w.p.userData.ori, s = w.s;
      const fech = w.f ? -0.05 : -0.02, aberta = w.f ? 1.35 : 1.6;
      o.rotation.y = Math.PI + s * (fech + (aberta - fech) * k);          // aponta para trás e abre para o lado
      o.rotation.x = -s * (Math.PI / 2 + (0.62 - 0.62 * k));                // telhado inclinado → plana no voo
      o.rotation.z = 0;
      w.p.rotation.x = -s * bate;                                           // batida (sobe e desce)
    });
  }
  function cantar(ctx, b) {
    S.canto = S.canto > 0 ? 0 : 6;
    if (b) b.classList.toggle('on', S.canto > 0);
    if (S.canto > 0) { ctx.aviso('🎵 Só os machos cantam! (som imitado)'); somImitado(true); } else somImitado(false);
  }
  // zumbido imitado com Web Audio (não é gravação: aparece escrito "som imitado")
  function somImitado(on) {
    try {
      if (!on) { if (audio) { audio.g.gain.setTargetAtTime(0, audio.c.currentTime, 0.05); } return; }
      if (!audio) {
        const c = new (window.AudioContext || window.webkitAudioContext)();
        const len = c.sampleRate * 2, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
        const src = c.createBufferSource(); src.buffer = buf; src.loop = true;
        const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 4800; bp.Q.value = 3;
        const am = c.createGain(); am.gain.value = 0.5;
        const lfo = c.createOscillator(); lfo.frequency.value = 95; const lg = c.createGain(); lg.gain.value = 0.5;
        lfo.connect(lg); lg.connect(am.gain);
        const g = c.createGain(); g.gain.value = 0;
        src.connect(bp); bp.connect(am); am.connect(g); g.connect(c.destination);
        src.start(); lfo.start();
        audio = { c, g };
      }
      audio.c.resume && audio.c.resume();
      audio.g.gain.setTargetAtTime(0.12, audio.c.currentTime, 0.08);
    } catch (e) {}
  }
  function voar(ctx, b) {
    if (!S.ad.visible) { ctx.aviso('Só a adulta tem asas para voar!'); return; }
    S.alvoVoo = S.alvoVoo > 0 ? 0 : 1;
    if (b) b.classList.toggle('on', S.alvoVoo > 0);
  }

  const anelGeo = new THREE.RingGeometry(0.9, 1, 40);
  function update(dt, t, ctx) {
    if (!S.raiz) return;
    // voo: sobe, asas abrem e batem
    S.voo += (S.alvoVoo - S.voo) * Math.min(1, dt * 2.2);
    const alt = S.voo * 18;
    S.ad.position.y = alt + (S.voo > 0.05 ? Math.sin(t * 3) * 1.5 * S.voo : 0);
    S.ad.rotation.z = -0.08 * S.voo;
    poseAsas(Math.min(1, S.voo * 1.4), S.voo > 0.2 ? Math.sin(t * 60) * 0.7 * S.voo : 0);
    S.pernas.forEach((l) => {     // no voo as pernas se recolhem
      l.F.copy(l.F0).lerp(new V3(l.C.x - 2, 1.5, l.C.z + l.s * 3), S.voo);
      solveLeg(l, l.F);
    });
    // canto: tímbalos vibram e anéis de som saem da barriga
    if (S.canto > 0) {
      S.canto -= dt;
      S.abd.scale.set(1, 1 + Math.sin(t * 90) * 0.02, 1 + Math.sin(t * 90) * 0.03);
      if (Math.random() < dt * 5) {
        const r = new THREE.Mesh(anelGeo, new THREE.MeshBasicMaterial({ color: '#fff7c2', transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false }));
        r.position.copy(S.corpo.localToWorld(new V3(-2, 9, (Math.random() < 0.5 ? 1 : -1) * 8)));
        r.userData.t = 0; ctx.scene.add(r); S.aneis.push(r);
      }
      if (S.canto <= 0) { somImitado(false); ctx.marcar('cantar', false); }
    } else S.abd.scale.set(1, 1, 1);
    for (let i = S.aneis.length - 1; i >= 0; i--) {
      const r = S.aneis[i]; r.userData.t += dt;
      const k = r.userData.t; r.scale.setScalar(3 + k * 40); r.material.opacity = Math.max(0, 0.8 - k * 0.7);
      r.quaternion.copy(ctx.camera.quaternion);
      if (k > 1.15) { ctx.scene.remove(r); r.material.dispose(); S.aneis.splice(i, 1); }
    }
    // antenas e rostro mexendo de leve
    S.antenas.forEach((a, i) => { a.rotation.x += Math.sin(t * 2.3 + i) * 0.002; });
  }

  Modelos3D.cigarra = {
    cena: 'chao',
    formas: [{ id: 'adulta', nome: 'Adulta' }, { id: 'ninfa', nome: 'Ninfa' }, { id: 'casca', nome: 'Casca' }],
    acoes: [
      { id: 'cantar', ico: '🎵', rotulo: 'Cantar', fn: cantar },
      { id: 'voar', ico: '🪽', rotulo: 'Voar', fn: voar }
    ],
    construir,
    update,
    toque(ctx) { if (S.ad.visible && S.canto <= 0) cantar(ctx, document.querySelector('.acao[data-id="cantar"]')); },
    forma(id, ctx) {
      S.ad.visible = id === 'adulta'; S.nf.visible = id === 'ninfa'; S.ex.visible = id === 'casca';
      S.alvoVoo = 0; S.voo = 0; S.canto = 0; somImitado(false); ctx.marcar('cantar', false); ctx.marcar('voar', false);
      ctx.seguir = id === 'adulta' ? S.ad : null;
      if (id === 'casca') ctx.foco(new V3(8, 42, 0), 32); else ctx.foco(new V3(2, 8, 0), 34);
      if (id === 'ninfa') ctx.aviso('A ninfa vive anos debaixo da terra!');
      if (id === 'casca') ctx.aviso('Esta casca é a pele velha que a cigarra deixou no tronco.');
    },
    partes: [
      { nome: 'Olhos compostos', texto: 'Dois olhos grandes, feitos de milhares de olhinhos.', ponto: () => S.olhos[0].getWorldPosition(new V3()).add(new V3(0, 2, 2)) },
      { nome: 'Ocelos', texto: 'Três olhinhos brilhantes no alto da cabeça, que percebem a luz.', ponto: () => S.corpo.localToWorld(new V3(21.5, 14.5, 0)) },
      { nome: 'Antenas', texto: 'Curtinhas, como pelinhos na frente da cabeça.', ponto: () => S.corpo.localToWorld(new V3(28, 12.5, 6)) },
      { nome: 'Bico (rostro)', texto: 'Um bico fino que fura a planta para beber a seiva.', ponto: () => S.corpo.localToWorld(new V3(17, 2.5, 0)) },
      { nome: 'Tórax', texto: 'O "peito", onde ficam presas as asas e as pernas.', ponto: () => S.corpo.localToWorld(new V3(10, 17, 0)) },
      { nome: 'Tímbalos', texto: 'Duas "membranas-tambor" na barriga do macho: é daqui que sai o canto.', ponto: () => S.corpo.localToWorld(new V3(-2, 10, 8.5)) },
      { nome: 'Asas', texto: 'Quatro asas transparentes com nervuras, dobradas como um telhado.', ponto: () => S.corpo.localToWorld(new V3(-22, 15, 5)) },
      { nome: 'Patas', texto: 'Seis patas. As da frente são mais grossas.', ponto: () => S.corpo.localToWorld(new V3(22, 2, 9)) }
    ]
  };
})();
