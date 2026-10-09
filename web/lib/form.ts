// Estado devolvido pelas ações de formulário (useActionState).
export type EstadoForm = { erro?: string; ok?: string; campos?: Record<string, string> } | undefined;
