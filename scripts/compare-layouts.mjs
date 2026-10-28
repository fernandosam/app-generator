import { readFileSync } from 'node:fs'
import { chooseCandidate } from './layout-candidates.mjs'

const paths = process.argv.slice(2)
if (paths.length !== 2) { console.error('Uso: npm run layout:compare -- caminho/alternativa-a.json caminho/alternativa-b.json'); process.exit(2) }
const candidates = paths.map((path, i) => ({ label: i === 0 ? 'A' : 'B', ...JSON.parse(readFileSync(path, 'utf8')) }))
const decision = chooseCandidate(candidates)
console.log(JSON.stringify(decision, null, 2))
if (!decision.winner) process.exitCode = 1
