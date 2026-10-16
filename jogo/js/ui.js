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

  /* ---------- Ninho: ovos que viram bichos ---------- */
  function ninho(estado, aoCuidar) {
    const agora = Date.now();
    const lista = estado.ninho.map((n, i) => {
      const ov = OVOS.find((o) => o.id === n.id), st = ov.estagios[n.estagio], fim = !st.cuidados;
      const falta = Math.max(0, Math.ceil((n.desde + st.espera * 1000 - agora) / 1000));
      return '<div class="ninho"><div class="em">' + st.emoji + '</div><div style="flex:1"><b>' + esc(st.nome) + ' <small style="display:inline">· ' + esc(ov.nome) + '</small></b>' +
        (fim ? '<small>🌿 Cresceu! Agora acompanha você pelo vale.</small>' : '<div class="barra"><b style="width:' + (n.cuidados / st.cuidados * 100) + '%"></b></div><small>Cuidados: ' + n.cuidados + '/' + st.cuidados + (falta ? ' · próximo em ' + (falta > 60 ? Math.ceil(falta / 60) + ' min' : falta + ' s') : ' · pronto para cuidar') + '</small>' +
        '<button type="button" class="btn" data-i="' + i + '"' + (falta ? ' disabled' : '') + '>🤲 Cuidar</button>') + '</div></div>';
    }).join('');
    painel('🥚 Ninho · ' + estado.ninho.length + '/3', (lista || '<p>Nenhum ovo ainda. Procure ovos pelo vale: perto de Dona Flor, na horta e na beira do rio.</p>') + '<p class="mini">Aqui você não captura bicho: cuida de um ovo até ele crescer, e ele escolhe andar com você. No mundo real, nunca tire ovos de ninhos.</p>');
    $('painel-corpo').querySelectorAll('button[data-i]').forEach((b) => b.addEventListener('click', () => aoCuidar(+b.dataset.i)));
  }

  /* ---------- mapa real (OpenStreetMap) ---------- */
  function mapa(estado, aoEscolher) {
    const cidade = CIDADES.find((c) => c[0] === estado.cidade) || CIDADES[0];
    let z = estado.cidade ? 11 : 4, cx, cy;
    const lon2x = (lon, z) => (lon + 180) / 360 * Math.pow(2, z) * 256, lat2y = (lat, z) => (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, z) * 256;
    const centrar = () => { const c = estado.cidade ? cidade : ['Brasil', -14, -53]; cx = lon2x(c[2], z); cy = lat2y(c[1], z); };
    centrar();
    painel('🗺️ Mapa do mundo', '<div class="mapa-sel"><label for="sel-cidade">Minha cidade:</label><select id="sel-cidade"><option value="">Escolher…</option>' + CIDADES.map((c) => '<option' + (c[0] === estado.cidade ? ' selected' : '') + '>' + c[0] + '</option>').join('') + '</select><span class="mini">O Vale Vivo fica na sua cidade. Só a cidade é guardada, nunca o endereço.</span></div><div class="mapa" id="mapa"><div class="mapa-ctl"><button type="button" id="mz-mais">+</button><button type="button" id="mz-menos">−</button></div><div class="mapa-cred">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></div></div><p class="mini">Cada região do Terra Codex fica numa cidade de verdade. As outras sete chegam nos próximos capítulos.</p>');
    const el = $('mapa');
    function desenhar() {
      el.querySelectorAll('img, .marca').forEach((n) => n.remove());
      const W = el.clientWidth, H = el.clientHeight, n = Math.pow(2, z);
      const x0 = Math.floor((cx - W / 2) / 256), x1 = Math.floor((cx + W / 2) / 256), y0 = Math.floor((cy - H / 2) / 256), y1 = Math.floor((cy + H / 2) / 256);
      for (let tx = x0; tx <= x1; tx++) for (let ty = y0; ty <= y1; ty++) {
        if (ty < 0 || ty >= n) continue;
        const img = document.createElement('img'); img.alt = ''; img.src = 'https://tile.openstreetmap.org/' + z + '/' + (((tx % n) + n) % n) + '/' + ty + '.png';
        img.style.left = (tx * 256 - cx + W / 2) + 'px'; img.style.top = (ty * 256 - cy + H / 2) + 'px'; el.appendChild(img);
      }
      const marca = (lat, lon, txt, classe) => { const m = document.createElement('div'); m.className = 'marca ' + (classe || ''); m.textContent = txt; m.style.left = (lon2x(lon, z) - cx + W / 2) + 'px'; m.style.top = (lat2y(lat, z) - cy + H / 2) + 'px'; el.appendChild(m); };
      REGIOES_MUNDO.forEach((r, i) => { const c = i === 0 ? (estado.cidade ? cidade : null) : CIDADES.find((x) => x[0] === r.cidade); if (c) marca(c[1], c[2], r.emoji + ' ' + r.nome + (i ? ' · em breve' : ''), i ? 'breve' : 'eu'); });
    }
    desenhar();
    $('mz-mais').addEventListener('click', () => { if (z < 16) { cx *= 2; cy *= 2; z++; desenhar(); } });
    $('mz-menos').addEventListener('click', () => { if (z > 2) { cx /= 2; cy /= 2; z--; desenhar(); } });
    $('sel-cidade').addEventListener('change', (e) => { estado.cidade = e.target.value || null; aoEscolher(); z = estado.cidade ? 11 : 4; centrar(); desenhar(); });
    let arr = null;
    const ini = (x, y) => { arr = { x, y }; }, mov = (x, y) => { if (!arr) return; cx -= x - arr.x; cy -= y - arr.y; arr = { x, y }; desenhar(); };
    el.addEventListener('mousedown', (e) => ini(e.clientX, e.clientY)); addEventListener('mousemove', (e) => mov(e.clientX, e.clientY)); addEventListener('mouseup', () => { arr = null; });
    el.addEventListener('touchstart', (e) => ini(e.touches[0].clientX, e.touches[0].clientY), { passive: true }); el.addEventListener('touchmove', (e) => { mov(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true }); el.addEventListener('touchend', () => { arr = null; });
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

  return { toast, dica, dialogo, desafio, painel, fecharPainel, codex, carta, ecos, missoes, ninho, mapa, batalha, etiquetas, aberto: () => aberto || !$('painel').hidden || !$('batalha').hidden };
})();
