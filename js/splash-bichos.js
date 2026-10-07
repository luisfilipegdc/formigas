/* =====================================================================
   splash-bichos.js — bichos que passam pela splash de abertura
   Cada bicho = caminho (.voo, move pela tela) > balanço (.bal, sobe e
   desce) > desenho SVG com partes animadas (asas, pernas, carapaça).
   Para trocar um desenho por uma imagem realista, coloque o PNG em
   img/splash/<nome>.png e liste o nome em SplashBichos.imagens.
   ===================================================================== */
const SplashBichos = (function () {
  const SVG = {
    // borboleta-azul (Morpho) vista de cima, voando para cima
    borboleta: '<svg viewBox="0 0 120 100"><defs>' +
      '<radialGradient id="sbMorpho" cx="50%" cy="50%" r="60%"><stop offset="0" stop-color="#6EC6FF"/><stop offset=".55" stop-color="#1E88E5"/><stop offset="1" stop-color="#0B3D91"/></radialGradient></defs>' +
      '<g class="sb-asa-e">' +
      '<path d="M58 44 C44 18 18 6 6 16 C0 30 10 46 30 52 C42 54 52 52 58 48 Z" fill="#2B1B10"/>' +
      '<path d="M57 44 C44 22 22 12 11 19 C7 30 15 43 31 48 C42 50 51 49 57 46 Z" fill="url(#sbMorpho)"/>' +
      '<path d="M58 52 C44 56 26 62 22 76 C24 90 40 94 52 82 C56 74 58 62 58 52 Z" fill="#2B1B10"/>' +
      '<path d="M57 54 C45 58 30 64 27 76 C29 86 41 89 50 80 C54 73 56 63 57 54 Z" fill="url(#sbMorpho)"/>' +
      '<circle cx="12" cy="20" r="1.6" fill="#fff"/><circle cx="9" cy="27" r="1.3" fill="#fff"/></g>' +
      '<g class="sb-asa-d">' +
      '<path d="M62 44 C76 18 102 6 114 16 C120 30 110 46 90 52 C78 54 68 52 62 48 Z" fill="#2B1B10"/>' +
      '<path d="M63 44 C76 22 98 12 109 19 C113 30 105 43 89 48 C78 50 69 49 63 46 Z" fill="url(#sbMorpho)"/>' +
      '<path d="M62 52 C76 56 94 62 98 76 C96 90 80 94 68 82 C64 74 62 62 62 52 Z" fill="#2B1B10"/>' +
      '<path d="M63 54 C75 58 90 64 93 76 C91 86 79 89 70 80 C66 73 64 63 63 54 Z" fill="url(#sbMorpho)"/>' +
      '<circle cx="108" cy="20" r="1.6" fill="#fff"/><circle cx="111" cy="27" r="1.3" fill="#fff"/></g>' +
      '<ellipse cx="60" cy="54" rx="3.4" ry="22" fill="#2B1B10"/><circle cx="60" cy="31" r="4" fill="#2B1B10"/>' +
      '<path d="M58 28 C54 18 50 12 46 8 M62 28 C66 18 70 12 74 8" stroke="#2B1B10" stroke-width="1.6" fill="none"/>' +
      '<circle cx="46" cy="8" r="1.8" fill="#2B1B10"/><circle cx="74" cy="8" r="1.8" fill="#2B1B10"/></svg>',

    // joaninha vista de cima (andando para a direita)
    joaninha: '<svg viewBox="0 0 70 60"><defs>' +
      '<radialGradient id="sbElitro" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#FF6B57"/><stop offset=".6" stop-color="#E02E1B"/><stop offset="1" stop-color="#9E1408"/></radialGradient></defs>' +
      '<g class="sb-pernas"><path d="M22 14 L16 4 M34 12 L34 2 M46 14 L52 4 M22 46 L16 56 M34 48 L34 58 M46 46 L52 56" stroke="#1A1A1A" stroke-width="2.4" stroke-linecap="round"/></g>' +
      '<g class="sb-asas-voo"><ellipse cx="22" cy="12" rx="20" ry="8" fill="#E9F2FA" opacity=".7" transform="rotate(-20 22 12)"/>' +
      '<ellipse cx="22" cy="48" rx="20" ry="8" fill="#E9F2FA" opacity=".7" transform="rotate(20 22 48)"/></g>' +
      '<ellipse cx="34" cy="30" rx="22" ry="19" fill="#1A1A1A"/>' +
      '<g class="sb-elitro-a"><path d="M56 30 C56 16 44 11 33 11 C20 11 12 20 12 30 Z" fill="url(#sbElitro)"/>' +
      '<circle cx="26" cy="21" r="3.6" fill="#1A1A1A"/><circle cx="40" cy="19" r="3" fill="#1A1A1A"/><circle cx="18" cy="27" r="2.4" fill="#1A1A1A"/></g>' +
      '<g class="sb-elitro-b"><path d="M56 30 C56 44 44 49 33 49 C20 49 12 40 12 30 Z" fill="url(#sbElitro)"/>' +
      '<circle cx="26" cy="39" r="3.6" fill="#1A1A1A"/><circle cx="40" cy="41" r="3" fill="#1A1A1A"/><circle cx="18" cy="33" r="2.4" fill="#1A1A1A"/></g>' +
      '<path d="M54 22 C64 22 66 38 54 38 Z" fill="#1A1A1A"/><circle cx="60" cy="24" r="2.2" fill="#fff"/><circle cx="60" cy="36" r="2.2" fill="#fff"/>' +
      '<path d="M62 26 L68 22 M62 34 L68 38" stroke="#1A1A1A" stroke-width="1.4"/>' +
      '<ellipse cx="26" cy="20" rx="6" ry="3" fill="#fff" opacity=".35" transform="rotate(-20 26 20)"/></svg>',

    // aranha vista de cima, pendurada no fio (cabeça para baixo)
    aranha: '<svg viewBox="0 0 80 90"><defs>' +
      '<radialGradient id="sbAbdomen" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#6B4A35"/><stop offset=".6" stop-color="#3E2A1D"/><stop offset="1" stop-color="#1F140C"/></radialGradient></defs>' +
      '<g class="sb-patas-a" stroke="#2A1C12" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none">' +
      '<path d="M34 50 L20 40 L8 46"/><path d="M33 56 L16 56 L5 66"/><path d="M46 50 L60 40 L72 46"/><path d="M47 56 L64 56 L75 66"/></g>' +
      '<g class="sb-patas-b" stroke="#2A1C12" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none">' +
      '<path d="M34 60 L18 70 L12 84"/><path d="M36 64 L26 78 L24 89"/><path d="M46 60 L62 70 L68 84"/><path d="M44 64 L54 78 L56 89"/></g>' +
      '<ellipse cx="40" cy="34" rx="15" ry="18" fill="url(#sbAbdomen)"/>' +
      '<path d="M40 22 L36 30 L40 38 L44 30 Z" fill="#C9A27A" opacity=".55"/><circle cx="34" cy="40" r="1.6" fill="#C9A27A" opacity=".6"/><circle cx="46" cy="40" r="1.6" fill="#C9A27A" opacity=".6"/>' +
      '<ellipse cx="40" cy="58" rx="9" ry="8" fill="#3E2A1D"/>' +
      '<circle cx="37" cy="63" r="2.2" fill="#111"/><circle cx="43" cy="63" r="2.2" fill="#111"/><circle cx="37.6" cy="62.4" r=".7" fill="#fff"/><circle cx="43.6" cy="62.4" r=".7" fill="#fff"/>' +
      '<circle cx="34" cy="60" r="1.1" fill="#111"/><circle cx="46" cy="60" r="1.1" fill="#111"/>' +
      '<path d="M37 66 L36 70 M43 66 L44 70" stroke="#2A1C12" stroke-width="2" stroke-linecap="round"/></svg>'
  };
  // nomes que já têm imagem realista em img/splash/<nome>.png (preencha quando chegarem)
  const imagens = [];
  function bicho(nome) {
    const arte = imagens.indexOf(nome) >= 0 ? '<img src="img/splash/' + nome + '.png" alt="">' : SVG[nome];
    const fio = nome === 'aranha' ? '<span class="fio"></span>' : '';
    return '<div class="voo voo-' + nome + '">' + fio + '<div class="bal bal-' + nome + '">' + arte + '</div></div>';
  }
  function html(rapida) {
    return (rapida ? ['borboleta'] : ['aranha', 'borboleta', 'joaninha']).map(bicho).join('');
  }
  return { html: html, imagens: imagens };
})();
