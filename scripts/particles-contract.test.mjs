import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'

const read = (path) => readFileSync(path, 'utf8')
const particles = {
  'validated-form.tsx': 'p-form-2',
  'edit-dialog.tsx': 'p-dialog-1',
  'empty-state.tsx': 'p-empty-1',
  'data-table.tsx': 'p-table-4',
  'notifications.ts': 'p-toast-2',
}

test('cinco partículas coss versionadas com origem e sem imports do registry', () => {
  for (const [name, upstream] of Object.entries(particles)) {
    const path = 'src/components/particles/' + name
    assert(existsSync(path), 'Partícula ausente: ' + name)
    const content = read(path)
    assert(content.includes(upstream), 'Origem oficial não rastreada: ' + name)
    assert.doesNotMatch(content, /@\/registry\/default\//)
    assert.doesNotMatch(
      content,
      /Margaret Welsh|Los Angeles|flightCode|Create meeting|window\.alert\(/,
    )
  }
})

test('tabela usa TanStack, primitivas locais e dependência npm travada', () => {
  const table = read('src/components/particles/data-table.tsx')
  assert.match(table, /from '@tanstack\/react-table'/)
  assert.match(table, /getToggleSortingHandler/)
  assert.match(table, /getCanPreviousPage/)
  assert.match(table, /getCanNextPage/)
  const pkg = JSON.parse(read('package.json'))
  const lock = JSON.parse(read('package-lock.json'))
  assert.equal(pkg.dependencies['@tanstack/react-table'], '9.2.4')
  assert.equal(lock.packages[''].dependencies['@tanstack/react-table'], '9.2.4')
  assert.equal(lock.packages['node_modules/@tanstack/react-table'].version, '9.2.4')
})

test('notificações oficiais têm Provider montado na raiz', () => {
  assert.match(read('src/routes/__root.tsx'), /<ToastProvider>/)
  assert.match(read('src/components/particles/notifications.ts'), /toastManager\.add/)
})
