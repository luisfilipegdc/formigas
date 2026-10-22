/* =====================================================================
   Bio no Bolso · Brasil Vivo 2D · arte ilustrada (estilo livro infantil)
   Tudo desenhado em vetor no canvas: curvas suaves, contorno macio,
   gradientes de luz vindo de cima à esquerda. Cada desenho é feito em alta
   resolução (RES pixels por unidade) e guarda o tamanho lógico em lw × lh,
   que é o que o mundo usa para posicionar (1 unidade = 1/5 de metro).
   Mesma interface do antigo pixel.js: o mundo e a interface não mudam.
   ===================================================================== */
const Arte = (function () {
  let RES = 4;
  const CONT = '#2e2519';
  function semente(s) { return function () { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function tela(w, h) {
    const c = document.createElement('canvas'); c.width = Math.ceil(w * RES); c.height = Math.ceil(h * RES); c.lw = w; c.lh = h;
    const g = c.getContext('2d'); g.scale(RES, RES); g.lineJoin = 'round'; g.lineCap = 'round'; c.g = g; return c;
  }
  function comRes(n, fn) { const v = RES; RES = n; try { return fn(); } finally { RES = v; } }
  function rgb(hex) { const n = parseInt(hex.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function hex(r, g, b) { return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join(''); }
  function tom(c, k) { const [r, g, b] = rgb(c); return k < 0 ? hex(r * (1 + k), g * (1 + k), b * (1 + k)) : hex(r + (255 - r) * k, g + (255 - g) * k, b + (255 - b) * k); }
  function mistura(a, b, k) { const A = rgb(a), B = rgb(b); return hex(A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k, A[2] + (B[2] - A[2]) * k); }
  function rgba(c, a) { const [r, g, b] = rgb(c); return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'; }
  function espelho(c) { const o = document.createElement('canvas'); o.width = c.width; o.height = c.height; o.lw = c.lw; o.lh = c.lh; const g = o.getContext('2d'); g.translate(c.width, 0); g.scale(-1, 1); g.drawImage(c, 0, 0); return o; }

  /* ---------- ferramentas de desenho ---------- */
  const el = (g, x, y, rx, ry, rot) => { g.beginPath(); g.ellipse(x, y, Math.max(0.01, rx), Math.max(0.01, ry), rot || 0, 0, Math.PI * 2); };
  function pinta(g, fill, lw) { g.fillStyle = fill; g.fill(); if (lw !== 0) { g.strokeStyle = CONT; g.lineWidth = lw || 0.8; g.stroke(); } }
  // luz de cima à esquerda numa forma redonda
  function luz(g, x, y, r, claro, base) { const gr = g.createRadialGradient(x - r * 0.4, y - r * 0.5, r * 0.05, x, y, r * 1.2); gr.addColorStop(0, claro); gr.addColorStop(0.55, base); gr.addColorStop(1, tom(base, -0.22)); return gr; }
  function rrect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  // linha suave passando pelos pontos (curvas quadráticas pelos pontos médios)
  function curva(g, pts) {
    g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length - 1; i++) { const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2; g.quadraticCurveTo(pts[i][0], pts[i][1], mx, my); }
    const u = pts[pts.length - 1]; g.lineTo(u[0], u[1]);
  }
  // galho/tronco: contorno, cor e um brilho fino do lado da luz
  function galho(g, pts, w, cor) {
    curva(g, pts); g.strokeStyle = CONT; g.lineWidth = w + 1.5; g.stroke();
    curva(g, pts); g.strokeStyle = cor; g.lineWidth = w; g.stroke();
    curva(g, pts.map(([x, y]) => [x - w * 0.22, y])); g.strokeStyle = tom(cor, 0.22); g.lineWidth = Math.max(0.5, w * 0.28); g.stroke();
  }
  // copa: união de círculos com um contorno só, luz, sombra embaixo e textura de folhas
  function copa(g, circ, cores, seed, extra) {
    const r = semente(seed || 1);
    g.save();
    g.strokeStyle = CONT; g.lineWidth = 1.8; circ.forEach(([x, y, rr]) => { el(g, x, y, rr, rr * 0.9); g.stroke(); });
    circ.forEach(([x, y, rr]) => { el(g, x, y, rr, rr * 0.9); g.fillStyle = cores[1]; g.fill(); });
    g.beginPath(); circ.forEach(([x, y, rr]) => { g.moveTo(x + rr, y); g.ellipse(x, y, rr, rr * 0.9, 0, 0, Math.PI * 2); }); g.clip();
    circ.forEach(([x, y, rr]) => { const gr = g.createRadialGradient(x - rr * 0.45, y - rr * 0.55, rr * 0.05, x, y, rr); gr.addColorStop(0, cores[3]); gr.addColorStop(0.5, rgba(cores[2], 0.8)); gr.addColorStop(1, rgba(cores[2], 0)); g.fillStyle = gr; el(g, x, y, rr, rr * 0.9); g.fill(); });
    const y0 = Math.min(...circ.map(([, y, rr]) => y - rr)), y1 = Math.max(...circ.map(([, y, rr]) => y + rr));
    const sb = g.createLinearGradient(0, y0, 0, y1); sb.addColorStop(0.45, rgba(cores[0], 0)); sb.addColorStop(1, rgba(cores[0], 0.85)); g.fillStyle = sb; g.fillRect(-50, y0, 200, y1 - y0);
    // folhinhas
    const x0 = Math.min(...circ.map(([x, , rr]) => x - rr)), x1 = Math.max(...circ.map(([x, , rr]) => x + rr));
    for (let i = 0; i < (x1 - x0) * (y1 - y0) / 7; i++) { const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0), claro = y < (y0 + y1) / 2 ? r() > 0.35 : r() > 0.8; el(g, x, y, 1.1, 0.6, r() * 3); g.fillStyle = claro ? rgba(cores[3], 0.55) : rgba(cores[0], 0.35); g.fill(); }
    if (extra) extra(g, r, x0, x1, y0, y1);
    g.restore();
  }

  /* ---------- paletas ---------- */
  const VERDES = ['#2e5a25', '#4f8a34', '#74ad45', '#b5dc72'];
  const VERDES2 = ['#2a5230', '#437a3e', '#66a24e', '#a8d47a'];
  const AMARELO = ['#a8701a', '#e3a826', '#f6c843', '#fff2a8'];
  const ROSA = ['#97406f', '#d96aa6', '#f2a2c9', '#ffe0ef'];
  const CINZA = ['#5b5a55', '#7c7b75', '#9a9993', '#c4c3bc'];

  /* ---------- gente: 14 × 21, quatro direções, parado e dois passos ---------- */
  function pessoa(v) {
    v = v || {};
    const P = { pele: v.pele || '#c98d64', cab: v.cabelo || '#2a1a10', cam: v.camisa || '#2f8a47', calca: v.calca || '#5a4a32', chap: v.chapeu || null, saia: !!v.saia, mochila: !!v.mochila, crianca: v.escala && v.escala < 0.9 };
    const quadros = (dir) => [0, 1, -1].map((passo) => boneco(P, dir, passo));
    const dir = quadros('dir');
    return { baixo: quadros('baixo'), cima: quadros('cima'), dir, esq: dir.map(espelho) };
  }
  function boneco(P, dir, passo) {
    const c = tela(14, 21), g = c.g, lado = dir === 'dir', costas = dir === 'cima';
    if (P.crianca) { g.translate(7, 21); g.scale(0.86, 0.86); g.translate(-7, -21); }
    const sapato = '#3a2618';
    // pernas
    if (lado) {
      [[-passo * 1.6, 0.6], [passo * 1.6, 0]].forEach(([dx, esc]) => { rrect(g, 6 + dx, 14.5, 2.4, 5, 1); pinta(g, P.saia ? P.pele : tom(P.calca, esc ? -0.12 : 0), 0.7); el(g, 7.6 + dx, 19.7, 1.9, 0.9); pinta(g, sapato, 0.7); });
    } else {
      [[4.4, passo], [7.6, -passo]].forEach(([x, p]) => { rrect(g, x, 14.5 - Math.max(0, p) * 0.8, 2.2, 5, 1); pinta(g, P.saia ? P.pele : P.calca, 0.7); el(g, x + 1.1, 19.6 - Math.max(0, p) * 0.8, 1.5, 0.9); pinta(g, sapato, 0.7); });
    }
    // mochila atrás (lado e costas desenham antes do corpo quando fica atrás)
    if (P.mochila && lado) { rrect(g, 2.4, 9.6, 3.4, 5.2, 1.2); pinta(g, '#d0763a', 0.7); }
    // braço de trás
    if (lado) { rrect(g, 5.4 - passo * 1.2, 10.4, 2, 4.4, 1); pinta(g, tom(P.pele, -0.1), 0.7); }
    // tronco (camisa) e saia
    rrect(g, 3.6, 9.6, 6.8, 6, 2.2); pinta(g, luz(g, 5.5, 10.5, 6, tom(P.cam, 0.25), P.cam), 0.8);
    if (P.saia) { g.beginPath(); g.moveTo(3.5, 13.4); g.lineTo(10.5, 13.4); g.lineTo(11.6, 17); g.lineTo(2.4, 17); g.closePath(); pinta(g, P.calca, 0.8); }
    else { g.beginPath(); g.moveTo(3.8, 14.2); g.lineTo(10.2, 14.2); g.strokeStyle = tom(P.cam, -0.3); g.lineWidth = 0.6; g.stroke(); }
    if (P.mochila && costas) { rrect(g, 4.4, 10, 5.2, 5, 1.4); pinta(g, luz(g, 6, 11, 4, '#f0a060', '#d0763a'), 0.8); rrect(g, 5.2, 12.2, 3.6, 1.6, 0.6); pinta(g, '#b05a26', 0.5); }
    if (P.mochila && !lado && !costas) { g.strokeStyle = '#b05a26'; g.lineWidth = 0.8; g.beginPath(); g.moveTo(5, 10); g.lineTo(5.2, 14); g.moveTo(9, 10); g.lineTo(8.8, 14); g.stroke(); }
    // braços
    if (lado) { rrect(g, 6.2 + passo * 1.2, 10.4, 2, 4.4, 1); pinta(g, P.pele, 0.7); }
    else { [[2.2, -passo], [10, passo]].forEach(([x, p]) => { rrect(g, x, 10.2 + p * 0.5, 1.9, 4.3, 0.95); pinta(g, P.pele, 0.7); rrect(g, x - 0.1, 10.1 + p * 0.5, 2.1, 1.8, 0.8); pinta(g, P.cam, 0.6); }); }
    // cabeça
    el(g, 7, 6.4, 4.5, 4.3); pinta(g, luz(g, 7, 6.4, 4.5, tom(P.pele, 0.2), P.pele), 0.8);
    // cabelo
    g.save(); el(g, 7, 6.4, 4.5, 4.3); g.clip();
    if (costas) { g.fillStyle = P.cab; g.fillRect(0, 0, 14, 11); }
    else if (lado) { g.fillStyle = P.cab; g.beginPath(); g.moveTo(1, 1); g.lineTo(8.5, 1); g.quadraticCurveTo(8.2, 4.8, 5.2, 5.4); g.lineTo(5.6, 10); g.lineTo(1, 10); g.closePath(); g.fill(); }
    else { g.fillStyle = P.cab; g.beginPath(); g.moveTo(1, 1); g.lineTo(13, 1); g.lineTo(13, 5.6); g.quadraticCurveTo(10, 3.6, 7, 4.8); g.quadraticCurveTo(4, 3.4, 1, 5.6); g.closePath(); g.fill(); }
    g.restore();
    el(g, 7, 6.4, 4.5, 4.3); g.strokeStyle = CONT; g.lineWidth = 0.8; g.stroke();
    // rosto
    if (!costas) {
      const olho = (x) => { el(g, x, 7.2, 0.62, 0.82); g.fillStyle = '#1d1a24'; g.fill(); el(g, x - 0.2, 6.9, 0.22, 0.22); g.fillStyle = '#fff'; g.fill(); };
      if (lado) { olho(9.4); el(g, 10.2, 8.6, 0.8, 0.5); g.fillStyle = rgba('#e8566a', 0.35); g.fill(); g.beginPath(); g.moveTo(11.4, 6.8); g.quadraticCurveTo(12, 7.6, 11.3, 8); g.strokeStyle = tom(P.pele, -0.3); g.lineWidth = 0.5; g.stroke(); }
      else { olho(5.4); olho(8.6); [4.4, 9.6].forEach((x) => { el(g, x, 8.6, 0.85, 0.5); g.fillStyle = rgba('#e8566a', 0.35); g.fill(); }); g.beginPath(); g.arc(7, 8.4, 0.9, 0.3, Math.PI - 0.3); g.strokeStyle = tom(P.pele, -0.45); g.lineWidth = 0.5; g.stroke(); }
    }
    // chapéu
    if (P.chap) {
      const ox = lado ? 0.6 : 0;
      el(g, 7 + ox, 3.4, 6.2, 1.9); pinta(g, tom(P.chap, -0.06), 0.8);
      el(g, 7 + ox * 0.5, 2.4, 3.8, 2.4); pinta(g, luz(g, 7, 2.4, 3.8, tom(P.chap, 0.3), P.chap), 0.8);
      g.beginPath(); g.ellipse(7 + ox * 0.5, 3.2, 3.7, 0.9, 0, 0, Math.PI); g.strokeStyle = tom(P.chap, -0.4); g.lineWidth = 0.7; g.stroke();
    }
    return c;
  }

  /* ---------- bichos ---------- */
  function borboleta(cor, f, tam) {
    tam = tam || 1;
    const c = tela(14 * tam, 12 * tam), g = c.g; g.scale(tam, tam); g.translate(7, 6);
    const claro = tom(cor, 0.45), escuro = tom(cor, -0.5);
    [1, -1].forEach((s) => {
      g.save(); g.scale(s * f, 1);
      const gr = g.createRadialGradient(0.5, 0, 0.3, 1, 0, 7); gr.addColorStop(0, claro); gr.addColorStop(0.55, cor); gr.addColorStop(1, escuro);
      // asa de trás
      g.beginPath(); g.moveTo(0.4, 0.6); g.bezierCurveTo(3.5, 0.6, 6, 2.6, 4.6, 5); g.bezierCurveTo(3.4, 6.4, 1, 5.2, 0.4, 2.6); g.closePath(); pinta(g, gr, 0.7);
      // asa da frente
      g.beginPath(); g.moveTo(0.3, -0.6); g.bezierCurveTo(1.5, -5.5, 6, -6.6, 6.6, -4); g.bezierCurveTo(7, -1.6, 4.6, 0.4, 0.4, 0.5); g.closePath(); pinta(g, gr, 0.7);
      // borda escura com pintas claras
      g.beginPath(); g.moveTo(3.2, -5.6); g.bezierCurveTo(5.6, -6.4, 7, -4.6, 6.4, -2.6); g.strokeStyle = escuro; g.lineWidth = 1; g.stroke();
      [[5.6, -4.6], [6.1, -3.4], [4.3, -5.5]].forEach(([x, y]) => { el(g, x, y, 0.35, 0.35); g.fillStyle = '#f6f0dc'; g.fill(); });
      el(g, 3.2, 3.4, 0.7, 0.6); g.fillStyle = '#f6f0dc'; g.fill(); el(g, 3.2, 3.4, 0.35, 0.3); g.fillStyle = '#2a2030'; g.fill();
      g.restore();
    });
    el(g, 0, 0.6, 0.75, 3.4); pinta(g, '#2a2030', 0.4); el(g, 0, -3, 0.85, 0.85); pinta(g, '#2a2030', 0.4);
    g.strokeStyle = '#2a2030'; g.lineWidth = 0.4; g.beginPath(); g.moveTo(-0.3, -3.6); g.quadraticCurveTo(-1.2, -5, -2, -5.4); g.moveTo(0.3, -3.6); g.quadraticCurveTo(1.2, -5, 2, -5.4); g.stroke();
    return c;
  }
  function abelha(cor, quadro, tam) {
    tam = tam || 1;
    const c = tela(10 * tam, 9 * tam), g = c.g; g.scale(tam, tam); g.translate(5, 4.6);
    const ang = quadro ? 0.25 : 0.9;
    [1, -1].forEach((s) => { g.save(); g.scale(s, 1); el(g, 2.2, -1.4, 2.4, 1.2, -ang); g.fillStyle = 'rgba(235,245,255,.8)'; g.fill(); g.strokeStyle = 'rgba(46,37,25,.7)'; g.lineWidth = 0.4; g.stroke(); g.restore(); });
    el(g, 0, 1, 1.9, 2.6); pinta(g, luz(g, 0, 1, 2.4, tom(cor, 0.35), cor), 0.6);
    g.save(); el(g, 0, 1, 1.9, 2.6); g.clip(); g.fillStyle = '#2a2030'; g.fillRect(-3, 0.5, 6, 0.75); g.fillRect(-3, 2.1, 6, 0.75); g.restore();
    el(g, 0, -2, 1.3, 1.1); pinta(g, '#2a2030', 0.5);
    return c;
  }
  function formiga(cor, quadro, tam) {
    tam = tam || 1;
    const c = tela(19 * tam, 12 * tam), g = c.g; g.scale(tam, tam);
    const a = quadro ? 1.1 : -1.1, perna = '#2a1810';
    g.strokeStyle = perna; g.lineWidth = 0.55;
    [[-1.8, a], [0, -a], [1.8, a]].forEach(([dx, o]) => { g.beginPath(); g.moveTo(10.5 + dx, 6); g.quadraticCurveTo(10.5 + dx + o, 3, 9.5 + dx + o, 0.8); g.moveTo(10.5 + dx, 6); g.quadraticCurveTo(10.5 + dx - o, 9, 9.5 + dx - o, 11.2); g.stroke(); });
    g.beginPath(); g.moveTo(15.8, 4.8); g.quadraticCurveTo(17, 2.4, 18.6, 1.6); g.moveTo(15.8, 7.2); g.quadraticCurveTo(17, 9.6, 18.6, 10.4); g.stroke();
    el(g, 5, 6, 3.6, 2.9); pinta(g, luz(g, 5, 6, 3.6, tom(cor, 0.35), cor), 0.6);
    el(g, 8.3, 6, 0.9, 0.6); pinta(g, tom(cor, -0.2), 0.4);
    el(g, 10.6, 6, 1.9, 1.4); pinta(g, luz(g, 10.6, 6, 1.9, tom(cor, 0.35), cor), 0.6);
    el(g, 14.6, 6, 2.3, 2.1); pinta(g, luz(g, 14.6, 6, 2.3, tom(cor, 0.35), cor), 0.6);
    el(g, 15.6, 5, 0.45, 0.45); g.fillStyle = '#1d1a24'; g.fill(); el(g, 15.6, 7, 0.45, 0.45); g.fill();
    g.strokeStyle = perna; g.lineWidth = 0.6; g.beginPath(); g.moveTo(16.6, 5.4); g.lineTo(17.6, 5.9); g.moveTo(16.6, 6.6); g.lineTo(17.6, 6.1); g.stroke();
    return c;
  }
  function lagartixa(cor, quadro, tam) {
    tam = tam || 1;
    const c = tela(27 * tam, 14 * tam), g = c.g; g.scale(tam, tam);
    const o = quadro ? 0.9 : -0.9, a = quadro ? 1 : -1;
    // patas com almofadinhas
    const pata = (x0, y0, dx, dy) => { g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(x0 + dx * 0.4, y0 + dy * 0.7, x0 + dx, y0 + dy); g.strokeStyle = CONT; g.lineWidth = 1.6; g.stroke(); g.strokeStyle = tom(cor, -0.08); g.lineWidth = 0.9; g.stroke(); [-0.7, 0, 0.7].forEach((k) => { el(g, x0 + dx + (dy ? k : 0), y0 + dy + (dy > 0 ? 0.5 : -0.5), 0.45, 0.45); g.fillStyle = tom(cor, 0.35); g.fill(); g.strokeStyle = CONT; g.lineWidth = 0.3; g.stroke(); }); };
    pata(18, 6.2, 2 + a, -4); pata(18, 7.8, 2 - a, 4); pata(11, 6.4, -1 - a, -4); pata(11, 8, -1 + a, 4);
    // corpo: traço que afina da cabeça para a cauda
    const esp = [[25, 7], [23, 7], [20.5, 7], [17, 7], [13.5, 7.1], [10.5, 7.3], [8, 7.9 + o * 0.3], [5.5, 8.8 + o * 0.7], [3, 9.6 + o], [1, 9.6 + o * 1.4]];
    const larg = [3.2, 2.6, 2.2, 3.3, 3.5, 2.8, 2, 1.4, 0.9, 0.5];
    for (let pass = 0; pass < 2; pass++) for (let i = 0; i < esp.length - 1; i++) {
      g.beginPath(); g.moveTo(esp[i][0], esp[i][1]); g.lineTo(esp[i + 1][0], esp[i + 1][1]);
      g.strokeStyle = pass ? cor : CONT; g.lineWidth = (larg[i] + larg[i + 1]) / 2 + (pass ? 0 : 1.4); g.stroke();
    }
    // cabeça mais larga e redonda
    el(g, 23.6, 7, 2.6, 2); pinta(g, cor, 0.7);
    // brilho no dorso e pintas
    curva(g, esp.slice(0, 7).map(([x, y]) => [x, y - 0.6])); g.strokeStyle = rgba(tom(cor, 0.45), 0.8); g.lineWidth = 0.6; g.stroke();
    [[19, 6.8], [15.5, 7.4], [12.5, 6.7], [9.5, 7.6], [6.6, 8.4]].forEach(([x, y]) => { el(g, x, y, 0.45, 0.4); g.fillStyle = tom(cor, -0.35); g.fill(); });
    el(g, 24.4, 5.7, 0.55, 0.55); g.fillStyle = '#1d1a24'; g.fill(); el(g, 24.4, 8.3, 0.55, 0.55); g.fill();
    return c;
  }
  function sapo(cor, quadro, tam) {
    tam = tam || 1;
    const c = tela(20 * tam, 18 * tam), g = c.g; g.scale(tam, tam);
    const esc = tom(cor, -0.18), inf = quadro ? 0.35 : 0;
    [[3.6, 13.6, 3, 2.1, -0.5], [16.4, 13.6, 3, 2.1, 0.5], [4.4, 7.4, 1.5, 1.2, 0], [15.6, 7.4, 1.5, 1.2, 0]].forEach(([x, y, rx, ry, r]) => { el(g, x, y, rx, ry, r); pinta(g, esc, 0.7); });
    [[2.2, 15.8], [17.8, 15.8]].forEach(([x, y]) => { el(g, x, y, 1.5, 0.8); pinta(g, esc, 0.6); });
    el(g, 10, 10.4, 6.3 + inf, 6 + inf); pinta(g, luz(g, 10, 10, 6.5, tom(cor, 0.32), cor), 0.8);
    el(g, 10, 6, 5, 3.8); pinta(g, luz(g, 10, 6, 5, tom(cor, 0.32), cor), 0);
    [[6.4, 3.8], [13.6, 3.8]].forEach(([x, y]) => { el(g, x, y, 2.1, 2); pinta(g, cor, 0.7); el(g, x, y - 0.1, 1.3, 1.2); g.fillStyle = '#e8c45a'; g.fill(); el(g, x, y - 0.1, quadro ? 0.4 : 0.9, 0.5); g.fillStyle = '#1d1a24'; g.fill(); });
    [[5.6, 7.2, 1.3], [14.4, 7.2, 1.3]].forEach(([x, y, r]) => { el(g, x, y, r, r * 0.6); g.fillStyle = rgba(tom(cor, -0.3), 0.6); g.fill(); });
    const r = semente(7);
    for (let i = 0; i < 16; i++) { const a = r() * 6.28, d = Math.sqrt(r()) * 5; el(g, 10 + Math.cos(a) * d, 10.6 + Math.sin(a) * d * 0.9, 0.4, 0.4); g.fillStyle = r() > 0.5 ? rgba(tom(cor, -0.35), 0.8) : rgba(tom(cor, 0.4), 0.7); g.fill(); }
    return c;
  }
  function bicho(forma, cor, tam) {
    const c = cor || '#3a6fe0';
    if (forma === 'borboleta') return [1, 0.66, 0.3, 0.66].map((f) => borboleta(c, f, tam));
    if (forma === 'abelha') return [abelha(c, 0, tam), abelha(c, 1, tam)];
    if (forma === 'formiga') return [formiga(c, 0, tam), formiga(c, 1, tam)];
    if (forma === 'lagartixa') return [lagartixa(c, 0, tam), lagartixa(c, 1, tam)];
    if (forma === 'sapo') return [sapo(c, 0, tam), sapo(c, 1, tam)];
    const o = tela(4, 4); el(o.g, 2, 2, 1.6, 1.6); pinta(o.g, c, 0.5); return [o, o];
  }

  /* ---------- cenário ---------- */
  function arvore(seed, cores) {
    const r = semente(seed), c = tela(52, 48), g = c.g, bx = 26 + (r() - 0.5) * 4, m = bx + (r() - 0.5) * 8;
    galho(g, [[bx, 47.5], [bx + 1, 40], [m, 32], [m + 2, 22]], 3.6, '#6b4a2c');
    galho(g, [[m, 33], [m - 4, 30], [m - 8, 25]], 1.6, '#6b4a2c'); galho(g, [[m + 1, 31], [m + 5, 28], [m + 9, 24]], 1.6, '#6b4a2c');
    copa(g, [[m + 2, 16, 10 + r() * 2], [m - 7, 20, 7 + r() * 2], [m + 11, 20, 7 + r() * 2], [m + 3, 9, 6.5 + r() * 2]], cores || (r() > 0.5 ? VERDES : VERDES2), seed);
    return c;
  }
  function arvoreLarga(seed) {
    const r = semente(seed), c = tela(50, 42), g = c.g;
    galho(g, [[25, 41.5], [24, 34], [26, 25]], 4.4, '#5a3e26');
    galho(g, [[25, 31], [19, 27], [14, 24]], 1.8, '#5a3e26'); galho(g, [[25, 30], [31, 26], [36, 23]], 1.8, '#5a3e26');
    copa(g, [[25, 15, 11], [13, 17, 8 + r() * 2], [37, 17, 8 + r() * 2], [19, 10, 7], [31, 10, 7]], ['#21401c', '#36632a', '#53873a', '#8ec05a'], seed, (g, rr, x0, x1, y0, y1) => {
      for (let i = 0; i < 6; i++) { const x = x0 + 6 + rr() * (x1 - x0 - 12), y = y0 + 6 + rr() * (y1 - y0 - 10); el(g, x, y, 1.1, 1.1); pinta(g, luz(g, x, y, 1.1, '#fff2a0', '#e8c23a'), 0.4); }
    });
    return c;
  }
  function arvoreRala(seed) {
    const r = semente(seed), c = tela(44, 44), g = c.g, m = 22 + (r() - 0.5) * 6;
    galho(g, [[22, 43.5], [21, 35], [m, 26], [m + 3, 15]], 2.8, '#7a5634');
    galho(g, [[m, 28], [m - 5, 23], [m - 9, 18]], 1.4, '#7a5634'); galho(g, [[m + 1, 24], [m + 5, 19], [m + 9, 16]], 1.4, '#7a5634');
    const pal = ['#4a5222', '#6e7832', '#949e46', '#c8cc72'];
    [[m + 3, 12, 5], [m - 9, 15, 4.5], [m + 9, 13, 4.5]].forEach(([x, y, rr], k) => copa(g, [[x, y, rr], [x + 2.5, y + 1, rr * 0.7]], pal, seed + k));
    return c;
  }
  function ipe(cores) {
    const c = tela(58, 64), g = c.g;
    galho(g, [[29, 63.5], [28, 52], [31, 42], [30, 30]], 5, '#6b4a2c');
    galho(g, [[30, 44], [24, 39], [18, 33]], 2.4, '#6b4a2c'); galho(g, [[31, 42], [36, 37], [41, 32]], 2.4, '#6b4a2c');
    copa(g, [[29, 21, 14], [16, 26, 10], [43, 26, 10], [22, 12, 9], [37, 13, 9]], cores, 31, (g, rr, x0, x1, y0, y1) => {
      // florzinhas soltas na copa
      for (let i = 0; i < 40; i++) { const x = x0 + rr() * (x1 - x0), y = y0 + rr() * (y1 - y0) * 0.8; el(g, x, y, 0.9, 0.9); g.fillStyle = rgba(cores[3], 0.9); g.fill(); }
    });
    return c;
  }
  function buriti(seed) {
    const r = semente(seed), c = tela(36, 58), g = c.g;
    galho(g, [[18, 57.5], [17.6, 40], [18, 18]], 3.2, '#9a7a52');
    g.strokeStyle = rgba('#5a3e26', 0.6); g.lineWidth = 0.4; for (let y = 22; y < 57; y += 2.4) { g.beginPath(); g.moveTo(16.6, y); g.lineTo(19.4, y + 0.6); g.stroke(); }
    // leque de folhas
    for (let i = 0; i < 12; i++) {
      const a = Math.PI * (1.02 + i * 0.085) + (r() - 0.5) * 0.08, L = 13 + r() * 3, tx = 18 + Math.cos(a) * L, ty = 17 + Math.sin(a) * L * 0.75 + L * 0.35;
      const nx = -Math.sin(a), ny = Math.cos(a), w = 1.6;
      g.beginPath(); g.moveTo(18, 17); g.quadraticCurveTo(18 + Math.cos(a) * L * 0.5 + nx * w, 17 + Math.sin(a) * L * 0.4 + ny * w - 2, tx, ty); g.quadraticCurveTo(18 + Math.cos(a) * L * 0.5 - nx * w, 17 + Math.sin(a) * L * 0.4 - ny * w - 2, 18, 17);
      pinta(g, i % 2 ? '#4f8a3a' : '#66a24a', 0.6);
    }
    [[16.4, 18.6], [19.6, 19]].forEach(([x, y]) => { el(g, x, y, 1.1, 1.1); pinta(g, '#9a5a2a', 0.5); });
    return c;
  }
  function cupinzeiro(seed) {
    const r = semente(seed), c = tela(18, 24), g = c.g, top = 2 + r() * 2;
    g.beginPath(); g.moveTo(2, 23.5); g.bezierCurveTo(1, 14, 4, 6, 8 + r(), top); g.bezierCurveTo(11, 5, 16, 13, 16, 23.5); g.closePath();
    const gr = g.createLinearGradient(3, 0, 16, 0); gr.addColorStop(0, '#d89a62'); gr.addColorStop(0.5, '#b8773f'); gr.addColorStop(1, '#8a5530'); pinta(g, gr, 0.8);
    for (let i = 0; i < 5; i++) { el(g, 5 + r() * 8, 9 + r() * 12, 0.6, 0.4); g.fillStyle = '#5a361c'; g.fill(); }
    return c;
  }
  function pedra(seed, s) {
    const r = semente(seed); s = s || 1;
    const w = 11 * s, h = 8 * s, c = tela(w, h), g = c.g;
    g.beginPath(); g.moveTo(1, h - 1); g.bezierCurveTo(0.5, h * 0.3, w * 0.3, 0.6, w * 0.55, 1 + r()); g.bezierCurveTo(w * 0.85, 1, w - 0.5, h * 0.5, w - 1, h - 1); g.closePath();
    pinta(g, luz(g, w * 0.45, h * 0.45, w * 0.5, '#c8c2b2', '#958e80'), 0.7);
    g.beginPath(); g.moveTo(w * 0.4, h * 0.35); g.lineTo(w * 0.5, h * 0.6); g.strokeStyle = rgba('#5e5a52', 0.6); g.lineWidth = 0.4; g.stroke();
    return c;
  }
  function tufo(cores, seed) {
    const r = semente(seed), c = tela(10, 9), g = c.g;
    for (let i = 0; i < 6; i++) {
      const x = 2 + i * 1.3 + r() * 0.6, alt = 4 + r() * 4, inc = (i - 2.5) * 0.5 + (r() - 0.5);
      g.beginPath(); g.moveTo(x - 0.5, 8.8); g.quadraticCurveTo(x + inc * 0.3, 8.8 - alt * 0.6, x + inc, 8.8 - alt); g.quadraticCurveTo(x + inc * 0.3 + 0.4, 8.8 - alt * 0.5, x + 0.6, 8.8); g.closePath();
      g.fillStyle = cores[i % 2 ? 1 : 2]; g.fill();
    }
    return c;
  }
  function flor(cor) {
    const c = tela(7, 8), g = c.g;
    g.beginPath(); g.moveTo(3.5, 7.8); g.quadraticCurveTo(3.2, 5.5, 3.5, 4); g.strokeStyle = '#4f7a2e'; g.lineWidth = 0.6; g.stroke();
    el(g, 2.4, 6.4, 1, 0.5, -0.5); g.fillStyle = '#5a8a3a'; g.fill();
    for (let k = 0; k < 5; k++) { const a = k / 5 * 6.28 - 1.57; el(g, 3.5 + Math.cos(a) * 1.3, 3 + Math.sin(a) * 1.3, 1.05, 1.05); pinta(g, cor, 0.35); }
    el(g, 3.5, 3, 0.8, 0.8); pinta(g, '#f6c040', 0.3);
    return c;
  }
  function botao() {
    const c = tela(6, 8), g = c.g;
    g.beginPath(); g.moveTo(3, 7.8); g.lineTo(3, 4); g.strokeStyle = '#5a6a4a'; g.lineWidth = 0.6; g.stroke();
    g.beginPath(); g.moveTo(3, 1); g.bezierCurveTo(4.6, 2.2, 4.4, 4.6, 3, 4.8); g.bezierCurveTo(1.6, 4.6, 1.4, 2.2, 3, 1); pinta(g, luz(g, 3, 3, 2, '#b5b6ad', '#7d7f76'), 0.5);
    return c;
  }
  function casa(cor) {
    const c = tela(48, 40), g = c.g;
    el(g, 24, 37, 21, 2.6); g.fillStyle = 'rgba(30,30,20,.18)'; g.fill();
    [5, 16, 32, 43].forEach((x) => { rrect(g, x - 1, 28, 2, 10, 0.6); pinta(g, '#4a4a50', 0.6); });
    rrect(g, 2, 9, 44, 20, 2); const gr = g.createLinearGradient(0, 9, 0, 29); gr.addColorStop(0, '#fbf8ee'); gr.addColorStop(1, '#dcd4c0'); pinta(g, gr, 0.9);
    rrect(g, 1, 5, 46, 5, 1.6); pinta(g, luz(g, 20, 6, 24, tom(cor, 0.3), cor), 0.9);
    for (let x = 5; x < 42; x += 7.2) { rrect(g, x, 13, 5.4, 8, 1); const w = g.createLinearGradient(x, 13, x + 5, 21); w.addColorStop(0, '#bfe3f6'); w.addColorStop(0.5, '#5f9ccc'); w.addColorStop(1, '#3f78a8'); pinta(g, w, 0.6); g.beginPath(); g.moveTo(x + 1, 19); g.lineTo(x + 3.5, 14.5); g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = 0.6; g.stroke(); }
    rrect(g, 21, 31, 6, 7, 0.8); pinta(g, '#8a6440', 0.6);
    for (let y = 32.5; y < 38; y += 1.8) { g.beginPath(); g.moveTo(21.3, y); g.lineTo(26.7, y); g.strokeStyle = '#5a3e26'; g.lineWidth = 0.4; g.stroke(); }
    return c;
  }
  function pavilhao() {
    const c = tela(98, 42), g = c.g;
    el(g, 49, 38, 44, 3); g.fillStyle = 'rgba(30,30,20,.16)'; g.fill();
    rrect(g, 8, 19, 82, 18, 2); const gl = g.createLinearGradient(0, 19, 0, 37); gl.addColorStop(0, '#d8eef8'); gl.addColorStop(1, '#7ab4d6'); pinta(g, gl, 0.8);
    for (let x = 14; x < 86; x += 10) { g.beginPath(); g.moveTo(x, 20); g.lineTo(x - 4, 36); g.strokeStyle = 'rgba(255,255,255,.45)'; g.lineWidth = 0.8; g.stroke(); }
    for (let x = 7; x < 93; x += 12) { rrect(g, x, 16, 3, 22, 1); pinta(g, '#f6f2e6', 0.7); }
    g.beginPath(); g.moveTo(0.5, 12); g.quadraticCurveTo(49, 22, 97.5, 12); g.lineTo(97.5, 17); g.quadraticCurveTo(49, 27, 0.5, 17); g.closePath();
    const rg = g.createLinearGradient(0, 12, 0, 27); rg.addColorStop(0, '#ffffff'); rg.addColorStop(1, '#d8d0bc'); pinta(g, rg, 0.9);
    return c;
  }
  function muro() {
    const c = tela(31, 17), g = c.g;
    rrect(g, 0.5, 4, 30, 12.5, 1); pinta(g, '#ebe2cc', 0.8);
    g.strokeStyle = '#cfc2a6'; g.lineWidth = 0.4; for (let y = 7; y < 16; y += 3) { g.beginPath(); g.moveTo(1, y); g.lineTo(30, y); g.stroke(); }
    rrect(g, 0, 2.4, 31, 2.2, 0.8); pinta(g, '#bfb08e', 0.6);
    g.beginPath(); g.moveTo(25, 0.5); g.lineTo(25, 3.4); g.strokeStyle = '#4a4a4a'; g.lineWidth = 0.6; g.stroke();
    el(g, 25, 3.8, 1.5, 1); pinta(g, '#fff3c0', 0.5);
    return c;
  }
  function canteiro(seed) {
    const r = semente(seed), c = tela(60, 20), g = c.g;
    rrect(g, 1, 7, 58, 12, 1.6); pinta(g, '#9a6638', 0.9);
    g.strokeStyle = '#6a4224'; g.lineWidth = 0.4; [11, 15].forEach((y) => { g.beginPath(); g.moveTo(1.5, y); g.lineTo(58.5, y); g.stroke(); });
    rrect(g, 3, 8, 54, 5, 1.2); pinta(g, '#4a3020', 0.5);
    for (let i = 0; i < 8; i++) { const x = 6.5 + i * 6.8; copa(g, [[x, 6.5 + r() * 1.5, 3.2], [x + 2, 7.5, 2.2]], VERDES2, seed * 10 + i); const fc = ['#f5d040', '#e5533d', '#f28fc0'][(i + seed) % 3]; el(g, x + 1, 3.5 + r() * 2, 1, 1); pinta(g, fc, 0.4); }
    return c;
  }
  function placa() {
    const c = tela(11, 10), g = c.g;
    rrect(g, 4.8, 4, 1.4, 6, 0.5); pinta(g, '#7a5a3a', 0.6);
    rrect(g, 0.6, 0.6, 9.8, 4.4, 1); pinta(g, luz(g, 4, 2, 6, '#ecd3a6', '#c9a676'), 0.7);
    g.strokeStyle = '#8a6a44'; g.lineWidth = 0.5; g.beginPath(); g.moveTo(2.4, 2.2); g.lineTo(8.4, 2.2); g.moveTo(2.4, 3.6); g.lineTo(6.8, 3.6); g.stroke();
    return c;
  }
  function estaca() { const c = tela(4, 7), g = c.g; g.beginPath(); g.moveTo(0.8, 6.6); g.lineTo(0.8, 1.6); g.lineTo(2, 0.5); g.lineTo(3.2, 1.6); g.lineTo(3.2, 6.6); g.closePath(); pinta(g, luz(g, 1.6, 2, 3, '#c8a77a', '#8a6a44'), 0.6); return c; }
  function planta(cheia) {
    const c = tela(22, 20), g = c.g, n = cheia ? 9 : 5, L = cheia ? 7.5 : 5;
    g.beginPath(); g.moveTo(11, 19.5); g.lineTo(11, 12); g.strokeStyle = '#4f6e2a'; g.lineWidth = 1; g.stroke();
    for (let i = 0; i < n; i++) {
      const a = Math.PI * (1.08 + i * (0.84 / (n - 1))), tx = 11 + Math.cos(a) * L * 1.2, ty = 13 + Math.sin(a) * L;
      g.beginPath(); g.moveTo(11, 13); g.quadraticCurveTo(11 + Math.cos(a - 0.5) * L * 0.8, 13 + Math.sin(a - 0.5) * L * 0.8, tx, ty); g.quadraticCurveTo(11 + Math.cos(a + 0.5) * L * 0.8, 13 + Math.sin(a + 0.5) * L * 0.8, 11, 13);
      pinta(g, i % 2 ? '#86cc4a' : '#62a83a', 0.6);
      g.beginPath(); g.moveTo(11, 13); g.lineTo(11 + (tx - 11) * 0.8, 13 + (ty - 13) * 0.8); g.strokeStyle = rgba('#2e5a1e', 0.5); g.lineWidth = 0.35; g.stroke();
    }
    return c;
  }
  function caixa(ativa) {
    const c = tela(14, 18), g = c.g;
    rrect(g, 6.2, 9, 1.6, 9, 0.5); pinta(g, '#7a5a3a', 0.6);
    rrect(g, 1, 4, 12, 7, 1); pinta(g, luz(g, 5, 5, 9, '#e0b07a', '#b8864e'), 0.8);
    g.beginPath(); g.moveTo(0, 4.4); g.lineTo(7, 0.6); g.lineTo(14, 4.4); g.closePath(); pinta(g, '#8a6a44', 0.8);
    el(g, 7, 7.6, ativa ? 1.2 : 1, ativa ? 1 : 0.9); pinta(g, ativa ? '#f2c94a' : '#3a2416', 0.5);
    return c;
  }
  function tronco() {
    const c = tela(12, 14), g = c.g;
    rrect(g, 1, 3, 10, 10.5, 2); pinta(g, luz(g, 4, 6, 8, '#a07a50', '#6b4a2c'), 0.8);
    el(g, 6, 3, 5, 1.8); pinta(g, '#8a6a44', 0.7); el(g, 6, 3, 3, 1); g.fillStyle = '#3a2416'; g.fill();
    el(g, 10.4, 7.5, 1.2, 0.9); pinta(g, '#e8c26a', 0.5);
    g.strokeStyle = rgba('#3a2416', 0.5); g.lineWidth = 0.4; [3.5, 6.5, 8.5].forEach((x) => { g.beginPath(); g.moveTo(x, 5); g.lineTo(x - 0.3, 13); g.stroke(); });
    return c;
  }
  function olheiros() {
    const c = tela(32, 15), g = c.g;
    [[5, 6], [15, 4], [25, 7], [10, 11], [21, 11], [28, 12]].forEach(([x, y]) => { el(g, x, y, 4, 2.4); pinta(g, luz(g, x, y, 4, '#e0ab72', '#b0703f'), 0.6); el(g, x + 0.4, y - 0.2, 0.9, 0.5); g.fillStyle = '#2a1810'; g.fill(); });
    return c;
  }
  function folhaDesenho(g, x, y, w, h, rot) {
    g.save(); g.translate(x, y); g.rotate(rot || 0);
    g.beginPath(); g.moveTo(-w / 2, 0); g.quadraticCurveTo(0, -h, w / 2, 0); g.quadraticCurveTo(0, h, -w / 2, 0);
    pinta(g, luz(g, -w * 0.1, -h * 0.2, w / 2, '#9ad85a', '#5ea83a'), 0.7);
    g.beginPath(); g.moveTo(-w / 2 + 0.6, 0); g.lineTo(w / 2 - 0.6, 0); g.strokeStyle = rgba('#2e5a1e', 0.6); g.lineWidth = 0.4; g.stroke();
    g.restore();
  }
  function ovoFolha(cor) { const c = tela(12, 8), g = c.g; folhaDesenho(g, 6, 4.4, 11, 4.2, -0.1); el(g, 6.6, 3.8, 1.2, 1.5); pinta(g, luz(g, 6.6, 3.8, 1.5, '#fff6c0', cor || '#f2d24b'), 0.5); return c; }
  function ovosParede() { const c = tela(3, 6), g = c.g; [1.7, 4.3].forEach((y) => { el(g, 1.5, y, 1, 1.2); pinta(g, luz(g, 1.5, y, 1.2, '#ffffff', '#efe5cf'), 0.4); }); return c; }
  function lagartaCorpo(g, x0, y0, n, r, onda, cor) {
    for (let i = n - 1; i >= 0; i--) { const x = x0 + i * r * 1.35, y = y0 + Math.sin(i * 0.9 + onda) * r * 0.35, cab = i === n - 1; el(g, x, y, r * (cab ? 1.08 : 1), r); pinta(g, luz(g, x, y, r, tom(cor, cab ? 0.1 : 0.35), cab ? tom(cor, -0.25) : cor), 0.5); if (!cab && i % 1 === 0) { el(g, x, y - r * 0.45, r * 0.25, r * 0.25); g.fillStyle = '#f2d24b'; g.fill(); } if (cab) { el(g, x + r * 0.4, y - r * 0.2, r * 0.22, r * 0.22); g.fillStyle = '#1d1a24'; g.fill(); } }
  }
  function lagartaFolha() { const c = tela(14, 8), g = c.g; folhaDesenho(g, 7, 4.5, 13, 4.4, 0.05); lagartaCorpo(g, 3.2, 3.6, 7, 0.85, 0, '#5fae3a'); return c; }
  function algas() { const c = tela(18, 10), g = c.g; [[3, 4], [9, 2.4], [14, 5], [7, 7], [12, 8]].forEach(([x, y]) => { el(g, x, y, 2.6, 1.5, 0.3); g.fillStyle = 'rgba(70,140,60,.85)'; g.fill(); el(g, x - 0.6, y - 0.4, 1.2, 0.6, 0.3); g.fillStyle = 'rgba(150,210,110,.6)'; g.fill(); }); return c; }
  function pedrinhas() { const c = tela(20, 12), g = c.g; [[pedra(3, 1.1), 0, 3], [pedra(7, 0.8), 10, 0], [pedra(9, 0.7), 11, 5]].forEach(([p, x, y]) => g.drawImage(p, x, y, p.lw, p.lh)); return c; }
  function espelhoAgua(r) {
    const c = tela(r * 2 + 2, r * 2 + 2), g = c.g;
    el(g, r + 1, r + 1, r, r); g.fillStyle = '#cdbd9f'; g.fill();
    el(g, r + 1, r + 1, r - 1.6, r - 1.6); const gr = g.createRadialGradient(r * 0.7, r * 0.6, 1, r + 1, r + 1, r); gr.addColorStop(0, '#9fd8f2'); gr.addColorStop(1, '#3f8fc4'); g.fillStyle = gr; g.fill();
    g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 0.8; g.beginPath(); g.arc(r + 1, r + 1, r * 0.55, 3.6, 4.6); g.stroke(); g.beginPath(); g.arc(r + 1, r + 1, r * 0.3, 0.4, 1.2); g.stroke();
    return c;
  }
  function brilho(t) {
    const s = t ? 4.5 : 3.5, c = tela(9, 9), g = c.g, cx = 4.5, cy = 4.5;
    const gl = g.createRadialGradient(cx, cy, 0, cx, cy, 4.4); gl.addColorStop(0, 'rgba(255,240,150,.7)'); gl.addColorStop(1, 'rgba(255,240,150,0)'); g.fillStyle = gl; g.fillRect(0, 0, 9, 9);
    g.beginPath(); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4, rr = k % 2 ? s * 0.28 : s; g.lineTo(cx + Math.cos(a - Math.PI / 2) * rr, cy + Math.sin(a - Math.PI / 2) * rr); } g.closePath();
    g.fillStyle = '#fff6c0'; g.fill(); g.strokeStyle = '#e8b830'; g.lineWidth = 0.4; g.stroke();
    return c;
  }
  function sombra(w) { const h = Math.max(2, w * 0.4), c = tela(w, h), g = c.g; const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); gr.addColorStop(0, 'rgba(20,24,10,.34)'); gr.addColorStop(1, 'rgba(20,24,10,0)'); g.save(); g.translate(w / 2, h / 2); g.scale(1, h / w); g.translate(-w / 2, -h / 2); g.fillStyle = gr; g.beginPath(); g.arc(w / 2, h / 2, w / 2, 0, 6.29); g.fill(); g.restore(); return c; }
  function nuvem(seed) {
    const r = semente(seed), c = comRes(1, () => tela(120, 60)), g = c.g;
    for (let i = 0; i < 7; i++) { const x = 25 + r() * 70, y = 22 + r() * 16, rr = 14 + r() * 14; const gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, 'rgba(0,0,0,.9)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - rr, y - rr, rr * 2, rr * 2); }
    return c;
  }
  function arbusto(seed) {
    const r = semente(seed), c = tela(20, 13), g = c.g, pal = r() > 0.5 ? VERDES2 : ['#3a4a1e', '#5a6e2a', '#7e943a', '#b2c660'];
    copa(g, [[10, 7.5, 5], [5, 8.4, 3.6 + r()], [15, 8.4, 3.6 + r()]], pal, seed, (g, rr) => { if (rr() > 0.45) { const fc = rr() > 0.5 ? '#e86aa8' : '#f8f2e2'; [[6, 6], [12, 5], [15, 8]].forEach(([x, y]) => { el(g, x, y, 0.7, 0.7); g.fillStyle = fc; g.fill(); }); } });
    return c;
  }
  function anel(w) { const h = w * 0.45, c = tela(w, h), g = c.g; el(g, w / 2, h / 2, w / 2 - 0.6, h / 2 - 0.6); g.strokeStyle = 'rgba(255,246,200,.85)'; g.lineWidth = 0.7; g.setLineDash([1.6, 1.2]); g.stroke(); return c; }
  function folhaSauva() { const c = tela(9, 7), g = c.g; folhaDesenho(g, 4.5, 3.5, 8.4, 4.2, -0.4); return c; }

  /* ---------- fases de vida em detalhe (Viveiro, replay e visor da BioDex) ---------- */
  function ovoGrande(q) {
    const c = tela(9, 11), g = c.g;
    el(g, 4.5, 5.8, 3.4, 4.6); pinta(g, luz(g, 4.5, 5.8, 4.6, '#fff4b8', '#e9b92c'), 0.7);
    g.strokeStyle = rgba('#a87a12', 0.55); g.lineWidth = 0.35; [-2, -1, 0, 1, 2].forEach((k) => { g.beginPath(); g.moveTo(4.5 + k * 1.1, 1.6); g.quadraticCurveTo(4.5 + k * 1.5, 5.8, 4.5 + k * 1.1, 10); g.stroke(); });
    el(g, q ? 5.6 : 3.4, q ? 3.4 : 3, 0.7, 1); g.fillStyle = 'rgba(255,255,255,.8)'; g.fill();
    return c;
  }
  function lagartaGrande(q) { const c = tela(25, 9), g = c.g; lagartaCorpo(g, 2, 4.8, 9, 1.75, q ? 1.6 : 0, '#5fae3a'); return c; }
  function crisalida(q) {
    const c = tela(11, 17), g = c.g;
    g.beginPath(); g.moveTo(5.5, 0); g.lineTo(5.5, 2.6); g.strokeStyle = '#d8d0c0'; g.lineWidth = 0.7; g.stroke();
    g.beginPath(); g.moveTo(5.5, 2.4); g.bezierCurveTo(9.8, 4, 9.6, 11, 5.5, 16.4); g.bezierCurveTo(1.4, 11, 1.2, 4, 5.5, 2.4);
    pinta(g, luz(g, 5, 7, 6, '#bfe88a', '#5aa83e'), 0.7);
    g.beginPath(); g.moveTo(3, 8); g.quadraticCurveTo(5.5, 9.4, 8, 8); g.strokeStyle = rgba('#2e6a24', 0.6); g.lineWidth = 0.4; g.stroke();
    [[4.2, 6], [6.8, 6], [5.5, 11], [3.8, 9.8], [7.2, 9.8]].forEach(([x, y], i) => { el(g, x, y, 0.45, 0.45); g.fillStyle = (i + (q ? 1 : 0)) % 2 ? '#fff4a0' : '#d4a62a'; g.fill(); });
    return c;
  }
  function ovosSapo(q) {
    const c = tela(20, 8), g = c.g;
    for (let i = 0; i < 7; i++) { const x = 2.4 + i * 2.6, y = 4 + Math.sin(i + (q ? 0.6 : 0)) * 0.6; el(g, x, y, 1.6, 1.6); g.fillStyle = 'rgba(210,235,245,.75)'; g.fill(); g.strokeStyle = 'rgba(80,120,140,.6)'; g.lineWidth = 0.35; g.stroke(); el(g, x, y, 0.6, 0.6); g.fillStyle = '#1d1a24'; g.fill(); }
    return c;
  }
  function girino(q) {
    const c = tela(14, 8), g = c.g, o = q ? 1 : -1;
    g.beginPath(); g.moveTo(5, 4); g.bezierCurveTo(8, 4 - o * 2, 10.5, 4 + o * 2, 13.4, 4 - o * 0.6); g.bezierCurveTo(10.5, 4 + o * 1.2, 8, 4 + o * 0.4, 5, 5); g.closePath(); pinta(g, rgba('#6a6a52', 0.9), 0.5);
    el(g, 4, 4.3, 3.2, 2.5); pinta(g, luz(g, 4, 4.3, 3, '#7a7a62', '#3e3e30'), 0.6);
    el(g, 2.6, 3.4, 0.5, 0.5); g.fillStyle = '#e8e0c0'; g.fill();
    return c;
  }
  function sapinho(q) { const s = sapo('#8a7a3a', q, 0.7), c = tela(16, 15), g = c.g; g.beginPath(); g.moveTo(7, 12); g.quadraticCurveTo(7.4, 14.6, 7, 14.8); g.strokeStyle = '#6a6040'; g.lineWidth = 1.2; g.stroke(); g.drawImage(s, 0, 0, s.lw, s.lh); return c; }
  const FASES = {
    'borboleta-azul:ovo': { quadros: () => [ovoGrande(0), ovoGrande(1)], cena: 'folha' },
    'borboleta-azul:lagarta': { quadros: () => [lagartaGrande(0), lagartaGrande(1)], cena: 'folha' },
    'borboleta-azul:crisalida': { quadros: () => [crisalida(0), crisalida(1)], cena: 'galho' },
    'borboleta-azul:adulto': { quadros: () => bicho('borboleta', '#3a6fe0', 1.4), cena: 'flor' },
    'sapo-cururu:ovos': { quadros: () => [ovosSapo(0), ovosSapo(1)], cena: 'agua' },
    'sapo-cururu:girino': { quadros: () => [girino(0), girino(1)], cena: 'agua' },
    'sapo-cururu:sapinho': { quadros: () => [sapinho(0), sapinho(1)], cena: 'agua' },
    'jatai:operaria': { quadros: () => bicho('abelha', '#e8b33a', 1.5), cena: 'flor' }
  };
  const CENA_MARCA = { tronco: 'chao', olheiro: 'chao', parede: 'parede', lagarta: 'folha', ovo: 'folha' };
  function quadrosFase(e, f) {
    const d = FASES[e.id + ':' + f.id];
    if (d) return { quadros: d.quadros(), cena: d.cena };
    if (f.anda && f.forma) return { quadros: bicho(f.forma, f.cor), cena: f.voa ? 'flor' : e.hora && e.hora.includes('noite') ? 'parede' : 'chao' };
    if (f.marca) { const m = f.marca === 'tronco' ? tronco() : f.marca === 'olheiro' ? olheiros() : f.marca === 'parede' ? ovosParede() : f.marca === 'lagarta' ? lagartaFolha() : ovoFolha(f.cor); return { quadros: [m], cena: CENA_MARCA[f.marca] || 'chao' }; }
    return null;
  }
  // folha de quadros lado a lado (alta resolução), animada por CSS
  const folhas = {};
  function folha(especieId, faseId) {
    const k = especieId + ':' + faseId; if (folhas[k] !== undefined) return folhas[k];
    const e = Registro.especie(especieId), f = e && e.fases.find((x) => x.id === faseId);
    const q = e && f && comRes(14, () => quadrosFase(e, f));
    if (!q) return (folhas[k] = null);
    const w = Math.max(...q.quadros.map((c) => c.lw)), h = Math.max(...q.quadros.map((c) => c.lh));
    const sheet = comRes(14, () => tela(w * q.quadros.length, h));
    q.quadros.forEach((im, i) => sheet.g.drawImage(im, i * w + (w - im.lw) / 2, h - im.lh, im.lw, im.lh));
    return (folhas[k] = { url: sheet.toDataURL(), w, h, n: q.quadros.length, cena: q.cena });
  }
  function faseHtml(especieId, faseId, caixa, classe) {
    const s = folha(especieId, faseId); if (!s) return null;
    const z = caixa / Math.max(s.w, s.h), W = Math.round(s.w * z), H = Math.round(s.h * z);
    return '<span class="spr ' + (classe || '') + '" style="width:' + W + 'px;height:' + H + 'px;background-image:url(' + s.url + ');background-size:' + (W * s.n) + 'px ' + H + 'px;--n:' + s.n + ';--larg:' + (W * s.n) + 'px;animation-duration:' + (s.n * (s.n > 2 ? 0.12 : 0.45)) + 's"></span>';
  }
  const retratos = {};
  function retrato(forma, cor) {
    const k = forma + cor; if (retratos[k] !== undefined) return retratos[k];
    try {
      const s = comRes(12, () => bicho(forma, cor)[0]), z = 84 / Math.max(s.lw, s.lh), c = comRes(2, () => tela(96, 96));
      c.g.drawImage(s, (96 - s.lw * z) / 2, (96 - s.lh * z) / 2, s.lw * z, s.lh * z);
      retratos[k] = c.toDataURL();
    } catch (e) { retratos[k] = null; }
    return retratos[k];
  }

  return { semente, tela, comRes, tom, mistura, rgba, espelho, pessoa, bicho, arvore, arvoreLarga, arvoreRala, arbusto, nuvem, ipe, buriti, cupinzeiro, pedra, tufo, flor, botao, casa, pavilhao, muro, canteiro, placa, estaca, planta, caixa, tronco, olheiros, ovoFolha, ovosParede, lagartaFolha, algas, pedrinhas, espelhoAgua, brilho, sombra, anel, folhaSauva, retrato, folha, faseHtml, AMARELO, ROSA, CINZA, VERDES, get RES() { return RES; } };
})();
// a interface (ui.js) pede retratos e fases a Formas
const Formas = { retrato: Arte.retrato, faseHtml: Arte.faseHtml, cena: (e, f) => { const s = Arte.folha(e, f); return s && s.cena; } };
