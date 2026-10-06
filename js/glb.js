/* =====================================================================
   glb.js — trocar a formiga procedural por um modelo real (.glb)
   Uso: no js/species.js, preencha  glb: 'modelos/minha-formiga.glb'
        ou chame loadGLB(url).then(modelo => ...) no console.
   O modelo é ajustado para ter comprimento 1, centrado e com pés no chão.
   ===================================================================== */

function loadGLB(url) {
  return new Promise((resolve, reject) => {
    if (!THREE.GLTFLoader) { reject(new Error('GLTFLoader indisponível')); return; }
    new THREE.GLTFLoader().load(url, (gltf) => resolve(gltf.scene), undefined, reject);
  });
}

function normalizeModel(model, sp) {
  model.rotation.y = (sp.glbRotacaoY || 0) * Math.PI / 180;
  model.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new V3());
  const s = 1 / Math.max(size.x, size.z, 1e-6);
  const c = box.getCenter(new V3());
  const holder = new THREE.Group();
  holder.add(model);
  holder.scale.setScalar(s);
  holder.position.set(-c.x * s, -box.min.y * s, -c.z * s);
  const wrap = new THREE.Group();
  wrap.add(holder);
  wrap.userData.parts = null;   // modelos externos não têm partes separadas
  wrap.userData.antennae = [];
  wrap.userData.bodyHeight = size.y * s;
  return wrap;
}

// Avisados quando um .glb termina de carregar (ex.: refazer miniatura)
const glbListeners = [];

// Cria a formiga da espécie: procedural na hora e, se houver .glb,
// troca o conteúdo quando o arquivo terminar de carregar.
function createAnt(sp) {
  const root = new THREE.Group();
  const setInner = (inner) => {
    root.clear();
    root.add(inner);
    root.add(blobShadow(1.5, 1.0));
    root.userData = Object.assign({}, root.userData, inner.userData, { species: sp });
  };
  setInner(buildProceduralAnt(sp));
  if (sp.glb) {
    loadGLB(sp.glb).then((model) => {
      setInner(normalizeModel(model, sp));
      glbListeners.forEach((fn) => fn(sp, root));
    }).catch((e) => console.warn('Não consegui carregar ' + sp.glb + ' — usando a formiga procedural.', e));
  }
  return root;
}
