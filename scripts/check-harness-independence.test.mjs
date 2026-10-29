import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { findHarnessDependencies } from './check-harness-independence.mjs'

const fixture = t => {
  const dir = mkdtempSync(join(tmpdir(), 'harness-test-'))
  t.after(() => rmSync(dir, { recursive: true, force: true }))
  mkdirSync(join(dir, 'scripts'))
  mkdirSync(join(dir, '.github/workflows'), { recursive: true })
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ scripts: { 'layout:audit': 'node scripts/audit-layout.mjs' }, dependencies: {} }))
  return dir
}
test('aceita projeto sem execução de IA', t => {
  assert.deepEqual(findHarnessDependencies(fixture(t)), [])
})
test('detecta pacote e executor legado', t => {
  const root = fixture(t)
  writeFileSync(join(root, 'package.json'), JSON.stringify({
    dependencies: { '@ai-sdk/openai': '^3' },
    scripts: { 'screen:generate': 'node scripts/generate-screen.mjs' },
  }))
  writeFileSync(join(root, 'scripts/generate-screen.mjs'), "spawnSync('codex', ['exec'])")
  const failures = findHarnessDependencies(root)
  assert(failures.some(value => value.includes('@ai-sdk/openai')))
  assert(failures.some(value => value.includes('screen:generate')))
  assert(failures.some(value => value.includes('generate-screen.mjs')))
})
test('detecta chave e instalação de agente em workflow', t => {
  const root = fixture(t)
  writeFileSync(join(root, '.github/workflows/generate.yml'), 'run: npm install --global @openai/codex\nOPENAI_API_KEY: variable')
  assert(findHarnessDependencies(root).some(value => value.includes('generate.yml')))
})
