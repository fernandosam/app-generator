# Diagnóstico dos workflows

O repositório executa **dois workflows independentes de agentes**: CI e Layout Audit. Nenhum job de IA, credencial de modelo ou CLI de agente é necessário.

O projeto executa **Vite+** (`vite-plus`) com `vp dev`, `vp test`, `vp build` e `vp check`, sem CLI alternativo. O `vp check` valida formatação (Oxfmt), lint (Oxlint) e tipos (via tsgolint). A instalação reprodutível usa o lockfile atualizado.

O primeiro passo com falha de um job de PR indica o diagnóstico inicial. Reproduza o comando localmente; não transforme falhas reais em warnings.

```sh
npm ci --no-audit --no-fund
npm run check
npx playwright install --with-deps chromium
npm run layout:audit
```

As primitivas coss são versionadas no Git e `npm ci` reproduz suas dependências. O registry só deve ser acessado quando for necessário **adicionar uma partícula específica** com `npm run ui:install -- @coss/p-button-1`; o comando sem argumentos falha por segurança. Não executar instalação de UI no CI nem substituir componentes silenciosamente. Procedimentos de geração, inspeção e refinamento por harness externo: [AGENTS.md](../AGENTS.md).
