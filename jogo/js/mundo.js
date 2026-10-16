/* =====================================================================
   Terra Codex · mundo 3D: terreno, rio, vila, floresta, bichos, Ruidosos,
   obras e ciclo de dia e noite. Unidades: metros. Y para cima.
   ===================================================================== */
const Mundo = (function () {
  const V3 = THREE.Vector3;
  const M = { bichos: [], ruidosos: [], npcs: [], obras: {}, pegadas: [], arvores: null, t: 20 };
  const TAM = 440, SEG = 88;

  // altura do terreno: suave, com um morro na floresta e uma baixada no rio
  function altura(x, z) {
    let h = Math.sin(x * 0.03) * 1.2 + Math.cos(z * 0.025 + 1) * 1.4 + Math.sin((x + z) * 0.05) * 0.5;
    const dx = x - RIO_X;
    if (Math.abs(dx) < RIO_LARGURA + 8) h -= 2.6 * (1 - Math.min(1, Math.abs(dx) / (RIO_LARGURA + 8)));   // leito
    const df = Math.hypot(x + 10, z + 130); h += 6 * Math.max(0, 1 - df / 70);                                 // morro da floresta
    const dt = Math.hypot(x - 150, z + 130); h += 4 * Math.max(0, 1 - dt / 50);                                // toca
    return h;
  }
  function regiaoEm(x, z) {
    let melhor = null, dm = Infinity;
    REGIOES.forEach((r) => { const d = Math.hypot(x - r.x, z - r.z); if (d < r.r && d < dm) { dm = d; melhor = r; } });
    return melhor;
  }
  // nível de Ruído num ponto: região ou distância da vila
  function ruidoEm(x, z, estado) {
    const r = regiaoEm(x, z);
    if (r) return estado.restaurada[r.id] ? 0 : r.ruido;
    const d = Math.hypot(x, z);
    return d < 70 ? 0 : d < 140 ? 1 : 2;
  }

  function construir(scene, estado) {
    M.scene = scene; M.estado = estado;
    M.restCor = {}; REGIOES.forEach((r) => { M.restCor[r.id] = estado.restaurada[r.id] ? 1 : 0; });
    // terreno com cor por vértice (cinza = Ruído, verde = restaurado)
    const geo = new THREE.PlaneGeometry(TAM, TAM, SEG, SEG); geo.rotateX(-Math.PI / 2);
    const p = geo.attributes.position, cores = new Float32Array(p.count * 3);
    for (let i = 0; i < p.count; i++) p.setY(i, altura(p.getX(i), p.getZ(i)));
    geo.computeVertexNormals();
    geo.setAttribute('color', new THREE.BufferAttribute(cores, 3));
    M.terreno = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true }));
    M.terreno.receiveShadow = true; scene.add(M.terreno);
    M.cor = new Float32Array(p.count);   // 0 cinza → 1 verde, por vértice
    pintar(0);

    // rio
    const rg = new THREE.PlaneGeometry(RIO_LARGURA * 2, TAM, 4, 60); rg.rotateX(-Math.PI / 2);
    const rp = rg.attributes.position;
    for (let i = 0; i < rp.count; i++) { rp.setX(i, rp.getX(i) + RIO_X + Math.sin(rp.getZ(i) * 0.04) * 5); rp.setY(i, altura(RIO_X, rp.getZ(i)) + 0.9); }
    M.rio = new THREE.Mesh(rg, new THREE.MeshPhongMaterial({ color: '#6c6f66', transparent: true, opacity: 0.85, shininess: 80 }));
    scene.add(M.rio);

    // vila: casas, ipê grande
    const mCasa = new THREE.MeshLambertMaterial({ color: '#e8dcc3' }), mTelha = new THREE.MeshLambertMaterial({ color: '#b8553b' });
    [[-22, 10], [20, -26], [-16, -24], [28, 12]].forEach(([x, z]) => {
      const c = new THREE.Mesh(new THREE.BoxGeometry(9, 6, 8), mCasa); c.position.set(x, altura(x, z) + 3, z); c.castShadow = true; scene.add(c);
      const t = new THREE.Mesh(new THREE.ConeGeometry(7.5, 4, 4), mTelha); t.position.set(x, altura(x, z) + 8, z); t.rotation.y = Math.PI / 4; scene.add(t);
    });
    M.ipe = arvore(0, 30, 9, '#f5c451', '#6b4a2c'); scene.add(M.ipe);

    // floresta e árvores soltas (instâncias)
    const nA = 140, copa = new THREE.InstancedMesh(new THREE.ConeGeometry(4, 9, 7), new THREE.MeshLambertMaterial({ color: '#7a8a6e' }), nA);
    const tronco = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.5, 0.8, 5, 6), new THREE.MeshLambertMaterial({ color: '#5b4128' }), nA);
    const o = new THREE.Object3D(); M.arvPos = [];
    for (let i = 0; i < nA; i++) {
      let x, z;
      if (i < 90) { const a = Math.random() * 6.28, r = Math.sqrt(Math.random()) * 46; x = -10 + Math.cos(a) * r; z = -130 + Math.sin(a) * r; }
      else { x = (Math.random() - 0.5) * TAM * 0.9; z = (Math.random() - 0.5) * TAM * 0.9; if (Math.hypot(x, z) < 50 || Math.abs(x - RIO_X) < 20) { x = 190; z = -190; } }
      const h = altura(x, z), s = 0.7 + Math.random() * 0.8;
      o.position.set(x, h + 2.5 * s, z); o.scale.setScalar(s); o.rotation.y = Math.random() * 6; o.updateMatrix(); tronco.setMatrixAt(i, o.matrix);
      o.position.y = h + 9 * s; o.updateMatrix(); copa.setMatrixAt(i, o.matrix);
      M.arvPos.push([x, z, 1.4 * s]);
    }
    copa.castShadow = true; scene.add(copa, tronco); M.copas = copa;
    // pedras
    const nP = 60, pedra = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1.6, 0), new THREE.MeshLambertMaterial({ color: '#8a8578' }), nP);
    for (let i = 0; i < nP; i++) { const x = (Math.random() - 0.5) * TAM * 0.9, z = (Math.random() - 0.5) * TAM * 0.9; o.position.set(x, altura(x, z) + 0.6, z); o.scale.set(1 + Math.random(), 0.7, 1 + Math.random()); o.rotation.y = Math.random() * 6; o.updateMatrix(); pedra.setMatrixAt(i, o.matrix); }
    scene.add(pedra);
    // horta: canteiros
    M.canteiros = new THREE.Group();
    for (let i = 0; i < 4; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(10, 0.8, 2.4), new THREE.MeshLambertMaterial({ color: '#7d6b57' })); b.position.set(-85 + (i % 2) * 13 - 6, altura(-85, 70) + 0.4, 62 + Math.floor(i / 2) * 8); M.canteiros.add(b); }
    scene.add(M.canteiros);
    // toca do Devorador: círculo escuro e pilares
    const toca = new THREE.Group();
    const chao = new THREE.Mesh(new THREE.CircleGeometry(16, 32), new THREE.MeshLambertMaterial({ color: '#2b2233' })); chao.rotation.x = -Math.PI / 2; chao.position.set(150, altura(150, -130) + 0.3, -130); toca.add(chao);
    for (let i = 0; i < 6; i++) { const a = i / 6 * 6.28; const pl = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.4, 10, 6), new THREE.MeshLambertMaterial({ color: '#3b2f4a' })); pl.position.set(150 + Math.cos(a) * 14, altura(150, -130) + 5, -130 + Math.sin(a) * 14); toca.add(pl); }
    M.olho = new THREE.Mesh(new THREE.SphereGeometry(4, 20, 14), new THREE.MeshPhongMaterial({ color: '#5a3a7a', emissive: '#30124a', transparent: true, opacity: 0.85 })); M.olho.position.set(150, altura(150, -130) + 8, -130); toca.add(M.olho);
    scene.add(toca); M.toca = toca;

    // bichos, Ruidosos, NPCs, pegadas, obras
    CARTAS.forEach((c) => { const r = REGIOES.find((x) => x.id === c.regiao); for (let k = 0; k < 2; k++) M.bichos.push(bicho(c, r)); });
    Object.keys(RUIDOSOS).forEach((id) => RUIDOSOS[id].regioes.forEach((rid) => M.ruidosos.push(ruidoso(id, REGIOES.find((x) => x.id === rid)))));
    NPCS.forEach((n) => M.npcs.push(npc(n)));
    PEGADAS.forEach((pg) => { const m = new THREE.Mesh(new THREE.CircleGeometry(1.2, 10), new THREE.MeshBasicMaterial({ color: '#5a4630' })); m.rotation.x = -Math.PI / 2; m.position.set(pg.x, altura(pg.x, pg.z) + 0.15, pg.z); scene.add(m); M.pegadas.push({ dado: pg, mesh: m, pos: m.position }); });
    OBRAS.forEach((ob) => { const g = new THREE.Group(); g.position.set(ob.x, altura(ob.x, ob.z), ob.z); const base = new THREE.Mesh(new THREE.RingGeometry(3, 3.6, 24), new THREE.MeshBasicMaterial({ color: '#f5c451', side: THREE.DoubleSide })); base.rotation.x = -Math.PI / 2; base.position.y = 0.2; g.add(base); scene.add(g); M.obras[ob.id] = { dado: ob, grupo: g, base, pos: g.position }; if (estado.obras[ob.id]) montarObra(ob.id); });

    // ovos para o Ninho
    M.ovos = OVOS.map((ov) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.7, 12, 10), new THREE.MeshLambertMaterial({ color: ov.id === 'sapo' ? '#9ec5e8' : ov.id === 'borboleta' ? '#f2d24b' : '#f3e6c9' })); m.scale.y = 1.25; m.position.set(ov.x, altura(ov.x, ov.z) + 0.8, ov.z); scene.add(m); return { dado: ov, mesh: m, pos: m.position }; });
    M.companheiros = [];
    // luzes
    M.sol = new THREE.DirectionalLight('#fff1d8', 1.2); M.sol.castShadow = true; M.sol.shadow.mapSize.set(1024, 1024);
    Object.assign(M.sol.shadow.camera, { left: -90, right: 90, top: 90, bottom: -90, near: 1, far: 400 });
    M.hemi = new THREE.HemisphereLight('#cfe3ff', '#5c5240', 0.7);
    scene.add(M.sol, M.sol.target, M.hemi);
    scene.fog = new THREE.Fog('#8c938a', 60, 260); scene.background = new THREE.Color('#8c938a');
    pintar(0);
    return M;
  }

  function arvore(x, z, s, corCopa, corTronco) {
    const g = new THREE.Group(); g.position.set(x, altura(x, z), z);
    const t = new THREE.Mesh(new THREE.CylinderGeometry(0.6 * s / 4, 0.9 * s / 4, s, 7), new THREE.MeshLambertMaterial({ color: corTronco })); t.position.y = s / 2; g.add(t);
    const c = new THREE.Mesh(new THREE.SphereGeometry(s * 0.75, 12, 10), new THREE.MeshLambertMaterial({ color: corCopa })); c.position.y = s * 1.1; c.scale.y = 0.8; g.add(c);
    g.userData.copa = c; return g;
  }
  function bicho(carta, r) {
    const g = new THREE.Group();
    const cores = { Polinizador: '#f0c040', Construtor: '#b05a3a', Caçador: '#444', Decompositor: '#b08a60', Vigia: '#8aa06a', Planta: '#4a9a4a' };
    const corpo = new THREE.Mesh(new THREE.SphereGeometry(0.9, 12, 10), new THREE.MeshLambertMaterial({ color: cores[carta.tipo] || '#888' })); corpo.scale.set(1.3, 0.8, 1); corpo.position.y = 0.8; g.add(corpo);
    const cab = new THREE.Mesh(new THREE.SphereGeometry(0.5, 10, 8), corpo.material); cab.position.set(1.1, 1, 0); g.add(cab);
    if (carta.id === 'ipe') { g.add(arvore(0, 0, 5, '#f5c451', '#6b4a2c')); corpo.visible = cab.visible = false; }
    const a = Math.random() * 6.28, d = 8 + Math.random() * (r.r - 14);
    g.position.set(r.x + Math.cos(a) * d, 0, r.z + Math.sin(a) * d); g.position.y = altura(g.position.x, g.position.z);
    M.scene.add(g);
    return { carta, mesh: g, pos: g.position, regiao: r, alvo: null, espera: Math.random() * 3, fixo: carta.id === 'ipe' };
  }
  function ruidoso(id, r) {
    const d = RUIDOSOS[id];
    const g = new THREE.Group();
    const m = new THREE.MeshPhongMaterial({ color: '#3a2a4a', emissive: '#1a0a2a', transparent: true, opacity: 0.75 });
    for (let i = 0; i < 4; i++) { const s = new THREE.Mesh(new THREE.SphereGeometry(1.2 - i * 0.15, 10, 8), m); s.position.set(Math.sin(i * 2) * 0.8, 1.2 + i * 0.9, Math.cos(i * 2) * 0.8); g.add(s); }
    const a = Math.random() * 6.28, dd = 10 + Math.random() * (r.r - 16);
    g.position.set(r.x + Math.cos(a) * dd, 0, r.z + Math.sin(a) * dd); g.position.y = altura(g.position.x, g.position.z);
    M.scene.add(g);
    return { id, dado: d, mesh: g, pos: g.position, regiao: r, alvo: null, espera: 1, dormindo: 0 };
  }
  function npc(n) {
    const g = new THREE.Group();
    const corpo = new THREE.Mesh(new THREE.CapsuleGeometry(0.7, 1.6, 4, 8), new THREE.MeshLambertMaterial({ color: n.cor })); corpo.position.y = 1.5; g.add(corpo);
    const cab = new THREE.Mesh(new THREE.SphereGeometry(0.6, 10, 8), new THREE.MeshLambertMaterial({ color: '#e8c39e' })); cab.position.y = 2.9; g.add(cab);
    g.position.set(n.x, altura(n.x, n.z), n.z); M.scene.add(g);
    return { dado: n, mesh: g, pos: g.position };
  }
  // a obra construída aparece no mapa
  function montarObra(id) {
    const ob = M.obras[id]; if (!ob || ob.pronta) return; ob.pronta = true; ob.base.visible = false;
    const g = ob.grupo, L = THREE.MeshLambertMaterial;
    if (id === 'horta') { M.canteiros.children.forEach((b) => { b.material = new L({ color: '#4a3a28' }); for (let i = 0; i < 5; i++) { const pl = new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 6), new L({ color: i % 2 ? '#4caf50' : '#e5533d' })); pl.position.set(-4 + i * 2, 1, 0); b.add(pl); } }); }
    if (id === 'ponte') { const t = new THREE.Mesh(new THREE.BoxGeometry(RIO_LARGURA * 2 + 10, 0.6, 4), new L({ color: '#8a5a2b' })); t.position.y = 2.2; g.add(t); [-1, 1].forEach((s) => { const c = new THREE.Mesh(new THREE.BoxGeometry(RIO_LARGURA * 2 + 10, 0.2, 0.2), new L({ color: '#6b4a2c' })); c.position.set(0, 3.2, s * 1.9); g.add(c); }); }
    if (id === 'filtro') { const c = new THREE.Mesh(new THREE.CylinderGeometry(2, 2.4, 3, 10), new L({ color: '#9ec5e8' })); c.position.y = 1.5; g.add(c); M.rio.material.color.set('#4fa3d8'); }
    if (id === 'abrigo') { const t = new THREE.Mesh(new THREE.ConeGeometry(4, 4, 4), new L({ color: '#6b8e5a' })); t.position.y = 2.5; t.rotation.y = 0.78; g.add(t); }
    if (id === 'trilha') { for (let i = 0; i < 8; i++) { const p = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.2, 1.2), new L({ color: '#c9a66b' })); p.position.set(0, 0.2, 2 + i * 2.2); g.add(p); } }
    if (id === 'laboratorio') { const c = new THREE.Mesh(new THREE.BoxGeometry(8, 5, 7), new L({ color: '#dfe9d9' })); c.position.y = 2.5; g.add(c); const d = new THREE.Mesh(new THREE.SphereGeometry(3.2, 14, 10, 0, 6.28, 0, 1.57), new L({ color: '#9ec5e8' })); d.position.y = 5; g.add(d); }
  }
  // restaura a região: a cor volta aos poucos (ver update)
  function restaurar(id) { M.estado.restaurada[id] = true; }

  // pinta o terreno conforme restCor de cada região
  const cCinza = new THREE.Color('#8b8f82'), cVerde = new THREE.Color('#6fae57'), cTerra = new THREE.Color('#8a7a5a'), tmp = new THREE.Color();
  function pintar(dt) {
    let mudou = !dt;
    REGIOES.forEach((r) => { const alvo = M.estado.restaurada[r.id] ? 1 : 0; if (Math.abs(M.restCor[r.id] - alvo) > 0.002) { M.restCor[r.id] += (alvo - M.restCor[r.id]) * Math.min(1, dt * 0.8); mudou = true; } });
    if (!mudou) return;
    const geo = M.terreno.geometry, p = geo.attributes.position, c = geo.attributes.color;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i); let k = 0;
      REGIOES.forEach((r) => { const d = Math.hypot(x - r.x, z - r.z); if (d < r.r + 12) k = Math.max(k, M.restCor[r.id] * Math.min(1, (r.r + 12 - d) / 14)); });
      const v = (Math.sin(x * 0.4) * Math.cos(z * 0.37) + 1) * 0.5;
      tmp.copy(cCinza).lerp(cTerra, v * 0.25).lerp(cVerde, k * (0.75 + v * 0.25));
      c.setXYZ(i, tmp.r, tmp.g, tmp.b);
    }
    c.needsUpdate = true;
    const kv = M.restCor.vila || 0; if (M.ipe) M.ipe.userData.copa.material.color.copy(new THREE.Color('#c9b36a')).lerp(new THREE.Color('#f5c451'), kv);
  }

  // dia e noite: 4 minutos por dia
  function diaNoite(t) {
    const fase = (t / 200) % 1, ang = fase * Math.PI * 2;   // 200 s por dia; noite ≈ 30%
    M.sol.position.set(Math.cos(ang) * 120, Math.sin(ang) * 120, 40); M.sol.position.add(M.jogadorPos || new V3());
    M.sol.target.position.copy(M.jogadorPos || new V3());
    const dia = Math.max(0, (Math.sin(ang) + 0.55) / 1.55);
    M.sol.intensity = 0.2 + dia * 1.1; M.hemi.intensity = 0.25 + dia * 0.5;
    const ceu = new THREE.Color('#1d2440').lerp(new THREE.Color('#9fb7c8'), dia);
    M.scene.background.copy(ceu); M.scene.fog.color.copy(ceu);
    M.noite = dia <= 0; M.hora = M.noite ? '🌙' : dia < 0.4 ? '🌅' : '☀️';
    return M.noite;
  }

  // bicho crescido no Ninho segue o jogador
  function companheiro(ovoId) {
    if (M.companheiros.some((c) => c.id === ovoId)) return;
    const ov = OVOS.find((o) => o.id === ovoId), st = ov.estagios[ov.estagios.length - 1];
    const g = new THREE.Group();
    const corpo = new THREE.Mesh(new THREE.SphereGeometry(0.8, 12, 10), new THREE.MeshLambertMaterial({ color: ovoId === 'galinha' ? '#f0e4d0' : ovoId === 'sapo' ? '#6a9a4a' : '#4a7ad8' })); corpo.position.y = 0.8; g.add(corpo);
    g.position.copy(M.jogadorPos || new V3()); M.scene.add(g);
    M.companheiros.push({ id: ovoId, mesh: g, pos: g.position, texto: st.emoji + ' ' + st.nome, fase: Math.random() * 6 });
  }
  // bichos e Ruidosos passeiam devagar; Ruidosos perseguem de perto
  function update(dt, jogador) {
    M.t += dt; M.jogadorPos = jogador;
    const noite = diaNoite(M.t); M.chuva = Math.sin(M.t / 45) > 0.35;   // chove uns 40% do tempo, em períodos curtos
    M.bichos.forEach((b) => {
      const vis = b.carta.hora === 'dia' ? !noite : b.carta.hora === 'noite' ? noite : M.chuva;
      b.mesh.visible = vis || (M.estado.cartas[b.carta.id] || 0) >= 4;
      if (b.fixo || !b.mesh.visible) return;
      b.espera -= dt;
      if (b.espera <= 0) { b.espera = 2 + Math.random() * 4; const a = Math.random() * 6.28, d = 6 + Math.random() * (b.regiao.r - 12); b.alvo = new V3(b.regiao.x + Math.cos(a) * d, 0, b.regiao.z + Math.sin(a) * d); }
      if (b.alvo) { const dir = new V3().subVectors(b.alvo, b.pos); dir.y = 0; if (dir.length() < 1) b.alvo = null; else { dir.normalize(); b.pos.addScaledVector(dir, dt * 2.5); b.mesh.rotation.y = Math.atan2(dir.x, dir.z) - Math.PI / 2; } }
      b.pos.y = altura(b.pos.x, b.pos.z);
    });
    M.ruidosos.forEach((r) => {
      if (r.dormindo > 0) { r.dormindo -= dt; r.mesh.visible = false; return; }
      r.mesh.visible = !M.estado.restaurada[r.regiao.id];
      if (!r.mesh.visible) return;
      r.mesh.children.forEach((s, i) => { s.position.y = 1.2 + i * 0.9 + Math.sin(M.t * 3 + i) * 0.2; });
      const dj = Math.hypot(jogador.x - r.pos.x, jogador.z - r.pos.z);
      let alvo = r.alvo;
      if (dj < 22) alvo = jogador;
      else { r.espera -= dt; if (r.espera <= 0) { r.espera = 3 + Math.random() * 3; const a = Math.random() * 6.28, d = 6 + Math.random() * (r.regiao.r - 12); r.alvo = new V3(r.regiao.x + Math.cos(a) * d, 0, r.regiao.z + Math.sin(a) * d); } alvo = r.alvo; }
      if (alvo) { const dir = new V3().subVectors(alvo, r.pos); dir.y = 0; if (dir.length() > 1) { dir.normalize(); r.pos.addScaledVector(dir, dt * (dj < 22 ? 5 : 2)); } }
      r.pos.y = altura(r.pos.x, r.pos.z);
    });
    M.ovos.forEach((o) => { o.mesh.visible = !(M.estado.ninho || []).some((n) => n.id === o.dado.id); o.mesh.position.y = altura(o.pos.x, o.pos.z) + 0.8 + Math.sin(M.t * 2) * 0.15; });
    M.companheiros.forEach((c, i) => {
      const alvo = new V3(jogador.x - Math.sin(c.fase) * 3, 0, jogador.z - Math.cos(c.fase) * 3 - 2);
      const dir = new V3().subVectors(alvo, c.pos); dir.y = 0; const d = dir.length();
      if (d > 1.2) { dir.normalize(); c.pos.addScaledVector(dir, dt * Math.min(12, d * 3)); c.mesh.rotation.y = Math.atan2(dir.x, dir.z); }
      c.pos.y = altura(c.pos.x, c.pos.z) + (c.id === 'borboleta' ? 2 + Math.sin(M.t * 4 + i) * 0.4 : Math.abs(Math.sin(M.t * 8 + i)) * 0.3 * (d > 1.2 ? 1 : 0));
    });
    if (M.olho) { M.olho.scale.setScalar(1 + Math.sin(M.t * 2) * 0.08); M.olho.visible = !M.estado.chefe; }
    pintar(dt);
  }

  return { construir, update, altura, regiaoEm, ruidoEm, montarObra, restaurar, companheiro, M };
})();
