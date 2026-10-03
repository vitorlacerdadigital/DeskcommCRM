# Identidade dos e-mails

Inventário verificável: `rg -n 'sendEmail\(|sendMail\(|emails.send|resetPasswordForEmail|auth.resend|auth.signUp' app lib workers` (excluir testes para emissores ativos).

| Fluxo | Emissor | Contexto de marca |
| --- | --- | --- |
| Convite de equipe, reenvio e criação administrativa | `lib/auth/issue-invite.ts`, chamado por `lib/team/convites.ts` e criação de organização | Organização de destino, resolvida por `marcaDaSaida(organizationId)` |
| Convites do onboarding | `app/actions/onboarding/sendOnboardingInvites.ts` | Organização do contexto autenticado |
| Exportação LGPD | `workers/lgpd-export-worker.ts` → `lib/lgpd/email-delivery.ts` | Organização da solicitação; o PDF preserva o controlador e não recebe marca |
| Alarme de prazo LGPD | `lib/lgpd/sla-alarm.ts` | Organização da solicitação |
| Confirmação de cadastro | `app/actions/auth/signUp.ts`, incluindo `lib/auth/convite-no-gotrue.ts` | Supabase Auth: modelos globais da instalação |
| Recuperação de senha | `app/actions/auth/requestPasswordReset.ts` | Instalação: formulário público não identifica organização |
| Magic link, convite nativo Auth, troca de e-mail, reautenticação | Supabase Auth, conforme funcionalidades/configuração do projeto | Instalação; não confundir convite Auth com convite de equipe do CRM |
| Avisos de senha, e-mail, telefone, vínculo/desvínculo de identidade, inclusão/remoção de MFA | Supabase Auth, se habilitados no projeto | Instalação; exportar modelos NÃO habilita os avisos |
| Orçamento de IA | `lib/email/templates/ai-budget-alarm.tsx` | Modelo sem emissor ativo; recebe marca explícita. Aviso atual é na Central, não e-mail |

Convites/LGPD usam `lib/email/roteador.ts`: SMTP configurado tem prioridade, senão Resend. O endereço remetente é o domínio verificado da instalação, o **nome exibido** vem da marca resolvida. Não se troca domínio SMTP por organização sem verificar esse domínio. A resolução consulta apenas a organização recebida; campos ausentes herdam a instalação, nunca outra organização. Nome/logo/cor vêm de `organizations.settings.branding` → `platform_branding` → ambiente → padrão. Estrutura compartilhada: `lib/email/templates/estrutura.ts`, tabelas de apresentação, estilos inline, dimensões de logo e identidade textual quando imagens não carregam.

## Supabase Cloud e mudanças de marca

Fontes oficiais consultadas em 2026-10-01:
- https://supabase.com/docs/guides/auth/auth-email-templates
- https://supabase.com/docs/guides/auth/auth-hooks/send-email-hook

Cloud guarda HTML e assuntos na configuração Auth. A Management API permite GET/PATCH em `/v1/projects/{ref}/config/auth`. As variáveis `GOTRUE_MAILER_TEMPLATES_*` com URL são opção de GoTrue próprio, não prova de sincronização no Cloud.

O app serve `/email-templates/config` com os 13 modelos e assuntos, resolvendo a marca **do banco**, sem configuração SMTP nem segredos. Para exportar/aplicar, após implantar a revisão:

```sh
python3 scripts/email/sincronizar-auth.py \
  --app-url https://SEU_APP --project-ref SEU_REF \
  --diretorio /CAMINHO_PRIVADO/exportacao-nova
```

Inspecione os HTMLs. Para aplicar, use outro diretório novo e acrescente `--aplicar --token-file /CAMINHO_PRIVADO/token-management` (arquivo 0600 contendo apenas o token). O script verifica identidade do projeto e Site URL; salva `antes.json` dos campos afetados **antes** do PATCH; modifica somente assuntos/corpos; relê e compara todos os campos. SMTP, URLs e habilitação de notificações ficam preservados. Não imprime respostas Auth nem credenciais. Falha de releitura exige investigar e, se necessário, restaurar os campos de `antes.json` via mesma API/painel; não reenviar mensagens reais para testar.

**Não há agendamento automático nesta entrega.** Repita a aplicação após mudar a marca. Sem token Management API, exporte os HTMLs e aplique-os em Authentication → Email Templates após copiar os valores anteriores. Token OAuth do MCP e service-role **não** substituem token Management API.

Um token com permissões específicas precisa de **Project → Project Settings: Read-write** e **Application services → Auth Config: Read-write**, restrito ao projeto de destino. Analytics Config é outra capacidade. A API de atualização Auth exige ambas as permissões; leitura bem-sucedida sozinha não comprova permissão de escrita. Referência: https://supabase.com/docs/reference/api/v1-update-auth-service-config.

### Limite de contexto no Auth

O modelo global Cloud não distingue organizações. Em especial, a confirmação de uma conta criada por convite ainda usa a marca da instalação no modo SMTP global. Para identidade de organização também nessa confirmação, o mecanismo oficial é **Send Email Hook**, que substitui o envio SMTP do Auth. A implementação precisa validar assinatura, resolver a organização a partir de convite assinado e do destinatário, consultar marca no envio e tratar todos os tipos (inclusive os dois destinatários da troca segura de e-mail). Não escolher organização por primeiro vínculo, domínio de e-mail ou `user_metadata.organization_id` não verificado. A ativação exige URL/segredo de hook e teste real controlado; não está implantada nem comprovada aqui.

## Aceite, testes e continuidade

Links da página de convite → cadastro ou login → confirmação/aceite → organização indicada pelo token assinado. O cadastro não deve provisionar organização quando existe convite; guardas continuam em `signUp`, `decidirConviteDoSignup` e `aplicarConvite`. Convite inválido não concede vínculo. `member.invited`/`member.accepted` alimentam auditoria; pendências/reenvio ficam em Equipe. Falha de SMTP deixa link e motivo acessíveis. Marca se configura em Marca da organização e Marca da instalação. O registro desta mudança é núcleo (identidade/acesso comuns a todos), sem nova tabela ou worker. Continuidade IA↔humano não é aplicável a autenticação.

Medir: testes de caminho de acesso, `branding-saida`, templates e transporte; `invite-lifecycle` em Supabase local com contas sintéticas; confirmação/recuperação em caixa capturadora. Conferir o destino e contagem de organizações antes/depois. Não abrir links reais de terceiros. Screenshot em Chromium prova aparência web, não renderização real no Outlook/Gmail/Apple Mail: documentar esse limite.
