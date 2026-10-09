# Site estudodebolso.com.br

Desde 09/10/2026 (tarde): **a raiz é o app Next.js** (`web/`, contêiner `bionobolso-web`) e **o site estático dos bichos fica em `/explorar/`**. A Cloudflare fica na frente (proxy, SSL "Full (strict)", sempre HTTPS).

- Endereços antigos do site estático (`/bicho3d.html?id=…`, `/formiga.html`, `/comparar.html`, `/qr.html`, `/css/…`, `/js/…`, `/img/…`) redirecionam (301) para `/explorar/…`, então links e QR codes impressos continuam funcionando.
- `/sw.js` na raiz é um service worker de desligamento (`sw-raiz.js`): limpa o cache antigo de quem já visitou e se desregistra. O site em `/explorar/` registra o próprio.
- `app.estudodebolso.com.br` redireciona para o domínio principal.
- A VPS copia este repositório a cada 5 minutos (`site-estudodebolso-atualizar`, `/etc/cron.d/site-estudodebolso`, log em `/var/log/site-estudodebolso.log`). O app é publicado com `app-bionobolso-publicar`.
- Pastas internas (`docs`, `design`, `banco`, `infra`, `agentes`, `ferramentas`, `web`) não são copiadas para `/explorar/`.
- Servidor web: Caddy (`/etc/caddy/Caddyfile`, cópia aqui).
