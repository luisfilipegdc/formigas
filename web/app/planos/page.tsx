import Link from "next/link";
import { PLANOS } from "@/lib/planos";

export const metadata = { title: "Planos" };

export default function Planos() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-semibold">Planos</h1>
        <p className="text-suave max-w-2xl">
          Hoje tudo é gratuito, enquanto o catálogo cresce. A cobrança só começa quando houver 50 fichas revisadas por um
          especialista e 8 bichos em 3D.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {PLANOS.map((p) => (
          <article key={p.id} className="rounded-2xl border border-borda bg-superficie p-5 flex flex-col">
            <h2 className="text-xl font-semibold">{p.nome}</h2>
            <p className="mt-2 text-2xl font-semibold">{p.preco}</p>
            {p.anual && <p className="text-sm text-suave">{p.anual}</p>}
            <p className="text-sm mt-3">{p.resumo}</p>
            <ul className="mt-4 space-y-2 text-sm flex-1">
              {p.itens.map((i) => (
                <li key={i} className="flex gap-2">
                  <span aria-hidden className="text-ok">✓</span>
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <p className="text-sm text-suave">
        Escola com vários professores: proposta sob medida, com boleto e nota fiscal.{" "}
        <Link href="/criar-conta" className="underline">Criar conta grátis</Link>
      </p>
    </div>
  );
}
