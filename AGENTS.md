# Instruções para agentes — App Generator

## Contexto
Projeto **novo e independente**, com TanStack Start (React + SSR + Vite), TypeScript, Tailwind CSS v4 e componentes oficiais coss UI. **Não adicionar Next.js** (`next/link`, `next/font`, `app/`, `page.tsx`, etc.). Usar rotas file-based `src/routes/` e `<Link>` do `@tanstack/react-router` para navegação interna.

## Sequência obrigatória de composição
1. **Compreender intenção:** tarefa real, público, critérios de sucesso, conteúdo, estados de interação, variações de dados, grupos relacionados, hierarquia, ação principal e responsividade. Se houver uma ambiguidade que mude a experiência (ex.: confirmação antes de salvar), esclarecer com usuário ou adotar padrão conservador documentando a hipótese.
2. **Referências e plano curto:** consultar `src/layout-references/registry.json` (não obrigatório copiar uma composição); registrar em `src/layout-intents/<tela>.json` no formato de `src/lib/layout/intent.ts`. O plano é orientativo, não um conjunto restritivo de componentes.
3. **Reutilização:** consultar primeiro o catálogo de particles e a skill oficial de coss; preferir padrões já existentes quando coerentes com o objetivo. Não inventar imports, props ou APIs.
4. **Implementação:** criar rota TanStack Start, manter interações e labels acessíveis, usar COSS via `@/components/ui/`. Se faltar componente, `npx shadcn@latest add @coss/<nome>`.
5. **Instrumentação e cenários:** registrar estado inicial, erro, carregamento, vazio ou sucesso quando pertinentes em `src/layout-intents/screens.json` e marcar `data-layout-root` na raiz, `data-layout-group` para seções, `data-layout-field` para grupos label/controle e `data-layout-primary-action` na ação principal. Adicionar rota a `src/layout-intents/screens.json`.
6. **Avaliar:** `npm run check:static`, `npm run test:unit`, `npm test`, `npm run build`, `npm run typecheck`, `npm run layout:audit`; consultar `artifacts/layout-report.md` e screenshots em 390, 768 e 1440 px.
7. **Comparar quando houver ambiguidade:** duas alternativas opcionais podem ser comparadas com `npm run layout:compare` (relatórios completos e capturas distintas). A nota não decide estética. **Refinar:** corrigir defeitos reproduzíveis e, após ver screenshots, problemas visuais concretos. Limitar correções a 2 ou 3 ciclos. Não inventar nota visual sem inspecionar imagem.
8. **Entregar:** explicar decisões, testes e limitações. Sem aprovação adicional de schema, sem microserviços e sem ampliar automaticamente dependências.

## Boas práticas de layout
- Mostrar a importância pela estrutura, tipografia e espaçamento; evitar tudo no mesmo tamanho.
- Separar grupos relacionados: como heurística inicial, intervalo entre grupos >=1,5–2x o interno, ajustado aos tokens do tema.
- Preferir fluxo natural do DOM, CSS Grid para regiões, Flexbox para alinhamentos menores.
- Tela móvel antes de desktop; testar conteúdo longo, overflow, campos, acionadores e estados de erro.
- Não bloquear rolagem vertical quando o conteúdo precisa crescer. Evitar `overflow:hidden` em regiões com ações reais.
- Ao editar CSS de componentes coss, preservar variáveis e padrões recomendados; não transformar um sistema de componentes em CSS manual duplicado.

## Skills recomendadas
- `cosscom/ui` — uso de componentes/particles.
- `jakubkrehel/skills` skill `better-layout` — geração e stress test.
- `pbakaus/impeccable` skills `impeccable` + `layout` — crítica visual após coleta de contexto.

## Segurança e escopo
- Executar somente comandos necessários no workspace. Nunca enviar dados reais de usuário ou credenciais para screenshots ou relatórios.
- Arquivos gerados pelo registry coss continuam sob licença e autoria de seus respectivos mantenedores.
- A pontuação não é bloqueio universal, nem substitui testes funcionais, acessibilidade ou revisão de requisitos.

## GitHub Actions
- `ci.yml`: checks, testes, build e TypeScript.
- `layout-audit.yml`: Playwright em três larguras, cenários e artifacts visuais.
- `generate-screen.yml` e `refine-layout.yml`: ações **manuais**, com secret `OPENAI_API_KEY`, geram PR; nunca mudam main diretamente.
- Não publicar credenciais, dados pessoais ou prompts com segredo em artifacts.
- Não declarar avaliação visual aprovada sem inspecionar screenshots.
