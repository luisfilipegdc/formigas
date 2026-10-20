/* =====================================================================
   Terra Codex · Brasil Vivo 2D · sprites em pixel art
   Tudo desenhado aqui, sem imagem externa: personagens e bichos em mapas
   de caracteres (cada letra é uma cor), árvores e pedras em "bolhas" com
   sombreado em 4 tons e pontilhado, contorno escuro automático.
   1 pixel do sprite = 1 pixel da tela interna (ampliada sem suavizar).
   ===================================================================== */
const Pixel = (function () {
  const CONTORNO = '#1d1a24';
  const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
  // gerador com semente: o mundo 2D é sempre o mesmo
  function semente(s) { return function () { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function tela(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function rgb(hex) { const n = parseInt(hex.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function hex(r, g, b) { return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join(''); }
  function tom(c, k) { const [r, g, b] = rgb(c); return k < 0 ? hex(r * (1 + k), g * (1 + k), b * (1 + k)) : hex(r + (255 - r) * k, g + (255 - g) * k, b + (255 - b) * k); }
  function mistura(a, b, k) { const A = rgb(a), B = rgb(b); return hex(A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k, A[2] + (B[2] - A[2]) * k); }

  // contorno de 1 pixel em volta do que não é transparente
  function contornar(c, cor) {
    const g = c.getContext('2d'), w = c.width, h = c.height, d = g.getImageData(0, 0, w, h), p = d.data, [r, gg, b] = rgb(cor || CONTORNO);
    const cheio = (x, y) => x >= 0 && y >= 0 && x < w && y < h && p[(y * w + x) * 4 + 3] > 0 && !marc[y * w + x];
    const marc = new Uint8Array(w * h), novos = [];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { if (p[(y * w + x) * 4 + 3] > 0) continue; if (cheio(x - 1, y) || cheio(x + 1, y) || cheio(x, y - 1) || cheio(x, y + 1)) novos.push(y * w + x); }
    novos.forEach((i) => { p[i * 4] = r; p[i * 4 + 1] = gg; p[i * 4 + 2] = b; p[i * 4 + 3] = 255; marc[i] = 1; });
    g.putImageData(d, 0, 0); return c;
  }
  // mapa de caracteres → sprite (com 1 px de margem para o contorno)
  function mapa(linhas, cores, contorno) {
    const h = linhas.length, w = Math.max(...linhas.map((l) => l.length)), c = tela(w + 2, h + 2), g = c.getContext('2d');
    linhas.forEach((l, y) => { for (let x = 0; x < l.length; x++) { const ch = l[x]; if (ch === '.' || ch === ' ' || !cores[ch]) continue; g.fillStyle = cores[ch]; g.fillRect(x + 1, y + 1, 1, 1); } });
    return contorno === false ? c : contornar(c, contorno);
  }
  function espelho(c) { const o = tela(c.width, c.height), g = o.getContext('2d'); g.translate(c.width, 0); g.scale(-1, 1); g.drawImage(c, 0, 0); return o; }

  // bolha sombreada: união de círculos, luz vindo de cima à esquerda, 4 tons com pontilhado
  function bolha(w, h, circ, cores, opt) {
    opt = opt || {};
    const c = tela(w, h), g = c.getContext('2d'), d = g.createImageData(w, h), p = d.data;
    const C = cores.map(rgb);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      let v = -1;
      for (const [cx, cy, r] of circ) { const dd = Math.hypot(x + 0.5 - cx, (y + 0.5 - cy) * (opt.achatar || 1)); if (dd <= r) v = Math.max(v, 1 - Math.hypot(x - (cx - r * 0.38), y - (cy - r * 0.45)) / (r * 1.55)); }
      if (v < 0) continue;
      v += (BAYER[y & 3][x & 3] / 16 - 0.5) * 0.2;
      const k = v > 0.74 ? 3 : v > 0.46 ? 2 : v > 0.18 ? 1 : 0, i = (y * w + x) * 4;
      p[i] = C[k][0]; p[i + 1] = C[k][1]; p[i + 2] = C[k][2]; p[i + 3] = 255;
    }
    g.putImageData(d, 0, 0);
    return opt.semContorno ? c : contornar(c, opt.contorno);
  }
  // traço grosso em pixels (troncos)
  function traco(g, pts, larg, cor, sombra) {
    for (let i = 0; i < pts.length - 1; i++) {
      const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], n = Math.ceil(Math.hypot(x1 - x0, y1 - y0)) * 2;
      for (let k = 0; k <= n; k++) {
        const x = Math.round(x0 + (x1 - x0) * k / n - larg / 2), y = Math.round(y0 + (y1 - y0) * k / n);
        g.fillStyle = cor; g.fillRect(x, y, larg, 1);
        if (sombra) { g.fillStyle = sombra; g.fillRect(x + larg - Math.max(1, larg >> 1), y, Math.max(1, larg >> 1), 1); }
      }
    }
  }
  function juntar(w, h, partes, contorno) {
    const c = tela(w, h), g = c.getContext('2d');
    partes.forEach(([img, x, y]) => g.drawImage(img, x, y));
    return contorno ? contornar(c, contorno) : c;
  }

  /* ---------- paletas ---------- */
  const VERDES = ['#2c4f24', '#45732f', '#6c9a3c', '#9cc458'];
  const VERDES2 = ['#284a2a', '#3f6e38', '#5f9446', '#8fbf5a'];
  const AMARELO = ['#9a6a12', '#d89c22', '#f4c63e', '#fff09a'];
  const ROSA = ['#8e3c6a', '#d36aa4', '#f2a0c8', '#ffd6ea'];
  const CINZA = ['#55544f', '#76756f', '#97968f', '#b9b8b0'];

  /* ---------- personagens: 10 × 16, frente, costas e lado, 2 passos ---------- */
  const FRENTE = ['..cccccc..', '.cccccccc.', 'CCCCCCCCCC', '.hhhhhhhh.', '.hssssssh.', '.skssssks.', '.srssssrs.', '..ssssss..', '.tttttttt.', 'stttttttts', 'sTttttttTs', '.TTTTTTTT.', '.pppppppp.'];
  const COSTAS = ['..cccccc..', '.cccccccc.', 'CCCCCCCCCC', '.hhhhhhhh.', '.hhhhhhhh.', '.hhhhhhhh.', '.hhhhhhhh.', '..ssssss..', '.toooooot.', 'stoooooots', 'sTooooooTs', '.TTTTTTTT.', '.pppppppp.'];
  const LADO = ['..cccccc..', '.cccccccc.', '.CCCCCCCCC', '.hhhhhhhh.', '.hhhsssss.', '.hhssssks.', '.hhssssss.', '...sssss..', '..otttttt.', '..otttstt.', '..otttstt.', '...TTTTT..', '...ppppp..'];
  const PERNAS = {
    frente: [['.ppp..ppp.', '.ppp..ppp.', '.fff..fff.'], ['.ppp..ppp.', '.fff..ppp.', '......fff.'], ['.ppp..ppp.', '.ppp..fff.', '.fff......']],
    lado: [['....ppp...', '....ppp...', '....ffff..'], ['...pp.pp..', '..pp...pp.', '..ff...ff.'], ['....ppp...', '...ppp....', '...ffff...']]
  };
  function pessoa(v) {
    v = v || {};
    const pele = v.pele || '#c98d64', cab = v.cabelo || '#2a1a10', cam = v.camisa || '#2f8a47', calca = v.calca || '#5a4a32', chap = v.chapeu || cab;
    const cores = { c: chap, C: tom(chap, -0.22), h: cab, s: pele, k: '#1d1a24', r: mistura(pele, '#e8566a', 0.35), t: cam, T: tom(cam, -0.25), p: calca, f: '#3a2416', o: v.mochila ? '#d0763a' : cam };
    const crianca = v.escala && v.escala < 0.9;
    const montar = (corpo, pernas) => {
      let l = corpo.slice();
      if (crianca) l.splice(9, 1);
      let pe = pernas;
      if (v.saia) { l[l.length - 1] = l[l.length - 1].replace(/\.p+\./, (m) => 'p'.repeat(m.length)); pe = pernas.map((x, i) => i < 2 ? x.replace(/p/g, 's') : x); }
      return mapa(l.concat(pe), cores);
    };
    const quadros = (corpo, tipo) => PERNAS[tipo].map((pe) => montar(corpo, pe));
    const lado = quadros(LADO, 'lado');
    return { baixo: quadros(FRENTE, 'frente'), cima: quadros(COSTAS, 'frente'), dir: lado, esq: lado.map(espelho) };
  }

  /* ---------- bichos (2 quadros cada) ---------- */
  function bicho(forma, cor) {
    const c = cor || '#3a6fe0';
    if (forma === 'borboleta') {
      const k = { b: tom(c, -0.35), B: c, L: tom(c, 0.35), k: '#2a2030', w: '#f6f0dc' };
      return [mapa(['bb.....bb', 'bBb...bBb', 'bLBbkbBLb', 'bBBBkBBBb', '.bBBkBBb.', '.bLbkbLb.', '.bb...bb.'], k), mapa(['.........', '..bb.bb..', '..bBkBb..', '..bLkLb..', '..bBkBb..', '..bb.bb..', '.........'], k)];
    }
    if (forma === 'abelha') {
      const k = { y: c, Y: tom(c, -0.3), k: '#2a2030', w: '#e6f2ff' };
      return [mapa(['w...w', 'ww.ww', '.yky.', '.YkY.'], k), mapa(['.....', '.w.w.', 'wyky.', '.YkY.'], k)];
    }
    if (forma === 'formiga') {
      const k = { r: c, R: tom(c, -0.3), k: '#2a1810' };
      return [mapa(['k..k..k.', '.RRrrRRr', 'k..k..k.'], k), mapa(['.k..k..k', '.RRrrRRr', '.k..k..k'], k)];
    }
    if (forma === 'lagartixa') {
      const k = { l: c, L: tom(c, -0.22), k: '#2a2030' };
      return [mapa(['..l....l......', '...llllll.....', 'LLLlllllllllk.', '...llllll..ll.', '..l....l......'], k), mapa(['...l....l.....', '...llllll.....', 'LLLlllllllllk.', '...llllll..ll.', '....l....l....'], k)];
    }
    if (forma === 'sapo') {
      const k = { g: tom(c, -0.3), G: c, L: tom(c, 0.25), k: '#1d1a24', y: '#e8d27a' };
      return [mapa(['.yk....ky.', 'gGGGGGGGGg', 'gGLGGGGLGg', 'gGGGLLGGGg', '.gGGGGGGg.', 'gg.gggg.gg'], k), mapa(['.yk....ky.', 'gGGGGGGGGg', 'gGLGGGGLGg', 'gGGGLLGGGg', '.gGGGGGGg.', '.gg.gg.gg.'], k)];
    }
    return [mapa(['.oo.', 'oooo', '.oo.'], { o: c }), mapa(['.oo.', 'oooo', '.oo.'], { o: c })];
  }

  /* ---------- cenário ---------- */
  function arvore(seed, cores) {
    const r = semente(seed), w = 40, h = 46, c = tela(w, h), g = c.getContext('2d');
    // tronco torto do Cerrado
    const bx = 20 + Math.round((r() - 0.5) * 4), meio = bx + Math.round((r() - 0.5) * 8);
    traco(g, [[bx, 45], [bx + 1, 38], [meio, 30], [meio + 2, 22]], 4, '#6b4a2c', '#4a321e');
    traco(g, [[meio, 32], [meio - 7, 26]], 2, '#6b4a2c', '#4a321e');
    traco(g, [[meio + 1, 30], [meio + 8, 24]], 2, '#6b4a2c', '#4a321e');
    contornar(c);
    const circ = [[meio + 2, 16, 10 + r() * 2], [meio - 7, 20, 7 + r() * 2], [meio + 10, 20, 7 + r() * 2], [meio + 3, 9, 6 + r() * 2]];
    const copa = bolha(w, 34, circ, cores || (r() > 0.5 ? VERDES : VERDES2));
    g.drawImage(copa, 0, 0);
    return c;
  }
  // pequizeiro: copa larga e baixa, verde-escuro, com pequis amarelos
  function arvoreLarga(seed) {
    const r = semente(seed), w = 48, h = 40, c = tela(w, h), g = c.getContext('2d');
    traco(g, [[24, 39], [23, 32], [25, 24]], 5, '#5a3e26', '#3e2a18');
    traco(g, [[24, 30], [14, 24]], 2, '#5a3e26', '#3e2a18'); traco(g, [[24, 29], [34, 23]], 2, '#5a3e26', '#3e2a18');
    contornar(c);
    const copa = bolha(w, 28, [[24, 15, 11], [12, 17, 8 + r() * 2], [36, 17, 8 + r() * 2], [18, 10, 7], [31, 10, 7]], ['#233f1e', '#36602a', '#4f8034', '#76a644']);
    g.drawImage(copa, 0, 0);
    for (let i = 0; i < 5; i++) { g.fillStyle = '#e8c23a'; const x = 8 + Math.floor(r() * 32), y = 10 + Math.floor(r() * 12); g.fillRect(x, y, 2, 2); g.fillStyle = '#fff09a'; g.fillRect(x, y, 1, 1); }
    return c;
  }
  // árvore rala da seca: galhos à mostra e poucos tufos de folha oliva
  function arvoreRala(seed) {
    const r = semente(seed), w = 36, h = 42, c = tela(w, h), g = c.getContext('2d');
    const m = 18 + Math.round((r() - 0.5) * 6);
    traco(g, [[18, 41], [17, 33], [m, 24], [m + 3, 14]], 3, '#7a5634', '#55391f');
    traco(g, [[m, 26], [m - 9, 17]], 2, '#7a5634', '#55391f'); traco(g, [[m + 1, 22], [m + 9, 15]], 2, '#7a5634', '#55391f'); traco(g, [[m - 6, 20], [m - 10, 22]], 1, '#7a5634');
    contornar(c);
    const pal = ['#4a5222', '#6e7832', '#929c44', '#bcc064'];
    [[m + 3, 11, 5], [m - 9, 14, 4.5], [m + 9, 12, 4.5]].forEach(([x, y, rr]) => g.drawImage(bolha(14, 12, [[7, 6, rr]], pal), Math.round(x - 7), Math.round(y - 6)));
    return c;
  }
  function arbusto(seed) {
    const r = semente(seed), pal = r() > 0.5 ? VERDES2 : ['#3a4a1e', '#5a6e2a', '#7e943a', '#a8bc56'];
    const c = bolha(18, 12, [[9, 7, 5], [4.5, 8, 3.5 + r()], [13.5, 8, 3.5 + r()]], pal);
    if (r() > 0.55) { const g = c.getContext('2d'); g.fillStyle = r() > 0.5 ? '#e86aa8' : '#f5f0e0'; [[5, 5], [11, 4], [14, 7]].forEach(([x, y]) => g.fillRect(x, y, 1, 1)); }
    return c;
  }
  function nuvem(seed) {
    const r = semente(seed), w = 120, h = 60, c = tela(w, h), g = c.getContext('2d');
    g.fillStyle = '#000';
    for (let i = 0; i < 7; i++) { const x = 25 + r() * 70, y = 22 + r() * 16, rr = 12 + r() * 14; for (let yy = -rr; yy <= rr; yy++) { const lw = Math.round(Math.sqrt(rr * rr - yy * yy) * 1.4); g.fillRect(Math.round(x - lw), Math.round(y + yy * 0.6), lw * 2, 1); } }
    return c;
  }
  function ipe(cores) {
    const w = 56, h = 62, c = tela(w, h), g = c.getContext('2d');
    traco(g, [[28, 61], [27, 50], [30, 40], [29, 30]], 6, '#6b4a2c', '#4a321e');
    traco(g, [[29, 42], [18, 32]], 3, '#6b4a2c', '#4a321e'); traco(g, [[30, 40], [40, 31]], 3, '#6b4a2c', '#4a321e');
    contornar(c);
    g.drawImage(bolha(w, 44, [[28, 20, 14], [15, 25, 10], [42, 25, 10], [22, 11, 9], [36, 12, 9]], cores), 0, 0);
    return c;
  }
  function buriti(seed) {
    const r = semente(seed), w = 34, h = 56, c = tela(w, h), g = c.getContext('2d');
    for (let y = 18; y < 56; y++) { g.fillStyle = y % 4 === 0 ? '#7a5a3a' : '#9a7a52'; g.fillRect(16, y, 3, 1); g.fillStyle = '#6a4a2e'; g.fillRect(18, y, 1, 1); }
    // leque de folhas
    for (let i = 0; i < 9; i++) {
      const a = Math.PI * (1.05 + i * 0.11) + (r() - 0.5) * 0.1;
      for (let k = 2; k < 15; k++) { const x = Math.round(17 + Math.cos(a) * k), y = Math.round(16 + Math.sin(a) * k * 0.8 + (k * k) * 0.035); g.fillStyle = k > 10 ? '#8fbf5a' : i % 2 ? '#3f7a34' : '#5a9646'; g.fillRect(x, y, 2, 1); }
    }
    g.fillStyle = '#9a5a2a'; g.fillRect(15, 17, 2, 2); g.fillRect(19, 18, 2, 2);
    return contornar(c);
  }
  function cupinzeiro(seed) { const r = semente(seed); return bolha(16, 22, [[8, 13, 6.5], [8, 7, 4.5], [7 + r() * 2, 3.5, 2.5]], ['#7a4a26', '#a8693a', '#c98a52', '#e0ab72']); }
  function pedra(seed, s) { const r = semente(seed); s = s || 1; const w = Math.round(10 * s), h = Math.round(7 * s); return bolha(w, h, [[w / 2, h / 2 + 0.5, w / 2.4], [w / 2 - 1 + r() * 2, h / 2 - 0.5, w / 3]], ['#5e5a52', '#857f72', '#a39d8e', '#c2bcac'], { achatar: 1.4 }); }
  function tufo(cores, seed) {
    const r = semente(seed), c = tela(9, 8), g = c.getContext('2d');
    for (let i = 0; i < 5; i++) { const x = 1 + i * 1.6 + r(), alt = 3 + Math.floor(r() * 4); for (let y = 0; y < alt; y++) { g.fillStyle = y < 2 ? cores[2] : cores[y < alt - 1 ? 1 : 0]; g.fillRect(Math.round(x + (i - 2) * y * 0.15), 7 - y, 1, 1); } }
    return c;
  }
  function flor(cor) { return mapa(['.p.p.', 'ppmpp', '.ppp.', '..g..', '.lg..'], { p: cor, m: '#f6c040', g: '#5a8a3a', l: '#4a7a2e' }, '#2a3a1a'); }
  function botao() { return mapa(['.b.', 'bBb', 'bBb', '.g.', 'lg.'], { b: '#77786f', B: '#9c9d94', g: '#6a7a5a', l: '#5a6a4a' }, '#3a3a36'); }
  function casa(cor) {
    const w = 46, h = 38, c = tela(w, h), g = c.getContext('2d');
    g.fillStyle = '#3a3a40'; [3, 14, 31, 42].forEach((x) => g.fillRect(x, 28, 2, 10));   // pilotis
    g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(2, 30, 42, 8);
    g.fillStyle = '#f2ede0'; g.fillRect(1, 8, 44, 21);   // corpo
    g.fillStyle = '#d6cfbd'; g.fillRect(1, 25, 44, 4);
    g.fillStyle = cor; g.fillRect(0, 5, 46, 4);          // laje colorida
    g.fillStyle = tom(cor, -0.25); g.fillRect(0, 8, 46, 1);
    g.fillStyle = '#4f86b8'; for (let x = 4; x < 42; x += 7) { g.fillRect(x, 13, 5, 7); g.fillStyle = '#8fc0e2'; g.fillRect(x, 13, 5, 2); g.fillStyle = '#4f86b8'; }
    g.fillStyle = '#7a5a3a'; g.fillRect(20, 31, 6, 7);   // escada
    return contornar(c);
  }
  function pavilhao() {
    const w = 96, h = 40, c = tela(w, h), g = c.getContext('2d');
    g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(6, 30, 84, 8);
    g.fillStyle = '#9ac4dc'; g.fillRect(8, 18, 80, 18); g.fillStyle = '#c6e2f0'; g.fillRect(8, 18, 80, 3);
    g.fillStyle = '#f4f0e4'; for (let x = 6; x < 92; x += 12) g.fillRect(x, 16, 3, 22);   // colunas
    // cobertura curva
    for (let x = 0; x < w; x++) { const t = (x / (w - 1)) * 2 - 1, y = Math.round(10 + t * t * 6); g.fillStyle = '#f7f4ea'; g.fillRect(x, y, 1, 5); g.fillStyle = '#d4cdb8'; g.fillRect(x, y + 5, 1, 1); }
    return contornar(c);
  }
  function muro() {
    const c = tela(30, 16), g = c.getContext('2d');
    g.fillStyle = '#e6dcc6'; g.fillRect(0, 4, 30, 12); g.fillStyle = '#cfc2a6'; for (let y = 6; y < 16; y += 4) g.fillRect(0, y, 30, 1);
    g.fillStyle = '#b8aa8a'; g.fillRect(0, 2, 30, 2);
    g.fillStyle = '#4a4a4a'; g.fillRect(24, 0, 1, 4); g.fillStyle = '#fff3c0'; g.fillRect(23, 3, 3, 2);
    return contornar(c);
  }
  function canteiro(seed) {
    const r = semente(seed), w = 58, h = 18, c = tela(w, h), g = c.getContext('2d');
    g.fillStyle = '#8a5a32'; g.fillRect(0, 6, w, 12); g.fillStyle = '#6a4224'; g.fillRect(0, 15, w, 3);
    g.fillStyle = '#4a3020'; g.fillRect(2, 7, w - 4, 7);
    for (let i = 0; i < 8; i++) { const x = 5 + i * 7; g.drawImage(bolha(8, 7, [[4, 4, 3.4]], VERDES2), x - 2, 2 + Math.round(r() * 2)); const fc = ['#f5d040', '#e5533d', '#f28fc0'][(i + seed) % 3]; g.fillStyle = fc; g.fillRect(x + 1, 1 + Math.round(r() * 2), 2, 2); }
    return contornar(c);
  }
  function placa() { return mapa(['wwwwwwwww', 'wllllllw.', 'wwwwwwwww', '....p....', '....p....', '....p....', '....p....'].map((l) => l.padEnd(9, '.')), { w: '#d9b98a', l: '#a8875a', p: '#7a5a3a' }); }
  function estaca() { return mapa(['.m.', 'mmM', 'mMM', 'mMM', 'mMM', 'mMM'], { m: '#b8956a', M: '#8a6a44' }); }
  function planta(cheia) {
    const s = cheia ? 1 : 0.7, w = 22, h = 20;
    const circ = cheia ? [[11, 9, 6], [5, 12, 4.5], [17, 12, 4.5], [8, 5, 4], [15, 5, 4]] : [[11, 12, 4.5], [7, 14, 3], [15, 14, 3]];
    const c = tela(w, h), g = c.getContext('2d');
    g.fillStyle = '#5a7a2e'; g.fillRect(10, 12, 2, 8);
    g.drawImage(bolha(w, 18, circ.map(([x, y, r]) => [x, y + (1 - s) * 4, r]), ['#3f7a2a', '#62a83a', '#86cc4a', '#bfe87a']), 0, 0);
    return contornar(c);
  }
  function caixa(ativa) {
    const k = { m: '#c09058', M: '#9a6c3c', t: '#7a5a3a', p: '#7a5a3a', y: '#f2c94a', k: '#3a2416' };
    return mapa(['tttttttttttt', 'mmmmmmmmmmmm', 'mMmmmmmmmmMm', ativa ? 'mMmmmyymmmMm' : 'mMmmmkkmmmMm', 'mMmmmmmmmmMm', 'MMMMMMMMMMMM', '.....pp.....', '.....pp.....', '.....pp.....', '.....pp.....'], k);
  }
  function tronco() { return mapa(['..kkkkkk..', '.tTTTTTTt.', '.tTkkkkTt.', '.tTTTTTTt.', '.ttTTTTyy.', '.tttTTTyy.', '.tttTTTTt.', '.ttttTTTt.', '.ttttTTTt.', 'ttttttTTtt', 'tttttttTtt'], { t: '#6b4a2c', T: '#8a6a44', k: '#3a2416', y: '#e8c26a' }); }
  function olheiros() { const c = tela(30, 14), g = c.getContext('2d'); [[4, 5], [14, 3], [24, 6], [9, 10], [20, 10], [27, 11]].forEach(([x, y]) => { g.drawImage(bolha(9, 5, [[4.5, 3, 4]], ['#8a5230', '#b0703f', '#c98a52', '#e0ab72'], { achatar: 1.6 }), x - 4, y - 2); g.fillStyle = '#2a1810'; g.fillRect(x, y, 2, 1); }); return c; }
  function ovoFolha(cor) { return mapa(['....gggg..', '..gGGGGGg.', '.gGGGeeGGg', 'gGGGGeeGg.', '.gGGGGGg..', '..ggg.....'], { g: '#3f8a2e', G: '#62a83a', e: cor || '#f2d24b' }); }
  function ovosParede() { return mapa(['ee', 'ee', '..', 'ee', 'ee'], { e: '#f3ead6' }); }
  function lagartaFolha() { return mapa(['...gggggg...', '.gGGGGGGGGg.', 'gGkLyLyLyLGg', 'gGGLLLLLLGGg', '.gGGGGGGGg..', '..gggggg....'], { g: '#3f8a2e', G: '#7cc04a', L: '#3f7a2a', y: '#f2d24b', k: '#1d1a24' }); }
  function algas() { const c = tela(18, 10), g = c.getContext('2d'); [[3, 4], [9, 2], [14, 5], [7, 7], [12, 8]].forEach(([x, y]) => g.drawImage(bolha(6, 4, [[3, 2, 2.6]], ['#2a6a2e', '#3f8a3a', '#5aa846', '#86c86a'], { achatar: 1.5, semContorno: true }), x - 3, y - 2)); return c; }
  function pedrinhas() { const c = tela(20, 12), g = c.getContext('2d'); g.drawImage(pedra(3, 1.2), 0, 2); g.drawImage(pedra(7, 0.8), 11, 0); g.drawImage(pedra(9, 0.7), 12, 6); return c; }
  function espelhoAgua(r) {
    const d = r * 2 + 2, c = tela(d, d), g = c.getContext('2d');
    for (let y = 0; y < d; y++) for (let x = 0; x < d; x++) { const q = Math.hypot(x - r, y - r); if (q > r) continue; g.fillStyle = q > r - 1.5 ? '#c8b89c' : (BAYER[y & 3][x & 3] > 13 ? '#9fd3ee' : y < r * 0.7 ? '#6ab2dc' : '#4e9ccc'); g.fillRect(x, y, 1, 1); }
    return c;
  }
  function brilho(t) { return mapa(t ? ['.y.', 'yYy', '.y.'] : ['y.y', '.Y.', 'y.y'], { y: '#ffe36a', Y: '#fffbe0' }, false); }
  function sombra(w) { const h = Math.max(2, Math.round(w * 0.38)), c = tela(w, h), g = c.getContext('2d'); g.fillStyle = 'rgba(20,24,10,.28)'; for (let y = 0; y < h; y++) { const k = Math.sqrt(1 - Math.pow((y + 0.5) / h * 2 - 1, 2)), lw = Math.round(w * k); g.fillRect(Math.round((w - lw) / 2), y, lw, 1); } return c; }

  /* ---------- chão: texturas de 16 × 16 que se repetem sem emenda ---------- */
  function chao(base, salpico, folhas, seed, tipo) {
    const r = semente(seed), c = tela(16, 16), g = c.getContext('2d');
    g.fillStyle = base; g.fillRect(0, 0, 16, 16);
    for (let i = 0; i < 26; i++) { g.fillStyle = salpico[Math.floor(r() * salpico.length)]; g.fillRect(Math.floor(r() * 16), Math.floor(r() * 16), 1, 1); }
    if (folhas) for (let i = 0; i < 6; i++) { const x = Math.floor(r() * 16), y = Math.floor(r() * 15); g.fillStyle = folhas[0]; g.fillRect(x, y, 1, 2); g.fillStyle = folhas[1]; g.fillRect(x, y, 1, 1); }
    if (tipo === 'praca') { g.fillStyle = '#cdbfa2'; g.fillRect(0, 0, 16, 1); g.fillRect(0, 0, 1, 16); g.fillRect(8, 0, 1, 8); g.fillRect(0, 8, 16, 1); g.fillRect(4, 8, 1, 8); }
    if (tipo === 'agua') { g.fillStyle = salpico[0]; for (let i = 0; i < 3; i++) { const x = Math.floor(r() * 12), y = Math.floor(r() * 16); g.fillRect(x, y, 4, 1); } }
    return c;
  }
  const TEX = {};
  function texturas() {
    if (TEX.seco) return TEX;
    TEX.seco = [chao('#c4b46a', ['#b0a05a', '#d4c886', '#a89650'], ['#9a8c48', '#d8cc8a'], 1), chao('#bfae64', ['#ad9c56', '#d0c482'], ['#988a46', '#d4c886'], 2)];
    TEX.verde = [chao('#6aa84f', ['#5a9643', '#7cb85c', '#58913f'], ['#4a8436', '#8ec86a'], 3), chao('#66a44c', ['#579240', '#7ab65a'], ['#478034', '#8ac466'], 4)];
    TEX.cinza = [chao('#8d8c86', ['#7e7d78', '#9c9b94', '#83827c'], ['#74736e', '#a6a59e'], 5), chao('#898882', ['#7a7974', '#99988f'], ['#706f6a', '#a3a29b'], 6)];
    TEX.terra = [chao('#b88e5a', ['#a67e4c', '#c99e6a', '#9e7646'], null, 7), chao('#b48a56', ['#a27a48', '#c69a66'], null, 8)];
    TEX.praca = [chao('#e2d8c2', ['#d8ccb2', '#ebe3d0'], null, 9, 'praca'), chao('#e0d6bf', ['#d6caaf', '#e9e1cd'], null, 10, 'praca')];
    TEX.agua = [chao('#3f97c8', ['#7cc4ea', '#3489bb'], null, 11, 'agua'), chao('#3c93c4', ['#7cc4ea', '#3185b6'], null, 12, 'agua')];
    TEX.aguaCinza = [chao('#5f6f74', ['#8a9a9e', '#536266'], null, 13, 'agua'), chao('#5c6c71', ['#8a9a9e', '#505f63'], null, 14, 'agua')];
    TEX.areia = [chao('#d8c48e', ['#c8b47e', '#e6d6a6'], null, 15), chao('#d4c08a', ['#c4b07a', '#e2d2a2'], null, 16)];
    TEX.horta = [chao('#7a9a48', ['#6a8a3e', '#8cac58', '#a08850'], ['#5a7a34', '#9cbc64'], 17), chao('#769644', ['#66863a', '#88a854'], ['#567630', '#98b860'], 18)];
    return TEX;
  }

  /* retrato grande para a BioDex (o mesmo sprite, ampliado sem suavizar) */
  const retratos = {};
  function retrato(forma, cor) {
    const k = forma + cor; if (retratos[k] !== undefined) return retratos[k];
    try {
      const s = bicho(forma, cor)[0], z = Math.max(4, Math.floor(84 / Math.max(s.width, s.height))), c = tela(96, 96), g = c.getContext('2d');
      g.imageSmoothingEnabled = false; g.drawImage(s, Math.round((96 - s.width * z) / 2), Math.round((96 - s.height * z) / 2), s.width * z, s.height * z);
      retratos[k] = c.toDataURL();
    } catch (e) { retratos[k] = null; }
    return retratos[k];
  }

  return { semente, tela, tom, mistura, mapa, espelho, bolha, contornar, pessoa, bicho, arvore, arvoreLarga, arvoreRala, arbusto, nuvem, ipe, buriti, cupinzeiro, pedra, tufo, flor, botao, casa, pavilhao, muro, canteiro, placa, estaca, planta, caixa, tronco, olheiros, ovoFolha, ovosParede, lagartaFolha, algas, pedrinhas, espelhoAgua, brilho, sombra, texturas, retrato, AMARELO, ROSA, CINZA, VERDES, BAYER };
})();
// a interface (ui.js) pede retratos a Formas: no 2D eles são pixel art
const Formas = { retrato: Pixel.retrato };
