/* =====================================================================
   ficha.js — gaveta "ℹ️ ficha" com informações da espécie
   Uso: Ficha.criar('abelha');   Ficha.casta('rainha');
   Coloca um botão ℹ️ na barra de ferramentas (.tools) e abre uma gaveta
   com 3 abas: Ficha, Vida (ciclo de vida) e Curiosidades.
   ===================================================================== */
const Ficha = (function () {
  const css = `
  .ficha-back { position: fixed; inset: 0; background: rgba(40,25,10,.35); opacity: 0; pointer-events: none; transition: opacity .25s; z-index: 40; }
  .ficha-back.on { opacity: 1; pointer-events: auto; }
  .ficha {
    position: fixed; z-index: 41; left: 50%; bottom: 0; transform: translate(-50%, 105%);
    width: min(640px, 100vw); max-height: min(78vh, 760px); display: flex; flex-direction: column;
    background: #fffaf0; color: #4a2a12; border-radius: 28px 28px 0 0; box-shadow: 0 -10px 40px rgba(0,0,0,.25);
    transition: transform .35s cubic-bezier(.25,1.2,.5,1); font-family: inherit;
    padding-bottom: env(safe-area-inset-bottom);
  }
  .ficha.on { transform: translate(-50%, 0); }
  .ficha .grab { width: 54px; height: 6px; border-radius: 3px; background: #e2d3b8; margin: 10px auto 2px; }
  .ficha header { display: flex; align-items: center; gap: 12px; padding: 4px 18px 8px; }
  .ficha header .em { font-size: 46px; line-height: 1; }
  .ficha header h2 { margin: 0; font-size: 26px; line-height: 1.05; }
  .ficha header i { font-size: 16px; opacity: .75; }
  .ficha header button { margin-left: auto; border: 0; background: #f0e6d4; border-radius: 50%; width: 44px; height: 44px; font-size: 20px; cursor: pointer; flex: none; }
  .ficha nav { display: flex; gap: 8px; padding: 0 16px 10px; }
  .ficha nav button { flex: 1; white-space: nowrap; font-size: clamp(14px, 3.9vw, 17px) !important; border: 3px solid #f0e2c4; background: #fff; border-radius: 999px; padding: 6px 4px; font: inherit; font-size: 17px; font-weight: 800; color: #4a2a12; cursor: pointer; }
  .ficha nav button.on { background: #ffd23f; border-color: #ffd23f; }
  .ficha .body { overflow-y: auto; -webkit-overflow-scrolling: touch; padding: 0 16px 18px; }
  .ficha .casta { background: #fff1c4; border-radius: 20px; padding: 10px 14px 6px; margin-bottom: 12px; }
  .ficha .casta h3 { margin: 0 0 4px; font-size: 19px; }
  .ficha .row { display: flex; gap: 12px; padding: 9px 2px; border-bottom: 1px solid #f0e6d4; }
  .ficha .row:last-child { border-bottom: 0; }
  .ficha .row .ic { font-size: 26px; width: 34px; text-align: center; flex: none; line-height: 1.2; }
  .ficha .row b { display: block; font-size: 16px; }
  .ficha .row span { font-size: 17px; line-height: 1.3; }
  .ficha .ciclo { position: relative; padding-left: 10px; }
  .ficha .etapa { display: flex; gap: 14px; align-items: flex-start; padding: 8px 0; position: relative; }
  .ficha .etapa .bola { width: 54px; height: 54px; border-radius: 50%; background: #fff1c4; display: grid; place-items: center; font-size: 30px; flex: none; z-index: 1; border: 3px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,.1); }
  .ficha .etapa:not(:last-child)::after { content: ''; position: absolute; left: 27px; top: 58px; bottom: -10px; width: 4px; background: #f3d98a; border-radius: 2px; }
  .ficha .etapa b { display: block; font-size: 18px; margin-top: 4px; }
  .ficha .etapa span { font-size: 17px; line-height: 1.3; }
  .ficha .cur { background: #fff; border-radius: 18px; padding: 12px 14px; margin-bottom: 10px; font-size: 18px; line-height: 1.35; box-shadow: 0 3px 0 #f0e2c4; display: flex; gap: 10px; }
  .ficha .cur::before { content: '💡'; font-size: 22px; }
  .tool.ficha-tool button { background: #fff !important; }
  @media (min-width: 900px) and (orientation: landscape) {
    .ficha { left: auto; right: 16px; bottom: 16px; top: 16px; width: 420px; max-height: none; border-radius: 28px; transform: translateX(120%); }
    .ficha.on { transform: none; }
    .ficha .grab { display: none; }
  }`;
  let A = null, casta = null, aba = 'ficha', el = null, back = null;

  function criar(id) {
    A = ANIMAIS.find((a) => a.id === id);
    if (!A) return;
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    back = document.createElement('div'); back.className = 'ficha-back';
    el = document.createElement('section'); el.className = 'ficha'; el.setAttribute('aria-label', 'Ficha da espécie');
    el.innerHTML = '<div class="grab"></div><header><span class="em">' + A.emoji + '</span><div><h2>' + A.nome + '</h2><i>' + A.cientifico +
      '</i></div><button aria-label="Fechar">✕</button></header><nav><button data-a="ficha">📋 Ficha</button><button data-a="vida">🔄 Vida</button><button data-a="cur">💡 Curiosidades</button></nav><div class="body"></div>';
    document.body.append(back, el);
    el.querySelector('header button').addEventListener('click', fechar);
    back.addEventListener('click', fechar);
    el.querySelectorAll('nav button').forEach((b) => b.addEventListener('click', () => { aba = b.dataset.a; render(); }));
    // arrastar para baixo fecha (celular)
    let y0 = null;
    el.addEventListener('touchstart', (e) => { if (el.querySelector('.body').scrollTop <= 0) y0 = e.touches[0].clientY; }, { passive: true });
    el.addEventListener('touchmove', (e) => { if (y0 !== null && e.touches[0].clientY - y0 > 70) { y0 = null; fechar(); } }, { passive: true });
    el.addEventListener('touchend', () => { y0 = null; });
    // botão ℹ️ na barra de ferramentas
    const tools = document.querySelector('.tools');
    if (tools) {
      const t = document.createElement('div');
      t.className = 'tool ficha-tool';
      t.innerHTML = '<button aria-label="Ficha da espécie">ℹ️</button><span>ficha</span>';
      t.querySelector('button').addEventListener('click', abrir);
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
      if (C) h += '<div class="casta"><h3>' + C.emoji + ' ' + C.nome + '</h3>' + linhas(C.linhas) + '</div>';
      h += linhas(A.ficha);
    } else if (aba === 'vida') {
      h = '<div class="ciclo">' + A.ciclo.map(([e, t, s]) => '<div class="etapa"><div class="bola">' + e + '</div><div><b>' + t + '</b><span>' + s + '</span></div></div>').join('') + '</div>';
    } else {
      h = A.curiosidades.map((c) => '<div class="cur">' + c + '</div>').join('');
    }
    const body = el.querySelector('.body');
    body.innerHTML = h; body.scrollTop = 0;
  }
  function abrir() { render(); el.classList.add('on'); back.classList.add('on'); }
  function fechar() { el.classList.remove('on'); back.classList.remove('on'); }
  return { criar, abrir, fechar, casta(c) { casta = c; render(); } };
})();
