# 🐾 Catálogo 3D de Animais

Formigas e abelhas em 3D realistas, para girar e dar zoom com o dedo. Os corpos são "esculpidos" no próprio navegador ao abrir cada página (leva 1–3 segundos no iPad). Não tem build, nem servidor, nem som.

## Páginas
- `index.html`: catálogo com busca e filtros por grupo (insetos, aves, mamíferos…). Animais ainda sem página aparecem como "em breve".
- `formiga.html`: saúva (operária, rainha, zangão e formigueiro).
- `abelha.html`: abelha-europeia (operária, rainha e zangão) num jardim com flores. O botão 🍯 colmeia abre uma caixa de colmeia aberta na frente: favo, mel, pólen, ovos, larvas, pupas, realeira, rainha, dança, entrada e zangões, com etiquetas e passeio (⏭). Toque numa flor e ela voa até lá e bebe néctar; 🌼 faz ela visitar as flores sozinha; 👅 mostra a língua.
- `qr.html`: folha A4 com o QR code do site, pronta para imprimir (usa o endereço onde o site está publicado; dá para trocar no campo de cima).
- `js/catalogo.js`: **dados de todos os animais** (ficha, ciclo de vida, curiosidades, dados por casta). Para adicionar um animal ao catálogo, acrescente um item em `ANIMAIS`.
- `js/ficha.js`: gaveta ℹ️ ficha usada nas telas 3D (abas Ficha, Vida e Curiosidades; muda conforme a casta escolhida).
- `js/core3d.js`: peças 3D comuns, usadas pelas telas novas.

## Como usar
- **🐜 operária · 👑 rainha · 🪽 zangão:** troca a formiga (no tamanho real de cada uma: a rainha é quase o dobro da operária).
- **🏠 formigueiro:** entra num formigueiro de saúva "cortado" ao meio. Toque nas etiquetas
  (murundu, olheiros, trilha, túneis, jardim de fungo, berçário, rainha, lixo) ou no ⏭ para fazer o passeio.
  As formiguinhas andam pela trilha carregando folhas e pelos túneis. 🐜 volta para a formiga.
- **✈️ voar** (rainha e zangão): abre as 4 asas e faz o voo nupcial; toque de novo para pousar.
- **Toque no chão:** a formiga anda até lá, mexendo as 6 pernas como uma formiga de verdade.
- **Toque na formiga** (ou no botão 🦷): ela abre e fecha as mandíbulas.
- **🚶 passear:** ela passeia sozinha pelo chão. Toque em ✋ para parar.
- **🍃 folha:** ela carrega um pedaço de folha, como as saúvas fazem.
- **Girar:** arraste com um dedo. **Zoom:** pinça com dois dedos. **Mover a câmera:** arraste com dois dedos.
- **⟲ câmera:** volta a câmera para perto dela.

Precisa de internet, porque o Three.js é carregado de um CDN.

## Publicar na Vercel
1. Envie este repositório para o GitHub.
2. Em [vercel.com](https://vercel.com), clique em **Add New → Project** e importe o repositório.
3. Em *Framework Preset*, escolha **Other** e deixe o *Build Command* vazio.
4. Clique em **Deploy** e abra o link no Safari do iPad.

## Mudar as cores
No `index.html`, procure o bloco `AJUSTES`: lá estão as cores (`COR`), a velocidade e o tamanho da área por onde ela anda.

## Celular
Em telas pequenas os botões se reorganizam (faixa rolável em cima e barra embaixo) e o 3D fica mais leve (menos pelos e sombras menores).
