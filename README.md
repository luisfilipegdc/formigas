# 🐜 Encontre um Bicho

**Explore. Descubra. Colecione.** Um catálogo interativo onde crianças exploram animais em 3D, descobrem curiosidades e comparam seus tamanhos.

Formigas e abelhas em 3D realistas, para girar e dar zoom com o dedo. Os corpos são "esculpidos" no próprio navegador ao abrir cada página (leva 1–3 segundos no iPad). Não tem build, nem servidor, nem som.

## Páginas
- `index.html`: catálogo. No topo, o destaque **🧊 Explore em 3D** (formiga e abelha); embaixo, a galeria de **fichas** com fotos reais, busca e filtros. Tocar num cartão abre a ficha; bichos com 3D têm o botão "▶ Explorar em 3D" na ficha. Créditos das fotos no rodapé.
- `comparar.html`: comparador de dois bichos (tamanho, parentesco, o que come, quanto vive, com quem vive, onde mora, situação na natureza).
- `formiga.html`: saúva (operária, rainha, zangão e formigueiro).
- `abelha.html`: abelha-europeia (operária, rainha e zangão) num jardim com flores. O botão 🍯 colmeia abre uma caixa de colmeia aberta na frente: favo, mel, pólen, ovos, larvas, pupas, realeira, rainha, dança, entrada e zangões, com etiquetas e passeio (⏭). Toque numa flor e ela voa até lá e bebe néctar; 🌼 faz ela visitar as flores sozinha; 👅 mostra a língua.
- `qr.html`: folha A4 com o QR code do site, pronta para imprimir (usa o endereço onde o site está publicado; dá para trocar no campo de cima).
- `js/catalogo.js`: **dados de todos os animais** (ficha, ciclo de vida, curiosidades, dados por casta). Para adicionar um animal ao catálogo, acrescente um item em `ANIMAIS`.
- `js/ficha.js`: gaveta ℹ️ ficha (abas Ficha, Vida, Sabia? e 📷 Real; muda conforme a casta escolhida).
- `img/animais/`: **fotos reais** de cada bicho (3 por animal), tiradas do iNaturalist, só com licenças que permitem qualquer uso (CC0, CC BY e CC BY-SA). O nome do fotógrafo e a licença aparecem no site e estão em `fotos` no `catalogo.js`. Como ficam no próprio site, aparecem sempre, mesmo sem internet.
- `js/dados.js`: fotos e dados reais do **iNaturalist** e da **Wikipédia** (sem chave, sem cadastro). Fica guardado no aparelho por 14 dias; sem internet, o site usa os emojis.
- `js/progresso.js`: álbum de descobertas, guardado só no aparelho (dá para apagar no rodapé do catálogo).
- `docs/PILOTO.md`: kit para testar com turmas e propor um piloto pago (roteiro de aula, perguntas para o professor, autorizações).
- `docs/ESTRATEGIA.md`: design comportamental, crítica de UX/UI, APIs, monetização ética e recomendações de tecnologia 3D.
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

Tudo o que o site precisa está no próprio site: o Three.js e o gerador de QR ficam em `vendor/` e as fotos em `img/animais/`. Fora do site só ficam a fonte (se não carregar, aparece a fonte do aparelho) e os dados extras da aba 📷 Real.

## Usar sem internet (app na Tela de Início)
O site funciona como um app (PWA). Na primeira vez que abre com internet, ele guarda tudo no aparelho: páginas, 3D e fotos (cerca de 4 MB). Depois abre mesmo sem internet, ou num Wi-Fi que bloqueia o endereço.
- **iPad/iPhone:** abra no Safari (no 4G ou em casa) › **Compartilhar** › **Adicionar à Tela de Início**. O ícone 🐜🐝 3D abre o app em tela cheia.
- No catálogo aparece "✅ Pronto para usar sem internet" quando terminou de guardar.
- **Mudou ou adicionou arquivos?** Rode `python3 ferramentas/atualizar-cache.py` antes de publicar: ele atualiza a lista do `sw.js` e a versão, e os aparelhos baixam a novidade na próxima abertura com internet.

## "Esta Conexão Não É Privada" no iPad
Esse aviso do Safari não vem do site: a Vercel usa um certificado válido. Ele aparece quando algo na rede troca o certificado no caminho. Na escola, quase sempre é o filtro ou firewall do Wi-Fi.
0. **Mais rápido:** instale o app pelo 4G (veja acima). Depois disso ele abre na escola mesmo com o bloqueio.
1. **Teste no 4G:** abra o mesmo endereço num celular fora do Wi-Fi da escola. Se abrir, o problema é a rede.
2. **Data e hora do iPad:** Ajustes › Geral › Data e Hora › "Ajustar Automaticamente" ligado. Com a data errada, todo site seguro dá esse aviso.
3. **Wi-Fi com página de login:** conecte de novo na rede e faça o login (abra `captive.apple.com` para a página aparecer).
4. **Peça para a TI da escola liberar** `*.vercel.app` no filtro (ou instalar nos iPads, pelo gerenciador de dispositivos, o certificado do filtro).
5. **Melhor solução a longo prazo:** um domínio próprio (ex.: `animais3d.com.br`), ligado na Vercel em *Settings › Domains*. Filtros escolares costumam bloquear `vercel.app` inteiro, porque qualquer pessoa pode publicar ali. Depois, gere um QR novo em `qr.html` com o domínio novo.

Não clique em "visitar este site mesmo assim" nos iPads das crianças: o certo é corrigir a rede.

## Publicar na Vercel
1. Envie este repositório para o GitHub.
2. Em [vercel.com](https://vercel.com), clique em **Add New → Project** e importe o repositório.
3. Em *Framework Preset*, escolha **Other** e deixe o *Build Command* vazio.
4. Clique em **Deploy** e abra o link no Safari do iPad.

## Mudar as cores
No `index.html`, procure o bloco `AJUSTES`: lá estão as cores (`COR`), a velocidade e o tamanho da área por onde ela anda.

## Celular
Em telas pequenas os botões se reorganizam (faixa rolável em cima e barra embaixo) e o 3D fica mais leve (menos pelos e sombras menores).

## Organização do código da formiga

- `formiga.html`: somente estrutura da tela e carregamento dos scripts.
- `css/formiga.css`: estilos exclusivos da experiência da saúva.
- `js/formiga.js`: lógica da experiência 3D da saúva (modelo, animações, formigueiro e controles).
- `js/core3d.js`: utilidades 3D compartilhadas pelas experiências que já usam o núcleo comum.

A separação é estática: não exige npm, build ou backend e continua adequada para deploy direto na Vercel.
