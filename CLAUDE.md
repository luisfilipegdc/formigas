# CLAUDE.md — regras do projeto (lidas por qualquer sessão, em qualquer aparelho)

**Estudo de Bolso** (antes Bio no Bolso). Aprender explorando, no seu bolso. Biblioteca/enciclopédia 3D da natureza para crianças de 1 a 17 anos, famílias e escolas. Site estático (sem build), PWA, Three.js r147 em `vendor/three`.

## Onde está no ar
- Vercel: https://bionobolso.vercel.app (publica a cada push no branch `claude/fervent-ride-ckr2w7`, que é o principal)
- VPS: https://estudodebolso.com.br/explorar/ (copia o repositório a cada 5 min) (a raiz de estudodebolso.com.br é o app Next.js de contas, `web/`) — veja `infra/vps/`
- Não trocar domínio, projeto da Vercel nem nome do repositório sem o dono pedir.

## Como trabalhar
- Desenvolver, commitar e dar push em `claude/fervent-ride-ckr2w7` (sem PR: é o branch publicado).
- Depois de mudar arquivos do site, rodar `python3 ferramentas/atualizar-cache.py` (atualiza o `sw.js`).
- Testar no navegador (Playwright em `/opt/node-tools/node_modules/playwright`, com `--use-gl=swiftshader`), servindo com `python3 -m http.server 8765`.
- Pastas internas (`docs/`, `design/`, `banco/`, `infra/`, `agentes/`, `web/`) não vão para o site público (`.vercelignore` e `vercel.json`).
- Se o dono mandar **"voltaformiga"**: restaurar o projeto para o branch `voltaformiga` (commit 8220bd6) com force push.
- Textos para o usuário em português do Brasil, simples.

## Fluxo do app
splash → **Quem vai explorar?** (`js/faixa.js`: Bebês 1–3, Educação Infantil 4–6, Anos Iniciais, Anos Finais, Ensino Médio) → **Biblioteca 3D** (`index.html`, `js/biblioteca/*`) adaptada à faixa. Bichos com 3D completo em `bicho3d.html?id=…` (`js/bicho3d.js`, `js/modelos/*`). Voz em `js/voz.js`.
- Modelos prontos `.glb` vão em `modelos3d/` (veja o LEIA-ME); se faltarem, usa o modelo feito em código.
- Pedagogia: `docs/pedagogia.md`. Design comportamental e plano 3D: `docs/design-comportamental.md`.

## Proteção da criança (não negociável)
Sem anúncios, chat, microfone, câmera, GPS ou localização. Sem dado de criança sem conta de adulto. Sem ranking, streak, loot box, notificação push, punição ou FOMO. Menores de 7: sem placar nem títulos. Conteúdo marcado "em revisão científica".
