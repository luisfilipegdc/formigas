/* =====================================================================
   icones.js — ícones SVG da identidade "Bio no Bolso"
   Uso: Icone('aves') devolve o <svg> como texto. Todos usam currentColor,
   então herdam a cor do texto do botão/etiqueta onde estiverem.
   ===================================================================== */
const Icone = (function () {
  const P = {
    // categorias
    todos: '<rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/>',
    insetos: '<ellipse cx="12" cy="14.5" rx="5" ry="6.5"/><circle cx="12" cy="6.2" r="2.6"/><path d="M10.6 4 8.5 1.8M13.4 4l2.1-2.2M7.2 11.5 3 9.5M7 15H2.5M7.6 18.5 3.5 21M16.8 11.5l4.2-2M17 15h4.5M16.4 18.5l4.1 2.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    aracnideos: '<ellipse cx="12" cy="15" rx="3.6" ry="4.6"/><circle cx="12" cy="8.6" r="2.6"/><path d="M10 9 6 5 3 6M14 9l4-4 3 1M9.6 11 4 10 1.5 13M14.4 11l5.6-1 2.5 3M9.6 14 4 16l-2 4M14.4 14l5.6 2 2 4M10 17l-3 4-.5 2.5M14 17l3 4 .5 2.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
    aves: '<path d="M3 13.5c3.5.3 6-1 7.6-3.9C12.4 6.2 15 4.5 18 5c1.4.2 2.3 1 2.8 2l2.2.5-2.1 1.3c-.2 4.6-3.3 8.4-8.2 9.4L9 21l.9-3.4C6.4 17 4 15.6 3 13.5Z"/><circle cx="18" cy="7.4" r=".9" fill="#fff"/>',
    mamiferos: '<ellipse cx="12" cy="16.2" rx="5.2" ry="4.4"/><ellipse cx="5.2" cy="10.4" rx="2.1" ry="2.6"/><ellipse cx="9.2" cy="6.2" rx="2.1" ry="2.7"/><ellipse cx="14.8" cy="6.2" rx="2.1" ry="2.7"/><ellipse cx="18.8" cy="10.4" rx="2.1" ry="2.6"/>',
    repteis: '<path d="M5 20.5c-1.8 0-2.6-2.4-.7-3.4 2.6-1.4 9.4-.6 10.6-3.3 1.1-2.4-4.8-2.6-5.4-5.4C9 5.6 11.5 3 14.6 3c2.2 0 4.4 1.3 5.1 3.3.3.9-.4 1.6-1.3 1.5l-2.4-.3c-1 1.2 4 2.6 3.7 6.2-.4 4.6-7.7 5.3-11 6.2-1.3.4-2.2.6-3.7.6Z"/><circle cx="16.6" cy="5.2" r=".8" fill="#fff"/>',
    anfibios: '<path d="M12 7.5c4.7 0 8.5 3 8.5 7.4 0 3.5-3.3 5.6-8.5 5.6s-8.5-2.1-8.5-5.6c0-4.4 3.8-7.4 8.5-7.4Z"/><circle cx="7.6" cy="7" r="3"/><circle cx="16.4" cy="7" r="3"/><circle cx="7.6" cy="7" r="1.2" fill="#fff"/><circle cx="16.4" cy="7" r="1.2" fill="#fff"/><path d="M8.5 14.2c2 1.4 5 1.4 7 0" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>',
    peixes: '<path d="M2.5 12c3-4.2 7-6 11-6 3.7 0 6.3 2.4 7.2 6-.9 3.6-3.5 6-7.2 6-4 0-8-1.8-11-6Z"/><path d="M2.5 12 0 7.5v9Z"/><circle cx="16.5" cy="10.7" r="1.1" fill="#fff"/>',
    // interface
    busca: '<circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="m15.5 15.5 5 5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
    seta: '<path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>',
    cubo: '<path d="M12 2.5 20.5 7v10L12 21.5 3.5 17V7Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M3.8 7.2 12 11.6l8.2-4.4M12 11.6v9.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    inicio: '<path d="M3.5 11 12 3.5l8.5 7.5V20a1 1 0 0 1-1 1H15v-6H9v6H4.5a1 1 0 0 1-1-1Z"/>',
    colecao: '<path d="M4 4.5h7v15H4zM13 4.5h7v15h-7z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M6.5 8h2M15.5 8h2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    comparar: '<path d="M12 3v18M7 21h10M4 7h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="m4 7-2.7 6.5a3 3 0 0 0 5.4 0Zm16 0-2.7 6.5a3 3 0 0 0 5.4 0Z"/>',
    album: '<path d="M5 3.5h11.5A2.5 2.5 0 0 1 19 6v14.5H6.5A1.5 1.5 0 0 1 5 19Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M5 17.5h14" stroke="currentColor" stroke-width="2"/><path d="m12 7.2 1.1 2.2 2.4.3-1.8 1.7.5 2.4-2.2-1.2-2.2 1.2.5-2.4-1.8-1.7 2.4-.3Z"/>',
    regua: '<path d="m3 16.5 13.5-13.5 4.5 4.5L7.5 21Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="m7.5 12 2 2m1-5 2 2m1-5 2 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    local: '<path d="M12 21.5s-7-6.4-7-12a7 7 0 0 1 14 0c0 5.6-7 12-7 12Z"/><circle cx="12" cy="9.5" r="2.6" fill="#fff"/>',
    comida: '<path d="M20 4c-9.5 0-15 4.6-15 11 0 1.7.5 3.2 1.3 4.5C7.8 13.8 11 10.6 15 9c-3.3 2.2-6 5.6-7.4 11 1 .4 2.2.6 3.4.6 6.4 0 9-6.2 9-16.6Z"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
    cadeado: '<rect x="5" y="10.5" width="14" height="10.5" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="currentColor" stroke-width="2.2"/>',
    info: '<circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 11v6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><circle cx="12" cy="7.5" r="1.4"/>',
    fechar: '<path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>',
    folha: '<path d="M20.5 3.5C11 3 4 7.5 4 14.5c0 1.6.4 3 1.1 4.3 1.4-4.9 4.6-8.3 9-10.3-3.6 2.6-6.2 6.2-7.3 11.5 1.3.6 2.7 1 4.2 1 6.6 0 9.7-6.6 9.5-17.5Z"/>',
    bolso: '<path d="M4 5h16v7.5a8 8 0 0 1-16 0Z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M4 9h16" stroke="currentColor" stroke-width="2"/><circle cx="9.5" cy="5.5" r="1.6"/><circle cx="14.5" cy="5.5" r="1.6"/><ellipse cx="12" cy="15" rx="2.6" ry="2.1"/>',
    alvo: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="12" cy="12" r="1.8"/>',
    pata: '<ellipse cx="12" cy="15.6" rx="4.6" ry="3.9"/><ellipse cx="6" cy="10.4" rx="1.9" ry="2.4"/><ellipse cx="9.6" cy="6.6" rx="1.9" ry="2.5"/><ellipse cx="14.4" cy="6.6" rx="1.9" ry="2.5"/><ellipse cx="18" cy="10.4" rx="1.9" ry="2.4"/>'
  };
  return function (nome, cls) {
    return '<svg class="ico' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">' + (P[nome] || '') + '</svg>';
  };
})();
