/* =====================================================================
   app.js — liga tudo: verifica o Three.js, inicia as telas,
   roda o loop de desenho e trata giro/redimensionamento da tela.
   ===================================================================== */

(function start() {
  'use strict';

  function fail(html) {
    const f = $('fail');
    if (html) f.innerHTML = html;
    f.style.display = 'grid';
    f.onclick = () => location.reload();
  }

  if (!window.THREE || !THREE.OrbitControls) { fail(); return; }

  try {
    initGeometries();
    initStage();
  } catch (e) {
    console.error(e);
    fail('🐜<br>Este navegador não consegue mostrar 3D (WebGL).');
    return;
  }

  initAntScreen();
  initCompareScreen();
  initHomeScreen();

  const clock = new THREE.Clock();
  function loop() {
    requestAnimationFrame(loop);
    if (app.screen === 'home' || !app.scene) return;   // nada a desenhar
    controls.update();
    animateAntennae(clock.getElapsedTime());
    renderer.render(app.scene, camera);
    updateLabels();
  }
  loop();

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (app.screen === 'ant') setView(app.view, true);
      else if (app.screen === 'compare') openCompare(true);
    }, 150);
  });

  // impede o zoom de pinça da página no Safari (o zoom fica só no 3D)
  document.addEventListener('gesturestart', (e) => e.preventDefault());
  document.addEventListener('dblclick', (e) => e.preventDefault());

  // atalhos para testar no console do navegador
  window.MUSEU = {
    SPECIES, loadGLB, openCompare, showScreen, countParts, setView,
    openAnt: (id) => openAnt(SPECIES.find((s) => s.id === id))
  };
})();
