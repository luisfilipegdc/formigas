// Lê js/catalogo.js (o catálogo do site estático) e gera o SQL de carga da tabela "itens".
// Uso: node scripts/importar-catalogo.mjs > db/seed/itens.sql
// Rodar de novo atualiza os itens (upsert); não mexe em revisão nem em "publicado".
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const raiz = fileURLToPath(new URL("../../", import.meta.url));
const codigo = readFileSync(`${raiz}js/catalogo.js`, "utf8");
const ctx = vm.createContext({});
vm.runInContext(`${codigo}\n;globalThis.__out = { ANIMAIS, GRUPOS };`, ctx);
const { ANIMAIS } = ctx.__out;

// Plano grátis: 3 bichos em 3D (decisão pendente do Luis; padrão = os três primeiros com 3D).
const GRATIS_3D = new Set(["formiga", "abelha", "cigarra"]);

const lit = (v) => (v === null || v === undefined ? "null" : `'${String(v).replace(/'/g, "''")}'`);
const linhas = ANIMAIS.map((a, i) => {
  const dados = JSON.stringify(a);
  return `(${[
    lit(a.id), lit("animais"), lit(a.nome), lit(a.cientifico), lit(a.grupo), lit(a.emoji),
    a.pagina ? "true" : "false", GRATIS_3D.has(a.id) && a.pagina ? "true" : "false",
    `${lit(dados)}::jsonb`, String(i),
  ].join(", ")})`;
});

process.stdout.write(`-- Gerado por scripts/importar-catalogo.mjs a partir de js/catalogo.js (${ANIMAIS.length} itens).
begin;
insert into itens (id, universo, nome, nome_cientifico, grupo, emoji, tem_3d, gratis_3d, dados, ordem) values
${linhas.join(",\n")}
on conflict (id) do update set
  nome = excluded.nome, nome_cientifico = excluded.nome_cientifico, grupo = excluded.grupo, emoji = excluded.emoji,
  tem_3d = excluded.tem_3d, gratis_3d = excluded.gratis_3d, dados = excluded.dados, ordem = excluded.ordem,
  atualizado_em = now();
commit;
`);
