import Link from "next/link";
import { contaAtual } from "@/lib/dal";

export default async function Cabecalho() {
  const conta = await contaAtual();
  return (
    <header className="bg-floresta text-white">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="font-titulo text-lg font-semibold tracking-tight">
          Bio no Bolso
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link href="/planos" className="px-3 py-2 rounded-lg hover:bg-white/10">Planos</Link>
          {conta ? (
            <Link href="/conta" className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20">{conta.apelido}</Link>
          ) : (
            <Link href="/entrar" className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20">Entrar</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
