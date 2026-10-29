import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const screens = JSON.parse(readFileSync(new URL('../src/layout-intents/screens.json', import.meta.url), 'utf8')).screens
const loadIntent = id => JSON.parse(readFileSync(new URL('../src/layout-intents/' + id + '.json', import.meta.url), 'utf8'))

test('4 categorias de tela demonstram composição livre', () => {
  assert.deepEqual(new Set(screens.map(screen => screen.id)), new Set(['registration', 'login', 'search', 'dashboard']))
  for (const screen of screens) {
    assert(screen.scenarios.some(value => value.id === 'default'))
    const intent = loadIntent(screen.id)
    assert.equal(intent.screen, screen.id)
    assert(intent.purpose && intent.primaryAction)
    assert.equal(Object.hasOwn(intent, 'layout'), false, 'A intenção não deve prescrever layout')
    assert.equal(existsSync(new URL('../src/routes/' + (screen.path === '/' ? 'index' : screen.path.slice(1)) + '.tsx', import.meta.url)), true)
  }
})

test('cenários de interação, erro, vazio e estresse têm cobertura', () => {
  const all = screens.flatMap(screen => screen.scenarios.map(scenario => ({ ...scenario, screen: screen.id })))
  assert(all.length >= 19)
  assert(all.some(x => x.screen === 'login' && x.expectInvalid))
  assert(all.some(x => x.screen === 'search' && x.expectVisible?.includes('search-empty')))
  assert(all.some(x => x.screen === 'dashboard' && x.expectCount?.count === 2))
  assert(screens.every(screen => screen.scenarios.some(s => s.id === 'long-content')))
  assert(all.every(s => s.primaryActions === undefined || s.primaryActions >= 0))
})
