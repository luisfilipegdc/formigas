/* =====================================================================
   sw.js — guarda o site no aparelho para funcionar sem internet
   (por exemplo, no Wi-Fi da escola que bloqueia o endereço).
   A lista abaixo é gerada por: python3 ferramentas/atualizar-cache.py
   ===================================================================== */
const VERSAO = '669d6ecf3f';
const CACHE = 'animais3d-' + VERSAO;
const FONTES = 'animais3d-fontes';
const ARQUIVOS = [
  './',
  './abelha.html',
  './comparar.html',
  './css/catalogo.css',
  './css/formiga.css',
  './css/marca.css',
  './css/splash.css',
  './formiga.html',
  './img/animais/abelha-1.jpg',
  './img/animais/abelha-1p.jpg',
  './img/animais/abelha-2.jpg',
  './img/animais/abelha-3.jpg',
  './img/animais/arara-1.jpg',
  './img/animais/arara-1p.jpg',
  './img/animais/arara-2.jpg',
  './img/animais/arara-3.jpg',
  './img/animais/beijaflor-1.jpg',
  './img/animais/beijaflor-1p.jpg',
  './img/animais/beijaflor-2.jpg',
  './img/animais/beijaflor-3.jpg',
  './img/animais/borboleta-1.jpg',
  './img/animais/borboleta-1p.jpg',
  './img/animais/borboleta-2.jpg',
  './img/animais/borboleta-3.jpg',
  './img/animais/formiga-1.jpg',
  './img/animais/formiga-1p.jpg',
  './img/animais/formiga-2.jpg',
  './img/animais/formiga-3.jpg',
  './img/animais/joaninha-1.jpg',
  './img/animais/joaninha-1p.jpg',
  './img/animais/joaninha-2.jpg',
  './img/animais/joaninha-3.jpg',
  './img/animais/onca-1.jpg',
  './img/animais/onca-1p.jpg',
  './img/animais/onca-2.jpg',
  './img/animais/onca-3.jpg',
  './img/animais/pirarucu-1.jpg',
  './img/animais/pirarucu-1p.jpg',
  './img/animais/pirarucu-2.jpg',
  './img/animais/preguica-1.jpg',
  './img/animais/preguica-1p.jpg',
  './img/animais/preguica-2.jpg',
  './img/animais/preguica-3.jpg',
  './img/animais/sapo-1.jpg',
  './img/animais/sapo-1p.jpg',
  './img/animais/sapo-2.jpg',
  './img/animais/sapo-3.jpg',
  './img/animais/tartaruga-1.jpg',
  './img/animais/tartaruga-1p.jpg',
  './img/animais/tartaruga-2.jpg',
  './img/animais/tartaruga-3.jpg',
  './img/icone/apple-touch-icon.png',
  './img/icone/favicon.png',
  './img/icone/icone-192.png',
  './img/icone/icone-512.png',
  './img/icone/icone-maskable-512.png',
  './img/marca/compartilhar.jpg',
  './img/marca/logo-completo-320.png',
  './img/marca/logo-completo-640.png',
  './img/marca/logo-horizontal-144.png',
  './img/marca/logo-horizontal-96.png',
  './img/marca/logo-nome-760.png',
  './img/mascote/mascote-lupa-360.jpg',
  './img/mascote/mascote-lupa.jpg',
  './index.html',
  './js/app.js',
  './js/catalogo.js',
  './js/core3d.js',
  './js/dados.js',
  './js/ficha.js',
  './js/formiga.js',
  './js/home.js',
  './js/icones.js',
  './js/progresso.js',
  './js/splash-bichos.js',
  './js/splash.js',
  './manifest.webmanifest',
  './qr.html',
  './vendor/qrcode.js',
  './vendor/three/MarchingCubes.js',
  './vendor/three/OrbitControls.js',
  './vendor/three/RoomEnvironment.js',
  './vendor/three/three.min.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => Promise.all(ARQUIVOS.map((u) =>
    fetch(u, { cache: 'reload' }).then((r) => r.ok && c.put(u, r)).catch(() => {})
  ))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks
    .filter((k) => k.startsWith('animais3d-') && k !== CACHE && k !== FONTES)
    .map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

// mesma origem: responde na hora com o que está guardado e atualiza por trás
function doSite(req) {
  const url = new URL(req.url);
  const chave = url.pathname.endsWith('/') ? url.pathname + 'index.html' : url.pathname;
  return caches.open(CACHE).then((c) => c.match(chave, { ignoreSearch: true }).then((guardado) => {
    const rede = fetch(req).then((r) => {
      if (r.ok && r.type === 'basic') c.put(chave, r.clone());
      return r;
    });
    if (guardado) { rede.catch(() => {}); return guardado; }
    return rede.catch(() => req.mode === 'navigate' ? c.match('./index.html') : Response.error());
  }));
}
// fontes do Google: guarda na primeira vez que carregam
function fonte(req) {
  return caches.open(FONTES).then((c) => c.match(req).then((g) => g || fetch(req).then((r) => {
    if (r.ok || r.type === 'opaque') c.put(req, r.clone());
    return r;
  })));
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) e.respondWith(doSite(req));
  else if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) e.respondWith(fonte(req));
  // APIs (iNaturalist, Wikipédia) vão direto para a rede; js/dados.js já guarda as respostas
});
