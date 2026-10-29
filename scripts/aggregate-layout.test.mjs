import { test } from 'vite-plus/test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import index from '../src/layout-intents/screens.json' with { type: 'json' }

const profiles = ['mobile', 'tablet', 'desktop']
const fixture = () => {
  const cwd = mkdtempSync(join(tmpdir(), 'layout-audit-'))
  mkdirSync(join(cwd, 'artifacts/metrics'), { recursive: true })
  return cwd
}
const write = (cwd, runId, count = Infinity) => {
  let created = 0
  for (const screen of index.screens)
    for (const scenario of screen.scenarios)
      for (const profile of profiles) {
        if (created++ >= count) return
        const data = {
          runId,
          id: screen.id,
          scenario: scenario.id,
          profile,
          viewport: 390,
          score: 90,
          dimensions: { hierarchy: 90, grouping: 90, density: 90, responsive: 90 },
          issues: [],
        }
        writeFileSync(
          join(cwd, `artifacts/metrics/${screen.id}-${scenario.id}-${profile}.json`),
          JSON.stringify(data),
        )
      }
}
const aggregate = (cwd) =>
  spawnSync(process.execPath, [resolve('scripts/aggregate-layout.mjs')], {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, LAYOUT_RUN_ID: 'current' },
  })

test('reprova amostras ausentes sem inventar nota completa', () => {
  const dir = fixture()
  try {
    write(dir, 'current', 1)
    const result = aggregate(dir)
    assert.equal(result.status, 1, result.stderr)
    const output = JSON.parse(readFileSync(join(dir, 'artifacts/layout-report.json'), 'utf8'))
    assert.equal(output.complete, false)
    assert(output.missing.length > 0)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('reprova métricas de outra execução', () => {
  const dir = fixture()
  try {
    write(dir, 'stale')
    const result = aggregate(dir)
    assert.equal(result.status, 1, result.stderr)
    const output = JSON.parse(readFileSync(join(dir, 'artifacts/layout-report.json'), 'utf8'))
    assert.equal(output.score, null)
    assert(output.stale > 0)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('aprova cobertura completa da execução atual', () => {
  const dir = fixture()
  try {
    write(dir, 'current')
    const result = aggregate(dir)
    assert.equal(result.status, 0, result.stderr)
    const output = JSON.parse(readFileSync(join(dir, 'artifacts/layout-report.json'), 'utf8'))
    assert.equal(output.complete, true)
    assert.equal(output.score, 90)
    assert.equal(output.missing.length, 0)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})
