# Hermes CEO na VPS

Instalado em 09/10/2026 (Hermes Agent v0.21.6), usuário Linux `hermes` sem sudo e fora do grupo docker.

| Item | Onde |
|---|---|
| Instalação e dados do Hermes | `/home/hermes/.hermes/` (config.yaml, memória, sessões, logs) |
| Chaves (Anthropic, Telegram) | `/home/hermes/.hermes/.env` (600). Grave com `hermes-chaves` (root), nunca no chat |
| Persona | `/home/hermes/.hermes/SOUL.md` (dono root, imutável com `chattr +i`) |
| Contexto do projeto | `/home/hermes/bio/AGENTS.md` = CONTEXTO.md + operacao.md (imutável) |
| Números do banco | `/home/hermes/bio/numeros/atual.md`, de hora em hora (crontab do `hermes`, script `numeros.sh`) |
| Acesso ao banco | usuário `bio_agente` (só views de `relatorios`), senha em `/home/hermes/.pgpass` |
| Serviço | `hermes-ceo.service` (systemd, reinicia sozinho, sem acesso a `/opt/bionobolso` e `/root`) |

## Configuração principal
- Modelo: Anthropic `claude-sonnet-5-5`.
- No Telegram o agente só tem: web, arquivos, memória, tarefas, busca nas conversas e perguntas. **Sem terminal** e sem agendar tarefas: ele não executa comando nenhum.
- `approvals.mode: manual`, `cron_mode: deny`; mensagens de quem não está em `TELEGRAM_ALLOWED_USERS` são ignoradas.
- Rotinas: `plano-da-semana` (segunda 8h) e `relatorio-da-semana` (sexta 17h), entregues no Telegram.

## Operação (como root)
```bash
hermes-chaves                                   # grava/troca as chaves e reinicia
systemctl restart hermes-ceo                    # reiniciar
systemctl stop hermes-ceo                       # desligar
journalctl -u hermes-ceo -f                     # logs do serviço
sudo -u hermes -H bash -lc 'hermes cron list'   # rotinas
sudo -u hermes -H bash -lc 'hermes update' && systemctl restart hermes-ceo   # atualizar
# conversas e ações: /home/hermes/.hermes/sessions e /home/hermes/.hermes/logs
# para mudar a persona: chattr -i, editar, chattr +i, restart
```
