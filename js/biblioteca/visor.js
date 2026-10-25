/* =====================================================================
   Biblioteca 3D · registro de itens e visor interativo
   Cada item chama Biblioteca.item({ id, nome, cat, ... }, construir).
   construir(K) recebe ferramentas (K.mat, K.malha, K.grupo…) e devolve:
     { raiz, partes: [{ nome, texto, mais, malhas: [...] }],
       acoes: [{ rotulo, ico, fazer(E) }], animar(t, dt, E), alvo: [x,y,z] }
   E é o estado do item (as ações mudam E e o animar lê E a cada quadro).
   Tocar numa malha que pertence a uma parte destaca a parte e conta o que é.
   ===================================================================== */
const Biblioteca = (function () {
  if (THREE.ColorManagement) THREE.ColorManagement.legacyMode = false;
  const itens = [], porId = {};
  function item(info, construir) { info.construir = construir; itens.push(info); porId[info.id] = info; }

  /* ---------- ferramentas para os modelos ---------- */
  const K = {
    V: (x, y, z) => new THREE.Vector3(x, y, z),
    mat(cor, o) { return new THREE.MeshStandardMaterial(Object.assign({ color: cor, roughness: 0.6, metalness: 0 }, o || {})); },
    vidro(cor, o) { return new THREE.MeshPhysicalMaterial(Object.assign({ color: cor, roughness: 0.08, metalness: 0, transmission: 0.85, thickness: 0.6, ior: 1.5, transparent: true }, o || {})); },
    malha(geo, mat, x, y, z) { const m = new THREE.Mesh(geo, mat); m.position.set(x || 0, y || 0, z || 0); m.castShadow = true; m.receiveShadow = true; return m; },
    grupo(...filhos) { const g = new THREE.Group(); filhos.forEach((f) => f && g.add(f)); return g; },
    // superfície de revolução a partir de um perfil [[raio, altura], …]
    torno(perfil, seg) { return new THREE.LatheGeometry(perfil.map(([r, y]) => new THREE.Vector2(r, y)), seg || 32); },
    // tubo suave passando pelos pontos
    tubo(pts, raio, seg, radial) { return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))), seg || 24, raio, radial || 8, false); },
    // bagunça os vértices para virar algo orgânico ou pedra (mesma forma sempre)
    amassar(geo, forca, freq, semente) {
      const p = geo.attributes.position, v = new THREE.Vector3(), s = semente || 1;
      for (let i = 0; i < p.count; i++) {
        v.fromBufferAttribute(p, i);
        const n = Math.sin(v.x * freq + s) * Math.cos(v.y * freq * 1.3 + s * 2) * Math.sin(v.z * freq * 0.9 + s * 3) + 0.5 * Math.sin((v.x + v.y + v.z) * freq * 2.1 + s);
        v.multiplyScalar(1 + n * forca); p.setXYZ(i, v.x, v.y, v.z);
      }
      geo.computeVertexNormals(); return geo;
    },
    rand(seed) { let s = seed || 7; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; },
    // vai suavemente de a para b (para animações das ações)
    ir: (atual, alvo, dt, vel) => atual + (alvo - atual) * Math.min(1, dt * (vel || 4)),
    textura(w, h, desenhar) { const c = document.createElement('canvas'); c.width = w; c.height = h; desenhar(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = 4; return t; }
  };

  /* ---------- palco 3D compartilhado ---------- */
  let renderer, scene, camera, controles, chao, pmrem;
  function palco(canvas) {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.outputEncoding = THREE.sRGBEncoding; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.physicallyCorrectLights = true;
    scene = new THREE.Scene();
    pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new THREE.RoomEnvironment(), 0.04).texture;
    camera = new THREE.PerspectiveCamera(35, 1, 0.01, 100);
    const sol = new THREE.DirectionalLight('#fff4e0', 2.2); sol.position.set(3, 6, 4); sol.castShadow = true; sol.shadow.mapSize.set(1024, 1024);
    Object.assign(sol.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: 0.5, far: 20 }); sol.shadow.bias = -0.0008; sol.shadow.radius = 4;
    scene.add(sol, new THREE.HemisphereLight('#eaf6ff', '#c9b48a', 0.6));
    chao = new THREE.Mesh(new THREE.CircleGeometry(4, 48), new THREE.ShadowMaterial({ opacity: 0.18 })); chao.rotation.x = -Math.PI / 2; chao.receiveShadow = true; scene.add(chao);
    controles = new THREE.OrbitControls(camera, canvas);
    controles.enableDamping = true; controles.dampingFactor = 0.08; controles.enablePan = false; controles.autoRotate = true; controles.autoRotateSpeed = 1.2;
    controles.addEventListener('start', () => { controles.autoRotate = false; });
    return { renderer, scene, camera, controles };
  }

  // monta um item no palco: centraliza, apoia no chão e enquadra a câmera
  function montar(info, pronto) {
    const M = pronto || info.construir(K);
    const caixa = new THREE.Box3().setFromObject(M.raiz), c = caixa.getCenter(new THREE.Vector3()), tam = caixa.getSize(new THREE.Vector3());
    M.raiz.position.x -= c.x; M.raiz.position.z -= c.z; M.raiz.position.y -= caixa.min.y;
    const raio = Math.max(tam.x, tam.y, tam.z) * 0.62;
    M.raio = raio; M.alvo = new THREE.Vector3(0, tam.y * 0.45, 0);
    // cada malha com seu material: o destaque de uma parte não acende as outras que usavam o mesmo
    M.raiz.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; if (o.material && o.material.clone) o.material = o.material.clone(); } });
    (M.partes || []).forEach((p, i) => p.malhas.forEach((m) => m.traverse((o) => { if (o.isMesh) o.userData.parte = i; })));
    M.E = M.E || {};
    return M;
  }
  function enquadrar(M, W, H) {
    const asp = W / H, fov = THREE.MathUtils.degToRad(camera.fov), dist = M.raio / Math.sin(fov / 2) * (asp < 1 ? 1.15 / Math.max(asp, 0.55) : 1.05);
    camera.position.set(M.alvo.x + dist * 0.62, M.alvo.y + dist * 0.42, M.alvo.z + dist * 0.66);
    controles.target.copy(M.alvo); controles.minDistance = dist * 0.35; controles.maxDistance = dist * 2.2; controles.update();
    chao.scale.setScalar(Math.max(0.5, M.raio));
  }

  /* ---------- modelo pronto (.glb), feito por artista ou escaneado ----------
     No item: glb: 'modelos3d/quartzo.glb', glbTamanho (tamanho na cena, padrão 1.6),
     partes: [{ nome, texto, mais, malhas: ['NomeDaMalha', …] }]  (nomes do arquivo; vale o começo do nome)
     acoes: [{ rotulo, ico, clipe: 'NomeDaAnimacao' }], parado: 'Idle'  (animações que vêm no arquivo)
     credito: { autor, licenca, link }  (CC BY exige crédito)
     Se o arquivo faltar ou falhar, o visor usa o modelo feito em código (construir). */
  let gltfLoader = null;
  function carregarGLB(info) {
    if (!THREE.GLTFLoader) return Promise.reject(new Error('GLTFLoader não carregado'));
    if (!gltfLoader) { gltfLoader = new THREE.GLTFLoader(); if (window.MeshoptDecoder) gltfLoader.setMeshoptDecoder(window.MeshoptDecoder); }
    return new Promise((ok, erro) => gltfLoader.load(info.glb, ok, undefined, erro)).then((g) => {
      const raiz = new THREE.Group(), cena = g.scene; raiz.add(cena);
      const tam = new THREE.Box3().setFromObject(cena).getSize(new THREE.Vector3());
      cena.scale.setScalar((info.glbTamanho || 1.6) / Math.max(tam.x, tam.y, tam.z, 1e-6));
      const porNome = (n) => { const l = []; cena.traverse((o) => { if (o.name && o.name.startsWith(n)) l.push(o); }); return l; };
      const partes = (info.partes || []).map((p) => ({ nome: p.nome, texto: p.texto, mais: p.mais, malhas: [].concat(p.malhas || []).flatMap(porNome) })).filter((p) => p.malhas.length);
      const mixer = g.animations.length ? new THREE.AnimationMixer(cena) : null;
      const clipe = (n) => g.animations.find((a) => a.name === n) || g.animations[0];
      if (mixer && info.parado) mixer.clipAction(clipe(info.parado)).play();
      const acoes = (info.acoes || []).filter((a) => a.clipe).map((a) => ({ rotulo: a.rotulo, ico: a.ico, fazer() {
        if (!mixer) return;
        const ac = mixer.clipAction(clipe(a.clipe)); ac.reset(); ac.setLoop(THREE.LoopOnce, 1); ac.play();
      } }));
      return { raiz, partes, acoes, animar: mixer ? (t, dt) => mixer.update(dt) : null, glb: true };
    });
  }

  /* ---------- miniaturas: o mesmo modelo, fotografado uma vez ---------- */
  const fotos = {};
  function miniatura(info, tam) {
    if (fotos[info.id]) return fotos[info.id];
    const M = montar(info); scene.add(M.raiz);
    renderer.setSize(tam, tam, false); camera.aspect = 1; camera.updateProjectionMatrix();
    (M.acoesIniciais || []).forEach((f) => f(M.E));
    if (M.animar) for (let i = 0; i < 40; i++) M.animar(i * 0.05, 0.05, M.E);
    enquadrar(M, tam, tam); camera.position.sub(controles.target).multiplyScalar(1.22).add(controles.target); camera.lookAt(controles.target); renderer.render(scene, camera);
    const url = renderer.domElement.toDataURL('image/png');
    scene.remove(M.raiz); descartar(M.raiz);
    return (fotos[info.id] = url);
  }
  function descartar(o) { o.traverse((x) => { if (x.geometry) x.geometry.dispose(); if (x.material) [].concat(x.material).forEach((m) => { if (m.map) m.map.dispose(); m.dispose(); }); }); }

  return { item, itens, porId, K, palco, montar, carregarGLB, enquadrar, miniatura, descartar, get camera() { return camera; }, get renderer() { return renderer; }, get scene() { return scene; }, get controles() { return controles; } };
})();
