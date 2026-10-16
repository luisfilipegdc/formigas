/* =====================================================================
   Terra Codex · Brasil Vivo · estado do jogador (save v2) e eventos
   Salva só neste aparelho, em localStorage 'terracodex2'. Na primeira vez,
   migra o progresso do Vale Vivo ('terracodex1', que fica intacto).
   Eventos: Estado.on('marco', fn) · Estado.emit('marco', {...})
   ===================================================================== */
const Estado = (function () {
  const CHAVE = 'terracodex2', CHAVE_V1 = 'terracodex1';
  const novo = () => ({ v: 2, comecou: false, biodex: {}, ninho: [], relacoes: {}, falou: {}, achados: {}, pos: [0, 0, 8], migrado: false });
  let d = novo();
  // quem ainda não começou a jornada nova recebe a migração (mesmo que já tenha aberto a página antes)
  try { const s = JSON.parse(localStorage.getItem(CHAVE)); if (s && s.v === 2 && s.comecou) d = Object.assign(novo(), s); else migrar(); } catch (e) { migrar(); }

  // Vale Vivo → Brasil Vivo: cartas viram espécies vistas; ovos do Ninho seguem no ciclo
  function migrar() {
    let v1 = null;
    try { v1 = JSON.parse(localStorage.getItem(CHAVE_V1)); } catch (e) { return; }
    if (!v1 || !v1.inicial) return;
    const MAPA = { abelha: 'jatai', formiga: 'formiga-sauva', lagartixa: 'lagartixa', sapo: 'sapo-cururu', borboleta: 'borboleta-azul' };
    Object.keys(v1.cartas || {}).forEach((velho) => {
      const id = MAPA[velho], e = id && Registro.especie(id);
      if (!e || !(v1.cartas[velho] >= 1)) return;
      const anda = e.fases.find((f) => f.anda) || e.fases[0];
      d.biodex[id] = { fases: [anda.id] };
    });
    // ovos do Ninho antigo: mesmo número de estágios que as fases do ciclo novo (a galinha não é do Cerrado e fica de fora)
    const CICLOS = { borboleta: 'metamorfose-borboleta', sapo: 'metamorfose-sapo' };
    (v1.ninho || []).forEach((n) => {
      const c = Registro.ciclo(CICLOS[n.id]); if (!c) return;
      const fase = cadeia(c)[Math.min(n.estagio, cadeia(c).length - 1)];
      d.ninho.push({ ciclo: c.id, fase, desde: null });
      const b = d.biodex[c.especie] || (d.biodex[c.especie] = { fases: [] });
      cadeia(c).slice(0, cadeia(c).indexOf(fase) + 1).forEach((f) => { if (!b.fases.includes(f)) b.fases.push(f); });
      if (n.estagio > 0) { b.cuidado = true; b.transformado = true; }
    });
    d.falou = {}; d.migrado = true;
  }
  // fases de um ciclo, em ordem: inicio → para → para…
  function cadeia(c) { return [c.inicio].concat(c.passos.map((p) => p.para)); }

  const ouvintes = {};
  function on(ev, fn) { (ouvintes[ev] || (ouvintes[ev] = [])).push(fn); }
  function emit(ev, x) { (ouvintes[ev] || []).forEach((fn) => { try { fn(x); } catch (e) { console.error(e); } }); }
  function salvar(pos) {
    if (pos) d.pos = [pos.x, 0, pos.z];
    try { localStorage.setItem(CHAVE, JSON.stringify(d)); } catch (e) {}
  }
  return { get dados() { return d; }, on, emit, salvar, cadeia, CHAVE };
})();
