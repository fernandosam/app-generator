import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { validateVisualReview } from './visual-review-contract.mjs'

const path = 'artifacts/screenshots/registration-default-mobile.png'
const png = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 0])
const sha256 = createHash('sha256').update(png).digest('hex')
const report = () => ({
  kind: 'contextual-mechanical-audit',
  complete: true,
  runId: 'run-123',
  screenshots: [path],
})
const review = () => ({
  kind: 'external-visual-review',
  runId: 'run-123',
  inspected: true,
  reviewer: 'harness externo',
  summary: 'Inspeção declarada',
  screenshots: [{ path, sha256 }],
  findings: [],
})
const opts = { readImage: () => png }

test('integridade verificada não equivale a aprovação visual', () => {
  const result = validateVisualReview(report(), review(), opts)
  assert.equal(result.status, 'reported')
  assert.match(result.disclaimer, /não certificação/)
})
test('rejeita auditoria incompleta e runId obsoleto', () => {
  assert.throws(
    () => validateVisualReview({ ...report(), complete: false }, review(), opts),
    /incompleta/,
  )
  assert.throws(() => validateVisualReview(report(), { ...review(), runId: 'old' }, opts), /runId/)
})
test('rejeita ausência, duplicação e alteração de captura', () => {
  assert.throws(
    () => validateVisualReview(report(), { ...review(), screenshots: [] }, opts),
    /Cobertura/,
  )
  assert.throws(
    () => validateVisualReview({ ...report(), screenshots: [path, path] }, review(), opts),
    /duplicadas/,
  )
  assert.throws(
    () =>
      validateVisualReview(
        report(),
        { ...review(), screenshots: [{ path, sha256: '0'.repeat(64) }] },
        opts,
      ),
    /hash divergente/,
  )
  assert.throws(
    () => validateVisualReview(report(), review(), { readImage: () => Buffer.from('não é PNG') }),
    /PNG/,
  )
})
test('aceita achados e bloqueia referências inválidas', () => {
  const finding = {
    screenshot: path,
    severity: 'major',
    evidence: 'Texto ilegível',
    recommendation: 'Aumentar contraste',
  }
  assert.equal(
    validateVisualReview(report(), { ...review(), findings: [finding] }, opts).findings,
    1,
  )
  assert.throws(
    () =>
      validateVisualReview(
        report(),
        { ...review(), findings: [{ ...finding, screenshot: 'artifacts/screenshots/other.png' }] },
        opts,
      ),
    /screenshot/,
  )
  assert.throws(
    () =>
      validateVisualReview(
        report(),
        { ...review(), findings: [{ ...finding, severity: 'unknown' }] },
        opts,
      ),
    /malformado/,
  )
})
test('inspected=false é inconclusivo', () => {
  assert.equal(
    validateVisualReview(report(), { ...review(), inspected: false }, opts).status,
    'inconclusive',
  )
  assert.throws(
    () =>
      validateVisualReview(
        report(),
        {
          ...review(),
          inspected: false,
          findings: [{ screenshot: path, severity: 'minor', evidence: 'x', recommendation: 'y' }],
        },
        opts,
      ),
    /não pode/,
  )
})
