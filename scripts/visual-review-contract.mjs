import { createHash } from 'node:crypto'
import { readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

const PATTERN = /^artifacts\/screenshots\/[a-z0-9][a-z0-9_-]*\.png$/
const severities = new Set(['minor', 'major', 'critical'])
const text = (value) => typeof value === 'string' && value.trim().length > 0
const requireValid = (condition, message) => {
  if (!condition) throw new Error(message)
}

export function validateVisualReview(report, review, options = {}) {
  const readImage =
    options.readImage ||
    ((path) => {
      const file = resolve(options.root || process.cwd(), path)
      const stats = statSync(file)
      requireValid(
        stats.isFile() && stats.size <= 20_000_000,
        'Arquivo inválido ou maior que 20 MB: ' + path,
      )
      return readFileSync(file)
    })
  requireValid(report?.kind === 'contextual-mechanical-audit', 'Relatório mecânico inválido')
  requireValid(report.complete === true && text(report.runId), 'Auditoria incompleta ou sem runId')
  requireValid(Array.isArray(report.screenshots) && report.screenshots.length > 0, 'Sem capturas')
  const paths = report.screenshots
  requireValid(
    paths.every((path) => typeof path === 'string' && PATTERN.test(path)),
    'Caminho de captura inválido',
  )
  requireValid(new Set(paths).size === paths.length, 'Capturas duplicadas no relatório')
  requireValid(review?.kind === 'external-visual-review', 'Tipo de revisão visual inválido')
  requireValid(review.runId === report.runId, 'Revisão de outra execução (runId divergente)')
  requireValid(text(review.reviewer) && text(review.summary), 'Revisor e resumo são obrigatórios')
  requireValid(
    Array.isArray(review.screenshots) && review.screenshots.length === paths.length,
    'Cobertura visual incompleta ou excedente',
  )
  requireValid(Array.isArray(review.findings), 'Achados inválidos')

  const seen = new Set()
  for (const entry of review.screenshots) {
    requireValid(
      entry &&
        typeof entry.path === 'string' &&
        paths.includes(entry.path) &&
        !seen.has(entry.path),
      'Captura não declarada ou duplicada',
    )
    requireValid(
      typeof entry.sha256 === 'string' && /^[a-f0-9]{64}$/.test(entry.sha256),
      'SHA-256 inválido',
    )
    seen.add(entry.path)
    const image = readImage(entry.path)
    requireValid(
      Buffer.isBuffer(image) &&
        image.length >= 8 &&
        image.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
      'Arquivo não é PNG: ' + entry.path,
    )
    requireValid(
      createHash('sha256').update(image).digest('hex') === entry.sha256,
      'Captura alterada ou hash divergente: ' + entry.path,
    )
  }
  for (const finding of review.findings) {
    requireValid(finding && paths.includes(finding.screenshot), 'Achado sem screenshot válida')
    requireValid(
      severities.has(finding.severity) && text(finding.evidence) && text(finding.recommendation),
      'Achado visual malformado',
    )
  }
  requireValid(typeof review.inspected === 'boolean', 'inspected deve ser booleano')
  if (!review.inspected) {
    requireValid(review.findings.length === 0, 'Revisão não inspecionada não pode conter achados')
    return { status: 'inconclusive', reason: 'Capturas vinculadas; inspeção visual não declarada' }
  }
  return {
    status: 'reported',
    runId: report.runId,
    screenshots: paths.length,
    findings: review.findings.length,
    disclaimer:
      'Integridade verificada; inspeção é declaração externa, não certificação de qualidade visual.',
  }
}
