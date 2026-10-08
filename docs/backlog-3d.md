# Backlog do 3D

> **Tudo aqui está planejado, não implementado**, a não ser o que estiver marcado "**já existe**".
> Marcas: **DECIDIDO** · **PROPOSTA** · **HIPÓTESE** · **PENDENTE**.
> Estado do motor em [`technical-audit.md`](technical-audit.md) §7.

## 1. Regras

**DECIDIDO:**
- **Não mexer no motor 3D agora.** A camada de produto muda em volta dele.
- Antes de modelar, cada item passa pela validação da §2.
- Todo modelo informa se é **representação didática simplificada** ou **anatomia fiel**.
- Prioridade: Safari no iPad, toque, leveza.

## 2. Validação obrigatória de cada item
1. Espécie e casta (ou forma) definidas.
2. Fontes da anatomia e do processo: artigo, livro didático ou especialista.
3. Tipo de representação: didática ou fiel.
4. Roteiro em passos em que a criança **provoca** cada etapa, nas versões 🧸 Pequeno, 🧒 Explorador e 🔬 Cientista.
5. Revisão do roteiro antes de publicar. Até lá, o processo aparece como "em revisão científica".

## 3. Já existe
- **Motor reutilizável** (`js/bicho3d.js` + `bicho3d.html`): modos 🐾 Por fora · 🫀 Por dentro · ▶️ Como funciona?, seletor Pequeno / Explorador / Cientista e passos guiados. Formato dos campos `dentro` e `processo` no topo de `js/bicho3d.js`.
- **Cigarra:** "Por dentro" (corpo transparente com tímbalos, músculos, saco de ar, músculos das asas e tubo da seiva) e "Como nasce o canto". Protótipo, **didático**, marcado como "em revisão científica".
- **Formiga e abelha:** ✅ migradas para o motor reutilizável (outubro de 2026), com a colmeia aberta e o formigueiro em corte como abas de passeio. Os endereços antigos redirecionam.

- **🔬 Nível Cientista (outubro de 2026):** terceiro nível do seletor, para os anos finais (11+). Formiga, abelha, cigarra e aranha têm termo científico e texto técnico em todas as partes, nos passeios do formigueiro e da colmeia e nos passos de "Como nasce o mel" e "Como nasce o canto". O cartão de Partes mostra a classificação (filo › classe › ordem › família › espécie). **Textos em revisão científica.** Falta: fichas (`ficha.js`) e home ainda não têm versão Cientista.

## 4. Pré-requisitos (PROPOSTA)

| # | Item | Por quê |
|---|---|---|
| P1 | Selo "modelo didático (simplificado)" ou "anatomia fiel" no 3D | Transparência para pais e professores |
| P2 | ✅ Migrar a **abelha** para o motor reutilizável (feito) | Os itens de abelha abaixo dependem disso |
| P3 | ✅ Migrar a **formiga** para o motor reutilizável (feito; o formigueiro é uma aba) | Os itens de formiga abaixo dependem disso |

## 5. Itens planejados

As perguntas em "A validar" são para conferir em fonte e com especialista. **Não são fatos confirmados** para uso no app.

| Item | Espécie / casta | A validar antes de modelar | Representação provável | Depende de |
|---|---|---|---|---|
| **Digestão das formigas** | Saúva (*Atta*), operária | Bolsa infrabucal (filtro de partículas); o papo como "estômago social"; trofalaxia; o que a adulta come (seiva, fungo) e o que vai para as larvas | Didática | P3 |
| **Postura de ovos pelas rainhas** | Rainha de saúva e rainha de *Apis mellifera* | Ovários e espermateca; ovo fertilizado → fêmea, não fertilizado → macho (haplodiploidia); ritmo de postura; onde cada uma põe (câmara × alvéolo) | Didática | P2, P3 |
| **Ferrão da abelha** | *Apis mellifera*: operária, comparada com a rainha | Ferrão farpado da operária × liso da rainha; zangão sem ferrão; o que acontece quando a operária pica um mamífero; glândula e saco de veneno. Tom: sem assustar e sem fazer espetáculo da morte da abelha | Didática, com partes externas fiéis | P2 |
| **Produção do mel (corpo e colmeia)** — ✅ **protótipo feito (outubro de 2026)**, em revisão científica | *Apis mellifera*: operária campeira e de colmeia | Feito como "Como nasce o mel": flor → papo de mel → trofalaxia e enzimas → abanar as asas (evaporação) → opérculo de cera. **Falta validar** com especialista os textos e a simplificação (ex.: o papo aparece por "transparência" e a evaporação é mostrada com gotinhas) | Didática | — |
| **Estruturas de plantas** | PENDENTE: escolher uma espécie concreta (ex.: ipê, ou feijão germinando) | Partes da flor; folha e estômatos; raiz; semente e germinação; fotossíntese | Didática | Ficha revisada da planta |
| **Modelos do mundo microscópico** | PENDENTE: escolher uma bactéria (ex.: bastonete), uma levedura e um vírus | Escala (comparar com um fio de cabelo); célula × vírus; estruturas (parede, membrana, flagelo, capsídeo); evitar medo e associação só com doença | **Sempre didática**, com aviso de escala e de cores artificiais | Ficha revisada do Micromundo |
| **Rochas e minerais** | PENDENTE: escolher (ex.: quartzo e granito) | Forma do cristal; grãos de minerais no granito; formação (resfriamento do magma, camadas, pressão); ciclo das rochas | Didática; a forma do cristal pode ser fiel | Ficha revisada de Rochas e minerais |

**Também feito:** a 🟤 **própolis** na colmeia (resina das plantas tapando frestas e estreitando a entrada), com etiqueta no passeio. Texto em revisão.

## 6. Ordem sugerida (PROPOSTA)
1. P1, que é barato.
2. P2 e depois **produção do mel**, que reaproveita a colmeia existente.
3. **Ferrão** e **postura da rainha (abelha)**.
4. P3 e depois **digestão** e **postura (formiga)**.
5. Plantas, Micromundo e Rochas, só depois de existir ficha revisada em cada universo.
