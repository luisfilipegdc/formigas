"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { q, q1, transacao } from "@/lib/db";
import { gerarHash, pinValido, sha256 } from "@/lib/senha";
import { faixaPorAno, modoPorAno } from "@/lib/idade";
import { exigirConta, exigirResponsavel } from "@/lib/dal";
import { encerrarSessao, ipVisitante } from "@/lib/sessao";
import { registrar } from "@/lib/auditoria";
import { VERSAO_PRIVACIDADE } from "@/lib/termos";
import { AVATARES, LIMITE_CONTAS } from "@/lib/planos";
import type { EstadoForm } from "@/lib/form";

export async function adicionarMembro(_: EstadoForm, form: FormData): Promise<EstadoForm> {
  const resp = await exigirResponsavel();
  const ano = Number(form.get("ano"));
  const apelido = String(form.get("apelido") ?? "").trim().slice(0, 30);
  const avatar = String(form.get("avatar") ?? "formiga");
  const pin = String(form.get("pin") ?? "").trim();
  const aceite = form.get("aceite") === "on";
  const campos = { ano: String(form.get("ano") ?? ""), apelido, avatar };

  const faixa = faixaPorAno(ano);
  if (!faixa) return { erro: "Confira o ano de nascimento.", campos };
  if (faixa === "adulto") return { erro: "Adultos criam a própria conta com e-mail.", campos };
  if (!/^[\p{L}\p{N} ]{2,30}$/u.test(apelido)) return { erro: "O apelido tem de 2 a 30 letras ou números. Não use o nome completo.", campos };
  if (!AVATARES.some((a) => a.id === avatar)) return { erro: "Escolha um avatar.", campos };
  const problemaPin = pinValido(pin);
  if (problemaPin) return { erro: problemaPin, campos };
  if (!aceite) return { erro: "Como responsável, você precisa autorizar o uso dos dados desta conta.", campos };

  const familia = await q1<{ plano: string; total: string }>(
    "select f.plano, (select count(*) from contas where familia_id = f.id) as total from familias f where f.id = $1",
    [resp.familia_id],
  );
  const limite = LIMITE_CONTAS[(familia?.plano ?? "free") as keyof typeof LIMITE_CONTAS] ?? 1;
  if (Number(familia?.total ?? 0) >= limite) return { erro: `A família já tem ${limite} contas, o máximo do plano.`, campos };
  if (await q1("select 1 from perfis where familia_id = $1 and lower(apelido) = lower($2)", [resp.familia_id, apelido])) {
    return { erro: "Já existe alguém com esse apelido na família.", campos };
  }

  const pinHash = await gerarHash(pin);
  const ipHash = sha256(`bio:${await ipVisitante()}`);
  const novaId = await transacao(async (tq) => {
    const [c] = await tq<{ id: string }>(
      `insert into contas (familia_id, faixa, papel, pin_hash, responsavel_id, modo)
       values ($1, $2, 'membro', $3, $4, $5) returning id`,
      [resp.familia_id, faixa, pinHash, resp.id, modoPorAno(ano)],
    );
    await tq("insert into perfis (conta_id, familia_id, apelido, avatar) values ($1, $2, $3, $4)", [c.id, resp.familia_id, apelido, avatar]);
    await tq(
      "insert into consentimentos (conta_id, tipo, versao, sobre_conta, ip_hash) values ($1, 'responsavel_menor', $2, $3, $4)",
      [resp.id, VERSAO_PRIVACIDADE, c.id, ipHash],
    );
    return c.id;
  });
  await registrar(resp.id, "conta.membro_adicionado", { conta: novaId, faixa });
  revalidatePath("/conta");
  return { ok: `${apelido} já pode entrar com o código da família e o PIN.` };
}

export async function removerMembro(form: FormData): Promise<void> {
  const resp = await exigirResponsavel();
  const id = String(form.get("id") ?? "");
  const r = await q<{ id: string }>(
    "delete from contas where id = $1 and familia_id = $2 and faixa <> 'adulto' returning id",
    [id, resp.familia_id],
  );
  if (r.length) await registrar(resp.id, "conta.membro_apagado", { conta: id });
  revalidatePath("/conta");
}

export async function sair(): Promise<void> {
  const c = await exigirConta();
  await registrar(c.id, "sessao.saiu");
  await encerrarSessao();
  redirect("/");
}

/** LGPD: o responsável apaga a família inteira (contas, perfis, consentimentos, sessões). */
export async function apagarFamilia(_: EstadoForm, form: FormData): Promise<EstadoForm> {
  const resp = await exigirResponsavel();
  if (String(form.get("confirmacao") ?? "").trim().toUpperCase() !== "APAGAR") {
    return { erro: "Para apagar, escreva APAGAR no campo." };
  }
  await registrar(null, "familia.apagada", { familia: resp.familia_id });
  await q("delete from familias where id = $1", [resp.familia_id]);
  await encerrarSessao();
  redirect("/?apagada=1");
}
