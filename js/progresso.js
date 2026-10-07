/* =====================================================================
   progresso.js — álbum de descobertas, guardado só neste aparelho.
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
    return l;
  }
  function feito(id, k) { return !!(d[id] && d[id][k]); }
  let toastEl = null, toastT = 0;
  function aviso(txt) {
    if (!toastEl) {
      const st = document.createElement('style');
      st.textContent = '.prog-toast{position:fixed;left:50%;top:max(14px,env(safe-area-inset-top));transform:translate(-50%,-150%);z-index:60;background:#fff;color:#4a2a12;border-radius:999px;padding:8px 18px;font:inherit;font-weight:800;font-size:17px;box-shadow:0 8px 24px rgba(0,0,0,.18);transition:transform .35s cubic-bezier(.25,1.3,.5,1);white-space:nowrap;pointer-events:none}.prog-toast.on{transform:translate(-50%,0)}';
      document.head.appendChild(st);
      toastEl = document.createElement('div'); toastEl.className = 'prog-toast'; toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = txt; toastEl.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('on'), 2200);
  }
  function marcar(id, k) {
    if (feito(id, k)) return false;
    const A = ANIMAIS.find((a) => a.id === id);
    const it = A && itens(A).find((x) => x[0] === k);
    if (!it) return false;
    (d[id] = d[id] || {})[k] = 1; salvar();
    aviso('⭐ ' + it[1] + ' ' + it[2] + '!');
    return true;
  }
  function conta(A) { const l = itens(A); return { feitas: l.filter((x) => feito(A.id, x[0])).length, total: l.length }; }
  function total() { return ANIMAIS.reduce((s, A) => s + conta(A).feitas, 0); }
  function apagar() { d = {}; salvar(); }
  return { itens: itens, feito: feito, marcar: marcar, conta: conta, total: total, apagar: apagar };
})();
