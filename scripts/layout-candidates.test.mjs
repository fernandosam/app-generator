import test from 'node:test'
import assert from 'node:assert/strict'
import { chooseCandidate } from './layout-candidates.mjs'
const report = (label, criticalCount, majorCount, score, complete = true) => ({
  label,
  criticalCount,
  majorCount,
  score,
  complete,
})
test('prefere menos problemas críticos à pontuação', () => {
  assert.equal(chooseCandidate([report('A', 1, 0, 99), report('B', 0, 1, 70)]).winner, 'B')
})
test('não decide com dados incompletos', () => {
  assert.equal(chooseCandidate([report('A', 0, 0, 90, false), report('B', 0, 0, 91)]).winner, null)
})
test('empate demanda avaliação visual', () => {
  const result = chooseCandidate([report('A', 0, 0, 90), report('B', 0, 0, 90)])
  assert.equal(result.winner, null)
  assert.equal(result.visualInspectionRequired, true)
})
test('preferência por menos falhas graves precede nota', () => {
  assert.equal(chooseCandidate([report('A', 0, 2, 98), report('B', 0, 0, 80)]).winner, 'B')
})
