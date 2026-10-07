/* =====================================================================
   splash-bichos.js — bichos que passam pela splash de abertura
   Cada bicho = caminho (.voo, move pela tela) > balanço (.bal, sobe e
   desce) > desenho SVG com partes animadas (asas, pernas, carapaça).
   Para trocar um desenho por uma imagem realista, coloque o PNG em
   img/splash/<nome>.png e liste o nome em SplashBichos.imagens.
   ===================================================================== */
const SplashBichos = (function () {
  const SVG = {
    // borboleta-azul (Morpho helenor) vista de cima, voando para cima
    borboleta: '<svg viewBox="0 0 140 110"><defs>' +
      '<radialGradient id="sbMorpho" cx="78%" cy="58%" r="75%"><stop offset="0" stop-color="#9BE3FF"/><stop offset=".35" stop-color="#3FA9F5"/><stop offset=".7" stop-color="#1565D8"/><stop offset="1" stop-color="#0A2E7A"/></radialGradient>' +
      '<radialGradient id="sbMorpho2" cx="70%" cy="20%" r="80%"><stop offset="0" stop-color="#8ADBFF"/><stop offset=".45" stop-color="#2E8FEA"/><stop offset="1" stop-color="#0A2E7A"/></radialGradient>' +
      '<linearGradient id="sbBrilho" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#E6FAFF" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="sbCorpoB" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1A120C"/><stop offset=".5" stop-color="#5A4632"/><stop offset="1" stop-color="#1A120C"/></linearGradient></defs>' +
      '<g class="sb-asa-e">' +
      '<path d="M67 44 C56 22 34 6 14 6 C4 8 1 20 6 32 C12 46 30 56 52 58 C60 58 65 54 67 50 Z" fill="#160F0A"/>' +
      '<path d="M66 45 C56 26 37 13 20 13 C14 14 12 22 15 31 C20 43 34 51 52 53 C59 53 64 50 66 47 Z" fill="url(#sbMorpho)"/>' +
      '<path d="M64 46 C52 32 38 22 22 18 M64 48 C50 40 36 34 18 28 M63 50 C52 46 40 44 26 42" stroke="#0A2E7A" stroke-width=".8" opacity=".55" fill="none"/>' +
      '<path d="M60 40 C50 28 36 20 24 18 C34 24 46 32 56 44 Z" fill="url(#sbBrilho)"/>' +
      '<circle cx="11" cy="14" r="1.7" fill="#fff"/><circle cx="7" cy="21" r="1.5" fill="#fff"/><circle cx="7" cy="28" r="1.3" fill="#fff"/><circle cx="18" cy="9" r="1.3" fill="#fff"/>' +
      '<path d="M67 56 C54 58 36 64 30 78 C26 90 32 102 44 104 C52 104 58 98 62 88 C66 78 68 66 67 56 Z" fill="#160F0A"/>' +
      '<path d="M66 59 C55 61 40 67 35 79 C32 88 36 97 45 98 C51 98 56 93 59 85 C63 76 65 67 66 59 Z" fill="url(#sbMorpho2)"/>' +
      '<path d="M35 92 Q38 99 44 99 M31 84 Q32 90 35 92" stroke="#160F0A" stroke-width="2.2" fill="none" stroke-linecap="round"/>' +
      '<path d="M65 62 C58 72 50 84 42 94 M65 64 C62 76 58 88 52 98" stroke="#0A2E7A" stroke-width=".8" opacity=".5" fill="none"/></g>' +
      '<g class="sb-asa-d">' +
      '<path d="M73 44 C84 22 106 6 126 6 C136 8 139 20 134 32 C128 46 110 56 88 58 C80 58 75 54 73 50 Z" fill="#160F0A"/>' +
      '<path d="M74 45 C84 26 103 13 120 13 C126 14 128 22 125 31 C120 43 106 51 88 53 C81 53 76 50 74 47 Z" fill="url(#sbMorpho)"/>' +
      '<path d="M76 46 C88 32 102 22 118 18 M76 48 C90 40 104 34 122 28 M77 50 C88 46 100 44 114 42" stroke="#0A2E7A" stroke-width=".8" opacity=".55" fill="none"/>' +
      '<path d="M80 40 C90 28 104 20 116 18 C106 24 94 32 84 44 Z" fill="url(#sbBrilho)"/>' +
      '<circle cx="129" cy="14" r="1.7" fill="#fff"/><circle cx="133" cy="21" r="1.5" fill="#fff"/><circle cx="133" cy="28" r="1.3" fill="#fff"/><circle cx="122" cy="9" r="1.3" fill="#fff"/>' +
      '<path d="M73 56 C86 58 104 64 110 78 C114 90 108 102 96 104 C88 104 82 98 78 88 C74 78 72 66 73 56 Z" fill="#160F0A"/>' +
      '<path d="M74 59 C85 61 100 67 105 79 C108 88 104 97 95 98 C89 98 84 93 81 85 C77 76 75 67 74 59 Z" fill="url(#sbMorpho2)"/>' +
      '<path d="M105 92 Q102 99 96 99 M109 84 Q108 90 105 92" stroke="#160F0A" stroke-width="2.2" fill="none" stroke-linecap="round"/>' +
      '<path d="M75 62 C82 72 90 84 98 94 M75 64 C78 76 82 88 88 98" stroke="#0A2E7A" stroke-width=".8" opacity=".5" fill="none"/></g>' +
      '<path d="M70 38 C73 38 74 42 74 48 L73 88 C73 92 67 92 67 88 L66 48 C66 42 67 38 70 38 Z" fill="url(#sbCorpoB)"/>' +
      '<path d="M67 56 H73 M67 62 H73 M67 68 H73 M67 74 H73 M67 80 H73" stroke="#000" stroke-width=".7" opacity=".5"/>' +
      '<ellipse cx="70" cy="40" rx="5" ry="6" fill="#2A1E14"/><circle cx="70" cy="33" r="4.2" fill="#1A120C"/>' +
      '<circle cx="67.4" cy="32" r="1.6" fill="#3B2C1E"/><circle cx="72.6" cy="32" r="1.6" fill="#3B2C1E"/>' +
      '<path d="M68 30 C64 20 58 12 52 6 M72 30 C76 20 82 12 88 6" stroke="#1A120C" stroke-width="1.4" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="51.5" cy="5.5" rx="2.2" ry="2.8" fill="#1A120C"/><ellipse cx="88.5" cy="5.5" rx="2.2" ry="2.8" fill="#1A120C"/></svg>',
    // joaninha (Coccinella) vista de cima, andando para a direita
    joaninha: '<svg viewBox="0 0 80 64"><defs>' +
      '<radialGradient id="sbElitro" cx="38%" cy="32%" r="78%"><stop offset="0" stop-color="#FF8A6B"/><stop offset=".35" stop-color="#F0402A"/><stop offset=".8" stop-color="#B81B0C"/><stop offset="1" stop-color="#7A0D04"/></radialGradient>' +
      '<radialGradient id="sbPinta" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#3A3A3A"/><stop offset="1" stop-color="#0D0D0D"/></radialGradient>' +
      '<radialGradient id="sbPronoto" cx="40%" cy="40%" r="70%"><stop offset="0" stop-color="#2E2E2E"/><stop offset="1" stop-color="#0A0A0A"/></radialGradient>' +
      '<linearGradient id="sbAsaMembrana" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E9F4FB" stop-opacity=".85"/><stop offset="1" stop-color="#C9DEEB" stop-opacity=".45"/></linearGradient></defs>' +
      '<ellipse cx="38" cy="58" rx="22" ry="3.5" fill="#000" opacity=".18"/>' +
      '<g class="sb-pernas" stroke="#141414" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none">' +
      '<path d="M28 18 L24 10 L19 7"/><path d="M38 16 L38 7 L35 3"/><path d="M48 18 L52 10 L57 8"/>' +
      '<path d="M28 46 L24 54 L19 57"/><path d="M38 48 L38 57 L35 61"/><path d="M48 46 L52 54 L57 56"/></g>' +
      '<g class="sb-asas-voo"><path d="M44 30 C30 14 12 6 2 10 C8 18 22 26 40 30 Z" fill="url(#sbAsaMembrana)"/><path d="M40 29 C28 20 16 13 6 11" stroke="#9FB8C8" stroke-width=".7" fill="none"/>' +
      '<path d="M44 34 C30 50 12 58 2 54 C8 46 22 38 40 34 Z" fill="url(#sbAsaMembrana)"/><path d="M40 35 C28 44 16 51 6 53" stroke="#9FB8C8" stroke-width=".7" fill="none"/></g>' +
      '<ellipse cx="38" cy="32" rx="23" ry="20" fill="#121212"/>' +
      '<g class="sb-elitro-a"><path d="M59 32 C59 18 48 11 36 11 C22 11 14 21 14 32 Z" fill="url(#sbElitro)"/>' +
      '<ellipse cx="28" cy="21" rx="4.2" ry="3.6" fill="url(#sbPinta)"/><ellipse cx="44" cy="19" rx="3.4" ry="3" fill="url(#sbPinta)"/><ellipse cx="20" cy="28" rx="2.6" ry="2.3" fill="url(#sbPinta)"/>' +
      '<path d="M22 15 C28 12 36 12 42 14" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".55" fill="none"/></g>' +
      '<g class="sb-elitro-b"><path d="M59 32 C59 46 48 53 36 53 C22 53 14 43 14 32 Z" fill="url(#sbElitro)"/>' +
      '<ellipse cx="28" cy="43" rx="4.2" ry="3.6" fill="url(#sbPinta)"/><ellipse cx="44" cy="45" rx="3.4" ry="3" fill="url(#sbPinta)"/><ellipse cx="20" cy="36" rx="2.6" ry="2.3" fill="url(#sbPinta)"/></g>' +
      '<path d="M14 32 H59" stroke="#5A0A03" stroke-width="1.2" opacity=".8"/>' +
      '<path d="M57 22 C66 21 70 27 70 32 C70 37 66 43 57 42 C59 36 59 28 57 22 Z" fill="url(#sbPronoto)"/>' +
      '<path d="M60 24 C64 24 66 27 65 29 C63 29 61 27 60 24 Z M60 40 C64 40 66 37 65 35 C63 35 61 37 60 40 Z" fill="#F5F0E6"/>' +
      '<path d="M69 27 C73 27 75 30 75 32 C75 34 73 37 69 37 Z" fill="#0D0D0D"/>' +
      '<circle cx="71.5" cy="28.6" r="1.2" fill="#F5F0E6"/><circle cx="71.5" cy="35.4" r="1.2" fill="#F5F0E6"/>' +
      '<path d="M74 29 L78 25 M74 35 L78 39" stroke="#141414" stroke-width="1.2" stroke-linecap="round"/></svg>',
    // aranha-saltadora vista de frente, descendo pelo fio (abdômen em cima)
    aranha: '<svg viewBox="0 0 110 120"><defs>' +
      '<radialGradient id="sbAbdomen" cx="45%" cy="38%" r="70%"><stop offset="0" stop-color="#6E5240"/><stop offset=".6" stop-color="#3A2A1E"/><stop offset="1" stop-color="#1B120B"/></radialGradient>' +
      '<radialGradient id="sbCefalo" cx="50%" cy="35%" r="75%"><stop offset="0" stop-color="#4A3628"/><stop offset="1" stop-color="#18100A"/></radialGradient>' +
      '<radialGradient id="sbOlho" cx="38%" cy="32%" r="70%"><stop offset="0" stop-color="#3B3B46"/><stop offset=".55" stop-color="#0B0B10"/><stop offset="1" stop-color="#000"/></radialGradient>' +
      '<linearGradient id="sbQuelicera" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3FD6A0"/><stop offset=".5" stop-color="#1D7A8C"/><stop offset="1" stop-color="#4B2E7A"/></linearGradient></defs>' +
      '<g class="sb-patas-a" stroke="#22170F" stroke-linecap="round" stroke-linejoin="round" fill="none">' +
      '<path d="M44 70 L26 60 L14 70 L8 84" stroke-width="4"/><path d="M66 70 L84 60 L96 70 L102 84" stroke-width="4"/>' +
      '<path d="M43 76 L22 74 L10 86 L6 100" stroke-width="3.2"/><path d="M67 76 L88 74 L100 86 L104 100" stroke-width="3.2"/></g>' +
      '<g class="sb-patas-b" stroke="#22170F" stroke-linecap="round" stroke-linejoin="round" fill="none">' +
      '<path d="M45 64 L30 48 L18 46 L10 52" stroke-width="3"/><path d="M65 64 L80 48 L92 46 L100 52" stroke-width="3"/>' +
      '<path d="M46 60 L36 38 L26 30 L18 30" stroke-width="2.8"/><path d="M64 60 L74 38 L84 30 L92 30" stroke-width="2.8"/></g>' +
      '<g stroke="#E8DCC8" stroke-width="1" stroke-linecap="round" opacity=".55">' +
      '<path d="M26 60 l-2 -3 M14 70 l-3 -1 M84 60 l2 -3 M96 70 l3 -1 M22 74 l-2 -3 M88 74 l2 -3"/></g>' +
      '<ellipse cx="55" cy="34" rx="20" ry="24" fill="url(#sbAbdomen)"/>' +
      '<path d="M55 14 C50 22 50 30 55 36 C60 30 60 22 55 14 Z" fill="#E9DCC4" opacity=".8"/>' +
      '<path d="M40 28 C44 34 44 42 40 48 M70 28 C66 34 66 42 70 48" stroke="#E9DCC4" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".7"/>' +
      '<circle cx="48" cy="44" r="2" fill="#E9DCC4" opacity=".75"/><circle cx="62" cy="44" r="2" fill="#E9DCC4" opacity=".75"/>' +
      '<ellipse cx="55" cy="74" rx="19" ry="17" fill="url(#sbCefalo)"/>' +
      '<path d="M38 66 C44 60 66 60 72 66" stroke="#F2E6D0" stroke-width="3" stroke-linecap="round" fill="none" opacity=".85"/>' +
      '<circle cx="47.5" cy="76" r="7" fill="url(#sbOlho)"/><circle cx="62.5" cy="76" r="7" fill="url(#sbOlho)"/>' +
      '<circle cx="45" cy="73.2" r="2.4" fill="#fff"/><circle cx="60" cy="73.2" r="2.4" fill="#fff"/><circle cx="49.5" cy="78.5" r=".9" fill="#fff" opacity=".7"/><circle cx="64.5" cy="78.5" r=".9" fill="#fff" opacity=".7"/>' +
      '<circle cx="38.8" cy="72" r="2.6" fill="url(#sbOlho)"/><circle cx="71.2" cy="72" r="2.6" fill="url(#sbOlho)"/><circle cx="38.2" cy="71.2" r=".8" fill="#fff"/><circle cx="70.6" cy="71.2" r=".8" fill="#fff"/>' +
      '<path d="M48.5 85 C48 90 50 94 53 95 L54 87 Z M61.5 85 C62 90 60 94 57 95 L56 87 Z" fill="url(#sbQuelicera)"/>' +
      '<path d="M45 84 C41 88 41 92 43 95 M65 84 C69 88 69 92 67 95" stroke="#2C1E14" stroke-width="3" stroke-linecap="round" fill="none"/>' +
      '<circle cx="43" cy="95.5" r="2.3" fill="#E9DCC4"/><circle cx="67" cy="95.5" r="2.3" fill="#E9DCC4"/></svg>'
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
