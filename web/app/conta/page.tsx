import { exigirConta } from "@/lib/dal";
import { q, q1 } from "@/lib/db";
import { AVATARES, LIMITE_CONTAS } from "@/lib/planos";
import { removerMembro, sair } from "./actions";
import { FormAdicionarMembro, FormApagarFamilia } from "./FormsConta";

export const metadata = { title: "Minha conta" };

const FAIXA: Record<string, string> = { adulto: "Adulto", adolescente: "12 a 17 anos", crianca: "Até 11 anos" };
const MODO: Record<string, string> = { pequeno: "Pequeno", explorador: "Explorador", cientista: "Cientista" };

export default async function Conta() {
  const conta = await exigirConta();
  const responsavel = conta.faixa === "adulto" && conta.papel === "responsavel";
  const familia = await q1<{ codigo: string; nome: string; plano: string }>(
    "select codigo, nome, plano from familias where id = $1",
    [conta.familia_id],
  );
  const membros = responsavel
    ? await q<{ id: string; faixa: string; modo: string; apelido: string; avatar: string; xp: number }>(
        `select c.id, c.faixa, c.modo, p.apelido, p.avatar, p.xp
           from contas c join perfis p on p.conta_id = c.id
          where c.familia_id = $1 order by c.criada_em`,
        [conta.familia_id],
      )
    : [];
  const limite = LIMITE_CONTAS[(familia?.plano ?? "free") as keyof typeof LIMITE_CONTAS] ?? 1;
  const nomeAvatar = (id: string) => AVATARES.find((a) => a.id === id)?.nome ?? id;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-suave">{familia?.nome}</p>
          <h1 className="text-3xl font-semibold">Olá, {conta.apelido}</h1>
          <p className="text-sm text-suave mt-1">
            Modo {MODO[conta.modo]} · {conta.xp} pontos de explorador · nível {conta.nivel}
          </p>
        </div>
        <form action={sair}>
          <button className="rounded-xl border border-borda bg-superficie px-4 py-2 text-sm font-semibold">Sair</button>
        </form>
      </div>

      <a href="/explorar/" className="block rounded-2xl bg-marca text-marca-texto p-5">
        <span className="block text-lg font-semibold">Explorar os bichos</span>
        <span className="block text-sm opacity-90">Fichas, 3D e comparador. O Meu Bolso na nuvem chega na próxima etapa.</span>
      </a>

      {responsavel && familia && (
        <>
          <section className="rounded-2xl border border-borda bg-superficie p-5 space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Contas da família</h2>
              <p className="text-sm text-suave mt-1">
                Código da família: <strong className="font-mono text-texto text-base">{familia.codigo}</strong>. Crianças e
                adolescentes entram com esse código, o apelido e o PIN.
              </p>
            </div>
            <ul className="divide-y divide-borda">
              {membros.map((m) => (
                <li key={m.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{m.apelido}</p>
                    <p className="text-xs text-suave">
                      {FAIXA[m.faixa]} · {nomeAvatar(m.avatar)} · modo {MODO[m.modo]} · {m.xp} pontos
                    </p>
                  </div>
                  {m.faixa !== "adulto" && (
                    <form action={removerMembro}>
                      <input type="hidden" name="id" value={m.id} />
                      <button className="text-sm text-erro underline">Apagar</button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
            {membros.length < limite ? (
              <FormAdicionarMembro />
            ) : (
              <p className="text-sm text-suave">A família chegou ao limite de {limite} contas.</p>
            )}
          </section>

          <section className="rounded-2xl border border-borda bg-superficie p-5 space-y-3">
            <h2 className="text-xl font-semibold">Seus dados</h2>
            <p className="text-sm text-suave">
              Você pode baixar tudo o que guardamos sobre a família ou apagar a conta de todos. Apagar não tem volta.
            </p>
            <a href="/conta/exportar" className="inline-block rounded-xl border border-borda px-4 py-2 text-sm font-semibold">
              Baixar meus dados (JSON)
            </a>
            <FormApagarFamilia />
          </section>
        </>
      )}
    </div>
  );
}
