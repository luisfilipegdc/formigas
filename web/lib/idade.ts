// Faixa etária a partir do ano de nascimento (só o ano é pedido).
// Conservador: usa a menor idade possível naquele ano (aniversário ainda não chegou).
export type Faixa = "adulto" | "adolescente" | "crianca";
export type Modo = "pequeno" | "explorador" | "cientista";

export function idadeMinima(anoNascimento: number, hoje = new Date()): number {
  return hoje.getFullYear() - anoNascimento - 1;
}

export function faixaPorAno(anoNascimento: number, hoje = new Date()): Faixa | null {
  const ano = hoje.getFullYear();
  if (!Number.isInteger(anoNascimento) || anoNascimento < ano - 120 || anoNascimento > ano) return null;
  const idade = idadeMinima(anoNascimento, hoje);
  if (idade >= 18) return "adulto";
  if (idade >= 12) return "adolescente";
  return "crianca";
}

/** Modo inicial da interface: Pequeno até 6, Explorador 7–11, Cientista 12+. */
export function modoPorAno(anoNascimento: number, hoje = new Date()): Modo {
  const idade = idadeMinima(anoNascimento, hoje);
  if (idade <= 6) return "pequeno";
  if (idade <= 11) return "explorador";
  return "cientista";
}
