/* =====================================================================
   Terra Codex · interface: toast, diálogo com opções (promessa), painéis
   (Codex, Ecos, Missões), batalha por turnos e etiquetas sobre o 3D.
   ===================================================================== */
const UI = (function () {
  const $ = (id) => document.getElementById(id);
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  let toastT = null;
  function toast(t, ms) { const el = $('toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('on'), ms || 2600); }
  function dica(t) { const el = $('dica'); el.hidden = !t; if (t) el.textContent = t; }

  // diálogo: resolve com o índice escolhido. opcoes = [{t, classe}] ou strings
  let aberto = false;
  function dialogo(quem, texto, opcoes) {
    return new Promise((res) => {
      aberto = true; Jogador.J.bloqueado = true;
      const d = $('dialogo'); d.hidden = false; $('dialogo-quem').textContent = quem; $('dialogo-texto').textContent = texto;
      const o = $('dialogo-opcoes'); o.innerHTML = '';
      (opcoes || ['Continuar']).forEach((op, i) => {
        const b = document.createElement('button'); b.type = 'button'; const txt = typeof op === 'string' ? op : op.t; b.textContent = txt; if (op.classe) b.className = op.classe;
        b.addEventListener('click', () => { d.hidden = true; aberto = false; Jogador.J.bloqueado = false; res(i); });
        o.appendChild(b);
      });
    });
  }
  // desafio de conhecimento: mostra certo e errado antes de seguir
  async function desafio(quem, q) {
    const i = await dialogo(quem, q.p, q.o);
    const certo = i === q.c;
    await dialogo(quem, certo ? '✅ Isso! ' + (q.x || '') : '🤔 Não é bem assim. ' + (q.x || '') + (q.o[q.c] ? ' A resposta era: "' + q.o[q.c] + '".' : ''), [certo ? 'Registrar no Codex' : 'Tentar de novo depois']);
    return certo;
  }

  // painéis
  function painel(titulo, html) { $('painel').hidden = false; $('painel-titulo').textContent = titulo; $('painel-corpo').innerHTML = html; Jogador.J.bloqueado = true; }
  function fecharPainel() { $('painel').hidden = true; Jogador.J.bloqueado = false; }
  $('painel-x').addEventListener('click', fecharPainel);

  function codex(estado, aoClicar) {
    const h = '<div class="cartas">' + CARTAS.map((c) => { const n = estado.cartas[c.id] || 0; return '<button type="button" class="carta n' + n + '" data-id="' + c.id + '"><div class="em">' + (n ? c.emoji : '❔') + '</div><b>' + (n ? esc(c.nome) : '???') + '</b><small>' + (n ? NIVEIS[n] : c.tipo) + '</small></button>'; }).join('') + '</div>';
    painel('📖 BioDex · ' + Object.keys(estado.cartas).length + '/' + CARTAS.length, h);
    $('painel-corpo').querySelectorAll('.carta').forEach((b) => b.addEventListener('click', () => aoClicar(b.dataset.id)));
  }
  function carta(estado, id, acoes) {
    const c = CARTA(id), n = estado.cartas[id] || 0;
    let h = '<div class="detalhe"><h3>' + c.emoji + ' ' + esc(c.nome) + ' <small>· ' + c.tipo + '</small></h3>';
    h += '<div class="niveis">' + [1, 2, 3, 4].map((k) => '<span class="' + (n >= k ? 'ok' : '') + '">' + k + '. ' + NIVEIS[k] + '</span>').join('') + '</div>';
    if (n >= 1) h += '<p><b>Onde:</b> ' + esc(REGIOES.find((r) => r.id === c.regiao).nome) + ' · ' + (c.hora === 'dia' ? '☀️ de dia' : c.hora === 'noite' ? '🌙 à noite' : '🌧️ depois da chuva') + '</p>';
    if (n >= 2) h += '<p><b>Função:</b> ' + esc(c.funcao) + '</p><p><b>Cuidado:</b> ' + esc(c.cuidado) + '</p>';
    if (n >= 3) h += '<p><b>Conexão:</b> ' + esc(c.conexao.cadeia) + '</p>';
    if (n === 1) h += '<p>Você viu este ser. Para entender, aceite o desafio perto dele.</p>';
    if (n >= 2 && n < 3) h += '<button type="button" class="btn" id="bt-conectar">🔗 Conectar</button> ';
    if (n >= 2) h += '<a class="btn sec" href="../explorar/bicho3d.html?id=' + (['abelha', 'formiga', 'aranha', 'lagartixa', 'cigarra', 'escorpiao'].includes(id) ? id : '') + '" target="_blank"' + (['abelha', 'formiga', 'aranha', 'lagartixa', 'cigarra', 'escorpiao'].includes(id) ? '' : ' hidden') + '>🧊 Ver em 3D</a>';
    h += '<p><button type="button" class="btn sec" id="bt-voltar">← BioDex</button></p></div>';
    painel(esc(c.nome), h);
    const bc = $('bt-conectar'); if (bc) bc.addEventListener('click', () => acoes.conectar(id));
    $('bt-voltar').addEventListener('click', () => acoes.voltar());
  }
  function ecos(estado) {
    const lista = estado.ecos.map((id) => { const c = CARTA(id), n = estado.cartas[id] || 0, e = c.eco; return '<div class="eco"><div class="em">' + c.emoji + '</div><div><b>' + esc(n >= 3 ? e.evo : e.nome) + (n >= 3 ? ' ⭐' : '') + '</b><small>' + c.tipo + ' · ' + esc(e.poder) + '</small><br><small>Golpes: ' + e.golpes.map((g) => g[0]).join(' · ') + '</small></div></div>'; }).join('');
    painel('✨ Seus Ecos · ' + estado.ecos.length + '/3', (lista || '<p>Ainda sem Ecos. Entenda um ser vivo para um Eco nascer.</p>') + '<p class="mini">Um Eco nasce quando a carta chega a "Entendido" e evolui em "Conectado". Fragmentos de Codex: ' + estado.fragmentos + '</p>');
  }
  function missoes(estado) {
    painel('🧭 Missões', '<ul class="lista">' + MISSOES.map((m) => '<li class="' + (estado.missoes[m.id] ? 'feita' : '') + '"><span class="em">' + m.emoji + '</span><div><b>' + esc(m.nome) + '</b>' + esc(m.texto) + '</div></li>').join('') + '</ul>');
  }

  /* ---------- batalha por turnos ---------- */
  // inimigo = {nome, emoji, erro, hp, atk, id}; devolve true se venceu
  async function batalha(estado, inimigo, opts) {
    const B = $('batalha'); B.hidden = false; Jogador.J.bloqueado = true;
    const ecos = estado.ecos.map((id) => { const c = CARTA(id), n = estado.cartas[id] || 0, evo = n >= 3; return { id, c, nome: evo ? c.eco.evo : c.eco.nome, hp: c.eco.hp * (evo ? 1.4 : 1), max: c.eco.hp * (evo ? 1.4 : 1), atk: c.eco.atk * (evo ? 1.4 : 1), golpes: c.eco.golpes }; });
    let ihp = inimigo.hp, cur = 0, fase = 0;
    const log = (t) => { $('bt-log').textContent = t; };
    const pinta = () => { $('bt-inimigo-nome').textContent = inimigo.emoji + ' ' + inimigo.nome; $('bt-inimigo-erro').textContent = inimigo.erro || ''; $('bt-inimigo-hp').style.width = Math.max(0, ihp / inimigo.hp * 100) + '%'; const e = ecos[cur]; $('bt-eco-sprite').textContent = e.c.emoji; $('bt-eco-nome').textContent = e.nome; $('bt-eco-hp').style.width = Math.max(0, e.hp / e.max * 100) + '%'; $('bt-inimigo-sprite').textContent = inimigo.emoji; };
    const espera = (ms) => new Promise((r) => setTimeout(r, ms));
    const treme = (id) => { const el = $(id); el.classList.remove('hit'); void el.offsetWidth; el.classList.add('hit'); };
    const escolher = () => new Promise((res) => {
      const g = $('bt-golpes'); g.innerHTML = '';
      const e = ecos[cur];
      e.golpes.forEach((gl, i) => { const b = document.createElement('button'); b.type = 'button'; b.innerHTML = esc(gl[0]) + '<small>' + (gl[1] ? 'fato contra ' + RUIDOSOS[gl[1]].nome : 'golpe comum') + '</small>'; b.addEventListener('click', () => res({ golpe: i })); g.appendChild(b); });
      ecos.forEach((o, i) => { if (i !== cur && o.hp > 0) { const b = document.createElement('button'); b.type = 'button'; b.className = 'troca'; b.innerHTML = '🔄 Trocar: ' + o.c.emoji + '<small>' + esc(o.nome) + '</small>'; b.addEventListener('click', () => res({ troca: i })); g.appendChild(b); } });
    });
    pinta(); log(inimigo.intro || ('O ' + inimigo.nome + ' aparece! ' + (inimigo.erro || '')));
    await espera(900);
    while (ihp > 0 && ecos.some((e) => e.hp > 0)) {
      // fase do chefe: antes do golpe, uma conexão
      if (opts && opts.fases && fase < opts.fases.length) {
        $('bt-golpes').innerHTML = ''; const q = opts.fases[fase];
        const i = await dialogo('Devorador', q.p, q.o);
        if (i === q.c) { fase++; ihp -= inimigo.hp / opts.fases.length * 0.7; log('💥 A conexão certa rasga o Ruído! Agora ataque.'); treme('bt-inimigo-sprite'); } else { log('O Devorador cresce com o erro!'); ihp = Math.min(inimigo.hp, ihp + 20); }
        pinta(); await espera(700);
        if (ihp <= 0) break;
      }
      const esc_ = await escolher();
      if (esc_.troca !== undefined) { cur = esc_.troca; pinta(); log('Vai, ' + ecos[cur].nome + '!'); await espera(600); }
      else {
        const e = ecos[cur], gl = e.golpes[esc_.golpe];
        const forte = gl[1] && gl[1] === inimigo.id; const dano = Math.round(e.atk * (forte ? 2 : 1) * (0.9 + Math.random() * 0.2));
        ihp -= dano; treme('bt-inimigo-sprite'); log(e.nome + ' usou ' + gl[0] + (forte ? '! O fato certo dobra o dano: ' : ': ') + dano); pinta(); await espera(900);
        if (ihp <= 0) break;
        // vez do inimigo
        const dn = Math.round(inimigo.atk * (0.8 + Math.random() * 0.4)); e.hp -= dn; treme('bt-eco-sprite'); log(inimigo.nome + ' ataca com ' + (inimigo.erro || 'Ruído') + ' Dano: ' + dn); pinta(); await espera(900);
        if (e.hp <= 0) { const prox = ecos.findIndex((o) => o.hp > 0); if (prox >= 0) { cur = prox; log(e.nome + ' recuou. Vai, ' + ecos[cur].nome + '!'); pinta(); await espera(700); } }
      }
    }
    const venceu = ihp <= 0; $('bt-golpes').innerHTML = '';
    log(venceu ? '🎉 O ' + inimigo.nome + ' se desfaz em fragmentos de Codex!' : 'Seus Ecos precisam descansar. O Ruído te levou de volta à vila.');
    await espera(1400); B.hidden = true; Jogador.J.bloqueado = false;
    return venceu;
  }

  /* ---------- etiquetas sobre o 3D ---------- */
  const labels = $('etiquetas'), _v = new THREE.Vector3();
  function etiquetas(camera, lista) {
    // lista: [{pos, texto, classe}]
    while (labels.children.length < lista.length) { const d = document.createElement('div'); d.className = 'etq'; labels.appendChild(d); }
    for (let i = 0; i < labels.children.length; i++) {
      const el = labels.children[i], it = lista[i];
      if (!it) { el.style.display = 'none'; continue; }
      _v.copy(it.pos).add(new THREE.Vector3(0, it.alt || 3.2, 0)).project(camera);
      if (_v.z > 1 || Math.abs(_v.x) > 1.1 || Math.abs(_v.y) > 1.1) { el.style.display = 'none'; continue; }
      el.style.display = ''; el.textContent = it.texto; el.className = 'etq ' + (it.classe || '');
      el.style.transform = 'translate(' + ((_v.x + 1) / 2 * innerWidth) + 'px,' + ((1 - _v.y) / 2 * innerHeight) + 'px) translate(-50%,-100%)';
    }
  }

  return { toast, dica, dialogo, desafio, painel, fecharPainel, codex, carta, ecos, missoes, batalha, etiquetas, aberto: () => aberto || !$('painel').hidden || !$('batalha').hidden };
})();
