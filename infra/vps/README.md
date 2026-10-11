# VPS do Bio no Bolso

Instalado em 09/10/2026 numa VPS Ubuntu 24.04 (6 vCPU, 12 GB, 193 GB). Domínio: `estudodebolso.com.br` (DNS na Cloudflare, já apontando para a VPS).

## Banco `bionobolso`
| Item | Onde |
|---|---|
| Postgres 17 (Docker, contêiner `bionobolso-db`) | `/opt/bionobolso/docker-compose.yml` (cópia aqui) |
| Dados | `/opt/bionobolso/pgdata` |
| Senhas dos 3 usuários | `/opt/bionobolso/.env` (600, só root). **Nunca vai para o repositório.** |
| SQL carregado | `/opt/bionobolso/sql/` |
| Backups | `/opt/bionobolso/backups/`, todo dia às 3h, 14 dias (`/etc/cron.d/bionobolso-backup`, log em `/var/log/bionobolso-backup.log`) |
| Atalho de admin | `bio-psql` (root) abre o psql como `bio_admin` |

Usuários: `bio_admin` (dono, migrações), `bio_app` (lê e escreve, não cria tabela), `bio_leitura` (só leitura; a sessão já abre em modo somente leitura). Autenticação `scram-sha-256`. A porta 5432 só escuta em `127.0.0.1`.

## Acesso do seu computador (túnel SSH)
```bash
ssh -N -L 5432:localhost:5432 root@<IP-DA-VPS>
```
Com o túnel aberto: `postgresql://bio_app:SENHA@localhost:5432/bionobolso`.

## Operação
```bash
docker logs -f bionobolso-db                 # logs
cd /opt/bionobolso && docker compose restart # reiniciar
/opt/bionobolso/backup.sh                    # backup na hora
# restaurar um backup num banco novo (troque o arquivo):
bio-psql -c "create database bionobolso_restaurado"
docker exec -i -e PGPASSWORD=... bionobolso-db pg_restore -U bio_admin -d bionobolso_restaurado --no-owner < /opt/bionobolso/backups/ARQUIVO.dump
```

## Pendências
- Cópia dos backups para fora da VPS (Backblaze B2 ou S3): escolher o destino.
- O SSH ainda aceita login por senha e login do root. Recomendado: só chave.
- Firewall: só 22, 80 e 443 abertos.
