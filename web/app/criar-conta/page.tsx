import { redirect } from "next/navigation";
import { contaAtual } from "@/lib/dal";
import FormCriarConta from "./FormCriarConta";

export const metadata = { title: "Criar conta" };

export default async function CriarConta() {
  if (await contaAtual()) redirect("/conta");
  return (
    <div className="max-w-md space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Criar a conta da família</h1>
        <p className="text-suave">
          Um adulto cria a conta. Depois, ele adiciona as crianças e os adolescentes, que entram sem e-mail.
        </p>
      </div>
      <FormCriarConta />
    </div>
  );
}
