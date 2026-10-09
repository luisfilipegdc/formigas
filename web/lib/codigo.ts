// Código da família para o login com PIN (ex.: ONCA-42). Sem letras ambíguas.
import { randomInt } from "node:crypto";

const BICHOS = ["ONCA", "ARARA", "TATU", "CUTIA", "LOBO", "BOTO", "SAPO", "MICO", "ANTA", "IPE", "TUCANO", "SAGUI", "GAMBA", "QUATI", "JABUTI", "BEIJA", "CIGARRA", "ABELHA", "FORMIGA", "ARANHA"];

export function gerarCodigoFamilia(): string {
  return `${BICHOS[randomInt(BICHOS.length)]}-${randomInt(10, 100)}${randomInt(10)}`;
}

/** Aceita "onca 421", "ONCA421", "onca_421" ou "Onça-421" e devolve "ONCA-421". */
export function normalizarCodigo(c: string): string {
  const limpo = c.normalize("NFD").replace(/\p{M}/gu, "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const m = /^([A-Z]+)(\d+)$/.exec(limpo);
  return m ? `${m[1]}-${m[2]}` : limpo;
}
