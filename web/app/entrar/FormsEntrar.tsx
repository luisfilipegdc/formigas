"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { entrarComEmail, entrarComPin } from "./actions";
import { BotaoEnviar, Campo, Mensagem } from "@/components/Formulario";

export default function FormsEntrar({ inicial }: { inicial: "email" | "pin" }) {
  const [aba, setAba] = useState<"email" | "pin">(inicial);
  const [estEmail, acaoEmail] = useActionState(entrarComEmail, undefined);
  const [estPin, acaoPin] = useActionState(entrarComPin, undefined);

  return (
    <div className="space-y-5">
      <div role="tablist" className="grid grid-cols-2 rounded-xl border border-borda bg-superficie p-1 text-sm font-semibold">
        <button role="tab" aria-selected={aba === "email"} onClick={() => setAba("email")}
          className={`rounded-lg py-2 ${aba === "email" ? "bg-marca text-marca-texto" : ""}`}>
          Adulto
        </button>
        <button role="tab" aria-selected={aba === "pin"} onClick={() => setAba("pin")}
          className={`rounded-lg py-2 ${aba === "pin" ? "bg-marca text-marca-texto" : ""}`}>
          Criança ou adolescente
        </button>
      </div>

      {aba === "email" ? (
        <form action={acaoEmail} className="space-y-4">
          <Campo nome="email" rotulo="E-mail" tipo="email" padrao={estEmail?.campos?.email} autoComplete="email" inputMode="email" />
          <Campo nome="senha" rotulo="Senha" tipo="password" autoComplete="current-password" />
          <Mensagem erro={estEmail?.erro} />
          <BotaoEnviar>Entrar</BotaoEnviar>
          <p className="text-sm text-suave">
            Ainda não tem conta? <Link href="/criar-conta" className="underline">Criar conta da família</Link>
          </p>
        </form>
      ) : (
        <form action={acaoPin} className="space-y-4">
          <Campo nome="codigo" rotulo="Código da família" padrao={estPin?.campos?.codigo} dica="Ex.: ONCA-421. Está na conta do adulto." autoComplete="off" maxLength={20} />
          <Campo nome="apelido" rotulo="Seu apelido" padrao={estPin?.campos?.apelido} autoComplete="off" maxLength={30} />
          <Campo nome="pin" rotulo="PIN" tipo="password" inputMode="numeric" autoComplete="off" maxLength={6} />
          <Mensagem erro={estPin?.erro} />
          <BotaoEnviar>Entrar</BotaoEnviar>
        </form>
      )}
    </div>
  );
}
