// Código da família para o login com PIN (ex.: ONCA-42). Sem letras ambíguas.
import { randomInt } from "node:crypto";

const BICHOS = ["ONCA", "ARARA", "TATU", "CUTIA", "LOBO", "BOTO", "SAPO", "MICO", "ANTA", "IPE", "TUCANO", "SAGUI", "GAMBA", "QUATI", "JABUTI", "BEIJA", "CIGARRA", "ABELHA", "FORMIGA", "ARANHA"];

export function gerarCodigoFamilia(): string {
  return `${BICHOS[randomInt(BICHOS.length)]}-${randomInt(10, 100)}${randomInt(10)}`;
}

export function normalizarCodigo(c: string): string {
  return c.trim().toUpperCase().replace(/\s+/g, "").replace(/_/g, "-");
}
