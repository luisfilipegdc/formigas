/* =====================================================================
   Biblioteca 3D · Plantas e partes
   Modelos didáticos (simplificados). Textos em revisão científica.
   ===================================================================== */
(function () {
  const { item } = Biblioteca;

  /* ---------- flor do ipê-amarelo ---------- */
  item({
    id: 'flor-ipe', nome: 'Flor do ipê-amarelo', cat: 'plantas', emoji: '🌼', didatico: true,
    resumo: 'Uma flor em forma de trombeta. Abra e veja onde fica o pólen.',
    tamanho: 'Cada flor tem uns 7 cm, do tamanho de um dedo de adulto.',
    revisao: { status: 'rascunho' }
  }, (K) => {
    const amarelo = K.mat('#f6c21c', { roughness: 0.55, side: THREE.DoubleSide }), garganta = K.mat('#e7a10f', { side: THREE.DoubleSide });
    const raiz = K.grupo(), petalas = [], tubo = K.malha(K.torno([[0.05, 0], [0.12, 0.25], [0.2, 0.6], [0.3, 0.95], [0.34, 1.05]], 40), garganta, 0, 0.18, 0);
    // listras avermelhadas dentro do tubo (guias de néctar)
    const listras = K.grupo(); for (let i = 0; i < 6; i++) { const l = K.malha(K.tubo([[0, 0.25, 0], [0.12, 0.6, 0], [0.24, 0.98, 0]], 0.012, 12, 5), K.mat('#b5531c'), 0, 0.18, 0); l.rotation.y = i / 6 * Math.PI * 2; l.position.set(0, 0.18, 0); listras.add(l); }
    // cinco pétalas abertas em volta da boca
    for (let i = 0; i < 5; i++) {
      const forma = new THREE.Shape(); forma.moveTo(0, 0); forma.bezierCurveTo(0.32, 0.05, 0.42, 0.45, 0.2, 0.6); forma.bezierCurveTo(0.08, 0.66, -0.08, 0.66, -0.2, 0.6); forma.bezierCurveTo(-0.42, 0.45, -0.32, 0.05, 0, 0);
      const g = new THREE.ShapeGeometry(forma, 16), pp = g.attributes.position;
      for (let k = 0; k < pp.count; k++) { const x = pp.getX(k), y = pp.getY(k); pp.setZ(k, -x * x * 0.9 + y * y * 0.35); }   // pétala em concha, com a ponta virada
      g.computeVertexNormals();
      const a = i / 5 * Math.PI * 2, p = K.malha(g, amarelo), piv = K.grupo(p);
      piv.position.set(Math.cos(a) * 0.3, 1.2, Math.sin(a) * 0.3); piv.rotation.y = Math.PI / 2 - a;   // z local aponta para fora
      petalas.push(p); raiz.add(piv);
    }
    const calice = K.malha(K.torno([[0.02, 0], [0.12, 0.05], [0.13, 0.22], [0.08, 0.3]], 20), K.mat('#7a6a2a', { roughness: 0.9 }), 0, 0, 0);
    const pedicelo = K.malha(K.tubo([[0, 0, 0], [0.05, -0.3, 0.02], [0.18, -0.65, 0]], 0.03, 12), K.mat('#6a7a3a'), 0, 0.02, 0);
    // estames (4) e pistilo dentro do tubo
    const estames = K.grupo(); for (let i = 0; i < 4; i++) { const a = i / 4 * Math.PI * 2 + 0.4, x = Math.cos(a) * 0.09, z = Math.sin(a) * 0.09; estames.add(K.malha(K.tubo([[x * 0.5, 0.35, z * 0.5], [x, 0.85, z], [x * 1.2, 1.12, z * 1.2]], 0.01, 10, 5), K.mat('#f3e3a0'))); const ant = K.malha(new THREE.SphereGeometry(0.032, 12, 8), K.mat('#7a4a1a', { roughness: 0.9 }), x * 1.2, 1.14, z * 1.2); ant.scale.set(1, 1.6, 1); estames.add(ant); }
    estames.position.y = 0.18;
    const pistilo = K.grupo(K.malha(K.tubo([[0, 0.3, 0], [0, 0.8, 0.02], [0.02, 1.2, 0]], 0.014, 10, 6), K.mat('#e8e0a8')), K.malha(new THREE.SphereGeometry(0.04, 12, 8), K.mat('#c9d86a'), 0.02, 1.22, 0)); pistilo.position.y = 0.18;
    const polen = K.grupo(); const rr = K.rand(3); for (let i = 0; i < 40; i++) { const g = K.malha(new THREE.SphereGeometry(0.012, 6, 4), K.mat('#ffd84a', { emissive: '#a07a00', emissiveIntensity: 0.3 }), 0, 1.3, 0); g.userData.v = K.V((rr() - 0.5) * 0.6, rr() * 0.6, (rr() - 0.5) * 0.6); polen.add(g); } polen.visible = false;
    raiz.add(tubo, listras, calice, pedicelo, estames, pistilo, polen);
    raiz.rotation.x = -0.35;
    return {
      raiz,
      partes: [
        { nome: 'Pétalas', malhas: petalas, texto: 'As pétalas amarelas chamam as abelhas de longe.', mais: 'As cinco pétalas são unidas na base e formam um tubo: por isso a flor parece uma trombeta.' },
        { nome: 'Tubo e guias de néctar', malhas: [tubo, listras], texto: 'As listras mostram o caminho até o néctar, lá no fundo.', mais: 'As listrinhas avermelhadas funcionam como uma seta para o polinizador entrar na flor.' },
        { nome: 'Estames', malhas: [estames], texto: 'Os estames têm o pólen na ponta.', mais: 'A ponta do estame, a antera, solta o pólen. Quem entra na flor sai com pólen nas costas.' },
        { nome: 'Pistilo', malhas: [pistilo], texto: 'O pistilo recebe o pólen de outra flor.', mais: 'Quando o pólen chega no estigma (a pontinha do pistilo), a flor pode virar fruto com sementes.' },
        { nome: 'Cálice', malhas: [calice], texto: 'O cálice segura a flor por baixo.', mais: 'O cálice protege o botão antes de a flor abrir.' }
      ],
      E: { aberta: 1, polen: 0 },
      acoes: [
        { rotulo: 'Abrir e fechar', ico: '🌼', fazer: (E) => { E.aberta = E.aberta > 0.5 ? 0 : 1; } },
        { rotulo: 'Soltar pólen', ico: '✨', fazer: (E) => { E.polen = 1; polen.children.forEach((g) => g.position.set(0, 1.3, 0)); } }
      ],
      animar(t, dt, E) {
        E.ab = K.ir(E.ab === undefined ? E.aberta : E.ab, E.aberta, dt, 3);
        petalas.forEach((p) => { p.rotation.x = 0.25 + E.ab * 1.25; });
        polen.visible = E.polen > 0;
        if (E.polen > 0) { E.polen -= dt * 0.4; polen.children.forEach((g) => { g.position.addScaledVector(g.userData.v, dt); g.userData.v.y -= dt * 0.3; }); }
      }
    };
  });

  /* ---------- feijão germinando ---------- */
  item({
    id: 'feijao', nome: 'Feijão germinando', cat: 'plantas', emoji: '🌱', didatico: true,
    resumo: 'Da semente nasce a raiz, depois o caule e as primeiras folhas.',
    tamanho: 'A semente tem cerca de 1,5 cm, do tamanho de uma unha.',
    revisao: { status: 'rascunho' }
  }, (K) => {
    const raiz = K.grupo();
    const terra = K.malha(new THREE.CylinderGeometry(1.1, 1.2, 0.5, 48), K.mat('#7a5232', { roughness: 1 }), 0, 0.25, 0);
    const casca = K.malha(new THREE.SphereGeometry(0.3, 32, 20), K.mat('#8a3a2a', { roughness: 0.35 }), 0, 0.62, 0); casca.scale.set(1.25, 0.8, 0.85);
    const cot = [-1, 1].map((s) => { const m = K.malha(new THREE.SphereGeometry(0.22, 24, 16, 0, Math.PI), K.mat('#e8dfa8', { roughness: 0.7, side: THREE.DoubleSide }), 0, 0.85, 0); m.scale.set(1.2, 0.8, 0.6); m.rotation.y = s > 0 ? 0 : Math.PI; return m; });
    const radicula = K.malha(K.tubo([[0, 0.6, 0], [0.05, 0.35, 0.02], [0.02, 0.1, -0.02], [0.08, -0.15, 0]], 0.035, 24), K.mat('#f2ead2'));
    const raizes = K.grupo(); const rr = K.rand(5); for (let i = 0; i < 7; i++) { const y = 0.3 - i * 0.06, a = rr() * 6.28; raizes.add(K.malha(K.tubo([[0.04, y, 0], [0.04 + Math.cos(a) * 0.15, y - 0.08, Math.sin(a) * 0.15], [0.04 + Math.cos(a) * 0.3, y - 0.2, Math.sin(a) * 0.3]], 0.012, 10, 5), K.mat('#efe6cc'))); }
    const caule = K.malha(K.tubo([[0, 0.65, 0], [0.02, 1.05, 0], [-0.04, 1.4, 0.02], [0, 1.7, 0]], 0.04, 24), K.mat('#7ab84a'));
    const folhas = K.grupo(); [-1, 1].forEach((s) => { const f = new THREE.Shape(); f.moveTo(0, 0); f.bezierCurveTo(0.22, 0.05, 0.3, 0.35, 0, 0.6); f.bezierCurveTo(-0.3, 0.35, -0.22, 0.05, 0, 0); const m = K.malha(new THREE.ShapeGeometry(f, 14), K.mat('#5ea83a', { side: THREE.DoubleSide, roughness: 0.5 }), 0, 1.7, 0); m.rotation.set(-0.5, s > 0 ? 0 : Math.PI, s * 1.0); folhas.add(m); });
    raiz.add(terra, casca, ...cot, radicula, raizes, caule, folhas);
    return {
      raiz,
      partes: [
        { nome: 'Casca (tegumento)', malhas: [casca], texto: 'A casca protege a semente.', mais: 'Ela se abre quando a semente bebe água e começa a germinar.' },
        { nome: 'Cotilédones', malhas: cot, texto: 'É a lancheira da plantinha.', mais: 'Os cotilédones guardam o alimento que a planta usa até ter folhas para fazer o próprio alimento.' },
        { nome: 'Raiz', malhas: [radicula, raizes], texto: 'A raiz é a primeira a sair. Ela bebe água.', mais: 'A raiz desce, segura a planta na terra e puxa água e sais minerais.' },
        { nome: 'Caule', malhas: [caule], texto: 'O caule sobe em direção à luz.', mais: 'O caule leva a água da raiz até as folhas.' },
        { nome: 'Primeiras folhas', malhas: [folhas], texto: 'As folhas usam a luz do sol para fazer alimento.', mais: 'Com as folhas abertas, a planta faz fotossíntese: usa luz, água e gás carbônico para produzir açúcar.' }
      ],
      E: { fase: 3 },
      acoes: [{ rotulo: 'Germinar', ico: '💧', fazer: (E) => { E.fase = (E.fase + 1) % 4; } }],
      animar(t, dt, E) {
        const f = E.fase; E.v = K.ir(E.v === undefined ? f : E.v, f, dt, 2.5);
        const v = E.v, k = (a, b) => THREE.MathUtils.clamp((v - a) / (b - a), 0, 1);
        casca.visible = v < 1.6; casca.scale.set(1.25 + k(0.5, 1.5) * 0.2, 0.8, 0.85);
        cot.forEach((m, i) => { m.visible = v > 0.4; m.rotation.z = (i ? 1 : -1) * k(1.5, 2.5) * 0.9; m.position.y = 0.62 + k(1.5, 2.6) * 0.75; });
        radicula.scale.y = Math.max(0.01, k(0.4, 1.2)); radicula.visible = v > 0.4; raizes.visible = v > 1.4; raizes.scale.setScalar(Math.max(0.01, k(1.4, 2.4)));
        caule.visible = v > 1.4; caule.scale.y = Math.max(0.01, k(1.4, 2.6)); folhas.visible = v > 2.2; folhas.scale.setScalar(Math.max(0.01, k(2.2, 3))); folhas.position.y = (caule.scale.y - 1) * 1.05;
      },
      etapa: (E) => ['Semente seca', 'A raiz sai', 'O caule cresce', 'Folhas abertas'][E.fase]
    };
  });

  /* ---------- folha com nervuras e estômatos ---------- */
  item({
    id: 'folha', nome: 'Folha e estômatos', cat: 'plantas', emoji: '🍃', didatico: true,
    resumo: 'Veja as nervuras e use a lupa para ver os estômatos, as boquinhas da folha.',
    tamanho: 'A folha tem uns 10 cm. Os estômatos são tão pequenos que só aparecem no microscópio.',
    revisao: { status: 'rascunho' }
  }, (K) => {
    const raiz = K.grupo();
    const f = new THREE.Shape(); f.moveTo(0, 0); f.bezierCurveTo(0.9, 0.3, 0.8, 1.6, 0, 2.4); f.bezierCurveTo(-0.8, 1.6, -0.9, 0.3, 0, 0);
    const geo = new THREE.ShapeGeometry(f, 32), p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); p.setZ(i, Math.sin(y * 1.2) * 0.12 - x * x * 0.18); }
    geo.computeVertexNormals();
    const tex = K.textura(256, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#6cbf48'); gr.addColorStop(1, '#3f8a2e'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
    const lamina = K.malha(geo, K.mat('#ffffff', { map: tex, side: THREE.DoubleSide, roughness: 0.45 }));
    const nerv = K.malha(K.tubo([[0, -0.4, 0.02], [0, 0.8, 0.12], [0, 1.6, 0.06], [0, 2.35, -0.05]], 0.025, 30), K.mat('#c8e89a'));
    const sec = K.grupo(); for (let i = 1; i < 8; i++) { const y = i * 0.28; [-1, 1].forEach((s) => { const w = Math.sin(y / 2.4 * Math.PI) * 0.7; sec.add(K.malha(K.tubo([[0, y, Math.sin(y * 1.2) * 0.12 + 0.01], [s * w * 0.5, y + 0.15, Math.sin((y + 0.15) * 1.2) * 0.12 - w * w * 0.04], [s * w * 0.9, y + 0.32, Math.sin((y + 0.3) * 1.2) * 0.12 - w * w * 0.15]], 0.01, 10, 5), K.mat('#b5dc82'))); }); }
    const peciolo = K.malha(K.tubo([[0, 0, 0], [0, -0.4, 0.04], [0.05, -0.7, 0]], 0.04, 12), K.mat('#7ab04a'));
    // lupa: um pedaço da folha ampliado com estômatos (células-guarda em volta do poro)
    const lupa = K.grupo(), disco = K.malha(new THREE.CylinderGeometry(0.62, 0.62, 0.04, 48), K.mat('#8fd06a', { roughness: 0.6 })); disco.rotation.x = Math.PI / 2; lupa.add(disco);
    const aro = K.malha(new THREE.TorusGeometry(0.64, 0.05, 12, 48), K.mat('#d9a227', { metalness: 0.6, roughness: 0.3 })); lupa.add(aro);
    const estomatos = K.grupo(); const rr = K.rand(9);
    for (let i = 0; i < 9; i++) { const a = rr() * 6.28, d = Math.sqrt(rr()) * 0.45, x = Math.cos(a) * d, y = Math.sin(a) * d; [-1, 1].forEach((s) => { const c = K.malha(new THREE.TorusGeometry(0.05, 0.028, 8, 16, Math.PI), K.mat('#5aa23a'), x + s * 0.012, y, 0.04); c.rotation.z = s > 0 ? -Math.PI / 2 : Math.PI / 2; c.scale.set(1, 1.5, 1); estomatos.add(c); }); estomatos.add(K.malha(new THREE.CylinderGeometry(0.012, 0.012, 0.03, 8), K.mat('#1e3a14'), x, y, 0.04)); estomatos.children[estomatos.children.length - 1].rotation.x = Math.PI / 2; }
    lupa.add(estomatos); lupa.position.set(1.15, 1.6, 0.3); lupa.visible = false;
    raiz.add(lamina, nerv, sec, peciolo, lupa); raiz.rotation.x = -1.1; raiz.position.y = 0.4;
    return {
      raiz,
      partes: [
        { nome: 'Limbo', malhas: [lamina], texto: 'A parte larga da folha pega a luz do sol.', mais: 'É no limbo que acontece a maior parte da fotossíntese.' },
        { nome: 'Nervuras', malhas: [nerv, sec], texto: 'As nervuras são os canos da folha.', mais: 'Elas levam água para a folha e levam o açúcar feito na folha para o resto da planta.' },
        { nome: 'Pecíolo', malhas: [peciolo], texto: 'O cabinho prende a folha no galho.', mais: 'O pecíolo pode virar a folha para ela pegar mais luz.' },
        { nome: 'Estômatos (na lupa)', malhas: [estomatos], texto: 'São boquinhas por onde a folha respira.', mais: 'Duas células-guarda abrem e fecham o poro. Por ele entra gás carbônico e saem oxigênio e vapor de água.' }
      ],
      E: { lupa: 0, abre: 1 },
      acoes: [{ rotulo: 'Lupa', ico: '🔍', fazer: (E) => { E.lupa = E.lupa ? 0 : 1; } }, { rotulo: 'Abrir e fechar estômatos', ico: '😮', fazer: (E) => { E.abre = E.abre ? 0 : 1; E.lupa = 1; } }],
      animar(t, dt, E) {
        lupa.visible = !!E.lupa; lupa.lookAt(Biblioteca.camera.position);
        E.ab = K.ir(E.ab === undefined ? 1 : E.ab, E.abre, dt, 3);
        estomatos.children.forEach((c) => { if (c.geometry.type === 'TorusGeometry') c.scale.set(1, 1.5, 1), c.scale.x = 0.6 + E.ab * 0.6; });
      }
    };
  });

  /* ---------- pequi ---------- */
  item({
    id: 'pequi', nome: 'Pequi', cat: 'plantas', emoji: '🟡', didatico: true,
    resumo: 'O fruto do Cerrado. Corte ao meio: dentro da polpa amarela tem espinhos!',
    tamanho: 'Um pequi tem uns 8 cm, do tamanho de uma laranja pequena.',
    revisao: { status: 'rascunho' }
  }, (K) => {
    const raiz = K.grupo(), r = 0.9;
    const casca = [0, 1].map((i) => { const m = K.malha(K.amassar(new THREE.SphereGeometry(r, 48, 32, i * Math.PI, Math.PI), 0.03, 3, 2), K.mat('#4f6a28', { roughness: 0.8 })); return m; });
    const corteTex = K.textura(512, 512, (g, w, h) => {
      const c = w / 2, R = c * 0.99, anel = (rr, cor) => { g.beginPath(); g.arc(c, c, rr, 0, 6.29); g.fillStyle = cor; g.fill(); };
      anel(R, '#4f6a28'); anel(R * 0.93, '#efe8c8'); anel(R * 0.64, '#f2b21c'); anel(R * 0.5, '#e8a010');
      g.strokeStyle = '#f6eed8'; g.lineWidth = 2; for (let i = 0; i < 90; i++) { const a = i / 90 * 6.28; g.beginPath(); g.moveTo(c + Math.cos(a) * R * 0.44, c + Math.sin(a) * R * 0.44); g.lineTo(c + Math.cos(a) * R * 0.56, c + Math.sin(a) * R * 0.56); g.stroke(); }
      anel(R * 0.44, '#c9a46a'); anel(R * 0.2, '#f2ead2');
    });
    const interno = [0, 1].map((i) => { const m = K.malha(new THREE.CircleGeometry(r * 0.995, 64), K.mat('#ffffff', { map: corteTex, roughness: 0.7 })); if (!i) m.rotation.y = Math.PI; return m; });   // a face do corte olha para dentro de cada metade
    casca[0].add(interno[0]); casca[1].add(interno[1]); interno.forEach((m) => { m.visible = false; });
    const polpa = K.malha(new THREE.SphereGeometry(r * 0.62, 40, 28), K.mat('#f2b21c', { roughness: 0.45 }));
    const caroco = K.malha(new THREE.SphereGeometry(r * 0.42, 32, 24), K.mat('#c9a46a', { roughness: 0.9 }));
    const espinhos = K.grupo(); const rr = K.rand(4); for (let i = 0; i < 70; i++) { const u = rr() * 2 - 1, a = rr() * 6.28, s = Math.sqrt(1 - u * u), d = K.V(s * Math.cos(a), u, s * Math.sin(a)); const e = K.malha(new THREE.ConeGeometry(0.012, 0.12, 5), K.mat('#e8dcc0')); e.position.copy(d.clone().multiplyScalar(r * 0.44)); e.quaternion.setFromUnitVectors(K.V(0, 1, 0), d); espinhos.add(e); }
    const dentro = K.grupo(polpa, caroco, espinhos);
    dentro.visible = false;
    raiz.add(...casca, dentro); raiz.position.y = r;
    return {
      raiz,
      partes: [
        { nome: 'Casca', malhas: casca, texto: 'A casca verde e grossa protege o fruto.', mais: 'Ela fica esverdeada mesmo quando o pequi está maduro e cai do pé.' },
        { nome: 'Polpa amarela', malhas: [polpa, ...interno], texto: 'A polpa é cheirosa e muito usada na comida do Cerrado.', mais: 'É a parte que se come, raspando com cuidado com os dentes, sem morder.' },
        { nome: 'Espinhos', malhas: [espinhos], texto: 'Cuidado! Embaixo da polpa tem espinhos finos.', mais: 'Os espinhos protegem a semente. Por isso o pequi não se morde.' },
        { nome: 'Caroço e semente', malhas: [caroco], texto: 'Dentro do caroço fica a semente.', mais: 'A semente pode virar um novo pequizeiro, uma árvore típica do Cerrado.' }
      ],
      E: { corte: 0 },
      acoes: [{ rotulo: 'Cortar ao meio', ico: '🔪', fazer: (E) => { E.corte = E.corte ? 0 : 1; } }],
      animar(t, dt, E) {
        E.c = K.ir(E.c || 0, E.corte, dt, 3);
        // as duas metades se afastam e mostram a face cortada para a câmera
        casca[0].position.x = E.c * 1.0; casca[0].rotation.y = E.c * Math.PI; casca[1].position.x = -E.c * 1.0;
        interno.forEach((m) => { m.visible = E.c > 0.02; });
      }
    };
  });
})();
