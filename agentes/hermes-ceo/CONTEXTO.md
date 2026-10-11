# Bio no Bolso — contexto do projeto (outubro de 2026)

## O produto
- Enciclopédia interativa da natureza para todas as idades. Hoje: site estático (PWA) com 13 animais, 4 em 3D (formiga, abelha, cigarra, aranha), fichas, comparador e "Meu Bolso" guardado no aparelho.
- Nome: **Bio no Bolso** (antes "Bicho no Bolso"). Mascote: Curu (só no modo infantil).
- Plano completo (documento vivo): https://claude.ai/code/artifact/0698d75c-994e-4dd4-806f-524b2635ca74

## Decisões já tomadas
| Tema | Decisão |
|---|---|
| Tecnologia | Next.js + Postgres (Supabase ou VPS própria), motor 3D atual em Three.js |
| Pagamento | Asaas (Pix, boleto, cartão) |
| Planos | Free (3 bichos 3D, 3 fotos de IA/mês, kit Formiga), Família R$ 9,90/mês (até 4 contas), Professor/Escola R$ 29,00/mês (3 turmas de 40 alunos, kits pedagógicos BNCC) |
| Contas | Cada pessoa tem sua conta. 18+ conta própria; 12 a 17 ligada a um responsável; até 11 criada pelo responsável ou professor, entra com usuário + PIN ou QR, sem e-mail |
| Privacidade | Pontos do mapa de menores só em células de ~10 km; fotos da IA apagadas após a resposta; sem anúncios nem rastreadores |
| Banco próprio | Dados abertos (iNaturalist, depois GBIF, ICMBio, xeno-canto) importados para Postgres próprio; só fotos CC0, CC BY e CC BY-SA; IUCN não vai para o produto pago |
| Gamificação | XP, níveis, álbum de figurinhas, coleções, missões; sem ranking individual até 11 anos; nada se perde |
| Escolas | Kits por bicho: plano de aula BNCC + atividades para imprimir (ex.: quebra-cabeça A3 da formiga) + sequência de 6 aulas |
| Domínio | **estudodebolso.com.br** (no ar em 09/10/2026: site servido pela VPS, Cloudflare na frente; push no repo publica em até 5 min) |
| Banco | Postgres 17 próprio na VPS, instalado em 09/10/2026 |
| Visual | Guia de campo profissional: verde floresta #164A3A, areia #F5EFE3, âmbar #E3A21A; Fraunces + Inter; ícones de linha |

## Cronograma (~21 semanas)
1. Semanas 1–6: base (Next.js, banco, contas por idade) + identidade visual
2. Semanas 7–11: ficha completa (16 blocos) + painel admin
3. Semanas 12–15: gamificação + mapa de calor
4. Semanas 16–18: IA por foto
5. **Portão para cobrar:** 50 fichas, 8 bichos em 3D, revisor científico com nome, parecer de LGPD
6. Semanas 19–21: planos no Asaas, piloto pago em 5 escolas, lançamento para famílias

## Números de referência
- Custo fixo para ir ao ar: ~R$ 250/mês (Vercel Pro + Supabase Pro + domínio). IA: ~R$ 0,17 por foto.
- Empate: ~35 assinantes Família ou ~10 Professores.
- Pesquisa simulada com escolas (set/2026): 5 de 20 comprariam, só via piloto com desconto; faixa aceitável R$ 808–4.000/ano. Objeções: poucos bichos, falta revisor com nome, LGPD, professor sem tempo.

## Páginas planejadas (pedido do Luis em 09/10/2026)
- Blog
- Termos de uso e política de privacidade: obrigatórios antes de abrir contas, principalmente de crianças (LGPD, art. 14)
- Parcerias (escolas, museus, pesquisadores, ONGs)
- Sobre e contato

## Riscos principais
Catálogo pequeno; conteúdo sem revisão científica; dados de menores; IA errar a identificação; licenças de fotos e sons; custo de IA.

## Decisões em aberto
- Free com 3 ou 5 bichos 3D
- Limites de fotos de IA por plano
- Preço do plano Escola com vários professores
- Quem será o revisor científico
- Designer para a logo final
- Hospedagem do app: Vercel ou a própria VPS (o banco já está na VPS)

## Onde estão as coisas
- Repositório: https://github.com/luisfilipegdc/formigas (público; manter sempre atualizado; nada de senha aqui)
- Site atual: pasta `bio-no-bolso/` (no computador do Luis)
- Importador do banco: pasta `bio-dados/` (`importar.mjs`, `schema.sql`, `seed.sql`)
- Banco na VPS: `bionobolso` (Postgres 17); o agente usa só o usuário `bio_leitura`
