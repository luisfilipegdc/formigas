/* =====================================================================
   bicho3d.js — página 3D reutilizável (bicho3d.html?id=<bicho>)
   Monta cena, micro-habitat, câmera e a interface do "Modo Explorar":
   formas (abas), ações do bicho, Partes, Tamanho real, modo sem
   interface, ficha e dicas do Curu. Cada bicho só precisa de um modelo
   em js/modelos/<id>.js, registrado em Modelos3D:

   Modelos3D.cigarra = {
     cena: 'chao' | 'teia',
     formas: [{ id, nome }],                 // abas (opcional)
     acoes: [{ id, ico, rotulo, fn(ctx) }],  // botões laterais do bicho
     construir(ctx) → { grupo, raio, centro }  // monta o modelo (mm)
     forma(id, ctx), update(dt, t, ctx), toque(ctx),
     partes: [{ nome, texto, ponto(ctx) → Vector3 }]
   }
   Opcionais para bichos com cenário próprio (ex.: abelha no jardim):
     cenario: 'proprio'        → sem o chão e o micro-habitat padrão
     formas: [{ id, nome, ocultar: ['tam', 'voar'] }]  → esconde botões nessa forma
     forma(id, ctx) pode devolver uma Promise (o motor espera antes da câmera)
     toqueCena(ctx, ray)       → recebe todo toque na tela (flores, chão…)
     centroAtual(ctx)          → centro da câmera quando o bicho anda
     home(ctx, fator)          → devolve true se o modelo cuidou da câmera
     partesAtuais(ctx)         → lista de partes conforme a forma; parte com
                                 ir(ctx) vira passeio (botão "Próxima" no cartão);
                                 visivel(ctx) esconde a etiqueta quando devolve false
   O motor carrega js/modelos/<id>.js sozinho se o modelo não estiver na página.
   Unidades ≈ milímetros. Y para cima.
   ===================================================================== */
const Modelos3D = {};

window.addEventListener('load', () => {
  const id = new URLSearchParams(location.search).get('id');
  if (!id || Modelos3D[id] || !/^[a-z0-9-]+$/.test(id)) { iniciar3d(id); return; }
  const sc = document.createElement('script');          // carrega só o modelo deste bicho
  sc.src = 'js/modelos/' + id + '.js';
  sc.onload = sc.onerror = () => iniciar3d(id);
  document.body.appendChild(sc);
});
function iniciar3d(id) {
  const $ = (id) => document.getElementById(id);
  const A = typeof ANIMAIS !== 'undefined' && ANIMAIS.find((a) => a.id === id);
  const M = Modelos3D[id];
  if (!A || !M) { $('carregando').textContent = 'Bicho não encontrado.'; return; }
  document.title = A.nome + ' em 3D · Natureza no Bolso';
  $('nome').textContent = A.nome;
  $('carregando').textContent = 'Montando ' + (A.art || 'a') + ' ' + (A.curto || A.nome.toLowerCase()) + '…';

  const MOBILE = Math.min(screen.width, screen.height) < 820 || /iPhone|Android.+Mobile/i.test(navigator.userAgent);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MOBILE ? 1.5 : 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  $('palco').appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#dcebd4');
  scene.fog = new THREE.Fog('#dcebd4', 260, 900);
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new THREE.RoomEnvironment(), 0.04).texture;
  const sol = new THREE.DirectionalLight(0xfff1d8, 1.5);
  sol.castShadow = true;
  sol.shadow.mapSize.set(MOBILE ? 1024 : 2048, MOBILE ? 1024 : 2048);
  sol.shadow.radius = 5; sol.shadow.bias = -0.0004; sol.shadow.normalBias = 0.03;
  scene.add(sol, sol.target);
  const contra = new THREE.DirectionalLight(0xd8e8ff, 0.8);
  contra.position.set(-60, 50, -70);
  scene.add(contra, new THREE.HemisphereLight(0xf4f8ff, 0x5a5230, 0.45));

  /* ---------- micro-habitat: terra, folhas secas, gravetos e pedrinhas ---------- */
  function terraTex() {
    const S = 512, c = document.createElement('canvas'); c.width = c.height = S;
    const g = c.getContext('2d');
    g.fillStyle = '#5e4730'; g.fillRect(0, 0, S, S);
    for (let i = 0; i < 14000; i++) {
      g.fillStyle = 'hsla(' + rnd(22, 40) + ',' + rnd(18, 42) + '%,' + rnd(14, 36) + '%,.55)';
      g.beginPath(); g.arc(Math.random() * S, Math.random() * S, rnd(0.4, 2.4), 0, 7); g.fill();
    }
    for (let i = 0; i < 900; i++) {
      g.fillStyle = 'hsla(' + rnd(70, 110) + ',' + rnd(25, 45) + '%,' + rnd(22, 38) + '%,.5)';
      g.beginPath(); g.arc(Math.random() * S, Math.random() * S, rnd(0.6, 2), 0, 7); g.fill();
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(10, 10);
    t.encoding = THREE.sRGBEncoding; t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return t;
  }
  const chao = new THREE.Mesh(new THREE.CircleGeometry(700, 64), new THREE.MeshStandardMaterial({ map: terraTex(), roughness: 0.96, envMapIntensity: 0.35 }));
  chao.rotation.x = -Math.PI / 2; chao.receiveShadow = true;
  scene.add(chao);
  function habitat(alcance) {
    const g = new THREE.Group();
    // folhas secas e verdes caídas
    const sh = new THREE.Shape();
    sh.moveTo(0, -1); sh.bezierCurveTo(0.7, -0.6, 0.65, 0.5, 0, 1); sh.bezierCurveTo(-0.65, 0.5, -0.7, -0.6, 0, -1);
    const fg = new THREE.ShapeGeometry(sh, 6); fg.rotateX(-Math.PI / 2);
    { const p = fg.attributes.position; for (let i = 0; i < p.count; i++) p.setY(i, 0.12 * p.getX(i) * p.getX(i)); fg.computeVertexNormals(); }
    const n = MOBILE ? 60 : 110;
    const folhas = new THREE.InstancedMesh(fg, new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 0.85 }), n);
    const o = new THREE.Object3D(), col = new THREE.Color();
    for (let i = 0; i < n; i++) {
      const r = alcance * (1.1 + Math.sqrt(Math.random()) * 2.2), a = Math.random() * Math.PI * 2, s = rnd(5, 12);
      o.position.set(Math.cos(a) * r, 0.3 + Math.random() * 0.6, Math.sin(a) * r);
      o.rotation.set(rnd(-0.15, 0.15), Math.random() * 7, rnd(-0.15, 0.15));
      o.scale.set(s * 0.55, s, s); o.updateMatrix(); folhas.setMatrixAt(i, o.matrix);
      folhas.setColorAt(i, Math.random() < 0.6 ? col.setHSL(rnd(0.06, 0.1), rnd(0.5, 0.7), rnd(0.16, 0.28)) : col.setHSL(rnd(0.2, 0.3), rnd(0.4, 0.6), rnd(0.14, 0.24)));
    }
    folhas.receiveShadow = true; g.add(folhas);
    // gravetos
    const mg = new THREE.MeshStandardMaterial({ color: '#5b4128', roughness: 0.9 });
    for (let i = 0; i < 6; i++) {
      const rg = rnd(0.6, 1.3), len = rnd(25, 60), gv = shadowy(new THREE.Mesh(new THREE.CylinderGeometry(rg, rg * 1.3, len, 7), mg));
      const r = alcance * rnd(1.3, 2.4), a = Math.random() * Math.PI * 2;
      gv.position.set(Math.cos(a) * r, rg, Math.sin(a) * r); gv.rotation.set(Math.PI / 2, 0, Math.random() * 7);
      g.add(gv);
    }
    // pedrinhas
    const mp = new THREE.MeshStandardMaterial({ color: '#7d7466', roughness: 0.85 });
    for (let i = 0; i < 14; i++) {
      const pd = shadowy(new THREE.Mesh(new THREE.DodecahedronGeometry(rnd(1, 3), 0), mp));
      const r = alcance * rnd(1.2, 2.4), a = Math.random() * Math.PI * 2;
      pd.position.set(Math.cos(a) * r, 0.5, Math.sin(a) * r); pd.scale.y = 0.6; pd.rotation.y = Math.random() * 7;
      g.add(pd);
    }
    scene.add(g);
  }

  /* ---------- câmera ---------- */
  const camera = new THREE.PerspectiveCamera(32, innerWidth / innerHeight, 0.5, 3000);
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  Object.assign(controls, { enableDamping: true, dampingFactor: 0.08, rotateSpeed: 0.8, screenSpacePanning: true, autoRotate: true, autoRotateSpeed: 0.8 });
  const ctx = { THREE, scene, camera, controls, renderer, A, MOBILE, chao, sol, estado: {}, aviso: avisoRapido, aoVivo: () => proc.ativo };
  let raio = 30, centro = new V3(0, 10, 0);
  function home(fator) {
    if (M.home && M.home(ctx, fator)) return;
    if (M.centroAtual) centro = M.centroAtual(ctx);
    const vfov = camera.fov * Math.PI / 180, hfov = 2 * Math.atan(Math.tan(vfov / 2) * camera.aspect);
    // o bicho ocupa ~60% da altura útil
    const d = raio / Math.sin(Math.min(vfov, hfov) / 2) * (fator || 0.75);
    controls.target.copy(centro);
    const dir = M.cena === 'teia' ? new V3(0.35, 0.15, 1) : new V3(0.95, 0.55, 1.05);
    camera.position.copy(centro).add(dir.normalize().multiplyScalar(d));
    controls.minDistance = raio * 0.5; controls.maxDistance = raio * 12;
    controls.maxPolarAngle = M.cena === 'teia' ? Math.PI * 0.75 : Math.PI * 0.48;
    controls.update();
    sol.position.copy(centro).add(new V3(raio * 2.5, raio * 6, raio * 3));
    sol.target.position.copy(centro);
    const s = raio * 3;
    Object.assign(sol.shadow.camera, { left: -s, right: s, top: s, bottom: -s, near: 1, far: raio * 20 });
    sol.shadow.camera.updateProjectionMatrix();
  }
  ctx.home = home;
  window.__bicho3d = ctx;    // para testes
  ctx.foco = (c, r) => { centro = c; raio = r; home(); };
  addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });

  /* ---------- tamanho real: grão de arroz, moeda e régua na mesma escala ---------- */
  let refs = null, tamanhoOn = false;
  function montarRefs() {
    const g = new THREE.Group();
    const arroz = shadowy(new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), new THREE.MeshStandardMaterial({ color: '#f4efe2', roughness: 0.55 })));
    arroz.scale.set(3.5, 1.1, 1.3); arroz.position.set(0, 1.1, 0); g.add(arroz);
    const moeda = shadowy(new THREE.Mesh(new THREE.CylinderGeometry(13.5, 13.5, 1.95, 48), new THREE.MeshStandardMaterial({ color: '#d8b45a', metalness: 0.85, roughness: 0.3 })));
    moeda.position.set(0, 0.98, 24); g.add(moeda);
    const regua = new THREE.Group();
    const base = shadowy(new THREE.Mesh(new THREE.BoxGeometry(100, 0.8, 9), new THREE.MeshStandardMaterial({ color: '#f5c451', roughness: 0.6 })));
    base.position.set(50, 0.4, 0); regua.add(base);
    const mt = new THREE.MeshBasicMaterial({ color: '#493528' });
    for (let mm = 0; mm <= 100; mm++) {
      const h = mm % 10 === 0 ? 5 : mm % 5 === 0 ? 3.5 : 2;
      const tk = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.2, h), mt); tk.position.set(mm, 0.85, -4.5 + h / 2); regua.add(tk);
    }
    regua.position.set(-10, 0, 46); g.add(regua);
    g.visible = false;
    scene.add(g);
    return g;
  }
  function tamanho() {
    tamanhoOn = !tamanhoOn;
    if (!refs) refs = montarRefs();
    refs.visible = tamanhoOn;
    if (tamanhoOn) {
      if (M.cena === 'teia') { refs.position.set(centro.x + raio * 0.75, centro.y - raio * 0.15, 3); refs.rotation.set(Math.PI / 2, 0, 0); }
      else { refs.position.set(centro.x + raio * 0.55, 0, centro.z - raio * 0.6); refs.rotation.set(0, 0.735, 0); }
      etiqueta('tam', true);
      home(1.25);
    } else { etiqueta('tam', false); home(); }
    $('cartao').hidden = !tamanhoOn;
    $('cartao').classList.toggle('topo', tamanhoOn);
    if (tamanhoOn) cartao('📏 Tamanho real', 'Grão de arroz, moeda de R$ 1 e régua em centímetros, na mesma escala ' + (A.art === 'o' ? 'do ' : 'da ') + (A.curto || A.nome) + ' (' + (A.comp ? A.comp.tam : '') + ').');
  }

  /* ---------- partes ---------- */
  let partesOn = false, modo = 'fora', passeioI = -1;
  let idade = 'pequeno'; try { idade = localStorage.getItem('bnb-idade') || 'pequeno'; } catch (e) {}
  ctx.idade = () => idade;
  const txt = (o) => (idade === 'pequeno' && o.pequeno) || o.texto;
  const labels = $('etiquetas');
  function partes() {
    partesOn = !partesOn;
    etiqueta('partes', partesOn);
    labels.innerHTML = '';
    const lista = (modo === 'dentro' && M.dentro && M.dentro.partes) || (M.partesAtuais && M.partesAtuais(ctx)) || M.partes || [];
    const passeio = lista.some((p) => p.ir);
    passeioI = -1;
    if (partesOn) lista.forEach((p, i) => {
      const b = document.createElement('button');
      b.className = 'etq'; b.type = 'button'; b.textContent = (idade === 'pequeno' && p.emoji ? p.emoji + ' ' : (p.emoji && passeio ? p.emoji + ' ' : (i + 1) + ' ')) + (idade === 'pequeno' && p.curto ? p.curto : p.nome);
      b.addEventListener('click', () => {
        labels.querySelectorAll('.etq').forEach((x) => x.classList.toggle('on', x === b));
        passeioI = i; cartao((p.emoji && passeio ? p.emoji + ' ' : '') + p.nome, txt(p));
        if (p.ir) p.ir(ctx);
      });
      b._p = p; labels.appendChild(b);
    });
    $('cartao-prox').hidden = !(partesOn && passeio);
    $('cartao').hidden = !partesOn;
    $('cartao').classList.remove('topo');
    if (partesOn) { controls.autoRotate = false; cartao('🔎 Partes', 'Toque numa etiqueta para saber para que serve cada parte.'); }
  }
  const _v = new V3();
  function moverEtiquetas() {
    if (!partesOn) return;
    labels.querySelectorAll('.etq').forEach((b) => {
      _v.copy(b._p.ponto(ctx)).project(camera);
      const vis = _v.z < 1 && (!b._p.visivel || b._p.visivel(ctx));
      b.style.display = vis ? '' : 'none';
      b.style.transform = 'translate(' + clamp((_v.x + 1) / 2 * innerWidth, 64, innerWidth - 64) + 'px,' + ((1 - _v.y) / 2 * innerHeight) + 'px) translate(-50%,-50%)';
    });
  }
  function cartao(t, txt) { $('cartao-t').textContent = t; $('cartao-p').textContent = txt; $('cartao').hidden = false; }
  ctx.cartao = cartao;
  ctx.mostrarPartes = (on) => { if (partesOn !== !!on) partes(); };
  ctx.carregando = (t) => { const el = $('carregando'); if (t) el.textContent = t; el.classList.toggle('fora', !t); };
  $('cartao-prox').addEventListener('click', () => {      // passeio: vai para a próxima etiqueta
    const ets = labels.querySelectorAll('.etq');
    if (ets.length) ets[(passeioI + 1) % ets.length].click();
  });
  $('cartao-x').addEventListener('click', () => { $('cartao').hidden = true; if (partesOn) partes(); if (tamanhoOn) tamanho(); });
  function avisoRapido(txt) { const a = $('aviso'); a.textContent = txt; a.classList.add('on'); clearTimeout(a._t); a._t = setTimeout(() => a.classList.remove('on'), 2600); }

  /* ---------- interface ---------- */
  const lado = $('acoes');
  let formaAtual = M.formas ? M.formas[0] : null;
  function ocultarBotoes() {
    const oc = (formaAtual && formaAtual.ocultar) || [];
    lado.querySelectorAll('.acao').forEach((b) => { b.hidden = oc.indexOf(b.dataset.id) >= 0; });
  }
  function botao(ico, rotulo, fn, idb) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'acao'; if (idb) b.dataset.id = idb;
    b.innerHTML = '<b>' + ico + '</b><span>' + rotulo + '</span>';
    b.addEventListener('click', () => { controls.autoRotate = false; fn(b); });
    lado.appendChild(b); return b;
  }
  function etiqueta(idb, on) { const b = lado.querySelector('[data-id="' + idb + '"]'); if (b) b.classList.toggle('on', on); }
  ctx.marcar = etiqueta;
  (M.acoes || []).forEach((a) => botao(a.ico, a.rotulo, (b) => a.fn(ctx, b), a.id));
  botao('🔎', 'Partes', () => partes(), 'partes');
  botao('📏', 'Tamanho', () => tamanho(), 'tam');
  botao('🔄', 'Câmera', () => { controls.autoRotate = !M.centroAtual; home(); }, 'cam');
  botao('👁', 'Só o bicho', () => document.body.classList.add('limpo'), 'limpo');
  $('voltar-ui').addEventListener('click', () => document.body.classList.remove('limpo'));

  /* ---------- Por Dentro do Bicho: modos, idade e passos guiados ---------- */
  const proc = { ativo: false, i: 0 };
  ctx.trocarForma = (id) => { const i = (M.formas || []).findIndex((f) => f.id === id); const b = $('abas').children[i]; if (b && !b.classList.contains('on')) b.click(); };
  function setModo(m) {
    if (partesOn) partes();
    if (proc.ativo) pararProcesso();
    modo = m;
    $('modos').querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.m === m));
    if (M.dentro) M.dentro.ligar(ctx, m !== 'fora');
    if (m === 'dentro') { controls.autoRotate = false; partes(); cartao('🫀 Por dentro', idade === 'pequeno' ? 'Olha o que tem dentro da ' + (A.curto || 'bicho') + '! Toque nos nomes.' : 'O corpo fica transparente para ver o que tem lá dentro. Toque nas etiquetas.'); Progresso.marcar(A.id, 'dentro'); }
    if (m === 'funciona') iniciarProcesso();
    if (m === 'fora') home();
  }
  function iniciarProcesso() {
    proc.ativo = true; proc.i = 0; controls.autoRotate = false;
    $('cartao').hidden = true;
    if (M.processo.iniciar) M.processo.iniciar(ctx);
    mostrarPasso();
  }
  function pararProcesso() { proc.ativo = false; $('passos').hidden = true; if (M.processo.parar) M.processo.parar(ctx); }
  function mostrarPasso() {
    const P = M.processo.passos, p = P[proc.i];
    $('passos').hidden = false;
    $('passo-t').textContent = M.processo.titulo;
    $('passo-p').textContent = txt(p);
    $('passo-dots').innerHTML = P.map((_, k) => '<i class="' + (k <= proc.i ? 'on' : '') + '"></i>').join('');
    $('passo-rev').hidden = M.processo.revisado !== false;
    const fim = proc.i === P.length - 1;
    $('passo-bt').textContent = fim ? '↺ Ver de novo' : 'Próximo →';
    $('passo-bt').hidden = !!p.espera && !fim;
    if (p.acao) p.acao(ctx);
  }
  ctx.passoFeito = () => { if (!proc.ativo) return; proc.i = Math.min(proc.i + 1, M.processo.passos.length - 1); mostrarPasso(); };
  $('passo-bt').addEventListener('click', () => {
    if (proc.i === M.processo.passos.length - 1) { iniciarProcesso(); return; }
    ctx.passoFeito();
  });
  $('passo-x').addEventListener('click', () => setModo('fora'));
  if (M.dentro || M.processo) {
    $('modos').hidden = false; document.body.classList.add('com-modos');
    $('modos').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => setModo(b.dataset.m)));
    if (!M.processo) $('modos').querySelector('[data-m="funciona"]').remove();
    if (!M.dentro) $('modos').querySelector('[data-m="dentro"]').remove();
  }
  const bIdade = $('idade');
  const pintaIdade = () => { bIdade.textContent = idade === 'pequeno' ? '🧸 Pequeno' : '🧒 Explorador'; bIdade.setAttribute('aria-label', 'Modo ' + (idade === 'pequeno' ? 'Pequeno (até 6 anos)' : 'Explorador (7 anos ou mais)') + '. Toque para trocar.'); };
  pintaIdade();
  bIdade.addEventListener('click', () => {
    idade = idade === 'pequeno' ? 'explorador' : 'pequeno';
    try { localStorage.setItem('bnb-idade', idade); } catch (e) {}
    pintaIdade(); document.body.classList.toggle('pequeno', idade === 'pequeno');
    avisoRapido(idade === 'pequeno' ? 'Modo Pequeno: frases curtas, uma coisa de cada vez.' : 'Modo Explorador: nomes e mais informações.');
    if (proc.ativo) mostrarPasso();
    if (partesOn) { partes(); partes(); }
  });
  document.body.classList.toggle('pequeno', idade === 'pequeno');

  if (M.formas) {
    const abas = $('abas');
    M.formas.forEach((f, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.textContent = f.nome; b.className = i === 0 ? 'on' : '';
      b.addEventListener('click', () => {
        abas.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
        if (partesOn) partes();
        if (modo !== 'fora' && M.dentro && M.dentro.forma && f.id !== M.dentro.forma) setModo('fora');
        if (tamanhoOn) tamanho();
        formaAtual = f; ocultarBotoes();
        const r = M.forma(f.id, ctx);
        if (r && r.then) r.then(() => home()); else home();
      });
      abas.appendChild(b);
    });
    ocultarBotoes();
  }

  // ficha e bolso
  Ficha.criar(A.id, { botao: false });
  $('ficha').addEventListener('click', () => Ficha.abrir(A.id));
  function bolso() {
    const no = Progresso.conta(A).feitas > 0;
    $('bolso').innerHTML = no ? '✓ No meu bolso' + (Progresso.vezes(A.id) ? ' · 👀 ' + Progresso.vezes(A.id) : '') : 'Ainda não encontrei uma dessas!';
    $('bolso').classList.toggle('no', no);
  }
  $('bolso').addEventListener('click', () => Ficha.abrir(A.id));
  document.addEventListener('ficha-fechou', bolso);
  document.addEventListener('ficha-mudou', bolso);

  // dicas do Curu (só nas primeiras visitas)
  function curu() {
    let n = 0; try { n = +localStorage.getItem('curu-dica-3d') || 0; localStorage.setItem('curu-dica-3d', n + 1); } catch (e) {}
    if (n > 2) return;
    const el = $('curu'), dicas = ['Use um dedo para girar ' + (A.art === 'o' ? 'o ' : 'a ') + (A.curto || 'bicho') + '!', 'Use dois dedos para chegar mais perto!', 'Toque nos botões do lado para explorar!'];
    let i = 0;
    const mostra = () => { if (i >= dicas.length) { el.classList.remove('on'); return; } el.querySelector('span').textContent = dicas[i++]; el.classList.add('on'); setTimeout(mostra, 3600); };
    setTimeout(mostra, 900);
  }

  // toque no bicho
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  let down = null;
  renderer.domElement.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; });
  renderer.domElement.addEventListener('pointerup', (e) => {
    if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 10 || performance.now() - down.t > 450) return;
    ndc.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hits = ctx.grupo ? ray.intersectObject(ctx.grupo, true) : [];
    if (proc.ativo && M.processo.toque) { M.processo.toque(ctx, hits, ray); return; }
    if (M.toqueCena) { M.toqueCena(ctx, ray); return; }
    if (hits.length && M.toque) M.toque(ctx);
  });
  controls.addEventListener('start', () => { controls.autoRotate = false; });

  const _seg = new V3(), _segD = new V3(); let _segAnt = null;
  /* ---------- montar e animar ---------- */
  setTimeout(() => {
    try {
      if (M.cena === 'teia') { scene.background = new THREE.Color('#3e6a48'); scene.fog = new THREE.Fog('#3e6a48', 300, 1000); }
      if (M.cenario === 'proprio') chao.visible = false;
      const r = M.construir(ctx);
      ctx.grupo = r.grupo; raio = r.raio; centro = r.centro;
      if (M.cenario === 'proprio') { /* o modelo monta o próprio cenário */ }
      else if (M.cena !== 'teia') habitat(raio);
      else habitat(raio * 0.6);
    } catch (err) { $('carregando').textContent = 'Não foi possível montar o 3D neste aparelho.'; console.error(err); return; }
    home();
    $('carregando').classList.add('fora');
    bolso(); curu();
    setTimeout(() => Progresso.marcar(A.id, '3d'), 2500);
    let last = performance.now(), visivel = true;
    document.addEventListener('visibilitychange', () => { visivel = !document.hidden; last = performance.now(); });
    renderer.setAnimationLoop(() => {
      if (!visivel) return;
      const now = performance.now(), dt = Math.min(0.1, (now - last) / 1000), t = now / 1000; last = now;
      if (M.update) M.update(dt, t, ctx);
      if (ctx.seguir) {                         // a câmera acompanha o bicho (voo)
        ctx.seguir.getWorldPosition(_seg);
        if (_segAnt) { _segD.subVectors(_seg, _segAnt); controls.target.add(_segD); camera.position.add(_segD); sol.position.add(_segD); sol.target.position.add(_segD); }
        _segAnt = (_segAnt || new V3()).copy(_seg);
      }
      controls.update();
      moverEtiquetas();
      renderer.render(ctx.cenaAtiva || scene, camera);
    });
  }, 60);
}
