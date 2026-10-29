import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import screensIndex from '../src/layout-intents/screens.json' with { type: 'json' }

const metricsDir = 'artifacts/metrics'
if (!existsSync(metricsDir)) {
  console.error('Sem métricas para esta execução.')
  process.exit(1)
}
const runId = process.env.LAYOUT_RUN_ID || 'manual'
const profiles = ['mobile', 'tablet', 'desktop']
const expected = screensIndex.screens.flatMap((s) =>
  s.scenarios.flatMap((c) => profiles.map((p) => `${s.id}-${c.id}-${p}`)),
)
const files = readdirSync(metricsDir).filter((f) => f.endsWith('.json'))
const samples = files
  .map((f) => JSON.parse(readFileSync(join(metricsDir, f), 'utf8')))
  .filter((m) => m.runId === runId)
const present = new Set(samples.map((m) => `${m.id}-${m.scenario}-${m.profile}`))
const missing = expected.filter((key) => !present.has(key))
const stale = files.length - samples.length
const score = samples.length
  ? Math.round(samples.reduce((s, m) => s + m.score, 0) / samples.length)
  : null
const issues = samples.flatMap((m) =>
  m.issues.map((issue) => ({ screen: m.id, scenario: m.scenario, viewport: m.profile, ...issue })),
)
const criticalCount = issues.filter((i) => i.severity === 'critical').length
const majorCount = issues.filter((i) => i.severity === 'major').length
const result = {
  kind: 'contextual-mechanical-audit',
  runId,
  complete: missing.length === 0 && stale === 0,
  disclaimer:
    'Sinais mecânicos contextuais; qualidade visual e efetividade das tarefas não foram comprovadas.',
  score,
  threshold: Number(process.env.LAYOUT_MIN_SCORE || 86),
  samples,
  issues,
  criticalCount,
  majorCount,
  missing,
  stale,
  screenshots: samples.map((m) => `artifacts/screenshots/${m.id}-${m.scenario}-${m.profile}.png`),
}
mkdirSync('artifacts', { recursive: true })
writeFileSync('artifacts/layout-report.json', JSON.stringify(result, null, 2))
const markdown = [
  '# Relatório contextual de layout',
  '',
  `**Execução:** ${runId} · **Completa:** ${result.complete ? 'sim' : 'não'} · **Pontuação heurística:** ${score ?? 'indisponível'}/100`,
  '',
  '| Tela | Estado | Resolução | Nota | Hierarquia | Agrupamento | Densidade | Responsividade |',
  '|---|---|---|---:|---:|---:|---:|---:|',
  ...samples.map(
    (s) =>
      `| ${s.id} | ${s.scenario} | ${s.profile} (${s.viewport}px) | ${s.score} | ${s.dimensions.hierarchy} | ${s.dimensions.grouping} | ${s.dimensions.density} | ${s.dimensions.responsive} |`,
  ),
  '',
  '## Diagnósticos',
  ...(issues.length
    ? issues.map(
        (i) =>
          `- **${i.severity}** [${i.screen}/${i.scenario}/${i.viewport}] ${i.dimension}: ${i.message}`,
      )
    : ['- Sem problemas mecânicos detectados.']),
  ...(missing.length ? ['', '## Casos ausentes', ...missing.map((s) => `- ${s}`)] : []),
  '',
  '## Interpretação',
  '- Estados variados e contextos distintos geram verificações diferentes; a nota não é universal.',
  '- Capturas precisam de inspeção visual real para avaliar equilíbrio, ritmo e leitura.',
  '- Falhas funcionais ou de acessibilidade não podem ser compensadas por pontuação alta.',
]
writeFileSync('artifacts/layout-report.md', markdown.join('\n') + '\n')
console.log(
  `Layout ${score ?? '—'}/100 — ${samples.length}/${expected.length} amostras; ${criticalCount} críticas, ${majorCount} graves; ${stale} obsoletas.`,
)
if (!result.complete) process.exitCode = 1
