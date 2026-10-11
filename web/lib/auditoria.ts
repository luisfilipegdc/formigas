import { q } from "./db";

export async function registrar(contaId: string | null, acao: string, detalhe: Record<string, unknown> = {}): Promise<void> {
  try {
    await q("insert into log_auditoria (conta_id, acao, detalhe) values ($1, $2, $3)", [contaId, acao, JSON.stringify(detalhe)]);
  } catch {
    // auditoria não pode derrubar a ação principal
  }
}
