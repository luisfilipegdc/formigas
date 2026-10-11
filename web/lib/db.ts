// Conexão com o Postgres da VPS (usuário bio_app). Só roda no servidor.
import { Pool, type QueryResultRow } from "pg";

declare global {
  var __bioPool: Pool | undefined;
}

function pool(): Pool {
  if (!globalThis.__bioPool) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL não configurada.");
    globalThis.__bioPool = new Pool({ connectionString: url, max: 10, idleTimeoutMillis: 30_000 });
  }
  return globalThis.__bioPool;
}

export async function q<T extends QueryResultRow>(sql: string, params: unknown[] = []): Promise<T[]> {
  const r = await pool().query<T>(sql, params);
  return r.rows;
}

export async function q1<T extends QueryResultRow>(sql: string, params: unknown[] = []): Promise<T | null> {
  const rows = await q<T>(sql, params);
  return rows[0] ?? null;
}

/** Roda várias consultas numa transação (tudo ou nada). */
export async function transacao<T>(fn: (tq: <R extends QueryResultRow>(sql: string, params?: unknown[]) => Promise<R[]>) => Promise<T>): Promise<T> {
  const c = await pool().connect();
  try {
    await c.query("begin");
    const out = await fn(async <R extends QueryResultRow>(sql: string, params: unknown[] = []) => (await c.query<R>(sql, params)).rows);
    await c.query("commit");
    return out;
  } catch (e) {
    await c.query("rollback");
    throw e;
  } finally {
    c.release();
  }
}
