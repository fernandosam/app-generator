import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8')

test('AGENTS.md estabelece precedência coss UI, Tailwind e tokens globais', () => {
  const agents = read('AGENTS.md')
  assert.match(agents, /Política de estilos: coss UI → Tailwind → tokens globais/)
  assert.match(agents, /Componente oficial coss UI já instalado/)
  assert.match(agents, /Utilitários Tailwind CSS v4/)
  assert.match(agents, /Tokens semânticos globais/)
  assert.match(agents, /CSS específico é exceção/)
  assert.match(agents, /Não substituir componentes existentes/)
})

test('skill de implementação reforça reutilização e justifica exceções de CSS', () => {
  const skill = read('.agents/skills/implementar-funcionalidade/SKILL.md')
  assert.match(skill, /Priorize nesta ordem:/)
  assert.match(skill, /componentes oficiais coss UI/)
  assert.match(skill, /utilitários Tailwind v4/)
  assert.match(skill, /tokens globais existentes/)
  assert.match(skill, /CSS específico apenas por necessidade concreta não atendida/)
  assert.match(skill, /registre no PR a necessidade/)
  assert.match(skill, /AGENTS\.md/)
})

test('guia valida a política de estilos vigente e mantém layout livre', () => {
  const guide = read('docs/ui-styling-policy.md')
  const readme = read('README.md')
  assert.match(guide, /Ordem de decisão/)
  assert.match(guide, /src\/components\/ui\//)
  assert.match(guide, /sem afetar controles globais/)
  assert.match(guide, /Quando CSS adicional pode ser aceito/)
  assert.match(guide, /Revisão de código/)
  assert.match(guide, /O agente continua livre para determinar a composição/)
  assert.match(guide, /não é linter CSS/)
  assert.match(readme, /Política de estilos/)
})
