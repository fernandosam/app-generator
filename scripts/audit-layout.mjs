import { spawnSync } from 'node:child_process'
import { mkdirSync, rmSync } from 'node:fs'

// Sempre invalidar resultados da execução anterior, inclusive capturas.
for (const folder of ['artifacts/metrics', 'artifacts/screenshots']) rmSync(folder, { recursive: true, force: true })
for (const file of ['artifacts/layout-report.json', 'artifacts/layout-report.md', 'artifacts/layout-visual-review.json']) rmSync(file, { force: true })
mkdirSync('artifacts', { recursive: true })
const runId = `${Date.now()}-${process.pid}`
const env = { ...process.env, LAYOUT_RUN_ID: runId }
const opts = { stdio: 'inherit', shell: process.platform === 'win32', env }
const test = spawnSync('npm', ['run', 'test:layout'], opts)
const report = spawnSync(process.execPath, ['scripts/aggregate-layout.mjs'], opts)
if (test.status !== 0) console.error('Playwright falhou; o relatório pode estar incompleto.')
process.exit(test.status || report.status || 0)
