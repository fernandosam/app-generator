# app-generator

**Gerador de interfaces orientado a contexto e independente de harnesses**, usando TanStack Start, Vite+, React, TypeScript, Tailwind CSS v4 e componentes oficiais coss UI. Qualquer harness externo (Pi, Codex, Claude Code ou outro) pode ler `AGENTS.md` e modificar o projeto usando suas próprias ferramentas — **não há executor de IA, API de modelos ou SDK de agentes integrado**.

## Executar localmente

Requisitos: Node.js 22.18+ da linha 22, 24.11+ da linha 24 ou 26+, npm e Chromium do Playwright para testes E2E.

```bash
npm ci
npx playwright install chromium
npm run dev
```

Acesse http://localhost:3000. O Vite+ local executa desenvolvimento (`npm run dev`), build (`npm run build`) e testes (`npm test`). `npm run check` gera as rotas TanStack Start durante o build e executa `vp check` (formatação, lint e tipos); `npm run verify` acrescenta os contratos próprios e testes de regressão. O diagnóstico isolado `npm run typecheck` requer que as rotas já tenham sido geradas por `dev` ou `build`. **Todas as 55 primitivas oficiais** do bundle `@coss/ui` estão versionadas em `src/components/ui/`, incluindo auxiliares (por exemplo, `segmented-control`, hooks e utilitários). O `npm ci` usa apenas dependências travadas em `package-lock.json`; build e CI não acessam o registro coss.

### Partículas oficiais: instalar somente quando utilizadas

```bash
npm run skills:install                 # Opcional: skills coss UI e layout para agentes
npm run ui:install -- @coss/p-button-1 # Instala a partícula selecionada
npm run ui:install -- @coss/p-button-1 --overwrite # Atualização explícita
npm run ui:install -- --help
```

O instalador usa o **CLI oficial shadcn 4.1.0**, sem sincronizador nem descoberta personalizada. Sem nomes explícitos de partículas ele não altera arquivos. A skill oficial `cosscom/ui` já está disponível no script `skills:install` para orientar agentes.

Após instalar, revisar o diff, os imports, dependências, lockfile e compatibilidade TanStack Start/SSR; executar `npm run verify` e testes relevantes antes de versionar. O snapshot das primitivas foi obtido do [coss UI oficial](https://github.com/cosscom/ui) na revisão `890a79a5368b3cdebbdd860aa1908f2843fd7ddc` (licença MIT). A atualização das primitivas também deve ocorrer em PR específico.

### Cinco composições prioritárias prontas para reutilização

Além das primitivas oficiais, o projeto incorpora cinco composições derivadas do coss UI: formulário validado, diálogo de edição, estado vazio, tabela paginada/ordenável e notificações. Elas estão em `src/components/particles/`, recebem dados reais por props e não instalam os exemplos fictícios do registry. Consulte [Composições coss prioritárias](docs/coss-particles.md) para contratos e origem.

## Estilização e componentes

Priorize **componentes oficiais coss UI e suas variantes**, depois **utilitários Tailwind CSS v4**, reutilizando os **tokens semânticos globais**. Não reimplemente a aparência ou os estados de controles já disponíveis. CSS específico exige uma necessidade concreta não atendida, justificativa no PR e escopo mínimo. Consulte [Política de estilos](docs/ui-styling-policy.md) e as regras do `AGENTS.md`.

## Geração de telas por um harness externo

Abra o projeto em seu harness preferido e solicite, por exemplo:

> Siga AGENTS.md e crie uma tela de busca com filtros e resultados, usando TanStack Start e coss UI. Execute as verificações determinísticas e registre as evidências.

O harness gerencia modelos, credenciais, contexto, alteração de código e abertura do PR. O app-generator disponibiliza instruções, contratos, bibliotecas e verificações, sem instalar ou executar outro agente.

## Telas para avaliação agent-first

O harness pode desenvolver layouts livremente — não há enum fechado para composições nem catálogo semântico de componentes. As quatro telas demonstrativas verificam tarefas diferentes:

| Tela      | Caminho      | Interações locais                                                 |
| --------- | ------------ | ----------------------------------------------------------------- |
| Cadastro  | `/`          | Validação e confirmação                                           |
| Login     | `/login`     | Validação de credenciais fictícias e confirmação sem autenticação |
| Busca     | `/search`    | Filtro por texto/categoria e estado vazio                         |
| Dashboard | `/dashboard` | Alternância de período, histórico e atualização simulada          |

Estas são **demonstrações**, sem backend, persistência ou autenticação real. O intuito é aferir resultados de composições livres por testes e evidências, não forçar um template.

## Auditoria e validação

```bash
npm run verify
npm run layout:audit
```

`src/layout-intents/screens.json` define as quatro telas, categorias e cenários reproduzíveis (incluindo estado de erro, sucesso e texto longo). O Playwright avalia 390px, 768px e 1440px, produzindo `artifacts/layout-report.json`, `artifacts/layout-report.md`, métricas e PNGs. A nota é **mecânica** e não certifica qualidade visual.

Caso o harness externo tenha inspecionado de fato as imagens, ele pode registrar `artifacts/layout-visual-review.json` com `runId`, lista completa das capturas e SHA-256 por PNG e então executar:

```bash
npm run layout:verify-visual
```

O verificador confere integridade e rastreabilidade; a alegação de inspeção continua responsabilidade do avaliador externo. Consultar o contrato e os critérios no [AGENTS.md](AGENTS.md).

Para comparar alternativas independentes:

```bash
npm run layout:compare -- alternativas/A-report.json alternativas/B-report.json
```

## GitHub Actions

| Workflow                                           | Gatilho              | Finalidade                                                |
| -------------------------------------------------- | -------------------- | --------------------------------------------------------- |
| [CI](.github/workflows/ci.yml)                     | push/PR main; manual | contratos, testes, build e `vp check`                     |
| [Layout Audit](.github/workflows/layout-audit.yml) | push/PR main; manual | cenários, screenshots, relatórios e artifacts por 14 dias |

Os workflows não usam secrets de IA, não iniciam modelos nem criam PRs automaticamente. O harness externo pode criar o PR, que passa pelas mesmas verificações de qualquer contribuição.

## Estado e limites

- Starter funcional em código; sem banco, backend real de autenticação ou integrações reais de dados.
- Auditoria perceptiva de imagens e avaliação de tarefas dependem de inspeção real externa; a ferramenta `layout:verify-visual` apenas valida o vínculo dos arquivos.
- Os resultados de navegador e build devem ser confirmados por execuções reais no ambiente local ou GitHub Actions; não declarar resultados sem evidências. Revisão perceptiva das capturas continua externa.
- Para regras operacionais consulte [AGENTS.md](AGENTS.md) e [docs/layout-workflow.md](docs/layout-workflow.md).

Referências: [Vite+](https://viteplus.dev/guide/) · [TanStack Start](https://tanstack.com/start/latest/docs/framework/react/build-from-scratch) · [coss UI](https://coss.com/ui/docs/get-started) · [Playwright](https://playwright.dev/docs/test-intro).

<!-- workflows-reutilizaveis-2026 -->

## Comandos reutilizáveis para recriar funcionalidades

Execute o Pi na raiz do projeto (após confiar nos recursos do projeto e usar `/reload` se a sessão já estiver aberta):

```text
/analisar "Gestão de usuários" "../sistema-legado"
/implementar "Gestão de usuários" "/usuarios,/usuarios/novo"
```

A primeira etapa consulta a origem em modo **somente leitura**, sem implementar; registra um rascunho em `docs/analises/<slug>.md`. A segunda só avança após **aprovação explícita**, verificação com `npm run analysis:check -- <slug>` e criação de **todas as issues antes de alterar código**. O app-generator não depende do Pi em runtime. Veja [docs/workflow-funcionalidades.md](docs/workflow-funcionalidades.md).
