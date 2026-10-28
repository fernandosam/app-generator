# Pipeline contextual de composição

O app-generator é uma aplicação TanStack Start independente. A biblioteca de UI é **coss UI**, instalada pelo registro oficial. As skills de design orientam o agente, mas não são dependências da aplicação.

## 1. Planner: compreender antes de desenhar

Antes de gerar uma nova rota, registrar em `src/layout-intents/<id>.json`: objetivo/tarefa, público, critérios de sucesso, agrupamentos, ação principal, densidade, estados e variações de dados. O schema Zod em `src/lib/layout/intent.ts` contém os campos conhecidos, com expansões opcionais e não restritivas. Consultar `src/layout-references/registry.json` para exemplos existentes, sem copiá-los por obrigação.

## 2. Generator: composição orientada a tarefa

Usar rotas `src/routes/` do TanStack Start. Consultar a skill oficial coss, partículas e documentação, e aproveitar padrões de componentes existentes. Preferir markup semântico e componentes oficiais instalados em `src/components/ui/`. Marcar `data-layout-root`, `data-layout-heading`, `data-layout-group`, `data-layout-field`, `data-layout-primary-action` e `data-layout-content` quando pertinente. Não adicionar Next.js.

**Comparação de alternativas é exceção, não regra:** quando duas estratégias tenham implicações relevantes para a tarefa, gerar variantes em worktrees separados, executar a mesma auditoria em cada uma, salvar seus relatórios e comparar com `npm run layout:compare -- a.json b.json`. A comparação privilegia falhas críticas, depois graves, e por último nota. O resultado é uma preferência mecânica, não uma avaliação estética definitiva.

## 3. Evaluator: contexto + estados + viewports

Cadastre a tela em `src/layout-intents/screens.json` com `kind` (`form`, `login`, `search`, `dashboard`, `content`), `purpose` e `scenarios`. Cada cenário tem `id`, `state`, `actions` opcionais e expectativas sobre visibilidade, validade, quantidade de grupos e ações principais. Ações disponíveis: `fill`, `click`, `repeatText`. Cenários devem representar estados reais de interação; `repeatText` estressa quebra de linhas e adaptação com conteúdo aumentado.

Playwright executa três projetos: 390px, 768px e 1440px. As medidas são heurísticas de DOM: títulos, ações, grupos, controles, associação de labels, overflow e elementos cortados. Pesos são configurados por categoria de tela. A auditoria limpa métricas e capturas anteriores, gera um `runId` novo e só aprova o relatório quando cada combinação tela/cenário/viewport tiver sido executada na mesma rodada. Capturas ficam em `artifacts/screenshots/`.

**A nota não é uma certificação de UX.** Inspeção visual e validação de tarefas continuam importantes. A revisão visual com Codex registra `inspected: false` se imagens não puderem ser abertas; nessa situação o modo de correção com `LAYOUT_REQUIRE_VISUAL=1` retorna status inconclusivo.

## 4. Refinement: corrigir com evidências

`npm run layout:refine` reexecuta a auditoria, solicita avaliação visual, identifica problemas reproduzíveis e usa Codex CLI para corrigir até duas rodadas. Depois da correção, execute testes de unidade, teste da aplicação, build e typecheck; o workflow manual de GitHub Actions já faz esses passos. Não introduzir nova aprovação para nota ou schema. O PR padrão mantém a revisão de código existente.

## 5. GitHub Actions

- `ci.yml` faz validações e build em push/PR.
- `layout-audit.yml` registra screenshots, relatórios e traces para análise (14 dias).
- `generate-screen.yml` e `refine-layout.yml` são manuais, com `OPENAI_API_KEY` como secret de Actions; criam PRs, sem auto-merge.

Os jobs de IA não rodam para pull requests de terceiros. Ausência do secret impede execução. Para garantir reprodutibilidade de dependências, versionar os componentes coss gerados e um lockfile após a primeira instalação validada.
