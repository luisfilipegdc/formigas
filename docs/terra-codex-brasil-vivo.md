# Terra Codex · Brasil Vivo · fatia vertical Brasília/Cerrado

> Nova direção do Terra Codex (outubro de 2026): um RPG ecológico no **Brasil Vivo**, um Brasil ficcional feito de biomas reais. O jogador começa em **Brasília, a Cidade-Núcleo**, no Cerrado. Ninguém avança por capítulo: avança por descoberta, cuidado, transformação e restauração.
> O plano completo (diagnóstico, BioDex 3D, Viveiro, Ruído, dados, arquitetura e roadmap) está no documento do Claude "Terra Codex · Brasil Vivo — plano de adaptação".
> Está em `brasilvivo/` e é publicado em `/explorar/brasilvivo/`. O MVP anterior (`jogo/`, Vale Vivo) segue no ar até a Sprint 2 ficar pronta.
> **Conteúdo em revisão científica.** Espécies, nomes científicos, distribuição e relações são rascunho (`revisao.status = 'rascunho'`) até passarem por revisão.

## Regra central

Ciência não aparece como lição: vira poder de mundo. Nenhum nível da BioDex sai de quiz.

Loop: Explorar → Observar → Encontrar → Cuidar → Transformar → Registrar → Ativar → Restaurar → Desbloquear.

Objetivo do primeiro ciclo: ver a borboleta → descobrir a lagarta → cuidar no Viveiro → ver a transformação → ativar no Jardim Polinizador → ver o jardim restaurar.

## Sprints

| Sprint | Tarefas | Estado |
|---|---|---|
| 1 · Base nova | T1 textos e mapa · T2 registro de conteúdo · T3 save v2 · T4 BioDex sem quiz | Feita |
| 2 · Ciclo da borboleta | T5 Viveiro · T6 lagarta na planta · T7 Jardim Polinizador | A fazer |
| 3 · Encantamento e prova | T8 visor 3D · T9 modelo da borboleta · T10 teste do loop (Playwright) | A fazer |

Depois da Sprint 3, o **portão humano**: teste observado com 5 crianças, depois com 20, sem explicar demais. Medir se entendem o ciclo, se querem voltar, se contam o que aconteceu com a borboleta e se o adulto percebe valor educativo.

## O que a Sprint 1 entrega

| Sistema | Como está |
|---|---|
| Brasil Vivo | Abertura em Brasília; mapa ilustrado com 9 biomas (Cerrado ativo, os outros "em breve"). Sem OpenStreetMap, sem cidade do jogador, sem localização real |
| Áreas do Cerrado | Base Brasília, Horta Comunitária, Rota do Cerrado (vivas) · Vereda do Buriti e Jardim Polinizador (tomadas pelo Ruído, cinza) |
| Espécies (5) | Borboleta-azul, sapo-cururu, abelha jataí, formiga-saúva, lagartixa-de-parede. Fase que anda pela área + fases paradas no mapa (ovo, ninho no tronco, olheiros, ovos na parede) |
| BioDex sem quiz | 6 marcos por ação: Visto (viu uma fase), Encontrado (viu duas), Cuidado, Transformado, Conectado (viu o bicho fazendo o que faz ✨), Ativado (Sprint 2). Grade com silhuetas; ficha com nome popular, função, fases, relações e "Detalhes" com nome científico e selo de revisão |
| Ninho (provisório) | Cuidar não tem pergunta: um toque dá o que a fase precisa e o tempo real faz a mudança (conta com o jogo fechado). Vira Viveiro na Sprint 2 |
| Ruído | A Clareza de cada área é a fração das suas relações já ativadas. Área cinza esconde os bichos dela (o sapo some da vereda) |
| Save v2 | `localStorage` `terracodex2`. Na primeira vez, migra o Vale Vivo (`terracodex1` fica intacto): cartas viram espécies vistas, ovos do Ninho seguem no ciclo. A galinha não é do Cerrado e fica de fora |

O que saiu desta versão: quiz, Ecos, batalhas, chefe, obras com conta, mapa real.

## Como os dados se organizam

- `brasilvivo/js/nucleo/registro.js`: `Especie()`, `Ciclo()`, `Relacao()`, `Area()`, `Bioma()`, `Npc()` e `Registro.validar()` (lista referências quebradas no console). Vocabulário fechado de relações (`poliniza`, `come`, `abriga`, `decompoe`, `dispersa`, `cultiva`) e de jeitos de ativar (`soltar`, `proteger`, `replantar`, `reativar`, `observar-habitat`, `posicionar`).
- `brasilvivo/biomas/cerrado/`: `bioma.js` (áreas, recursos, moradores), `especies.js`, `ciclos.js`, `relacoes.js`. Toda espécie e relação tem `revisao: { status, fonte, revisor }`.
- `brasilvivo/js/nucleo/estado.js` (save e eventos) e `biodex.js` (marcos e Clareza).
- Um bioma novo é uma pasta nova em `biomas/` com os mesmos arquivos; o núcleo não muda.

## Como testar

- Abrir `/explorar/brasilvivo/` (ou `brasilvivo/index.html` num servidor local).
- Para zerar: apagar `terracodex2` do `localStorage`.
- `window.__terra` expõe `estado`, `mundo`, `jog`, `salvar()`, `erros` (validação do registro), `Biodex`, `Ruido` e `acelerar(min)`, que adianta o relógio do Ninho.
