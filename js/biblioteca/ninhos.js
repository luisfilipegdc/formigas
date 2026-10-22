/* =====================================================================
   Biblioteca 3D · Ninhos, casas e rastros
   Modelos didáticos. Textos em revisão científica.
   ===================================================================== */
(function () {
  const { item } = Biblioteca;

  /* ---------- casa do joão-de-barro ---------- */
  item({
    id: 'joao-de-barro', nome: 'Casa do joão-de-barro', cat: 'ninhos', emoji: '🏺', didatico: true,
    resumo: 'Um forninho de barro em cima do galho. Corte ao meio e veja o corredor e o quarto dos ovos.',
    tamanho: 'A casa tem uns 25 cm, do tamanho de uma bola de futebol.',
    revisao: { status: 'rascunho' }
  }, (K) => {
    const raiz = K.grupo();
    const barro = K.mat('#b07a48', { roughness: 0.95 }), barroIn = K.mat('#8a5a34', { roughness: 1, side: THREE.DoubleSide });
    const galho = K.malha(K.tubo([[-1.9, 0.05, 0.1], [-0.6, 0, 0], [0.6, 0.05, -0.05], [1.9, -0.05, 0.1]], 0.13, 24, 10), K.mat('#6b4a2c', { roughness: 0.9 }));
    // forno: domo achatado; metade da frente separada para o corte
    const domo = [0, 1].map((i) => { const g = K.amassar(new THREE.SphereGeometry(1, 40, 24, i * Math.PI, Math.PI, 0, Math.PI * 0.62), 0.03, 4, 3); const m = K.malha(g, i ? barro : barro); m.scale.set(1.2, 0.95, 0.95); m.position.y = 0.05; return m; });
    const chaoNinho = K.malha(new THREE.CylinderGeometry(1.15, 1.1, 0.12, 40), barro, 0, 0.1, 0);
    const porta = K.malha(new THREE.CircleGeometry(0.22, 24), K.mat('#2a1a10'), 0.95, 0.55, 0.42); porta.lookAt(3, 0.55, 1.4);
    // dentro: parede interna em espiral (antecâmara) e o quarto com ninho de capim e ovos
    const parede = K.malha(new THREE.CylinderGeometry(0.62, 0.62, 0.6, 32, 1, true, 0, Math.PI * 1.2), barroIn, 0, 0.45, 0); parede.rotation.y = -0.4;
    const capim = K.malha(new THREE.TorusGeometry(0.3, 0.1, 10, 28), K.mat('#d8c27a', { roughness: 1 }), -0.25, 0.22, -0.1); capim.rotation.x = Math.PI / 2;
    const ovos = K.grupo(); [[-0.3, -0.05], [-0.18, -0.15], [-0.3, -0.22]].forEach(([x, z]) => { const o = K.malha(new THREE.SphereGeometry(0.08, 16, 12), K.mat('#fbf7ee', { roughness: 0.4 }), x, 0.24, z); o.scale.set(1, 0.8, 1.3); ovos.add(o); });
    const dentro = K.grupo(parede, capim, ovos);
    const passaro = K.grupo(); { const corpo = K.malha(new THREE.SphereGeometry(0.22, 20, 14), K.mat('#b06a3a'), 0, 0, 0); corpo.scale.set(1.3, 1, 0.9); const peito = K.malha(new THREE.SphereGeometry(0.19, 20, 14), K.mat('#e8c8a0'), 0.08, -0.03, 0); const cab = K.malha(new THREE.SphereGeometry(0.13, 16, 12), K.mat('#a0603a'), 0.26, 0.14, 0); const bico = K.malha(new THREE.ConeGeometry(0.035, 0.14, 8), K.mat('#3a2a1a'), 0.42, 0.14, 0); bico.rotation.z = -Math.PI / 2; const olho = K.malha(new THREE.SphereGeometry(0.025, 8, 6), K.mat('#111'), 0.33, 0.19, 0.08); const cauda = K.malha(new THREE.BoxGeometry(0.28, 0.04, 0.12), K.mat('#8a4a2a'), -0.32, 0.04, 0); cauda.rotation.z = 0.3; passaro.add(corpo, peito, cab, bico, olho, cauda); }
    passaro.position.set(1.55, 0.3, 0.2); passaro.rotation.y = Math.PI;
    raiz.add(galho, chaoNinho, ...domo, porta, dentro, passaro); raiz.position.y = 0.2;
    return {
      raiz,
      partes: [
        { nome: 'Paredes de barro', malhas: domo, texto: 'O joão-de-barro faz a casa com barro, palha e esterco.', mais: 'O casal leva centenas de bolinhas de barro no bico. A casa pode pesar uns 4 quilos.' },
        { nome: 'Porta', malhas: [porta], texto: 'A porta fica de lado, nunca no meio.', mais: 'A entrada lateral e o corredor dificultam a entrada de predadores e do vento.' },
        { nome: 'Corredor (antecâmara)', malhas: [parede], texto: 'Logo depois da porta tem uma parede que faz um corredor.', mais: 'Essa parede interna esconde o quarto e protege os filhotes.' },
        { nome: 'Quarto dos ovos', malhas: [capim, ovos], texto: 'No fundo tem um ninho macio com os ovos.', mais: 'O ninho é forrado de capim e penas. A fêmea costuma botar de 2 a 4 ovos.' },
        { nome: 'João-de-barro', malhas: [passaro], texto: 'O dono da casa: um passarinho marrom e cantador.', mais: 'É uma ave comum no Brasil. O casal canta junto, em dueto.' }
      ],
      E: { corte: 0 },
      acoes: [{ rotulo: 'Ver por dentro', ico: '✂️', fazer: (E) => { E.corte = E.corte ? 0 : 1; } }],
      animar(t, dt, E) {
        E.c = K.ir(E.c || 0, E.corte, dt, 3);
        domo[0].position.z = E.c * 1.3; domo[0].position.y = 0.05 + E.c * 0.4; domo[0].rotation.x = E.c * 0.5;
        passaro.position.y = 0.3 + Math.abs(Math.sin(t * 2)) * 0.05; passaro.rotation.z = Math.sin(t * 3) * 0.05;
      }
    };
  });

  /* ---------- favo de mel ---------- */
  item({
    id: 'favo', nome: 'Favo de mel', cat: 'ninhos', emoji: '🍯', didatico: true,
    resumo: 'Casinhas de cera de seis lados. Umas guardam mel, outras guardam larvas.',
    tamanho: 'Cada alvéolo tem uns 5 mm, menor que um grão de feijão.',
    revisao: { status: 'rascunho' }
  }, (K) => {
    const raiz = K.grupo(), cera = K.mat('#e8b84a', { roughness: 0.35, side: THREE.DoubleSide });
    const mel = K.mat('#d88a10', { roughness: 0.05, metalness: 0, transparent: true, opacity: 0.9, emissive: '#5a2a00', emissiveIntensity: 0.15 });
    const tampa = K.mat('#f6e2a0', { roughness: 0.6 }), larva = K.mat('#fbf4e2', { roughness: 0.5 });
    const alveolos = K.grupo(), meles = K.grupo(), tampas = K.grupo(), larvas = K.grupo();
    const r = 0.18, w = Math.sqrt(3) * r;
    for (let i = -4; i <= 4; i++) for (let j = -3; j <= 3; j++) {
      const x = i * w + (j % 2 ? w / 2 : 0), y = j * r * 1.5 + 1.2; if (Math.hypot(x / 1.6, (y - 1.2) / 1.1) > 1) continue;
      const c = K.malha(new THREE.CylinderGeometry(r, r, 0.5, 6, 1, true), cera, x, y, 0); c.rotation.x = Math.PI / 2; c.rotation.y = Math.PI / 6; alveolos.add(c);
      const k = (i * 7 + j * 13 + 40) % 5;
      if (k < 2) { const m = K.malha(new THREE.CylinderGeometry(r * 0.92, r * 0.92, 0.36, 6), mel, x, y, -0.05); m.rotation.x = Math.PI / 2; m.rotation.y = Math.PI / 6; meles.add(m); if (k === 0) { const tp = K.malha(new THREE.CylinderGeometry(r * 0.96, r * 0.96, 0.03, 6), tampa, x, y, 0.24); tp.rotation.x = Math.PI / 2; tp.rotation.y = Math.PI / 6; tampas.add(tp); } }
      else if (k === 2) { const l = K.malha(new THREE.TorusGeometry(0.07, 0.045, 10, 16, Math.PI * 1.6), larva, x, y, -0.1); larvas.add(l); }
    }
    const fundo = K.malha(new THREE.CircleGeometry(1.75, 48), K.mat('#d8a43a', { roughness: 0.5 }), 0, 1.2, -0.25); fundo.scale.y = 0.72;
    const moldura = K.malha(new THREE.TorusGeometry(1.75, 0.07, 10, 64), K.mat('#c08a30')); moldura.position.set(0, 1.2, 0); moldura.scale.y = 0.72;
    raiz.add(fundo, alveolos, meles, tampas, larvas, moldura);
    return {
      raiz,
      partes: [
        { nome: 'Alvéolos de cera', malhas: [alveolos], texto: 'Cada casinha tem seis lados.', mais: 'O formato de hexágono encaixa sem sobrar espaço e gasta pouca cera. A cera sai de glândulas na barriga das abelhas.' },
        { nome: 'Mel', malhas: [meles], texto: 'Este é o estoque de comida da colmeia.', mais: 'O mel é néctar de flor que as abelhas engolem, devolvem e secam abanando as asas.' },
        { nome: 'Tampas de cera', malhas: [tampas], texto: 'Quando o mel fica pronto, ganha uma tampa.', mais: 'A tampa de cera (opérculo) guarda o mel por muito tempo.' },
        { nome: 'Larvas', malhas: [larvas], texto: 'Em algumas casinhas crescem as abelhas bebês.', mais: 'As larvas comem geleia e pólen. Depois a casinha é fechada e a larva vira pupa e, então, abelha adulta.' }
      ],
      E: { tampa: 1 },
      acoes: [{ rotulo: 'Tirar as tampas', ico: '🥄', fazer: (E) => { E.tampa = E.tampa ? 0 : 1; } }],
      animar(t, dt, E) { tampas.visible = !!E.tampa; larvas.children.forEach((l, i) => { l.rotation.z = Math.sin(t * 2 + i) * 0.3; }); }
    };
  });

  /* ---------- concha de caramujo ---------- */
  item({
    id: 'concha', nome: 'Concha de caramujo', cat: 'ninhos', emoji: '🐌', didatico: true,
    resumo: 'Uma casa que cresce junto com o bicho, enrolando em espiral.',
    tamanho: 'Esta tem uns 4 cm, do tamanho de uma tampinha de garrafa.',
    revisao: { status: 'rascunho' }
  }, (K) => {
    const raiz = K.grupo();
    // espiral cônica (concha de caramujo de jardim)
    const voltas = 4.2, n = 260, pts = [];
    for (let i = 0; i <= n; i++) { const a = i / n * voltas * Math.PI * 2, s = Math.exp(a * 0.12) * 0.05; pts.push([Math.cos(a) * s, 1.2 - s * 0.95, Math.sin(a) * s]); }
    const curva = new THREE.CatmullRomCurve3(pts.map((p) => K.V(...p)));
    const geo = new THREE.TubeGeometry(curva, n, 1, 18, false), p = geo.attributes.position;
    const Rs = (t) => Math.exp(t * voltas * Math.PI * 2 * 0.12) * 0.05, Rt = (t) => Rs(t) * 0.56;
    for (let i = 0; i < p.count; i++) { const seg = Math.floor(i / 19), t = seg / n, c = curva.getPointAt(Math.min(1, t)), r = Rt(t); const v = K.V(p.getX(i), p.getY(i), p.getZ(i)).sub(c).normalize().multiplyScalar(r).add(c); p.setXYZ(i, v.x, v.y, v.z); }
    geo.computeVertexNormals();
    const tex = K.textura(512, 64, (g, w, h) => { for (let x = 0; x < w; x++) { const k = (Math.sin(x * 0.35) + 1) / 2; g.fillStyle = `rgb(${200 - k * 70},${150 - k * 60},${90 - k * 40})`; g.fillRect(x, 0, 1, h); } g.fillStyle = 'rgba(90,50,20,.55)'; g.fillRect(0, h * 0.42, w, h * 0.16); });
    tex.wrapS = THREE.RepeatWrapping; tex.repeat.set(1, 1);
    const concha = K.malha(geo, K.mat('#ffffff', { map: tex, roughness: 0.35, metalness: 0.05 }));
    const fim = curva.getPointAt(1), tan = curva.getTangentAt(1), rFim = Rt(1);
    const abertura = K.malha(new THREE.RingGeometry(rFim * 0.75, rFim * 1.05, 28), K.mat('#f2e2c8', { side: THREE.DoubleSide, roughness: 0.4 })); abertura.position.copy(fim); abertura.lookAt(fim.clone().add(tan));
    const columela = K.malha(new THREE.CylinderGeometry(0.03, 0.07, 1.4, 12), K.mat('#f0e0c0'), 0, 0.55, 0); columela.visible = false;
    raiz.add(concha, abertura, columela); raiz.rotation.z = 0.5; raiz.position.y = 0.1;
    return {
      raiz,
      partes: [
        { nome: 'Espiral', malhas: [concha], texto: 'A concha enrola sempre para o mesmo lado.', mais: 'O caramujo constrói a concha com calcário e vai aumentando a borda conforme cresce. Cada volta é maior que a anterior.' },
        { nome: 'Abertura', malhas: [abertura], texto: 'Por aqui o caramujo sai e se esconde.', mais: 'Em tempo seco, alguns caramujos fecham a abertura com uma película de muco que endurece.' },
        { nome: 'Columela (eixo)', malhas: [columela], texto: 'No meio tem um eixo, como uma escada em caracol.', mais: 'O músculo do caramujo se prende na columela para puxar o corpo para dentro.' }
      ],
      E: { raio: 0 },
      acoes: [{ rotulo: 'Raio-X', ico: '🩻', fazer: (E) => { E.raio = E.raio ? 0 : 1; } }],
      animar(t, dt, E) { columela.visible = !!E.raio; concha.material.transparent = true; concha.material.opacity = K.ir(concha.material.opacity, E.raio ? 0.3 : 1, dt, 4); }
    };
  });

  /* ---------- pena ---------- */
  item({
    id: 'pena', nome: 'Pena de arara', cat: 'ninhos', emoji: '🪶', didatico: true,
    resumo: 'Parece uma folha, mas é feita de fios que se prendem como velcro. Abra e feche as barbas.',
    tamanho: 'Uma pena da cauda da arara pode passar de 40 cm.',
    revisao: { status: 'rascunho' }
  }, (K) => {
    const raiz = K.grupo(), comp = 3;
    const raque = K.malha(K.tubo([[0, 0, 0], [0.05, comp * 0.5, 0.06], [0, comp, 0]], 0.03, 30), K.mat('#f2ead8'));
    const calamo = K.malha(K.tubo([[0, -0.5, 0], [0, 0, 0]], 0.045, 6), K.mat('#e8dcc8', { roughness: 0.3, transparent: true, opacity: 0.85 }));
    const barbas = K.grupo(), rr = K.rand(13), cores = ['#d8302a', '#d8302a', '#e8a020', '#2a6ad8'];
    for (let i = 0; i < 70; i++) {
      const t = i / 70, y = 0.1 + t * (comp - 0.15), larg = Math.sin(Math.min(1, t * 1.2) * Math.PI * 0.9) * 0.45 + 0.05;
      const cor = cores[Math.min(3, Math.floor(t * 4))];
      [-1, 1].forEach((s) => { const b = K.malha(K.tubo([[0, 0, 0], [s * larg * 0.5, larg * 0.25, 0.02], [s * larg, larg * 0.55, 0]], 0.012, 8, 4), K.mat(cor, { roughness: 0.5 })); b.position.set(0.05 * Math.sin(t * Math.PI), y, 0.06 * Math.sin(t * Math.PI)); b.userData.s = s; b.userData.fenda = (i > 30 && i < 38) ? 1 : 0; b.userData.y0 = y; barbas.add(b); });
    }
    raiz.add(calamo, raque, barbas); raiz.rotation.z = -0.9; raiz.position.set(-0.9, 0.3, 0);
    return {
      raiz,
      partes: [
        { nome: 'Raque (o eixo)', malhas: [raque], texto: 'O meio da pena é um eixo firme.', mais: 'A raque é oca e leve, feita de queratina, a mesma coisa das nossas unhas.' },
        { nome: 'Barbas', malhas: [barbas], texto: 'Dos lados saem fios chamados barbas.', mais: 'Cada barba tem ganchinhos (as bárbulas) que se prendem nas vizinhas, como um velcro. Por isso a pena fica lisa.' },
        { nome: 'Cálamo', malhas: [calamo], texto: 'A ponta de baixo ficava presa na pele da arara.', mais: 'Quando a pena está crescendo, o cálamo recebe sangue. Depois fica oco.' }
      ],
      E: { abrir: 0 },
      acoes: [{ rotulo: 'Abrir e fechar as barbas', ico: '🪶', fazer: (E) => { E.abrir = E.abrir ? 0 : 1; } }],
      animar(t, dt, E) { E.a = K.ir(E.a || 0, E.abrir, dt, 3); barbas.children.forEach((b) => { if (b.userData.fenda) b.rotation.z = b.userData.s * E.a * 0.5; }); }
    };
  });
})();
