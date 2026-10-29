import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { checkAnalysisApproval } from './check-analysis.mjs'

const template = readFileSync(new URL('../docs/analises/TEMPLATE.md', import.meta.url), 'utf8')
const approved = template
  .replace('slug: exemplo-funcionalidade', 'slug: gestao-usuarios')
  .replace('status: rascunho', 'status: aprovada')
  .replace('origem: caminho-a-definir', 'origem: ../sistema-legado')
  .replace('aprovado_por: pendente', 'aprovado_por: solicitante')
  .replace('aprovado_em: pendente', 'aprovado_em: 2026-10-29')
  .replace('aprovacao_referencia: pendente', 'aprovacao_referencia: aprovacao-explicita-na-conversa')

function fixture(t, content = approved) {
  const root = mkdtempSync(join(tmpdir(), 'feature-analysis-'))
  const folder = join(root, 'docs', 'analises')
  mkdirSync(folder, { recursive: true })
  writeFileSync(join(folder, 'gestao-usuarios.md'), content)
  t.after(() => rmSync(root, { recursive: true, force: true }))
  return root
}

test('aprovação declarada válida retorna referência, nunca alegando comprovar consentimento', t => {
  const result = checkAnalysisApproval('gestao-usuarios', fixture(t))
  assert.equal(result.status, 'aprovada')
  assert.equal(result.referencia, 'aprovacao-explicita-na-conversa')
})
test('bloqueia rascunho e aprovação ausente', t => {
  const root = fixture(t, template.replace('slug: exemplo-funcionalidade', 'slug: gestao-usuarios'))
  assert.throws(() => checkAnalysisApproval('gestao-usuarios', root), /não aprovada/)
})
test('bloqueia metadados pendentes, datas inválidas e slug divergente', t => {
  const root = fixture(t)
  const file = join(root, 'docs/analises/gestao-usuarios.md')
  writeFileSync(file, approved.replace('aprovacao_referencia: aprovacao-explicita-na-conversa', 'aprovacao_referencia: pendente'))
  assert.throws(() => checkAnalysisApproval('gestao-usuarios', root), /pendente/)
  writeFileSync(file, approved.replace('2026-10-29', '2026-02-30'))
  assert.throws(() => checkAnalysisApproval('gestao-usuarios', root), /Data de aprovação inválida/)
  writeFileSync(file, approved.replace('slug: gestao-usuarios', 'slug: outra-funcionalidade'))
  assert.throws(() => checkAnalysisApproval('gestao-usuarios', root), /Slug diverge/)
})
test('bloqueia caminho malicioso, relatório incompleto e symlink', t => {
  const root = fixture(t)
  assert.throws(() => checkAnalysisApproval('../gestao-usuarios', root), /Slug inválido/)
  assert.throws(() => checkAnalysisApproval('gestao/usuarios', root), /Slug inválido/)
  const path = join(root, 'docs/analises/gestao-usuarios.md')
  writeFileSync(path, approved.replace('## Permissões\n', '## Segredo\n'))
  assert.throws(() => checkAnalysisApproval('gestao-usuarios', root), /Seção obrigatória/)
  const link = join(root, 'docs/analises/indireto.md')
  symlinkSync(path, link)
  assert.throws(() => checkAnalysisApproval('indireto', root), /não é arquivo regular/)
})
