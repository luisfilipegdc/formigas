import Link from "next/link";
import { contaAtual } from "@/lib/dal";

export default async function Inicio({ searchParams }: PageProps<"/">) {
  const conta = await contaAtual();
  const apagada = (await searchParams).apagada === "1";
  return (
    <div className="space-y-12">
      {apagada && (
        <p role="status" className="rounded-xl border border-borda bg-superficie px-4 py-3 text-sm">
          A conta da família e todos os dados dela foram apagados.
        </p>
      )}
      <section className="space-y-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-marca">Guia de campo da natureza</p>
        <h1 className="text-4xl sm:text-5xl font-semibold leading-tight max-w-2xl">
          Descubra os bichos do Brasil, em 3D, com quem você ama.
        </h1>
        <p className="text-lg text-suave max-w-xl">
          Fichas por idade, bichos em 3D, “que bicho é esse?” por foto e um mapa do que a sua família encontrou.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a href="https://estudodebolso.com.br" className="rounded-xl bg-marca text-marca-texto px-5 py-3 font-semibold text-center">
            Explorar os bichos
          </a>
          {conta ? (
            <Link href="/conta" className="rounded-xl border border-borda bg-superficie px-5 py-3 font-semibold text-center">
              Minha conta
            </Link>
          ) : (
            <Link href="/criar-conta" className="rounded-xl border border-borda bg-superficie px-5 py-3 font-semibold text-center">
              Criar conta da família
            </Link>
          )}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          ["Para todas as idades", "Modos Pequeno, Explorador e Cientista: o mesmo bicho, explicado do jeito de cada idade."],
          ["Criança sem e-mail", "O adulto cria a conta da criança. Ela entra com o código da família e um PIN."],
          ["Sem anúncios", "Nada de rastreadores nem perfil público. O responsável exporta e apaga tudo quando quiser."],
        ].map(([t, d]) => (
          <div key={t} className="rounded-2xl border border-borda bg-superficie p-5">
            <h2 className="text-lg font-semibold">{t}</h2>
            <p className="text-sm text-suave mt-2">{d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
