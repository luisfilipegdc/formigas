/* =====================================================================
   catalogo.js — dados do Catálogo 3D de Animais (edite à vontade)

   Cada animal tem:
     id, nome, cientifico, grupo, emoji, cor, pagina (null = "em breve")
     resumo     → uma frase curta para o cartão
     ficha      → linhas da aba "Ficha" (ícone, título, texto)
     castas     → (opcional) ficha específica de cada casta/forma
     ciclo      → etapas da vida (aba "Vida")
     curiosidades
   Os textos são para crianças e professores: frases curtas e diretas.
   ===================================================================== */
const GRUPOS = [
  { id: 'todos', nome: 'Todos', emoji: '🌍' },
  { id: 'insetos', nome: 'Insetos', emoji: '🐞' },
  { id: 'aves', nome: 'Aves', emoji: '🐦' },
  { id: 'mamiferos', nome: 'Mamíferos', emoji: '🐾' },
  { id: 'repteis', nome: 'Répteis', emoji: '🦎' },
  { id: 'anfibios', nome: 'Anfíbios', emoji: '🐸' },
  { id: 'peixes', nome: 'Peixes', emoji: '🐟' }
];

const ANIMAIS = [
  {
    id: 'formiga', nome: 'Formiga-saúva', cientifico: 'Atta spp.', grupo: 'insetos', emoji: '🐜', cor: '#ffd3c2',
    pagina: 'formiga.html',
    resumo: 'A cortadeira que planta um jardim de fungo debaixo da terra.',
    rapido: { tamanho: '2 a 15 mm', onde: 'Américas', come: 'Fungo' },
    ficha: [
      ['🔬', 'Nome científico', 'Atta (gênero das saúvas). No Brasil existem várias espécies.'],
      ['🧬', 'Classificação', 'Inseto · Ordem Hymenoptera (a mesma das abelhas e vespas) · Família Formicidae'],
      ['📍', 'Onde vive', 'Do sul dos Estados Unidos à Argentina. Muito comum no Brasil, em matas, campos e cidades.'],
      ['🏠', 'Casa', 'Formigueiros enormes debaixo da terra, com centenas de câmaras. Podem ter vários metros de profundidade.'],
      ['🍽️', 'O que come', 'Um fungo que elas mesmas cultivam em pedaços de folhas e flores. Elas não comem a folha!'],
      ['👨‍👩‍👧', 'Família', 'Uma colônia pode ter milhões de formigas, quase todas filhas da mesma rainha.'],
      ['⏳', 'Quanto vive', 'A rainha pode viver mais de 10 anos. As operárias vivem alguns meses.'],
      ['🌱', 'Importância', 'Revolvem e adubam o solo. Mas também cortam muitas plantas e podem estragar plantações.']
    ],
    castas: {
      operaria: { nome: 'Operária', emoji: '🐜', linhas: [
        ['📏', 'Tamanho', 'De 2 a 15 mm. Há operárias de vários tamanhos, e cada tamanho faz um trabalho.'],
        ['🛠️', 'Trabalho', 'Cortam folhas, carregam, cuidam do fungo, limpam a casa e protegem o formigueiro.'],
        ['🪖', 'Soldados', 'As maiores têm cabeça enorme e mandíbulas fortes para defender a colônia.']
      ] },
      rainha: { nome: 'Rainha (içá)', emoji: '👑', linhas: [
        ['📏', 'Tamanho', 'Cerca de 2 a 3 cm: a maior do formigueiro.'],
        ['🥚', 'Trabalho', 'Bota todos os ovos da colônia, milhões ao longo da vida.'],
        ['🪽', 'Asas', 'Nasce com asas. Depois do voo nupcial, arranca as asas e começa um formigueiro novo.']
      ] },
      zangao: { nome: 'Zangão (bitu)', emoji: '🪽', linhas: [
        ['📏', 'Tamanho', 'Menor que a rainha, com olhos grandes e antenas compridas.'],
        ['💞', 'Trabalho', 'Voa na revoada para encontrar uma rainha. Vive pouco depois disso.']
      ] }
    },
    ciclo: [
      ['🥚', 'Ovo', 'A rainha bota ovinhos brancos, menores que um grão de areia.'],
      ['🐛', 'Larva', 'Parece uma minhoquinha branca e sem patas. As operárias dão fungo para ela comer.'],
      ['🤍', 'Pupa', 'Já tem forma de formiga, mas é branquinha e fica paradinha.'],
      ['🐜', 'Adulta', 'Sai da pupa e começa a trabalhar. Do ovo até adulta leva algumas semanas.'],
      ['🪽', 'Revoada', 'Na primavera, depois das chuvas, as içás e os bitus voam para formar novos formigueiros.']
    ],
    curiosidades: [
      'A rainha leva um pedacinho do fungo na boca quando sai para fundar um formigueiro novo.',
      'Cada operária carrega pedaços de folha muito mais pesados que o próprio corpo.',
      'As saúvas têm uma "lixeira": salas só para o lixo, longe do fungo.',
      'Formigas conversam pelo cheiro: elas deixam trilhas químicas para as outras seguirem.'
    ]
  },
  {
    id: 'abelha', nome: 'Abelha-europeia', cientifico: 'Apis mellifera', grupo: 'insetos', emoji: '🐝', cor: '#ffe58a',
    pagina: 'abelha.html',
    resumo: 'A abelha do mel, que poliniza flores e vive em colmeias.',
    rapido: { tamanho: '12 a 20 mm', onde: 'Mundo todo', come: 'Néctar e pólen' },
    ficha: [
      ['🔬', 'Nome científico', 'Apis mellifera. No Brasil vive a abelha africanizada, uma mistura de raças.'],
      ['🧬', 'Classificação', 'Inseto · Ordem Hymenoptera · Família Apidae'],
      ['📍', 'Onde vive', 'Nasceu na Europa, na África e no Oriente Médio. Hoje é criada no mundo todo.'],
      ['🏠', 'Casa', 'Colmeias com favos de cera, em ocos de árvores ou em caixas feitas pelos apicultores.'],
      ['🍽️', 'O que come', 'Néctar (que vira mel) e pólen das flores. Os bebês comem geleia real, pólen e mel.'],
      ['👨‍👩‍👧', 'Família', 'Uma colmeia tem de 20 mil a 80 mil abelhas, uma única rainha e alguns zangões.'],
      ['⏳', 'Quanto vive', 'Operária: cerca de 6 semanas no verão. Rainha: de 2 a 5 anos.'],
      ['🌸', 'Importância', 'Polinizam muitas plantas, inclusive frutas e verduras que a gente come.']
    ],
    castas: {
      operaria: { nome: 'Operária', emoji: '🐝', linhas: [
        ['📏', 'Tamanho', 'Cerca de 12 mm.'],
        ['🛠️', 'Trabalho', 'Ao longo da vida faz de tudo: limpa, cuida dos bebês, faz cera, guarda a porta e, por fim, busca néctar e pólen.'],
        ['🧺', 'Cestinhas', 'Nas patas de trás tem "cestinhas" onde leva bolinhas de pólen para casa.'],
        ['🐝', 'Ferrão', 'Tem ferrão com farpas: ao picar, quase sempre morre.']
      ] },
      rainha: { nome: 'Rainha', emoji: '👑', linhas: [
        ['📏', 'Tamanho', 'Cerca de 2 cm, com o abdômen comprido.'],
        ['🥚', 'Trabalho', 'Bota até 1.500 ovos por dia na primavera.'],
        ['🍯', 'Alimento', 'Come geleia real a vida toda. É isso que faz uma larva virar rainha.']
      ] },
      zangao: { nome: 'Zangão', emoji: '👀', linhas: [
        ['📏', 'Tamanho', 'Cerca de 1,5 cm, mais gordinho que a operária.'],
        ['👀', 'Olhos', 'Olhos enormes, que se encontram no alto da cabeça, para achar a rainha no voo.'],
        ['🚫', 'Sem ferrão', 'Não pica e não busca comida: as operárias o alimentam.']
      ] }
    },
    ciclo: [
      ['🥚', 'Ovo · 3 dias', 'A rainha bota um ovinho em cada célula do favo.'],
      ['🐛', 'Larva · 6 dias', 'As abelhas babás alimentam a larva várias vezes por dia.'],
      ['🟫', 'Pupa · 12 dias', 'A célula é fechada com cera e lá dentro a larva vira abelha.'],
      ['🐝', 'Adulta', 'A operária nasce em 21 dias. A rainha em 16 e o zangão em 24.'],
      ['🌼', 'Campeira', 'Nas últimas semanas de vida, a operária sai para buscar néctar e pólen.']
    ],
    curiosidades: [
      'As asas batem cerca de 230 vezes por segundo: é por isso que a abelha zumbe.',
      'Com a dança do requebrado, a abelha mostra às outras a direção e a distância das flores.',
      'Uma operária faz, na vida toda, só um pouquinho de mel: menos de uma colher de chá.',
      'O favo tem casinhas de seis lados porque assim cabe muito mel gastando pouca cera.',
      'O Brasil também tem abelhas sem ferrão, como a jataí e a uruçu.'
    ]
  },
  { id: 'borboleta', nome: 'Borboleta-azul', cientifico: 'Morpho helenor', grupo: 'insetos', emoji: '🦋', cor: '#cfe0ff', pagina: null, resumo: 'Asas azuis brilhantes da Mata Atlântica.' },
  { id: 'joaninha', nome: 'Joaninha', cientifico: 'Família Coccinellidae', grupo: 'insetos', emoji: '🐞', cor: '#ffd0cc', pagina: null, resumo: 'A caçadora de pulgões.' },
  { id: 'beijaflor', nome: 'Beija-flor', cientifico: 'Família Trochilidae', grupo: 'aves', emoji: '🐦', cor: '#cdeedd', pagina: null, resumo: 'A ave que voa parada no ar.' },
  { id: 'arara', nome: 'Arara-azul', cientifico: 'Anodorhynchus hyacinthinus', grupo: 'aves', emoji: '🦜', cor: '#cfe3ff', pagina: null, resumo: 'A maior arara do mundo, do Pantanal.' },
  { id: 'onca', nome: 'Onça-pintada', cientifico: 'Panthera onca', grupo: 'mamiferos', emoji: '🐆', cor: '#ffe2b8', pagina: null, resumo: 'O maior felino das Américas.' },
  { id: 'preguica', nome: 'Bicho-preguiça', cientifico: 'Bradypus variegatus', grupo: 'mamiferos', emoji: '🦥', cor: '#e6dccb', pagina: null, resumo: 'Vive pendurado nas árvores, bem devagar.' },
  { id: 'tartaruga', nome: 'Tartaruga-verde', cientifico: 'Chelonia mydas', grupo: 'repteis', emoji: '🐢', cor: '#d3efe0', pagina: null, resumo: 'Atravessa oceanos e volta à praia onde nasceu.' },
  { id: 'sapo', nome: 'Sapo-cururu', cientifico: 'Rhinella diptycha', grupo: 'anfibios', emoji: '🐸', cor: '#dcefc6', pagina: null, resumo: 'Começa a vida como girino na água.' },
  { id: 'pirarucu', nome: 'Pirarucu', cientifico: 'Arapaima gigas', grupo: 'peixes', emoji: '🐟', cor: '#d6e9f3', pagina: null, resumo: 'Um dos maiores peixes de água doce, da Amazônia.' }
];
