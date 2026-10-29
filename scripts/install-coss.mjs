import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('../', import.meta.url))
const expectedRegistry = 'https://coss.com/ui/r/{name}.json'
const particleName = /^p-[a-z0-9]+(?:-[a-z0-9]+)*-[0-9]+$/

export function parseOptions(args) {
  const options = { dryRun: false, overwrite: false, batchSize: 25, help: false }
  for (let i = 0; i < args.length; i++) {
    const argument = args[i]
    if (argument === '--dry-run') options.dryRun = true
    else if (argument === '--overwrite') options.overwrite = true
    else if (argument === '--help' || argument === '-h') options.help = true
    else if (argument === '--batch-size') {
      const value = args[++i]
      if (!/^[0-9]+$/.test(value ?? '') || Number(value) < 1 || Number(value) > 100) {
        throw new Error('--batch-size deve ser um inteiro entre 1 e 100.')
      }
      options.batchSize = Number(value)
    } else {
      throw new Error('Opção desconhecida: ' + argument)
    }
  }
  return options
}

export function resolveRegistryUrl(config) {
  if (config?.registries?.['@coss'] !== expectedRegistry) {
    throw new Error(
      'O registry @coss em components.json não corresponde ao domínio oficial esperado.',
    )
  }
  return expectedRegistry.replace('{name}', 'registry')
}

export function createInstallPlan(manifest, batchSize = 25) {
  if (!Array.isArray(manifest?.items)) throw new Error('Manifesto coss inválido: items ausente.')
  const bundles = manifest.items.filter((item) => item?.name === 'ui')
  if (
    bundles.length !== 1 ||
    bundles[0].type !== 'registry:ui' ||
    !Array.isArray(bundles[0].registryDependencies) ||
    bundles[0].registryDependencies.length === 0 ||
    !bundles[0].registryDependencies.every((name) => /^@coss\/[a-z0-9-]+$/.test(name))
  ) {
    throw new Error('Manifesto coss sem o bundle oficial de primitivas @coss/ui.')
  }

  const names = new Set()
  for (const item of manifest.items) {
    if (typeof item?.name !== 'string' || !item.name.startsWith('p-')) continue
    if (item.type !== 'registry:block' || !particleName.test(item.name) || names.has(item.name)) {
      throw new Error('Partícula inválida ou duplicada no manifesto: ' + item.name)
    }
    names.add(item.name)
  }
  const particles = [...names].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
  if (particles.length === 0)
    throw new Error('Manifesto coss sem partículas; instalação cancelada.')
  if (!Number.isInteger(batchSize) || batchSize < 1 || batchSize > 100) {
    throw new Error('Tamanho de lote inválido.')
  }
  const batches = [['@coss/ui']]
  for (let i = 0; i < particles.length; i += batchSize) {
    batches.push(particles.slice(i, i + batchSize).map((name) => '@coss/' + name))
  }
  return {
    primitiveCount: bundles[0].registryDependencies.length,
    particleCount: particles.length,
    batches,
  }
}

export async function fetchManifest(url) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(30000),
    headers: { Accept: 'application/json' },
  })
  if (!response.ok)
    throw new Error('Falha ao consultar o catálogo coss (HTTP ' + response.status + ').')
  return response.json()
}

export function shadcnArguments(items, overwrite = false) {
  return [
    'exec',
    '--yes',
    '--package=shadcn@latest',
    '--',
    'shadcn',
    'add',
    ...items,
    '--yes',
    ...(overwrite ? ['--overwrite'] : []),
  ]
}

function executeNpm(args, cwd) {
  const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', args, {
    cwd,
    stdio: 'inherit',
  })
  if (result.error) throw result.error
  return result.status ?? 1
}

export async function installCoss({
  args = process.argv.slice(2),
  cwd = projectRoot,
  config = JSON.parse(readFileSync(resolve(cwd, 'components.json'), 'utf8')),
  getManifest = fetchManifest,
  runNpm = executeNpm,
  log = console.log,
} = {}) {
  const options = parseOptions(args)
  if (options.help) {
    log('Uso: npm run ui:install -- [--dry-run] [--overwrite] [--batch-size 1..100]')
    return null
  }
  const registryUrl = resolveRegistryUrl(config)
  const manifest = await getManifest(registryUrl)
  const plan = createInstallPlan(manifest, options.batchSize)
  log(
    'coss UI: ' +
      plan.primitiveCount +
      ' primitivas e ' +
      plan.particleCount +
      ' partículas; ' +
      plan.batches.length +
      ' lote(s).',
  )
  if (options.dryRun) {
    plan.batches.forEach((batch, index) =>
      log('Simulação ' + (index + 1) + '/' + plan.batches.length + ': ' + batch.join(' ')),
    )
    log('Simulação concluída: nenhum arquivo ou dependência foi alterado.')
    return plan
  }
  let completed = 0
  for (const [index, batch] of plan.batches.entries()) {
    log(
      'Instalando lote ' +
        (index + 1) +
        '/' +
        plan.batches.length +
        ' (' +
        batch.length +
        ' item(ns))...',
    )
    const result = await runNpm(shadcnArguments(batch, options.overwrite), cwd)
    if (result !== 0) {
      throw new Error(
        'Falha no lote ' +
          (index + 1) +
          '/' +
          plan.batches.length +
          ' (código ' +
          result +
          '). ' +
          completed +
          ' lote(s) concluído(s). Revise o diff e reexecute o instalador para retomar.',
      )
    }
    completed++
  }
  log(
    'Instalação concluída: bundle @coss/ui e ' +
      plan.particleCount +
      ' partículas processados. Revise git diff, package-lock.json e execute npm run verify.',
  )
  return plan
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  installCoss().catch((error) => {
    console.error('Erro no instalador coss UI: ' + error.message)
    process.exitCode = 1
  })
}
