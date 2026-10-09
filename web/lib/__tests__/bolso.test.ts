import { describe, expect, it } from "vitest";
import { encontrados, juntarBolsos, nivel, normalizarBolso, paraBolso, pontos, LIMITE_VI_PONTUADO } from "../bolso";

const IDS = new Set(["formiga", "abelha", "onca"]);

describe("normalizarBolso", () => {
  it("aceita o formato do site e ignora o que não conhece", () => {
    const l = normalizarBolso(
      { formiga: { ficha: 1, "3d": 1, vi: 3, inventado: 1 }, dragao: { ficha: 1 }, abelha: { vi: 0 } },
      IDS,
    );
    expect(l).toEqual([
      { item_id: "formiga", tipo: "ficha", vezes: 1 },
      { item_id: "formiga", tipo: "3d", vezes: 1 },
      { item_id: "formiga", tipo: "vi", vezes: 3 },
    ]);
  });
  it("recusa lixo", () => {
    expect(normalizarBolso(null, IDS)).toEqual([]);
    expect(normalizarBolso([1, 2], IDS)).toEqual([]);
    expect(normalizarBolso({ formiga: "x" }, IDS)).toEqual([]);
    expect(normalizarBolso({ formiga: { vi: 1e9 } }, IDS)[0].vezes).toBe(10_000);
  });
});

describe("juntarBolsos", () => {
  it("une descobertas e fica com o maior número de observações", () => {
    expect(juntarBolsos({ formiga: { ficha: 1, vi: 2 } }, { formiga: { vi: 5 }, onca: { "3d": 1 } })).toEqual({
      formiga: { ficha: 1, vi: 5 },
      onca: { "3d": 1 },
    });
  });
});

describe("pontos e nível", () => {
  it("soma pontos com limite de observações pontuadas", () => {
    const l = normalizarBolso({ formiga: { ficha: 1, "3d": 1, vi: 100 } }, IDS);
    expect(pontos(l)).toBe(10 + 20 + 25 * LIMITE_VI_PONTUADO);
  });
  it("nível pelo número de bichos", () => {
    expect(nivel(0)).toEqual({ numero: 1, nome: "Começando", falta: 1 });
    expect(nivel(1).nome).toBe("Curioso");
    expect(nivel(6)).toEqual({ numero: 4, nome: "Explorador", falta: 5 });
    expect(nivel(13).nome).toBe("Naturalista Mirim");
  });
  it("paraBolso e encontrados", () => {
    const l = normalizarBolso({ formiga: { ficha: 1, vi: 2 }, onca: { ficha: 1 } }, IDS);
    expect(paraBolso(l)).toEqual({ formiga: { ficha: 1, vi: 2 }, onca: { ficha: 1 } });
    expect(encontrados(l)).toBe(2);
  });
});
