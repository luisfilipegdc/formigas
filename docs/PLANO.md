# Plano de implementação e backlog

> Status: **💡 proposta**. Cada etapa é pequena, pode ser publicada sozinha e não quebra o que já funciona.
> Direção em [`DIRECAO.md`](DIRECAO.md). Modelo de dados e telas em [`PROPOSTA-CATALOGO.md`](PROPOSTA-CATALOGO.md).

## 1. Regras para todas as etapas
- **Não quebrar o que existe:**
  - os ids do catálogo não mudam (o Meu Bolso de quem já usa continua);
  - o motor 3D e os quatro 3D atuais continuam funcionando;
  - os testes no Safari/iPad e no celular vêm antes de publicar.
- **Conteúdo só com fonte e foto licenciada.** Nada de fichas vazias nem de conteúdo inventado para encher o catálogo.
- **Não anunciar o que não existe:** um recurso planejado não aparece na interface como pronto.
- **Antes de publicar:** rodar `python3 ferramentas/atualizar-cache.py` (lista do app sem internet).
- **Revisão antes do servidor:** recursos com servidor (contas, fotos, contribuições, assinatura) só depois da revisão de LGPD e proteção infantil.

## 2. Etapas

### Trilha A: catálogo e interface (sem servidor)

| # | Etapa | O que entrega | Pronto quando | Depende de |
|---|---|---|---|---|
| A0 | **Documentação da nova direção** | `DIRECAO.md`, `PROPOSTA-CATALOGO.md`, este plano | ✅ Feito nesta tarefa | — |
| A1 | **Modelo de dados compatível** | `ELEMENTOS` com apelido `ANIMAIS`; campos `categoria`, `natureza`, `nivel`, `revisao` (todos "em revisão"), `fontes` nos 13 animais; `CATEGORIAS` com subgrupos | O site fica **visualmente idêntico** e o Meu Bolso antigo continua | — |
| A2 | **Fontes e revisão na ficha** | Selo "em revisão / revisado" e bloco "Fontes" (créditos das fotos, Wikipédia, iNaturalist e as fontes do texto) | Toda ficha mostra de onde veio cada coisa | A1 |
| A3 | **Ficha em 6 partes** | Abas novas, mostrando só o que existe; "Sabia?" incorporado; no Pequeno, até 3 partes | As 13 fichas abrem sem parte vazia; o progresso antigo continua contando | A1 |
| A4 | **Relações** | Campo `relacoes` nos 13 animais, com links entre fichas; outras espécies do mesmo `tipo` | Cada ficha tem ao menos uma relação real | A3 |
| A5 | **Home e busca por categoria** | Chips em dois níveis, categorias vazias escondidas, textos da §6 de `PROPOSTA-CATALOGO.md` (menos o nome da marca), busca sem acento e com `outrosNomes` | Com só animais publicados, a home fica igual à de hoje para a criança | A1 |
| A6 | **Meu Bolso por categoria** | Avisos por categoria, contagem por categoria, coleções mistas, página própria do bolso | O bolso antigo aparece igual, agora com separadores | A5 |
| A7 | **Primeiras fichas fora de Animais** | 💡 Sugestão: **1 planta** (ex.: ipê-amarelo), **1 fungo** (ex.: orelha-de-pau) e **1 mineral** (ex.: quartzo), sem 3D, com fotos licenciadas e **revisadas por especialista** | 3 fichas revisadas publicadas; a categoria só aparece quando tem ficha | A3, A5 e um revisor (❓) |
| A8 | **Página de ficha** | `ficha.html?id=`, para link direto, QR por ficha e impressão | Abre a mesma ficha da gaveta e funciona sem internet depois de aberta | A3 |
| A9 | **🔊 Ouvir a ficha** | Leitura em voz alta (Web Speech API, pt-BR) no modo Pequeno | Funciona no Safari do iPad | A3 |
| A10 | **Cache sob demanda** | O app sem internet guarda só as fichas e fotos abertas, e não o catálogo inteiro | Com 50+ fichas, a instalação continua leve | Quando o catálogo crescer |

### Trilha B: 3D (sem servidor)

| # | Etapa | O que entrega | Depende de |
|---|---|---|---|
| B1 | **Selo de representação** | "Modelo didático (simplificado)" ou "anatomia fiel" no 3D; a cigarra entra como didática | A1 |
| B2 | **Migrar a abelha para o motor `bicho3d`** | Mesma experiência, com os 3 modos; `abelha.html` redireciona | — |
| B3 | **Migrar a formiga para o motor `bicho3d`** | Idem; o formigueiro vira uma "forma" ou "cena" | — |
| B4+ | **Itens do backlog** (§3) | Um processo de cada vez, sempre depois de validado | B2/B3 para formiga e abelha |

### Trilha C: reconhecimento, contas e contribuições (com servidor, ❓)

| # | Etapa | O que entrega | Depende de |
|---|---|---|---|
| C0 | **Revisão jurídica e de proteção infantil** | Parecer de LGPD (art. 14), termos, política de privacidade, regras de foto | Decisão do fundador |
| C1 | **Teste técnico do reconhecimento (interno)** | Conjunto de teste com as espécies do catálogo; comparação de 2 ou 3 mecanismos; precisão por nível (espécie, gênero, família), custo por tentativa, tempo de resposta. **Sem público** | C0 parcial (fotos de teste próprias ou licenciadas) |
| C2 | **Protótipo de telas A/B/C** | Wireframes dos três casos e textos de limite (rochas, microrganismos) | — (pode ser feito já) |
| C3 | **Conta do adulto + perfis infantis** | Login só do adulto, perfis sem e-mail, Meu Bolso sincronizado com consentimento, exclusão de conta fácil | C0 |
| C4 | **Reconhecimento em teste fechado** | Só para adultos convidados, com limite de uso; mede tentativas por confirmação, custo e satisfação | C1, C3 |
| C5 | **Contribuições** | Envio com licença escolhida pelo adulto, fila de revisão, estados (recebida → aguardando revisão → identificada → vinculada / não aproveitada), ligação por táxon | C3 e revisor (❓) |
| C6 | **Teste de preço ético** | Entrevistas e lista de espera "em teste, sem cobrança"; **sem cobrança real** | Dados de custo da C4 |

**Ordem sugerida:**
1. A1 → A2 → A3, os alicerces;
2. B1 e C2 em paralelo (baratos);
3. A5 → A6;
4. A7, assim que houver revisor;
5. o restante conforme as respostas das pendências.

## 3. Backlog do 3D

> Todos os itens estão **planejados, não implementados**.
> Antes de modelar, cada item passa pela validação abaixo. O que está em "a validar" são perguntas para conferir em fonte e com especialista, **não** fatos já confirmados para o app.

**Validação obrigatória de cada item:**
1. Espécie e casta definidas.
2. Fontes da anatomia e do processo (artigo, livro didático, especialista).
3. Tipo de representação: **didática simplificada** ou **anatomia fiel**.
4. Roteiro em passos, em que a criança provoca cada etapa, nas versões Pequeno e Explorador.
5. Revisão do roteiro antes de publicar.

| Item | Espécie / casta | A validar antes de modelar | Representação provável | Depende de |
|---|---|---|---|---|
| **Digestão das formigas** | Saúva (*Atta*), operária | Bolsa infrabucal (filtro de partículas); o papo como "estômago social"; trofalaxia (passar alimento boca a boca); o que a adulta realmente come (seiva e fungo) e o que vai para as larvas | Didática | B3 |
| **Postura de ovos pelas rainhas** | Rainha de saúva e rainha de *Apis mellifera* | Ovários e espermateca; ovo fertilizado → fêmea e não fertilizado → macho (haplodiploidia); ritmo de postura de cada espécie; onde cada uma põe os ovos (câmara × alvéolo) | Didática | B2, B3 |
| **Ferrão da abelha** | *Apis mellifera*: operária (e comparação com a rainha) | Ferrão farpado da operária × liso da rainha; zangão sem ferrão; o que acontece quando a operária pica um mamífero; glândula e saco de veneno. Cuidado com o tom: não assustar, não tratar a morte da abelha como espetáculo | Didática, com partes externas fiéis | B2 |
| **Produção do mel (corpo e colmeia)** | *Apis mellifera*: operárias campeira e de colmeia | Papo de mel; enzimas acrescentadas ao néctar; passagem entre operárias; evaporação (abanar as asas); opérculo de cera; relação com o 3D da colmeia que já existe | Didática | B2 |
| **Estruturas de plantas** | ❓ Escolher uma espécie concreta (ex.: ipê ou feijão germinando) | Partes da flor; folha e estômatos; raiz; semente e germinação; fotossíntese como processo | Didática | A7 (ficha da planta) |
| **Mundo microscópico** | ❓ Escolher: uma bactéria (ex.: grupo das bactérias em bastonete), uma levedura e um vírus | Escala (comparar com um fio de cabelo); célula × vírus (vírus não é célula); estruturas mostradas (parede, membrana, flagelo, capsídeo); evitar medo e associação só com doença | **Sempre didática**, com aviso de escala e de cor (cores artificiais) | Ficha revisada da categoria |
| **Rochas e minerais** | ❓ Escolher: quartzo (mineral) e granito (rocha) | Forma do cristal; grãos de minerais no granito; formação (magma que esfria, camadas, pressão); ciclo das rochas | Didática; a forma do cristal pode ser fiel | Ficha revisada da categoria |

**Já existe e serve de modelo:**
- "Como nasce o canto" (cigarra), com os passos guiados;
- o "Por dentro" com corpo transparente;
- o seletor Pequeno / Explorador.

O formato está no topo de `js/bicho3d.js` (campos `dentro` e `processo`).

## 4. Como medir (sem coletar dados de crianças)
- **Fase sem servidor:** testes com turmas e famílias (roteiro de `PILOTO.md`). Observar:
  - se a criança acha as partes da ficha;
  - se entende "em revisão";
  - se volta ao Meu Bolso.
- **Reconhecimento (C1/C4):**
  - precisão por nível de identificação;
  - porcentagem de casos A, B e C;
  - tentativas até confirmar;
  - custo por tentativa e por confirmação;
  - tempo de resposta no 4G.
- **Contribuições (C5):**
  - minutos de revisão por contribuição;
  - porcentagem aproveitada;
  - duplicatas evitadas.
- **Preço (C6):** só depois dos números acima. Nenhum plano "ilimitado" antes de saber o custo por usuário ativo.
