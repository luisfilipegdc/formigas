/* =====================================================================
   Terra Codex · Brasil Vivo · laço principal
   Entrada em Brasília, ações de contexto (observar, ver o que faz, examinar,
   levar ao Ninho, falar, olhar o jardim), Ninho sem pergunta, área e Clareza
   no HUD. O progresso mora em Estado (save v2) e a BioDex sobe por evento.
   ===================================================================== */
(function () {
  const $ = (id) => document.getElementById(id);
  const V3 = THREE.Vector3;
  const BIOMA = 'cerrado';
  const erros = Registro.validar();
  const E = Estado.dados;
  const salvar = () => Estado.salvar(jog.mesh.position);

  /* ---------- cena ---------- */
  const canvas = $('tela');
  const MOBILE = Math.min(screen.width, screen.height) < 820 || /iPhone|Android.+Mobile/i.test(navigator.userAgent);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !MOBILE });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, MOBILE ? 1.5 : 2)); renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.5, 600);
  addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); });
  const mundo = Mundo.construir(scene, BIOMA);
  const jog = Jogador.criar(scene, camera, new V3(E.pos[0], 0, E.pos[2]));
  jog.mesh.position.y = Mundo.altura(E.pos[0], E.pos[2]);
  camera.position.set(E.pos[0] + 10, 12, E.pos[2] + 14);
  E.ninho.forEach((n) => { const c = Registro.ciclo(n.ciclo); if (!c.passos.some((p) => p.de === n.fase)) Mundo.companheiro(c.especie); });

  function livre(x, z) {
    for (const [ax, az, r] of mundo.arvPos) if (Math.hypot(x - ax, z - az) < r) return false;
    return true;
  }

  // cada marco novo da BioDex é celebrado (recompensa ligada ao que a criança fez, nunca ao acaso)
  Estado.on('marco', ({ especie, marco }) => UI.celebrar(especie, marco));
  E.dicas = E.dicas || {};

  /* ---------- início ---------- */
  function inicio() {
    if (E.comecou) { comecar(); return; }
    $('inicio-bt').addEventListener('click', async () => {
      E.comecou = true; salvar(); comecar();
      if (E.migrado) UI.toast('Seu progresso do Vale Vivo veio junto 🌿', 3500);
      const ipe = Registro.R.npcs.ipe;
      await UI.dialogo(ipe.emoji + ' ' + ipe.nome, ipe.falas.inicio, ['Vamos!']);
      E.falou.ipe = true; salvar();
    });
  }
  function comecar() {
    const voltando = document.body.classList.contains('jogando') === false && E.falou.ipe;
    document.body.classList.add('jogando'); $('inicio').hidden = true; $('hud').hidden = false;
    // quem volta vê o que mudou enquanto esteve fora (só o que aconteceu de verdade)
    if (voltando) { const mud = conferirNinho(true); if (mud.length) setTimeout(() => UI.dialogo('🌱 Enquanto você esteve fora', mud.join(' '), ['Ver no Ninho', 'Continuar']).then((i) => { if (i === 0) UI.ninho(cuidar); }), 500); }
  }

  /* ---------- o que está perto ---------- */
  let perto = null;
  function procurarPerto() {
    const p = jog.mesh.position, raio = 6.5;
    let melhor = null, dm = Infinity;
    const cand = (tipo, obj, pos, nome, acao, r, prio) => { const d = Math.hypot(p.x - pos.x, p.z - pos.z) - (prio || 0); if (d < (r || raio) && d < dm) { dm = d; melhor = { tipo, obj, nome, acao }; } };
    mundo.bichos.forEach((b) => {
      if (!b.mesh.visible) return;
      const e = b.especie, viu = Biodex.viuFase(e.id, b.fase.id), nome = viu ? e.emoji + ' ' + e.nome : '❔ ???';
      const acao = !viu ? 'Observar 🔍' : b.agindo > 0 && !E.relacoes[b.rel.id] ? 'Ver o que faz ✨' : 'Ver na BioDex 📖';
      cand('bicho', b, b.pos, nome, acao, b.agindo > 0 ? 9 : raio, b.agindo > 0 ? 2 : 0);
    });
    mundo.marcas.forEach((m) => {
      if (!m.mesh.visible) return;
      const achou = E.achados[m.especie.id + ':' + m.fase.id];
      if (achou && !m.fase.ninho) return;
      cand('marca', m, m.pos, achou ? m.fase.emoji + ' ' + m.fase.nome : '🔍 Algo pequeno', achou ? 'Levar ao Ninho 🤲' : 'Examinar 🔍', 5.5, 1);
    });
    mundo.npcs.forEach((n) => cand('npc', n, n.pos, n.dado.emoji + ' ' + n.dado.nome, 'Falar 💬'));
    if (mundo.placaJardim) cand('jardim', mundo.placaJardim, mundo.placaJardim.pos, '🌸 ' + mundo.placaJardim.area.nome, 'Olhar 👀', 7);
    perto = melhor;
    const a = $('acao'); a.hidden = !melhor || UI.aberto();
    if (melhor) { const pt = melhor.acao.split(' '), ico = pt.pop(); $('acao-nome').textContent = melhor.nome; $('acao-ico').textContent = ico; $('acao-txt').textContent = pt.join(' '); }
  }
  $('acao-bt').addEventListener('click', agir);
  addEventListener('keydown', (e) => { if ((e.key === 'e' || e.key === 'E' || e.key === ' ') && perto && !UI.aberto()) agir(); });

  async function agir() {
    if (!perto || UI.aberto()) return;
    const { tipo, obj } = perto;
    if (tipo === 'bicho') await verBicho(obj);
    if (tipo === 'marca') await examinar(obj);
    if (tipo === 'npc') await falar(obj.dado);
    if (tipo === 'jardim') await olharJardim(obj.area);
  }

  // observar → Visto · ver a ação na hora certa → Conectado (sem pergunta)
  async function verBicho(b) {
    const e = b.especie;
    if (!Biodex.viuFase(e.id, b.fase.id)) {
      Biodex.viu(e.id, b.fase.id);
      await UI.dialogo(e.emoji + ' ' + e.nome, e.textos.visto + ' ' + e.funcao, ['📖 Ver na BioDex', 'Continuar explorando']).then((i) => { if (i === 0) abrirFicha(e.id); });
      return;
    }
    if (b.agindo > 0 && b.rel && !E.relacoes[b.rel.id]) {
      Biodex.relacao(b.rel.id, 'vista');
      await UI.dialogo('🔗 ' + e.nome + ' ' + b.rel.tipo + ' → ' + b.rel.para, b.rel.texto, ['Que incrível!']);
      return;
    }
    abrirFicha(e.id);
  }
  // examinar uma marca → registra a fase (Encontrado quando é a segunda) · fases pequenas podem ir ao Ninho
  async function examinar(m) {
    const e = m.especie, f = m.fase, chave = e.id + ':' + f.id;
    if (!E.achados[chave]) {
      E.achados[chave] = true; Biodex.viu(e.id, f.id);
      const ops = f.ninho ? ['Levar ao Ninho 🤲', 'Deixar aqui'] : ['Anotar na BioDex'];
      const i = await UI.dialogo(f.emoji + ' ' + f.nome + ' · ' + e.nome, f.achado, ops);
      if (f.ninho && i === 0) await levarAoNinho(e, f);
      return;
    }
    if (f.ninho) await levarAoNinho(e, f);
  }
  async function levarAoNinho(e, f) {
    if (E.ninho.length >= 3) { await UI.dialogo('🥚 Ninho', 'Seu Ninho já tem 3 seres vivos. Acompanhe a transformação deles antes de trazer outro.', ['Ok']); return; }
    E.ninho.push({ ciclo: e.ciclo, fase: f.id, desde: null }); salvar();
    UI.toast(f.emoji + ' ' + f.nome + ' de ' + e.nome + ' no Ninho! Abra o Ninho para cuidar.', 3500);
  }

  async function falar(n) {
    const primeira = !E.falou[n.id];
    E.falou[n.id] = true; salvar();
    if (primeira) await UI.dialogo(n.emoji + ' ' + n.nome, n.falas.inicio, ['E aí?']);
    await UI.dialogo(n.emoji + ' ' + n.nome, n.falas.pista || n.falas.inicio, ['Vou ver']);
  }
  async function olharJardim(a) {
    const k = Math.round(Ruido.clareza(a.id) * 100);
    const temBorboleta = mundo.companheiros.some((c) => c.id === 'borboleta-azul');
    await UI.dialogo('🌸 ' + a.nome, a.texto + ' Clareza do jardim: ' + k + '%.' + (temBorboleta ? ' Sua borboleta está agitada perto das flores. Na próxima atualização do jogo você vai poder soltá-la aqui.' : ''), [temBorboleta ? 'Combinado!' : 'Vou descobrir quem falta']);
  }

  /* ---------- Ninho: cuidar inicia a mudança; o tempo real faz o resto ---------- */
  function cuidar(i) {
    const n = E.ninho[i]; if (!n || n.desde) return;
    const c = Registro.ciclo(n.ciclo);
    n.desde = Date.now(); Biodex.cuidou(c.especie); salvar();
    UI.ninho(cuidar);
  }
  // confere as transformações (também conta o tempo com o jogo fechado)
  function conferirNinho(silencioso) {
    const agora = Date.now(), mudancas = [];
    E.ninho.forEach((n) => {
      if (!n.desde) return;
      const c = Registro.ciclo(n.ciclo), passo = c.passos.find((p) => p.de === n.fase);
      if (!passo || agora < n.desde + passo.minutos * 60000) return;
      n.fase = passo.para; n.desde = null;
      const e = Registro.especie(c.especie), f = e.fases.find((x) => x.id === passo.para);
      Biodex.transformou(e.id, passo.para);
      const fim = !c.passos.some((p) => p.de === n.fase);
      if (fim) Mundo.companheiro(e.id);
      const de = e.fases.find((x) => x.id === passo.de).nome.toLowerCase();
      const frase = f.emoji + ' ' + (fim ? e.nome + ' completou o ciclo e agora acompanha você!' : 'Mudou! ' + e.nome + ' passou de ' + de + ' para ' + f.nome.toLowerCase() + '.');
      mudancas.push(frase);
      if (!silencioso) UI.toast(frase, 4000);
      salvar();
      if (!$('painel').hidden && $('painel-titulo').textContent.startsWith('🥚')) UI.ninho(cuidar);
    });
    return mudancas;
  }

  /* ---------- HUD ---------- */
  function abrirBiodex() { UI.biodex(BIOMA, abrirFicha); }
  function abrirFicha(id) { UI.ficha(id, abrirBiodex); }
  $('bt-codex').addEventListener('click', abrirBiodex);
  $('bt-ninho').addEventListener('click', () => UI.ninho(cuidar));
  $('bt-mapa').addEventListener('click', () => UI.mapa());

  // área atual e Clareza dela
  let areaAtual;
  function atualizarArea() {
    const p = jog.mesh.position, a = Mundo.areaEm(p.x, p.z), id = a ? a.id : null;
    const k = a ? Ruido.clareza(a.id) : 1;
    $('area-nome').textContent = a ? a.nome : 'Cerrado aberto';
    $('clareza-bar').style.width = Math.round(k * 100) + '%';
    $('clareza-bar').classList.toggle('ruido', k < 0.5);
    if (id !== areaAtual) { areaAtual = id; if (a && k < 0.5 && !UI.aberto()) UI.toast('🌫️ ' + a.nome + ' está tomada pelo Ruído', 2600); }
    if (!dicaFixa) UI.dica(a && k < 0.5 ? '🌫️ ' + (a.dicaRuido || 'O Ruído apagou as ligações daqui.') : null);
  }

  /* ---------- jornada: um passo por vez, sempre à vista ---------- */
  const JORNADA = Registro.lista('jornadas', BIOMA)[0];
  let passoAtual = null, dicaFixa = false;
  function jornada() {
    if (!JORNADA) return null;
    const i = JORNADA.passos.findIndex((p) => !p.feito(E));
    return { i, passo: i >= 0 ? JORNADA.passos[i] : null, total: JORNADA.passos.length };
  }
  function atualizarObjetivo() {
    const j = jornada(); if (!j) return;
    const el = $('objetivo'); el.hidden = false;
    if (passoAtual !== null && j.i !== passoAtual && passoAtual >= 0) UI.toast('✅ Passo concluído: ' + JORNADA.passos[passoAtual].texto, 3200);
    passoAtual = j.i;
    if (!j.passo) { el.classList.add('feito'); $('obj-ico').textContent = '🌿'; $('obj-n').textContent = JORNADA.nome; $('obj-txt').textContent = 'Jornada completa!'; return; }
    $('obj-ico').textContent = j.passo.ico; $('obj-n').textContent = 'Passo ' + (j.i + 1) + ' de ' + j.total; $('obj-txt').textContent = j.passo.texto;
  }
  // posição do alvo do passo atual no mundo (para o farol e a seta)
  function alvoDoPasso() {
    const j = jornada(); if (!j || !j.passo || !j.passo.alvo) return null;
    const a = j.passo.alvo;
    if (a.npc) { const n = mundo.npcs.find((x) => x.dado.id === a.npc); return n && n.pos; }
    if (a.marca) { const m = mundo.marcas.find((x) => x.especie.id + ':' + x.fase.id === a.marca); return m && m.mesh.visible ? m.pos : null; }
    if (a.lugar === 'jardim' && mundo.placaJardim) return mundo.placaJardim.pos;
    return null;
  }
  $('objetivo').addEventListener('click', () => { const j = jornada(); if (j) UI.jornada(JORNADA, j.i, E, () => UI.ninho(cuidar)); });
  // farol: coluna de luz dourada sobre o alvo, visível de longe
  const farol = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.9, 40, 16, 1, true), new THREE.MeshBasicMaterial({ color: '#ffd84a', transparent: true, opacity: 0.32, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }));
  farol.visible = false; scene.add(farol);
  const _v = new THREE.Vector3();
  function guiar(t) {
    const alvo = alvoDoPasso(), g = $('guia'), p = jog.mesh.position;
    if (!alvo || UI.aberto()) { farol.visible = false; g.hidden = true; return; }
    const d = Math.hypot(alvo.x - p.x, alvo.z - p.z);
    farol.visible = d > 6; farol.position.set(alvo.x, alvo.y + 20, alvo.z); farol.material.opacity = 0.22 + Math.sin(t * 3) * 0.08;
    _v.set(alvo.x, alvo.y + 2, alvo.z).project(camera);
    const atras = _v.z > 1, dentro = !atras && Math.abs(_v.x) < 0.85 && Math.abs(_v.y) < 0.75;
    if (dentro || d < 8) { g.hidden = true; return; }
    // fora da tela: seta na borda apontando para o alvo
    let x = _v.x, y = _v.y; if (atras) { x = -x; y = -y; }
    const ang = Math.atan2(-y, x), m = Math.max(Math.abs(x) / 0.82, Math.abs(y) / 0.62, 0.001);
    x /= m; y /= m;
    g.hidden = false; g.style.left = ((x + 1) / 2 * innerWidth) + 'px'; g.style.top = ((1 - y) / 2 * innerHeight) + 'px';
    $('guia-seta').style.transform = 'rotate(' + ang + 'rad)'; $('guia-dist').textContent = Math.round(d) + ' m';
  }
  // selo do Ninho: quantos estão prontos para cuidar (convite, nunca cobrança)
  function seloNinho() {
    const prontos = E.ninho.filter((n) => !n.desde && Registro.ciclo(n.ciclo).passos.some((p) => p.de === n.fase)).length;
    $('selo-ninho').hidden = !prontos; $('selo-ninho').textContent = prontos;
  }
  // primeira vez que o botão de ação aparece: dica curta, uma vez só
  function dicaPrimeiraAcao() {
    if (E.dicas.acao || $('acao').hidden) return;
    E.dicas.acao = true; salvar(); dicaFixa = true;
    UI.dica('👉 Toque no botão dourado para ' + $('acao-txt').textContent.toLowerCase() + '.');
    setTimeout(() => { dicaFixa = false; UI.dica(null); }, 4500);
  }

  window.__terra = {
    estado: E, mundo, jog, salvar, erros, Biodex, Registro, Ruido, jornada,
    // testes: adianta o relógio do Ninho em N minutos
    acelerar(min) { E.ninho.forEach((n) => { if (n.desde) n.desde -= min * 60000; }); conferirNinho(); }
  };

  /* ---------- laço ---------- */
  let last = performance.now(), acc = 0, accN = 0;
  renderer.setAnimationLoop(() => {
    const now = performance.now(), dt = Math.min(0.1, (now - last) / 1000); last = now;
    if (!document.body.classList.contains('jogando')) {
      // tela de início: câmera passeia devagar sobre a Base
      const a = now / 1000 * 0.06; Mundo.update(0, jog.mesh.position);
      camera.position.set(Math.sin(a) * 46, 15, 8 + Math.cos(a) * 46); camera.lookAt(0, 5, 8);
      renderer.render(scene, camera); return;
    }
    Jogador.update(dt, Mundo.altura, livre);
    Mundo.update(dt, jog.mesh.position);
    $('hora').textContent = mundo.hora + (mundo.chuva ? '🌧️' : '');
    acc += dt; if (acc > 0.2) { acc = 0; procurarPerto(); atualizarArea(); atualizarObjetivo(); dicaPrimeiraAcao(); }
    accN += dt; if (accN > 1) { accN = 0; conferirNinho(); seloNinho(); if (!$('painel').hidden && $('painel-titulo').textContent.startsWith('🥚')) UI.ninhoAtualizar(); }
    guiar(now / 1000);
    // etiquetas
    const p = jog.mesh.position, lista = [];
    mundo.bichos.forEach((b) => { if (b.mesh.visible && Math.hypot(p.x - b.pos.x, p.z - b.pos.z) < 40) { const viu = Biodex.viuFase(b.especie.id, b.fase.id); lista.push({ pos: b.pos, texto: (viu ? b.especie.emoji + ' ' + b.especie.nome : '❔ ???') + (b.agindo > 0 && !E.relacoes[b.rel.id] ? ' ✨' : ''), classe: b.agindo > 0 ? 'acao' : '', alt: 0.9 + (b.fase.escala || 1) * 1.6 }); } });
    mundo.marcas.forEach((m) => { if (m.mesh.visible && Math.hypot(p.x - m.pos.x, p.z - m.pos.z) < 22 && !(E.achados[m.especie.id + ':' + m.fase.id] && !m.fase.ninho)) lista.push({ pos: m.pos, texto: E.achados[m.especie.id + ':' + m.fase.id] ? m.fase.emoji + ' ' + m.fase.nome : '🔍', alt: 2 }); });
    mundo.npcs.forEach((n) => { if (Math.hypot(p.x - n.pos.x, p.z - n.pos.z) < 60) lista.push({ pos: n.pos, texto: n.dado.emoji + ' ' + n.dado.nome, classe: 'npc', alt: 4.2 }); });
    mundo.companheiros.forEach((c) => lista.push({ pos: c.pos, texto: c.texto, alt: 2.4 }));
    if (mundo.placaJardim && Math.hypot(p.x - mundo.placaJardim.pos.x, p.z - mundo.placaJardim.pos.z) < 80) lista.push({ pos: mundo.placaJardim.pos, texto: '🌸 Jardim Polinizador · ' + Math.round(Ruido.clareza('jardim') * 100) + '%', classe: Ruido.clareza('jardim') < 0.5 ? 'ruido' : 'obra', alt: 3.4 });
    UI.etiquetas(camera, lista);
    renderer.render(scene, camera);
  });
  addEventListener('beforeunload', salvar);
  addEventListener('visibilitychange', () => { if (document.hidden) salvar(); });
  inicio();
})();
