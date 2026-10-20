#!/usr/bin/env node
/* =====================================================================
   Teste do loop do Brasil Vivo (T10): joga o ciclo da borboleta inteiro
   num navegador de verdade e falha se algum passo quebrar.
   ver a borboleta → achar o ovo → colher folha → Viveiro (arrastar) →
   transformação → soltar no jardim (50%) → jataí na caixa-isca (100%) →
   recarregar e conferir que tudo ficou salvo.

   Como rodar (na raiz do repositório):
     python3 -m http.server 8765 &
     node ferramentas/teste-brasilvivo.js            # versão 2D (principal)
     node ferramentas/teste-brasilvivo.js 3d         # versão 3D antiga
   Precisa do Playwright (npm i playwright, ou PLAYWRIGHT_PATH=caminho/do/módulo).
   Variáveis: URL (padrão http://localhost:8765/brasilvivo/), FOTOS=pasta para salvar telas.
   ===================================================================== */
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const versao = process.argv[2] === '3d' ? '3d/' : '';
const URL = (process.env.URL || 'http://localhost:8765/brasilvivo/') + versao;
const FOTOS = process.env.FOTOS;
let falhas = 0;
const ok = (cond, msg) => { console.log((cond ? '  ✓ ' : '  ✗ ') + msg); if (!cond) falhas++; };

(async () => {
  const navegador = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const p = await (await navegador.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
  const erros = []; p.on('pageerror', (e) => erros.push(e.message));
  const foto = (n) => FOTOS ? p.screenshot({ path: FOTOS + '/' + n + '.png' }) : null;
  const ir = (x, z) => p.evaluate(([x, z]) => { const t = window.__terra; if (t.jog.pos) { t.jog.pos.x = x; t.jog.pos.z = z; } else t.jog.mesh.position.set(x, 0, z); }, [x, z]);
  const acao = async () => { await p.waitForTimeout(500); return p.evaluate(() => document.getElementById('acao').hidden ? '' : document.getElementById('acao-bt').textContent); };
  const tocarAcao = async () => { await p.click('#acao-bt'); await p.waitForTimeout(350); };
  const opcao = async (i) => { await p.click('#dialogo-opcoes button:nth-child(' + (i + 1) + ')'); await p.waitForTimeout(250); };
  const T = (fn, arg) => p.evaluate(fn, arg);
  const passo = () => T(() => document.getElementById('obj-txt').textContent);
  const arrastar = async (rec) => {
    const a = await p.locator('.item[data-rec="' + rec + '"]').boundingBox(), n = await p.locator('[data-alvo]').first().boundingBox();
    await p.mouse.move(a.x + a.width / 2, a.y + a.height / 2); await p.mouse.down();
    for (let k = 1; k <= 8; k++) await p.mouse.move(a.x + a.width / 2 + (n.x + 40 - a.x - a.width / 2) * k / 8, a.y + a.height / 2 + (n.y + n.height / 2 - a.y - a.height / 2) * k / 8);
    await p.mouse.up(); await p.waitForTimeout(300);
  };

  console.log('Brasil Vivo ' + (versao ? '3D' : '2D') + ' · ' + URL);
  await p.goto(URL); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(1500);
  ok(await T(() => window.__terra && window.__terra.erros.length === 0), 'registro de conteúdo sem erros');
  await p.click('#inicio-bt'); await p.waitForTimeout(400); await opcao(0);

  console.log('Começo');
  await ir(-58, 52); await acao(); await tocarAcao(); await opcao(0); await opcao(0);
  ok(/ovinho/.test(await passo()), 'depois de falar com Dona Flor, o passo é procurar o ovinho');
  await ir(-96, 81); ok(/Examinar/.test(await acao()), 'perto do ovo aparece "Examinar"');
  await tocarAcao(); await opcao(0);
  ok(await T(() => window.__terra.estado.ninho.length === 1), 'o ovo foi para o Viveiro');

  console.log('Viveiro (T5) e planta-hospedeira (T6)');
  await p.click('#bt-ninho'); await p.waitForTimeout(300); await foto('1-viveiro');
  await arrastar('sombra'); ok(await T(() => window.__terra.estado.ninho[0].dado.includes('sombra')), 'arrastar a sombra até o ovo funciona');
  await arrastar('quieto'); ok(await T(() => /não ajuda/.test(document.querySelector('.viv-msg').textContent)), 'item errado volta com a frase do que ajuda');
  await p.click('#painel-x');
  await ir(-99, 85); ok(/Colher/.test(await acao()), 'perto da planta-hospedeira aparece "Colher folha"');
  await tocarAcao(); ok(await T(() => window.__terra.estado.bolsa['folha-hospedeira'] === 2), 'colher dá 2 folhas');
  await p.click('#bt-ninho'); await p.waitForTimeout(300); await arrastar('folha-hospedeira');
  ok(await T(() => !!window.__terra.estado.ninho[0].desde), 'com folha e sombra, a transformação começa');
  await p.click('#painel-x');
  for (const [rec, fase] of [['folha-hospedeira', 'lagarta'], ['quieto', 'crisalida']]) {
    await T(() => window.__terra.acelerar(5)); await p.waitForTimeout(300);
    ok(await T((f) => window.__terra.estado.ninho[0].fase === f, fase), 'virou ' + fase);
    await p.click('#bt-ninho'); await p.waitForTimeout(300); await p.tap('.item[data-rec="' + rec + '"]'); await p.waitForTimeout(300); await p.click('#painel-x');
  }
  await T(() => window.__terra.acelerar(5)); await p.waitForTimeout(300);
  ok(await T(() => window.__terra.mundo.companheiros.some((c) => c.id === 'borboleta-azul')), 'a borboleta adulta acompanha o jogador');
  await p.waitForTimeout(8000);   // deixa a fila de celebrações passar

  console.log('Jardim Polinizador (T7)');
  await ir(24, 80); await p.waitForTimeout(600); ok(/Soltar/.test(await acao()), 'no jardim aparece "Soltar"');
  await tocarAcao(); await p.waitForTimeout(1500); await foto('2-onda');
  await p.waitForTimeout(2600); await opcao(0);
  ok(await T(() => window.__terra.Ruido.clareza('jardim') === 0.5), 'Clareza do jardim foi a 50%');
  ok(await T(() => window.__terra.mundo.flores.filter((f) => f.aberta).length > 10), 'as flores abriram');
  ok(await T(() => window.__terra.Biodex.marcos('borboleta-azul').length === 6), 'borboleta com os 6 marcos da BioDex');
  await ir(52, 87); ok(/Examinar/.test(await acao()), 'caixa-isca antes de ver a jataí: só examinar');
  await tocarAcao(); await opcao(0);
  await T(() => window.__terra.Biodex.relacao('jatai-poliniza-flor', 'vista')); await p.waitForTimeout(8000);
  ok(/Reativar/.test(await acao()), 'depois de ver a jataí polinizar: "Reativar"');
  await tocarAcao(); await p.waitForTimeout(4300); await opcao(0); await opcao(0);
  ok(await T(() => window.__terra.Ruido.clareza('jardim') === 1), 'Clareza do jardim foi a 100%');
  ok(/completa/.test(await passo()), 'jornada completa'); await foto('3-jardim');

  console.log('Salvo');
  await T(() => window.__terra.salvar()); await p.reload(); await p.waitForTimeout(1500);
  ok(await T(() => window.__terra.mundo.bichos.filter((b) => b.area.id === 'jardim').length >= 7), 'os bichos soltos continuam no jardim');
  ok(await T(() => window.__terra.mundo.companheiros.length === 0 && window.__terra.estado.ninho.length === 0), 'Viveiro e companheiros liberados');
  ok(erros.length === 0, 'nenhum erro de JavaScript' + (erros.length ? ': ' + erros.join(' | ') : ''));

  await navegador.close();
  console.log(falhas ? '\n' + falhas + ' falha(s).' : '\nTudo certo.');
  process.exit(falhas ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
