"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { criarContaAdulto } from "./actions";
import { BotaoEnviar, Campo, Mensagem } from "@/components/Formulario";

export default function FormCriarConta() {
  const [estado, acao] = useActionState(criarContaAdulto, undefined);
  const [ano, setAno] = useState(estado?.campos?.ano ?? "");
  const anoAtual = new Date().getFullYear();
  const idade = ano.length === 4 ? anoAtual - Number(ano) - 1 : null;
  const menor = idade !== null && idade < 18 && idade >= 0;

  return (
    <form action={acao} className="space-y-4">
      <label htmlFor="campo-ano" className="block">
        <span className="block text-sm font-medium mb-1">Em que ano você nasceu?</span>
        <input
          id="campo-ano"
          name="ano"
          inputMode="numeric"
          maxLength={4}
          required
          value={ano}
          onChange={(e) => setAno(e.target.value.replace(/\D/g, ""))}
          className="w-full rounded-xl border border-borda bg-superficie px-3 py-3 text-base"
        />
        <span className="block text-xs text-suave mt-1">Pedimos só o ano, para saber como a conta funciona.</span>
      </label>

      {menor ? (
        <div className="rounded-2xl border border-borda bg-superficie p-4 text-sm space-y-2">
          <p className="font-semibold">Quem tem menos de 18 anos entra pela conta da família.</p>
          <p className="text-suave">Peça para um adulto criar a conta e adicionar você. Você vai entrar com o código da família, seu apelido e um PIN.</p>
          <Link href="/entrar?pin=1" className="inline-block underline">Já tenho código e PIN</Link>
        </div>
      ) : (
        <>
          <Campo nome="nome" rotulo="Seu nome" padrao={estado?.campos?.nome} autoComplete="name" maxLength={80} />
          <Campo nome="email" rotulo="E-mail" tipo="email" padrao={estado?.campos?.email} autoComplete="email" inputMode="email" />
          <Campo nome="senha" rotulo="Senha" tipo="password" autoComplete="new-password" dica="Pelo menos 10 caracteres." />
          <label className="flex gap-3 items-start text-sm">
            <input type="checkbox" name="aceite" className="mt-1 h-5 w-5" required defaultChecked={estado?.campos?.aceite === "1"} />
            <span>
              Li e aceito os <Link href="/termos" target="_blank" className="underline">termos de uso</Link> e a{" "}
              <Link href="/privacidade" target="_blank" className="underline">política de privacidade</Link>.
            </span>
          </label>
          <Mensagem erro={estado?.erro} />
          <BotaoEnviar>Criar conta</BotaoEnviar>
        </>
      )}
      <p className="text-sm text-suave">
        Já tem conta? <Link href="/entrar" className="underline">Entrar</Link>
      </p>
    </form>
  );
}
