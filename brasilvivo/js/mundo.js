/* =====================================================================
   Terra Codex · Brasil Vivo · mundo 3D do bioma ativo
   Terreno, vereda, Base Brasília, árvores do Cerrado, buritis, cupinzeiros,
   bichos (fase que anda), marcas de fase (ovos, ninhos, olheiros), moradores,
   Jardim Polinizador e dia/noite. Tudo vem do Registro. Metros, Y para cima.
   ===================================================================== */
const Mundo = (function () {
  const V3 = THREE.Vector3;
  const M = { bichos: [], marcas: [], npcs: [], companheiros: [], t: 20 };
  const TAM = 440, SEG = 88, RIO_X = 80, RIO_LARGURA = 14;
  let BIOMA = 'cerrado', AREAS = [];

  // altura do terreno: suave, com um morro na rota e a baixada da vereda
  function altura(x, z) {
    let h = Math.sin(x * 0.03) * 1.2 + Math.cos(z * 0.025 + 1) * 1.4 + Math.sin((x + z) * 0.05) * 0.5;
    const dx = x - RIO_X;
    if (Math.abs(dx) < RIO_LARGURA + 8) h -= 2.6 * (1 - Math.min(1, Math.abs(dx) / (RIO_LARGURA + 8)));
    const df = Math.hypot(x + 10, z + 130); h += 5 * Math.max(0, 1 - df / 70);
    return h;
  }
  function areaEm(x, z) {
    let melhor = null, dm = Infinity;
    AREAS.forEach((a) => { const d = Math.hypot(x - a.x, z - a.z); if (d < a.r && d < dm) { dm = d; melhor = a; } });
    return melhor;
  }
  const L = (cor) => new THREE.MeshLambertMaterial({ color: cor });

  function construir(scene, bioma) {
    M.scene = scene; BIOMA = bioma || 'cerrado'; AREAS = Registro.lista('areas', BIOMA);
    M.cor = {}; AREAS.forEach((a) => { M.cor[a.id] = Ruido.clareza(a.id); });

    // terreno com cor por vértice: cerrado seco fora das áreas, cinza (Ruído) → verde (Clareza) nas áreas
    const geo = new THREE.PlaneGeometry(TAM, TAM, SEG, SEG); geo.rotateX(-Math.PI / 2);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) p.setY(i, altura(p.getX(i), p.getZ(i)));
    geo.computeVertexNormals();
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(p.count * 3), 3));
    M.terreno = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true }));
    M.terreno.receiveShadow = true; scene.add(M.terreno);

    // vereda: o rio raso
    const rg = new THREE.PlaneGeometry(RIO_LARGURA * 2, TAM, 4, 60); rg.rotateX(-Math.PI / 2);
    const rp = rg.attributes.position;
    for (let i = 0; i < rp.count; i++) { rp.setX(i, rp.getX(i) + RIO_X + Math.sin(rp.getZ(i) * 0.04) * 5); rp.setY(i, altura(RIO_X, rp.getZ(i)) + 0.9); }
    M.rio = new THREE.Mesh(rg, new THREE.MeshPhongMaterial({ color: '#6c6f66', transparent: true, opacity: 0.85, shininess: 80 }));
    scene.add(M.rio);

    // Base Brasília: casas, lâmpada na parede, ipê grande
    [[-22, 10], [20, -26], [-16, -24], [28, 12]].forEach(([x, z]) => {
      const c = new THREE.Mesh(new THREE.BoxGeometry(9, 6, 8), L('#e8dcc3')); c.position.set(x, altura(x, z) + 3, z); c.castShadow = true; scene.add(c);
      const t = new THREE.Mesh(new THREE.ConeGeometry(7.5, 4, 4), L('#b8553b')); t.position.set(x, altura(x, z) + 8, z); t.rotation.y = Math.PI / 4; scene.add(t);
    });
    M.lampada = new THREE.Mesh(new THREE.SphereGeometry(0.45, 10, 8), new THREE.MeshBasicMaterial({ color: '#fff3c0' }));
    M.lampada.position.set(-19, altura(-22, 10) + 4.6, 14.3); scene.add(M.lampada);
    M.ipe = arvore(0, 30, 9, '#f5c451', '#6b4a2c'); scene.add(M.ipe);

    // árvores do Cerrado: troncos tortos e copas baixas e largas (instâncias)
    const o = new THREE.Object3D(); M.arvPos = [];
    const nA = 110, copa = new THREE.InstancedMesh(new THREE.SphereGeometry(2.8, 9, 7), L('#4f6a2c'), nA);
    const tronco = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.3, 0.55, 5.5, 6), L('#4a3420'), nA);
    for (let i = 0; i < nA; i++) {
      let x, z;
      if (i < 45) { const a = Math.random() * 6.28, r = 10 + Math.sqrt(Math.random()) * 42; x = -10 + Math.cos(a) * r; z = -130 + Math.sin(a) * r; }
      else { x = (Math.random() - 0.5) * TAM * 0.9; z = (Math.random() - 0.5) * TAM * 0.9; }
      if (Math.hypot(x, z) < 50 || Math.abs(x - RIO_X) < 20 || AREAS.some((a) => a.id !== 'rota' && Math.hypot(x - a.x, z - a.z) < a.r)) { x = 195; z = -195; }
      const h = altura(x, z), s = 0.7 + Math.random() * 0.7;
      o.position.set(x, h + 2.7 * s, z); o.scale.setScalar(s); o.rotation.set((Math.random() - 0.5) * 0.4, Math.random() * 6, (Math.random() - 0.5) * 0.4); o.updateMatrix(); tronco.setMatrixAt(i, o.matrix);
      o.position.y = h + 6.2 * s; o.rotation.set(0, Math.random() * 6, 0); o.scale.set(s, s * 0.55, s); o.updateMatrix(); copa.setMatrixAt(i, o.matrix);
      M.arvPos.push([x, z, 1.1 * s]);
    }
    copa.castShadow = true; scene.add(copa, tronco);

    // buritis ao longo da vereda
    for (let i = 0; i < 16; i++) {
      const z = -150 + i * 22 + Math.random() * 8, lado = i % 2 ? 1 : -1, x = RIO_X + Math.sin(z * 0.04) * 5 + lado * (RIO_LARGURA + 4 + Math.random() * 5);
      const g = buriti(); g.position.set(x, altura(x, z), z); scene.add(g); M.arvPos.push([x, z, 0.8]);
    }
    // cupinzeiros no campo
    const nC = 26, cup = new THREE.InstancedMesh(new THREE.ConeGeometry(1.4, 3.4, 7), L('#a8683c'), nC);
    for (let i = 0; i < nC; i++) {
      const a = Math.random() * 6.28, r = 20 + Math.random() * 170; let x = Math.cos(a) * r, z = Math.sin(a) * r;
      if (Math.abs(x - RIO_X) < 22 || AREAS.some((ar) => ar.id !== 'rota' && Math.hypot(x - ar.x, z - ar.z) < ar.r + 4)) { x = -190; z = 190; }
      const s = 0.6 + Math.random() * 0.8; o.position.set(x, altura(x, z) + 1.4 * s, z); o.scale.set(s, s, s); o.rotation.set(0, Math.random() * 6, 0); o.updateMatrix(); cup.setMatrixAt(i, o.matrix);
      M.arvPos.push([x, z, 1.2 * s]);
    }
    scene.add(cup);

    // horta comunitária: canteiros com flores
    const H = Registro.area('horta');
    if (H) for (let i = 0; i < 4; i++) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(10, 0.8, 2.4), L('#5a4430')); b.position.set(H.x + (i % 2) * 13 - 6, altura(H.x, H.z) + 0.4, H.z - 8 + Math.floor(i / 2) * 8); scene.add(b);
      for (let k = 0; k < 6; k++) { const f = new THREE.Mesh(new THREE.SphereGeometry(0.45, 8, 6), L(['#f5c451', '#e5533d', '#f28fc0'][k % 3])); f.position.set(-4 + k * 1.6, 0.9, 0); b.add(f); }
    }

    // Jardim Polinizador: cerca baixa e flores fechadas (abrem com a Clareza)
    const J = Registro.area('jardim'); M.flores = [];
    if (J) {
      const cerca = new THREE.Mesh(new THREE.TorusGeometry(J.r - 6, 0.25, 6, 48), L('#8a6a44')); cerca.rotation.x = Math.PI / 2; cerca.position.set(J.x, altura(J.x, J.z) + 0.9, J.z); scene.add(cerca);
      for (let i = 0; i < 28; i++) {
        const a = Math.random() * 6.28, r = Math.sqrt(Math.random()) * (J.r - 9), x = J.x + Math.cos(a) * r, z = J.z + Math.sin(a) * r;
        const g = new THREE.Group(); g.position.set(x, altura(x, z), z);
        const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.4, 5), L('#6b7f4a')); haste.position.y = 0.7; g.add(haste);
        const botao = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.7, 6), L('#8e8e86')); botao.position.y = 1.6; g.add(botao);
        scene.add(g); M.flores.push({ g, botao, cor: ['#f5c451', '#e5533d', '#f28fc0', '#b48ae8'][i % 4] });
      }
      M.placaJardim = { pos: new V3(J.x - J.r + 4, altura(J.x - J.r + 4, J.z), J.z), area: J };
      const placa = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.4, 0.2), L('#c9a66b')); placa.position.copy(M.placaJardim.pos).add(new V3(0, 1.6, 0)); placa.rotation.y = Math.PI / 2; scene.add(placa);
    }

    // seres vivos: a fase que anda circula pela área; as outras ficam marcadas no mapa
    Registro.lista('especies', BIOMA).forEach((e) => {
      const area = Registro.area(e.area), anda = e.fases.find((f) => f.anda);
      if (anda && area) for (let k = 0; k < 2; k++) M.bichos.push(bicho(e, anda, area));
      e.fases.filter((f) => f.ponto).forEach((f) => M.marcas.push(marca(e, f)));
    });
    Registro.lista('npcs', BIOMA).forEach((n) => M.npcs.push(npc(n)));

    // luzes
    M.sol = new THREE.DirectionalLight('#fff1d8', 1.2); M.sol.castShadow = true; M.sol.shadow.mapSize.set(1024, 1024);
    Object.assign(M.sol.shadow.camera, { left: -90, right: 90, top: 90, bottom: -90, near: 1, far: 400 });
    M.hemi = new THREE.HemisphereLight('#cfe3ff', '#5c5240', 0.7);
    scene.add(M.sol, M.sol.target, M.hemi);
    scene.fog = new THREE.Fog('#a9b7b8', 70, 280); scene.background = new THREE.Color('#a9b7b8');
    pintar(0, true);
    return M;
  }

  function arvore(x, z, s, corCopa, corTronco) {
    const g = new THREE.Group(); g.position.set(x, altura(x, z), z);
    const t = new THREE.Mesh(new THREE.CylinderGeometry(0.6 * s / 4, 0.9 * s / 4, s, 7), L(corTronco)); t.position.y = s / 2; g.add(t);
    const c = new THREE.Mesh(new THREE.SphereGeometry(s * 0.75, 12, 10), L(corCopa)); c.position.y = s * 1.1; c.scale.y = 0.8; g.add(c);
    return g;
  }
  function buriti() {
    const g = new THREE.Group(), h = 9 + Math.random() * 4;
    const t = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, h, 7), L('#7a6248')); t.position.y = h / 2; g.add(t);
    const folha = L('#5e8a3a');
    for (let i = 0; i < 9; i++) { const f = new THREE.Mesh(new THREE.ConeGeometry(0.9, 4.2, 4), folha); const a = i / 9 * 6.28; f.position.set(Math.cos(a) * 1.6, h + 0.4, Math.sin(a) * 1.6); f.rotation.set(Math.sin(a) * 1.2, 0, -Math.cos(a) * 1.2); g.add(f); }
    return g;
  }
  // forma simples por tipo de bicho (os modelos detalhados entram na BioDex 3D)
  function bicho(e, fase, area) {
    const g = new THREE.Group(), cor = fase.cor || '#888';
    const corpo = new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 10), L(cor)); corpo.scale.set(1.5, 0.75, 0.9); corpo.position.y = 0.6; g.add(corpo);
    const cab = new THREE.Mesh(new THREE.SphereGeometry(0.32, 10, 8), L(cor)); cab.position.set(0.8, 0.7, 0); g.add(cab);
    if (fase.voa) { const asa = new THREE.MeshLambertMaterial({ color: cor, transparent: true, opacity: 0.8, side: THREE.DoubleSide }); g.userData.asas = [-1, 1].map((s) => { const a = new THREE.Mesh(new THREE.CircleGeometry(0.8, 10), asa); a.position.set(0, 0.9, s * 0.5); a.rotation.x = Math.PI / 2; g.add(a); return a; }); }
    const brilho = new THREE.Mesh(new THREE.OctahedronGeometry(0.35, 0), new THREE.MeshBasicMaterial({ color: '#fff3a0' })); brilho.position.y = 2.2; brilho.visible = false; g.add(brilho);
    const a = Math.random() * 6.28, d = 6 + Math.random() * (area.r - 12);
    g.position.set(area.x + Math.cos(a) * d, 0, area.z + Math.sin(a) * d); g.position.y = altura(g.position.x, g.position.z);
    M.scene.add(g);
    // relação que este bicho mostra quando "age" (prova ver-acao na área dele)
    const rel = Registro.relacoesDe(e.id).find((r) => r.prova && r.prova.tipo === 'ver-acao' && r.prova.area === area.id) || null;
    return { especie: e, fase, mesh: g, pos: g.position, area, alvo: null, espera: Math.random() * 3, brilho, rel, agindo: 0, proxAcao: 6 + Math.random() * 10 };
  }
  function marca(e, f) {
    const g = new THREE.Group(), [x, z] = f.ponto;
    if (f.marca === 'tronco') {
      const t = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.1, 3.2, 8), L('#6b4a2c')); t.position.y = 1.6; g.add(t);
      const tubo = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 0.5, 6), L('#e8c26a')); tubo.rotation.z = Math.PI / 2; tubo.position.set(1.1, 2.1, 0); g.add(tubo);
    } else if (f.marca === 'olheiro') {
      for (let i = 0; i < 5; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.9, 8, 6, 0, 6.28, 0, 1.4), L('#b0764a')); m.position.set(Math.cos(i * 1.3) * 2, 0, Math.sin(i * 1.3) * 2); m.scale.y = 0.5; g.add(m); }
    } else if (f.marca === 'parede') {
      [-0.18, 0.18].forEach((dx) => { const ov = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), L(f.cor || '#f3ead6')); ov.position.set(dx, 1.2, 0); g.add(ov); });
    } else {
      const ov = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 10), L(f.cor || '#f3e6c9')); ov.scale.y = 1.25; ov.position.y = 0.7; g.add(ov);
      const folha = new THREE.Mesh(new THREE.CircleGeometry(1.1, 8), L('#5e8a3a')); folha.rotation.x = -Math.PI / 2; folha.position.y = 0.12; g.add(folha);
    }
    g.position.set(x, altura(x, z), z); M.scene.add(g);
    return { especie: e, fase: f, mesh: g, pos: g.position };
  }
  function npc(n) {
    const g = new THREE.Group();
    const corpo = new THREE.Mesh(new THREE.CapsuleGeometry(0.7, 1.6, 4, 8), L(n.cor)); corpo.position.y = 1.5; g.add(corpo);
    const cab = new THREE.Mesh(new THREE.SphereGeometry(0.6, 10, 8), L('#e8c39e')); cab.position.y = 2.9; g.add(cab);
    g.position.set(n.x, altura(n.x, n.z), n.z); M.scene.add(g);
    return { dado: n, mesh: g, pos: g.position };
  }

  // pinta o terreno pela Clareza de cada área (transição suave quando ela muda)
  const cCinza = new THREE.Color('#55564f'), cVerde = new THREE.Color('#3d7a2c'), cCerrado = new THREE.Color('#77702f'), cTerra = new THREE.Color('#5e4a2c'), tmp = new THREE.Color(), tmpA = new THREE.Color();
  function pintar(dt, forcar) {
    let mudou = !!forcar;
    AREAS.forEach((a) => { const alvo = Ruido.clareza(a.id); if (Math.abs(M.cor[a.id] - alvo) > 0.002) { M.cor[a.id] += (alvo - M.cor[a.id]) * Math.min(1, dt * 0.8); mudou = true; } });
    if (!mudou) return;
    const geo = M.terreno.geometry, p = geo.attributes.position, c = geo.attributes.color;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i), v = (Math.sin(x * 0.4) * Math.cos(z * 0.37) + 1) * 0.5;
      tmp.copy(cCerrado).lerp(cTerra, v * 0.3);
      AREAS.forEach((a) => {
        const d = Math.hypot(x - a.x, z - a.z); if (d > a.r + 12) return;
        const w = Math.min(1, (a.r + 12 - d) / 14);
        tmpA.copy(cCinza).lerp(cVerde, M.cor[a.id] * (0.75 + v * 0.25));
        tmp.lerp(tmpA, w);
      });
      c.setXYZ(i, tmp.r, tmp.g, tmp.b);
    }
    c.needsUpdate = true;
    const kv = M.cor.vereda; if (kv !== undefined) M.rio.material.color.copy(new THREE.Color('#6c6f66')).lerp(new THREE.Color('#4fa3d8'), kv);
    const kj = M.cor.jardim; if (kj !== undefined) M.flores.forEach((f, i) => { const aberta = kj >= 0.5 - i * 0.004; f.botao.material.color.set(aberta ? f.cor : '#8e8e86'); f.botao.scale.set(aberta ? 1.8 : 1, aberta ? 0.6 : 1, aberta ? 1.8 : 1); });
  }

  // dia e noite: 200 s por dia; noite ≈ 30%
  function diaNoite(t) {
    const ang = ((t / 200) % 1) * Math.PI * 2;
    M.sol.position.set(Math.cos(ang) * 120, Math.sin(ang) * 120, 40); M.sol.position.add(M.jogadorPos || new V3());
    M.sol.target.position.copy(M.jogadorPos || new V3());
    const dia = Math.max(0, (Math.sin(ang) + 0.55) / 1.55);
    M.sol.intensity = 0.2 + dia * 0.95; M.hemi.intensity = 0.25 + dia * 0.42;
    const ceu = new THREE.Color('#1d2440').lerp(new THREE.Color('#a9c6d8'), dia);
    M.scene.background.copy(ceu); M.scene.fog.color.copy(ceu);
    M.noite = dia <= 0; M.hora = M.noite ? '🌙' : dia < 0.4 ? '🌅' : '☀️';
    M.lampada.material.color.set(M.noite ? '#fff3c0' : '#b9b3a0');
    return M.noite;
  }

  // bicho que cresceu no Ninho acompanha o jogador até ser ativado no mundo
  function companheiro(especieId) {
    if (M.companheiros.some((c) => c.id === especieId)) return;
    const e = Registro.especie(especieId), f = e.fases.find((x) => x.anda) || e.fases[e.fases.length - 1];
    const g = new THREE.Group();
    const corpo = new THREE.Mesh(new THREE.SphereGeometry(0.6, 12, 10), L(f.cor || '#888')); corpo.scale.set(1.4, 0.8, 0.9); corpo.position.y = 0.7; g.add(corpo);
    g.position.copy(M.jogadorPos || new V3()); M.scene.add(g);
    M.companheiros.push({ id: especieId, voa: !!f.voa, mesh: g, pos: g.position, texto: f.emoji + ' ' + e.nome, fase: Math.random() * 6 });
  }

  function update(dt, jogador) {
    M.t += dt; M.jogadorPos = jogador;
    const noite = diaNoite(M.t); M.chuva = Math.sin(M.t / 45) > 0.35;
    M.bichos.forEach((b) => {
      const hora = b.especie.hora || ['dia'];
      // o Ruído esconde os bichos da área enquanto a Clareza estiver baixa
      b.mesh.visible = hora.includes(noite ? 'noite' : 'dia') && Ruido.clareza(b.area.id) >= 0.5;
      if (!b.mesh.visible) { b.agindo = 0; b.brilho.visible = false; return; }
      if (b.mesh.userData.asas) b.mesh.userData.asas.forEach((a, i) => { a.rotation.x = Math.PI / 2 + (i ? 1 : -1) * Math.sin(M.t * 14) * 0.6; });
      b.brilho.rotation.y += dt * 3;
      // de tempos em tempos, o bicho para e mostra o que faz no ecossistema
      if (b.rel) {
        if (b.agindo > 0) { b.agindo -= dt; b.brilho.visible = true; b.pos.y = altura(b.pos.x, b.pos.z) + (b.fase.voa ? 1.2 : 0); return; }
        b.brilho.visible = false; b.proxAcao -= dt;
        if (b.proxAcao <= 0) { b.agindo = 9; b.proxAcao = 14 + Math.random() * 10; b.alvo = null; return; }
      }
      b.espera -= dt;
      if (b.espera <= 0) { b.espera = 2 + Math.random() * 4; const a = Math.random() * 6.28, d = 6 + Math.random() * (b.area.r - 12); b.alvo = new V3(b.area.x + Math.cos(a) * d, 0, b.area.z + Math.sin(a) * d); }
      if (b.alvo) { const dir = new V3().subVectors(b.alvo, b.pos); dir.y = 0; if (dir.length() < 1) b.alvo = null; else { dir.normalize(); b.pos.addScaledVector(dir, dt * 2.5); b.mesh.rotation.y = Math.atan2(dir.x, dir.z) - Math.PI / 2; } }
      b.pos.y = altura(b.pos.x, b.pos.z) + (b.fase.voa ? 1.5 + Math.sin(M.t * 3 + b.espera) * 0.4 : 0);
    });
    const ninho = Estado.dados.ninho;
    M.marcas.forEach((m) => { if (m.fase.ninho) m.mesh.visible = !ninho.some((n) => Registro.ciclo(n.ciclo).especie === m.especie.id); });
    M.companheiros.forEach((c, i) => {
      const alvo = new V3(jogador.x - Math.sin(c.fase) * 3, 0, jogador.z - Math.cos(c.fase) * 3 - 2);
      const dir = new V3().subVectors(alvo, c.pos); dir.y = 0; const d = dir.length();
      if (d > 1.2) { dir.normalize(); c.pos.addScaledVector(dir, dt * Math.min(12, d * 3)); c.mesh.rotation.y = Math.atan2(dir.x, dir.z); }
      c.pos.y = altura(c.pos.x, c.pos.z) + (c.voa ? 2 + Math.sin(M.t * 4 + i) * 0.4 : Math.abs(Math.sin(M.t * 8 + i)) * 0.3 * (d > 1.2 ? 1 : 0));
    });
    pintar(dt);
  }

  return { construir, update, altura, areaEm, companheiro, M, RIO_X, RIO_LARGURA };
})();
