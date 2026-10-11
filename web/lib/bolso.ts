// Meu Bolso: regras puras (sem banco) para validar, juntar e pontuar descobertas.
// Formato do site estático (progresso.js): { [itemId]: { [tipo]: 1, vi: n } }

export const TIPOS = ["3d", "ficha", "vida", "cur", "real", "casa", "dentro", "funciona", "vi"] as const;
export type Tipo = (typeof TIPOS)[number];
export type Bolso = Record<string, Partial<Record<Tipo, number>>>;
export type Descoberta = { item_id: string; tipo: Tipo; vezes: number };

const MAX_ITENS = 500;
const MAX_VEZES = 10_000;

/** Pontos de explorador por descoberta (plano, seção Gamificação). Nada se perde, nada zera. */
export const XP: Record<Tipo, number> = {
  ficha: 10, "3d": 20, dentro: 20, funciona: 20, vida: 5, cur: 5, real: 5, casa: 5, vi: 25,
};
// Observações do mesmo bicho contam até este limite (evita farmar pontos tocando no botão).
export const LIMITE_VI_PONTUADO = 20;

/** Transforma o que veio do navegador em descobertas válidas (ignora o que não conhece). */
export function normalizarBolso(entrada: unknown, idsValidos: ReadonlySet<string>): Descoberta[] {
  if (!entrada || typeof entrada !== "object" || Array.isArray(entrada)) return [];
  const out: Descoberta[] = [];
  for (const [itemId, marcas] of Object.entries(entrada as Record<string, unknown>).slice(0, MAX_ITENS)) {
    if (!idsValidos.has(itemId) || !marcas || typeof marcas !== "object" || Array.isArray(marcas)) continue;
    for (const [tipo, valor] of Object.entries(marcas as Record<string, unknown>)) {
      if (!(TIPOS as readonly string[]).includes(tipo)) continue;
      const n = typeof valor === "number" ? Math.floor(valor) : valor === true ? 1 : 0;
      if (n < 1) continue;
      out.push({ item_id: itemId, tipo: tipo as Tipo, vezes: tipo === "vi" ? Math.min(n, MAX_VEZES) : 1 });
    }
  }
  return out;
}

/** Junta dois bolsos: união das descobertas; "vi" fica com o maior número de vezes. */
export function juntarBolsos(a: Bolso, b: Bolso): Bolso {
  const r: Bolso = {};
  for (const fonte of [a, b]) {
    for (const [id, marcas] of Object.entries(fonte)) {
      const alvo = (r[id] ??= {});
      for (const [t, v] of Object.entries(marcas) as [Tipo, number][]) {
        alvo[t] = Math.max(alvo[t] ?? 0, v);
      }
    }
  }
  return r;
}

export function paraBolso(lista: Descoberta[]): Bolso {
  const r: Bolso = {};
  for (const d of lista) (r[d.item_id] ??= {})[d.tipo] = d.tipo === "vi" ? d.vezes : 1;
  return r;
}

export function pontos(lista: Descoberta[]): number {
  return lista.reduce((s, d) => s + XP[d.tipo] * (d.tipo === "vi" ? Math.min(d.vezes, LIMITE_VI_PONTUADO) : 1), 0);
}

// Níveis pelo número de bichos no bolso (os mesmos de progresso.js).
export const NIVEIS = [
  { min: 0, nome: "Começando" },
  { min: 1, nome: "Curioso" },
  { min: 3, nome: "Observador" },
  { min: 6, nome: "Explorador" },
  { min: 11, nome: "Naturalista Mirim" },
] as const;

export function nivel(encontrados: number): { numero: number; nome: string; falta: number } {
  let i = 0;
  while (i + 1 < NIVEIS.length && encontrados >= NIVEIS[i + 1].min) i++;
  const prox = NIVEIS[i + 1];
  return { numero: i + 1, nome: NIVEIS[i].nome, falta: prox ? prox.min - encontrados : 0 };
}

export function encontrados(lista: Descoberta[]): number {
  return new Set(lista.map((d) => d.item_id)).size;
}
