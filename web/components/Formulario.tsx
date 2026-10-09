"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

export function Campo(props: {
  nome: string;
  rotulo: string;
  tipo?: string;
  padrao?: string;
  dica?: string;
  obrigatorio?: boolean;
  autoComplete?: string;
  inputMode?: "numeric" | "email" | "text";
  min?: number;
  max?: number;
  maxLength?: number;
}) {
  const id = `campo-${props.nome}`;
  return (
    <label htmlFor={id} className="block">
      <span className="block text-sm font-medium mb-1">{props.rotulo}</span>
      <input
        id={id}
        name={props.nome}
        type={props.tipo ?? "text"}
        defaultValue={props.padrao}
        required={props.obrigatorio ?? true}
        autoComplete={props.autoComplete}
        inputMode={props.inputMode}
        min={props.min}
        max={props.max}
        maxLength={props.maxLength}
        className="w-full rounded-xl border border-borda bg-superficie px-3 py-3 text-base"
      />
      {props.dica && <span className="block text-xs text-suave mt-1">{props.dica}</span>}
    </label>
  );
}

export function BotaoEnviar({ children, variante = "principal" }: { children: ReactNode; variante?: "principal" | "perigo" }) {
  const { pending } = useFormStatus();
  const cor = variante === "perigo" ? "bg-erro text-white" : "bg-marca text-marca-texto";
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full sm:w-auto rounded-xl px-5 py-3 font-semibold ${cor} disabled:opacity-60`}
    >
      {pending ? "Aguarde…" : children}
    </button>
  );
}

export function Mensagem({ erro, ok }: { erro?: string; ok?: string }) {
  if (erro) return <p role="alert" className="rounded-xl border border-erro/40 bg-erro/10 px-3 py-2 text-sm text-erro">{erro}</p>;
  if (ok) return <p role="status" className="rounded-xl border border-ok/40 bg-ok/10 px-3 py-2 text-sm text-ok">{ok}</p>;
  return null;
}
