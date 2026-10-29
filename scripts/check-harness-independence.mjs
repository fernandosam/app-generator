import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const legacy = [
  'scripts/generate-screen.mjs', 'scripts/review-layout.mjs', 'scripts/refine-layout.mjs',
  '.github/workflows/generate-screen.yml', '.github/workflows/refine-layout.yml',
]
const packages = [/^@openai\/codex(?:-sdk)?$/, /^@ai-sdk\//, /^ai$/, /^openai$/, /^@anthropic-ai\/sdk$/, /^@google\/genai$/, /(?:^|\/)pi-coding-agent$/]
const patterns = [
  /\bspawn(?:Sync)?\s*\(\s*['"](?:codex|claude|pi)['"]/,
  /\bexec(?:File|Sync)?\s*\(\s*['"](?:codex|claude|pi)['"]/,
  /\bnpm\s+(?:install|i)\s+(?:--global|-g)\s+@openai\/codex/,
  /\bOPENAI_API_KEY\b|\bANTHROPIC_API_KEY\b|\bGOOGLE_API_KEY\b/,
  /from\s*['"](?:@openai\/codex(?:-sdk)?|@ai-sdk\/[^'"]+|openai|@anthropic-ai\/sdk)['"]/,
]
export function findHarnessDependencies(root = process.cwd()) {
  const failures = []
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
  for (const name of Object.keys({ ...pkg.dependencies, ...pkg.devDependencies, ...pkg.optionalDependencies })) {
    if (packages.some(regex => regex.test(name))) failures.push('Pacote de IA proibido: ' + name)
  }
  for (const name of ['screen:generate', 'layout:review', 'layout:refine']) {
    if (Object.hasOwn(pkg.scripts || {}, name)) failures.push('Script antigo: ' + name)
  }
  for (const name of legacy) if (existsSync(join(root, name))) failures.push('Executor antigo: ' + name)
  const visit = dir => {
    if (!existsSync(dir)) return
    for (const name of readdirSync(dir)) {
      const file = join(dir, name)
      const path = relative(root, file).replaceAll('\\', '/')
      if (name.startsWith('.') && !path.startsWith('.github/')) continue
      if (statSync(file).isDirectory()) { visit(file); continue }
      if (!/\.(?:mjs|cjs|js|jsx|ts|tsx|ya?ml)$/.test(file) || path === 'scripts/check-harness-independence.mjs' || /\.test\.mjs$/.test(file)) continue
      const source = readFileSync(file, 'utf8')
      if (patterns.some(pattern => pattern.test(source))) failures.push('Chamada de agente ou chave de IA em ' + path)
    }
  }
  for (const folder of ['scripts', '.github/workflows', 'src', 'tests']) visit(join(root, folder))
  return [...new Set(failures)]
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const failures = findHarnessDependencies()
  if (failures.length) {
    for (const failure of failures) console.error('FAIL: ' + failure)
    process.exitCode = 1
  } else console.log('OK: projeto independente de CLI, SDK e credenciais de IA')
}
