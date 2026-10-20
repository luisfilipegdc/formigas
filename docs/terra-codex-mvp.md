# Terra Codex · MVP do Capítulo 1: Vale Vivo

> **Fora do ar:** substituído pelo Brasil Vivo (`brasilvivo/`); `/explorar/jogo/` redireciona para lá. O texto abaixo é o registro histórico.
>
> Primeira fatia jogável (outubro de 2026). Está em `jogo/` e é publicada junto com o site, em `/explorar/jogo/`. Sem build: HTML, CSS e JavaScript com o Three.js que já está em `vendor/`.
> **Conteúdo em revisão científica.** O jogo não tem cobrança, conta, chat nem coleta de dados: salva só no aparelho (`localStorage`, chave `terracodex1`).
> O desenho completo está no GDD (documento do Claude) e o estado anterior do projeto no branch `voltaformiga`.

## O que o MVP prova

O ciclo **explorar → registrar → entender → conectar → construir → restaurar**, num mundo aberto pequeno, com Ecos (companheiros) e batalhas por turnos contra o Ruído.

| Sistema | No MVP |
|---|---|
| Mundo aberto | Terreno contínuo de 440 × 440 m em 3D, terceira pessoa, sem telas de carregamento. 6 regiões: Vila, Horta, Floresta Antiga, Margem do Rio, Outra Margem e Toca do Devorador. Tudo aberto desde o início |
| Ruído e Clareza | Quanto mais longe da vila, mais o Ruído gasta a Clareza. Em zero, o jogador volta para a vila. Ecos no time fazem a Clareza durar mais. Regiões restauradas deixam de ter Ruído |
| Dia, noite e chuva | Dia de 200 s. Lagartixa, sapo e escorpião só à noite; minhoca só depois da chuva |
| BioDex | 12 cartas com 4 níveis: Visto (observar) → Entendido (desafio) → Conectado (completar a cadeia) → Aplicado (usar numa obra) |
| Ecos | 8 cartas geram Ecos. Nascem em "Entendido", evoluem em "Conectado". Time de até 3. Primeiro Eco escolhido no início (abelha, formiga ou aranha) |
| Ruidosos | Medo ("todo inseto é praga"), Desperdício ("lixo some sozinho") e Boato ("lagartixa faz mal"). Batalha por turnos: o golpe que é o fato certo contra o erro dá dano dobrado. Vitória dá fragmentos de Codex |
| Obras | Horta, filtro do rio, ponte, abrigo de observação, trilha ecológica e Laboratório. Cada uma pede cartas e um desafio (medir a ponte, separar resíduos…) e pinta a região de verde |
| NPCs e missões | Dona Flor, Seu Rio, Tico e a Guardiã Ipê. 10 missões, em qualquer ordem depois da primeira |
| Chefe | Devorador de Habitat, em 5 fases: cada uma cai com uma conexão ecológica certa, depois os Ecos atacam. Vencer libera o Selo do Vale com a Guardiã |
| Ninho | O jogador nunca captura o bicho. Ele recolhe um ovo (galinha, com Dona Flor; sapo, na beira do rio; borboleta, na horta) e cuida dele em fases, com perguntas de cuidado e espera em tempo real (1 a 2 min por cuidado no MVP). Quando cresce, o bicho acompanha o jogador pelo vale e a carta sobe para "Entendido" |
| Mapa real | Painel com o mapa do mundo (azulejos do OpenStreetMap). O jogador escolhe a cidade (capitais); o Vale Vivo aparece nela e as outras 7 regiões em outras capitais, marcadas "em breve". Só a cidade é guardada. Para muitos jogadores, trocar os azulejos por um provedor próprio (política de uso do OSM) |
| Celular na vertical | HUD em duas linhas, botões menores, joystick e ação de contexto; golpes em uma coluna na batalha |
| Controles | Teclado (WASD ou setas, Shift corre, E ou espaço age), mouse para girar a câmera, joystick de toque e arrasto no celular e no iPad |

## O que ficou de fora (de propósito)

Amigos, trocas, Tempestade de Ruído, expedições no mundo real, montaria, classes, construção livre por blocos, outras regiões, cobrança. Tudo isso está no GDD como fase seguinte.

## Como testar

- Abrir `/explorar/jogo/` (ou `jogo/index.html` num servidor local).
- Para zerar o progresso: apagar a chave `terracodex1` do `localStorage`.
- `window.__terra` expõe `estado`, `mundo`, `jog` e `salvar()` para testes automáticos (Playwright com `--use-gl=swiftshader`).

## Próximos passos sugeridos

1. Testar com 20 crianças de 8 a 13 anos e medir os critérios do GDD (terminam a missão 3, voltam em 3 dias, chegam ao chefe).
2. Trocar as formas simples dos bichos pelos modelos 3D do `bicho3d` (abelha, formiga, cigarra, aranha, lagartixa, escorpião).
3. Revisão científica dos textos das cartas e dos desafios.
4. Som e música; animações de nascimento e evolução dos Ecos.
5. Salvar na conta da família (`web/`) em vez de só no aparelho.
