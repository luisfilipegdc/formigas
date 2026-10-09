/* =====================================================================
   importar.mjs — puxa dados abertos e monta a base do banco próprio
   do Bio no Bolso (500 espécies de animais mais vistas no Brasil +
   os bichos do catálogo atual).

   Fonte: API do iNaturalist (sem chave). Respeita ~1 requisição por
   segundo e guarda cada resposta em cache/ — se cair no meio, rodar
   de novo continua de onde parou, sem repetir chamadas.

   Saída: saida/*.jsonl (um registro por linha), prontos para o
   gerar-seed.mjs transformar em SQL para qualquer Postgres.

   Uso:  node importar.mjs [--limite 500] [--paginas-obs 5]
   ===================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { latLngToCell } from 'h3-js';
import { fileURLToPath } from 'node:url';

const RAIZ = path.dirname(fileURLToPath(import.meta.url));
const CACHE = path.join(RAIZ, 'cache');
const SAIDA = path.join(RAIZ, 'saida');
fs.mkdirSync(CACHE, { recursive: true });
fs.mkdirSync(SAIDA, { recursive: true });

const arg = (nome, padrao) => { const i = process.argv.indexOf(nome); return i > 0 ? Number(process.argv[i + 1]) : padrao; };
const LIMITE = arg('--limite', 500);
const PAGINAS_OBS = arg('--paginas-obs', 5);

const BRASIL = 6878;           // place_id do Brasil no iNaturalist
const ANIMAIS = 1;             // taxon_id do reino Animalia
const H3_RES = 5;              // hexágono com ~8,5 km de lado (~250 km²)
const LICENCAS_OK = new Set(['cc0', 'cc-by', 'cc-by-sa']);  // sem NC/ND: o produto é pago
const UA = 'BioNoBolso-importador/0.1 (contato: contabil@apicegestao.com.br)';
const INTERVALO_MS = 1100;

// bichos do catálogo atual (js/catalogo.js, campo "busca")
const CATALOGO = {
  formiga: 'Atta', abelha: 'Apis mellifera', borboleta: 'Morpho helenor', joaninha: 'Coccinellidae',
  beijaflor: 'Trochilidae', arara: 'Anodorhynchus hyacinthinus', onca: 'Panthera onca',
  preguica: 'Bradypus variegatus', tartaruga: 'Chelonia mydas', sapo: 'Rhinella diptycha',
  pirarucu: 'Arapaima gigas', cigarra: 'Quesada gigas', aranha: 'Trichonephila clavipes',
};

/* ---------- rede com cache, ritmo e novas tentativas ---------- */
let ultima = 0, chamadas = 0, doCache = 0;
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
async function obter(url) {
  const arq = path.join(CACHE, crypto.createHash('sha1').update(url).digest('hex') + '.json');
  if (fs.existsSync(arq)) { doCache++; return JSON.parse(fs.readFileSync(arq, 'utf8')); }
  for (let tentativa = 1; ; tentativa++) {
    const falta = ultima + INTERVALO_MS - Date.now();
    if (falta > 0) await espera(falta);
    ultima = Date.now(); chamadas++;
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
      if (r.ok) {
        const json = await r.json();
        fs.writeFileSync(arq, JSON.stringify(json));
        return json;
      }
      if (r.status !== 429 && r.status < 500) throw new Error('HTTP ' + r.status + ' em ' + url);
      console.warn(`  HTTP ${r.status}, nova tentativa (${tentativa})`);
    } catch (e) {
      if (/^HTTP 4/.test(e.message)) throw e;
      console.warn(`  ${e.message}, nova tentativa (${tentativa})`);
    }
    if (tentativa >= 6) throw new Error('desisti de ' + url);
    await espera(5000 * tentativa);
  }
}
const API = 'https://api.inaturalist.org/v1/';
const API2 = 'https://api.inaturalist.org/v2/';

/* ---------- 1. lista de espécies-alvo ---------- */
async function listarAlvos() {
  const alvos = new Map();
  const top = await obter(`${API}observations/species_counts?place_id=${BRASIL}&taxon_id=${ANIMAIS}&rank=species&verifiable=true&per_page=${LIMITE}&locale=pt-BR`);
  top.results.forEach((r, i) => alvos.set(r.taxon.id, { taxon_id: r.taxon.id, origem: 'top_brasil', posicao: i + 1, registros_brasil: r.count }));
  for (const [id, nome] of Object.entries(CATALOGO)) {
    const r = await obter(`${API}taxa?q=${encodeURIComponent(nome)}&is_active=true&per_page=10&locale=pt-BR`);
    const t = r.results.find((x) => x.name === nome) || r.results[0];
    if (!t) { console.warn('  catálogo: não achei', nome); continue; }
    const ja = alvos.get(t.id);
    if (ja) ja.catalogo_id = id;
    else alvos.set(t.id, { taxon_id: t.id, origem: 'catalogo', posicao: null, registros_brasil: null, catalogo_id: id });
  }
  return [...alvos.values()];
}

/* ---------- 2. detalhes dos táxons (30 por chamada) ---------- */
async function detalhar(ids) {
  const res = [];
  for (let i = 0; i < ids.length; i += 30) {
    const lote = ids.slice(i, i + 30);
    const r = await obter(`${API}taxa/${lote.join(',')}?all_names=true&locale=pt-BR&preferred_place_id=${BRASIL}`);
    res.push(...r.results);
    process.stdout.write(`\r  detalhes: ${Math.min(i + 30, ids.length)}/${ids.length}`);
  }
  console.log();
  return res;
}

/* ---------- 3. sazonalidade, anos e grade do mapa ---------- */
async function histograma(id, intervalo) {
  const r = await obter(`${API}observations/histogram?place_id=${BRASIL}&taxon_id=${id}&verifiable=true&interval=${intervalo}&date_field=observed`);
  return r.results[intervalo] || {};
}
async function celulas(id) {
  const cont = new Map();
  let pontos = 0;
  for (let p = 1; p <= PAGINAS_OBS; p++) {
    const r = await obter(`${API2}observations?taxon_id=${id}&place_id=${BRASIL}&verifiable=true&per_page=200&page=${p}&fields=id,location`);
    for (const o of r.results) {
      if (!o.location) continue;
      const [lat, lng] = o.location.split(',').map(Number);
      const h = latLngToCell(lat, lng, H3_RES);
      cont.set(h, (cont.get(h) || 0) + 1); pontos++;
    }
    if (r.results.length < 200 || p * 200 >= r.total_results) break;
  }
  return { cont, pontos };
}

/* ---------- gravação ---------- */
const arquivos = {};
function gravar(tabela, obj) {
  if (!arquivos[tabela]) arquivos[tabela] = fs.openSync(path.join(SAIDA, tabela + '.jsonl'), 'w');
  fs.writeSync(arquivos[tabela], JSON.stringify(obj) + '\n');
}
const hoje = new Date().toISOString().slice(0, 10);
const fotoUrl = (u, tam) => (u || '').replace(/\/(square|small|medium|large|original)\./, `/${tam}.`);

async function main() {
  console.log(`Bio no Bolso — importação (${LIMITE} espécies + catálogo, ${PAGINAS_OBS} páginas de observações cada)`);
  console.log('1/4 lista de espécies-alvo');
  const alvos = await listarAlvos();
  console.log(`  ${alvos.length} táxons-alvo`);

  console.log('2/4 detalhes dos táxons');
  const det = await detalhar(alvos.map((a) => a.taxon_id));
  const vistos = new Set();
  const taxon = (t, alvo) => {
    if (vistos.has(t.id)) return;
    vistos.add(t.id);
    gravar('taxons', {
      id: t.id, nome_cientifico: t.name, rank: t.rank, rank_nivel: t.rank_level, pai_id: t.parent_id || null,
      ancestrais: t.ancestor_ids || (t.ancestry ? t.ancestry.split('/').map(Number) : []),
      nome_popular: t.preferred_common_name || null, grupo: t.iconic_taxon_name || null,
      extinto: !!t.extinct, observacoes_mundo: t.observations_count || 0, wikipedia_url: t.wikipedia_url || null,
      alvo: !!alvo, fonte: 'inaturalist', fonte_url: `https://www.inaturalist.org/taxa/${t.id}`, importado_em: hoje,
    });
  };
  const porId = new Map(alvos.map((a) => [a.taxon_id, a]));
  for (const t of det) {
    const a = porId.get(t.id);
    taxon(t, a);
    (t.ancestors || []).forEach((x) => taxon(x, null));
    gravar('alvos', { ...a, importado_em: hoje });
    // nomes em português (todos os que o iNaturalist conhece)
    const nomes = (t.names || []).filter((n) => /portug/i.test(n.lexicon || ''));
    const pref = t.preferred_common_name;
    if (pref && !nomes.some((n) => n.name === pref)) nomes.unshift({ name: pref, lexicon: 'Portuguese' });
    nomes.forEach((n, i) => gravar('nomes_populares', {
      taxon_id: t.id, nome: n.name, idioma: /bra/i.test(n.lexicon) ? 'pt-BR' : 'pt', preferido: n.name === pref, ordem: i, fonte: 'inaturalist',
    }));
    // fotos: só licenças que permitem uso comercial
    let pos = 0;
    for (const tp of t.taxon_photos || []) {
      const f = tp.photo;
      if (!f || !LICENCAS_OK.has(f.license_code)) continue;
      gravar('midias', {
        taxon_id: t.id, tipo: 'foto', posicao: pos++, url_media: fotoUrl(f.url, 'medium'), url_grande: fotoUrl(f.url, 'large'),
        url_original: fotoUrl(f.url, 'original'), largura: f.original_dimensions?.width || null, altura: f.original_dimensions?.height || null,
        autor: f.attribution_name || f.attribution, atribuicao: f.attribution, licenca: f.license_code,
        fonte: 'inaturalist', fonte_id: String(f.id), fonte_url: f.native_page_url || `https://www.inaturalist.org/photos/${f.id}`,
      });
    }
    // conservação (a IUCN fica marcada: não pode ir para o produto pago)
    for (const c of t.conservation_statuses || []) {
      const noBrasil = !c.place || c.place.id === BRASIL || (c.place.ancestor_place_ids || []).includes(BRASIL);
      if (!noBrasil) continue;   // só o global e o do Brasil (e estados)
      gravar('conservacao', {
        taxon_id: t.id, status: c.status, iucn_codigo: c.iucn ?? null, autoridade: c.authority || null,
        local: c.place ? c.place.display_name || c.place.name : null, local_id: c.place ? c.place.id : null,
        url: c.url || null, uso_comercial: !/iucn/i.test(c.authority || ''), fonte: 'inaturalist',
      });
    }
    // nativo ou introduzido no Brasil
    const lt = (t.listed_taxa || []).find((x) => x.place && x.place.id === BRASIL);
    if (lt) gravar('estabelecimento', { taxon_id: t.id, local: 'Brasil', meio: lt.establishment_means || null, fonte: 'inaturalist' });
  }

  console.log('3/4 sazonalidade e registros por ano');
  let n = 0;
  for (const a of alvos) {
    const meses = await histograma(a.taxon_id, 'month_of_year');
    for (const [m, c] of Object.entries(meses)) gravar('sazonalidade', { taxon_id: a.taxon_id, mes: +m, registros: c, local: 'Brasil', fonte: 'inaturalist' });
    const anos = await histograma(a.taxon_id, 'year');
    for (const [d, c] of Object.entries(anos)) if (c) gravar('registros_ano', { taxon_id: a.taxon_id, ano: +d.slice(0, 4), registros: c, local: 'Brasil', fonte: 'inaturalist' });
    process.stdout.write(`\r  ${++n}/${alvos.length}`);
  }
  console.log();

  console.log(`4/4 grade do mapa (H3 resolução ${H3_RES})`);
  n = 0;
  for (const a of alvos) {
    const { cont, pontos } = await celulas(a.taxon_id);
    for (const [h, c] of cont) gravar('ocorrencias_celulas', { taxon_id: a.taxon_id, h3: h, resolucao: H3_RES, registros: c, fonte: 'inaturalist' });
    process.stdout.write(`\r  ${++n}/${alvos.length} (${pontos} pontos em ${cont.size} células)      `);
  }
  console.log();

  gravar('fontes', { codigo: 'inaturalist', nome: 'iNaturalist', url: 'https://www.inaturalist.org', licenca: 'dados CC0/CC BY/CC BY-NC por registro; fotos filtradas para CC0, CC BY e CC BY-SA', acessado_em: hoje });
  Object.values(arquivos).forEach((fd) => fs.closeSync(fd));
  console.log(`Pronto. ${chamadas} chamadas à API, ${doCache} vindas do cache. Arquivos em saida/.`);
}

main().catch((e) => { console.error('\nERRO:', e.message); process.exit(1); });
