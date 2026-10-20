# Terra Codex · Brasil Vivo · fatia vertical Brasília/Cerrado

> Nova direção do Terra Codex (outubro de 2026): um RPG ecológico no **Brasil Vivo**, um Brasil ficcional feito de biomas reais. O jogador começa em **Brasília, a Cidade-Núcleo**, no Cerrado. Ninguém avança por capítulo: avança por descoberta, cuidado, transformação e restauração.
> O plano completo (diagnóstico, BioDex 3D, Viveiro, Ruído, dados, arquitetura e roadmap) está no documento do Claude "Terra Codex · Brasil Vivo — plano de adaptação".
> Está em `brasilvivo/` e é publicado em `/explorar/brasilvivo/`. O MVP anterior (`jogo/`, Vale Vivo) ainda está no ar; com a Sprint 2 pronta, ele pode sair quando for decidido.
> **Conteúdo em revisão científica.** Espécies, nomes científicos, distribuição e relações são rascunho (`revisao.status = 'rascunho'`) até passarem por revisão.

## Regra central

Ciência não aparece como lição: vira poder de mundo. Nenhum nível da BioDex sai de quiz.

Loop: Explorar → Observar → Encontrar → Cuidar → Transformar → Registrar → Ativar → Restaurar → Desbloquear.

Objetivo do primeiro ciclo: ver a borboleta → descobrir a lagarta → cuidar no Viveiro → ver a transformação → ativar no Jardim Polinizador → ver o jardim restaurar.

## Sprints

| Sprint | Tarefas | Estado |
|---|---|---|
| 1 · Base nova | T1 textos e mapa · T2 registro de conteúdo · T3 save v2 · T4 BioDex sem quiz | Feita |
| 2 · Ciclo da borboleta | T5 Viveiro · T6 lagarta na planta · T7 Jardim Polinizador | Feita |
| 3 · Encantamento e prova | T8 visor 3D · T9 modelo da borboleta · T10 teste do loop (Playwright) | A fazer |

Depois da Sprint 3, o **portão humano**: teste observado com 5 crianças, depois com 20, sem explicar demais. Medir se entendem o ciclo, se querem voltar, se contam o que aconteceu com a borboleta e se o adulto percebe valor educativo.

## O que a Sprint 1 entrega

| Sistema | Como está |
|---|---|
| Brasil Vivo | Abertura em Brasília; mapa ilustrado com 9 biomas (Cerrado ativo, os outros "em breve"). Sem OpenStreetMap, sem cidade do jogador, sem localização real |
| Áreas do Cerrado | Base Brasília, Horta Comunitária, Rota do Cerrado (vivas) · Vereda do Buriti e Jardim Polinizador (tomadas pelo Ruído, cinza) |
| Espécies (5) | Borboleta-azul, sapo-cururu, abelha jataí, formiga-saúva, lagartixa-de-parede. Fase que anda pela área + fases paradas no mapa (ovo, ninho no tronco, olheiros, ovos na parede) |
| BioDex sem quiz | 6 marcos por ação: Visto (viu uma fase), Encontrado (viu duas), Cuidado, Transformado, Conectado (viu o bicho fazendo o que faz ✨), Ativado (soltou ou reativou no mundo). Grade com silhuetas; ficha com nome popular, função, fases, relações e "Detalhes" com nome científico e selo de revisão |
| Viveiro | Ver "O que a Sprint 2 entrega" |
| Ruído | A Clareza de cada área é a fração das suas relações já ativadas. Área cinza esconde os bichos dela (o sapo some da vereda) |
| Save v2 | `localStorage` `terracodex2`. Na primeira vez, migra o Vale Vivo (`terracodex1` fica intacto): cartas viram espécies vistas, ovos do Ninho seguem no ciclo. A galinha não é do Cerrado e fica de fora |

| Visual | 3D estilizado com material "toon": céu em degradê com pôr do sol e estrelas, capim e flores, árvores tortas e cupinzeiros do Cerrado, buritis, Base Brasília modernista (praça, pavilhão curvo, casas sobre pilotis). Bichos e personagens desenhados em `brasilvivo/js/formas.js`; a BioDex mostra retratos renderizados desses modelos. Interface em vidro verde-escuro com botões redondos |

| Guia e recompensa | Jornada "O ciclo da borboleta" com o próximo passo sempre no HUD, seta-guia e farol até o alvo, celebração a cada marco, selo no Viveiro e resumo "Enquanto você esteve fora". Ver `docs/terra-codex-design-comportamental.md` |
| Design system | Tokens em `brasilvivo/css/tokens.css`, componentes em `jogo.css`, documentação viva em `brasilvivo/sistema.html` |

| Som, ajustes e ajuda | Som sintetizado (Web Audio) com efeitos pentatônicos e música em camadas pela Clareza; menu de Ajustes (texto, volumes, legendas de som, menos movimento, próximo passo, ajuda de caminho); seta e farol só quando a criança pede ou fica uns 20 s sem se aproximar; ipê-rosa na horta e árvore do jardim que amarela com a Clareza; replay de cada transformação no Viveiro. Kit de playtest em `docs/terra-codex-playtest.md`, rascunho de RIPD em `docs/terra-codex-ripd-rascunho.md` |

## O que a Sprint 2 entrega

| Sistema | Como está |
|---|---|
| T5 Viveiro | Substitui o Ninho (até 3 vidas). Cada fase mostra do que precisa em chips; a criança **arrasta** o item da bolsa até o nicho, ou só toca no item quando há um ser vivo esperando (com mais de um, toca no item e depois no nicho). Sombra e Silêncio são ferramentas e nunca acabam; folha, água, algas e pedra vêm do mundo. O que não ajuda volta para a bolsa com a frase do que ajuda; nada se perde, nada regride. Quando tudo chega, o tempo real faz a mudança |
| T6 Planta-hospedeira | Planta-hospedeira ao lado do ovinho na horta e outra na Rota do Cerrado, com uma lagarta comendo (marca nova, conta para Encontrado). Colher dá 2 folhas e a planta rebrota em ~40 s; a bolsa guarda até 5 de cada ("deixe o resto para a natureza"). Água no espelho d'água da praça; algas e pedras na beira do rio, para o ciclo do sapo |
| T7 Jardim Polinizador | Com a borboleta adulta acompanhando, entrar no jardim mostra **Soltar 🦋**. O clímax: onda dourada que sai do centro, as flores abrem em cascata conforme a onda passa, a câmera se afasta para mostrar o antes/depois (não se afasta com "Menos movimento"), todas as camadas da música tocam, e as borboletas passam a voar de flor em flor. Clareza 0% → 50%. A caixa-isca da jataí só reativa depois de a criança ver a jataí polinizando na horta; com ela, 100%: a trilha de flores até a Vereda do Buriti aparece e a Guardiã Ipê aponta o próximo ciclo (sapo) |
| Ativar no mundo | Genérico pelo `ativar` de cada relação: `soltar` (bicho do Viveiro solto na área certa) e `reativar` (objeto num ponto do mapa, com `requer`). Os bichos soltos continuam morando lá ao recarregar |
| Jornada | 7 passos: Dona Flor → ovinho → colher folhas → Viveiro → até virar borboleta → soltar no jardim → trazer as jataís |

O que saiu desta versão: quiz, Ecos, batalhas, chefe, obras com conta, mapa real.

## Versão 2D em pixel art (a principal)

Desde que foi escolhida, a 2D abre em `/brasilvivo/`. A 3D antiga continua em `/brasilvivo/3d/`, e `/brasilvivo/2d/` leva para a principal. O código da 2D fica em `brasilvivo/2d/js` e `brasilvivo/2d/css`. Mesmo conteúdo, mesmo save (`terracodex2`) e as mesmas regras: o laço `2d/js/jogo2d.js` saiu de `js/jogo.js` e muda só o que se vê. A interface (`js/ui.js`), o Registro, os dados do Cerrado, a BioDex, o som e os ajustes são os mesmos arquivos do 3D.

- `2d/js/pixel.js`: todos os sprites desenhados em código, sem imagem externa. Personagens e bichos em mapas de caracteres, árvores e pedras em bolhas sombreadas em 4 tons com pontilhado, contorno escuro automático, texturas de chão 16 × 16.
- `2d/js/mundo2d.js`: mundo visto de cima, 5 px por metro, com as mesmas coordenadas do 3D. O chão é uma grade de células de 4 px pintada em pedaços de 128 px guardados em cache. No Ruído as células ficam cinza; com a Clareza, cada célula fica verde quando a onda dourada passa por ela.
- `2d/css/pixel.css`: bordas, cantos e sombras em degrau, Pixelify Sans nos títulos. O texto corrido continua em Nunito.
- No clímax, a câmera desliza até o centro do jardim e volta. Com "Menos movimento", ela fica no jogador.
- As telas de início do 3D e do 2D têm um link para a outra versão.
- Vida no cenário: variedade de árvores do Cerrado (torta, pequizeiro de copa larga, árvore rala da seca), arbustos, capim e flores balançando com o vento, brilho na água, sombras de nuvem, moradores passeando perto de casa (param e se viram quando a criança chega), folhas ao colher, poeira ao andar no seco e pólen subindo das flores do jardim restaurado.
- BioDex em pixel art: cada bicho aparece num canteirinho de grama; os que ainda não foram vistos aparecem como silhueta cinza.

## Como os dados se organizam

- `brasilvivo/js/nucleo/registro.js`: `Especie()`, `Ciclo()`, `Relacao()`, `Area()`, `Bioma()`, `Npc()` e `Registro.validar()` (lista referências quebradas no console). Vocabulário fechado de relações (`poliniza`, `come`, `abriga`, `decompoe`, `dispersa`, `cultiva`) e de jeitos de ativar (`soltar`, `proteger`, `replantar`, `reativar`, `observar-habitat`, `posicionar`).
- `brasilvivo/biomas/cerrado/`: `bioma.js` (áreas, recursos, moradores), `especies.js`, `ciclos.js`, `relacoes.js`. Toda espécie e relação tem `revisao: { status, fonte, revisor }`.
- `brasilvivo/js/nucleo/estado.js` (save e eventos) e `biodex.js` (marcos e Clareza).
- Um bioma novo é uma pasta nova em `biomas/` com os mesmos arquivos; o núcleo não muda.

## Como testar

- Abrir `/explorar/brasilvivo/` (ou `brasilvivo/index.html` num servidor local).
- Para zerar: apagar `terracodex2` do `localStorage`.
- `window.__terra` expõe `estado`, `mundo`, `jog`, `salvar()`, `erros` (validação do registro), `Biodex`, `Ruido` `dar(i, recurso)`, `ativar(relacao)` e `acelerar(min)`, que adianta o relógio do Viveiro. O teste do loop inteiro (ovo → folha → Viveiro → borboleta → jardim 50% → jataí → 100%) roda com Playwright.
