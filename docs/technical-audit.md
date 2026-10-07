# Auditoria técnica do repositório (Etapa 0)

> Feita no checkout do repositório, no branch `claude/fervent-ride-ckr2w7`, em outubro de 2026. **Nenhum código foi alterado.**
> Marcas: **DECIDIDO** · **PROPOSTA** · **HIPÓTESE** · **PENDENTE**.
> Documentos ligados: [`product-direction.md`](product-direction.md) · [`catalog-model.md`](catalog-model.md) · [`photo-identification.md`](photo-identification.md) · [`backlog-3d.md`](backlog-3d.md).

## 1. Visão geral

| Aspecto | Situação |
|---|---|
| Tipo de site | Estático: HTML, CSS e JavaScript em scripts clássicos. Sem build, sem npm, sem framework, sem servidor próprio |
| Publicação | Vercel, a partir do branch `claude/fervent-ride-ckr2w7`. Endereço temporário: `formigas-beta.vercel.app`. `.vercelignore` e `vercel.json` mantêm `docs/` e `design/` fora do site |
| Arquivos versionados | 129 (≈ 6,8 MB sem `design/` e `docs/`) |
| Dependências | Three.js r147 (`vendor/three/`: `three.min.js`, `OrbitControls`, `RoomEnvironment`, `MarchingCubes`) e um gerador de QR (`vendor/qrcode.js`). Tudo dentro do repositório |
| Serviços externos | Google Fonts (Nunito; Baloo 2 nas páginas antigas), API do iNaturalist e API REST da Wikipédia em português. Nenhum exige chave ou cadastro |
| Testes automáticos | **Não há** no repositório. Os testes foram feitos com Playwright durante as sessões de trabalho, sem script guardado |
| Navegadores | Prioridade: Safari no iPad, com toque. Também funciona no celular e no computador |

## 2. Rotas (páginas)

| Página | Função | Scripts | Estilos | Identidade visual |
|---|---|---|---|---|
| `index.html` | Home: hero com Curu, busca, chips, destaques, "Viu um bicho por aí?", Meu Bolso, palco 3D, catálogo, famílias e escolas, splash | `splash-bichos`, `splash`, `catalogo`, `icones`, `dados`, `progresso`, `ficha`, `home`, `app` | `marca.css`, `catalogo.css`, `splash.css` | Atual |
| `bicho3d.html?id=` | Página 3D reutilizável (cigarra, aranha). Modos Por fora / Por dentro / Como funciona, Pequeno / Explorador | `catalogo`, `dados`, `progresso`, `ficha`, Three.js, `core3d`, `bicho3d`, `modelos/*`, `app` | `marca.css`, `bicho3d.css` | Atual |
| `formiga.html` | 3D da saúva: castas, formigueiro, passeio | `catalogo`, `dados`, `progresso`, `ficha`, Three.js, `formiga` (≈ 2.000 linhas), `app` | `formiga.css` | **Antiga** (não usa `marca.css`) |
| `abelha.html` | 3D da abelha: castas, flores, colmeia. Script e estilo **dentro do HTML** (≈ 1.600 linhas) | `core3d`, `catalogo`, `dados`, `progresso`, `ficha`, `app` | inline | **Antiga** |
| `comparar.html` | Comparador de dois animais | `catalogo`, `dados`, `app` | inline + Baloo 2 | **Antiga** |
| `qr.html` | Folha A4 com o QR do site | `qrcode`, `app` | inline + Baloo 2 | Mista (tem o logo novo) |

**Achado:** `formiga.html`, `abelha.html` e `comparar.html` ainda usam a identidade anterior (fonte, cores e botões próprios).
- PROPOSTA: alinhar à `marca.css` quando forem migradas.

## 3. Dados

| Arquivo | Conteúdo | Quem usa |
|---|---|---|
| `js/catalogo.js` (537 linhas) | `GRUPOS` (8 grupos de animais), `ANIMAIS` (13 itens, ≈ 40 linhas cada), `DIETAS`, `NIVEIS_TAX`, `NOMES_TAX`, `IUCN`, `MISSOES`, `TIPOS`, `COLECOES` | Todas as páginas, menos `qr.html` |
| `js/dados.js` | Busca no iNaturalist (foto, número de registros, taxonomia) e na Wikipédia (resumo), guardando 14 dias no aparelho | `index`, `bicho3d`, `formiga`, `abelha`, `comparar` |

**Acoplamento ao conceito "animal":**
- `ANIMAIS` aparece em 6 arquivos (`home.js` 11×, `progresso.js` 6×, `comparar.html` 3×, `ficha.js`, `bicho3d.js`, `catalogo.js`). Todos procuram por `id` (`ANIMAIS.find(a => a.id === id)`).
- Os campos do comparador (`comp.dieta`, `comp.tax`, `comp.iucn`) e `NOMES_TAX` só servem para seres vivos.
- `GRUPOS` é uma lista plana de grupos de animais. Não existe nível de "universo" ou "categoria".
- `rapido` tem chaves de animal (`tamanho`, `onde`, `come`).

**Conteúdo sem fonte nem revisão por ficha:**
- Os textos não guardam de onde vieram nem quem revisou.
- As fotos têm autor, licença e ID da observação no iNaturalist (`fotos[].inat`). Isso é bom e deve continuar.

**Escala:**
- Todo o catálogo é carregado em todas as páginas.
- HIPÓTESE: funciona bem até algumas dezenas de itens. Com centenas, precisa ser dividido (ver `catalog-model.md` §6).

## 4. Componentes de interface

| Componente | Arquivo | Reaproveitável para a natureza? |
|---|---|---|
| Ficha em gaveta (abas Ficha / Vida / Sabia? / Real, som ou silêncio, "Encontrei um de verdade!") | `js/ficha.js` | Sim, adaptando as abas para os 6 módulos |
| Cartões, carta "Quem sou eu?", diálogo "Encontrei", níveis, coleções, missão | `js/home.js` | Sim, com textos por categoria |
| Chips de grupo | `js/home.js` + `GRUPOS` | Precisa de dois níveis (universo → grupo) |
| Busca | `js/home.js` | Sim. Já ignora acentos e maiúsculas. Busca em nome, nome científico e resumo. Não tem sinônimos nem resultados agrupados |
| Avisos ("Novo bicho no bolso!"), níveis | `js/progresso.js` | Sim, com texto por categoria |
| Splash e boas-vindas | `js/splash.js`, `js/splash-bichos.js` | Sim (os bichos da splash são decorativos) |
| Ícones SVG | `js/icones.js` | Sim. Faltam ícones de planta, fungo, micromundo, rocha e fenômeno (já existe `folha`) |
| Tokens de cor e componentes | `css/marca.css` | Sim, como estão |

## 5. Armazenamento no aparelho

| Chave | Onde | O que guarda | Observação |
|---|---|---|---|
| `progresso1` | `localStorage` | Meu Bolso: descobertas por id (`3d`, `ficha`, `vida`, `cur`, `real`, `casa`, `dentro`, `vi`) | **Não renomear nem mudar os ids**: apagaria o bolso de quem já usa |
| `dados1:*` | `localStorage` | Respostas do iNaturalist e da Wikipédia (validade de 14 dias) | Pode ser descartado sem prejuízo |
| `bnb-idade` | `localStorage` | Modo Pequeno ou Explorador | — |
| `curu-dica-3d` | `localStorage` | Quantas vezes o Curu deu dica no 3D | — |
| `eub-splash` | `sessionStorage` | Splash já vista nesta sessão | Prefixo do nome antigo "Encontre um Bicho" |

- Nenhum dado sai do aparelho. Não há conta, cookie de rastreamento, analytics nem anúncio.
- DECIDIDO: as chaves são **identificadores internos**. Continuam como estão mesmo que a marca mude. Renomear só traria perda de dados.

## 6. App sem internet (PWA)

- `sw.js` guarda **todos** os 103 arquivos na instalação (≈ 4–5 MB). A lista é gerada por `ferramentas/atualizar-cache.py`.
- A estratégia é "responde com o guardado e atualiza por trás" (mesma origem). As fontes são guardadas na primeira vez. As APIs vão direto para a rede.
- Nome do cache: `animais3d-<versão>` (nome antigo, interno, inofensivo).
- **Achado:** `js/app.js` considera a instalação "pronta" quando encontra `img/animais/tartaruga-3.jpg` no cache.
  - PROPOSTA: trocar por uma marca no fim da instalação. Senão, o aviso quebra quando o catálogo mudar.
- **Achado:** guardar tudo não escala para uma enciclopédia.
  - PROPOSTA: guardar o "núcleo" (páginas, motor, Curu) e, sob demanda, cada ficha e foto aberta.

## 7. Motor 3D

| Peça | Situação |
|---|---|
| `js/core3d.js` | Escultura por SDF + marching cubes, IK de pernas, texturas de asa, cutícula, ruído. Genérico |
| `js/bicho3d.js` + `bicho3d.html` | Motor reutilizável. Cada modelo em `js/modelos/<id>.js` informa `cena`, `formas`, `acoes`, `construir`, `update`, `partes`, `dentro` e `processo`. O motor mostra a barra de modos só se o modelo tiver `dentro` ou `processo`, e esconde "Como funciona?" sem `processo`. **Detalhe:** um modelo com `processo` e sem `dentro` mostraria um botão "Por dentro" vazio. Hoje não acontece (só a cigarra usa) |
| `js/modelos/cigarra.js` | Adulta, ninfa e casca; canto e voo; **Por dentro** e **Como nasce o canto** (protótipo; conteúdo marcado como "em revisão científica"; representação didática) |
| `js/modelos/aranha.js` | Fêmea e macho na teia; andar, descer no fio, teia tremendo |
| `js/formiga.js`, `abelha.html` | Experiências 3D antigas, completas e funcionando, fora do motor reutilizável |

- DECIDIDO: **não mexer no motor 3D agora.**
- O motor não depende de o item ser animal. Uma planta ou uma rocha pode usar o mesmo formato de modelo.

## 8. Nome da marca no código

O nome aparece escrito diretamente em:
- `index.html` (6×), `abelha.html`, `formiga.html`, `comparar.html`, `qr.html`, `bicho3d.html`;
- `manifest.webmanifest` ("Bicho no Bolso" / "Bichos 3D");
- comentários em `marca.css`, `home.js`, `catalogo.js`, `icones.js`, `bicho3d.js`;
- os textos da home;
- `docs/wireframes`.

- DECIDIDO: **não renomear visualmente agora.**
- PROPOSTA: quando a marca for validada, a troca é localizada: títulos, manifesto, logo, splash e textos da home. A arquitetura nova não deve criar novas dependências do nome. Exemplos: não usar "bicho" em nomes de campos novos; usar `item` ou `elemento`.

## 9. Riscos e achados

1. **`docs/` e `design/` eram publicados no site.** ✅ **Resolvido (outubro de 2026):** `.vercelignore` tira as duas pastas da publicação, e `vercel.json` redireciona `/docs` e `/design` para a home como garantia extra. O material continua só no repositório.
2. **Conteúdo sem revisão registrada** (§3).
3. **Três páginas com a identidade antiga** (§2).
4. **Cache "tudo de uma vez"** e verificação de instalação frágil (§6).
5. **Sem testes automáticos.**
   - PROPOSTA: guardar no repositório um teste de fumaça (abrir cada página, abrir uma ficha, trocar os modos do 3D, sem erros no console) para rodar antes de cada publicação.

## 10. O que se reaproveita

| Reaproveitar como está | Adaptar | Migrar depois |
|---|---|---|
| Motor 3D (`core3d`, `bicho3d`, modelos), Curu, paleta e `marca.css`, fotos licenciadas com crédito, `dados.js`, PWA, Meu Bolso (`progresso.js`), splash, `qr.html` | `catalogo.js` (modelo genérico), `ficha.js` (6 módulos), `home.js` e `index.html` (universos, busca, textos), `comparar.html` (só seres vivos) | `formiga.html` e `abelha.html` para o motor reutilizável; cache sob demanda |
