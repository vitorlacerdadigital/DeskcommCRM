import { beforeEach, describe, expect, it, vi } from 'vitest';
import type pg from 'pg';
import { classifyPromise } from './semantic';
import type { PacoteFactual } from './contrato-contexto';
import { pacoteParaJev, revisarRespostaComJev } from '@/lib/ai/decisao/revisao-resposta';
import { lerConfigDoJev } from '@/lib/ai/decisao/config';
import { contextoDoAtendimentoIndisponivel, type ContextoDoAtendimento } from '../../agent/contexto-do-atendimento';
const seam=vi.hoisted(()=>({call:vi.fn()}));
vi.mock('../../edge/llm/run-model-call',()=>({runModelCall:seam.call}));
const log={info:vi.fn(),warn:vi.fn(),error:vi.fn(),debug:vi.fn()};
const ctx=():ContextoDoAtendimento=>({...contextoDoAtendimentoIndisponivel(),perfil:[{id:'privado',origem:'campo_crm',sujeito:'pedido_1',em:'2026-10-10T12:00:00Z',revisao:'1',estado:'declared',dados:{modalidade:'natação',pessoa:'Ana'}}],cobertura:[{categoria:'perfil',estado:'present',encontrados:1,selecionados:1,omitidos:0}]});
beforeEach(()=>{vi.clearAllMocks();seam.call.mockResolvedValue({result:{text:JSON.stringify({isPromise:false,prometeuRetornoHumano:true,retornoSoDoAssistente:false,repasseConcluidoFiel:false})}});});
describe('T03/T04 pacote de fontes nos três consumidores',()=>{
  it.each([{commercialEvidence:[]},{commercialEvidence:[{origem:'conhecimento' as const,titulo:'Oferta',conteudo:'Uma sessão, até 15 minutos.',referencia:'ref'}]}])('mesmos fatos autorizados com e sem KB',async ({commercialEvidence})=>{
    const p:PacoteFactual={candidate:'Ana pode conhecer as condições.',serviceContext:ctx(),sentAntecedents:['Essas condições foram apresentadas.'],commercialEvidence};
    await classifyPromise({} as pg.Pool,{}, {tenantId:'fixture'},p,{log,loadHumanReturnBinding:vi.fn(async()=>({purpose:'human_return_confirmation',provider:'openai',credential_id:'id',model_id:'modelo',base_url:null,is_enabled:true}))});
    expect(seam.call).toHaveBeenCalledTimes(2);
    const messages=seam.call.mock.calls.map(c=>JSON.parse(c[2].messages[0].content));
    expect(messages[0]).toEqual(pacoteParaJev(p));expect(messages[1]).toEqual(messages[0]);
    expect(messages[0].contexto_atendimento.perfil[0]).toMatchObject({origem:'campo_crm',estado:'declared',dados:{pessoa:'Ana'}});
    expect(JSON.stringify(messages[0])).not.toContain('privado');
    expect(seam.call.mock.calls[0]![2].system).not.toContain('"pessoa":"Ana"');
  });
  it('v1 não envia perfil ampliado, mesmo sem Caso; reserva assume sem inventar aceite',async()=>{
    const config=lerConfigDoJev({jev:{ligado:true,aceite:{em:'2026-10-10T10:00:00Z',por:'11111111-1111-4111-8111-111111111111'},contexto_revisao:{versao:1,em:'2026-10-10T10:00:00Z',por:'11111111-1111-4111-8111-111111111111'},tarefas:{revisao_resposta:{estado:'decidindo'}}}});
    const perguntar=vi.fn(),reserva=vi.fn(async()=>({isPromise:false,suspectPhrase:null,prometeuRetornoHumano:false,retornoSoDoAssistente:false}));
    await revisarRespostaComJev({} as pg.Pool,{}, {tenantId:'fixture'}, {candidate:'Convite',serviceContext:ctx()},reserva,{log,lerConfig:vi.fn(async()=>config),perguntar,conferirOrcamento:vi.fn()});
    expect(perguntar).not.toHaveBeenCalled();expect(reserva).toHaveBeenCalledOnce();
    expect(log.info).toHaveBeenCalledWith(expect.any(String),expect.objectContaining({motivo:'context_consent_version_insufficient'}));
  });
});
