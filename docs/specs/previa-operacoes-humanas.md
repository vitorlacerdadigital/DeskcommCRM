# Prévia de casos e passagens para pessoas

## Contrato

O Testar do agente é `kind: sandbox`. Consultas autorizadas são reais; escritas são propostas. Não abre caso, não transfere, não envia aviso, não escreve conversa ou cron. Nunca preenche `hasOpenCase`/`openedCaseThisTurn` nem devolve ID de sucesso fictício.

Uma proposta de `open_human_case` habilitada pela versão passa pelo mesmo `openHumanCaseInputSchema` do executor. Uma proposta de `request_human_handoff` habilitada passa por `validarPedidoDePassagem`, validação pura compartilhada com o executor (whitelist/prototype). Payload inválido ou capacidade desligada gera impedimento e não autoriza continuação.

Depois da proposta válida, somente o veto `case_promise_without_case` da cadeia vira aviso no sandbox. Trace `sandbox_human_operation_proposed`, semântica “operação proposta, não executada”. O caso continua falso. Só vale neste closure/run/conversa, para propostas anteriores à candidata; notas e follow-up da própria IA não substituem caso da equipe. Não lê propostas pré-carregadas como autorização.

Opt-out, LGPD, conteúdo comercial, mídia e demais gates continuam valendo. `assisted` e produção usam a cadeia real intacta; uma proposta não substitui a execução. O envio de rascunho aprovado revalida o estado.

Uma passagem humana válida no sandbox é um desfecho terminal apresentado como proposta, sem inventar resposta textual do agente ou marcar `no_candidate`. O turno deixa de pedir novas ferramentas após essa proposta. Caso é diferente: a IA pode propor continuação hipotética após registrá-lo.

## Orientação de passagem e operação real

O modelo aciona `request_human_handoff` diretamente quando autorizado e encerra. O sistema cuida do aviso pelo helper existente; não pede mensagem manual prometendo humano antes. Payload inválido é recusado antes de qualquer aviso. O flag de passagem bem-sucedida só nasce depois do resultado real. Falha de operação não é sucesso; o aviso anterior é anúncio da tentativa, não prova de execução. A política jurídica ligada/desligada mantém suas diferenças, com o mesmo rodapé de execução.

## Registro e tela

Entrada: execução real do Testar (`executarTurnoDoAgente` → `applyPreviewPolicy`). Saída: `PreviewResult` → rota oficial de teste → `TestPanel` e `AcoesPropostasNoTeste`. Trace acompanha a candidata; proposta mostra rótulo legível, “Proposta, não executada” e argumentos expansíveis. Aviso explica que a conclusão operacional requer prova no atendimento real.

A porta continua IA > Agentes > agente > Testar; não existe configuração nova para operações simuladas. Disponibilidade vem de casos/passagem habilitados na própria versão. Sem proposta válida, erro de ensino mantém o impedimento. Caso ou passagem reais continuam pelo fluxo operacional existente e seus registros de atendimento.

Laço de retorno: humano lê argumentos/trace e corrige configuração ou comportamento; próximo teste usa a versão escolhida. Não se grava sucesso comercial ou operação de produção em consequência da simulação. Esta peça de leitura não dispara follow-up próprio.

## Prova

`tests/unit/sandbox-operacoes-humanas.test.ts`: antes/depois da proposta, whitelist, campos forjados, capacidade desligada, ausência de executor, run/organização anterior, assisted/produção, outros gates e retorno terminal. `tests/unit/acoes-humanas-na-previa.test.tsx`: rótulos, argumentos e ausência de falso sucesso. Prova visual e recortes pelo motor oficial complementam a unidade; mocks não provam decisão de modelo nem produção.
