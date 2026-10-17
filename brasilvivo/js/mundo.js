/* =====================================================================
   Terra Codex · Brasil Vivo · mundo 3D do bioma ativo
   Céu em degradê com sol, terreno com capim e flores, árvores tortas do
   Cerrado, buritis, cupinzeiros, Base Brasília modernista, horta, Jardim
   Polinizador, bichos estilizados, marcas de fase, moradores e dia/noite.
   Tudo vem do Registro. Metros, Y para cima. Formas em formas.js.
   ===================================================================== */
const Mundo = (function () {
  const V3 = THREE.Vector3, T = Formas.T, B = Formas.B;
  const M = { bichos: [], marcas: [], npcs: [], companheiros: [], t: 20 };
  const TAM = 440, SEG = 110, RIO_X = 80, RIO_LARGURA = 14;
  let BIOMA = 'cerrado', AREAS = [];

  // altura do terreno: ondulado, com um morro na rota e a baixada da vereda
  function altura(x, z) {
    let h = Math.sin(x * 0.03) * 1.2 + Math.cos(z * 0.025 + 1) * 1.4 + Math.sin((x + z) * 0.05) * 0.5;
    const dx = x - RIO_X - Math.sin(z * 0.04) * 5;
    if (Math.abs(dx) < RIO_LARGURA + 8) h -= 2.6 * (1 - Math.min(1, Math.abs(dx) / (RIO_LARGURA + 8)));
    const df = Math.hypot(x + 10, z + 130); h += 5 * Math.max(0, 1 - df / 70);
    const dp = Math.hypot(x, z - 4); if (dp < 28) { const k = Math.max(0, (dp - 21) / 7); h = h * k + 0.3 * (1 - k); }   // praça plana
    return h;
  }
  function areaEm(x, z) {
    let melhor = null, dm = Infinity;
    AREAS.forEach((a) => { const d = Math.hypot(x - a.x, z - a.z); if (d < a.r && d < dm) { dm = d; melhor = a; } });
    return melhor;
  }
  const naAgua = (x, z) => Math.abs(x - RIO_X - Math.sin(z * 0.04) * 5) < RIO_LARGURA + 2;
  const ocupado = (x, z) => naAgua(x, z) || Math.hypot(x, z - 4) < 24 || AREAS.some((a) => (a.id === 'horta' || a.id === 'jardim') && Math.hypot(x - a.x, z - a.z) < a.r - 4);
  const o3 = new THREE.Object3D();
  function instancia(geo, mat, n, cada) {
    const im = new THREE.InstancedMesh(geo, mat, n); let k = 0;
    for (let i = 0; i < n * 4 && k < n; i++) { const r = cada(k, i); if (!r) continue; o3.position.set(r[0], r[1], r[2]); o3.rotation.set(r[4] || 0, r[3] || 0, r[5] || 0); o3.scale.set(r[6] || 1, r[7] || r[6] || 1, r[8] || r[6] || 1); o3.updateMatrix(); im.setMatrixAt(k, o3.matrix); if (r[9]) im.setColorAt(k, r[9]); k++; }
    im.count = k; im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
    return im;
  }
  const rnd = (a, b) => a + Math.random() * (b - a);
  // posiciona (e opcionalmente deita) uma peça
  const P = (mesh, x, y, z, rx) => { mesh.position.set(x, y, z); if (rx) mesh.rotation.x = rx; mesh.castShadow = true; return mesh; };

  function construir(scene, bioma) {
    M.scene = scene; BIOMA = bioma || 'cerrado'; AREAS = Registro.lista('areas', BIOMA);
    M.cor = {}; AREAS.forEach((a) => { M.cor[a.id] = Ruido.clareza(a.id); });
    M.arvPos = [];

    /* céu: degradê do horizonte ao topo, com brilho do sol */
    M.ceu = new THREE.Mesh(new THREE.SphereGeometry(520, 32, 16), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, fog: false,
      uniforms: { topo: { value: new THREE.Color('#4f9ad8') }, horizonte: { value: new THREE.Color('#d8ecf2') }, solCor: { value: new THREE.Color('#fff2c4') }, solDir: { value: new V3(0, 1, 0) } },
      vertexShader: 'varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: 'uniform vec3 topo; uniform vec3 horizonte; uniform vec3 solCor; uniform vec3 solDir; varying vec3 vDir; void main(){ float h = clamp(vDir.y, 0.0, 1.0); vec3 c = mix(horizonte, topo, pow(h, 0.55)); float s = max(dot(normalize(vDir), normalize(solDir)), 0.0); c += solCor * (pow(s, 600.0) * 1.5 + pow(s, 12.0) * 0.25); gl_FragColor = vec4(c, 1.0); }'
    }));
    scene.add(M.ceu);
    // estrelas (aparecem à noite)
    const est = new Float32Array(900 * 3);
    for (let i = 0; i < 900; i++) { const a = Math.random() * 6.28, y = rnd(0.12, 1), r = Math.sqrt(1 - y * y); est.set([Math.cos(a) * r * 480, y * 480, Math.sin(a) * r * 480], i * 3); }
    const eg = new THREE.BufferGeometry(); eg.setAttribute('position', new THREE.BufferAttribute(est, 3));
    M.estrelas = new THREE.Points(eg, new THREE.PointsMaterial({ color: '#ffffff', size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0, fog: false, depthWrite: false }));
    scene.add(M.estrelas);

    /* terreno com cor por vértice: cerrado seco, cinza (Ruído) ou verde vivo (Clareza) */
    const geo = new THREE.PlaneGeometry(TAM, TAM, SEG, SEG); geo.rotateX(-Math.PI / 2);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) p.setY(i, altura(p.getX(i), p.getZ(i)));
    geo.computeVertexNormals();
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(p.count * 3), 3));
    M.terreno = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true }));
    M.terreno.receiveShadow = true; scene.add(M.terreno);

    /* vereda: água rasa e margem */
    const rg = new THREE.PlaneGeometry(RIO_LARGURA * 2, TAM, 6, 80); rg.rotateX(-Math.PI / 2);
    const rp = rg.attributes.position;
    for (let i = 0; i < rp.count; i++) { rp.setX(i, rp.getX(i) + RIO_X + Math.sin(rp.getZ(i) * 0.04) * 5); rp.setY(i, altura(RIO_X + Math.sin(rp.getZ(i) * 0.04) * 5, rp.getZ(i)) + 1.1); }
    M.rio = new THREE.Mesh(rg, new THREE.MeshPhongMaterial({ color: '#7d827a', transparent: true, opacity: 0.88, shininess: 90, specular: '#dfefff' }));
    scene.add(M.rio);

    /* Base Brasília: praça, pavilhão curvo, casas sobre pilotis, muro com lâmpada, ipê */
    const praca = new THREE.Mesh(new THREE.CircleGeometry(20, 48), T('#d9cdb6')); praca.rotation.x = -Math.PI / 2; praca.position.set(0, 0.45, 4); praca.receiveShadow = true; scene.add(praca);
    const anel = new THREE.Mesh(new THREE.RingGeometry(19.4, 20.4, 48), T('#c8b89c')); anel.rotation.x = -Math.PI / 2; anel.position.set(0, 0.47, 4); scene.add(anel);
    const espelho = new THREE.Mesh(new THREE.CircleGeometry(4, 32), new THREE.MeshPhongMaterial({ color: '#5aa7d6', shininess: 100 })); espelho.rotation.x = -Math.PI / 2; espelho.position.set(-9, 0.5, 12); scene.add(espelho);
    const pav = Formas.pavilhao(); pav.position.set(0, 0.45, -10); scene.add(pav);
    [[-22, 10, 0.5, '#2f7fc1'], [20, -26, -0.6, '#e0a23a'], [-18, -24, 0.7, '#3aa37a'], [28, 12, -0.4, '#d9614c']].forEach(([x, z, ry, cor]) => {
      const c = Formas.casa(cor); c.position.set(x, altura(x, z), z); c.rotation.y = ry; scene.add(c);
      M.arvPos.push([x + Math.cos(ry) * 2.6, z - Math.sin(ry) * 2.6 + 0.6, 1.3]);
    });
    const muro = Formas.muro(); muro.position.set(-20, altura(-20, 14.7), 14.7); scene.add(muro); M.arvPos.push([-20, 14.7, 0.4], [-22, 14.7, 0.4], [-18, 14.7, 0.4]);
    M.lampada = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 8), new THREE.MeshBasicMaterial({ color: '#fff3c0' }));
    M.lampada.position.set(-18.4, altura(-20, 14.7) + 2.95, 14.95); scene.add(M.lampada);
    M.luz = new THREE.PointLight('#ffd98a', 0, 14); M.luz.position.copy(M.lampada.position).add(new V3(0, 0, 0.6)); scene.add(M.luz);
    M.ipe = ipe(); M.ipe.position.set(-16, altura(-16, 34), 34); scene.add(M.ipe); M.arvPos.push([-16, 34, 1]);

    /* árvores do Cerrado: troncos tortos e copas em tufos (3 instâncias por árvore) */
    const arv = [];
    for (let i = 0; i < 400 && arv.length < 120; i++) {
      let x, z;
      if (arv.length < 50) { const a = Math.random() * 6.28, r = 10 + Math.sqrt(Math.random()) * 44; x = -10 + Math.cos(a) * r; z = -130 + Math.sin(a) * r; }
      else { x = rnd(-200, 200); z = rnd(-200, 200); }
      if (ocupado(x, z) || Math.hypot(x, z) < 46 || AREAS.some((a) => a.id !== 'rota' && Math.hypot(x - a.x, z - a.z) < a.r)) continue;
      arv.push([x, z, rnd(0.75, 1.35), Math.random() * 6.28]); M.arvPos.push([x, z, 0.7]);
    }
    scene.add(instancia(Formas.troncoTorto(), T('#5a3e26'), arv.length, (k) => { const [x, z, s, r] = arv[k]; return [x, altura(x, z) - 0.2, z, r, 0, 0, s]; }));
    const verdes = ['#557a2e', '#6a8a34', '#4a6e2a', '#7a8f3a'].map((c) => new THREE.Color(c));
    const copas = instancia(Formas.copaGeo, T('#ffffff', { flatShading: true }), arv.length * 3, (k) => {
      const [x, z, s, r] = arv[Math.floor(k / 3)], j = k % 3, a = r + j * 2.1, d = j ? 1.3 * s : 0;
      const cx = x + Math.sin(4 * 0.9) * 0.45 * s + Math.cos(a) * d, cz = z + Math.sin(4 * 0.6 + 1) * 0.25 * s + Math.sin(a) * d;
      return [cx, altura(x, z) + 4 * s + (j ? -0.2 : 0.4) * s, cz, a, 0, 0, (j ? 1.5 : 2) * s, (j ? 0.8 : 1.05) * s, (j ? 1.5 : 2) * s, verdes[(k * 7) % 4]];
    });
    copas.castShadow = true; scene.add(copas);

    /* buritis ao longo da vereda */
    for (let i = 0; i < 18; i++) {
      const z = -170 + i * 20 + rnd(0, 8), lado = i % 2 ? 1 : -1, x = RIO_X + Math.sin(z * 0.04) * 5 + lado * (RIO_LARGURA + rnd(4, 9));
      const g = Formas.buriti(); g.position.set(x, altura(x, z), z); scene.add(g); M.arvPos.push([x, z, 0.6]);
    }
    /* cupinzeiros: montes arredondados de terra */
    const perfil = [[0.01, 0], [1.3, 0], [1.25, 0.8], [1.0, 1.8], [0.7, 2.6], [0.35, 3.1], [0.01, 3.25]].map(([x, y]) => new THREE.Vector2(x, y));
    const cups = [];
    for (let i = 0; i < 200 && cups.length < 34; i++) { const x = rnd(-200, 200), z = rnd(-200, 200); if (!ocupado(x, z) && Math.hypot(x, z) > 40) cups.push([x, z, rnd(0.6, 1.4)]); }
    scene.add(instancia(new THREE.LatheGeometry(perfil, 9), T('#b0703f', { flatShading: true }), cups.length, (k) => { const [x, z, s] = cups[k]; M.arvPos.push([x, z, 1.1 * s]); return [x, altura(x, z) - 0.1, z, k, 0, 0, s, s * rnd(0.8, 1.3), s]; }));
    /* pedras */
    scene.add(instancia(new THREE.DodecahedronGeometry(1, 0), T('#9a9284', { flatShading: true }), 70, () => { const x = rnd(-205, 205), z = rnd(-205, 205); if (ocupado(x, z)) return null; return [x, altura(x, z), z, Math.random() * 6, 0, 0, rnd(0.4, 1.4), rnd(0.3, 0.8), rnd(0.4, 1.2)]; }));

    /* capim: tufos com cor por instância (mudam com a Clareza) */
    M.tufos = []; for (let i = 0; i < 9000 && M.tufos.length < 2800; i++) { const x = rnd(-210, 210), z = rnd(-210, 210); if (!naAgua(x, z) && Math.hypot(x, z - 4) > 21) M.tufos.push([x, z, rnd(0.7, 1.5), Math.random()]); }
    M.capim = instancia(Formas.tufo(), T('#ffffff'), M.tufos.length, (k) => { const [x, z, s] = M.tufos[k]; return [x, altura(x, z) - 0.05, z, Math.random() * 6, 0, 0, s, s * rnd(0.8, 1.4), s, new THREE.Color('#a59a4a')]; });
    M.capim.receiveShadow = true; scene.add(M.capim);
    /* flores silvestres nas áreas vivas e no campo */
    const fCores = ['#f5d040', '#ffffff', '#e86aa8', '#b48ae8', '#f08a3a'].map((c) => new THREE.Color(c));
    M.floresCampo = instancia(new THREE.IcosahedronGeometry(0.22, 0), T('#ffffff'), 700, (k) => { const x = rnd(-205, 205), z = rnd(-205, 205); const a = areaEm(x, z); if (naAgua(x, z) || (a && a.ruido) || Math.hypot(x, z - 4) < 21) return null; return [x, altura(x, z) + 0.55, z, 0, 0, 0, 1, 0.7, 1, fCores[k % 5]]; });
    scene.add(M.floresCampo);

    /* horta comunitária: canteiros de madeira com terra, folhas e flores */
    const H = Registro.area('horta');
    if (H) for (let i = 0; i < 4; i++) {
      const g = new THREE.Group(), x = H.x + (i % 2) * 14 - 7, z = H.z - 8 + Math.floor(i / 2) * 9; g.position.set(x, altura(x, z), z);
      g.add(P(new THREE.Mesh(new THREE.BoxGeometry(11, 0.7, 3.2), T('#8a5a32')), 0, 0.35, 0));
      g.add(P(new THREE.Mesh(new THREE.BoxGeometry(10.4, 0.2, 2.6), T('#4a3020')), 0, 0.72, 0));
      for (let k = 0; k < 7; k++) {
        const pl = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 0), T(k % 2 ? '#4f9a3a' : '#3f8a2e', { flatShading: true })); pl.position.set(-4.5 + k * 1.5, 1.15, rnd(-0.5, 0.5)); pl.castShadow = true; g.add(pl);
        const fl = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6), T(['#f5d040', '#e5533d', '#f28fc0'][(k + i) % 3])); fl.position.set(-4.5 + k * 1.5 + 0.2, 1.65, 0.1); g.add(fl);
      }
      scene.add(g);
    }

    /* Jardim Polinizador: cerca de estacas e flores que abrem com a Clareza */
    const J = Registro.area('jardim'); M.flores = [];
    if (J) {
      const nE = 46; scene.add(instancia(new THREE.CylinderGeometry(0.12, 0.14, 1.2, 6), T('#8a6a44'), nE, (k) => { const a = k / nE * 6.28, x = J.x + Math.cos(a) * (J.r - 5), z = J.z + Math.sin(a) * (J.r - 5); return [x, altura(x, z) + 0.6, z]; }));
      const cores = ['#f5c840', '#ef5a7a', '#f6a4d0', '#b48ae8', '#ffffff'];
      for (let i = 0; i < 34; i++) {
        const a = Math.random() * 6.28, r = Math.sqrt(Math.random()) * (J.r - 8), x = J.x + Math.cos(a) * r, z = J.z + Math.sin(a) * r;
        const g = new THREE.Group(); g.position.set(x, altura(x, z), z);
        g.add(P(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 1.3, 5), T('#6b8a44')), 0, 0.65, 0));
        const botao = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.55, 6), T('#7d7f78')); botao.position.y = 1.5; g.add(botao);
        const flor = new THREE.Group(); flor.position.y = 1.4; flor.visible = false; g.add(flor);
        const cor = cores[i % 5];
        for (let k = 0; k < 5; k++) { const pe = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), T(cor)); const ang = k / 5 * 6.28; pe.position.set(Math.cos(ang) * 0.22, 0, Math.sin(ang) * 0.22); pe.scale.set(1, 0.3, 0.6); pe.rotation.y = -ang; flor.add(pe); }
        flor.add(new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), T('#f0a020')));
        scene.add(g); M.flores.push({ botao, flor });
      }
      M.placaJardim = { pos: new V3(J.x - J.r + 3, altura(J.x - J.r + 3, J.z), J.z), area: J };
      const placa = new THREE.Group(); placa.position.copy(M.placaJardim.pos);
      placa.add(P(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.8, 6), T('#7a5a3a')), 0, 0.9, 0));
      placa.add(P(new THREE.Mesh(new THREE.BoxGeometry(0.15, 1, 2.2), T('#d9b98a')), 0, 1.8, 0));
      scene.add(placa);
    }

    /* seres vivos: a fase que anda circula pela área; as outras ficam marcadas no mapa */
    Registro.lista('especies', BIOMA).forEach((e) => {
      const area = Registro.area(e.area), anda = e.fases.find((f) => f.anda);
      if (anda && area) for (let k = 0; k < 2; k++) M.bichos.push(bicho(e, anda, area));
      e.fases.filter((f) => f.ponto).forEach((f) => M.marcas.push(marca(e, f)));
    });
    Registro.lista('npcs', BIOMA).forEach((n) => M.npcs.push(npc(n)));

    /* luzes */
    M.sol = new THREE.DirectionalLight('#fff1d8', 2); M.sol.castShadow = true; M.sol.shadow.mapSize.set(2048, 2048); M.sol.shadow.bias = -0.0005;
    Object.assign(M.sol.shadow.camera, { left: -60, right: 60, top: 60, bottom: -60, near: 1, far: 400 });
    M.hemi = new THREE.HemisphereLight('#cfe6ff', '#6a5a3a', 0.8);
    scene.add(M.sol, M.sol.target, M.hemi);
    scene.fog = new THREE.Fog('#d8ecf2', 90, 330);
    pintar(0, true);
    return M;
  }

  function ipe() {
    const g = new THREE.Group();
    const t = new THREE.Mesh(Formas.troncoTorto(), T('#5a3e26')); t.scale.set(1.6, 1.9, 1.6); t.castShadow = true; g.add(t);
    [[0.8, 8.4, 0, 2.1], [-1.4, 7.8, 1, 1.6], [2.2, 7.6, -0.8, 1.5], [0.2, 9.6, -1.1, 1.5], [-0.8, 8.9, -1.7, 1.3], [1.8, 8.9, 1.2, 1.2], [-2.2, 8.6, -0.6, 1.1]].forEach(([x, y, z, s]) => { const c = new THREE.Mesh(Formas.copaGeo, T('#f5c43a', { flatShading: true })); c.position.set(x, y, z); c.scale.set(s, s * 0.75, s); c.castShadow = true; g.add(c); });
    return g;
  }

  /* bicho: forma estilizada, brilho quando mostra o que faz, anel no chão se for pequeno */
  function bicho(e, fase, area) {
    const g = new THREE.Group(), corpo = Formas.bicho(fase.forma, fase.cor); g.add(corpo);
    const brilho = new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 0), new THREE.MeshBasicMaterial({ color: '#ffe36a' })); brilho.visible = false; g.add(brilho);
    const esc = fase.escala || 1; g.scale.setScalar(esc);
    brilho.scale.setScalar(1 / esc); brilho.position.y = 1.3 / esc;
    if (esc < 0.8) { const anel = new THREE.Mesh(new THREE.RingGeometry(0.55, 0.75, 28), new THREE.MeshBasicMaterial({ color: '#fff6c8', transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false })); anel.rotation.x = -Math.PI / 2; anel.position.y = 0.06 / esc; anel.scale.setScalar(1 / esc); g.add(anel); g.userData.anel = anel; }
    const a = Math.random() * 6.28, d = 6 + Math.random() * (area.r - 12);
    g.position.set(area.x + Math.cos(a) * d, 0, area.z + Math.sin(a) * d); g.position.y = altura(g.position.x, g.position.z);
    M.scene.add(g);
    // relação que este bicho mostra quando "age" (prova ver-acao na área dele)
    const rel = Registro.relacoesDe(e.id).find((r) => r.prova && r.prova.tipo === 'ver-acao' && r.prova.area === area.id) || null;
    return { especie: e, fase, mesh: g, corpo, pos: g.position, area, alvo: null, espera: Math.random() * 3, brilho, rel, agindo: 0, proxAcao: 6 + Math.random() * 10, fase0: Math.random() * 6 };
  }
  function marca(e, f) {
    const g = new THREE.Group(), [x, z] = f.ponto;
    if (f.marca === 'tronco') {
      g.add(P(new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.95, 3.4, 9), T('#6b4a2c', { flatShading: true })), 0, 1.7, 0));
      g.add(P(new THREE.Mesh(new THREE.CircleGeometry(0.6, 9), T('#3a2416')), 0, 3.41, 0, -Math.PI / 2));
      const tubo = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.16, 0.45, 8), T('#e8c26a')); tubo.rotation.z = Math.PI / 2; tubo.position.set(0.95, 2.1, 0); g.add(tubo);
    } else if (f.marca === 'olheiro') {
      for (let i = 0; i < 6; i++) { const mo = new THREE.Mesh(new THREE.SphereGeometry(0.75, 10, 6, 0, 6.28, 0, 1.3), T('#c07a48', { flatShading: true })); mo.position.set(Math.cos(i * 1.1) * 1.8, -0.05, Math.sin(i * 1.1) * 1.8); mo.scale.y = 0.45; g.add(mo); g.add(P(new THREE.Mesh(new THREE.CircleGeometry(0.16, 8), T('#3a2416')), mo.position.x, 0.34, mo.position.z, -Math.PI / 2)); }
    } else if (f.marca === 'parede') {
      [-0.15, 0.15].forEach((dx) => { const ov = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), T(f.cor || '#f3ead6')); ov.position.set(dx, 1.2, 0); ov.scale.y = 1.2; g.add(ov); });
    } else {
      const folha = new THREE.Mesh(new THREE.CircleGeometry(0.9, 9), T('#5ea83a')); folha.rotation.x = -Math.PI / 2; folha.position.y = 0.32; folha.scale.set(1.4, 0.8, 1); g.add(folha);
      g.add(P(new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.32, 5), T('#4f7a2e')), 0, 0.16, 0));
      const ov = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 10), T(f.cor || '#f3e6c9')); ov.scale.y = 1.25; ov.position.y = 0.5; g.add(ov);
    }
    g.position.set(x, altura(x, z), z); M.scene.add(g);
    return { especie: e, fase: f, mesh: g, pos: g.position };
  }
  function npc(n) {
    const v = n.visual || {}, g = Formas.pessoa(Object.assign({ camisa: n.cor }, v));
    if (v.escala) g.scale.setScalar(v.escala);
    g.position.set(n.x, altura(n.x, n.z), n.z); g.rotation.y = Math.atan2(-n.x, 8 - n.z); M.scene.add(g);
    return { dado: n, mesh: g, pos: g.position, t0: Math.random() * 6 };
  }

  /* pinta o terreno e o capim pela Clareza de cada área (transição suave quando ela muda) */
  const cCinza = new THREE.Color('#7d7e76'), cVerde = new THREE.Color('#5f9a3f'), cCerrado = new THREE.Color('#9c9448'), cTerra = new THREE.Color('#9a7444'), cCapim = new THREE.Color('#c8b45a'), cCapimV = new THREE.Color('#6aa83e'), cCapimC = new THREE.Color('#8e8f86');
  const tmp = new THREE.Color(), tmpA = new THREE.Color();
  function corEm(x, z, base, cinza, verde, v) {
    tmp.copy(base);
    AREAS.forEach((a) => {
      const d = Math.hypot(x - a.x, z - a.z); if (d > a.r + 12) return;
      const w = Math.min(1, (a.r + 12 - d) / 14);
      tmpA.copy(cinza).lerp(verde, M.cor[a.id] * (0.8 + v * 0.2));
      tmp.lerp(tmpA, w);
    });
    return tmp;
  }
  function pintar(dt, forcar) {
    let mudou = !!forcar;
    AREAS.forEach((a) => { const alvo = Ruido.clareza(a.id); if (Math.abs(M.cor[a.id] - alvo) > 0.002) { M.cor[a.id] += (alvo - M.cor[a.id]) * Math.min(1, dt * 0.8); mudou = true; } });
    if (!mudou) return;
    const geo = M.terreno.geometry, p = geo.attributes.position, c = geo.attributes.color;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i), v = (Math.sin(x * 0.11) * Math.cos(z * 0.09) + Math.sin(x * 0.37 + z * 0.29) * 0.5 + 1.5) / 3;
      const base = tmpA.copy(cCerrado).lerp(cTerra, Math.max(0, v - 0.45) * 0.9);
      const k = corEm(x, z, base.clone(), cCinza, cVerde, v);
      if (naAgua(x, z)) k.lerp(cTerra, 0.4);
      c.setXYZ(i, k.r, k.g, k.b);
    }
    c.needsUpdate = true;
    M.tufos.forEach(([x, z, s, v], i) => { const k = corEm(x, z, cCapim.clone().lerp(cTerra, v * 0.35), cCapimC, cCapimV, v); M.capim.setColorAt(i, k); });
    M.capim.instanceColor.needsUpdate = true;
    const kv = M.cor.vereda; if (kv !== undefined) M.rio.material.color.copy(new THREE.Color('#7d827a')).lerp(new THREE.Color('#3f97c8'), kv);
    const kj = M.cor.jardim; if (kj !== undefined) M.flores.forEach((f, i) => { const aberta = kj >= 0.5 - i * 0.004; f.flor.visible = aberta; f.botao.visible = !aberta; });
  }

  /* dia e noite: 200 s por dia; noite ≈ 30% */
  const C = (h) => new THREE.Color(h);
  const CEU = { noiteT: C('#0b1430'), noiteH: C('#1c2a4a'), diaT: C('#3f8fd8'), diaH: C('#d4ecf4'), tardeH: C('#f4b07a'), tardeT: C('#5a7ab8') };
  function diaNoite(t) {
    const ang = ((t / 200) % 1) * Math.PI * 2, centro = M.jogadorPos || new V3();
    const dir = new V3(Math.cos(ang), Math.sin(ang), 0.35).normalize();
    M.sol.position.copy(centro).addScaledVector(dir, 150); M.sol.target.position.copy(centro);
    const dia = Math.max(0, Math.min(1, (Math.sin(ang) + 0.2) / 0.9)), baixo = Math.max(0, 1 - Math.abs(Math.sin(ang)) * 3.5) * (Math.sin(ang) > -0.25 ? 1 : 0);
    M.sol.intensity = 0.05 + dia * 1.45; M.hemi.intensity = 0.18 + dia * 0.5;
    M.sol.color.set('#fff1d8').lerp(C('#ffb070'), baixo);
    const u = M.ceu.material.uniforms;
    u.topo.value.copy(CEU.noiteT).lerp(CEU.diaT, dia).lerp(CEU.tardeT, baixo * 0.5);
    u.horizonte.value.copy(CEU.noiteH).lerp(CEU.diaH, dia).lerp(CEU.tardeH, baixo * 0.7);
    u.solDir.value.copy(dir); u.solCor.value.set(dia > 0 ? '#fff2c4' : '#000000');
    M.ceu.position.copy(centro); M.estrelas.position.copy(centro);
    M.estrelas.material.opacity = Math.max(0, 1 - dia * 3);
    M.scene.fog.color.copy(u.horizonte.value);
    M.noite = dia <= 0.05; M.hora = M.noite ? '🌙' : baixo > 0.3 ? '🌅' : '☀️';
    M.lampada.material.color.set(M.noite ? '#fff3c0' : '#c9c2ae'); M.luz.intensity = M.noite ? 1.6 : 0;
    return M.noite;
  }

  // bicho que cresceu no Ninho acompanha o jogador até ser ativado no mundo
  function companheiro(especieId) {
    if (M.companheiros.some((c) => c.id === especieId)) return;
    const e = Registro.especie(especieId), f = e.fases.find((x) => x.anda) || e.fases[e.fases.length - 1];
    const g = Formas.bicho(f.forma, f.cor); g.scale.setScalar(Math.max(0.45, f.escala || 1));
    g.position.copy(M.jogadorPos || new V3()); M.scene.add(g);
    M.companheiros.push({ id: especieId, voa: !!f.voa, mesh: g, pos: g.position, texto: f.emoji + ' ' + e.nome, fase: Math.random() * 6 });
  }

  // bicho pequeno voa baixo, na altura das flores; o anel fica sempre no chão, embaixo dele
  const voo = (b, onda) => 0.6 + (b.fase.escala || 1) * 1.2 + onda;
  function anelNoChao(b) { const an = b.mesh.userData.anel; if (an) an.position.y = (altura(b.pos.x, b.pos.z) - b.pos.y + 0.06) / (b.fase.escala || 1); }
  function update(dt, jogador) {
    M.t += dt; M.jogadorPos = jogador;
    const noite = diaNoite(M.t); M.chuva = Math.sin(M.t / 45) > 0.35;
    M.bichos.forEach((b) => {
      const hora = b.especie.hora || ['dia'];
      // o Ruído esconde os bichos da área enquanto a Clareza estiver baixa
      b.mesh.visible = hora.includes(noite ? 'noite' : 'dia') && Ruido.clareza(b.area.id) >= 0.5;
      if (!b.mesh.visible) { b.agindo = 0; b.brilho.visible = false; return; }
      b.corpo.userData.animar(M.t + b.fase0, b.agindo > 0);
      b.brilho.rotation.y += dt * 3; b.brilho.position.y = (1.3 + Math.sin(M.t * 4) * 0.15) / (b.fase.escala || 1);
      // de tempos em tempos, o bicho para e mostra o que faz no ecossistema
      if (b.rel) {
        if (b.agindo > 0) { b.agindo -= dt; b.brilho.visible = true; b.pos.y = altura(b.pos.x, b.pos.z) + (b.fase.voa ? voo(b, 0) : 0); anelNoChao(b); return; }
        b.brilho.visible = false; b.proxAcao -= dt;
        if (b.proxAcao <= 0) { b.agindo = 9; b.proxAcao = 14 + Math.random() * 10; b.alvo = null; return; }
      }
      b.espera -= dt;
      if (b.espera <= 0) { b.espera = 2 + Math.random() * 4; const a = Math.random() * 6.28, d = 6 + Math.random() * (b.area.r - 12); b.alvo = new V3(b.area.x + Math.cos(a) * d, 0, b.area.z + Math.sin(a) * d); }
      if (b.alvo) { const dir = new V3().subVectors(b.alvo, b.pos); dir.y = 0; if (dir.length() < 1) b.alvo = null; else { dir.normalize(); b.pos.addScaledVector(dir, dt * 2.5); b.mesh.rotation.y = Math.atan2(-dir.z, dir.x); } }
      b.pos.y = altura(b.pos.x, b.pos.z) + (b.fase.voa ? voo(b, Math.sin(M.t * 3 + b.espera) * 0.3) : 0); anelNoChao(b);
    });
    const ninho = Estado.dados.ninho;
    M.marcas.forEach((m) => { if (m.fase.ninho) m.mesh.visible = !ninho.some((n) => Registro.ciclo(n.ciclo).especie === m.especie.id); });
    M.npcs.forEach((n) => { n.mesh.userData.animar(M.t * 1.5 + n.t0, 0); n.mesh.children[n.mesh.children.length - 1].rotation.y = Math.sin(M.t * 0.7 + n.t0) * 0.3; });
    M.companheiros.forEach((c, i) => {
      const alvo = new V3(jogador.x - Math.sin(c.fase) * 3, 0, jogador.z - Math.cos(c.fase) * 3 - 2);
      const dir = new V3().subVectors(alvo, c.pos); dir.y = 0; const d = dir.length();
      if (d > 1.2) { dir.normalize(); c.pos.addScaledVector(dir, dt * Math.min(12, d * 3)); c.mesh.rotation.y = Math.atan2(-dir.z, dir.x); }
      c.mesh.userData.animar(M.t + i, false);
      c.pos.y = altura(c.pos.x, c.pos.z) + (c.voa ? 1.8 + Math.sin(M.t * 4 + i) * 0.4 : Math.abs(Math.sin(M.t * 8 + i)) * 0.3 * (d > 1.2 ? 1 : 0));
    });
    pintar(dt);
  }

  return { construir, update, altura, areaEm, companheiro, M, RIO_X, RIO_LARGURA };
})();
