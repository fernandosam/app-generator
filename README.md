# app-generator

**Gerador de interfaces orientado ao contexto** — aplicação independente em **TanStack Start**, React, TypeScript, Tailwind CSS v4 e **coss UI**, com planejamento de tarefas, execução assistida por agente, auditoria contextual e evidências visuais. **Não usa Next.js nem o UI Contract Studio.**

> Estado: starter funcional no nível do código, com integração ao registro oficial de componentes e ao Codex CLI. **A instalação completa, a renderização no browser e os workflows ainda precisam ser executados em um ambiente com acesso ao npm e ao coss registry.** Não é um editor visual nem um serviço de modelos hospedado.

## Rodar localmente

Requisitos: Node.js 22+, npm, rede para instalação do registro coss. Chromium do Playwright para testes E2E. Codex CLI autenticado para geração/inspeção/correção opcional.

```bash
npm install
npm run ui:install
npx playwright install chromium
npm run dev
```

Acesse <http://localhost:3000>. Os componentes coss são instalados em `src/components/ui/` **a partir do registro oficial**, por `npm run ui:install`. Não são implementações próprias nem estão incluídos neste starter. Para maior reprodutibilidade, após a primeira instalação validada, **versione esses arquivos e gere/commite o `package-lock.json`**; até isso ocorrer, o CI usa `npm install` e instala os componentes no runner.

## Fluxo de geração e avaliação

```bash
npm run screen:generate -- 'Crie uma tela de busca com filtros e resultados'
npm run layout:audit
npm run layout:review   # precisa de Codex CLI e screenshots reais
npm run layout:refine   # no máximo duas revisões, via Codex CLI
```

O processo está em `AGENTS.md` e `docs/layout-workflow.md`:

1. **Planner:** registra a tarefa, o público, critérios de sucesso, estados e variações de conteúdo em `src/layout-intents/<tela>.json`; referências em `src/layout-references/registry.json` são *exemplos*, não templates obrigatórios.
2. **Generator:** cria rotas TanStack Start usando componentes/particles coss; pode propor duas composições distintas **somente** se a ambiguidade justificar o custo.
3. **Evaluator:** testa cenários reais e artificiais de estresse em mobile (390px), tablet (768px) e desktop (1440px), produz métricas DOM e screenshots. Não declara estética aprovada apenas por nota.
4. **Refinement:** o agente analisa relatórios e imagens, modifica o código e reexecuta a avaliação em até duas revisões. Se a revisão visual for obrigatória e as imagens não forem efetivamente inspecionadas, a execução falha como inconclusiva.

### Cenários e resultados

`src/layout-intents/screens.json` define as telas, categorias (`form`, `login`, `search`, `dashboard`, `content`), estados e ações reproduzíveis (`fill`, `click`, `repeatText`). O cadastro demonstrativo inclui quatro cenários: **default**, **invalid**, **success** e **long-content**. Não há persistência de contas.

```bash
npm run check:static  # sem dependências externas
npm run test:unit     # Node.js puro: score, comparação e cobertura da auditoria
npm test              # Vitest: plano de layout
npm run build         # gera routeTree.gen.ts
npm run typecheck
npm run layout:audit   # Playwright, cenários, capturas e relatório
```

Artefatos são criados em `artifacts/layout-report.{json,md}`, `artifacts/metrics/`, `artifacts/screenshots/`, e são ignorados no Git. O relatório valida **cobertura completa e identidade da execução**, evitando aprovar métricas obsoletas. Falhas críticas de responsividade e problemas de rótulos de controles falham testes; métricas de hierarquia, agrupamento e densidade orientam melhorias. Os pesos podem variar por tipo de tela.

### Comparar alternativas (opcional)

```bash
npm run layout:compare -- alternativas/A-report.json alternativas/B-report.json
```

Compara dois relatórios completos: menos falhas críticas, depois graves, depois maior pontuação. **Nunca** dispensa a inspeção visual independente; empate é inconclusivo. Para produzir relatórios distintos, audite cada alternativa em ambiente/código separado e copie seus relatórios antes de comparar.

## GitHub Actions

| Workflow | Gatilho | O que faz |
|---|---|---|
| [CI](.github/workflows/ci.yml) | push/PR main; manual | instala dependências + coss, testa, faz build e typecheck |
| [Layout audit](.github/workflows/layout-audit.yml) | push/PR main; manual | Chromium, cenários, screenshots, relatório e artifacts por 14 dias |
| [Generate screen](.github/workflows/generate-screen.yml) | **manual** | usa Codex CLI e cria **PR**, nunca faz push direto à main |
| [Refine layout](.github/workflows/refine-layout.yml) | **manual** | revisa visualmente, corrige em até 2 ciclos e abre **PR** |

Para geração e correção com IA, configure o secret **`OPENAI_API_KEY`** em **Settings → Secrets and variables → Actions**. Permita **Actions criar pull requests** nas configurações do repositório. Esses workflows têm permissão de escrita somente quando iniciados manualmente na `main`; os fluxos de validação usam permissão somente de leitura. A revisão visual só é declarada quando o agente registra que inspecionou as imagens. O GitHub Actions não substitui a aprovação de mudanças sensíveis de produto.

A escolha de `npm install` (em vez de `npm ci`) é **temporária** por ausência de um lockfile gerado/validado offline. Gerar e commitar lockfile e fontes coss instaladas é a próxima etapa obrigatória para builds reprodutíveis.

## Publicação no GitHub

Como o repositório ainda não foi criado, a forma direta, a partir da pasta raiz e com GitHub CLI autenticado, é:

```bash
gh auth login
gh repo create app-generator --public --source=. --remote=origin --push
```

O comando é para ser executado **após** inicializar/commitar o Git localmente caso ainda não esteja versionado. Consulte `docs/github-publish.md` para alternativas. **O projeto pode ser público, mas não publique segredos ou dados pessoais de aplicações geradas.**

## Limitações explícitas

- Sem banco, backend de autenticação ou integração real de dados neste exemplo.
- A auditoria usa sinais objetivos contextualizados; inspeção perceptiva continua dependente de agente visual capaz de abrir as capturas e testes de tarefa humana.
- A geração com IA requer Codex CLI e credenciais do operador (ou secret no workflow manual); CI padrão não chama nenhum modelo.
- Não foi possível instalar dependências neste ambiente (`registry.npmjs.org` inacessível), portanto nenhum resultado de browser, build ou Actions é apresentado como executado.

Referências: [TanStack Start](https://tanstack.com/start/latest/docs/framework/react/build-from-scratch) · [coss UI](https://coss.com/ui/docs/get-started) · [Playwright](https://playwright.dev/docs/test-intro).
