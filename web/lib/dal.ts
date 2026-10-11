// Camada de acesso: toda tela/ação que precisa de login passa por aqui.
import { cache } from "react";
import { redirect } from "next/navigation";
import { contaDaSessao, type ContaSessao } from "./sessao";

export const contaAtual = cache(async (): Promise<ContaSessao | null> => contaDaSessao());

export async function exigirConta(): Promise<ContaSessao> {
  const c = await contaAtual();
  if (!c) redirect("/entrar");
  return c;
}

/** Só o adulto responsável da família gerencia contas e dados. */
export async function exigirResponsavel(): Promise<ContaSessao> {
  const c = await exigirConta();
  if (c.faixa !== "adulto" || c.papel !== "responsavel") redirect("/conta");
  return c;
}
