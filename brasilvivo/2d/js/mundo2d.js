/* =====================================================================
   Estudo de Bolso · Brasil Vivo 2D · mundo ilustrado, visto de cima
   Mesmas coordenadas do 3D (metros, x para a direita, z para baixo na tela),
   mesmos dados do Registro e a mesma interface (Mundo.M, areaEm, povoar,
   onda, colher…) para o laço do jogo funcionar igual.
   O chão é uma grade de células de 4 unidades (80 cm) com uma cor cada,
   ampliada com suavização em pedaços guardados em cache: as bordas ficam
   macias como aquarela. No Ruído as células ficam cinza e, quando a Clareza
   sobe, cada uma vira verde no instante em que a onda passa por ela.
   ===================================================================== */
class V3 {
  constructor(x, y, z) { this.x = x || 0; this.y = y || 0; this.z = z || 0; }
  set(x, y, z) { this.x = x; this.y = y; this.z = z; return this; }
  copy(v) { this.x = v.x; this.y = v.y; this.z = v.z; return this; }
  clone() { return new V3(this.x, this.y, this.z); }
}
const Mundo = (function () {
  const PPM = 5, TAM = 440, CEL = 4, PED = 128, N = TAM * PPM / CEL, RIO_X = 80, RIO_LARGURA = 14;
  const M = { bichos: [], marcas: [], npcs: [], companheiros: [], fontes: [], caixas: [], flores: [], trilha: [], decor: [], capim: [], onda: null, t: 20, cam: { x: 0, y: 0 }, cor: {} };
  let AREAS = [], RUIDO = [], rnd;
  const px = (x) => (x + TAM / 2) * PPM, pz = (z) => (z + TAM / 2) * PPM;
  const altura = () => 0;
  function areaEm(x, z) {
    let melhor = null, dm = Infinity;
    AREAS.forEach((a) => { const d = Math.hypot(x - a.x, z - a.z); if (d < a.r && d < dm) { dm = d; melhor = a; } });
    return melhor;
  }
  const naAgua = (x, z) => Math.abs(x - RIO_X - Math.sin(z * 0.04) * 5) < RIO_LARGURA;
  const ocupado = (x, z) => Math.abs(x - RIO_X - Math.sin(z * 0.04) * 5) < RIO_LARGURA + 3 || Math.hypot(x, z - 4) < 24 || AREAS.some((a) => (a.id === 'horta' || a.id === 'jardim') && Math.hypot(x - a.x, z - a.z) < a.r - 2);
  const R = (a, b) => a + rnd() * (b - a);
  // trilhas de terra da Base até cada área (ajudam a se orientar)
  let TRILHAS = [];
  function distSeg(x, z, [ax, az, bx, bz]) { const dx = bx - ax, dz = bz - az, t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz))); return Math.hypot(x - ax - dx * t, z - az - dz * t); }

  /* ---------- grade do chão ---------- */
  // tipo fixo: 0 seco · 1 verde · 2 terra · 3 praça · 4 água · 5 areia · 6 horta
  let base, ruidoA, hash;
  function montarChao() {
    base = new Uint8Array(N * N); ruidoA = new Int8Array(N * N).fill(-1); hash = new Float32Array(N * N);
    const r2 = Arte.semente(77);
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const k = j * N + i, x = (i + 0.5) * CEL / PPM - TAM / 2, z = (j + 0.5) * CEL / PPM - TAM / 2, h = r2(); hash[k] = h;
      const dx = Math.abs(x - RIO_X - Math.sin(z * 0.04) * 5);
      let t = 0;
      if (dx < RIO_LARGURA) t = 4;
      else if (dx < RIO_LARGURA + 2.4 + h * 1.6) t = 5;
      else if (Math.hypot(x, z - 4) < 20) t = 3;
      else if (TRILHAS.some((s) => distSeg(x, z, s) < 1.5 + h * 0.6)) t = 2;
      else {
        for (const a of AREAS) {
          const d = Math.hypot(x - a.x, z - a.z), borda = 6;
          if (d > a.r + borda || (d > a.r && h > 1 - (d - a.r) / borda)) continue;
          if (a.ruido) { ruidoA[k] = RUIDO.indexOf(a); t = 1; break; }
          if (a.id === 'horta') { t = 6; break; }
          if (a.id === 'base') { t = 1; break; }
        }
      }
      base[k] = t;
    }
  }
  // Clareza vista numa célula do Ruído (a onda passa e a célula muda)
  function clarezaCel(ai, x, z) {
    const a = RUIDO[ai], o = M.onda;
    if (o && o.area === a.id) return Math.hypot(x - o.x, z - o.z) < o.r ? o.alvo : o.antes;
    return M.cor[a.id];
  }
  // estado do chão num ponto: 'seco' | 'verde' | 'cinza' (o capim acompanha)
  function estado(x, z) {
    const i = Math.floor(px(x) / CEL), j = Math.floor(pz(z) / CEL); if (i < 0 || j < 0 || i >= N || j >= N) return 'seco';
    const k = j * N + i;
    if (ruidoA[k] >= 0) return hash[k] < clarezaCel(ruidoA[k], x, z) ? 'verde' : 'cinza';
    return base[k] === 1 || base[k] === 6 ? 'verde' : 'seco';
  }

  /* ---------- construir ---------- */
  function construir(bioma) {
    rnd = Arte.semente(2024);
    AREAS = Registro.lista('areas', bioma); RUIDO = AREAS.filter((a) => a.ruido);
    AREAS.forEach((a) => { M.cor[a.id] = Ruido.clareza(a.id); });
    M.arvPos = [];
    TRILHAS = AREAS.filter((a) => a.id !== 'base').map((a) => [0, 6, a.x, a.z]);
    montarChao();
    const S = (img, x, z, extra) => { const d = Object.assign({ img, x, z, ox: img.lw / 2, oy: img.lh - 1.5 }, extra || {}); M.decor.push(d); return d; };

    // Base Brasília
    M.planos = [{ img: Arte.espelhoAgua(20), x: -9, z: 12 }];
    S(Arte.pavilhao(), 0, -8); [[-14, -8], [-6, -8], [2, -8], [10, -8], [16, -8]].forEach(([x, z]) => M.arvPos.push([x, z, 2.6]));
    [[-22, 10, '#2f7fc1'], [20, -26, '#e0a23a'], [-18, -24, '#3aa37a'], [28, 12, '#d9614c']].forEach(([x, z, cor]) => { S(Arte.casa(cor), x, z); M.arvPos.push([x - 2.5, z - 1, 2.6], [x + 2.5, z - 1, 2.6]); });
    S(Arte.muro(), -20, 14.7); M.arvPos.push([-23, 14.7, 1], [-20, 14.7, 1], [-17, 14.7, 1]);
    M.lampada = { x: -17.4, z: 14.7, alt: 2.6 };
    S(Arte.ipe(Arte.AMARELO), -16, 34); M.arvPos.push([-16, 34, 1.2]);
    S(Arte.ipe(Arte.ROSA), -104, 56); M.arvPos.push([-104, 56, 1.2]);
    M.ipeJardim = { cinza: Arte.ipe(Arte.CINZA), cor: Arte.ipe(Arte.AMARELO) };
    M.ipeJardimD = S(M.ipeJardim.cinza, 40, 80); M.arvPos.push([40, 80, 1.2]);

    // árvores tortas (metade na Rota), buritis, cupinzeiros, pedras
    const arv = [];
    for (let i = 0; i < 500 && arv.length < 130; i++) {
      let x, z;
      if (arv.length < 55) { const a = rnd() * 6.28, r = 10 + Math.sqrt(rnd()) * 44; x = -10 + Math.cos(a) * r; z = -130 + Math.sin(a) * r; }
      else { x = R(-205, 205); z = R(-205, 205); }
      if (ocupado(x, z) || Math.hypot(x, z) < 46 || AREAS.some((a) => a.id !== 'rota' && Math.hypot(x - a.x, z - a.z) < a.r + 2) || TRILHAS.some((s) => distSeg(x, z, s) < 4)) continue;
      arv.push([x, z]); M.arvPos.push([x, z, 0.8]);
    }
    // variedade do Cerrado: árvore torta comum, pequizeiro de copa larga e árvore rala da seca
    const modelos = Array.from({ length: 8 }, (_, k) => Arte.arvore(100 + k)), largas = Array.from({ length: 3 }, (_, k) => Arte.arvoreLarga(150 + k)), ralas = Array.from({ length: 4 }, (_, k) => Arte.arvoreRala(170 + k));
    arv.forEach(([x, z], k) => { const q = rnd(); S(q < 0.18 ? largas[k % 3] : q < 0.36 ? ralas[k % 4] : modelos[k % 8], x, z); });
    const arbs = Array.from({ length: 6 }, (_, k) => Arte.arbusto(600 + k));
    for (let i = 0, n = 0; i < 900 && n < 170; i++) { const x = R(-208, 208), z = R(-208, 208); if (ocupado(x, z) || Math.hypot(x, z - 4) < 26 || TRILHAS.some((s) => distSeg(x, z, s) < 3) || AREAS.some((a) => a.id === 'jardim' && Math.hypot(x - a.x, z - a.z) < a.r + 2)) continue; S(arbs[n % 6], x, z, { oy: 10 }); n++; }
    M.nuvens = [1, 2, 3].map(Arte.nuvem);
    const buritis = Array.from({ length: 3 }, (_, k) => Arte.buriti(200 + k));
    for (let i = 0; i < 20; i++) { const z = -190 + i * 20 + R(0, 8), lado = i % 2 ? 1 : -1, x = RIO_X + Math.sin(z * 0.04) * 5 + lado * (RIO_LARGURA + R(4, 8)); S(buritis[i % 3], x, z); M.arvPos.push([x, z, 0.6]); }
    const cups = Array.from({ length: 3 }, (_, k) => Arte.cupinzeiro(300 + k));
    for (let i = 0, n = 0; i < 300 && n < 34; i++) { const x = R(-205, 205), z = R(-205, 205); if (ocupado(x, z) || Math.hypot(x, z) < 40) continue; S(cups[n % 3], x, z); M.arvPos.push([x, z, 1.1]); n++; }
    const pedras = Array.from({ length: 4 }, (_, k) => Arte.pedra(400 + k, 0.8 + k * 0.3));
    for (let i = 0, n = 0; i < 300 && n < 60; i++) { const x = R(-205, 205), z = R(-205, 205); if (ocupado(x, z)) continue; S(pedras[n % 4], x, z, { oy: 4 }); n++; }

    // capim e flores silvestres
    const pal = { seco: ['#857636', '#ab9b52', '#d6ca84'], verde: ['#336a26', '#4f9038', '#86c264'], cinza: ['#5e5d58', '#7e7d78', '#a2a19a'] };
    M.tufos = {}; Object.keys(pal).forEach((k) => { M.tufos[k] = [0, 1, 2].map((s) => Arte.tufo(pal[k], 500 + s)); });
    for (let i = 0; i < 6000 && M.capim.length < 2600; i++) { const x = R(-212, 212), z = R(-212, 212); if (naAgua(x, z) || Math.hypot(x, z - 4) < 21 || TRILHAS.some((s) => distSeg(x, z, s) < 2.2)) continue; M.capim.push({ x, z, v: i % 3 }); }
    const fCores = ['#f5d040', '#ffffff', '#e86aa8', '#b48ae8', '#f08a3a'], fImgs = fCores.map(Arte.flor);
    M.floresCampo = [];
    for (let i = 0; i < 2000 && M.floresCampo.length < 420; i++) { const x = R(-205, 205), z = R(-205, 205), a = areaEm(x, z); if (naAgua(x, z) || (a && a.ruido) || Math.hypot(x, z - 4) < 21) continue; M.floresCampo.push({ x, z, img: fImgs[i % 5] }); }

    // horta comunitária
    const H = Registro.area('horta');
    if (H) for (let i = 0; i < 4; i++) { const x = H.x + (i % 2) * 14 - 7, z = H.z - 8 + Math.floor(i / 2) * 9; S(Arte.canteiro(i), x, z, { oy: 15 }); M.arvPos.push([x - 4, z, 1.6], [x, z, 1.6], [x + 4, z, 1.6]); }

    // Jardim Polinizador: estacas, flores que abrem com a Clareza, placa, trilha até a vereda
    const J = Registro.area('jardim');
    if (J) {
      const est = Arte.estaca(); for (let k = 0; k < 40; k++) { const a = k / 40 * 6.28; S(est, J.x + Math.cos(a) * (J.r - 4), J.z + Math.sin(a) * (J.r - 4)); }
      M.imgFlor = ['#f5c840', '#ef5a7a', '#f6a4d0', '#b48ae8', '#ffffff'].map(Arte.flor); M.imgBotao = Arte.botao();
      for (let i = 0; i < 46; i++) {
        const a = rnd() * 6.28, r = Math.sqrt(rnd()) * (J.r - 7), x = J.x + Math.cos(a) * r, z = J.z + Math.sin(a) * r;
        if (Math.hypot(x - 40, z - 80) < 3) continue;
        M.flores.push({ pos: new V3(x, 0, z), d: r, aberta: false, pop: 1, limiar: 0.5, cor: i % 5 });
      }
      M.placaJardim = { pos: new V3(J.x - J.r + 3, 0, J.z), area: J }; S(Arte.placa(), M.placaJardim.pos.x, M.placaJardim.pos.z);
      for (let i = 0; i < 44; i++) {
        const t = i / 43, x = J.x + 5 * t + Math.sin(t * 9) * 3 + (i % 2 ? 1.4 : -1.4), z = J.z - J.r + 2 - t * 64;
        M.trilha.push({ pos: new V3(x, 0, z), d: Math.hypot(x - J.x, z - J.z), aberta: false, pop: 1, limiar: 1, cor: i % 5 });
      }
    }

    // seres vivos, marcas, moradores
    Registro.lista('especies', bioma).forEach((e) => {
      const area = Registro.area(e.area), anda = e.fases.find((f) => f.anda);
      if (anda && area) for (let k = 0; k < 2; k++) M.bichos.push(bicho(e, anda, area));
      e.fases.filter((f) => f.ponto).forEach((f) => M.marcas.push(marca(e, f)));
    });
    Registro.lista('npcs', bioma).forEach((n) => M.npcs.push({ dado: n, pos: new V3(n.x, 0, n.z), casa: { x: n.x, z: n.z }, sprites: Arte.pessoa(Object.assign({ camisa: n.cor }, n.visual || {})), dir: 'baixo', espera: 2 + rnd() * 4, passo: 0, t0: rnd() * 6, mesh: { visible: true } }));
    M.part = [];
    (Registro.R.biomas[bioma].fontes || []).forEach((f) => M.fontes.push(fonte(f)));
    Object.values(Registro.R.relacoes).forEach((r) => { if (r.ativar && r.ativar.ponto && AREAS.some((a) => a.id === r.ativar.onde)) { const [x, z] = r.ativar.ponto; M.caixas.push({ rel: r, pos: new V3(x, 0, z), img: [Arte.caixa(false), Arte.caixa(true)] }); M.arvPos.push([x, z, 0.8]); } });

    M.sombras = [6, 8, 10, 14].reduce((o, w) => { o[w] = Arte.sombra(w); return o; }, {});
    M.brilhos = [Arte.brilho(0), Arte.brilho(1)];
    M.folhaSauva = Arte.folhaSauva();
    M.anel = Arte.anel(15);
    return M;
  }

  const quadrosCache = {};
  const quadros = (forma, cor) => quadrosCache[forma + cor] || (quadrosCache[forma + cor] = Arte.bicho(forma, cor));
  function bicho(e, fase, area, inicio) {
    const a = rnd() * 6.28, d = 6 + rnd() * (area.r - 12);
    const pos = inicio ? new V3(inicio.x, 0, inicio.z) : new V3(area.x + Math.cos(a) * d, 0, area.z + Math.sin(a) * d);
    const rel = Registro.relacoesDe(e.id).find((r) => r.prova && r.prova.tipo === 'ver-acao' && r.prova.area === area.id) || null;
    return { especie: e, fase, pos, area, alvo: null, espera: rnd() * 3, rel, agindo: 0, proxAcao: 6 + rnd() * 10, fase0: rnd() * 6, quadros: quadros(fase.forma, fase.cor), dir: 1, mesh: { visible: true } };
  }
  function marca(e, f) {
    const [x, z] = f.ponto;
    const img = f.marca === 'tronco' ? Arte.tronco() : f.marca === 'olheiro' ? Arte.olheiros() : f.marca === 'parede' ? Arte.ovosParede() : f.marca === 'lagarta' ? Arte.lagartaFolha() : Arte.ovoFolha(f.cor);
    if (f.marca === 'tronco') M.arvPos.push([x, z, 0.9]);
    return { especie: e, fase: f, pos: new V3(x, 0, z), img, lift: f.marca === 'parede' ? 7 : f.marca === 'lagarta' ? 8 : 0, plano: f.marca === 'olheiro', mesh: { visible: true } };
  }
  function fonte(f) {
    const o = { dado: f, pos: new V3(f.x, 0, f.z), cheia: true, volta: 0, y: 1.4 };
    if (f.forma === 'planta') { o.img = [Arte.planta(false), Arte.planta(true)]; o.y = 4; M.arvPos.push([f.x, f.z, 0.7]); }
    if (f.forma === 'algas') { o.img = [Arte.algas(), Arte.algas()]; o.plano = true; }
    if (f.forma === 'pedras') { o.img = [Arte.pedrinhas(), Arte.pedrinhas()]; }
    return o;
  }
  function colher(fo) {
    fo.cheia = false; fo.volta = fo.dado.volta || 40;
    efeito(fo.dado.forma === 'planta' ? 'folhas' : fo.dado.forma === 'agua' || fo.dado.forma === 'algas' ? 'agua' : 'poeira', fo.pos.x, fo.pos.z, 1);
  }
  /* partículas: folhas ao colher, gotas, poeira do passo, pólen no jardim vivo */
  const CORES_P = { folhas: ['#62a83a', '#86cc4a', '#3f7a2a'], agua: ['#7cc4ea', '#bfe6f8', '#3f97c8'], poeira: ['#d4c08a', '#b8a272', '#e6d6a6'], polen: ['#ffe36a', '#fff6c0', '#f5c840'] };
  function efeito(tipo, x, z, y) {
    const n = tipo === 'poeira' ? 3 : tipo === 'polen' ? 1 : 12, cores = CORES_P[tipo];
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.28, v = tipo === 'polen' ? 0.3 : tipo === 'poeira' ? 0.8 : 2 + Math.random() * 2;
      M.part.push({ x, z, y: y || (tipo === 'poeira' ? 0.1 : 0.4), vx: Math.cos(a) * v, vz: Math.sin(a) * v * 0.6, vy: tipo === 'polen' ? 0.6 : tipo === 'poeira' ? 0.4 : 3 + Math.random() * 2, g: tipo === 'polen' ? 0 : tipo === 'poeira' ? 0.5 : 9, vida: tipo === 'polen' ? 1.6 : tipo === 'poeira' ? 0.45 : 0.9, cor: cores[i % cores.length], tam: tipo === 'folhas' ? 2 : 1 });
    }
  }

  function companheiro(especieId) {
    if (M.companheiros.some((c) => c.id === especieId)) return;
    const e = Registro.especie(especieId), f = e.fases.find((x) => x.anda) || e.fases[e.fases.length - 1];
    M.companheiros.push({ id: especieId, voa: !!f.voa, pos: (M.jogadorPos || new V3()).clone(), texto: f.emoji + ' ' + e.nome, fase: rnd() * 6, quadros: quadros(f.forma, f.cor), dir: 1 });
  }
  function dispensar(especieId) {
    const i = M.companheiros.findIndex((c) => c.id === especieId); if (i < 0) return null;
    const c = M.companheiros[i]; M.companheiros.splice(i, 1); return c.pos.clone();
  }
  function povoar(r, inicio) {
    const e = Registro.especie(r.ativar.especie), area = Registro.area(r.ativar.onde), f = e && e.fases.find((x) => x.anda);
    if (!f || !area) return;
    for (let k = 0; k < (r.ativar.tipo === 'reativar' ? 4 : 3); k++) { const b = bicho(e, f, area, inicio); b.espera = k * 0.4; M.bichos.push(b); }
  }
  function onda(areaId) {
    const a = Registro.area(areaId); if (!a) return;
    M.onda = { area: a.id, x: a.x, z: a.z, r: 0.5, max: a.r * 1.6, fim: 140, antes: M.cor[a.id], alvo: Ruido.clareza(a.id) };
  }

  /* ---------- dia e noite (200 s por dia, como no 3D) ---------- */
  function diaNoite(t) {
    const ang = ((t / 200) % 1) * Math.PI * 2, s = Math.sin(ang);
    M.dia = Math.max(0, Math.min(1, (s + 0.2) / 0.9)); M.baixo = Math.max(0, 1 - Math.abs(s) * 3.5) * (s > -0.25 ? 1 : 0);
    M.noite = M.dia <= 0.05; M.hora = M.noite ? '🌙' : M.baixo > 0.3 ? '🌅' : '☀️';
    return M.noite;
  }

  /* ---------- atualizar ---------- */
  const voo = (b, onda) => 0.6 + (b.fase.escala || 1) * 1.2 + onda;
  function update(dt, jogador) {
    M.t += dt; M.jogadorPos = jogador;
    const noite = diaNoite(M.t); M.chuva = Math.sin(M.t / 45) > 0.35;
    M.bichos.forEach((b) => {
      const hora = b.especie.hora || ['dia'];
      b.mesh.visible = hora.includes(noite ? 'noite' : 'dia') && Ruido.clareza(b.area.id) >= 0.5;
      if (!b.mesh.visible) { b.agindo = 0; return; }
      if (b.rel) {
        if (b.agindo > 0) { b.agindo -= dt; b.pos.y = b.fase.voa ? voo(b, 0) : 0; return; }
        b.proxAcao -= dt;
        if (b.proxAcao <= 0) { b.agindo = 9; b.proxAcao = 14 + Math.random() * 10; b.alvo = null; return; }
      }
      b.espera -= dt;
      if (b.espera <= 0) {
        b.espera = 2 + Math.random() * 4;
        const abertas = b.fase.voa && b.area.id === 'jardim' ? M.flores.filter((f) => f.aberta) : [];
        if (abertas.length) b.alvo = abertas[Math.floor(Math.random() * abertas.length)].pos.clone();
        else { const a = Math.random() * 6.28, d = 6 + Math.random() * (b.area.r - 12); b.alvo = new V3(b.area.x + Math.cos(a) * d, 0, b.area.z + Math.sin(a) * d); }
      }
      if (b.alvo) { const dx = b.alvo.x - b.pos.x, dz = b.alvo.z - b.pos.z, l = Math.hypot(dx, dz); if (l < 1) b.alvo = null; else { b.pos.x += dx / l * dt * 2.5; b.pos.z += dz / l * dt * 2.5; if (Math.abs(dx) > 0.2) b.dir = dx > 0 ? 1 : -1; } }
      b.pos.y = b.fase.voa ? voo(b, Math.sin(M.t * 3 + b.fase0) * 0.3) : 0;
    });
    const ninho = Estado.dados.ninho;
    M.marcas.forEach((m) => { if (m.fase.ninho) m.mesh.visible = !ninho.some((n) => Registro.ciclo(n.ciclo).especie === m.especie.id); });
    M.companheiros.forEach((c, i) => {
      const ax = jogador.x - Math.sin(c.fase) * 3, az = jogador.z - Math.cos(c.fase) * 1.5 + 1.5, dx = ax - c.pos.x, dz = az - c.pos.z, d = Math.hypot(dx, dz);
      if (d > 1.2) { c.pos.x += dx / d * dt * Math.min(12, d * 3); c.pos.z += dz / d * dt * Math.min(12, d * 3); if (Math.abs(dx) > 0.3) c.dir = dx > 0 ? 1 : -1; }
      c.pos.y = c.voa ? 1.8 + Math.sin(M.t * 4 + i) * 0.4 : Math.abs(Math.sin(M.t * 8 + i)) * 0.3 * (d > 1.2 ? 1 : 0);
    });
    M.fontes.forEach((f) => { if (!f.cheia && (f.volta -= dt) <= 0) f.cheia = true; });
    // moradores passeiam perto de casa e param, virados para a criança, quando ela chega perto
    M.npcs.forEach((n) => {
      const dxj = jogador.x - n.pos.x, dzj = jogador.z - n.pos.z;
      n.andando = false;
      if (Math.hypot(dxj, dzj) < 8) { n.dir = Math.abs(dxj) > Math.abs(dzj) ? (dxj > 0 ? 'dir' : 'esq') : (dzj > 0 ? 'baixo' : 'cima'); n.alvo = null; return; }
      if (!n.alvo) { if ((n.espera -= dt) > 0) return; const a = Math.random() * 6.28, r = 1 + Math.random() * 2.5; n.alvo = { x: n.casa.x + Math.cos(a) * r, z: n.casa.z + Math.sin(a) * r }; }
      const dx = n.alvo.x - n.pos.x, dz = n.alvo.z - n.pos.z, l = Math.hypot(dx, dz);
      if (l < 0.2) { n.alvo = null; n.espera = 2 + Math.random() * 5; n.dir = 'baixo'; return; }
      n.pos.x += dx / l * dt * 1.6; n.pos.z += dz / l * dt * 1.6; n.andando = true; n.passo += dt * 5;
      n.dir = Math.abs(dx) > Math.abs(dz) ? (dx > 0 ? 'dir' : 'esq') : (dz > 0 ? 'baixo' : 'cima');
    });
    // partículas
    for (let i = M.part.length - 1; i >= 0; i--) { const q = M.part[i]; q.vida -= dt; q.x += q.vx * dt; q.z += q.vz * dt; q.vy -= q.g * dt; q.y = Math.max(0, q.y + q.vy * dt); if (q.y === 0) { q.vx *= 0.8; q.vz *= 0.8; } if (q.vida <= 0) M.part.splice(i, 1); }
    M.poeiraT = (M.poeiraT || 0) - dt;
    if (window.Jogador && Jogador.J.movendo && M.poeiraT <= 0 && estado(jogador.x, jogador.z) !== 'verde') { M.poeiraT = 0.22; efeito('poeira', jogador.x, jogador.z + 0.2); }
    M.polenT = (M.polenT || 0) - dt;
    if (M.polenT <= 0 && M.flores.length) { M.polenT = 0.12; const abertas = M.flores.filter((f) => f.aberta); if (abertas.length) { const f = abertas[Math.floor(Math.random() * abertas.length)]; efeito('polen', f.pos.x + (Math.random() - 0.5), f.pos.z, 1.3); } }
    // Clareza mostrada: segue a real; na onda, só muda onde ela já passou
    AREAS.forEach((a) => { if (!(M.onda && M.onda.area === a.id)) M.cor[a.id] = Ruido.clareza(a.id); });
    if (M.onda) { const o = M.onda; o.r += dt * (o.r < o.max ? 15 : 34); if (o.r >= o.fim) { M.cor[o.area] = o.alvo; M.onda = null; } }
    const kj = Registro.area('jardim') ? Ruido.clareza('jardim') : 0;
    const abrir = (f) => {
      const deve = kj >= f.limiar && (!M.onda || M.onda.r >= f.d);
      if (deve !== f.aberta) { f.aberta = deve; f.pop = 0; }
      if (f.pop < 1) f.pop = Math.min(1, f.pop + dt * 2.5);
    };
    M.flores.forEach(abrir); M.trilha.forEach(abrir);
    // árvore do jardim: cinza → amarela com a Clareza
    if (M.ipeJardimD) M.ipeJardimD.img = (M.cor.jardim || 0) >= 0.5 ? M.ipeJardim.cor : M.ipeJardim.cinza;
  }

  /* ---------- chão em pedaços (mapa de cores ampliado com suavização) ---------- */
  const RG = 3, COR = { seco: '#d3c27a', verde: '#86ba5e', terra: '#caa16b', praca: '#ebe2ce', agua: '#4fa8d6', areia: '#e8d6a0', horta: '#8fb35c', cinza: '#a5a49d', aguaCinza: '#7c8a8e' };
  const TIPOS = ['seco', 'verde', 'terra', 'praca', 'agua', 'areia', 'horta'];
  const CORRGB = {}; Object.keys(COR).forEach((k) => { const n = parseInt(COR[k].slice(1), 16); CORRGB[k] = [n >> 16 & 255, n >> 8 & 255, n & 255]; });
  let INFO = null, DETALHE = null;
  const cache = new Map();
  function prepararPedacos() {
    const n = Math.ceil(TAM * PPM / PED), por = PED / CEL; INFO = [];
    for (let cj = 0; cj < n; cj++) for (let ci = 0; ci < n; ci++) {
      const ru = new Set(); let agua = false;
      for (let j = cj * por - 1; j <= Math.min(N - 1, (cj + 1) * por); j++) for (let i = ci * por - 1; i <= Math.min(N - 1, (ci + 1) * por); i++) { if (i < 0 || j < 0) continue; const k = j * N + i; if (ruidoA[k] >= 0) ru.add(ruidoA[k]); if (base[k] === 4) agua = true; }
      INFO[cj * n + ci] = { ru: [...ru], agua };
    }
    // textura de capim e terra bem leve, por cima da cor
    DETALHE = document.createElement('canvas'); DETALHE.width = DETALHE.height = PED * RG;
    const g = DETALHE.getContext('2d'), r = Arte.semente(99); g.scale(RG, RG); g.lineCap = 'round';
    for (let i = 0; i < 420; i++) { const x = r() * PED, y = r() * PED, l = 1.2 + r() * 1.6, inc = (r() - 0.5) * 1.2; g.strokeStyle = r() > 0.4 ? 'rgba(40,60,20,.10)' : 'rgba(255,255,230,.16)'; g.lineWidth = 0.5; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + inc * 0.3, y - l * 0.6, x + inc, y - l); g.stroke(); }
    for (let i = 0; i < 60; i++) { g.fillStyle = 'rgba(80,60,40,.10)'; g.beginPath(); g.arc(r() * PED, r() * PED, 0.4 + r() * 0.6, 0, 6.29); g.fill(); }
  }
  function corCelula(I, J, agua) {
    if (I < 0 || J < 0 || I >= N || J >= N) return CORRGB.seco;
    const k = J * N + I, h = hash[k], b = base[k];
    if (ruidoA[k] >= 0) { const x = (I + 0.5) * CEL / PPM - TAM / 2, z = (J + 0.5) * CEL / PPM - TAM / 2; return h < clarezaCel(ruidoA[k], x, z) ? CORRGB.verde : CORRGB.cinza; }
    if (b === 4) return h < agua ? CORRGB.agua : CORRGB.aguaCinza;
    return CORRGB[TIPOS[b]];
  }
  function pedaco(ci, cj) {
    if (!INFO) prepararPedacos();
    const n = Math.ceil(TAM * PPM / PED), id = cj * n + ci, inf = INFO[id];
    let chave = inf.agua ? 'a' + (M.cor.vereda || 0).toFixed(2) : '';
    inf.ru.forEach((ai) => { const a = RUIDO[ai], o = M.onda; chave += '|' + M.cor[a.id].toFixed(3) + (o && o.area === a.id ? 'o' + Math.round(o.r * 2) : ''); });
    const c0 = cache.get(id); if (c0 && c0.chave === chave) return c0.tela;
    const por = PED / CEL, lado = por + 2;
    const agua = M.cor.vereda !== undefined ? M.cor.vereda : 1;
    // mapa: 1 pixel por célula, com borda de 1 célula para emendar sem costura
    const mapa = document.createElement('canvas'); mapa.width = mapa.height = lado;
    const mg = mapa.getContext('2d'), img = mg.createImageData(lado, lado), d = img.data;
    for (let j = 0; j < lado; j++) for (let i = 0; i < lado; i++) {
      const I = ci * por + i - 1, J = cj * por + j - 1, c = corCelula(I, J, agua), k = (I >= 0 && J >= 0 && I < N && J < N) ? hash[J * N + I] : 0.5, v = 1 + (k - 0.5) * 0.07, o = (j * lado + i) * 4;
      d[o] = c[0] * v; d[o + 1] = c[1] * v; d[o + 2] = c[2] * v; d[o + 3] = 255;
    }
    mg.putImageData(img, 0, 0);
    const tela = c0 ? c0.tela : document.createElement('canvas'); tela.width = tela.height = PED * RG;
    const g = tela.getContext('2d'); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
    // amplia o mapa e tira a média de cópias deslocadas: as bordas viram manchas macias, sem quadradinhos
    const T = CEL * RG, Wm = lado * T;
    [[0, 0, 1], [0.5, 0.2, 1 / 2], [-0.4, 0.45, 1 / 3], [0.15, -0.5, 1 / 4], [-0.5, -0.25, 1 / 5]].forEach(([dx, dy, a]) => { g.globalAlpha = a; g.drawImage(mapa, 0, 0, lado, lado, -T + dx * T, -T + dy * T, Wm, Wm); });
    g.globalAlpha = 1;
    g.drawImage(DETALHE, 0, 0);
    // praça: pedras em grade dentro do círculo
    const pcx = px(0) - ci * PED, pcy = pz(4) - cj * PED, pr = 20 * PPM;
    if (pcx > -pr && pcx < PED + pr && pcy > -pr && pcy < PED + pr) {
      g.save(); g.scale(RG, RG); g.beginPath(); g.arc(pcx, pcy, pr - 1, 0, 6.29); g.clip(); g.strokeStyle = 'rgba(150,130,100,.28)'; g.lineWidth = 0.4;
      const ox = ((px(0) % 10) + 10) % 10 - (ci * PED) % 10, oy = ((pz(4) % 10) + 10) % 10 - (cj * PED) % 10;
      for (let x = ox - 10; x < PED + 10; x += 10) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, PED); g.stroke(); }
      for (let y = oy - 10; y < PED + 10; y += 10) { g.beginPath(); g.moveTo(0, y); g.lineTo(PED, y); g.stroke(); }
      g.beginPath(); g.arc(pcx, pcy, pr - 1.5, 0, 6.29); g.strokeStyle = 'rgba(150,130,100,.5)'; g.lineWidth = 1.2; g.stroke();
      g.restore();
    }
    cache.delete(id); cache.set(id, { tela, chave });
    if (cache.size > 44) cache.delete(cache.keys().next().value);
    return tela;
  }

  /* ---------- desenhar ---------- */
  function desenhar(g, W, H, jog) {
    const cx = M.cam.x, cy = M.cam.y, t = M.t;
    const vis = (x, z, m) => { const sx = px(x) - cx, sy = pz(z) - cy; return sx > -m && sx < W + m && sy > -m && sy < H + m * 1.5; };
    const D = (im, x, y) => g.drawImage(im, x, y, im.lw, im.lh);
    // chão: pedaços em cache, refeitos só quando o que mostram muda (sobrepõe meia unidade para não aparecer costura)
    for (let cj = Math.floor(cy / PED); cj <= Math.floor((cy + H) / PED); cj++) for (let ci = Math.floor(cx / PED); ci <= Math.floor((cx + W) / PED); ci++) {
      if (ci < 0 || cj < 0 || ci * PED >= TAM * PPM || cj * PED >= TAM * PPM) continue;
      g.drawImage(pedaco(ci, cj), ci * PED - cx, cj * PED - cy, PED + 0.6, PED + 0.6);
    }
    // coisas planas
    M.planos.forEach((p) => { if (vis(p.x, p.z, 40)) D(p.img, px(p.x) - cx - p.img.lw / 2, pz(p.z) - cy - p.img.lh / 2); });
    // vento: o capim e as flores balançam 1 px em ondas que atravessam o campo
    const vento = (x, z) => Math.sin(t * 1.7 + x * 0.22 + z * 0.12) * 0.8;
    M.capim.forEach((c) => { if (!vis(c.x, c.z, 10)) return; D(M.tufos[estado(c.x, c.z)][c.v], px(c.x) - cx - 5 + vento(c.x, c.z), pz(c.z) - cy - 8.5); });
    M.floresCampo.forEach((f) => { if (vis(f.x, f.z, 6)) D(f.img, px(f.x) - cx - 3.5 + vento(f.x, f.z), pz(f.z) - cy - 7.5); });
    // brilho na água
    for (let i = 0; i < 46; i++) {
      const z = (cy + (i * 37) % (H + 20)) / PPM - TAM / 2, x = RIO_X + Math.sin(z * 0.04) * 5 + ((i * 53) % 22) - 11;
      if (Math.sin(t * 2.3 + i * 1.7) < 0.55) continue;
      g.fillStyle = (M.cor.vereda || 0) > 0.5 ? 'rgba(235,250,255,.85)' : 'rgba(190,200,204,.7)'; g.beginPath(); g.ellipse(px(x) - cx, pz(z) - cy, 1.4 + (i % 2), 0.45, 0, 0, 6.29); g.fill();
    }
    M.marcas.forEach((m) => { if (m.plano && m.mesh.visible && vis(m.pos.x, m.pos.z, 30)) D(m.img, px(m.pos.x) - cx - m.img.lw / 2, pz(m.pos.z) - cy - m.img.lh / 2); });
    M.fontes.forEach((f) => { if (f.plano && vis(f.pos.x, f.pos.z, 20)) D(f.img[1], px(f.pos.x) - cx - f.img[1].lw / 2, pz(f.pos.z) - cy - f.img[1].lh / 2); });
    // onda de restauração: anel dourado no chão
    if (M.onda) {
      const o = M.onda, s = Math.min(o.r, o.max) * PPM, a = Math.max(0, 1 - Math.min(o.r, o.max) / o.max);
      g.save(); g.globalAlpha = a; g.strokeStyle = '#ffe36a'; g.lineWidth = 2; g.beginPath(); g.ellipse(px(o.x) - cx, pz(o.z) - cy, s, s, 0, 0, 6.29); g.stroke();
      g.globalAlpha = a * 0.5; g.lineWidth = 5; g.strokeStyle = '#fff6c0'; g.beginPath(); g.ellipse(px(o.x) - cx, pz(o.z) - cy, Math.max(1, s - 4), Math.max(1, s - 4), 0, 0, 6.29); g.stroke(); g.restore();
    }
    // anel no chão embaixo dos bichos pequenos que andam (ajuda a achar)
    M.bichos.forEach((b) => { if (b.mesh.visible && (b.fase.escala || 1) < 0.8 && !b.fase.voa) D(M.anel, px(b.pos.x) - cx - 7.5, pz(b.pos.z) - cy - 3.4); });
    // tudo que fica de pé, em ordem de profundidade
    const L = [];
    const add = (img, x, z, ox, oy, lift, sombra, alpha) => { if (img && vis(x, z, 70)) L.push([z, img, px(x) - ox, pz(z) - oy - (lift || 0), sombra, px(x), pz(z), alpha]); };
    M.decor.forEach((d) => add(d.img, d.x, d.z, d.ox, d.oy));
    M.flores.forEach((f) => { const pulo = f.aberta && f.pop < 1 ? Math.sin(f.pop * Math.PI) * 4 : 0; add(f.aberta ? M.imgFlor[f.cor] : M.imgBotao, f.pos.x, f.pos.z, 3.5 - (f.aberta ? vento(f.pos.x, f.pos.z) : 0), 7.5, pulo); });
    M.trilha.forEach((f) => { if (f.aberta) add(M.imgFlor[f.cor], f.pos.x, f.pos.z, 3.5, 7.5, f.pop < 1 ? Math.sin(f.pop * Math.PI) * 4 : 0); });
    M.marcas.forEach((m) => { if (!m.plano && m.mesh.visible) add(m.img, m.pos.x, m.pos.z + 0.05, m.img.lw / 2, m.img.lh - 1, m.lift); });
    M.fontes.forEach((f) => { if (!f.plano && f.img) add(f.img[f.cheia ? 1 : 0], f.pos.x, f.pos.z, f.img[1].lw / 2, f.img[1].lh - 1); });
    M.caixas.forEach((c) => { const im = c.img[Estado.dados.relacoes[c.rel.id] === 'ativada' ? 1 : 0]; add(im, c.pos.x, c.pos.z, im.lw / 2, im.lh - 1); });
    M.npcs.forEach((n) => { const q = n.sprites[n.dir], s = n.andando ? q[1 + (Math.floor(n.passo) % 2)] : q[0]; add(s, n.pos.x, n.pos.z, s.lw / 2, s.lh - 1, !n.andando ? Math.max(0, Math.sin(t * 2 + n.t0)) * 0.4 : Math.abs(Math.sin(n.passo * Math.PI)) * 0.8, 10); });
    const animal = (b, quadro) => { const q = b.quadros[quadro], img = b.dir < 0 ? (b.quadrosE || (b.quadrosE = b.quadros.map(Arte.espelho)))[quadro] : q; add(img, b.pos.x, b.pos.z, q.lw / 2, q.lh - 1, b.pos.y * PPM, q.lw + 2); };
    // voadores batem as asas o tempo todo; os outros só mexem as patas quando andam
    const quadro = (n, voa, mexe, fase0, rapido) => voa ? Math.floor((t + fase0) * (rapido ? 14 : 10)) % n : mexe ? Math.floor((t + fase0) * 7) % n : 0;
    M.bichos.forEach((b) => {
      if (!b.mesh.visible) return;
      animal(b, quadro(b.quadros.length, b.fase.voa, b.alvo || b.agindo > 0, b.fase0, b.agindo <= 0));
      // a saúva mostrando o que faz: carrega um pedaço de folha maior que ela
      if (b.fase.forma === 'formiga' && b.agindo > 0) add(M.folhaSauva, b.pos.x + b.dir * 0.4, b.pos.z + 0.01, 4, 9, 0);
    });
    M.companheiros.forEach((c) => animal({ quadros: c.quadros, dir: c.dir, pos: c.pos, set quadrosE(v) { c.quadrosE = v; }, get quadrosE() { return c.quadrosE; } }, quadro(c.quadros.length, c.voa, true, 0, true)));
    if (jog) { const s = jog.sprite(); add(s, jog.pos.x, jog.pos.z, s.lw / 2, s.lh - 1, jog.movendo ? Math.abs(Math.sin(jog.andando * Math.PI)) * 0.8 : 0, 10); }
    L.sort((a, b) => a[0] - b[0]);
    L.forEach(([, img, x, y, sombra, sx, sz]) => {
      if (sombra) { const w = sombra <= 6 ? 6 : sombra <= 8 ? 8 : sombra <= 11 ? 10 : 14, sh = M.sombras[w]; D(sh, sx - cx - w / 2, sz - cy - sh.lh / 2); }
      D(img, x - cx, y - cy);
    });
    // brilhos: onde dá para fazer algo
    const br = M.brilhos[Math.floor(t * 4) % 2], pulo = Math.sin(t * 4) * 1.5;
    const brilho = (x, z, alt) => { if (vis(x, z, 20)) D(br, px(x) - cx - 4.5, pz(z) - cy - alt - 4 + pulo); };
    M.fontes.forEach((f) => { if (f.cheia) brilho(f.pos.x, f.pos.z, (f.img ? f.img[1].lh : 6) + 5); });
    M.caixas.forEach((c) => { if (Estado.dados.relacoes[c.rel.id] === 'vista') brilho(c.pos.x, c.pos.z, 18); });
    M.bichos.forEach((b) => { if (b.mesh.visible && b.agindo > 0) brilho(b.pos.x, b.pos.z, b.pos.y * PPM + 12); });
    // Ruído: poeira cinza que flutua nas áreas apagadas
    RUIDO.forEach((a) => {
      const k = M.cor[a.id]; if (k >= 1 || !vis(a.x, a.z, a.r * PPM)) return;
      g.fillStyle = 'rgba(70,66,84,.55)';
      for (let i = 0; i < 70 * (1 - k); i++) { const ang = i * 2.39996, rr = Math.sqrt((i * 0.618) % 1) * a.r, x = a.x + Math.cos(ang + t * 0.05) * rr, z = a.z + Math.sin(ang + t * 0.05) * rr + Math.sin(t * 0.7 + i) * 0.8; g.beginPath(); g.arc(px(x) - cx, pz(z) - cy - ((t * 6 + i * 7) % 18), 0.7, 0, 6.29); g.fill(); }
    });
    // partículas
    M.part.forEach((q) => { if (!vis(q.x, q.z, 4)) return; g.fillStyle = q.cor; g.beginPath(); if (q.tam > 1) g.ellipse(px(q.x) - cx, pz(q.z) - cy - q.y * PPM, 1.3, 0.7, q.vida * 6, 0, 6.29); else g.arc(px(q.x) - cx, pz(q.z) - cy - q.y * PPM, 0.6, 0, 6.29); g.fill(); });
    // sombras de nuvem passando devagar
    if (M.dia > 0.3) {
      g.save(); g.globalAlpha = 0.07 * M.dia;
      M.nuvens.forEach((nv, i) => { for (let k = 0; k < 3; k++) { const wx = ((i * 830 + k * 1700 + t * 7) % 2800) - 300, wy = (i * 610 + k * 900) % 2200; const sx = wx - cx, sy = wy - cy; if (sx > -nv.lw * 2 && sx < W && sy > -nv.lh * 2 && sy < H) g.drawImage(nv, sx, sy, nv.lw * 2, nv.lh * 2); } });
      g.restore();
    }
    // chuva
    if (M.chuva) { g.strokeStyle = 'rgba(210,228,255,.5)'; g.lineWidth = 0.5; g.beginPath(); for (let i = 0; i < 90; i++) { const x = (i * 97 + t * 40) % (W + 20) - 10, y = (i * 53 + t * 160) % (H + 20) - 10; g.moveTo(x, y); g.lineTo(x - 0.8, y + 3.4); } g.stroke(); }
    // noite e fim de tarde
    if (M.baixo > 0.05) { g.fillStyle = 'rgba(255,140,60,' + (M.baixo * 0.16).toFixed(3) + ')'; g.fillRect(0, 0, W, H); }
    if (M.dia < 1) {
      g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = Arte.mistura('#ffffff', '#2a3a78', (1 - M.dia) * 0.62); g.fillRect(0, 0, W, H);
      g.globalCompositeOperation = 'lighter';
      const luz = (x, z, r, cor) => { const lx = px(x) - cx, ly = pz(z) - cy; if (lx < -r || ly < -r || lx > W + r || ly > H + r) return; const gr = g.createRadialGradient(lx, ly, 0, lx, ly, r); gr.addColorStop(0, cor); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(lx - r, ly - r, r * 2, r * 2); };
      const n = 1 - M.dia;
      luz(M.lampada.x, M.lampada.z - 2, 46, 'rgba(255,200,110,' + (0.55 * n).toFixed(3) + ')');
      if (jog) luz(jog.pos.x, jog.pos.z - 1, 34, 'rgba(120,140,190,' + (0.35 * n).toFixed(3) + ')');
      // vaga-lumes nas áreas vivas
      if (M.noite) for (let i = 0; i < 26; i++) { const x = cx + ((i * 131 + Math.sin(t * 0.3 + i) * 30) % W + W) % W, y = cy + ((i * 71 + Math.cos(t * 0.4 + i) * 20) % H + H) % H; if (Math.sin(t * 3 + i * 2) > 0.3) { const fx = x - cx, fy = y - cy, gr = g.createRadialGradient(fx, fy, 0, fx, fy, 2.2); gr.addColorStop(0, 'rgba(230,255,140,.95)'); gr.addColorStop(1, 'rgba(230,255,140,0)'); g.fillStyle = gr; g.fillRect(fx - 2.2, fy - 2.2, 4.4, 4.4); } }
      g.restore();
    }
  }
  // posição na tela (px internos) de um ponto do mundo
  function naTela(pos, alt) { return { x: px(pos.x) - M.cam.x, y: pz(pos.z) - M.cam.y - (alt || 0) * PPM }; }

  return { construir, update, desenhar, naTela, altura, areaEm, companheiro, dispensar, povoar, onda, colher, efeito, M, PPM, TAM, px, pz, RIO_X, RIO_LARGURA };
})();
