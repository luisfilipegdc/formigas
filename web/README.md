# App do Bio no Bolso (Next.js)

Fase 1 do plano: contas por idade, identidade visual e LGPD. No ar em https://app.estudodebolso.com.br (fora do Google até o lançamento). O site estático da raiz continua em https://estudodebolso.com.br.

## O que já tem
- Adulto cria a conta da família com e-mail e senha (ano de nascimento primeiro; menor de 18 é orientado a pedir ao adulto).
- O adulto adiciona crianças e adolescentes: apelido, avatar e PIN, sem e-mail nem data. O modo da tela (Pequeno, Explorador, Cientista) sai do ano.
- Criança entra com código da família (ex.: CIGARRA-389) + apelido + PIN.
- Aceites com versão e hash do IP; exportar os dados da família (JSON); apagar tudo.
- Sessão em banco (cookie com token; banco guarda só o sha256), limite de tentativas, log de auditoria.
- Privacidade e termos em rascunho, aguardando revisão jurídica.

## Rodar local
1. Túnel para o Postgres da VPS: `ssh -N -L 15432:localhost:5432 root@<IP>`
2. `web/.env.local` com `DATABASE_URL=postgresql://bio_app:SENHA@127.0.0.1:15432/bionobolso_dev` (banco de desenvolvimento; a senha está no `.env` da VPS).
3. `npm install` e `npm run dev`. Testes: `npm test`. Tipos: `npm run typecheck`.

## Banco
Migrações em `db/migrations/`, aplicadas como `bio_admin` (`bio-psql < arquivo.sql` na VPS), nos bancos `bionobolso` (produção) e `bionobolso_dev`. Tabelas com dados pessoais não dão acesso a `bio_leitura` nem a `bio_agente`.

## Publicar
Na VPS, como root: `app-bionobolso-publicar` (puxa o repo, constrói a imagem e reinicia só o contêiner `bionobolso-web`).

## Próximos passos da Fase 1
- Meu Bolso na nuvem (descobertas por perfil) e importar o catálogo atual (13 bichos) para o banco.
- Adolescente com conta própria aprovada pelo responsável por e-mail (precisa de um serviço de e-mail).
- Login com Google (precisa da credencial OAuth).
- Trazer o motor 3D e as páginas atuais para dentro do app.
