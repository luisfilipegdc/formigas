# Onboarding sem texto, controles touch/câmera 3D no mobile e orientação em mundo aberto — para Terra Codex · Brasil Vivo

Contexto do projeto: RPG ecológico 3D estilizado de mundo aberto, no navegador, para celulares em retrato e iPad, crianças de 8 a 13 anos. Hoje o jogo tem joystick virtual à esquerda, câmera girada arrastando na metade direita da tela, um botão de ação contextual dourado, um chip de objetivo "próximo passo" sempre visível, uma seta na borda da tela com a distância até um alvo fora de vista e um feixe de luz vertical sobre o alvo.

Nota sobre a pesquisa (outubro de 2026): várias buscas no WebFetch falharam com erro de DNS (gigazine.net, gmtk.substack.com, gamedeveloper.com, lisa-anthony.com). Por isso parte dos achados abaixo vem só de trechos de resultados de busca, não da leitura completa da página. Isso está indicado onde vale.

## 1. Ensinar sem texto (onboarding "jogando")

### Takeaway
As referências convergem num mesmo padrão: apresentar uma mecânica num espaço seguro em que dá para errar sem custo, deixar o jogador praticar, e só então variar ou combinar (é a estrutura kishōtenketsu). O texto é cortado ou trocado por arquitetura, objetos memoráveis e consequências visíveis. Os testes de jogo (playtesting) são o que valida se a lição foi entendida. Para crianças que leem devagar, a mesma lógica funciona com demonstração, voz e ícones no lugar de frases.

### Cited Findings
- **Super Mario Bros. 1-1 (1985).** Numa entrevista em vídeo à Eurogamer em 2015, Miyamoto e Tezuka contaram que a 1-1 foi pensada como fase-tutorial, com tudo o que o jogador precisa para "gradually and naturally understand what they're doing". — [MCV/UK](https://www.mcvuk.com/development-news/video-miyamoto-shares-his-level-design-secrets/); [My Nintendo News, 07/09/2015](https://mynintendonews.com/2015/09/07/miyamoto-and-takashi-tezuka-talk-about-the-creation-of-super-mario-bros-world-1-1/); [SoraNews24, 09/09/2015](https://soranews24.com/2015/09/09/super-mario-bros-creator-explains-how-and-why-he-designed-world-1-1-of-the-8-bit-classic-%E3%80%90video%E3%80%91/amp/)
- O primeiro Goomba pode matar o novato, mas é fácil de evitar pulando. Morrer nele uma vez ensina que pular importa. — [Wikipedia: World 1-1](https://wikipedia.com/wiki/World_1-1); [BGR](https://www.bgr.com/general/super-mario-bros-world-1-1-design/)
- Segundo um único relato secundário, o primeiro inimigo seria um Koopa, trocado pelo Goomba porque chutar o casco era complexo demais para uma primeira lição. Fonte fraca, convém conferir no vídeo da Eurogamer. — [Game Developer](https://gamedeveloper.com/design/how-miyamoto-built-i-super-mario-bros-i-legendary-world-1-1)
- **Kishōtenketsu (Nintendo).** Koichi Hayashida, diretor de Super Mario 3D Land (2011) e 3D World (2013), estrutura as fases em 4 tempos: introdução segura, desenvolvimento, reviravolta e conclusão. A análise de Mark Brown (GMTK) observa que uma mecânica pode ser "taught, developed, twisted and then thrown away in about five minutes". — [MCV/UK sobre o GMTK](https://www.mcvuk.com/development/video-nintendos-level-design-secrets-in-four-steps); [Kotaku, citando entrevista à Gamasutra de 2012](https://kotaku.com/what-made-super-mario-3d-world-so-great-1691916400); [Wikipedia: Koichi Hayashida](https://en.wikipedia.org/wiki/Koichi_Hayashida). Ressalva: não achei fonte primária de Hayashida usando o termo kishōtenketsu.
- **Portal (Valve, 2007).** Nos playtests, um "shimmery force field" confuso foi trocado por vidro, e o mundo foi sendo simplificado para deixar as lições mais claras (cobertura de palestra da GDC 2008). — [Game Developer, "Best of GDC: The Secrets of Portal's Huge Success"](https://www.gamedeveloper.com/game-platforms/best-of-gdc-the-secrets-of-i-portal-i-s-huge-success)
- Os cenários iniciais de Portal eram poluídos e "grungy". Um testador passou meia hora tentando empurrar uma estante até um botão, sem notar a caixa ao lado. Isso levou ao visual branco e limpo, em que as peças do puzzle se destacam. — [GMTK, "Valve's Secret Weapon"](https://gmtk.substack.com/p/valves-secret-weapon) (secundário)
- Nos testes de Narbacular Drop, jogadores achavam que os portais levavam a outras dimensões. A solução foi começar numa sala visualmente distinta, com objetos memoráveis, para que o portal fosse lido como "o mesmo lugar visto de outro ângulo". — [Portal Wiki: developer commentary](https://theportalwiki.com/wiki/Portal_developer_commentary) (transcrição feita por fãs)
- Chet Faliszek (Valve) resumiu a lição dos playtests assim: "Playtesters aren't idiots, it's you". — [Game Developer](https://www.gamedeveloper.com/game-platforms/valve-s-faliszek-playtesters-aren-t-idiots-it-s-you)
- **Grande Planalto de BotW (2017).** É a área inicial e tutorial, "largely exploration based", e incentiva experimentar e seguir o próprio caminho. Muitos jornalistas a apontam como uma das melhores áreas de tutorial. — [Wikipedia: Great Plateau](https://en.wikipedia.org/wiki/Great_Plateau)
- Fujibayashi contou que juntou dados de playtest de cerca de 300 pessoas numa única tela: os jogadores se aglomeravam no Planalto e depois se dispersavam. Ele valorizava também ver o trabalho da equipe inteira em andamento. — [Zelda Universe, 12/01/2018](https://zeldauniverse.net/2018/01/12/breath-of-the-wild-devs-on-breaking-with-tradition-and-the-importance-of-playtesting/); [Miketendo64, GamesRadar, 07/01/2018](https://miketendo64.com/2018/01/07/interview-zelda-breath-of-the-wild-devs-talk-with-games-radar-about-rethinking-zelda-conventions/); [Nintendo Everything](https://nintendoeverything.com/zelda-breath-of-the-wild-devs-on-starting-out-with-10-people-showing-miyamoto-the-2d-prototype-great-plateau-made-first-more/)
- O Grande Planalto foi a primeira área construída. — [Nintendo Everything](https://nintendoeverything.com/zelda-breath-of-the-wild-devs-on-starting-out-with-10-people-showing-miyamoto-the-2d-prototype-great-plateau-made-first-more/)
- **Celeste (2018).** O prólogo introduz escalar e dash depois de andar e pular, e o resto do jogo pode ser feito com essas 4 mecânicas. Cada capítulo traz um perigo ou regra ambiental nova. — [Game Wisdom](https://game-wisdom.com/?p=21176); [The Pixels](https://the-pixels.com/?p=107268). Há também críticas de que algumas mecânicas não são ensinadas com clareza. — [RAWG reviews](https://rawg.io/games/celeste/reviews)
- **Crianças e toque.** Crianças erram alvos na tela muito mais que adultos, sobretudo alvos pequenos, e o efeito é mais forte no grupo de 7 a 10 anos (Anthony et al., 2013, cerca de 70 participantes). — [Anthony et al., JPUC 2013](https://lisa-anthony.com/wp-content/uploads/2013/04/anthony-et-al-jpuc2013.pdf)
- Habilidade motora fina e função executiva têm correlação negativa moderada com a taxa de erro de toque (crianças de 4 a 7 anos, Chen et al., ICMI 2020). — [Chen et al. 2020](https://init.cise.ufl.edu/wp-content/uploads/sites/378/2017/03/chen-et-al-ICMI2020.pdf)

### Inferences
- **Sugestões para Terra Codex:**
  1. **"Clareira 1-1".** A primeira área deve ser pequena e fechada por relevo natural (vale, rio, encosta), como o Planalto. Ela deve conter as 3 ações do jogo (andar, olhar, ação dourada) e uma ameaça inofensiva que "ensina errando" sem punição: um espinho que só empurra, sem tirar vida.
  2. **Kishōtenketsu por bioma.** Cada mecânica ecológica (plantar muda, limpar rio, seguir rastro de animal) passa por 4 tempos: apresentar num local seguro, repetir com variação, aplicar uma reviravolta (chuva apaga as pegadas) e combinar.
  3. **Demonstrar em vez de explicar.** Um NPC-animal guia (uma ararinha, por exemplo) executa a ação primeiro, e a criança imita. O botão dourado pulsa só quando a ação é possível.
  4. **Voz e ícone no lugar de texto.** O chip "próximo passo" deve ser principalmente um ícone com narração curta em PT-BR, que repete quando tocado, e não uma frase escrita.
  5. **Seguir o processo da Valve.** Observar crianças de 8 anos jogando sem ajuda e anotar onde travam. Se travam, o problema está no design, não na criança.
  6. **Cenário limpo nas áreas de lição.** Pouca poluição visual, com o objeto interativo contrastando com o fundo (lição do Portal).

### Gaps
- Não consegui ler a entrevista original da Eurogamer (2015), nem fonte primária sobre Celeste (não achei GDC ou postmortem de Maddy Thorson sobre o tutorial).
- Não encontrei estudos específicos sobre onboarding por voz para crianças que leem devagar. As sugestões de voz e ícone acima são inferência.

## 2. Controles touch e câmera 3D no mobile

### Takeaway
O joystick flutuante (que nasce onde o polegar toca) se adapta melhor a mãos pequenas. As principais lacunas do esquema atual de Terra Codex são outras: falta modo de câmera auto-follow (com opção de desligar), alvos de toque grandes, opções de sensibilidade e uma forma de reduzir enjoo. Reviews de Sky mostram que, em 3D no touch, brigar com a câmera é a queixa número 1.

### Cited Findings
- **Joystick flutuante vs fixo.** Estudo pequeno (tese de 2023, n=11, jogo 3D em retrato) não achou diferença significativa entre os dois. O flutuante pontuou levemente melhor em facilidade de aprender (4,36 vs 4,07) e em fadiga (4,22 vs 4,09). — [Repositório UPI](https://repository.upi.edu/101077)
- Guias de desenvolvedores argumentam que o joystick flutuante serve a mãos pequenas e grandes igualmente, enquanto o fixo exige acertar o centro. Recomendam uma dead zone pequena, curva de resposta e esconder o stick quando inativo. — [Abratabia](https://www.abratabia.com/game-controls/virtual-joystick.php); [Bugnet](https://bugnet.io/blog/how-to-fix-mobile-virtual-joystick-feeling-bad) (fonte com interesse comercial)
- **Câmera no Roblox.** A Roblox Creator Hub expõe os modos de câmera touch Classic (segue o jogador sem girar sozinha), Follow (gira automaticamente quando o jogador anda para os lados) e Orbital. O padrão para o desenvolvedor é "UserChoice", ou seja, o próprio jogador escolhe. — [Roblox Creator Hub: DevTouchCameraMovementMode](https://create.roblox.com/docs/en-us/reference/engine/enums/DevTouchCameraMovementMode.md); [TouchCameraMovementMode](https://create.roblox.com/docs/en-us/reference/engine/enums/TouchCameraMovementMode.md)
- **Genshin Impact.** No mobile, a câmera é girada arrastando o dedo, com correção automática de ângulo em combate e ao navegar de barco. — [Lensviewing](https://lensviewing.com/how-to-change-camera-angle-genshin-impact/) (secundário). Uma crítica de 2021 apontou que o joystick é de posição fixa, não segue o polegar. — [Destructoid](https://vip-develop.destructoid.com/?p=260491)
- **Sky: Children of the Light (2019).** Reviews dizem que os controles touch são "passable at best" e que mirar a câmera brigava com o jogador. Os dedos tapam a tela e erram alvos. A Game Informer reduziu a nota de jogabilidade por causa dos desafios do touch. — [MobileSyrup, 28/07/2019](https://mobilesyrup.com/2019/07/28/sky-children-of-the-light-game-of-the-week/); [Macworld](https://www.macworld.com/article/3411177/sky-children-of-the-light-is-a-stunning-reminder-that-we-need-more-controller-support-in-ios-games.html); [Game Informer review](https://gameinformer.com/review/sky-children-of-the-light/the-next-logical-leap)
- **Alto's Adventure (2015).** É um jogo de "one-touch" jogável quase todo com uma mão: o personagem anda sozinho, um toque faz pular e segurar o dedo faz backflip. — [AppUnwrapper, 19/02/2015](https://appunwrapper.com/2015/02/19/altos-adventure-review/); [App Store](https://apps.apple.com/app/id1576663233)
- **Alvos de toque.** Apple HIG pede no mínimo 44×44 pt e Material Design pede 48×48 dp. O WCAG 2.2 pede 24×24 CSS px no nível AA (2.5.8) e 44×44 no AAA (2.5.5). Recomenda-se cerca de 8 dp de espaço entre alvos. — [OpenReplay](https://blog.openreplay.com/improving-tap-targets-mobile-ux/); [specification.website](https://specification.website/spec/accessibility/touch-target-size/). Ressalva: não consegui confirmar na página primária da Apple, porque o WebFetch de [developer.apple.com/design/human-interface-guidelines/accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility) não retornou conteúdo. Os números 44 pt e 48 dp são amplamente citados, mas foram verificados só de forma secundária.
- **Crianças erram mais.** Num piloto com alvos de 20 a 100 px, os toques das crianças caíram fora do alvo 46% das vezes, contra 32% dos adultos (Brown & Anthony, CHI 2012). — [Brown & Anthony 2012](https://lisa-anthony.com/wp-content/uploads/2012/03/brown-and-anthony-chi2012eist.pdf). Uma síntese de 6 estudos com 116 crianças traz recomendações de design. — [Anthony et al., IJHCS 2019](https://init.cise.ufl.edu/wp-content/uploads/sites/378/2019/03/anthony-et-al-IJHCS2019-MTAGIC-final-preprint.pdf). A lei de Fitts com a largura nominal do alvo modela bem o toque infantil (n=54, idades 5–10, R²=0,93). — [Woodward et al., AVI 2020](https://init.cise.ufl.edu/wp-content/uploads/sites/378/2021/05/woodward-et-al-AVI2020.pdf)
- **Enjoo e câmera.** As Xbox Accessibility Guidelines recomendam evitar shake, bobbing e motion blur, ou permitir desligá-los. Também pedem sensibilidade horizontal e vertical ajustável e a opção de desativar o movimento automático da câmera. — [Xbox XAG 117](https://devdocs.xbox.com/gaming/accessibility/xbox-accessibility-guidelines/117)
- As Game Accessibility Guidelines pedem FOV padrão adequado ao contexto de visualização (cerca de 60° em TV, 90° em monitor) e, no nível intermediário, FOV ajustável. Pedem também evitar diferença entre o input e o movimento da câmera. — [GAG](https://gameaccessibilityguidelines.com/?p=21); [GAG](https://gameaccessibilityguidelines.com/?p=3278)
- O enjoo é mais provável quando o jogador perde o controle da câmera, então devolver esse controle ajuda. — [Can I Play That?](https://caniplaythat.com/?p=4541)

### Inferences
- **Sugestões para Terra Codex:**
  1. **Joystick flutuante** na metade inferior esquerda: nasce onde o polegar toca, com raio visível de cerca de 120–140 px CSS, dead zone pequena (aproximadamente 10%) e esmaecido quando parado. É inferência a partir dos guias e do estudo n=11.
  2. **Auto-follow como padrão para 8–10 anos.** A câmera volta suavemente para trás do personagem depois de uns 1,5 s sem arrastar (como o modo Follow do Roblox). O arrasto manual à direita sobrescreve o auto-follow. Incluir um toggle "câmera automática" e sensibilidade ajustável (XAG 117).
  3. **Botão dourado com 64–80 px CSS**, bem acima dos 44 pt e 48 dp mínimos, porque crianças de 7–10 anos erram muito mais. Posicionar na zona do polegar direito, longe das bordas e do gesto de "home" do iOS, com raio de toque maior que o desenho visível.
  4. **Modo "um polegar" em retrato.** Tocar no chão ou no feixe de luz para ir até lá (tap-to-move com pathfinding), no estilo "uma ação" do Alto. Assim a criança pode jogar só com uma mão, segurando o celular com a outra.
  5. **Conforto.** FOV um pouco maior em retrato, sem head-bob, sem shake por padrão. A câmera não deve atravessar paredes nem dar saltos bruscos: aproximar de forma suave quando há colisão, ou deixar a folhagem translúcida. A colisão da câmera não foi pesquisada a fundo; isso é inferência a partir das diretrizes de controle e enjoo.
  6. **Assistências de mira e ação.** O botão dourado faz "snap" para o objeto interativo mais próximo à frente, equivalente ao aim assist. Ações de "segurar" devem ter alternativa de "tocar uma vez".

### Gaps
- Não encontrei fonte primária (talk ou blog oficial) sobre os controles touch de Sky, Pokémon GO, Monument Valley ou Genshin. Monument Valley (tap-to-move) e Pokémon GO (movimento via GPS, interação só por toque e swipe) não puderam ser documentados com URL nesta sessão.
- Não verifiquei a página primária da Apple HIG nem a do Material Design (falha de fetch).
- Não achei estudos específicos sobre camera collision em mobile, nem estudos com crianças comparando joystick e tap-to-move.

## 3. Orientação e navegação em mundo aberto

### Takeaway
BotW guia por "gravidade" de pontos de interesse visíveis (torres, santuários, triângulos de relevo que escondem e revelam). Ghost of Tsushima e Firewatch trocam o minimapa por guias diegéticos (vento, mapa e bússola) e oferecem opção de desligar ajudas. Para crianças, o melhor é combinar marcos fortes no cenário com uma ajuda escalonada: discreta primeiro, explícita só se a criança ficar parada ou perdida.

### Cited Findings
- **BotW, CEDEC 2017 (Japão, não GDC).** A Nintendo apresentou a "regra do triângulo": montanhas triangulares dão a escolha de escalar ou contornar, e escondem o que está atrás para surpreender. O relato veio de tweets de Matt Walker (Capcom). — [GIGAZINE, 04/10/2017](https://gigazine.net/gsc_news/en/20171004-breath-of-the-wild-design-secret); [Source Gaming, 25/11/2017](https://sourcegaming.info/2017/11/25/holism-breath-of-the-wilds-golden-triangles/)
- O GMTK descreve as torres Sheikah como waypoints que revelam o mapa e diz que os jogadores seguem a curiosidade de marco em marco ("gravidade"). — [GMTK, "How Nintendo Solved Zelda's Open World Problem"](https://gmtk.substack.com/p/how-nintendo-solved-zeldas-open-world); [transcrição Amara](https://amara.org/subtitles/eB3GnQWpxx4M/en/1/download/How%20Nintendo%20Solved%20Zeldas%20Open%20World%20Problem.en.txt)
- Uma análise na Game Developer observa que a maioria das formas do mundo de BotW é triangular. O termo "gravidade" vem do autor do blog (2019), não da palestra. — [Game Developer](https://gamedeveloper.com/design/breath-of-the-wild-open-world-analysis-gravity-to-go-forward); [Nintendo Everything](https://nintendoeverything.com/nintendo-on-the-behind-the-scenes-creation-of-zelda-breath-of-the-wild)
- **Ghost of Tsushima (2020).** O jogo eliminou o minimapa: o "Guiding Wind" aponta para o waypoint marcado no mapa. Houve duas palestras na GDC 2021: a parte técnica de Bill Rockenbeck e "Exploration in Ghost of Tsushima", de Parker Hamilton, sobre manter a exploração sem marcadores apoiando a fantasia do samurai solitário. — [GDC news](https://gdconf.com/news/see-how-ghost-tsushima’s-guiding-wind-came-life-gdc-2021); [GDC Vault: Blowing from the West](https://gdcvault.com/play/1027124/Blowing-from-the-West-Simulating); [GDC Vault: Exploration in GoT](https://www.gdcvault.com/play/1027399/Exploration-in-Ghost-of-Tsushima)
- Ponto negativo de acessibilidade: o vento branco perde contraste nas áreas nevadas do norte. — [Can I Play That?, 29/07/2020](https://caniplaythat.com/2020/07/29/ghost-of-tsushima-accessibility-review/)
- Ghost of Yōtei (02/10/2025) manteve o recurso. — [Gfinity](https://www.gfinityesports.com/article/ghost-of-yotei-keeps-one-of-tsushimas-best-features)
- **Firewatch (2016).** A navegação usa mapa de papel e bússola, com UI diegética sempre que possível. O ponto vermelho de "você está aqui" pode ser desligado. Uma crítica diz que esse marcador tira a sensação de se perder, e um jogador que o desligou se perdeu e se reencontrou pelos marcos. — [Game Developer](https://gamedeveloper.com/design/how-firewatch-s-ui-enhances-player-immersion); [GamingBolt](https://gamingbolt.com/firewatch-review); [Mike Pennisi](https://mikepennisi.com/blog/2022/review-firewatch/); [DualShockers](https://www.dualshockers.com/campo-santo-releases-printable-firewatch-maps-for-cooperative-playthrough-or-your-wall/)
- **A Short Hike (2019, IGF Grand Prize 2020).** O postmortem na GDC 2020, "Crafting a Tiny Open World", fala em guiar com "curiosity-inducing landmarks" e em barreiras naturais para controlar a progressão. O mundo foi inspirado em trilhas e marcos naturais da costa oeste. — [Podwise (listagem do vídeo, 27/03/2020)](https://podwise.ai/episodes/1459231); [PlayStation Blog, 05/08/2021](https://blog.playstation.com/2021/08/05/crafting-a-tiny-open-world-a-look-behind-the-scenes-at-the-creation-of-a-short-hike/); [IGF](https://igf.com/article/short-hike-wins-grand-prize-2020-independent-games-festival)
- **Journey (2012).** Chen descreve o deserto e a montanha como desenhados em torno do vínculo entre estranhos que seguem para o mesmo destino desconhecido. — [Push Square, 02/2012](https://www.pushsquare.com/news/2012/02/interview_thatgamecompany_journey); [Game Informer, 03/06/2011](https://www.gameinformer.com/b/news/archive/2011/06/03/jenova-chen-explains-journey.aspx?amp). Não encontrei fonte que confirme a montanha como "weenie" ou guia explícito.

### Inferences
- **Sugestões para Terra Codex:**
  1. **Weenie por bioma.** Uma árvore gigante (samaúma), uma cachoeira ou um tepui visível de qualquer ponto funciona como "norte" natural. O feixe de luz atual deve ser o último recurso, não o primeiro.
  2. **Triângulos e revelação.** Morros e dunas escondem o próximo ponto de interesse; ao subir, a criança vê 2 ou 3 novos alvos (escolha). Mirantes funcionam como "torres" que revelam uma parte do mapa ilustrado.
  3. **Guia diegético ecológico.** Borboletas, um bando de araras ou um rastro de vaga-lumes vão na direção do objetivo (equivalente ao vento de Tsushima). Garantir alto contraste em todos os biomas, para não repetir o problema da neve.
  4. **Ajuda escalonada para não carregar a criança no colo:** (a) só o marco e o guia diegético; (b) se ela ficar 20–30 s parada ou se afastando, a ararinha-guia fala e aponta; (c) só então aparece a seta de borda com distância; (d) o feixe de luz fica para quando ela já está perto ou pede ajuda. O chip "próximo passo" deve ser recolhível (tocar para expandir), em vez de sempre ocupar a tela.
  5. **Opção "explorador".** Permitir desligar a seta e o feixe, como o ponto vermelho de Firewatch, para crianças mais velhas.
  6. **Golden path suave.** Trilhas de terra batida, flores coloridas e luz quente na direção principal, com barreiras naturais (rio, mata densa) no lugar de paredes invisíveis, como em A Short Hike.

### Gaps
- Não consegui ler o texto completo da CEDEC 2017 (falha de DNS no Gigazine) nem os slides. Não confirmei os nomes dos palestrantes.
- Não achei fonte primária sobre o conceito "weenie" da Disney nem dados comparando bússola e minimapa.
- Não achei estudos sobre wayfinding com crianças em jogos 3D.

## 4. Acessibilidade de controles para crianças

### Takeaway
As diretrizes (Xbox XAG, GAG) pedem configurações de câmera, sensibilidade e movimento, e opção de desligar câmera automática e efeitos. A pesquisa com crianças indica alvos maiores e tolerância a toques imprecisos. Não encontrei, nesta sessão, fontes específicas sobre remapeamento ou jogo com uma mão em mobile.

### Cited Findings
- Fornecer sensibilidade de câmera horizontal e vertical, opção de desativar a câmera automática e de desligar shake e blur. — [Xbox XAG 117](https://devdocs.xbox.com/gaming/accessibility/xbox-accessibility-guidelines/117)
- Dar a opção de desligar efeitos pode ser "the difference between playable and unplayable". — [Can I Play That?](https://caniplaythat.com/?p=4541)
- A taxa de erro de toque está ligada à idade, à habilidade motora e à função executiva. — [Chen et al. 2020](https://init.cise.ufl.edu/wp-content/uploads/sites/378/2017/03/chen-et-al-ICMI2020.pdf); [Anthony 2013](https://lisa-anthony.com/wp-content/uploads/2013/04/anthony-et-al-jpuc2013.pdf)
- No WCAG 2.2, o critério 2.5.8 pede alvos de 24 px (AA) e o 2.5.5 pede 44 px (AAA). — [specification.website](https://specification.website/spec/accessibility/touch-target-size/)
- Genshin no iOS só aceita um tipo de input por vez, escolhido nas configurações. — [GameRevolution](https://www.gamerevolution.com/?p=661001)

### Inferences
- **Sugestões para Terra Codex:**
  1. Menu "Conforto" com ícones grandes: câmera automática liga/desliga, sensibilidade, tamanho dos botões (P, M, G), lado do joystick (para canhotos) e modo um polegar com tap-to-move.
  2. Tolerância de toque: raio de colisão do botão maior que o visual, sem ações de duplo toque ou gestos complexos. Quando o dedo cai entre dois alvos, aplicar "snap" ao alvo provável.
  3. Suporte a controle físico ou teclado no iPad.
  4. Prever o gesto do sistema iOS e Android nas bordas, deixando margem de segurança (safe-area) para o joystick e o botão.

### Gaps
- Não encontrei fontes sobre remapeamento de controles touch para crianças nem sobre jogo com uma mão em mobile. A página de input das Game Accessibility Guidelines não foi lida.
- Não achei estudos com crianças comparando joystick virtual e tap-to-move.
