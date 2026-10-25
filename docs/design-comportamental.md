# Bio no Bolso: design comportamental, design para humanos e qualidade 3D

> Auditoria feita em outubro de 2026 com o método de design comportamental de Rian Dutra (Enviesados / psicologia.design), somado a teorias de aprendizagem e de design infantil.
> Complementa `docs/pedagogia.md`.

## 1. Diagnóstico

- **Comportamento que queremos:**
  - a criança **explora sozinha e aprende algo nomeável**, como "a lagartixa limpa o olho com a língua";
  - o adulto **conversa com ela** sobre o que viu;
  - a família **volta por vontade própria**, e não por pressão.
- **O que trava:**
  1. Os modelos 3D parecem amadores. A criança não reconhece o bicho ("parece um bicho esquisito"). Para os adultos, isso derruba a credibilidade do app inteiro.
  2. Quem não lê não sabe o que tocar.
  3. Gestos difíceis para essa idade, como a pinça para dar zoom.
- **Hipótese central:** a qualidade visual não é enfeite.
  - Para a criança, ela é **reconhecimento**: aprender começa por identificar o que se vê.
  - Para o adulto, ela é **confiança**: pelo efeito estética-usabilidade, quem vê algo bonito acredita que funciona e ensina bem.

## 2. Achados (por impacto)

### 1. Modelos que a criança não reconhece: efeito estética-usabilidade e superioridade da imagem
- **Onde:**
  - lagartixa: pernas de bastão e língua que entrava na cabeça;
  - pequi: uma bola verde lisa;
  - granito e geodo: formas genéricas;
  - ipê: flor simplificada demais.
- **Por quê:**
  - Imagens são lembradas melhor que palavras (*picture superiority*, Paivio). Isso só funciona se a imagem for **fiel ao real**.
  - Um modelo estranho ensina a coisa errada.
  - Para os pais e as escolas, que decidem se o app entra em casa ou na sala, o visual amador vira a desconfiança "isso não deve ser sério".
- **Mudança:**
  - Trocar os modelos feitos em código por **modelos .glb profissionais**. O caminho técnico já está pronto em `modelos3d/`.
  - Enquanto isso, corrigir os erros grosseiros. A língua da lagartixa já foi corrigida.
  - Itens fracos não entram na faixa Bebês.
- **Medir:**
  - Teste do "o que é isso?": mostrar o modelo para a criança e ver se ela nomeia o objeto. Meta: 80% acertam.
  - Nota do adulto de 1 a 5 para "parece profissional?".

### 2. Quem não lê não sabe onde tocar: affordance e sinalizadores (Norman)
- **Onde:** no visor 3D, nada mostra que o modelo responde ao toque.
- **Por quê:** sem um sinalizador visível, a criança só descobre por acaso. Pelo modelo de Fogg (B = MAP), a **capacidade** cai, e com ela o comportamento.
- **Mudança (feita):**
  - Uma **mãozinha 👆 pulsando** aparece no centro depois de 3,5 a 4 segundos sem toque, na faixa Bebês e na Educação Infantil.
  - Ela some no primeiro toque.
  - O bicho fala "Toque em mim!".
- **Medir:** porcentagem de sessões com toque no modelo nos primeiros 10 segundos.

### 3. Gesto difícil: lei de Fitts e capacidade motora aos 1–3 anos
- **Onde:** zoom com pinça; botões pequenos.
- **Por quê:** a coordenação fina de dois dedos ainda está se formando nessa idade.
- **Mudança (feita):**
  - Botões ➕/➖ grandes (60 a 72 px).
  - Limite para afastar, para o bicho não sumir na neblina.
  - Câmera que volta sozinha para perto do bicho.
  - Sem arrastar a cena no modo Pequeno.
- **Medir:** quantas vezes o adulto precisa intervir por sessão.

### 4. Escolher a idade toda vez: padrão (default) e fricção que protege
- **Onde:** a tela "Quem vai explorar?" aparece a cada abertura.
- **Por quê:** é fricção boa, porque personaliza e permite trocar entre irmãos. Mas com 5 opções no mesmo nível, ela pede uma decisão inteira toda vez (lei de Hick).
- **Mudança (feita):** um botão grande **"▶ Continuar com 🍼 Bebês"**, com a última escolha já pronta. Um toque continua; as 5 opções ficam logo abaixo para quem quer trocar.
- **Medir:** tempo da abertura até o primeiro modelo 3D (meta: menos de 5 s).

### 5. Recompensa que tira a vontade de aprender: efeito de superjustificação (Deci e Ryan)
- **Onde:** o aviso "Novo bicho no bolso! … Agora você é Curioso!" aparece ao abrir uma ficha.
- **Por quê:** recompensas externas (níveis, títulos) podem trocar a curiosidade por "colecionar pontos". O risco é maior antes dos 7 anos, quando o título nem faz sentido.
- **Mudança:**
  - Sem níveis nem títulos nas faixas Bebês e Educação Infantil. A recompensa é o próprio bicho reagir: falar, comemorar, mexer.
  - A coleção do Meu Bolso continua para os maiores, como **registro** do que exploraram, e não como placar.
- **Medir:** em teste com crianças, se exploram os itens por mais tempo ou passam mais rápido de um para outro só para "pegar" o próximo.

### 6. Saídas acidentais: caminhos infelizes
- **Onde:** a seta ← no topo; os links do rodapé; a ficha cheia de texto aberta sem querer.
- **Por quê:** uma criança pequena toca em tudo, e sair sem querer quebra a experiência.
- **Mudança (proposta):**
  - Na faixa Bebês, para sair do visor, segurar a seta ← por 1,5 segundo. Mostrar um círculo enchendo; o toque rápido não faz nada.
  - Explicar aos pais o "Acesso Guiado" do iPad e a "Fixação de tela" do Android.
- **Medir:** saídas sem querer, anotadas na ficha de observação.

### 7. Fim de sessão sem fechamento: regra do pico-fim (Kahneman)
- **Onde:** hoje a sessão simplesmente acaba.
- **Por quê:** a lembrança da experiência é dominada pelo momento mais forte e pelo final.
- **Mudança (proposta):** depois de cerca de 10 minutos, o bicho se despede: "Tchau! Vamos procurar uma formiga de verdade lá fora?". Leva o aprendizado para o mundo real, sem prender na tela.
- **Medir:** relato dos pais ("fomos procurar no quintal").

### O que já está bom (manter)
- **Voz e "Para o adulto":** mediação (Vygotsky) e engajamento conjunto (*joint media engagement*).
- **Cadê? sem pontos e sem erro:** tocar errado só ensina o nome, o que trabalha competência e autonomia.
- **Sem ranking, sequência diária, anúncios ou notificações.**

### Ética: teste do impostor
Nenhum elemento atual reprova:
- não há escassez falsa, contador falso ou saída difícil;
- o "Novo bicho no bolso!" é verdadeiro, mas é **inadequado para a idade** abaixo dos 7 anos (ver achado 5).

## 3. Teorias para aplicar (mapa)

| Teoria / autor | Ideia em uma linha | No Bio no Bolso |
|---|---|---|
| **Fogg, B = MAP** | O comportamento acontece quando motivação, capacidade e gatilho se encontram | Aumentar a capacidade: botões grandes, voz, mãozinha |
| **COM-B** (Michie) | Capacidade, oportunidade, motivação | Separar "não consegue" (gesto) de "não sabe" (sem sinalizador) |
| **Teoria da Autodeterminação** (Deci e Ryan) | Autonomia, competência e vínculo geram motivação de dentro | Exploração livre, Cadê? sem erro, conversa com o adulto |
| **Superjustificação** | Prêmio externo pode matar o interesse | Sem níveis abaixo dos 7 anos |
| **Flow** (Csikszentmihalyi) | Desafio do tamanho da habilidade | Faixas etárias; dica no Cadê? depois de 7 s |
| **Carga cognitiva** (Sweller) | Pouca coisa por vez | Bebês: só imagens; menos botões no modo Pequeno |
| **Princípios multimídia** (Mayer) | Coerência, sinalização, modalidade, personalização | Voz em vez de texto para quem não lê; destacar a parte tocada; bicho falando "eu" |
| **Dupla codificação** (Paivio) | Imagem + palavra juntas fixam melhor | Ícone, palavra e voz em cada botão |
| **Norman** | Affordance, sinalizador, feedback, mapeamento | Mãozinha 👆; o bicho reage a cada toque |
| **Lei de Fitts / lei de Hick** | Alvo grande e perto; poucas opções | Botões de 60 a 88 px; "Continuar com…" |
| **Estética-usabilidade** | O que é bonito parece funcionar melhor | Modelos 3D profissionais (seção 4) |
| **Pico-fim** (Kahneman) | Lembramos do pico e do fim | Despedida com convite para ir lá fora |
| **Efeito IKEA / dotação** | Valorizamos o que ajudamos a fazer | Meu Bolso como diário: "encontrei de verdade" |
| **Pilares de Hirsh-Pasek** | Ativo, engajado, significativo, social, iterativo, alegre | Checklist de toda tela nova |
| **Freire, Piaget, Vygotsky, Montessori, Wallon, Reggio, Bruner, Papert** | Ver `docs/pedagogia.md` | |

**Normas a seguir:**
- **Orientações de tela da Sociedade Americana de Pediatria (AAP):** antes dos 2 anos, só com o adulto junto; de 2 a 5 anos, até 1 hora por dia, assistida com a família.
- **LGPD, art. 14:** dados de criança só com consentimento do responsável.
- **ECA Digital (Lei 15.211/2025)**, que segue a linha do *Age Appropriate Design Code* do Reino Unido:
  - proteção por padrão;
  - sem perfilamento;
  - sem caixas de recompensa nem técnicas que prendem.
- **WCAG 2.2 AA:** contraste, alvos de toque, `prefers-reduced-motion` e legenda para todo áudio.

## 4. Qualidade 3D: bibliotecas, fontes e tendências

### Por que o 3D parece amador
Os modelos são montados em código a partir de esferas, tubos e superfícies de revolução. Dá para ficar "aceitável", mas não com qualidade de produto. Apps profissionais usam **modelos feitos por artistas ou escaneados (.glb)**, com **um estilo único** em tudo, luz de estúdio (HDRI), sombra de contato e microanimações.

### Já preparado no código
- `vendor/three/GLTFLoader.js` e `meshopt_decoder.js`.
- Carregamento de `.glb` na Biblioteca, com partes por nome de malha, animações do arquivo e crédito do autor. Se o arquivo falhar, volta para o modelo feito em código.
- Instruções em `modelos3d/LEIA-ME.md`.

### Onde conseguir modelos

| Licença | O que fazer |
|---|---|
| CC0 | Usar sem restrição |
| CC BY | Usar, dando crédito |
| NC, ND ou SA | Evitar |

> As licenças da tabela vieram de resultados de busca, sem abrir as páginas (o acesso ao Sketchfab está bloqueado neste ambiente). **Confira cada licença antes de baixar.**

| Item | Candidato | Licença |
|---|---|---|
| Aranha | sketchfab.com/3d-models/cc0-orb-weaver-spider-a-bruennichi-66bdf27a9f3e4cb49844472b51c96f90 | CC0 (precisa reduzir polígonos) |
| Escorpião | sketchfab.com/3d-models/scorpion-4c0fd62d33ab4d2592ee0a1d985a480d (já animado) | CC BY |
| Abelha | sketchfab.com/3d-models/bee-2a0e29119dcb470abd666c404cd3a94e · …/lowpoly-bee-96d626f8a53341e69b31fa0be5bab105 | CC BY |
| Formiga | sketchfab.com/3d-models/worker-ant-41ceadfd6ce742d5bfef197337ef42cb | CC BY |
| Lagartixa | sketchfab.com/3d-models/cartoon-gecko-bitbite-signature-character-63a376323b454678a31a7e746936cf3c (cartoon) | CC BY |
| Quartzo | sketchfab.com/3d-models/quartz-cluster-8a863657e61949dc8ad519d868b74a02 (Virginia Tech) | CC BY |
| Ametista | sketchfab.com/3d-models/small-amethyst-ee07e891328048ef913e2b01ad2595a5 | CC BY |
| Amonite | data.public.lu, "3d-reconstruction-of-ammonitida-qk077-via-photogrammetry" | CC BY 4.0 |
| Granito | Rochas escaneadas da Poly Haven (polyhaven.com/models) | CC0 |
| Concha de caracol | opengameart.org/content/snail-3d-model | CC0 |
| Célula | sketchfab.com/3d-models/animal-cell-e2fc495016ca4542b4ff424e22e62277 | CC BY (precisa reduzir polígonos) |
| Fósseis e afins | 3d.si.edu/cc0 (Smithsonian) | CC0 |

**Sem modelo pronto:** ipê, pequi, feijão germinando, folha, joão-de-barro, favo, pena, bolor e bactéria. Para esses:
- modelar no Blender, em estilo simples;
- encomendar a um artista 3D (cerca de R$ 150–600 por modelo);
- **escanear com o celular** (Polycam ou RealityScan): pequi, pena, concha e ninho de verdade, do quintal.

### Bibliotecas que melhoram o código e a experiência
- **Three.js:**
  - Estamos no r147; a versão atual é a r186.
  - Migrar para módulos ES com *import map* traz o `WebGPURenderer`, com volta automática para WebGL2, além de materiais e loaders melhores. Continua sem build.
  - Atenção às mudanças de cor e de luz desde o r152 e o r155.
- **gltf-transform:** otimiza modelos (meshopt, KTX2, simplificar).
- **`<model-viewer>`** (Google): botão **"Ver na minha mesa"** com realidade aumentada no Android e no iOS. A criança vê a formiga em tamanho real em cima da mesa.
- **camera-controls** (yomotsu): câmera que "voa" suave até a parte tocada.
- **GSAP 3** (gratuito): animações de interface e câmera.
- **Rive:** mascote 2D animado e interativo, com boca acompanhando a fala. É o padrão hoje em apps infantis.
- **Howler.js + áudio pré-gravado:** voz infantil revisada e igual em todos os aparelhos. A voz do aparelho (Web Speech) fica como reserva.

### Tendências (Khan Academy Kids, Sago Mini, Toca Boca, Google Arts & Culture)
1. **Um estilo único e coerente.** Misturar scan realista com cartoon é o que mais parece amador.
2. **Personagem guia com voz** e pouco texto.
3. **Feedback em cada toque:** som, partícula, estica-e-encolhe.
4. **Pontos tocáveis no modelo e realidade aumentada.**
5. **Iluminação de estúdio (HDRI)** e sombra de contato.

## 5. Plano

1. **Agora, já feito:**
   - língua e andar da lagartixa;
   - zoom com botões;
   - mãozinha 👆;
   - "Continuar com…";
   - caminho para modelos .glb.
2. **Próximas 1 a 2 semanas:**
   - Baixar e otimizar de 8 a 10 modelos CC0/CC BY da tabela: aranha, escorpião, abelha, formiga, quartzo, ametista, amonite, concha, granito e célula.
   - Criar a tela de créditos.
   - Botão "Ver na minha mesa".
   - Sem níveis para menores de 7 anos.
   - Segurar para sair na faixa Bebês.
   - **Para isso, preciso dos arquivos.** O Sketchfab e os outros bancos estão bloqueados neste ambiente. Há duas saídas:
     - liberar `sketchfab.com`, `polyhaven.com`, `3d.si.edu` e `opengameart.org` em "Network access" nas configurações do ambiente;
     - baixar os .glb e colocar em `modelos3d/`.
3. **De 3 a 6 semanas:**
   - Definir um estilo visual único.
   - Encomendar ou modelar os itens brasileiros (ipê, pequi, joão-de-barro).
   - Migrar para o Three.js atual.
   - Voz gravada.
   - Mascote no Rive.
   - Testes com crianças, usando a ficha de observação.
