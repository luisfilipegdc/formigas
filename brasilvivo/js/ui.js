/* =====================================================================
   Terra Codex · Brasil Vivo · interface: toast, diálogo, painéis
   (BioDex regional e ficha, Viveiro, mapa do Brasil Vivo) e etiquetas 3D.
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
        b.addEventListener('click', () => { Som.tocar('toque'); d.hidden = true; aberto = false; Jogador.J.bloqueado = false; res(i); });
        o.appendChild(b);
      });
    });
  }

  function painel(titulo, html) { if ($('painel').hidden) Som.tocar('abrir'); $('painel').hidden = false; $('painel-titulo').textContent = titulo; $('painel-corpo').innerHTML = html; $('painel-corpo').scrollTop = 0; Jogador.J.bloqueado = true; }
  function fecharPainel() { if (!$('painel').hidden) Som.tocar('fechar'); $('painel').hidden = true; Jogador.J.bloqueado = false; }
  $('painel-x').addEventListener('click', fecharPainel);

  const pontos = (id) => { const ms = Biodex.marcos(id); return '<span class="pontos" aria-label="' + ms.length + ' de 6 marcos">' + Registro.MARCOS.map((m) => '<i class="' + (ms.includes(m.id) ? 'ok' : '') + '"></i>').join('') + '</span>'; };
  // retrato 3D da fase que anda (cai para o emoji se não der para desenhar)
  function imgBicho(e, classe) {
    const f = e.fases.find((x) => x.anda), src = f && f.forma && Formas.retrato(f.forma, f.cor);
    return src ? '<img class="' + (classe || 'retrato') + '" src="' + src + '" alt="">' : e.emoji;
  }
  // sprite animado da fase (versão 2D); sem ele, o emoji (versão 3D)
  const temSprite = () => typeof Formas !== 'undefined' && !!Formas.faseHtml;
  const icone = (e, f, tam, classe) => (temSprite() && Formas.faseHtml(e.id, f.id, tam, classe)) || f.emoji;
  function textoFase(e, f) {
    if (f.achado) return f.achado;
    if (f.anda) return e.textos.visto;
    const c = e.ciclo && Registro.ciclo(e.ciclo), p = c && c.passos.find((x) => x.de === f.id);
    return p ? p.sinal : '';
  }
  // visor: a fase escolhida em tamanho grande, animada, no lugar onde ela vive
  function visor(e, faseId) {
    const vistas = e.fases.filter((f) => Biodex.viuFase(e.id, f.id)); if (!vistas.length || !temSprite()) return '';
    const f = vistas.find((x) => x.id === faseId) || vistas.find((x) => x.anda) || vistas[vistas.length - 1];
    return '<div class="visor cena-' + (Formas.cena(e.id, f.id) || 'chao') + '"><button type="button" class="visor-bicho" aria-label="' + esc(f.nome) + ': toque para ver de perto">' + icone(e, f, 168) + '</button></div>' +
      (vistas.length > 1 ? '<div class="visor-fases" role="tablist">' + vistas.map((v) => '<button type="button" role="tab" aria-selected="' + (v.id === f.id) + '" data-fase="' + v.id + '" class="' + (v.id === f.id ? 'on' : '') + '" aria-label="' + esc(v.nome) + '">' + icone(e, v, 26) + '</button>').join('') + '</div>' : '') +
      '<p class="visor-txt"><b>' + esc(f.nome) + ':</b> ' + esc(textoFase(e, f)) + '</p>';
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
  function ficha(id, voltar, faseId) {
    const e = Registro.especie(id), ms = Biodex.marcos(id), visto = ms.length > 0, vis = visto ? visor(e, faseId) : '';
    let h = '<div class="ficha">' + vis;
    h += '<div class="ficha-topo">' + (vis ? '' : '<div class="ficha-em">' + imgBicho(e) + '</div>') + '<div><h3>' + (visto ? esc(e.nome) : '???') + '</h3>' + pontos(id) + '<small class="rot">' + (Biodex.rotulo(id) || 'Ainda não visto') + '</small></div></div>';
    if (visto) h += '<p class="funcao">' + esc(e.funcao) + '</p>';
    else h += '<p class="funcao">Procure ' + (e.hora.includes('noite') ? 'à noite ' : 'de dia ') + esc(Registro.area(e.area).no) + '.</p>';
    // fases de vida: vistas aparecem; as outras são silhuetas com pista de onde procurar
    h += '<h4>Fases de vida</h4><div class="fases">' + e.fases.map((f) => {
      const viu = Biodex.viuFase(id, f.id);
      const pista = f.ponto ? 'Procure ' + nomeArea(f.ponto[0], f.ponto[1]) : f.anda ? 'Circula ' + (e.hora.includes('noite') ? 'à noite' : 'de dia') : e.ciclo ? 'Aparece ao cuidar no Viveiro' : '';
      return '<div class="fase' + (viu ? ' ok' : '') + '"><span class="em">' + (viu ? (temSprite() ? icone(e, f, 40) : f.anda ? imgBicho(e, 'retrato mini') : f.emoji) : '?') + '</span><b>' + (viu ? esc(f.nome) : '???') + '</b>' + (viu ? '' : '<small>' + esc(pista) + '</small>') + '</div>';
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
    $('painel-corpo').querySelectorAll('[data-fase]').forEach((b) => b.addEventListener('click', () => { Som.tocar('toque'); ficha(id, voltar, b.dataset.fase); }));
    const vb = $('painel-corpo').querySelector('.visor-bicho');
    if (vb) vb.addEventListener('click', () => { Som.tocar('observar'); vb.classList.remove('pula'); void vb.offsetWidth; vb.classList.add('pula'); });
  }

  /* ---------- Viveiro: arrastar o que o ser vivo precisa até o nicho (ou tocar) ---------- */
  function progresso(n, passo, agora) {
    const total = passo.minutos * 60000, falta = Math.max(0, n.desde + total - agora), seg = Math.ceil(falta / 1000);
    return [Math.min(100, (1 - falta / total) * 100), seg > 60 ? 'Mais ou menos ' + Math.ceil(seg / 60) + ' min' : seg > 0 ? 'Quase: ' + seg + ' s' : 'Mudando agora…'];
  }
  // a cada segundo só a barra e o tempo mudam (redesenhar tudo engolia o toque e o arrasto)
  function ninhoAtualizar() {
    const agora = Date.now();
    Estado.dados.ninho.forEach((n, i) => {
      const b = document.querySelector('[data-nb="' + i + '"]'), t = document.querySelector('[data-nt="' + i + '"]'); if (!b || !n.desde) return;
      const passo = Registro.ciclo(n.ciclo).passos.find((p) => p.de === n.fase); if (!passo) return;
      const [pct, txt] = progresso(n, passo, agora); b.style.width = pct + '%'; t.textContent = txt;
    });
  }
  // msg: { i, tipo: 'ok'|'erro'|'info', texto } · resposta ao último item dado
  function viveiro(bioma, aoDar, aoRever, msg) {
    const agora = Date.now(), D = Estado.dados, N = D.ninho, rec = Registro.R.biomas[bioma].recursos, bolsa = D.bolsa || {};
    const precisam = new Set(), semNada = new Set();
    const lista = N.map((n, i) => {
      const c = Registro.ciclo(n.ciclo), e = Registro.especie(c.especie), f = e.fases.find((x) => x.id === n.fase), passo = c.passos.find((p) => p.de === n.fase);
      const dado = n.dado || [];
      let corpo, alvo = false;
      if (!passo) corpo = '<small>🌿 Completou o ciclo e acompanha você. Leve ' + esc(Registro.area(c.ativar.onde).no.replace(/^n/, 'a').replace(/^aa /, 'à ')) + ' e toque em ' + esc((Registro.relacoesDe(e.id).find((r) => r.ativar) || { ativar: { verbo: 'Soltar' } }).ativar.verbo) + '.</small>';
      else if (!n.desde) {
        alvo = true;
        corpo = '<div class="precisa">' + passo.precisa.map((r) => { const ok = dado.includes(r); if (!ok) { precisam.add(r); if (!rec[r].ferramenta && !(bolsa[r] > 0)) semNada.add(r); } return '<span class="chip' + (ok ? ' ok' : '') + '">' + (ok ? '✓ ' : '') + rec[r].emoji + ' ' + esc(rec[r].curto) + '</span>'; }).join('') + '</div>';
      } else {
        const [pct, txt] = progresso(n, passo, agora);
        corpo = '<div class="barra"><b data-nb="' + i + '" style="width:' + pct + '%"></b></div><small>' + esc(passo.sinal) + '</small><small data-nt="' + i + '">' + txt + '</small>';
      }
      const m = msg && msg.i === i ? msg : null;
      const rever = n.novo ? '<button type="button" class="btn sec rever" data-r="' + i + '">✨ Ver como foi</button>' : '';
      return '<div class="ninho' + (n.novo ? ' novo' : '') + (m ? ' ' + m.tipo : '') + '"' + (alvo ? ' data-alvo="' + i + '"' : '') + '><div class="em nicho-' + esc(c.nicho || 'terrario') + '">' + icone(e, f, 52) + '</div><div style="flex:1"><b>' + esc(f.nome) + ' <small style="display:inline">· ' + esc(e.nome) + '</small></b>' + corpo + (m ? '<p class="viv-msg" role="status">' + esc(m.texto) + '</p>' : '') + rever + '</div></div>';
    }).join('');
    // bolsa: ferramentas sempre à mão + o que foi colhido no mundo
    const itens = Object.keys(rec).filter((r) => rec[r].ferramenta || bolsa[r] > 0);
    const bandeja = N.some((n) => !n.desde && Registro.ciclo(n.ciclo).passos.some((p) => p.de === n.fase))
      ? '<div class="bandeja"><p class="aj-rot">Sua bolsa · arraste até o ser vivo ou toque</p><div class="itens">' + itens.map((r) => '<button type="button" class="item' + (precisam.has(r) ? ' util' : '') + '" data-rec="' + r + '" aria-label="' + esc(rec[r].nome) + '"><span class="em">' + rec[r].emoji + '</span><small>' + esc(rec[r].curto) + '</small>' + (rec[r].ferramenta ? '' : '<i>' + bolsa[r] + '</i>') + '</button>').join('') + '</div>' +
        [...semNada].map((r) => '<p class="onde">' + rec[r].emoji + ' <b>' + esc(rec[r].curto) + ':</b> ' + esc(rec[r].onde || '') + '</p>').join('') + '</div>'
      : '';
    painel('🌱 Viveiro · ' + N.length + '/3', (lista || '<p>Nenhum ser vivo para cuidar ainda. Ovos e outras fases pequenas aparecem pelo mapa: procure nas folhas da horta e na beira da vereda.</p>') + bandeja + '<p class="mini">Aqui você não captura bicho: cuida de uma fase da vida até ela se transformar. Não há resposta errada: o que não ajuda volta para a bolsa. No mundo real, nunca tire ovos da natureza.</p>');
    const corpo = $('painel-corpo');
    corpo.querySelectorAll('button[data-r]').forEach((b) => b.addEventListener('click', () => aoRever && aoRever(+b.dataset.r)));
    const alvos = [...corpo.querySelectorAll('[data-alvo]')];
    let sel = null;
    const marcar = () => { corpo.querySelectorAll('.item').forEach((b) => b.classList.toggle('sel', b.dataset.rec === sel)); alvos.forEach((a) => a.classList.toggle('esperando', !!sel)); };
    const alvoEm = (x, y) => { const el = document.elementFromPoint(x, y); return el && el.closest('[data-alvo]'); };
    let sobre = null;
    const destacar = (a) => { if (sobre && sobre !== a) sobre.classList.remove('sobre'); sobre = a; if (a) a.classList.add('sobre'); };
    const entregar = (a, r) => { if (a) aoDar(+a.dataset.alvo, r); };
    corpo.querySelectorAll('.item').forEach((b) => {
      b.addEventListener('pointerdown', (ev) => {
        if (ev.button > 0) return;
        ev.preventDefault();
        const r = b.dataset.rec, x0 = ev.clientX, y0 = ev.clientY; let fant = null;
        const mov = (e) => {
          if (!fant && Math.hypot(e.clientX - x0, e.clientY - y0) > 8) { fant = document.createElement('div'); fant.className = 'fantasma'; fant.textContent = rec[r].emoji; document.body.appendChild(fant); b.classList.add('arrastando'); }
          if (fant) { fant.style.left = e.clientX + 'px'; fant.style.top = e.clientY + 'px'; destacar(alvoEm(e.clientX, e.clientY)); }
        };
        const fim = (e) => {
          removeEventListener('pointermove', mov); removeEventListener('pointerup', fim); removeEventListener('pointercancel', fim);
          if (fant) { fant.remove(); b.classList.remove('arrastando'); destacar(null); if (e.type === 'pointerup') entregar(alvoEm(e.clientX, e.clientY), r); return; }
          // toque: com um só ser vivo esperando, já entrega; com mais, escolhe o item e depois o nicho
          if (alvos.length === 1) { entregar(alvos[0], r); return; }
          sel = sel === r ? null : r; marcar();
        };
        addEventListener('pointermove', mov); addEventListener('pointerup', fim); addEventListener('pointercancel', fim);
      });
      // teclado: Enter/Espaço escolhe o item
      b.addEventListener('click', (ev) => { if (ev.detail !== 0) return; if (alvos.length === 1) entregar(alvos[0], b.dataset.rec); else { sel = b.dataset.rec; marcar(); } });
    });
    alvos.forEach((a) => { a.addEventListener('click', () => { if (sel) { const r = sel; sel = null; entregar(a, r); } }); });
  }

  /* ---------- replay da transformação (a criança nunca perde o momento) ---------- */
  function transformacao(e, de, para, fim) {
    const fd = e.fases.find((x) => x.id === de), fp = e.fases.find((x) => x.id === para);
    enfileirar((el) => {
      el.innerHTML = '<div class="celebra-card transforma"><div class="troca"><span class="de">' + icone(e, fd, 64) + '</span><span class="seta">➜</span><span class="para">' + icone(e, fp, 64) + '</span></div><small>Assim foi a transformação</small><b>' + esc(e.nome) + ': ' + esc(fd.nome.toLowerCase()) + ' → ' + esc(fp.nome.toLowerCase()) + '</b></div>';
      el.hidden = false; Som.tocar('transformar');
      if (fim) setTimeout(fim, 3200);
      return 3300;
    });
  }

  /* ---------- Ajustes: texto, som, legendas, movimento e ajuda ---------- */
  function ajustes(aoMudar) {
    const a = Ajustes.valores;
    const seg = (k, ops) => '<div class="seg" role="radiogroup">' + ops.map(([v, t]) => '<button type="button" role="radio" aria-checked="' + (a[k] === v) + '" data-k="' + k + '" data-v="' + v + '" class="' + (a[k] === v ? 'on' : '') + '">' + t + '</button>').join('') + '</div>';
    const barra = (k, t) => '<label class="aj-linha"><span>' + t + '</span><input type="range" min="0" max="1" step="0.05" value="' + a[k] + '" data-k="' + k + '"></label>';
    const chave = (k, t, sub, on) => '<label class="aj-linha"><span>' + t + (sub ? '<small>' + sub + '</small>' : '') + '</span><input type="checkbox" class="chave" data-k="' + k + '"' + (on ? ' checked' : '') + '></label>';
    const h = '<div class="aj">' +
      '<h4>Texto</h4>' + seg('texto', [[1, 'A'], [1.15, 'A+'], [1.3, 'A++']]) +
      '<h4>Som</h4>' + chave('mudo', 'Sem som', '', a.mudo) + barra('geral', 'Volume geral') + barra('musica', 'Música') + barra('efeitos', 'Efeitos') + barra('ambiente', 'Natureza') +
      chave('legendas', 'Legendas de som', 'Mostra em texto o que se ouve em cada lugar', a.legendas) +
      '<h4>Movimento e ajuda</h4>' + chave('calmo', 'Menos movimento', 'Sem pulsos, molas e animações fortes', Ajustes.calmo()) +
      chave('passo', 'Mostrar o próximo passo', 'O cartão da jornada no topo da tela', a.passo) +
      '<p class="aj-rot">Seta e farol de caminho</p>' + seg('ajuda', [['precisar', 'Quando eu precisar'], ['sempre', 'Sempre'], ['nunca', 'Explorador']]) +
      '<p class="mini">Os ajustes ficam só neste aparelho.</p></div>';
    painel('⚙️ Ajustes', h);
    const corpo = $('painel-corpo');
    corpo.querySelectorAll('.seg button').forEach((b) => b.addEventListener('click', () => { const v = b.dataset.k === 'texto' ? +b.dataset.v : b.dataset.v; Ajustes.mudar(b.dataset.k, v); Som.tocar('toque'); ajustes(aoMudar); if (aoMudar) aoMudar(); }));
    corpo.querySelectorAll('input[type=range]').forEach((r) => r.addEventListener('input', () => Ajustes.mudar(r.dataset.k, +r.value)));
    corpo.querySelectorAll('input[type=range]').forEach((r) => r.addEventListener('change', () => Som.tocar('toque')));
    corpo.querySelectorAll('input.chave').forEach((c) => c.addEventListener('change', () => { Ajustes.mudar(c.dataset.k, c.checked); Som.tocar('toque'); if (aoMudar) aoMudar(); }));
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


  /* ---------- Celebração: um marco por vez, em fila (2,6 s cada) ---------- */
  const fila = []; let celebrando = false;
  const FRASE = { visto: 'Você viu pela primeira vez', encontrado: 'Você encontrou outra fase da vida', cuidado: 'Você cuidou de uma vida', transformado: 'Você viu a transformação', conectado: 'Você descobriu o que ele faz', ativado: 'Você religou o mundo' };
  function celebrar(especieId, marco) { fila.push([especieId, marco]); if (!celebrando) proximaCelebracao(); }
  // qualquer cartão (marco ou replay) entra na mesma fila, para um não apagar o outro
  function enfileirar(fn) { fila.push(fn); if (!celebrando) proximaCelebracao(); }
  function proximaCelebracao() {
    const it = fila.shift(), el = $('celebra'); if (!it) { celebrando = false; el.hidden = true; return; }
    celebrando = true;
    if (typeof it === 'function') { const ms = it(el); setTimeout(proximaCelebracao, ms); return; }
    const [id, marco] = it, e = Registro.especie(id), m = Registro.MARCOS.find((x) => x.id === marco), ms = Biodex.marcos(id);
    const dots = Registro.MARCOS.map((x) => '<i class="' + (ms.includes(x.id) ? 'ok' : '') + (x.id === marco ? ' novo' : '') + '"></i>').join('');
    el.innerHTML = '<div class="celebra-card">' + imgBicho(e).replace('class="retrato"', '').replace(/^([^<].*)$/, '<span class="em">$1</span>') + '<small>' + esc(FRASE[marco] || 'Novo marco') + '</small><b>' + esc(e.nome) + ' · ' + esc(m.nome) + '</b><span class="pontos">' + dots + '</span></div>';
    el.hidden = false; Som.tocar('marco');
    setTimeout(proximaCelebracao, 2600);
  }

  /* ---------- Jornada: a lista de passos (abre ao tocar no Objetivo) ---------- */
  function jornada(J, atual, E, abrirNinho, mostrarCaminho) {
    const h = '<ol class="jornada">' + J.passos.map((p, i) => '<li class="' + (i < atual || atual < 0 ? 'feito' : i === atual ? 'atual' : '') + '"><span class="n">' + (i < atual || atual < 0 ? '✓' : i + 1) + '</span><div>' + p.ico + ' ' + esc(p.texto) + (i === atual && p.dica ? '<small>' + esc(p.dica) + '</small>' : '') + '</div></li>').join('') + '</ol>' +
      (atual >= 0 && J.passos[atual].acao === 'viveiro' ? '<button type="button" class="btn" id="bt-ir-ninho">🌱 Abrir o Viveiro</button>' : '') +
      (atual >= 0 && J.passos[atual].alvo ? '<button type="button" class="btn" id="bt-caminho">🧭 Mostrar o caminho</button>' : '') +
      '<p class="mini">Sem pressa e sem prazo: cada passo espera por você. Se ficar em dúvida, a seta dourada e o farol de luz aparecem para mostrar o caminho.</p>';
    painel('🧭 ' + J.nome, h);
    const b = $('bt-ir-ninho'); if (b) b.addEventListener('click', abrirNinho);
    const c = $('bt-caminho'); if (c) c.addEventListener('click', () => { fecharPainel(); mostrarCaminho(); });
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

  return { toast, dica, dialogo, painel, fecharPainel, biodex, ficha, viveiro, ninhoAtualizar, mapa, celebrar, jornada, transformacao, ajustes, etiquetas, aberto: () => aberto || !$('painel').hidden };
})();
