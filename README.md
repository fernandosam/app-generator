# app-generator

**Gerador de interfaces orientado a contexto e independente de harnesses**, usando TanStack Start, Vite+, React, TypeScript, Tailwind CSS v4 e componentes oficiais coss UI. Qualquer harness externo (Pi, Codex, Claude Code ou outro) pode ler `AGENTS.md` e modificar o projeto usando suas próprias ferramentas — **não há executor de IA, API de modelos ou SDK de agentes integrado**.

## Executar localmente

Requisitos: Node.js 22.18+ (ou 24.11+ / 26+), npm, acesso ao registro coss UI e Chromium do Playwright para testes E2E.

```bash
npm ci
npx playwright install chromium
npm run dev
```

Acesse http://localhost:3000. A toolchain é exclusivamente **Vite+ 1.4.0** (`vite-plus` local): `npm run dev` usa `vp dev`, `npm test` usa `vp test` e `npm run build` usa `vp build`. Não é necessário instalar o CLI global nem manter um executor alternativo. Os componentes **oficiais coss UI** usados no projeto (Button, Card, Input e Spinner) estão versionados em `src/components/ui/` e as dependências são travadas em `package-lock.json`. Atualizações de componentes e lockfile são feitas em PR próprio, com revisão do diff; não há download dinâmico da UI no CI.

## Estilização e componentes

Priorize **componentes oficiais coss UI e suas variantes**, depois **utilitários Tailwind CSS v4**, reutilizando os **tokens semânticos globais**. Não reimplemente a aparência ou os estados de controles já disponíveis. CSS específico exige uma necessidade concreta não atendida, justificativa no PR e escopo mínimo. Consulte [Política de estilos](docs/ui-styling-policy.md) e as regras do `AGENTS.md`.

## Geração de telas por um harness externo

Abra o projeto em seu harness preferido e solicite, por exemplo:

> Siga AGENTS.md e crie uma tela de busca com filtros e resultados, usando TanStack Start e coss UI. Execute as verificações determinísticas e registre as evidências.

O harness gerencia modelos, credenciais, contexto, alteração de código e abertura do PR. O app-generator disponibiliza instruções, contratos, bibliotecas e verificações, sem instalar ou executar outro agente.

## Telas para avaliação agent-first

O harness pode desenvolver layouts livremente — não há enum fechado para composições nem catálogo semântico de componentes. As quatro telas demonstrativas verificam tarefas diferentes:

| Tela | Caminho | Interações locais |
|---|---|---|
| Cadastro | `/` | Validação e confirmação |
| Login | `/login` | Validação de credenciais fictícias e confirmação sem autenticação |
| Busca | `/search` | Filtro por texto/categoria e estado vazio |
| Dashboard | `/dashboard` | Alternância de período, histórico e atualização simulada |

Estas são **demonstrações**, sem backend, persistência ou autenticação real. O intuito é aferir resultados de composições livres por testes e evidências, não forçar um template.

## Auditoria e validação

```bash
npm run check:static
npm run check:harness
npm run test:unit
npm test
npm run build
npm run typecheck
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

| Workflow | Gatilho | Finalidade |
|---|---|---|
| [CI](.github/workflows/ci.yml) | push/PR main; manual | contratos, independência de harness, testes, build e typecheck |
| [Layout Audit](.github/workflows/layout-audit.yml) | push/PR main; manual | cenários, screenshots, relatórios e artifacts por 14 dias |

Os workflows não usam secrets de IA, não iniciam modelos nem criam PRs automaticamente. O harness externo pode criar o PR, que passa pelas mesmas verificações de qualquer contribuição.

## Estado e limites

- Starter funcional em código; sem banco, backend real de autenticação ou integrações reais de dados.
- Auditoria perceptiva de imagens e avaliação de tarefas dependem de inspeção real externa; a ferramenta `layout:verify-visual` apenas valida o vínculo dos arquivos.
- Os resultados de navegador e build devem ser confirmados por execuções reais no ambiente local ou GitHub Actions; não declarar resultados sem evidências. Revisão perceptiva das capturas continua externa.
- Para regras operacionais consulte [AGENTS.md](AGENTS.md); comandos resumidos em [docs/layout-workflow.md](docs/layout-workflow.md), diagnósticos em [docs/workflow-diagnostics.md](docs/workflow-diagnostics.md).

Referências: [TanStack Start](https://tanstack.com/start/latest/docs/framework/react/build-from-scratch) · [coss UI](https://coss.com/ui/docs/get-started) · [Playwright](https://playwright.dev/docs/test-intro).

<!-- workflows-reutilizaveis-2026 -->
## Comandos reutilizáveis para recriar funcionalidades

Execute o Pi na raiz do projeto (após confiar nos recursos do projeto e usar `/reload` se a sessão já estiver aberta):

```text
/analisar "Gestão de usuários" "../sistema-legado"
/implementar "Gestão de usuários" "/usuarios,/usuarios/novo"
```

A primeira etapa consulta a origem em modo **somente leitura**, sem implementar; registra um rascunho em `docs/analises/<slug>.md`. A segunda só avança após **aprovação explícita**, verificação com `npm run analysis:check -- <slug>` e criação de **todas as issues antes de alterar código**. O app-generator não depende do Pi em runtime. Veja [docs/workflow-funcionalidades.md](docs/workflow-funcionalidades.md).
