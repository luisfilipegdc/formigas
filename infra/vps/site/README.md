# Site estudodebolso.com.br

Desde 09/10/2026 o site estático do Bio no Bolso é servido pela VPS, com a Cloudflare na frente (proxy ligado, SSL "Full (strict)", sempre HTTPS).

- A VPS copia este repositório (branch padrão) a cada 5 minutos: `site-estudodebolso-atualizar` em `/etc/cron.d/site-estudodebolso`, log em `/var/log/site-estudodebolso.log`. **Basta dar push: em até 5 min está no ar.**
- Pastas internas (`docs`, `design`, `banco`, `infra`, `agentes`, `ferramentas`) não são copiadas e redirecionam para a página inicial.
- Servidor web: Caddy (`/etc/caddy/Caddyfile`), arquivos em `/srv/estudodebolso/www`. `www` redireciona para o domínio sem www.
- Para publicar na hora: `site-estudodebolso-atualizar` (root).
- A Vercel continua publicando o mesmo repo no endereço `.vercel.app`; o domínio não está ligado a ela.
