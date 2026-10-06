/* =====================================================================
   stage.js — palco 3D compartilhado: renderizador único, câmera,
   controles de toque, enquadramento, rótulos e miniaturas.
   (Um único WebGL para todas as telas: leve para iPads antigos.)
   ===================================================================== */

const app = { screen: 'home', view: 'ant', species: null, scene: null, labels: [] };
let renderer, camera, controls, thumbCam;
let idleTimer = null;
const $ = (id) => document.getElementById(id);

function initStage() {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  $('stage').appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.01, 100);
  thumbCam = new THREE.PerspectiveCamera(30, 4 / 3, 0.01, 100);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.rotateSpeed = 0.8;

  // para de girar sozinha quando a criança toca; volta depois de um tempo
  controls.addEventListener('start', () => {
    controls.autoRotate = false;
    clearTimeout(idleTimer);
  });
  controls.addEventListener('end', () => {
    clearTimeout(idleTimer);
    if (app.screen === 'ant' && app.view === 'ant') {
      idleTimer = setTimeout(() => { controls.autoRotate = true; }, CONFIG.VOLTA_A_GIRAR_S * 1000);
    }
  });
}

function makeScene() {
  const s = new THREE.Scene();
  s.add(new THREE.HemisphereLight(0xffffff, 0x8a6a4a, 0.72));
  const d = new THREE.DirectionalLight(0xffffff, 0.62);
  d.position.set(2, 4, 3);
  s.add(d);
  const d2 = new THREE.DirectionalLight(0xfff0dd, 0.25);
  d2.position.set(-3, 1, -2);
  s.add(d2);
  return s;
}

// Enquadra uma caixa: pela esfera (giro livre) ou pela caixa (cenas largas)
function fitCamera(box, dir, opts) {
  opts = opts || {};
  const center = box.getCenter(new V3());
  const size = box.getSize(new V3());
  const vfov = camera.fov * Math.PI / 180;
  const hfov = 2 * Math.atan(Math.tan(vfov / 2) * camera.aspect);
  const usableW = opts.usableW || 1;
  let dist;
  if (opts.sphere) {
    const r = size.length() / 2;
    dist = Math.max(r / Math.sin(vfov / 2), r / Math.sin(Math.atan(Math.tan(hfov / 2) * usableW)));
  } else {
    const elev = Math.asin(Math.min(1, Math.abs(dir.y)));
    const hEff = size.y * Math.cos(elev) + size.z * Math.sin(elev);
    const dW = (size.x / 2) / (Math.tan(hfov / 2) * usableW);
    const dH = (hEff / 2) / Math.tan(vfov / 2);
    dist = Math.max(dW, dH) + size.z / 2;
  }
  dist *= opts.margin || 1.15;
  if (opts.offsetY) center.y += opts.offsetY * size.y;
  camera.position.copy(center).addScaledVector(dir.clone().normalize(), dist);
  camera.near = dist / 100;
  camera.far = dist * 20;
  camera.updateProjectionMatrix();
  controls.target.copy(center);
  controls.minDistance = dist * (opts.minF || 0.45);
  controls.maxDistance = dist * (opts.maxF || 2.2);
  controls.update();
}

// Desloca a imagem para a esquerda quando há botões à direita (iPad deitado)
function sideOffset() {
  const w = window.innerWidth, h = window.innerHeight;
  if (app.screen === 'ant' && w > h) camera.setViewOffset(w, h, Math.min(110, w * 0.09), 0, w, h);
  else camera.clearViewOffset();
}

// ---------- rótulos HTML presos a pontos 3D ----------
function addLabel(container, html, worldPosFn, color, onTap) {
  const el = document.createElement(onTap ? 'button' : 'div');
  el.className = 'label3d' + (onTap ? ' tap' : '');
  el.innerHTML = html;
  if (color) el.style.setProperty('--lc', color);
  if (onTap) el.addEventListener('click', onTap);
  container.appendChild(el);
  app.labels.push({ el, pos: worldPosFn });
}
function clearLabels() {
  app.labels.forEach((l) => l.el.remove());
  app.labels = [];
}
function updateLabels() {
  const w = window.innerWidth, h = window.innerHeight;
  const v = new V3();
  for (const l of app.labels) {
    v.copy(l.pos()).project(camera);
    l.el.style.display = v.z < 1 ? '' : 'none';
    l.el.style.transform = 'translate(' + ((v.x + 1) / 2 * w) + 'px,' + ((1 - v.y) / 2 * h) + 'px) translate(-50%,-100%)';
  }
}

// ---------- miniatura: desenha a cena numa imagem PNG transparente ----------
function snapshot(scene, cam, w, h) {
  const S = 2; // renderiza em 2x e reduz: bordas suaves
  const W = w * S, H = h * S;
  const rt = new THREE.WebGLRenderTarget(W, H);
  const buf = new Uint8Array(W * H * 4);
  renderer.setRenderTarget(rt);
  renderer.setClearColor(0x000000, 0);
  renderer.clear();
  renderer.render(scene, cam);
  renderer.readRenderTargetPixels(rt, 0, 0, W, H, buf);
  renderer.setRenderTarget(null);
  rt.dispose();
  const big = document.createElement('canvas');
  big.width = W; big.height = H;
  const bg = big.getContext('2d');
  const img = bg.createImageData(W, H);
  const row = W * 4;
  for (let y = 0; y < H; y++) {             // WebGL lê de baixo para cima
    const src = (H - 1 - y) * row, dst = y * row;
    for (let x = 0; x < row; x += 4) {
      const a = buf[src + x + 3];
      const k = a > 0 && a < 255 ? 255 / a : 1; // desfaz alfa pré-multiplicado
      img.data[dst + x] = Math.min(255, buf[src + x] * k);
      img.data[dst + x + 1] = Math.min(255, buf[src + x + 1] * k);
      img.data[dst + x + 2] = Math.min(255, buf[src + x + 2] * k);
      img.data[dst + x + 3] = a;
    }
  }
  bg.putImageData(img, 0, 0);
  const out = document.createElement('canvas');
  out.width = w; out.height = h;
  const og = out.getContext('2d');
  og.imageSmoothingEnabled = true;
  og.imageSmoothingQuality = 'high';
  og.drawImage(big, 0, 0, w, h);
  return out.toDataURL('image/png');
}

// ---------- troca de tela ----------
const screenLeaveHooks = [];
function showScreen(name) {
  app.screen = name;
  document.body.dataset.screen = name;
  ['home', 'ant', 'compare'].forEach((s) => $(s).classList.toggle('on', s === name));
  $('stage').style.visibility = name === 'home' ? 'hidden' : 'visible';
  clearLabels();
  screenLeaveHooks.forEach((fn) => fn());
  stopSpeech();
}
