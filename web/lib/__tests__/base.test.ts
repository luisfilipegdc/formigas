import { describe, expect, it } from "vitest";
import { faixaPorAno, modoPorAno } from "../idade";
import { conferirHash, gerarHash, pinValido, senhaValida } from "../senha";
import { gerarCodigoFamilia, normalizarCodigo } from "../codigo";
import { permitir } from "../limite";

const HOJE = new Date("2026-10-09T12:00:00-03:00");

describe("faixa por ano (conservador: usa a menor idade possível)", () => {
  it("nascido em 2007 ainda pode ter 18 → adulto só se 2007 (menor idade 18)", () => {
    expect(faixaPorAno(2007, HOJE)).toBe("adulto"); // 2026-2007-1 = 18
    expect(faixaPorAno(2008, HOJE)).toBe("adolescente"); // pode ter 17
  });
  it("12 a 17 é adolescente; até 11 é criança", () => {
    expect(faixaPorAno(2013, HOJE)).toBe("adolescente"); // 12
    expect(faixaPorAno(2014, HOJE)).toBe("crianca"); // 11
    expect(faixaPorAno(2026, HOJE)).toBe("crianca");
  });
  it("ano inválido", () => {
    expect(faixaPorAno(2027, HOJE)).toBeNull();
    expect(faixaPorAno(1800, HOJE)).toBeNull();
    expect(faixaPorAno(Number.NaN, HOJE)).toBeNull();
  });
  it("modo da tela", () => {
    expect(modoPorAno(2020, HOJE)).toBe("pequeno"); // 5
    expect(modoPorAno(2017, HOJE)).toBe("explorador"); // 8
    expect(modoPorAno(2010, HOJE)).toBe("cientista"); // 15
  });
});

describe("senha e PIN", () => {
  it("hash confere só com o valor certo", async () => {
    const h = await gerarHash("formiga-cortadeira");
    expect(h.startsWith("scrypt$")).toBe(true);
    expect(await conferirHash("formiga-cortadeira", h)).toBe(true);
    expect(await conferirHash("formiga-cortadeirA", h)).toBe(false);
    expect(await conferirHash("x", null)).toBe(false);
    expect(await conferirHash("x", "lixo")).toBe(false);
  });
  it("regras de senha", () => {
    expect(senhaValida("curta")).not.toBeNull();
    expect(senhaValida("1234567890")).not.toBeNull();
    expect(senhaValida("tatu-bola-2026")).toBeNull();
  });
  it("regras de PIN", () => {
    expect(pinValido("1111")).not.toBeNull();
    expect(pinValido("1234")).not.toBeNull();
    expect(pinValido("12a4")).not.toBeNull();
    expect(pinValido("4817")).toBeNull();
    expect(pinValido("481730")).toBeNull();
  });
});

describe("código da família", () => {
  it("formato BICHO-NNN e normalização", () => {
    expect(gerarCodigoFamilia()).toMatch(/^[A-Z]+-\d{3}$/);
    expect(normalizarCodigo(" onca_421 ")).toBe("ONCA-421");
  });
});

describe("limite de tentativas", () => {
  it("bloqueia depois do máximo", () => {
    const k = `teste-${Math.random()}`;
    expect(permitir(k, 2, 60_000)).toBe(true);
    expect(permitir(k, 2, 60_000)).toBe(true);
    expect(permitir(k, 2, 60_000)).toBe(false);
  });
});
