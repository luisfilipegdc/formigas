/* =====================================================================
   progresso.js — o "Meu Bolso": bichos encontrados, descobertas e
   observações no mundo real, guardados só neste aparelho.
   Um bicho entra no bolso na primeira descoberta (ficha, 3D…).
   "vi" guarda QUANTAS vezes a criança encontrou o bicho de verdade.
   Sem contas, sem sequência de dias, sem nada que se perde: cada
   descoberta fica marcada para sempre (ou até apagar no catálogo).
   ===================================================================== */
const Progresso = (function () {
  const K = 'progresso1';
  let d = {};
  try { d = JSON.parse(localStorage.getItem(K)) || {}; } catch (e) {}
  function salvar() { try { localStorage.setItem(K, JSON.stringify(d)); } catch (e) {} }
  function itens(A) {
    const l = [];
    if (A.pagina) l.push(['3d', '🧊', 'Explorou em 3D']);
    l.push(['ficha', '📋', 'Leu a ficha'], ['vida', '🔄', 'Viu o ciclo de vida'], ['cur', '💡', 'Descobriu curiosidades'], ['real', '📷', 'Viu fotos de verdade']);
    if (A.visita) l.push(['casa', A.visita[0], A.visita[1]]);
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
      st.textContent = '.prog-toast{position:fixed;left:50%;top:max(14px,env(safe-area-inset-top));transform:translate(-50%,-160%);z-index:60;background:var(--surface,#fff);color:var(--text,#4a2a12);border:3px solid var(--color-primary,#ffd23f);border-radius:20px;padding:8px 18px;font:inherit;font-weight:800;font-size:17px;box-shadow:0 8px 24px rgba(0,0,0,.16);transition:transform .35s cubic-bezier(.25,1.3,.5,1);width:max-content;max-width:92vw;text-align:center;line-height:1.25;pointer-events:none}.prog-toast b{display:block;color:var(--color-nature,inherit);font-size:18px}.prog-toast.on{transform:translate(-50%,0)}';
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
  // a criança encontrou o bicho no mundo real (sem foto: só conta neste aparelho)
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
  function apagar() { d = {}; salvar(); }
  return { itens: itens, feito: feito, marcar: marcar, observar: observar, vezes: vezes, nivel: nivel, conta: conta, total: total, encontrados: encontrados, missaoCompleta: missaoCompleta, apagar: apagar };
})();
