# Versão compartilhada entre Convert e Acquarela

Base oficial: `melgarafael/DeskcommCRM`, release **v1.74.0**, commit
`a9b80c31a7d27df7384f58dfbf9c6c53287c498b`.
Integração reutilizável: `vitorlacerdadigital/DeskcommCRM`, branch
`codex/shared-v174-integration`.

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

## Customizações preservadas

- Login com identidade da instalação, logo ampliado, ícone e nome dinâmicos.
- Cadastro/convite com e-mail adequado e caminhos explícitos para criar conta ou entrar.
- Estrutura visual e remetente dos e-mails resolvidos pela marca, inclusive modelos
  de autenticação e suporte ao envio dinâmico. Preserve o estado atual do hook
  de e-mail de cada instalação; não ative um hook que estava desligado.
- Histórico do roteador do Jev com aceite separado, revogável e auditado:
  padrão de oito mensagens anteriores e ajuste no painel de zero a 16. Limites
  explicitamente salvos são preservados. V1 até quatro mensagens até novo aceite;
  V2 até 16, respeitando o limite do roteador.
- Comparação, reserva sob demanda e resultados do roteamento da release oficial;
  a reserva sob demanda exige a IA de sempre, conforme a regra oficial.

## Solução comercial

Use a solução oficial de evidências do catálogo e do acervo existentes. Não
restaure uma base paralela de políticas comerciais nem um cadastro adicional
que exija alimentar os mesmos dados em mais um lugar. Preserve os dados
existentes; desativar ou retirar código antigo não autoriza apagar registros.

## Banco e validação

O baseline e os nomes de migrations são os oficiais da v1.74.0, inclusive
`20261005124502_0547_jev_roteador_resultados.sql` (PR #2061 mesclado).
Não copie a migration local duplicada 0544 nem renumere migrations aplicadas.

Faça backup próprio, confirme o projeto Supabase da instalação, aplique o
baseline com os helpers oficiais em manutenção, confira as políticas de RLS e
preserve a composição de proxy local. Valide saúde dos três serviços, acesso,
convites, recuperação de senha, e-mails e roteamento em ambiente isolado com
dados sintéticos. Confira a marca na tela publicada e compare dados e
configurações antes/depois. Nunca envie testes para clientes reais.
