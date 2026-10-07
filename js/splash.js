/* =====================================================================
   splash.js — abertura e boas-vindas da página inicial
   • 1º acesso: splash de ~4 s, com bichos passando, e depois "Olá, explorador!".
   • Próximos acessos: splash curta, com saudação e bichos encontrados.
   • Na mesma sessão (voltando de uma tela 3D): sem splash.
   Tocar na splash pula. Tudo fica só neste aparelho.
   ===================================================================== */
(function () {
  const el = document.getElementById('splash');
  if (!el) return;
  const guarda = (k, v) => { try { v === undefined ? (v = localStorage.getItem(k)) : localStorage.setItem(k, v); } catch (e) { v = null; } return v; };
  let nestaSessao = false;
  try { nestaSessao = sessionStorage.getItem('eub-splash') === '1'; sessionStorage.setItem('eub-splash', '1'); } catch (e) {}
  if (nestaSessao) { el.remove(); return; }

  const aberturas = +(guarda('eub-aberturas') || 0);
  guarda('eub-aberturas', aberturas + 1);
  const primeira = aberturas === 0;
  // bichos que passam pela tela (js/splash-bichos.js)
  if (typeof SplashBichos !== 'undefined') el.querySelector('.splash-centro').insertAdjacentHTML('beforebegin', SplashBichos.folhas() + SplashBichos.html(!primeira));

  // saudação: quantos bichos já foram encontrados neste aparelho (js/progresso.js)
  let encontrados = 0;
  try { const d = JSON.parse(localStorage.getItem('progresso1')) || {}; encontrados = Object.keys(d).filter((k) => Object.keys(d[k]).length).length; } catch (e) {}
  if (!primeira) {
    el.classList.add('rapida');
    const h = new Date().getHours();
    const oi = (h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite') + ', explorador!';
    el.querySelector('.splash-oi').textContent = encontrados
      ? oi + ' Você já encontrou ' + encontrados + (encontrados === 1 ? ' bicho.' : ' bichos.')
      : oi;
  }

  let fechada = false;
  function fechar() {
    if (fechada) return;
    fechada = true;
    el.classList.add('saindo');
    setTimeout(() => { el.remove(); if (primeira) boasVindas(); }, 450);
  }
  el.addEventListener('click', fechar);
  setTimeout(fechar, primeira ? 4400 : 1500);

  function boasVindas() {
    const bv = document.createElement('div');
    bv.className = 'boas-vindas';
    bv.setAttribute('role', 'dialog');
    bv.setAttribute('aria-modal', 'true');
    bv.setAttribute('aria-labelledby', 'bv-titulo');
    bv.innerHTML = '<div class="caixa"><img src="img/mascote/curu-rosto-360.jpg" alt="">' +
      '<h2 id="bv-titulo">Olá, explorador!</h2><p>Vamos descobrir o mundo dos bichos?</p>' +
      '<button class="btn btn-primario" type="button" data-ir="#bichos">Começar a explorar</button>' +
      '<button class="btn btn-claro" type="button" data-ir="#adultos">Sou responsável</button></div>';
    document.body.appendChild(bv);
    bv.querySelector('.btn-primario').focus();
    bv.querySelectorAll('[data-ir]').forEach((b) => b.addEventListener('click', () => {
      bv.remove();
      const alvo = document.querySelector(b.dataset.ir);
      if (alvo) alvo.scrollIntoView();
    }));
  }
})();
