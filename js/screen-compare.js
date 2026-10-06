/* =====================================================================
   screen-compare.js — "Quem é maior?": as 5 formigas lado a lado,
   em escala real relativa (mm), da menor para a maior, sobre uma régua.
   ===================================================================== */

let compareScene;
let compareOrder = [];
const compareAnts = {};

function initCompareScreen() {
  compareScene = makeScene();
  buildCompareScene();
  $('btnCompare').addEventListener('click', () => openCompare());
  $('btnSpeakCompare').addEventListener('click', () => {
    stopSpeech();
    const a = compareOrder[0], z = compareOrder[compareOrder.length - 1];
    say('A menor é a ' + a.nomeCurto.toLowerCase() + '. A maior é a ' + z.nome.toLowerCase() + '!');
  });
}

function rulerTexture(totalMm) {
  const pxPerMm = 24, w = Math.ceil(totalMm * pxPerMm), h = 128;
  const c = document.createElement('canvas');
  c.width = Math.min(4096, w); c.height = h;
  const k = c.width / w;
  const g = c.getContext('2d');
  g.fillStyle = '#ffd54f';
  g.fillRect(0, 0, c.width, h);
  g.fillStyle = '#7a4a12';
  g.font = 'bold 44px sans-serif';
  g.textAlign = 'center';
  for (let i = 0; i <= totalMm; i++) {
    const x = i * pxPerMm * k;
    const big = i % 10 === 0, mid = i % 5 === 0;
    g.fillRect(x - (big ? 2 : 1), 0, big ? 4 : 2, big ? 56 : mid ? 38 : 22);
    if (big && i > 0 && i < totalMm) g.fillText((i / 10) + ' cm', x, 108);
  }
  const t = new THREE.CanvasTexture(c);
  t.anisotropy = 4;
  return t;
}

function buildCompareScene() {
  compareOrder = SPECIES.slice().sort((a, b) => a.tamanhoMm - b.tamanhoMm);
  const gap = 9;
  let x = 0;
  compareOrder.forEach((sp, i) => {
    if (!compareAnts[sp.id]) compareAnts[sp.id] = createAnt(sp);
    const ant = compareAnts[sp.id];
    const mm = sp.tamanhoMm;
    const prev = compareOrder[i - 1];
    x += i ? Math.max(gap + mm / 2, 15 - prev.tamanhoMm / 2) : 4 + mm / 2;
    ant.scale.setScalar(mm);
    ant.position.set(x, 0, 0);
    ant.userData.isAntRoot = true;
    ant.userData.cx = x;
    compareScene.add(ant);
    x += mm / 2;
  });
  const total = Math.ceil((x + 4) / 10) * 10;
  const ruler = new THREE.Mesh(new THREE.PlaneGeometry(total, 7),
    new THREE.MeshLambertMaterial({ map: rulerTexture(total) }));
  ruler.name = 'ruler';
  ruler.rotation.x = -Math.PI / 2;
  ruler.position.set(total / 2, 0, 11);
  compareScene.add(ruler);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), new THREE.MeshLambertMaterial({ color: 0xe4cf9f }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.02;
  compareScene.add(ground);
}

function antsBox() {
  const box = new THREE.Box3();
  compareOrder.forEach((sp) => box.expandByObject(compareAnts[sp.id]));
  return box;
}

function openCompare(silent) {
  showScreen('compare');
  app.view = 'compare';
  app.scene = compareScene;
  camera.clearViewOffset();
  const box = antsBox();
  box.min.z = -6; box.max.z = 15;
  box.min.x -= 7; box.max.x += 1;  // espaço para o rótulo da menor
  box.max.y += 5;  // espaço para os rótulos
  fitCamera(box, new V3(0, 0.42, 1), { margin: 1.02, minF: 0.4, maxF: 1.8, offsetY: -0.15 });
  controls.autoRotate = false;
  controls.maxPolarAngle = Math.PI * 0.48;
  const c = $('compareLabels');
  compareOrder.forEach((sp) => {
    const ant = compareAnts[sp.id];
    const h = ant.userData.bodyHeight * sp.tamanhoMm;
    addLabel(c, '<span class="t">' + sp.nomeCurto + '</span><span class="mm">' + mmTexto(sp.tamanhoMm) + '</span>',
      () => new V3(ant.userData.cx, h * 1.15 + 1.2, 0), sp.corCartao,
      () => { stopSpeech(); say(sp.nome + '. ' + mmFala(sp.tamanhoMm) + '.'); });
  });
  if (!silent) say('Quem é maior? Da menor para a maior!');
}

// Miniatura para o botão da tela inicial
function compareThumb() {
  const box = antsBox();
  const c = box.getCenter(new V3()), sz = box.getSize(new V3());
  thumbCam.aspect = 2.4;
  const hf = Math.tan(thumbCam.fov * Math.PI / 360) * thumbCam.aspect;
  const d = (sz.x / 2) / hf * 1.08 + sz.z;
  thumbCam.position.copy(c).add(new V3(0, 0.35, 1).normalize().multiplyScalar(d));
  thumbCam.lookAt(c);
  thumbCam.near = d / 50; thumbCam.far = d * 10;
  thumbCam.updateProjectionMatrix();
  const hidden = compareScene.children.filter((o) => !o.userData.isAntRoot && o.isMesh);
  hidden.forEach((o) => { o.visible = false; });
  const url = snapshot(compareScene, thumbCam, 288, 120);
  hidden.forEach((o) => { o.visible = true; });
  return url;
}
