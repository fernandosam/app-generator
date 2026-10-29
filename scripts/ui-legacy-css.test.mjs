import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const read = file => readFileSync(new URL('../' + file, import.meta.url), 'utf8')

test('CSS global contém tokens do tema, não uma folha de estilos paralela', () => {
  const css = read('src/styles/app.css')
  assert.match(css, /^@import "tailwindcss";/)
  assert.match(css, /@theme inline/)
  for (const token of ['--background', '--foreground', '--primary', '--card', '--border', '--input', '--ring', '--success']) {
    assert(css.includes(token), 'Token global ausente: ' + token)
  }
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '')
  assert.doesNotMatch(stripped, /(?:\.form-field|\.registration-card|\.primary-button|\.showcase-|\.site-header|\.story-panel|\.app-shell)/)
  assert.doesNotMatch(stripped, /(?:^|\s)(?:button|input|select)\s*[{,]/m)
  assert.doesNotMatch(stripped, /\[data-slot[^\]]*\]\s*[{,]/)
  assert(!existsSync(new URL('../src/styles/showcase.css', import.meta.url)), 'Folha paralela showcase.css ainda existe')
  assert(!read('src/routes/__root.tsx').includes('showcase.css'))
})

test('telas utilizam coss UI e classes utilitárias sem classes paralelas', () => {
  for (const name of ['registration', 'login', 'search', 'dashboard']) {
    const code = read('src/components/' + name + '-screen.tsx')
    assert.match(code, /from ['"]@\/components\/ui\/button['"]/)
    assert.match(code, /from ['"]@\/components\/ui\/card['"]/)
    if (name !== 'dashboard') assert.match(code, /from ['"]@\/components\/ui\/input['"]/)
    assert.match(code, /className="[^"]*(?:grid|flex|gap-|p-|bg-)/)
    assert.doesNotMatch(code, /className="[^"]*(?:showcase-|form-field|registration-card|primary-button)/)
    assert.match(code, /data-layout-/)
  }
})

test('cores de componentes partem de tokens semânticos e não de hex hardcoded', () => {
  for (const file of ['registration-screen.tsx','login-screen.tsx','search-screen.tsx','dashboard-screen.tsx','demo-shell.tsx']) {
    const code = read('src/components/' + file)
    assert.doesNotMatch(code, /#[0-9a-f]{3,8}\b/i, file + ' contém cor hexadecimal')
    assert.match(code, /(?:bg-|text-|border-)(?:primary|muted|foreground|background|card|border|input|success)/)
  }
})

test('preserva rotas e estados E2E com cenários reproduzíveis', () => {
  const data = JSON.parse(read('src/layout-intents/screens.json'))
  assert.deepEqual(data.screens.map(s => s.id), ['registration', 'login', 'search', 'dashboard'])
  for (const screen of data.screens) {
    assert(screen.scenarios.some(s => s.id === 'default'))
    assert(screen.scenarios.some(s => s.id === 'long-content'))
    assert(screen.scenarios.some(s => s.state === 'success' || s.state === 'filtered'))
  }
})
