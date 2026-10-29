# Diagnóstico dos workflows

O repositório executa **dois workflows independentes de agentes**: CI e Layout Audit. Nenhum job de IA, credencial de modelo ou CLI de agente é necessário.

O projeto executa **Vite+** (`vite-plus`) com `vp dev`, `vp test` e `vp build`, sem CLI alternativo. A instalação reprodutível usa o lockfile atualizado.

O primeiro passo com falha de um job de PR indica o diagnóstico inicial. Reproduza o comando localmente; não transforme falhas reais em warnings.

```sh
npm ci --no-audit --no-fund
npm run check:static
npm run check:harness
npm run test:unit
npm test
npm run build
npm run typecheck
npx playwright install --with-deps chromium
npm run layout:audit
```

A instalação **do catálogo completo** coss não é pré-requisito para o build: os componentes utilizados já estão versionados e `npm ci` reproduz suas dependências. Execute `npm run ui:install -- --dry-run` e `npm run ui:install` somente durante uma atualização **manual e revisada**, nunca para corrigir jobs de CI ou gerar arquivos mutáveis no workflow. Falhas de acesso ao registry nesse comando devem permanecer explícitas; não substituir componentes oficiais silenciosamente. Procedimentos de geração, inspeção e refinamento por harness externo: [AGENTS.md](../AGENTS.md).
