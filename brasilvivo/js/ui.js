/* =====================================================================
   Terra Codex · Brasil Vivo · interface: toast, diálogo, painéis
   (BioDex regional e ficha, Ninho, mapa do Brasil Vivo) e etiquetas 3D.
   Nada aqui pergunta "qual é a resposta certa": a BioDex mostra o que o
   jogador já viveu e dá pistas de onde procurar o resto.
   ===================================================================== */
const UI = (function () {
  const $ = (id) => document.getElementById(id);
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  let toastT = null;
  function toast(t, ms) { const el = $('toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('on'), ms || 2600); }
  function dica(t) { const el = $('dica'); el.hidden = !t; if (t) el.textContent = t; }

  // diálogo: resolve com o índice escolhido
  let aberto = false;
  function dialogo(quem, texto, opcoes) {
    return new Promise((res) => {
      aberto = true; Jogador.J.bloqueado = true;
      const d = $('dialogo'); d.hidden = false;
      // retrato: o emoji do começo do nome ("🌳 Guardiã Ipê")
      const pt = String(quem).split(' '), temIco = pt.length > 1 && !/[A-Za-zÀ-ú0-9?]/.test(pt[0]);
      $('dialogo-avatar').textContent = temIco ? pt[0] : '✨'; $('dialogo-quem').textContent = temIco ? pt.slice(1).join(' ') : quem;
      $('dialogo-texto').textContent = texto;
      const o = $('dialogo-opcoes'); o.innerHTML = '';
      (opcoes || ['Continuar']).forEach((op, i) => {
        const b = document.createElement('button'); b.type = 'button'; b.textContent = typeof op === 'string' ? op : op.t; if (op.classe) b.className = op.classe;
        b.addEventListener('click', () => { d.hidden = true; aberto = false; Jogador.J.bloqueado = false; res(i); });
        o.appendChild(b);
      });
    });
  }

  function painel(titulo, html) { $('painel').hidden = false; $('painel-titulo').textContent = titulo; $('painel-corpo').innerHTML = html; $('painel-corpo').scrollTop = 0; Jogador.J.bloqueado = true; }
  function fecharPainel() { $('painel').hidden = true; Jogador.J.bloqueado = false; }
  $('painel-x').addEventListener('click', fecharPainel);

  const pontos = (id) => { const ms = Biodex.marcos(id); return '<span class="pontos" aria-label="' + ms.length + ' de 6 marcos">' + Registro.MARCOS.map((m) => '<i class="' + (ms.includes(m.id) ? 'ok' : '') + '"></i>').join('') + '</span>'; };
  // retrato 3D da fase que anda (cai para o emoji se não der para desenhar)
  function imgBicho(e, classe) {
    const f = e.fases.find((x) => x.anda), src = f && f.forma && Formas.retrato(f.forma, f.cor);
    return src ? '<img class="' + (classe || 'retrato') + '" src="' + src + '" alt="">' : e.emoji;
  }
  const nomeArea = (x, z) => { const a = Mundo.areaEm(x, z); return a ? a.no : 'pelo Cerrado'; };

  /* ---------- BioDex regional ---------- */
  function biodex(bioma, aoClicar) {
    const lista = Registro.lista('especies', bioma), b = Registro.R.biomas[bioma];
    const h = '<div class="cartas">' + lista.map((e) => {
      const ms = Biodex.marcos(e.id), visto = ms.length > 0;
      return '<button type="button" class="carta' + (visto ? ' vista' : ' silhueta') + (ms.includes('ativado') ? ' ativada' : '') + '" data-id="' + e.id + '"><div class="em">' + imgBicho(e) + '</div><b>' + (visto ? esc(e.nome) : '???') + '</b>' + (visto ? pontos(e.id) + '<small>' + Biodex.rotulo(e.id) + '</small>' : '<small>' + esc(e.grupo) + '</small>') + '</button>';
    }).join('') + '</div><p class="mini">Cada ponto é algo que você viveu no mundo: ver, encontrar outra fase, cuidar, ver a transformação, descobrir o que o ser vivo faz e ativá-lo no mundo.</p>';
    painel('📖 BioDex do ' + b.nome + ' · ' + Biodex.vistas(bioma) + '/' + lista.length, h);
    $('painel-corpo').querySelectorAll('.carta').forEach((el) => el.addEventListener('click', () => aoClicar(el.dataset.id)));
  }

  // ficha: encantamento primeiro (nome, o que faz, fases, relações); ciência nos detalhes
  function ficha(id, voltar) {
    const e = Registro.especie(id), ms = Biodex.marcos(id), visto = ms.length > 0;
    let h = '<div class="ficha">';
    h += '<div class="ficha-topo"><div class="ficha-em">' + imgBicho(e) + '</div><div><h3>' + (visto ? esc(e.nome) : '???') + '</h3>' + pontos(id) + '<small class="rot">' + (Biodex.rotulo(id) || 'Ainda não visto') + '</small></div></div>';
    if (visto) h += '<p class="funcao">' + esc(e.funcao) + '</p>';
    else h += '<p class="funcao">Procure ' + (e.hora.includes('noite') ? 'à noite ' : 'de dia ') + esc(Registro.area(e.area).no) + '.</p>';
    // fases de vida: vistas aparecem; as outras são silhuetas com pista de onde procurar
    h += '<h4>Fases de vida</h4><div class="fases">' + e.fases.map((f) => {
      const viu = Biodex.viuFase(id, f.id);
      const pista = f.ponto ? 'Procure ' + nomeArea(f.ponto[0], f.ponto[1]) : f.anda ? 'Circula ' + (e.hora.includes('noite') ? 'à noite' : 'de dia') : e.ciclo ? 'Aparece ao cuidar no Ninho' : '';
      return '<div class="fase' + (viu ? ' ok' : '') + '"><span class="em">' + (viu ? (f.anda ? imgBicho(e, 'retrato mini') : f.emoji) : '?') + '</span><b>' + (viu ? esc(f.nome) : '???') + '</b>' + (viu ? '' : '<small>' + esc(pista) + '</small>') + '</div>';
    }).join('') + '</div>';
    // relações com o ecossistema
    const rels = Registro.relacoesDe(id);
    if (rels.length) h += '<h4>Relações</h4><ul class="rels">' + rels.map((r) => {
      const st = Estado.dados.relacoes[r.id];
      if (st) return '<li class="ok"><b>' + esc(e.nome) + ' ' + esc(r.tipo) + ' → ' + esc(r.para) + (st === 'ativada' ? ' · ativada no mundo 🌿' : '') + '</b>' + esc(r.texto) + '</li>';
      const pista = r.prova && r.prova.tipo === 'ver-acao' ? 'Observe o que ela faz ' + Registro.area(r.prova.area).no + ' quando aparecer ✨.' : r.ativar ? 'Você descobre ao ativá-la ' + Registro.area(r.ativar.onde).no + '.' : '';
      return '<li><b>??? → ' + esc(r.para) + '</b>' + esc(pista) + '</li>';
    }).join('') + '</ul>';
    // detalhes científicos: área secundária
    if (visto) {
      const rev = e.revisao || {};
      h += '<details class="detalhes"><summary>Detalhes</summary><p><b>Nome científico:</b> <i>' + esc(e.cientifico) + '</i></p><p><b>Onde vive:</b> ' + esc(e.textos.habitat) + '</p><p><b>Come:</b> ' + esc(e.textos.alimento) + '</p><p><b>Cuidado:</b> ' + esc(e.textos.cuidado) + '</p>' +
        '<p class="mini">' + (rev.status === 'validado' ? 'Conteúdo revisado' + (rev.revisor ? ' por ' + esc(rev.revisor) : '') + '.' : 'Conteúdo em revisão científica: espécie, nome e textos ainda são rascunho.') + '</p></details>';
    }
    h += '<p><button type="button" class="btn sec" id="bt-voltar">← BioDex</button></p></div>';
    painel('📖 BioDex do ' + Registro.R.biomas[e.bioma].nome, h);
    $('bt-voltar').addEventListener('click', voltar);
  }

  /* ---------- Ninho: cuidar sem pergunta (vira Viveiro na Sprint 2) ---------- */
  function progresso(n, passo, agora) {
    const total = passo.minutos * 60000, falta = Math.max(0, n.desde + total - agora), seg = Math.ceil(falta / 1000);
    return [Math.min(100, (1 - falta / total) * 100), seg > 60 ? 'Mais ou menos ' + Math.ceil(seg / 60) + ' min' : seg > 0 ? 'Quase: ' + seg + ' s' : 'Mudando agora…'];
  }
  // a cada segundo só a barra e o tempo mudam (redesenhar tudo engolia o toque em "Cuidar")
  function ninhoAtualizar() {
    const agora = Date.now();
    Estado.dados.ninho.forEach((n, i) => {
      const b = document.querySelector('[data-nb="' + i + '"]'), t = document.querySelector('[data-nt="' + i + '"]'); if (!b || !n.desde) return;
      const passo = Registro.ciclo(n.ciclo).passos.find((p) => p.de === n.fase); if (!passo) return;
      const [pct, txt] = progresso(n, passo, agora); b.style.width = pct + '%'; t.textContent = txt;
    });
  }
  function ninho(aoCuidar) {
    const agora = Date.now(), N = Estado.dados.ninho;
    const lista = N.map((n, i) => {
      const c = Registro.ciclo(n.ciclo), e = Registro.especie(c.especie), f = e.fases.find((x) => x.id === n.fase), passo = c.passos.find((p) => p.de === n.fase);
      const rec = Registro.R.biomas[e.bioma].recursos;
      let corpo;
      if (!passo) corpo = '<small>🌿 Completou o ciclo e acompanha você. Logo vai poder ativá-la no mundo.</small>';
      else if (!n.desde) corpo = '<small>Precisa de: ' + passo.precisa.map((r) => rec[r].emoji + ' ' + esc(rec[r].nome)).join(' · ') + '</small><button type="button" class="btn" data-i="' + i + '">🤲 Cuidar</button>';
      else {
        const [pct, txt] = progresso(n, passo, agora);
        corpo = '<div class="barra"><b data-nb="' + i + '" style="width:' + pct + '%"></b></div><small>' + esc(passo.sinal) + '</small><small data-nt="' + i + '">' + txt + '</small>';
      }
      return '<div class="ninho"><div class="em">' + f.emoji + '</div><div style="flex:1"><b>' + esc(f.nome) + ' <small style="display:inline">· ' + esc(e.nome) + '</small></b>' + corpo + '</div></div>';
    }).join('');
    painel('🥚 Ninho · ' + N.length + '/3', (lista || '<p>Nenhum ser vivo para cuidar ainda. Ovos e outras fases pequenas aparecem pelo mapa: procure nas folhas da horta e na beira da vereda.</p>') + '<p class="mini">Aqui você não captura bicho: cuida de uma fase da vida até ela se transformar. Não há resposta errada; se faltar algo, ele só espera. No mundo real, nunca tire ovos da natureza.</p>');
    $('painel-corpo').querySelectorAll('button[data-i]').forEach((b) => b.addEventListener('click', () => aoCuidar(+b.dataset.i)));
  }

  /* ---------- mapa do Brasil Vivo (ficcional, sem localização real) ---------- */
  function mapa() {
    const ativos = Registro.R.biomas, c = CIDADE_NUCLEO;
    let svg = '<svg viewBox="0 0 360 380" class="mapa-bv" role="img" aria-label="Mapa do Brasil Vivo: o Cerrado está aberto; os outros biomas chegam em breve">';
    svg += '<rect x="0" y="0" width="360" height="380" rx="22" fill="#d7ecf2"/>';
    BRASIL_VIVO.forEach((b) => { if (b.id !== 'cerrado') svg += '<path d="M' + c.x + ' ' + c.y + ' L' + b.x + ' ' + b.y + '" stroke="#8a7a5a" stroke-width="1.6" stroke-dasharray="3 5" fill="none" opacity=".4"/>'; });
    BRASIL_VIVO.forEach((b) => {
      const on = !!ativos[b.id];
      svg += '<g class="bioma' + (on ? ' on' : '') + '"><circle cx="' + b.x + '" cy="' + b.y + '" r="' + b.r + '" fill="' + b.cor + '" fill-opacity="' + (on ? 0.9 : 0.35) + '" stroke="' + (on ? '#164A3A' : '#fff') + '" stroke-width="' + (on ? 3 : 2) + '"' + (on ? '' : ' stroke-dasharray="5 4"') + '/>' +
        '<text x="' + b.x + '" y="' + (b.y + (on ? 8 : -2)) + '" text-anchor="middle" font-size="' + (b.r > 30 ? 20 : 15) + '">' + b.emoji + '</text>' +
        '<text x="' + b.x + '" y="' + (b.y + (on ? 26 : b.r > 30 ? 16 : 13)) + '" text-anchor="middle" font-size="' + (b.r > 30 ? 10.5 : 9.5) + '" font-weight="900" fill="' + (on ? '#fff' : '#27311f') + '">' + esc(b.nome) + '</text>' +
        (on ? '' : '<text x="' + b.x + '" y="' + (b.y + (b.r > 30 ? 28 : 23)) + '" text-anchor="middle" font-size="8.5" font-weight="800" fill="#27311f" opacity=".75">em breve</text>') + '</g>';
    });
    svg += '<g><circle cx="' + c.x + '" cy="' + c.y + '" r="6" fill="#F5C451" stroke="#164A3A" stroke-width="2.5"/><text x="' + (c.x + 10) + '" y="' + (c.y + 4) + '" font-size="11" font-weight="900" fill="#fff">' + c.nome + '</text></g></svg>';
    painel('🗺️ Brasil Vivo', svg + '<p>Você está em <b>Brasília</b>, a Cidade-Núcleo, no coração do <b>Cerrado</b>. Cada bioma é um território com seus próprios seres vivos, ciclos e áreas para restaurar.</p><p class="mini">O Brasil Vivo é um mundo de jogo inspirado nos biomas reais. Ele não usa a sua localização e não pede para você ir a lugar nenhum.</p>');
  }

  /* ---------- etiquetas sobre o 3D ---------- */
  const labels = $('etiquetas'), _v = new THREE.Vector3(), _up = new THREE.Vector3();
  function etiquetas(camera, lista) {
    while (labels.children.length < lista.length) { const d = document.createElement('div'); d.className = 'etq'; labels.appendChild(d); }
    for (let i = 0; i < labels.children.length; i++) {
      const el = labels.children[i], it = lista[i];
      if (!it) { el.style.display = 'none'; continue; }
      _v.copy(it.pos).add(_up.set(0, it.alt || 3.2, 0)).project(camera);
      if (_v.z > 1 || Math.abs(_v.x) > 1.1 || Math.abs(_v.y) > 1.1) { el.style.display = 'none'; continue; }
      el.style.display = ''; el.textContent = it.texto; el.className = 'etq ' + (it.classe || '');
      el.style.transform = 'translate(' + ((_v.x + 1) / 2 * innerWidth) + 'px,' + ((1 - _v.y) / 2 * innerHeight) + 'px) translate(-50%,-100%)';
    }
  }

  return { toast, dica, dialogo, painel, fecharPainel, biodex, ficha, ninho, ninhoAtualizar, mapa, etiquetas, aberto: () => aberto || !$('painel').hidden };
})();
