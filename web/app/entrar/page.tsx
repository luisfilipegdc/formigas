import { redirect } from "next/navigation";
import { contaAtual } from "@/lib/dal";
import FormsEntrar from "./FormsEntrar";

export const metadata = { title: "Entrar" };

export default async function Entrar({ searchParams }: PageProps<"/entrar">) {
  if (await contaAtual()) redirect("/conta");
  const comPin = (await searchParams).pin === "1";
  return (
    <div className="max-w-md space-y-6">
      <h1 className="text-3xl font-semibold">Entrar</h1>
      <FormsEntrar inicial={comPin ? "pin" : "email"} />
    </div>
  );
}
