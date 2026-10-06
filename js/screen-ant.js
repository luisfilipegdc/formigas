/* =====================================================================
   screen-ant.js — tela de UMA formiga:
   giro 3D, 🔊 curiosidades, "Conte as partes" e "Tamanho real"
   ===================================================================== */

let antScene, sizeScene, sizeGroup = null;
const antCache = {};       // formiga principal de cada espécie
const sizeAntCache = {};   // cópia usada na cena "Tamanho real"
const factIdx = {};

const PARTES = [
  { k: 'head', fala: 'cabeça', texto: 'cabeça', cor: '#ff4f7b' },
  { k: 'thorax', fala: 'tórax', texto: 'tórax', cor: '#ffad1f' },
  { k: 'abdomen', fala: 'abdômen', texto: 'abdômen', cor: '#2fa8ff' },
  { k: 'legs', fala: '6 pernas', texto: '6 pernas', cor: '#2ec95c', n: 6 },
  { k: 'antennae', fala: '2 antenas', texto: '2 antenas', cor: '#a95bff', n: 2 }
];

function initAntScreen() {
  antScene = makeScene();
  sizeScene = makeScene();
  SPECIES.forEach((sp) => { antCache[sp.id] = createAnt(sp); });

  $('btnSpeak').addEventListener('click', speakFact);
  $('btnParts').addEventListener('click', countParts);
  $('btnSize').addEventListener('click', () => {
    stopSpeech();
    setView(app.view === 'size' ? 'ant' : 'size');
    if (app.view === 'ant') say(app.species.nome);
  });
  onSpeakingChange.push((on) => $('btnSpeak').classList.toggle('talking', on));
  screenLeaveHooks.push(stopCount);
}

function openAnt(sp) {
  showScreen('ant');
  app.species = sp;
  document.body.style.setProperty('--especie', sp.corCartao);
  $('antName').textContent = sp.nomeCurto;
  say(sp.nome);
  setView('ant');
}

function setView(view, silent) {
  const sp = app.species;
  app.view = view;
  clearLabels();
  stopCount();
  $('btnSize').classList.toggle('active', view === 'size');
  clearTimeout(idleTimer);
  sideOffset();
  if (view === 'ant') showAnt(sp);
  else buildSizeScene(sp, silent);
}

// ---------- formiga grande girando ----------
function showAnt(sp) {
  antScene.children.filter((o) => o.userData.isAntRoot).forEach((o) => antScene.remove(o));
  const ant = antCache[sp.id];
  ant.userData.isAntRoot = true;
  ant.rotation.y = 0;
  antScene.add(ant);
  app.scene = antScene;
  const landscape = window.innerWidth > window.innerHeight;
  fitCamera(new THREE.Box3().setFromObject(ant), new V3(0.9, 0.55, 1.2),
    { sphere: true, margin: landscape ? 0.95 : 1.05, minF: 0.4, maxF: 2.2, usableW: landscape ? 0.8 : 1 });
  controls.maxPolarAngle = Math.PI * 0.62;
  controls.autoRotate = true;
  controls.autoRotateSpeed = CONFIG.GIRO_AUTOMATICO;
}

function animateAntennae(t) {
  if (app.screen !== 'ant' || app.view !== 'ant' || !app.species) return;
  antCache[app.species.id].userData.antennae.forEach((ag, i) => {
    ag.rotation.y = Math.sin(t * 2.2 + i * 1.7) * 0.12;
    ag.rotation.z = Math.sin(t * 1.6 + i) * 0.08;
  });
}

// ---------- Tamanho real: formiga + grão de arroz + ponta de dedo (em mm) ----------
function buildSizeScene(sp, silent) {
  if (sizeGroup) sizeScene.remove(sizeGroup);
  sizeGroup = new THREE.Group();
  sizeScene.add(sizeGroup);
  app.scene = sizeScene;
  controls.autoRotate = false;

  const mm = sp.tamanhoMm, gap = 5, antX = 0;
  if (!sizeAntCache[sp.id]) sizeAntCache[sp.id] = createAnt(sp);
  const ant = sizeAntCache[sp.id];
  ant.scale.setScalar(mm);
  ant.position.set(antX, 0, 0);
  sizeGroup.add(ant);

  // grão de arroz
  const R = CONFIG.ARROZ_MM;
  const riceX = antX + mm / 2 + gap + R / 2;
  const rice = ellipsoid(mat('#eadbb4', { shininess: 35, specular: 0x333333 }), R, R * 0.32, R * 0.36);
  rice.position.set(riceX, R * 0.15, 0);
  rice.rotation.y = 0.15;
  sizeGroup.add(rice);
  const rs = blobShadow(R * 1.3, R * 0.6);
  rs.position.set(riceX, 0.01, 0);
  sizeGroup.add(rs);

  // ponta do dedo (vindo da direita)
  const D = CONFIG.DEDO_MM, fr = D / 2, fLen = D * 2.6;
  const tipX = riceX + R / 2 + gap;
  sizeGroup.add(buildFinger(tipX, D, fr, fLen));

  // mesa
  const table = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshLambertMaterial({ color: 0xd9bd8f }));
  table.rotation.x = -Math.PI / 2;
  table.position.y = -0.02;
  sizeGroup.add(table);

  // régua em milímetros, na frente de tudo
  const r0 = Math.floor(antX - Math.max(mm, 4) / 2 - 2), rLen = Math.ceil(tipX + D * 1.6 - r0);
  const ruler = new THREE.Mesh(new THREE.PlaneGeometry(rLen, 5), new THREE.MeshLambertMaterial({ map: rulerTexture(rLen) }));
  ruler.rotation.x = -Math.PI / 2;
  ruler.position.set(r0 + rLen / 2, 0, D * 0.75 + 2.5);
  sizeGroup.add(ruler);

  const box = new THREE.Box3(new V3(antX - Math.max(mm, 4) / 2 - 1, 0, -D * 0.6), new V3(tipX + D * 1.6, D * 1.1, D * 0.75 + 5));
  fitCamera(box, new V3(0, 1.5, 1),
    { margin: 1.15, minF: 0.35, maxF: 2.0, offsetY: 0.5, usableW: window.innerWidth > window.innerHeight ? 0.82 : 1 });
  controls.maxPolarAngle = Math.PI * 0.45;

  const c = $('antLabels');
  const antH = ant.userData.bodyHeight * mm;
  addLabel(c, '<span class="em">🐜</span><span class="t">' + sp.nomeCurto + '</span><span class="mm">' + mmTexto(mm) + '</span>',
    () => new V3(antX, Math.max(antH, 0.5) * 1.3 + 0.6, 0), sp.corCartao);
  addLabel(c, '<span class="em">🍚</span><span class="t">arroz</span>', () => new V3(riceX, R * 0.35 + 0.8, 0), '#fff');
  addLabel(c, '<span class="em">👆</span><span class="t">dedo</span>', () => new V3(tipX + fr * 1.3, D * 1.75 + 0.6, 0), '#ffd7c2');

  if (!silent) say(sp.nome + ' mede ' + mmFala(mm) + '. ' + comparaTamanho(mm));
}

function buildFinger(tipX, D, fr, fLen) {
  const skin = mat('#e8a37c', { shininess: 6, specular: 0x111111 });
  const finger = new THREE.Group();
  const tip = ellipsoid(skin, D * 1.05, D * 0.82, D);
  tip.position.set(tipX + fr * 1.05, fr * 0.8, 0);
  finger.add(tip);
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 18), skin);
  shaft.scale.set(fr * 0.82, fLen, fr);
  shaft.rotation.z = Math.PI / 2;
  shaft.position.set(tipX + fr * 1.05 + fLen / 2, fr * 0.8, 0);
  finger.add(shaft);
  const nail = ellipsoid(mat('#f3c4b2', { shininess: 40, specular: 0x333333 }), D * 0.62, D * 0.1, D * 0.56);
  nail.position.set(tipX + D * 0.5, D * 0.8, 0);
  nail.rotation.z = -0.12;
  finger.add(nail);
  const fs = blobShadow(fLen, D * 1.2);
  fs.position.set(tipX + fLen / 2, 0.01, 0);
  finger.add(fs);
  return finger;
}

// ---------- 🔊 curiosidades (uma diferente a cada toque) ----------
function speakFact() {
  const sp = app.species;
  if (!sp) return;
  stopCount();
  stopSpeech();
  const i = factIdx[sp.id] === undefined ? 0 : (factIdx[sp.id] + 1) % sp.curiosidades.length;
  factIdx[sp.id] = i;
  const fact = sp.curiosidades[i];
  showBubble(fact, '#ffd23f', 0, true);
  say(sp.nome + '! ' + fact).then(() => { if (!counting) hideBubbleSoon(); });
}

// ---------- bolha de texto ----------
let bubbleTimer = null;
function showBubble(text, color, dots, small) {
  clearTimeout(bubbleTimer);
  const b = $('bubble');
  b.style.setProperty('--bc', color);
  const tx = $('bubbleText');
  tx.textContent = text;
  tx.classList.toggle('small', !!small);
  const d = $('bubbleDots');
  d.innerHTML = '';
  for (let i = 0; i < (dots || 0); i++) d.appendChild(document.createElement('i'));
  b.classList.add('on');
}
function lightDot(i) {
  const d = $('bubbleDots').children[i];
  if (d) d.classList.add('lit');
}
function hideBubbleSoon(ms) {
  clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(() => $('bubble').classList.remove('on'), ms || 1800);
}

// ---------- Conte as partes ----------
let counting = false, countToken = 0;

function allPartMats(parts) {
  return [].concat(parts.head, parts.thorax, parts.abdomen, parts.legs, parts.antennae);
}
function resetColors(parts) {
  if (!parts) return;
  allPartMats(parts).forEach((m) => { m.color.copy(m.userData.base); m.emissive.setRGB(0, 0, 0); });
}
function dimAll(parts) {
  const white = new THREE.Color('#ffffff');
  allPartMats(parts).forEach((m) => { m.color.copy(m.userData.base).lerp(white, 0.6); m.emissive.setRGB(0, 0, 0); });
}
function paint(m, hex) {
  m.color.set(hex);
  m.emissive.set(hex).multiplyScalar(0.25);
}
function stopCount() {
  countToken++;
  if (counting) {
    counting = false;
    $('btnParts').classList.remove('active');
    stopSpeech();
    $('bubble').classList.remove('on');
  }
  SPECIES.forEach((sp) => resetColors(antCache[sp.id] && antCache[sp.id].userData.parts));
}

async function countParts() {
  if (counting) { stopCount(); return; }
  if (app.view !== 'ant') setView('ant');
  stopSpeech();
  const token = ++countToken;
  const alive = () => token === countToken;
  counting = true;
  $('btnParts').classList.add('active');
  const parts = antCache[app.species.id].userData.parts; // null em modelos .glb
  for (const p of PARTES) {
    if (!alive()) return;
    if (parts) dimAll(parts);
    showBubble(p.texto, p.cor, p.n || 0);
    const speech = say(p.fala);
    if (parts && p.n) {                  // pernas e antenas acendem uma a uma
      for (let i = 0; i < parts[p.k].length; i++) {
        if (!alive()) return;
        paint(parts[p.k][i], p.cor);
        lightDot(i);
        await wait(320);
      }
    } else if (parts) {
      parts[p.k].forEach((m) => paint(m, p.cor));
    } else if (p.n) {
      for (let i = 0; i < p.n; i++) { lightDot(i); await wait(320); }
    }
    await Promise.all([speech, wait(1300)]);
    if (!alive()) return;
    await wait(350);
  }
  if (!alive()) return;
  if (parts) PARTES.forEach((p) => parts[p.k].forEach((m) => paint(m, p.cor)));
  showBubble('👏 Muito bem!', '#ffd23f', 0);
  await Promise.all([say('Muito bem!'), wait(2200)]);
  if (!alive()) return;
  counting = false;
  $('btnParts').classList.remove('active');
  resetColors(parts);
  hideBubbleSoon(200);
}
