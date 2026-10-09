Preciso que você instale e configure na minha VPS o banco de dados próprio do projeto **Bio no Bolso** (catálogo de biodiversidade para famílias e escolas). O banco vai guardar dados de espécies agora e, no futuro, contas de usuários, inclusive de crianças. Por isso, segurança e backup são prioridade.

## Antes de instalar qualquer coisa
1. Verifique o sistema operacional, a RAM, o disco livre, o que já está rodando (serviços, contêineres Docker, portas abertas) e se já existe Postgres.
2. Me mostre um resumo e o plano do que vai fazer. **Não altere nem pare nada que já esteja rodando na VPS** sem me perguntar.

## O que instalar
- **PostgreSQL 17** em Docker (imagem oficial `postgres:17`), com volume persistente em `/opt/bionobolso/pgdata`. Se Docker não estiver instalado, instale o Docker Engine oficial. Se você achar que instalar o Postgres direto no sistema é melhor para esta VPS, explique por quê antes.
- Banco: `bionobolso`, com encoding UTF8 e locale pt_BR (ou C.UTF-8, se pt_BR não existir).
- Fuso: `America/Sao_Paulo`.

## Usuários do banco
- `bio_admin`: dono do banco, usado só para migrações.
- `bio_app`: lê e escreve nas tabelas, sem criar nem apagar tabelas. É o que o app (Next.js) vai usar.
- `bio_leitura`: só leitura, para relatórios.

Gere senhas fortes e aleatórias e guarde em `/opt/bionobolso/.env` com permissão 600 (só o root lê). **Não escreva as senhas na conversa.** Diga apenas onde estão.

## Segurança
- O Postgres **não pode ficar exposto na internet**: publique a porta só em `127.0.0.1:5432`. O acesso remoto será por túnel SSH. Me passe o comando do túnel pronto, por exemplo `ssh -L 5432:localhost:5432 usuario@IP`.
- Firewall (ufw ou o que já existir) liberando só SSH, e 80/443 se já estiverem em uso. Não feche o SSH em que estamos conectados.
- Se o SSH ainda aceita login por senha, me avise e recomende chave, mas não mude isso sem me perguntar.
- Configure `scram-sha-256` para autenticação.

## Backup
- Crie `/opt/bionobolso/backup.sh`: `pg_dump` em formato custom e compactado para `/opt/bionobolso/backups/`, com o nome contendo a data.
- Agende no cron todos os dias às 3h, guardando os últimos 14 dias.
- Rode o backup uma vez e teste a restauração num banco temporário (`bionobolso_teste`), apagando-o depois.
- Me diga como mandar esses backups para fora da VPS (Backblaze B2, S3 ou outro). Não configure isso sem eu escolher.

## Carga dos dados
Vou enviar dois arquivos para `/opt/bionobolso/sql/`:
- `schema.sql`: cria as tabelas (taxons, alvos, nomes_populares, midias, conservacao, estabelecimento, sazonalidade, registros_ano, ocorrencias_celulas, fichas, fontes)
- `seed.sql`: dados de cerca de 500 espécies importados do iNaturalist

Crie a pasta e me diga o comando `scp` exato para eu enviar os arquivos do meu Windows, saindo da pasta `C:\Users\Luis Filipe\Desktop\NOVO\bio-dados`. Depois que eu confirmar o envio:
1. Rode `schema.sql` e depois `seed.sql` como `bio_admin`.
2. Dê a `bio_app` e a `bio_leitura` as permissões certas em todas as tabelas e sequências, inclusive nas tabelas futuras (`ALTER DEFAULT PRIVILEGES`).
3. Confira e me mostre:
   - o total de linhas de cada tabela;
   - as 10 espécies-alvo com mais registros: `select t.nome_popular, t.nome_cientifico, a.registros_brasil from alvos a join taxons t on t.id = a.taxon_id order by a.posicao nulls last limit 10;`
   - que `bio_leitura` não consegue fazer INSERT.

## No final, me entregue
- Um resumo do que foi instalado e onde está cada coisa.
- O comando do túnel SSH e a string de conexão **sem a senha** (ex.: `postgresql://bio_app:SENHA@localhost:5432/bionobolso`).
- Como ver os logs, reiniciar o banco e restaurar um backup.
- Qualquer risco ou pendência que você encontrou na VPS.
