# Unit economics: Natureza no Bolso Família (assinatura mensal, cenário-base a R$ 9,90; ver o 'what if' de R$ 19,90 em cfo.md)

> **Moeda:** a ferramenta imprime "$", mas todos os valores estão em **R$**. Custos marcados "estimativa" não foram medidos; o pró-labore é provisório.

Every number below comes from the input file. Nothing is looked up or guessed.

## One assinatura-mês

| line | per assinatura-mês |
| --- | ---: |
| Price | $9.90 |
| Imposto sobre a receita (Simples Nacional, estimativa 6%) | -$0.59 |
| Taxa de cartão/Pix recorrente (estimativa ~4% + R$ 0,40) | -$0.80 |
| Reconhecimento por foto: API de terceiros (ESTIMATIVA NÃO MEDIDA, ~30 fotos/mês) | -$1.50 |
| Sincronização e armazenamento da coleção (estimativa) | -$0.10 |
| **Contribution** (what each assinatura-mês leaves to pay the fixed costs) | **$6.91** (70%) |

## The margin that matters

Fixed costs: $6,053 a month (Pró-labore do fundador (VALOR PROVISÓRIO: o fundador precisa definir) $3,000, Revisão científica: biólogo, ~10 h/mês a R$ 150 (estimativa) $1,500, Contador (estimativa) $300, Banco de dados e contas: plano pago tipo Supabase Pro, US$ 25 (estimativa em R$) $140, Hospedagem: Vercel Pro, US$ 20 (estimativa em R$) $110, Domínio .com.br, R$ 40/ano $3, Marketing pago e conteúdo para redes (estimativa) $1,000).

- **Break-even: 877 assinatura-mêss a day.** Below that you lose money every month.
- **Profit margin at your plan** (400 a day): **-83%** of every sale, after every cost.

## Year 1, month by month

| month | assinatura-mêss a day | revenue | profit | cumulative (after $4,500 startup) |
| ---: | ---: | ---: | ---: | ---: |
| 1 | 0 | $0 | -$6,053 | -$10,553 |
| 2 | 0 | $0 | -$6,053 | -$16,607 |
| 3 | 20 | $198 | -$5,915 | -$22,522 |
| 4 | 40 | $396 | -$5,777 | -$28,299 |
| 5 | 70 | $693 | -$5,570 | -$33,868 |
| 6 | 100 | $990 | -$5,362 | -$39,231 |
| 7 | 140 | $1,386 | -$5,086 | -$44,317 |
| 8 | 180 | $1,782 | -$4,810 | -$49,126 |
| 9 | 230 | $2,277 | -$4,464 | -$53,590 |
| 10 | 280 | $2,772 | -$4,119 | -$57,709 |
| 11 | 340 | $3,366 | -$3,704 | -$61,413 |
| 12 | 400 | $3,960 | -$3,289 | -$64,702 |

- **Year 1 operating profit: -$60,202** on $17,820 of revenue.
- After the $4,500 startup spend: -$64,702.
- Startup money earned back: not within year 1.
- Cash you need before it pays for itself: **$64,702**.

## What if

| scenario | margin at plan | break-even a day | year 1 profit |
| --- | ---: | ---: | ---: |
| Base plan | -83% | 877 | -$60,202 |
| Price -10% | -103% | 1,023 | -$61,984 |
| Volume -20% | -121% | 877 | -$62,690 |
| Unit costs +15% | -88% | 937 | -$61,009 |

## Red flags

- Year 1 loses money on operations (-$60,202).
- The startup spend is not earned back within year 1.

## E se o preço continuar R$ 19,90?

Rodado com `--price 19.90`, com o mesmo plano de assinantes:
- A contribuição sobe para **R$ 16,91 por assinatura-mês**, e o ponto de equilíbrio cai para **cerca de 358 assinantes ativos**.
- Mesmo assim, o ano 1 fecha em **−R$ 42.202** (−R$ 46.702 contando a abertura).
- Só que o painel diz que **ninguém compra a R$ 19,90** (0 de 20, e o PME está em R$ 15,07). O plano de 400 assinantes no mês 12 não se sustenta nesse preço.

## O que esse número esconde
- **Custo do reconhecimento por foto (R$ 1,50) não foi medido.** Se a criança fotografar 100 vezes por mês, ele pode passar do preço. Antes de cobrar, meça com um protótipo e ponha um limite mensal de fotos.
- **Cancelamento (churn)** não está no modelo. Com 10% ao mês, manter 400 ativos exige trazer cerca de 40 novas famílias por mês, só para repor.
- **Custo para trazer cada família (CAC)** está escondido no "marketing R$ 1.000". Com R$ 1.000 e 40 novas famílias por mês, seriam R$ 25 por família, 2,5 meses de assinatura a R$ 9,90.
