import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'

const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
const config = readFileSync('vite.config.ts', 'utf8')

test('usa apenas Vite+ para desenvolvimento, build e testes', () => {
  assert.match(pkg.devDependencies['vite-plus'] || '', /^\d+\.\d+\.\d+$/)
  assert.equal(pkg.scripts.dev, 'vp dev')
  assert.equal(pkg.scripts.build, 'vp build')
  assert.equal(pkg.scripts.test, 'vp test')
  assert.equal(pkg.scripts.typecheck, 'vp check --no-fmt --no-lint')
  assert.match(pkg.scripts.check, /\bvp check\b/)
  assert.equal(pkg.devDependencies.vite, undefined)
  assert.equal(pkg.devDependencies.vitest, undefined)
  assert.equal(pkg.overrides.vite, `npm:@voidzero-dev/vite-plus-core@${pkg.devDependencies['vite-plus']}`)
  assert.match(pkg.overrides.vitest || '', /^5\.\d+\.\d+$/)
})

test('mantém configuração única de app e testes', () => {
  assert.match(config, /defineConfig.*from 'vite-plus'/)
  assert.match(config, /tanstackStart\(\)/)
  assert.match(config, /test:\s*\{/)
  assert.match(config, /typeAware:\s*true/)
  assert.match(config, /typeCheck:\s*true/)
  assert.match(config, /fmt:\s*\{/)
  assert.doesNotMatch(readFileSync('tsconfig.json', 'utf8'), /"baseUrl"\s*:/)
  assert.equal(existsSync('vitest.config.ts'), false)
  assert.match(readFileSync('src/lib/layout/intent.test.ts','utf8'), /from 'vite-plus\/test'/)
})

test('documentação não recomenda executor antigo', () => {
  for (const file of [
    'AGENTS.md',
    'README.md',
    'docs/e06-validation.md',
    'docs/github-publish.md',
    'docs/layout-workflow.md',
    'docs/workflow-diagnostics.md',
  ]) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), /\bVite\b(?!\+)/, file)
  }
})

test('workflows preservam contratos e auditoria sem duplicar verificações', () => {
  const ci = readFileSync('.github/workflows/ci.yml', 'utf8')
  const layout = readFileSync('.github/workflows/layout-audit.yml', 'utf8')
  assert.match(ci, /run: npm run check/)
  assert.doesNotMatch(ci, /run: npm run typecheck/)
  assert.match(layout, /run: npm run layout:audit/)
  assert.doesNotMatch(layout, /run: npm run check:harness/)
})
