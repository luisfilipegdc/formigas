# bio-dados — banco próprio do Bio no Bolso

Puxa dados abertos, guarda tudo localmente e gera SQL para qualquer Postgres (VPS, Supabase ou local).

## Passo a passo
```bash
npm install
node importar.mjs --limite 500 --paginas-obs 5   # ~1 h; pode parar e rodar de novo, continua do cache
node gerar-seed.mjs                              # saida/*.jsonl → seed.sql
node validar.mjs                                 # testa schema.sql + seed.sql num Postgres em memória
psql "$DATABASE_URL" -f schema.sql               # no banco de verdade
psql "$DATABASE_URL" -f seed.sql
```

## O que entra
| Tabela | Conteúdo |
|---|---|
| `taxons` | Árvore Reino → Espécie das espécies-alvo e de todos os ancestrais |
| `alvos` | As 500 espécies de animais mais registradas no Brasil (iNaturalist) + os 13 bichos do catálogo atual |
| `nomes_populares` | Nomes em português |
| `midias` | Fotos só com licença CC0, CC BY ou CC BY-SA (permitem uso comercial), com autor e link |
| `conservacao` | Status global e do Brasil; os da IUCN ficam com `uso_comercial = false` |
| `estabelecimento` | Nativa ou introduzida no Brasil |
| `sazonalidade`, `registros_ano` | Gráficos "Quando ver" e tendência |
| `ocorrencias_celulas` | Mapa de calor em hexágonos H3 (resolução 5, ~8,5 km de lado), nunca o ponto exato |
| `fichas` | Vazia: textos e dados escritos pela equipe, pelo painel admin |

## Regras
- Respeita ~1 requisição por segundo na API do iNaturalist; cada resposta fica em `cache/`.
- Rodar o seed de novo não duplica nada (`on conflict do nothing`).
- As fotos ainda são links; baixar os arquivos para o storage próprio é o próximo passo.
- Próximas fontes: GBIF (mapa mais completo), lista oficial de espécies ameaçadas do ICMBio/MMA, xeno-canto (sons).
