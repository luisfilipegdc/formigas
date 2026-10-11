"use server";

import { redirect } from "next/navigation";
import { q1 } from "@/lib/db";
import { conferirHash } from "@/lib/senha";
import { normalizarCodigo } from "@/lib/codigo";
import { criarSessao, ipVisitante } from "@/lib/sessao";
import { permitir } from "@/lib/limite";
import { registrar } from "@/lib/auditoria";
import type { EstadoForm } from "@/lib/form";

const QUINZE_MIN = 15 * 60 * 1000;
// Hash no formato certo, para gastar o mesmo tempo quando a conta não existe.
const HASH_FALSO = "scrypt$16384$8$1$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

export async function entrarComEmail(_: EstadoForm, form: FormData): Promise<EstadoForm> {
  const email = String(form.get("email") ?? "").trim().toLowerCase().slice(0, 200);
  const senha = String(form.get("senha") ?? "");
  const campos = { email };
  const ip = await ipVisitante();
  if (!permitir(`login-ip:${ip}`, 20, QUINZE_MIN) || !permitir(`login-email:${email}`, 6, QUINZE_MIN)) {
    return { erro: "Muitas tentativas. Espere 15 minutos.", campos };
  }
  const conta = await q1<{ id: string; senha_hash: string }>(
    "select id, senha_hash from contas where email = $1 and faixa = 'adulto'",
    [email],
  );
  const ok = await conferirHash(senha, conta?.senha_hash ?? HASH_FALSO);
  if (!conta || !ok) return { erro: "E-mail ou senha não conferem.", campos };
  await registrar(conta.id, "sessao.entrou", { via: "email" });
  await criarSessao(conta.id);
  redirect("/conta");
}

export async function entrarComPin(_: EstadoForm, form: FormData): Promise<EstadoForm> {
  const codigo = normalizarCodigo(String(form.get("codigo") ?? "")).slice(0, 20);
  const apelido = String(form.get("apelido") ?? "").trim().slice(0, 40);
  const pin = String(form.get("pin") ?? "").trim();
  const campos = { codigo, apelido };
  const ip = await ipVisitante();
  if (!permitir(`pin-ip:${ip}`, 30, QUINZE_MIN) || !permitir(`pin:${codigo}:${apelido.toLowerCase()}`, 5, QUINZE_MIN)) {
    return { erro: "Muitas tentativas. Peça ajuda a um adulto ou espere 15 minutos.", campos };
  }
  const conta = await q1<{ id: string; pin_hash: string }>(
    `select c.id, c.pin_hash
       from contas c join perfis p on p.conta_id = c.id join familias f on f.id = c.familia_id
      where f.codigo = $1 and lower(p.apelido) = lower($2) and c.faixa <> 'adulto'`,
    [codigo, apelido],
  );
  const ok = await conferirHash(pin, conta?.pin_hash ?? HASH_FALSO);
  if (!conta || !ok) return { erro: "Código, nome ou PIN não conferem.", campos };
  await registrar(conta.id, "sessao.entrou", { via: "pin" });
  await criarSessao(conta.id);
  redirect("/conta");
}
