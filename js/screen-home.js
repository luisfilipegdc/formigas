/* =====================================================================
   screen-home.js — tela inicial: 5 cartões grandes com miniatura 3D
   (cada miniatura é desenhada uma vez só, como imagem: bem leve)
   ===================================================================== */

function antThumb(sp) {
  const ant = antCache[sp.id];
  antScene.add(ant);
  ant.rotation.y = 0;
  const box = new THREE.Box3().setFromObject(ant);
  const c = box.getCenter(new V3());
  const r = box.getSize(new V3()).length() / 2;
  thumbCam.aspect = 4 / 3;
  const d = r / Math.sin(thumbCam.fov * Math.PI / 360) * 0.7;
  thumbCam.position.copy(c).add(new V3(0.55, 0.62, 1).normalize().multiplyScalar(d));
  thumbCam.near = d / 50; thumbCam.far = d * 10;
  thumbCam.lookAt(c);
  thumbCam.updateProjectionMatrix();
  const url = snapshot(antScene, thumbCam, 320, 240);
  antScene.remove(ant);
  return url;
}

function initHomeScreen() {
  const wrap = $('cards');
  wrap.innerHTML = '';
  SPECIES.forEach((sp) => {
    const b = document.createElement('button');
    b.className = 'card';
    b.dataset.id = sp.id;
    b.style.setProperty('--c', sp.corCartao);
    b.setAttribute('aria-label', sp.nome);
    const img = new Image();
    img.alt = '';
    img.src = antThumb(sp);
    b.appendChild(img);
    const nm = document.createElement('div');
    nm.className = 'nm';
    nm.textContent = sp.nomeCurto;
    b.appendChild(nm);
    b.addEventListener('click', () => openAnt(sp));
    wrap.appendChild(b);
  });

  $('compareThumb').src = compareThumb();
  $('compareThumb').hidden = false;
  $('compareIcon').hidden = true;

  document.querySelectorAll('[data-home]').forEach((b) => b.addEventListener('click', () => showScreen('home')));

  // quando um .glb carrega, refaz a miniatura do cartão
  glbListeners.push((sp, root) => {
    if (root !== antCache[sp.id]) return;
    const img = document.querySelector('.card[data-id="' + sp.id + '"] img');
    if (img) img.src = antThumb(sp);
  });
}
