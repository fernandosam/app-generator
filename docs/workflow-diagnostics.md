# Diagnóstico dos workflows

O repositório executa **dois workflows independentes de agentes**: CI e Layout Audit. Nenhum job de IA, credencial de modelo ou CLI de agente é necessário.

O projeto executa **Vite+** (`vite-plus`) com `vp dev`, `vp test` e `vp build`, sem CLI alternativo. A instalação reprodutível usa o lockfile atualizado.

O primeiro passo com falha de um job de PR indica o diagnóstico inicial. Reproduza o comando localmente; não transforme falhas reais em warnings.

```sh
npm ci --no-audit --no-fund
npm run ui:install
npm run check:static
npm run check:harness
npm run test:unit
npm test
npm run build
npm run typecheck
npx playwright install --with-deps chromium
npm run layout:audit
```

A instalação dos componentes coss a partir do registro oficial é pré-requisito do build deste starter. Falhar explicitamente se npm ou o registro estiverem indisponíveis; não substituir componentes oficiais silenciosamente. Procedimentos de geração, inspeção e refinamento por harness externo: [AGENTS.md](../AGENTS.md).
