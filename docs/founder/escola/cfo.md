# Unit economics: Natureza no Bolso Escola (licença anual por unidade, cobrada como mês de licença)

> **Moeda:** a ferramenta imprime "$", mas todos os valores estão em **R$**. Custos marcados "estimativa" não foram medidos; o pró-labore é provisório.

Every number below comes from the input file. Nothing is looked up or guessed.

## One escola-mês

| line | per escola-mês |
| --- | ---: |
| Price | $250.00 |
| Imposto sobre a receita (Simples Nacional, estimativa 6%) | -$15.00 |
| Cobrança por boleto/Pix (estimativa) | -$3.50 |
| Suporte e formação do professor (estimativa: 1 h/mês a R$ 60) | -$60.00 |
| Servidor e armazenamento por escola (estimativa) | -$5.00 |
| **Contribution** (what each escola-mês leaves to pay the fixed costs) | **$166.50** (67%) |

## The margin that matters

Fixed costs: $5,053 a month (Pró-labore do fundador (VALOR PROVISÓRIO: o fundador precisa definir) $3,000, Revisão científica: biólogo, ~10 h/mês a R$ 150 (estimativa) $1,500, Contador (estimativa) $300, Banco de dados e contas: plano pago tipo Supabase Pro, US$ 25 (estimativa em R$) $140, Hospedagem: Vercel Pro, US$ 20 (estimativa em R$) $110, Domínio .com.br, R$ 40/ano $3).

- **Break-even: 31 escola-mêss a day.** Below that you lose money every month.
- **Profit margin at your plan** (8 a day): **-186%** of every sale, after every cost.
- Capacity: 30 a day.

## Year 1, month by month

| month | escola-mêss a day | revenue | profit | cumulative (after $6,000 startup) |
| ---: | ---: | ---: | ---: | ---: |
| 1 | 0 | $0 | -$5,053 | -$11,053 |
| 2 | 0 | $0 | -$5,053 | -$16,107 |
| 3 | 1 | $250 | -$4,887 | -$20,993 |
| 4 | 2 | $500 | -$4,720 | -$25,714 |
| 5 | 2 | $500 | -$4,720 | -$30,434 |
| 6 | 3 | $750 | -$4,554 | -$34,988 |
| 7 | 3 | $750 | -$4,554 | -$39,542 |
| 8 | 4 | $1,000 | -$4,387 | -$43,929 |
| 9 | 5 | $1,250 | -$4,221 | -$48,150 |
| 10 | 6 | $1,500 | -$4,054 | -$52,204 |
| 11 | 7 | $1,750 | -$3,888 | -$56,092 |
| 12 | 8 | $2,000 | -$3,721 | -$59,813 |

- **Year 1 operating profit: -$53,813** on $10,250 of revenue.
- After the $6,000 startup spend: -$59,813.
- Startup money earned back: not within year 1.
- Cash you need before it pays for itself: **$59,813**.

## What if

| scenario | margin at plan | break-even a day | year 1 profit |
| --- | ---: | ---: | ---: |
| Base plan | -186% | 31 | -$53,813 |
| Price -10% | -218% | 36 | -$54,838 |
| Volume -20% | -249% | 31 | -$55,179 |
| Unit costs +15% | -191% | 33 | -$54,327 |

## Red flags

- Break-even needs 30 escola-mêss a day but capacity is 30.
- Year 1 loses money on operations (-$53,813).
- The startup spend is not earned back within year 1.

## E se o preço cair para o que o painel aceita?

O painel põe o preço "indiferente" (IPP) em **cerca de R$ 1.800/ano**, ou R$ 150 por escola-mês. Rodado com `--price 150`:
- A contribuição cai para **R$ 66,50 por escola-mês**, e o ponto de equilíbrio sobe para **cerca de 76 escolas** pagando.
- O ano 1 fecha em **−R$ 57.913**.

## O que esse número esconde
- **Suporte de R$ 60 por escola-mês** é a maior linha variável. Se a primeira aula for pronta e o professor não precisar de formação, ela cai muito. Esse é o maior ganho de margem possível.
- **Ciclo de venda:** escola compra uma vez por ano, no fechamento do orçamento (setembro a dezembro). Perder essa janela empurra a receita 12 meses.
- **Capacidade:** um fundador sozinho, que também desenvolve, não atende 30 escolas com formação. O equilíbrio (31) está acima disso.
