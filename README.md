# 🐜 Saúva 3D

Uma formiga saúva (a formiga vermelha de cabeção) em 3D, para girar e dar zoom com o dedo.
Fica tudo num único arquivo, `index.html`: não tem build, nem servidor, nem som.

## Como usar
- **Girar:** arraste com um dedo.
- **Zoom:** faça pinça com dois dedos (no computador, use a rodinha do mouse).
- **Mover:** arraste com dois dedos (no computador, com o botão direito).
- **⟲:** volta para a posição inicial.

Precisa de internet, porque o Three.js é carregado de um CDN.

## Publicar na Vercel
1. Envie este repositório para o GitHub.
2. Em [vercel.com](https://vercel.com), clique em **Add New → Project** e importe o repositório.
3. Em *Framework Preset*, escolha **Other** e deixe o *Build Command* vazio.
4. Clique em **Deploy** e abra o link no Safari do iPad.

## Mudar as cores
No `index.html`, procure o bloco `COR` e troque os códigos das cores.
