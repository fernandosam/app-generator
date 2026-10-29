import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'

const text = relative => readFileSync(new URL('../' + relative, import.meta.url), 'utf8')
const files = {
  analysis: '.agents/skills/analisar-funcionalidade/SKILL.md',
  implementation: '.agents/skills/implementar-funcionalidade/SKILL.md',
  analyzePrompt: '.pi/prompts/analisar.md',
  implementPrompt: '.pi/prompts/implementar.md',
  reportTemplate: 'docs/analises/TEMPLATE.md',
  docs: 'docs/workflow-funcionalidades.md',
}

function frontmatter(body) {
  const match = /^---\n([\s\S]+?)\n---\n/.exec(body)
  assert(match, 'Arquivo Markdown sem frontmatter válido')
  return Object.fromEntries(match[1].split('\n').map(line => {
    const parsed = /^([a-z-]+):\s*(.+)$/.exec(line)
    assert(parsed, 'Linha inválida de frontmatter: ' + line)
    return [parsed[1], parsed[2]]
  }))
}

test('skills portáteis têm name e description conformes à especificação', () => {
  for (const [key, name] of [['analysis', 'analisar-funcionalidade'], ['implementation', 'implementar-funcionalidade']]) {
    const data = frontmatter(text(files[key]))
    assert.equal(data.name, name)
    assert(data.description.length > 40 && data.description.length <= 1024)
    assert(!Object.hasOwn(data, 'disable-model-invocation'))
  }
})

test('atalhos Pi usam argumentos posicionais e referenciam a skill correta', () => {
  for (const [key, skill] of [['analyzePrompt', files.analysis], ['implementPrompt', files.implementation]]) {
    const body = text(files[key])
    const metadata = frontmatter(body)
    assert(metadata.description && metadata['argument-hint'])
    assert(body.includes(skill))
    assert(body.includes('$1'))
    assert(body.includes('$2'))
    assert(/Se faltar/.test(body))
  }
})

test('análise é rascunho, documenta fatos/inferências/dúvidas e protege origem', () => {
  const a = text(files.analysis)
  const template = text(files.reportTemplate)
  assert.match(a, /somente leitura/)
  assert.match(a, /Não implementar nada/)
  assert.match(a, /status inicial `rascunho`/)
  assert.match(a, /caminho\/arquivo.ext:linha-ou-faixa/)
  assert(template.includes('status: rascunho'))
  for (const title of ['Evidências confirmadas', 'Inferências', 'Dúvidas', 'Mapa de telas e navegação', 'Escopo mínimo proposto']) {
    assert(template.includes('## ' + title))
  }
})

test('implementação exige aprovação explícita e todas as issues antes do código', () => {
  const i = text(files.implementation)
  assert(i.includes('npm run analysis:check -- <slug>'))
  assert.match(i, /autorização.*explícita/i)
  assert.match(i, /todas as issues.*antes da primeira mudança/i)
  assert.match(i, /Preserve as demonstrações existentes/i)
  assert.match(i, /dados sintéticos locais/i)
  assert.match(i, /screenshots relevantes/i)
  assert.match(i, /origem.*somente leitura/i)
})

test('documentação inclui comando curto, aprovação e rota demonstrativa real', () => {
  const docs = text(files.docs)
  assert(docs.includes('/analisar "Gestão de usuários" "../sistema-legado"'))
  assert(docs.includes('/implementar "Gestão de usuários" "/usuarios,/usuarios/novo"'))
  assert(docs.includes('atualmente a tela de cadastro está em `/`'))
  for (const path of Object.values(files)) assert(existsSync(new URL('../' + path, import.meta.url)))
})
