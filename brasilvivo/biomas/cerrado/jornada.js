/* =====================================================================
   Bioma Cerrado · jornada guiada: o ciclo da borboleta
   Um passo por vez, sempre à vista no HUD (Objetivo) e com a Seta-guia
   apontando o alvo. Nada aqui tem prazo, perda ou sequência de dias:
   a criança volta porque quer ver a transformação, não por medo de perder.
   alvo: { npc } · { marca: 'especie:fase' } · { fonte } · { lugar: 'jardim' } · { caixa: relacaoId }
   acao: 'viveiro' mostra o botão que abre o Viveiro
   ===================================================================== */
const _borb = (E) => E.biodex['borboleta-azul'] || {};
Jornada({
  id: 'ciclo-borboleta', bioma: 'cerrado', nome: 'O ciclo da borboleta',
  passos: [
    { id: 'flor', ico: '💬', texto: 'Converse com Dona Flor na horta', alvo: { npc: 'flor' },
      feito: (E) => !!E.falou.flor },
    { id: 'ovo', ico: '🔍', texto: 'Procure o ovinho nos canteiros da horta', alvo: { marca: 'borboleta-azul:ovo' },
      feito: (E) => !!E.achados['borboleta-azul:ovo'] },
    { id: 'folha', ico: '🍃', texto: 'Colha folhas da planta-hospedeira, ao lado do ovinho', alvo: { fonte: 'hospedeira-horta' },
      dica: 'A lagarta só come a folha da planta onde nasceu.',
      feito: (E) => !!E.colheu['folha-hospedeira'] || !!_borb(E).cuidado },
    { id: 'cuidar', ico: '🤲', texto: 'No Viveiro, arraste a folha e a sombra até o ovo', acao: 'viveiro',
      feito: (E) => !!_borb(E).cuidado },
    { id: 'transformar', ico: '⏳', texto: 'Cuide da lagarta até virar borboleta', acao: 'viveiro',
      dica: 'A lagarta come muito: colha mais folhas. Enquanto espera, procure a jataí nas flores da horta.',
      feito: (E) => E.ninho.some((n) => n.ciclo === 'metamorfose-borboleta' && n.fase === 'adulto') || E.relacoes['borboleta-poliniza-flor'] === 'ativada' },
    { id: 'soltar', ico: '🦋', texto: 'Solte a borboleta no Jardim Polinizador', alvo: { lugar: 'jardim' },
      feito: (E) => E.relacoes['borboleta-poliniza-flor'] === 'ativada' },
    { id: 'jatai', ico: '🐝', texto: 'Traga as jataís de volta ao jardim', alvo: { caixa: 'jatai-poliniza-flor' },
      dica: 'Primeiro descubra o que a jataí faz nas flores da horta ✨',
      feito: (E) => E.relacoes['jatai-poliniza-flor'] === 'ativada' }
  ]
});
