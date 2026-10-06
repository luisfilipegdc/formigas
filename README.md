# 🐜 Museu das Formigas 3D

App web educativo para crianças de 5 anos explorarem formigas em 3D no iPad (Safari).
Não tem build, nem backend, nem anúncios, nem coleta de dados.

## Estrutura (um arquivo por função)

```
index.html            estrutura das telas (só HTML)
css/style.css         visual (cores, botões, layout iPad deitado/em pé)
js/species.js         ⭐ DADOS: espécies, tamanhos, curiosidades, cores e forma 3D
js/three-utils.js     peças 3D básicas (elipsoide, segmento, sombra leve)
js/ant-builder.js     monta a formiga procedural (cabeça, tórax, pecíolo, abdômen, 6 pernas, 2 antenas, mandíbulas)
js/glb.js             loadGLB(url): troca a formiga procedural por um modelo .glb
js/speech.js          voz em português do Brasil (Web Speech API)
js/stage.js           renderizador 3D único, câmera, toque, rótulos e miniaturas
js/screen-home.js     tela inicial (5 cartões)
js/screen-ant.js      tela da formiga (🔊, Conte as partes, Tamanho real)
js/screen-compare.js  tela "Quem é maior?"
js/app.js             inicia tudo
```

Para mudar textos, tamanhos ou cores, edite só o `js/species.js`.

## Como abrir no iPad

1. Publique o site (veja abaixo) e abra o link no **Safari**.
2. Para ficar em tela cheia, toque em **Compartilhar → Adicionar à Tela de Início**.
   O app vira um ícone, como um aplicativo.
3. Use o iPad **deitado** (horizontal) e com o **som ligado**. Confira também se o botão
   de silencioso está desligado.
4. Precisa de internet: o Three.js e a fonte vêm de CDN.

> Para testar no computador: `python3 -m http.server` dentro da pasta e abra
> `http://localhost:8000`.

## Como publicar grátis

### Vercel
1. Envie esta pasta para um repositório no GitHub.
2. Em [vercel.com](https://vercel.com), clique em **Add New → Project** e importe o repositório.
3. Em *Framework Preset*, escolha **Other**. Deixe *Build Command* vazio e *Output Directory* como `./`.
4. Clique em **Deploy**. Você recebe um link `https://….vercel.app`.

Também dá pelo terminal: `npx vercel` dentro da pasta.

### GitHub Pages
No repositório, vá em **Settings → Pages → Deploy from a branch**, escolha a branch e a pasta `/ (root)`.

### Netlify Drop
Arraste a pasta inteira para [app.netlify.com/drop](https://app.netlify.com/drop).

## Como trocar uma formiga por um modelo .glb

1. Coloque o arquivo na pasta do projeto, por exemplo `modelos/sauva.glb`.
2. No `js/species.js`, na espécie desejada, preencha:
   ```js
   glb: 'modelos/sauva.glb',
   glbRotacaoY: 90,   // use se o modelo aparecer virado (em graus)
   ```
3. Pronto. A formiga procedural aparece primeiro e é trocada quando o .glb carrega.
   O modelo é ajustado sozinho: comprimento igual ao tamanho real, centralizado e com os pés no chão.
   A cabeça deve apontar para +X (use `glbRotacaoY` para corrigir).

Dicas: use modelos leves (até ~20 mil triângulos) e abra pelo link publicado, não como arquivo local.
Em modelos .glb, o botão "Conte as partes" fala as partes, mas não pinta o modelo, porque
ele não tem as partes separadas.

A função `loadGLB(url)` também está disponível no console (`MUSEU.loadGLB`) e devolve uma
Promise com a cena do modelo.

## Espécies e fontes dos tamanhos

| Espécie | Tamanho usado | Faixa real (operárias) |
|---|---|---|
| Doceira (*Tapinoma melanocephalum*) | 1,5 mm | 1,3–2 mm |
| Lava-pés (*Solenopsis*) | 3 mm | ~2–6 mm |
| Carpinteira (*Camponotus*) | 10 mm | ~7–13 mm |
| Saúva (*Atta*) | 12 mm | ~12–15 mm (operárias carregadeiras; a colônia tem tamanhos variados) |
| Bala (*Paraponera clavata*) | 25 mm | 18–30 mm |

Fontes: [Wikipedia – Paraponera clavata](https://en.wikipedia.org/wiki/Paraponera_clavata),
[Wikipedia – Carpenter ant](https://en.wikipedia.org/wiki/Carpenter_ant),
[Wikipedia – Tapinoma melanocephalum](https://en.wikipedia.org/wiki/Tapinoma_melanocephalum),
[PIA ID Tools – Solenopsis invicta](https://idtools.org/id/ants/pia/Fact_Sheets/Solenopsis_invicta.html),
[Instituto Biológico – Formigas cortadeiras](https://biologico.agricultura.sp.gov.br/uploads/files/pdf/prosaf/apostilas/formigas_cortadeiras.pdf).

"Formiga doceira" é nome popular usado para várias formigas pequenas de cozinha. Aqui usamos
a *Tapinoma melanocephalum* (formiga-fantasma).
