import { readFileSync, existsSync } from 'node:fs'
import assert from 'node:assert/strict'
const load = file => JSON.parse(readFileSync(file, 'utf8'))
const pkg = load('package.json')
const registry = load('components.json')
const index = load('src/layout-intents/screens.json')
const refs = load('src/layout-references/registry.json')
assert(pkg.dependencies['@tanstack/react-start'] && pkg.dependencies['@tanstack/react-router'])
assert(!pkg.dependencies.next && !pkg.devDependencies.next)
const vitePlusVersion = pkg.devDependencies['vite-plus']
assert.match(vitePlusVersion || '', /^\d+\.\d+\.\d+$/, 'Vite+ deve ter versão exata')
assert(!pkg.devDependencies.vite && !pkg.dependencies.vite, 'Não instalar Vite independente')
assert(!pkg.devDependencies.vitest && !pkg.dependencies.vitest, 'Não instalar Vitest independente')
assert.equal(pkg.scripts.dev, 'vp dev')
assert.equal(pkg.scripts.build, 'vp build')
assert.equal(pkg.scripts.test, 'vp test')
assert.equal(pkg.scripts.typecheck, 'vp check --no-fmt --no-lint')
assert.match(pkg.scripts.check, /\bvp check\b/)
assert.equal(pkg.overrides.vite, `npm:@voidzero-dev/vite-plus-core@${vitePlusVersion}`)
assert.match(pkg.overrides.vitest || '', /^5\.\d+\.\d+$/, 'Vitest 5 deve estar travado')
assert(!existsSync('vitest.config.ts'), 'Configuração standalone de testes não permitida')
assert.equal(registry.registries['@coss'], 'https://coss.com/ui/r/{name}.json')
assert(index.screens.length > 0)
const ids = new Set()
for (const screen of index.screens) {
  assert(screen.id && /^[a-z0-9-]+$/.test(screen.id), 'ID de tela inválido')
  assert(!ids.has(screen.id), `Tela duplicada: ${screen.id}`)
  ids.add(screen.id)
  assert(screen.path.startsWith('/') && screen.purpose)
  const routePath = screen.path === '/' ? 'src/routes/index.tsx' : `src/routes/${screen.path.slice(1)}.tsx`
  assert(existsSync(routePath), `Rota inexistente: ${routePath}`)
  const intent = load(`src/layout-intents/${screen.id}.json`)
  assert(intent.screen === screen.id && intent.purpose && intent.primaryAction, `Intenção incompleta: ${screen.id}`)
  assert(['form', 'login', 'search', 'dashboard', 'content'].includes(screen.kind))
  assert(Array.isArray(screen.scenarios) && screen.scenarios.some(s => s.id === 'default'))
  const seen = new Set()
  for (const scenario of screen.scenarios) {
    assert(!seen.has(scenario.id) && scenario.id && scenario.state, `Cenário repetido/inválido: ${screen.id}/${scenario.id}`)
    seen.add(scenario.id)
    assert(scenario.primaryActions === undefined || (Number.isInteger(scenario.primaryActions) && scenario.primaryActions >= 0))
    if (scenario.expectCount) assert(scenario.expectCount.selector && Number.isInteger(scenario.expectCount.count) && scenario.expectCount.count >= 0)
    if (scenario.expectText) assert(scenario.expectText.selector && typeof scenario.expectText.value === 'string')
    if (scenario.expectFocused) assert(typeof scenario.expectFocused === 'string')
    for (const action of scenario.actions || []) {
      assert(['fill', 'click', 'repeatText', 'selectOption', 'focus', 'press'].includes(action.type) && action.selector)
    }
  }
  assert(existsSync(`src/layout-intents/${screen.id}.json`), `Intenção não localizada: ${screen.id}`)
}
assert(Array.isArray(refs.references))
for (const ref of refs.references) {
  assert(ref.id && ref.intent && existsSync(ref.intent))
  assert(Array.isArray(ref.screenKinds) && ref.screenKinds.length)
  assert(typeof ref.verified === 'boolean')
}
for (const file of [
  'vite.config.ts', 'src/routes/__root.tsx', 'src/routes/index.tsx',
  'src/components/ui/button.tsx', 'src/components/ui/card.tsx', 'src/components/ui/input.tsx',
  'src/components/ui/spinner.tsx', 'package-lock.json',
  'src/lib/layout/intent.ts', 'tests/layout.spec.ts',
  'scripts/audit-layout.mjs', 'scripts/verify-visual-review.mjs',
  'scripts/visual-review-contract.mjs', 'scripts/check-harness-independence.mjs',
  '.github/workflows/ci.yml', '.github/workflows/layout-audit.yml',
]) assert(existsSync(file), `Arquivo ausente: ${file}`)
console.log(`OK: TanStack Start + coss, ${index.screens.length} tela(s), ${index.screens.reduce((a,s)=>a+s.scenarios.length,0)} cenários e pipelines de validação.`)
