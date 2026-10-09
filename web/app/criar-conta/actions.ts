"use server";

import { redirect } from "next/navigation";
import { q1, transacao } from "@/lib/db";
import { gerarHash, senhaValida, sha256 } from "@/lib/senha";
import { faixaPorAno } from "@/lib/idade";
import { gerarCodigoFamilia } from "@/lib/codigo";
import { criarSessao, ipVisitante } from "@/lib/sessao";
import { permitir } from "@/lib/limite";
import { registrar } from "@/lib/auditoria";
import { VERSAO_PRIVACIDADE, VERSAO_TERMOS } from "@/lib/termos";
import type { EstadoForm } from "@/lib/form";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function criarContaAdulto(_: EstadoForm, form: FormData): Promise<EstadoForm> {
  const ano = Number(form.get("ano"));
  const nome = String(form.get("nome") ?? "").trim().slice(0, 80);
  const email = String(form.get("email") ?? "").trim().toLowerCase().slice(0, 200);
  const senha = String(form.get("senha") ?? "");
  const aceite = form.get("aceite") === "on";
  const campos = { ano: String(form.get("ano") ?? ""), nome, email };

  const faixa = faixaPorAno(ano);
  if (!faixa) return { erro: "Confira o ano de nascimento.", campos };
  if (faixa !== "adulto") {
    return { erro: "Quem tem menos de 18 anos entra pela conta da família: peça a um adulto para criar a conta e adicionar você.", campos };
  }
  if (nome.length < 2) return { erro: "Escreva seu nome.", campos };
  if (!EMAIL.test(email)) return { erro: "Confira o e-mail.", campos };
  const problemaSenha = senhaValida(senha);
  if (problemaSenha) return { erro: problemaSenha, campos };
  if (!aceite) return { erro: "Para criar a conta, aceite os termos de uso e a política de privacidade.", campos };

  const ip = await ipVisitante();
  if (!permitir(`cadastro:${ip}`, 5, 60 * 60 * 1000)) return { erro: "Muitas tentativas. Tente de novo em uma hora.", campos };

  if (await q1("select 1 from contas where email = $1", [email])) {
    return { erro: "Já existe uma conta com esse e-mail. Entre por ela.", campos };
  }

  const hash = await gerarHash(senha);
  const ipHash = sha256(`bio:${ip}`);
  const apelido = nome.split(/\s+/)[0];

  const contaId = await transacao(async (tq) => {
    let familiaId = "";
    for (let i = 0; i < 8 && !familiaId; i++) {
      const r = await tq<{ id: string }>(
        "insert into familias (codigo, nome) values ($1, $2) on conflict (codigo) do nothing returning id",
        [gerarCodigoFamilia(), `Família de ${apelido}`],
      );
      familiaId = r[0]?.id ?? "";
    }
    if (!familiaId) throw new Error("Não foi possível gerar o código da família.");
    const [c] = await tq<{ id: string }>(
      `insert into contas (familia_id, faixa, papel, email, senha_hash, nome, modo)
       values ($1, 'adulto', 'responsavel', $2, $3, $4, 'cientista') returning id`,
      [familiaId, email, hash, nome],
    );
    await tq("insert into perfis (conta_id, familia_id, apelido, avatar) values ($1, $2, $3, 'formiga')", [c.id, familiaId, apelido]);
    await tq(
      "insert into consentimentos (conta_id, tipo, versao, ip_hash) values ($1, 'termos', $2, $4), ($1, 'privacidade', $3, $4)",
      [c.id, VERSAO_TERMOS, VERSAO_PRIVACIDADE, ipHash],
    );
    return c.id;
  });

  await registrar(contaId, "conta.criada", { faixa: "adulto" });
  await criarSessao(contaId);
  redirect("/conta");
}
