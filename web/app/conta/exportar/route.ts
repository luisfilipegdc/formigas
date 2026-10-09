// LGPD: o responsável baixa todos os dados da família em JSON.
import { q } from "@/lib/db";
import { contaDaSessao } from "@/lib/sessao";
import { registrar } from "@/lib/auditoria";

export async function GET() {
  const c = await contaDaSessao();
  if (!c || c.faixa !== "adulto" || c.papel !== "responsavel") {
    return Response.json({ erro: "Só o responsável da família pode exportar os dados." }, { status: 403 });
  }
  const [familia, contas, consentimentos, descobertas] = await Promise.all([
    q("select codigo, nome, plano, criada_em from familias where id = $1", [c.familia_id]),
    q(
      `select c.id, c.faixa, c.papel, c.email, c.nome, c.modo, c.criada_em, c.ultimo_acesso,
              p.apelido, p.avatar, p.xp, p.nivel
         from contas c join perfis p on p.conta_id = c.id where c.familia_id = $1 order by c.criada_em`,
      [c.familia_id],
    ),
    q(
      `select k.tipo, k.versao, k.aceito_em, k.sobre_conta
         from consentimentos k join contas c on c.id = k.conta_id where c.familia_id = $1 order by k.aceito_em`,
      [c.familia_id],
    ),
    q(
      `select p.apelido, d.item_id, d.tipo, d.vezes, d.primeira_em, d.ultima_em
         from descobertas d join contas c on c.id = d.conta_id join perfis p on p.conta_id = c.id
        where c.familia_id = $1 order by p.apelido, d.item_id, d.tipo`,
      [c.familia_id],
    ),
  ]);
  await registrar(c.id, "familia.exportou");
  const corpo = JSON.stringify({ exportado_em: new Date().toISOString(), familia: familia[0], contas, consentimentos, descobertas }, null, 2);
  return new Response(corpo, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": 'attachment; filename="bio-no-bolso-meus-dados.json"',
      "Cache-Control": "no-store",
    },
  });
}
