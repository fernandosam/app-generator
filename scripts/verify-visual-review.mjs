import { existsSync, readFileSync } from 'node:fs'
import { validateVisualReview } from './visual-review-contract.mjs'

try {
  const reportPath = 'artifacts/layout-report.json'
  const reviewPath = 'artifacts/layout-visual-review.json'
  if (!existsSync(reportPath) || !existsSync(reviewPath)) {
    throw new Error(
      'Execute layout:audit e produza artifacts/layout-visual-review.json com seu harness',
    )
  }
  const report = JSON.parse(readFileSync(reportPath, 'utf8'))
  const review = JSON.parse(readFileSync(reviewPath, 'utf8'))
  const result = validateVisualReview(report, review)
  console.log(JSON.stringify(result, null, 2))
  if (result.status === 'inconclusive') process.exitCode = 2
} catch (error) {
  console.error('Revisão inválida: ' + error.message)
  process.exitCode = 1
}
