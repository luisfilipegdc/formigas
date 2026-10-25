# Estudo de Bolso · Proposta pedagógica

> Como o app ensina: de quem tiramos cada ideia e onde ela aparece na tela.
> Origem: observação de uma criança de 2–3 anos usando a formiga 3D num tablet.
> Ela tocava em tudo para ver o que acontecia, mas não sabia ler e não entendia os botões.

## 1. O ponto de partida: Paulo Freire

Freire alfabetizava adultos partindo do **mundo deles**, e não da cartilha. Os passos eram estes:

1. **Levantar o universo vocabular**: as palavras que a pessoa já vive.
2. **Escolher palavras geradoras**: palavras carregadas de sentido, como *tijolo* ou *favela*.
3. **Codificar**: mostrar uma imagem da situação.
4. **Dialogar e problematizar**: conversar sobre a imagem antes de chegar à palavra escrita.
5. Só depois **decompor a palavra** em pedaços (*ti-jo-lo*) e criar palavras novas com eles.

Princípios que levamos para o app:

| Freire | No Estudo de Bolso |
|---|---|
| "A leitura do mundo precede a leitura da palavra" | A criança que não lê **explora pelo toque e pela voz**. A palavra escrita aparece junto da imagem e do som, sem cobrança. |
| Temas geradores, vindos da realidade | Começamos pelos bichos **do quintal**: formiga, lagartixa, abelha, cigarra. As perguntas do 💬 *Conversar* ligam o bicho à vida da criança: "Quem mora com você?" |
| Diálogo, e não "educação bancária" | O bicho **pergunta** em vez de só despejar informação. Não existe resposta errada. |
| Problematização | Perguntas abertas: "Por que você acha que…?" |
| Educador e educando aprendem juntos | Toda conversa traz uma linha **"Para o adulto"**. O app chama o adulto para a conversa e não substitui a família. |
| Codificação: imagem, palavra, som | Cada botão tem **ícone, palavra e voz**. No modo Pequeno, tocar no botão faz o bicho dizer o nome dele. |

## 2. Outros autores e o que cada um empresta

- **Piaget**: os estágios do desenvolvimento.
  - De 2 a 7 anos (pré-operatório), a criança aprende **agindo sobre o objeto**, por causa e efeito.
  - Daí vem a regra: cada toque provoca uma reação visível. O bicho morde, anda, fala.
  - Dos 11 anos em diante (operatório formal), cabem hipóteses e abstração. Isso é o modo Cientista.
- **Vygotsky**: mediação e a zona de desenvolvimento proximal.
  - O adulto e o próprio app servem de **andaime**.
  - No 🎯 *Cadê?*, depois de 7 segundos aparece uma dica piscando no lugar certo. É ajuda na medida, sem dar a resposta logo.
- **Wallon**: emoção e movimento fazem parte do aprender.
  - O bicho é um **personagem afetivo**: cumprimenta, comemora e convida para mexer o corpo ("Vamos andar em fila, igual às formigas?").
- **Montessori**: autonomia e ambiente preparado.
  - **Poucos botões por vez.** No Pequeno somem Câmera e Só o bicho, e os botões ficam maiores.
  - O erro é informação, não castigo. Tocar na parte "errada" só ensina o nome dela: "Olha, as pernas! E cadê as antenas?"
- **Malaguzzi (Reggio Emilia)**: as "cem linguagens" da criança e a curiosidade como motor.
  - Por isso o app combina voz, imagem, gesto e imitação, além do texto.
- **Bruner**: três modos de representar e o currículo em espiral.
  - Os três modos são **ação, imagem e símbolo**.
  - O mesmo bicho volta nos três níveis com profundidade crescente. A mandíbula da formiga é "corta folhas como uma tesoura" no Pequeno, ganha nome e função no Explorador e termo científico e mecanismo no Cientista.
- **Papert**: construcionismo.
  - Aprender fazendo e manipulando. O modelo 3D se gira, se abre e se compara.
- **Ausubel**: aprendizagem significativa.
  - Ancorar o novo no que a criança já sabe. Por exemplo: "Eu sou maior ou menor que a sua mão?"
- **Desenho Universal para a Aprendizagem (DUA/UDL)**: várias formas de acessar o mesmo conteúdo.
  - Todo texto pode ser **ouvido** (🔊), inclusive nos modos Explorador e Cientista.
- **Bloom**, para os maiores: subir de lembrar e entender para analisar, comparar e criar.
- **BNCC**:
  - Educação Infantil: o campo *Espaços, tempos, quantidades, relações e transformações*, com o direito de **explorar e conviver**.
  - Ensino Fundamental: a unidade *Vida e evolução*.
  - Ensino Médio: Ciências da Natureza, com investigação científica (EM13CNT).

## 3. As faixas e as trilhas

A página inicial abre assim: splash → **Quem vai explorar?** → biblioteca. A tela de escolha está em `js/faixa.js`, e cada faixa muda a biblioteca:

| Faixa | Idade | Na biblioteca | Nível nos bichos 3D |
|---|---|---|---|
| 🍼 Bebês | 1 a 3 | 16 itens, só imagens grandes e nada para ler. O modelo diz o nome. Botões redondos, sem partes, cartão ou Cadê? | 🧸 Pequeno, mais enxuto |
| 🧸 Educação Infantil | 4 a 6 (pré-escola e alfabetização) | Imagem com nome e voz em tudo. Os bichos aparecem primeiro | 🧸 Pequeno, com Cadê? e Conversar |
| ✏️ Anos Iniciais | 7 a 10 | Textos completos | 🧒 Explorador |
| 🔭 Anos Finais | 11 a 14 | Textos completos e "🔎 Para investigar" | 🔬 Cientista |
| 🧪 Ensino Médio | 15 a 17 | Textos completos e um "Para investigar" mais técnico | 🔬 Cientista |

A tela de escolha aparece a cada vez que o site é aberto, com a última escolha marcada. Assim, irmãos de idades diferentes trocam com um toque. O botão no cabeçalho também troca a faixa.


As trilhas usam o seletor de idade que já existe (`bnb-idade`), e a escolha vale para o app inteiro.

### 🧸 Pequeno: Educação Infantil e começo dos Anos Iniciais (2 a 6 anos, não leitor)

- **Objetivo:** explorar, nomear e conversar.
- **O bicho fala:** voz em português do aparelho. Nada é gravado.
  - Ele cumprimenta, diz o nome de cada parte tocada e o nome de cada botão.
- **Toque no corpo:** a criança toca em qualquer parte e o bicho diz o que é ("Antenas! Ela sente cheiros com as antenas!").
- **🎯 Cadê?:** o bicho pede uma parte e a criança procura.
  - Sem pontos, sem tempo e sem erro.
  - Há dica depois de 7 segundos e comemoração no fim.
- **💬 Conversar:** perguntas do mundo da criança, com orientação para o adulto.
- **Interface:** menos botões, botões maiores e frases curtas.

### 🧒 Explorador: Anos Iniciais e Anos Finais (7 a 12 anos)

- **Objetivo:** observar, comparar e explicar com as próprias palavras.
- **Leitura de apoio:** textos curtos com 🔊 Ouvir.
- **Próximos passos:**
  - "Detetive da natureza": desafios de observação em casa ou na escola, como contar pernas ou achar uma trilha de formigas.
  - Comparar dois bichos lado a lado (`comparar.html`).
  - Diário de campo desenhado.

### 🔬 Cientista: Anos Finais e Ensino Médio (11 anos ou mais)

- **Objetivo:** levantar hipóteses, investigar e argumentar.
- **Conteúdo:** nome científico, função, classificação e o modo "Como funciona", em passos.
- **Próximos passos:**
  - Problemas no estilo Freire, em temas como agrotóxicos e abelhas, formigas e agricultura, ou escorpiões na cidade e saneamento.
  - Roteiros de investigação com hipótese, observação e conclusão.
  - Ligação com os códigos da BNCC.

## 4. Regras que não mudam (proteção da criança)

- Sem anúncios, chat, microfone, câmera ou localização.
  - A conversa acontece **entre a criança e o adulto, fora da tela**.
- Sem ranking, sequência diária, recompensa aleatória, notificação, punição ou medo de perder.
- A voz usa só a síntese do próprio aparelho, e o botão 🔊/🔇 a desliga.
- Conteúdo marcado "em revisão científica".

## 5. Como saber se funciona

Use a ficha de observação de `docs/terra-codex-playtest.md` com crianças de verdade. Observe:

- A criança de 2 a 3 anos **toca sozinha** em vez de pedir ajuda?
- Ela **repete o nome** das partes depois de ouvir?
- No *Cadê?*, acha a parte com dica ou sem dica?
- O 💬 *Conversar* gera conversa com o adulto, mesmo que de um minuto?
- Em que momento ela desiste ou se frustra?
