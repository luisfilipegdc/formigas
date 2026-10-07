/* =====================================================================
   app.js — liga o modo "sem internet" (service worker, sw.js) e, no
   catálogo, mostra se o aparelho já está pronto e como instalar o app.
   ===================================================================== */
(function () {
  const temSW = 'serviceWorker' in navigator && location.protocol !== 'file:';
  if (temSW) addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));

  const el = document.getElementById('offline');
  if (!el) return;
  const instalado = navigator.standalone || matchMedia('(display-mode: standalone)').matches;
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  function mostrar(pronto) {
    let h = '';
    if (pronto) h = '✅ <b>Pronto para usar sem internet</b> neste aparelho.';
    if (!instalado && ios) h += (h ? '<br>' : '') + '📲 Para abrir na escola mesmo sem internet: toque em <b>Compartilhar</b> e depois em <b>“Adicionar à Tela de Início”</b>.';
    else if (!instalado && window.__pedidoInstalar) h += (h ? '<br>' : '') + '<button type="button" id="instalar">📲 Instalar o app</button>';
    el.innerHTML = h; el.hidden = !h;
    const b = document.getElementById('instalar');
    if (b) b.onclick = () => { window.__pedidoInstalar.prompt(); window.__pedidoInstalar = null; mostrar(pronto); };
  }
  // Chrome/Android oferecem instalar; o iPad usa o menu Compartilhar
  addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); window.__pedidoInstalar = e; verificar(); });
  // "pronto" só quando a última foto da lista já está guardada (a instalação terminou)
  function verificar() {
    if (!temSW || !window.caches) return mostrar(false);
    navigator.serviceWorker.ready.then(() => caches.keys()).then((ks) => {
      const k = ks.find((x) => x.startsWith('animais3d-') && x !== 'animais3d-fontes');
      return k ? caches.open(k).then((c) => c.match('img/animais/tartaruga-3.jpg')).then(Boolean) : false;
    }).then(mostrar, () => mostrar(false));
  }
  mostrar(false);
  verificar();
  if (temSW) navigator.serviceWorker.addEventListener('controllerchange', verificar);
})();
