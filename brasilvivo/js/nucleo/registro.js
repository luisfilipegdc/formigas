/* =====================================================================
   Terra Codex · Brasil Vivo · registro de conteúdo
   Cada bioma declara seus dados chamando Especie(), Ciclo(), Relacao(),
   Area() e Bioma(). O núcleo só conhece estes tipos, nunca nomes de bichos.
   Registro.validar() lista referências quebradas (aparece no console).
   ===================================================================== */
const Registro = (function () {
  const R = { especies: {}, ciclos: {}, relacoes: {}, areas: {}, biomas: {}, npcs: {}, jornadas: {} };

  // vocabulário fechado do núcleo
  const TIPOS_RELACAO = ['poliniza', 'come', 'abriga', 'decompoe', 'dispersa', 'cultiva'];
  const TIPOS_ATIVAR = ['soltar', 'proteger', 'replantar', 'reativar', 'observar-habitat', 'posicionar'];
  const MARCOS = [
    { id: 'visto', nome: 'Visto' }, { id: 'encontrado', nome: 'Encontrado' }, { id: 'cuidado', nome: 'Cuidado' },
    { id: 'transformado', nome: 'Transformado' }, { id: 'conectado', nome: 'Conectado' }, { id: 'ativado', nome: 'Ativado' }
  ];
  const REVISAO_PADRAO = { status: 'rascunho', fonte: '', revisor: '' };

  function guardar(colecao, o) {
    if (!o || !o.id) { console.warn('[registro] item sem id em', colecao, o); return o; }
    if (R[colecao][o.id]) console.warn('[registro] id repetido em', colecao + ':', o.id);
    R[colecao][o.id] = o; return o;
  }
  const comRevisao = (o) => Object.assign({}, o, { revisao: Object.assign({}, REVISAO_PADRAO, o.revisao) });

  const api = {
    R, TIPOS_RELACAO, TIPOS_ATIVAR, MARCOS,
    Especie: (o) => guardar('especies', comRevisao(o)),
    Ciclo: (o) => guardar('ciclos', o),
    Relacao: (o) => guardar('relacoes', comRevisao(o)),
    Area: (o) => guardar('areas', Object.assign({ relacoes: [], efeitos: [] }, o)),
    Bioma: (o) => guardar('biomas', o),
    Npc: (o) => guardar('npcs', o),
    Jornada: (o) => guardar('jornadas', o),
    especie: (id) => R.especies[id],
    ciclo: (id) => R.ciclos[id],
    relacao: (id) => R.relacoes[id],
    area: (id) => R.areas[id],
    lista: (colecao, bioma) => Object.values(R[colecao]).filter((o) => !bioma || o.bioma === bioma),
    // relações que partem de uma espécie
    relacoesDe: (especieId) => Object.values(R.relacoes).filter((r) => r.de === especieId),

    validar() {
      const erros = [], E = R.especies;
      Object.values(E).forEach((e) => {
        if (!R.biomas[e.bioma]) erros.push('espécie ' + e.id + ': bioma "' + e.bioma + '" não existe');
        if (!e.fases || !e.fases.length) erros.push('espécie ' + e.id + ': sem fases de vida');
        if (e.ciclo && !R.ciclos[e.ciclo]) erros.push('espécie ' + e.id + ': ciclo "' + e.ciclo + '" não existe');
        if (e.area && !R.areas[e.area]) erros.push('espécie ' + e.id + ': área "' + e.area + '" não existe');
      });
      Object.values(R.ciclos).forEach((c) => {
        const e = E[c.especie];
        if (!e) { erros.push('ciclo ' + c.id + ': espécie "' + c.especie + '" não existe'); return; }
        const fases = e.fases.map((f) => f.id);
        c.passos.forEach((p) => { if (!fases.includes(p.de) || !fases.includes(p.para)) erros.push('ciclo ' + c.id + ': passo ' + p.de + ' → ' + p.para + ' usa fase inexistente'); });
      });
      Object.values(R.relacoes).forEach((r) => {
        if (!E[r.de]) erros.push('relação ' + r.id + ': espécie "' + r.de + '" não existe');
        if (!TIPOS_RELACAO.includes(r.tipo)) erros.push('relação ' + r.id + ': tipo "' + r.tipo + '" fora do vocabulário');
        if (r.ativar && !TIPOS_ATIVAR.includes(r.ativar.tipo)) erros.push('relação ' + r.id + ': ativar "' + r.ativar.tipo + '" fora do vocabulário');
        if (r.ativar && r.ativar.onde && !R.areas[r.ativar.onde]) erros.push('relação ' + r.id + ': área "' + r.ativar.onde + '" não existe');
        if (r.prova && r.prova.area && !R.areas[r.prova.area]) erros.push('relação ' + r.id + ': área da prova "' + r.prova.area + '" não existe');
      });
      Object.values(R.areas).forEach((a) => a.relacoes.forEach((id) => { if (!R.relacoes[id]) erros.push('área ' + a.id + ': relação "' + id + '" não existe'); }));
      Object.values(R.biomas).forEach((b) => { if (b.base && !R.areas[b.base]) erros.push('bioma ' + b.id + ': base "' + b.base + '" não existe'); });
      if (erros.length) console.warn('[registro] ' + erros.length + ' problema(s):\n- ' + erros.join('\n- '));
      return erros;
    }
  };
  return api;
})();
const { Especie, Ciclo, Relacao, Area, Bioma, Npc, Jornada } = Registro;
