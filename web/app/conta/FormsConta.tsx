"use client";

import { useActionState, useEffect, useRef } from "react";
import { adicionarMembro, apagarFamilia } from "./actions";
import { BotaoEnviar, Campo, Mensagem } from "@/components/Formulario";
import { AVATARES } from "@/lib/planos";

export function FormAdicionarMembro() {
  const [estado, acao] = useActionState(adicionarMembro, undefined);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (estado?.ok) form.current?.reset();
  }, [estado]);

  return (
    <details className="rounded-xl border border-borda p-4" open={Boolean(estado?.erro)}>
      <summary className="cursor-pointer font-semibold">Adicionar criança ou adolescente</summary>
      <form ref={form} action={acao} className="space-y-4 mt-4">
        <Campo nome="apelido" rotulo="Apelido" padrao={estado?.campos?.apelido} dica="Não use o nome completo." maxLength={30} autoComplete="off" />
        <Campo nome="ano" rotulo="Ano de nascimento" padrao={estado?.campos?.ano} inputMode="numeric" maxLength={4} dica="Define o modo da tela (Pequeno, Explorador ou Cientista). Não guardamos a data." />
        <fieldset>
          <legend className="text-sm font-medium mb-2">Avatar</legend>
          <div className="grid grid-cols-4 gap-2">
            {AVATARES.map((a, i) => (
              <label key={a.id} className="rounded-xl border border-borda px-2 py-2 text-center text-sm has-[:checked]:border-marca has-[:checked]:bg-marca/10">
                <input type="radio" name="avatar" value={a.id} defaultChecked={(estado?.campos?.avatar ?? "formiga") === a.id || (!estado?.campos?.avatar && i === 0)} className="sr-only" />
                {a.nome}
              </label>
            ))}
          </div>
        </fieldset>
        <Campo nome="pin" rotulo="PIN (4 a 6 números)" tipo="password" inputMode="numeric" maxLength={6} autoComplete="new-password" />
        <label className="flex gap-3 items-start text-sm">
          <input type="checkbox" name="aceite" className="mt-1 h-5 w-5" required />
          <span>Sou o responsável e autorizo o Bio no Bolso a guardar o apelido, o avatar e o progresso desta conta, como descrito na política de privacidade.</span>
        </label>
        <Mensagem erro={estado?.erro} ok={estado?.ok} />
        <BotaoEnviar>Adicionar</BotaoEnviar>
      </form>
    </details>
  );
}

export function FormApagarFamilia() {
  const [estado, acao] = useActionState(apagarFamilia, undefined);
  return (
    <details className="rounded-xl border border-erro/30 p-4">
      <summary className="cursor-pointer text-sm font-semibold text-erro">Apagar a conta da família</summary>
      <form action={acao} className="space-y-3 mt-3">
        <Campo nome="confirmacao" rotulo="Escreva APAGAR para confirmar" autoComplete="off" />
        <Mensagem erro={estado?.erro} />
        <BotaoEnviar variante="perigo">Apagar tudo</BotaoEnviar>
      </form>
    </details>
  );
}
