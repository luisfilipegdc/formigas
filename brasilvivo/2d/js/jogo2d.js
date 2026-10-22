/* =====================================================================
   Terra Codex · Brasil Vivo 2D · laço principal (versão em pixel art)
   As mesmas regras do 3D (js/jogo.js): ações de contexto, Viveiro de
   arrastar, ativar no mundo, jornada, escada de ajuda. Muda só o que se vê:
   mundo de cima ilustrado (mundo2d.js e arte.js), câmera que segue e, no clímax,
   desliza até o centro da área restaurada. O save é o mesmo do 3D.
   ===================================================================== */
(function () {
  const $ = (id) => document.getElementById(id);
  const BIOMA = 'cerrado';
  const erros = Registro.validar();
  const E = Estado.dados;
  const salvar = () => Estado.salvar(jog.pos);

  /* ---------- tela: resolução real do aparelho, desenho suave ---------- */
  const canvas = $('tela'), g = canvas.getContext('2d');
  let W = 0, H = 0, ESC = 2;
  function medir() {
    ESC = Math.max(2, Math.round(Math.min(innerWidth, innerHeight) / 200));
    W = innerWidth / ESC; H = innerHeight / ESC;
    const dpr = Math.min(devicePixelRatio || 1, 2.5);
    canvas.width = Math.round(innerWidth * dpr); canvas.height = Math.round(innerHeight * dpr); canvas.style.width = innerWidth + 'px'; canvas.style.height = innerHeight + 'px';
  }
  // cada quadro desenha em unidades do mundo (1/5 m); a escala leva para os pixels reais
  const prepararTela = () => { g.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high'; };
  medir(); addEventListener('resize', medir);
  const mundo = Mundo.construir(BIOMA);
  const jog = Jogador.criar(new V3(E.pos[0], 0, E.pos[2]));
  const cam = mundo.cam;
  function seguir(x, z, k) {
    const tx = Mundo.px(x) - W / 2, ty = Mundo.pz(z) - H / 2;
    cam.fx = cam.fx === undefined ? tx : cam.fx + (tx - cam.fx) * k; cam.fy = cam.fy === undefined ? ty : cam.fy + (ty - cam.fy) * k;
    const max = Mundo.TAM * Mundo.PPM; cam.fx = Math.max(0, Math.min(max - W, cam.fx)); cam.fy = Math.max(0, Math.min(max - H, cam.fy));
    cam.x = cam.fx; cam.y = cam.fy;
  }
  seguir(E.pos[0], E.pos[2], 1);
  E.ninho.forEach((n) => { const c = Registro.ciclo(n.ciclo); if (!c.passos.some((p) => p.de === n.fase)) Mundo.companheiro(c.especie); });
  // relações já religadas: os bichos soltos continuam morando lá
  Object.keys(E.relacoes).forEach((id) => { const r = Registro.relacao(id); if (r && r.ativar && E.relacoes[id] === 'ativada') Mundo.povoar(r, r.ativar.ponto ? new V3(r.ativar.ponto[0], Mundo.altura(r.ativar.ponto[0], r.ativar.ponto[1]) + 1.6, r.ativar.ponto[1]) : null); });
  const RECURSOS = Registro.R.biomas[BIOMA].recursos, BOLSA_MAX = Registro.R.biomas[BIOMA].bolsaMax || 5;
  const abrirViveiro = (msg) => UI.viveiro(BIOMA, dar, rever, msg);
  const viveiroAberto = () => !$('painel').hidden && $('painel-titulo').textContent.startsWith('🌱');

  function livre(x, z) {
    if (Math.abs(x - Mundo.RIO_X - Math.sin(z * 0.04) * 5) < Mundo.RIO_LARGURA - 2) return false;   // água funda
    for (const [ax, az, r] of mundo.arvPos) if (Math.hypot(x - ax, z - az) < r) return false;
    return true;
  }

  // cada marco novo da BioDex é celebrado (recompensa ligada ao que a criança fez, nunca ao acaso)
  Estado.on('marco', ({ especie, marco }) => UI.celebrar(especie, marco));
  E.dicas = E.dicas || {};

  /* ---------- início ---------- */
  // o áudio só pode ligar depois de um toque (navegador e iOS)
  const ligarSom = () => { Som.iniciar(); removeEventListener('pointerdown', ligarSom); };
  addEventListener('pointerdown', ligarSom);
  Ajustes.aplicar();
  function inicio() {
    $('inicio-ajustes').addEventListener('click', () => UI.ajustes());
    if (E.comecou) { comecar(); return; }
    $('inicio-bt').addEventListener('click', async () => {
      Som.iniciar(); Som.tocar('passo');
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
    if (voltando) { const mud = conferirNinho(true); if (mud.length) setTimeout(() => UI.dialogo('🌱 Enquanto você esteve fora', mud.join(' '), ['Ver no Viveiro', 'Continuar']).then((i) => { if (i === 0) abrirViveiro(); }), 500); }
  }

  /* ---------- o que está perto ---------- */
  let perto = null;
  function procurarPerto() {
    const p = jog.pos, raio = 6.5;
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
      cand('marca', m, m.pos, achou ? m.fase.emoji + ' ' + m.fase.nome : '🔍 Algo pequeno', achou ? 'Levar ao Viveiro 🤲' : 'Examinar 🔍', 5.5, 1);
    });
    mundo.npcs.forEach((n) => cand('npc', n, n.pos, n.dado.emoji + ' ' + n.dado.nome, 'Falar 💬'));
    if (mundo.placaJardim) cand('jardim', mundo.placaJardim, mundo.placaJardim.pos, '🌸 ' + mundo.placaJardim.area.nome, 'Olhar 👀', 7);
    mundo.fontes.forEach((f) => { const r = RECURSOS[f.dado.recurso]; cand('fonte', f, f.pos, r.emoji + ' ' + f.dado.nome, f.cheia ? f.dado.verbo + ' ' + r.emoji : 'Ver 👀', 5); });
    mundo.caixas.forEach((c) => { if (E.relacoes[c.rel.id] === 'ativada') return; const pode = E.relacoes[c.rel.id] === c.rel.ativar.requer; cand('caixa', c, c.pos, '📦 ' + c.rel.ativar.objeto, pode ? c.rel.ativar.verbo + ' ' + Registro.especie(c.rel.ativar.especie).emoji : 'Examinar 🔍', 6, pode ? 2 : 1); });
    // companheiro no lugar certo: soltar ganha de tudo (é o grande momento)
    const aqui = Mundo.areaEm(p.x, p.z);
    mundo.companheiros.forEach((c) => { const r = soltarDe(c.id); if (r && aqui && aqui.id === r.ativar.onde) cand('soltar', r, c.pos, c.texto, r.ativar.verbo + ' ' + Registro.especie(c.id).emoji, 99, 50); });
    perto = melhor;
    const a = $('acao'); a.hidden = !melhor || UI.aberto();
    if (melhor) { const pt = melhor.acao.split(' '), ico = pt.pop(); $('acao-nome').textContent = melhor.nome; $('acao-ico').textContent = ico; $('acao-txt').textContent = pt.join(' '); }
  }
  $('acao-bt').addEventListener('click', agir);
  addEventListener('keydown', (e) => { if ((e.key === 'e' || e.key === 'E' || e.key === ' ') && perto && !UI.aberto()) agir(); });

  async function agir() {
    if (!perto || UI.aberto()) return;
    const { tipo, obj } = perto;
    if (tipo !== 'soltar') Som.tocar(tipo === 'npc' ? 'falar' : tipo === 'marca' ? 'examinar' : tipo === 'bicho' ? 'observar' : 'toque');
    if (tipo === 'soltar') await ativar(obj);
    if (tipo === 'caixa') { if (E.relacoes[obj.rel.id] === obj.rel.ativar.requer) await ativar(obj.rel); else await UI.dialogo('📦 ' + obj.rel.ativar.objeto, obj.rel.ativar.vazio, ['Vou descobrir']); }
    if (tipo === 'fonte') colher(obj);
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
  // examinar uma marca → registra a fase (Encontrado quando é a segunda) · fases pequenas podem ir ao Viveiro
  async function examinar(m) {
    const e = m.especie, f = m.fase, chave = e.id + ':' + f.id;
    if (!E.achados[chave]) {
      E.achados[chave] = true; Biodex.viu(e.id, f.id);
      const ops = f.ninho ? ['Levar ao Viveiro 🤲', 'Deixar aqui'] : ['Anotar na BioDex'];
      const i = await UI.dialogo(f.emoji + ' ' + f.nome + ' · ' + e.nome, f.achado, ops);
      if (f.ninho && i === 0) await levarAoNinho(e, f);
      return;
    }
    if (f.ninho) await levarAoNinho(e, f);
  }
  async function levarAoNinho(e, f) {
    if (E.ninho.length >= 3) { await UI.dialogo('🌱 Viveiro', 'Seu Viveiro já tem 3 seres vivos. Acompanhe a transformação deles antes de trazer outro.', ['Ok']); return; }
    E.ninho.push({ ciclo: e.ciclo, fase: f.id, desde: null, dado: [] }); salvar(); Som.tocar('ninho');
    const passo = Registro.ciclo(e.ciclo).passos.find((p) => p.de === f.id);
    UI.toast(f.emoji + ' ' + f.nome + ' no Viveiro! Precisa de: ' + passo.precisa.map((r) => RECURSOS[r].emoji + ' ' + RECURSOS[r].curto.toLowerCase()).join(' e ') + '.', 4200);
  }

  /* ---------- colher: a fonte dá um pouco e rebrota (nunca tudo de uma vez) ---------- */
  function colher(fo) {
    const id = fo.dado.recurso, r = RECURSOS[id], tem = E.bolsa[id] || 0;
    if (!fo.cheia) { UI.toast('⏳ ' + fo.dado.nome + ' está rebrotando. Volte daqui a pouco.', 2600); return; }
    if (tem >= BOLSA_MAX) { UI.toast(r.emoji + ' Sua bolsa já tem ' + tem + '. Deixe o resto para a natureza.', 3000); return; }
    const n = Math.min(fo.dado.da || 1, BOLSA_MAX - tem);
    E.bolsa[id] = tem + n; E.colheu[id] = true; Mundo.colher(fo); salvar(); Som.tocar('cuidar');
    UI.toast(r.emoji + ' +' + n + ' ' + r.curto.toLowerCase() + ' na bolsa (' + E.bolsa[id] + ')' + (E.ninho.length ? ' · leve ao Viveiro' : ''), 3000);
  }

  async function falar(n) {
    const primeira = !E.falou[n.id];
    E.falou[n.id] = true; salvar();
    if (primeira) await UI.dialogo(n.emoji + ' ' + n.nome, n.falas.inicio, ['E aí?']);
    await UI.dialogo(n.emoji + ' ' + n.nome, n.falas.pista || n.falas.inicio, ['Vou ver']);
  }
  async function olharJardim(a) {
    const k = Math.round(Ruido.clareza(a.id) * 100);
    const faltam = a.relacoes.map(Registro.relacao).filter((r) => E.relacoes[r.id] !== 'ativada');
    const temAqui = faltam.find((r) => mundo.companheiros.some((c) => c.id === r.de));
    const texto = k >= 100 ? 'O jardim está vivo de novo: flor aberta, borboleta e jataí levando pólen. Clareza: 100%.'
      : a.texto.split('.')[0] + '. Clareza do jardim: ' + k + '%. ' + (temAqui ? 'Sua ' + Registro.especie(temAqui.de).nome.toLowerCase() + ' está agitada: chegue perto das flores e toque em ' + temAqui.ativar.verbo + '.' : 'Ainda falta: ' + faltam.map((r) => Registro.especie(r.de).emoji).join(' ') + '.');
    await UI.dialogo('🌸 ' + a.nome, texto, [k >= 100 ? 'Que lindo!' : temAqui ? 'Combinado!' : 'Vou descobrir quem falta']);
  }

  /* ---------- Ativar no mundo: soltar o bicho do Viveiro ou reativar um lugar ---------- */
  const soltarDe = (especieId) => Registro.relacoesDe(especieId).find((r) => r.ativar && r.ativar.tipo === 'soltar' && E.relacoes[r.id] !== 'ativada');
  let cine = null;   // câmera do clímax: afasta, mostra o antes/depois e volta
  async function ativar(r) {
    const area = Registro.area(r.ativar.onde), e = Registro.especie(r.ativar.especie), antes = Ruido.clareza(area.id);
    let inicio = null;
    if (r.ativar.tipo === 'soltar') {
      inicio = Mundo.dispensar(e.id);
      const i = E.ninho.findIndex((n) => { const c = Registro.ciclo(n.ciclo); return c.especie === e.id && !c.passos.some((p) => p.de === n.fase); });
      if (i >= 0) E.ninho.splice(i, 1);   // libera a vaga do Viveiro
    } else if (r.ativar.ponto) inicio = new V3(r.ativar.ponto[0], Mundo.altura(r.ativar.ponto[0], r.ativar.ponto[1]) + 1.6, r.ativar.ponto[1]);
    Biodex.relacao(r.id, 'ativada'); salvar();
    Mundo.povoar(r, inicio); Mundo.onda(area.id); Som.tocar('ativar');
    const J = Jogador.J;
    // Menos movimento: a câmera fica no jogador (a onda e o som continuam)
    cine = { t: 0, dur: 7, x: area.x, z: area.z, calmo: Ajustes.calmo() };
    J.bloqueado = true;
    await espera(3800);
    const depois = Ruido.clareza(area.id);
    (area.efeitos || []).forEach((ef) => { if (antes < ef.em && depois >= ef.em && ef.texto) UI.toast(ef.texto, 4200); });
    await UI.dialogo(e.emoji + ' ' + e.nome, r.ativar.texto + ' Clareza: ' + Math.round(antes * 100) + '% → ' + Math.round(depois * 100) + '%.', ['Que lindo!']);
    for (const ef of area.efeitos || []) if (ef.fala && antes < ef.em && depois >= ef.em) { const n = Registro.R.npcs[ef.fala.npc]; await UI.dialogo(n.emoji + ' ' + n.nome, ef.fala.texto, ['Vamos lá!']); }
  }
  const espera = (ms) => new Promise((r) => setTimeout(r, ms));
  // peso da câmera no centro da área (0 = no jogador, 1 = na área)
  function camera3(dt) {
    if (!cine) return 0;
    cine.t += dt;
    const ida = Math.min(1, cine.t / 1.4), volta = Math.max(0, Math.min(1, (cine.t - cine.dur + 1.6) / 1.6)), k = ida * (1 - volta);
    if (cine.t >= cine.dur) { cine = null; if (!UI.aberto()) Jogador.J.bloqueado = false; return 0; }
    return cine.calmo ? 0 : k * k * (3 - 2 * k);
  }

  /* ---------- Viveiro: arrastar (ou tocar) o que o ser vivo precisa; o tempo real faz o resto ---------- */
  // errar nunca gasta nada: o item volta para a bolsa e o Viveiro diz o que ajuda
  function dar(i, rec) {
    const n = E.ninho[i]; if (!n || n.desde) return;
    const c = Registro.ciclo(n.ciclo), passo = c.passos.find((p) => p.de === n.fase); if (!passo) return;
    const e = Registro.especie(c.especie), f = e.fases.find((x) => x.id === n.fase), r = RECURSOS[rec];
    n.dado = n.dado || [];
    const lista = (ids) => ids.map((x) => RECURSOS[x].emoji + ' ' + RECURSOS[x].curto.toLowerCase()).join(' e ');
    const falta = () => passo.precisa.filter((x) => !n.dado.includes(x));
    if (!passo.precisa.includes(rec)) { Som.tocar('toque'); abrirViveiro({ i, tipo: 'erro', texto: r.emoji + ' ' + r.curto + ' não ajuda agora. ' + f.nome + ' precisa de ' + lista(falta()) + '.' }); return; }
    if (n.dado.includes(rec)) { abrirViveiro({ i, tipo: 'info', texto: r.emoji + ' Já tem ' + r.curto.toLowerCase() + '. Falta ' + lista(falta()) + '.' }); return; }
    if (!r.ferramenta) {
      if (!(E.bolsa[rec] > 0)) { abrirViveiro({ i, tipo: 'info', texto: r.emoji + ' Sua bolsa está sem ' + r.curto.toLowerCase() + '. ' + (r.onde || '') }); return; }
      E.bolsa[rec]--;
    }
    n.dado.push(rec);
    if (!falta().length) {
      n.desde = Date.now(); n.dado = []; Biodex.cuidou(c.especie); salvar(); Som.tocar('cuidar');
      abrirViveiro({ i, tipo: 'ok', texto: '🤲 Tudo pronto! Agora é com o tempo. ' + passo.sinal });
      return;
    }
    salvar(); Som.tocar('ninho');
    abrirViveiro({ i, tipo: 'ok', texto: r.emoji + ' Isso! Agora falta ' + lista(falta()) + '.' });
  }
  // replay: a criança vê a transformação que aconteceu enquanto estava longe (ou de novo, quando quiser)
  function rever(i) {
    const n = E.ninho[i]; if (!n || !n.novo) return;
    const c = Registro.ciclo(n.ciclo), e = Registro.especie(c.especie), { de, para } = n.novo;
    UI.fecharPainel(); delete n.novo; salvar(); seloNinho();
    UI.transformacao(e, de, para, () => abrirViveiro());
  }
  // confere as transformações (também conta o tempo com o jogo fechado)
  function conferirNinho(silencioso) {
    const agora = Date.now(), mudancas = [];
    E.ninho.forEach((n) => {
      if (!n.desde) return;
      const c = Registro.ciclo(n.ciclo), passo = c.passos.find((p) => p.de === n.fase);
      if (!passo || agora < n.desde + passo.minutos * 60000) return;
      n.fase = passo.para; n.desde = null; n.dado = [];
      const e = Registro.especie(c.especie), f = e.fases.find((x) => x.id === passo.para);
      n.novo = { de: passo.de, para: passo.para };   // guarda o momento para o replay
      Biodex.transformou(e.id, passo.para);
      const fim = !c.passos.some((p) => p.de === n.fase);
      if (fim) Mundo.companheiro(e.id);
      const de = e.fases.find((x) => x.id === passo.de).nome.toLowerCase();
      const onde = fim && c.ativar ? ' Leve até ' + Registro.area(c.ativar.onde).nome + '.' : '';
      const frase = f.emoji + ' ' + (fim ? e.nome + ' completou o ciclo e agora acompanha você!' + onde : 'Mudou! ' + e.nome + ' passou de ' + de + ' para ' + f.nome.toLowerCase() + '.');
      mudancas.push(frase);
      if (!silencioso) { UI.toast(frase, 4000); Som.tocar('transformar'); }
      salvar();
      if (viveiroAberto()) abrirViveiro();
    });
    return mudancas;
  }

  /* ---------- HUD ---------- */
  function abrirBiodex() { UI.biodex(BIOMA, abrirFicha); }
  function abrirFicha(id) { UI.ficha(id, abrirBiodex); }
  $('bt-codex').addEventListener('click', abrirBiodex);
  $('bt-ninho').addEventListener('click', () => abrirViveiro());
  $('bt-mapa').addEventListener('click', () => UI.mapa());
  $('bt-ajustes').addEventListener('click', () => UI.ajustes(atualizarObjetivo));
  // resposta imediata ao toque (antes de qualquer diálogo abrir)
  $('acao-bt').addEventListener('pointerdown', () => $('acao-bt').classList.add('apertado'));
  addEventListener('pointerup', () => $('acao-bt').classList.remove('apertado'));

  // área atual e Clareza dela
  let areaAtual, clarezaAqui = 1;
  function atualizarArea() {
    const p = jog.pos, a = Mundo.areaEm(p.x, p.z), id = a ? a.id : null;
    const k = a ? Ruido.clareza(a.id) : 1;
    $('area-nome').textContent = a ? a.nome : 'Cerrado aberto';
    $('clareza-bar').style.width = Math.round(k * 100) + '%';
    $('clareza-bar').classList.toggle('ruido', k < 0.5);
    if (id !== areaAtual) {
      areaAtual = id;
      if (a && k < 0.5 && !UI.aberto()) UI.toast('🌫️ ' + a.nome + ' está tomada pelo Ruído', 2600);
      else if (Ajustes.valores.legendas && Som.ligado && !UI.aberto()) UI.toast(Som.descrever({ clareza: k, noite: mundo.noite }), 2600);
    }
    clarezaAqui = k;
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
    if (passoAtual !== null && j.i !== passoAtual && passoAtual >= 0) { UI.toast('✅ Passo concluído: ' + JORNADA.passos[passoAtual].texto, 3200); Som.tocar('passo'); }
    if (j.i !== passoAtual) { semProgresso = 0; melhorDist = Infinity; pedido = false; }
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
    if (a.fonte) { const f = mundo.fontes.find((x) => x.dado.id === a.fonte); return f && f.pos; }
    if (a.caixa) {
      const c = mundo.caixas.find((x) => x.rel.id === a.caixa); if (!c) return null;
      // sem a relação descoberta, a seta leva primeiro até quem faz (a jataí na horta)
      if (E.relacoes[a.caixa] !== c.rel.ativar.requer && c.rel.prova && c.rel.prova.area) { const ar = Registro.area(c.rel.prova.area); return new V3(ar.x, Mundo.altura(ar.x, ar.z), ar.z); }
      return c.pos;
    }
    return null;
  }
  $('objetivo').addEventListener('click', () => { const j = jornada(); if (j) UI.jornada(JORNADA, j.i, E, () => abrirViveiro(), () => { pedido = true; }); });
  // escada de ajuda: marco no cenário → a criança pede ou fica ~20 s sem se aproximar → seta e farol
  let semProgresso = 0, melhorDist = Infinity, pedido = false, ultT = 0;
  // farol: no 2D, um círculo dourado pulsando no chão e uma seta que pula sobre o alvo
  let farol = null;
  function guiar(t) {
    const alvo = alvoDoPasso(), g = $('guia'), p = jog.pos, dt = Math.min(0.2, t - ultT); ultT = t;
    if (!alvo || UI.aberto()) { farol = null; g.hidden = true; return; }
    const d = Math.hypot(alvo.x - p.x, alvo.z - p.z);
    if (d < melhorDist - 4) { melhorDist = d; semProgresso = 0; } else semProgresso += dt;
    const modo = Ajustes.valores.ajuda;
    const mostrar = modo === 'sempre' || (modo === 'precisar' && (pedido || semProgresso > 20));
    if (!mostrar) { farol = null; g.hidden = true; return; }
    farol = d > 4 ? alvo : null;
    const q = Mundo.naTela(alvo, 2), dentro = q.x > W * 0.08 && q.x < W * 0.92 && q.y > H * 0.12 && q.y < H * 0.88;
    if (dentro || d < 8) { g.hidden = true; return; }
    // fora da tela: seta na borda apontando para o alvo
    let x = (q.x / W) * 2 - 1, y = 1 - (q.y / H) * 2;
    const ang = Math.atan2(-y, x), m = Math.max(Math.abs(x) / 0.82, Math.abs(y) / 0.62, 0.001);
    x /= m; y /= m;
    g.hidden = false; g.style.left = ((x + 1) / 2 * innerWidth) + 'px'; g.style.top = ((1 - y) / 2 * innerHeight) + 'px';
    $('guia-seta').style.transform = 'rotate(' + ang + 'rad)'; $('guia-dist').textContent = Math.round(d) + ' m';
  }
  // selo do Viveiro: só aparece quando dá para fazer algo agora (convite, nunca cobrança)
  function seloNinho() {
    const prontos = E.ninho.filter((n) => {
      if (n.novo) return true;
      const passo = !n.desde && Registro.ciclo(n.ciclo).passos.find((p) => p.de === n.fase);
      return passo && passo.precisa.every((x) => (n.dado || []).includes(x) || RECURSOS[x].ferramenta || E.bolsa[x] > 0);
    }).length;
    $('selo-ninho').hidden = !prontos; $('selo-ninho').textContent = '✨';
    $('bt-ninho').setAttribute('aria-label', prontos ? 'Viveiro: tem novidade' : 'Viveiro');
  }
  // primeira vez que o botão de ação aparece: dica curta, uma vez só
  function dicaPrimeiraAcao() {
    if (E.dicas.acao || $('acao').hidden) return;
    E.dicas.acao = true; salvar(); dicaFixa = true;
    UI.dica('👉 Toque no botão dourado para ' + $('acao-txt').textContent.toLowerCase() + '.');
    setTimeout(() => { dicaFixa = false; UI.dica(null); }, 4500);
  }

  window.__terra = {
    estado: E, mundo, jog, salvar, get cam() { return cam; }, erros, Biodex, Registro, Ruido, jornada, dar, ativar, get cine() { return cine; },
    // testes: adianta o relógio do Viveiro em N minutos
    acelerar(min) { E.ninho.forEach((n) => { if (n.desde) n.desde -= min * 60000; }); conferirNinho(); }
  };

  function desenharFarol(t) {
    if (!farol) return;
    const q = Mundo.naTela(farol, 0), r = 10 + Math.sin(t * 4) * 2;
    g.save(); g.strokeStyle = 'rgba(255,216,74,.85)'; g.lineWidth = 1.6; g.beginPath(); g.ellipse(q.x, q.y, r, r * 0.5, 0, 0, 6.29); g.stroke();
    // seta dourada que pula sobre o alvo
    const y = q.y - 28 - Math.abs(Math.sin(t * 3)) * 6, x = q.x;
    g.beginPath(); g.moveTo(x - 3, y); g.lineTo(x + 3, y); g.lineTo(x + 3, y + 4); g.lineTo(x + 6, y + 4); g.lineTo(x, y + 10); g.lineTo(x - 6, y + 4); g.lineTo(x - 3, y + 4); g.closePath();
    g.fillStyle = '#ffd84a'; g.fill(); g.strokeStyle = '#2e2519'; g.lineWidth = 0.9; g.lineJoin = 'round'; g.stroke();
    g.restore();
  }
  // etiquetas em HTML sobre o canvas (texto nítido, emoji legível)
  const labels = $('etiquetas');
  function etiquetas(lista) {
    while (labels.children.length < lista.length) { const d = document.createElement('div'); d.className = 'etq'; labels.appendChild(d); }
    for (let i = 0; i < labels.children.length; i++) {
      const el = labels.children[i], it = lista[i];
      if (!it) { el.style.display = 'none'; continue; }
      const q = Mundo.naTela(it.pos, (it.pos.y || 0) + (it.alt || 3));
      if (q.x < -20 || q.y < -10 || q.x > W + 20 || q.y > H + 20) { el.style.display = 'none'; continue; }
      el.style.display = ''; el.textContent = it.texto; el.className = 'etq ' + (it.classe || '');
      el.style.transform = 'translate(' + Math.round(q.x * ESC) + 'px,' + Math.round(q.y * ESC) + 'px) translate(-50%,-100%)';
    }
  }

  /* ---------- laço ---------- */
  let last = performance.now(), acc = 0, accN = 0;
  function quadro() {
    requestAnimationFrame(quadro);
    const now = performance.now(), dt = Math.min(0.1, (now - last) / 1000); last = now;
    if (!document.body.classList.contains('jogando')) {
      // tela de início: a câmera passeia devagar sobre a Base
      const a = now / 1000 * 0.08; Mundo.update(dt, jog.pos);
      seguir(Math.sin(a) * 30, 8 + Math.cos(a) * 22, 1); prepararTela(); Mundo.desenhar(g, W, H, null); return;
    }
    const kc = camera3(dt);
    Jogador.update(dt, livre);
    Mundo.update(dt, jog.pos);
    seguir(jog.pos.x + ((cine ? cine.x : 0) - jog.pos.x) * kc, jog.pos.z + ((cine ? cine.z : 0) - jog.pos.z) * kc, Math.min(1, dt * (kc > 0 ? 4 : 8)));
    prepararTela(); Mundo.desenhar(g, W, H, jog);
    desenharFarol(now / 1000);
    $('hora').textContent = mundo.hora + (mundo.chuva ? '🌧️' : '');
    acc += dt; if (acc > 0.2) { acc = 0; procurarPerto(); atualizarArea(); atualizarObjetivo(); dicaPrimeiraAcao(); }
    accN += dt; if (accN > 1) { accN = 0; conferirNinho(); seloNinho(); if (viveiroAberto()) UI.ninhoAtualizar(); }
    guiar(now / 1000);
    // no clímax todas as camadas da música tocam juntas
    Som.atualizar(dt, { clareza: cine ? 1 : clarezaAqui, noite: mundo.noite, chuva: mundo.chuva });
    // etiquetas
    const p = jog.pos, lista = [];
    mundo.bichos.forEach((b) => { if (b.mesh.visible && Math.hypot(p.x - b.pos.x, p.z - b.pos.z) < 40) { const viu = Biodex.viuFase(b.especie.id, b.fase.id); lista.push({ pos: b.pos, texto: (viu ? b.especie.emoji + ' ' + b.especie.nome : '❔ ???') + (b.agindo > 0 && !E.relacoes[b.rel.id] ? ' ✨' : ''), classe: b.agindo > 0 ? 'acao' : '', alt: b.quadros[0].height / Mundo.PPM + 1.2 }); } });
    mundo.marcas.forEach((m) => { if (m.mesh.visible && Math.hypot(p.x - m.pos.x, p.z - m.pos.z) < 22 && !(E.achados[m.especie.id + ':' + m.fase.id] && !m.fase.ninho)) lista.push({ pos: m.pos, texto: E.achados[m.especie.id + ':' + m.fase.id] ? m.fase.emoji + ' ' + m.fase.nome : '🔍', alt: 2 }); });
    mundo.npcs.forEach((n) => { if (Math.hypot(p.x - n.pos.x, p.z - n.pos.z) < 60) lista.push({ pos: n.pos, texto: n.dado.emoji + ' ' + n.dado.nome, classe: 'npc', alt: 4.2 }); });
    const aqui = Mundo.areaEm(p.x, p.z);
    mundo.companheiros.forEach((c) => { const r = soltarDe(c.id), longe = r && !(aqui && aqui.id === r.ativar.onde); lista.push({ pos: c.pos, texto: c.texto + (longe ? ' → ' + Registro.area(r.ativar.onde).nome : ''), alt: 2.4 }); });
    mundo.fontes.forEach((f) => { if (f.cheia && Math.hypot(p.x - f.pos.x, p.z - f.pos.z) < 18) lista.push({ pos: f.pos, texto: RECURSOS[f.dado.recurso].emoji + ' ' + f.dado.nome, alt: f.y + 0.8 }); });
    mundo.caixas.forEach((c) => { if (E.relacoes[c.rel.id] !== 'ativada' && Math.hypot(p.x - c.pos.x, p.z - c.pos.z) < 24) lista.push({ pos: c.pos, texto: '📦 ' + c.rel.ativar.objeto, alt: 3.2 }); });
    if (mundo.placaJardim && Math.hypot(p.x - mundo.placaJardim.pos.x, p.z - mundo.placaJardim.pos.z) < 80) lista.push({ pos: mundo.placaJardim.pos, texto: '🌸 Jardim Polinizador · ' + Math.round(Ruido.clareza('jardim') * 100) + '%', classe: Ruido.clareza('jardim') < 0.5 ? 'ruido' : 'obra', alt: 3.4 });
    etiquetas(lista);
  }
  requestAnimationFrame(quadro);
  addEventListener('beforeunload', salvar);
  addEventListener('visibilitychange', () => { if (document.hidden) salvar(); });
  inicio();
})();
