/* =====================================================================
   progresso.js — o "Meu Bolso": bichos encontrados, descobertas e
   observações no mundo real.
   Sem conta: fica só neste aparelho. Com conta (entrou em /entrar):
   vai junto para a nuvem e aparece em todos os aparelhos. Num aparelho
   compartilhado, cada conta tem o seu bolso guardado separado.
   Um bicho entra no bolso na primeira descoberta (ficha, 3D…).
   "vi" guarda QUANTAS vezes a criança encontrou o bicho de verdade.
   Sem sequência de dias, sem nada que se perde: cada descoberta fica
   marcada para sempre (ou até esvaziar o bolso).
   ===================================================================== */
const Progresso = (function () {
  const BASE = 'progresso1';            // bolso sem conta
  const MARCA = 'progresso1:conta';     // conta da última sincronização neste aparelho
  const API = '/api/bolso';
  let contaId = null, sessao = null, envio = 0, ultimaSinc = 0;
  try { contaId = localStorage.getItem(MARCA); } catch (e) {}
  const chave = () => (contaId ? BASE + ':' + contaId : BASE);
  function ler(k) { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch (e) { return {}; } }
  let d = ler(chave());
  function gravarLocal() { try { localStorage.setItem(chave(), JSON.stringify(d)); } catch (e) {} }
  function salvar() {
    gravarLocal();
    if (contaId) { clearTimeout(envio); envio = setTimeout(enviar, 1200); }
  }
  // ---------- nuvem ----------
  const podeRede = () => !!window.fetch && location.protocol !== 'file:';
  function canon(o) { return JSON.stringify(Object.keys(o || {}).sort().map((id) => [id, Object.keys(o[id] || {}).sort().map((k) => [k, +o[id][k] || 0])])); }
  function juntar(a, b) {
    const r = {};
    [a, b].forEach((f) => Object.keys(f || {}).forEach((id) => {
      const o = (r[id] = r[id] || {});
      Object.keys(f[id] || {}).forEach((k) => { o[k] = Math.max(o[k] || 0, +f[id][k] || 0); });
    }));
    return r;
  }
  function avisarMudou() { try { document.dispatchEvent(new Event('progresso-sincronizado')); } catch (e) {} }
  function semConta() {
    contaId = null; sessao = null;
    try { localStorage.removeItem(MARCA); } catch (e) {}
    d = ler(BASE); avisarMudou();
  }
  function enviar() {
    if (!podeRede() || !contaId) return;
    fetch(API, { method: 'POST', credentials: 'same-origin', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bolso: d }) })
      .then((r) => { if (r.status === 401) semConta(); }).catch(() => {});
  }
  function sincronizar() {
    if (!podeRede()) return;
    ultimaSinc = Date.now();
    fetch(API, { credentials: 'same-origin' }).then((r) => (r.ok ? r.json() : null)).then((j) => {
      if (!j) return;
      if (!j.logado) { if (contaId) semConta(); return; }
      if (j.conta.id !== contaId) {
        // entrou numa conta neste aparelho: o que foi descoberto sem conta vai para ela (uma vez só)
        const semDono = contaId ? {} : d;
        contaId = j.conta.id;
        try { localStorage.setItem(MARCA, contaId); } catch (e) {}
        d = juntar(juntar(ler(chave()), semDono), j.bolso);
        if (Object.keys(semDono).length) try { localStorage.removeItem(BASE); } catch (e) {}
      } else d = juntar(d, j.bolso);
      sessao = { apelido: j.conta.apelido, pontos: j.pontos };
      gravarLocal();
      if (canon(d) !== canon(j.bolso)) enviar();
      avisarMudou(); // sempre: a tela mostra o apelido da conta mesmo sem bolso novo
    }).catch(() => {});
  }
  sincronizar();
  document.addEventListener('visibilitychange', () => { if (!document.hidden && Date.now() - ultimaSinc > 60000) sincronizar(); });
  function itens(A) {
    const l = [];
    if (A.pagina) l.push(['3d', '🧊', 'Explorou em 3D']);
    l.push(['ficha', '📋', 'Leu a ficha'], ['vida', '🔄', 'Viu o ciclo de vida'], ['cur', '💡', 'Descobriu curiosidades'], ['real', '📷', 'Viu fotos de verdade']);
    if (A.visita) l.push(['casa', A.visita[0], A.visita[1]]);
    if (A.porDentro) l.push(['dentro', '🧩', 'Explorou por dentro']);
    if (A.processo) l.push(['funciona', '▶️', 'Viu como funciona: ' + A.processo]);
    l.push(['vi', '👀', 'Encontrou um de verdade']);
    return l;
  }
  // níveis de explorador (pelo número de bichos no bolso)
  const NIVEIS = [[0, '🥚', 'Começando'], [1, '🌱', 'Curioso'], [3, '🔎', 'Observador'], [6, '🥾', 'Explorador'], [11, '🌿', 'Naturalista Mirim']];
  function nivel(n) {
    if (n === undefined) n = encontrados();
    let i = 0; while (i + 1 < NIVEIS.length && n >= NIVEIS[i + 1][0]) i++;
    const prox = NIVEIS[i + 1];
    return { emoji: NIVEIS[i][1], nome: NIVEIS[i][2], falta: prox ? prox[0] - n : 0, proximo: prox ? prox[2] : null };
  }
  function vezes(id) { return (d[id] && +d[id].vi) || 0; }
  function feito(id, k) { return !!(d[id] && d[id][k]); }
  let toastEl = null, toastT = 0;
  function aviso(txt) {
    if (!toastEl) {
      const st = document.createElement('style');
      st.textContent = '.prog-toast{position:fixed;left:50%;top:max(14px,env(safe-area-inset-top));transform:translate(-50%,-160%);z-index:60;background:var(--surface,#fff);color:var(--text,#4a2a12);border:3px solid var(--color-primary,#ffd23f);border-radius:20px;padding:8px 18px;font:inherit;font-weight:800;font-size:17px;box-shadow:0 8px 24px rgba(0,0,0,.16);opacity:0;visibility:hidden;transition:transform .35s cubic-bezier(.25,1.3,.5,1),opacity .25s,visibility .35s;width:max-content;max-width:92vw;text-align:center;line-height:1.25;pointer-events:none}.prog-toast b{display:block;color:var(--color-nature,inherit);font-size:18px}.prog-toast.on{transform:translate(-50%,0);opacity:1;visibility:visible}';
      document.head.appendChild(st);
      toastEl = document.createElement('div'); toastEl.className = 'prog-toast'; toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = txt; toastEl.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('on'), 2200);
  }
  function anunciar(A, novo, antes) {
    const n = encontrados(), nv = nivel(n);
    if (novo) {
      const subiu = nivel(n - 1).nome !== nv.nome;
      // completou uma coleção com este bicho?
      const col = typeof COLECOES !== 'undefined' && COLECOES.find((C) => C.bichos.indexOf(A.id) >= 0 && C.bichos.every((id) => { const B = ANIMAIS.find((x) => x.id === id); return B && conta(B).feitas > 0; }));
      if (col) { aviso('<b>🏅 Coleção completa!</b>' + col.emoji + ' ' + col.nome + ' · selo ' + col.selo); return true; }
      aviso('<b>🎉 Novo bicho no bolso!</b>' + A.nome + ' · ' + n + ' de ' + ANIMAIS.length + (subiu ? '<br>' + nv.emoji + ' Agora você é ' + nv.nome + '!' : ''));
      return true;
    }
    return false;
  }
  function marcar(id, k) {
    if (k === 'vi') return observar(id);
    if (feito(id, k)) return false;
    const A = ANIMAIS.find((a) => a.id === id);
    const it = A && itens(A).find((x) => x[0] === k);
    if (!it) return false;
    const novo = !d[id] || !Object.keys(d[id]).length;
    (d[id] = d[id] || {})[k] = 1; salvar();
    if (!anunciar(A, novo)) aviso('⭐ ' + it[1] + ' ' + it[2] + '!');
    return true;
  }
  // a criança encontrou o bicho no mundo real (sem foto: conta no bolso dela)
  function observar(id) {
    const A = ANIMAIS.find((a) => a.id === id);
    if (!A) return false;
    const novo = !d[id] || !Object.keys(d[id]).length;
    const n = vezes(id) + 1;
    (d[id] = d[id] || {}).vi = n; salvar();
    const missao = n === 1 && missaoCompleta(id);
    if (missao) aviso('<b>🏅 Missão completa!</b>' + missao.selo);
    else if (!anunciar(A, novo)) {
      const c = A.curto || A.nome.toLowerCase();
      aviso(n === 1 ? '<b>👀 Que olho de explorador!</b>Você encontrou ' + (A.art || 'a') + ' ' + c + ' de verdade.'
        : '<b>👀 Outr' + (A.art === 'o' ? 'o ' : 'a ') + c + '!</b>Esta é a sua ' + n + 'ª observação.');
    }
    return true;
  }
  function conta(A) { const l = itens(A); return { feitas: l.filter((x) => feito(A.id, x[0])).length, total: l.length }; }
  // missão que acabou de ser completada por este bicho (se houver)
  function missaoCompleta(id) {
    if (typeof MISSOES === 'undefined') return null;
    return MISSOES.find((m) => m.bichos.some((b) => b[0] === id) && m.bichos.every((b) => feito(b[0], 'vi'))) || null;
  }
  function encontrados() { return ANIMAIS.filter((A) => conta(A).feitas > 0).length; }
  function total() { return ANIMAIS.reduce((s, A) => s + conta(A).feitas, 0); }
  function apagar() {
    d = {}; gravarLocal();
    if (contaId && podeRede()) fetch(API, { method: 'DELETE', credentials: 'same-origin' }).catch(() => {});
  }
  return { itens: itens, feito: feito, marcar: marcar, observar: observar, vezes: vezes, nivel: nivel, conta: conta, total: total, encontrados: encontrados, missaoCompleta: missaoCompleta, apagar: apagar, sessao: () => sessao, sincronizar: sincronizar };
})();
