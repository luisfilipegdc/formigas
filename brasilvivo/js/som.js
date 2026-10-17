/* =====================================================================
   Terra Codex · Brasil Vivo · som (Web Audio, tudo sintetizado, sem arquivos)
   - Efeitos dos verbos do loop numa mesma escala pentatônica (dó ré mi sol lá),
     para que tudo combine e nada soe como erro.
   - Música em camadas verticais: quanto mais Clareza na área, mais camadas
     tocam (baixo → melodia → brilhos). A criança OUVE o cinza virar cor.
   - Ruído: zumbido grave e abafado que some conforme a área se restaura.
   - Ambiente: vento, pássaros de dia, grilos à noite.
   O áudio só liga depois de um toque (regra do navegador e do iOS).
   Volumes vêm dos Ajustes: geral, música, efeitos, ambiente e mudo.
   ===================================================================== */
const Som = (function () {
  let ctx = null, saida, bus = {}, ligado = false;
  const vol = { geral: 0.8, musica: 0.55, efeitos: 0.8, ambiente: 0.6, mudo: false };
  // dó maior pentatônica, em Hz (C3 a C7)
  const NOTA = {}; ['C', 'D', 'E', 'G', 'A'].forEach((n, i) => { const semi = [0, 2, 4, 7, 9][i]; for (let o = 3; o <= 7; o++) NOTA[n + o] = 261.63 * Math.pow(2, (semi + (o - 4) * 12) / 12); });
  const ESCALA = ['C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'E5', 'G5', 'A5'];

  function iniciar() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    ctx = new AC();
    saida = ctx.createGain(); saida.connect(ctx.destination);
    ['musica', 'efeitos', 'ambiente', 'ruido'].forEach((k) => { bus[k] = ctx.createGain(); bus[k].gain.value = 0; bus[k].connect(saida); });
    // um som curtinho e mudo destrava o áudio no iOS
    const o = ctx.createOscillator(), g = ctx.createGain(); g.gain.value = 0; o.connect(g); g.connect(saida); o.start(); o.stop(ctx.currentTime + 0.05);
    ligado = true; aplicarVolumes(); montarAmbiente();
  }
  function aplicarVolumes() {
    if (!ctx) return;
    const t = ctx.currentTime, m = vol.mudo ? 0 : vol.geral;
    saida.gain.setTargetAtTime(m, t, 0.05);
    bus.efeitos.gain.setTargetAtTime(vol.efeitos, t, 0.05);
  }
  function configurar(v) { Object.assign(vol, v); aplicarVolumes(); }

  /* ---------- notas e efeitos ---------- */
  function nota(freq, quando, dur, tipo, ganho, destino, ataque) {
    const t = ctx.currentTime + (quando || 0), o = ctx.createOscillator(), g = ctx.createGain();
    o.type = tipo || 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(ganho || 0.2, t + (ataque || 0.012)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(destino || bus.efeitos); o.start(t); o.stop(t + dur + 0.05);
  }
  // sino: fundamental + parcial alta, para marcos e descobertas
  function sino(n, q, dur, ganho) { nota(NOTA[n], q, dur, 'sine', ganho); nota(NOTA[n] * 2.76, q, dur * 0.5, 'sine', ganho * 0.25); }
  function sopro(q, dur, ganho, freq) {
    const t = ctx.currentTime + (q || 0), n = ctx.createBufferSource(), b = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const f = ctx.createBiquadFilter(), g = ctx.createGain(); f.type = 'bandpass'; f.frequency.setValueAtTime(freq || 900, t); f.frequency.exponentialRampToValueAtTime((freq || 900) * 2.5, t + dur); f.Q.value = 1.2;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(ganho || 0.08, t + dur * 0.3); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    n.buffer = b; n.connect(f); f.connect(g); g.connect(bus.efeitos); n.start(t);
  }
  const EFEITOS = {
    toque: () => nota(NOTA.G5, 0, 0.08, 'triangle', 0.08),
    observar: () => { nota(NOTA.C5, 0, 0.25, 'triangle', 0.14); nota(NOTA.E5, 0.09, 0.35, 'triangle', 0.14); },
    examinar: () => { ['D5', 'E5', 'G5'].forEach((n, i) => nota(NOTA[n], i * 0.07, 0.3, 'triangle', 0.11)); },
    falar: () => { [0, 0.07, 0.14].forEach((q, i) => nota(NOTA[ESCALA[4 + ((Math.random() * 4) | 0)]], q, 0.07, 'square', 0.035)); },
    cuidar: () => { ['C4', 'E4', 'G4'].forEach((n) => nota(NOTA[n], 0, 0.9, 'sine', 0.09, null, 0.08)); nota(NOTA.C5, 0.15, 0.8, 'sine', 0.07, null, 0.1); },
    transformar: () => { ['C5', 'D5', 'E5', 'G5', 'A5', 'C6'].forEach((n, i) => sino(n, i * 0.08, 0.9, 0.09)); sopro(0, 0.9, 0.05, 1600); },
    marco: () => { ['C5', 'E5', 'G5'].forEach((n, i) => sino(n, i * 0.11, 1.0, 0.12)); sino('C6', 0.36, 1.6, 0.14); },
    passo: () => { sino('G5', 0, 0.6, 0.1); sino('C6', 0.16, 0.9, 0.1); },
    abrir: () => sopro(0, 0.22, 0.05, 700),
    fechar: () => sopro(0, 0.18, 0.04, 500),
    ninho: () => { nota(NOTA.E5, 0, 0.3, 'sine', 0.1); nota(NOTA.G5, 0.1, 0.4, 'sine', 0.1); },
    ativar: () => { ['C4', 'G4', 'C5', 'E5', 'G5', 'C6', 'E6'].forEach((n, i) => sino(n, i * 0.12, 1.8, 0.11)); sopro(0, 2, 0.06, 500); }
  };
  function tocar(nome) { if (!ctx || !ligado || vol.mudo) return; if (ctx.state === 'suspended') ctx.resume(); const f = EFEITOS[nome]; if (f) f(); }

  /* ---------- ambiente, Ruído e música em camadas ---------- */
  let alvo = { clareza: 1, noite: false, chuva: false }, proxNota = 0, acorde = 0, proxPassaro = 2, proxGrilo = 0;
  const ACORDES = [['C3', 'G3', 'E4'], ['A3', 'E4', 'C5'], ['D3', 'A3', 'D4'], ['G3', 'D4', 'G4']];
  function montarAmbiente() {
    // vento: ruído rosa filtrado, sempre bem baixo
    const b = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate), d = b.getChannelData(0); let ult = 0;
    for (let i = 0; i < d.length; i++) { ult = (ult + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = ult * 3.5; }
    const vento = ctx.createBufferSource(); vento.buffer = b; vento.loop = true;
    const fv = ctx.createBiquadFilter(); fv.type = 'lowpass'; fv.frequency.value = 650;
    const gv = ctx.createGain(); gv.gain.value = 0.35; vento.connect(fv); fv.connect(gv); gv.connect(bus.ambiente); vento.start();
    // Ruído: dois osciladores desafinados, abafados, com tremor lento
    const gr = ctx.createGain(); gr.gain.value = 0.5; gr.connect(bus.ruido);
    const fr = ctx.createBiquadFilter(); fr.type = 'lowpass'; fr.frequency.value = 240; fr.connect(gr);
    [55, 55.7, 82.4].forEach((f) => { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; const g = ctx.createGain(); g.gain.value = 0.18; o.connect(g); g.connect(fr); o.start(); });
    const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 0.18; lg.gain.value = 0.25; lfo.connect(lg); lg.connect(gr.gain); lfo.start();
  }
  function passaro() {
    const t = ctx.currentTime, base = 2200 + Math.random() * 1800, n = 2 + ((Math.random() * 3) | 0);
    for (let i = 0; i < n; i++) {
      const o = ctx.createOscillator(), g = ctx.createGain(), q = t + i * 0.13;
      o.type = 'sine'; o.frequency.setValueAtTime(base, q); o.frequency.exponentialRampToValueAtTime(base * (1.25 + Math.random() * 0.3), q + 0.08);
      g.gain.setValueAtTime(0.0001, q); g.gain.exponentialRampToValueAtTime(0.05, q + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, q + 0.11);
      o.connect(g); g.connect(bus.ambiente); o.start(q); o.stop(q + 0.15);
    }
  }
  function grilo() {
    const t = ctx.currentTime;
    for (let i = 0; i < 3; i++) { const o = ctx.createOscillator(), g = ctx.createGain(), q = t + i * 0.06; o.type = 'square'; o.frequency.value = 4300; g.gain.setValueAtTime(0.0001, q); g.gain.exponentialRampToValueAtTime(0.012, q + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, q + 0.04); o.connect(g); g.connect(bus.ambiente); o.start(q); o.stop(q + 0.06); }
  }
  // chamada a cada quadro (com dt) pelo laço do jogo
  function atualizar(dt, estado) {
    if (!ctx || !ligado) return;
    alvo = estado; const t = ctx.currentTime, k = estado.clareza;
    bus.ruido.gain.setTargetAtTime((1 - k) * 0.22 * vol.ambiente, t, 0.8);
    bus.ambiente.gain.setTargetAtTime(vol.ambiente * (0.35 + 0.65 * k), t, 0.8);
    bus.musica.gain.setTargetAtTime(vol.musica * Math.min(1, 0.15 + k), t, 1.2);
    // música generativa: camadas entram com a Clareza (baixo ≥ 25%, melodia ≥ 50%, brilho ≥ 75%)
    proxNota -= dt;
    if (proxNota <= 0) {
      proxNota = 2.4; acorde = (acorde + 1) % ACORDES.length; const ac = ACORDES[acorde];
      if (k >= 0.25) nota(NOTA[ac[0]], 0, 2.6, 'sine', 0.09, bus.musica, 0.4);
      if (k >= 0.5) { nota(NOTA[ac[1]], 0.6, 2.2, 'triangle', 0.05, bus.musica, 0.3); nota(NOTA[ESCALA[5 + ((Math.random() * 5) | 0)]], 1.2, 1.4, 'sine', 0.05, bus.musica, 0.05); }
      if (k >= 0.75 && Math.random() < 0.7) nota(NOTA[['C6', 'E6', 'G6'][(Math.random() * 3) | 0]], 1.8, 1.2, 'sine', 0.035, bus.musica, 0.01);
      if (k < 0.25 && Math.random() < 0.5) nota(NOTA.C3 * 0.75, 0, 3, 'sine', 0.05, bus.musica, 0.8);   // no Ruído, só uma nota grave e solitária
    }
    // pássaros de dia em área viva, grilos à noite
    proxPassaro -= dt; if (proxPassaro <= 0) { proxPassaro = 2 + Math.random() * 5; if (!estado.noite && k > 0.4) passaro(); }
    proxGrilo -= dt; if (proxGrilo <= 0) { proxGrilo = 0.5 + Math.random() * 0.7; if (estado.noite) grilo(); }
  }
  // texto para legendas de som (acessibilidade)
  function descrever(estado) { return estado.clareza < 0.5 ? '🔊 Zumbido grave do Ruído, quase sem pássaros' : estado.noite ? '🔊 Grilos e vento' : '🔊 Pássaros, vento no capim e música'; }

  return { iniciar, tocar, atualizar, configurar, descrever, get ligado() { return ligado; } };
})();
