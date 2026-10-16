/* =====================================================================
   Terra Codex · laço principal: estado, salvamento, início, interações
   (observar, falar, construir, pegadas, Ruidosos, chefe), Clareza e missões.
   Salva em localStorage 'terracodex1' (só neste aparelho; sem conta).
   ===================================================================== */
(function () {
  const $ = (id) => document.getElementById(id);
  const V3 = THREE.Vector3;
  const CHAVE = 'terracodex1';
  let estado = { cartas: {}, ecos: [], missoes: {}, obras: {}, restaurada: {}, falou: {}, pegadas: {}, fragmentos: 0, chefe: false, selo: false, pos: [0, 0, 8], lupa: false, inicial: null };
  try { const s = JSON.parse(localStorage.getItem(CHAVE)); if (s && s.inicial) estado = Object.assign(estado, s); } catch (e) {}
  function salvar() { try { estado.pos = [jog.mesh.position.x, 0, jog.mesh.position.z]; localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch (e) {} }

  /* ---------- cena ---------- */
  const canvas = $('tela');
  const MOBILE = Math.min(screen.width, screen.height) < 820 || /iPhone|Android.+Mobile/i.test(navigator.userAgent);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !MOBILE });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, MOBILE ? 1.5 : 2)); renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = !MOBILE; renderer.outputEncoding = THREE.sRGBEncoding;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.5, 600);
  addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); });
  const mundo = Mundo.construir(scene, estado);
  const jog = Jogador.criar(scene, camera, new V3(estado.pos[0], 0, estado.pos[2]));
  jog.mesh.position.y = Mundo.altura(estado.pos[0], estado.pos[2]);
  camera.position.set(estado.pos[0] + 10, 12, estado.pos[2] + 14);
  window.__terra = { estado, mundo, jog, salvar };   // para testes

  // árvores e casas bloqueiam o passo; o rio sem ponte é passável, mas custa Clareza
  function livre(x, z) {
    for (const [ax, az, r] of mundo.arvPos) if (Math.hypot(x - ax, z - az) < r) return false;
    return true;
  }

  /* ---------- início: escolha do primeiro Eco ---------- */
  function inicio() {
    if (estado.inicial) { comecar(); return; }
    const op = $('inicio-escolha'); op.className = 'escolha';
    op.innerHTML = ['abelha', 'formiga', 'aranha'].map((id) => { const c = CARTA(id); return '<button type="button" data-id="' + id + '"><span class="em">' + c.emoji + '</span>' + c.eco.nome + '<small>' + c.tipo + ' · ' + c.eco.poder + '</small></button>'; }).join('');
    $('inicio-texto').insertAdjacentHTML('afterend', '<p><b>Escolha seu primeiro Eco.</b> Ele nasce do que você já entende e vai com você.</p>');
    op.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
      estado.inicial = b.dataset.id; estado.cartas[b.dataset.id] = 2; estado.ecos = [b.dataset.id]; salvar(); comecar();
      UI.toast(CARTA(b.dataset.id).eco.nome + ' nasceu e segue você! ✨', 3500);
      setTimeout(() => UI.dialogo('Codex', 'O Codex está quebrado: só restou uma carta. Explore o vale, observe os seres vivos e registre cada um. Os moradores da vila precisam de ajuda: fale com eles.', ['Vamos!']), 600);
    }));
  }
  function comecar() { document.body.classList.add('jogando'); $('inicio').hidden = true; $('hud').hidden = false; }

  /* ---------- interações ---------- */
  let perto = null;   // {tipo, obj, nome, acao}
  function procurarPerto() {
    const p = jog.mesh.position, raio = estado.lupa ? 9 : 6.5;
    let melhor = null, dm = Infinity;
    const cand = (tipo, obj, pos, nome, acao, r, prio) => { const d = Math.hypot(p.x - pos.x, p.z - pos.z) - (prio || 0); if (d < (r || raio) && d < dm) { dm = d; melhor = { tipo, obj, nome, acao }; } };
    mundo.bichos.forEach((b) => { if (!b.mesh.visible) return; const n = estado.cartas[b.carta.id] || 0; cand('bicho', b, b.pos, b.carta.emoji + ' ' + b.carta.nome, n === 0 ? 'Observar 🔍' : n === 1 ? 'Entender 💡' : n === 2 ? 'Conectar 🔗' : 'Ver carta 📖'); });
    mundo.npcs.forEach((n) => cand('npc', n, n.pos, n.dado.emoji + ' ' + n.dado.nome, 'Falar 💬'));
    mundo.pegadas.forEach((pg) => { if (!estado.pegadas[pg.dado.id]) cand('pegada', pg, pg.pos, '🐾 Sinal', 'Examinar 🔍'); });
    Object.values(mundo.obras).forEach((ob) => { if (!ob.pronta) cand('obra', ob, ob.pos, ob.dado.emoji + ' ' + ob.dado.nome, 'Construir 🔨', 7, 4); });
    if (!estado.chefe) cand('chefe', null, new V3(150, 0, -130), '👁️‍🗨️ Devorador de Habitat', 'Enfrentar ⚔️', 12);
    perto = melhor;
    const a = $('acao'); a.hidden = !melhor || UI.aberto();
    if (melhor) { $('acao-nome').textContent = melhor.nome; $('acao-bt').textContent = melhor.acao; }
  }
  $('acao-bt').addEventListener('click', agir);
  addEventListener('keydown', (e) => { if ((e.key === 'e' || e.key === 'E' || e.key === ' ') && perto && !UI.aberto()) agir(); });

  async function agir() {
    if (!perto || UI.aberto()) return;
    const { tipo, obj } = perto;
    if (tipo === 'bicho') await verBicho(obj.carta);
    if (tipo === 'npc') await falar(obj.dado);
    if (tipo === 'pegada') { estado.pegadas[obj.dado.id] = true; await UI.dialogo(obj.dado.bicho, obj.dado.texto + ' (' + Object.keys(estado.pegadas).length + '/3 sinais)', ['Anotar']); salvar(); }
    if (tipo === 'obra') await construir(obj.dado);
    if (tipo === 'chefe') await chefe();
    checarMissoes();
  }

  // observar → Visto; entender → desafio → Entendido (+ Eco); conectar → Conectado (+ evolução)
  async function verBicho(c) {
    const n = estado.cartas[c.id] || 0;
    if (n === 0) {
      estado.cartas[c.id] = 1; salvar(); UI.toast('📖 ' + c.nome + ' registrado: Visto!');
      const i = await UI.dialogo(c.emoji + ' ' + c.nome, 'Você observou de perto. ' + c.cuidado + ' Quer entender o que ' + (c.tipo === 'Planta' ? 'ela' : 'ele') + ' faz no vale?', ['Entender agora 💡', 'Depois']);
      if (i === 0) await entender(c);
    } else if (n === 1) await entender(c);
    else if (n === 2) await conectar(c.id);
    else UI.carta(estado, c.id, acoesCarta);
  }
  async function entender(c) {
    const ok = await UI.desafio(c.emoji + ' ' + c.nome, c.desafio);
    if (!ok) return;
    estado.cartas[c.id] = Math.max(estado.cartas[c.id] || 0, 2); salvar();
    UI.toast('💡 ' + c.nome + ': Entendido!');
    if (c.eco && !estado.ecos.includes(c.id)) {
      if (estado.ecos.length < 3) { estado.ecos.push(c.id); salvar(); await UI.dialogo('✨ Um Eco nasceu!', c.eco.nome + ' nasceu do que você entendeu. Poder: ' + c.eco.poder + '. Ele vai com você (' + estado.ecos.length + '/3).', ['Que bom!']); }
      else await UI.dialogo('✨ Eco', c.eco.nome + ' quer ir com você, mas seu time já tem 3. Ele espera no Laboratório.', ['Entendi']);
    }
  }
  async function conectar(id) {
    const c = CARTA(id); UI.fecharPainel();
    const ok = await UI.desafio('🔗 ' + c.nome, Object.assign({ x: 'Cadeia: ' + c.conexao.cadeia }, c.conexao));
    if (!ok) return;
    estado.cartas[id] = Math.max(estado.cartas[id] || 0, 3); salvar();
    UI.toast('🔗 ' + c.nome + ': Conectado!' + (c.eco && estado.ecos.includes(id) ? ' Seu Eco evoluiu para ' + c.eco.evo + ' ⭐' : ''), 3500);
  }
  const acoesCarta = { conectar, voltar: () => UI.codex(estado, (id) => UI.carta(estado, id, acoesCarta)) };

  async function falar(n) {
    const feita = (n.id === 'flor' && estado.obras.horta) || (n.id === 'rio' && estado.obras.filtro) || (n.id === 'tico' && estado.missoes['medo-da-vila']) || (n.id === 'ipe' && estado.chefe);
    if (n.id === 'ipe' && estado.chefe && !estado.selo) { estado.selo = true; $('selo').hidden = false; salvar(); await UI.dialogo(n.emoji + ' ' + n.nome, n.falas.feita, ['🏅 Receber o Selo']); await UI.dialogo('Terra Codex', 'Fim do MVP do Capítulo 1. Obrigado por testar! Suas cartas e Ecos ficam salvos neste aparelho.', ['Continuar explorando']); return; }
    if (feita) { await UI.dialogo(n.emoji + ' ' + n.nome, n.falas.feita, ['Até mais']); return; }
    if (!estado.falou[n.id]) { estado.falou[n.id] = true; salvar(); await UI.dialogo(n.emoji + ' ' + n.nome, n.falas.inicio, ['E aí?']); }
    await UI.dialogo(n.emoji + ' ' + n.nome, n.falas.pista || n.falas.inicio, ['Vou ver']);
  }

  /* ---------- obras ---------- */
  async function construir(ob) {
    const ex = ob.exige, quem = ob.emoji + ' ' + ob.nome;
    if (ex.cartas) { const falta = ex.cartas.filter(([id, n]) => (estado.cartas[id] || 0) < n); if (falta.length) { await UI.dialogo(quem, ob.texto + ' Ainda falta: ' + falta.map(([id, n]) => CARTA(id).nome + ' em "' + NIVEIS[n] + '"').join(', ') + '.', ['Vou buscar']); return; } }
    if (ex.entendidas && Object.values(estado.cartas).filter((n) => n >= 2).length < ex.entendidas) { await UI.dialogo(quem, ob.texto + ' O laboratório precisa de ' + ex.entendidas + ' cartas em "Entendido". Você tem ' + Object.values(estado.cartas).filter((n) => n >= 2).length + '.', ['Vou estudar']); return; }
    if (ex.pegadas && Object.keys(estado.pegadas).length < ex.pegadas) { await UI.dialogo(quem, ob.texto + ' Encontre os ' + ex.pegadas + ' sinais de animais por aqui primeiro (' + Object.keys(estado.pegadas).length + '/' + ex.pegadas + ').', ['Procurar']); return; }
    if (ob.id === 'filtro') {
      if (!estado.falou.rio) { await UI.dialogo(quem, 'Fale com Seu Rio antes: ele sabe o que jogaram na água.', ['Ok']); return; }
      const rodadas = [{ p: 'O que NÃO devia estar no rio?', o: ['Saco plástico', 'Folha caída', 'Peixe'], c: 0 }, { p: 'E agora, o que polui?', o: ['Pedra', 'Óleo de carro', 'Galho'], c: 1 }, { p: 'Última: o que faz mal à água?', o: ['Pneu velho', 'Areia', 'Sapo'], c: 0 }];
      for (const r of rodadas) { const i = await UI.dialogo('💧 Separar resíduos', r.p, r.o); if (i !== r.c) { await UI.dialogo('💧', 'Hum, isso faz parte do rio. Olhe de novo.', ['Tentar de novo']); return; } }
    }
    if (ob.id === 'ponte') {
      if (!estado.obras.filtro) { await UI.dialogo(quem, 'A água ainda está suja para trabalhar nela. Construa o filtro primeiro.', ['Ok']); return; }
      const i = await UI.dialogo('🌉 Medir o rio', 'Cada passo seu tem 1 metro. Você contou 14 passos de uma margem à outra, mais 2 de apoio de cada lado. Que comprimento a ponte precisa ter?', ['14 metros', '18 metros', '16 metros']);
      if (i !== 1) { await UI.dialogo('🌉', '14 de rio + 2 + 2 de apoio = 18 metros. Uma ponte curta cai na água.', ['Refazer a conta']); return; }
      const j = await UI.dialogo('🌉 Material', 'Qual madeira aguenta mais peso sem apodrecer na umidade?', ['Galhos finos e verdes', 'Troncos secos e grossos', 'Papelão']);
      if (j !== 1) { await UI.dialogo('🌉', 'Galho verde verga e papelão derrete. Tronco seco e grosso aguenta.', ['Escolher de novo']); return; }
    }
    if (ob.id === 'horta') { const i = await UI.dialogo(quem, 'A terra está fofa (minhoca) e as abelhas voltaram. O que plantar primeiro para ter flor e fruto?', ['Só grama', 'Tomate, abóbora e flores para as abelhas', 'Cimento']); if (i !== 1) { await UI.dialogo(quem, 'Sem flor não tem abelha; sem abelha não tem fruto.', ['De novo']); return; } }
    estado.obras[ob.id] = true; Mundo.montarObra(ob.id);
    if (ob.restaura) Mundo.restaurar(ob.restaura);
    ob.aplica.forEach((id) => { if ((estado.cartas[id] || 0) >= 3) estado.cartas[id] = 4; });
    estado.fragmentos += 5; salvar();
    await UI.dialogo(quem, '🔨 Construído! ' + (ob.restaura ? 'A região ' + REGIOES.find((r) => r.id === ob.restaura).nome + ' ganha cor de novo.' : 'O caminho ficou mais curto e seguro.') + ' Cartas usadas aqui sobem para "Aplicado".', ['🎉']);
  }

  /* ---------- Ruidosos e chefe ---------- */
  let cooldown = 0;
  async function encontro(r) {
    if (!estado.ecos.length) { UI.toast('Você precisa de um Eco para enfrentar o Ruído!'); cooldown = 3; return; }
    const d = r.dado;
    const venceu = await UI.batalha(estado, { id: r.id, nome: d.nome, emoji: d.emoji, erro: d.erro, hp: d.hp, atk: d.atk });
    if (venceu) { r.dormindo = 90; estado.fragmentos += 3; salvar(); UI.toast('+3 fragmentos de Codex (' + estado.fragmentos + ')'); }
    else { jog.mesh.position.set(0, 0, 8); clareza = 100; }
    cooldown = 4;
  }
  async function chefe() {
    const prontos = estado.ecos.length >= 3, rede = estado.missoes['rede-viva'];
    if (!prontos || !rede) { await UI.dialogo('👁️‍🗨️ Devorador', 'O olho roxo pulsa. Você sente que ainda não é hora: ' + (!prontos ? 'traga 3 Ecos. ' : '') + (!rede ? 'complete a Rede Viva (5 cartas Conectadas).' : ''), ['Voltar depois']); return; }
    const venceu = await UI.batalha(estado, { id: 'devorador', nome: DEVORADOR.nome, emoji: DEVORADOR.emoji, erro: '"Destruir é mais rápido do que entender."', hp: DEVORADOR.hp, atk: DEVORADOR.atk, intro: 'O Devorador de Habitat se ergue da toca! Cada conexão certa rasga o Ruído.' }, { fases: DEVORADOR.fases });
    if (venceu) { estado.chefe = true; Mundo.restaurar('toca'); Mundo.restaurar('margem'); estado.fragmentos += 20; salvar(); await UI.dialogo('🌿 O Vale Vivo', 'O Ruído se desfaz. O vale inteiro ganha cor. A Guardiã Ipê espera por você na vila.', ['Voltar à vila']); }
    else { jog.mesh.position.set(0, 0, 8); clareza = 100; }
    cooldown = 4;
  }

  /* ---------- missões e Clareza ---------- */
  function checarMissoes() {
    MISSOES.forEach((m) => { if (!estado.missoes[m.id] && m.feita(estado)) { estado.missoes[m.id] = true; salvar(); UI.toast('🧭 Missão concluída: ' + m.nome + '!', 3500); if (m.id === 'codex-quebrado') { estado.lupa = true; } } });
  }
  let clareza = 100;
  function atualizarClareza(dt) {
    const p = jog.mesh.position, nivel = Mundo.ruidoEm(p.x, p.z, estado);
    const naAgua = Math.abs(p.x - RIO_X - Math.sin(p.z * 0.04) * 5) < RIO_LARGURA && !(estado.obras.ponte && Math.abs(p.z - 20) < 4);
    const bonus = 1 + estado.ecos.length * 0.25;
    if (naAgua && !estado.obras.filtro) clareza -= dt * 12;
    else if (nivel === 2) clareza -= dt * 3.5 / bonus;
    else if (nivel === 1) clareza -= dt * 1.2 / bonus;
    else clareza = Math.min(100, clareza + dt * (nivel === 0 && Math.hypot(p.x, p.z) < 45 ? 14 : 4));
    clareza = Math.max(0, clareza);
    $('clareza-bar').style.width = clareza + '%';
    if (clareza <= 0) { jog.mesh.position.set(0, 0, 8); clareza = 60; UI.toast('O Ruído confundiu você. De volta à vila. Com mais Ecos e cartas, a Clareza dura mais.', 4000); }
    UI.dica(naAgua && !estado.obras.filtro ? '💧 Água suja: a Clareza cai rápido. Construa o filtro ou use a ponte.' : nivel === 2 ? '🌫️ Ruído forte: fique atento à Clareza.' : null);
  }

  // avisa o nome da região ao entrar nela
  let regiaoAtual = null;
  function avisarRegiao() {
    const p = jog.mesh.position, r = Mundo.regiaoEm(p.x, p.z), id = r ? r.id : null;
    if (id !== regiaoAtual) { regiaoAtual = id; if (r && !UI.aberto()) UI.toast('📍 ' + r.nome + (estado.restaurada[r.id] ? ' · restaurada 🌿' : r.ruido === 2 ? ' · Ruído forte 🌫️' : r.ruido === 1 ? ' · Ruído médio' : ''), 2200); }
  }

  /* ---------- botões do HUD ---------- */
  $('bt-codex').addEventListener('click', () => UI.codex(estado, (id) => UI.carta(estado, id, acoesCarta)));
  $('bt-ecos').addEventListener('click', () => UI.ecos(estado));
  $('bt-missoes').addEventListener('click', () => UI.missoes(estado));
  if (estado.selo) $('selo').hidden = false;

  /* ---------- laço ---------- */
  let last = performance.now(), acc = 0;
  renderer.setAnimationLoop(() => {
    const now = performance.now(), dt = Math.min(0.1, (now - last) / 1000); last = now;
    if (!document.body.classList.contains('jogando')) { renderer.render(scene, camera); return; }
    Jogador.update(dt, Mundo.altura, livre);
    Mundo.update(dt, jog.mesh.position);
    $('hora').textContent = mundo.hora + (mundo.chuva ? '🌧️' : '');
    if (!UI.aberto()) { atualizarClareza(dt); cooldown -= dt; }
    acc += dt; if (acc > 0.2) { acc = 0; procurarPerto(); checarMissoes(); avisarRegiao(); }
    // Ruidoso encosta: batalha
    if (cooldown <= 0 && !UI.aberto()) { const p = jog.mesh.position; const r = mundo.ruidosos.find((x) => x.mesh.visible && Math.hypot(p.x - x.pos.x, p.z - x.pos.z) < 3.5); if (r) { cooldown = 99; encontro(r); } }
    // etiquetas
    const p = jog.mesh.position, lista = [];
    mundo.bichos.forEach((b) => { if (b.mesh.visible && Math.hypot(p.x - b.pos.x, p.z - b.pos.z) < 40) { const n = estado.cartas[b.carta.id] || 0; lista.push({ pos: b.pos, texto: (n ? b.carta.emoji + ' ' + b.carta.nome : '❔ ???'), alt: 2.6 }); } });
    mundo.npcs.forEach((n) => { if (Math.hypot(p.x - n.pos.x, p.z - n.pos.z) < 60) lista.push({ pos: n.pos, texto: n.dado.emoji + ' ' + n.dado.nome, classe: 'npc', alt: 4.2 }); });
    mundo.ruidosos.forEach((r) => { if (r.mesh.visible && Math.hypot(p.x - r.pos.x, p.z - r.pos.z) < 50) lista.push({ pos: r.pos, texto: r.dado.emoji + ' ' + r.dado.nome, classe: 'ruido', alt: 5 }); });
    Object.values(mundo.obras).forEach((ob) => { if (!ob.pronta && Math.hypot(p.x - ob.pos.x, p.z - ob.pos.z) < 70) lista.push({ pos: ob.pos, texto: ob.dado.emoji + ' ' + ob.dado.nome, classe: 'obra', alt: 3 }); });
    if (!estado.chefe && Math.hypot(p.x - 150, p.z + 130) < 120) lista.push({ pos: new V3(150, Mundo.altura(150, -130), -130), texto: '👁️‍🗨️ Toca do Devorador', classe: 'ruido', alt: 14 });
    UI.etiquetas(camera, lista);
    renderer.render(scene, camera);
  });
  addEventListener('beforeunload', salvar);
  inicio();
})();
