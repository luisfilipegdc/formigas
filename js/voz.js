/* =====================================================================
   voz.js — o bicho fala com a criança (síntese de voz do aparelho, pt-BR)
   Nada é gravado nem enviado: usa só a voz que já vem no celular/tablet.
   Voz.falar(texto, { forcar, fim }) · Voz.calar() · Voz.ligada · Voz.alternar() · Voz.existe
   Preferência guardada em localStorage 'bnb-voz' ('0' = desligada).
   ===================================================================== */
const Voz = (function () {
  const S = window.speechSynthesis, existe = !!(S && window.SpeechSynthesisUtterance);
  let ligada = true; try { ligada = localStorage.getItem('bnb-voz') !== '0'; } catch (e) {}
  let voz = null, ultimo = '';
  function escolher() {
    if (!existe) return;
    const vs = S.getVoices().filter((v) => /^pt/i.test(v.lang));
    voz = vs.find((v) => /pt[-_]BR/i.test(v.lang) && /google|luciana|francisca|natural/i.test(v.name)) || vs.find((v) => /pt[-_]BR/i.test(v.lang)) || vs[0] || null;
  }
  if (existe) { escolher(); S.addEventListener && S.addEventListener('voiceschanged', escolher); }
  // emojis viram silêncio; "R$" e números ficam com o leitor do aparelho
  const limpar = (t) => String(t || '').replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, '').replace(/\s+/g, ' ').trim();
  function falar(texto, o) {
    ultimo = texto;
    if (!existe || (!ligada && !(o && o.forcar))) return false;   // forcar: a pessoa pediu para ouvir (🔊)
    const t = limpar(texto); if (!t) return false;
    S.cancel();
    const u = new SpeechSynthesisUtterance(t);
    u.lang = 'pt-BR'; if (voz) u.voice = voz;
    u.rate = (o && o.rate) || 0.95; u.pitch = (o && o.pitch) || 1.3;
    if (o && o.fim) u.onend = o.fim;
    S.speak(u); return true;
  }
  function calar() { if (existe) S.cancel(); }
  function alternar() {
    ligada = !ligada; try { localStorage.setItem('bnb-voz', ligada ? '1' : '0'); } catch (e) {}
    if (!ligada) calar();
    document.dispatchEvent(new CustomEvent('voz-mudou', { detail: ligada }));
    return ligada;
  }
  return { falar, calar, alternar, repetir: () => falar(ultimo), get ligada() { return ligada; }, existe };
})();
