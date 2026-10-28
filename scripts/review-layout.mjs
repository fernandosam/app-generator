import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'

if (!existsSync('artifacts/layout-report.json')) {
  console.error('Primeiro execute npm run layout:audit para gerar imagens e medições.')
  process.exit(1)
}
const report = JSON.parse(readFileSync('artifacts/layout-report.json', 'utf8'))
const images = report.screenshots.filter(existsSync)
if (images.length === 0) {
  console.error('Nenhuma captura para revisar.')
  process.exit(1)
}
const version = spawnSync('codex', ['--version'], { stdio: 'ignore', shell: process.platform === 'win32' })
if (version.error || version.status !== 0) {
  console.error('O Codex CLI é necessário para revisão visual por IA. Sem ele há somente avaliação mecânica.')
  process.exit(1)
}
const prompt = `Você é um revisor visual de layouts TanStack Start + coss UI. Use as skills impeccable e layout (incluindo o protocolo de contexto), caso instaladas. Tente abrir de fato cada imagem listada. Nunca conclua que uma imagem foi vista apenas porque o caminho existe. Se não puder VISUALIZAR as imagens no seu ambiente, escreva inspected=false e findings=[]; explique a limitação.\n\nExamine hierarquia, agrupamento, densidade, ritmo, responsividade e coerência estética. Relate somente problemas específicos que consiga apontar nas imagens; não penalize estilos diferentes por preferência. Crie o arquivo artifacts/layout-visual-review.json com JSON ESTRITAMENTE válido no formato {"inspected":boolean,"summary":string,"findings":[{"screen":string,"viewport":string,"severity":"minor"|"major"|"critical","evidence":string,"recommendation":string}]}. Nenhuma outra alteração no código agora.\n\nCapturas: ${JSON.stringify(images)}\nRelatório mecânico: ${JSON.stringify(report)}`
const review = spawnSync('codex', ['exec', '--sandbox', 'workspace-write', '-'], {
  input: prompt, stdio: ['pipe', 'inherit', 'inherit'], encoding: 'utf8', shell: process.platform === 'win32',
})
if (review.status !== 0) process.exit(review.status || 1)
if (!existsSync('artifacts/layout-visual-review.json')) {
  console.error('O agente não produziu artifacts/layout-visual-review.json; resultado não verificado.')
  process.exit(1)
}
const result = JSON.parse(readFileSync('artifacts/layout-visual-review.json', 'utf8'))
if (typeof result.inspected !== 'boolean' || !Array.isArray(result.findings)) {
  console.error('Revisão visual malformada; conferir a saída do agente.')
  process.exit(1)
}
console.log(result.inspected ? `Revisão visual reportada: ${result.findings.length} achados.` : 'O agente não conseguiu visualizar as capturas; apenas auditoria mecânica disponível.')
