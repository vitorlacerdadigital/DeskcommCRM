# Versão compartilhada entre Convert e Acquarela

Base oficial: `melgarafael/DeskcommCRM`, release **v1.75.0**, commit
`0727fca64c69e38f2eaf82ff2c41e5559f37819e`.
Integração reutilizável: `vitorlacerdadigital/DeskcommCRM`, branch
`custom/shared-v175-gemini35`.

## Contrato de implantação

As duas instalações devem usar **o mesmo commit e os mesmos digests** de app,
worker e scheduler, publicados pelo workflow do GitHub. Confira o label
`org.opencontainers.image.revision` de cada serviço. Anote os três digests no
registro da implantação e forneça-os à tarefa da outra VPS; não escolha `latest`
ou outra versão independentemente em cada instalação.

A imagem resolve a identidade em tempo de execução. Cada instalação conserva
sua marca, domínio, remetentes, configurações, Supabase, segredos, dados,
roteadores, agentes e sessões de WhatsApp. Não copie arquivos de ambiente,
configurações do banco ou credenciais entre as empresas.

## Customizações compartilhadas ainda fora da release oficial

Estas alterações pertencem à integração do fork; não fazem parte da tag oficial
v1.75.0. O PR #2453 do catálogo Gemini permanece aberto na conferência de
06/10/2026. A integração não publica nem ativa agentes.

- Gemini 3.5 Flash-Lite no catálogo Google, sem trocar o modelo de agentes
  existentes nem o padrão do provedor. Preços Standard: 30 centavos de dólar por
  milhão de tokens de entrada, 250 na saída e 3 na entrada em cache; contabilização
  pelo runtime e catálogo `ai_pricing` em acordo com `ai_models`.


- Login com identidade da instalação, logo ampliado, ícone e nome dinâmicos.
- Cadastro/convite com e-mail adequado e caminhos explícitos para criar conta ou entrar.
- Estrutura visual e remetente dos e-mails resolvidos pela marca, inclusive modelos
  de autenticação e suporte ao envio dinâmico. Preserve o estado atual do hook
  de e-mail de cada instalação; não ative um hook que estava desligado.
- Histórico do roteador do Jev com aceite separado, revogável e auditado:
  padrão de oito mensagens anteriores e ajuste no painel de zero a 16. Limites
  explicitamente salvos são preservados. V1 até quatro mensagens até novo aceite;
  V2 até 16, respeitando o limite do roteador.
## Recursos já incorporados oficialmente

- Comparação, reserva sob demanda e resultados do roteamento da release oficial;
  a reserva sob demanda exige a IA de sempre, conforme a regra oficial.

## Solução comercial

Use a solução oficial de evidências do catálogo e do acervo existentes. Não
restaure uma base paralela de políticas comerciais nem um cadastro adicional
que exija alimentar os mesmos dados em mais um lugar. Preserve os dados
existentes; desativar ou retirar código antigo não autoriza apagar registros.

## Banco e validação

O baseline conserva os apêndices oficiais da v1.75.0 e acrescenta o catálogo
Gemini da customização `20261006195800_0576_gemini_35_flash_lite_no_catalogo.sql`,
já aplicado na Convert. Os nomes oficiais são preservados, inclusive
`20261005124502_0547_jev_roteador_resultados.sql` (PR #2061 mesclado).
Não copie a migration local duplicada 0544 nem renumere migrations aplicadas.

Faça backup próprio, confirme o projeto Supabase da instalação, aplique o
baseline com os helpers oficiais em manutenção, confira as políticas de RLS e
preserve a composição de proxy local. Valide saúde dos três serviços, acesso,
convites, recuperação de senha, e-mails e roteamento em ambiente isolado com
dados sintéticos. Confira a marca na tela publicada e compare dados e
configurações antes/depois. Nunca envie testes para clientes reais.

## Ordem e recibo da atualização

Conforme a orientação de 06/10/2026, esta tarefa opera somente a VPS Convert.
A Acquarela recebe a mesma revisão validada por sua tarefa com acesso próprio.
Antes de cada implantação, confira backups e ausência de atualizações concorrentes;
registre versão oficial de base, commit completo, digests dos três serviços,
resultado dos testes e comparação dos dados/configurações da própria instalação.
Nenhum acesso, banco ou configuração de uma empresa substitui o da outra.
