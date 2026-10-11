// Hash de senha e PIN com scrypt (node:crypto), sem dependência externa.
import { randomBytes, scrypt as scryptCb, timingSafeEqual, createHash } from "node:crypto";

const N = 16384, R = 8, P = 1, LEN = 32;

function scrypt(valor: string, sal: Buffer): Promise<Buffer> {
  return new Promise((ok, erro) =>
    scryptCb(valor.normalize("NFKC"), sal, LEN, { N, r: R, p: P, maxmem: 64 * 1024 * 1024 }, (e, k) => (e ? erro(e) : ok(k))),
  );
}

export async function gerarHash(valor: string): Promise<string> {
  const sal = randomBytes(16);
  const h = await scrypt(valor, sal);
  return `scrypt$${N}$${R}$${P}$${sal.toString("base64url")}$${h.toString("base64url")}`;
}

export async function conferirHash(valor: string, guardado: string | null | undefined): Promise<boolean> {
  if (!guardado) return false;
  const partes = guardado.split("$");
  if (partes.length !== 6 || partes[0] !== "scrypt") return false;
  const sal = Buffer.from(partes[4], "base64url");
  const esperado = Buffer.from(partes[5], "base64url");
  const h = await scrypt(valor, sal);
  return h.length === esperado.length && timingSafeEqual(h, esperado);
}

/** sha256 em hex (para guardar token de sessão e IP sem o valor puro). */
export function sha256(valor: string): string {
  return createHash("sha256").update(valor).digest("hex");
}

export function tokenAleatorio(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

/** Senha de adulto: 10+ caracteres e não só números. */
export function senhaValida(s: string): string | null {
  if (s.length < 10) return "A senha precisa ter pelo menos 10 caracteres.";
  if (s.length > 200) return "A senha é longa demais.";
  if (/^\d+$/.test(s)) return "Use letras também, não só números.";
  return null;
}

/** PIN de criança/adolescente: 4 a 6 dígitos, sem sequência óbvia. */
export function pinValido(pin: string): string | null {
  if (!/^\d{4,6}$/.test(pin)) return "O PIN tem de 4 a 6 números.";
  if (/^(\d)\1+$/.test(pin)) return "Evite números repetidos (ex.: 1111).";
  if ("0123456789".includes(pin) || "9876543210".includes(pin)) return "Evite sequências (ex.: 1234).";
  return null;
}
