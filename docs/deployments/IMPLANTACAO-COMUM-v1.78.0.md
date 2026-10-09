# Versão comum v1.78.0 — candidata validada

Base oficial v1.78.0, revisão conciliada `651a511088dd8c342e70fca20ced877c0492e81a`. Pins, CI e medições no arquivo `shared-v1.78.0-release.json`. Esta preparação não implantou a candidata em produção. Implantação exige orientação do proprietário.

O pacote conserva as correções oficiais da release e os patches gerais ainda necessários: marca, convites/cadastro/login, estrutura e identidade dos e-mails, contexto configurável JEV e revisão comercial com evidências/contexto. Gemini 3.5 Flash-Lite, preços, catálogo/acervo e resultados do roteamento usam as implementações oficiais equivalentes. A migration local Gemini 0576 fica como histórico; o baseline usa a 0599 oficial. A nova 0617 cria somente um índice textual idempotente.

## Contrato de contexto

O motor lê `ai_routers.config.context_message_count`. Quatro numa organização e oito em outra não exigem código diferente. Oito é o padrão para campo ausente; o painel aceita até dezesseis. A opção de modelo/classificador salva permanece, inclusive Automático.

JEV exige autorização específica: V1 conserva o limite anterior de quatro; V2 respeita a janela salva até dezesseis. Atualização não renova o aceite. Sem aceite, envia só a mensagem atual. A classificação tradicional conserva os modos oficiais e usa a janela do roteador. Renovação/revogação ocorre pela API/interface existente.

## Procedimento de implantação, após autorização

1. Reconfirmar a release estável mais recente e eventuais decisões oficiais sobre contexto. Se surgiu release ou solução concorrente, comparar antes de escolher a base; não apagar patches apenas por um merge upstream.
2. Ler coordenação e diferenças locais da instalação de destino. Reservar a implantação; preservar o checkout operacional sujo em vez de sobrescrevê-lo. Obter a revisão num worktree separado, conferir ancestralidade e aplicar exatamente os pins do manifesto.
3. Fazer backup próprio da instalação: banco, ambiente, compose/proxy/TLS/CA, configurações externas Auth, montagens e referências atuais das três imagens. Guardar somente em diretório privado protegido. Conferir integridade antes de schema/deploy.
4. Capturar valores/fingerprints dos agentes, versões publicadas/rascunhos/pausas, prompts, skills, fontes/vínculos, catálogo, roteadores/modelos/contexto/aceites, marcas, credenciais, calendários, canais e sessões. Diferenciar campos operacionais que mudam normalmente. Nenhum dado empresarial vai ao GitHub ou a outro cliente.
5. Aplicar o baseline da revisão com erros SQL explícitos e conferir alterações. Defaults oficiais ausentes podem nascer; valores já configurados não devem ser trocados. Não executar a cadeia histórica de migrations do zero. Interromper diante de diferença inesperada e investigar.
6. Usar o compose e os overrides próprios do destino, conservando TLS/CA, proxy, volumes e serviços externos. Subir somente app/worker/scheduler com os três digests; não usar tag móvel ou atualização comum que substitua o fork.
7. Conferir as imagens realmente executadas, RepoDigests, labels da mesma revisão, saúde HTTPS, banco/Redis/WhatsApp e montagens. Ler novamente os fingerprints e justificar cada diferença. Conferir marca/login, convite/e-mail inicial, modelo automático, janela salva e consentimento, sem publicar/despausar agentes ou enviar a clientes.
8. Validar primeiro o piloto escolhido e depois a segunda instalação com o mesmo manifesto. Só registrar paridade operacional após as duas medições. A bancada fresca já comprovou os fluxos sintéticos; implantação não autoriza automaticamente teste real.

## Reversão

Salvar previamente os três pins de cada destino. Reverter as imagens pelo compose próprio, preservar os mounts e reler saúde/labels. Não restaurar banco automaticamente: isso apagaria dados posteriores. Schema aditivo pode permanecer compatível com as imagens anteriores; qualquer correção de schema deve ser analisada e aplicada para frente. O índice 0617 não altera dados, RLS ou permissões.

## Configuração externa de e-mails

O pacote de código não altera SMTP nem os 13 modelos/assuntos Cloud. Cada instalação gera as prévias com sua própria marca, mantendo seu domínio remetente. Exportação/aplicação Auth usa projeto e credencial próprios, backup/releitura e autorização correspondente. Hook dinâmico é opcional e permanece desativado; nunca transportar segredo, templates empresariais ou configurações entre instalações. Não apresentar e-mails de notificação como habilitados: esse canal ainda não tem a entrega implementada na base auditada.

## Retirada futura de patches

PRs gerais: #2629 (revisores), #1971 (contexto JEV) e #2649 (convites/e-mails). Conferir aceitação, release que os distribui e equivalência de comportamento. Contribuições parcialmente aceitas devem ser discutidas com o proprietário. Configurações empresariais permanecem no banco e fora das PRs.
