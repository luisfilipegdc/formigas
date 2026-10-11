// Meu Bolso na nuvem. O site dos bichos (/explorar) chama esta rota no mesmo domínio,
// então o cookie da sessão vai junto. Sem sessão: responde { logado: false } e o site
// continua guardando só no aparelho.
import { headers } from "next/headers";
import { q, transacao } from "@/lib/db";
import { contaDaSessao } from "@/lib/sessao";
import { encontrados, nivel, normalizarBolso, paraBolso, pontos, type Descoberta } from "@/lib/bolso";
import { permitir } from "@/lib/limite";
import { registrar } from "@/lib/auditoria";

const SEM_CACHE = { "Cache-Control": "no-store" };
const LIMITE_CORPO = 64 * 1024;

async function idsDoCatalogo(): Promise<Set<string>> {
  const r = await q<{ id: string }>("select id from itens where publicado");
  return new Set(r.map((x) => x.id));
}

async function lerDescobertas(contaId: string): Promise<Descoberta[]> {
  return q<Descoberta>("select item_id, tipo, vezes from descobertas where conta_id = $1", [contaId]);
}

function resposta(conta: { id: string; apelido: string }, lista: Descoberta[]) {
  const n = encontrados(lista);
  return Response.json(
    { logado: true, conta: { id: conta.id, apelido: conta.apelido }, bolso: paraBolso(lista), pontos: pontos(lista), encontrados: n, nivel: nivel(n) },
    { headers: SEM_CACHE },
  );
}

export async function GET() {
  const conta = await contaDaSessao();
  if (!conta) return Response.json({ logado: false }, { headers: SEM_CACHE });
  return resposta(conta, await lerDescobertas(conta.id));
}

/** Só aceita chamadas do próprio site (o cookie é SameSite=Lax; isto é uma segunda trava). */
async function origemValida(): Promise<boolean> {
  const h = await headers();
  const origem = h.get("origin");
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!origem || !host) return true;
  try {
    return new URL(origem).host === host;
  } catch {
    return false;
  }
}

/** "Esvaziar meu bolso" no site: apaga as descobertas da própria conta. */
export async function DELETE() {
  if (!(await origemValida())) return Response.json({ erro: "origem não permitida" }, { status: 403 });
  const conta = await contaDaSessao();
  if (!conta) return Response.json({ logado: false }, { status: 401, headers: SEM_CACHE });
  await transacao(async (tq) => {
    await tq("delete from descobertas where conta_id = $1", [conta.id]);
    await tq("update perfis set xp = 0, nivel = 1 where conta_id = $1", [conta.id]);
  });
  await registrar(conta.id, "bolso.esvaziado");
  return resposta(conta, []);
}

export async function POST(req: Request) {
  if (!(await origemValida())) return Response.json({ erro: "origem não permitida" }, { status: 403 });
  const conta = await contaDaSessao();
  if (!conta) return Response.json({ logado: false }, { status: 401, headers: SEM_CACHE });
  if (!permitir(`bolso:${conta.id}`, 60, 60_000)) return Response.json({ erro: "muitas gravações" }, { status: 429 });

  const texto = await req.text();
  if (texto.length > LIMITE_CORPO) return Response.json({ erro: "grande demais" }, { status: 413 });
  let corpo: unknown;
  try {
    corpo = JSON.parse(texto);
  } catch {
    return Response.json({ erro: "JSON inválido" }, { status: 400 });
  }
  const bolso = corpo && typeof corpo === "object" ? (corpo as { bolso?: unknown }).bolso : undefined;
  const novas = normalizarBolso(bolso, await idsDoCatalogo());

  const lista = await transacao(async (tq) => {
    for (const d of novas) {
      await tq(
        `insert into descobertas (conta_id, item_id, tipo, vezes) values ($1, $2, $3, $4)
         on conflict (conta_id, item_id, tipo) do update
           set vezes = greatest(descobertas.vezes, excluded.vezes),
               ultima_em = case when excluded.vezes > descobertas.vezes then now() else descobertas.ultima_em end`,
        [conta.id, d.item_id, d.tipo, d.vezes],
      );
    }
    const todas = await tq<Descoberta>("select item_id, tipo, vezes from descobertas where conta_id = $1", [conta.id]);
    await tq("update perfis set xp = $2, nivel = $3 where conta_id = $1", [conta.id, pontos(todas), nivel(encontrados(todas)).numero]);
    return todas;
  });
  return resposta(conta, lista);
}
