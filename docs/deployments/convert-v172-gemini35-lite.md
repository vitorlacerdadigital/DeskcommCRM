# Convert: customização Gemini 3.5 Flash-Lite

Esta integração NÃO é uma release oficial do DeskcommCRM.

- Base oficial: v1.72.0.
- Base personalizada anterior: 1567c86b11d711d6aefa2c759dff0bc829a53e94.
- Correção importada seletivamente: PR upstream #2453, revisão 16faa22c2b44e3c064445f8da4fb99d9ec4ad495.
- Branch de integração: custom/convert-v172-gemini35-lite.
- Escopo: catálogo Google e tarifas do Gemini 3.5 Flash-Lite; contabilização de custo no worker.
- Migração: 20261006195800_0576_gemini_35_flash_lite_no_catalogo.sql, idempotente, também incluída no baseline.
- Não modifica o modelo de agentes existentes nem publica agentes.
- O app e o scheduler conservam suas imagens anteriores; apenas o worker recebe esta revisão.

Registro operacional, backups, digests e reversão: /root/.config/convert-crm/evidencias/gemini35-lite/ e CHECKPOINT.md da instalação.
Nas futuras atualizações, integrar esta correção sobre a release escolhida preservando as demais customizações. Só retirar este patch quando a release oficial contiver comportamento e tarifas equivalentes, com verificação.
Não usar update.sh sem conferir a preservação dos patches. A atualização v1.74.0 preparada anteriormente não inclui automaticamente esta correção e precisa ser reintegrada antes de implantação.
