import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { DEFAULT_CHANNEL_PROVIDER } from '@/lib/channels';
import { tool } from '@/lib/agent-engine/edge/llm/run-model-call';
import { applyPreviewPolicy, newPreviewResult, scenarioContext, passagemPropostaNoSandbox, type TurnPreview } from '@/lib/agent-engine/agent/preview';
import { evaluateBeforeSend, type GateContext } from '@/lib/agent-engine/guardrails/before-send';
import { PACING_DEFAULTS } from '@/lib/agent-engine/pacing/defaults';
import { SPINNING_DEFAULTS } from '@/lib/agent-engine/spinning/defaults';
import { validarPedidoDePassagem } from '@/lib/agent-engine/agent/human-handoff';
import { descricaoDaFerramentaDePassagem } from '@/lib/agent-engine/agent/inbound-turn';

const corpo = 'Registrei sua dúvida com a equipe. Ela vai verificar e te responder.';
const caso = { title: 'Confirmar uma regra', summary: 'A pessoa perguntou uma regra sem resposta aprovada.', blocker: 'A consulta não encontrou informação aprovada.' };
const semantica = { isPromise: false, suspectPhrase: null, prometeuRetornoHumano: true, retornoSoDoAssistente: false };
const def = (execute = vi.fn()) => tool({ inputSchema: z.object({}).passthrough(), execute: async a => execute(a) });
const contexto = (): GateContext => ({
  now: new Date('2026-10-10T15:00:00Z'), body: '', optedOut: false, provider: DEFAULT_CHANNEL_PROVIDER,
  messagingWindow: { lastInboundAt: new Date('2026-10-10T15:00:00Z') },
  pacing: { knobs: PACING_DEFAULTS, state: { lastSentAt: null, sentToday: 0, numberActivatedAt: null }, crmDailyLimit: null },
  spinning: { knobs: SPINNING_DEFAULTS, window: [] }, promise: { table: null }, semanticPromise: null,
  disclosure: { template: null, isFirstOutbound: false, mode: 'inject' }, lgpd: null,
  casesEnabled: true, hasOpenCase: false, openedCaseThisTurn: false,
});
function preparar(kind: TurnPreview['kind'] = 'sandbox', over: Partial<GateContext> = {}) {
  const p: TurnPreview = { kind, organizationId: 'org', runId: 'run', contactId: null, channelId: null,
    agent: { casesEnabled: true, handoffToolEnabled: true } as TurnPreview['agent'], context: scenarioContext([]), result: newPreviewResult() };
  const ctx = { ...contexto(), ...over }, executor = vi.fn();
  const tools = applyPreviewPolicy({ send_message: def(executor), open_human_case: def(executor), request_human_handoff: def(executor), save_lead_note: def(executor), schedule_followup: def(executor) }, p, ctx, () => [], async () => semantica);
  const chamar = (n: string, a: unknown) => tools[n]!.execute!(a, { toolCallId: 'teste', messages: [], context: undefined });
  return { p, ctx, executor, chamar, tools };
}
describe('proposta humana no sandbox, sem executar a operação', () => {
  it('antes da proposta impede; depois de caso válido mostra candidata e aviso, sem caso fictício', async () => {
    const { p, ctx, executor, chamar } = preparar();
    expect(await chamar('send_message', { body: corpo })).toMatchObject({ ok: false, error: { code: 'case_promise_without_case' } });
    expect(await chamar('open_human_case', caso)).toMatchObject({ ok: true, status: 'proposal_only' });
    expect(await chamar('send_message', { body: corpo })).toMatchObject({ ok: true, status: 'simulated' });
    expect(p.result.candidates[0]?.trace).toContainEqual({ gate: 'case_promise', verdict: 'skipped', code: 'sandbox_human_operation_proposed' });
    expect(p.result.warnings.some(x => x.code === 'sandbox_human_operation_proposed')).toBe(true);
    expect(ctx.hasOpenCase).toBe(false); expect(ctx.openedCaseThisTurn).toBe(false);
    expect(executor).not.toHaveBeenCalled();
  });
  it('handoff válido é passagem proposta terminal; não exige caso nem executor real', async () => {
    const { p, executor, chamar } = preparar();
    expect(passagemPropostaNoSandbox(p)).toBe(false);
    await chamar('request_human_handoff', { por_que: 'Cliente pediu pessoa', cliente_quer: 'Falar com atendente' });
    expect(passagemPropostaNoSandbox(p)).toBe(true);
    expect(p.result.proposals).toHaveLength(1);
    expect(p.result.proposals[0]).toMatchObject({ tool: 'request_human_handoff', validada: true });
    expect(p.result.proposals.some(x => x.tool === 'open_human_case')).toBe(false);
    expect(executor).not.toHaveBeenCalled();
  });
  it.each(['open_human_case', 'request_human_handoff'])('payload inválido de %s não libera promessa', async name => {
    const { p, chamar, executor } = preparar();
    expect(await chamar(name, { organization_id: 'outra', case_id: 'inventado' })).toMatchObject({ ok: false, error: { code: 'invalid_payload' } });
    expect(await chamar('send_message', { body: corpo })).toMatchObject({ ok: false });
    expect(p.result.proposals).toHaveLength(0); expect(executor).not.toHaveBeenCalled();
  });
  it.each(['save_lead_note', 'schedule_followup'])('%s não substitui caso da equipe', async name => {
    const { p, chamar } = preparar();
    await chamar(name, { text: 'informação' });
    expect(await chamar('send_message', { body: corpo })).toMatchObject({ ok: false, error: { code: 'case_promise_without_case' } });
    expect(p.result.candidates).toHaveLength(0);
  });
  it('capacidade desligada não gera proposta válida', async () => {
    const { p, chamar } = preparar(); p.agent.casesEnabled = false;
    expect(await chamar('open_human_case', caso)).toMatchObject({ ok: false, error: { code: 'preview_capability_unavailable' } });
    expect(await chamar('send_message', { body: corpo })).toMatchObject({ ok: false });
  });
  it('não usa proposta de run anterior, nem arrays pré-carregados', async () => {
    const { p, ctx } = preparar();
    p.result.proposals.push({ tool: 'open_human_case', arguments: caso, validada: true });
    const novo = applyPreviewPolicy({ send_message: def() }, p, ctx, () => [], async () => semantica);
    await novo.send_message!.execute!({ body: corpo }, { toolCallId: 'novo', messages: [], context: undefined });
    expect(p.result.candidates).toHaveLength(0); expect(passagemPropostaNoSandbox(p)).toBe(false);
  });
  it('trocar run ou organização invalida a permissão e o término da passagem', async () => {
    const { p, chamar } = preparar();
    await chamar('request_human_handoff', {});
    p.runId = 'outro-run'; p.organizationId = 'outra-org';
    expect(passagemPropostaNoSandbox(p)).toBe(false);
    expect(await chamar('send_message', { body: corpo })).toMatchObject({ ok: false });
  });
  it('o rascunho assistido conserva o veto mesmo após proposta válida', async () => {
    const { p, chamar } = preparar('assisted');
    await chamar('open_human_case', caso);
    expect(await chamar('send_message', { body: corpo })).toMatchObject({ ok: false, error: { code: 'case_promise_without_case' } });
    expect(p.result.warnings).toHaveLength(0); expect(p.result.candidates).toHaveLength(0);
    expect(passagemPropostaNoSandbox(p)).toBe(false);
  });
  it('produção continua exigindo caso efetivo; não há liberação global', () => {
    expect(evaluateBeforeSend({ ...contexto(), body: corpo, semanticPromise: semantica }).veto?.code).toBe('case_promise_without_case');
    expect(evaluateBeforeSend({ ...contexto(), body: corpo, semanticPromise: semantica, openedCaseThisTurn: true }).veto).toBeNull();
  });
  it('uma proposta válida não libera opt-out nem veto comercial', async () => {
    const { p, chamar } = preparar('sandbox', { optedOut: true });
    await chamar('open_human_case', caso);
    expect(await chamar('send_message', { body: corpo })).toMatchObject({ ok: false });
    expect(p.result.candidates).toHaveLength(0);
    const outro = preparar();
    const tools = applyPreviewPolicy({ send_message: def(), open_human_case: def() }, outro.p, outro.ctx, () => [], async () => ({ ...semantica, isPromise: true, suspectPhrase: 'grátis para sempre' }));
    await tools.open_human_case!.execute!(caso, { toolCallId: 'caso', messages: [], context: undefined });
    expect(await tools.send_message!.execute!({ body: corpo }, { toolCallId: 'msg', messages: [], context: undefined })).toMatchObject({ ok: false });
    expect(outro.p.result.candidates).toHaveLength(0);
  });
  it('validação de passagem recusa prototype pollution sem executar', () => {
    expect(validarPedidoDePassagem(JSON.parse('{"__proto__":{"admin":true}}'))).toMatchObject({ ok: false });
    expect(validarPedidoDePassagem({ o_que_tentei: [{ o_que: 'busquei', tenant_id: 'forjado' }] })).toMatchObject({ ok: false });
  });
  it('descrição pede acionar capacidade; aviso é do sistema, sem promessa manual prévia', () => {
    for (const ligada of [true, false]) {
      const d = descricaoDaFerramentaDePassagem(ligada);
      expect(d).toContain('chame esta ferramenta diretamente');
      expect(d).toContain('O sistema cuida do');
      expect(d).not.toContain('AVISE O LEAD ANTES');
      expect(d).toContain('encerre o turno');
    }
  });
});
