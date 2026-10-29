import { lstatSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const REQUIRED_HEADINGS = [
  'Objetivo e fluxos',
  'Mapa de telas e navegação',
  'Campos e validações',
  'Permissões',
  'APIs e contratos',
  'Estados e responsividade',
  'Evidências confirmadas',
  'Inferências',
  'Dúvidas',
  'Escopo mínimo proposto',
  'Decisão de aprovação',
]

function assertAllowed(condition, message) {
  if (!condition) throw new Error(message)
}

function parseFrontmatter(content) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(content)
  assertAllowed(match, 'Análise sem cabeçalho delimitado por ---')
  const metadata = Object.create(null)
  for (const row of match[1].split(/\r?\n/)) {
    const entry = /^([a-z_]+):\s*(.*?)\s*$/.exec(row)
    assertAllowed(entry, 'Metadado inválido no cabeçalho: ' + row)
    assertAllowed(!Object.hasOwn(metadata, entry[1]), 'Metadado duplicado: ' + entry[1])
    metadata[entry[1]] = entry[2].replace(
      /^(?:"(.*)"|'(.*)')$/,
      (_, quoted, single) => quoted ?? single,
    )
  }
  return metadata
}

export function checkAnalysisApproval(slug, root = process.cwd()) {
  assertAllowed(
    typeof slug === 'string' && SLUG.test(slug),
    'Slug inválido: use somente a-z, 0-9 e hífens',
  )
  const path = resolve(root, 'docs', 'analises', `${slug}.md`)
  const stats = lstatSync(path)
  assertAllowed(
    stats.isFile() && !stats.isSymbolicLink() && stats.size < 200_000,
    'Análise não é arquivo regular ou excede limite de tamanho',
  )
  const content = readFileSync(path, 'utf8')
  const metadata = parseFrontmatter(content)
  assertAllowed(metadata.slug === slug, 'Slug diverge do nome do relatório')
  assertAllowed(
    metadata.status === 'aprovada',
    'Análise não aprovada; solicite aprovação explícita',
  )
  for (const field of ['origem', 'aprovado_por', 'aprovado_em', 'aprovacao_referencia']) {
    const value = metadata[field]
    assertAllowed(
      typeof value === 'string' &&
        value.length > 0 &&
        !['pendente', 'caminho-a-definir'].includes(value.toLowerCase()),
      `Metadado ${field} ausente ou pendente`,
    )
  }
  assertAllowed(
    /^\d{4}-\d{2}-\d{2}$/.test(metadata.aprovado_em) &&
      !Number.isNaN(Date.parse(metadata.aprovado_em + 'T00:00:00Z')) &&
      new Date(metadata.aprovado_em + 'T00:00:00Z').toISOString().startsWith(metadata.aprovado_em),
    'Data de aprovação inválida (YYYY-MM-DD)',
  )
  for (const heading of REQUIRED_HEADINGS) {
    assertAllowed(content.includes(`\n## ${heading}\n`), 'Seção obrigatória ausente: ' + heading)
  }
  return {
    slug,
    path,
    status: metadata.status,
    origem: metadata.origem,
    aprovado_em: metadata.aprovado_em,
    referencia: metadata.aprovacao_referencia,
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    assertAllowed(process.argv.length === 3, 'Uso: npm run analysis:check -- <slug>')
    const result = checkAnalysisApproval(process.argv[2])
    console.log(`OK: análise ${result.slug} declarada aprovada em ${result.aprovado_em}.`)
    console.log(
      'Atenção: metadata não prova consentimento; confirmação explícita do usuário continua obrigatória.',
    )
  } catch (error) {
    console.error('BLOQUEADO: ' + error.message)
    process.exitCode = 1
  }
}
