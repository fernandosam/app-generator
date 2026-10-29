import { test } from 'vite-plus/test'
import assert from 'node:assert/strict'
import { chmodSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const read = (name) => readFileSync(join(root, name), 'utf8')

function mockCli(args) {
  const temp = mkdtempSync(join(tmpdir(), 'coss-installer-'))
  const calls = join(temp, 'calls')
  const stub = join(temp, 'npm')
  writeFileSync(stub, '#!/bin/sh\nprintf "%s\\n" "$@" > "$MOCK_CALLS"\n')
  chmodSync(stub, 0o755)
  const result = spawnSync('bash', ['scripts/install-coss.sh', ...args], {
    cwd: root,
    env: { ...process.env, PATH: temp + ':' + process.env.PATH, MOCK_CALLS: calls },
    encoding: 'utf8',
  })
  const called = readdirSync(temp).includes('calls')
    ? readFileSync(calls, 'utf8').trim().split('\n')
    : []
  rmSync(temp, { recursive: true, force: true })
  return { ...result, called }
}

test('instalador exige escolha explícita de partículas', () => {
  for (const args of [
    [],
    ['--overwrite'],
    ['@coss/ui'],
    ['@coss/button'],
    ['p-button-1'],
    ['@coss/p-../bad-1'],
    ['@coss/p-button-1', '--dry-run'],
  ]) {
    const result = mockCli(args)
    assert.equal(result.status, 2, args.join(' '))
    assert.deepEqual(result.called, [], 'não pode chamar o npm sem uma partícula válida')
  }
})

test('exibe ajuda sem acessar rede', () => {
  const result = mockCli(['--help'])
  assert.equal(result.status, 0)
  assert.match(result.stdout, /npm run ui:install -- @coss\/p-/)
  assert.deepEqual(result.called, [])
})

test('encaminha somente partículas selecionadas para o CLI oficial fixado', () => {
  const result = mockCli(['@coss/p-button-1', '@coss/p-alert-dialog-2'])
  assert.equal(result.status, 0, result.stderr)
  assert.deepEqual(result.called, [
    'exec',
    '--yes',
    '--package=shadcn@4.1.0',
    '--',
    'shadcn',
    'add',
    '--yes',
    '@coss/p-button-1',
    '@coss/p-alert-dialog-2',
  ])
})

test('overwrite requer confirmação explícita do chamador', () => {
  const defaultInstall = mockCli(['@coss/p-button-1'])
  assert.equal(defaultInstall.called.includes('--overwrite'), false)
  const update = mockCli(['@coss/p-button-1', '--overwrite'])
  assert.equal(update.status, 0)
  assert.equal(update.called.at(-1), '--overwrite')
})

test('primitivas oficiais estão versionadas sem acesso ao registry no CI', () => {
  const directory = readdirSync(join(root, 'src/components/ui')).filter((name) =>
    name.endsWith('.tsx'),
  )
  assert(directory.length >= 56, 'esperadas as 55 primitivas e segmented-control')
  for (const name of [
    'accordion',
    'alert-dialog',
    'autocomplete',
    'button',
    'calendar',
    'card',
    'composer',
    'dialog',
    'drawer',
    'input',
    'menu',
    'select',
    'sidebar',
    'toast',
    'tooltip',
    'segmented-control',
  ]) {
    assert(directory.includes(name + '.tsx'), 'componente ausente: ' + name)
  }
  for (const file of directory) {
    assert.doesNotMatch(read('src/components/ui/' + file), /@\/registry\/default\//, file)
  }
  for (const name of ['use-composer-editor', 'use-media-query'])
    assert(readdirSync(join(root, 'src/hooks')).includes(name + '.ts'))
  const pkg = JSON.parse(read('package.json'))
  const lock = JSON.parse(read('package-lock.json'))
  assert.equal(pkg.dependencies['@daypicker/react'], '10.0.1')
  assert.equal(lock.packages[''].dependencies['@daypicker/react'], '10.0.1')
  assert.equal(lock.packages['node_modules/@daypicker/react'].version, '10.0.1')
  assert.equal(pkg.scripts['ui:install'], 'bash scripts/install-coss.sh')
  assert.match(read('scripts/install-skills.sh'), /skills add cosscom\/ui/)
  assert.doesNotMatch(read('scripts/install-coss.sh'), /registry\.json|--dry-run/)
})
