/* =====================================================================
   Terra Codex · jogador: personagem em terceira pessoa, teclado (WASD ou
   setas), joystick de toque, câmera que segue e gira com arrasto.
   ===================================================================== */
const Jogador = (function () {
  const V3 = THREE.Vector3;
  const J = { vel: 14, yaw: 0, camYaw: 0.6, camPitch: 0.42, dist: 18, teclas: {}, joy: new THREE.Vector2(), andando: 0, bloqueado: false };

  function criar(scene, camera, pos) {
    J.camera = camera;
    // exploradora com chapéu e mochila (formas.js)
    const g = Formas.pessoa({ pele: '#c98d64', cabelo: '#2a1a10', camisa: '#2f8a47', calca: '#5a4a32', chapeu: '#e8c77a', mochila: true });
    g.position.copy(pos); J.mesh = g; scene.add(g);
    controles();
    return J;
  }

  function controles() {
    addEventListener('keydown', (e) => { J.teclas[e.key.toLowerCase()] = true; if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key.toLowerCase())) e.preventDefault(); });
    addEventListener('keyup', (e) => { J.teclas[e.key.toLowerCase()] = false; });
    // câmera: arrastar com o mouse ou com o dedo na metade direita
    const tela = document.getElementById('tela');
    let arr = null;
    const ini = (x, y, id) => { arr = { x, y, id }; };
    const mov = (x, y) => { if (!arr) return; J.camYaw -= (x - arr.x) * 0.006; J.camPitch = Math.max(0.15, Math.min(1.1, J.camPitch + (y - arr.y) * 0.004)); arr.x = x; arr.y = y; };
    tela.addEventListener('mousedown', (e) => ini(e.clientX, e.clientY, 'm'));
    addEventListener('mousemove', (e) => { if (arr && arr.id === 'm') mov(e.clientX, e.clientY); });
    addEventListener('mouseup', () => { if (arr && arr.id === 'm') arr = null; });
    tela.addEventListener('touchstart', (e) => { for (const t of e.changedTouches) if (t.clientX > innerWidth * 0.45) ini(t.clientX, t.clientY, t.identifier); }, { passive: true });
    tela.addEventListener('touchmove', (e) => { for (const t of e.changedTouches) if (arr && t.identifier === arr.id) mov(t.clientX, t.clientY); }, { passive: true });
    tela.addEventListener('touchend', (e) => { for (const t of e.changedTouches) if (arr && t.identifier === arr.id) arr = null; }, { passive: true });
    tela.addEventListener('wheel', (e) => { J.dist = Math.max(8, Math.min(34, J.dist + e.deltaY * 0.02)); }, { passive: true });
    // joystick (celular e iPad)
    const joy = document.getElementById('joystick'), bola = joy.querySelector('i');
    if ('ontouchstart' in window) joy.hidden = false;
    let jt = null;
    const jmov = (x, y) => { const r = joy.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2; let dx = (x - cx) / (r.width / 2), dy = (y - cy) / (r.height / 2); const l = Math.hypot(dx, dy); if (l > 1) { dx /= l; dy /= l; } J.joy.set(dx, dy); bola.style.transform = 'translate(calc(-50% + ' + dx * 34 + 'px), calc(-50% + ' + dy * 34 + 'px))'; };
    joy.addEventListener('touchstart', (e) => { jt = e.changedTouches[0].identifier; jmov(e.changedTouches[0].clientX, e.changedTouches[0].clientY); e.preventDefault(); }, { passive: false });
    joy.addEventListener('touchmove', (e) => { for (const t of e.changedTouches) if (t.identifier === jt) jmov(t.clientX, t.clientY); e.preventDefault(); }, { passive: false });
    joy.addEventListener('touchend', () => { jt = null; J.joy.set(0, 0); bola.style.transform = 'translate(-50%,-50%)'; });
  }

  // move e devolve se andou
  function update(dt, altura, livre) {
    const k = J.teclas;
    let mx = (k.d || k.arrowright ? 1 : 0) - (k.a || k.arrowleft ? 1 : 0), mz = (k.s || k.arrowdown ? 1 : 0) - (k.w || k.arrowup ? 1 : 0);
    mx += J.joy.x; mz += J.joy.y;
    const l = Math.hypot(mx, mz);
    const p = J.mesh.position;
    if (l > 0.05 && !J.bloqueado) {
      mx /= Math.max(1, l); mz /= Math.max(1, l);
      // direção relativa à câmera
      const f = new V3(-Math.sin(J.camYaw), 0, -Math.cos(J.camYaw)), r = new V3(f.z, 0, -f.x);
      const dir = new V3().addScaledVector(f, -mz).addScaledVector(r, mx);
      const corr = k.shift ? 1.6 : 1;
      const novo = p.clone().addScaledVector(dir, dt * J.vel * corr);
      if (livre(novo.x, novo.z)) { p.x = novo.x; p.z = novo.z; }
      J.yaw = Math.atan2(dir.x, dir.z); J.mesh.rotation.y = J.yaw;
      J.andando += dt * 10 * corr;
      J.ritmo = Math.min(1, (J.ritmo || 0) + dt * 6);
    } else J.ritmo = Math.max(0, (J.ritmo || 0) - dt * 5);
    J.mesh.userData.animar(J.andando, J.ritmo || 0);
    p.x = Math.max(-210, Math.min(210, p.x)); p.z = Math.max(-210, Math.min(210, p.z));
    p.y += (altura(p.x, p.z) - p.y) * Math.min(1, dt * 12);
    // câmera atrás, olhando para o personagem
    const c = J.camera;
    const alvo = new V3(p.x, p.y + 2.5, p.z);
    const off = new V3(Math.sin(J.camYaw) * Math.cos(J.camPitch), Math.sin(J.camPitch), Math.cos(J.camYaw) * Math.cos(J.camPitch)).multiplyScalar(J.dist);
    const want = alvo.clone().add(off); want.y = Math.max(want.y, altura(want.x, want.z) + 2.5);
    c.position.lerp(want, Math.min(1, dt * 6)); c.lookAt(alvo);
    return l > 0.05;
  }

  return { criar, update, J };
})();
