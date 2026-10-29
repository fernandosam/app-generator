# Pipeline contextual de composição

O procedimento operacional para Planner, Generator, Evaluator, Refiner, revisão visual por evidências e Delivery está **centralizado em [AGENTS.md](../AGENTS.md)**. Este documento é apenas o índice técnico dos comandos; não define regras paralelas para agentes.

## Operações determinísticas

A aplicação usa **Vite+** exclusivamente: `npm run dev` (`vp dev`), `npm test` (`vp test`) e `npm run build` (`vp build`). A configuração de testes é compartilhada com o build.

- `npm run check:static`: valida contratos de tela e estrutura do projeto.
- `npm run check:harness`: impede reintrodução de SDKs, chaves e executores de IA no repositório.
- `npm run test:unit`: verifica agregação, comparação e contratos de evidência.
- `npm test`, `npm run build`, `npm run typecheck`: verificações da aplicação.
- `npm run layout:audit`: Playwright em 390, 768 e 1440 px; cria relatório, métricas e screenshots.
- `npm run layout:verify-visual`: valida o arquivo de inspeção produzido **fora** do projeto pelo harness escolhido. Não inspeciona imagens e não aprova UX.
- `npm run layout:compare -- a.json b.json`: compara mecanicamente duas alternativas completas; não substitui revisão visual.

Os arquivos de `artifacts/` são gerados localmente, ignorados no Git e publicados como evidências pelos workflows de auditoria. Toda geração, inspeção multimodal e correção automática pertencem ao **harness externo**, não ao app-generator.

O CI verifica código e contratos sem qualquer credencial de provedor de IA. Componentes coss UI oficiais (Button, Card, Input e Spinner) estão versionados em `src/components/ui/`. Instale dependências com `npm ci`; atualização do upstream e do lockfile exige revisão explícita.
