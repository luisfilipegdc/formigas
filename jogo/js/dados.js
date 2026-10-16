/* =====================================================================
   Terra Codex · dados do Capítulo 1: Vale Vivo (MVP)
   Cartas da BioDex, Ecos, Ruidosos, regiões, obras, NPCs e missões.
   CONTEÚDO EM REVISÃO CIENTÍFICA. Textos para crianças de 8 a 13 anos.
   ===================================================================== */

// regiões do vale: centro, raio, nível de Ruído (0 fraco · 1 médio · 2 forte)
const REGIOES = [
  { id: 'vila', nome: 'Vila do Vale', x: 0, z: 0, r: 42, ruido: 0 },
  { id: 'horta', nome: 'Horta', x: -85, z: 70, r: 34, ruido: 0 },
  { id: 'floresta', nome: 'Floresta Antiga', x: -10, z: -130, r: 48, ruido: 1 },
  { id: 'rio', nome: 'Margem do Rio', x: 45, z: -45, r: 36, ruido: 1 },
  { id: 'margem', nome: 'Outra Margem', x: 150, z: 70, r: 44, ruido: 2 },
  { id: 'toca', nome: 'Toca do Devorador', x: 150, z: -130, r: 40, ruido: 2 }
];
const RIO_X = 80;          // o rio corre no eixo z, perto de x = 80
const RIO_LARGURA = 14;

// níveis de domínio da carta
const NIVEIS = ['', 'Visto', 'Entendido', 'Conectado', 'Aplicado'];

// cartas da BioDex. desafio = Entendido · conexao = Conectado · aplicado vem das obras
const CARTAS = [
  { id: 'abelha', nome: 'Abelha', emoji: '🐝', tipo: 'Polinizador', regiao: 'horta', hora: 'dia',
    funcao: 'Leva pólen de flor em flor. Sem ela, muita planta não dá fruto.', cuidado: 'Observe de longe. Ela só pica para se defender.',
    desafio: { p: 'A horta da vila parou de dar frutos. O que a abelha faz pelas plantas?', o: ['Leva o pólen de uma flor para outra', 'Come as folhas das plantas', 'Afasta os outros insetos'], c: 0, x: 'Isso é a polinização: o pólen chega na outra flor e nasce o fruto.' },
    conexao: { p: 'Complete a cadeia: abelha → ___ → fruto → alimento', o: ['flor', 'pedra', 'lixo'], c: 0, cadeia: 'abelha → flor → fruto → alimento' },
    eco: { nome: 'Eco-Abelha', evo: 'Eco-Rainha', poder: 'Mostra onde há flores e pólen', hp: 60, atk: 14, golpes: [['Pólen Dourado', 'medo'], ['Dança das Flores', null]] } },
  { id: 'formiga', nome: 'Formiga-saúva', emoji: '🐜', tipo: 'Construtor', regiao: 'vila', hora: 'dia',
    funcao: 'Corta folhas para cultivar um fungo, que é a comida da colônia. Revolve e aduba o solo.', cuidado: 'Não pise na trilha: siga a fila e veja para onde vai.',
    desafio: { p: 'As saúvas cortam folhas o dia inteiro. O que elas fazem com as folhas?', o: ['Comem as folhas na hora', 'Cultivam um fungo em cima delas', 'Fazem o ninho com as folhas'], c: 1, x: 'As formigas são fazendeiras: a folha vira adubo para o fungo, e o fungo é a comida.' },
    conexao: { p: 'Complete: folha cortada → ___ → comida das formigas', o: ['fungo', 'mel', 'areia'], c: 0, cadeia: 'folha → fungo → formiga' },
    eco: { nome: 'Eco-Formiga', evo: 'Eco-Saúva-Rainha', poder: 'Carrega peças pesadas de obra', hp: 70, atk: 12, golpes: [['Fila Forte', 'desperdicio'], ['Mordida de Folha', null]] } },
  { id: 'joaninha', nome: 'Joaninha', emoji: '🐞', tipo: 'Caçador', regiao: 'horta', hora: 'dia',
    funcao: 'Come pulgões, que sugam as plantas. É a jardineira natural da horta.', cuidado: 'Deixe na planta: ela está trabalhando.',
    desafio: { p: 'As folhas da horta estão cheias de pulgões. Quem ajuda?', o: ['A joaninha, que come os pulgões', 'O veneno, que mata tudo', 'A água, que afoga os pulgões'], c: 0, x: 'A joaninha e a larva dela comem dezenas de pulgões por dia. É controle biológico.' },
    conexao: { p: 'Complete: pulgão → ___ → horta saudável', o: ['joaninha', 'cigarra', 'sapo'], c: 0, cadeia: 'pulgão → joaninha → horta' },
    eco: { nome: 'Eco-Joaninha', evo: 'Eco-Joaninha-Sete-Pintas', poder: 'Espanta pulgões do caminho', hp: 50, atk: 15, golpes: [['Pintas de Aviso', 'medo'], ['Voo Rasante', null]] } },
  { id: 'minhoca', nome: 'Minhoca', emoji: '🪱', tipo: 'Decompositor', regiao: 'horta', hora: 'chuva',
    funcao: 'Cava túneis e come restos de planta. Deixa a terra fofa e cheia de nutrientes.', cuidado: 'Aparece depois da chuva. Devolva para a terra úmida.',
    desafio: { p: 'A terra da horta está dura e seca. O que a minhoca faz por ela?', o: ['Come as raízes', 'Cava túneis e deixa a terra fofa', 'Seca a terra'], c: 1, x: 'Os túneis deixam o ar e a água entrarem, e o cocô da minhoca é adubo.' },
    conexao: { p: 'Complete: restos de folha → ___ → terra fértil', o: ['minhoca', 'abelha', 'lagartixa'], c: 0, cadeia: 'restos → minhoca → solo' },
    eco: { nome: 'Eco-Minhoca', evo: 'Eco-Minhocão', poder: 'Afofa a terra para plantar', hp: 80, atk: 9, golpes: [['Terra Viva', 'desperdicio'], ['Túnel Surpresa', null]] } },
  { id: 'aranha', nome: 'Aranha-de-teia-dourada', emoji: '🕷️', tipo: 'Caçador', regiao: 'floresta', hora: 'dia',
    funcao: 'Prende na teia moscas e mosquitos. Uma teia pode ter mais de 1 metro.', cuidado: 'Não é perigosa para pessoas, mas observe sem tocar.',
    desafio: { p: 'A vila tem muitos mosquitos. A aranha ajuda ou atrapalha?', o: ['Atrapalha: aranha é praga', 'Ajuda: prende mosquitos na teia', 'Nenhum dos dois'], c: 1, x: 'Cada teia é uma armadilha de mosquitos e moscas. A aranha é vizinha útil.' },
    conexao: { p: 'Complete: mosquito → ___ → menos picadas', o: ['teia', 'lixo', 'flor'], c: 0, cadeia: 'mosquito → teia → menos picadas' },
    eco: { nome: 'Eco-Aranha', evo: 'Eco-Tecelã', poder: 'Estende pontes de fio', hp: 55, atk: 16, golpes: [['Fio de Ouro', 'boato'], ['Teia Rápida', null]] } },
  { id: 'lagartixa', nome: 'Lagartixa-de-parede', emoji: '🦎', tipo: 'Vigia', regiao: 'vila', hora: 'noite',
    funcao: 'Caça mosquitos e mariposas perto das lâmpadas. Anda no teto com almofadinhas nos dedos.', cuidado: 'Não tem veneno. Nunca puxe a cauda.',
    desafio: { p: 'Tico tem medo da lagartixa da parede. Ela faz mal?', o: ['Sim, ela é venenosa', 'Não: ela não tem veneno e come mosquitos', 'Só de noite'], c: 1, x: 'Lagartixa é vizinha de confiança: sem veneno, e come os mosquitos da casa.' },
    conexao: { p: 'Complete: lâmpada acesa → mosquitos → ___', o: ['lagartixa', 'abelha', 'minhoca'], c: 0, cadeia: 'luz → mosquito → lagartixa' },
    eco: { nome: 'Eco-Lagartixa', evo: 'Eco-Gecko-da-Noite', poder: 'Escala paredes e pedras', hp: 60, atk: 13, golpes: [['Cauda que Solta', 'boato'], ['Língua Rápida', null]] } },
  { id: 'cigarra', nome: 'Cigarra', emoji: '🦗', tipo: 'Vigia', regiao: 'floresta', hora: 'dia',
    funcao: 'Passa anos debaixo da terra e sobe para cantar no verão. Só os machos cantam.', cuidado: 'A casca no tronco é a pele velha. Pode guardar.',
    desafio: { p: 'Achou uma casca de cigarra na árvore. O que é?', o: ['Uma cigarra que morreu de tanto cantar', 'A pele velha que ela trocou', 'Um ovo de cigarra'], c: 1, x: 'A cigarra não estoura: ela troca de pele e a casca fica grudada no tronco.' },
    conexao: { p: 'Complete: ninfa debaixo da terra → ___ → canto no verão', o: ['troca de pele', 'casulo', 'hibernação'], c: 0, cadeia: 'ninfa → troca de pele → adulta' },
    eco: { nome: 'Eco-Cigarra', evo: 'Eco-Cantora', poder: 'Revela bichos escondidos pelo som', hp: 50, atk: 15, golpes: [['Canto de Verão', 'boato'], ['Zumbido', null]] } },
  { id: 'fungo', nome: 'Fungo da madeira', emoji: '🍄', tipo: 'Decompositor', regiao: 'floresta', hora: 'dia',
    funcao: 'Decompõe troncos caídos e devolve os nutrientes para o solo.', cuidado: 'Só olhe: alguns cogumelos são tóxicos.',
    desafio: { p: 'Um tronco caído está cheio de fungos. O que está acontecendo?', o: ['A floresta está doente', 'O fungo está decompondo o tronco e adubando o solo', 'O tronco vai virar pedra'], c: 1, x: 'Sem decompositores, a floresta ficaria coberta de troncos e folhas mortas.' },
    conexao: { p: 'Complete: tronco caído → ___ → nutrientes no solo', o: ['fungo', 'abelha', 'cigarra'], c: 0, cadeia: 'tronco → fungo → solo' },
    eco: { nome: 'Eco-Fungo', evo: 'Eco-Cogumelo-Ancião', poder: 'Recicla restos em recursos', hp: 75, atk: 10, golpes: [['Esporos', 'desperdicio'], ['Rede de Raízes', null]] } },
  { id: 'sapo', nome: 'Sapo-cururu', emoji: '🐸', tipo: 'Caçador', regiao: 'rio', hora: 'noite',
    funcao: 'Come insetos à noite perto da água. A pele fina sente a poluição.', cuidado: 'Não aperte: a pele tem uma secreção que defende dele.',
    desafio: { p: 'Os sapos sumiram do rio. O que isso avisa?', o: ['Que a água está suja: a pele do sapo sente a poluição', 'Que chegou o inverno', 'Nada, sapos somem sempre'], c: 0, x: 'Anfíbios são termômetros do ambiente: pele fina, água suja, sapo some.' },
    conexao: { p: 'Complete: lixo no rio → ___ → sapo some', o: ['água suja', 'mais peixes', 'chuva'], c: 0, cadeia: 'lixo → água suja → sapo some' } },
  { id: 'escorpiao', nome: 'Escorpião-amarelo', emoji: '🦂', tipo: 'Caçador', regiao: 'margem', hora: 'noite',
    funcao: 'Come baratas. Esconde-se em entulho e frestas.', cuidado: 'PERIGO REAL: a picada é grave. Nunca toque. Afaste-se e chame um adulto.',
    desafio: { p: 'Tico viu um escorpião no entulho. O que fazer?', o: ['Pegar com a mão para mostrar', 'Afastar-se e chamar um adulto', 'Jogar água nele'], c: 1, x: 'Escorpião é perigo de verdade. O jeito certo é distância, adulto e quintal sem entulho.' },
    conexao: { p: 'Complete: entulho e baratas → ___ → picada', o: ['escorpião', 'lagartixa', 'sapo'], c: 0, cadeia: 'entulho → escorpião → perigo' } },
  { id: 'ipe', nome: 'Ipê-amarelo', emoji: '🌳', tipo: 'Planta', regiao: 'vila', hora: 'dia',
    funcao: 'Floresce no fim da seca, sem folhas, e alimenta abelhas e beija-flores.', cuidado: 'Plante longe de muro: a raiz cresce.',
    desafio: { p: 'O ipê perdeu todas as folhas e ficou só com flores. Ele está morrendo?', o: ['Sim, árvore sem folha morreu', 'Não: ele floresce assim no fim da seca', 'Só se não chover'], c: 1, x: 'O ipê guarda energia e floresce antes das folhas. É sinal de que a chuva vem.' },
    conexao: { p: 'Complete: flor do ipê → ___ → semente', o: ['abelha', 'minhoca', 'fungo'], c: 0, cadeia: 'ipê → abelha → semente' } },
  { id: 'beijaflor', nome: 'Beija-flor', emoji: '🐦', tipo: 'Polinizador', regiao: 'margem', hora: 'dia',
    funcao: 'Bebe néctar e poliniza flores vermelhas e tubulares.', cuidado: 'Bebedouro só com água e açúcar, trocado todo dia.',
    desafio: { p: 'As flores vermelhas da margem não dão semente. Quem falta?', o: ['O beija-flor, que poliniza flores tubulares', 'A minhoca', 'O sapo'], c: 0, x: 'Flores compridas e vermelhas são feitas para o bico do beija-flor.' },
    conexao: { p: 'Complete: flor vermelha → ___ → semente', o: ['beija-flor', 'cigarra', 'fungo'], c: 0, cadeia: 'flor → beija-flor → semente' } }
];

// Ruidosos: cada um encarna um erro; o Eco com o fato certo dá dano dobrado
const RUIDOSOS = {
  medo: { nome: 'Medo', emoji: '😨', erro: '"Todo inseto é praga."', hp: 70, atk: 11, regioes: ['horta', 'vila'] },
  desperdicio: { nome: 'Desperdício', emoji: '🗑️', erro: '"Lixo some sozinho."', hp: 85, atk: 12, regioes: ['rio', 'floresta'] },
  boato: { nome: 'Boato', emoji: '📢', erro: '"Lagartixa faz mal."', hp: 80, atk: 13, regioes: ['margem', 'floresta'] }
};

// chefe: 5 fases, cada uma cai com uma conexão
const DEVORADOR = {
  nome: 'Devorador de Habitat', emoji: '👁️‍🗨️', hp: 300, atk: 16,
  fases: [
    { p: 'O Devorador ruge: "Inseto é praga! Mate todos!" Qual fato quebra isso?', o: ['A joaninha come os pulgões da horta', 'Inseto não serve para nada', 'Veneno resolve tudo'], c: 0 },
    { p: '"Planta cresce sozinha!" O que uma planta precisa para dar fruto?', o: ['Só de sol', 'Solo, água e polinizador', 'De cimento'], c: 1 },
    { p: '"Lixo no rio não faz mal!" O que acontece?', o: ['A água fica suja e os sapos somem', 'O rio fica mais bonito', 'O lixo vira peixe'], c: 0 },
    { p: '"Animal vive em qualquer lugar!" O que um bicho precisa?', o: ['De um habitat com comida e abrigo', 'De uma gaiola', 'De nada'], c: 0 },
    { p: 'Última fase. Qual é a rede viva?', o: ['Planta → inseto → solo → água → alimento, tudo ligado', 'Cada bicho vive sozinho', 'Só o ser humano importa'], c: 0 }
  ]
};

// obras: onde, o que exige e o que muda
const OBRAS = [
  { id: 'horta', nome: 'Horta', emoji: '🥕', x: -85, z: 70, exige: { cartas: [['abelha', 2], ['minhoca', 2]] }, restaura: 'horta', aplica: ['abelha', 'minhoca', 'joaninha'],
    texto: 'Para a horta voltar a produzir, ela precisa de terra fofa e de polinizadores.' },
  { id: 'filtro', nome: 'Filtro do rio', emoji: '💧', x: 62, z: -55, exige: { missao: 'rio-cinza' }, restaura: 'rio', aplica: ['sapo'],
    texto: 'Separe o que polui o rio para o filtro funcionar.' },
  { id: 'ponte', nome: 'Ponte', emoji: '🌉', x: RIO_X, z: 20, exige: { missao: 'ponte-caida' }, restaura: null, aplica: ['formiga', 'aranha'],
    texto: 'Meça a largura do rio e escolha a madeira certa.' },
  { id: 'abrigo', nome: 'Abrigo de observação', emoji: '🏕️', x: 150, z: 70, exige: { pegadas: 3 }, restaura: 'margem', aplica: ['beijaflor', 'escorpiao'],
    texto: 'Com as pegadas identificadas, dá para observar os bichos sem tocar neles.' },
  { id: 'trilha', nome: 'Trilha ecológica', emoji: '🥾', x: -10, z: -130, exige: { cartas: [['fungo', 2], ['cigarra', 1]] }, restaura: 'floresta', aplica: ['fungo', 'cigarra'],
    texto: 'A trilha passa pelos troncos em decomposição sem pisar neles.' },
  { id: 'laboratorio', nome: 'Laboratório da BioDex', emoji: '🔬', x: 18, z: 14, exige: { entendidas: 6 }, restaura: 'vila', aplica: ['lagartixa', 'ipe'],
    texto: 'Sua base. Aqui os Ecos descansam e a BioDex ganha força.' }
];

// pegadas (sinais) na outra margem
const PEGADAS = [
  { id: 'peg1', x: 130, z: 50, bicho: 'Pegada de capivara', texto: 'Quatro dedos e marca de nado. Alguém grande passou aqui à noite.' },
  { id: 'peg2', x: 165, z: 95, bicho: 'Pena de beija-flor', texto: 'Uma pena verde brilhante. Tem ninho por perto.' },
  { id: 'peg3', x: 175, z: 55, bicho: 'Rastro de escorpião', texto: 'Entulho revirado e uma casca. Daqui, só de longe.' }
];

// NPCs da vila
const NPCS = [
  { id: 'flor', nome: 'Dona Flor', emoji: '👩‍🌾', x: -60, z: 50, cor: '#d35f8f',
    falas: { inicio: 'Minha horta parou de dar fruto. As flores abrem, mas o fruto não vem. Tem alguma coisa faltando, e não é água.', pista: 'Dizem que é praga. Eu acho que falta alguém. Procure quem visita as flores.', feita: 'Olha a horta! Fruto de novo. Eu tinha medo de abelha e era ela que faltava.' } },
  { id: 'rio', nome: 'Seu Rio', emoji: '🎣', x: 50, z: -30, cor: '#3b7dd8',
    falas: { inicio: 'O rio ficou cinza. Jogaram de tudo nele: pneu, óleo, saco plástico. Os sapos sumiram.', pista: 'Separe o que não devia estar na água. Depois a gente constrói um filtro.', feita: 'Ouviu? Os sapos voltaram. Rio limpo canta à noite.' } },
  { id: 'tico', nome: 'Tico', emoji: '🧒', x: 12, z: -18, cor: '#f5a53b',
    falas: { inicio: 'Tem uma lagartixa na minha parede! Minha prima disse que ela é venenosa. E tem um bicho amarelo no entulho do vizinho!', pista: 'Você pode descobrir a verdade sobre os dois? A lagartixa e o bicho amarelo?', feita: 'Agora eu sei: lagartixa é amiga. E o escorpião é de longe, com um adulto. Nem tudo que tem medo é igual.' } },
  { id: 'ipe', nome: 'Guardiã Ipê', emoji: '🌳', x: 9, z: 38, cor: '#f5c451',
    falas: { inicio: 'Eu guardo o Codex deste vale. Quando o Devorador cair, volte aqui.', feita: 'Você entendeu o vale e o vale voltou a viver. Receba o Selo do Vale Vivo, Restaurador. Sete regiões esperam por você.' } }
];

// missões: feita(e) recebe o estado do jogo
const MISSOES = [
  { id: 'codex-quebrado', nome: 'O Codex Quebrado', emoji: '📖', texto: 'Recupere a BioDex: observe e registre o primeiro ser vivo.', feita: (e) => Object.keys(e.cartas).length >= 2 },
  { id: 'horta-sem-frutos', nome: 'A Horta Sem Frutos', emoji: '🌼', texto: 'Fale com Dona Flor e descubra quem está faltando na horta.', feita: (e) => e.falou.flor && (e.cartas.abelha || 0) >= 1 },
  { id: 'nem-todo-inseto', nome: 'Nem Todo Inseto é Inimigo', emoji: '🐞', texto: 'Entenda a abelha, a joaninha e a minhoca. Depois, construa a horta.', feita: (e) => e.obras.horta },
  { id: 'rio-cinza', nome: 'O Rio Cinza', emoji: '💧', texto: 'Fale com Seu Rio e separe o que polui a água. Construa o filtro.', feita: (e) => e.obras.filtro },
  { id: 'ponte-caida', nome: 'A Ponte Caída', emoji: '🌉', texto: 'Meça o rio e reconstrua a ponte para a outra margem.', feita: (e) => e.obras.ponte },
  { id: 'pegadas', nome: 'Pegadas na Lama', emoji: '🐾', texto: 'Ache 3 sinais de animais na outra margem, sem tocar neles. Construa o abrigo.', feita: (e) => e.obras.abrigo },
  { id: 'fungos', nome: 'Fungos na Madeira', emoji: '🍄', texto: 'Entenda o fungo e a cigarra na Floresta Antiga. Abra a trilha.', feita: (e) => e.obras.trilha },
  { id: 'medo-da-vila', nome: 'O Medo da Vila', emoji: '🧒', texto: 'Ajude Tico: descubra a verdade sobre a lagartixa e o escorpião.', feita: (e) => e.falou.tico && (e.cartas.lagartixa || 0) >= 2 && (e.cartas.escorpiao || 0) >= 2 },
  { id: 'rede-viva', nome: 'A Rede Viva', emoji: '🕸️', texto: 'Conecte 5 cartas: planta, inseto, solo, água e alimento.', feita: (e) => Object.values(e.cartas).filter((n) => n >= 3).length >= 5 },
  { id: 'devorador', nome: 'O Devorador de Habitat', emoji: '👁️‍🗨️', texto: 'Com 3 Ecos e a Rede Viva, enfrente o chefe na Toca.', feita: (e) => e.chefe }
];

const CARTA = (id) => CARTAS.find((c) => c.id === id);
