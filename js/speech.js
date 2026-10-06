/* =====================================================================
   speech.js — voz em português do Brasil (Web Speech API) e textos
   ===================================================================== */

let voice = null;
let speakingCount = 0;
const onSpeakingChange = [];   // telas podem animar o botão 🔊

function pickVoice() {
  if (!('speechSynthesis' in window)) return;
  const vs = speechSynthesis.getVoices();
  voice = vs.find((v) => /pt[-_]BR/i.test(v.lang)) || vs.find((v) => /^pt/i.test(v.lang)) || null;
}
if ('speechSynthesis' in window) {
  pickVoice();
  speechSynthesis.onvoiceschanged = pickVoice;
}

function setSpeaking(delta) {
  speakingCount = Math.max(0, speakingCount + delta);
  onSpeakingChange.forEach((fn) => fn(speakingCount > 0));
}

// Fala um texto; a Promise termina quando a fala acaba
// (ou após um tempo de segurança, se o navegador não avisar)
function say(text) {
  return new Promise((resolve) => {
    const fallbackMs = 900 + text.length * 120;
    if (!('speechSynthesis' in window)) { setTimeout(resolve, fallbackMs); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'pt-BR';
    if (voice) u.voice = voice;
    u.rate = CONFIG.VELOCIDADE_VOZ;
    u.pitch = 1.1;
    let done = false;
    setSpeaking(+1);
    const fin = () => {
      if (done) return;
      done = true;
      clearTimeout(t);
      setSpeaking(-1);
      resolve();
    };
    const t = setTimeout(fin, fallbackMs + 4000);
    u.onend = fin;
    u.onerror = fin;
    speechSynthesis.speak(u);
  });
}

function stopSpeech() {
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  speakingCount = 0;
  onSpeakingChange.forEach((fn) => fn(false));
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// 1.5 → "um milímetro e meio"; 12 → "12 milímetros"
function mmFala(mm) {
  const i = Math.floor(mm), frac = Math.round((mm - i) * 10) / 10;
  if (frac === 0) return i + (i === 1 ? ' milímetro' : ' milímetros');
  if (frac === 0.5) return (i === 1 ? 'um milímetro' : i + ' milímetros') + ' e meio';
  return String(mm).replace('.', ',') + ' milímetros';
}

function mmTexto(mm) {
  return String(mm).replace('.', ',') + ' mm';
}

function comparaTamanho(mm) {
  const r = mm / CONFIG.ARROZ_MM;
  if (r < 0.3) return 'É bem menor que um grão de arroz!';
  if (r < 0.8) return 'É menor que um grão de arroz.';
  if (r < 1.25) return 'É do tamanho de um grão de arroz.';
  if (mm < CONFIG.DEDO_MM * 0.85) return 'É maior que um grão de arroz.';
  if (mm < CONFIG.DEDO_MM * 1.25) return 'É do tamanho da ponta de um dedo.';
  return 'É maior que a ponta de um dedo!';
}
