import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, rmSync } from 'node:fs'

const max = Math.min(3, Math.max(1, Number(process.env.LAYOUT_MAX_REVISIONS || 2)))
const target = Number(process.env.LAYOUT_MIN_SCORE || 86)
const run = (cmd, args, input) => spawnSync(cmd, args, {
  stdio: input === undefined ? 'inherit' : ['pipe', 'inherit', 'inherit'],
  input, shell: process.platform === 'win32', encoding: 'utf8',
})
const hasAgent = () => {
  const response = spawnSync('codex', ['--version'], { stdio: 'ignore', shell: process.platform === 'win32' })
  return !response.error && response.status === 0
}
for (let attempt = 0; attempt <= max; attempt++) {
  const audit = run('npm', ['run', 'layout:audit'])
  if (!existsSync('artifacts/layout-report.json')) process.exit(audit.status || 1)
  const result = JSON.parse(readFileSync('artifacts/layout-report.json', 'utf8'))
  const mechanicalMajor = result.issues.filter((it) => it.severity === 'major' || it.severity === 'critical')
  const mechanicallyGood = audit.status === 0 && result.complete && result.score >= target && mechanicalMajor.length === 0
  const agentReady = hasAgent()
  let visual = null
  if (agentReady) {
    if (existsSync('artifacts/layout-visual-review.json')) rmSync('artifacts/layout-visual-review.json')
    const inspection = run('npm', ['run', 'layout:review'])
    if (inspection.status === 0 && existsSync('artifacts/layout-visual-review.json')) {
      visual = JSON.parse(readFileSync('artifacts/layout-visual-review.json', 'utf8'))
    }
  }
  const visualMajor = visual?.inspected ? visual.findings.filter((it) => it.severity === 'major' || it.severity === 'critical') : []
  const mustInspect = agentReady || process.env.LAYOUT_REQUIRE_VISUAL === '1'
  if (mustInspect && !visual?.inspected) {
    console.error('Revisão visual exigida, mas as capturas não foram inspecionadas. Resultado inconclusivo; não declarar qualidade aprovada.')
    process.exit(2)
  }
  if (mechanicallyGood && visualMajor.length === 0) {
    console.log(`Auditoria mecânica: ${result.score}/100. ${visual?.inspected ? 'Revisão visual reportada (não substitui validação de tarefa).' : 'Revisão visual NÃO EXECUTADA; resultado apenas mecânico.'}`)
    process.exit(0)
  }
  if (attempt === max) {
    console.error(`Limite de ${max} revisões atingido. Nota mecânica: ${result.score}/100, problemas visuais graves: ${visualMajor.length}.`)
    process.exit(1)
  }
  if (!agentReady) {
    console.error('Para autocorreção, instale/autentique o Codex CLI. O relatório mecânico permanece disponível.')
    process.exit(1)
  }
  const prompt = `Corrija defeitos comprovados de layout neste projeto TanStack Start + coss UI. Preserve comportamento, acessibilidade, intenção e rotas, sem criar APIs ou frameworks alternativos. Use skills coss, better-layout e impeccable/layout se disponíveis. Consulte as imagens, se possível. Faça somente mudanças direcionadas e testáveis; não invente resultados.\nRelatório mecânico:\n${JSON.stringify(result, null, 2)}\nRevisão visual (se disponível):\n${JSON.stringify(visual, null, 2)}`
  const fix = run('codex', ['exec', '--sandbox', 'workspace-write', '-'], prompt)
  if (fix.status !== 0) process.exit(fix.status || 1)
}
