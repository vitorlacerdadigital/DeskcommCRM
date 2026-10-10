// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AcoesPropostasNoTeste } from '@/app/app/ai/agents/[id]/_components/AcoesPropostasNoTeste';
vi.mock('@/hooks/i18n/useT', () => ({ useT: () => (s: string) => s }));
describe('ações humanas visíveis como propostas no teste', () => {
  it('distingue caso e transferência, mostra argumentos e ausência de execução', () => {
    render(<AcoesPropostasNoTeste proposals={[
      { tool: 'open_human_case', arguments: { title: 'Confirmar política' } },
      { tool: 'request_human_handoff', arguments: { por_que: 'Cliente pediu pessoa' } },
    ]} />);
    expect(screen.getByText(/Abrir caso para a equipe/)).toBeTruthy();
    expect(screen.getByText(/Passar a conversa para uma pessoa/)).toBeTruthy();
    expect(screen.getAllByText(/Proposta, não executada/)).toHaveLength(2);
    expect(screen.getByText(/Confirmar política/)).toBeTruthy();
    expect(screen.queryByText(/caso aberto|transferência concluída/i)).toBeNull();
  });
});
