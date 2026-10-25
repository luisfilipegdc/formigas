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
  // todos os bichos fazem parte da biblioteca: quem tem 3D abre a tela 3D, os outros abrem a ficha (fotos reais)
  const bichos = (typeof ANIMAIS !== 'undefined' ? ANIMAIS : []).map((a) => ({
    id: 'bicho-' + a.id, bicho: a.id, nome: a.nome, cat: 'bichos', emoji: a.emoji, link: a.pagina || null, pista: a.pista,
    foto: a.fotos && a.fotos[0] ? a.fotos[0].arquivo.replace(/\.jpg$/, 'p.jpg') : null,
    resumo: a.pagina ? 'Abre a tela 3D do bicho, com partes, formas e passeio.' : (a.resumo || a.pista || '')
  }));
  const todos = Biblioteca.itens.concat(bichos);
  let vistos = {}; try { vistos = JSON.parse(localStorage.getItem('bib3d-vistos')) || {}; } catch (e) {}
  const marcarVisto = (id) => { vistos[id] = 1; try { localStorage.setItem('bib3d-vistos', JSON.stringify(vistos)); } catch (e) {} };
  let idade = 'pequeno'; try { idade = localStorage.getItem('bnb-idade') || 'pequeno'; } catch (e) {}
  if (idade === 'cientista') idade = 'explorador';

  /* ---------- faixa etária: a mesma biblioteca, com dinâmica diferente ----------
     🍼 bebe     → só imagens grandes, poucos itens, o modelo fala o nome; nada para ler
     🧸 infantil → imagem + nome, voz em tudo, frases curtas
     ✏️ iniciais → textos completos (Explorador)
     🔭 finais / 🧪 medio → textos completos + "Para investigar" (pergunta-problema) */
  const BEBE = ['bicho-formiga', 'bicho-abelha', 'bicho-lagartixa', 'bicho-cigarra', 'bicho-aranha', 'bicho-escorpiao', 'flor-ipe', 'feijao', 'pequi', 'geodo', 'quartzo', 'joao-de-barro', 'favo', 'concha', 'pena', 'cogumelo'];
  const INVESTIGAR = {
    finais: {
      plantas: 'Do que uma planta precisa para crescer? Teste com feijão no algodão: um no claro e outro no escuro. O que muda?',
      rochas: 'Como diferenciar uma rocha que veio de lava de outra feita de camadas de areia, só olhando?',
      ninhos: 'Que materiais o animal usa e por quê? Compare com uma construção humana do seu bairro.',
      micro: 'Se fungos e bactérias são tão pequenos, como eles mudam a comida, o solo e a nossa saúde?'
    },
    medio: {
      plantas: 'Relacione a abertura dos estômatos com a perda de água e a fotossíntese. O que acontece numa seca no Cerrado?',
      rochas: 'O que a composição mineral de uma rocha conta sobre o lugar e a temperatura em que ela se formou?',
      ninhos: 'Que vantagens evolutivas essa construção traz? Que custo de energia ela tem para o animal?',
      micro: 'Como fungos e bactérias participam dos ciclos do carbono e do nitrogênio? E onde isso encontra a medicina e a indústria?'
    }
  };
  let faixa = (typeof Faixa !== 'undefined' && Faixa.get()) || null;
  const pequenino = () => faixa === 'bebe';
  const naoLeitor = () => faixa === 'bebe' || faixa === 'infantil';
  function aplicarFaixa() {
    const f = typeof Faixa !== 'undefined' && Faixa.info(faixa);
    if (f) idade = f.nivel === 'pequeno' ? 'pequeno' : 'explorador';
    document.documentElement.dataset.faixa = faixa || '';
    $('faixa-chip').innerHTML = f ? f.emoji + ' <span>' + esc(f.idade) + '</span>' : '👤 <span>Quem explora?</span>';
    const h = document.querySelector('.bib-topo h1');
    h.textContent = faixa === 'bebe' ? 'Toque e veja! 👆' : faixa === 'infantil' ? 'Toque para descobrir!' : 'Biblioteca 3D';
    $('bib-intro').textContent = faixa === 'infantil' ? 'Plantas, pedras, ninhos e bichos para girar, ouvir e brincar.'
      : faixa === 'finais' || faixa === 'medio' ? 'Modelos 3D com nomes científicos, função de cada parte e perguntas para investigar. Plantas, rochas, ninhos, fungos e o micromundo.'
      : 'Gire, aproxime e toque em cada parte para descobrir o que é. Plantas, pedras, ninhos, fungos e coisas tão pequenas que só se veem no microscópio.';
    if (pequenino()) filtro = 'todos';
  }

  // tela "Quem vai explorar?" (depois da splash, ou pelo botão do cabeçalho)
  function abrirFaixas() {
    const sec = $('faixas'), ult = faixa;
    $('fx-lista').innerHTML = Faixa.LISTA.map((f) => '<button type="button" role="listitem" class="fx-carta' + (f.id === ult ? ' ultima' : '') + '" data-f="' + f.id + '">' +
      '<span class="fx-emoji">' + f.emoji + '</span><span class="fx-txt"><b>' + esc(f.nome) + '</b><small>' + esc(f.idade) + '</small><span>' + esc(f.sub) + '</span></span>' +
      (f.id === ult ? '<em>da última vez</em>' : '') + '</button>').join('');
    $('fx-lista').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
      faixa = b.dataset.f; Faixa.set(faixa); sec.hidden = true; document.body.classList.remove('faixas-aberta');
      aplicarFaixa(); filtros(); grade();
      const f = Faixa.info(faixa); if (naoLeitor() && typeof Voz !== 'undefined') Voz.falar(faixa === 'bebe' ? 'Oba! Toque num desenho!' : 'Oba! Escolha uma coisa para explorar!');
      if (f) window.scrollTo(0, 0);
    }));
    const fu = ult && Faixa.info(ult), cont = $('fx-continuar');
    cont.hidden = !fu;
    if (fu) { cont.innerHTML = '▶ Continuar com ' + fu.emoji + ' ' + esc(fu.nome) + ' <small>' + esc(fu.idade) + '</small>'; cont.onclick = () => sec.querySelector('.fx-carta[data-f="' + ult + '"]').click(); }
    sec.hidden = false; document.body.classList.add('faixas-aberta');
    const foco = fu ? cont : sec.querySelector('.fx-carta'); if (foco) foco.focus();
  }
  window.abrirFaixas = abrirFaixas;
  $('faixa-chip').addEventListener('click', abrirFaixas);

  /* ---------- catálogo ---------- */
  let filtro = 'todos';
  function filtros() {
    $('filtros').innerHTML = CATS.map((c) => '<button type="button" role="tab" class="chip' + (c.id === filtro ? ' on' : '') + '" aria-selected="' + (c.id === filtro) + '" data-cat="' + c.id + '">' + c.emoji + ' ' + esc(c.nome) + '</button>').join('');
    $('filtros').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => { filtro = b.dataset.cat; filtros(); grade(); }));
  }
  function grade() {
    let lista = todos.filter((i) => filtro === 'todos' || i.cat === filtro);
    if (pequenino()) lista = BEBE.map((id) => todos.find((i) => i.id === id)).filter(Boolean);
    else if (naoLeitor() && filtro === 'todos') lista = lista.filter((i) => i.cat === 'bichos').concat(lista.filter((i) => i.cat !== 'bichos'));   // os bichos primeiro
    $('grade').innerHTML = lista.map((i) => '<li><a class="bib-carta" href="' + (i.link || (i.bicho ? '#ficha-' + i.bicho : '#' + i.id)) + '" data-id="' + i.id + '">' +
      '<span class="bc-foto' + (i.foto ? ' foto' : '') + '" data-mini="">' + '<img src="' + (i.foto || 'img/biblioteca/' + i.id + '.png') + '" alt="" loading="lazy" data-id="' + (i.link || i.bicho ? '' : i.id) + '">' + '</span>' +
      '<span class="bc-txt"><small>' + esc(nomeCat(i.cat)) + (i.didatico === false ? ' · forma real' : '') + '</small><b>' + esc(i.nome) + '</b><span>' + esc(i.resumo || '') + '</span></span>' +
      (vistos[i.id] ? '<span class="bc-visto" aria-label="Já explorado">✓</span>' : '') + (i.link ? '<span class="bc-selo">3D completo →</span>' : i.bicho ? '<span class="bc-selo bc-ficha">📷 Ficha</span>' : '') + '</a></li>').join('');
    $('grade').querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
      e.preventDefault();
      const it = todos.find((i) => i.id === a.dataset.id);
      if (it && it.bicho) { marcarVisto(it.id); if (typeof Ficha !== 'undefined') Ficha.abrir(it.bicho); if (naoLeitor() && typeof Voz !== 'undefined') Voz.falar(it.nome + '! ' + (it.pista || '')); return; }
      abrir(a.dataset.id);
    }));
    // bicho ainda sem foto: mostra o emoji grande no lugar
    $('grade').querySelectorAll('.bc-foto img:not([data-id]), .bc-foto img[data-id=""]').forEach((im) => im.addEventListener('error', () => { const it = todos.find((i) => i.id === im.closest('a').dataset.id); im.parentNode.classList.remove('foto'); im.parentNode.classList.add('so-emoji'); im.replaceWith(Object.assign(document.createElement('i'), { textContent: (it && it.emoji) || '🐾' })); }, { once: true }));
    $('grade').querySelectorAll('.bib-carta').forEach((a) => a.setAttribute('aria-label', (todos.find((i) => i.id === a.dataset.id) || {}).nome || ''));
    // miniatura pronta em img/biblioteca; se faltar, tira a foto do modelo na hora
    $('grade').querySelectorAll('.bc-foto img[data-id]').forEach((im) => { if (im.dataset.id && Biblioteca.porId[im.dataset.id]) im.addEventListener('error', () => { im.parentNode.dataset.mini = im.dataset.id; im.replaceWith(Object.assign(document.createElement('i'), { textContent: Biblioteca.porId[im.dataset.id].emoji })); miniaturas(); }, { once: true }); });
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
  let maoT = 0;
  canvas.addEventListener('pointerdown', () => { clearTimeout(maoT); $('v-mao').hidden = true; });
  let aberto = null, M = null, info = null, parteAtiva = -1, ultimo = 0;
  function tamanho() { const w = innerWidth, h = innerHeight; P.renderer.setSize(w, h, false); P.camera.aspect = w / h; P.camera.updateProjectionMatrix(); }
  function abrir(id) {
    info = Biblioteca.porId[id]; if (!info) return fechar();
    if (M) { P.scene.remove(M.raiz); Biblioteca.descartar(M.raiz); M = null; }
    aberto = id; $('visor').hidden = false; document.body.classList.add('visor-aberto');
    tamanho();
    // modelo pronto (.glb) quando existe; se falhar, o feito em código
    if (info.glb) {
      $('v-cartao').innerHTML = '<b>' + esc(info.nome) + '</b><p>Carregando o modelo…</p>'; $('v-partes').innerHTML = ''; $('v-acoes').innerHTML = '';
      Biblioteca.carregarGLB(info).then((m) => mostrarModelo(id, m), (e) => { console.warn('glb:', e); mostrarModelo(id); });
    } else mostrarModelo(id);
    if (location.hash !== '#' + id) history.pushState({ id }, '', '#' + id);
  }
  function mostrarModelo(id, pronto) {
    if (aberto !== id) return;
    if (M) { P.scene.remove(M.raiz); Biblioteca.descartar(M.raiz); }
    M = Biblioteca.montar(info, pronto); P.scene.add(M.raiz);
    Biblioteca.enquadrar(M, innerWidth, innerHeight); P.controles.autoRotate = true;
    $('v-nome').textContent = info.nome; $('v-cat').textContent = nomeCat(info.cat) + (info.didatico === false ? ' · forma real' : ' · modelo didático');
    $('v-escala').hidden = !info.escala; $('v-escala').textContent = info.escala ? '🔎 ' + info.escala : '';
    parteAtiva = -1; desenharPartes(); desenharAcoes(); cartao();
    falar(pequenino() ? info.nome + '!' : info.nome + '! ' + info.resumo + ' Toque para descobrir as partes.');
    marcarVisto(id); $('v-voltar').focus();
    clearTimeout(maoT); $('v-mao').hidden = true;
    if (naoLeitor()) maoT = setTimeout(() => { if (aberto === id) $('v-mao').hidden = false; }, 3500);
  }
  function fechar() {
    if (typeof Voz !== 'undefined') Voz.calar();
    aberto = null; $('visor').hidden = true; document.body.classList.remove('visor-aberto');
    if (M) { P.scene.remove(M.raiz); Biblioteca.descartar(M.raiz); M = null; }
    if (location.hash) history.pushState({}, '', location.pathname + location.search);
    grade();
  }
  const txt = (p) => (idade === 'pequeno' ? p.texto : p.mais || p.texto);
  // 🧸 Pequeno: o que aparece escrito também é dito em voz alta (para quem ainda não lê)
  const falar = (t) => { if (idade === 'pequeno' && typeof Voz !== 'undefined') Voz.falar(t); };
  const nomeFalado = (p) => (pequenino() ? p.nome + '!' : p.nome + '! ' + txt(p));   // bebê: só o nome
  function cartao() {
    const c = $('v-cartao');
    if (parteAtiva >= 0) { const p = M.partes[parteAtiva]; c.innerHTML = '<b>' + esc(p.nome) + '</b><p>' + esc(txt(p)) + '</p>'; falar(nomeFalado(p)); }
    else {
      const inv = INVESTIGAR[faixa] && INVESTIGAR[faixa][info.cat];
      c.innerHTML = '<b>' + esc(info.nome) + (M.etapa ? ' · ' + esc(M.etapa(M.E)) : '') + '</b><p>' + esc(info.resumo) + '</p>' +
        (inv ? '<p class="v-investigar"><b>🔎 Para investigar</b>' + esc(inv) + '</p>' : '<p class="v-dica">👆 Toque numa parte do modelo ou nos botões abaixo.</p>') +
        (M.glb && info.credito ? '<p class="v-dica">Modelo 3D: ' + esc(info.credito.autor) + ' · ' + esc(info.credito.licenca) + '</p>' : '');
    }
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
      M.acoes[+a].fazer(M.E); falar(M.acoes[+a].rotulo + '!'); b.classList.remove('pulso'); void b.offsetWidth; b.classList.add('pulso');
      if (parteAtiva < 0) cartao();
    }));
  }
  // ➕/➖: zoom com um toque (pinça é difícil para os pequenos)
  let zoomAlvo = 0;
  document.querySelectorAll('#v-zoom button').forEach((b) => b.addEventListener('click', () => {
    const d = (zoomAlvo || P.camera.position.distanceTo(P.controles.target)) * (b.dataset.z === '1' ? 0.7 : 1.4);
    zoomAlvo = THREE.MathUtils.clamp(d, P.controles.minDistance, P.controles.maxDistance); P.controles.autoRotate = false;
  }));
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
    if (zoomAlvo) {
      const off = P.camera.position.clone().sub(P.controles.target), d0 = off.length(), d1 = d0 + (zoomAlvo - d0) * Math.min(1, dt * 6);
      P.camera.position.copy(P.controles.target).add(off.setLength(d1)); if (Math.abs(d1 - zoomAlvo) < zoomAlvo * 0.01) zoomAlvo = 0;
    }
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
  aplicarFaixa(); filtros(); grade();
  if (!faixa && !document.getElementById('splash')) abrirFaixas();   // sem splash (mesma sessão) e ainda sem faixa
  const inicial = location.hash.slice(1); if (inicial && Biblioteca.porId[inicial]) abrir(inicial);
})();
