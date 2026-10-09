// Limite simples de tentativas por chave (memória do processo; zera ao reiniciar).
const baldes = new Map<string, { n: number; ate: number }>();

export function permitir(chave: string, max: number, janelaMs: number): boolean {
  const agora = Date.now();
  const b = baldes.get(chave);
  if (!b || b.ate < agora) {
    baldes.set(chave, { n: 1, ate: agora + janelaMs });
    if (baldes.size > 10_000) for (const [k, v] of baldes) if (v.ate < agora) baldes.delete(k);
    return true;
  }
  b.n += 1;
  return b.n <= max;
}
