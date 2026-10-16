/* =====================================================================
   Brasil Vivo · mapa de aventura (ficcional, sem localização real)
   Biomas como territórios. x, y em um quadro de 360 × 380 (SVG do mapa).
   Só os biomas com pacote registrado (Registro.R.biomas) ficam ativos.
   ===================================================================== */
const BRASIL_VIVO = [
  { id: 'amazonia', nome: 'Amazônia', emoji: '🌳', x: 100, y: 100, r: 58, cor: '#3f8f4f' },
  { id: 'manguezais', nome: 'Manguezais', emoji: '🦀', x: 232, y: 40, r: 22, cor: '#5f9a86' },
  { id: 'caatinga', nome: 'Caatinga', emoji: '🌵', x: 282, y: 110, r: 36, cor: '#c9a35a' },
  { id: 'cerrado', nome: 'Cerrado', emoji: '🌾', x: 190, y: 190, r: 50, cor: '#b7a640' },
  { id: 'pantanal', nome: 'Pantanal', emoji: '🐊', x: 90, y: 232, r: 30, cor: '#4f8fa8' },
  { id: 'mata-atlantica', nome: 'Mata Atlântica', emoji: '🌿', x: 262, y: 262, r: 34, cor: '#2f7a4a' },
  { id: 'costa', nome: 'Costa Atlântica', emoji: '🌊', x: 318, y: 196, r: 22, cor: '#3b7dd8' },
  { id: 'pampa', nome: 'Pampa', emoji: '🐎', x: 170, y: 330, r: 32, cor: '#8fae5a' },
  { id: 'urbano', nome: 'Verde urbano', emoji: '🏙️', x: 318, y: 316, r: 20, cor: '#7f8f8a' }
];
// a Cidade-Núcleo, no coração do Cerrado
const CIDADE_NUCLEO = { nome: 'Brasília', x: 166, y: 168 };
