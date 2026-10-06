# Atualizar a Acquarela com a mesma versão da Convert

## Fonte única desta implantação

Base oficial: **v1.75.0**, tag do repositório `melgarafael/DeskcommCRM`, commit
`0727fca64c69e38f2eaf82ff2c41e5559f37819e`.

Código compartilhado: [commit 6e86e07f3e1f1dff410cfcfeccf70c69e582352b](https://github.com/vitorlacerdadigital/DeskcommCRM/commit/6e86e07f3e1f1dff410cfcfeccf70c69e582352b),
branch `custom/shared-v175-gemini35` do fork `vitorlacerdadigital/DeskcommCRM`.
Publicação das imagens: [execução do GitHub Actions](https://github.com/vitorlacerdadigital/DeskcommCRM/actions/runs/37548233172).

Este documento é um recibo separado do código implantado. **Não implante o HEAD
da branch deste documento**: use o commit completo acima, que também aparece
nos labels das três imagens. O arquivo [shared-v1.75.0-release.json](shared-v1.75.0-release.json)
é o manifesto dos artefatos. Não substitua as referências por `latest`, `stable`
ou outra tag móvel. Este recibo descreve a versão conciliada; não autoriza
escolher independentemente outra release na Acquarela.

## Imagens exatas

| Serviço | Referência imutável |
| --- | --- |
| app | `ghcr.io/vitorlacerdadigital/deskcommcrm-branding@sha256:c9030b4ab4647900c24ea2ec2ec7fefa2f0877563194dbe04de9753658524224` |
| worker | `ghcr.io/vitorlacerdadigital/deskcomm-worker-branding@sha256:d83cc157e0626d94454c9bbba7392fd2fcdc54582c9c5823284ab8239ec47199` |
| scheduler | `ghcr.io/vitorlacerdadigital/deskcomm-scheduler-branding@sha256:e1f13bfa7d7954cf77c98df4f5890f1f6ef12915ffb37d2e333a64e5df407157` |

Todas devem declarar `org.opencontainers.image.revision=6e86e07f3e1f1dff410cfcfeccf70c69e582352b`.
Conserve WAHA, proxy e serviços adicionais da própria Acquarela; não transfira
volumes, sessões ou arquivos de ambiente da Convert.

## Customizações que devem continuar iguais

Estas customizações do fork **não pertencem à tag oficial v1.75.0**:

- Gemini 3.5 Flash-Lite no catálogo Google e na contabilização de custos,
  incluindo entrada, saída e leitura de cache. Preço Standard por milhão de
  tokens: USD 0,30 de entrada, USD 2,50 de saída e USD 0,03 de leitura em cache.
  Fontes: [modelo Google](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash-lite)
  e [preços Google](https://ai.google.dev/gemini-api/docs/pricing).
  O catálogo não troca o modelo escolhido nem o padrão de provedor dos agentes.
- Login com logo ampliado; nome, ícone e identidade resolvidos pela marca
  própria da instalação em tempo de execução.
- Convites com cadastro/entrada preservando o token e preenchendo o e-mail;
  estrutura visual e remetentes dos e-mails conforme a marca da instalação.
- Contexto recente do JEV: padrão **8 mensagens anteriores**, limite ajustável
  pelo painel entre 0 e **16**, com aceite separado, revogável e auditado.
  Valores explicitamente salvos são preservados. Aceite antigo V1 continua
  limitado a quatro até a pessoa aceitar V2; não aceite por ela.

Comparação, reserva sob demanda e resultados de roteamento já são oficiais.
O PR #2061 foi mesclado com a migration
`20261005124502_0547_jev_roteador_resultados.sql`. Não restaure a antiga migration
local duplicada nem a renumere. A reserva sob demanda conserva a exigência
oficial de uma IA convencional configurada.

Use a solução oficial do catálogo/acervo para evidências comerciais. **Não
restaure o cadastro paralelo de políticas comerciais** que exigia alimentar
uma nova base. Isso não autoriza apagar registros históricos existentes.

O catálogo Gemini usa
`20261006195800_0576_gemini_35_flash_lite_no_catalogo.sql`, já aplicado na Convert.
Na conferência de 06/10/2026 contra a main atual e os 48 PRs abertos, seu número
e timestamp não colidiam. O PR #2453 seguia aberto. Não renomeie migrations já
aplicadas. Se a Acquarela tem outra migration local com esse número, pare para
comparar conteúdo/histórico; não escolha um lado automaticamente.

## Procedimento para a tarefa com acesso à Acquarela

1. Leia `AGENTS.md`, `CLAUDE.md` e os guias de instalação, contribuição e doutrina
   da instalação. Confirme a identidade da VPS, do domínio e do projeto Supabase
   da **Acquarela**. Use somente seu acesso autorizado e suas próprias credenciais.
2. Confira todos os worktrees, alterações locais, merges/cherry-picks pendentes,
   processos de atualização e travas em uso. Preserve trabalho de outras tarefas.
   Faça inventário da versão atual e dos três digests para recuperação.
3. Confira um backup recente e íntegro do banco, das sessões WhatsApp, dos anexos
   locais quando existentes, e uma cópia privada dos arquivos de ambiente/proxy.
   Não publique esses arquivos. Backup da Convert não substitui o da Acquarela.
4. Registre antes os dados e configurações: agentes e versões, estado de publicação,
   roteadores, configurações da organização, marca, credenciais, calendários,
   canais/WhatsApp, provedores de autenticação e estado dos hooks/modelos de e-mail.
   Compare por contagem e fingerprints sem expor conteúdo ou segredos.
5. Baixe o código do fork e prepare um worktree limpo no commit **6e86e07f3e1f1dff410cfcfeccf70c69e582352b**.
   Compare a cópia atual da Acquarela com essa revisão. As customizações
   compartilhadas acima devem vir dessa revisão; particularidades da empresa
   continuam no banco/configuração local. Qualquer código exclusivo adicional
   ainda não conciliado precisa ser avaliado antes da troca, sem descartá-lo.
6. Baixe as três imagens por digest e confira o label de revisão de cada uma.
   Não construa na VPS e não publique imagens diferentes. Não execute um
   `update.sh` que faça checkout da tag oficial e substitua a integração do fork.
7. Em manutenção, pause os serviços que escrevem no banco e aplique o baseline
   dessa revisão com os helpers oficiais do kit, inclusive tratamento de
   deadlock/reaplicação e conferência das políticas RLS das tabelas existentes.
   O baseline conserva os apêndices oficiais e acrescenta o catálogo Gemini.
   Confira o resultado real do banco; execução encerrada sozinha não prova sucesso.
8. Preserve os demais valores do ambiente e selecione exatamente os digests
   acima para `APP_IMAGE`, `WORKER_IMAGE` e `SCHEDULER_IMAGE`. Faça isso pelo helper
   do kit, sem imprimir segredos. Preserve a composição do proxy da Acquarela:
   se houver Traefik, todas as recriações levam o compose principal **e** seu
   overlay. Não copie o Caddyfile ou a marca da Convert.
9. Recrie app, worker e scheduler, retire a manutenção e confira saúde dos três,
   acesso pelo domínio e label de revisão. Compare os dados/configurações com
   o estado anterior, considerando somente mudanças oficiais de schema previstas.
   **Não publique, não ative nem troque o modelo de agentes; não altere credenciais,
   calendários, sessões, consentimentos nem o estado do hook de e-mail.**
10. Valide login, marca, convite/cadastro, recuperação de senha, e-mails, catálogo
    Gemini e JEV (padrão 8, painel até 16) em ambiente isolado com dados sintéticos.
    A prova do JEV deve concordar entre tela e ferramenta. Na produção, faça
    apenas verificações sem efeitos externos; não envie testes para clientes reais.
11. Se a atualização falhar, retorne às imagens/código anteriores preservados;
    mantenha a instalação em manutenção se houver incoerência no banco/RLS.
    Não restaure o banco automaticamente sobre novos dados nem descarte arquivos.
12. Registre commit, digests e validações no recibo da Acquarela. As duas instalações
    estarão alinhadas somente quando os três digests e o commit coincidirem com
    este manifesto. Marcas e configurações comerciais continuam separadas.

## Modelos de e-mail do Supabase Auth

O código e as imagens iguais não copiam a configuração externa do Auth. Quando
os modelos são estáticos, confira também os 13 modelos e seus assuntos. A fonte
compartilhada é a estrutura servida por `/email-templates/config` da **própria
Acquarela**, que resolve a marca dessa instalação. Nunca use a resposta do app
Convert como conteúdo dos e-mails da Acquarela.

O script `scripts/email/sincronizar-auth.py` exige `--app-url`, `--project-ref` e
`--diretorio` explícitos. Sem `--aplicar`, só exporta para revisão. Se for
necessário conciliar os modelos, use a prévia com a marca Acquarela e o acesso
Management API da Acquarela em `--token-file` privado 0600. O script confere
projeto e domínio, faz backup dos campos alterados e relê o resultado; ele não
troca SMTP, credenciais, provedores nem o estado dos hooks. Preserve eventuais
textos particulares aprovados da empresa. Não habilite hook de e-mail para
padronizar as instalações e não envie provas para destinatários reais.

## Validação e estado da Convert

Convert atualizada e validada em **2026-10-06T23:56:13.639803+00:00**,
com os três serviços saudáveis, no commit e nos digests deste manifesto.
A Acquarela não foi alterada por esta tarefa; ainda precisa aplicar este recibo.

- Typecheck passou; lint sem erros (503 avisos existentes), canais, RBAC e testes
  do kit self-host passaram.
- Banco limpo e reaplicação passaram. Catálogo: 8 testes; JEV/RLS/hardening:
  106 testes. Atualização com dados manteve 10 linhas e 8 identidades de objetos.
- Suíte geral: 1.929 arquivos e 20.155 casos; 20.153 passaram, um é falha esperada,
  e um atingiu o timeout sob carga. O arquivo do timeout passou isoladamente
  com os seis casos. A correção adicional da revisão final só ajustou o texto
  esperado pelo teste Playwright; o código funcional medido na suíte não mudou.
- Tela, usando as imagens finais: **17/17 casos passaram**, incluindo convites,
  recuperação de senha e JEV (contexto, comparação, decisão e resultados).
  O seletor Google apresentou Gemini 3.5 Flash-Lite sem salvar/publicar agente.
- Produção: login e identidade da Convert conferidos em desktop/mobile; caminhos
  do convite mantêm o e-mail e o token. Nenhuma conta foi criada e nenhum e-mail
  ou WhatsApp foi enviado por essa prova de produção.
- Agentes/versões, credenciais, calendários, canais, roteadores, marcas e
  autenticação preservados; nenhuma redução nas contagens verificadas. O baseline
  acrescentou somente `canonical_conversation_tags` e `proposals` onde ausentes,
  sem alterar valores existentes. Isso deve ser distinguido de uma perda de
  configuração ao comparar fingerprints na Acquarela.
- Nenhum agente real foi publicado, ativado ou teve seu modelo trocado.


Este documento e o manifesto contêm apenas informações de código/artefatos;
nenhum dado, configuração privada ou credencial deve ser copiado entre empresas.
