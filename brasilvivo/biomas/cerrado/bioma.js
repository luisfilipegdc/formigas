/* =====================================================================
   Bioma Cerrado · Brasília, a Cidade-Núcleo (fatia vertical do MVP)
   Áreas do mapa 3D, recursos do Viveiro e moradores.
   Coordenadas em metros no terreno de 440 × 440 m (centro = Base Brasília).
   CONTEÚDO EM REVISÃO CIENTÍFICA: espécies, nomes e relações são rascunho.
   ===================================================================== */
Bioma({
  id: 'cerrado', nome: 'Cerrado', emoji: '🌾', base: 'base', clima: ['seco', 'chuva'], livre: true,
  // recursos que o Viveiro usa · ferramenta: está sempre à mão (não gasta) · onde: pista de onde colher
  recursos: {
    'folha-hospedeira': { nome: 'Folha da planta-hospedeira', curto: 'Folha', emoji: '🍃', onde: 'Colha na planta-hospedeira, ao lado do ovinho na horta.' },
    'sombra': { nome: 'Sombra', curto: 'Sombra', emoji: '⛱️', ferramenta: true },
    'quieto': { nome: 'Deixar quieto', curto: 'Silêncio', emoji: '🤫', ferramenta: true },
    'agua-limpa': { nome: 'Água limpa', curto: 'Água', emoji: '💧', onde: 'Pegue no espelho d\'água da praça da Base.' },
    'algas': { nome: 'Algas', curto: 'Algas', emoji: '🌿', onde: 'Pegue na beira do rio, perto do Seu Rio.' },
    'pedra-seca': { nome: 'Pedra seca para sair da água', curto: 'Pedra', emoji: '🪨', onde: 'Pegue nas pedras da beira do rio.' }
  },
  // fontes: onde cada recurso é colhido no mapa · da: quanto vem por vez · volta: segundos para rebrotar
  fontes: [
    { id: 'hospedeira-horta', recurso: 'folha-hospedeira', nome: 'Planta-hospedeira', verbo: 'Colher folha', forma: 'planta', x: -99, z: 88, da: 2, volta: 40 },
    { id: 'hospedeira-rota', recurso: 'folha-hospedeira', nome: 'Planta-hospedeira', verbo: 'Colher folha', forma: 'planta', x: -25, z: -112, da: 2, volta: 40 },
    { id: 'espelho-agua', recurso: 'agua-limpa', nome: 'Espelho d\'água', verbo: 'Pegar água', forma: 'agua', x: -9, z: 12, da: 2, volta: 20 },
    { id: 'algas-rio', recurso: 'algas', nome: 'Algas da beira', verbo: 'Pegar algas', forma: 'algas', x: 63, z: -26, da: 2, volta: 40 },
    { id: 'pedras-rio', recurso: 'pedra-seca', nome: 'Pedras da beira', verbo: 'Pegar pedra', forma: 'pedras', x: 60, z: -40, da: 1, volta: 40 }
  ],
  bolsaMax: 5
});

// visual dos moradores: cores de pele, cabelo, roupa e chapéu (formas.js)
// no: o nome com preposição, para as pistas ("procure na Horta Comunitária")
// ruido: 0 = área viva desde o início · 1 = área tomada pelo Ruído (só clareia com relações ativadas)
Area({ id: 'base', bioma: 'cerrado', nome: 'Base Brasília', no: 'na Base Brasília', x: 0, z: 0, r: 42, ruido: 0,
  texto: 'A Cidade-Núcleo. Daqui saem as rotas para todo o Brasil Vivo.' });
Area({ id: 'horta', bioma: 'cerrado', nome: 'Horta Comunitária', no: 'na Horta Comunitária', x: -85, z: 70, r: 34, ruido: 0,
  texto: 'Canteiros cheios de flor. Quem visita essas flores?' });
Area({ id: 'rota', bioma: 'cerrado', nome: 'Rota do Cerrado', no: 'na Rota do Cerrado', x: -10, z: -130, r: 48, ruido: 0,
  texto: 'Campo de árvores tortas, capim alto e cupinzeiros.' });
Area({ id: 'vereda', bioma: 'cerrado', nome: 'Vereda do Buriti', no: 'na Vereda do Buriti', x: 45, z: -45, r: 36, ruido: 1,
  relacoes: ['sapo-come-mosquito'],
  dicaRuido: 'O Ruído calou a vereda: os sapos sumiram. Seu Rio sabe onde ficaram os ovos.',
  texto: 'Os buritis estão de pé, mas a vereda ficou quieta. Os sapos sumiram e sobrou mosquito.' });
Area({ id: 'jardim', bioma: 'cerrado', nome: 'Jardim Polinizador', no: 'no Jardim Polinizador', x: 40, z: 80, r: 26, ruido: 1,
  relacoes: ['borboleta-poliniza-flor', 'jatai-poliniza-flor'],
  efeitos: [{ em: 0.5, faz: 'flores-abrem', texto: '🌸 As flores do jardim abriram!' }, { em: 1, faz: 'abre-rota', rota: 'vereda', texto: '🌼 Uma trilha de flores se abriu do jardim até a Vereda do Buriti.',
    fala: { npc: 'ipe', texto: 'O jardim voltou a ter cor e som. Viu a trilha de flores? Ela leva à Vereda do Buriti, onde os sapos sumiram. Seu Rio sabe onde ficaram os ovos.' } }],
  dicaRuido: 'As flores daqui não abrem: falta quem leve pólen de flor em flor.',
  texto: 'As flores do jardim estão fechadas e cinzentas. Nenhum polinizador aparece por aqui.' });

Npc({ id: 'ipe', bioma: 'cerrado', nome: 'Guardiã Ipê', emoji: '🌳', x: 9, z: 38, cor: '#3f7a3a', visual: { pele: '#8a5a3a', cabelo: '#1e3a1a', chapeu: '#f5c43a', saia: true, calca: '#5a3a24' },
  falas: {
    inicio: 'Bem-vindo a Brasília, a Cidade-Núcleo. O Ruído apagou as ligações entre os seres vivos: tem flor sem polinizador, vereda sem sapo. Observe, cuide e veja o que cada um faz. Sua BioDex guarda tudo.',
    pista: 'Comece pelo que está perto: a horta, a rota do Cerrado, as paredes da Base à noite. Cada ser vivo que você entende muda alguma coisa por aqui.'
  } });
Npc({ id: 'flor', bioma: 'cerrado', nome: 'Dona Flor', emoji: '👩‍🌾', x: -60, z: 50, cor: '#d35f8f', visual: { pele: '#b97a52', cabelo: '#d8d0c4', chapeu: '#e8c77a', saia: true, calca: '#6a4a3a' },
  falas: {
    inicio: 'Minha horta floresce, mas o jardim ali do outro lado da Base ficou cinza. Lá as flores nem abrem. Antes vinha borboleta, vinha abelhinha... Sumiram.',
    pista: 'Dizem que a borboleta-azul começa a vida bem pequena, numa folha. Já viu algum ovinho por aqui nos canteiros?'
  } });
Npc({ id: 'rio', bioma: 'cerrado', nome: 'Seu Rio', emoji: '🎣', x: 50, z: -30, cor: '#3b7dd8', visual: { pele: '#c98d64', cabelo: '#6a6a6a', chapeu: '#8a6a44', calca: '#4a4a3a' },
  falas: {
    inicio: 'A vereda era cheia de sapo cantando de noite. Agora está quieta e cheia de mosquito.',
    pista: 'Vi um cordão de ovos de sapo numa poça que está secando, ali na beira. Se levar para o Viveiro, com água limpa e algas, quem sabe...'
  } });
Npc({ id: 'tico', bioma: 'cerrado', nome: 'Tico', emoji: '🧒', x: 12, z: -18, cor: '#f5a53b', visual: { pele: '#6e4630', cabelo: '#1a1410', calca: '#2f6fb0', escala: 0.72 },
  falas: {
    inicio: 'Tem uma lagartixa na parede lá de casa! Ela só aparece de noite, perto da lâmpada.',
    pista: 'O que será que ela fica fazendo lá parada? Vem olhar de noite comigo.'
  } });
