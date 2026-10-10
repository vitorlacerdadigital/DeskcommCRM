"use client";
import { useT } from "@/hooks/i18n/useT";

const ROTULOS: Record<string, string> = {
  open_human_case: "Abrir caso para a equipe",
  request_human_handoff: "Passar a conversa para uma pessoa",
  schedule_followup: "Agendar retorno",
  save_lead_note: "Registrar nota",
  update_lead_state: "Atualizar dados do atendimento",
};

export function AcoesPropostasNoTeste({ proposals }: {
  proposals: Array<{ tool: string; arguments: unknown }>;
}) {
  const t = useT();
  if (!proposals.length) return null;
  return <div data-testid="teste-acoes-propostas">
    <p className="font-medium">{t("Ações propostas: precisam de autorização separada")}</p>
    <ul className="space-y-2">
      {proposals.map((x, i) => <li key={i}>
        <p>{t(ROTULOS[x.tool] ?? x.tool)} — {t("Proposta, não executada")}</p>
        <details>
          <summary>{t("Argumentos da proposta")}</summary>
          <pre className="overflow-auto whitespace-pre-wrap">{JSON.stringify(x.arguments, null, 2)}</pre>
        </details>
      </li>)}
    </ul>
  </div>;
}
