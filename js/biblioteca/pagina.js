/* =====================================================================
   Biblioteca 3D · página: catálogo com filtros, miniaturas e visor
   O endereço guarda o item aberto (#quartzo), então dá para mandar o link.
   Itens vistos ganham um ✓ (só neste aparelho, em 'bib3d-vistos').
   ===================================================================== */
(function () {
  const $ = (id) => document.getElementById(id);
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const CATS = [
    { id: 'todos', nome: 'Tudo', emoji: '🌍' },
    { id: 'plantas', nome: 'Plantas', emoji: '🌱' },
    { id: 'rochas', nome: 'Rochas e minerais', emoji: '💎' },
    { id: 'ninhos', nome: 'Ninhos e rastros', emoji: '🪺' },
    { id: 'micro', nome: 'Fungos e micromundo', emoji: '🔬' },
    { id: 'bichos', nome: 'Bichos', emoji: '🐜' }
  ];
  const nomeCat = (id) => (CATS.find((c) => c.id === id) || {}).nome || '';
  // bichos que já têm tela 3D própria entram como atalho
  const bichos = (typeof ANIMAIS !== 'undefined' ? ANIMAIS : []).filter((a) => a.pagina).map((a) => ({
    id: 'bicho-' + a.id, nome: a.nome, cat: 'bichos', emoji: a.emoji, link: a.pagina,
    foto: a.fotos && a.fotos[0] ? a.fotos[0].arquivo.replace(/\.jpg$/, 'p.jpg') : null, resumo: 'Abre a tela 3D do bicho, com partes, formas e passeio.'
  }));
  const todos = Biblioteca.itens.concat(bichos);
  let vistos = {}; try { vistos = JSON.parse(localStorage.getItem('bib3d-vistos')) || {}; } catch (e) {}
  const marcarVisto = (id) => { vistos[id] = 1; try { localStorage.setItem('bib3d-vistos', JSON.stringify(vistos)); } catch (e) {} };
  let idade = 'pequeno'; try { idade = localStorage.getItem('bnb-idade') || 'pequeno'; } catch (e) {}
  if (idade === 'cientista') idade = 'explorador';

  /* ---------- catálogo ---------- */
  let filtro = 'todos';
  function filtros() {
    $('filtros').innerHTML = CATS.map((c) => '<button type="button" role="tab" class="chip' + (c.id === filtro ? ' on' : '') + '" aria-selected="' + (c.id === filtro) + '" data-cat="' + c.id + '">' + c.emoji + ' ' + esc(c.nome) + '</button>').join('');
    $('filtros').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => { filtro = b.dataset.cat; filtros(); grade(); }));
  }
  function grade() {
    const lista = todos.filter((i) => filtro === 'todos' || i.cat === filtro);
    $('grade').innerHTML = lista.map((i) => '<li><a class="bib-carta" href="' + (i.link || '#' + i.id) + '" data-id="' + i.id + '">' +
      '<span class="bc-foto' + (i.foto ? ' foto' : '') + '" data-mini="' + (i.link ? '' : i.id) + '">' + (i.foto ? '<img src="' + i.foto + '" alt="" loading="lazy">' : '<i>' + i.emoji + '</i>') + '</span>' +
      '<span class="bc-txt"><small>' + esc(nomeCat(i.cat)) + (i.didatico === false ? ' · forma real' : '') + '</small><b>' + esc(i.nome) + '</b><span>' + esc(i.resumo || '') + '</span></span>' +
      (vistos[i.id] ? '<span class="bc-visto" aria-label="Já explorado">✓</span>' : '') + (i.link ? '<span class="bc-selo">3D completo →</span>' : '') + '</a></li>').join('');
    $('grade').querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); abrir(a.dataset.id); }));
    miniaturas();
  }
  // as miniaturas são fotos do próprio modelo, tiradas uma por vez quando o navegador está livre
  function miniaturas() {
    const pend = [...document.querySelectorAll('.bc-foto[data-mini]')].filter((el) => el.dataset.mini);
    const prox = () => {
      if (aberto) return setTimeout(prox, 400);
      const el = pend.shift(); if (!el) return;
      const info = Biblioteca.porId[el.dataset.mini];
      try { const url = Biblioteca.miniatura(info, 320); el.innerHTML = '<img src="' + url + '" alt="">'; el.classList.add('pronta'); } catch (e) { console.warn(e); }
      if (window.requestIdleCallback) requestIdleCallback(prox, { timeout: 300 }); else setTimeout(prox, 30);
    };
    prox();
  }

  /* ---------- visor ---------- */
  const canvas = $('tela3d');
  const P = Biblioteca.palco(canvas);
  let aberto = null, M = null, info = null, parteAtiva = -1, ultimo = 0;
  function tamanho() { const w = innerWidth, h = innerHeight; P.renderer.setSize(w, h, false); P.camera.aspect = w / h; P.camera.updateProjectionMatrix(); }
  function abrir(id) {
    info = Biblioteca.porId[id]; if (!info) return fechar();
    if (M) { P.scene.remove(M.raiz); Biblioteca.descartar(M.raiz); }
    M = Biblioteca.montar(info); P.scene.add(M.raiz);
    aberto = id; $('visor').hidden = false; document.body.classList.add('visor-aberto');
    tamanho(); Biblioteca.enquadrar(M, innerWidth, innerHeight); P.controles.autoRotate = true;
    $('v-nome').textContent = info.nome; $('v-cat').textContent = nomeCat(info.cat) + (info.didatico === false ? ' · forma real' : ' · modelo didático');
    $('v-escala').hidden = !info.escala; $('v-escala').textContent = info.escala ? '🔎 ' + info.escala : '';
    parteAtiva = -1; desenharPartes(); desenharAcoes(); cartao();
    if (location.hash !== '#' + id) history.pushState({ id }, '', '#' + id);
    marcarVisto(id); $('v-voltar').focus();
  }
  function fechar() {
    aberto = null; $('visor').hidden = true; document.body.classList.remove('visor-aberto');
    if (M) { P.scene.remove(M.raiz); Biblioteca.descartar(M.raiz); M = null; }
    if (location.hash) history.pushState({}, '', location.pathname + location.search);
    grade();
  }
  const txt = (p) => (idade === 'pequeno' ? p.texto : p.mais || p.texto);
  function cartao() {
    const c = $('v-cartao');
    if (parteAtiva >= 0) { const p = M.partes[parteAtiva]; c.innerHTML = '<b>' + esc(p.nome) + '</b><p>' + esc(txt(p)) + '</p>'; }
    else c.innerHTML = '<b>' + esc(info.nome) + (M.etapa ? ' · ' + esc(M.etapa(M.E)) : '') + '</b><p>' + esc(info.resumo) + '</p><p class="v-dica">👆 Toque numa parte do modelo ou nos botões abaixo.</p>';
  }
  function desenharPartes() {
    $('v-partes').innerHTML = M.partes.map((p, i) => '<button type="button" role="listitem" class="' + (i === parteAtiva ? 'on' : '') + '" data-i="' + i + '">' + esc(p.nome) + '</button>').join('');
    $('v-partes').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => escolher(+b.dataset.i)));
  }
  function desenharAcoes() {
    const acoes = (M.acoes || []).map((a, i) => '<button type="button" data-a="' + i + '"><span>' + a.ico + '</span><small>' + esc(a.rotulo) + '</small></button>');
    acoes.push('<button type="button" data-a="tam"><span>📏</span><small>Tamanho real</small></button>');
    acoes.push('<button type="button" data-a="gira"><span>🔄</span><small>Girar sozinho</small></button>');
    $('v-acoes').innerHTML = acoes.join('');
    $('v-acoes').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
      const a = b.dataset.a;
      if (a === 'tam') { parteAtiva = -1; desenharPartes(); $('v-cartao').innerHTML = '<b>📏 Tamanho real</b><p>' + esc(info.tamanho || '') + '</p>' + (info.escala ? '<p class="v-dica">' + esc(info.escala) + '</p>' : ''); return; }
      if (a === 'gira') { P.controles.autoRotate = !P.controles.autoRotate; return; }
      M.acoes[+a].fazer(M.E); b.classList.remove('pulso'); void b.offsetWidth; b.classList.add('pulso');
      if (parteAtiva < 0) cartao();
    }));
  }
  function escolher(i) { parteAtiva = parteAtiva === i ? -1 : i; desenharPartes(); cartao(); }

  // tocar no modelo: o que está embaixo do dedo é qual parte?
  const ray = new THREE.Raycaster(), ponto = new THREE.Vector2(); let toque = null;
  canvas.addEventListener('pointerdown', (e) => { toque = { x: e.clientX, y: e.clientY, t: performance.now() }; });
  canvas.addEventListener('pointerup', (e) => {
    if (!toque || !M) return; const d = Math.hypot(e.clientX - toque.x, e.clientY - toque.y), dur = performance.now() - toque.t; toque = null;
    if (d > 8 || dur > 500) return;
    const r = canvas.getBoundingClientRect(); ponto.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
    ray.setFromCamera(ponto, P.camera);
    const hit = ray.intersectObject(M.raiz, true).find((h) => h.object.visible && h.object.userData.parte !== undefined && visivel(h.object));
    if (hit) escolher(hit.object.userData.parte); else { parteAtiva = -1; desenharPartes(); cartao(); }
  });
  const visivel = (o) => { for (let x = o; x; x = x.parent) { if (!x.visible) return false; if (x.scale && x.scale.x < 0.01) return false; } return true; };

  // destaque: a parte escolhida brilha suavemente; as outras ficam um pouco apagadas
  function destacar(t) {
    if (!M) return;
    M.raiz.traverse((o) => {
      if (!o.isMesh || !o.material || !o.material.emissive) return;
      if (o.userData.emi0 === undefined) { o.userData.emi0 = o.material.emissive.getHex(); o.userData.int0 = o.material.emissiveIntensity; }
      if (parteAtiva >= 0 && o.userData.parte === parteAtiva) { o.material.emissive.set('#ffcf4a'); o.material.emissiveIntensity = 0.25 + Math.sin(t * 5) * 0.15; }
      else { o.material.emissive.setHex(o.userData.emi0); o.material.emissiveIntensity = o.userData.int0; }
    });
  }

  function quadro(now) {
    requestAnimationFrame(quadro);
    if (!aberto || !M) return;
    const t = now / 1000, dt = Math.min(0.05, (now - ultimo) / 1000 || 0.016); ultimo = now;
    if (M.animar) M.animar(t, dt, M.E);
    destacar(t);
    P.controles.update(); P.renderer.render(P.scene, P.camera);
  }
  requestAnimationFrame(quadro);

  $('v-voltar').addEventListener('click', () => history.length > 1 && location.hash ? history.back() : fechar());
  addEventListener('popstate', () => { const id = location.hash.slice(1); if (id && Biblioteca.porId[id]) abrir(id); else if (aberto) fechar(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && aberto) fechar(); });
  addEventListener('resize', () => { if (aberto) tamanho(); });
  document.querySelectorAll('.v-idade button').forEach((b) => b.addEventListener('click', () => { idade = b.dataset.idade; try { localStorage.setItem('bnb-idade', idade); } catch (e) {} marcarIdade(); if (M) cartao(); }));
  function marcarIdade() { document.querySelectorAll('.v-idade button').forEach((b) => { b.classList.toggle('on', b.dataset.idade === idade); b.setAttribute('aria-checked', b.dataset.idade === idade); }); }
  marcarIdade();

  window.__bib = { abrir, fechar, Biblioteca, get M() { return M; } };
  filtros(); grade();
  const inicial = location.hash.slice(1); if (inicial && Biblioteca.porId[inicial]) abrir(inicial);
})();
