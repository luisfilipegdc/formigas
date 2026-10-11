// Limites por plano. Enquanto a cobrança não começa (portão do plano), o grátis
// funciona como beta com a família inteira, para testar o login com PIN.
export const LIMITE_CONTAS = { free: 4, familia: 4, professor: 1 } as const;

export const AVATARES = [
  { id: "formiga", nome: "Formiga" },
  { id: "abelha", nome: "Abelha" },
  { id: "aranha", nome: "Aranha" },
  { id: "cigarra", nome: "Cigarra" },
  { id: "arara", nome: "Arara" },
  { id: "onca", nome: "Onça" },
  { id: "tatu", nome: "Tatu" },
  { id: "sapo", nome: "Sapo" },
] as const;

export type Plano = {
  id: "free" | "familia" | "professor";
  nome: string;
  preco: string;
  anual?: string;
  resumo: string;
  itens: string[];
};

// Fonte: plano do produto (09/10/2026). A cobrança só abre depois do portão
// (50 fichas, 8 bichos em 3D, revisor científico com nome, parecer de LGPD).
export const PLANOS: Plano[] = [
  {
    id: "free",
    nome: "Grátis",
    preco: "R$ 0",
    resumo: "O produto inteiro em pequena escala.",
    itens: ["Todas as fichas do catálogo", "3 bichos em 3D", "3 fotos por mês no “Que bicho é esse?”", "Mapa do Brasil para ver", "Kit Formiga (amostra para professores)"],
  },
  {
    id: "familia",
    nome: "Família",
    preco: "R$ 9,90/mês",
    anual: "ou R$ 99/ano",
    resumo: "Até 4 contas, de qualquer idade.",
    itens: ["Todos os bichos em 3D", "30 fotos por mês", "Marcar o que viu no mapa", "Meu Bolso na nuvem, em vários aparelhos", "Contas para crianças com apelido e PIN, sem e-mail"],
  },
  {
    id: "professor",
    nome: "Professor",
    preco: "R$ 29/mês",
    anual: "ou R$ 290/ano",
    resumo: "Até 3 turmas com 40 alunos cada.",
    itens: ["Tudo do Família", "200 fotos por mês, somando a turma", "Mapa e relatório da turma", "Kits pedagógicos com BNCC", "Cartões de acesso para imprimir"],
  },
];
