# 🐜 Saúva 3D

Uma formiga saúva (a formiga vermelha de cabeção) em 3D realista, para girar e dar zoom com o dedo.
O corpo é "esculpido" no próprio navegador ao abrir a página (leva 1–3 segundos no iPad).
Fica tudo num único arquivo, `index.html`: não tem build, nem servidor, nem som.

## Como usar
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
