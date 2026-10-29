import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'

const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
const config = readFileSync('vite.config.ts', 'utf8')

test('usa apenas Vite+ para desenvolvimento, build e testes', () => {
  assert.equal(pkg.devDependencies['vite-plus'], '1.4.0')
  assert.equal(pkg.scripts.dev, 'vp dev')
  assert.equal(pkg.scripts.build, 'vp build')
  assert.equal(pkg.scripts.test, 'vp test')
  assert.equal(pkg.devDependencies.vite, undefined)
  assert.equal(pkg.devDependencies.vitest, undefined)
  assert.equal(pkg.overrides.vite, 'npm:@voidzero-dev/vite-plus-core@1.4.0')
  assert.equal(pkg.overrides.vitest, '5.0.5')
})

test('mantém configuração única de app e testes', () => {
  assert.match(config, /defineConfig.*from 'vite-plus'/)
  assert.match(config, /tanstackStart\(\)/)
  assert.match(config, /test:\s*\{/)
  assert.equal(existsSync('vitest.config.ts'), false)
  assert.match(readFileSync('src/lib/layout/intent.test.ts','utf8'), /from 'vite-plus\/test'/)
})
