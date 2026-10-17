/* =====================================================================
   Bioma Cerrado · jornada guiada: o ciclo da borboleta
   Um passo por vez, sempre à vista no HUD (Objetivo) e com a Seta-guia
   apontando o alvo. Nada aqui tem prazo, perda ou sequência de dias:
   a criança volta porque quer ver a transformação, não por medo de perder.
   alvo: { npc } · { marca: 'especie:fase' } · { lugar: 'jardim' } · acao: 'ninho' abre o Ninho
   ===================================================================== */
Jornada({
  id: 'ciclo-borboleta', bioma: 'cerrado', nome: 'O ciclo da borboleta',
  passos: [
    { id: 'flor', ico: '💬', texto: 'Converse com Dona Flor na horta', alvo: { npc: 'flor' },
      feito: (E) => !!E.falou.flor },
    { id: 'ovo', ico: '🔍', texto: 'Procure o ovinho nos canteiros da horta', alvo: { marca: 'borboleta-azul:ovo' },
      feito: (E) => !!E.achados['borboleta-azul:ovo'] },
    { id: 'cuidar', ico: '🤲', texto: 'Leve o ovo ao Ninho e cuide dele', acao: 'ninho',
      feito: (E) => !!(E.biodex['borboleta-azul'] || {}).cuidado },
    { id: 'transformar', ico: '⏳', texto: 'Acompanhe a transformação no Ninho', acao: 'ninho',
      dica: 'Enquanto espera, procure a jataí nas flores da horta.',
      feito: (E) => E.ninho.some((n) => n.ciclo === 'metamorfose-borboleta' && n.fase === 'adulto') },
    { id: 'jardim', ico: '🌸', texto: 'Leve a borboleta ao Jardim Polinizador', alvo: { lugar: 'jardim' },
      feito: (E) => E.relacoes['borboleta-poliniza-flor'] === 'ativada' }
  ]
});
