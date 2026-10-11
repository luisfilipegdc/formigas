/* =====================================================================
   home.js — página inicial do Bio no Bolso
   Monta as experiências 3D, o catálogo (busca + categorias), o álbum de
   descobertas e a missão. Dados em js/catalogo.js; fotos via js/dados.js;
   descobertas via js/progresso.js; ficha via js/ficha.js.
   ===================================================================== */
(function () {
  const $ = (id) => document.getElementById(id);
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const porId = (id) => ANIMAIS.find((a) => a.id === id);
  const encontrado = (A) => Progresso.conta(A).feitas > 0;
  let grupo = 'todos', todos = false;
  const LIMITE = 8;

  // coloca a foto real (guardada no site) num contêiner com <img>
  function foto(A, box, grande) {
    Dados.foto(A).then((f) => {
      const img = box.querySelector('img');
      img.onload = () => box.classList.add('ok');
      img.alt = 'Foto de ' + A.nome;
      img.src = grande ? f.url : (f.mini || f.url);
    }).catch(() => {});
  }

  // ---------- ícones fixos do HTML ----------
  document.querySelectorAll('[data-ico]').forEach((el) => { el.insertAdjacentHTML('afterbegin', Icone(el.dataset.ico)); });

  // ---------- "Que bicho você quer conhecer?": grupos com foto real ----------
  const ROSTO = { aracnideos: 'aranha', insetos: 'joaninha', aves: 'arara', mamiferos: 'onca', repteis: 'tartaruga', anfibios: 'sapo', peixes: 'pirarucu' };
  GRUPOS.filter((g) => g.id !== 'todos').forEach((g) => {
    const A = porId(ROSTO[g.id]) || ANIMAIS.find((a) => a.grupo === g.id);
    if (!A) return;
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'cat';
    const f = Dados.locais(A)[0];
    b.innerHTML = '<span><img alt="" loading="lazy" src="' + esc(f ? f.mini : '') + '"></span>' + esc(g.nome);
    b.addEventListener('click', () => { grupo = g.id; todos = true; render(); $('bichos').scrollIntoView(); });
    $('cats').appendChild(b);
  });

  // ---------- "Comece sua descoberta": 4 bichos em destaque ----------
  ['formiga', 'abelha', 'borboleta', 'onca'].map(porId).filter(Boolean).forEach((A) => {
    const g = GRUPOS.find((x) => x.id === A.grupo);
    const el = document.createElement('article');
    el.className = 'dest';
    el.innerHTML = '<div class="dest-foto"><img alt="Foto de ' + esc(A.nome) + '" loading="lazy" src="' + esc(Dados.locais(A)[0] ? Dados.locais(A)[0].url : '') + '">' +
      (A.pagina ? '<span class="badge badge-3d">' + Icone('cubo') + 'Tem 3D</span>' : '') + '</div>' +
      '<div class="dest-corpo"><h3>' + esc(A.nome) + '</h3><small>' + esc(g ? g.nome : '') + '</small>' +
      '<button class="btn btn-3d" type="button">Explorar →</button></div>';
    el.querySelector('button').addEventListener('click', () => Ficha.abrir(A.id));
    $('destaques').appendChild(el);
  });

  // ---------- "Explore em 3D": todos os bichos com 3D (exceto a formiga, que está na janela grande) ----------
  ANIMAIS.filter((A) => A.pagina && A.id !== 'formiga').forEach((A) => {
    const a = document.createElement('a');
    a.className = 'mini'; a.href = A.pagina;
    const f = Dados.locais(A)[0];
    a.innerHTML = '<img alt="" loading="lazy" src="' + esc(f ? f.mini : '') + '"><div>' + (A.porDentro ? '<em class="badge badge-dentro">🧩 Explore por dentro</em>' : '') + '<b>' + esc(A.nome) + ' em 3D</b><span>' + esc((A.destaques || []).map((d) => d.replace(/^\S+\s/, '')).join(' · ')) + '</span></div>';
    $('minis').appendChild(a);
  });
  { const a = document.createElement('a');
    a.className = 'mini'; a.href = 'comparar.html?a=formiga&b=onca';
    a.innerHTML = '<span class="mini-duo"><img src="img/animais/formiga-1p.jpg" alt="" loading="lazy"><img src="img/animais/onca-1p.jpg" alt="" loading="lazy"></span><div><b>Qual bicho é maior?</b><span>Compare tamanho, comida e parentesco</span></div>';
    $('minis').appendChild(a); }

  // ---------- categorias ----------
  const chips = $('chips');
  GRUPOS.forEach((g) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.dataset.g = g.id;
    b.innerHTML = Icone(g.id) + esc(g.nome);
    b.addEventListener('click', () => { grupo = g.id; render(); });
    chips.appendChild(b);
  });

  // ---------- catálogo ----------
  const grade = $('grade'), q = $('q');
  function cartao(A) {
    const r = A.rapido || {};
    const el = document.createElement('article');
    el.className = 'card'; el.dataset.id = A.id;
    el.style.setProperty('--cor', A.cor);
    el.innerHTML = '<div class="card-foto"><img alt="" loading="lazy"><span class="card-emoji" aria-hidden="true">' + A.emoji + '</span>' +
      (A.porDentro ? '<span class="badge badge-dentro">🧩 Explore por dentro</span>' : '') +
      (A.pagina ? '<a class="badge badge-3d" href="' + A.pagina + '">' + Icone('cubo') + 'Explorar em 3D</a>'
                : '<span class="badge badge-ficha">Conhecer o bicho</span>') +
      '<span class="badge badge-ok" hidden>' + Icone('check') + 'Encontrado</span></div>' +
      '<div class="card-corpo"><h3>' + esc(A.nome) + '</h3><i>' + esc(A.cientifico) + '</i><p>' + esc(A.resumo || '') + '</p>' +
      '<ul class="fatos">' +
      (r.tamanho ? '<li>' + Icone('regua') + esc(r.tamanho) + '</li>' : '') +
      (r.onde ? '<li>' + Icone('local') + esc(r.onde) + '</li>' : '') +
      (r.come ? '<li>' + Icone('comida') + esc(r.come) + '</li>' : '') + '</ul></div>' +
      '<button class="card-abrir" type="button" aria-label="Conhecer o bicho: ' + esc(A.nome) + '"></button>';
    el.querySelector('.card-abrir').addEventListener('click', () => Ficha.abrir(A.id));
    foto(A, el.querySelector('.card-foto'));
    return el;
  }
  function render() {
    chips.querySelectorAll('.chip').forEach((b) => {
      b.classList.toggle('on', b.dataset.g === grupo);
      b.setAttribute('aria-pressed', b.dataset.g === grupo);
    });
    const t = norm(q.value.trim());
    const ordemG = (a) => GRUPOS.findIndex((g) => g.id === a.grupo);
    const lista = ANIMAIS.slice().sort((a, b) => ordemG(a) - ordemG(b)).filter((a) => (grupo === 'todos' || a.grupo === grupo) &&
      (!t || norm(a.nome + ' ' + a.cientifico + ' ' + (a.resumo || '')).includes(t)));
    // na home: 8 bichos; ao buscar, filtrar ou tocar em "Ver todos", a lista inteira
    const tudo = todos || t || grupo !== 'todos';
    grade.innerHTML = '';
    lista.slice(0, tudo ? lista.length : LIMITE).forEach((a) => grade.appendChild(cartao(a)));
    $('vermais').hidden = tudo || lista.length <= LIMITE;
    $('vazio').hidden = lista.length > 0;
    atualizar();
  }
  q.addEventListener('input', render);
  $('busca').addEventListener('submit', (e) => { e.preventDefault(); q.blur(); $('bichos').scrollIntoView(); });
  q.addEventListener('input', () => { if (q.value.trim()) $('bichos').scrollIntoView({ block: 'start' }); });
  $('vermais').addEventListener('click', () => { todos = true; render(); });

  // ---------- descobertas, álbum e missão ----------
  function atualizar() {
    const n = Progresso.encontrados(), total = ANIMAIS.length;
    grade.querySelectorAll('.card').forEach((el) => { el.querySelector('.badge-ok').hidden = !encontrado(porId(el.dataset.id)); });
    $('primeira').hidden = n > 0;
    $('contador').textContent = n;
    $('contador').setAttribute('aria-label', n + ' de ' + total + ' bichos encontrados');
    $('prog-n').textContent = n ? n + (n === 1 ? ' bicho no bolso' : ' bichos no bolso') : 'Seu bolso está vazio. Vamos encontrar o primeiro bicho?';
    $('prog-de').textContent = n + ' de ' + total;
    $('prog-barra').style.width = (100 * n / total) + '%';
    $('por-grupo').innerHTML = GRUPOS.filter((g) => g.id !== 'todos').map((g) => {
      const doGrupo = ANIMAIS.filter((a) => a.grupo === g.id);
      return '<li>' + Icone(g.id) + esc(g.nome) + ' · ' + doGrupo.filter(encontrado).length + '/' + doGrupo.length + '</li>';
    }).join('');
    const nv = Progresso.nivel(n);
    $('nivel').innerHTML = '<span class="nivel-emoji">' + nv.emoji + '</span><div><b>' + esc(nv.nome) + '</b>' +
      (nv.proximo ? 'Faltam ' + nv.falta + (nv.falta === 1 ? ' bicho' : ' bichos') + ' para ' + esc(nv.proximo) + '.' : 'Você encontrou todos os bichos!') + '</div>';
    $('colecoes').innerHTML = COLECOES.map((C) => {
      const tem = C.bichos.filter((id) => porId(id) && encontrado(porId(id))).length, tot = C.bichos.length;
      return '<li class="' + (tem === tot ? 'completa' : '') + '"><span class="col-emoji">' + C.emoji + '</span><div><b>' + esc(C.nome) + '</b>' +
        '<span class="barra"><span style="width:' + (100 * tem / tot) + '%"></span></span></div><em>' + (tem === tot ? '🏅 ' + esc(C.selo) : tem + '/' + tot + (tot - tem === 1 ? ' · falta só um!' : '')) + '</em></li>';
    }).join('');
    const album = $('album');
    album.innerHTML = '';
    ANIMAIS.forEach((A, i) => album.appendChild(carta(A, i + 1)));
    missao();
  }
  // carta do bolso: frente com foto e número; fora do bolso, "Quem sou eu?" com pista
  const num = (i) => '#' + String(i).padStart(3, '0');
  function carta(A, i) {
    const b = document.createElement('button');
    b.type = 'button';
    if (encontrado(A)) {
      const v = Progresso.vezes(A.id);
      b.className = 'carta';
      b.innerHTML = '<img alt="" src="' + esc(Dados.locais(A)[0] ? Dados.locais(A)[0].mini : '') + '"><em>' + num(i) + '</em>' +
        (v ? '<i title="Encontrado de verdade">👀 ' + v + '</i>' : '') + '<span>' + esc(A.nome) + '</span>';
      b.setAttribute('aria-label', 'Carta ' + num(i) + ': ' + A.nome + (v ? ', encontrado de verdade ' + v + (v === 1 ? ' vez' : ' vezes') : ''));
      b.addEventListener('click', () => Ficha.abrir(A.id));
    } else {
      b.className = 'carta falta';
      b.innerHTML = '<em>' + num(i) + '</em><span class="frente">' + Icone('cadeado') + '<b>???</b></span>' +
        '<span class="verso"><b>Quem sou eu?</b>' + esc(A.pista || '') + '<u>Descobrir</u></span>';
      b.setAttribute('aria-label', 'Carta ' + num(i) + ': bicho ainda fora do bolso. Toque para ver a pista.');
      b.addEventListener('click', () => {
        if (!b.classList.contains('virada')) { b.classList.add('virada'); b.setAttribute('aria-label', 'Pista: ' + (A.pista || '') + '. Toque de novo para descobrir.'); }
        else Ficha.abrir(A.id);
      });
    }
    return b;
  }

  // "Encontrei um!": a criança viu um bicho de verdade e escolhe qual foi
  function encontrei() {
    const dlg = document.createElement('div');
    dlg.className = 'janela';
    dlg.setAttribute('role', 'dialog'); dlg.setAttribute('aria-modal', 'true'); dlg.setAttribute('aria-labelledby', 'enc-t');
    dlg.innerHTML = '<div class="caixa"><button class="fechar" type="button" aria-label="Fechar">' + Icone('fechar') + '</button>' +
      '<h2 id="enc-t">Que bicho você encontrou?</h2><p>Viu um destes de verdade? Toque nele para colocar no bolso.</p>' +
      '<div class="escolha">' + ANIMAIS.map((A) => '<button type="button" data-id="' + A.id + '"><img alt="" src="' + esc(Dados.locais(A)[0] ? Dados.locais(A)[0].mini : '') + '"><span>' + esc(A.nome) + '</span></button>').join('') + '</div>' +
      '<p class="aviso-seg">👀 Observe sem tocar. Alguns bichos picam ou mordem: chame um adulto.</p>' +
      '<p class="em-breve">Não achou o seu? Em breve: tirar uma foto para descobrir quem é.</p></div>';
    const fechar = () => { dlg.remove(); document.removeEventListener('keydown', esc_); };
    const esc_ = (e) => { if (e.key === 'Escape') fechar(); };
    document.addEventListener('keydown', esc_);
    dlg.addEventListener('click', (e) => { if (e.target === dlg) fechar(); });
    dlg.querySelector('.fechar').addEventListener('click', fechar);
    dlg.querySelectorAll('.escolha button').forEach((b) => b.addEventListener('click', () => {
      Progresso.observar(b.dataset.id); fechar(); atualizar();
    }));
    document.body.appendChild(dlg);
    dlg.querySelector('.escolha button').focus();
  }
  $('encontrei').addEventListener('click', encontrei);
  $('encontrei2').addEventListener('click', encontrei);

  // janela simples (Entrar, roteiro de aula)
  function janela(html) {
    const dlg = document.createElement('div');
    dlg.className = 'janela'; dlg.setAttribute('role', 'dialog'); dlg.setAttribute('aria-modal', 'true');
    dlg.innerHTML = '<div class="caixa"><button class="fechar" type="button" aria-label="Fechar">' + Icone('fechar') + '</button>' + html + '</div>';
    const fechar = () => dlg.remove();
    dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target.closest('.fechar, [data-fechar]')) fechar(); });
    document.body.appendChild(dlg);
    dlg.querySelector('.fechar').focus();
  }
  // Entrar: leva para a conta (app na raiz do domínio). Com conta, mostra o apelido.
  function botaoConta() {
    const sx = Progresso.sessao();
    $('entrar').textContent = sx ? sx.apelido : 'Entrar';
    $('entrar').setAttribute('aria-label', sx ? 'Minha conta (' + sx.apelido + ')' : 'Entrar ou criar conta');
  }
  $('entrar').addEventListener('click', () => { location.href = Progresso.sessao() ? '/conta' : '/entrar'; });
  document.addEventListener('progresso-sincronizado', () => { botaoConta(); atualizar(); });
  $('roteiro').addEventListener('click', () => janela('<h2>Uma aula com o Bio no Bolso</h2><p>"Quem vive debaixo da terra?" · 1º ao 3º ano · 45 minutos</p><ol class="roteiro">' +
    '<li><b>5 min</b> Pergunta: o que a formiga come? Anote as hipóteses.</li><li><b>10 min</b> Explorar a operária em 3D: pernas, antenas, mandíbula.</li>' +
    '<li><b>10 min</b> Passeio pelo formigueiro: fungo, berçário, rainha.</li><li><b>5 min</b> Voltar às hipóteses: elas plantam fungo!</li>' +
    '<li><b>10 min</b> Comparar com a abelha: tamanho e parentesco.</li><li><b>5 min</b> Desenho: o formigueiro que eu vi.</li></ol>' +
    '<p>Funciona nos iPads da escola, até sem Wi-Fi depois de instalado. Quer testar com sua turma? Fale com quem te mostrou o Bio no Bolso.</p>'));

  function missao() {
    const M = MISSOES[0];
    const feitos = M.bichos.filter((b) => Progresso.feito(b[0], 'vi')).length;
    $('missao').innerHTML = '<span class="badge badge-3d">Missão do bolso</span><h3>' + esc(M.nome) + '</h3><p>' + esc(M.texto) + '</p><ul>' +
      M.bichos.map((b) => {
        const ok = Progresso.feito(b[0], 'vi');
        return '<li class="' + (ok ? 'ok' : '') + '"><span class="caixa">' + Icone('check') + '</span>' + esc(b[1].charAt(0).toUpperCase() + b[1].slice(1)) +
          (ok ? '<button type="button" data-ficha="' + b[0] + '">ver ficha</button>' : '<button type="button" data-vi="' + b[0] + '">encontrei!</button>') + '</li>';
      }).join('') + '</ul>' +
      (feitos === M.bichos.length ? '<div class="selo">🏅 Missão completa: ' + esc(M.selo) + '!</div>' : '<p class="dica">' + feitos + ' de ' + M.bichos.length + ' · Observe sem tocar. Alguns bichos podem picar: chame um adulto.</p>');
    $('missao').querySelectorAll('[data-ficha]').forEach((b) => b.addEventListener('click', () => Ficha.abrir(b.dataset.ficha)));
    $('missao').querySelectorAll('[data-vi]').forEach((b) => b.addEventListener('click', () => { Progresso.observar(b.dataset.vi); atualizar(); }));
  }

  // ---------- rodapé ----------
  $('creditos').innerHTML = '<li>Foto do topo: Abelha-europeia (<i>Apis mellifera</i>), ' + esc(ANIMAIS[1].fotos[0].autor) + ', ' + esc(ANIMAIS[1].fotos[0].lic) + '</li>' +
    ANIMAIS.flatMap((a) => (a.fotos || []).map((f) =>
      '<li>' + esc(a.nome) + ' (<i>' + esc(f.especie) + '</i>): ' + esc(f.autor) + ', ' + esc(f.lic) + '</li>')).join('');
  $('apagar').addEventListener('click', () => {
    const txt = Progresso.sessao() ? 'Esvaziar o bolso? Isso apaga os bichos encontrados e as descobertas desta conta, em todos os aparelhos.' : 'Esvaziar o bolso? Isso apaga os bichos encontrados e as descobertas deste aparelho.';
    if (confirm(txt)) { Progresso.apagar(); atualizar(); }
  });

  document.addEventListener('ficha-fechou', atualizar);
  document.addEventListener('ficha-mudou', atualizar);
  window.addEventListener('pageshow', (e) => { if (e.persisted) atualizar(); });
  render();
  Ficha.criar(ANIMAIS[0].id, { botao: false });
})();
