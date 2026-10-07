#!/usr/bin/env python3
"""Atualiza a lista de arquivos que o app guarda no aparelho (sw.js).

Rode depois de adicionar ou mudar arquivos do site:
    python3 ferramentas/atualizar-cache.py
A versão do cache é calculada a partir do conteúdo dos arquivos, então
qualquer mudança faz os aparelhos baixarem a versão nova.
"""
import hashlib, pathlib, re

RAIZ = pathlib.Path(__file__).resolve().parent.parent
INCLUIR = ['*.html', 'manifest.webmanifest', 'css/*.css', 'js/*.js', 'vendor/**/*.js', 'img/**/*.png', 'img/**/*.jpg']
arquivos = sorted({p.relative_to(RAIZ).as_posix() for pad in INCLUIR for p in RAIZ.glob(pad) if p.is_file()})
h = hashlib.sha1()
for a in arquivos:
    h.update(a.encode()); h.update((RAIZ / a).read_bytes())
versao = h.hexdigest()[:10]
sw = RAIZ / 'sw.js'
txt = sw.read_text(encoding='utf-8')
lista = ',\n'.join("  './%s'" % a for a in arquivos)
txt = re.sub(r"const VERSAO = '[^']*';", "const VERSAO = '%s';" % versao, txt)
txt = re.sub(r"const ARQUIVOS = \[[^\]]*\];", "const ARQUIVOS = [\n  './',\n%s\n];" % lista, txt, flags=re.S)
sw.write_text(txt, encoding='utf-8')
print('sw.js: versão %s, %d arquivos' % (versao, len(arquivos) + 1))
