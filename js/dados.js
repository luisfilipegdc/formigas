/* =====================================================================
   dados.js — fotos e dados reais, buscados na hora (sem cadastro, sem chave)
     • iNaturalist (api.inaturalist.org): foto com licença livre, quantas
       vezes o bicho já foi fotografado e a árvore da família (taxonomia).
     • Wikipédia em português: resumo para adultos e foto reserva.
   As fotos principais ficam no próprio site (img/animais, campo "fotos" em
   catalogo.js), então aparecem sempre, mesmo sem internet.
   Tudo é guardado no aparelho por 14 dias para abrir rápido e funcionar
   com internet fraca. Se não houver internet, o site usa os emojis.
   ===================================================================== */
const Dados = (function () {
  const API = 'https://api.inaturalist.org/v1/';
  const WIKI = 'https://pt.wikipedia.org/api/rest_v1/page/summary/';
  const V = 'dados1:', VALIDADE = 14 * 864e5;
  const mem = {};
  const enc = encodeURIComponent;

  function ler(k) {
    try { const o = JSON.parse(localStorage.getItem(V + k)); if (o && Date.now() - o.t < VALIDADE) return o.d; } catch (e) {}
    return null;
  }
  function gravar(k, d) { try { localStorage.setItem(V + k, JSON.stringify({ t: Date.now(), d: d })); } catch (e) {} }
  function json(url) {
    const ctl = window.AbortController ? new AbortController() : null;
    const tm = ctl && setTimeout(() => ctl.abort(), 9000);
    return fetch(url, ctl ? { signal: ctl.signal } : {})
      .then((r) => { clearTimeout(tm); return r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status)); });
  }
  function cache(k, fn) {
    if (mem[k]) return mem[k];
    const c = ler(k);
    if (c) return (mem[k] = Promise.resolve(c));
    return (mem[k] = fn().then((d) => { gravar(k, d); return d; }, (e) => { delete mem[k]; throw e; }));
  }
  // só usamos fotos com licença Creative Commons (license_code preenchido)
  function foto(p) {
    if (!p || !p.license_code) return null;
    const url = p.medium_url || (p.url || '').replace('/square.', '/medium.');
    return url ? { url: url, autor: p.attribution || '', lic: p.license_code.toUpperCase() } : null;
  }

  function taxon(A) {
    return cache('t:' + A.id, () => json(API + 'taxa?q=' + enc(A.busca) + '&is_active=true&per_page=10&locale=pt-BR').then((r) => {
      const res = r.results || [];
      const t = res.find((x) => x.name === A.busca) || res[0];
      if (!t) throw new Error('não encontrado');
      return { id: t.id, nome: t.name, comum: t.preferred_common_name || '', obs: t.observations_count || 0, foto: foto(t.default_photo) };
    }));
  }
  const RANKS = { kingdom: 'Reino', phylum: 'Filo', class: 'Classe', order: 'Ordem', family: 'Família', genus: 'Gênero', species: 'Espécie' };
  function detalhe(A) {
    return taxon(A).then((b) => cache('d:' + A.id, () => json(API + 'taxa/' + b.id + '?locale=pt-BR').then((r) => {
      const t = (r.results || [])[0];
      if (!t) throw new Error('sem detalhe');
      const arvore = (t.ancestors || []).concat([t]).filter((x) => RANKS[x.rank])
        .map((x) => ({ nivel: RANKS[x.rank], nome: x.name, comum: x.preferred_common_name || '' }));
      const fotos = (t.taxon_photos || []).map((x) => foto(x.photo)).filter(Boolean).slice(0, 6);
      return { arvore: arvore, fotos: fotos };
    })));
  }
  function wiki(A) {
    return cache('w:' + A.id, () => json(WIKI + enc(A.wiki)).then((r) => ({
      texto: r.extract || '', foto: r.thumbnail ? { url: r.thumbnail.source, autor: 'Wikipédia / Wikimedia Commons', lic: '' } : null
    })));
  }
  // fotos guardadas no próprio site (img/animais), escolhidas do iNaturalist
  function locais(A) {
    return (A.fotos || []).map((f, i) => ({
      url: f.arquivo, mini: i === 0 ? f.arquivo.replace(/\.jpg$/, 'p.jpg') : f.arquivo,
      autor: f.autor + ' · ' + f.lic + ' · iNaturalist', lic: f.lic, especie: f.especie
    }));
  }
  // foto principal: a do site; senão iNaturalist; senão Wikipédia
  function fotoPrincipal(A) {
    if (A.fotos && A.fotos.length) return Promise.resolve(locais(A)[0]);
    return taxon(A).then((t) => t.foto || Promise.reject(new Error('sem foto livre')))
      .catch(() => wiki(A).then((w) => w.foto || Promise.reject(new Error('sem foto'))));
  }
  return { taxon: taxon, detalhe: detalhe, wiki: wiki, foto: fotoPrincipal, locais: locais };
})();
