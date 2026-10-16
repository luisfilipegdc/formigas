/* =====================================================================
   Bioma Cerrado · Brasília, a Cidade-Núcleo (fatia vertical do MVP)
   Áreas do mapa 3D, recursos do Viveiro e moradores.
   Coordenadas em metros no terreno de 440 × 440 m (centro = Base Brasília).
   CONTEÚDO EM REVISÃO CIENTÍFICA: espécies, nomes e relações são rascunho.
   ===================================================================== */
Bioma({
  id: 'cerrado', nome: 'Cerrado', emoji: '🌾', base: 'base', clima: ['seco', 'chuva'], livre: true,
  // recursos que o Viveiro usa (colhidos no mundo a partir da Sprint 2)
  recursos: {
    'folha-hospedeira': { nome: 'Folha da planta-hospedeira', emoji: '🍃' },
    'sombra': { nome: 'Sombra', emoji: '⛱️' },
    'quieto': { nome: 'Deixar quieto', emoji: '🤫' },
    'agua-limpa': { nome: 'Água limpa', emoji: '💧' },
    'algas': { nome: 'Algas', emoji: '🌿' },
    'pedra-seca': { nome: 'Pedra seca para sair da água', emoji: '🪨' }
  }
});

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
  texto: 'Os buritis estão de pé, mas a vereda ficou quieta. Os sapos sumiram e sobrou mosquito.' });
Area({ id: 'jardim', bioma: 'cerrado', nome: 'Jardim Polinizador', no: 'no Jardim Polinizador', x: 40, z: 80, r: 26, ruido: 1,
  relacoes: ['borboleta-poliniza-flor', 'jatai-poliniza-flor'],
  efeitos: [{ em: 0.5, faz: 'flores-abrem' }, { em: 1, faz: 'abre-rota', rota: 'rota-vereda' }],
  texto: 'As flores do jardim estão fechadas e cinzentas. Nenhum polinizador aparece por aqui.' });

Npc({ id: 'ipe', bioma: 'cerrado', nome: 'Guardiã Ipê', emoji: '🌳', x: 9, z: 38, cor: '#f5c451',
  falas: {
    inicio: 'Bem-vindo a Brasília, a Cidade-Núcleo. O Ruído apagou as ligações entre os seres vivos: tem flor sem polinizador, vereda sem sapo. Observe, cuide e veja o que cada um faz. Sua BioDex guarda tudo.',
    pista: 'Comece pelo que está perto: a horta, a rota do Cerrado, as paredes da Base à noite. Cada ser vivo que você entende muda alguma coisa por aqui.'
  } });
Npc({ id: 'flor', bioma: 'cerrado', nome: 'Dona Flor', emoji: '👩‍🌾', x: -60, z: 50, cor: '#d35f8f',
  falas: {
    inicio: 'Minha horta floresce, mas o jardim ali do outro lado da Base ficou cinza. Lá as flores nem abrem. Antes vinha borboleta, vinha abelhinha... Sumiram.',
    pista: 'Dizem que a borboleta-azul começa a vida bem pequena, numa folha. Já viu algum ovinho por aqui nos canteiros?'
  } });
Npc({ id: 'rio', bioma: 'cerrado', nome: 'Seu Rio', emoji: '🎣', x: 50, z: -30, cor: '#3b7dd8',
  falas: {
    inicio: 'A vereda era cheia de sapo cantando de noite. Agora está quieta e cheia de mosquito.',
    pista: 'Vi um cordão de ovos de sapo numa poça que está secando, ali na beira. Se levar para a água limpa do Ninho, quem sabe...'
  } });
Npc({ id: 'tico', bioma: 'cerrado', nome: 'Tico', emoji: '🧒', x: 12, z: -18, cor: '#f5a53b',
  falas: {
    inicio: 'Tem uma lagartixa na parede lá de casa! Ela só aparece de noite, perto da lâmpada.',
    pista: 'O que será que ela fica fazendo lá parada? Vem olhar de noite comigo.'
  } });
