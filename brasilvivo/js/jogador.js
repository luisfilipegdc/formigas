/* =====================================================================
   Terra Codex · jogador: personagem em terceira pessoa, teclado (WASD ou
   setas), joystick de toque, câmera que segue e gira com arrasto.
   ===================================================================== */
const Jogador = (function () {
  const V3 = THREE.Vector3;
  const J = { vel: 14, yaw: 0, camYaw: 0.6, camPitch: 0.42, dist: 18, teclas: {}, joy: new THREE.Vector2(), andando: 0, bloqueado: false };

  function criar(scene, camera, pos) {
    J.camera = camera;
    const g = new THREE.Group();
    const corpo = new THREE.Mesh(new THREE.CapsuleGeometry(0.7, 1.4, 4, 10), new THREE.MeshLambertMaterial({ color: '#2F8A47' })); corpo.position.y = 1.5; corpo.castShadow = true; g.add(corpo);
    const cab = new THREE.Mesh(new THREE.SphereGeometry(0.62, 12, 10), new THREE.MeshLambertMaterial({ color: '#e8c39e' })); cab.position.y = 2.9; cab.castShadow = true; g.add(cab);
    const chapeu = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.0, 0.35, 12), new THREE.MeshLambertMaterial({ color: '#F5C451' })); chapeu.position.y = 3.4; g.add(chapeu);
    const mochila = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.1, 0.5), new THREE.MeshLambertMaterial({ color: '#7a4a2a' })); mochila.position.set(0, 1.7, -0.7); g.add(mochila);
    J.pernas = [-0.3, 0.3].map((x) => { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.2, 0.9, 8), new THREE.MeshLambertMaterial({ color: '#2c3e30' })); p.position.set(x, 0.45, 0); g.add(p); return p; });
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
      J.pernas[0].rotation.x = Math.sin(J.andando) * 0.6; J.pernas[1].rotation.x = -Math.sin(J.andando) * 0.6;
    } else { J.pernas[0].rotation.x *= 0.8; J.pernas[1].rotation.x *= 0.8; }
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
