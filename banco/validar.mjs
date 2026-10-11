/* =====================================================================
   validar.mjs — carrega schema.sql + seed.sql num Postgres em memória
   (PGlite) e confere contagens e uma consulta de exemplo. Serve para
   testar o banco sem instalar Postgres.   Uso: node validar.mjs
   ===================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PGlite } from '@electric-sql/pglite';

const RAIZ = path.dirname(fileURLToPath(import.meta.url));
const db = new PGlite();
await db.exec(fs.readFileSync(path.join(RAIZ, 'schema.sql'), 'utf8'));
await db.exec(fs.readFileSync(path.join(RAIZ, 'seed.sql'), 'utf8'));
// rodar o seed duas vezes não pode duplicar nada
await db.exec(fs.readFileSync(path.join(RAIZ, 'seed.sql'), 'utf8'));

const tabelas = ['taxons', 'alvos', 'nomes_populares', 'midias', 'conservacao', 'estabelecimento', 'sazonalidade', 'registros_ano', 'ocorrencias_celulas'];
for (const t of tabelas) {
  const r = await db.query(`select count(*)::int as n from ${t}`);
  console.log(t.padEnd(20), r.rows[0].n);
}
const ex = await db.query(`
  select t.nome_popular, t.nome_cientifico, t.grupo, a.posicao,
         (select count(*) from midias m where m.taxon_id = t.id)::int as fotos,
         (select count(*) from ocorrencias_celulas c where c.taxon_id = t.id)::int as celulas,
         (select string_agg(registros::text, ' ' order by mes) from sazonalidade s where s.taxon_id = t.id) as meses
  from alvos a join taxons t on t.id = a.taxon_id
  order by a.posicao nulls last limit 8`);
console.table(ex.rows);
const sem = await db.query(`select count(*)::int as n from alvos a where not exists (select 1 from midias m where m.taxon_id = a.taxon_id)`);
console.log('espécies-alvo sem foto de licença livre:', sem.rows[0].n);
