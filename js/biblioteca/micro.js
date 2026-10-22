/* =====================================================================
   Biblioteca 3D · Fungos e micromundo
   Sempre modelos didáticos: tamanhos aumentados e cores escolhidas para
   ajudar a ver (o campo "escala" vira um aviso no visor).
   Textos em revisão científica.
   ===================================================================== */
(function () {
  const { item } = Biblioteca;

  /* ---------- cogumelo ---------- */
  item({
    id: 'cogumelo', nome: 'Cogumelo', cat: 'micro', emoji: '🍄', didatico: true,
    resumo: 'O cogumelo é só a parte que aparece. Embaixo da terra tem uma rede de fios.',
    tamanho: 'Este tem uns 8 cm de altura.',
    revisao: { status: 'rascunho' }
  }, (K) => {
    const raiz = K.grupo(), rr = K.rand(17);
    const terra = K.malha(new THREE.CylinderGeometry(1.4, 1.5, 0.7, 48, 1), K.mat('#6a4a30', { roughness: 1, transparent: true, opacity: 1 }), 0, 0.35, 0);
    const chapeu = K.malha(K.torno([[0.001, 1.08], [0.35, 1.05], [0.7, 0.92], [0.92, 0.7], [0.96, 0.58], [0.85, 0.56], [0.001, 0.62]], 48), K.mat('#c8784a', { roughness: 0.55 }), 0, 1.25, 0);
    const pintas = K.grupo(); for (let i = 0; i < 14; i++) { const a = rr() * 6.28, d = 0.2 + rr() * 0.6, x = Math.cos(a) * d, z = Math.sin(a) * d, y = 1.25 + 1.08 - d * d * 0.55; const s = K.malha(new THREE.SphereGeometry(0.05 + rr() * 0.04, 10, 6), K.mat('#f6eedc'), x, y, z); s.scale.y = 0.4; pintas.add(s); }
    const lamelas = K.grupo(); for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2, l = K.malha(new THREE.BoxGeometry(0.62, 0.08, 0.008), K.mat('#f0d8c0', { roughness: 0.8 })); l.position.set(Math.cos(a) * 0.5, 1.83, Math.sin(a) * 0.5); l.rotation.y = -a; lamelas.add(l); }
    const pe = K.malha(K.torno([[0.16, 0.7], [0.13, 1.2], [0.12, 1.6], [0.14, 1.88]], 24), K.mat('#f2e8d6', { roughness: 0.7 }));
    const anel = K.malha(new THREE.TorusGeometry(0.16, 0.035, 8, 24), K.mat('#e8dcc4'), 0, 1.6, 0); anel.rotation.x = Math.PI / 2; anel.scale.set(1.2, 1.2, 0.5);
    const micelio = K.grupo(); for (let i = 0; i < 26; i++) { const a = rr() * 6.28, l = 0.6 + rr() * 0.7, y0 = 0.68 - rr() * 0.1; micelio.add(K.malha(K.tubo([[0, y0, 0], [Math.cos(a) * l * 0.4, y0 - 0.1 - rr() * 0.2, Math.sin(a) * l * 0.4], [Math.cos(a + 0.4) * l, y0 - 0.2 - rr() * 0.3, Math.sin(a + 0.4) * l]], 0.012, 12, 4), K.mat('#f8f4ea', { emissive: '#888070', emissiveIntensity: 0.3 }))); }
    const esporos = K.grupo(); for (let i = 0; i < 80; i++) { const e = K.malha(new THREE.SphereGeometry(0.012, 5, 4), K.mat('#7a4a2a')); e.userData.v = K.V((rr() - 0.5) * 0.4, -0.15 - rr() * 0.2, (rr() - 0.5) * 0.4); esporos.add(e); } esporos.visible = false;
    raiz.add(terra, micelio, pe, anel, chapeu, pintas, lamelas, esporos);
    return {
      raiz,
      partes: [
        { nome: 'Chapéu', malhas: [chapeu, pintas], texto: 'O chapéu protege a parte de baixo.', mais: 'O cogumelo é o "fruto" do fungo: aparece para espalhar esporos e depois murcha.' },
        { nome: 'Lamelas', malhas: [lamelas], texto: 'Embaixo do chapéu tem folhinhas finas.', mais: 'Nas lamelas se formam os esporos, que são como sementes microscópicas do fungo.' },
        { nome: 'Anel e pé', malhas: [pe, anel], texto: 'O pé levanta o chapéu, para o vento levar os esporos.', mais: 'O anel é o que sobrou de uma película que cobria as lamelas quando o cogumelo era jovem.' },
        { nome: 'Micélio', malhas: [micelio], texto: 'Embaixo da terra fica a maior parte do fungo: uma rede de fios.', mais: 'Os fios (hifas) decompõem folhas e madeira e devolvem nutrientes ao solo.' }
      ],
      E: { esporos: 0, terra: 1 },
      acoes: [
        { rotulo: 'Soltar esporos', ico: '💨', fazer: (E) => { E.esporos = 1; esporos.children.forEach((e, i) => e.position.set(Math.cos(i) * 0.5 * Math.random(), 1.8, Math.sin(i) * 0.5 * Math.random())); } },
        { rotulo: 'Ver embaixo da terra', ico: '🔍', fazer: (E) => { E.terra = E.terra ? 0 : 1; } }
      ],
      animar(t, dt, E) {
        terra.material.opacity = K.ir(terra.material.opacity, E.terra ? 1 : 0.18, dt, 4); terra.material.depthWrite = E.terra > 0;
        esporos.visible = E.esporos > 0;
        if (E.esporos > 0) { E.esporos -= dt * 0.3; esporos.children.forEach((e) => { e.position.addScaledVector(e.userData.v, dt); e.userData.v.x += Math.sin(t * 2) * dt * 0.1; }); }
      }
    };
  });

  /* ---------- bolor no pão ---------- */
  item({
    id: 'bolor', nome: 'Bolor no pão', cat: 'micro', emoji: '🍞', didatico: true,
    resumo: 'Aquela mancha no pão velho é um fungo. Com a lupa, parece uma floresta de alfinetes.',
    tamanho: 'Cada "alfinete" tem menos de 1 mm. Aqui está bem ampliado.',
    escala: 'Ampliado umas 50 vezes. Cores escolhidas para ajudar a ver.',
    revisao: { status: 'rascunho' }
  }, (K) => {
    const raiz = K.grupo(), rr = K.rand(23);
    const pao = K.malha(K.amassar(new THREE.BoxGeometry(2.6, 0.5, 1.8, 10, 3, 8), 0.02, 3, 2), K.mat('#e8d0a0', { roughness: 1 }), 0, 0.25, 0);
    const casca = K.malha(new THREE.BoxGeometry(2.66, 0.52, 1.86), K.mat('#a86a30', { roughness: 0.9 }), 0, 0.24, 0); casca.scale.set(1, 0.98, 1);
    const hifas = K.grupo(), esporangios = K.grupo();
    for (let c = 0; c < 3; c++) {
      const cx = -0.7 + c * 0.75 + (rr() - 0.5) * 0.3, cz = (rr() - 0.5) * 0.8, cor = ['#3a5a3a', '#2a3a4a', '#5a6a3a'][c];
      const mancha = K.malha(new THREE.CircleGeometry(0.42, 32), K.mat(cor, { roughness: 1, transparent: true, opacity: 0.55 }), cx, 0.512, cz); mancha.rotation.x = -Math.PI / 2; hifas.add(mancha);
      for (let i = 0; i < 26; i++) {
        const a = rr() * 6.28, d = Math.sqrt(rr()) * 0.38, x = cx + Math.cos(a) * d, z = cz + Math.sin(a) * d, h = 0.15 + rr() * 0.25;
        hifas.add(K.malha(K.tubo([[x, 0.5, z], [x + (rr() - 0.5) * 0.05, 0.5 + h * 0.6, z], [x, 0.5 + h, z]], 0.006, 6, 4), K.mat('#f2f2ea')));
        const bola = K.malha(new THREE.SphereGeometry(0.028, 10, 8), K.mat(cor, { roughness: 0.7 }), x, 0.5 + h, z); bola.userData.h = h; esporangios.add(bola);
      }
    }
    raiz.add(casca, pao, hifas, esporangios);
    return {
      raiz,
      partes: [
        { nome: 'Hifas (os fios)', malhas: [hifas], texto: 'O fungo cresce como fiozinhos brancos dentro do pão.', mais: 'As hifas soltam substâncias que desmancham o pão e absorvem o alimento.' },
        { nome: 'Esporângios (as bolinhas)', malhas: [esporangios], texto: 'Na ponta de cada fio tem uma bolinha cheia de esporos.', mais: 'Quando a bolinha se abre, milhares de esporos voam pelo ar e podem cair em outro alimento.' },
        { nome: 'Pão', malhas: [pao, casca], texto: 'O bolor gosta de lugar úmido e escuro.', mais: 'Pão com bolor vai para o lixo inteiro: os fios podem estar espalhados onde a gente não vê.' }
      ],
      E: { crescer: 1 },
      acoes: [{ rotulo: 'Ver crescer', ico: '⏱️', fazer: (E) => { E.crescer = 0; E.g = 0; } }],
      animar(t, dt, E) { E.g = K.ir(E.g === undefined ? 1 : E.g, 1, dt, 0.7); if (E.crescer === 0 && E.g > 0.98) E.crescer = 1; const g = E.crescer ? 1 : E.g; hifas.scale.y = Math.max(0.01, g); esporangios.children.forEach((b) => { b.position.y = 0.5 + b.userData.h * g; b.scale.setScalar(Math.max(0.01, (g - 0.5) * 2)); }); }
    };
  });

  /* ---------- célula animal ---------- */
  item({
    id: 'celula', nome: 'Célula animal', cat: 'micro', emoji: '🔬', didatico: true,
    resumo: 'O tijolinho de que somos feitos. Corte ao meio e veja o que tem dentro.',
    tamanho: 'Uma célula tem uns 0,02 mm. Num pontinho de caneta cabem dezenas.',
    escala: 'Ampliada umas 50 mil vezes. Cores de mentirinha para ajudar a ver.',
    revisao: { status: 'rascunho' }
  }, (K) => {
    const raiz = K.grupo(), r = 1.2, rr = K.rand(29);
    const membrana = [0, 1].map((i) => K.malha(K.amassar(new THREE.SphereGeometry(r, 48, 32, i * Math.PI, Math.PI), 0.025, 2.5, 3), K.mat('#f2a6b4', { roughness: 0.35, transparent: true, opacity: 0.92, side: THREE.DoubleSide })));
    const corte = K.malha(new THREE.CircleGeometry(r * 0.99, 48), K.mat('#fbe4c8', { roughness: 0.6, transparent: true, opacity: 0.6, side: THREE.DoubleSide }));
    const nucleo = K.malha(new THREE.SphereGeometry(0.42, 32, 24), K.mat('#7a5ad0', { roughness: 0.4 }), 0.1, 0.05, 0.05);
    const nucleolo = K.malha(new THREE.SphereGeometry(0.14, 20, 14), K.mat('#3a2a8a'), 0.18, 0.12, 0.28);
    const mito = K.grupo(); for (let i = 0; i < 7; i++) { const a = rr() * 6.28, d = 0.65 + rr() * 0.2, m = K.malha(new THREE.CapsuleGeometry(0.07, 0.22, 6, 12), K.mat('#e8803a', { roughness: 0.5 }), Math.cos(a) * d, (rr() - 0.5) * 0.6, Math.abs(Math.sin(a)) * d * 0.6 + 0.05); m.rotation.set(rr() * 3, rr() * 3, rr() * 3); mito.add(m); }
    const reticulo = K.grupo(); for (let i = 0; i < 5; i++) reticulo.add(K.malha(new THREE.TorusGeometry(0.55 + i * 0.06, 0.018, 6, 40, Math.PI * 0.9), K.mat('#5ab0d8'), 0.1, 0.05, 0.05));
    reticulo.rotation.set(0.4, 0.3, 0.2);
    const golgi = K.grupo(); for (let i = 0; i < 4; i++) { const g = K.malha(new THREE.TorusGeometry(0.2 - i * 0.02, 0.025, 6, 20, Math.PI), K.mat('#e8c83a'), -0.62, 0.25 - i * 0.07, 0.35); g.rotation.z = -0.5; golgi.add(g); }
    const dentro = K.grupo(nucleo, nucleolo, mito, reticulo, golgi);
    raiz.add(...membrana, corte, dentro); raiz.position.y = r;
    return {
      raiz,
      partes: [
        { nome: 'Membrana', malhas: membrana, texto: 'A membrana é a pele da célula.', mais: 'Ela escolhe o que entra e o que sai: deixa entrar alimento e oxigênio e põe para fora o que sobra.' },
        { nome: 'Núcleo', malhas: [nucleo, nucleolo], texto: 'O núcleo guarda as instruções da célula.', mais: 'Dentro dele fica o DNA, uma receita que diz como a célula funciona e como o corpo se forma.' },
        { nome: 'Mitocôndrias', malhas: [mito], texto: 'São as usinas de energia.', mais: 'As mitocôndrias usam o oxigênio que a gente respira para tirar energia do alimento.' },
        { nome: 'Retículo endoplasmático', malhas: [reticulo], texto: 'Uma rede de canais em volta do núcleo.', mais: 'É onde a célula fabrica e transporta proteínas e gorduras.' },
        { nome: 'Complexo de Golgi', malhas: [golgi], texto: 'O correio da célula.', mais: 'Ele embala o que a célula produz e manda para onde precisa ir.' }
      ],
      E: { corte: 0 },
      acoes: [{ rotulo: 'Cortar ao meio', ico: '✂️', fazer: (E) => { E.corte = E.corte ? 0 : 1; } }],
      animar(t, dt, E) {
        E.c = K.ir(E.c || 0, E.corte, dt, 3);
        membrana[0].position.z = E.c * 1.6; membrana[0].rotation.x = E.c * 0.6;
        corte.visible = false; dentro.scale.setScalar(E.c > 0.05 ? 1 : 0.001);
        mito.children.forEach((m, i) => { m.rotation.y += dt * 0.3 * (i % 2 ? 1 : -1); });
      }
    };
  });

  /* ---------- bactéria em bastonete ---------- */
  item({
    id: 'bacteria', nome: 'Bactéria', cat: 'micro', emoji: '🦠', didatico: true,
    resumo: 'Um ser vivo de uma célula só. Ela nada girando o flagelo como uma hélice.',
    tamanho: 'Tem uns 0,002 mm. Mil delas enfileiradas dariam 2 mm.',
    escala: 'Ampliada umas 500 mil vezes. Cores de mentirinha. A maioria das bactérias não faz mal e muitas ajudam.',
    revisao: { status: 'rascunho' }
  }, (K) => {
    const raiz = K.grupo(), rr = K.rand(37);
    const corpo = K.malha(new THREE.CapsuleGeometry(0.4, 1.4, 12, 32), K.mat('#7ad08a', { roughness: 0.35, transparent: true, opacity: 0.88 }));
    corpo.rotation.z = Math.PI / 2;
    const parede = K.malha(new THREE.CapsuleGeometry(0.44, 1.42, 12, 32), K.mat('#c8f0c0', { roughness: 0.2, transparent: true, opacity: 0.25, depthWrite: false })); parede.rotation.z = Math.PI / 2;
    const dna = K.malha(K.tubo(Array.from({ length: 30 }, (_, i) => [Math.sin(i * 0.9) * 0.18 + (i / 29 - 0.5) * 0.9, Math.cos(i * 1.3) * 0.15, Math.sin(i * 1.7) * 0.12]), 0.025, 120, 6), K.mat('#d84a8a'));
    const ribossomos = K.grupo(); for (let i = 0; i < 40; i++) ribossomos.add(K.malha(new THREE.SphereGeometry(0.025, 6, 4), K.mat('#3a7a4a'), (rr() - 0.5) * 1.6, (rr() - 0.5) * 0.5, (rr() - 0.5) * 0.5));
    const pili = K.grupo(); for (let i = 0; i < 30; i++) { const a = rr() * 6.28, x = (rr() - 0.5) * 1.4, d = K.V(0, Math.cos(a), Math.sin(a)); pili.add(K.malha(K.tubo([[x, d.y * 0.42, d.z * 0.42], [x + (rr() - 0.5) * 0.1, d.y * 0.62, d.z * 0.62]], 0.006, 4, 3), K.mat('#a8e0a0'))); }
    const flagelo = K.grupo(); const pts = []; for (let i = 0; i <= 60; i++) { const t = i / 60; pts.push([-1.1 - t * 2.2, Math.sin(t * Math.PI * 4) * 0.18, Math.cos(t * Math.PI * 4) * 0.18]); }
    flagelo.add(K.malha(K.tubo(pts, 0.022, 160, 6), K.mat('#5a9a5a')));
    raiz.add(corpo, parede, dna, ribossomos, pili, flagelo); raiz.position.y = 0.9; raiz.rotation.y = 0.4;
    return {
      raiz,
      partes: [
        { nome: 'Parede e membrana', malhas: [corpo, parede], texto: 'A bactéria é uma célula só, com uma capa protetora.', mais: 'A parede dá forma de bastão e protege a célula. Por dentro tem a membrana.' },
        { nome: 'DNA solto', malhas: [dna], texto: 'O DNA fica solto, sem núcleo.', mais: 'Diferente das nossas células, a bactéria não tem núcleo: o DNA fica enrolado no meio do citoplasma.' },
        { nome: 'Ribossomos', malhas: [ribossomos], texto: 'Pontinhos que fabricam proteínas.', mais: 'Os ribossomos leem as instruções do DNA e montam as proteínas.' },
        { nome: 'Pelos (fímbrias)', malhas: [pili], texto: 'Pelinhos para grudar nas coisas.', mais: 'As fímbrias ajudam a bactéria a se prender em superfícies.' },
        { nome: 'Flagelo', malhas: [flagelo], texto: 'Um rabinho que gira como hélice.', mais: 'Um pequeno motor na base gira o flagelo e empurra a bactéria pela água.' }
      ],
      E: { nadar: 1 },
      acoes: [{ rotulo: 'Nadar', ico: '🌀', fazer: (E) => { E.nadar = E.nadar ? 0 : 1; } }],
      animar(t, dt, E) { if (E.nadar) { flagelo.rotation.x += dt * 9; raiz.position.x = Math.sin(t * 0.6) * 0.15; } }
    };
  });
})();
