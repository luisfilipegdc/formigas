# modelos3d/: modelos 3D prontos (.glb)

Coloque aqui os arquivos `.glb` dos itens da Biblioteca 3D. Eles podem vir de artista, de scan ou de bancos com licença livre. Depois, aponte o item para o arquivo no `js/biblioteca/*.js`:

```js
Biblioteca.item({
  id: 'quartzo', nome: 'Cristal de quartzo', cat: 'rochas', …,
  glb: 'modelos3d/quartzo.glb',          // se faltar ou falhar, usa o modelo feito em código
  glbTamanho: 1.6,                        // tamanho na cena (opcional)
  partes: [{ nome: 'Ponta', texto: '…', malhas: ['Ponta'] }],   // nomes das malhas no arquivo (vale o começo do nome)
  acoes: [{ rotulo: 'Andar', ico: '🚶', clipe: 'Walk' }],        // animações que vêm no arquivo
  parado: 'Idle',                         // animação em loop (opcional)
  credito: { autor: 'Nome do autor', licenca: 'CC BY 4.0', link: 'https://…' }
}, construir);
```

## Antes de colocar um arquivo
1. **Licença:**
   - Use só CC0 ou CC BY. Escreva o crédito em `credito`.
   - Evite NC (não comercial), ND (sem derivados) e SA (compartilha igual): elas atrapalham os planos para escolas.
2. **Otimize com gltf-transform** (https://gltf-transform.dev):
   ```
   npx @gltf-transform/cli optimize entrada.glb modelos3d/quartzo.glb --compress meshopt --texture-size 1024
   ```
   Meta: **menos de 50 mil triângulos e menos de 3 MB** por item.
3. **Nomes:** dê nomes às malhas no Blender (Antena, Pata, Ponta…). É assim que as partes ficam tocáveis.

Os candidatos de cada item estão em `docs/design-comportamental.md` (seção 4).
