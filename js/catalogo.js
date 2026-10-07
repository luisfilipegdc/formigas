/* =====================================================================
   catalogo.js — dados do Natureza no Bolso (edite à vontade)

   Cada animal tem:
     id, nome, cientifico, grupo, emoji, cor, pagina (null = "em breve")
     resumo     → uma frase curta para o cartão
     ficha      → linhas da aba "Ficha" (ícone, título, texto)
     castas     → (opcional) ficha específica de cada casta/forma
     ciclo      → etapas da vida (aba "Vida")
     curiosidades
     curto      → nome curto para frases ("Outra joaninha!")
     pista      → dica de "Quem sou eu?" para bichos ainda fora do bolso
     procurar   → onde procurar no mundo real
     som        → (opcional) { arquivo: 'som/x.mp3', autor, lic, fonte } para o botão 🔊
     silencio   → curiosidade para bichos que não fazem som audível
     porDentro  → true quando o 3D tem "Por Dentro do Bicho" (selo 🧩 e descoberta extra)
     processo   → nome do "Como funciona?" do 3D (descoberta extra), ex.: 'como nasce o mel'
     tipo       → (opcional) agrupa várias espécies do mesmo tipo (ex.: 'aranha', 'cigarra')
     art        → 'o' quando o nome é masculino (o beija-flor); padrão 'a'
     fotos      → fotos do iNaturalist guardadas em img/animais (a 1ª tem versão
                  pequena "-1p.jpg" para os cartões); autor e licença aparecem no site
     destaques  → (só animais com 3D) o que dá para explorar, no destaque do catálogo
     busca      → nome usado para buscar foto e dados reais no iNaturalist
     wiki       → título do artigo na Wikipédia em português
     comp       → dados do comparador (mm = tamanho típico em milímetros,
                  dieta, tax = [filo, classe, ordem, família], iucn = situação)
   Os textos são para crianças e professores: frases curtas e diretas.
   ===================================================================== */
const GRUPOS = [
  { id: 'todos', nome: 'Todos', emoji: '🌍' },
  { id: 'insetos', nome: 'Insetos', emoji: '🐞' },
  { id: 'aracnideos', nome: 'Aracnídeos', emoji: '🕷️' },
  { id: 'aves', nome: 'Aves', emoji: '🐦' },
  { id: 'mamiferos', nome: 'Mamíferos', emoji: '🐾' },
  { id: 'repteis', nome: 'Répteis', emoji: '🦎' },
  { id: 'anfibios', nome: 'Anfíbios', emoji: '🐸' },
  { id: 'peixes', nome: 'Peixes', emoji: '🐟' }
];

const ANIMAIS = [
  {
    id: 'formiga', nome: 'Formiga-saúva', cientifico: 'Atta spp.', grupo: 'insetos', emoji: '🐜', cor: '#ffd3c2',
    silencio: 'Formigas quase não fazem som: elas conversam pelo cheiro!',
    curto: 'formiga', pista: 'Eu ando em fila carregando pedacinhos de folha.', procurar: 'Trilhas no chão do jardim ou da calçada.',
    pagina: 'bicho3d.html?id=formiga',
    resumo: 'A cortadeira que planta um jardim de fungo debaixo da terra.',
    fotos: [
      { arquivo: 'img/animais/formiga-1.jpg', autor: 'Juan Cruzado Cortés', lic: 'CC BY-SA', especie: 'Atta mexicana', inat: 2911140 },
      { arquivo: 'img/animais/formiga-2.jpg', autor: 'Scott Loarie', lic: 'CC0', especie: 'Atta mexicana', inat: 579966 },
      { arquivo: 'img/animais/formiga-3.jpg', autor: 'Eduardo A. Bolaños Vargas', lic: 'CC BY', especie: 'Atta cephalotes', inat: 97972791 }
    ],
    busca: 'Atta', wiki: 'Saúva', visita: ['🏠', 'Visitou o formigueiro'],
    destaques: ['🐜 operária', '👑 rainha', '🪽 zangão', '🏠 formigueiro por dentro'],
    rapido: { tamanho: '2 a 15 mm', onde: 'Américas', come: 'Fungo' },
    comp: { mm: 10, tam: '2 a 15 mm (operária)', igual: 'um grão de arroz', dieta: 'fungo', come: 'Um fungo que elas plantam em pedaços de folha.', vive: 'Operária: meses · Rainha: mais de 10 anos', social: 'Colônias de milhões', casa: 'Formigueiro debaixo da terra', tax: ['Arthropoda', 'Insecta', 'Hymenoptera', 'Formicidae'], iucn: null },
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
    curto: 'abelha', pista: 'Eu visito flores e faço zum-zum.', procurar: 'Perto de flores, nas horas de sol.',
    pagina: 'bicho3d.html?id=abelha', processo: 'como nasce o mel',
    resumo: 'A abelha do mel, que poliniza flores e vive em colmeias.',
    fotos: [
      { arquivo: 'img/animais/abelha-1.jpg', autor: 'Cole Shoemaker', lic: 'CC BY', especie: 'Apis mellifera', inat: 117869766 },
      { arquivo: 'img/animais/abelha-2.jpg', autor: 'Maxim Shashkov', lic: 'CC BY', especie: 'Apis mellifera', inat: 77392356 },
      { arquivo: 'img/animais/abelha-3.jpg', autor: 'Michel Langeveld', lic: 'CC BY-SA', especie: 'Apis mellifera', inat: 96754126 }
    ],
    busca: 'Apis mellifera', wiki: 'Apis mellifera', visita: ['🍯', 'Visitou a colmeia'],
    destaques: ['🐝 operária', '👑 rainha', '👀 zangão', '🍯 colmeia por dentro', '🌼 voa nas flores'],
    rapido: { tamanho: '12 a 20 mm', onde: 'Mundo todo', come: 'Néctar e pólen' },
    comp: { mm: 13, tam: '12 a 20 mm', igual: 'uma unha de adulto', dieta: 'nectar', come: 'Néctar (que vira mel) e pólen das flores.', vive: 'Operária: 6 semanas · Rainha: 2 a 5 anos', social: 'Colmeias de 20 a 80 mil', casa: 'Colmeia com favos de cera', tax: ['Arthropoda', 'Insecta', 'Hymenoptera', 'Apidae'], iucn: null },
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
  {
    id: 'borboleta', nome: 'Borboleta-azul', cientifico: 'Morpho helenor', grupo: 'insetos', emoji: '🦋', cor: '#cfe0ff', pagina: null,
    silencio: 'Borboletas são silenciosas: nem as asas fazem barulho que a gente consiga ouvir.',
    curto: 'borboleta', pista: 'Minhas asas brilham azul quando eu voo.', procurar: 'Matas e jardins com frutas maduras caídas.',
    fotos: [
      { arquivo: 'img/animais/borboleta-1.jpg', autor: 'deboas', lic: 'CC BY', especie: 'Morpho helenor', inat: 70941465 },
      { arquivo: 'img/animais/borboleta-2.jpg', autor: 'Fernando Sessegolo', lic: 'CC0', especie: 'Morpho helenor', inat: 102956421 },
      { arquivo: 'img/animais/borboleta-3.jpg', autor: 'Rob Foster', lic: 'CC BY', especie: 'Morpho helenor marinita', inat: 63364495 }
    ],
    busca: 'Morpho helenor', wiki: 'Morpho helenor',
    resumo: 'Asas azuis brilhantes da Mata Atlântica.',
    rapido: { tamanho: '12 a 15 cm', onde: 'Brasil', come: 'Frutas caídas' },
    comp: { mm: 130, tam: '12 a 15 cm de asa a asa', igual: 'uma mão aberta de adulto', dieta: 'frutas', come: 'Suco de frutas maduras caídas no chão. A lagarta come folhas.', vive: 'Adulta: algumas semanas', social: 'Sozinha', casa: 'Matas e beiras de rio', tax: ['Arthropoda', 'Insecta', 'Lepidoptera', 'Nymphalidae'], iucn: null },
    ficha: [
      ['🔬', 'Nome científico', 'Morpho helenor. Existem muitas espécies de borboletas-azuis (gênero Morpho).'],
      ['🧬', 'Classificação', 'Inseto · Ordem Lepidoptera (borboletas e mariposas) · Família Nymphalidae'],
      ['📍', 'Onde vive', 'Do México à Argentina. No Brasil, na Mata Atlântica e na Amazônia.'],
      ['🍽️', 'O que come', 'A adulta suga o caldo de frutas maduras. A lagarta come folhas de plantas da família do feijão.'],
      ['✨', 'Cor', 'O azul não é tinta: são escamas minúsculas que refletem a luz, como uma bolha de sabão.'],
      ['⏳', 'Quanto vive', 'Do ovo até morrer, uns 4 meses. Como borboleta, poucas semanas.']
    ],
    ciclo: [
      ['🥚', 'Ovo', 'A mãe bota ovos em cima das folhas.'],
      ['🐛', 'Lagarta', 'Come folhas e cresce muito. É vermelha, amarela e peluda.'],
      ['🟢', 'Crisálida', 'Fica pendurada e, lá dentro, o corpo vira borboleta.'],
      ['🦋', 'Borboleta', 'Sai com as asas molhadas, espera secar e voa.']
    ],
    curiosidades: [
      'Por baixo, as asas são marrons com "olhos" desenhados: assim ela se esconde quando pousa.',
      'Quando voa, o azul pisca e some. Isso confunde os pássaros que tentam pegá-la.'
    ]
  },
  {
    id: 'joaninha', nome: 'Joaninha', cientifico: 'Família Coccinellidae', grupo: 'insetos', emoji: '🐞', cor: '#ffd0cc', pagina: null,
    silencio: 'A joaninha é silenciosa. Quando se assusta, solta um líquido amarelo com cheiro ruim!',
    curto: 'joaninha', pista: 'Sou vermelhinha, com bolinhas pretas.', procurar: 'Folhas de plantas com pulgões.',
    fotos: [
      { arquivo: 'img/animais/joaninha-1.jpg', autor: 'Eddie Dunbar', lic: 'CC BY-SA', especie: 'Coccinella septempunctata', inat: 860583 },
      { arquivo: 'img/animais/joaninha-2.jpg', autor: 'Katja Schulz', lic: 'CC BY', especie: 'Harmonia axyridis', inat: 7078473 },
      { arquivo: 'img/animais/joaninha-3.jpg', autor: 'Alexis', lic: 'CC BY', especie: 'Harmonia axyridis', inat: 77172495 }
    ],
    busca: 'Coccinellidae', wiki: 'Joaninha',
    resumo: 'A caçadora de pulgões.',
    rapido: { tamanho: '1 a 10 mm', onde: 'Mundo todo', come: 'Pulgões' },
    comp: { mm: 7, tam: '1 a 10 mm', igual: 'uma ervilha', dieta: 'carnivoro', come: 'Pulgões e outros bichinhos que estragam as plantas.', vive: 'Cerca de 1 ano', social: 'Sozinha (às vezes se juntam no frio)', casa: 'Folhas e flores', tax: ['Arthropoda', 'Insecta', 'Coleoptera', 'Coccinellidae'], iucn: null },
    ficha: [
      ['🔬', 'Nome científico', 'Família Coccinellidae. São mais de 5 mil espécies no mundo.'],
      ['🧬', 'Classificação', 'Inseto · Ordem Coleoptera (besouros) · Família Coccinellidae'],
      ['📍', 'Onde vive', 'No mundo todo: jardins, hortas, campos e matas.'],
      ['🍽️', 'O que come', 'Pulgões! Uma joaninha pode comer dezenas por dia.'],
      ['🛡️', 'Casca', 'As bolinhas ficam numa capa dura que protege as asas de voar.'],
      ['🌱', 'Importância', 'Protege as plantas sem veneno: agricultores gostam muito dela.']
    ],
    ciclo: [
      ['🥚', 'Ovo', 'Ovinhos amarelos em grupo, perto dos pulgões.'],
      ['🐛', 'Larva', 'Parece um jacarezinho escuro e já come pulgões.'],
      ['🟠', 'Pupa', 'Gruda numa folha e fica parada alguns dias.'],
      ['🐞', 'Adulta', 'Sai clarinha e as cores e bolinhas aparecem depois.']
    ],
    curiosidades: [
      'As cores fortes avisam: "tenho gosto ruim, não me coma!"',
      'Nem toda joaninha é vermelha: há amarelas, pretas, laranjas e até sem bolinhas.'
    ]
  },
  {
    id: 'beijaflor', art: 'o', nome: 'Beija-flor', cientifico: 'Família Trochilidae', grupo: 'aves', emoji: '🐦', cor: '#cdeedd', pagina: null,
    curto: 'beija-flor', pista: 'Bato as asas tão rápido que fico parado no ar.', procurar: 'Perto de flores coloridas, de manhã cedo.',
    fotos: [
      { arquivo: 'img/animais/beijaflor-1.jpg', autor: 'David McCorquodale', lic: 'CC BY', especie: 'Colibri coruscans', inat: 13811179 },
      { arquivo: 'img/animais/beijaflor-2.jpg', autor: 'Kahio T. Mazon', lic: 'CC0', especie: 'Amazilia fimbriata', inat: 28391150 },
      { arquivo: 'img/animais/beijaflor-3.jpg', autor: 'Leonel Roget', lic: 'CC BY', especie: 'Leucochloris albicollis', inat: 29942811 }
    ],
    busca: 'Trochilidae', wiki: 'Beija-flor',
    resumo: 'A ave que voa parada no ar.',
    rapido: { tamanho: '6 a 20 cm', onde: 'Américas', come: 'Néctar' },
    comp: { mm: 100, tam: '6 a 20 cm', igual: 'uma caneta', dieta: 'nectar', come: 'Néctar das flores e insetos bem pequenos.', vive: 'De 3 a 5 anos', social: 'Sozinho (e briga pela sua flor!)', casa: 'Ninho do tamanho de meia casca de ovo', tax: ['Chordata', 'Aves', 'Apodiformes', 'Trochilidae'], iucn: null },
    ficha: [
      ['🔬', 'Nome científico', 'Família Trochilidae. São mais de 300 espécies, quase 90 no Brasil.'],
      ['🧬', 'Classificação', 'Ave · Família Trochilidae'],
      ['📍', 'Onde vive', 'Só nas Américas, do Alasca à Terra do Fogo.'],
      ['🍽️', 'O que come', 'Néctar das flores, com uma língua comprida. Para crescer, come mosquinhas.'],
      ['🪽', 'Voo', 'Bate as asas tão rápido que fica parado no ar e voa até de ré.'],
      ['🌸', 'Importância', 'Leva pólen de flor em flor: é polinizador, como a abelha.']
    ],
    ciclo: [
      ['🥚', 'Ovo', 'A mãe bota 2 ovos do tamanho de um feijão.'],
      ['🐣', 'Filhote', 'Nasce sem penas e a mãe dá néctar e insetos no bico.'],
      ['🐦', 'Adulto', 'Com umas 3 semanas, sai do ninho e já voa.']
    ],
    curiosidades: [
      'O coração pode bater mais de 1.000 vezes por minuto quando ele voa.',
      'O menor beija-flor do mundo, de Cuba, pesa menos que uma moeda.'
    ]
  },
  {
    id: 'arara', nome: 'Arara-azul', cientifico: 'Anodorhynchus hyacinthinus', grupo: 'aves', emoji: '🦜', cor: '#cfe3ff', pagina: null,
    curto: 'arara-azul', pista: 'Sou azul, grande e tenho um bico fortíssimo.', procurar: 'Pantanal e Cerrado, em palmeiras.',
    fotos: [
      { arquivo: 'img/animais/arara-1.jpg', autor: 'Larissa Vaccarini Ávila', lic: 'CC BY', especie: 'Anodorhynchus hyacinthinus', inat: 86007053 },
      { arquivo: 'img/animais/arara-2.jpg', autor: 'Larissa Vaccarini Ávila', lic: 'CC BY', especie: 'Anodorhynchus hyacinthinus', inat: 86006999 },
      { arquivo: 'img/animais/arara-3.jpg', autor: 'Bruce Kirchoff', lic: 'CC BY', especie: 'Anodorhynchus hyacinthinus', inat: 28266959 }
    ],
    busca: 'Anodorhynchus hyacinthinus', wiki: 'Arara-azul-grande',
    resumo: 'A maior arara do mundo, do Pantanal.',
    rapido: { tamanho: 'até 1 m', onde: 'Brasil', come: 'Coquinhos' },
    comp: { mm: 1000, tam: 'até 1 metro, com a cauda', igual: 'uma criança de 3 anos em pé', dieta: 'sementes', come: 'Coquinhos de palmeiras, como acuri e bocaiúva.', vive: 'Mais de 50 anos', social: 'Casais para a vida toda, em bandos', casa: 'Ocos de árvores grandes', tax: ['Chordata', 'Aves', 'Psittaciformes', 'Psittacidae'], iucn: 'VU' },
    ficha: [
      ['🔬', 'Nome científico', 'Anodorhynchus hyacinthinus (arara-azul-grande).'],
      ['🧬', 'Classificação', 'Ave · Ordem Psittaciformes (papagaios) · Família Psittacidae'],
      ['📍', 'Onde vive', 'Pantanal, Cerrado e partes da Amazônia.'],
      ['🍽️', 'O que come', 'Coquinhos durinhos de palmeiras. O bico quebra o que um martelo quebraria.'],
      ['🛡️', 'Situação', 'Vulnerável: quase sumiu por causa do tráfico e do desmatamento. Projetos de proteção ajudam.'],
      ['⏳', 'Quanto vive', 'Mais de 50 anos.']
    ],
    ciclo: [
      ['🥚', 'Ovo', 'Bota 1 ou 2 ovos num oco de árvore.'],
      ['🐣', 'Filhote', 'Pai e mãe cuidam juntos por meses.'],
      ['🦜', 'Adulta', 'Só começa a ter filhotes com uns 7 anos.']
    ],
    curiosidades: [
      'Ela tem uma "argolinha" amarela em volta do olho e na base do bico.',
      'Muitas vezes come os coquinhos que o gado já engoliu e deixou no chão!'
    ]
  },
  {
    id: 'onca', nome: 'Onça-pintada', cientifico: 'Panthera onca', grupo: 'mamiferos', emoji: '🐆', cor: '#ffe2b8', pagina: null,
    curto: 'onça', pista: 'Sou um gato enorme e pintado que adora nadar.', procurar: 'Só de longe: zoológicos e documentários!',
    fotos: [
      { arquivo: 'img/animais/onca-1.jpg', autor: 'Paul Prior', lic: 'CC BY', especie: 'Panthera onca', inat: 53399436 },
      { arquivo: 'img/animais/onca-2.jpg', autor: 'Millie Basden', lic: 'CC BY', especie: 'Panthera onca', inat: 48863325 },
      { arquivo: 'img/animais/onca-3.jpg', autor: 'Millie Basden', lic: 'CC BY', especie: 'Panthera onca', inat: 48878839 }
    ],
    busca: 'Panthera onca', wiki: 'Onça-pintada',
    resumo: 'O maior felino das Américas.',
    rapido: { tamanho: '1,1 a 1,8 m', onde: 'Américas', come: 'Carne' },
    comp: { mm: 1500, tam: '1,1 a 1,8 m, sem contar a cauda', igual: 'um adulto deitado', dieta: 'carnivoro', come: 'Capivaras, porcos-do-mato, jacarés, peixes e outros animais.', vive: '12 a 15 anos na natureza', social: 'Sozinha', casa: 'Matas, Pantanal e beiras de rio', tax: ['Chordata', 'Mammalia', 'Carnivora', 'Felidae'], iucn: 'NT' },
    ficha: [
      ['🔬', 'Nome científico', 'Panthera onca, prima do leão e do tigre.'],
      ['🧬', 'Classificação', 'Mamífero · Ordem Carnivora · Família Felidae (gatos)'],
      ['📍', 'Onde vive', 'Do México à Argentina. No Brasil, na Amazônia e no Pantanal principalmente.'],
      ['🍽️', 'O que come', 'Carne. Tem a mordida mais forte de todos os gatos.'],
      ['🏊', 'Nadadora', 'Ao contrário de muitos gatos, adora água e nada muito bem.'],
      ['🛡️', 'Situação', 'Quase ameaçada: precisa de florestas grandes para viver.']
    ],
    ciclo: [
      ['🐾', 'Filhote', 'Nascem 1 a 4 filhotes, de olhos fechados.'],
      ['🐆', 'Jovem', 'Fica com a mãe uns 2 anos aprendendo a caçar.'],
      ['👑', 'Adulta', 'Vive sozinha num território grande.']
    ],
    curiosidades: [
      'Cada onça tem pintas diferentes, como as nossas impressões digitais.',
      'Existe onça toda preta: é a mesma espécie, e as pintas aparecem no sol.'
    ]
  },
  {
    id: 'preguica', art: 'o', nome: 'Bicho-preguiça', cientifico: 'Bradypus variegatus', grupo: 'mamiferos', emoji: '🦥', cor: '#e6dccb', pagina: null,
    curto: 'preguiça', pista: 'Vivo pendurada nas árvores, bem devagar.', procurar: 'Copa das árvores, em parques com mata.',
    fotos: [
      { arquivo: 'img/animais/preguica-1.jpg', autor: 'Diogo Luiz', lic: 'CC BY-SA', especie: 'Bradypus variegatus', inat: 64066090 },
      { arquivo: 'img/animais/preguica-2.jpg', autor: 'yvesbas', lic: 'CC BY', especie: 'Bradypus variegatus', inat: 69722725 },
      { arquivo: 'img/animais/preguica-3.jpg', autor: 'Karen & Mike', lic: 'CC BY', especie: 'Bradypus variegatus', inat: 31705616 }
    ],
    busca: 'Bradypus variegatus', wiki: 'Bradypus variegatus',
    resumo: 'Vive pendurado nas árvores, bem devagar.',
    rapido: { tamanho: '40 a 80 cm', onde: 'América do Sul', come: 'Folhas' },
    comp: { mm: 600, tam: '40 a 80 cm', igual: 'um travesseiro', dieta: 'herbivoro', come: 'Folhas, principalmente de embaúba.', vive: 'Cerca de 20 a 30 anos', social: 'Sozinho', casa: 'Copa das árvores', tax: ['Chordata', 'Mammalia', 'Pilosa', 'Bradypodidae'], iucn: 'LC' },
    ficha: [
      ['🔬', 'Nome científico', 'Bradypus variegatus (preguiça-comum, de três dedos).'],
      ['🧬', 'Classificação', 'Mamífero · Ordem Pilosa (com os tamanduás) · Família Bradypodidae'],
      ['📍', 'Onde vive', 'Florestas da América Central e do Sul, inclusive Amazônia e Mata Atlântica.'],
      ['🍽️', 'O que come', 'Folhas. Digere tão devagar que uma refeição leva semanas.'],
      ['🐢', 'Devagar', 'Gasta pouquíssima energia: se move devagar e dorme muitas horas.'],
      ['🌿', 'Pelo verde', 'Algas crescem no pelo e ajudam a esconder a preguiça nas folhas.']
    ],
    ciclo: [
      ['🐾', 'Filhote', 'Nasce um filhote, que fica agarrado na barriga da mãe.'],
      ['🦥', 'Jovem', 'Com uns 6 meses, já se vira sozinho na árvore.'],
      ['🌳', 'Adulto', 'Passa quase a vida toda pendurado.']
    ],
    curiosidades: [
      'Desce da árvore mais ou menos uma vez por semana só para fazer cocô.',
      'É lenta na árvore, mas nada muito bem!'
    ]
  },
  {
    id: 'tartaruga', nome: 'Tartaruga-verde', cientifico: 'Chelonia mydas', grupo: 'repteis', emoji: '🐢', cor: '#d3efe0', pagina: null,
    silencio: 'Tartarugas quase não fazem som que a gente escute. Elas não têm cordas vocais.',
    curto: 'tartaruga', pista: 'Nado no mar e carrego minha casa nas costas.', procurar: 'Praias e aquários.',
    fotos: [
      { arquivo: 'img/animais/tartaruga-1.jpg', autor: 'Dan Schofield', lic: 'CC BY', especie: 'Chelonia mydas', inat: 52560925 },
      { arquivo: 'img/animais/tartaruga-2.jpg', autor: 'Kyle Van Houtan', lic: 'CC BY', especie: 'Chelonia mydas', inat: 380377 },
      { arquivo: 'img/animais/tartaruga-3.jpg', autor: 'Richard Fuller', lic: 'CC0', especie: 'Chelonia mydas', inat: 67882443 }
    ],
    busca: 'Chelonia mydas', wiki: 'Tartaruga-verde',
    resumo: 'Atravessa oceanos e volta à praia onde nasceu.',
    rapido: { tamanho: 'casco de 1 m', onde: 'Oceanos', come: 'Algas' },
    comp: { mm: 1000, tam: 'casco de até 1,2 m', igual: 'uma mesa pequena', dieta: 'herbivoro', come: 'Algas e capim marinho (os filhotes comem também bichinhos).', vive: 'Mais de 60 anos', social: 'Sozinha', casa: 'Mares quentes do mundo todo', tax: ['Chordata', 'Reptilia', 'Testudines', 'Cheloniidae'], iucn: 'EN' },
    ficha: [
      ['🔬', 'Nome científico', 'Chelonia mydas.'],
      ['🧬', 'Classificação', 'Réptil · Ordem Testudines (tartarugas) · Família Cheloniidae'],
      ['📍', 'Onde vive', 'Mares quentes do planeta. No Brasil desova em ilhas como Trindade e Fernando de Noronha.'],
      ['🍽️', 'O que come', 'Algas e capim marinho. A gordura fica esverdeada: daí o nome.'],
      ['🛡️', 'Situação', 'Em perigo: lixo plástico, redes de pesca e praias iluminadas atrapalham.'],
      ['⏳', 'Quanto vive', 'Mais de 60 anos.']
    ],
    ciclo: [
      ['🥚', 'Ovo', 'A mãe cava um buraco na areia e bota mais de 100 ovos.'],
      ['🐢', 'Filhote', 'Nasce à noite e corre para o mar seguindo o brilho da água.'],
      ['🌊', 'Adulta', 'Depois de 20 a 30 anos volta à praia onde nasceu para botar ovos.']
    ],
    curiosidades: [
      'O calor da areia decide se o filhote vai ser macho ou fêmea.',
      'Ela não consegue esconder a cabeça dentro do casco.'
    ]
  },
  {
    id: 'sapo', art: 'o', nome: 'Sapo-cururu', cientifico: 'Rhinella diptycha', grupo: 'anfibios', emoji: '🐸', cor: '#dcefc6', pagina: null,
    curto: 'sapo', pista: 'Comecei a vida como girino na água.', procurar: 'Quintais e beiras de lagoa, à noite.',
    fotos: [
      { arquivo: 'img/animais/sapo-1.jpg', autor: 'Pablo H Capovilla', lic: 'CC BY-SA', especie: 'Rhinella diptycha', inat: 68986425 },
      { arquivo: 'img/animais/sapo-2.jpg', autor: 'Leonel Roget', lic: 'CC BY', especie: 'Rhinella diptycha', inat: 7334047 },
      { arquivo: 'img/animais/sapo-3.jpg', autor: 'Douglas', lic: 'CC BY', especie: 'Rhinella diptycha', inat: 27320409 }
    ],
    busca: 'Rhinella diptycha', wiki: 'Sapo-cururu',
    resumo: 'Começa a vida como girino na água.',
    rapido: { tamanho: 'até 20 cm', onde: 'América do Sul', come: 'Insetos' },
    comp: { mm: 150, tam: '10 a 20 cm', igual: 'um celular', dieta: 'carnivoro', come: 'Insetos, besouros, minhocas e outros bichinhos.', vive: 'Cerca de 10 anos', social: 'Sozinho (juntam-se para cantar na chuva)', casa: 'Quintais, campos e beiras de lagoa', tax: ['Chordata', 'Amphibia', 'Anura', 'Bufonidae'], iucn: 'LC' },
    ficha: [
      ['🔬', 'Nome científico', 'Rhinella diptycha (antes chamado Rhinella schneideri).'],
      ['🧬', 'Classificação', 'Anfíbio · Ordem Anura (sapos, rãs e pererecas) · Família Bufonidae'],
      ['📍', 'Onde vive', 'Brasil, Paraguai, Bolívia e Argentina. Aparece muito nos quintais à noite.'],
      ['🍽️', 'O que come', 'Insetos, que pega com uma língua grudenta.'],
      ['⚠️', 'Cuidado', 'Atrás dos olhos tem glândulas com um líquido que faz mal a cachorros. Olhe, mas não pegue.'],
      ['🌱', 'Importância', 'Come muitos insetos, até baratas e mosquitos.']
    ],
    ciclo: [
      ['🥚', 'Ovos', 'Milhares de ovos em cordões de gelatina na água.'],
      ['〰️', 'Girino', 'Vive na água, respira com brânquias e tem cauda.'],
      ['🦵', 'Pernas', 'Crescem as pernas e a cauda vai sumindo.'],
      ['🐸', 'Sapo', 'Sai da água e passa a respirar com pulmões e pela pele.']
    ],
    curiosidades: [
      'Sapo bebe água pela pele da barriga, não pela boca.',
      'Ele engole com a ajuda dos olhos: eles afundam e empurram a comida.'
    ]
  },
  {
    id: 'pirarucu', art: 'o', nome: 'Pirarucu', cientifico: 'Arapaima gigas', grupo: 'peixes', emoji: '🐟', cor: '#d6e9f3', pagina: null,
    silencio: 'Fora da água a gente não escuta os peixes. Mas dá para ouvir o pirarucu respirando quando ele sobe à superfície!',
    curto: 'pirarucu', pista: 'Sou um peixe gigante que sobe para respirar ar.', procurar: 'Aquários grandes e rios da Amazônia.',
    fotos: [
      { arquivo: 'img/animais/pirarucu-1.jpg', autor: 'Vince Smith', lic: 'CC BY', especie: 'Arapaima gigas', inat: 83994048 },
      { arquivo: 'img/animais/pirarucu-2.jpg', autor: 'Vince Smith', lic: 'CC BY', especie: 'Arapaima gigas', inat: 83953168 }
    ],
    busca: 'Arapaima gigas', wiki: 'Pirarucu',
    resumo: 'Um dos maiores peixes de água doce, da Amazônia.',
    rapido: { tamanho: 'até 3 m', onde: 'Amazônia', come: 'Peixes' },
    comp: { mm: 2500, tam: '2 a 3 m', igual: 'uma cama de casal no comprimento', dieta: 'carnivoro', come: 'Outros peixes.', vive: 'Cerca de 15 a 20 anos', social: 'Pai cuida dos filhotes', casa: 'Lagos e rios da Amazônia', tax: ['Chordata', 'Actinopterygii', 'Osteoglossiformes', 'Arapaimidae'], iucn: null },
    ficha: [
      ['🔬', 'Nome científico', 'Arapaima gigas.'],
      ['🧬', 'Classificação', 'Peixe ósseo · Ordem Osteoglossiformes · Família Arapaimidae'],
      ['📍', 'Onde vive', 'Lagos e rios calmos da bacia Amazônica.'],
      ['🍽️', 'O que come', 'Outros peixes.'],
      ['🫁', 'Respira ar', 'Precisa subir à superfície a cada 10 a 20 minutos para respirar.'],
      ['🛡️', 'Proteção', 'Quase sumiu de tanto ser pescado. O manejo feito pelas comunidades fez ele voltar.']
    ],
    ciclo: [
      ['🥚', 'Ovos', 'O casal faz um ninho no fundo, na areia.'],
      ['🐟', 'Filhotes', 'Nadam juntinhos em volta da cabeça do pai, que os protege.'],
      ['🐋', 'Adulto', 'Cresce muito rápido e pode passar de 2 metros.']
    ],
    curiosidades: [
      'As escamas são tão duras que são usadas como lixa de unha.',
      '"Pirarucu" vem do tupi e quer dizer "peixe vermelho", pela cor da cauda.'
    ]
  },
  {
    id: 'cigarra', nome: 'Cigarra-gigante', cientifico: 'Quesada gigas', grupo: 'insetos', tipo: 'cigarra', emoji: '🦗', cor: '#d9e8c4',
    curto: 'cigarra', pista: 'No verão eu canto tão alto que dá para ouvir de longe.', procurar: 'Troncos de árvores no verão, e a casquinha que eu deixo grudada neles.',
    pagina: 'bicho3d.html?id=cigarra', porDentro: true,
    resumo: 'A cantora do verão, que passa anos crescendo debaixo da terra.',
    fotos: [
      { arquivo: 'img/animais/cigarra-1.jpg', autor: 'deboas', lic: 'CC BY', especie: 'Quesada gigas', inat: 57045694 },
      { arquivo: 'img/animais/cigarra-2.jpg', autor: 'Jorge Armín Escalante Pasos', lic: 'CC BY', especie: 'Quesada gigas', inat: 28089419 },
      { arquivo: 'img/animais/cigarra-3.jpg', autor: 'deboas', lic: 'CC BY', especie: 'Quesada gigas', inat: 9901553 }
    ],
    busca: 'Quesada gigas', wiki: 'Quesada gigas',
    destaques: ['🦗 adulta', '🐛 ninfa', '🤎 casca (exúvia)', '🎵 canto'],
    rapido: { tamanho: '6 a 7 cm', onde: 'Américas', come: 'Seiva' },
    comp: { mm: 65, tam: '6 a 7 cm (com as asas)', igual: 'um dedo de adulto', dieta: 'seiva', come: 'Seiva das árvores, que ela suga com um bico fino.', vive: 'Vários anos como ninfa; poucas semanas como adulta', social: 'Sozinha (os machos cantam em coro)', casa: 'Árvores; a ninfa vive debaixo da terra', tax: ['Arthropoda', 'Insecta', 'Hemiptera', 'Cicadidae'], iucn: null },
    ficha: [
      ['🔬', 'Nome científico', 'Quesada gigas, uma das maiores cigarras do Brasil. Existem milhares de espécies de cigarras.'],
      ['🧬', 'Classificação', 'Inseto · Ordem Hemiptera (percevejos e cigarras) · Família Cicadidae'],
      ['📍', 'Onde vive', 'Do sul dos Estados Unidos à Argentina. No Brasil, em cidades, matas e plantações.'],
      ['🍽️', 'O que come', 'Seiva das plantas. A ninfa suga as raízes; a adulta, os galhos e troncos.'],
      ['🎵', 'O canto', 'Só os machos cantam, para chamar as fêmeas. O som sai de duas "membranas-tambor" (tímbalos) na barriga.'],
      ['⏳', 'Quanto vive', 'Passa anos debaixo da terra como ninfa. Depois de adulta, vive só algumas semanas.']
    ],
    ciclo: [
      ['🥚', 'Ovo', 'A mãe bota os ovos dentro de galhos finos.'],
      ['🐛', 'Ninfa', 'Cai no chão, cava um túnel e passa anos sugando a seiva das raízes.'],
      ['🧗', 'Subida', 'Numa noite quente, sobe pelo tronco de uma árvore.'],
      ['🤎', 'Troca de pele', 'A pele das costas se abre e sai a adulta. A casca (exúvia) fica grudada no tronco.'],
      ['🦗', 'Adulta', 'Canta, encontra um par e bota ovos. Vive poucas semanas.']
    ],
    curiosidades: [
      'A cigarra não "estoura" de tanto cantar! A casquinha que você acha na árvore é a pele velha que ela trocou.',
      'O canto de algumas cigarras é tão alto quanto um liquidificador.',
      'Cigarras não picam nem mordem: são inofensivas para as pessoas.'
    ]
  },
  {
    id: 'aranha', nome: 'Aranha-de-teia-dourada', cientifico: 'Trichonephila clavipes', grupo: 'aracnideos', tipo: 'aranha', emoji: '🕷️', cor: '#f2e3b8',
    curto: 'aranha', pista: 'Faço uma teia enorme que brilha como ouro no sol.', procurar: 'Entre árvores e arbustos, em matas, parques e quintais.',
    pagina: 'bicho3d.html?id=aranha',
    resumo: 'A tecelã da teia dourada, gigante e brilhante.',
    fotos: [
      { arquivo: 'img/animais/aranha-1.jpg', autor: 'yvesbas', lic: 'CC BY', especie: 'Trichonephila clavipes', inat: 58647311 },
      { arquivo: 'img/animais/aranha-2.jpg', autor: 'akt2', lic: 'CC BY', especie: 'Trichonephila clavipes', inat: 49938905 },
      { arquivo: 'img/animais/aranha-3.jpg', autor: 'alessandradalia', lic: 'CC BY-SA', especie: 'Trichonephila clavipes', inat: 30837400 }
    ],
    busca: 'Trichonephila clavipes', wiki: 'Trichonephila clavipes',
    destaques: ['🕷️ fêmea', '🔍 macho pequenininho', '🕸️ teia dourada', '🧵 desce no fio'],
    rapido: { tamanho: '2,5 a 4 cm', onde: 'Américas', come: 'Insetos' },
    comp: { mm: 30, tam: 'fêmea: 2,5 a 4 cm de corpo', igual: 'uma tampinha de garrafa', dieta: 'carnivoro', come: 'Insetos que ficam presos na teia.', vive: 'Cerca de 1 ano', social: 'Sozinha (o macho mora na teia da fêmea)', casa: 'Teia grande entre árvores', tax: ['Arthropoda', 'Arachnida', 'Araneae', 'Araneidae'], iucn: null },
    silencio: 'Aranhas não fazem som que a gente escute. Elas "ouvem" sentindo a teia tremer!',
    ficha: [
      ['🔬', 'Nome científico', 'Trichonephila clavipes (antes Nephila clavipes). Existem mais de 50 mil espécies de aranhas.'],
      ['🧬', 'Classificação', 'Aracnídeo (não é inseto!) · Ordem Araneae (aranhas) · Família Araneidae'],
      ['📍', 'Onde vive', 'Do sul dos Estados Unidos à Argentina. Muito comum no Brasil, em matas, parques e quintais.'],
      ['🍽️', 'O que come', 'Insetos que ficam presos na teia, como moscas, besouros e mariposas.'],
      ['🕸️', 'A teia', 'A seda é amarela e brilha como ouro. A teia pode ter mais de 1 metro.'],
      ['🛡️', 'É perigosa?', 'Não para pessoas. Mesmo assim, observe sem tocar.']
    ],
    ciclo: [
      ['🥚', 'Ovos', 'A mãe guarda centenas de ovos num saquinho de seda.'],
      ['🕷️', 'Filhotes', 'Nascem miniaturas de aranha, que soltam um fio e voam com o vento.'],
      ['🔄', 'Crescimento', 'Trocam de pele várias vezes enquanto crescem.'],
      ['🕸️', 'Adulta', 'A fêmea fica grande e faz a teia dourada. O macho é bem pequeno.']
    ],
    curiosidades: [
      'O macho é tão pequeno que parece um filhote perto da fêmea: ela pode ser 100 vezes mais pesada.',
      'Aranha não é inseto: tem 8 patas, e os insetos têm 6.',
      'A seda de aranha é mais resistente que um fio de aço da mesma grossura.'
    ]
  }
];

// rótulos usados pela ficha e pelo comparador
const DIETAS = {
  fungo: ['🍄', 'Come fungo'], nectar: ['🌸', 'Come néctar'], frutas: ['🍎', 'Come frutas'],
  carnivoro: ['🥩', 'Carnívoro'], herbivoro: ['🌿', 'Herbívoro'], sementes: ['🌰', 'Come cocos e sementes'], seiva: ['🌳', 'Bebe seiva']
};
const NIVEIS_TAX = ['Filo', 'Classe', 'Ordem', 'Família'];
const NOMES_TAX = {
  Arthropoda: 'Artrópodes (esqueleto por fora)', Chordata: 'Cordados (ossos por dentro)',
  Insecta: 'Insetos', Arachnida: 'Aracnídeos', Aves: 'Aves', Mammalia: 'Mamíferos', Reptilia: 'Répteis', Amphibia: 'Anfíbios', Actinopterygii: 'Peixes ósseos'
};
const IUCN = {
  LC: ['🟢', 'Pouco preocupante'], NT: ['🟡', 'Quase ameaçada'], VU: ['🟠', 'Vulnerável'],
  EN: ['🔴', 'Em perigo'], CR: ['🔴', 'Criticamente em perigo']
};

// missões: encontrar bichos no mundo real (marcados na ficha com "Eu vi um bicho assim de verdade!")
const MISSOES = [
  {
    id: 'jardim', nome: 'Pequenos do jardim', selo: 'Explorador do Jardim',
    texto: 'Procure perto de casa ou da escola. Viu um de verdade? Toque em "encontrei!".',
    bichos: [['formiga', 'uma formiga'], ['abelha', 'uma abelha'], ['joaninha', 'uma joaninha'], ['borboleta', 'uma borboleta'], ['aranha', 'uma aranha'], ['cigarra', 'uma cigarra']]
  }
];

// tipos: agrupam várias espécies (cada espécie tem ficha, fotos e carta próprias)
const TIPOS = {
  aranha: { nome: 'Aranhas', emoji: '🕷️' },
  cigarra: { nome: 'Cigarras', emoji: '🦗' }
};

// coleções do Meu Bolso (completar uma coleção ganha um selo)
const COLECOES = [
  { id: 'jardim', nome: 'Bichos do jardim', emoji: '🌻', selo: 'Explorador do Jardim', bichos: ['formiga', 'abelha', 'joaninha', 'borboleta', 'beijaflor', 'cigarra', 'aranha', 'sapo'] },
  { id: 'cantores', nome: 'Bichos que cantam', emoji: '🎵', selo: 'Ouvido de Explorador', bichos: ['cigarra', 'sapo', 'beijaflor', 'arara'] },
  { id: 'agua', nome: 'Vida na água', emoji: '🌊', selo: 'Explorador Aquático', bichos: ['tartaruga', 'pirarucu', 'sapo'] },
  { id: 'gigantes', nome: 'Gigantes do Brasil', emoji: '🦖', selo: 'Caçador de Gigantes', bichos: ['onca', 'arara', 'tartaruga', 'pirarucu', 'preguica'] },
  { id: 'pequenos', nome: 'Pequenos gigantes', emoji: '🔍', selo: 'Olho de Lupa', bichos: ['formiga', 'abelha', 'joaninha', 'cigarra', 'aranha'] }
];
