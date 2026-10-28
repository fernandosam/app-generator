import { spawnSync } from 'node:child_process'

const description = process.argv.slice(2).join(' ').trim()
if (!description) {
  console.error('Uso: npm run screen:generate -- "Crie uma tela de busca com filtros..."')
  process.exit(2)
}
const check = spawnSync('codex', ['--version'], { stdio: 'ignore', shell: process.platform === 'win32' })
if (check.error || check.status !== 0) {
  console.error('É necessário instalar e autenticar o Codex CLI para a geração automática. Consulte docs/layout-workflow.md.')
  process.exit(1)
}
const prompt = `Você é o gerador de telas deste projeto TanStack Start + coss UI. Solicitação: ${description}\n\nSiga AGENTS.md e docs/layout-workflow.md. (1) Registre tarefa do usuário, público, estados, variações de dados, grupos, prioridade, CTA e desktop/mobile. Consulte src/layout-references/registry.json como exemplos flexíveis. Se houver duas composições plausíveis de alto impacto, documente ambas; compare apenas com evidências, sem gerar variações por padrão. (2) Crie ou ajuste um JSON em src/layout-intents seguindo intent.ts. (3) Consulte primeiro particles oficiais do coss e use somente componentes reais do registro @coss, sem improvisar APIs; instale novos componentes com shadcn add @coss/<nome> se necessário. (4) Implemente rota file-based em src/routes/; mantenha o exemplo de cadastro. (5) Inclua a tela em src/layout-intents/screens.json, use data-layout-root, data-layout-group, data-layout-field e data-layout-primary-action nas partes correspondentes. (6) Rode npm run check:static, npm run test:unit, npm test, npm run build, npm run typecheck e npm run layout:audit, corrija erros objetivos. (7) Consulte screenshots e avalie composição visual se a ferramenta permitir; não invente aprovação visual. (8) Não acrescente camada de aprovação nem dependências de Next.js. Ao final informe rota, alterações, testes e limites.`
const result = spawnSync('codex', ['exec', '--sandbox', 'workspace-write', '-'], {
  input: prompt, stdio: ['pipe', 'inherit', 'inherit'], encoding: 'utf8', shell: process.platform === 'win32',
})
process.exit(result.status || (result.error ? 1 : 0))
