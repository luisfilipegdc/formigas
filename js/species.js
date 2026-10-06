/* =====================================================================
   DADOS DAS ESPÉCIES — edite aqui!
   ---------------------------------------------------------------------
   nome          → nome falado em voz alta
   nomeCurto     → nome grande que aparece no cartão
   tamanhoMm     → tamanho médio real de uma operária (mm)
   curiosidades  → frases curtas (máx. 10 palavras) faladas no botão 🔊
   corCartao     → cor de fundo do cartão e da tela
   glb           → caminho/URL de um modelo .glb para substituir a
                   formiga procedural (ex.: "modelos/sauva.glb"); null = procedural
   glbRotacaoY   → giro do modelo .glb em graus, se ele vier virado
   forma         → parâmetros do modelo 3D procedural
                   (cabeca/torax/abdomen = [comprimento, altura, largura])
   ===================================================================== */
const SPECIES = [
  {
    id: 'sauva',
    nome: 'Saúva',
    nomeCurto: 'Saúva',
    cientifico: 'Atta spp.',
    tamanhoMm: 12,
    curiosidades: [
      'A saúva corta folhas e leva para casa.',
      'Ela não come a folha: planta um fungo!'
    ],
    corCartao: '#bff0b8',
    glb: null,
    glbRotacaoY: 0,
    forma: {
      cores: { cabeca: '#a4471b', torax: '#b5541f', abdomen: '#8e3c15', pernas: '#b85a26' },
      cabeca: [0.95, 0.85, 1.2], lobos: true,
      torax: [1.0, 0.55, 0.48],
      abdomen: [0.72, 0.6, 0.62],
      nos: 2, tamanhoNo: 0.13,
      pernas: 2.0, antenas: 1.45, mandibulas: 0.42,
      espinhos: true, folha: true, ferrao: false,
      brilho: 25
    }
  },
  {
    id: 'lavapes',
    nome: 'Formiga lava-pés',
    nomeCurto: 'Lava-pés',
    cientifico: 'Solenopsis spp.',
    tamanhoMm: 3,
    curiosidades: [
      'A picada dela arde como fogo!',
      'Quando chove muito, elas fazem uma jangada!'
    ],
    corCartao: '#ffc9b8',
    glb: null,
    glbRotacaoY: 0,
    forma: {
      cores: { cabeca: '#c8411e', torax: '#d4532a', abdomen: '#6e2412', pernas: '#d65f33' },
      cabeca: [0.62, 0.5, 0.55],
      torax: [0.78, 0.42, 0.38],
      abdomen: [0.85, 0.62, 0.66],
      nos: 2, tamanhoNo: 0.12,
      pernas: 1.25, antenas: 1.0, mandibulas: 0.22,
      espinhos: false, folha: false, ferrao: true,
      brilho: 60
    }
  },
  {
    id: 'carpinteira',
    nome: 'Formiga-carpinteira',
    nomeCurto: 'Carpinteira',
    cientifico: 'Camponotus spp.',
    tamanhoMm: 10,
    curiosidades: [
      'Ela cava casinhas dentro da madeira.',
      'Ela não come madeira, só faz túneis.'
    ],
    corCartao: '#d6d3ff',
    glb: null,
    glbRotacaoY: 0,
    forma: {
      cores: { cabeca: '#1d1b1f', torax: '#262328', abdomen: '#18161a', pernas: '#3a3036' },
      cabeca: [0.78, 0.68, 0.8],
      torax: [1.05, 0.6, 0.46],
      abdomen: [1.05, 0.78, 0.88],
      nos: 1, tamanhoNo: 0.13, formaNo: [0.55, 1.5, 1.2],
      pernas: 1.7, antenas: 1.45, mandibulas: 0.3,
      espinhos: false, folha: false, ferrao: false,
      brilho: 80
    }
  },
  {
    id: 'bala',
    nome: 'Formiga-bala',
    nomeCurto: 'Bala',
    cientifico: 'Paraponera clavata',
    tamanhoMm: 25,
    curiosidades: [
      'É uma das maiores formigas do mundo!',
      'Ela mora nas árvores da Floresta Amazônica.'
    ],
    corCartao: '#ffe39a',
    glb: null,
    glbRotacaoY: 0,
    forma: {
      cores: { cabeca: '#3b1d12', torax: '#43231a', abdomen: '#2d1610', pernas: '#5a2f1e' },
      cabeca: [0.85, 0.62, 0.66],
      torax: [1.35, 0.58, 0.5],
      abdomen: [1.25, 0.78, 0.82],
      nos: 1, tamanhoNo: 0.2, formaNo: [1.1, 1.45, 1.1],
      pernas: 1.75, antenas: 1.35, mandibulas: 0.34,
      espinhos: false, folha: false, ferrao: true,
      brilho: 45
    }
  },
  {
    id: 'doceira',
    nome: 'Formiga doceira',
    nomeCurto: 'Doceira',
    cientifico: 'Tapinoma melanocephalum',
    tamanhoMm: 1.5,
    curiosidades: [
      'Ela adora açúcar e farelos de doce.',
      'A barriguinha dela é clarinha, quase transparente!'
    ],
    corCartao: '#ffd1ec',
    glb: null,
    glbRotacaoY: 0,
    forma: {
      cores: { cabeca: '#4a2e1c', torax: '#5c3a22', abdomen: '#f1e2bf', pernas: '#efe0c4' },
      cabeca: [0.55, 0.45, 0.5],
      torax: [0.62, 0.36, 0.32],
      abdomen: [0.8, 0.6, 0.64], abdomenTransparente: true,
      nos: 1, tamanhoNo: 0.07,
      pernas: 1.15, antenas: 1.05, mandibulas: 0.18,
      espinhos: false, folha: false, ferrao: false,
      brilho: 50
    }
  }
];

/* Outros ajustes fáceis */
const CONFIG = {
  ARROZ_MM: 7,          // comprimento de um grão de arroz
  DEDO_MM: 13,          // largura da ponta do dedo de uma criança
  VELOCIDADE_VOZ: 0.8,  // 1 = normal; menor = mais devagar
  GIRO_AUTOMATICO: 1.4, // velocidade do giro sozinho
  VOLTA_A_GIRAR_S: 20   // segundos sem toque para voltar a girar
};
