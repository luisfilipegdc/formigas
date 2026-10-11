/* =====================================================================
   gerar-seed.mjs — transforma saida/*.jsonl em seed.sql (Postgres).
   Pode rodar quantas vezes quiser: usa "on conflict do nothing", então
   não duplica nem apaga o que já está no banco.
   Uso:  node gerar-seed.mjs   →   psql "$DATABASE_URL" -f seed.sql
   ===================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.dirname(fileURLToPath(import.meta.url));
const SAIDA = path.join(RAIZ, 'saida');

// ordem respeita as chaves estrangeiras
const TABELAS = ['fontes', 'taxons', 'alvos', 'nomes_populares', 'midias', 'conservacao', 'estabelecimento', 'sazonalidade', 'registros_ano', 'ocorrencias_celulas'];

function valor(v) {
  if (v === null || v === undefined) return 'null';
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (typeof v === 'number') return Number.isFinite(v) ? String(v) : 'null';
  if (Array.isArray(v)) return `'{${v.join(',')}}'`;
  return "'" + String(v).replace(/'/g, "''") + "'";
}

const out = fs.createWriteStream(path.join(RAIZ, 'seed.sql'));
out.write('-- gerado por gerar-seed.mjs em ' + new Date().toISOString() + '\nbegin;\n');
let total = 0;
for (const t of TABELAS) {
  const arq = path.join(SAIDA, t + '.jsonl');
  if (!fs.existsSync(arq)) continue;
  let linhas = fs.readFileSync(arq, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
  if (t === 'taxons') {
    // pais antes dos filhos (a chave pai_id é verificada no fim, mas assim fica legível)
    const vistos = new Set();
    linhas = linhas.filter((l) => !vistos.has(l.id) && vistos.add(l.id)).sort((a, b) => (b.rank_nivel || 0) - (a.rank_nivel || 0));
    const ids = new Set(linhas.map((l) => l.id));
    linhas.forEach((l) => { if (l.pai_id && !ids.has(l.pai_id)) l.pai_id = null; });
  }
  if (!linhas.length) continue;
  const cols = Object.keys(linhas[0]);
  out.write(`\n-- ${t}: ${linhas.length} linhas\n`);
  for (let i = 0; i < linhas.length; i += 500) {
    const lote = linhas.slice(i, i + 500).map((l) => '(' + cols.map((c) => valor(l[c])).join(', ') + ')');
    out.write(`insert into ${t} (${cols.join(', ')}) values\n${lote.join(',\n')}\non conflict do nothing;\n`);
  }
  total += linhas.length;
  console.log(`${t}: ${linhas.length}`);
}
out.write('\ncommit;\n');
out.end();
console.log(`seed.sql: ${total} linhas`);
