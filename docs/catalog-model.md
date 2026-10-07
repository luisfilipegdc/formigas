# Modelo de catálogo, mapa de telas e adaptações

> Marcas: **DECIDIDO** · **PROPOSTA** · **HIPÓTESE** · **PENDENTE**. Nada deste documento está implementado.
> Direção em [`product-direction.md`](product-direction.md). Estado atual do código em [`technical-audit.md`](technical-audit.md).

---

## 1. Princípios

**DECIDIDO:**
1. **O catálogo é de itens da natureza, não de animais.** A entidade é genérica (conceitualmente `CATALOG_ITEM`).
2. **Universo ≠ taxonomia.** `universo` e `grupo` são navegação editorial. A classificação científica fica num campo próprio, adequado ao tipo de item.
3. **A interface só mostra o que existe.** Nenhum módulo, botão ou selo aparece sem conteúdo.
4. **Migração compatível:**
   - os 13 animais atuais continuam funcionando;
   - os ids não mudam;
   - o Meu Bolso de quem já usa é preservado;
   - nenhum registro é criado para "encher".
5. **Fonte e revisão em todo conteúdo.**

## 2. Modelo conceitual (proposta do Doug) e campos no código

O modelo conceitual do Doug, com o nome que cada campo teria no código atual:

| Conceito (`CATALOG_ITEM`) | Campo no código | Existe hoje? | Observação |
|---|---|---|---|
| `id` | `id` | ✅ | Estável. É a chave do Meu Bolso. Nunca muda |
| `slug` | `id` | ✅ | Hoje o id já é um slug (`cigarra`, `beijaflor`). PROPOSTA: não criar um segundo campo enquanto forem iguais |
| `type` | `universo` + `natureza` | ❌ | Dois campos, porque são coisas diferentes: **universo** é navegação (`animais`, `plantas`, `fungos`, `micro`, `rochas`, `fenomenos`); **natureza** é o que o item é (`ser-vivo`, `virus`, `mineral`, `rocha`, `processo`). Exemplo: o vírus está no universo `micro` com natureza `virus`; o líquen está em `fungos` com natureza `ser-vivo` |
| `title` | `nome` (+ `curto`, `art`) | ✅ | `curto` e `art` (o/a) já servem para as frases ("Encontrei uma cigarra!") |
| `scientificName` | `cientifico` | ✅ | Só para seres vivos e vírus |
| — | `nivel` | ❌ | **Novo:** `especie`, `genero`, `familia` ou `grupo`. A joaninha e o beija-flor já são fichas de família. É essencial para o reconhecimento por foto |
| `summary` | `resumo` (+ `rapido`) | ✅ | `rapido` tem chaves de animal. PROPOSTA: chaves por universo |
| `images` | `fotos` | ✅ | Já guarda autor, licença e ID no iNaturalist. Manter |
| `classification` | `classificacao` | Parcial (`comp.tax`) | Forma livre por natureza (§3) |
| `externalStructures` | `porFora` | Parcial (`ficha`) | As linhas atuais da aba Ficha viram "Por fora" |
| `internalStructures` | `porDentro` | Parcial (só no modelo 3D da cigarra) | Pode ser 3D, ilustração ou texto |
| `processes` | `processos` | Parcial (`ciclo`, `processo` da cigarra) | O ciclo de vida vira o primeiro processo |
| `relationships` | `relacoes` | Parcial (`comp.come`, `comp.casa`, `tipo`) | Ligam itens entre si (§3) |
| `experiences` | **derivado** | Parcial (`pagina`, `porDentro`, `som`) | Ver a regra abaixo |
| `sources` | `fontes` | ❌ | Lista de fontes do texto |
| `reviewStatus`, `reviewedAt` | `revisao: { estado, por, data }` | ❌ | `rascunho`, `em-revisao` ou `revisado` |

**PENDENTE:** idioma dos campos.
- PROPOSTA: **manter os nomes em português no código**, porque todo o código atual usa português (`nome`, `cientifico`, `fotos`) e trocar custaria uma migração sem ganho para o usuário.
- O modelo do Doug continua sendo a referência conceitual, com esta tabela como mapa.

### Regra de "experiências": derivar, não declarar
O objetivo do campo `experiences` é impedir botões sem conteúdo. Um sinal declarado à mão (`threeD: true`) pode ficar diferente do conteúdo real.

- PROPOSTA: a interface **calcula** as experiências a partir do que existe.

| Experiência | Aparece quando |
|---|---|
| Áudio | `som` existe (gravação real com licença). O `silencio` é texto, não áudio |
| 3D | `pagina` aponta para uma página 3D existente |
| Por dentro | `porDentro` tem conteúdo |
| Como funciona? | `processos` tem ao menos um item |
| Animações | processos com `tipo: '3d'` ou `'animacao'` |
| Relações | `relacoes` tem ao menos um item |

O motor 3D já segue essa lógica: só mostra "Como funciona?" quando o modelo tem `processo` (ver o detalhe em [`technical-audit.md`](technical-audit.md) §7).

## 3. Campos por tipo de item

```js
{
  id: 'cigarra', nome: 'Cigarra-gigante', curto: 'cigarra', art: 'a', emoji: '🦗', cor: '#d9e8c4',

  universo: 'animais', grupo: 'insetos', tipo: 'cigarra',
  natureza: 'ser-vivo', nivel: 'especie',
  cientifico: 'Quesada gigas',
  classificacao: { reino: 'Animalia', filo: 'Arthropoda', classe: 'Insecta', ordem: 'Hemiptera', familia: 'Cicadidae' },
  taxonInat: 123456,                 // ID de táxon no iNaturalist (reconhecimento e contra duplicatas). Só seres vivos

  resumo: '…', rapido: { tamanho, onde, come },
  porFora: [['🔬', 'Nome científico', '…'], …],      // hoje: "ficha"
  porDentro: { tipo: '3d', representacao: 'didatica' },          // didatica | fiel
  processos: [
    { id: 'ciclo', titulo: 'Ciclo de vida', tipo: 'etapas', etapas: [['🥚', 'Ovo', '…'], …] },   // hoje: "ciclo"
    { id: 'canto', titulo: 'Como nasce o canto', tipo: '3d', representacao: 'didatica' }
  ],
  relacoes: [{ rel: 'come', alvo: null, texto: 'Seiva das árvores' }],   // alvo = id de outro item, ou null se ainda não existe
  fontes: [{ titulo: 'Wikipédia: Quesada gigas', url: '…', acesso: '2026-10' }],
  revisao: { estado: 'em-revisao', por: null, data: null },

  fotos: [{ arquivo, autor, lic, especie, inat }],
  pagina: 'bicho3d.html?id=cigarra', som: null, silencio: null,
  curiosidades: ['…'], pista: '…', procurar: '…', comp: { … },
  foto: { reconhecivel: 'sim', nota: null }       // sim | limitado | nao (ver photo-identification.md)
}
```

**Classificação por natureza (PROPOSTA):**
- `ser-vivo`: domínio, reino, filo, classe, ordem, família, gênero, espécie (até o `nivel` da ficha);
- `virus`: grupo (ex.: tipo de material genético), sem reino;
- `mineral`: grupo mineral, fórmula química, sistema cristalino, dureza (Mohs);
- `rocha`: tipo (ígnea, sedimentar, metamórfica) e minerais principais;
- `processo`: nenhuma.

**Relações (PROPOSTA):**
- Tipos: `come`, `e-comido-por`, `poliniza`, `vive-em`, `forma`, `se-transforma-em`, `depende-de`, `decompoe`, `parecido-com`.
- Uma relação aponta para outro item quando ele existe; senão, fica só em texto, sem link e sem criar ficha.

**Módulos típicos por universo (PROPOSTA):**

| Universo | O que é | Por fora | Por dentro | Como funciona? | Relações |
|---|---|---|---|---|---|
| Animais | ✔ | ✔ | se houver | ciclo de vida + processos | ✔ |
| Plantas | ✔ | folha, flor, fruto | caule, semente | fotossíntese, polinização, germinação | ✔ |
| Fungos | ✔ | ✔ | hifas, micélio | decomposição, esporos | ✔ |
| Micromundo | ✔ | — (invisível a olho nu) | modelo didático | reprodução, infecção (vírus), fermentação | ✔ |
| Rochas e minerais | ✔ | cor, brilho, cristais | grãos, camadas | formação, ciclo das rochas | ✔ |
| Fenômenos | ✔ | — | — | ✔ (é o módulo principal) | ✔ |

**Compatibilidade (DECIDIDO como regra; o formato é PROPOSTA):**
- `ITENS` passa a ser a lista completa, com `const ANIMAIS = ITENS` mantido enquanto houver código que use o nome antigo.
- Um item sem `universo` é tratado como `animais`.
- `ficha` continua sendo lida como `porFora`, e `ciclo` como o processo `ciclo`.
- `GRUPOS` vira `UNIVERSOS` com `grupos` dentro.
- As chaves do aparelho (`progresso1` e as outras) ficam iguais.

## 4. Mapa de telas V2

Legenda: ✅ existe · 🔧 existe e precisa adaptar · 💡 nova · ❓ depende de decisão ou servidor.

```
HOME (🔧)
 ├─ Explorar a natureza (🔧 hoje: chips de grupos de animais)
 │   ├─ 🐾 Animais → mamíferos, aves, insetos, aracnídeos… (✅ conteúdo atual)
 │   ├─ 🌿 Plantas (💡)
 │   ├─ 🍄 Fungos (💡)
 │   ├─ 🔬 Micromundo (💡) → bactérias · outros microrganismos · vírus
 │   ├─ 💎 Rochas e minerais (💡)
 │   └─ 🌦️ Fenômenos naturais (💡)
 │
 ├─ BUSCA (🔧) → resultados mistos, agrupados por universo
 │
 ├─ FICHA (🔧 gaveta atual; 💡 também página própria ficha.html?id=)
 │   ├─ O que é?
 │   ├─ Por fora
 │   ├─ Por dentro       [só se existir] ─┐
 │   ├─ Como funciona?   [só se existir] ─┴→ 3D (✅ bicho3d.html, modos Por fora / Por dentro / Como funciona?)
 │   ├─ Relações → outras fichas
 │   └─ Fontes / revisão
 │
 ├─ DESCOBRIR POR FOTO (❓ ver photo-identification.md)
 │   ├─ resultado provável
 │   ├─ ficha existente
 │   ├─ ainda sem ficha
 │   └─ identificação inconclusiva
 │
 └─ MEU BOLSO (🔧 hoje é uma seção da home; 💡 página própria)
     ├─ descobertas (✅ cartas e progresso, generalizados)
     ├─ coleções (✅)
     ├─ missões (✅ "Pequenos do jardim")
     └─ contribuições (❓ só quando existirem contas)

Também: Comparar (🔧 só seres vivos) · Famílias e Escolas (✅) · Entrar (❓ conta do adulto + perfis)
```

**PENDENTE: universos sem ficha aparecem na home?** Hoje só Animais tem conteúdo.

| Opção | A favor | Contra |
|---|---|---|
| a) Mostrar os seis, com os vazios abrindo uma tela honesta ("Estamos preparando as primeiras fichas de Plantas" + Curu + link para Animais) | Comunica a nova abrangência | 5 de 6 portas levam a quase nada: é o "beco sem saída" que a auditoria comportamental já apontou ([`ESTRATEGIA.md`](ESTRATEGIA.md) §1, achado 1) |
| b) Mostrar só universos com ficha publicada | Toda porta leva a conteúdo | A home continua parecendo "só bichos" até a primeira ficha nova |
| c) **Recomendado:** mostrar Animais e cada universo **assim que tiver a primeira ficha revisada**, e lançar 1 planta, 1 fungo e 1 mineral junto com a home nova | A abrangência aparece de verdade, sem porta vazia | Depende de ter um revisor antes do lançamento da home |

## 5. Adaptações por tela

### Home
| Elemento | Hoje | Proposta | Status |
|---|---|---|---|
| Título do hero | Um mundo de bichos no seu bolso. | **Um mundo de natureza no seu bolso.** + "Explore animais, plantas, fungos e muito mais." (proposta do Doug) | PROPOSTA. Só listar universos que já tenham ficha, para não prometer o que não existe |
| CTA principal | Explorar bichos | 🔎 **Explorar a natureza** | PROPOSTA |
| CTA secundário | (Encontrei um bicho!, mais abaixo) | **O que encontrei?** | PROPOSTA. Enquanto não houver reconhecimento, ele abre o "Encontrei" atual (escolher da lista), com 👀 em vez de 📷. Usar 📷 sugeriria câmera, que ainda não existe |
| Curu | No hero, com binóculos | Igual | DECIDIDO |
| Chips | Insetos · Aves · Mamíferos… | Universos: 🐾 Animais · 🌿 Plantas · 🍄 Fungos · 🔬 Micromundo · 💎 Rochas e minerais · 🌦️ Fenômenos. Os grupos só aparecem ao entrar no universo | PROPOSTA. Visibilidade dos vazios: PENDENTE (§4) |
| Destaques e palco 3D | 4 animais; janela 3D | Igual; misturar universos quando houver | PROPOSTA |
| "Viu um bicho por aí?" | Encontrei um bicho! | "Viu algo legal por aí?" / "Encontrei!" | PROPOSTA |
| Catálogo | Mais bichos para descobrir | "Mais para descobrir" (dentro de Animais, "Mais bichos") | PROPOSTA |
| Famílias / Escolas | Textos sobre bichos | Textos sobre natureza, prometendo só o que existe | PROPOSTA |

**DECIDIDO:** a geração de imagens da home antiga está pausada até este redesenho ser aprovado.

### Busca
- **Já existe:** ignora acentos e maiúsculas; busca em nome, nome científico e resumo.
- **PROPOSTA:**
  - incluir `grupo`, `universo` e um campo novo de sinônimos (`outrosNomes`: "tatuzinho", "bicho-bola");
  - mostrar resultados mistos, agrupados por universo, com ícone;
  - quando não há resultado: "Ainda não temos *X*." + itens parecidos. "Sugerir para o catálogo" só quando existirem contribuições.

### Ficha
- **PROPOSTA:** os 6 módulos, renderizados só se existirem. De onde vem cada um:
  - **O que é?:** resumo + dados rápidos + "Sabia?";
  - **Por fora:** aba Ficha + fotos;
  - **Por dentro:** 3D;
  - **Como funciona?:** aba Vida + processos 3D;
  - **Relações:** come, casa, mesmo `tipo`, coleções, comparar;
  - **Fontes / revisão:** créditos das fotos, Wikipédia, iNaturalist, `fontes`, `revisao`.
- **PROPOSTA:** no 🧸 Pequeno, no máximo 3 módulos por vez, letras maiores e 🔊 ouvir.
- **PROPOSTA:** palavras pela natureza do item:
  - "ciclo de vida" (ser vivo), "como se forma" (rocha), "como acontece" (fenômeno);
  - "Encontrei um/uma de verdade!", pelo `art`.
- **PROPOSTA:** selo no 3D: "modelo didático (simplificado)" ou "anatomia fiel".
- **PROPOSTA:** segurança por universo:
  - fungos: "Nunca coma cogumelos do mato";
  - plantas tóxicas;
  - animais que picam (o aviso atual continua).
- **Progresso:** os itens atuais (`ficha`, `vida`, `cur`, `real`, `3d`, `dentro`, `casa`, `vi`) mantêm os ids.
  - PROPOSTA: "Fontes" não ganha estrela, para não premiar clique vazio.

### Meu Bolso
- **PROPOSTA:** "bichos encontrados" vira **descobertas**. Avisos por universo:
  - "Novo bicho no bolso!" (animais);
  - "Nova descoberta no bolso!" (o resto).
- **PROPOSTA:** contagem por universo ("12 bichos · 1 planta") no lugar de "N de 13".
- **PROPOSTA:** coleções podem misturar universos ("Quem vive no jardim").
- **DECIDIDO:** cartas, progresso, níveis e o "apagar o bolso" continuam como estão.
- **PROPOSTA:** "Contribuições" e "descobertas sem ficha" (caso B do reconhecimento) só aparecem quando existirem.
- **DECIDIDO:** o bolso continua **local** até existir conta. Depois sincroniza, com consentimento do adulto.

## 6. Escala do catálogo

- **HIPÓTESE:** `catalogo.js` único funciona até algumas dezenas de itens.
- **PROPOSTA** para centenas:
  - um índice leve (id, nome, universo, grupo, foto pequena) carregado sempre;
  - o conteúdo completo de cada ficha num arquivo próprio (`dados/itens/<id>.json`), carregado ao abrir;
  - no app sem internet, ficam guardadas só as fichas abertas.

## 7. Inventário de frases (não trocar mecanicamente)

| Onde | Hoje | Proposta | Regra |
|---|---|---|---|
| Hero | Um mundo de bichos no seu bolso. | Um mundo de natureza no seu bolso. | Copy nova da home (não é troca de marca) |
| Busca | Que bicho você quer conhecer? / Procurar um bicho… | O que você quer descobrir? / Procurar na natureza… | Geral |
| Chips | Grupos de bichos | Universos da natureza | Geral |
| Momento | Viu um bicho por aí? / Encontrei um bicho! | Viu algo legal por aí? / Encontrei! | Geral |
| Catálogo | Mais bichos para descobrir / Nenhum bicho encontrado… / Ver todos os bichos | Mais para descobrir / Não achamos nada com esse nome… / Ver tudo | Geral; dentro de Animais continua "bichos" |
| Bolso vazio | …Vamos encontrar o primeiro bicho? | …Vamos fazer a primeira descoberta? | Geral |
| Diálogo Encontrei | Que bicho você encontrou? | O que você encontrou? | Geral |
| Segurança | Alguns bichos picam ou mordem: chame um adulto. | Mantém em Animais; frases próprias em fungos, plantas e rochas | Por universo |
| Aviso | 🎉 Novo bicho no bolso! | Mantém em Animais; "Nova descoberta no bolso!" no resto | Por universo |
| Ficha | ⚖️ Comparar com outro bicho | Mantém em Animais; "…com outro ser vivo" em plantas e fungos; some em rochas e fenômenos | Por natureza |
| Ficha (Real) | …registraram este bicho N vezes | …registraram esta espécie / este grupo… | Pelo `nivel` |
| 3D | "Por Dentro do Bicho" | "Por dentro" (geral); "Por Dentro do Bicho" em Animais | PENDENTE |
| Título, manifesto, splash, QR | Bicho no Bolso / Bichos 3D | **Não mudar** até validar a marca | DECIDIDO |
| Coleções e missões de animais | Bichos do jardim, Bichos que cantam | Mantém | — |
