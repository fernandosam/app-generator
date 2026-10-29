import test from 'node:test'
import assert from 'node:assert/strict'
import {
  createInstallPlan, installCoss, parseOptions, resolveRegistryUrl, shadcnArguments,
} from './install-coss.mjs'

const config = { registries: { '@coss': 'https://coss.com/ui/r/{name}.json' } }
const registry = {
  items: [
    { name: 'p-button-2', type: 'registry:block' },
    { name: 'p-dialog-1', type: 'registry:block' },
    { name: 'ui', type: 'registry:ui', registryDependencies: ['@coss/button', '@coss/dialog'] },
    { name: 'p-button-1', type: 'registry:block' },
    { name: 'style', type: 'registry:style' },
    { name: 'dashboard', type: 'registry:block' },
  ],
}

test('descobre todos os particles no registry e planeja bundle primeiro, determinístico e em lotes', () => {
  const plan = createInstallPlan(registry, 2)
  assert.equal(plan.primitiveCount, 2)
  assert.equal(plan.particleCount, 3)
  assert.deepEqual(plan.batches, [
    ['@coss/ui'], ['@coss/p-button-1', '@coss/p-button-2'], ['@coss/p-dialog-1'],
  ])
})

test('falha fechado para manifestos vazios, inválidos ou inconsistentes', () => {
  for (const bad of [null, {}, { items: [] }, { items: [{ name: 'ui', type: 'registry:ui', registryDependencies: ['@coss/button'] }] },
    { items: [{ name: 'ui', type: 'registry:ui', registryDependencies: [] }, ...registry.items] },
    { items: [...registry.items, { name: 'p-button-1', type: 'registry:block' }] },
    { items: [...registry.items, { name: 'p-../oops-1', type: 'registry:block' }] },
    { items: [...registry.items, { name: 'p-badge-1', type: 'registry:ui' }] },
  ]) assert.throws(() => createInstallPlan(bad), /Manifesto|Partícula/)
})

test('aceita somente URL coss configurada e opções explícitas', () => {
  assert.equal(resolveRegistryUrl(config), 'https://coss.com/ui/r/registry.json')
  assert.throws(() => resolveRegistryUrl({ registries: { '@coss': 'https://untrusted.test/r/{name}.json' } }), /oficial/)
  assert.deepEqual(parseOptions(['--dry-run', '--overwrite', '--batch-size', '50']), {
    dryRun: true, overwrite: true, batchSize: 50, help: false,
  })
  for (const args of [['--batch-size', '0'], ['--batch-size', '101'], ['--batch-size', 'X'], ['--batch-size'], ['--unknown']]) {
    assert.throws(() => parseOptions(args), /inválid|desconhecida|deve ser/)
  }
  assert.throws(() => createInstallPlan(registry, 0), /Tamanho/)
})

test('dry-run não inicia CLI nem altera arquivos', async () => {
  const logs = []
  const result = await installCoss({ args: ['--dry-run', '--batch-size', '2'], config,
    getManifest: async () => registry,
    runNpm: () => { throw new Error('não deveria executar') },
    log: line => logs.push(line),
  })
  assert.equal(result.batches.length, 3)
  assert.match(logs.join('\n'), /Simulação concluída: nenhum arquivo/)
  assert(logs.some(line => line.includes('@coss/p-button-2')))
})

test('executa CLI oficial em lotes sem overwrite implícito', async () => {
  const commands = []
  const result = await installCoss({ args: ['--batch-size', '2'], config,
    getManifest: async () => registry,
    runNpm: async (args, cwd) => { commands.push([args, cwd]); return 0 },
    log: () => {},
  })
  assert.equal(result.particleCount, 3)
  assert.equal(commands.length, 3)
  assert.deepEqual(commands[0][0], shadcnArguments(['@coss/ui']))
  assert(commands.every(([args]) => args.includes('--package=shadcn@latest') && !args.includes('--overwrite')))
  assert(commands.every(([, cwd]) => typeof cwd === 'string'))
  assert.deepEqual(shadcnArguments(['@coss/ui'], true).at(-1), '--overwrite')
})

test('interrompe instalação parcial no lote com erro propagado', async () => {
  const calls = []
  await assert.rejects(installCoss({ config, args: ['--overwrite', '--batch-size', '2'],
    getManifest: async () => registry,
    runNpm: async args => { calls.push(args); return calls.length === 2 ? 2 : 0 },
    log: () => {},
  }), /Falha no lote 2\/3.*1 lote\(s\) concluído\(s\)/)
  assert.equal(calls.length, 2)
  assert(calls.every(args => args.includes('--overwrite')))
})

test('falhas na consulta do registry são propagadas, sem executar a CLI', async () => {
  await assert.rejects(installCoss({ config, getManifest: async () => { throw new Error('HTTP 503') },
    runNpm: () => { throw new Error('não deveria executar') }, log: () => {},
  }), /HTTP 503/)
})

test('--help não consulta catálogo nem instala', async () => {
  const log = []
  await installCoss({ config, args: ['--help'], getManifest: () => { throw new Error('fetch') },
    runNpm: () => { throw new Error('npm') }, log: text => log.push(text) })
  assert.match(log[0], /Uso: npm run ui:install/)
})
