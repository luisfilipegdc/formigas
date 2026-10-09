/* =====================================================================
   cientista.js — textos do nível 🔬 Cientista (anos finais, 11+) para as fichas

   Para cada animal (mesmo id de catalogo.js):
     ficha  → linhas extras da aba "Ficha" (ícone, título, texto), num quadro "Para cientistas"
     ciclo  → etapas da aba "Vida" com termos técnicos (substituem as do catálogo)
     sabia  → curiosidades técnicas (aparecem antes das do catálogo)
   O nível é o mesmo do 3D (localStorage 'bnb-idade' = 'cientista').
   CONTEÚDO EM REVISÃO CIENTÍFICA: conferir com especialista antes de tirar o aviso.
   ===================================================================== */
const CIENTISTA = {
  formiga: {
    ficha: [
      ['🧬', 'Táxon', 'Gênero Atta, tribo Attini. Espécie eussocial: tem castas, gerações que vivem juntas e cuidado cooperativo da prole.'],
      ['🍄', 'Mutualismo', 'Agricultura de fungo: as operárias cultivam Leucoagaricus gongylophorus sobre folhas picadas. O fungo digere a celulose e produz gongilídios, que alimentam a colônia.'],
      ['🧪', 'Comunicação', 'Química, por feromônios: de trilha, de alarme e de reconhecimento da colônia (pelo cheiro da cutícula).'],
      ['📐', 'Polimorfismo', 'As operárias variam muito de tamanho, e o tamanho se relaciona com a tarefa: jardineiras pequenas, cortadeiras médias e soldados grandes.'],
      ['🌍', 'Ecologia', 'Estão entre os principais herbívoros das Américas e movem muito solo e nutrientes. Na agricultura, são consideradas pragas.']
    ],
    ciclo: [
      ['🥚', 'Ovo', 'Ovo fertilizado vira fêmea; ovo não fertilizado vira macho. Esse sistema se chama haplodiploidia.'],
      ['🐛', 'Larva', 'Ápoda (sem pernas). Come gongilídios do fungo e cresce trocando de pele (muda).'],
      ['🤍', 'Pupa', 'Sem casulo. O corpo é reorganizado em corpo de adulto: metamorfose completa (holometabolia).'],
      ['🐜', 'Adulta', 'A casta (operária ou rainha) é influenciada pela alimentação que a larva recebeu.'],
      ['🪽', 'Voo nupcial', 'Içás e bitus acasalam no ar. A rainha guarda o esperma na espermateca e leva um pedaço do fungo na bolsa infrabucal para fundar a colônia.']
    ],
    sabia: [
      'A colônia de saúva tem uma só rainha e dura enquanto ela viver, o que pode passar de 10 anos.',
      'O formigueiro tem ventilação passiva: o vento na superfície ajuda a puxar o ar com gás carbônico para fora pelos olheiros.'
    ]
  },
  abelha: {
    ficha: [
      ['🧬', 'Táxon', 'Apis mellifera, família Apidae. Espécie eussocial, criada pelas pessoas para produção de mel e polinização.'],
      ['🌸', 'Polinização', 'Ao coletar néctar e pólen, leva pólen de uma flor a outra e participa da reprodução de muitas plantas cultivadas.'],
      ['🧪', 'Comunicação', 'Feromônios (da rainha, de alarme e de orientação) e a dança do requebrado, que informa direção e distância das flores.'],
      ['🔀', 'Polietismo etário', 'A operária muda de tarefa com a idade: limpa alvéolos, alimenta larvas, constrói favos, guarda a entrada e, por último, coleta.'],
      ['🇧🇷', 'No Brasil', 'A maioria das Apis do Brasil é africanizada: um híbrido de raças europeias e africanas, que se espalhou a partir dos anos 1950.']
    ],
    ciclo: [
      ['🥚', 'Ovo · 3 dias', 'Fertilizado → fêmea (operária ou rainha); não fertilizado → zangão (haplodiploidia).'],
      ['🐛', 'Larva · ~6 dias', 'Todas recebem geleia real no início. As futuras operárias passam depois a uma mistura com pólen e mel; a futura rainha continua com geleia real.'],
      ['🟫', 'Pupa', 'O alvéolo é operculado, a larva tece um casulo e ocorre a metamorfose completa.'],
      ['🐝', 'Adulta', 'Da postura ao nascimento: cerca de 21 dias na operária, 16 na rainha e 24 no zangão.'],
      ['🌼', 'Campeira', 'Nas últimas semanas de vida, a operária vira campeira e coleta néctar, pólen, água e resina.']
    ],
    sabia: [
      'Rainha e operária têm os mesmos genes: a diferença vem da alimentação da larva.',
      'A área de cria fica perto de 35 °C. No frio, as operárias vibram os músculos do voo para produzir calor.'
    ]
  },
  borboleta: {
    ficha: [
      ['🧬', 'Táxon', 'Morpho helenor, família Nymphalidae, ordem Lepidoptera, que quer dizer "asas com escamas".'],
      ['💠', 'Cor estrutural', 'O azul não vem de pigmento. As escamas têm nanoestruturas que refletem a luz azul por interferência.'],
      ['👅', 'Probóscide', 'Aparelho bucal sugador, enrolado em espiral, que se estende para sugar líquidos como o suco de frutas fermentadas.'],
      ['🎭', 'Defesa', 'O lado de baixo das asas é marrom e tem ocelos, manchas em forma de olho. Pousada de asas fechadas, ela some no meio das folhas.']
    ],
    ciclo: [
      ['🥚', 'Ovo', 'Posto na planta que vai alimentar a lagarta (planta hospedeira).'],
      ['🐛', 'Lagarta', 'É a larva. Tem mandíbulas mastigadoras e cresce trocando de pele (muda).'],
      ['🟢', 'Crisálida', 'É a pupa. Os tecidos da larva são desmontados e remontados em corpo de adulto: metamorfose completa.'],
      ['🦋', 'Imago', 'O adulto sai e bombeia hemolinfa nas nervuras para esticar as asas antes do primeiro voo.']
    ],
    sabia: [
      'Como o azul é estrutural, ele muda de tom conforme o ângulo de quem olha: isso se chama iridescência.',
      'Muitas borboletas sentem o gosto das plantas com receptores nas patas.'
    ]
  },
  joaninha: {
    ficha: [
      ['🧬', 'Táxon', 'Família Coccinellidae, ordem Coleoptera, a dos besouros, o maior grupo de animais conhecido.'],
      ['🛡️', 'Élitros', 'O primeiro par de asas é duro e protege o segundo, membranoso, que é o usado no voo.'],
      ['🌿', 'Controle biológico', 'Larvas e adultos de muitas espécies comem pulgões e são usados na agricultura no lugar de inseticidas.'],
      ['⚠️', 'Aposematismo', 'As cores fortes avisam os predadores que ela tem gosto ruim. Ameaçada, solta um líquido amarelo e amargo pelas juntas das pernas.']
    ],
    ciclo: [
      ['🥚', 'Ovo', 'Postos em grupos, perto de colônias de pulgões.'],
      ['🐛', 'Larva', 'Predadora ativa. Cresce por mudas.'],
      ['🟠', 'Pupa', 'Fica presa numa folha: metamorfose completa.'],
      ['🐞', 'Adulta', 'Sai com os élitros claros, que ganham cor e pintas nas primeiras horas.']
    ],
    sabia: [
      'Nem toda joaninha come pulgão: algumas comem fungos e outras, plantas.',
      'A joaninha-asiática (Harmonia axyridis) é uma espécie invasora no Brasil e compete com as joaninhas nativas.'
    ]
  },
  beijaflor: {
    ficha: [
      ['🧬', 'Táxon', 'Família Trochilidae, ordem Apodiformes. Só existe nas Américas.'],
      ['🪽', 'Voo pairado', 'As asas giram no ombro e fazem força na ida e na volta, desenhando um "8" deitado. Assim ele para no ar e voa para trás.'],
      ['🔥', 'Metabolismo', 'Um dos mais altos entre os vertebrados. À noite pode entrar em torpor e baixar a temperatura do corpo para economizar energia.'],
      ['🌺', 'Coevolução', 'Muitas flores tubulares e vermelhas são polinizadas principalmente por beija-flores (ornitofilia).']
    ],
    ciclo: [
      ['🥚', 'Ovo', 'Em geral, 2 ovos, chocados só pela fêmea.'],
      ['🐣', 'Filhote', 'Altricial: nasce sem penas e de olhos fechados, e depende da mãe.'],
      ['🐦', 'Adulto', 'Deixa o ninho com poucas semanas e já voa.']
    ],
    sabia: [
      'Durante o voo, o coração pode passar de 1.000 batidas por minuto.',
      'O ninho é costurado com teia de aranha, que estica enquanto os filhotes crescem.'
    ]
  },
  arara: {
    ficha: [
      ['🧬', 'Táxon', 'Anodorhynchus hyacinthinus, família Psittacidae, ordem Psittaciformes.'],
      ['🥥', 'Bico', 'O mais forte entre os psitacídeos. Quebra o caroço duro de coquinhos de palmeiras, como acuri e bocaiúva.'],
      ['🦶', 'Pés zigodáctilos', 'Dois dedos para frente e dois para trás: seguram o alimento como uma mão.'],
      ['🛡️', 'Conservação', 'Vulnerável (IUCN). As ameaças são o tráfico de animais e a perda de árvores com ocos, como o manduvi no Pantanal.']
    ],
    ciclo: [
      ['🥚', 'Ovo', '1 ou 2 ovos num oco de árvore. A fêmea choca por cerca de um mês.'],
      ['🐣', 'Filhote', 'Altricial. O pai e a mãe o alimentam regurgitando comida por meses.'],
      ['🦜', 'Adulta', 'Fica madura com cerca de 7 anos. Os casais costumam ficar juntos por muitos anos.']
    ],
    sabia: [
      'Com ninhos artificiais e monitoramento no Pantanal, a população de araras-azuis cresceu nas últimas décadas.',
      'Ao carregar e derrubar coquinhos, a arara ajuda a espalhar as sementes das palmeiras.'
    ]
  },
  onca: {
    ficha: [
      ['🧬', 'Táxon', 'Panthera onca, família Felidae, ordem Carnivora. É o maior felino das Américas.'],
      ['🔝', 'Predador de topo', 'Controla as populações de presas, e isso afeta toda a cadeia alimentar.'],
      ['🦷', 'Mordida', 'Uma das mais fortes entre os felinos. Muitas vezes mata a presa mordendo o crânio, e não a garganta.'],
      ['🔍', 'Rosetas', 'O desenho das manchas é único em cada onça. Pesquisadores usam isso para identificá-las em fotos de armadilhas fotográficas.'],
      ['⚫', 'Melanismo', 'A onça-preta é da mesma espécie. As rosetas continuam lá e aparecem contra a luz.']
    ],
    ciclo: [
      ['🐾', 'Filhote', 'Depois de cerca de 3 meses de gestação, nascem 1 a 4 filhotes de olhos fechados.'],
      ['🐆', 'Jovem', 'Fica com a mãe cerca de 2 anos, aprendendo a caçar.'],
      ['👑', 'Adulta', 'Solitária e territorial. Marca o território com urina e arranhões.']
    ],
    sabia: [
      'Diferente da maioria dos felinos, a onça nada bem e caça na água, até jacarés.',
      'Está classificada como Quase Ameaçada (IUCN), por perda de habitat e conflito com criadores de gado.'
    ]
  },
  preguica: {
    ficha: [
      ['🧬', 'Táxon', 'Bradypus variegatus, família Bradypodidae, ordem Pilosa, a mesma dos tamanduás.'],
      ['🐢', 'Metabolismo', 'Muito baixo, e a temperatura do corpo varia com o ambiente. Por isso ela se move devagar e economiza energia.'],
      ['🍃', 'Digestão', 'Come folhas, que dão pouca energia. A digestão é lenta, num estômago com várias câmaras e bactérias que ajudam a quebrar as folhas.'],
      ['🟩', 'Pelos com algas', 'Os pelos têm sulcos onde crescem algas, que deixam a pelagem esverdeada e ajudam na camuflagem.']
    ],
    ciclo: [
      ['🐾', 'Filhote', 'Um por gestação. Fica agarrado à mãe e aprende com ela quais folhas comer.'],
      ['🦥', 'Jovem', 'Com alguns meses, começa a se virar sozinho na copa.'],
      ['🌳', 'Adulto', 'Vive na copa e desce cerca de uma vez por semana para defecar no chão.']
    ],
    sabia: [
      'As preguiças-de-três-dedos têm mais vértebras no pescoço que a maioria dos mamíferos e giram a cabeça cerca de 270°.',
      'Apesar de lentas na árvore, nadam bem.'
    ]
  },
  tartaruga: {
    ficha: [
      ['🧬', 'Táxon', 'Chelonia mydas, família Cheloniidae, ordem Testudines, classe Reptilia.'],
      ['🌿', 'Dieta', 'Adulta, é herbívora: come algas e capim-marinho. O nome "verde" vem da cor da gordura, não do casco.'],
      ['🧂', 'Glândulas de sal', 'Perto dos olhos, eliminam o excesso de sal da água do mar. Parecem lágrimas.'],
      ['🌡️', 'Sexo pela temperatura', 'A temperatura da areia define o sexo dos filhotes: ninhos mais quentes produzem mais fêmeas.'],
      ['🧭', 'Migração', 'As fêmeas voltam para desovar na região onde nasceram, orientando-se em parte pelo campo magnético da Terra.']
    ],
    ciclo: [
      ['🥚', 'Ovo', 'Incubado pelo calor da areia por cerca de 2 meses.'],
      ['🐢', 'Filhote', 'Sai à noite e vai para o mar guiado pelo brilho do horizonte.'],
      ['🌊', 'Adulta', 'Fica madura depois de 20 a 30 anos ou mais, e então migra para desovar.']
    ],
    sabia: [
      'Luzes artificiais perto da praia confundem os filhotes, que podem ir para a cidade em vez do mar.',
      'Pode passar horas submersa descansando, com o coração batendo bem devagar.'
    ]
  },
  sapo: {
    ficha: [
      ['🧬', 'Táxon', 'Rhinella diptycha, família Bufonidae, ordem Anura, classe Amphibia.'],
      ['🧪', 'Glândulas paratoides', 'Atrás dos olhos, produzem uma secreção tóxica (bufotoxinas) que defende contra predadores. O sapo não "espirra" veneno: ela sai quando as glândulas são apertadas.'],
      ['🫁', 'Respiração cutânea', 'A pele fina e úmida também troca gases, além dos pulmões.'],
      ['🌡️', 'Ectotérmico', 'A temperatura do corpo depende do ambiente. É mais ativo em noites quentes e úmidas.'],
      ['📊', 'Bioindicador', 'Como a pele é permeável, os anfíbios são sensíveis à poluição e mostram a saúde do ambiente.']
    ],
    ciclo: [
      ['🥚', 'Ovos', 'Em cordões de gelatina na água. A fecundação é externa.'],
      ['〰️', 'Girino', 'Aquático, com brânquias e cauda. Raspa algas.'],
      ['🦵', 'Metamorfose', 'Controlada por hormônios da tireoide: crescem as pernas, a cauda é reabsorvida e os pulmões se desenvolvem.'],
      ['🐸', 'Adulto', 'Terrestre, carnívoro, com respiração pulmonar e pela pele.']
    ],
    sabia: [
      'O sapo troca de pele de tempos em tempos e muitas vezes come a pele velha.',
      'Os machos coaxam com um saco vocal na garganta, que funciona como amplificador.'
    ]
  },
  pirarucu: {
    ficha: [
      ['🧬', 'Táxon', 'Arapaima gigas, família Arapaimidae, ordem Osteoglossiformes. É um dos maiores peixes de água doce do mundo.'],
      ['🫁', 'Respiração aérea', 'Obrigatória: a bexiga natatória funciona como pulmão. Ele sobe à superfície para respirar a cada poucos minutos.'],
      ['🛡️', 'Escamas', 'Têm uma camada dura mineralizada sobre fibras de colágeno flexíveis e resistem à mordida das piranhas.'],
      ['♻️', 'Manejo sustentável', 'Em reservas como Mamirauá, comunidades contam os pirarucus quando sobem para respirar e definem cotas de pesca. As populações se recuperaram.']
    ],
    ciclo: [
      ['🥚', 'Ovos', 'Postos num ninho cavado no fundo, na época da cheia.'],
      ['🐟', 'Filhotes', 'Cuidado parental: os filhotes ficam junto à cabeça do pai, que os protege.'],
      ['🐋', 'Adulto', 'Cresce muito rápido e pode passar de 2 metros.']
    ],
    sabia: [
      'Por respirar ar, o pirarucu sobrevive em lagos com pouco oxigênio na água.',
      'A língua tem um osso áspero, usado tradicionalmente na Amazônia como ralador de guaraná.'
    ]
  },
  cigarra: {
    ficha: [
      ['🧬', 'Táxon', 'Quesada gigas, família Cicadidae, ordem Hemiptera, a mesma dos percevejos e pulgões.'],
      ['🔄', 'Hemimetabolia', 'Não tem fase de pupa. A ninfa já se parece com o adulto e cresce por mudas até a última (ecdise).'],
      ['🥤', 'Alimentação', 'Suga o xilema das raízes, quando ninfa, e dos galhos, quando adulta, com aparelho bucal picador-sugador.'],
      ['🎵', 'Bioacústica', 'Os machos cantam com os tímbalos. Cada espécie tem um canto próprio, que ajuda a identificá-la.']
    ],
    ciclo: [
      ['🥚', 'Ovo', 'Posto dentro de galhos finos com o ovipositor da fêmea.'],
      ['🐛', 'Ninfa', 'Subterrânea por anos, com patas da frente escavadoras. Troca de pele várias vezes.'],
      ['🧗', 'Emergência', 'Sobe pelo tronco à noite, quando o solo está quente e úmido.'],
      ['🤎', 'Ecdise', 'Na última muda, o adulto sai pelas costas e deixa a exúvia presa no tronco.'],
      ['🦗', 'Adulta', 'Vive poucas semanas: canta, acasala e põe ovos.']
    ],
    sabia: [
      'Algumas cigarras da América do Norte (Magicicada) passam 13 ou 17 anos como ninfa e emergem todas ao mesmo tempo.',
      'A "chuva de cigarra" é o excesso de seiva que elas eliminam em jatos.'
    ]
  },
  aranha: {
    ficha: [
      ['🧬', 'Táxon', 'Trichonephila clavipes, família Araneidae, ordem Araneae, classe Arachnida.'],
      ['🧵', 'Seda', 'Feita de proteínas (espidroínas) produzidas por vários tipos de glândulas. Para o seu peso, é muito resistente.'],
      ['🕸️', 'Teia orbicular', 'Tem raios e uma espiral de captura com gotinhas de cola. A seda tem tom dourado.'],
      ['⚖️', 'Dimorfismo sexual', 'A fêmea é muito maior que o macho.'],
      ['🍽️', 'Digestão extracorpórea', 'Injeta veneno e enzimas na presa e suga o alimento já liquefeito.']
    ],
    ciclo: [
      ['🥚', 'Ovos', 'Guardados numa ooteca de seda.'],
      ['🎈', 'Filhotes', 'Fazem balonismo: soltam um fio de seda e são levados pelo vento para longe.'],
      ['🔄', 'Mudas', 'O exoesqueleto não cresce: para crescer, a aranha troca de pele (ecdise) várias vezes.'],
      ['🕸️', 'Adulta', 'A fêmea constrói a teia grande; o macho pequeno vive na teia dela.']
    ],
    sabia: [
      'Pesquisadores acham que a cor dourada da seda ajuda a atrair insetos no sol e a esconder a teia na sombra.',
      'A seda de aranha é estudada para criar materiais novos, como fios cirúrgicos e tecidos muito resistentes.'
    ]
  }
};
