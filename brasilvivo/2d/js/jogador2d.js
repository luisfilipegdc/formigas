/* =====================================================================
   Terra Codex · Brasil Vivo 2D · jogador visto de cima
   Teclado (WASD ou setas) e joystick de toque. Cima na tela = norte.
   Quatro direções com dois passos de caminhada.
   ===================================================================== */
const Jogador = (function () {
  const J = { vel: 12, teclas: {}, joy: { x: 0, y: 0 }, andando: 0, bloqueado: false, dir: 'baixo' };

  function criar(pos) {
    J.pos = pos; J.sprites = Pixel.pessoa({ pele: '#c98d64', cabelo: '#2a1a10', camisa: '#2f8a47', calca: '#5a4a32', chapeu: '#e8c77a', mochila: true });
    J.sprite = () => { const q = J.sprites[J.dir]; return J.movendo ? q[1 + (Math.floor(J.andando) % 2)] : q[0]; };
    controles();
    return J;
  }

  function controles() {
    addEventListener('keydown', (e) => { J.teclas[e.key.toLowerCase()] = true; if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key.toLowerCase())) e.preventDefault(); });
    addEventListener('keyup', (e) => { J.teclas[e.key.toLowerCase()] = false; });
    const joy = document.getElementById('joystick'), bola = joy.querySelector('i');
    if ('ontouchstart' in window) joy.hidden = false;
    let jt = null;
    const jmov = (x, y) => { const r = joy.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2; let dx = (x - cx) / (r.width / 2), dy = (y - cy) / (r.height / 2); const l = Math.hypot(dx, dy); if (l > 1) { dx /= l; dy /= l; } J.joy.x = dx; J.joy.y = dy; bola.style.transform = 'translate(calc(-50% + ' + dx * 34 + 'px), calc(-50% + ' + dy * 34 + 'px))'; };
    joy.addEventListener('touchstart', (e) => { jt = e.changedTouches[0].identifier; jmov(e.changedTouches[0].clientX, e.changedTouches[0].clientY); e.preventDefault(); }, { passive: false });
    joy.addEventListener('touchmove', (e) => { for (const t of e.changedTouches) if (t.identifier === jt) jmov(t.clientX, t.clientY); e.preventDefault(); }, { passive: false });
    joy.addEventListener('touchend', () => { jt = null; J.joy.x = 0; J.joy.y = 0; bola.style.transform = 'translate(-50%,-50%)'; });
  }

  function update(dt, livre) {
    const k = J.teclas, p = J.pos;
    let mx = (k.d || k.arrowright ? 1 : 0) - (k.a || k.arrowleft ? 1 : 0), mz = (k.s || k.arrowdown ? 1 : 0) - (k.w || k.arrowup ? 1 : 0);
    mx += J.joy.x; mz += J.joy.y;
    const l = Math.hypot(mx, mz);
    J.movendo = l > 0.12 && !J.bloqueado;
    if (J.movendo) {
      mx /= Math.max(1, l); mz /= Math.max(1, l);
      const corr = k.shift ? 1.6 : 1, nx = p.x + mx * dt * J.vel * corr, nz = p.z + mz * dt * J.vel * corr;
      // desliza na parede: tenta cada eixo separado
      if (livre(nx, nz)) { p.x = nx; p.z = nz; } else if (livre(nx, p.z)) p.x = nx; else if (livre(p.x, nz)) p.z = nz;
      J.dir = Math.abs(mx) > Math.abs(mz) ? (mx > 0 ? 'dir' : 'esq') : (mz > 0 ? 'baixo' : 'cima');
      J.andando += dt * 7 * corr * Math.min(1, l);
    }
    p.x = Math.max(-212, Math.min(212, p.x)); p.z = Math.max(-212, Math.min(212, p.z));
  }

  return { criar, update, J };
})();
