// Sessão em banco: o cookie guarda um token aleatório; o banco guarda só o sha256 dele.
import { cookies, headers } from "next/headers";
import { q, q1 } from "./db";
import { sha256, tokenAleatorio } from "./senha";

export const COOKIE = "bio_sessao";
const DIAS = 30;

export async function criarSessao(contaId: string): Promise<void> {
  const token = tokenAleatorio();
  const expira = new Date(Date.now() + DIAS * 24 * 60 * 60 * 1000);
  await q("insert into sessoes (id, conta_id, expira_em) values ($1, $2, $3)", [sha256(token), contaId, expira]);
  await q("update contas set ultimo_acesso = now() where id = $1", [contaId]);
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expira,
  });
}

export async function encerrarSessao(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await q("delete from sessoes where id = $1", [sha256(token)]);
  jar.delete(COOKIE);
}

export type ContaSessao = {
  id: string;
  familia_id: string;
  faixa: "adulto" | "adolescente" | "crianca";
  papel: "responsavel" | "membro";
  modo: "pequeno" | "explorador" | "cientista";
  admin: boolean;
  email: string | null;
  nome: string | null;
  apelido: string;
  avatar: string;
  xp: number;
  nivel: number;
};

export async function contaDaSessao(): Promise<ContaSessao | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  return q1<ContaSessao>(
    `select c.id, c.familia_id, c.faixa, c.papel, c.modo, c.admin, c.email, c.nome,
            p.apelido, p.avatar, p.xp, p.nivel
       from sessoes s join contas c on c.id = s.conta_id join perfis p on p.conta_id = c.id
      where s.id = $1 and s.expira_em > now()`,
    [sha256(token)],
  );
}

/** IP do visitante (Cloudflare na frente), só para limite de tentativas e hash. */
export async function ipVisitante(): Promise<string> {
  const h = await headers();
  return h.get("cf-connecting-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "desconhecido";
}
