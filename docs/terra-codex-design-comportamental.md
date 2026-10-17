# Terra Codex · Brasil Vivo · design comportamental e design system

> Auditoria pelo método de design comportamental (Rian Dutra: diagnóstico localizado → mecanismo → intervenção → medição, com o teste do impostor) aplicada à fatia vertical `brasilvivo/` em outubro de 2026. Público: crianças de 8 a 13 anos no celular e no iPad, com o adulto como quem decide.
> Design system: `brasilvivo/css/tokens.css` (tokens) e `brasilvivo/css/jogo.css` (componentes), com documentação viva em `brasilvivo/sistema.html` (publicada em `/explorar/brasilvivo/sistema.html`).

## Diagnóstico

O comportamento que se quer é a criança viver sozinha o ciclo ver a borboleta → achar o ovo → cuidar → ver a transformação → ativar no jardim, e voltar no dia seguinte porque quer ver o que mudou. Antes desta rodada, três coisas travavam: a criança não sabia para onde ir (o mundo é aberto e nada apontava o próximo passo), a recompensa era um aviso de 3 s que passava despercebido, e nada no jogo puxava a volta além da memória da criança. A hipótese central: o problema é **facilidade**, não motivação (Fogg). O jogo já é interessante; faltava tornar o próximo passo óbvio e o progresso visível.

## Achados e o que foi feito

### 1. Não há próximo passo visível — carga cognitiva, efeito Zeigarnik
- **Onde:** depois do diálogo da Guardiã Ipê, a criança fica na praça sem nenhuma indicação. A horta está a 85 m, fora da tela.
- **Por quê:** mundo aberto sem objetivo vira "e agora?". Uma tarefa começada e visível ("2 de 5") cria tensão produtiva para terminar.
- **Mudança (feita):** componente **Objetivo** no HUD com um passo por vez ("Passo 2 de 5 · Procure o ovinho nos canteiros da horta"); tocar abre a **Jornada** com a lista. Dados em `biomas/cerrado/jornada.js`.
- **Medir:** % de crianças que chegam ao passo 3 sem ajuda do facilitador (meta do teste: 4 de 5); tempo até o primeiro ovo no Ninho.

### 2. O alvo fica fora da tela — custo de busca
- **Onde:** Dona Flor, o ovo e o jardim ficam atrás da câmera ou longe.
- **Por quê:** criança de 8 anos não lê mapa mental do mundo; precisa de direção no próprio campo de visão.
- **Mudança (feita):** **Seta-guia** na borda da tela com a distância ("47 m") e um **farol** de luz dourada sobre o alvo, visível de longe. Some quando o alvo está à vista.
- **Medir:** tempo entre passos; número de giros de câmera antes de achar o alvo (observação).

### 3. A recompensa passa despercebida — pico-fim, reforço
- **Onde:** os marcos da BioDex viravam um toast de 3 s no topo.
- **Por quê:** a memória da sessão é feita dos picos. Sem um momento marcante ao viver algo, não há vontade de repetir.
- **Mudança (feita):** **Celebração**: cartão com o retrato 3D do bicho, a frase do que a criança fez ("Você viu a transformação") e o ponto do marco acendendo. Um por vez, em fila. Só dispara quando a criança viveu algo; nunca por sorteio.
- **Medir:** a criança consegue contar o que aconteceu com a borboleta (meta: 3 de 5 no primeiro teste); cliques na BioDex logo após a celebração.

### 4. Nada puxa a volta — gatilho interno, curiosidade
- **Onde:** ao reabrir o jogo, nada contava o que mudou no Ninho enquanto a criança esteve fora.
- **Por quê:** a volta saudável nasce da curiosidade ("minha lagarta virou casulo?"), não de alerta. O jogo precisa recompensar a volta com a verdade.
- **Mudança (feita):** diálogo **"Enquanto você esteve fora"** com o que realmente mudou ("Mudou! Borboleta-azul passou de ovo para lagarta.") e o **Selo** dourado no Ninho contando o que está pronto para cuidar. Sem notificação para a criança.
- **Medir:** volta em até 3 dias sem lembrete do adulto (meta: 10 de 20 no segundo teste). Contra-métrica: tempo de sessão não pode subir acima de 30 min de média.

### 5. O Ruído explica o problema mas não a saída — caminho infeliz
- **Onde:** ao entrar no jardim ou na vereda, a dica dizia "Os seres vivos sumiram".
- **Por quê:** constatar sem apontar saída gera frustração.
- **Mudança (feita):** dica por área com a pista da solução ("As flores daqui não abrem: falta quem leve pólen de flor em flor"; "Seu Rio sabe onde ficaram os ovos"). No jardim, se a borboleta já acompanha a criança, o jogo diz com honestidade que soltar chega na próxima atualização.
- **Medir:** crianças que saem da área cinza na direção certa (observação).

### 6. O primeiro toque não é óbvio — affordance
- **Onde:** o botão dourado aparece pela primeira vez sem explicação.
- **Mudança (feita):** dica única, uma vez só: "👉 Toque no botão dourado para observar."
- **Medir:** tempo entre o botão aparecer e o primeiro toque.

## Prioridade do que vem

1. **Teste observado com 5 crianças** antes de qualquer outra mudança comportamental (o dado ganha da intuição).
2. **T5 Viveiro**: arrastar o recurso certo (folha, sombra) em vez de um toque, para dar sensação de cuidado real (efeito Ikea) sem virar quiz.
3. **T7 Jardim**: o momento de restauração precisa ser o maior pico da fatia (flores abrindo em cadeia, música, a borboleta voando entre elas).
4. **Som**: confirmação sonora suave nos marcos e na transformação, com botão de mudo.

## Ética (teste do impostor aplicado)

| Mecanismo | É verdade? | Sobrevive dito em voz alta? | Sair é fácil? | Decisão |
|---|---|---|---|---|
| Objetivo e seta-guia | Sim | "Isso mostra o próximo passo" | Ignorar não custa nada | Mantido |
| Celebração de marco | Só dispara por algo vivido | "Comemora o que você fez" | Some sozinha | Mantido |
| Selo do Ninho | Conta real de quem está pronto | "Mostra quem precisa de você" | Nada acontece se ignorar | Mantido, dourado e nunca vermelho |
| "Enquanto você esteve fora" | Só mudanças reais | "Conta o que mudou" | Um toque fecha | Mantido |
| Sequência de dias, prêmio diário, contagem regressiva, bicho que morre | — | Não sobrevivem | — | **Proibidos** no jogo |

Regras fixas: sem notificação para a criança, sem ranking, sem perda por ausência, sem moeda, sem recompensa sorteada. O tempo do Ninho é curto no teste e passa a horas no lançamento, sempre sem punição.

## Design system em uma página

- **Tokens** (`css/tokens.css`): cor em dois níveis (base `--c-*` e semântica `--cor-*`, `--sup-*`, `--texto-*`), tipografia Nunito com texto corrido nunca abaixo de 16 px, espaço em base 4, raios grandes, duas sombras, movimento com respeito a `prefers-reduced-motion`, área tocável mínima de 44 px e camadas (`--z-*`).
- **Princípios**: dourado é tocar · vidro sobre o mundo, papel para ler · verde é vida, cinza-lilás é Ruído · um passo por vez · recompensa só pelo que a criança fez.
- **Componentes documentados**: Vidro, Etiqueta, Local, Objetivo, Botão redondo, Selo, Botão de ação, Seta-guia, Dica, Toast, Celebração, Diálogo, Painel, Botão, Pontos de marco, Carta, Ficha, Item do Ninho, Jornada, Mapa, Início.
