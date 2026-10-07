# Proposta: catálogo da natureza, mapa de telas e adaptações

> Status: **💡 proposta para discussão**. Nada deste documento foi implementado. O site publicado continua igual.
> Direção e decisões em [`DIRECAO.md`](DIRECAO.md). Etapas em [`PLANO.md`](PLANO.md).

---

## 1. Auditoria: o que existe e o que se reaproveita

Leitura do código em outubro de 2026 (site estático, sem build, Three.js r147 em `vendor/`, PWA, publicado na Vercel a partir do branch `claude/fervent-ride-ckr2w7`).

| Peça | O que faz hoje | Para a enciclopédia | Esforço |
|---|---|---|---|
| `js/catalogo.js` | Dados dos 13 animais (`ANIMAIS`), `GRUPOS`, `DIETAS`, `NOMES_TAX`, `IUCN`, `MISSOES`, `TIPOS`, `COLECOES` | **Adaptar.** A estrutura por item (`id`, `nome`, `fotos`, `ficha`, `ciclo`, `curiosidades`, `comp`…) serve de base. Faltam `categoria`, `natureza`, `fontes`, `revisao` e `relacoes`. `ANIMAIS` aparece em 6 arquivos: manter um apelido de compatibilidade | Médio |
| `js/ficha.js` | Gaveta com abas Ficha, Vida, Sabia? e Real; som ou silêncio; "Encontrei um de verdade!" | **Adaptar** para as 6 partes (§4), mostrando só as que existem. A gaveta, o som, as fotos e o "Encontrei" continuam | Médio |
| `js/progresso.js` | Meu Bolso: descobertas por item, `vi` (observações reais), níveis, coleções, missão, avisos | **Reaproveitar quase todo.** Funciona por `id`, então serve para qualquer elemento. Trocar textos ("Novo bicho no bolso!") conforme a categoria e contar por categoria | Baixo |
| `js/home.js` + `index.html` | Hero com Curu, busca, chips de grupo, destaques, "Viu um bicho por aí?", Meu Bolso, palco 3D, catálogo, famílias e escolas | **Adaptar.** Chips em dois níveis (categoria → grupo), esconder categorias vazias, textos por contexto (§5) | Médio |
| `js/bicho3d.js` (motor 3D) + `bicho3d.html` | Página 3D reutilizável: formas, ações, Partes, Tamanho real, modos Por fora / Por dentro / Como funciona, Pequeno / Explorador, passos guiados | **Reaproveitar como está.** Os três modos já são as partes 2, 3 e 4 da ficha nova. Serve para planta, rocha ou micróbio: o modelo é que muda. Pode ganhar cenas novas (`micro`, `corte`) | Baixo |
| `js/core3d.js` | Escultura SDF + marching cubes, IK de pernas, texturas | **Reaproveitar.** Serve para cogumelos, sementes e seixos. Cristais e minerais pedem geometria facetada simples (já existe no Three.js) | — |
| `js/modelos/cigarra.js`, `aranha.js` | Modelos no motor novo | Manter. A cigarra é o modelo de referência do "Por dentro" | — |
| `formiga.html` + `js/formiga.js` (≈2.000 linhas), `abelha.html` (≈1.600 linhas) | 3D antigos, cada um com sua própria interface | **Manter funcionando.** Migrar para o motor `bicho3d` antes dos itens do backlog que dependem deles (digestão, postura, ferrão, mel) | Alto |
| `js/dados.js` | Fotos e dados do iNaturalist e resumo da Wikipédia, guardados 14 dias | **Reaproveitar** para plantas, fungos e alguns microrganismos (o iNaturalist cobre seres vivos). Rochas, minerais e fenômenos precisam de outra fonte (Wikipédia ou base mineralógica; conferir licença) | Baixo |
| `comparar.html` | Compara tamanho, parentesco, dieta, vida e casa de dois animais | **Restringir** a seres vivos (parentesco e dieta não fazem sentido para rocha). Mais tarde, comparadores próprios: dureza de minerais, tamanho no mundo microscópico | Baixo |
| PWA (`sw.js`, `manifest.webmanifest`, `ferramentas/atualizar-cache.py`) | Funciona sem internet | Reaproveitar. Com muitas fotos, o cache precisa ser **sob demanda** (guardar só o que foi aberto) | Médio, mais tarde |
| Splash, Curu, `css/marca.css`, ícones, `qr.html` | Identidade e abertura | Reaproveitar. Faltam ícones das categorias novas (planta, fungo, micróbio, rocha, fenômeno) em `js/icones.js` | Baixo |
| `docs/wireframes/` | Wireframes do Bicho no Bolso | Atualizar depois que este mapa de telas for aprovado | Baixo |

**Riscos encontrados na auditoria:**
- **Público:** a pasta `docs/` é publicada junto com o site (não há `vercel.json` que a esconda). Tudo o que estiver aqui, inclusive as hipóteses de preço, fica acessível em `formigas-beta.vercel.app/docs/…`.
  - 💡 Proposta: mover os documentos internos para fora do que é publicado, ou bloquear `/docs` na Vercel.
- **Revisão:** os textos atuais não têm fonte nem revisão registradas por ficha (ver `DIRECAO.md` §5).
- **Tamanho do catálogo:** `catalogo.js` com tudo dentro funciona até dezenas de itens. Com centenas, vale dividir em um arquivo por categoria, ou um JSON por ficha carregado sob demanda.

---

## 2. Modelo de catálogo

### Princípios
1. **Categoria ≠ taxonomia.** `categoria` e `grupo` são navegação editorial. `taxon` é ciência e só existe para seres vivos.
2. **Natureza do elemento explícita:** ser vivo, vírus, mineral, rocha ou processo. A interface usa isso para escolher palavras e partes (rocha não tem "ciclo de vida", tem "formação").
3. **Nível de identificação explícito:** espécie, gênero, família ou grupo. A "Joaninha" é uma ficha de família, e o reconhecimento por foto aponta para esse nível.
4. **Partes opcionais:** cada parte da ficha existe ou não. A interface mostra só o que existe.
5. **Fonte e revisão em todo conteúdo.**
6. **Compatível com o que existe:** os campos atuais continuam válidos durante a migração.

### Campos propostos por elemento

```js
{
  id: 'cigarra',                         // único e estável (usado no Meu Bolso)
  nome: 'Cigarra-gigante', art: 'a', curto: 'cigarra', emoji: '🦗', cor: '#d9e8c4',

  // navegação editorial
  categoria: 'animais',                  // animais | plantas | fungos | micro | rochas | fenomenos
  grupo: 'insetos',                      // subgrupo de navegação dentro da categoria
  tipo: 'cigarra',                       // (já existe) agrupa espécies parecidas

  // o que o elemento é, cientificamente
  natureza: 'ser-vivo',                  // ser-vivo | virus | mineral | rocha | processo
  nivel: 'especie',                      // especie | genero | familia | grupo  (só seres vivos)
  cientifico: 'Quesada gigas',
  taxon: { inat: 123456, tax: ['Arthropoda', 'Insecta', 'Hemiptera', 'Cicadidae'] },  // só seres vivos; "inat" é o ID de táxon do iNaturalist, para o reconhecimento e contra duplicatas

  // 1. O que é?
  resumo: 'A cantora do verão…', rapido: { tamanho, onde, come },

  // 2. Por fora (hoje: "ficha" e "fotos")
  porFora: { linhas: [['🔬', 'Nome científico', '…'], …] },
  fotos: [{ arquivo, autor, lic, especie, inat }],

  // 3. Por dentro (só se existir)
  porDentro: { tipo: '3d', representacao: 'didatica' },   // didatica | fiel

  // 4. Como funciona (processos; o ciclo de vida é um deles)
  processos: [
    { id: 'ciclo', titulo: 'Ciclo de vida', tipo: 'etapas', etapas: [['🥚', 'Ovo', '…'], …] },
    { id: 'canto', titulo: 'Como nasce o canto', tipo: '3d', representacao: 'didatica' }
  ],

  // 5. Relações (ligam fichas entre si; "alvo" é o id de outra ficha, ou texto se ela não existe)
  relacoes: [
    { rel: 'come', alvo: 'seiva-das-arvores', texto: 'Seiva das árvores' },
    { rel: 'vive-em', alvo: null, texto: 'Troncos e raízes' }
  ],

  // 6. Fontes e revisão
  fontes: [{ titulo: 'Wikipédia: Quesada gigas', url: '…', acesso: '2026-10' }],
  revisao: { estado: 'em-revisao', por: null, data: null },   // rascunho | em-revisao | revisado

  // mídia e extras (já existem)
  pagina: 'bicho3d.html?id=cigarra', som: null, silencio: null,
  curiosidades: ['…'], pista: '…', procurar: '…', comp: { … },

  // reconhecimento por foto (planejado)
  foto: { reconhecivel: 'sim', nota: null }   // sim | limitado | nao, com a explicação para "limitado" e "nao"
}
```

### Valores por categoria (exemplos)

| Categoria | `natureza` | `nivel` | Partes típicas | `foto.reconhecivel` |
|---|---|---|---|---|
| Animais | ser-vivo | especie ou familia | as 6 | sim |
| Plantas | ser-vivo | especie ou genero | O que é, Por fora (folha, flor, fruto), Por dentro (caule, semente), Como funciona (fotossíntese, polinização), Relações | sim |
| Fungos | ser-vivo | genero ou grupo | O que é, Por fora, Por dentro (hifas, micélio), Como funciona (decomposição), Relações | limitado: muitos cogumelos só se distinguem com exame; nunca dizer se é comestível |
| Micro (bactéria, protozoário) | ser-vivo | grupo | O que é, Por dentro (modelo didático), Como funciona, Relações | **nao** |
| Micro (vírus) | virus | grupo | O que é, Por dentro (modelo didático), Como funciona (infecção da célula), Relações | **nao** |
| Rochas e minerais | mineral ou rocha | — | O que é, Por fora (cor, brilho, cristais), Por dentro (grãos, camadas), Como funciona (formação, ciclo das rochas), Relações | limitado: "pode ser…" e um teste simples |
| Fenômenos | processo | — | O que é, Como funciona, Relações | nao (💡 talvez para nuvens e arco-íris, mais tarde) |

### Compatibilidade (migração sem quebrar)
- `ELEMENTOS` passa a ser a lista completa. `const ANIMAIS = ELEMENTOS` continua existindo enquanto houver código que usa o nome antigo.
- Itens sem `categoria` são tratados como `animais`.
- `ficha` continua sendo lida como `porFora.linhas`, e `ciclo` como o processo `ciclo`.
- `GRUPOS` vira `CATEGORIAS` com subgrupos:

  ```js
  CATEGORIAS = [{ id: 'animais', nome: 'Animais', icone: 'pata', grupos: [insetos, aracnideos, …] }, …]
  ```

- Os ids atuais **não mudam**, para não apagar o Meu Bolso de quem já usa.

---

## 3. Mapa de telas

Legenda: **✅** já existe · **🔧** existe e precisa adaptar · **💡** nova (proposta) · **❓** depende de decisão ou de servidor.

```
Splash (✅)
└─ Início (🔧)
   ├─ Busca (🔧) ──────────────────────────────┐
   ├─ Categorias (💡) → Lista da categoria (💡) ─┤
   ├─ Destaques / palco 3D (✅)                 │
   ├─ "Viu algo por aí?" (🔧)                   │
   │    ├─ Escolher da lista (✅ "Encontrei")   │
   │    └─ Reconhecer por foto (❓)             │
   │         ├─ A. provável + ficha ───────────┤
   │         ├─ B. provável, sem ficha → Guardar descoberta / Sugerir (❓)
   │         └─ C. inconclusivo → dicas / tentar de novo / buscar
   ├─ Meu Bolso (🔧, hoje é uma seção da home) │
   ├─ Famílias · Escolas (✅)                   │
   └─ Entrar (❓ conta do adulto + perfis)      │
                                               ▼
                         Ficha (🔧 gaveta; 💡 também página própria ficha.html?id=)
                         ├─ O que é?
                         ├─ Por fora
                         ├─ Por dentro ──┐
                         ├─ Como funciona ┼─→ 3D (✅ bicho3d.html?id=, com os 3 modos)
                         ├─ Relações → outras fichas
                         ├─ Fontes e revisão
                         ├─ Comparar (🔧 só seres vivos)
                         └─ Encontrei de verdade → Meu Bolso
Conta do adulto (❓) → Perfis das crianças (❓) · Minhas contribuições (❓) · Assinatura (❓ sem cobrança nesta fase)
Professor (💡) → Roteiros · Modo turma (hipótese do Plano Escola)
```

**Telas novas e por quê:**
- **Lista da categoria:** com seis categorias, a home não comporta tudo. A lista tem os grupos, um "Quem sou eu?" e a contagem do Meu Bolso daquela categoria.
- **Página de ficha (`ficha.html?id=`):** link direto e QR por ficha (material impresso, escola) e leitura confortável para adultos. Usa o mesmo `ficha.js` da gaveta.
- **Meu Bolso em página própria:** com várias categorias, a seção da home fica pequena. A página mostra separadores por categoria, as coleções e as descobertas sem ficha (caso B do reconhecimento).
- **Reconhecer, conta, perfis, contribuições:** só depois das decisões e revisões de `DIRECAO.md` §7–10.

---

## 4. Ficha: das abas atuais para as 6 partes

| Parte nova | Vem de | Quando aparece |
|---|---|---|
| 1. O que é? | `resumo`, `rapido`, foto principal, som/silêncio, "Encontrei" | Sempre |
| 2. Por fora | aba **Ficha** (`ficha`) + aba **Real** (fotos) + 3D modo "Por fora" | Sempre que houver texto ou foto |
| 3. Por dentro | 3D modo "Por dentro" (hoje só a cigarra) | Só se `porDentro` existir |
| 4. Como funciona | aba **Vida** (ciclo vira o 1º processo) + processos 3D | Se houver ciclo ou processo |
| 5. Relações | `comp.come`, `comp.casa`, `comp.social`, `relacoes`, coleções, outras espécies do mesmo `tipo`, "Comparar" | Se houver ao menos uma relação |
| 6. Fontes e revisão | créditos das fotos (hoje na aba Real), Wikipédia/iNaturalist, `fontes`, `revisao` | Sempre (no Pequeno, só um ícone discreto) |
| "Sabia?" | aba **Sabia?** (`curiosidades`) | 💡 Vira bloco dentro de "O que é?", ou "Por fora" no Pequeno, para não passar de 6 abas |

**Progresso (Meu Bolso):** os itens atuais (`ficha`, `vida`, `cur`, `real`, `3d`, `dentro`, `casa`, `vi`) continuam com os mesmos ids. Entram `relacoes` e `fontes` só se fizerem sentido como descoberta. 💡 Sugestão: "Fontes" **não** conta estrela, para não premiar clique vazio.

---

## 5. Adaptações por tela

### Início (home)
- **Título do hero:** 💡 "A natureza inteira no seu bolso." (quando a marca for validada). Até lá, mantém "Um mundo de bichos no seu bolso."
- **"Que bicho você quer conhecer?"** → 💡 "O que você quer descobrir hoje?"
- **Chips:**
  - primeiro nível com as categorias (ícones novos);
  - segundo nível com os grupos;
  - **categoria sem ficha publicada não aparece** (evita o beco sem saída do "em breve", ver `ESTRATEGIA.md` §1, achado 1);
  - 💡 uma linha "Em breve: plantas, fungos…" só em texto, sem cartões vazios.
- **Destaques:** misturar categorias quando existirem (um bicho, uma planta, uma rocha).
- **"Viu um bicho por aí?"** → 💡 "Viu algo legal por aí?", com "Encontrei!" e, quando existir, "📷 Reconhecer por foto".
- **Palco 3D:** sem mudança.
- **"Mais bichos para descobrir"** → 💡 "Mais para descobrir", mantendo "bichos" dentro da categoria Animais.
- **Famílias e Escolas:** textos com "natureza". As promessas continuam só sobre o que existe.

### Busca
- Busca em `nome`, `curto`, `cientifico`, `grupo`, `categoria` e sinônimos (💡 novo campo `outrosNomes`: "tatuzinho", "bicho-bola"), sem diferenciar acentos.
- Resultados agrupados por categoria, com o ícone da categoria.
- **Sem resultado:**
  - "Ainda não temos *X*." e as fichas parecidas;
  - ❓ quando existir, "Sugerir para o catálogo".
- 💡 Busca por pergunta simples ("o que come folha?") **não** nesta fase.

### Ficha
- As 6 partes (§4), com o selo de revisão visível ("em revisão" ou "revisado por…").
- No **Pequeno**:
  - até 3 partes;
  - letras maiores;
  - 🔊 "ouvir" (Web Speech API; o item de `ESTRATEGIA.md` §1 continua pendente).
- Textos com a palavra certa pela `natureza`:
  - "ciclo de vida" (ser vivo) × "como se forma" (rocha) × "como acontece" (fenômeno);
  - "Encontrei um de verdade!" × "Encontrei uma de verdade!" (pelo `art`);
  - "Vi acontecer!" (fenômeno).
- Selo de representação no 3D: "modelo didático (simplificado)" ou "anatomia fiel".
- **Segurança por categoria:**
  - fungos: "Nunca coma cogumelos do mato";
  - plantas tóxicas;
  - animais que picam (o aviso atual continua).

### Meu Bolso
- **"Novo bicho no bolso!"** → o texto depende da categoria:
  - "Novo bicho no bolso!" (animais);
  - "Nova descoberta no bolso!" (as outras categorias).
- **Contador "N de 13"** → contagem por categoria e total ("12 bichos · 1 planta").
- **Níveis:** contam todas as descobertas. Os nomes atuais ("Naturalista Mirim") já servem para natureza.
- **Coleções:** podem misturar categorias ("Quem vive no jardim": formiga, joaninha, ipê, orelha-de-pau).
- **Cartas "Quem sou eu?":** servem para qualquer categoria. As pistas precisam ser revisadas como o resto do conteúdo.
- **Descoberta sem ficha** (caso B): ❓ aparece no bolso como "descoberta especial" com o nome encontrado, sem estrelas de ficha.
- **Apagar o bolso:** continua tão fácil quanto hoje.
- Continua **local** até existir conta (e então sincroniza, com consentimento).
- **"Encontrei!" com cuidado:** "Observe sem tocar" vale para tudo. Para rochas: "Pegue só pedras soltas e devolva ao lugar."

---

## 6. Inventário de frases (não trocar mecanicamente)

| Onde | Hoje | Proposta | Regra |
|---|---|---|---|
| `index.html` hero | Um mundo de bichos no seu bolso. | A natureza inteira no seu bolso. | Só após validar a marca |
| `index.html` busca | Que bicho você quer conhecer? / Procurar um bicho… | O que você quer descobrir? / Procurar na natureza… | Geral |
| `index.html` chips | Grupos de bichos | Categorias | Geral |
| `index.html` momento | Viu um bicho por aí? / Encontrei um bicho! | Viu algo legal por aí? / Encontrei! | Geral |
| `index.html` catálogo | Mais bichos para descobrir / Nenhum bicho encontrado… / Ver todos os bichos | Mais para descobrir / Não achamos nada com esse nome… / Ver tudo | Geral |
| `home.js` bolso vazio | Seu bolso está vazio. Vamos encontrar o primeiro bicho? | …Vamos fazer a primeira descoberta? | Geral |
| `home.js` diálogo Encontrei | Que bicho você encontrou? | O que você encontrou? | Geral; a lista mostra categorias |
| `home.js` segurança | Alguns bichos picam ou mordem: chame um adulto. | **Mantém** dentro de Animais; frases próprias para fungos, plantas e rochas | Por categoria |
| `progresso.js` aviso | 🎉 Novo bicho no bolso! | Mantém para animais; "Nova descoberta no bolso!" para o resto | Por categoria |
| `ficha.js` | ⚖️ Comparar com outro bicho | Mantém em Animais; "Comparar com outro ser vivo" em plantas e fungos; some em rochas e fenômenos | Por natureza |
| `ficha.js` | Pessoas do mundo todo já registraram este bicho N vezes | "…registraram esta espécie/este grupo…" | Pelo `nivel` |
| `bicho3d.html` | "Por Dentro do Bicho" (nome do recurso) | ❓ "Por Dentro" (geral) e "Por Dentro do Bicho" para animais | Por categoria |
| `manifest.webmanifest`, `<title>`, splash, `qr.html` | Bicho no Bolso / Bichos 3D | **Não mudar** até a validação do nome | Decisão do fundador |
| Coleções e missões | Bichos do jardim, Bichos que cantam | **Mantém** (são de animais) | — |
