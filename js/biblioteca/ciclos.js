/* =====================================================================
   Biblioteca 3D · ciclos de vida (animações narradas)
   Ciclo da borboleta-azul: ovo → lagarta comendo a folha → sobe no galho
   → fica em J → crisálida → a borboleta sai, estica as asas e voa.
   E.T é o relógio do ciclo (segundos); os botões pulam para cada fase.
   narrar(E, nivel) devolve o texto da fase (o visor fala e mostra).
   ===================================================================== */
(function () {
  const { item } = Biblioteca;
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  // fases do ciclo: [início em segundos, nome, texto curto (pequenos), texto completo]
  const FASES = [
    [0, 'Ovo', 'A mamãe borboleta botou um ovinho na folha.', 'A borboleta põe os ovos na planta que a lagarta vai comer. Do ovo sai uma lagartinha bem pequena.'],
    [3, 'Lagarta comendo', 'A lagarta come, come, come e fica grandona!', 'A lagarta come folhas o dia inteiro e cresce muito. Para caber no corpo novo, ela troca de pele várias vezes.'],
    [11, 'Procurando um lugar', 'Agora ela procura um lugar seguro.', 'Quando para de crescer, a lagarta sai da folha e procura um galho protegido.'],
    [15, 'Pendurada em J', 'Ela fica pendurada de cabeça para baixo.', 'Ela se prende no galho com um fiozinho de seda e fica pendurada em forma de J.'],
    [17, 'Crisálida', 'Virou uma crisálida! Parece que dorme, mas lá dentro tudo está mudando.', 'A pele vira uma casca: a crisálida. Lá dentro, o corpo da lagarta se transforma em borboleta. Isso se chama metamorfose.'],
    [21.5, 'A borboleta sai', 'Olha! A borboleta está saindo!', 'A crisálida fica transparente e a borboleta sai com as asas amassadas. Ela enche as asas de líquido para esticar e espera secar.'],
    [24.5, 'Borboleta voando', 'Agora ela voa! Um dia ela vai botar ovinhos também.', 'Pronto: borboleta adulta. Ela suga o caldo das frutas e, um dia, põe ovos. E o ciclo recomeça.']
  ];
  const fase = (T) => { let i = 0; FASES.forEach((f, k) => { if (T >= f[0]) i = k; }); return i; };
  const sm = (a, b, x) => THREE.MathUtils.smoothstep(x, a, b);

  item({
    id: 'ciclo-borboleta', nome: 'Ciclo da borboleta', cat: 'bichos', emoji: '🦋', didatico: true,
    resumo: 'Do ovo à borboleta: veja a lagarta comer, virar crisálida e sair voando.',
    tamanho: 'A borboleta-azul tem de 12 a 15 cm de asa a asa. A lagarta chega a uns 8 cm.',
    escala: 'Fora de escala: a lagarta e a crisálida estão maiores para dar para ver.',
    revisao: { status: 'rascunho' }
  }, (K) => {
    const raiz = K.grupo();

    /* ---------- planta: caule, galho e uma folha que vai sendo comida ---------- */
    const mCaule = K.mat('#6f8f3a', { roughness: 0.8 });
    const caule = K.malha(K.tubo([[0, 0, 0], [0.03, 0.6, 0], [-0.02, 1.2, 0], [0, 1.72, 0]], 0.035, 30), mCaule);
    const galho = K.malha(K.tubo([[0, 1.6, 0], [0.3, 1.68, 0.02], [0.62, 1.7, 0.03], [0.9, 1.74, 0.04]], 0.025, 24), mCaule);
    const base = K.malha(new THREE.CylinderGeometry(0.5, 0.56, 0.08, 40), K.mat('#7a5a3c', { roughness: 1 }), 0, 0.04, 0);

    const W = 512, H = 256, LX = 1.3, LZ = 0.65;
    const larg = (cx) => 112 * Math.pow(Math.max(0, Math.sin(Math.PI * cx / W)), 0.7);
    const mordidas = [];                                   // mordidas da ponta para o cabinho, nas duas beiradas
    for (let k = 0; k < 16; k++) { const cx = 478 - k * 17, s = k % 2 ? 1 : -1; mordidas.push([cx, 128 + s * larg(cx) * 0.92, 24 + (k % 3) * 4]); }
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const g = cv.getContext('2d');
    const texFolha = new THREE.CanvasTexture(cv); texFolha.encoding = THREE.sRGBEncoding; texFolha.anisotropy = 4;
    let comidas = -1;
    function pintarFolha(n) {
      if (n === comidas) return; comidas = n;
      g.clearRect(0, 0, W, H);
      g.beginPath(); g.moveTo(0, 128);
      for (let x = 0; x <= W; x += 8) g.lineTo(x, 128 - larg(x));
      for (let x = W; x >= 0; x -= 8) g.lineTo(x, 128 + larg(x));
      g.closePath();
      const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#4f9a34'); gr.addColorStop(0.5, '#6dbb45'); gr.addColorStop(1, '#3f862c');
      g.fillStyle = gr; g.fill();
      g.strokeStyle = '#c9e89a'; g.lineWidth = 5; g.beginPath(); g.moveTo(0, 128); g.lineTo(W - 20, 128); g.stroke();
      g.lineWidth = 2.5; for (let x = 50; x < W - 40; x += 42) [-1, 1].forEach((s) => { g.beginPath(); g.moveTo(x, 128); g.quadraticCurveTo(x + 30, 128 + s * larg(x) * 0.4, x + 52, 128 + s * larg(x + 52) * 0.85); g.stroke(); });
      g.globalCompositeOperation = 'destination-out';            // as mordidas tiram pedaços da folha
      for (let k = 0; k < n; k++) { const [x, y, r] = mordidas[k]; g.beginPath(); g.arc(x, y, r, 0, 6.29); g.fill(); [-1, 1].forEach((d) => { g.beginPath(); g.arc(x + d * r * 0.7, y + (y > 128 ? 6 : -6), r * 0.7, 0, 6.29); g.fill(); }); }
      if (n >= 16) { g.beginPath(); g.ellipse(W, 128, 120, 90, 0, 0, 6.29); g.fill(); }
      g.globalCompositeOperation = 'source-over';
      texFolha.needsUpdate = true;
    }
    pintarFolha(0);
    const geoF = new THREE.PlaneGeometry(LX, LZ, 26, 8); geoF.rotateX(-Math.PI / 2);
    const curl = (x, z) => -z * z * 0.7 + Math.sin((x + 0.65) * 2.2) * 0.04;
    const pf = geoF.attributes.position; for (let i = 0; i < pf.count; i++) pf.setY(i, curl(pf.getX(i), pf.getZ(i)));
    geoF.computeVertexNormals();
    const folha = K.malha(geoF, K.mat('#ffffff', { map: texFolha, side: THREE.DoubleSide, alphaTest: 0.5, transparent: false, roughness: 0.5 }));
    const folhaG = K.grupo(folha); folhaG.position.set(0.7, 0.56, 0); folhaG.rotation.set(0, 0.15, 0.1);
    folhaG.updateMatrix(); const mFolha = folhaG.matrix.clone(), mFolhaInv = mFolha.clone().invert();
    const naFolha = (cx, cy, alto) => { const x = -LX / 2 + cx / W * LX, z = -LZ / 2 + cy / H * LZ; return V(x, curl(x, z) + (alto || 0), z).applyMatrix4(mFolha); };
    const _l = V(0, 0, 0);
    const assentar = (p, r) => { _l.copy(p).applyMatrix4(mFolhaInv); _l.y = curl(_l.x, _l.z) + r; return p.copy(_l.applyMatrix4(mFolha)); };

    /* ---------- ovo ---------- */
    const ovo = K.malha(new THREE.SphereGeometry(0.04, 20, 14), K.mat('#f1ead2', { roughness: 0.4 }));
    ovo.scale.set(1, 1.15, 1); ovo.position.copy(naFolha(300, 140, 0.04));

    /* ---------- lagarta: anéis marrom-avermelhados, manchas amarelas e tufos de pelos ---------- */
    const N = 11;
    const mPele = K.mat('#8a3b24', { roughness: 0.55 }), mMancha = K.mat('#e3c24b', { roughness: 0.5 }), mVerde = K.mat('#86b44c', { roughness: 0.5 }), mPelo = K.mat('#5a2a1a', { roughness: 0.9 });
    const lagarta = K.grupo(), aneis = [];
    for (let i = 0; i < N; i++) {
      const a = K.grupo(), r = 1;
      a.add(K.malha(new THREE.SphereGeometry(r, 18, 12), i === 0 ? K.mat('#3a1e14', { roughness: 0.4 }) : mPele));
      if (i === 0) {                                                      // cabeça: olhinhos e boca que mastiga
        [-1, 1].forEach((s) => a.add(K.malha(new THREE.SphereGeometry(0.16, 8, 6), K.mat('#111'), 0.75, 0.25, s * 0.45)));
        a.userData.boca = K.malha(new THREE.SphereGeometry(0.3, 10, 8), K.mat('#1a0d08'), 0.85, -0.35, 0); a.add(a.userData.boca);
      } else {
        if (i % 3 === 1) { const m = K.malha(new THREE.SphereGeometry(0.55, 12, 8), i % 2 ? mMancha : mVerde, 0, 0.62, 0); m.scale.set(1, 0.45, 0.8); a.add(m); }
        [-1, 1].forEach((s) => { const p = K.malha(new THREE.ConeGeometry(0.16, 0.9, 6), mPelo, 0, 0.9, s * 0.45); p.rotation.x = s * 0.5; a.add(p); });
      }
      aneis.push(a); lagarta.add(a);
    }

    /* ---------- crisálida verde com pontinhos dourados ---------- */
    const PRESA = V(0.56, 1.66, 0.03);
    const perfil = []; for (let i = 0; i <= 16; i++) { const u = i / 16; perfil.push([Math.sin(Math.PI * Math.pow(u, 0.8)) * 0.11 * (1 - u * 0.25) + 0.004, -u * 0.44]); }
    const mCris = K.mat('#6fbf6a', { roughness: 0.35, transparent: true, opacity: 1 });
    const crisalida = K.malha(K.torno(perfil, 28), mCris);
    const pontos = K.grupo(); for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2; pontos.add(K.malha(new THREE.SphereGeometry(0.012, 8, 6), K.mat('#e6b422', { metalness: 0.8, roughness: 0.25 }), Math.cos(a) * 0.1, -0.12, Math.sin(a) * 0.1)); }
    const fio = K.malha(new THREE.CylinderGeometry(0.008, 0.008, 0.05, 6), K.mat('#e9e2cf'), 0, 0.02, 0);
    const crisG = K.grupo(crisalida, pontos, fio); crisG.position.copy(PRESA);

    /* ---------- borboleta: corpo, antenas e 4 asas azuis com borda preta ---------- */
    const formaAnt = [[0.03, 0], [0.13, 0.11], [0.17, 0.33], [0.09, 0.41], [-0.02, 0.31], [-0.04, 0.05]];
    const formaPos = [[-0.02, 0], [-0.03, 0.21], [-0.13, 0.3], [-0.23, 0.22], [-0.21, 0.08], [-0.09, 0]];
    const texAsa = K.textura(256, 256, (c, w, h) => {
      const P = (x, y) => [(x + 0.26) / 0.46 * w, h - y / 0.46 * h];
      [formaAnt, formaPos].forEach((F) => {
        c.beginPath(); F.forEach(([x, y], i) => { const [px, py] = P(x, y); i ? c.lineTo(px, py) : c.moveTo(px, py); }); c.closePath();
        const [cx, cy] = P(0, 0), gr = c.createRadialGradient(cx, cy, 10, cx, cy, 190);
        gr.addColorStop(0, '#0d3f9e'); gr.addColorStop(0.45, '#2b8cf0'); gr.addColorStop(0.75, '#5cc3ff'); gr.addColorStop(1, '#2b8cf0');
        c.fillStyle = gr; c.fill(); c.lineWidth = 14; c.strokeStyle = '#141414'; c.stroke();
      });
      c.fillStyle = '#ffffff'; [[0.12, 0.36], [0.07, 0.38], [-0.17, 0.24]].forEach(([x, y]) => { const [px, py] = P(x, y); c.beginPath(); c.arc(px, py, 4, 0, 6.29); c.fill(); });
    });
    const asaGeo = (F) => {
      const s = new THREE.Shape(); s.moveTo(...F[0]); s.splineThru(F.slice(1).concat([F[0]]).map(([x, y]) => new THREE.Vector2(x, y)));
      const geo = new THREE.ShapeGeometry(s, 16), p = geo.attributes.position, uv = geo.attributes.uv;
      for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + 0.26) / 0.46, p.getY(i) / 0.46);
      geo.rotateX(Math.PI / 2); return geo;
    };
    const mAsa = K.mat('#ffffff', { map: texAsa, side: THREE.DoubleSide, roughness: 0.25, metalness: 0.15, transparent: true, alphaTest: 0.02 });
    const borb = K.grupo(), asas = [];
    const corpo = K.malha(new THREE.SphereGeometry(1, 16, 10), K.mat('#2a1c14', { roughness: 0.6 })); corpo.scale.set(0.17, 0.035, 0.035); borb.add(corpo);
    const cabeca = K.malha(new THREE.SphereGeometry(0.035, 12, 8), K.mat('#2a1c14'), 0.17, 0.005, 0); borb.add(cabeca);
    [-1, 1].forEach((s) => {
      borb.add(K.malha(K.tubo([[0.19, 0.01, s * 0.01], [0.27, 0.07, s * 0.04], [0.33, 0.1, s * 0.06]], 0.004, 8, 4), K.mat('#1a1a1a')));
      borb.add(K.malha(new THREE.SphereGeometry(0.011, 8, 6), K.mat('#1a1a1a'), 0.33, 0.1, s * 0.06));
      const lado = K.grupo(K.malha(asaGeo(formaAnt), mAsa), K.malha(asaGeo(formaPos), mAsa));
      if (s < 0) lado.scale.z = -1;
      lado.userData.s = s; asas.push(lado); borb.add(lado);
    });

    raiz.add(base, caule, galho, folhaG, ovo, lagarta, crisG, borb);

    /* ---------- caminho da lagarta: folha → caule → galho ---------- */
    const pontoNoCaminho = (pts, comp, s) => {
      if (s <= 0) { const d = V(0, 0, 0).subVectors(pts[0], pts[1]).normalize(); return pts[0].clone().addScaledVector(d, -s); }
      let acc = 0;
      for (let i = 1; i < pts.length; i++) { const l = pts[i].distanceTo(pts[i - 1]); if (acc + l >= s) return pts[i - 1].clone().lerp(pts[i], (s - acc) / l); acc += l; }
      return pts[pts.length - 1].clone();
    };
    const posJ = (i, esc) => {                       // pendurada em J: a ponta do corpo presa no galho, a cabeça curvada em baixo
      const u = (N - 1 - i) / (N - 1), reta = Math.min(u, 0.65) / 0.65, phi = Math.max(0, u - 0.65) / 0.35 * 2.3;
      return PRESA.clone().add(V(0.13 * (1 - Math.cos(phi)) * esc, (-reta * 0.42 - Math.sin(phi) * 0.13) * esc - 0.03, 0.02));
    };
    let ultimaCabeca = naFolha(300, 140, 0.03), caminho = null, compCaminho = 1;
    const ini = []; for (let i = 0; i < N; i++) ini.push(V(0, 0, 0));
    const tmp = V(0, 0, 0);

    return {
      raiz,
      partes: [
        { nome: 'Folha', malhas: [folha], texto: 'A comida da lagarta!', mais: 'A borboleta escolhe a planta certa para pôr os ovos. A lagarta da borboleta-azul come folhas de plantas da família do feijão.' },
        { nome: 'Ovo', malhas: [ovo], texto: 'Do ovinho sai a lagarta.', mais: 'O ovo é do tamanho de uma cabeça de alfinete. Em poucos dias nasce a lagartinha, que come a própria casca.' },
        { nome: 'Lagarta', malhas: aneis, texto: 'A lagarta come e cresce muito.', mais: 'É a fase de crescer: a lagarta pode ficar milhares de vezes mais pesada do que quando nasceu. Os pelos e as cores avisam os passarinhos para não comê-la.' },
        { nome: 'Crisálida', malhas: [crisalida, pontos], texto: 'Dentro da casca, ela vira borboleta.', mais: 'Na crisálida (ou pupa), o corpo da lagarta se desmancha e se reorganiza em asas, pernas longas e antenas. É a metamorfose completa.' },
        { nome: 'Borboleta', malhas: [corpo, cabeca, ...asas], texto: 'A borboleta voa e bota ovos.', mais: 'O azul das asas não é tinta: são escamas minúsculas que refletem a luz. A adulta vive poucas semanas e põe os ovos que recomeçam o ciclo.' }
      ],
      E: { T: 0, auto: true },
      acoesIniciais: [(E) => { E.T = 7; }],
      acoes: [
        { rotulo: 'Ver tudo de novo', ico: '▶️', fazer: (E) => { E.T = 0; E.auto = true; } },
        { rotulo: 'Ovo', ico: '🥚', fazer: (E) => { E.T = 0; E.auto = true; } },
        { rotulo: 'Lagarta', ico: '🐛', fazer: (E) => { E.T = 3; E.auto = true; } },
        { rotulo: 'Crisálida', ico: '🟢', fazer: (E) => { E.T = 15; E.auto = true; } },
        { rotulo: 'Borboleta', ico: '🦋', fazer: (E) => { E.T = 21.5; E.auto = true; } }
      ],
      etapa: (E) => FASES[fase(E.T)][1],
      narrar: (E, nivel) => FASES[fase(E.T)][nivel === 'pequeno' ? 2 : 3],
      animar(t, dt, E) {
        if (E.auto) E.T += dt;
        const T = E.T;
        // ovo: balança e se abre
        ovo.visible = T < 4.2;
        ovo.rotation.z = T > 1.8 && T < 2.6 ? Math.sin(T * 40) * 0.25 : 0;
        ovo.scale.set(1, T > 2.6 ? 0.55 : 1.15, 1);
        // folha comida aos poucos
        const comido = sm(3.3, 10.8, T); pintarFolha(Math.min(16, Math.floor(comido * 17)));
        // lagarta
        const vivaLagarta = T >= 2.5 && T < 18.4;
        lagarta.visible = vivaLagarta;
        const esc = T < 3 ? 0.28 : 0.28 + 0.72 * sm(3, 10.5, T);              // cresce enquanto come
        const r = 0.048 * esc, passo = 0.072 * esc;
        if (vivaLagarta) {
          if (T < 11) {                                                        // comendo: a cabeça vai até a próxima mordida
            const k = Math.min(15, Math.floor(comido * 17)), [mx, my] = mordidas[k];
            const alvo = T < 3.3 ? naFolha(300, 140, 0) : naFolha(mx + 10, my + (my > 128 ? -22 : 22), 0);
            ultimaCabeca.lerp(alvo, Math.min(1, dt * 2.5));
            const baseF = naFolha(30, 128, 0), dir = V(0, 0, 0).subVectors(baseF, ultimaCabeca).setY(0).normalize();
            aneis.forEach((a, i) => {
              tmp.copy(ultimaCabeca).addScaledVector(dir, i * passo);
              assentar(tmp, r * (i === 0 ? 0.9 : 1) + Math.max(0, Math.sin(t * 7 - i * 0.9)) * r * 0.5);
              a.position.copy(tmp); ini[i].copy(tmp);
            });
            caminho = null;
          } else if (T < 15) {                                                 // vira e sobe pelo caule até o galho
            if (!caminho) {
              caminho = [ultimaCabeca.clone(), naFolha(20, 128, r), V(0.03, 0.62, 0.05), V(0, 1.55, 0.05), V(0.14, 1.645, 0.05), PRESA.clone().add(V(0, -0.03, 0.02))];
              compCaminho = 0; for (let i = 1; i < caminho.length; i++) compCaminho += caminho[i].distanceTo(caminho[i - 1]);
            }
            const s = sm(11.4, 14.8, T) * compCaminho, vira = sm(11, 11.6, T);
            aneis.forEach((a, i) => {
              const p = pontoNoCaminho(caminho, compCaminho, s - i * passo);
              p.y += Math.max(0, Math.sin(t * 7 - i * 0.9)) * r * 0.4;
              a.position.copy(ini[i]).lerp(p, vira);
              if (vira >= 1) ini[i].copy(a.position);
            });
          } else {                                                             // em J, depois encolhe dentro da crisálida
            const k = sm(15, 16.6, T);
            aneis.forEach((a, i) => { a.position.copy(ini[i]).lerp(posJ(i, 1), k); });
          }
          const some = 1 - sm(17.4, 18.4, T);
          aneis.forEach((a, i) => {
            const perf = i === 0 ? 0.85 : 1 - Math.pow(i / (N - 1), 2) * 0.35;
            a.scale.setScalar(Math.max(0.001, r * perf * some));
            // cada anel olha para o anel da frente (a cabeça olha para onde anda)
            if (i === 0) tmp.copy(a.position).multiplyScalar(2).sub(aneis[1].position); else tmp.copy(aneis[i - 1].position);
            if (tmp.distanceToSquared(a.position) > 1e-10) { a.lookAt(tmp); a.rotateY(-Math.PI / 2); }
          });
          const boca = aneis[0].userData.boca; boca.scale.y = T > 3.3 && T < 11 ? 0.6 + Math.abs(Math.sin(t * 12)) * 0.8 : 0.6;
        }
        // crisálida: forma, espera e fica transparente quando a borboleta sai
        crisG.visible = T >= 17;
        const forma = sm(17, 18.6, T);
        crisG.scale.set(Math.max(0.001, forma), Math.max(0.001, forma), Math.max(0.001, forma));
        crisalida.rotation.y = T > 19 && T < 21.5 ? Math.sin(t * 3) * 0.05 : 0;
        mCris.opacity = 1 - sm(20.5, 21.8, T) * 0.65;
        mCris.color.set(T > 20.5 ? '#9fcfa0' : '#6fbf6a');
        pontos.visible = T < 22.5;
        // borboleta: sai pendurada, estica as asas e voa
        borb.visible = T >= 21.8;
        if (borb.visible) {
          const estica = sm(22, 24.3, T);
          asas.forEach((l) => l.scale.set(0.35 + estica * 0.65, 1, (0.35 + estica * 0.65) * l.userData.s));
          if (T < 24.5) {
            borb.position.copy(PRESA).add(V(0.02, -0.5, 0.06)); borb.rotation.set(0, 0, Math.PI / 2);
            asas.forEach((l) => { l.rotation.x = l.userData.s * -(1.45 - Math.sin(t * 2) * 0.08 * estica); });
          } else {
            const v = T - 24.5, a = v * 0.9, sobe = sm(0, 1.2, v);
            borb.position.set(0.3 + Math.cos(a) * 0.55 * sobe + 0.26 * (1 - sobe), 1.16 - 0.5 * (1 - sobe) + Math.sin(v * 2) * 0.08, 0.1 + Math.sin(a) * 0.4 * sobe);
            borb.rotation.set(0, -a - Math.PI / 2 * sobe, (Math.PI / 2) * (1 - sobe) + Math.sin(v * 2) * 0.1);
            asas.forEach((l) => { l.rotation.x = l.userData.s * -(0.2 + Math.sin(t * 13) * 0.85); });
          }
        }
      }
    };
  });
})();
