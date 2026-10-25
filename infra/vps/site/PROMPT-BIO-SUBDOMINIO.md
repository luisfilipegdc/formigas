# Prompt para a VPS: ligar bio.estudodebolso.com.br

> Cole este texto numa sessão do Claude Code (ou de outro agente) que tenha acesso SSH à VPS. Antes, na **Cloudflare**, crie o registro DNS: tipo **A**, nome **bio**, valor = IP da VPS, proxy ligado (nuvem laranja).

---

Na minha VPS (Ubuntu, Caddy em `/etc/caddy/Caddyfile`), o site estático do Bio no Bolso já é publicado em `/srv/estudodebolso/www` a cada 5 minutos e servido em `https://estudodebolso.com.br/explorar/`. Quero que ele também abra em **https://bio.estudodebolso.com.br**, na raiz.

1. Faça um backup do Caddyfile atual (`/etc/caddy/Caddyfile.bak-AAAAMMDD`).
2. Acrescente ao final do Caddyfile o bloco `bio.estudodebolso.com.br { … }` que está em `infra/vps/site/Caddyfile` no repositório `luisfilipegdc/formigas` (branch `claude/fervent-ride-ckr2w7`). Não mude os outros blocos.
3. Rode `caddy validate --config /etc/caddy/Caddyfile` e, se estiver ok, `systemctl reload caddy`.
4. Teste: `curl -sI https://bio.estudodebolso.com.br/` deve dar 200, e `curl -sI https://bio.estudodebolso.com.br/docs/` não deve mostrar arquivos internos (as pastas internas nem são copiadas).
5. **Não** ative a senha (`basic_auth`) a menos que eu peça. Se eu pedir: gere o hash com `caddy hash-password`, me pergunte a senha sem escrevê-la na conversa, e descomente o bloco.
6. Me mostre o resultado dos testes.
