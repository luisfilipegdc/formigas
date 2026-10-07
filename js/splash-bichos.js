/* =====================================================================
   splash-bichos.js — bichos que passam pela splash de abertura
   Cada bicho = caminho (.voo, move pela tela) > balanço (.bal, sobe e
   desce) > desenho SVG com partes animadas (asas, pernas, carapaça).
   Para trocar um desenho por uma imagem realista, coloque o PNG em
   img/splash/<nome>.png e liste o nome em SplashBichos.imagens.
   ===================================================================== */
const SplashBichos = (function () {
  const SVG = {
    // bem-te-vi de perfil (voando para a direita)
    passaro: '<svg viewBox="0 0 140 90"><defs>' +
      '<linearGradient id="sbBarriga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE14D"/><stop offset="1" stop-color="#F2B705"/></linearGradient>' +
      '<linearGradient id="sbCostas" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8A6A45"/><stop offset="1" stop-color="#5E4428"/></linearGradient></defs>' +
      '<g class="sb-asa sb-asa-fundo"><path d="M62 38 C50 14 30 4 14 6 C26 16 38 28 46 42 Z" fill="#4A3520"/></g>' +
      '<path d="M18 50 L2 44 L4 52 L1 58 L20 56 Z" fill="#5E4428"/>' +
      '<ellipse cx="62" cy="50" rx="44" ry="20" fill="url(#sbCostas)"/>' +
      '<path d="M30 54 C48 74 86 74 104 54 C96 66 84 70 66 70 C50 70 38 64 30 54 Z" fill="url(#sbBarriga)"/>' +
      '<path d="M40 52 C60 66 92 64 106 50 C100 62 80 70 62 68 C50 66 44 60 40 52 Z" fill="#FFD52E"/>' +
      '<circle cx="104" cy="38" r="17" fill="#1E1E1E"/>' +
      '<path d="M90 34 C98 28 112 27 121 33 C112 32 100 33 92 38 Z" fill="#FAFAFA"/>' +
      '<path d="M92 44 C100 50 110 52 118 48 C112 56 98 56 92 50 Z" fill="#FAFAFA"/>' +
      '<path d="M98 22 L104 26 L100 28 Z" fill="#F2B705"/>' +
      '<circle cx="110" cy="38" r="2.4" fill="#000"/><circle cx="110.8" cy="37.2" r=".8" fill="#fff"/>' +
      '<path d="M119 37 L138 41 L119 44 Z" fill="#222"/>' +
      '<g class="sb-asa sb-asa-frente"><path d="M64 44 C54 18 34 6 16 8 C24 18 30 22 34 30 C40 42 48 48 58 50 Z" fill="#7A5A36"/>' +
      '<path d="M22 12 C34 14 44 22 52 34 M30 10 C42 14 52 24 58 38" stroke="#4A3520" stroke-width="2" fill="none"/></g></svg>',

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

    // abelha de perfil (voando para a direita)
    abelha: '<svg viewBox="0 0 90 70"><defs>' +
      '<linearGradient id="sbPelo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E0A84A"/><stop offset="1" stop-color="#9C6A1E"/></linearGradient>' +
      '<clipPath id="sbAbd"><ellipse cx="28" cy="40" rx="22" ry="15"/></clipPath></defs>' +
      '<g class="sb-asa-abelha"><ellipse cx="44" cy="18" rx="16" ry="9" fill="#E8F4FF" opacity=".75" transform="rotate(-25 44 18)"/>' +
      '<ellipse cx="34" cy="20" rx="12" ry="7" fill="#E8F4FF" opacity=".6" transform="rotate(-40 34 20)"/></g>' +
      '<path d="M44 46 L40 60 M50 47 L50 61 M56 46 L60 59" stroke="#3A2A14" stroke-width="2.2" stroke-linecap="round"/>' +
      '<g clip-path="url(#sbAbd)"><rect x="0" y="20" width="60" height="40" fill="#F2B233"/>' +
      '<rect x="12" y="20" width="6" height="40" fill="#2A1C0C"/><rect x="24" y="20" width="6" height="40" fill="#2A1C0C"/><rect x="36" y="20" width="5" height="40" fill="#2A1C0C"/></g>' +
      '<path d="M7 40 L1 41 L7 43 Z" fill="#2A1C0C"/>' +
      '<circle cx="52" cy="36" r="12" fill="url(#sbPelo)"/>' +
      '<circle cx="68" cy="38" r="9" fill="#2A1C0C"/><ellipse cx="70" cy="35" rx="4" ry="5" fill="#000"/>' +
      '<path d="M70 30 C72 22 76 18 80 16 M73 31 C78 26 83 24 87 24" stroke="#2A1C0C" stroke-width="1.6" fill="none"/>' +
      '<g class="sb-asa-abelha"><ellipse cx="50" cy="20" rx="18" ry="10" fill="#F4FAFF" opacity=".85" transform="rotate(-20 50 20)"/>' +
      '<path d="M36 22 C44 14 56 12 64 16" stroke="#B9D4EA" stroke-width="1" fill="none"/></g></svg>',

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

    // girafa de perfil (andando para a esquerda)
    girafa: '<svg viewBox="0 0 200 230"><defs>' +
      '<pattern id="sbManchas" width="72" height="72" patternUnits="userSpaceOnUse" patternTransform="scale(.62) rotate(8)"><rect width="72" height="72" fill="#F4DDAE"/><path transform="translate(0 0)" d="M3.2 12.7 L5.3 5.5 L11.8 3.6 L17.8 6.2 L22.0 14.0 L15.9 21.0 L9.1 21.1 Z" fill="#9C5221" stroke="#9C5221" stroke-width="2.4" stroke-linejoin="round"/><path transform="translate(0 72)" d="M3.2 12.7 L5.3 5.5 L11.8 3.6 L17.8 6.2 L22.0 14.0 L15.9 21.0 L9.1 21.1 Z" fill="#9C5221" stroke="#9C5221" stroke-width="2.4" stroke-linejoin="round"/><path transform="translate(72 0)" d="M3.2 12.7 L5.3 5.5 L11.8 3.6 L17.8 6.2 L22.0 14.0 L15.9 21.0 L9.1 21.1 Z" fill="#9C5221" stroke="#9C5221" stroke-width="2.4" stroke-linejoin="round"/><path transform="translate(72 72)" d="M3.2 12.7 L5.3 5.5 L11.8 3.6 L17.8 6.2 L22.0 14.0 L15.9 21.0 L9.1 21.1 Z" fill="#9C5221" stroke="#9C5221" stroke-width="2.4" stroke-linejoin="round"/><path transform="translate(0 0)" d="M38.6 4.5 L45.6 16.9 L36.3 21.6 L28.9 15.7 L29.8 7.3 Z" fill="#B0612A" stroke="#B0612A" stroke-width="2.4" stroke-linejoin="round"/><path transform="translate(0 72)" d="M38.6 4.5 L45.6 16.9 L36.3 21.6 L28.9 15.7 L29.8 7.3 Z" fill="#B0612A" stroke="#B0612A" stroke-width="2.4" stroke-linejoin="round"/><path transform="translate(-72 0)" d="M49.1 15.8 L49.3 8.9 L59.1 1.0 L63.8 2.8 L66.3 11.9 L59.8 18.5 Z" fill="#8A4319" stroke="#8A4319" stroke-width="2.4" stroke-linejoin="round"/><path transform="translate(-72 72)" d="M49.1 15.8 L49.3 8.9 L59.1 1.0 L63.8 2.8 L66.3 11.9 L59.8 18.5 Z" fill="#8A4319" stroke="#8A4319" stroke-width="2.4" stroke-linejoin="round"/><path transform="translate(0 0)" d="M49.1 15.8 L49.3 8.9 L59.1 1.0 L63.8 2.8 L66.3 11.9 L59.8 18.5 Z" fill="#8A4319" stroke="#8A4319" stroke-width="2.4" stroke-linejoin="round"/><path transform="translate(0 72)" d="M49.1 15.8 L49.3 8.9 L59.1 1.0 L63.8 2.8 L66.3 11.9 L59.8 18.5 Z" fill="#8A4319" stroke="#8A4319" stroke-width="2.4" stroke-linejoin="round"/><path transform="translate(0 0)" d="M15.8 46.1 L7.8 40.6 L6.4 37.0 L15.5 27.9 L20.4 28.9 L24.4 42.4 Z" fill="#A45A26" stroke="#A45A26" stroke-width="2.4" stroke-linejoin="round"/><path transform="translate(72 0)" d="M15.8 46.1 L7.8 40.6 L6.4 37.0 L15.5 27.9 L20.4 28.9 L24.4 42.4 Z" fill="#A45A26" stroke="#A45A26" stroke-width="2.4" stroke-linejoin="round"/><path transform="translate(0 0)" d="M49.8 35.4 L41.5 43.6 L31.5 40.5 L34.6 27.9 L43.2 26.3 Z" fill="#94491D" stroke="#94491D" stroke-width="2.4" stroke-linejoin="round"/><path transform="translate(-72 0)" d="M76.1 31.0 L69.8 43.5 L63.5 41.0 L59.0 36.4 L60.5 27.9 L74.1 27.3 Z" fill="#9C5221" stroke="#9C5221" stroke-width="2.4" stroke-linejoin="round"/><path transform="translate(0 0)" d="M76.1 31.0 L69.8 43.5 L63.5 41.0 L59.0 36.4 L60.5 27.9 L74.1 27.3 Z" fill="#9C5221" stroke="#9C5221" stroke-width="2.4" stroke-linejoin="round"/><path transform="translate(0 -72)" d="M20.0 58.9 L16.4 66.3 L3.9 64.4 L0.6 58.7 L5.7 51.4 L16.7 51.2 Z" fill="#B0612A" stroke="#B0612A" stroke-width="2.4" stroke-linejoin="round"/><path transform="translate(0 0)" d="M20.0 58.9 L16.4 66.3 L3.9 64.4 L0.6 58.7 L5.7 51.4 L16.7 51.2 Z" fill="#B0612A" stroke="#B0612A" stroke-width="2.4" stroke-linejoin="round"/><path transform="translate(72 -72)" d="M20.0 58.9 L16.4 66.3 L3.9 64.4 L0.6 58.7 L5.7 51.4 L16.7 51.2 Z" fill="#B0612A" stroke="#B0612A" stroke-width="2.4" stroke-linejoin="round"/><path transform="translate(72 0)" d="M20.0 58.9 L16.4 66.3 L3.9 64.4 L0.6 58.7 L5.7 51.4 L16.7 51.2 Z" fill="#B0612A" stroke="#B0612A" stroke-width="2.4" stroke-linejoin="round"/><path transform="translate(0 -72)" d="M30.3 52.2 L37.5 52.7 L44.0 59.1 L40.0 68.9 L29.6 68.3 L26.0 56.8 Z" fill="#8A4319" stroke="#8A4319" stroke-width="2.4" stroke-linejoin="round"/><path transform="translate(0 0)" d="M30.3 52.2 L37.5 52.7 L44.0 59.1 L40.0 68.9 L29.6 68.3 L26.0 56.8 Z" fill="#8A4319" stroke="#8A4319" stroke-width="2.4" stroke-linejoin="round"/><path transform="translate(-72 -72)" d="M67.0 68.6 L55.6 68.8 L49.7 62.1 L60.3 53.4 L67.7 57.3 Z" fill="#A45A26" stroke="#A45A26" stroke-width="2.4" stroke-linejoin="round"/><path transform="translate(-72 0)" d="M67.0 68.6 L55.6 68.8 L49.7 62.1 L60.3 53.4 L67.7 57.3 Z" fill="#A45A26" stroke="#A45A26" stroke-width="2.4" stroke-linejoin="round"/><path transform="translate(0 -72)" d="M67.0 68.6 L55.6 68.8 L49.7 62.1 L60.3 53.4 L67.7 57.3 Z" fill="#A45A26" stroke="#A45A26" stroke-width="2.4" stroke-linejoin="round"/><path transform="translate(0 0)" d="M67.0 68.6 L55.6 68.8 L49.7 62.1 L60.3 53.4 L67.7 57.3 Z" fill="#A45A26" stroke="#A45A26" stroke-width="2.4" stroke-linejoin="round"/></pattern>' +
      '<linearGradient id="sbSombra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#3B1F08" stop-opacity=".28"/></linearGradient></defs>' +
      '<g class="sb-perna sb-perna-a"><path d="M130 132 L134 210 L144 210 L142 132 Z" fill="url(#sbManchas)"/><rect x="133" y="206" width="12" height="9" rx="2" fill="#3B2412"/></g>' +
      '<g class="sb-perna sb-perna-b"><path d="M64 132 L60 210 L70 210 L76 132 Z" fill="url(#sbManchas)"/><rect x="59" y="206" width="12" height="9" rx="2" fill="#3B2412"/></g>' +
      '<path d="M150 118 C166 124 172 140 168 160" stroke="#B8652A" stroke-width="3" fill="none"/><path d="M166 156 L172 172 L162 166 Z" fill="#3B2412"/>' +
      '<path d="M52 100 C58 82 90 78 120 84 C142 88 158 100 156 120 C154 138 136 144 110 142 C86 140 60 142 54 128 C50 120 50 108 52 100 Z" fill="url(#sbManchas)"/>' +
      '<path d="M52 100 C58 82 90 78 120 84 C142 88 158 100 156 120 C154 138 136 144 110 142 C86 140 60 142 54 128 C50 120 50 108 52 100 Z" fill="url(#sbSombra)"/>' +
      '<g class="sb-pescoco"><path d="M54 104 C46 74 36 46 30 24 L46 18 C52 42 64 70 78 96 Z" fill="url(#sbManchas)"/>' +
      '<path d="M46 18 C52 42 64 70 78 96 L74 98 C60 72 48 44 42 20 Z" fill="#7A3E14" opacity=".55"/>' +
      '<path d="M22 22 C10 20 2 26 2 32 C2 38 10 40 20 38 L34 34 C40 32 44 26 40 20 C36 16 28 18 22 22 Z" fill="url(#sbManchas)"/>' +
      '<path d="M2 32 C2 38 10 40 20 38 L18 34 C10 35 6 34 4 30 Z" fill="#8A4A1C" opacity=".5"/>' +
      '<path d="M30 14 L30 4 M38 14 L39 4" stroke="#6B3B16" stroke-width="3.2" stroke-linecap="round"/><circle cx="30" cy="4" r="3" fill="#3B2412"/><circle cx="39" cy="4" r="3" fill="#3B2412"/>' +
      '<path d="M40 16 C48 12 52 14 50 20 C46 20 42 19 40 16 Z" fill="#E7C285"/>' +
      '<circle cx="24" cy="24" r="2.6" fill="#1A1A1A"/><circle cx="24.8" cy="23.2" r=".8" fill="#fff"/><circle cx="6" cy="31" r="1.2" fill="#3B2412"/></g>' +
      '<g class="sb-perna sb-perna-c"><path d="M120 132 L118 212 L128 212 L132 132 Z" fill="url(#sbManchas)"/><rect x="117" y="208" width="12" height="9" rx="2" fill="#3B2412"/></g>' +
      '<g class="sb-perna sb-perna-d"><path d="M74 132 L76 212 L86 212 L88 132 Z" fill="url(#sbManchas)"/><rect x="75" y="208" width="12" height="9" rx="2" fill="#3B2412"/></g></svg>'
  };
  // nomes que já têm imagem realista em img/splash/<nome>.png (preencha quando chegarem)
  const imagens = [];
  function bicho(nome) {
    const arte = imagens.indexOf(nome) >= 0 ? '<img src="img/splash/' + nome + '.png" alt="">' : SVG[nome];
    return '<div class="voo voo-' + nome + '"><div class="bal bal-' + nome + '">' + arte + '</div></div>';
  }
  function html(rapida) {
    return (rapida ? ['passaro', 'borboleta'] : ['girafa', 'passaro', 'borboleta', 'abelha', 'joaninha']).map(bicho).join('');
  }
  return { html: html, imagens: imagens };
})();
