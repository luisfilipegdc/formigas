# Prompt: publicar o Estudo de Bolso na VPS

> Cole numa sessão do Claude Code que tenha acesso SSH à VPS (root).

---

Você vai trabalhar na minha VPS Ubuntu, que publica o projeto **Estudo de Bolso** (antes "Bio no Bolso") em **estudodebolso.com.br**. O repositório é `luisfilipegdc/formigas`, no branch `claude/fervent-ride-ckr2w7`. Antes de começar, leia `CLAUDE.md`, `infra/vps/README.md` e `infra/vps/site/README.md` do repositório.

**Como está hoje:**
- Caddy em `/etc/caddy/Caddyfile`, com a Cloudflare na frente.
- A raiz `/` é o app Next.js de contas (`web/`, contêiner `bionobolso-web`, porta 127.0.0.1:3100).
- `/explorar/` é o site estático (a Biblioteca 3D), copiado do repositório a cada 5 minutos para `/srv/estudodebolso/www` (cron `site-estudodebolso-atualizar`).

**Regras:**
- Não pare, apague nem altere nada além do que está pedido aqui sem me perguntar.
- Não mexa no banco (contêiner `bionobolso-db`) nem nos backups.
- Nunca escreva senhas ou o conteúdo de `.env` na conversa.
- Faça backup de todo arquivo de configuração antes de editar.

## Parte 1: publicar o novo nome (pode fazer direto)
1. Confira se a cópia do site estático já tem o nome novo:
   `grep -c "Estudo de Bolso" /srv/estudodebolso/www/index.html`
   Se der 0, rode `site-estudodebolso-atualizar` e veja o log em `/var/log/site-estudodebolso.log`.
2. Publique o app de contas com o nome novo: `app-bionobolso-publicar`. Depois confira que o contêiner `bionobolso-web` está rodando e saudável.
3. Teste e me mostre o resultado:
   - `curl -s https://estudodebolso.com.br/ | grep -o "Estudo de Bolso" | head -1`
   - `curl -sI https://estudodebolso.com.br/explorar/`, que deve dar 200
   - `curl -s https://estudodebolso.com.br/explorar/ | grep -o "<title>[^<]*"`

## Parte 2: Biblioteca na raiz (só planejar; não executar sem minha aprovação)
Quero avaliar abrir a **Biblioteca 3D direto em `https://estudodebolso.com.br/`** e mover o app de contas para **`/conta`**.
1. Leia `web/next.config.ts` e as rotas em `web/app/`, e veja o que precisa mudar para o app funcionar em `/conta`. Por exemplo, `basePath: '/conta'`, os links internos, os cookies e o caminho das APIs (`/api/bolso`, que o site estático chama quando a pessoa está logada).
2. Liste o que precisa mudar no Caddyfile. Pelo menos:
   - a raiz servindo `/srv/estudodebolso/www`;
   - `/conta/*` e `/api/*` indo para o app;
   - `/explorar/*` redirecionando para a raiz, para os links e QR codes antigos continuarem funcionando;
   - o tratamento do `/sw.js`, porque hoje o da raiz é um service worker que se desliga.
3. Me mostre o plano, os riscos (sessões abertas, service worker antigo nos aparelhos, QR codes impressos) e como desfazer. **Só depois de eu aprovar**, aplique, valide com `caddy validate` e recarregue com `systemctl reload caddy`.

## Parte 3: endereço extra com senha (opcional, só se eu pedir)
O bloco `bio.estudodebolso.com.br` está em `infra/vps/site/Caddyfile`, e o passo a passo em `infra/vps/site/PROMPT-BIO-SUBDOMINIO.md`. Não ative sem eu pedir.

No final, me dê um resumo curto: o que foi feito, os resultados dos testes e o que ficou esperando a minha decisão.
