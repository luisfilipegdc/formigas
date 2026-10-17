/* =====================================================================
   Bioma Cerrado · espécies da fatia vertical (5)
   forma: desenho 3D do bicho (formas.js) · escala: tamanho no mapa (1 = forma padrão). Bichos pequenos ficam pequenos
   e ganham um brilho no chão para serem achados.
   fases: a primeira com anda: true é a que circula pela área; fases com
   ponto: [x, z] aparecem paradas no mapa; ninho: true pode ir para o Ninho.
   CONTEÚDO EM REVISÃO CIENTÍFICA: nomes científicos, espécies e textos
   são placeholders (revisao.status = 'rascunho') até validação.
   ===================================================================== */
Especie({
  id: 'borboleta-azul', bioma: 'cerrado', nome: 'Borboleta-azul', cientifico: 'Morpho helenor', emoji: '🦋',
  grupo: 'Polinizador', raridade: 'comum', area: 'rota', hora: ['dia'], modelo: null, ciclo: 'metamorfose-borboleta',
  funcao: 'Bebe néctar e leva pólen de flor em flor.',
  fases: [
    { id: 'ovo', nome: 'Ovo', emoji: '🟡', ponto: [-96, 84], marca: 'ovo', cor: '#f2d24b', ninho: true,
      achado: 'Numa folha da horta, um ovinho amarelo do tamanho de um grão de areia. A lagarta vai precisar desta mesma planta.' },
    { id: 'lagarta', nome: 'Lagarta', emoji: '🐛' },
    { id: 'crisalida', nome: 'Crisálida', emoji: '🟢' },
    { id: 'adulto', nome: 'Adulto', emoji: '🦋', anda: true, voa: true, cor: '#3a6fe0', escala: 0.7, forma: 'borboleta' }
  ],
  textos: {
    visto: 'Uma borboleta azul brilhante, voando baixo sobre o capim. De perto, as asas por baixo são marrons, com manchas que parecem olhos.',
    habitat: 'Bordas de mata e campos com flores.', alimento: 'Lagarta: folhas da planta-hospedeira. Adulto: néctar e frutas maduras.',
    cuidado: 'Observe sem pegar: as escamas das asas saem com o toque.'
  },
  revisao: { status: 'rascunho', fonte: '', revisor: '' }
});

Especie({
  id: 'sapo-cururu', bioma: 'cerrado', nome: 'Sapo-cururu', cientifico: 'Rhinella diptycha', emoji: '🐸',
  grupo: 'Caçador', raridade: 'comum', area: 'vereda', hora: ['noite'], modelo: null, ciclo: 'metamorfose-sapo',
  funcao: 'Come mosquitos e outros insetos à noite, perto da água.',
  fases: [
    { id: 'ovos', nome: 'Ovos', emoji: '🫧', ponto: [52, -62], marca: 'ovo', cor: '#9ec5e8', ninho: true,
      achado: 'Numa poça que está secando, um cordão transparente cheio de pontinhos pretos: ovos de sapo.' },
    { id: 'girino', nome: 'Girino', emoji: '🐟' },
    { id: 'sapinho', nome: 'Sapinho', emoji: '🐸' },
    { id: 'adulto', nome: 'Adulto', emoji: '🐸', anda: true, cor: '#7a6a3a', escala: 0.9, forma: 'sapo' }
  ],
  textos: {
    visto: 'Um sapo grande e calmo na beira da água, com a pele cheia de verrugas.',
    habitat: 'Veredas, brejos e beiras de rio.', alimento: 'Girino: algas e restos de planta. Adulto: insetos.',
    cuidado: 'Não aperte: a pele tem uma secreção que o defende.'
  },
  revisao: { status: 'rascunho', fonte: '', revisor: '' }
});

Especie({
  id: 'jatai', bioma: 'cerrado', nome: 'Abelha jataí', cientifico: 'Tetragonisca angustula', emoji: '🐝',
  grupo: 'Polinizador', raridade: 'comum', area: 'horta', hora: ['dia'], modelo: 'abelha',
  funcao: 'Abelha nativa sem ferrão que visita flores e leva pólen de uma para outra.',
  fases: [
    { id: 'operaria', nome: 'Operária', emoji: '🐝', anda: true, voa: true, cor: '#e8b33a', escala: 0.32, forma: 'abelha' },
    { id: 'ninho', nome: 'Ninho no tronco', emoji: '🪵', ponto: [-62, 96], marca: 'tronco',
      achado: 'Num tronco oco, um tubinho de cera na entrada. Algumas jataís ficam ali paradas, vigiando.' }
  ],
  textos: {
    visto: 'Uma abelhinha dourada, bem menor que uma abelha comum, indo de flor em flor.',
    habitat: 'Troncos ocos, muros e frestas perto de flores.', alimento: 'Néctar e pólen.',
    cuidado: 'Não tem ferrão, mas o ninho é a casa dela: só observe.'
  },
  revisao: { status: 'rascunho', fonte: '', revisor: '' }
});

Especie({
  id: 'formiga-sauva', bioma: 'cerrado', nome: 'Formiga-saúva', cientifico: 'Atta sp.', emoji: '🐜',
  grupo: 'Construtora', raridade: 'comum', area: 'rota', hora: ['dia'], modelo: 'formiga',
  funcao: 'Corta folhas para cultivar o fungo que alimenta o formigueiro.',
  fases: [
    { id: 'operaria', nome: 'Operária', emoji: '🐜', anda: true, cor: '#9a4a2a', escala: 0.32, forma: 'formiga' },
    { id: 'formigueiro', nome: 'Formigueiro', emoji: '⛰️', ponto: [12, -108], marca: 'olheiro',
      achado: 'Montinhos de terra solta com buracos: são os olheiros, as portas do formigueiro. Lá embaixo há câmaras com o jardim de fungo.' }
  ],
  textos: {
    visto: 'Uma fila de formigas carregando pedaços de folha maiores que elas.',
    habitat: 'Solo do Cerrado, em campos e bordas de mata.', alimento: 'O fungo que elas mesmas cultivam.',
    cuidado: 'Não mexa no formigueiro: as saúvas mordem para defender a casa.'
  },
  revisao: { status: 'rascunho', fonte: '', revisor: '' }
});

Especie({
  id: 'lagartixa', bioma: 'cerrado', nome: 'Lagartixa-de-parede', cientifico: 'Hemidactylus mabouia', emoji: '🦎',
  grupo: 'Caçadora', raridade: 'comum', area: 'base', hora: ['noite'], modelo: 'lagartixa',
  funcao: 'Caça mosquitos e mariposas perto das luzes, à noite.',
  fases: [
    { id: 'adulto', nome: 'Adulto', emoji: '🦎', anda: true, cor: '#c9b48a', escala: 0.6, forma: 'lagartixa' },
    { id: 'ovos', nome: 'Ovos', emoji: '🥚', ponto: [-22, 15], marca: 'parede', cor: '#f3ead6',
      achado: 'Numa fresta da parede, dois ovinhos brancos e duros, colados um no outro.' }
  ],
  textos: {
    visto: 'Uma lagartixa clarinha, parada de cabeça para baixo na parede.',
    habitat: 'Paredes e muros perto de luz, nas cidades.', alimento: 'Mosquitos, mariposas e outros insetos.',
    cuidado: 'Não tem veneno. Nunca puxe a cauda: ela solta para fugir.'
  },
  revisao: { status: 'rascunho', fonte: '', revisor: '' }
});
