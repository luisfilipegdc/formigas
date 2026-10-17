/* =====================================================================
   Terra Codex · Brasil Vivo · BioDex sem quiz
   O nível de cada espécie sai do que o jogador FEZ no mundo:
     visto        → viu alguma fase de vida
     encontrado   → viu duas fases diferentes
     cuidado      → cuidou de uma fase no Viveiro
     transformado → acompanhou uma mudança de fase
     conectado    → descobriu uma relação da espécie com o ecossistema
     ativado      → ativou a espécie no mundo e religou a relação
   Cada marco novo dispara Estado.emit('marco', { especie, marco }).
   ===================================================================== */
const Biodex = (function () {
  const reg = (id) => Estado.dados.biodex[id] || (Estado.dados.biodex[id] = { fases: [] });

  function marcos(id) {
    const b = Estado.dados.biodex[id]; if (!b) return [];
    const rel = Registro.relacoesDe(id).map((r) => Estado.dados.relacoes[r.id]);
    const ok = {
      visto: b.fases.length >= 1, encontrado: b.fases.length >= 2, cuidado: !!b.cuidado, transformado: !!b.transformado,
      conectado: rel.some((s) => s === 'vista' || s === 'ativada'), ativado: rel.some((s) => s === 'ativada')
    };
    return Registro.MARCOS.filter((m) => ok[m.id]).map((m) => m.id);
  }
  // o marco mais alto alcançado (para o rótulo da carta)
  function rotulo(id) {
    const ms = marcos(id); if (!ms.length) return '';
    return Registro.MARCOS.find((m) => m.id === ms[ms.length - 1]).nome;
  }
  // roda uma mudança e avisa cada marco novo
  function mudar(id, fn) {
    const antes = marcos(id); fn(); const depois = marcos(id);
    depois.filter((m) => !antes.includes(m)).forEach((m) => Estado.emit('marco', { especie: id, marco: m }));
    Estado.salvar();
  }

  return {
    marcos, rotulo,
    viu: (id, fase) => mudar(id, () => { const b = reg(id); if (!b.fases.includes(fase)) b.fases.push(fase); }),
    cuidou: (id) => mudar(id, () => { reg(id).cuidado = true; }),
    transformou: (id, fase) => mudar(id, () => { const b = reg(id); b.transformado = true; if (!b.fases.includes(fase)) b.fases.push(fase); }),
    relacao: (relId, estado) => { const r = Registro.relacao(relId); mudar(r.de, () => { Estado.dados.relacoes[relId] = estado; }); },
    viuFase: (id, fase) => !!(Estado.dados.biodex[id] && Estado.dados.biodex[id].fases.includes(fase)),
    vistas: (bioma) => Registro.lista('especies', bioma).filter((e) => marcos(e.id).length).length
  };
})();

/* Ruído: a Clareza de uma área é a fração das suas relações já ativadas.
   Área sem Ruído (ruido 0) é viva desde o início. */
const Ruido = {
  clareza(areaId) {
    const a = Registro.area(areaId); if (!a) return 1;
    if (!a.ruido) return 1;
    if (!a.relacoes.length) return 0;
    return a.relacoes.filter((id) => Estado.dados.relacoes[id] === 'ativada').length / a.relacoes.length;
  }
};
