# Pipeline contextual de composição

O procedimento operacional para Planner, Generator, Evaluator, Refiner, revisão visual por evidências e Delivery está **centralizado em [AGENTS.md](../AGENTS.md)**. Este documento é apenas o índice técnico dos comandos; não define regras paralelas para agentes.

## Operações determinísticas

A aplicação usa **Vite+** exclusivamente: `npm run dev` (`vp dev`), `npm test` (`vp test`), `npm run build` (`vp build`) e `vp check` (formatação, lint e tipos). A configuração de testes é compartilhada com o build.

- `npm run check`: executa build (incluindo geração das rotas) e `vp check` para formatação, lint e tipos.
- `npm run verify`: inclui contratos, independência de harness, `check` e uma única suíte de testes Vite+ (`src/` e `scripts/`).
- `npm run typecheck`: diagnóstico isolado de tipos, após executar `dev` ou `build` para gerar a árvore de rotas.
- `npm run layout:audit`: Playwright em 390, 768 e 1440 px; cria relatório, métricas e screenshots.
- `npm run layout:verify-visual`: valida o arquivo de inspeção produzido **fora** do projeto pelo harness escolhido. Não inspeciona imagens e não aprova UX.
- `npm run layout:compare -- a.json b.json`: compara mecanicamente duas alternativas completas; não substitui revisão visual.

Os arquivos de `artifacts/` são gerados localmente, ignorados no Git e publicados como evidências pelos workflows de auditoria. Toda geração, inspeção multimodal e correção automática pertencem ao **harness externo**, não ao app-generator.

O CI verifica código e contratos sem credenciais de IA. Todas as primitivas oficiais coss UI estão versionadas em `src/components/ui/`, com auxiliares em `src/hooks/` e `src/lib/`. Instale dependências com `npm ci`. A skill oficial é opcional (`npm run skills:install`); partículas são incorporadas individualmente somente quando utilizadas (`npm run ui:install -- @coss/p-button-1`). Revisar diff, imports, lockfile, SSR e testes. Essa instalação não pertence ao CI.
