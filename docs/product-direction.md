# Direção do produto: enciclopédia interativa da natureza

> Atualizado em outubro de 2026.
> Marcas: **DECIDIDO** (vale a partir de agora) · **PROPOSTA** (sugestão a aprovar) · **HIPÓTESE** (precisa de teste ou de dados) · **PENDENTE** (falta decisão).
> Nada aqui descreve um recurso pronto, a não ser quando está escrito "**já existe**".

Documentos ligados:
- [`technical-audit.md`](technical-audit.md): o que o código tem hoje.
- [`catalog-model.md`](catalog-model.md): modelo do catálogo, mapa de telas e adaptações.
- [`photo-identification.md`](photo-identification.md): descobrir por foto e contribuições.
- [`backlog-3d.md`](backlog-3d.md): experiências 3D planejadas.
- [`ESTRATEGIA.md`](ESTRATEGIA.md) e [`PILOTO.md`](PILOTO.md): fase "catálogo de animais". Os princípios continuam valendo.

---

## 1. A mudança

```
ANTES: animal → ficha → 3D → carta
AGORA: descoberta da natureza → ficha enciclopédica → experiências disponíveis → relações → coleção
```

**DECIDIDO:**
- A visão é uma **enciclopédia interativa da natureza**, inspirada na abrangência de uma enciclopédia Barsa. Ela junta exploração visual, áudio, reconhecimento por foto e participação dos usuários.
- O catálogo passa a ter uma entidade genérica (conceitualmente `CATALOG_ITEM`) e deixa de supor que tudo é animal.
- A implementação é **por etapas** (§8):
  - nada de fichas vazias em massa;
  - nada de conteúdo inventado para encher o catálogo;
  - uma ficha só entra quando tem texto, fontes e fotos com licença.
- **A geração de imagens e assets da home antiga está pausada.** Primeiro vêm a arquitetura e a documentação, depois o redesenho da home para a nova abrangência.

**Já existe** (ver [`technical-audit.md`](technical-audit.md)):
- 13 animais com ficha, ciclo de vida, curiosidades e 3 fotos licenciadas cada;
- 3D da formiga, da abelha, da cigarra e da aranha;
- protótipo "Por dentro / Como funciona?" só na cigarra;
- Meu Bolso, cartas, níveis, coleções e "Encontrei um de verdade!", guardados só no aparelho;
- comparador, PWA sem internet, identidade visual e Curu.

## 2. Nome

- **DECIDIDO:** *Natureza no Bolso* é **nome de trabalho**.
- **DECIDIDO:** o produto **não é renomeado visualmente** agora.
- **DECIDIDO:** domínio, projeto na Vercel, repositório no GitHub, manifesto e textos com o nome **ficam intactos** até a validação de marca e domínio. O site continua como **Bicho no Bolso**.
- **DECIDIDO:** a arquitetura nova não se amarra ao nome. Campos, arquivos e funções novos usam `item` ou `elemento`, não "bicho". Onde o nome está escrito hoje: [`technical-audit.md`](technical-audit.md) §8.
- **PENDENTE:**
  - validação de marca (INPI) e domínio;
  - se `encontreumbicho.com.br` ainda vale.
- **PROPOSTA:** "Bicho no Bolso" pode sobreviver como nome do universo Animais dentro da marca maior.

## 3. Universos do catálogo

**DECIDIDO:** seis universos de **navegação editorial**. Não é uma árvore taxonômica.

```
CATÁLOGO
├── 🐾 Animais
├── 🌿 Plantas
├── 🍄 Fungos
├── 🔬 Mundo microscópico ("Micromundo" na interface)
│   ├── Bactérias
│   ├── Outros microrganismos (protozoários, microalgas…)
│   └── Vírus
├── 💎 Rochas e minerais
└── 🌦️ Fenômenos e processos naturais
```

**DECIDIDO:** dentro da ficha, cada item tem a classificação científica **apropriada ao seu tipo**:
- seres vivos: domínio, reino, filo, classe, ordem, família, gênero e espécie;
- minerais: grupo mineral e sistema cristalino;
- rochas: ígnea, sedimentar ou metamórfica;
- fenômenos: nenhuma.

Diferenças científicas que a interface precisa respeitar:
- **Vírus não são células.** O status de "ser vivo" é debatido, e a ficha diz isso.
- **"Micromundo" agrupa por tamanho**, não por parentesco. Bactérias, protozoários e vírus são muito diferentes entre si.
- **Fungos não são plantas.** Liquens são uma associação de fungo com alga ou cianobactéria.
- **Mineral ≠ rocha.** A rocha é formada por minerais.
- **Fenômeno é processo**, não objeto.

**PENDENTE:** onde entram fósseis e corpo humano, se entrarem.

## 4. Identidade

**DECIDIDO:**
- Curu continua mascote e guia, no hero com binóculos e em todos os universos.
- Paleta, tipografia, fotografia real, cards e personalidade visual continuam.
- **"Meu Bolso"** continua sendo a coleção pessoal. Agora guarda descobertas, não só bichos.
- Os textos mudam conforme o contexto, **sem substituição mecânica**:
  - "bicho" fica onde o assunto é animal;
  - "descoberta" e "natureza" entram onde o texto vale para qualquer universo.

O inventário das frases está em [`catalog-model.md`](catalog-model.md) §5.

## 5. A ficha enciclopédica

**DECIDIDO:** até seis módulos, **renderizados só quando o conteúdo existe**.

| Módulo | Conteúdo |
|---|---|
| O que é? | Abertura, foto e dados rápidos |
| Por fora | Aparência e estruturas externas |
| Por dentro | Corte ou transparência das estruturas internas |
| Como funciona? | Processos animados e narrados |
| Relações | Ligações com outros itens da natureza |
| Fontes / revisão | De onde vem cada informação e o estado de revisão |

- Uma ficha **não precisa de 3D** para existir.
- Nenhum botão "3D", "Por dentro" ou "Como funciona?" aparece sem conteúdo por trás.
- A regra técnica que garante isso está em [`catalog-model.md`](catalog-model.md) §2.

**Revisão:**
- **DECIDIDO:** todo conteúdo mostra seu estado de revisão.
- **PROPOSTA:** três estados: `rascunho` (não publicado), `em-revisao` (publicado com aviso) e `revisado` (com quem revisou e a data).

**Situação atual, dita com honestidade:**
- Os textos das 13 fichas foram escritos com apoio de IA, a partir de fontes gerais, e **não passaram por especialista**. Todos entram como `em-revisao`.
- O "Por dentro" da cigarra é **representação didática simplificada**.

## 6. Públicos e acesso

**DECIDIDO:**
- **Explorar sem cadastro, sempre.** Catálogo, fichas, 3D e Meu Bolso local funcionam sem conta.
- **Conta só do adulto**, com **perfis infantis sem e-mail próprio**.
- Três jeitos de usar:
  - adulto sozinho;
  - família, com o adulto mediando;
  - professor com a turma.
- **Prioridade técnica:** Safari no iPad, toque e funcionamento sem internet para tudo o que não depende de servidor.
- **Sem anúncios. Sem coleta de dados de crianças.** Hoje tudo fica no aparelho.
- Contas, fotos, contribuições e assinatura exigem servidor e **revisão de LGPD** (art. 14) e de proteção infantil **antes** de existir.

## 7. Modelo de negócio

> **HIPÓTESE em teste.** Nada de cobrança, planos ou preços publicados nesta fase.

- **HIPÓTESE:** assinatura da ferramenta de reconhecimento, a **R$ 9,90** ou **R$ 19,90** por mês.
- **PENDENTE:**
  - preço;
  - quantidade de reconhecimentos incluídos;
  - benefícios;
  - se contribuir exige assinatura.
- **DECIDIDO:**
  - não publicar planos definitivos;
  - não implementar cobrança real;
  - não oferecer uso ilimitado antes de medir o custo.
- **PROPOSTA:** avaliar como proposta paga o **conjunto**:
  - reconhecimento;
  - Meu Bolso sincronizado e perfis da família;
  - experiências educativas novas;

  em vez de vender só "reconhecimentos".
- **DECIDIDO:** a exploração educativa atual continua grátis.
- **PROPOSTA:**
  - testar o preço com entrevistas e uma lista de espera com o aviso "em teste, sem cobrança";
  - **nunca** com "porta falsa" (botão de assinar que não leva a nada), que reprova no teste ético de [`ESTRATEGIA.md`](ESTRATEGIA.md) §1.
- **HIPÓTESE paralela:** o Plano Escola e o piloto de [`PILOTO.md`](PILOTO.md).

O que medir antes do preço está em [`photo-identification.md`](photo-identification.md) §6.

## 8. Implementação em etapas

Cada etapa é pequena, publicável sozinha e não quebra o que existe. Os ids atuais ficam iguais (o Meu Bolso de quem já usa continua), o motor 3D fica intacto, e cada etapa é testada no Safari/iPad e no celular antes de publicar.

| Etapa | O que entrega | Pronto quando | Status |
|---|---|---|---|
| **0. Auditoria técnica** | Rotas, dados, componentes, assets, armazenamento, PWA, dependências, motor 3D | [`technical-audit.md`](technical-audit.md) | ✅ Feita, sem alterar código |
| **1. Documentação** | Estes cinco documentos, com as marcas DECIDIDO / PROPOSTA / HIPÓTESE / PENDENTE | Aprovados pelo fundador e pelo Doug | ✅ Escrita, aguardando aprovação |
| **2. Modelo de catálogo** | Item genérico com migração compatível: os 13 animais ganham `universo`, `natureza`, `nivel`, `fontes` e `revisao`; apelido `ANIMAIS` mantido; **nenhum registro novo inventado** | Site visualmente idêntico; Meu Bolso antigo preservado | Proposta |
| **3. Navegação** | Home, busca e filtros com os seis universos; animais continuam normais em Animais; textos novos (sem trocar o nome da marca) | Criança acha tudo o que achava antes | Proposta. Depende do redesenho da home |
| **4. Ficha enciclopédica** | Os 6 módulos, só os existentes; selo de revisão; bloco de fontes | As 13 fichas abrem sem módulo vazio | Proposta |
| **5. Meu Bolso** | "Bichos encontrados" vira "descobertas"; contagem por universo; coleções mistas; cartas e progresso preservados | Bolso antigo aparece igual, com separadores | Proposta |
| **6. Protótipo de reconhecimento** | Primeiro a UX e os estados A/B/C (wireframes e textos), depois o teste técnico interno de precisão e custo. Sem cobrança, sem prometer precisão | Ver [`photo-identification.md`](photo-identification.md) | Proposta. A parte técnica depende de servidor e da revisão de LGPD |
| **7. Contribuições** | Consentimento, estados de revisão, autoria, licença, deduplicação | Ver [`photo-identification.md`](photo-identification.md) | Pendente: depende de contas e de revisor |
| **8. Experimento comercial** | R$ 9,90 × R$ 19,90, limites e benefícios, com dados de custo e uso | Só depois da telemetria de custo | Hipótese |

**Trilhas paralelas pequenas (PROPOSTA):**
- **Conteúdo:** primeiras fichas fora de Animais (sugestão: 1 planta, 1 fungo, 1 mineral), sem 3D e **revisadas por especialista**. Um universo só aparece quando tem ficha publicada (ver a pendência em [`catalog-model.md`](catalog-model.md) §4).
- **3D:**
  - selo "modelo didático" ou "anatomia fiel";
  - migração da abelha e depois da formiga para o motor reutilizável;
  - backlog só depois de validado ([`backlog-3d.md`](backlog-3d.md)).
- **Técnica:**
  - teste de fumaça no repositório;
  - aviso de instalação sem depender de uma foto específica;
  - cache sob demanda quando o catálogo crescer;
  - alinhar `formiga.html`, `abelha.html` e `comparar.html` à identidade atual;
  - 🔊 ouvir a ficha no modo Pequeno.

## 9. Pendências do fundador

1. Validar o nome (marca e domínio).
2. Quem faz a revisão científica (biologia, micologia, microbiologia, geologia) e como ela é registrada.
3. Se universos ainda sem ficha aparecem na home ([`catalog-model.md`](catalog-model.md) §4).
4. Mecanismo de reconhecimento e orçamento para o teste de custo.
5. Se contribuir exige assinatura.
6. Preço e benefícios, depois das medições.
7. Se a criança pode usar a câmera no perfil infantil ou só o adulto.
8. Fósseis e corpo humano.
9. ~~Se `docs/` e `design/` continuam publicados no site~~ ✅ Decidido: ficam fora do site (bloqueados na Vercel).
