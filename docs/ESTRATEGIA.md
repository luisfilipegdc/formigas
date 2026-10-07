# Estratégia: comportamento, UX/UI, dados reais, monetização e tecnologia

> **Nota (outubro de 2026):** documento da fase "Catálogo 3D de Animais". Os princípios (ética para o público infantil, sem anúncios, nada de "porta falsa") continuam valendo. O escopo e o modelo de negócio foram atualizados em [`DIRECAO.md`](DIRECAO.md).

Documento de produto do **Catálogo 3D de Animais**. Público: crianças a partir de 5 anos (que muitas vezes ainda não leem), professores e pais. Uso principal: celular e iPad, no Safari, muitas vezes a partir do QR code impresso.

---

## 1. Design comportamental (método Rian Dutra)

### Diagnóstico
O comportamento que queremos é **"a criança explora um bicho até ter um momento de 'uau' e pede para ver outro"**, e **"o professor volta com a turma na semana seguinte"**. O 3D entrega o "uau", mas antes desta versão nada transformava a visita em descoberta registrada nem puxava para o próximo bicho. 9 dos 11 cartões eram becos sem saída ("em breve"). Hipótese central: falta **progresso visível** e **caminho para o próximo passo**, e não falta motivação (criança já chega motivada). Segundo Fogg, a alavanca é **facilidade + gatilho**, não convencimento.

### Achados

#### 1. Cartões "em breve" eram becos sem saída: efeito de expectativa frustrada
- **Onde:** catálogo, 9 cartões cinzas e sem toque.
- **Por quê:** a criança toca e nada acontece. Isso ensina que o catálogo "não funciona" (desamparo aprendido) e o desbotado faz 80% do catálogo parecer quebrado.
- **Mudança (feita):** todo cartão abre a ficha completa com foto real, ciclo de vida, curiosidades e aba Real. Texto do selo: **"📋 ver ficha · 3D em breve"**.
- **Medir:** proporção de toques em cartões que levam a conteúdo (meta: 100%). Pergunta ao professor: "as crianças tocaram em mais de um bicho?".

#### 2. Nenhum registro de progresso: falta o efeito de progresso dotado (endowed progress) e o efeito Zeigarnik
- **Onde:** catálogo e telas 3D, nada mostrava o que já foi visto.
- **Por quê:** tarefas começadas e visíveis puxam a conclusão. Cada estrelinha vazia é um convite concreto ("☆ ver o ciclo de vida").
- **Mudança (feita):** álbum de descobertas: ⭐ por aba vista, por explorar em 3D e por visitar o formigueiro/a colmeia. Aviso curto e positivo: **"⭐ 🔄 Viu o ciclo de vida!"**. Contador **"🏅 N descobertas"** no topo.
- **Medir:** média de abas abertas por ficha; número de bichos diferentes com ≥1 estrela por aparelho (dá para ver no próprio aparelho, sem coletar dados).

#### 3. O momento "uau" do mundo real estava ausente: viés de concretude
- **Onde:** catálogo com emojis; ficha só com texto.
- **Por quê:** para criança pequena, a foto de verdade ancora o 3D ao mundo ("esse bicho existe, e alguém fotografou ele"). O número de registros no iNaturalist é **prova social verdadeira**: "Pessoas do mundo todo já registraram este bicho 3.176 vezes".
- **Mudança (feita):** foto real com crédito em cada cartão e na ficha; galeria de fotos na aba Real.
- **Medir:** tempo na aba Real; taxa de cliques em "⚖️ Comparar com outro bicho" a partir dela.

#### 4. Sem próximo passo depois do conteúdo: falta de gatilho
- **Onde:** fim de cada ficha.
- **Por quê:** quando o conteúdo termina sem sugestão, a sessão termina.
- **Mudança (feita):** botão **"⚖️ Comparar com outro bicho"** no fim da aba Real; no comparador, **"▶ Ver [bicho] em 3D"**.
- **Próximo:** no fim da aba Vida, "Quem mais nasce de um ovo? 🐢🐸🐦" (leva a outros bichos com o mesmo ciclo).

#### 5. Comparar é como criança aprende: contraste e escala humana
- **Onde:** não existia.
- **Por quê:** "2 a 15 mm" não significa nada aos 5 anos. "Do tamanho de um grão de arroz" e "A onça é umas 150 vezes maior que a formiga" significam.
- **Mudança (feita):** `comparar.html`, com tamanho (barras em escala logarítmica + comparação com objetos do dia a dia), parentesco (filo → família, com frase pronta: "Primos! São da mesma ordem") e lado a lado (o que come, quanto vive, com quem vive, onde mora, situação na natureza).

#### 6. Criança que não lê: carga cognitiva
- **Onde:** fichas em texto.
- **Mudança (próximo passo):** botão 🔊 "ouvir" em cada aba (Web Speech API em pt-BR, já disponível no Safari, sem custo e sem servidor). É a melhoria de maior impacto ainda não feita para o público de 5 anos.

### Prioridade
1. ✅ Todo cartão abre algo (feito).
2. ✅ Fotos reais + prova social verdadeira (feito).
3. ✅ Álbum de descobertas (feito).
4. ✅ Comparador (feito).
5. 🔊 Ouvir a ficha (próximo, baixo esforço e alto impacto para quem não lê).
6. Modo turma para professor (ver monetização).

### Guardrails éticos (público infantil)
Tudo passa no **teste do impostor**:
- **Verdade:** a estrela "📷 Viu fotos de verdade" só aparece quando uma foto carrega de fato (offline, a criança não ganha a estrela). Números de registros vêm da API, sem arredondar para cima.
- **Explicável em voz alta:** "cada coisa que você descobre ganha uma estrela" é aceitável para pais e escola.
- **Saída tão fácil quanto a entrada:** "apagar minhas descobertas" no rodapé.
- **Não fazemos:** sequência de dias (streak), perda ("você vai perder suas estrelas!"), notificações, ranking entre crianças, caixas de recompensa aleatórias, anúncios e cadastro. Tudo fica só no aparelho (`localStorage`).

---

## 2. Crítica de UX/UI

### Impressão geral
Visual acolhedor, coerente e muito adequado para criança (cores quentes, cantos redondos, emoji como linguagem). A maior oportunidade era transformar o catálogo de "vitrine com 2 produtos" em **catálogo inteiro explorável**, e foi o que esta versão fez.

### Usabilidade
| Achado | Gravidade | Recomendação |
|---|---|---|
| 9 cartões não respondiam ao toque | 🔴 Crítico | ✅ Abrem a ficha completa |
| Cabeçalho ocupava ~50% da primeira tela no celular | 🟡 Moderado | ✅ Título em 1 linha, busca e atalhos compactos no celular |
| Ficha só existia nas telas 3D | 🟡 Moderado | ✅ ℹ️ no cartão abre a ficha sem sair do catálogo |
| Criança não lê as fichas | 🟡 Moderado | 🔊 Ouvir (próximo passo) |
| Sem forma de comparar animais | 🟡 Moderado | ✅ Comparador |
| Esc/arrastar para baixo fecham a ficha | 🟢 Ok | Mantido |

### Hierarquia visual
- **O que chama atenção primeiro:** a foto/emoji do cartão e o selo amarelo "▶ ver em 3D". Correto: são as duas ações principais.
- **Fluxo de leitura:** título → busca → atalhos (comparar / descobertas) → filtros → cartões.
- **Ênfase:** o amarelo `#ffd23f` é a cor de "ação principal" no site todo (botão 3D, aba ativa, comparar). Manter essa regra.

### Consistência
| Elemento | Problema | Recomendação |
|---|---|---|
| Cores de ação | Ok: amarelo = ação | Documentar como token (`--acao`) |
| Bordas | Cartões 32px, ficha 28px, chips 999px | Ok, escala coerente |
| Ícones | Emoji como ícone em todo o site | Manter: universal e legível para criança |

### Acessibilidade
- **Contraste:** texto `#4a2a12` sobre creme ≈ 11:1 (passa AAA). Crédito de foto em branco sobre faixa escura com 45% de opacidade: legível, mas pequeno (10px). É informação para adultos, aceitável.
- **Áreas de toque:** botões ≥ 44px (ℹ️ 44px no tablet, 40px no celular; chips do comparador 48px).
- **Leitores de tela:** cartões têm `aria-label` ("Onça-pintada: ver ficha"), fotos têm `alt`, o aviso de estrela usa `role="status"`.

### O que funciona bem
- A identidade "papel, mel e terra" é única e calorosa.
- O 3D procedural é leve (não baixa modelos) e funciona no iPad.
- Sem cadastro, sem anúncio: confiança imediata de escola e de pais.

---

## 3. Dados reais e APIs

| Fonte | O que dá | Chave? | Usado |
|---|---|---|---|
| **iNaturalist API** (`api.inaturalist.org/v1`) | Fotos com licença Creative Commons e nome do autor, nome popular em pt-BR, nº de registros, árvore taxonômica completa (reino → espécie) | Não | ✅ Foto, galeria, registros, árvore |
| **Wikipédia pt REST** (`pt.wikipedia.org/api/rest_v1/page/summary/…`) | Resumo e foto principal | Não | ✅ "Para adultos" e foto reserva |
| GBIF (`api.gbif.org/v1`) | Mapa de ocorrências, distribuição por país/estado | Não | Próximo: "Onde vive" com mapa do Brasil |
| Wikidata (SPARQL) | Massa, comprimento, expectativa de vida, status IUCN estruturados | Não | Próximo: preencher o comparador automaticamente |
| IUCN Red List API | Status oficial de conservação | Sim (gratuita, uso não comercial) | Hoje o status está escrito à mão em `catalogo.js` |
| Encyclopedia of Life (EOL) | Traits (dieta, habitat) | Não | Alternativa ao Wikidata |
| Sketchfab / Smithsonian 3D | Modelos 3D (muitos CC) | Depende | Para animais grandes (onça, arara) |

**Como foi feito:** `js/dados.js` busca no navegador, guarda no aparelho por 14 dias e, sem internet, volta para os emojis. Só usa fotos com licença CC e sempre mostra o crédito. Nenhum dado da criança é enviado: as requisições levam apenas o nome científico do bicho.

**Por que os textos para crianças continuam escritos à mão:** as APIs dão fatos para adultos. A ficha infantil precisa de frases curtas e comparações concretas ("do tamanho de um grão de arroz"), e isso é curadoria editorial. As APIs complementam, não substituem.

---

## 4. Monetização ética

Regra: **a criança nunca é o alvo da venda.** Nada de anúncios, compras dentro do app ou "desbloqueie o bicho". O catálogo continua 100% grátis. Quem paga é o adulto ou a instituição, por **mais trabalho pronto**, nunca por conteúdo escondido.

| Modelo | Quem paga | O que recebe | Faixa sugerida |
|---|---|---|---|
| **Plano Escola / Professor** ⭐ | Escola, rede ou professor | Modo turma (projetar no quadro, roteiro guiado), planos de aula alinhados à BNCC (Ciências, EF01CI–EF03CI: seres vivos, ciclo de vida), fichas e atividades para imprimir, quiz da turma sem dados pessoais | R$ 15–30 por professor/mês ou licença anual por escola |
| **Material impresso** | Pais e escolas | Álbum de figurinhas com QR codes (cada figurinha abre o bicho em 3D), cartazes, kit "colmeia de papel" | Venda avulsa |
| **Licenciamento** | Editoras de didáticos, museus, zoológicos, aquários | Bicho 3D sob medida + QR no livro/placa; "seu museu no catálogo" | Projeto |
| **Patrocínio institucional** | Fundações, ONGs de conservação, cooperativas de apicultores, empresas com ESG | "Esta espécie é apoiada por…", discreto na ficha **para adultos**, nunca com link para criança | Cota anual por espécie |
| **Editais e leis de incentivo** | Governo / fomento | Lei Rouanet, editais de inovação educacional, FAPs | Projeto |
| **Doação** | Pais e fãs | Apoio mensal (Apoia.se, Catarse) | Livre |

**Recomendação:** começar pelo **Plano Escola** (o professor já é o canal: ele imprime o QR e leva a turma) e pelo **álbum impresso com QR** (produto físico, sem coleta de dados, encanta pais). O patrocínio por espécie paga a produção de novos bichos em 3D.

**Teste do impostor da monetização:** o que é grátis hoje continua grátis; o professor sabe exatamente o que compra; cancelar é um clique.

---

## 5. Melhor tecnologia para 3D e imagem

### Recomendação curta
**Continuar com Three.js** (JavaScript), evoluindo para **TypeScript + Vite** quando o catálogo passar de ~5 bichos em 3D, e passar a usar **modelos glTF/GLB** feitos no **Blender** para animais grandes e peludos.

| Opção | Prós | Contras | Veredito |
|---|---|---|---|
| **Three.js** (atual) | Maior ecossistema, leve, roda no Safari, controle total (já temos o 3D procedural) | Tudo "na mão" | ✅ Manter |
| React Three Fiber + drei | Componentes, fácil para equipe React | Exige build/React; não traz ganho visual | Só se o site virar app React |
| Babylon.js | Motor completo, inspetor, física | Mais pesado, menos exemplos de estilo "ilustrado" | Não vale migrar |
| PlayCanvas | Editor visual na nuvem | Dependência do editor | Para equipe de artistas |
| Unity WebGL | Pipeline de jogos | Pesado no iPhone, carregamento lento | ❌ Para este público |
| **`<model-viewer>`** (Google) | Uma tag para GLB com **AR** (Quick Look no iPhone, Scene Viewer no Android) | Pouco controle de animação/cenas | ✅ Adicionar botão "📱 ver na minha mesa" (AR) |

### Pipeline de modelos (para onça, arara, preguiça, tartaruga…)
1. **Blender** (grátis) para esculpir, pintar e animar (andar, comer). Pelos: hair cards.
2. Exportar **glTF/GLB** com compressão **Draco** ou **Meshopt** e texturas **KTX2/Basis** (via `gltf-transform`): de 30 MB para ~2–4 MB.
3. Exportar também **USDZ** para AR no iPhone (Reality Converter, ou `model-viewer` gera sozinho).
4. Bases prontas com licença livre: Smithsonian 3D, Sketchfab (filtrar CC-BY), Poly Haven (texturas e ambientes HDRI).

### Imagens
- Fotos: iNaturalist/Wikimedia, já integradas (servidas na resolução "medium", ~500 px).
- Ilustrações próprias: SVG (leve, nítido no Retina).
- Em produção: Vercel Image Optimization ou formato AVIF/WebP com `<picture>`.

### Quando dar o próximo passo técnico
- **Agora:** PWA (manifest + service worker) para funcionar offline em sala de aula e "instalar" no iPad, além do botão 🔊 ouvir.
- **Com 5+ bichos 3D:** TypeScript + Vite, um `Animal3D` comum (castas, passeio, etiquetas) e cada bicho como módulo.
- **Com modelos GLB:** `GLTFLoader` + `DRACOLoader` + `KTX2Loader`, com carregamento sob demanda.
