# App do Bio no Bolso (Next.js)

Fase 1 do plano: contas por idade, identidade visual e LGPD. No ar em https://app.estudodebolso.com.br (fora do Google até o lançamento). O site estático da raiz continua em https://estudodebolso.com.br.

## O que já tem
- Adulto cria a conta da família com e-mail e senha (ano de nascimento primeiro; menor de 18 é orientado a pedir ao adulto).
- O adulto adiciona crianças e adolescentes: apelido, avatar e PIN, sem e-mail nem data. O modo da tela (Pequeno, Explorador, Cientista) sai do ano.
- Criança entra com código da família (ex.: CIGARRA-389) + apelido + PIN.
- Aceites com versão e hash do IP; exportar os dados da família (JSON); apagar tudo.
- Sessão em banco (cookie com token; banco guarda só o sha256), limite de tentativas, log de auditoria.
- Privacidade e termos em rascunho, aguardando revisão jurídica.
- Catálogo no banco (tabela `itens`, 13 bichos vindos de `js/catalogo.js`; 3 com 3D grátis: formiga, abelha, cigarra).
- Meu Bolso na nuvem: `/api/bolso` (GET/POST/DELETE). O site em `/explorar/` sincroniza quando a pessoa está logada; sem conta continua só no aparelho; num aparelho compartilhado cada conta tem o próprio bolso. Pontos e nível calculados no servidor (`lib/bolso.ts`).

## Rodar local
1. Túnel para o Postgres da VPS: `ssh -N -L 15432:localhost:5432 root@<IP>`
2. `web/.env.local` com `DATABASE_URL=postgresql://bio_app:SENHA@127.0.0.1:15432/bionobolso_dev` (banco de desenvolvimento; a senha está no `.env` da VPS).
3. Para testar o site dos bichos junto: `python -m http.server 8799 --bind 127.0.0.1 --directory ..` e `BIO_EXPLORAR_DEV=http://127.0.0.1:8799` no `.env.local` (o app passa a servir `/explorar/`).
4. `npm install` e `npm run dev`. Testes: `npm test`. Tipos: `npm run typecheck`.
5. Catálogo: depois de mudar `js/catalogo.js`, `node scripts/importar-catalogo.mjs > db/seed/itens.sql` e aplicar na VPS.

## Banco
Migrações em `db/migrations/`, aplicadas como `bio_admin` (`bio-psql < arquivo.sql` na VPS), nos bancos `bionobolso` (produção) e `bionobolso_dev`. Tabelas com dados pessoais não dão acesso a `bio_leitura` nem a `bio_agente`.

## Publicar
Na VPS, como root: `app-bionobolso-publicar` (puxa o repo, constrói a imagem e reinicia só o contêiner `bionobolso-web`).

## Próximos passos da Fase 1
- Painel admin do catálogo (editar fichas pelo navegador, sem mexer em código).
- Ligar `itens` às espécies do iNaturalist (`taxon_id`) quando o seed.sql for carregado.
- Adolescente com conta própria aprovada pelo responsável por e-mail (precisa de um serviço de e-mail).
- Login com Google (precisa da credencial OAuth).
- Trazer o motor 3D e as páginas atuais para dentro do app.
