/* Service worker de desligamento (09/10/2026).
   Até aqui o site dos bichos ficava na raiz e guardava a página inicial no aparelho.
   Agora a raiz é o app e os bichos estão em /explorar/ (com o próprio service worker).
   Este arquivo substitui o antigo: limpa o cache velho, se desregistra e recarrega a página. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const chaves = await caches.keys();
    await Promise.all(chaves.map((k) => caches.delete(k)));
    await self.registration.unregister();
    const janelas = await self.clients.matchAll({ type: 'window' });
    janelas.forEach((j) => j.navigate(j.url));
  })());
});
