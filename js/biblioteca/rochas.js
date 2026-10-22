/* =====================================================================
   Biblioteca 3D · Rochas e minerais
   A forma dos cristais segue o hábito real (prisma de 6 lados no quartzo);
   o resto é didático. Textos em revisão científica.
   ===================================================================== */
(function () {
  const { item } = Biblioteca;
  // cristal de 6 lados com ponta piramidal (hábito do quartzo)
  function prisma(K, r, h, ponta) {
    return K.torno([[0, 0], [r, 0], [r, h], [0.001, h + ponta]], 6);
  }
  function pedra(K, r, seed, cor) { return K.malha(K.amassar(new THREE.IcosahedronGeometry(r, 3), 0.12, 2.2, seed), K.mat(cor, { roughness: 0.95, flatShading: true })); }

  /* ---------- cristal de quartzo ---------- */
  item({
    id: 'quartzo', nome: 'Cristal de quartzo', cat: 'rochas', emoji: '💎', didatico: false,
    resumo: 'Um grupo de cristais de seis lados, com ponta. Acenda a luz e veja brilhar.',
    tamanho: 'Este grupo cabe na palma da mão: uns 8 cm.',
    revisao: { status: 'rascunho' }
  }, (K) => {
    const raiz = K.grupo(), base = pedra(K, 0.9, 3, '#8a7f72'); base.scale.set(1.3, 0.45, 1); base.position.y = 0.3;
    const vidro = K.vidro('#f4f8ff', { roughness: 0.05, thickness: 0.8, attenuationColor: '#e6e0ff', attenuationDistance: 2 });
    const cristais = K.grupo(), rr = K.rand(11);
    [[0, 0, 0, 0.22, 1.5], [0.35, 0.1, 0.4, 0.15, 1], [-0.4, 0.2, 0.25, 0.13, 0.9], [0.1, -0.35, -0.3, 0.12, 0.8], [-0.2, -0.4, 0.15, 0.1, 0.7], [0.45, 0.35, -0.2, 0.1, 0.65], [-0.5, -0.15, -0.35, 0.09, 0.55]].forEach(([x, rx, z, r, h]) => {
      const c = K.malha(prisma(K, r, h, r * 1.6), vidro, x, 0.42, z); c.rotation.set(rx, rr() * 6.28, (rr() - 0.5) * 0.6); cristais.add(c);
    });
    const brilho = new THREE.PointLight('#cfe4ff', 0, 3); brilho.position.set(0.2, 2, 0.6);
    raiz.add(base, cristais, brilho);
    return {
      raiz,
      partes: [
        { nome: 'Cristais de seis lados', malhas: [cristais], texto: 'Cada cristal tem seis lados, como um lápis.', mais: 'O quartzo cresce assim porque seus átomos (silício e oxigênio) se encaixam sempre do mesmo jeito.' },
        { nome: 'Ponta', malhas: [cristais], texto: 'A ponta parece uma pirâmide.', mais: 'É onde o cristal crescia mais devagar, dentro de uma rachadura da rocha.' },
        { nome: 'Rocha de base (matriz)', malhas: [base], texto: 'Os cristais nasceram em cima desta rocha.', mais: 'Água quente com sílica dissolvida passou pelas frestas da rocha e, devagar, deixou os cristais.' }
      ],
      E: { luz: 0 },
      acoes: [{ rotulo: 'Acender a luz', ico: '💡', fazer: (E) => { E.luz = E.luz ? 0 : 1; } }],
      animar(t, dt, E) { brilho.intensity = K.ir(brilho.intensity, E.luz * 8, dt, 4); brilho.position.x = Math.sin(t * 1.5) * 0.8; }
    };
  });

  /* ---------- granito ---------- */
  item({
    id: 'granito', nome: 'Granito', cat: 'rochas', emoji: '🪨', didatico: true,
    resumo: 'Uma rocha feita de grãos de três minerais. Separe os grãos e veja quem é quem.',
    tamanho: 'Este pedaço tem uns 10 cm. Muitas calçadas e pias são de granito.',
    revisao: { status: 'rascunho' }
  }, (K) => {
    const raiz = K.grupo(), rr = K.rand(21);
    const pint = K.textura(512, 512, (g, w, h) => { g.fillStyle = '#cfc8be'; g.fillRect(0, 0, w, h); const r2 = K.rand(77); [['#e2a494', 900, 9], ['#8f8a84', 900, 7], ['#f2efe8', 500, 6], ['#2a2624', 700, 4]].forEach(([c, n, s]) => { g.fillStyle = c; for (let i = 0; i < n; i++) { g.beginPath(); const x = r2() * w, y = r2() * h; g.moveTo(x, y); for (let k = 0; k < 5; k++) g.lineTo(x + (r2() - 0.5) * s * 2, y + (r2() - 0.5) * s * 2); g.fill(); } }); });
    const bloco = K.malha(K.amassar(new THREE.BoxGeometry(1.8, 1, 1.3, 6, 4, 5), 0.04, 2, 4), K.mat('#ffffff', { map: pint, roughness: 0.75 })); bloco.position.y = 0.5;
    const tipos = { quartzo: { cor: '#c9c6c0', n: 70, r: 0.08 }, feldspato: { cor: '#e0a090', n: 60, r: 0.1 }, mica: { cor: '#2a2624', n: 45, r: 0.06 } };
    const grupos = {};
    Object.keys(tipos).forEach((k) => {
      const t = tipos[k], g = K.grupo(), m = K.mat(t.cor, { roughness: k === 'mica' ? 0.25 : 0.7, metalness: k === 'mica' ? 0.3 : 0, flatShading: true });
      for (let i = 0; i < t.n; i++) {
        const face = Math.floor(rr() * 5), u = rr() - 0.5, v = rr() - 0.5;
        const p = face === 0 ? [u * 1.7, 1.0, v * 1.2] : face === 1 ? [0.9, 0.5 + v * 0.9, u * 1.2] : face === 2 ? [-0.9, 0.5 + v * 0.9, u * 1.2] : face === 3 ? [u * 1.7, 0.5 + v * 0.9, 0.65] : [u * 1.7, 0.5 + v * 0.9, -0.65];
        const gr = K.malha(new THREE.DodecahedronGeometry(t.r * (0.6 + rr() * 0.8), 0), m, ...p); gr.rotation.set(rr() * 3, rr() * 3, rr() * 3); if (k === 'mica') gr.scale.set(1, 0.35, 1);
        gr.userData.casa = gr.position.clone(); g.add(gr);
      }
      grupos[k] = g; raiz.add(g);
    });
    raiz.add(bloco);
    return {
      raiz,
      partes: [
        { nome: 'Quartzo (grãos cinza)', malhas: [grupos.quartzo], texto: 'Os grãos cinza e brilhantes são de quartzo.', mais: 'O quartzo é duro: risca o vidro.' },
        { nome: 'Feldspato (grãos rosados)', malhas: [grupos.feldspato], texto: 'Os grãos rosados ou brancos são feldspato.', mais: 'Com o tempo, a chuva transforma o feldspato em argila.' },
        { nome: 'Mica (grãos pretos)', malhas: [grupos.mica], texto: 'Os pontinhos pretos e brilhantes são mica.', mais: 'A mica se separa em folhinhas finas, como páginas.' },
        { nome: 'Rocha inteira', malhas: [bloco], texto: 'O granito nasceu de rocha derretida que esfriou devagar, lá no fundo da Terra.', mais: 'Como esfriou devagar, deu tempo de os cristais crescerem até ficarem visíveis a olho nu.' }
      ],
      E: { separar: 0 },
      acoes: [{ rotulo: 'Separar os grãos', ico: '🧲', fazer: (E) => { E.separar = E.separar ? 0 : 1; } }],
      animar(t, dt, E) {
        E.s = K.ir(E.s || 0, E.separar, dt, 3);
        const destino = { quartzo: [-1.6, 0], feldspato: [0, 0], mica: [1.6, 0] };
        Object.keys(grupos).forEach((k) => grupos[k].children.forEach((g, i) => { const d = destino[k], c = g.userData.casa; g.position.set(c.x + (d[0] + (i % 6) * 0.08 - 0.2 - c.x) * E.s, c.y + (1.8 + Math.floor(i / 6) * 0.07 - c.y) * E.s, c.z + ((i % 3) * 0.1 - c.z) * E.s); }));
        bloco.material.opacity = 1 - E.s * 0.55; bloco.material.transparent = E.s > 0.01;
      }
    };
  });

  /* ---------- geodo ---------- */
  item({
    id: 'geodo', nome: 'Geodo de ametista', cat: 'rochas', emoji: '🔮', didatico: true,
    resumo: 'Por fora parece uma pedra comum. Abra e veja os cristais roxos lá dentro.',
    tamanho: 'Este tem uns 12 cm, do tamanho de um melão pequeno. No Rio Grande do Sul há geodos enormes.',
    revisao: { status: 'rascunho' }
  }, (K) => {
    const raiz = K.grupo(), r = 0.9, rr = K.rand(31);
    const metades = [0, 1].map((i) => {
      const g = K.grupo();
      const casca = K.malha(K.amassar(new THREE.SphereGeometry(r, 40, 24, i * Math.PI, Math.PI), 0.06, 2.5, 5), K.mat('#8a8070', { roughness: 1, side: THREE.DoubleSide }));
      const borda = K.malha(new THREE.RingGeometry(r * 0.72, r * 1.02, 40, 1), K.mat('#d8d0e0', { roughness: 0.6, side: THREE.DoubleSide })); borda.rotation.x = Math.PI / 2 * 0;
      borda.lookAt(0, 0, i ? -1 : 1);
      const cristais = K.grupo(), m = K.vidro('#9a5ad0', { thickness: 0.4, roughness: 0.15, attenuationColor: '#6a2aa0', attenuationDistance: 0.6, transmission: 0.55 });
      for (let k = 0; k < 90; k++) {
        const a = Math.PI * (i + rr()), b = rr() * Math.PI, d = K.V(Math.cos(a) * Math.sin(b), Math.cos(b), Math.sin(a) * Math.sin(b));
        if ((i ? -1 : 1) * d.z < 0.08) continue;
        const h = 0.12 + rr() * 0.12, c = K.malha(K.torno([[0, 0], [0.045, 0], [0.045, h], [0.001, h + 0.07]], 6), m);
        c.position.copy(d.clone().multiplyScalar(r * 0.74)); c.quaternion.setFromUnitVectors(K.V(0, 1, 0), d.clone().negate()); cristais.add(c);
      }
      g.add(casca, borda, cristais); g.userData.cristais = cristais; g.userData.casca = casca; g.userData.borda = borda; return g;
    });
    // a borda é um anel no plano do corte (z = 0)
    metades.forEach((g, i) => { g.userData.borda.position.set(0, 0, 0); g.userData.borda.rotation.set(0, 0, 0); });
    raiz.add(...metades); raiz.position.y = r;
    return {
      raiz,
      partes: [
        { nome: 'Casca de rocha', malhas: metades.map((g) => g.userData.casca), texto: 'Por fora é só uma pedra cinza e áspera.', mais: 'O geodo começa como um buraco dentro da lava (uma bolha de gás) que ficou vazio.' },
        { nome: 'Camada de calcedônia', malhas: metades.map((g) => g.userData.borda), texto: 'Uma faixa clarinha forra o buraco.', mais: 'É calcedônia, também feita de sílica, com cristais pequenos demais para ver.' },
        { nome: 'Cristais de ametista', malhas: metades.map((g) => g.userData.cristais), texto: 'Lá dentro cresceram cristais roxos!', mais: 'Ametista é quartzo roxo. A cor vem de um pouquinho de ferro e de radiação natural das rochas.' }
      ],
      E: { aberto: 0 },
      acoes: [{ rotulo: 'Abrir o geodo', ico: '🔨', fazer: (E) => { E.aberto = E.aberto ? 0 : 1; } }],
      animar(t, dt, E) {
        E.a = K.ir(E.a || 0, E.aberto, dt, 3);
        metades[0].position.z = E.a * 0.5; metades[0].rotation.x = E.a * 0.9;
        metades[1].position.z = -E.a * 0.5; metades[1].rotation.x = -E.a * 0.9;
      }
    };
  });

  /* ---------- fóssil de amonite ---------- */
  item({
    id: 'amonite', nome: 'Fóssil de amonite', cat: 'rochas', emoji: '🐚', didatico: true,
    resumo: 'A concha de um bicho do mar que viveu no tempo dos dinossauros, virou pedra.',
    tamanho: 'Este tem uns 10 cm. Existem amonites do tamanho de uma roda de carro.',
    revisao: { status: 'rascunho' }
  }, (K) => {
    const raiz = K.grupo();
    const rocha = pedra(K, 1.1, 7, '#b8a888'); rocha.scale.set(1.9, 0.34, 1.7); rocha.position.y = 0.26;
    // espiral logarítmica: tubo que engrossa a cada volta
    const AMAX = Math.PI * 2 * 2.7, Rs = (t) => 0.06 * Math.exp(t * AMAX * 0.17), Rt = (t) => Rs(t) * 0.34;   // raio da espiral e do tubo
    const pts = []; for (let i = 0; i <= 160; i++) { const t = i / 160, a = t * AMAX; pts.push([Math.cos(a) * Rs(t), 0, Math.sin(a) * Rs(t)]); }
    const curva = new THREE.CatmullRomCurve3(pts.map((p) => K.V(...p)));
    const geo = new THREE.TubeGeometry(curva, 220, 1, 14, false), p = geo.attributes.position, centro = new THREE.Vector3();
    // raio do tubo cresce com a espiral
    for (let i = 0; i < p.count; i++) { const seg = Math.floor(i / 15), t = seg / 220, c = curva.getPointAt(Math.min(1, t)), r = Rt(t); const v = K.V(p.getX(i), p.getY(i), p.getZ(i)).sub(c).normalize().multiplyScalar(r).add(c); p.setXYZ(i, v.x, v.y * 0.7, v.z); }
    geo.computeVertexNormals();
    const concha = K.malha(geo, K.mat('#c8a070', { roughness: 0.55, metalness: 0.15 })); concha.position.y = 0.72; concha.scale.set(0.9, 0.9, 0.9);
    const costelas = K.grupo(); for (let i = 8; i < 160; i += 4) { const t = i / 160, c = curva.getPointAt(t), tan = curva.getTangentAt(t), r = Rt(t) * 1.02; const anel = K.malha(new THREE.TorusGeometry(r, r * 0.08, 6, 20), K.mat('#a07a50', { roughness: 0.7 })); anel.position.copy(c).multiplyScalar(0.9); anel.position.y = 0.72; anel.scale.set(0.9, 0.63, 0.9); anel.lookAt(anel.position.clone().add(tan)); costelas.add(anel); }
    // corte: câmaras separadas por septos (só aparecem no modo corte)
    const camaras = K.grupo(); for (let i = 20; i < 150; i += 7) { const t = i / 160, c = curva.getPointAt(t), tan = curva.getTangentAt(t), r = Rt(t); const s = K.malha(new THREE.CircleGeometry(r * 0.95, 20), K.mat('#e8d8b8', { side: THREE.DoubleSide })); s.position.copy(c).multiplyScalar(0.9); s.position.y = 0.72; s.scale.set(0.9, 0.63, 0.9); s.lookAt(s.position.clone().add(tan)); camaras.add(s); }
    camaras.visible = false;
    // o fóssil fica meio de pé na rocha, inclinado para quem olha
    const fossil = K.grupo(concha, costelas, camaras); fossil.position.set(0, 0.66, 0);
    [concha, ...costelas.children, ...camaras.children].forEach((o) => { o.position.y -= 0.72; });
    raiz.add(rocha, fossil);
    return {
      raiz,
      partes: [
        { nome: 'Concha em espiral', malhas: [concha, costelas], texto: 'A concha enrola como um caracol.', mais: 'A amonite vivia na ponta mais larga da concha e ia construindo câmaras novas conforme crescia.' },
        { nome: 'Câmaras e septos', malhas: [camaras], texto: 'Por dentro, a concha é dividida em salinhas.', mais: 'As câmaras guardavam gás e água: assim a amonite subia e descia no mar, como um submarino.' },
        { nome: 'Rocha', malhas: [rocha], texto: 'A concha ficou presa na lama do fundo do mar, que virou pedra.', mais: 'As amonites viveram por mais de 300 milhões de anos e sumiram junto com os dinossauros, há 66 milhões de anos.' }
      ],
      E: { corte: 0 },
      acoes: [{ rotulo: 'Ver por dentro', ico: '🔍', fazer: (E) => { E.corte = E.corte ? 0 : 1; } }],
      animar(t, dt, E) { camaras.visible = !!E.corte; concha.material.transparent = true; concha.material.opacity = K.ir(concha.material.opacity, E.corte ? 0.35 : 1, dt, 4); costelas.visible = !E.corte; }
    };
  });
})();
