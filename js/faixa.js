/* =====================================================================
   faixa.js — quem vai explorar? (faixa etária / etapa escolar)
   A escolha muda a biblioteca inteira: quantos itens, quanto texto,
   se o bicho fala sozinho e que tipo de desafio aparece.
   Guardada só neste aparelho, em 'bnb-faixa'. Também acerta 'bnb-idade'
   (🧸 Pequeno / 🧒 Explorador / 🔬 Cientista), usado pelas telas 3D dos bichos.
   ===================================================================== */
const Faixa = (function () {
  const LISTA = [
    { id: 'bebe', emoji: '🍼', nome: 'Bebês', idade: '1 a 3 anos', sub: 'Tocar, ouvir o nome e ver o bicho se mexer. Sem nada para ler.', nivel: 'pequeno' },
    { id: 'infantil', emoji: '🧸', nome: 'Educação Infantil', idade: '4 a 6 anos', sub: 'Pré-escola e alfabetização: ouvir, nomear, brincar de Cadê?', nivel: 'pequeno' },
    { id: 'iniciais', emoji: '✏️', nome: 'Anos Iniciais', idade: '7 a 10 anos', sub: 'Observar, comparar e explicar com as próprias palavras.', nivel: 'explorador' },
    { id: 'finais', emoji: '🔭', nome: 'Anos Finais', idade: '11 a 14 anos', sub: 'Nomes científicos, como cada parte funciona e perguntas para investigar.', nivel: 'cientista' },
    { id: 'medio', emoji: '🧪', nome: 'Ensino Médio', idade: '15 a 17 anos', sub: 'Hipóteses, investigação e relação com o dia a dia.', nivel: 'cientista' }
  ];
  const porId = {}; LISTA.forEach((f) => { porId[f.id] = f; });
  const ler = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  function get() { const f = ler('bnb-faixa'); return porId[f] ? f : null; }
  function set(id) {
    if (!porId[id]) return;
    try { localStorage.setItem('bnb-faixa', id); localStorage.setItem('bnb-idade', porId[id].nivel); } catch (e) {}
    document.documentElement.dataset.faixa = id;
    document.dispatchEvent(new CustomEvent('faixa-mudou', { detail: id }));
  }
  const atual = get(); if (atual) document.documentElement.dataset.faixa = atual;
  return { LISTA, porId, get, set, info: (id) => porId[id || get()] || null };
})();
