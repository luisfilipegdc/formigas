/* =====================================================================
   ficha.js — gaveta "ℹ️ ficha" com informações da espécie
   Uso: Ficha.criar('abelha');   Ficha.casta('rainha');   Ficha.abrir('onca');
   Coloca um botão ℹ️ na barra de ferramentas (.tools), se houver, e abre
   uma gaveta com 4 abas: Ficha, Vida (ciclo de vida), Curiosidades e Real
   (fotos de verdade e árvore da família, via js/dados.js).
   ===================================================================== */
const Ficha = (function () {
  const css = `
  .ficha-back { position: fixed; inset: 0; background: rgba(40,25,10,.35); opacity: 0; pointer-events: none; transition: opacity .25s; z-index: 40; }
  .ficha-back.on { opacity: 1; pointer-events: auto; }
  .ficha {
    position: fixed; z-index: 41; left: 50%; bottom: 0; transform: translate(-50%, 105%);
    width: min(640px, 100vw); max-height: min(78vh, 760px); display: flex; flex-direction: column;
    background: var(--surface-warm, #fffaf0); color: var(--text, #4a2a12); border-radius: 28px 28px 0 0; box-shadow: 0 -10px 40px rgba(0,0,0,.25);
    transition: transform .35s cubic-bezier(.25,1.2,.5,1); font-family: inherit;
    padding-bottom: env(safe-area-inset-bottom);
  }
  .ficha.on { transform: translate(-50%, 0); }
  .ficha .grab { width: 54px; height: 6px; border-radius: 3px; background: var(--line, #e2d3b8); margin: 10px auto 2px; }
  .ficha header { display: flex; align-items: center; gap: 12px; padding: 4px 18px 8px; }
  .ficha header .em { font-size: 46px; line-height: 1; }
  .ficha header h2 { margin: 0; font-size: 26px; line-height: 1.05; }
  .ficha header i { font-size: 16px; opacity: .75; }
  .ficha header button { margin-left: auto; border: 0; background: var(--line, #f0e6d4); border-radius: 50%; width: 44px; height: 44px; font-size: 20px; cursor: pointer; flex: none; }
  .ficha nav { display: flex; gap: 8px; padding: 0 16px 10px; }
  .ficha nav button { flex: 1; white-space: nowrap; font-size: clamp(14px, 3.9vw, 17px) !important; border: 3px solid var(--line, #f0e2c4); background: #fff; border-radius: 999px; padding: 6px 4px; font: inherit; font-size: 17px; font-weight: 800; color: var(--text, #4a2a12); cursor: pointer; }
  .ficha nav button.on { background: var(--chip-on, #ffd23f); border-color: var(--chip-on, #ffd23f); color: var(--chip-on-text, inherit); }
  .ficha .body { overflow-y: auto; -webkit-overflow-scrolling: touch; padding: 0 16px 18px; }
  .ficha .casta { background: var(--color-accent-soft, #fff1c4); border-radius: 20px; padding: 10px 14px 6px; margin-bottom: 12px; }
  .ficha .casta h3 { margin: 0 0 4px; font-size: 19px; }
  .ficha .row { display: flex; gap: 12px; padding: 9px 2px; border-bottom: 1px solid var(--line, #f0e6d4); }
  .ficha .row:last-child { border-bottom: 0; }
  .ficha .row .ic { font-size: 26px; width: 34px; text-align: center; flex: none; line-height: 1.2; }
  .ficha .row b { display: block; font-size: 16px; }
  .ficha .row span { font-size: 17px; line-height: 1.3; }
  .ficha .ciclo { position: relative; padding-left: 10px; }
  .ficha .etapa { display: flex; gap: 14px; align-items: flex-start; padding: 8px 0; position: relative; }
  .ficha .etapa .bola { width: 54px; height: 54px; border-radius: 50%; background: var(--color-accent-soft, #fff1c4); display: grid; place-items: center; font-size: 30px; flex: none; z-index: 1; border: 3px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,.1); }
  .ficha .etapa:not(:last-child)::after { content: ''; position: absolute; left: 27px; top: 58px; bottom: -10px; width: 4px; background: #f3d98a; border-radius: 2px; }
  .ficha .etapa b { display: block; font-size: 18px; margin-top: 4px; }
  .ficha .etapa span { font-size: 17px; line-height: 1.3; }
  .ficha .cur { background: #fff; border-radius: 18px; padding: 12px 14px; margin-bottom: 10px; font-size: 18px; line-height: 1.35; box-shadow: 0 3px 0 var(--line, #f0e2c4); display: flex; gap: 10px; }
  .ficha .cur::before { content: '💡'; font-size: 22px; }
  .ficha header .em img { width: 54px; height: 54px; border-radius: 50%; object-fit: cover; display: block; border: 3px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,.15); }
  .ficha .real-fotos { display: flex; gap: 10px; overflow-x: auto; scroll-snap-type: x mandatory; margin: 0 -16px 10px; padding: 0 16px 6px; scrollbar-width: none; }
  .ficha .real-fotos figure { margin: 0; flex: none; width: min(78vw, 360px); scroll-snap-align: center; }
  .ficha .real-fotos img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 20px; display: block; background: var(--line, #f0e6d4); }
  .ficha .real-fotos figcaption, .ficha .cred { font-size: 12px; opacity: .65; line-height: 1.25; margin-top: 3px; }
  .ficha .stat { background: var(--color-accent-soft, #fff1c4); border-radius: 18px; padding: 10px 14px; font-size: 17px; line-height: 1.3; margin-bottom: 10px; }
  .ficha .stat b { font-size: 22px; }
  .ficha h4 { margin: 14px 0 6px; font-size: 18px; }
  .ficha .arvore { list-style: none; margin: 0; padding: 0; }
  .ficha .arvore li { display: flex; gap: 10px; align-items: baseline; padding: 5px 0 5px 10px; border-left: 4px solid #f3d98a; margin-left: calc(var(--n) * 10px); }
  .ficha .arvore small { font-size: 13px; font-weight: 800; opacity: .6; width: 62px; flex: none; }
  .ficha .arvore span { font-size: 16px; line-height: 1.25; }
  .ficha .arvore i { opacity: .7; }
  .ficha .btn:first-child { margin-top: 2px; }
  .ficha .btn { display: block; text-align: center; text-decoration: none; background: var(--color-accent, #ffd23f); color: var(--text, #4a2a12); border-radius: 999px; padding: 10px 16px; font-weight: 800; font-size: 18px; margin: 14px 0 6px; }
  .ficha details { background: #fff; border-radius: 18px; padding: 10px 14px; margin-top: 12px; box-shadow: 0 3px 0 var(--line, #f0e2c4); }
  .ficha summary { font-weight: 800; font-size: 16px; cursor: pointer; }
  .ficha details p { font-size: 16px; line-height: 1.4; margin: 8px 0 4px; }
  .ficha .aviso { opacity: .75; font-size: 16px; padding: 8px 0; }
  .ficha .selos { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
  .ficha .selos span { font-size: 14px; font-weight: 800; background: #fff; border: 2px solid var(--line, #f0e2c4); border-radius: 999px; padding: 1px 10px; opacity: .45; }
  .ficha .som { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; min-height: 48px; margin: 4px 0 2px; border-radius: 999px; border: 0; background: var(--color-nature, #164A3A); color: #fff; font: inherit; font-weight: 800; font-size: 17px; cursor: pointer; }
  .ficha .som.tocando { background: var(--color-primary, #2F8A47); }
  .ficha .som-cred { text-align: center; margin-bottom: 8px; }
  .ficha .silencio { background: var(--bg, #fff8e8); border-radius: 16px; padding: 10px 14px; margin: 4px 0 10px; font-size: 16px; line-height: 1.35; }
  .ficha .vi { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; min-height: 48px; margin: 4px 0 12px; border-radius: 999px; border: 2px dashed var(--color-primary, #c9a227); background: transparent; font: inherit; font-weight: 800; font-size: 17px; color: var(--color-nature, #4a2a12); cursor: pointer; }
  .ficha .vi.ok { border-style: solid; background: var(--color-primary-soft, #fff1c4); }
  .ficha .selos span.ok { opacity: 1; background: var(--color-accent-soft, #fff1c4); border-color: var(--color-accent, #ffd23f); }
  .tool.ficha-tool button { background: #fff !important; }
  @media (min-width: 900px) and (orientation: landscape) {
    .ficha { left: auto; right: 16px; bottom: 16px; top: 16px; width: 420px; max-height: none; border-radius: 28px; transform: translateX(120%); }
    .ficha.on { transform: none; }
    .ficha .grab { display: none; }
  }`;
  let audio = null;
  let A = null, casta = null, aba = 'ficha', el = null, back = null;

  function montar() {
    if (el) return;
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    back = document.createElement('div'); back.className = 'ficha-back';
    el = document.createElement('section'); el.className = 'ficha'; el.setAttribute('aria-label', 'Ficha da espécie');
    el.innerHTML = '<div class="grab"></div><header><span class="em"></span><div><h2></h2><i></i></div><button aria-label="Fechar">✕</button></header>' +
      '<nav><button data-a="ficha">📋 Ficha</button><button data-a="vida">🔄 Vida</button><button data-a="cur">💡 Sabia?</button><button data-a="real">📷 Real</button></nav><div class="body"></div>';
    document.body.append(back, el);
    el.querySelector('header button').addEventListener('click', fechar);
    back.addEventListener('click', fechar);
    el.querySelectorAll('nav button').forEach((b) => b.addEventListener('click', () => { aba = b.dataset.a; render(); }));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fechar(); });
    // arrastar para baixo fecha (celular)
    let y0 = null;
    el.addEventListener('touchstart', (e) => { if (el.querySelector('.body').scrollTop <= 0 && !e.target.closest('.real-fotos')) y0 = e.touches[0].clientY; }, { passive: true });
    el.addEventListener('touchmove', (e) => { if (y0 !== null && e.touches[0].clientY - y0 > 70) { y0 = null; fechar(); } }, { passive: true });
    el.addEventListener('touchend', () => { y0 = null; });
  }
  function animal(id) {
    const novo = ANIMAIS.find((a) => a.id === id);
    if (!novo) return false;
    if (novo !== A) { A = novo; casta = null; aba = 'ficha'; }
    el.querySelector('header .em').textContent = A.emoji;
    el.querySelector('header h2').textContent = A.nome;
    el.querySelector('header i').textContent = A.cientifico;
    if (typeof Dados !== 'undefined') {
      const quem = A;
      Dados.foto(A).then((f) => {
        if (quem !== A) return;
        const img = new Image(); img.alt = A.nome; img.src = f.mini || f.url;
        img.onload = () => { if (quem === A) el.querySelector('header .em').replaceChildren(img); };
      }).catch(() => {});
    }
    return true;
  }
  function criar(id, opts) {
    montar();
    if (!animal(id)) return;
    // botão ℹ️ na barra de ferramentas
    const tools = (!opts || opts.botao !== false) && document.querySelector('.tools');
    if (tools && !tools.querySelector('.ficha-tool')) {
      const t = document.createElement('div');
      t.className = 'tool ficha-tool';
      t.innerHTML = '<button aria-label="Ficha da espécie">ℹ️</button><span>ficha</span>';
      t.querySelector('button').addEventListener('click', () => abrir());
      tools.prepend(t);
    }
    render();
  }
  function linhas(list) {
    return list.map(([ic, t, s]) => '<div class="row"><div class="ic">' + ic + '</div><div><b>' + t + '</b><span>' + s + '</span></div></div>').join('');
  }
  function render() {
    if (!el) return;
    el.querySelectorAll('nav button').forEach((b) => b.classList.toggle('on', b.dataset.a === aba));
    let h = '';
    if (aba === 'ficha') {
      const C = A.castas && casta && A.castas[casta];
      // no catálogo, leva para a experiência 3D (dentro dela, não precisa)
      if (A.pagina && !location.pathname.endsWith('/' + A.pagina)) h += '<a class="btn" href="' + A.pagina + '">▶ Explorar ' + A.nome + ' em 3D</a>';
      // som do bicho (gravação real) ou curiosidade sobre o silêncio
      if (A.som) h += '<button class="som" type="button" data-som>🔊 Ouvir ' + (A.art || 'a') + ' ' + (A.curto || A.nome.toLowerCase()) + '</button><div class="cred som-cred">Som: ' + A.som.autor + ' · ' + A.som.lic + ' · ' + A.som.fonte + '</div>';
      else if (A.silencio) h += '<div class="silencio">🤫 ' + A.silencio + '</div>';
      // encontrar no mundo real (sem foto, sem dados: só marca neste aparelho)
      if (typeof Progresso !== 'undefined') { const v = Progresso.vezes(A.id);
        h += '<button class="vi' + (v ? ' ok' : '') + '" type="button" data-vi>' + (v ? '👀 Encontrei outr' + (A.art === 'o' ? 'o' : 'a') + '! (' + v + (v === 1 ? ' observação' : ' observações') + ')' : '👀 Encontrei um de verdade!') + '</button>'; }
      if (C) h += '<div class="casta"><h3>' + C.emoji + ' ' + C.nome + '</h3>' + linhas(C.linhas) + '</div>';
      h += linhas(A.ficha);
    } else if (aba === 'vida') {
      h = '<div class="ciclo">' + A.ciclo.map(([e, t, s]) => '<div class="etapa"><div class="bola">' + e + '</div><div><b>' + t + '</b><span>' + s + '</span></div></div>').join('') + '</div>';
    } else if (aba === 'cur') {
      h = A.curiosidades.map((c) => '<div class="cur">' + c + '</div>').join('');
    } else {
      h = real();
    }
    const body = el.querySelector('.body');
    body.innerHTML = h; body.scrollTop = 0;
    if (aba === 'real') carregarReal();
    const bs = body.querySelector('[data-som]');
    if (bs) bs.addEventListener('click', () => {
      if (!audio || audio.dataset.id !== A.id) { if (audio) audio.pause(); audio = new Audio(A.som.arquivo); audio.dataset.id = A.id; audio.onended = () => bs.classList.remove('tocando'); }
      if (audio.paused) { audio.currentTime = 0; audio.play().catch(() => {}); bs.classList.add('tocando'); } else { audio.pause(); bs.classList.remove('tocando'); }
    });
    const vi = body.querySelector('[data-vi]');
    if (vi) vi.addEventListener('click', () => { Progresso.marcar(A.id, 'vi'); render(); document.dispatchEvent(new Event('ficha-mudou')); });
    // a estrela de "Real" só vem quando uma foto aparece de verdade (ver carregarReal)
    if (aba !== 'real' && el.classList.contains('on') && typeof Progresso !== 'undefined') Progresso.marcar(A.id, aba);
  }
  const soLetras = (t) => t.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  function selos() {
    if (typeof Progresso === 'undefined') return '';
    return '<div class="selos" aria-label="Descobertas">' + Progresso.itens(A).map((x) =>
      '<span class="' + (Progresso.feito(A.id, x[0]) ? 'ok' : '') + '">' + x[1] + ' ' + x[2] + '</span>').join('') + '</div>';
  }
  // aba "Real": parte fixa (dados do catálogo) + parte que chega da internet
  function real() {
    const C = A.comp || {};
    let h = '<div class="real-fotos" id="fr"><figure><img alt=""><figcaption>Buscando fotos de verdade…</figcaption></figure></div>';
    h += '<div id="obs"></div>';
    if (C.iucn && IUCN[C.iucn]) h += '<div class="stat">' + IUCN[C.iucn][0] + ' Situação na natureza: <b>' + IUCN[C.iucn][1] + '</b> <span class="cred">(lista vermelha da IUCN)</span></div>';
    h += '<h4>🌳 Árvore da família</h4><ul class="arvore" id="arv">' + (C.tax || []).map((t, i) =>
      '<li style="--n:' + i + '"><small>' + NIVEIS_TAX[i] + '</small><span>' + (NOMES_TAX[t] ? NOMES_TAX[t] + ' · <i>' + t + '</i>' : t) + '</span></li>').join('') + '</ul>';
    h += '<a class="btn" href="comparar.html?a=' + A.id + '">⚖️ Comparar com outro bicho</a>';
    h += '<details id="wk"><summary>👩‍🏫 Para adultos: o que diz a Wikipédia</summary><p>Carregando…</p></details>';
    return h + selos();
  }
  function carregarReal() {
    if (typeof Dados === 'undefined') return;
    const quem = A, $ = (s) => el.querySelector(s);
    const vivo = () => quem === A && aba === 'real';
    const semNet = '<figure><figcaption>Sem internet agora. As fotos aparecem quando o aparelho estiver conectado.</figcaption></figure>';
    const fotos = (lista) => {
      $('#fr').innerHTML = lista.map(fig).join('');
      const im = $('#fr img');
      if (im && typeof Progresso !== 'undefined') im.addEventListener('load', () => { if (vivo()) Progresso.marcar(quem.id, 'real'); }, { once: true });
    };
    const fig = (f) => '<figure><img loading="lazy" src="' + esc(f.url) + '" alt="Foto de ' + esc(A.nome) + '"><figcaption>' + (f.especie && f.especie !== A.cientifico ? '<i>' + esc(f.especie) + '</i> · ' : '') + '📷 ' + esc(f.autor) + (f.lic && soLetras(f.autor).indexOf(soLetras(f.lic)) < 0 ? ' · ' + esc(f.lic) : '') + '</figcaption></figure>';
    const locais = Dados.locais(A);
    if (locais.length) fotos(locais);
    Dados.taxon(A).then((t) => {
      if (!vivo()) return;
      if (t.obs) $('#obs').innerHTML = '<div class="stat">🔭 Pessoas do mundo todo já registraram este bicho <b>' + t.obs.toLocaleString('pt-BR') + '</b> vezes no iNaturalist.</div>';
      if (t.foto && !locais.length) fotos([t.foto]);
    }).catch(() => {});
    Dados.detalhe(A).then((d) => {
      if (!vivo()) return;
      if (d.fotos.length && !locais.length) fotos(d.fotos);
      if (d.arvore.length > 3) $('#arv').innerHTML = d.arvore.map((x, i) =>
        '<li style="--n:' + Math.min(i, 6) + '"><small>' + x.nivel + '</small><span>' + (x.comum ? esc(x.comum) + ' · ' : '') + '<i>' + esc(x.nome) + '</i></span></li>').join('');
    }).catch(() => { if (vivo() && !locais.length && !$('#fr img[src]')) Dados.foto(A).then((f) => { if (vivo()) fotos([f]); }).catch(() => { if (vivo()) $('#fr').innerHTML = semNet; }); });
    Dados.wiki(A).then((w) => {
      if (vivo() && w.texto) $('#wk').innerHTML = '<summary>👩‍🏫 Para adultos: o que diz a Wikipédia</summary><p>' + esc(w.texto) + '</p><div class="cred">Texto: Wikipédia em português (CC BY-SA 4.0).</div>';
    }).catch(() => { if (vivo()) $('#wk').remove(); });
  }
  function abrir(id) {
    if (id) { montar(); if (!animal(id)) return; }
    el.classList.add('on'); back.classList.add('on'); render();
  }
  function fechar() {
    if (!el.classList.contains('on')) return;
    el.classList.remove('on'); back.classList.remove('on');
    if (audio) audio.pause();
    document.dispatchEvent(new Event('ficha-fechou'));
  }
  return { criar, abrir, fechar, casta(c) { casta = c; render(); } };
})();
