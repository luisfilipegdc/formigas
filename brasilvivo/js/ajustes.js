/* =====================================================================
   Terra Codex · Brasil Vivo · ajustes (preferências do aparelho)
   Ficam em localStorage 'terracodex-ajustes', separadas do progresso:
   não são dados da criança, são como o aparelho mostra o jogo.
   texto: 1 | 1.15 | 1.3   · volumes 0 a 1 · mudo · legendas de som
   calmo: menos movimento (null = seguir o sistema) · passo: mostrar o próximo passo
   ajuda: 'precisar' (seta e farol só quando a criança parece perdida ou pede)
          | 'sempre' | 'nunca' (modo explorador)
   ===================================================================== */
const Ajustes = (function () {
  const CHAVE = 'terracodex-ajustes';
  const padrao = { texto: 1, geral: 0.8, musica: 0.55, efeitos: 0.8, ambiente: 0.6, mudo: false, legendas: false, calmo: null, passo: true, ajuda: 'precisar' };
  let a = Object.assign({}, padrao);
  try { Object.assign(a, JSON.parse(localStorage.getItem(CHAVE)) || {}); } catch (e) {}
  const sistemaCalmo = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function aplicar() {
    document.documentElement.style.setProperty('--esc', a.texto);
    document.body.classList.toggle('calmo', a.calmo === null ? sistemaCalmo() : !!a.calmo);
    document.body.classList.toggle('sem-passo', !a.passo);
    if (window.Som) Som.configurar({ geral: a.geral, musica: a.musica, efeitos: a.efeitos, ambiente: a.ambiente, mudo: a.mudo });
  }
  function mudar(k, v) { a[k] = v; try { localStorage.setItem(CHAVE, JSON.stringify(a)); } catch (e) {} aplicar(); }
  return { get valores() { return a; }, mudar, aplicar, calmo: () => (a.calmo === null ? sistemaCalmo() : !!a.calmo) };
})();
